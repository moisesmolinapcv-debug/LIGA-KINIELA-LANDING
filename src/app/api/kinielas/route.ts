// GET /api/kinielas
// Proxy servidor del endpoint oficial (no emite CORS) + normalización + capa manual.
// Si el origen falla devuelve el último dato bueno en memoria con stale:true.

import { NextResponse } from 'next/server';
import { normalizePools } from '@/lib/kinielas/normalize';
import { applyManual, EMPTY_MANUAL, supabaseManualSource } from '@/lib/kinielas/manual';
import type { ManualData } from '@/lib/kinielas/manual';
import { getKinielaStatus } from '@/lib/kinielas/time';
import type { Kiniela, KinielasErrorResponse, KinielasResponse } from '@/types/kinielas';

export const runtime = 'nodejs';
// La caché se maneja aquí (memoria) y en el CDN (Cache-Control); no en la caché de fetch de Next.
export const dynamic = 'force-dynamic';

const SOURCE_URL = 'https://ligakiniela.com/get-active-kinielas';
const FETCH_TIMEOUT_MS = 8_000;
const BASE_TTL_MS = 60_000;
const MANUAL_TTL_MS = 20_000;

// Estado de módulo: vive mientras la instancia serverless esté caliente.
let lastGood: { kinielas: Kiniela[]; fetchedAt: number } | null = null;
let manualCache: { data: ManualData; at: number } | null = null;

async function fetchBase(now: Date): Promise<{ kinielas: Kiniela[]; fetchedAt: number }> {
  if (lastGood && now.getTime() - lastGood.fetchedAt < BASE_TTL_MS) return lastGood;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SOURCE_URL, {
      cache: 'no-store',
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Origen respondió ${res.status}`);
    const kinielas = normalizePools(await res.json(), now);
    lastGood = { kinielas, fetchedAt: now.getTime() };
    return lastGood;
  } finally {
    clearTimeout(timer);
  }
}

async function loadManual(now: Date): Promise<ManualData> {
  if (manualCache && now.getTime() - manualCache.at < MANUAL_TTL_MS) return manualCache.data;
  try {
    const data = await supabaseManualSource.load();
    manualCache = { data, at: now.getTime() };
    return data;
  } catch {
    return manualCache?.data ?? EMPTY_MANUAL;
  }
}

export async function GET() {
  const now = new Date();
  let base: { kinielas: Kiniela[]; fetchedAt: number };
  let stale = false;

  try {
    base = await fetchBase(now);
  } catch (e) {
    if (!lastGood) {
      const body: KinielasErrorResponse = {
        error: 'upstream_unavailable',
        message: 'No se pudo obtener las Kinielas del origen y aún no hay datos guardados.',
      };
      console.warn('[Kinielas] Origen caído sin respaldo:', e instanceof Error ? e.message : e);
      return NextResponse.json(body, { status: 502, headers: { 'Cache-Control': 'no-store' } });
    }
    base = lastGood;
    stale = true;
  }

  const manual = await loadManual(now);
  // El estado se recalcula con la hora actual aunque el dato base venga de memoria.
  const kinielas = applyManual(base.kinielas, manual).map((k) => ({
    ...k,
    status: getKinielaStatus(k.salesStart, k.closesAt, now),
  }));

  const body: KinielasResponse = {
    kinielas,
    fetchedAt: new Date(base.fetchedAt).toISOString(),
    source: stale ? 'stale' : 'live',
    stale,
  };
  return NextResponse.json(body, {
    headers: {
      'Cache-Control': stale
        ? 'public, s-maxage=10, stale-while-revalidate=30'
        : 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

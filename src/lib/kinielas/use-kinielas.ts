'use client';

// Hook stale-while-revalidate: pinta al instante lo guardado en localStorage y
// refresca en segundo plano (cada 60 s y al volver a la pestaña).
// Nota: `status` de cada Kiniela es el del momento de la respuesta; para la UI en vivo
// recalcularlo con getKinielaStatus(k.salesStart, k.closesAt, now) de ./time.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KinielasResponse } from '../../types/kinielas';
import { fetchKinielas } from './client';

const CACHE_KEY = 'liga_kiniela_kinielas_v1';
const REFRESH_MS = 60_000;

function readCache(): KinielasResponse | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as KinielasResponse;
    return parsed && Array.isArray(parsed.kinielas) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(data: KinielasResponse) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

export function useKinielas() {
  const [data, setData] = useState<KinielasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const inFlight = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    inFlight.current?.abort();
    const ctrl = new AbortController();
    inFlight.current = ctrl;
    try {
      const fresh = await fetchKinielas(ctrl.signal);
      if (ctrl.signal.aborted) return;
      setData(fresh);
      setFromCache(false);
      setError(null);
      writeCache(fresh);
    } catch (e) {
      if (ctrl.signal.aborted) return;
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Lectura del caché tras montar para no desajustar la hidratación.
    const cached = readCache();
    if (cached) {
      setData(cached);
      setFromCache(true);
      setLoading(false);
    }
    refresh();

    const timer = window.setInterval(refresh, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      inFlight.current?.abort();
    };
  }, [refresh]);

  return {
    data,
    kinielas: data?.kinielas ?? [],
    loading,
    error,
    /** true si el dato es viejo: respaldo del servidor, refresco fallido o caché local sin confirmar. */
    stale: Boolean(data?.stale) || (data !== null && (error !== null || fromCache)),
    refresh,
  };
}

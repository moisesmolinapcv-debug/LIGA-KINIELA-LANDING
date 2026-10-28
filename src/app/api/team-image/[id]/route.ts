// GET /api/team-image/{id}
// Proxy mínimo del escudo oficial (ligakiniela.com/team/{id}/image). El origen no emite CORS,
// así que el navegador no puede leerlo en un canvas (tarjeta para compartir) sin "ensuciarlo".
// Solo acepta ids numéricos y solo consulta ese host: no es un proxy abierto.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ORIGIN = 'https://ligakiniela.com/team';
const TIMEOUT_MS = 6_000;
const MAX_BYTES = 1_500_000;

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!/^\d{1,9}$/.test(params.id)) {
    return new NextResponse('Not found', { status: 404 });
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${ORIGIN}/${params.id}/image`, { signal: ctrl.signal, cache: 'no-store' });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !type.startsWith('image/')) return new NextResponse('Not found', { status: 404 });
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) return new NextResponse('Too large', { status: 413 });
    return new NextResponse(buf, {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return new NextResponse('Unavailable', { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}

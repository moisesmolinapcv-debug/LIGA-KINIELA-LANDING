// Cliente del navegador para /api/kinielas.

import type { KinielasResponse } from '../../types/kinielas';

export async function fetchKinielas(signal?: AbortSignal): Promise<KinielasResponse> {
  const res = await fetch('/api/kinielas', { cache: 'no-store', signal });
  if (!res.ok) throw new Error(`No se pudieron cargar las Kinielas (${res.status})`);
  const data: unknown = await res.json();
  if (!data || typeof data !== 'object' || !Array.isArray((data as KinielasResponse).kinielas)) {
    throw new Error('Respuesta de Kinielas con formato inesperado');
  }
  return data as KinielasResponse;
}

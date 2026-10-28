'use client';

// Datos del panel para las pestañas "Kiniela activa" y "Partidos":
// - Las Kinielas vienen de /api/kinielas (endpoint oficial + capa manual, con su caché).
// - Los datos manuales se leen aparte, directo de Supabase, para ver al instante lo que se acaba de guardar.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Kiniela, KinielaStatus, KinielasResponse } from '../../types/kinielas';
import { fetchKinielas } from '../../lib/kinielas/client';
import { loadManualRaw, type ManualRaw } from '../../lib/kinielas/admin-write';

export type Notify = (type: 'success' | 'error' | 'info', title: string, message?: string) => void;

export const STATUS_TEXT: Record<KinielaStatus, string> = {
  proxima: 'Próxima',
  abierta: 'Venta abierta',
  cerrada: 'Venta cerrada',
};

const EMPTY_MANUAL: ManualRaw = { meta: [], overrides: [], error: null };

export interface AdminKinielas {
  data: KinielasResponse | null;
  kinielas: Kiniela[];
  selected: Kiniela | null;
  selectedId: number | null;
  setSelectedId: (id: number) => void;
  manual: ManualRaw;
  loading: boolean;
  /** Mensaje en lenguaje sencillo si no se pudo leer el servidor oficial. */
  error: string | null;
  refresh: () => Promise<void>;
  reloadManual: () => Promise<void>;
}

function pickDefault(list: Kiniela[]): number | null {
  if (list.length === 0) return null;
  return (list.find((k) => k.status === 'abierta') ?? list.find((k) => k.status === 'proxima') ?? list[0]).id;
}

export function useAdminKinielas(): AdminKinielas {
  const [data, setData] = useState<KinielasResponse | null>(null);
  const [manual, setManual] = useState<ManualRaw>(EMPTY_MANUAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedIdState] = useState<number | null>(null);
  const alive = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [kin, man] = await Promise.allSettled([fetchKinielas(), loadManualRaw()]);
    if (!alive.current) return;
    if (man.status === 'fulfilled') setManual(man.value);
    if (kin.status === 'fulfilled') {
      setData(kin.value);
      setError(null);
      setSelectedIdState((cur) =>
        cur !== null && kin.value.kinielas.some((k) => k.id === cur) ? cur : pickDefault(kin.value.kinielas)
      );
    } else {
      setError('No se pudo leer la Kiniela del servidor oficial. Revisa tu conexión e inténtalo de nuevo.');
    }
    setLoading(false);
  }, []);

  const reloadManual = useCallback(async () => {
    const man = await loadManualRaw();
    if (alive.current) setManual(man);
  }, []);

  useEffect(() => {
    alive.current = true;
    refresh();
    return () => {
      alive.current = false;
    };
  }, [refresh]);

  const kinielas = data?.kinielas ?? [];
  const selected = kinielas.find((k) => k.id === selectedId) ?? null;

  return {
    data,
    kinielas,
    selected,
    selectedId,
    setSelectedId: setSelectedIdState,
    manual,
    loading,
    error,
    refresh,
    reloadManual,
  };
}

'use client';

// Estado compartido de las Kinielas: una sola llamada a useKinielas() para toda la página.
// Hero y Boleto leen la misma Kiniela seleccionada. El valor del contexto solo cambia cuando
// cambian los datos, la selección o el estado (próxima/abierta/cerrada) de alguna Kiniela:
// no se vuelve a renderizar cada segundo.

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Kiniela, KinielasResponse, KinielaStatus } from '../../types/kinielas';
import { useKinielas } from '../../lib/kinielas/use-kinielas';
import { getKinielaStatus } from '../../lib/kinielas/time';
import { useNow } from './hooks';

interface KinielasContextValue {
  data: KinielasResponse | null;
  kinielas: Kiniela[];
  selected: Kiniela | undefined;
  setSelected: (id: number) => void;
  /** Estado en vivo (recalculado con la hora actual). Antes de montar, el del servidor. */
  statusOf: (k: Kiniela) => KinielaStatus;
  loading: boolean;
  error: string | null;
  stale: boolean;
  refresh: () => Promise<void>;
}

const KinielasContext = createContext<KinielasContextValue | null>(null);

/** Elige la Kiniela inicial: la primera abierta, si no la primera próxima, si no la primera. */
function pickDefault(list: Kiniela[], statuses: Record<number, KinielaStatus>): Kiniela | undefined {
  return (
    list.find((k) => statuses[k.id] === 'abierta') ??
    list.find((k) => statuses[k.id] === 'proxima') ??
    list[0]
  );
}

export function KinielasProvider({ children }: { children: React.ReactNode }) {
  const { data, kinielas, loading, error, refresh } = useKinielas();
  const now = useNow(1000);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // La clave de estados cambia solo cuando alguna Kiniela cambia de estado.
  const statusKey = kinielas
    .map((k) => `${k.id}:${now ? getKinielaStatus(k.salesStart, k.closesAt, now) : k.status}`)
    .join('|');
  const statuses = useMemo(() => {
    const out: Record<number, KinielaStatus> = {};
    for (const part of statusKey.split('|')) {
      if (!part) continue;
      const [id, st] = part.split(':');
      out[Number(id)] = st as KinielaStatus;
    }
    return out;
  }, [statusKey]);

  const selected = useMemo(
    () => kinielas.find((k) => k.id === selectedId) ?? pickDefault(kinielas, statuses),
    [kinielas, selectedId, statuses],
  );

  // "Desactualizado" de verdad: respaldo del servidor o refresco fallido. El caché local
  // mientras llega el dato fresco (carga normal) no cuenta.
  const isStale = Boolean(data?.stale) || (data !== null && error !== null);

  const value = useMemo<KinielasContextValue>(
    () => ({
      data,
      kinielas,
      selected,
      setSelected: setSelectedId,
      statusOf: (k) => statuses[k.id] ?? k.status,
      loading,
      error,
      stale: isStale,
      refresh,
    }),
    [data, kinielas, selected, statuses, loading, error, isStale, refresh],
  );

  return <KinielasContext.Provider value={value}>{children}</KinielasContext.Provider>;
}

export function useKinielasContext(): KinielasContextValue {
  const ctx = useContext(KinielasContext);
  if (!ctx) throw new Error('useKinielasContext debe usarse dentro de <KinielasProvider>');
  return ctx;
}

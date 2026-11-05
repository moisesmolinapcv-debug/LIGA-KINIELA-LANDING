'use client';

// Estado compartido de las Kinielas: una sola llamada a useKinielas() para toda la página.
// Hero y Boleto leen la misma Kiniela seleccionada. El valor del contexto solo cambia cuando
// cambian los datos, la selección o el estado (próxima/abierta/cerrada) de alguna Kiniela:
// no se vuelve a renderizar cada segundo.

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Kiniela, KinielasResponse, KinielaStatus } from '../../types/kinielas';
import { useKinielas } from '../../lib/kinielas/use-kinielas';
import { getKinielaStatus } from '../../lib/kinielas/time';
import { ordenarPorProximidad } from '../../lib/kinielas/order';
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

export function KinielasProvider({ children }: { children: React.ReactNode }) {
  const { data, kinielas: kinielasCrudas, loading, error, refresh } = useKinielas();
  const now = useNow(1000);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // La clave de estados cambia solo cuando alguna Kiniela cambia de estado.
  const statusKey = kinielasCrudas
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

  // Orden de las opciones: la más próxima a jugarse primero (y es la que se muestra por defecto).
  // Se reordena sola cuando una Kiniela empieza y deja de ser la próxima.
  const kinielas = useMemo(
    () => ordenarPorProximidad(kinielasCrudas, (k) => statuses[k.id] ?? k.status),
    [kinielasCrudas, statuses],
  );

  const selected = useMemo(
    () => kinielas.find((k) => k.id === selectedId) ?? kinielas[0],
    [kinielas, selectedId],
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

'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import type { AdminKinielas } from './useAdminKinielas';
import { STATUS_TEXT } from './useAdminKinielas';
import { BTN_GHOST, INPUT, LABEL, SPINNER } from './ui';

/** Hace "hace X" a partir de un ISO. */
function ago(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return 'hace un momento';
  const min = Math.round(ms / 60000);
  if (min < 1) return 'hace menos de 1 minuto';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  return `hace ${h} h`;
}

/**
 * Cabecera común de las pestañas que trabajan con una Kiniela: selector (si hay varias),
 * avisos de conexión y botón de actualizar.
 */
export const KinielaPicker: React.FC<{ admin: AdminKinielas }> = ({ admin }) => {
  const { kinielas, selectedId, setSelectedId, loading, error, data, refresh } = admin;

  return (
    <div className="space-y-3">
      {/* Servidor oficial caído */}
      {error && (
        <div role="alert" className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-100">
          <AlertTriangle className="w-5 h-5 text-rose-300 shrink-0" aria-hidden="true" />
          <div className="flex-1 text-sm leading-snug">
            <p className="font-bold">El servidor oficial no responde</p>
            <p className="text-rose-200">
              {error}
              {data ? ' Abajo se muestran los últimos datos que se pudieron leer.' : ''}
            </p>
          </div>
          <button type="button" onClick={refresh} disabled={loading} className={BTN_GHOST}>
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )}

      {/* Datos guardados de respaldo (el servidor de la web ya venía usando su copia) */}
      {!error && data?.stale && (
        <div role="status" className="flex items-start gap-3 p-4 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-100 text-sm leading-snug">
          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            El servidor oficial no respondió y se muestran los últimos datos guardados ({ago(data.fetchedAt)}). Puede que
            falte algún cambio reciente.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1 min-w-0">
          <label htmlFor="admin-kiniela-select" className={LABEL}>
            Kiniela {kinielas.length > 1 ? `(${kinielas.length} activas)` : ''}
          </label>
          {kinielas.length === 0 ? (
            <div className={`${INPUT} flex items-center text-slate-300`}>
              {loading ? 'Buscando Kinielas en el servidor oficial...' : 'No hay Kinielas activas en este momento.'}
            </div>
          ) : (
            <select
              id="admin-kiniela-select"
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className={INPUT}
            >
              {kinielas.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} · {STATUS_TEXT[k.status]}
                </option>
              ))}
            </select>
          )}
        </div>
        <button type="button" onClick={refresh} disabled={loading} className={BTN_GHOST}>
          {loading ? <span className={SPINNER} aria-hidden="true" /> : <RefreshCw className="w-4 h-4" aria-hidden="true" />}
          Actualizar
        </button>
      </div>
    </div>
  );
};

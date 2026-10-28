'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { MessageSquareText, Copy, CheckCheck, Trash2, TriangleAlert, RefreshCw, Database, MonitorSmartphone } from 'lucide-react';
import { deleteStoredCopys, loadStoredCopys, type StoredCopys } from '../../lib/kiniela-store';
import { ConfirmDialog } from './ModalShell';
import { BTN_DANGER, BTN_GHOST, CARD, HELP, SPINNER } from './ui';

interface CopysTabProps {
  notify: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

/** Nombres sencillos de cada texto antiguo (las claves vienen de la tabla de textos). */
const LABELS: Record<string, string> = {
  hero_title: 'Cabecera: título principal',
  hero_subtitle: 'Cabecera: subtítulo',
  hero_badge_tag: 'Cabecera: etiqueta superior',
  hero_countdown_label: 'Cabecera: texto del contador',
  hero_prize_title: 'Cabecera: título de la tarjeta de premio',
  hero_prize_desc: 'Cabecera: descripción de la tarjeta de premio',
  hero_ticket_title: 'Cabecera: título de la tarjeta del ticket',
  hero_ticket_desc: 'Cabecera: descripción de la tarjeta del ticket',
  matches_badge: 'Partidos: etiqueta superior',
  matches_title: 'Partidos: título',
  matches_subtitle: 'Partidos: subtítulo',
  winners_badge: 'Campeones: etiqueta superior',
  winners_title: 'Campeones: título',
  winners_subtitle: 'Campeones: subtítulo',
  rules_badge: 'Reglas: etiqueta superior',
  rules_title: 'Reglas: título',
  rules_subtitle: 'Reglas: subtítulo',
  allies_badge: 'Aliados: etiqueta superior',
  allies_title: 'Aliados: título',
  allies_subtitle: 'Aliados: subtítulo',
};

const labelOf = (key: string): string => LABELS[key] ?? key.replace(/_/g, ' ');
const sortKeys = (obj: Record<string, string>): string[] => {
  const order = Object.keys(LABELS);
  return Object.keys(obj).sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b);
  });
};

const CopyList: React.FC<{ values: Record<string, string> }> = ({ values }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  return (
    <ul className="space-y-3">
      {sortKeys(values).map((key) => (
        <li key={key} className="p-3 rounded-xl bg-[#00063E]/70 border border-[#1a2785]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">{labelOf(key)}</p>
              <p className="mt-1 text-sm text-white whitespace-pre-wrap break-words">{values[key]}</p>
            </div>
            <button
              type="button"
              onClick={() => copy(key, values[key])}
              aria-label={`Copiar el texto: ${labelOf(key)}`}
              className={`${BTN_GHOST} shrink-0`}
            >
              {copiedKey === key ? <CheckCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              <span>{copiedKey === key ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

/**
 * Visor de los textos antiguos guardados (tabla site_copys y cambios hechos en este navegador).
 * La web ya no los usa: sus textos viven en el código. Solo se pueden revisar, copiar y borrar.
 */
export const CopysTab: React.FC<CopysTabProps> = ({ notify }) => {
  const [stored, setStored] = useState<StoredCopys | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [allCopied, setAllCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setStored(await loadStoredCopys());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const dbCount = stored ? Object.keys(stored.database.values).length : 0;
  const browserCount = stored ? Object.keys(stored.browser).length : 0;
  const hasAnything = dbCount + browserCount > 0;

  const copyAll = async () => {
    if (!stored) return;
    const parts: string[] = [];
    const add = (title: string, values: Record<string, string>) => {
      if (Object.keys(values).length === 0) return;
      parts.push(`== ${title} ==`);
      for (const key of sortKeys(values)) parts.push(`${labelOf(key)}:\n${values[key]}\n`);
    };
    add('Guardados en la base de datos', stored.database.values);
    add('Guardados solo en este navegador', stored.browser);
    try {
      await navigator.clipboard.writeText(parts.join('\n'));
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2500);
    } catch {
      notify('error', 'No se pudo copiar', 'Tu navegador no permitió copiar. Copia cada texto por separado.');
    }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await deleteStoredCopys();
      notify('success', 'Textos borrados', 'Se borraron los textos guardados. La web no cambia: ya no los usaba.');
      setConfirmDelete(false);
      await load();
    } catch (err) {
      notify('error', 'No se pudieron borrar', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#1a2785]">
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-rockwell">
          <MessageSquareText className="w-6 h-6 text-kiniela-gold" aria-hidden="true" />
          <span>Textos guardados (antiguos)</span>
        </h2>
        <p className="text-sm text-slate-200 mt-1 max-w-3xl">Aquí puedes revisar los textos que se guardaron antes en la base de datos.</p>
      </div>

      <div role="note" className="flex gap-3 p-4 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-100">
        <TriangleAlert className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm leading-snug">
          <p className="font-bold">Estos textos ya no se usan en la web</p>
          <p>
            Los textos de la página ahora vienen del propio diseño de la web, así que editarlos aquí no cambiaría nada. Esta
            pestaña es solo para revisarlos, copiar lo que te sirva y, si quieres, borrar lo guardado.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={load} disabled={loading} className={BTN_GHOST}>
          {loading ? <span className={SPINNER} aria-hidden="true" /> : <RefreshCw className="w-4 h-4" aria-hidden="true" />}
          Actualizar
        </button>
        {hasAnything && (
          <>
            <button type="button" onClick={copyAll} className={BTN_GHOST}>
              {allCopied ? <CheckCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              {allCopied ? 'Todo copiado' : 'Copiar todos los textos'}
            </button>
            <button type="button" onClick={() => setConfirmDelete(true)} className={BTN_DANGER}>
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Borrar textos guardados
            </button>
          </>
        )}
      </div>

      {loading && !stored ? (
        <p role="status" className="text-sm text-slate-200">Buscando textos guardados...</p>
      ) : stored ? (
        <>
          {/* Base de datos */}
          <section className={`${CARD} space-y-3`} aria-labelledby="copys-db">
            <h3 id="copys-db" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1a2785] pb-2">
              <Database className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              Guardados en la base de datos
            </h3>
            {stored.database.status === 'missing' && (
              <p className="text-sm text-slate-200">
                No hay textos guardados en la base de datos: la tabla de textos no existe, así que no hay nada que revisar ni borrar allí.
              </p>
            )}
            {stored.database.status === 'error' && (
              <p role="alert" className="text-sm text-rose-200">
                No se pudo leer la tabla de textos. {stored.database.message ? `(${stored.database.message})` : ''} Inténtalo de nuevo con &quot;Actualizar&quot;.
              </p>
            )}
            {stored.database.status === 'ok' && dbCount === 0 && (
              <p className="text-sm text-slate-200">La tabla de textos está vacía.</p>
            )}
            {dbCount > 0 && <CopyList values={stored.database.values} />}
          </section>

          {/* Navegador */}
          <section className={`${CARD} space-y-3`} aria-labelledby="copys-browser">
            <h3 id="copys-browser" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1a2785] pb-2">
              <MonitorSmartphone className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              Guardados solo en este navegador
            </h3>
            {browserCount === 0 ? (
              <p className="text-sm text-slate-200">No hay textos modificados en este navegador.</p>
            ) : (
              <>
                <p className={HELP}>Cambios hechos desde este dispositivo con el editor antiguo; no están en la base de datos.</p>
                <CopyList values={stored.browser} />
              </>
            )}
          </section>
        </>
      ) : null}

      <ConfirmDialog
        open={confirmDelete}
        title="¿Borrar los textos guardados?"
        message="Se borrarán los textos antiguos de la base de datos (si existen) y los cambios guardados en este navegador. La web no cambia, porque ya no los usa. Copia antes lo que quieras conservar."
        confirmLabel="Sí, borrar"
        busy={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

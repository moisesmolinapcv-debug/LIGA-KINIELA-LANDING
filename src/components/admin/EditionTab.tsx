'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Trophy, Sparkles, Ticket, Clock, PencilLine, Undo2, Save, Info, ChevronDown, ListChecks } from 'lucide-react';
import type { Kiniela } from '../../types/kinielas';
import { formatBs } from '../../lib/kiniela-store';
import { formatDateTimeVE } from '../../lib/kinielas/time';
import { stripEmojis } from '../../lib/kinielas/normalize';
import {
  deletePoolOverride,
  savePoolOverride,
  type PoolOverrideInput,
  type PoolOverrideRecord,
} from '../../lib/kinielas/admin-write';
import type { AdminKinielas, Notify } from './useAdminKinielas';
import { STATUS_TEXT } from './useAdminKinielas';
import { KinielaPicker } from './KinielaPicker';
import { ConfirmDialog } from './ModalShell';
import { BTN_GHOST, BTN_PRIMARY, CARD, HELP, INPUT, LABEL, SPINNER } from './ui';

interface EditionTabProps {
  admin: AdminKinielas;
  notify: Notify;
}

type FieldKey = 'title' | 'prizeBs' | 'ticketPriceBs';

/** Convierte "300.000", "1.500.000,50" o "1500" a número. null = texto vacío; NaN = no válido. */
export function parseBs(text: string): number | null {
  const t = text.replace(/bs/gi, '').replace(/\s/g, '');
  if (t === '') return null;
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(t)) return Number(t.replace(/\./g, '').replace(',', '.'));
  if (/^\d+(,\d{1,2})?$/.test(t)) return Number(t.replace(',', '.'));
  if (/^\d+(\.\d{1,2})?$/.test(t)) return Number(t);
  return NaN;
}

const numToText = (n: number | null): string =>
  n === null ? '' : new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 }).format(n);

const HandChip: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-kiniela-gold/20 border border-kiniela-gold/50 text-kiniela-gold text-xs font-bold whitespace-nowrap">
    <PencilLine className="w-3 h-3" aria-hidden="true" />
    Editado a mano
  </span>
);

export const EditionTab: React.FC<EditionTabProps> = ({ admin, notify }) => {
  const { selected, manual, reloadManual, refresh } = admin;
  const poolId = selected?.id ?? null;
  const stored: PoolOverrideRecord | null = useMemo(
    () => (poolId === null ? null : manual.overrides.find((o) => o.poolId === poolId) ?? null),
    [manual.overrides, poolId]
  );

  const [title, setTitle] = useState('');
  const [prize, setPrize] = useState('');
  const [ticket, setTicket] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const [busyAll, setBusyAll] = useState(false);
  const [revertingField, setRevertingField] = useState<FieldKey | null>(null);

  // El formulario refleja lo guardado cada vez que cambia la Kiniela o la fila guardada
  // (la llave es el contenido guardado, para no borrar lo que se está escribiendo si se recarga otra cosa)
  const storedKey = JSON.stringify(stored);
  useEffect(() => {
    setTitle(stored?.title ?? '');
    setPrize(numToText(stored?.prizeBs ?? null));
    setTicket(numToText(stored?.ticketPriceBs ?? null));
    setNotes(stored?.notes ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolId, storedKey]);

  const prizeNum = parseBs(prize);
  const ticketNum = parseBs(ticket);
  const errors: Partial<Record<FieldKey | 'notes', string>> = {};
  if (title.trim().length > 80) errors.title = 'El título es muy largo (máximo 80 letras).';
  if (prizeNum !== null && (Number.isNaN(prizeNum) || prizeNum < 0 || prizeNum > 1e12)) {
    errors.prizeBs = 'Escribe solo números, por ejemplo 300.000 o 1.500.000.';
  }
  if (ticketNum !== null && (Number.isNaN(ticketNum) || ticketNum < 0 || ticketNum > 1e9)) {
    errors.ticketPriceBs = 'Escribe solo números, por ejemplo 1.000. Escribe 0 si el ticket es gratis.';
  }
  if (notes.trim().length > 300) errors.notes = 'La nota es muy larga (máximo 300 letras).';
  const hasErrors = Object.keys(errors).length > 0;

  const current: PoolOverrideInput = {
    title: title.trim() || null,
    prizeBs: prizeNum === null || Number.isNaN(prizeNum) ? null : prizeNum,
    ticketPriceBs: ticketNum === null || Number.isNaN(ticketNum) ? null : ticketNum,
    notes: notes.trim() || null,
  };
  const storedInput: PoolOverrideInput = {
    title: stored?.title ?? null,
    prizeBs: stored?.prizeBs ?? null,
    ticketPriceBs: stored?.ticketPriceBs ?? null,
    notes: stored?.notes ?? null,
  };
  const dirty = JSON.stringify(current) !== JSON.stringify(storedInput);
  const hasAnyStored = stored !== null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (poolId === null || hasErrors) return;
    setSaving(true);
    try {
      await savePoolOverride(poolId, current);
      await reloadManual();
      void refresh();
      notify('success', 'Cambios guardados', 'Pueden tardar hasta 1 minuto en verse en la web.');
    } catch (err) {
      notify('error', 'No se pudo guardar', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const revertField = async (field: FieldKey) => {
    if (poolId === null) return;
    setRevertingField(field);
    try {
      await savePoolOverride(poolId, { ...storedInput, [field]: null });
      await reloadManual();
      void refresh();
      notify('info', 'Vuelve el dato automático', 'Pueden pasar hasta 1 minuto para verlo en la web.');
    } catch (err) {
      notify('error', 'No se pudo quitar el cambio', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    } finally {
      setRevertingField(null);
    }
  };

  const revertAll = async () => {
    if (poolId === null) return;
    setBusyAll(true);
    try {
      await deletePoolOverride(poolId);
      await reloadManual();
      void refresh();
      setConfirmAll(false);
      notify('info', 'Vuelven los datos automáticos', 'Pueden pasar hasta 1 minuto para verlos en la web.');
    } catch (err) {
      notify('error', 'No se pudo quitar el cambio', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    } finally {
      setBusyAll(false);
    }
  };

  const k: Kiniela | null = selected;
  const flags = k?.overrides ?? {};
  const autoTitle = k ? stripEmojis(k.code) || k.code : '';

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#1a2785]">
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-rockwell">
          <Trophy className="w-6 h-6 text-kiniela-gold" aria-hidden="true" />
          <span>Kiniela activa</span>
        </h2>
        <p className="text-sm text-slate-200 mt-1 max-w-3xl">
          El nombre, el premio, el costo del ticket y el cierre llegan solos desde el servidor oficial. Solo si algo está
          mal puedes cambiarlo a mano más abajo; ese cambio gana sobre el dato automático.
        </p>
      </div>

      <KinielaPicker admin={admin} />

      {k && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Lectura: lo que trae el servidor oficial */}
          <section aria-labelledby="ed-oficial" className={`${CARD} xl:col-span-2 space-y-4`}>
            <h3 id="ed-oficial" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1a2785] pb-2">
              <Info className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              Lo que muestra la web ahora
            </h3>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-bold text-slate-300 uppercase tracking-wider flex flex-wrap items-center gap-2">
                  Nombre {flags.title && <HandChip />}
                </dt>
                <dd className="font-rockwell font-black text-lg text-white">{k.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-300 uppercase tracking-wider flex flex-wrap items-center gap-2">
                  Premio total {flags.prizeBs && <HandChip />}
                </dt>
                <dd className="font-rockwell font-black text-2xl text-kiniela-gold">{formatBs(k.prizeBs)}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-300 uppercase tracking-wider flex flex-wrap items-center gap-2">
                  Costo del ticket {flags.ticketPriceBs && <HandChip />}
                </dt>
                <dd className="font-bold text-white text-lg">{k.isFree ? 'Gratis' : formatBs(k.ticketPriceBs)}</dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs font-bold text-slate-300 uppercase tracking-wider">Partidos</dt>
                  <dd className="text-white font-bold">{k.matches.length}{k.totalMatches !== k.matches.length ? ` de ${k.totalMatches}` : ''}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-slate-300 uppercase tracking-wider">Estado</dt>
                  <dd className="text-white font-bold">{STATUS_TEXT[k.status]}</dd>
                </div>
              </div>
              <div>
                <dt className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-kiniela-gold" aria-hidden="true" />
                  Ventas
                </dt>
                <dd className="text-slate-100">
                  Abren: <span className="font-bold">{formatDateTimeVE(k.salesStart) || 'sin dato'}</span>
                  <br />
                  Cierran: <span className="font-bold">{formatDateTimeVE(k.closesAt) || 'sin dato'}</span>
                  <span className="text-slate-300"> (hora de Venezuela, 1 minuto antes del cierre oficial)</span>
                </dd>
              </div>
            </dl>

            {k.warnings.length > 0 && (
              <details className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-sm text-amber-100">
                <summary className="cursor-pointer min-h-[44px] flex items-center justify-between gap-2 font-bold">
                  <span>El servidor oficial trae {k.warnings.length} aviso{k.warnings.length === 1 ? '' : 's'}</span>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </summary>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {k.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </details>
            )}

            <details className="rounded-xl border border-[#1a2785] bg-[#00063E]/60 p-3 text-sm">
              <summary className="cursor-pointer min-h-[44px] flex items-center justify-between gap-2 font-bold text-white">
                <span className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
                  Partidos de esta Kiniela ({k.matches.length})
                </span>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </summary>
              <ol className="mt-1 space-y-1 text-slate-100">
                {k.matches.map((m) => (
                  <li key={m.key}>
                    <span className="text-slate-300 font-mono text-xs mr-1.5">{m.index}.</span>
                    {m.homeTeam.name} <span className="text-slate-300">vs</span> {m.awayTeam.name}
                  </li>
                ))}
              </ol>
              <p className={`${HELP} mt-2`}>Para cargar hora, liga y resultados usa la pestaña &quot;Partidos&quot;.</p>
            </details>
          </section>

          {/* Escritura: cambios a mano */}
          <section aria-labelledby="ed-manual" className="xl:col-span-3">
            <form onSubmit={handleSave} className={`${CARD} space-y-5`} noValidate>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1a2785] pb-3">
                <div>
                  <h3 id="ed-manual" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <PencilLine className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
                    Cambiar a mano
                  </h3>
                  <p className={`${HELP} mt-1`}>
                    Deja un campo vacío para usar el dato automático. Lo que escribas aquí se verá en la web en lugar del
                    dato del servidor.
                  </p>
                </div>
                {hasAnyStored && <HandChip />}
              </div>

              {/* Nombre */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="ov-title" className={LABEL}>
                    Nombre de la Kiniela {stored?.title && <HandChip />}
                  </label>
                  {stored?.title && (
                    <button type="button" onClick={() => revertField('title')} disabled={revertingField !== null} className="min-h-[44px] px-2 text-xs font-bold text-kiniela-gold hover:underline inline-flex items-center gap-1">
                      <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Volver al dato automático
                    </button>
                  )}
                </div>
                <input
                  id="ov-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  placeholder="Automático"
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby="ov-title-help"
                  className={INPUT}
                />
                <p id="ov-title-help" className={`${HELP} mt-1`}>
                  Dato automático: <strong className="text-white">{autoTitle}</strong>
                </p>
                {errors.title && <p role="alert" className="text-xs text-rose-300 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Premio */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="ov-prize" className={`${LABEL} flex items-center gap-1.5`}>
                      <Sparkles className="w-3.5 h-3.5 text-kiniela-gold" aria-hidden="true" />
                      Premio total (Bs)
                    </label>
                    {stored?.prizeBs !== null && stored?.prizeBs !== undefined && (
                      <button type="button" onClick={() => revertField('prizeBs')} disabled={revertingField !== null} className="min-h-[44px] px-2 text-xs font-bold text-kiniela-gold hover:underline inline-flex items-center gap-1">
                        <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Volver al automático
                      </button>
                    )}
                  </div>
                  <input
                    id="ov-prize"
                    type="text"
                    inputMode="decimal"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="Automático"
                    aria-invalid={Boolean(errors.prizeBs)}
                    aria-describedby="ov-prize-help"
                    className={`${INPUT} font-mono font-bold text-kiniela-gold`}
                  />
                  <p id="ov-prize-help" className={`${HELP} mt-1`}>
                    {flags.prizeBs ? (
                      <>El dato automático se vuelve a mostrar al quitar el cambio.</>
                    ) : (
                      <>Dato automático: <strong className="text-white">{formatBs(k.prizeBs)}</strong>.</>
                    )}{' '}
                    {prize && prizeNum !== null && !Number.isNaN(prizeNum) && (
                      <>Se verá como <strong className="text-kiniela-gold">{formatBs(prizeNum)}</strong>.</>
                    )}
                  </p>
                  {errors.prizeBs && <p role="alert" className="text-xs text-rose-300 mt-1">{errors.prizeBs}</p>}
                </div>

                {/* Ticket */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor="ov-ticket" className={`${LABEL} flex items-center gap-1.5`}>
                      <Ticket className="w-3.5 h-3.5 text-kiniela-gold" aria-hidden="true" />
                      Costo del ticket (Bs)
                    </label>
                    {stored?.ticketPriceBs !== null && stored?.ticketPriceBs !== undefined && (
                      <button type="button" onClick={() => revertField('ticketPriceBs')} disabled={revertingField !== null} className="min-h-[44px] px-2 text-xs font-bold text-kiniela-gold hover:underline inline-flex items-center gap-1">
                        <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
                        Volver al automático
                      </button>
                    )}
                  </div>
                  <input
                    id="ov-ticket"
                    type="text"
                    inputMode="decimal"
                    value={ticket}
                    onChange={(e) => setTicket(e.target.value)}
                    placeholder="Automático"
                    aria-invalid={Boolean(errors.ticketPriceBs)}
                    aria-describedby="ov-ticket-help"
                    className={`${INPUT} font-mono font-bold`}
                  />
                  <p id="ov-ticket-help" className={`${HELP} mt-1`}>
                    {flags.ticketPriceBs ? (
                      <>El dato automático se vuelve a mostrar al quitar el cambio.</>
                    ) : (
                      <>Dato automático: <strong className="text-white">{k.isFree ? 'Gratis' : formatBs(k.ticketPriceBs)}</strong>.</>
                    )}{' '}
                    {ticket && ticketNum === 0 && <strong className="text-amber-300">Con 0 la web mostrará la Kiniela como gratuita.</strong>}
                    {ticket && ticketNum !== null && ticketNum > 0 && !Number.isNaN(ticketNum) && (
                      <>Se verá como <strong className="text-white">{formatBs(ticketNum)}</strong>.</>
                    )}
                  </p>
                  {errors.ticketPriceBs && <p role="alert" className="text-xs text-rose-300 mt-1">{errors.ticketPriceBs}</p>}
                </div>
              </div>

              {/* Nota interna */}
              <div>
                <label htmlFor="ov-notes" className={LABEL}>
                  Nota interna (opcional)
                </label>
                <textarea
                  id="ov-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Premio corregido porque el servidor mostraba un monto viejo"
                  className={`${INPUT} resize-y`}
                />
                <p className={`${HELP} mt-1`}>Solo la ves tú en el panel; no se publica en la web.</p>
                {errors.notes && <p role="alert" className="text-xs text-rose-300 mt-1">{errors.notes}</p>}
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#1a2785]">
                <div className="flex flex-col gap-1">
                  {hasAnyStored && (
                    <button type="button" onClick={() => setConfirmAll(true)} className={BTN_GHOST}>
                      <Undo2 className="w-4 h-4" aria-hidden="true" />
                      Volver al dato automático (todo)
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {dirty && <span className="text-xs font-bold text-amber-300" role="status">Hay cambios sin guardar</span>}
                  <button type="submit" disabled={saving || !dirty || hasErrors} className={BTN_PRIMARY}>
                    {saving ? (
                      <>
                        <span className={SPINNER} aria-hidden="true" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className={HELP}>Los cambios tardan hasta ~1 minuto en verse en la web.</p>
            </form>
          </section>
        </div>
      )}

      <ConfirmDialog
        open={confirmAll}
        title="¿Volver al dato automático?"
        message="Se quitarán los cambios hechos a mano en el nombre, el premio y el ticket de esta Kiniela. La web volverá a mostrar lo que trae el servidor oficial."
        confirmLabel="Sí, volver al automático"
        busy={busyAll}
        onConfirm={revertAll}
        onCancel={() => setConfirmAll(false)}
      />
    </div>
  );
};

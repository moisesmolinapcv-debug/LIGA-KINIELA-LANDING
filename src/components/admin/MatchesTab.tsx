'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CalendarClock, ChevronDown, ChevronUp, Clock, Info, Pencil, Save, TriangleAlert } from 'lucide-react';
import type { KinielaMatch, MatchManualStatus } from '../../types/kinielas';
import { formatDateTimeVE } from '../../lib/kinielas/time';
import {
  deleteMatchMeta,
  isoToVeLocal,
  saveMatchMeta,
  veLocalToIso,
  type MatchMetaDraft,
  type MatchMetaRecord,
} from '../../lib/kinielas/admin-write';
import type { AdminKinielas, Notify } from './useAdminKinielas';
import { KinielaPicker } from './KinielaPicker';
import { MatchEditor } from './MatchEditor';
import { ConfirmDialog } from './ModalShell';
import { BTN_GHOST, BTN_PRIMARY, CARD, HELP, INPUT, LABEL, SPINNER } from './ui';

interface MatchesTabProps {
  admin: AdminKinielas;
  notify: Notify;
}

const STATUS_PILL: Record<MatchManualStatus, string> = {
  'EN ESPERA': 'bg-slate-700 text-slate-100 border-slate-500',
  'EN VIVO': 'bg-rose-600 text-white border-rose-400',
  FINALIZADO: 'bg-emerald-700 text-white border-emerald-400',
  SUSPENDIDO: 'bg-amber-500 text-black border-amber-300',
};
const STATUS_LABEL: Record<MatchManualStatus, string> = {
  'EN ESPERA': 'En espera',
  'EN VIVO': 'En vivo',
  FINALIZADO: 'Finalizado',
  SUSPENDIDO: 'Suspendido',
};

const TeamLogo: React.FC<{ url: string | null }> = ({ url }) =>
  url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={28}
      height={28}
      loading="lazy"
      className="w-7 h-7 object-contain shrink-0"
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  ) : (
    <span className="w-7 h-7 shrink-0" aria-hidden="true" />
  );

interface BulkRow {
  kickoff: string;
  league: string;
}

export const MatchesTab: React.FC<MatchesTabProps> = ({ admin, notify }) => {
  const { selected: k, manual, reloadManual } = admin;
  const poolId = k?.id ?? null;

  const records = useMemo(() => {
    const map = new Map<string, MatchMetaRecord>();
    if (poolId === null) return map;
    for (const r of manual.meta) if (r.poolId === poolId) map.set(`${r.homeTeamId}-${r.awayTeamId}`, r);
    return map;
  }, [manual.meta, poolId]);

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState<KinielaMatch | null>(null);
  const [clearing, setClearing] = useState(false);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkRows, setBulkRows] = useState<Record<string, BulkRow>>({});
  const [bulkLeague, setBulkLeague] = useState('');
  const [bulkDate, setBulkDate] = useState('');
  const [bulkSaving, setBulkSaving] = useState(false);

  // Al cambiar de Kiniela se cierra lo que estaba abierto
  useEffect(() => {
    setOpenKey(null);
    setBulkOpen(false);
  }, [poolId]);

  const recordsKey = JSON.stringify(manual.meta.filter((r) => r.poolId === poolId).map((r) => [r.homeTeamId, r.awayTeamId, r.kickoff, r.league]));
  // La tabla de carga masiva se llena con lo ya guardado
  useEffect(() => {
    if (!k) return;
    const next: Record<string, BulkRow> = {};
    for (const m of k.matches) {
      const r = records.get(m.key);
      next[m.key] = { kickoff: isoToVeLocal(r?.kickoff), league: r?.league ?? '' };
    }
    setBulkRows(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k?.id, recordsKey]);

  const leagueOptions = useMemo(
    () => Array.from(new Set(Array.from(records.values()).map((r) => r.league).filter((x): x is string => Boolean(x)))),
    [records]
  );

  if (!k) {
    return (
      <div className="space-y-6">
        <TabHeading />
        <KinielaPicker admin={admin} />
      </div>
    );
  }

  const total = k.matches.length;
  const withTime = k.matches.filter((m) => records.get(m.key)?.kickoff).length;
  const withLeague = k.matches.filter((m) => records.get(m.key)?.league).length;
  const withResult = k.matches.filter((m) => records.get(m.key)?.finalResult).length;
  const live = k.matches.filter((m) => records.get(m.key)?.status === 'EN VIVO').length;

  // Datos guardados que ya no corresponden a ningún partido del servidor (por ejemplo, si cambió un equipo)
  const validKeys = new Set(k.matches.map((m) => m.key));
  const orphans = Array.from(records.values()).filter((r) => !validKeys.has(`${r.homeTeamId}-${r.awayTeamId}`));

  const afterSave = async () => {
    await reloadManual();
  };

  const saveOne = async (m: KinielaMatch, draft: MatchMetaDraft) => {
    setSavingKey(m.key);
    try {
      await saveMatchMeta(k.id, [draft]);
      await afterSave();
      notify('success', 'Partido guardado', `${m.homeTeam.name} vs ${m.awayTeam.name}. Puede tardar hasta 1 minuto en verse en la web.`);
    } catch (err) {
      notify('error', 'No se pudo guardar el partido', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    } finally {
      setSavingKey(null);
    }
  };

  const clearOne = async () => {
    if (!confirmClear) return;
    setClearing(true);
    try {
      await deleteMatchMeta(k.id, confirmClear.homeTeam.id, confirmClear.awayTeam.id);
      await afterSave();
      notify('info', 'Datos borrados', 'El partido vuelve a quedar sin datos manuales.');
      setConfirmClear(null);
      setOpenKey(null);
    } catch (err) {
      notify('error', 'No se pudo borrar', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    } finally {
      setClearing(false);
    }
  };

  const applyBulkLeague = () => {
    const v = bulkLeague.trim();
    if (!v) return;
    setBulkRows((cur) => Object.fromEntries(Object.entries(cur).map(([key, row]) => [key, { ...row, league: v }])));
  };
  const applyBulkDate = () => {
    if (!bulkDate) return;
    setBulkRows((cur) => Object.fromEntries(Object.entries(cur).map(([key, row]) => [key, { ...row, kickoff: bulkDate }])));
  };

  const bulkInvalid = k.matches.filter((m) => {
    const row = bulkRows[m.key];
    return row?.kickoff && veLocalToIso(row.kickoff) === null;
  });

  const saveBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkInvalid.length > 0) return;
    setBulkSaving(true);
    try {
      const drafts: MatchMetaDraft[] = [];
      for (const m of k.matches) {
        const row = bulkRows[m.key] ?? { kickoff: '', league: '' };
        const rec = records.get(m.key) ?? null;
        const kickoff = row.kickoff ? veLocalToIso(row.kickoff) : null;
        const league = row.league.trim() || null;
        // Solo se tocan los partidos que cambiaron o que ya tenían datos; el resto de campos se conserva
        const same = (rec?.kickoff ?? null) === kickoff && (rec?.league ?? null) === league;
        if (same) continue;
        drafts.push({
          homeTeamId: m.homeTeam.id,
          awayTeamId: m.awayTeam.id,
          kickoff,
          league,
          status: rec?.status ?? null,
          homeScore: rec?.homeScore ?? null,
          awayScore: rec?.awayScore ?? null,
          minute: rec?.minute ?? null,
          finalResult: rec?.finalResult ?? null,
        });
      }
      if (drafts.length === 0) {
        notify('info', 'Sin cambios', 'No hay nada nuevo que guardar en la hora y la liga.');
        return;
      }
      await saveMatchMeta(k.id, drafts);
      await afterSave();
      notify('success', 'Horarios y ligas guardados', `${drafts.length} partido${drafts.length === 1 ? '' : 's'} actualizado${drafts.length === 1 ? '' : 's'}. Pueden tardar hasta 1 minuto en verse en la web.`);
      setBulkOpen(false);
    } catch (err) {
      notify('error', 'No se pudieron guardar los horarios', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    } finally {
      setBulkSaving(false);
    }
  };

  const clearOrphans = async () => {
    try {
      for (const r of orphans) await deleteMatchMeta(k.id, r.homeTeamId, r.awayTeamId);
      await afterSave();
      notify('info', 'Datos sobrantes borrados');
    } catch (err) {
      notify('error', 'No se pudo borrar', err instanceof Error ? err.message : 'Inténtalo de nuevo.');
    }
  };

  const Chip: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
        ok ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' : 'bg-amber-950/50 text-amber-200 border-amber-500/40'
      }`}
    >
      {ok ? '✓' : '!'} {label}
    </span>
  );

  return (
    <div className="space-y-6">
      <TabHeading />

      <KinielaPicker admin={admin} />

      {manual.error && (
        <div role="alert" className="flex gap-3 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-100 text-sm">
          <TriangleAlert className="w-5 h-5 text-rose-300 shrink-0" aria-hidden="true" />
          <p>{manual.error}</p>
        </div>
      )}

      {/* Resumen */}
      <div className="flex flex-wrap items-center gap-2" role="status" aria-label="Resumen de datos cargados">
        <span className="px-3 py-1.5 rounded-lg bg-[#0c186b]/80 border border-[#1a2785] text-sm text-slate-100">
          Con hora: <strong className="text-kiniela-gold">{withTime}/{total}</strong>
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-[#0c186b]/80 border border-[#1a2785] text-sm text-slate-100">
          Con liga: <strong className="text-kiniela-gold">{withLeague}/{total}</strong>
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-[#0c186b]/80 border border-[#1a2785] text-sm text-slate-100">
          Con resultado: <strong className="text-kiniela-gold">{withResult}/{total}</strong>
        </span>
        {live > 0 && (
          <span className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-sm text-rose-100">
            En vivo: <strong>{live}</strong>
          </span>
        )}
      </div>

      <p className="flex items-start gap-2 text-sm text-slate-200 bg-[#00063E]/60 border border-[#1a2785] rounded-xl p-3">
        <Info className="w-4 h-4 text-kiniela-gold mt-0.5 shrink-0" aria-hidden="true" />
        <span>Los cambios tardan hasta ~1 minuto en verse en la web. Todas las horas son de Venezuela.</span>
      </p>

      {total === 0 ? (
        <div className={`${CARD} text-center text-slate-200`}>
          <CalendarDays className="w-10 h-10 mx-auto mb-2 text-slate-400" aria-hidden="true" />
          <p className="font-bold">Esta Kiniela no trae partidos desde el servidor oficial.</p>
          <p className={HELP}>Cuando el servidor los publique, aparecerán aquí para cargar hora, liga y resultados.</p>
        </div>
      ) : (
        <>
          {/* Carga masiva */}
          <section className={`${CARD} space-y-4`} aria-labelledby="bulk-title">
            <button
              type="button"
              onClick={() => setBulkOpen((v) => !v)}
              aria-expanded={bulkOpen}
              className="w-full min-h-[44px] flex items-center justify-between gap-3 text-left"
            >
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg bg-kiniela-vinotinto/80 border border-kiniela-gold/30 flex items-center justify-center text-kiniela-gold shrink-0">
                  <CalendarClock className="w-5 h-5" aria-hidden="true" />
                </span>
                <span>
                  <span id="bulk-title" className="block text-base font-bold text-white font-rockwell">
                    Cargar hora y liga de todos los partidos
                  </span>
                  <span className="block text-xs text-slate-300">Más rápido que ir uno por uno</span>
                </span>
              </span>
              {bulkOpen ? <ChevronUp className="w-5 h-5 text-slate-300" aria-hidden="true" /> : <ChevronDown className="w-5 h-5 text-slate-300" aria-hidden="true" />}
            </button>

            {bulkOpen && (
              <form onSubmit={saveBulk} className="space-y-4 border-t border-[#1a2785] pt-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-[#00063E]/60 border border-[#1a2785]">
                  <div>
                    <label htmlFor="bulk-league-all" className={LABEL}>Misma liga para todos</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input id="bulk-league-all" type="text" value={bulkLeague} onChange={(e) => setBulkLeague(e.target.value)} placeholder="Ej: Champions League" className={INPUT} />
                      <button type="button" onClick={applyBulkLeague} disabled={!bulkLeague.trim()} className={BTN_GHOST}>Aplicar</button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bulk-date-all" className={LABEL}>Misma fecha y hora para todos</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input id="bulk-date-all" type="datetime-local" value={bulkDate} onChange={(e) => setBulkDate(e.target.value)} className={INPUT} />
                      <button type="button" onClick={applyBulkDate} disabled={!bulkDate} className={BTN_GHOST}>Aplicar</button>
                    </div>
                  </div>
                </div>

                <ol className="space-y-3">
                  {k.matches.map((m) => {
                    const row = bulkRows[m.key] ?? { kickoff: '', league: '' };
                    const bad = row.kickoff && veLocalToIso(row.kickoff) === null;
                    return (
                      <li key={m.key} className="p-3 rounded-xl bg-[#00063E]/60 border border-[#1a2785]">
                        <p className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                          <span className="font-mono text-xs text-slate-300 w-5">{m.index}.</span>
                          <TeamLogo url={m.homeTeam.logoUrl} />
                          <span className="truncate">{m.homeTeam.name}</span>
                          <span className="text-slate-300 font-normal">vs</span>
                          <TeamLogo url={m.awayTeam.logoUrl} />
                          <span className="truncate">{m.awayTeam.name}</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor={`bk-${m.key}`} className="sr-only">Fecha y hora de {m.homeTeam.name} vs {m.awayTeam.name}</label>
                            <input
                              id={`bk-${m.key}`}
                              type="datetime-local"
                              value={row.kickoff}
                              onChange={(e) => setBulkRows((c) => ({ ...c, [m.key]: { ...row, kickoff: e.target.value } }))}
                              aria-invalid={Boolean(bad)}
                              className={INPUT}
                            />
                          </div>
                          <div>
                            <label htmlFor={`bl-${m.key}`} className="sr-only">Liga de {m.homeTeam.name} vs {m.awayTeam.name}</label>
                            <input
                              id={`bl-${m.key}`}
                              type="text"
                              value={row.league}
                              onChange={(e) => setBulkRows((c) => ({ ...c, [m.key]: { ...row, league: e.target.value } }))}
                              maxLength={60}
                              placeholder="Liga o torneo"
                              className={INPUT}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {bulkInvalid.length > 0 && (
                  <p role="alert" className="text-sm text-rose-300">Hay una fecha que no se entiende. Elígela con el calendario.</p>
                )}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                  <button type="button" onClick={() => setBulkOpen(false)} className={BTN_GHOST}>Cerrar</button>
                  <button type="submit" disabled={bulkSaving || bulkInvalid.length > 0} className={BTN_PRIMARY}>
                    {bulkSaving ? (
                      <>
                        <span className={SPINNER} aria-hidden="true" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
                        Guardar horas y ligas
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Lista de partidos */}
          <ol className="space-y-3" aria-label="Partidos de la Kiniela">
            {k.matches.map((m) => {
              const rec = records.get(m.key) ?? null;
              const isOpen = openKey === m.key;
              const hasScore = rec && rec.homeScore !== null && rec.awayScore !== null;
              return (
                <li key={m.key} className={`rounded-2xl border p-3 sm:p-4 transition-colors ${rec?.status === 'EN VIVO' ? 'border-rose-500/60 bg-rose-950/20' : 'border-[#1a2785] bg-[#060e4f]/70'}`}>
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-[#00063E] border border-[#1a2785] text-slate-200 font-mono font-bold text-sm flex items-center justify-center">
                      {m.index}
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base font-bold text-white">
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <TeamLogo url={m.homeTeam.logoUrl} />
                          <span className="truncate">{m.homeTeam.name}</span>
                        </span>
                        {hasScore ? (
                          <span className="font-rockwell font-black text-kiniela-gold text-lg px-1">{rec!.homeScore} - {rec!.awayScore}</span>
                        ) : (
                          <span className="text-slate-300 font-normal">vs</span>
                        )}
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <TeamLogo url={m.awayTeam.logoUrl} />
                          <span className="truncate">{m.awayTeam.name}</span>
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                          {rec?.kickoff ? formatDateTimeVE(rec.kickoff) : <span className="text-amber-200">Falta la hora</span>}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{rec?.league ? rec.league : <span className="text-amber-200">Falta la liga</span>}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {rec?.status ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_PILL[rec.status]}`}>
                            {STATUS_LABEL[rec.status]}{rec.status === 'EN VIVO' && rec.minute ? ` · ${rec.minute}` : ''}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">Sin estado</span>
                        )}
                        {rec?.finalResult && (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-kiniela-gold/20 text-kiniela-gold border border-kiniela-gold/50">
                            Resultado: {rec.finalResult}
                          </span>
                        )}
                        <Chip ok={Boolean(rec?.kickoff)} label="Hora" />
                        <Chip ok={Boolean(rec?.league)} label="Liga" />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : m.key)}
                      aria-expanded={isOpen}
                      className={`${BTN_GHOST} shrink-0 ${isOpen ? 'border-kiniela-gold/60 text-kiniela-gold' : ''}`}
                    >
                      <Pencil className="w-4 h-4" aria-hidden="true" />
                      <span>{isOpen ? 'Cerrar' : 'Editar'}</span>
                    </button>
                  </div>

                  {isOpen && (
                    <MatchEditor
                      key={`${m.key}-${rec?.updatedAt ?? 'nuevo'}`}
                      match={m}
                      record={rec}
                      leagueOptions={leagueOptions}
                      saving={savingKey === m.key}
                      onSave={(draft) => saveOne(m, draft)}
                      onClear={async () => setConfirmClear(m)}
                      onCancel={() => setOpenKey(null)}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {orphans.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-100 text-sm flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="flex-1">
                Hay {orphans.length} dato{orphans.length === 1 ? '' : 's'} guardado{orphans.length === 1 ? '' : 's'} que ya no corresponde{orphans.length === 1 ? '' : 'n'} a ningún partido de esta Kiniela (por ejemplo, si el servidor cambió un equipo).
              </p>
              <button type="button" onClick={clearOrphans} className={BTN_GHOST}>Borrar esos datos</button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmClear !== null}
        title="¿Borrar los datos de este partido?"
        message="Se quitarán la hora, la liga, el estado, el marcador y el resultado cargados a mano. El partido seguirá en la Kiniela, pero sin esos datos."
        confirmLabel="Sí, borrar"
        busy={clearing}
        onConfirm={clearOne}
        onCancel={() => setConfirmClear(null)}
      />
    </div>
  );
};

const TabHeading: React.FC = () => (
  <div className="pb-4 border-b border-[#1a2785]">
    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-rockwell">
      <CalendarDays className="w-6 h-6 text-kiniela-gold" aria-hidden="true" />
      <span>Partidos de la Kiniela</span>
    </h2>
    <p className="text-sm text-slate-200 mt-1 max-w-3xl">
      Los equipos llegan solos desde el servidor oficial. Aquí cargas lo que el servidor no trae: la fecha y hora, la liga, el
      estado, el marcador, el minuto y el resultado final de cada partido.
    </p>
  </div>
);

'use client';

import React, { useMemo, useState } from 'react';
import { Minus, Plus, Save, Trash2, TriangleAlert, Wand2 } from 'lucide-react';
import type { FinalResult, KinielaMatch, MatchManualStatus } from '../../types/kinielas';
import { formatDateTimeVE } from '../../lib/kinielas/time';
import {
  checkDraft,
  deriveResult,
  isoToVeLocal,
  MATCH_STATUSES,
  RESULT_LABEL,
  veLocalToIso,
  type MatchMetaDraft,
  type MatchMetaRecord,
} from '../../lib/kinielas/admin-write';
import { BTN_DANGER, BTN_GHOST, BTN_ICON, BTN_PRIMARY, HELP, INPUT, LABEL, SPINNER } from './ui';

export interface MatchForm {
  kickoff: string; // "YYYY-MM-DDTHH:mm" en hora de Venezuela
  league: string;
  status: '' | MatchManualStatus;
  home: string;
  away: string;
  minute: string;
  result: '' | FinalResult;
}

export const formFromRecord = (r: MatchMetaRecord | null): MatchForm => ({
  kickoff: isoToVeLocal(r?.kickoff),
  league: r?.league ?? '',
  status: r?.status ?? '',
  home: r?.homeScore === null || r?.homeScore === undefined ? '' : String(r.homeScore),
  away: r?.awayScore === null || r?.awayScore === undefined ? '' : String(r.awayScore),
  minute: r?.minute ?? '',
  result: r?.finalResult ?? '',
});

const score = (s: string): number | null => {
  const t = s.trim();
  if (t === '') return null;
  return /^\d+$/.test(t) ? Number(t) : NaN;
};

/** Convierte el formulario en el borrador que se guarda. kickoffInvalid = escribieron una fecha que no se entiende. */
export function draftFromForm(m: KinielaMatch, f: MatchForm): { draft: MatchMetaDraft; kickoffInvalid: boolean } {
  const kickoff = f.kickoff ? veLocalToIso(f.kickoff) : null;
  return {
    kickoffInvalid: Boolean(f.kickoff) && kickoff === null,
    draft: {
      homeTeamId: m.homeTeam.id,
      awayTeamId: m.awayTeam.id,
      kickoff,
      league: f.league.trim() || null,
      status: f.status || null,
      homeScore: score(f.home),
      awayScore: score(f.away),
      minute: f.minute.trim() || null,
      finalResult: f.result || null,
    },
  };
}

const STATUS_STYLE: Record<MatchManualStatus, string> = {
  'EN ESPERA': 'data-[on=true]:bg-slate-600 data-[on=true]:text-white',
  'EN VIVO': 'data-[on=true]:bg-rose-600 data-[on=true]:text-white',
  FINALIZADO: 'data-[on=true]:bg-emerald-600 data-[on=true]:text-white',
  SUSPENDIDO: 'data-[on=true]:bg-amber-500 data-[on=true]:text-black',
};

const MINUTES = ["1'", "30'", 'HT', "60'", "75'", "90'", 'FT'];
const LEAGUE_SUGGESTIONS = [
  'Liga FUTVE',
  'Champions League',
  'Europa League',
  'Copa Libertadores',
  'Copa Sudamericana',
  'LaLiga',
  'Premier League',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Eliminatorias',
  'Amistoso',
];

const segBtn =
  'min-h-[44px] px-3 rounded-lg text-sm font-bold border border-white/15 bg-[#00063E] text-slate-200 hover:bg-white/10 transition-colors data-[on=true]:border-transparent';

interface StepperProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const Stepper: React.FC<StepperProps> = ({ label, value, onChange }) => {
  const n = score(value);
  const current = n === null || Number.isNaN(n) ? 0 : n;
  return (
    <div className="flex-1 min-w-0">
      <span className="block text-xs font-bold text-slate-200 mb-1.5 truncate" title={label}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <button type="button" className={BTN_ICON} onClick={() => onChange(String(Math.max(0, current - 1)))} aria-label={`Quitar un gol a ${label}`}>
          <Minus className="w-5 h-5" aria-hidden="true" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, '').slice(0, 2))}
          aria-label={`Goles de ${label}`}
          placeholder="-"
          className="w-full min-w-0 h-11 text-center font-rockwell font-black text-xl text-kiniela-gold bg-[#00063E] border border-[#1a2785] rounded-xl"
        />
        <button type="button" className={BTN_ICON} onClick={() => onChange(String(Math.min(99, current + 1)))} aria-label={`Sumar un gol a ${label}`}>
          <Plus className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

interface MatchEditorProps {
  match: KinielaMatch;
  record: MatchMetaRecord | null;
  leagueOptions: string[];
  saving: boolean;
  onSave: (draft: MatchMetaDraft) => Promise<void>;
  onClear: () => Promise<void>;
  onCancel: () => void;
}

/** Formulario de un partido: pensado para usarse con una mano desde el celular. */
export const MatchEditor: React.FC<MatchEditorProps> = ({ match, record, leagueOptions, saving, onSave, onClear, onCancel }) => {
  const initial = useMemo(() => formFromRecord(record), [record]);
  const [f, setF] = useState<MatchForm>(initial);
  const set = <K extends keyof MatchForm>(key: K, value: MatchForm[K]) => setF((cur) => ({ ...cur, [key]: value }));

  const { draft, kickoffInvalid } = draftFromForm(match, f);
  const check = checkDraft(draft);
  const errors = [...check.errors, ...(kickoffInvalid ? ['La fecha y hora no se entienden: elígelas con el calendario.'] : [])];
  const derived = deriveResult(draft.homeScore, draft.awayScore);
  const dirty = JSON.stringify(f) !== JSON.stringify(initial);
  const uid = `me-${match.key}`;

  const chooseStatus = (s: MatchManualStatus) => {
    setF((cur) => {
      if (cur.status === s) return { ...cur, status: '' };
      const next = { ...cur, status: s };
      if (s === 'EN ESPERA') next.minute = '';
      if (s === 'FINALIZADO' && !cur.minute) next.minute = 'FT';
      return next;
    });
  };

  const options = Array.from(new Set([...leagueOptions, ...LEAGUE_SUGGESTIONS]));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (errors.length === 0) void onSave(draft);
      }}
      className="mt-3 space-y-5 border-t border-[#1a2785] pt-4"
      noValidate
    >
      {/* Fecha y liga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${uid}-kick`} className={LABEL}>
            Fecha y hora (hora de Venezuela)
          </label>
          <input
            id={`${uid}-kick`}
            type="datetime-local"
            value={f.kickoff}
            onChange={(e) => set('kickoff', e.target.value)}
            className={INPUT}
          />
          <p className={`${HELP} mt-1`}>
            {draft.kickoff ? <>Se publicará como <strong className="text-white">{formatDateTimeVE(draft.kickoff)}</strong></> : 'Sin hora: la web mostrará "Horario por confirmar".'}
          </p>
        </div>
        <div>
          <label htmlFor={`${uid}-league`} className={LABEL}>
            Liga o torneo
          </label>
          <input
            id={`${uid}-league`}
            type="text"
            list={`${uid}-leagues`}
            value={f.league}
            onChange={(e) => set('league', e.target.value)}
            maxLength={60}
            placeholder="Ej: Champions League"
            className={INPUT}
          />
          <datalist id={`${uid}-leagues`}>
            {options.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Estado */}
      <fieldset>
        <legend className={LABEL}>Estado del partido</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MATCH_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              data-on={f.status === s}
              aria-pressed={f.status === s}
              onClick={() => chooseStatus(s)}
              className={`${segBtn} ${STATUS_STYLE[s]}`}
            >
              {s === 'EN ESPERA' ? 'En espera' : s === 'EN VIVO' ? 'En vivo' : s === 'FINALIZADO' ? 'Finalizado' : 'Suspendido'}
            </button>
          ))}
        </div>
        {!f.status && <p className={`${HELP} mt-1`}>Sin estado cargado. Toca uno para elegirlo (toca de nuevo para quitarlo).</p>}
      </fieldset>

      {/* Marcador */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <Stepper label={match.homeTeam.shortName || match.homeTeam.name} value={f.home} onChange={(v) => set('home', v)} />
          <span className="hidden sm:block pb-3 text-slate-300 font-black" aria-hidden="true">:</span>
          <Stepper label={match.awayTeam.shortName || match.awayTeam.name} value={f.away} onChange={(v) => set('away', v)} />
        </div>
        {(f.home !== '' || f.away !== '') && (
          <button type="button" onClick={() => setF((c) => ({ ...c, home: '', away: '' }))} className="mt-1 min-h-[44px] text-xs font-bold text-kiniela-gold hover:underline">
            Borrar marcador
          </button>
        )}
      </div>

      {/* Minuto */}
      <div>
        <label htmlFor={`${uid}-min`} className={LABEL}>
          Minuto de juego
        </label>
        <input
          id={`${uid}-min`}
          type="text"
          value={f.minute}
          onChange={(e) => set('minute', e.target.value)}
          maxLength={12}
          placeholder="Ej: 68'"
          className={`${INPUT} sm:max-w-[160px] font-mono text-center`}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {MINUTES.map((m) => (
            <button key={m} type="button" onClick={() => set('minute', m)} className={`${segBtn} font-mono px-3.5`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado final */}
      <fieldset>
        <legend className={LABEL}>Resultado final (para contar los aciertos)</legend>
        <div className="grid grid-cols-3 gap-2">
          {(['L', 'E', 'V'] as FinalResult[]).map((r) => (
            <button
              key={r}
              type="button"
              data-on={f.result === r}
              aria-pressed={f.result === r}
              onClick={() => set('result', f.result === r ? '' : r)}
              className={`${segBtn} data-[on=true]:bg-kiniela-gold data-[on=true]:text-kiniela-navy`}
            >
              <span className="block text-base font-black">{r}</span>
              <span className="block text-xs font-semibold">{RESULT_LABEL[r]}</span>
            </button>
          ))}
        </div>
        {derived && f.result !== derived && (
          <button type="button" onClick={() => set('result', derived)} className={`${BTN_GHOST} mt-2 w-full sm:w-auto`}>
            <Wand2 className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
            Poner el resultado según el marcador: {RESULT_LABEL[derived]}
          </button>
        )}
        {!f.result && !derived && <p className={`${HELP} mt-1`}>Sin resultado final. Se puede sacar del marcador cuando lo cargues.</p>}
      </fieldset>

      {/* Avisos de coherencia */}
      {(errors.length > 0 || check.warnings.length > 0) && (
        <div role="alert" className="space-y-2">
          {errors.map((m, i) => (
            <p key={`e${i}`} className="flex gap-2 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-100 text-sm">
              <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-rose-300" aria-hidden="true" />
              {m}
            </p>
          ))}
          {check.warnings.map((m, i) => (
            <p key={`w${i}`} className="flex gap-2 p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-100 text-sm">
              <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
              {m}
            </p>
          ))}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#1a2785]">
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button type="button" onClick={onCancel} disabled={saving} className={BTN_GHOST}>
            Cerrar
          </button>
          {record && (
            <button type="button" onClick={() => void onClear()} disabled={saving} className={`${BTN_DANGER} bg-rose-950/60 hover:bg-rose-900 text-rose-100 border-rose-500/40`}>
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Borrar datos de este partido
            </button>
          )}
        </div>
        <button type="submit" disabled={saving || errors.length > 0 || !dirty} className={BTN_PRIMARY}>
          {saving ? (
            <>
              <span className={SPINNER} aria-hidden="true" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              {check.warnings.length > 0 ? 'Guardar de todas formas' : 'Guardar partido'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

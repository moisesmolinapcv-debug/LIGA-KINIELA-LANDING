'use client';

import React, { memo, useRef } from 'react';
import { Ban, Check, Clock, X } from 'lucide-react';
import type { KinielaMatch, MatchManualStatus } from '../../types/kinielas';
import { formatDateTimeVE } from '../../lib/kinielas/time';
import { BOLETO } from '../../content/copys';
import { Crest } from './Crest';
import type { Pick } from './practice';

const OPTIONS: Pick[] = ['L', 'E', 'V'];

interface MatchLineProps {
  match: KinielaMatch;
  /** Posición en el boleto, base 1. */
  number: number;
  pick: Pick | undefined;
  /** Opción recién sellada por el usuario (activa la animación del sello solo en ese toque). */
  stamped: Pick | null;
  onPick: (matchKey: string, option: Pick) => void;
  /** Mostrar "Por confirmar" en esta línea (solo si otras líneas sí traen horario). */
  showPending?: boolean;
}

function StatusChip({ status, minute }: { status: MatchManualStatus; minute?: string }) {
  const base = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide';
  if (status === 'EN VIVO') {
    return (
      <span className={`${base} border-red-400/60 bg-red-950/60 text-red-200`}>
        <span aria-hidden="true" className="tq-live-dot h-2 w-2 rounded-full bg-red-400" />
        En vivo{minute ? ` · ${minute}` : ''}
      </span>
    );
  }
  if (status === 'FINALIZADO') {
    return (
      <span className={`${base} border-white/30 bg-slate-800/80 text-slate-100`}>
        <Check aria-hidden="true" className="h-3 w-3" />
        Finalizado
      </span>
    );
  }
  if (status === 'SUSPENDIDO') {
    return (
      <span className={`${base} border-kiniela-vinotinto bg-kiniela-vinotinto/40 text-white`}>
        <Ban aria-hidden="true" className="h-3 w-3" />
        Suspendido
      </span>
    );
  }
  return (
    <span className={`${base} border-sky-400/40 bg-sky-950/60 text-sky-200`}>
      <Clock aria-hidden="true" className="h-3 w-3" />
      En espera
    </span>
  );
}

function MatchLineImpl({ match, number, pick, stamped, onPick, showPending = false }: MatchLineProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const m = match.manual;
  const suspended = m?.status === 'SUSPENDIDO';
  const finalResult = suspended ? undefined : m?.finalResult;
  const kickoff = formatDateTimeVE(m?.kickoff);
  const hasScore = m?.homeScore !== undefined && m?.awayScore !== undefined;
  const label = String(number).padStart(2, '0');

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const btns = groupRef.current?.querySelectorAll<HTMLButtonElement>('button');
    btns?.[(i + delta + 3) % 3]?.focus();
  };

  // Roving tabindex: una sola parada de tabulador por partido.
  const tabStop: Pick = pick ?? 'L';

  return (
    <li className={`rounded-xl border bg-kiniela-navy-deep/55 p-3 sm:p-4 ${suspended ? 'border-kiniela-vinotinto/70' : 'border-white/10'}`}>
      {/* Número, horario / liga y estado */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span
          aria-hidden="true"
          className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-md bg-gold-foil px-1.5 font-rockwell text-sm font-extrabold text-kiniela-navy"
        >
          {label}
        </span>
        <p className="min-w-0 flex-1 text-xs leading-snug text-slate-300">
          {kickoff ? (
            <span className="font-semibold text-white">{kickoff}</span>
          ) : (
            showPending && <span className="text-slate-300">{BOLETO.porConfirmar}</span>
          )}
          {m?.league && <span className="block text-slate-400">{m.league}</span>}
        </p>
        {m?.status && <StatusChip status={m.status} minute={m.minute} />}
      </div>

      {/* Equipos y marcador (si lo hay) */}
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Crest team={match.homeTeam} size={32} />
          <span className="min-w-0 text-[13px] font-semibold leading-tight text-white line-clamp-2 sm:text-sm">
            {match.homeTeam.shortName || match.homeTeam.name}
          </span>
        </div>
        <div className="min-w-[2.5rem] text-center" aria-hidden={!hasScore}>
          {hasScore ? (
            <span className="rounded-md bg-kiniela-navy px-2 py-1 font-rockwell text-base font-extrabold tabular-nums text-kiniela-gold-light">
              {m?.homeScore} - {m?.awayScore}
            </span>
          ) : (
            <span aria-hidden="true" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              vs
            </span>
          )}
        </div>
        <div className="flex min-w-0 items-center justify-end gap-2 text-right">
          <span className="min-w-0 text-[13px] font-semibold leading-tight text-white line-clamp-2 sm:text-sm">
            {match.awayTeam.shortName || match.awayTeam.name}
          </span>
          <Crest team={match.awayTeam} size={32} />
        </div>
      </div>

      {suspended && <p className="mt-2 text-xs font-medium text-kiniela-gold-light">{BOLETO.suspendidoNota}</p>}

      {/* Casillas L / E / V */}
      <div
        ref={groupRef}
        role="group"
        aria-label={BOLETO.grupoAria(number, match.homeTeam.name, match.awayTeam.name)}
        className="mt-3 grid grid-cols-[1fr_0.62fr_1fr] gap-2"
      >
        {OPTIONS.map((opt, i) => {
          const marked = pick === opt;
          const isResult = finalResult === opt;
          const decided = Boolean(finalResult);
          const hit = marked && decided && finalResult === opt;
          const miss = marked && decided && finalResult !== opt;
          const text = BOLETO.opciones[opt];

          let surface = 'border-white/30 bg-kiniela-navy-card text-white hover:border-kiniela-gold/70';
          if (marked) surface = miss ? 'border-white bg-kiniela-vinotinto text-white' : 'border-kiniela-gold bg-kiniela-gold text-kiniela-navy';
          const ring = isResult && !marked ? 'ring-2 ring-inset ring-emerald-300' : '';

          return (
            <button
              key={opt}
              type="button"
              aria-pressed={marked}
              aria-label={`${BOLETO.opcionAria(number, text)}${marked ? `, ${BOLETO.marcado}` : ''}${
                hit ? `, ${BOLETO.acierto}` : miss ? `, ${BOLETO.fallo}` : ''
              }${isResult && !marked ? `, ${BOLETO.resultado}` : ''}`}
              tabIndex={opt === tabStop ? 0 : -1}
              onClick={() => onPick(match.key, opt)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative flex min-h-casilla select-none flex-col items-center justify-center overflow-hidden rounded-lg border-2 px-2 py-1.5 text-center font-bold uppercase tracking-wide transition-colors duration-tap ${surface} ${ring}`}
            >
              {marked ? (
                <span
                  key={stamped === opt ? 'stamp' : 'still'}
                  className={`flex flex-col items-center gap-0.5 ${stamped === opt ? 'tq-stamp-in' : ''}`}
                >
                  <span className="inline-flex items-center gap-1 text-[13px] leading-none">
                    {miss ? <X aria-hidden="true" className="h-4 w-4" strokeWidth={3} /> : <Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} />}
                    {text}
                  </span>
                  {decided && <span className="text-[10px] leading-none">{hit ? BOLETO.acierto : BOLETO.fallo}</span>}
                </span>
              ) : (
                <span className="flex flex-col items-center gap-0.5">
                  <span className="text-[13px] leading-none">{text}</span>
                  {isResult && <span className="text-[10px] leading-none text-emerald-200">{BOLETO.resultado}</span>}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </li>
  );
}

export const MatchLine = memo(MatchLineImpl);

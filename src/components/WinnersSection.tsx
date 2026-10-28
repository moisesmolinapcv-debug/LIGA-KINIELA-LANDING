import React from 'react';
import { Winner, SiteCopys } from '../types/kiniela';
import { Trophy, MapPin, Calendar, BadgeCheck, Award } from 'lucide-react';
import { CAMPEONES_SECCION as T } from '../content/landing';

interface WinnersSectionProps {
  winners: Winner[];
  // Se conserva por compatibilidad con la página; los textos de esta sección vienen de src/content/landing.ts
  copys?: SiteCopys;
}

/** Copa dorada en línea (decorativa). */
function Copa({ destacada }: { destacada: boolean }) {
  return (
    <svg viewBox="0 0 64 72" aria-hidden="true" focusable="false" className="h-16 w-14 flex-none">
      <defs>
        <linearGradient id={destacada ? 'm3c-oro-d' : 'm3c-oro'} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd58a" />
          <stop offset="0.55" stopColor="#FFAF3F" />
          <stop offset="1" stopColor="#c9791c" />
        </linearGradient>
      </defs>
      <g fill={`url(#${destacada ? 'm3c-oro-d' : 'm3c-oro'})`}>
        <path d="M16 6h32v18c0 10-7 18-16 18S16 34 16 24V6z" />
        <path d="M16 10H6c0 12 4 20 12 22l1-5c-4-2-6-7-6-13h3v-4zM48 10h10c0 12-4 20-12 22l-1-5c4-2 6-7 6-13h-3v-4z" opacity="0.85" />
        <rect x="29" y="42" width="6" height="10" />
        <path d="M20 52h24l3 8H17l3-8z" />
      </g>
      <rect x="14" y="62" width="36" height="6" rx="1.5" fill="#882445" stroke="#FFAF3F" strokeWidth="1" />
    </svg>
  );
}

export const WinnersSection: React.FC<WinnersSectionProps> = ({ winners }) => {
  return (
    <section id="campeones" className="relative scroll-mt-20 bg-kiniela-navy-deep py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-kiniela-gold/30 bg-kiniela-gold/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-kiniela-gold">
            <Trophy aria-hidden="true" className="h-4 w-4 text-kiniela-gold" />
            <span>{T.badge}</span>
          </div>
          <h2 className="font-rockwell text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            {T.titulo}
          </h2>
          <p className="mt-3 text-base text-slate-200 sm:text-lg">{T.subtitulo}</p>
          {/* Decisión Q8: el sello va una sola vez, a nivel de sección */}
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-300">
            <BadgeCheck aria-hidden="true" className="h-4 w-4" />
            {T.sello}
          </p>
        </div>

        {winners.length === 0 ? (
          <div className="rounded-2xl border border-kiniela-navy-border/60 bg-kiniela-navy-card/50 py-12 text-center">
            <Award aria-hidden="true" className="mx-auto mb-3 h-12 w-12 text-slate-400" />
            <p className="px-4 text-slate-300">{T.vacio}</p>
          </div>
        ) : (
          /* Vitrina: marco de cristal con un trofeo sobre su base por cada campeón */
          <div className="m3c-vitrina">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {winners.map((winner, idx) => (
                <li
                  key={winner.id || idx}
                  className={`m3c-trofeo ${winner.is_recent ? 'is-reciente' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <Copa destacada={winner.is_recent} />
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words font-rockwell text-lg font-bold leading-tight text-white">
                        {winner.winner_name}
                      </h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-300">
                        {winner.edition_title}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-kiniela-gold/30 bg-kiniela-navy-deep/80 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">{T.premio}</p>
                    <p className="font-rockwell text-2xl font-black leading-tight text-kiniela-gold">
                      {winner.prize_won}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-300">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <MapPin aria-hidden="true" className="h-3.5 w-3.5 flex-none text-kiniela-gold" />
                      <span className="truncate">{winner.city}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar aria-hidden="true" className="h-3.5 w-3.5 flex-none text-slate-400" />
                      <span>{winner.winning_date}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

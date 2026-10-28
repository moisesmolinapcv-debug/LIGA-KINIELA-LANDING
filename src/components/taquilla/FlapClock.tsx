'use client';

import React from 'react';
import type { Remaining } from '../../lib/kinielas/time';
import { SplitFlap } from './SplitFlap';

interface FlapClockProps {
  /** null antes de montar: se muestran guiones en vez de una hora falsa. */
  remaining: Remaining | null;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Cuenta regresiva Días / Horas / Min / Seg. Cada dígito voltea solo cuando cambia. */
export function FlapClock({ remaining, className = '' }: FlapClockProps) {
  const r = remaining;
  const groups = [
    { key: 'd', cap: 'Días', val: r ? pad(r.days) : '--', spoken: r ? `${r.days} días` : '' },
    { key: 'h', cap: 'Horas', val: r ? pad(r.hours) : '--', spoken: r ? `${r.hours} horas` : '' },
    { key: 'm', cap: 'Min', val: r ? pad(r.minutes) : '--', spoken: r ? `${r.minutes} minutos` : '' },
    { key: 's', cap: 'Seg', val: r ? pad(r.seconds) : '--', spoken: r ? `${r.seconds} segundos` : '' },
  ];
  return (
    <div className={`flex items-start justify-center gap-[0.3em] ${className}`}>
      {groups.map((g, i) => (
        <React.Fragment key={g.key}>
          {i > 0 && (
            <span aria-hidden="true" className="font-rockwell font-extrabold text-kiniela-gold/70 leading-[1.1]">
              :
            </span>
          )}
          <div className="flex flex-col items-center">
            <SplitFlap value={g.val} label={g.spoken || 'cargando'} />
            <span className="mt-1.5 text-[0.28em] leading-none font-semibold uppercase tracking-widest text-slate-300 font-poppins">
              {g.cap}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

'use client';

import React, { memo, useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './hooks';

interface FlapCharProps {
  ch: string;
  delay: number;
  instant: boolean;
  /** Celda ancha para letras. */
  wide?: boolean;
}

/** Un dígito: dos mitades fijas y dos mitades que voltean (solo transform). */
const FlapChar = memo(function FlapChar({ ch, delay, instant, wide }: FlapCharProps) {
  const [st, setSt] = useState<{ cur: string; prev: string | null; k: number }>({ cur: ch, prev: null, k: 0 });
  // Derivar estado al cambiar la prop: el volteo arranca solo en las celdas que cambian.
  if (st.cur !== ch) setSt({ cur: ch, prev: instant ? null : st.cur, k: st.k + 1 });
  const flipping = st.prev !== null;
  // Respaldo por si animationend no llega (pestaña oculta, display:none): nunca queda un dígito viejo.
  useEffect(() => {
    if (st.prev === null) return;
    const id = window.setTimeout(() => setSt((s) => ({ ...s, prev: null })), delay + 900);
    return () => window.clearTimeout(id);
  }, [st.k, st.prev, delay]);
  const half = (c: string) => <span>{c}</span>;
  return (
    <span className={wide ? 'tq-flap tq-flap-w' : 'tq-flap'} style={{ '--tq-d': `${delay}ms` } as React.CSSProperties} aria-hidden="true">
      <span className="tq-half tq-top">{half(st.cur)}</span>
      <span className="tq-half tq-bot">{half(flipping ? (st.prev as string) : st.cur)}</span>
      {flipping && (
        <React.Fragment key={st.k}>
          <span className="tq-half tq-top tq-fold-top">{half(st.prev as string)}</span>
          <span
            className="tq-half tq-bot tq-fold-bot"
            onAnimationEnd={() => setSt((s) => ({ ...s, prev: null }))}
          >
            {half(st.cur)}
          </span>
        </React.Fragment>
      )}
    </span>
  );
});

interface SplitFlapProps {
  /** Texto completo a mostrar. Letras y dígitos voltean; el resto son separadores fijos. */
  value: string;
  /** Etiqueta accesible; por defecto el propio valor. */
  label?: string;
  /** Retardo entre celdas (ms) para un volteo en cascada. */
  stagger?: number;
  className?: string;
}

/**
 * Marcador mecánico. Un solo role="img" con el valor completo; las celdas van ocultas
 * a lectores de pantalla y no hay aria-live, así no se anuncia cada cambio.
 */
export function SplitFlap({ value, label, stagger = 0, className = '' }: SplitFlapProps) {
  const reduced = usePrefersReducedMotion();
  const chars = Array.from(value);
  return (
    <span role="img" aria-label={label ?? value} className={`tq-board ${className}`}>
      {chars.map((c, i) => {
        // Clave contada desde la derecha: si el número crece, las celdas existentes se conservan.
        const key = chars.length - i;
        if (/[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ-]/.test(c)) {
          return <FlapChar key={key} ch={c.toUpperCase()} delay={i * stagger} instant={reduced} wide={/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(c)} />;
        }
        if (c === ' ') return <span key={key} className="tq-gap" aria-hidden="true" />;
        return (
          <span key={key} className="tq-sep" aria-hidden="true">
            {c}
          </span>
        );
      })}
    </span>
  );
}

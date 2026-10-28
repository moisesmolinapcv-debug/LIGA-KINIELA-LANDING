'use client';

import { useEffect, useState } from 'react';

/** Hora actual, alineada al cambio de segundo. null antes de montar (evita desajuste de hidratación). */
export function useNow(intervalMs = 1000): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let id: number;
    const tick = () => {
      setNow(new Date());
      id = window.setTimeout(tick, intervalMs - (Date.now() % intervalMs) + 5);
    };
    tick();
    return () => window.clearTimeout(id);
  }, [intervalMs]);
  return now;
}

/** true si el usuario pidió menos movimiento. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** Separador de miles con punto, sin depender del agrupado de es-VE (no agrupa 4 dígitos). */
export function formatMiles(n: number): string {
  const hasDecimals = !Number.isInteger(n);
  const [int, dec] = n.toFixed(hasDecimals ? 2 : 0).split('.');
  const miles = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return dec ? `${miles},${dec}` : miles;
}

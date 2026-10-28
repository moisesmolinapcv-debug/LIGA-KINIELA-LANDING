// Helpers de tiempo para las Kinielas. Puros: reciben `now` como parámetro.
// Zona fija de Venezuela (UTC-4, sin horario de verano).

import type { KinielaStatus } from '../../types/kinielas';

export const VE_TIMEZONE = 'America/Caracas';
const LOCALE = 'es-VE';

/** D4: la cuenta regresiva (y el cierre efectivo) es sales_finish menos 1 minuto. */
export const CLOSE_OFFSET_MS = 60_000;

export function parseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** salesFinish - 60 s, en ISO. Cadena vacía si la fecha no es válida. */
export function computeClosesAt(salesFinishIso: string): string {
  const d = parseDate(salesFinishIso);
  return d ? new Date(d.getTime() - CLOSE_OFFSET_MS).toISOString() : '';
}

/**
 * próxima: antes de salesStart. abierta: hasta closesAt. cerrada: desde closesAt.
 * Si falta alguna fecha válida se devuelve 'cerrada' (no se ofrece venta sin datos).
 */
export function getKinielaStatus(
  salesStartIso: string,
  closesAtIso: string,
  now: Date,
): KinielaStatus {
  const start = parseDate(salesStartIso);
  const closes = parseDate(closesAtIso);
  if (!start || !closes) return 'cerrada';
  const t = now.getTime();
  if (t < start.getTime()) return 'proxima';
  if (t >= closes.getTime()) return 'cerrada';
  return 'abierta';
}

export interface Remaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export function getRemaining(closesAtIso: string, now: Date): Remaining {
  const closes = parseDate(closesAtIso);
  const diff = closes ? closes.getTime() - now.getTime() : 0;
  if (diff <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    totalMs: diff,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

function format(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions): string {
  const d = parseDate(iso);
  if (!d) return '';
  return new Intl.DateTimeFormat(LOCALE, { timeZone: VE_TIMEZONE, ...opts }).format(d);
}

/** "martes, 3 de noviembre" */
export function formatDateVE(iso: string | null | undefined): string {
  return format(iso, { weekday: 'long', day: 'numeric', month: 'long' });
}

/** "3 nov" */
export function formatDateShortVE(iso: string | null | undefined): string {
  return format(iso, { day: 'numeric', month: 'short' });
}

/** "3:59 p. m." */
export function formatTimeVE(iso: string | null | undefined): string {
  return format(iso, { hour: 'numeric', minute: '2-digit', hour12: true });
}

/** "3 nov, 3:59 p. m." */
export function formatDateTimeVE(iso: string | null | undefined): string {
  const d = formatDateShortVE(iso);
  const t = formatTimeVE(iso);
  return d && t ? `${d}, ${t}` : '';
}

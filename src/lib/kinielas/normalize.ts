// Normalizador PURO del endpoint get-active-kinielas.
// El feed trae una fila por EQUIPO; aquí se agrupan por pool y se emparejan en partidos.
// No inventa datos: lo que falta queda ausente y se registra en `warnings`.

import type { Kiniela, KinielaMatch, KinielaTeam } from '../../types/kinielas';
import { computeClosesAt, getKinielaStatus, parseDate } from './time';

type Row = Record<string, unknown>;

const LOGO_BASE = 'https://ligakiniela.com/team';

function asString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() !== '' ? v : null;
}

/** Acepta number o string numérico ("1000.00"). null si no es finito. */
export function toNumber(v: unknown): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// Se construye con RegExp para no depender del target de TS (es5) en literales con flag u.
const EMOJI_RE = new RegExp(
  String.raw`[\p{Extended_Pictographic}\p{Regional_Indicator}\u200d\ufe0f\u20e3]`,
  'gu',
);

/** Quita emojis y colapsa espacios. */
export function stripEmojis(text: string): string {
  return text.replace(EMOJI_RE, '').replace(/\s+/g, ' ').trim();
}

/** `info` llega como texto JSON. Solo se usa el título; las reglas NO se exponen (D3). */
export function parseInfo(raw: unknown): { ok: boolean; title: string | null } {
  if (raw === null || raw === undefined || raw === '') return { ok: true, title: null };
  try {
    const parsed: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === 'object') {
      return { ok: true, title: asString((parsed as Row).title) };
    }
    return { ok: false, title: null };
  } catch {
    return { ok: false, title: null };
  }
}

function buildTeam(row: Row): KinielaTeam | null {
  const id = toNumber(row.team_id);
  if (id === null) return null;
  const side = row.homeaway === 'home' ? row.image_home : row.image_away;
  const name = asString(row.name) ?? asString(row.short_name) ?? `Equipo ${id}`;
  return {
    id,
    name,
    shortName: asString(row.short_name) ?? name,
    // Patrón verificado del propio feed; respaldo si el campo viene vacío.
    logoUrl: asString(side) ?? `${LOGO_BASE}/${id}/image`,
  };
}

function buildKiniela(id: number, rows: Row[], now: Date): Kiniela {
  const warnings: string[] = [];

  // Campos de pool: se toman de la primera fila con valor.
  const pick = (field: string): unknown => {
    for (const r of rows) if (r[field] !== null && r[field] !== undefined) return r[field];
    return null;
  };

  const info = parseInfo(pick('info'));
  if (!info.ok) warnings.push('El campo info no es un JSON válido; se ignoró.');

  const code = asString(pick('code')) ?? info.title ?? `Kiniela ${id}`;
  if (!asString(pick('code'))) warnings.push('El feed no trae el nombre (code); se usó un respaldo.');

  const ticket = toNumber(pick('ticket_price'));
  if (ticket === null) warnings.push('ticket_price ausente o inválido.');
  const prize = toNumber(pick('prize_base_amount'));
  if (prize === null) warnings.push('prize_base_amount ausente o inválido.');

  const salesStart = asString(pick('sales_start')) ?? '';
  const salesFinish = asString(pick('sales_finish')) ?? '';
  if (!parseDate(salesStart)) warnings.push('sales_start ausente o inválido.');
  if (!parseDate(salesFinish)) warnings.push('sales_finish ausente o inválido.');
  const closesAt = computeClosesAt(salesFinish);

  const totalMatches = toNumber(pick('total_matches'));

  // Emparejado: pares consecutivos del feed, conservando el orden. Cada par debe
  // tener exactamente un 'home' y un 'away'.
  const matches: KinielaMatch[] = [];
  for (let i = 0; i < rows.length; i += 2) {
    const a = rows[i];
    const b = rows[i + 1];
    const pairNo = i / 2 + 1;
    if (!b) {
      warnings.push(`Fila suelta sin pareja (partido ${pairNo}).`);
      break;
    }
    const sides = [a.homeaway, b.homeaway];
    const valid =
      sides.filter((s) => s === 'home').length === 1 && sides.filter((s) => s === 'away').length === 1;
    if (!valid) {
      warnings.push(`El partido ${pairNo} no tiene un local y un visitante; se omitió.`);
      continue;
    }
    const homeRow = a.homeaway === 'home' ? a : b;
    const awayRow = a.homeaway === 'home' ? b : a;
    const homeTeam = buildTeam(homeRow);
    const awayTeam = buildTeam(awayRow);
    if (!homeTeam || !awayTeam) {
      warnings.push(`El partido ${pairNo} tiene un equipo sin team_id; se omitió.`);
      continue;
    }
    if (homeTeam.id === awayTeam.id) {
      warnings.push(`El partido ${pairNo} repite el mismo equipo; se omitió.`);
      continue;
    }
    matches.push({
      index: pairNo,
      homeTeam,
      awayTeam,
      key: `${homeTeam.id}-${awayTeam.id}`,
    });
  }

  if (totalMatches === null) {
    warnings.push('total_matches ausente o inválido.');
  } else if (totalMatches !== matches.length) {
    warnings.push(`total_matches (${totalMatches}) no coincide con los partidos armados (${matches.length}).`);
  }

  return {
    id,
    code,
    name: stripEmojis(code) || code,
    ticketPriceBs: ticket ?? 0,
    prizeBs: prize ?? 0,
    isFree: ticket === 0,
    totalMatches: totalMatches ?? matches.length,
    salesStart,
    salesFinish,
    closesAt,
    status: getKinielaStatus(salesStart, closesAt, now),
    matches,
    warnings,
  };
}

/**
 * Convierte la respuesta cruda ({pools: [...]}) en Kinielas.
 * Lanza Error solo si el payload no tiene la forma esperada; filas sueltas o
 * defectuosas nunca rompen al resto.
 */
export function normalizePools(payload: unknown, now: Date = new Date()): Kiniela[] {
  const pools = payload && typeof payload === 'object' ? (payload as Row).pools : undefined;
  if (!Array.isArray(pools)) throw new Error('Respuesta sin arreglo "pools".');

  const groups = new Map<number, Row[]>();
  for (const item of pools) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Row;
    const id = toNumber(row.id);
    if (id === null) continue;
    const list = groups.get(id);
    if (list) list.push(row);
    else groups.set(id, [row]);
  }

  const result: Kiniela[] = [];
  groups.forEach((rows, id) => {
    try {
      result.push(buildKiniela(id, rows, now));
    } catch (e) {
      // Defensa final: una Kiniela defectuosa no tumba a las demás.
      console.warn('[Kinielas] No se pudo normalizar el pool', id, e);
    }
  });
  return result;
}

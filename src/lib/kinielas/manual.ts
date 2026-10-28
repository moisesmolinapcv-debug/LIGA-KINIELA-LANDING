// Capa manual: datos que el endpoint no trae (D1/D2). Se enlazan por IDs de equipo.
// La lectura vive detrás de `ManualSource`: cuando exista la API de resultados (D2)
// solo se sustituye la implementación, no la ruta ni la UI.

import { getSupabase } from '../kiniela-store';
import type {
  FinalResult,
  Kiniela,
  MatchManual,
  MatchManualStatus,
} from '../../types/kinielas';
import { toNumber } from './normalize';

export interface MatchMetaRow {
  poolId: number;
  homeTeamId: number;
  awayTeamId: number;
  manual: MatchManual;
}

export interface PoolOverrideRow {
  poolId: number;
  title?: string;
  prizeBs?: number;
  ticketPriceBs?: number;
  notes?: string;
}

export interface ManualData {
  matchMeta: MatchMetaRow[];
  poolOverrides: PoolOverrideRow[];
}

export interface ManualSource {
  /** Nunca debe lanzar: ante cualquier fallo devuelve datos vacíos. */
  load(): Promise<ManualData>;
}

export const EMPTY_MANUAL: ManualData = { matchMeta: [], poolOverrides: [] };

const STATUSES: MatchManualStatus[] = ['EN ESPERA', 'EN VIVO', 'FINALIZADO', 'SUSPENDIDO'];
const RESULTS: FinalResult[] = ['L', 'E', 'V'];

const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined;

function toIso(v: unknown): string | undefined {
  const s = str(v);
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

type Raw = Record<string, unknown>;

function parseMatchMeta(r: Raw): MatchMetaRow | null {
  const poolId = toNumber(r.pool_id);
  const homeTeamId = toNumber(r.home_team_id);
  const awayTeamId = toNumber(r.away_team_id);
  if (poolId === null || homeTeamId === null || awayTeamId === null) return null;

  const manual: MatchManual = {};
  const kickoff = toIso(r.kickoff);
  if (kickoff) manual.kickoff = kickoff;
  const league = str(r.league);
  if (league) manual.league = league;
  const status = str(r.status)?.toUpperCase() as MatchManualStatus | undefined;
  if (status && STATUSES.includes(status)) manual.status = status;
  const hs = toNumber(r.home_score);
  if (hs !== null) manual.homeScore = hs;
  const as = toNumber(r.away_score);
  if (as !== null) manual.awayScore = as;
  const minute = str(r.minute);
  if (minute) manual.minute = minute;
  const fr = str(r.final_result)?.toUpperCase() as FinalResult | undefined;
  if (fr && RESULTS.includes(fr)) manual.finalResult = fr;

  return { poolId, homeTeamId, awayTeamId, manual };
}

function parseOverride(r: Raw): PoolOverrideRow | null {
  const poolId = toNumber(r.pool_id);
  if (poolId === null) return null;
  const out: PoolOverrideRow = { poolId };
  const title = str(r.title);
  if (title) out.title = title;
  const prize = toNumber(r.prize_bs);
  if (prize !== null) out.prizeBs = prize;
  const ticket = toNumber(r.ticket_price_bs);
  if (ticket !== null) out.ticketPriceBs = ticket;
  const notes = str(r.notes);
  if (notes) out.notes = notes;
  return out;
}

/** Fuente actual: tablas match_meta y pool_overrides en Supabase (misma config que kiniela-store). */
export const supabaseManualSource: ManualSource = {
  async load() {
    try {
      const sb = getSupabase();
      if (!sb) return EMPTY_MANUAL;
      const [meta, ov] = await Promise.all([
        sb.from('match_meta').select('*'),
        sb.from('pool_overrides').select('*'),
      ]);
      // Si una tabla aún no existe, esa mitad queda vacía y la otra se aprovecha.
      const matchMeta = meta.error
        ? []
        : ((meta.data ?? []) as Raw[]).map(parseMatchMeta).filter((x): x is MatchMetaRow => x !== null);
      const poolOverrides = ov.error
        ? []
        : ((ov.data ?? []) as Raw[]).map(parseOverride).filter((x): x is PoolOverrideRow => x !== null);
      return { matchMeta, poolOverrides };
    } catch {
      return EMPTY_MANUAL;
    }
  },
};

/**
 * Superpone la capa manual. Pura: no muta la entrada.
 * - Override gana solo si no es null/ausente.
 * - match_meta se enlaza por (pool, idLocal, idVisitante), nunca por posición.
 */
export function applyManual(kinielas: Kiniela[], data: ManualData): Kiniela[] {
  if (data.matchMeta.length === 0 && data.poolOverrides.length === 0) return kinielas;

  const metaByKey = new Map<string, MatchManual>();
  for (const m of data.matchMeta) {
    metaByKey.set(`${m.poolId}:${m.homeTeamId}-${m.awayTeamId}`, m.manual);
  }
  const overrides = new Map<number, PoolOverrideRow>();
  for (const o of data.poolOverrides) overrides.set(o.poolId, o);

  return kinielas.map((k) => {
    const o = overrides.get(k.id);
    const next: Kiniela = {
      ...k,
      matches: k.matches.map((m) => {
        const manual = metaByKey.get(`${k.id}:${m.key}`);
        return manual ? { ...m, manual } : m;
      }),
    };
    if (o) {
      const flags: NonNullable<Kiniela['overrides']> = {};
      if (o.title !== undefined) {
        next.name = o.title;
        flags.title = true;
      }
      if (o.prizeBs !== undefined) {
        next.prizeBs = o.prizeBs;
        flags.prizeBs = true;
      }
      if (o.ticketPriceBs !== undefined) {
        next.ticketPriceBs = o.ticketPriceBs;
        next.isFree = o.ticketPriceBs === 0;
        flags.ticketPriceBs = true;
      }
      if (Object.keys(flags).length > 0) next.overrides = flags;
      if (o.notes !== undefined) next.notes = o.notes;
    }
    return next;
  });
}

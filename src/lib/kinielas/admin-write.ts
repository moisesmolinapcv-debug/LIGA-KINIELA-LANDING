// Escritura de la capa manual desde el panel (tablas match_meta y pool_overrides).
// La lectura pública sigue en manual.ts; aquí solo viven los helpers del admin.
// Las tablas no tienen trigger: cada guardado escribe updated_at a mano.

import { getSupabase } from '../kiniela-store';
import type { FinalResult, MatchManualStatus } from '../../types/kinielas';
import { VE_TIMEZONE } from './time';

// ---------------------------------------------------------------------------
// Fechas en hora de Venezuela (UTC-4, sin horario de verano)
// ---------------------------------------------------------------------------

/** ISO UTC -> "YYYY-MM-DDTHH:mm" en hora de Venezuela (valor de un input datetime-local). */
export function isoToVeLocal(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: VE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

/**
 * "YYYY-MM-DDTHH:mm" escrito como hora de Venezuela -> ISO UTC (timestamptz correcto sin
 * importar la zona horaria del dispositivo del admin). null si el valor no es válido.
 */
export function veLocalToIso(local: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null;
  const d = new Date(`${local}:00-04:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// ---------------------------------------------------------------------------
// Resultado y coherencia del partido
// ---------------------------------------------------------------------------

export const MATCH_STATUSES: MatchManualStatus[] = ['EN ESPERA', 'EN VIVO', 'FINALIZADO', 'SUSPENDIDO'];

export const RESULT_LABEL: Record<FinalResult, string> = {
  L: 'Local',
  E: 'Empate',
  V: 'Visitante',
};

/** Resultado que corresponde al marcador (prórroga y penales no cuentan: se usa el marcador de los 90'). */
export function deriveResult(home: number | null, away: number | null): FinalResult | null {
  if (home === null || away === null) return null;
  if (home > away) return 'L';
  if (home < away) return 'V';
  return 'E';
}

export interface MatchMetaDraft {
  homeTeamId: number;
  awayTeamId: number;
  /** ISO UTC o null si no se cargó. */
  kickoff: string | null;
  league: string | null;
  status: MatchManualStatus | null;
  homeScore: number | null;
  awayScore: number | null;
  minute: string | null;
  finalResult: FinalResult | null;
}

export function isEmptyDraft(d: MatchMetaDraft): boolean {
  return (
    d.kickoff === null &&
    d.league === null &&
    d.status === null &&
    d.homeScore === null &&
    d.awayScore === null &&
    d.minute === null &&
    d.finalResult === null
  );
}

export interface DraftCheck {
  /** Impiden guardar. */
  errors: string[];
  /** Avisos: se puede guardar, pero conviene revisar. */
  warnings: string[];
}

/** Revisa que los datos de un partido no se contradigan entre sí. */
export function checkDraft(d: MatchMetaDraft): DraftCheck {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const [label, v] of [
    ['Goles del local', d.homeScore],
    ['Goles del visitante', d.awayScore],
  ] as const) {
    if (v !== null && (!Number.isInteger(v) || v < 0 || v > 99)) {
      errors.push(`${label}: escribe un número entero entre 0 y 99.`);
    }
  }
  if ((d.homeScore === null) !== (d.awayScore === null)) {
    warnings.push('Falta uno de los dos marcadores: carga los goles de ambos equipos.');
  }

  const derived = deriveResult(d.homeScore, d.awayScore);
  if (d.finalResult && derived && d.finalResult !== derived) {
    warnings.push(
      `El resultado final (${RESULT_LABEL[d.finalResult]}) no coincide con el marcador (${d.homeScore} a ${d.awayScore} sería ${RESULT_LABEL[derived]}). Revisa cuál de los dos está mal.`
    );
  }
  if (d.status === 'FINALIZADO') {
    if (d.homeScore === null || d.awayScore === null) warnings.push('El partido está finalizado pero no tiene marcador.');
    if (!d.finalResult) warnings.push('El partido está finalizado pero no tiene resultado final: la web no podrá contar aciertos.');
  }
  if (d.status === 'EN ESPERA' && (d.finalResult || (d.homeScore ?? 0) > 0 || (d.awayScore ?? 0) > 0)) {
    warnings.push('El partido está "en espera" pero tiene marcador o resultado final.');
  }
  if (d.status === 'EN VIVO' && d.finalResult) {
    warnings.push('El partido está "en vivo" pero ya tiene resultado final.');
  }
  if (d.status === 'SUSPENDIDO' && d.finalResult) {
    warnings.push('Un partido suspendido se anula: normalmente no lleva resultado final.');
  }
  if (!d.status && d.finalResult) {
    warnings.push('Hay resultado final pero no se eligió el estado del partido.');
  }
  return { errors, warnings };
}

// ---------------------------------------------------------------------------
// Lectura cruda (para editar con fidelidad)
// ---------------------------------------------------------------------------

export interface MatchMetaRecord extends MatchMetaDraft {
  poolId: number;
  updatedAt: string | null;
}

export interface PoolOverrideRecord {
  poolId: number;
  title: string | null;
  prizeBs: number | null;
  ticketPriceBs: number | null;
  notes: string | null;
  updatedAt: string | null;
}

export interface ManualRaw {
  meta: MatchMetaRecord[];
  overrides: PoolOverrideRecord[];
  /** Mensaje en lenguaje sencillo si alguna lectura falló. */
  error: string | null;
}

type Raw = Record<string, unknown>;

const num = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const txt = (v: unknown): string | null => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);

function explainDbError(err: unknown, table: string): string {
  const e = err as { code?: string; message?: string } | null;
  const msg = e?.message ?? '';
  if (e?.code === 'PGRST205' || e?.code === '42P01' || /schema cache|does not exist/i.test(msg)) {
    return `La tabla "${table}" no existe en la base de datos. Avisa al equipo técnico (falta ejecutar la migración de la capa manual).`;
  }
  if (/failed to fetch|network/i.test(msg)) return 'No hay conexión con la base de datos. Revisa tu internet e inténtalo de nuevo.';
  if (e?.code === '42501' || /row-level security|policy/i.test(msg)) {
    return `La base de datos no permite guardar en "${table}". Avisa al equipo técnico.`;
  }
  return `No se pudo completar la operación en "${table}"${msg ? ` (${msg})` : ''}.`;
}

/** Lee los datos manuales directo de Supabase (sin pasar por la caché de /api/kinielas). */
export async function loadManualRaw(): Promise<ManualRaw> {
  const sb = getSupabase();
  if (!sb) return { meta: [], overrides: [], error: 'No hay conexión configurada con la base de datos.' };
  try {
    const [m, o] = await Promise.all([sb.from('match_meta').select('*'), sb.from('pool_overrides').select('*')]);
    const errors: string[] = [];
    if (m.error) errors.push(explainDbError(m.error, 'match_meta'));
    if (o.error) errors.push(explainDbError(o.error, 'pool_overrides'));

    const meta: MatchMetaRecord[] = m.error
      ? []
      : ((m.data ?? []) as Raw[]).flatMap((r) => {
          const poolId = num(r.pool_id);
          const homeTeamId = num(r.home_team_id);
          const awayTeamId = num(r.away_team_id);
          if (poolId === null || homeTeamId === null || awayTeamId === null) return [];
          const status = txt(r.status)?.toUpperCase() as MatchManualStatus | undefined;
          const fr = txt(r.final_result)?.toUpperCase() as FinalResult | undefined;
          const kickoff = txt(r.kickoff);
          return [
            {
              poolId,
              homeTeamId,
              awayTeamId,
              kickoff: kickoff && !Number.isNaN(new Date(kickoff).getTime()) ? new Date(kickoff).toISOString() : null,
              league: txt(r.league),
              status: status && MATCH_STATUSES.includes(status) ? status : null,
              homeScore: num(r.home_score),
              awayScore: num(r.away_score),
              minute: txt(r.minute),
              finalResult: fr === 'L' || fr === 'E' || fr === 'V' ? fr : null,
              updatedAt: txt(r.updated_at),
            },
          ];
        });

    const overrides: PoolOverrideRecord[] = o.error
      ? []
      : ((o.data ?? []) as Raw[]).flatMap((r) => {
          const poolId = num(r.pool_id);
          if (poolId === null) return [];
          return [
            {
              poolId,
              title: txt(r.title),
              prizeBs: num(r.prize_bs),
              ticketPriceBs: num(r.ticket_price_bs),
              notes: txt(r.notes),
              updatedAt: txt(r.updated_at),
            },
          ];
        });

    return { meta, overrides, error: errors.length ? errors.join(' ') : null };
  } catch (e) {
    return { meta: [], overrides: [], error: explainDbError(e, 'match_meta') };
  }
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

export interface PoolOverrideInput {
  title: string | null;
  prizeBs: number | null;
  ticketPriceBs: number | null;
  notes: string | null;
}

/** Guarda (o crea) los cambios manuales de una Kiniela. Si todo queda vacío, borra la fila. */
export async function savePoolOverride(poolId: number, input: PoolOverrideInput): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error('No hay conexión configurada con la base de datos.');
  const allEmpty =
    input.title === null && input.prizeBs === null && input.ticketPriceBs === null && input.notes === null;
  if (allEmpty) {
    await deletePoolOverride(poolId);
    return;
  }
  const { error } = await sb.from('pool_overrides').upsert({
    pool_id: poolId,
    title: input.title,
    prize_bs: input.prizeBs,
    ticket_price_bs: input.ticketPriceBs,
    notes: input.notes,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(explainDbError(error, 'pool_overrides'));
}

/** Quita los cambios manuales: la Kiniela vuelve a mostrar el dato automático. */
export async function deletePoolOverride(poolId: number): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error('No hay conexión configurada con la base de datos.');
  const { error } = await sb.from('pool_overrides').delete().eq('pool_id', poolId);
  if (error) throw new Error(explainDbError(error, 'pool_overrides'));
}

/**
 * Guarda los datos manuales de uno o varios partidos de una Kiniela.
 * Un partido sin ningún dato se borra de la tabla (queda "sin cargar").
 */
export async function saveMatchMeta(poolId: number, drafts: MatchMetaDraft[]): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error('No hay conexión configurada con la base de datos.');

  const now = new Date().toISOString();
  const toSave = drafts.filter((d) => !isEmptyDraft(d));
  const toClear = drafts.filter((d) => isEmptyDraft(d));

  if (toSave.length > 0) {
    const { error } = await sb.from('match_meta').upsert(
      toSave.map((d) => ({
        pool_id: poolId,
        home_team_id: d.homeTeamId,
        away_team_id: d.awayTeamId,
        kickoff: d.kickoff,
        league: d.league,
        status: d.status,
        home_score: d.homeScore,
        away_score: d.awayScore,
        minute: d.minute,
        final_result: d.finalResult,
        updated_at: now,
      })),
      { onConflict: 'pool_id,home_team_id,away_team_id' }
    );
    if (error) throw new Error(explainDbError(error, 'match_meta'));
  }

  for (const d of toClear) {
    await deleteMatchMeta(poolId, d.homeTeamId, d.awayTeamId);
  }
}

/** Borra los datos manuales de un partido. */
export async function deleteMatchMeta(poolId: number, homeTeamId: number, awayTeamId: number): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error('No hay conexión configurada con la base de datos.');
  const { error } = await sb
    .from('match_meta')
    .delete()
    .eq('pool_id', poolId)
    .eq('home_team_id', homeTeamId)
    .eq('away_team_id', awayTeamId);
  if (error) throw new Error(explainDbError(error, 'match_meta'));
}

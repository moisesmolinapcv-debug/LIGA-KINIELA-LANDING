// Tipos de la capa de datos de las Kinielas (endpoint + capa manual).
// Independiente de src/types/kiniela.ts (modelo legado del admin).

export type KinielaStatus = 'proxima' | 'abierta' | 'cerrada';

export type MatchManualStatus = 'EN ESPERA' | 'EN VIVO' | 'FINALIZADO' | 'SUSPENDIDO';

export type FinalResult = 'L' | 'E' | 'V';

export interface KinielaTeam {
  id: number;
  name: string;
  shortName: string;
  /** URL del escudo según el feed. null si el feed no la trae. */
  logoUrl: string | null;
}

/** Datos manuales de un partido (hoy Supabase, mañana API: ver ManualSource). */
export interface MatchManual {
  /** ISO 8601 UTC. */
  kickoff?: string;
  league?: string;
  status?: MatchManualStatus;
  homeScore?: number;
  awayScore?: number;
  minute?: string;
  finalResult?: FinalResult;
}

export interface KinielaMatch {
  /** Posición del par en el feed, base 1 (se conserva aunque otro par se descarte). */
  index: number;
  homeTeam: KinielaTeam;
  awayTeam: KinielaTeam;
  /** `${homeId}-${awayId}`: clave estable para enlazar la capa manual. */
  key: string;
  manual?: MatchManual;
}

/** Qué campos fueron sustituidos por un override manual del admin. */
export interface KinielaOverrides {
  title?: boolean;
  prizeBs?: boolean;
  ticketPriceBs?: boolean;
}

export interface Kiniela {
  /** id de pool del endpoint. */
  id: number;
  /** Nombre original del feed (puede traer emojis). */
  code: string;
  /** Nombre sin emojis (o el título del override manual). */
  name: string;
  ticketPriceBs: number;
  prizeBs: number;
  /** true solo si ticket_price es exactamente 0. */
  isFree: boolean;
  totalMatches: number;
  /** ISO UTC. Cadena vacía si el feed no trae una fecha válida (hay warning). */
  salesStart: string;
  salesFinish: string;
  /** salesFinish menos 60 s (D4). */
  closesAt: string;
  status: KinielaStatus;
  matches: KinielaMatch[];
  warnings: string[];
  overrides?: KinielaOverrides;
  /** Nota interna del admin (pool_overrides.notes). */
  notes?: string;
}

export interface KinielasResponse {
  kinielas: Kiniela[];
  /** ISO UTC del momento en que se obtuvo el dato bueno. */
  fetchedAt: string;
  source: 'live' | 'stale';
  stale: boolean;
}

export interface KinielasErrorResponse {
  error: string;
  message: string;
}

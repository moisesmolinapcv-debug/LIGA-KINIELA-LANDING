import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { KinielaDataState, KinielaEdition, Match, Winner, Banner, BannerSlide, SiteCopys } from '../types/kiniela';

// Clave única en LocalStorage para persistencia y sincronización
const LOCAL_STORAGE_KEY = 'liga_kiniela_store_v1';
export const KINIELA_UPDATE_EVENT = 'kiniela_update';

export const DEFAULT_COPYS: SiteCopys = {
  hero_title: 'KINIELA MILLONARIA',
  hero_subtitle: 'La emoción del fútbol nacional e internacional en una sola cartelera. Pronostica cada jornada, sigue los marcadores en tiempo real y sé el próximo en levantar el trofeo.',
  hero_badge_tag: 'Pronósticos Oficiales',
  hero_countdown_label: 'Tiempo restante para el cierre de jugadas',
  hero_prize_title: 'Gran Premio Acumulado',
  hero_prize_desc: 'Monto oficial garantizado para esta edición',
  hero_ticket_title: 'Precio del Ticket',
  hero_ticket_desc: 'Valor por cada combinación pronosticada',

  matches_badge: 'Cartelera Oficial de Pronósticos',
  matches_title: 'Encuentros de la Jornada',
  matches_subtitle: 'Sigue el marcador y el estatus en tiempo real de cada uno de los partidos seleccionados para esta edición.',

  winners_badge: 'Transparencia & Cumplimiento',
  winners_title: 'Salón de Campeones',
  winners_subtitle: 'Conoce a los ganadores que acertaron sus pronósticos y se llevaron el pozo acumulado. En Liga Kiniela premiamos el conocimiento futbolístico de cada venezolano.',

  rules_badge: 'Transparencia Total',
  rules_title: '¿Cómo Participar en Liga Kiniela?',
  rules_subtitle: 'Conoce los sencillos pasos para registrar tu jugada y consultar las respuestas a las dudas más comunes.',

  allies_badge: 'Red de Casas Autorizadas',
  allies_title: '¿Dónde Jugar?',
  allies_subtitle: 'Liga Kiniela está inmersa en las casas de apuestas más importantes, serias y confiables de Venezuela. Revisa si está disponible en tu plataforma de confianza y participa directamente.',
};

// Configuración de Supabase
const envUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
const rawSupabaseUrl =
  envUrl && !envUrl.includes('tu-proyecto') && !envUrl.includes('your-project')
    ? envUrl
    : 'https://jktczyeazlzmcedkfmhi.supabase.co';

const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

const envKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/^['"]|['"]$/g, '');
const supabaseAnonKey =
  envKey && !envKey.includes('tu-anon') && envKey.length > 20
    ? envKey
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdGN6eWVhemx6bWNlZGtmbWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODAwMTgsImV4cCI6MjEwNTY1NjAxOH0.0dXHtQ03cEkIm1Vyjq4Glx3IUSiEaWJbk_JdkaON4k4';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 20
  );
};

/** Credenciales públicas (anon) para lecturas REST en el servidor (ver banners-server.ts). */
export const getSupabaseRestConfig = () => ({ ok: isSupabaseConfigured(), url: supabaseUrl, key: supabaseAnonKey });

export const getSupabase = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;
  if (isSupabaseConfigured()) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return supabaseInstance;
    } catch (error) {
      console.warn('[LigaKiniela] Error al inicializar cliente Supabase:', error);
    }
  }
  return null;
};

let supabaseInstance: SupabaseClient | null = null;
if (isSupabaseConfigured()) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  } catch (error) {
    console.warn('[LigaKiniela] Error al inicializar cliente Supabase:', error);
  }
}

// Semilla inicial por defecto. Sin banners ni montos de ejemplo (Q12): los montos salen
// del endpoint oficial y los banners/campeones los carga el cliente desde el panel.
export const getDefaultSeed = (): KinielaDataState => {
  const now = new Date();

  return {
    // Edición antigua (la web ya no la usa). Valores neutros: sin títulos ni montos inventados.
    edition: {
      id: 'edition-default',
      title: '',
      edition_number: '',
      ticket_price_usd: 0,
      ticket_price_bs: 0,
      prize_amount_usd: 0,
      prize_amount_bs: 0,
      start_date: now.toISOString(),
      end_date: now.toISOString(),
      is_active: true,
      created_at: now.toISOString(),
    },
    matches: [],
    winners: [],
    banner: null,
    banners: [],
    copys: DEFAULT_COPYS,
    source: 'local',
    lastUpdated: now.toISOString(),
  };
};

// ============================================================================
// HELPERS LOCALES Y EVENTOS
// ============================================================================

const readLocalData = (): KinielaDataState => {
  if (typeof window === 'undefined') {
    return getDefaultSeed();
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initialSeed = getDefaultSeed();
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    const parsed = JSON.parse(raw) as KinielaDataState;
    
    // Auto-migración: listas ausentes en copias antiguas (sin sembrar ejemplos)
    if (!Array.isArray(parsed.banners)) parsed.banners = [];
    if (!Array.isArray(parsed.winners)) parsed.winners = [];
    if (!Array.isArray(parsed.matches)) parsed.matches = [];
    if (!parsed.edition) parsed.edition = getDefaultSeed().edition;

    // Auto-migración si no existían copys en LocalStorage
    if (!parsed.copys) {
      parsed.copys = DEFAULT_COPYS;
    }

    return parsed;
  } catch (error) {
    console.warn('[LigaKiniela] Error leyendo LocalStorage, usando seed inicial:', error);
    return getDefaultSeed();
  }
};

const writeLocalData = (data: KinielaDataState): void => {
  if (typeof window === 'undefined') return;

  try {
    data.lastUpdated = new Date().toISOString();
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    // Disparar evento personalizado para la pestaña actual
    window.dispatchEvent(new CustomEvent(KINIELA_UPDATE_EVENT, { detail: data }));
  } catch (error) {
    console.error('[LigaKiniela] Error escribiendo en LocalStorage:', error);
  }
};

/**
 * Suscripción reactiva para componentes React.
 * Permite escuchar tanto el evento personalizado local como cambios de almacenamiento entre pestañas.
 */
export const subscribeToKiniela = (callback: (data: KinielaDataState) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<KinielaDataState>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      getKinielaData().then(callback);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
      try {
        const updated = JSON.parse(e.newValue);
        callback(updated);
      } catch (err) {
        console.error(err);
      }
    }
  };

  window.addEventListener(KINIELA_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(KINIELA_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
};

// ============================================================================
// FUNCIONES CRUD EXPORTADAS (MODO HÍBRIDO SUPABASE + LOCALSTORAGE)
// ============================================================================

/**
 * Obtiene el estado completo del panel y de la landing (banners y campeones).
 * Prioriza Supabase; solo recurre a LocalStorage si la base no responde.
 * Con Supabase como fuente, los banners son SIEMPRE los de la base (aunque no haya ninguno):
 * así borrar el último banner no hace reaparecer copias viejas del navegador.
 */
export const getKinielaData = async (): Promise<KinielaDataState> => {
  const client = getSupabase();
  if (client) {
    try {
      const [editionsRes, matchesRes, winnersRes, bannersRes] = await Promise.all([
        client.from('kiniela_editions').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(1),
        client.from('matches').select('*').order('sort_order', { ascending: true }),
        client.from('winners').select('*').order('created_at', { ascending: false }),
        client.from('banners').select('*').order('sort_order', { ascending: true }),
      ]);

      // Los banners y campeones son lo que importa: si esas lecturas fallan, se usa la copia local.
      if (!winnersRes.error && !bannersRes.error) {
        const banners = ((bannersRes.data as unknown as BannerSlide[]) || []).slice();
        const state: KinielaDataState = {
          edition:
            editionsRes.data && editionsRes.data.length > 0
              ? (editionsRes.data[0] as KinielaEdition)
              : getDefaultSeed().edition,
          matches: matchesRes.error ? [] : ((matchesRes.data as Match[]) || []),
          winners: (winnersRes.data as Winner[]) || [],
          banners,
          banner: banners.length > 0 ? (banners[0] as unknown as Banner) : null,
          source: 'supabase',
          lastUpdated: new Date().toISOString(),
        };

        // Guardar espejo local para fallback ultra rápido
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
          } catch (e) {
            // Ignorar límite de almacenamiento
          }
        }
        return state;
      }
      console.warn('[LigaKiniela] Supabase respondió con error, recurriendo a LocalStorage:', winnersRes.error || bannersRes.error);
    } catch (err) {
      console.warn('[LigaKiniela] Falla consultando Supabase, recurriendo a LocalStorage:', err);
    }
  }

  const localState = readLocalData();
  localState.source = 'local';
  return localState;
};

// ----------------------------------------------------------------------------
// Escrituras de banners y campeones: si Supabase está configurado, un fallo se
// REPORTA (no se guarda "en silencio" en el navegador, porque el público no lo vería).
// ----------------------------------------------------------------------------

const describeError = (err: unknown): string => {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'error desconocido';
};

/** Vuelve a leer la base y avisa a quienes escuchan (el panel), para no depender de copias viejas. */
const syncFromSupabase = async (): Promise<KinielaDataState> => {
  const fresh = await getKinielaData();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(KINIELA_UPDATE_EVENT, { detail: fresh }));
  }
  return fresh;
};

/**
 * Añade un banner al carrusel.
 * Solo se guardan la descripción, las dos imágenes, el orden y si está activo.
 */
export const addBannerSlide = async (slideData: Omit<BannerSlide, 'id'>): Promise<BannerSlide> => {
  const client = getSupabase();

  if (client) {
    const current = await getKinielaData();
    const nextOrder = (current.banners || []).reduce((max, b) => Math.max(max, b.sort_order || 0), 0) + 1;
    const payload = {
      title: slideData.title,
      image_url: slideData.image_url,
      image_url_mobile: slideData.image_url_mobile || null,
      target_link: '#',
      is_active: slideData.is_active ?? true,
      sort_order: slideData.sort_order || nextOrder,
    };
    const { data, error } = await client.from('banners').insert([payload]).select().single();
    if (error || !data) throw new Error('No se pudo crear el banner: ' + describeError(error));
    await syncFromSupabase();
    return data as BannerSlide;
  }

  const current = readLocalData();
  const newSlide: BannerSlide = {
    ...slideData,
    id: 'slide-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    created_at: new Date().toISOString(),
  };
  current.banners = [...(current.banners || []), newSlide];
  current.source = 'local';
  writeLocalData(current);
  return newSlide;
};

/**
 * Actualiza un banner existente.
 */
export const updateBannerSlide = async (id: string, update: Partial<BannerSlide>): Promise<BannerSlide> => {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client.from('banners').update(update).eq('id', id).select().single();
    if (error || !data) throw new Error('No se pudo actualizar el banner: ' + describeError(error));
    await syncFromSupabase();
    return data as BannerSlide;
  }

  const current = readLocalData();
  const index = (current.banners || []).findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Banner con id ' + id + ' no encontrado.');
  const updated: BannerSlide = { ...current.banners[index], ...update };
  current.banners[index] = updated;
  current.source = 'local';
  writeLocalData(current);
  return updated;
};

/**
 * Cambia el orden de varios banners a la vez (cada par es id + nueva posición).
 */
export const reorderBannerSlides = async (orders: { id: string; sort_order: number }[]): Promise<void> => {
  const client = getSupabase();
  if (client) {
    const results = await Promise.all(
      orders.map((o) => client.from('banners').update({ sort_order: o.sort_order }).eq('id', o.id))
    );
    const failed = results.find((r) => r.error);
    if (failed) throw new Error('No se pudo cambiar el orden: ' + describeError(failed.error));
    await syncFromSupabase();
    return;
  }

  const current = readLocalData();
  current.banners = (current.banners || []).map((b) => {
    const o = orders.find((x) => x.id === b.id);
    return o ? { ...b, sort_order: o.sort_order } : b;
  });
  current.source = 'local';
  writeLocalData(current);
};

/**
 * Elimina un banner del carrusel.
 */
export const deleteBannerSlide = async (id: string): Promise<boolean> => {
  const client = getSupabase();

  if (client) {
    const { error } = await client.from('banners').delete().eq('id', id);
    if (error) throw new Error('No se pudo eliminar el banner: ' + describeError(error));
    await syncFromSupabase();
    return true;
  }

  const current = readLocalData();
  current.banners = (current.banners || []).filter((s) => s.id !== id);
  current.source = 'local';
  writeLocalData(current);
  return true;
};

/**
 * Añade un ganador al Salón de Campeones.
 */
export const addWinner = async (winnerData: Omit<Winner, 'id'>): Promise<Winner> => {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client.from('winners').insert([winnerData]).select().single();
    if (error || !data) throw new Error('No se pudo registrar el campeón: ' + describeError(error));
    await syncFromSupabase();
    return data as Winner;
  }

  const current = readLocalData();
  const newWinner: Winner = {
    ...winnerData,
    id: 'win-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString(),
  };
  current.winners.unshift(newWinner);
  current.source = 'local';
  writeLocalData(current);
  return newWinner;
};

/**
 * Elimina un ganador por ID.
 */
export const deleteWinner = async (id: string): Promise<boolean> => {
  const client = getSupabase();

  if (client) {
    const { error } = await client.from('winners').delete().eq('id', id);
    if (error) throw new Error('No se pudo eliminar el campeón: ' + describeError(error));
    await syncFromSupabase();
    return true;
  }

  const current = readLocalData();
  current.winners = current.winners.filter((w) => w.id !== id);
  current.source = 'local';
  writeLocalData(current);
  return true;
};

/**
 * Actualiza un ganador existente.
 */
export const updateWinner = async (id: string, winnerUpdate: Partial<Winner>): Promise<Winner> => {
  const client = getSupabase();

  if (client) {
    const { data, error } = await client.from('winners').update(winnerUpdate).eq('id', id).select().single();
    if (error || !data) throw new Error('No se pudo actualizar el campeón: ' + describeError(error));
    await syncFromSupabase();
    return data as Winner;
  }

  const current = readLocalData();
  const existing = current.winners.find((w) => w.id === id);
  const updated: Winner = { ...(existing || ({} as Winner)), ...winnerUpdate, id };
  current.winners = current.winners.map((w) => (w.id === id ? updated : w));
  current.source = 'local';
  writeLocalData(current);
  return updated;
};

// ----------------------------------------------------------------------------
// Textos antiguos (site_copys): solo lectura y borrado para que el cliente los revise (Q16).
// ----------------------------------------------------------------------------

export interface StoredCopys {
  /** ok = la tabla existe; missing = la tabla no existe en la base; error = no se pudo leer. */
  database: { status: 'ok' | 'missing' | 'error'; values: Record<string, string>; message?: string };
  /** Textos de este navegador que difieren de los de fábrica. */
  browser: Record<string, string>;
}

const COPYS_META_KEYS = ['id', 'created_at', 'updated_at'];

export const loadStoredCopys = async (): Promise<StoredCopys> => {
  const result: StoredCopys = { database: { status: 'ok', values: {} }, browser: {} };

  const client = getSupabase();
  if (!client) {
    result.database = { status: 'error', values: {}, message: 'No hay conexión configurada con la base de datos.' };
  } else {
    try {
      const { data, error } = await client.from('site_copys').select('*');
      if (error) {
        const msg = describeError(error);
        const code = (error as { code?: string }).code;
        const missing = code === 'PGRST205' || code === '42P01' || /schema cache|does not exist/i.test(msg);
        result.database = { status: missing ? 'missing' : 'error', values: {}, message: msg };
      } else {
        const values: Record<string, string> = {};
        for (const row of (data || []) as Record<string, unknown>[]) {
          for (const [k, v] of Object.entries(row)) {
            if (COPYS_META_KEYS.includes(k)) continue;
            if (typeof v === 'string' && v.trim() !== '') values[k] = v;
          }
        }
        result.database = { status: 'ok', values };
      }
    } catch (err) {
      result.database = { status: 'error', values: {}, message: describeError(err) };
    }
  }

  const local = readLocalData().copys;
  if (local) {
    for (const [k, v] of Object.entries(local)) {
      const def = (DEFAULT_COPYS as Record<string, string | undefined>)[k];
      if (typeof v === 'string' && v.trim() !== '' && v !== def) result.browser[k] = v;
    }
  }
  return result;
};

/** Borra los textos guardados: la fila de la base (si existe la tabla) y los cambios de este navegador. */
export const deleteStoredCopys = async (): Promise<void> => {
  const client = getSupabase();
  if (client) {
    const { error } = await client.from('site_copys').delete().eq('id', 'main_copys');
    const code = error ? (error as { code?: string }).code : undefined;
    const missing = code === 'PGRST205' || code === '42P01';
    if (error && !missing) throw new Error('No se pudieron borrar los textos de la base: ' + describeError(error));
  }
  const current = readLocalData();
  current.copys = DEFAULT_COPYS;
  writeLocalData(current);
};

/**
 * Formatea un monto numérico directamente en Bolívares (Bs)
 * Ejemplo: 1500000 -> "1.500.000 Bs", 1000 -> "1.000 Bs"
 */
export const formatBs = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 Bs';
  }
  return new Intl.NumberFormat('es-VE').format(amount) + ' Bs';
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { KinielaDataState, KinielaEdition, Match, Winner, Banner, BannerSlide, SiteCopys } from '../types/kiniela';

// Clave única en LocalStorage para persistencia y sincronización
const LOCAL_STORAGE_KEY = 'liga_kiniela_store_v1';
export const KINIELA_UPDATE_EVENT = 'kiniela_update';

export const DEFAULT_COPYS: SiteCopys = {
  hero_title: 'KINIELA MILLONARIA - UEFA NATIONS',
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

// Semilla inicial por defecto (Seed Data)
export const getDefaultSeed = (): KinielaDataState => {
  const now = new Date();

  return {
    edition: {
      id: 'f5141dac-6248-48d8-9626-0ae9cce4c3fe',
      title: 'KINIELA MILLONARIA - UEFA NATIONS',
      edition_number: 'Edición #25',
      ticket_price_usd: 0,
      ticket_price_bs: 1000,
      prize_amount_usd: 0,
      prize_amount_bs: 1500000,
      start_date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      end_date: '2026-09-27T14:45:00-04:00',
      is_active: true,
      created_at: now.toISOString(),
    },
    matches: [
      {
        id: 'match-1',
        edition_id: 'edition-default-24',
        home_team: 'Alemania',
        away_team: 'Grecia',
        home_logo: 'https://api.iconify.design/twemoji:flag-germany.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-greece.svg',
        match_date: '2026-09-27T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 1,
      },
      {
        id: 'match-2',
        edition_id: 'edition-default-24',
        home_team: 'Noruega',
        away_team: 'Portugal',
        home_logo: 'https://api.iconify.design/twemoji:flag-norway.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-portugal.svg',
        match_date: '2026-09-27T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 2,
      },
      {
        id: 'match-3',
        edition_id: 'edition-default-24',
        home_team: 'Israel',
        away_team: 'Irlanda',
        home_logo: 'https://api.iconify.design/twemoji:flag-israel.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-ireland.svg',
        match_date: '2026-09-27T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 3,
      },
      {
        id: 'match-4',
        edition_id: 'edition-default-24',
        home_team: 'Georgia',
        away_team: 'Ucrania',
        home_logo: 'https://api.iconify.design/twemoji:flag-georgia.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-ukraine.svg',
        match_date: '2026-09-28T12:00:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 4,
      },
      {
        id: 'match-5',
        edition_id: 'edition-default-24',
        home_team: 'Armenia',
        away_team: 'Montenegro',
        home_logo: 'https://api.iconify.design/twemoji:flag-armenia.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-montenegro.svg',
        match_date: '2026-09-28T12:00:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 5,
      },
      {
        id: 'match-6',
        edition_id: 'edition-default-24',
        home_team: 'Bélgica',
        away_team: 'Francia',
        home_logo: 'https://api.iconify.design/twemoji:flag-belgium.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-france.svg',
        match_date: '2026-09-28T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 6,
      },
      {
        id: 'match-7',
        edition_id: 'edition-default-24',
        home_team: 'Turquía',
        away_team: 'Italia',
        home_logo: 'https://api.iconify.design/twemoji:flag-turkey.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-italy.svg',
        match_date: '2026-09-28T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 7,
      },
      {
        id: 'match-8',
        edition_id: 'edition-default-24',
        home_team: 'Suecia',
        away_team: 'Polonia',
        home_logo: 'https://api.iconify.design/twemoji:flag-sweden.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-poland.svg',
        match_date: '2026-09-28T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 8,
      },
      {
        id: 'match-9',
        edition_id: 'edition-default-24',
        home_team: 'Rumania',
        away_team: 'Bosnia',
        home_logo: 'https://api.iconify.design/twemoji:flag-romania.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-bosnia-and-herzegovina.svg',
        match_date: '2026-09-28T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 9,
      },
      {
        id: 'match-10',
        edition_id: 'edition-default-24',
        home_team: 'Irlanda',
        away_team: 'Hungría',
        home_logo: 'https://api.iconify.design/twemoji:flag-ireland.svg',
        away_logo: 'https://api.iconify.design/twemoji:flag-hungary.svg',
        match_date: '2026-09-28T14:45:00-04:00',
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
        sort_order: 10,
      },
    ],
    winners: [
      {
        id: 'win-1',
        edition_title: 'Edición #23 - Champions & Vinotinto',
        winner_name: 'Carlos Mendoza',
        prize_won: '1.500.000 Bs (Acumulado)',
        winning_date: '15 Septiembre 2026',
        city: 'Caracas, Dto. Capital',
        is_recent: true,
      },
      {
        id: 'win-2',
        edition_title: 'Edición #22 - Clásico de Fin de Semana',
        winner_name: 'Yorvis Silva',
        prize_won: '800.000 Bs (1er Lugar)',
        winning_date: '08 Septiembre 2026',
        city: 'Maracaibo, Zulia',
        is_recent: true,
      },
      {
        id: 'win-3',
        edition_title: 'Edición #21 - Kiniela Dominguera',
        winner_name: 'Mariela Hernández',
        prize_won: '1.200.000 Bs (Acumulado)',
        winning_date: '01 Septiembre 2026',
        city: 'Barquisimeto, Lara',
        is_recent: true,
      },
      {
        id: 'win-4',
        edition_title: 'Edición #20 - Copa Conmebol',
        winner_name: 'Jesús R. Zambrano',
        prize_won: '1.500.000 Bs (Acumulado)',
        winning_date: '25 Agosto 2026',
        city: 'Valencia, Carabobo',
        is_recent: false,
      },
      {
        id: 'win-5',
        edition_title: 'Edición #19 - Liga Futve & Europa',
        winner_name: 'Andrés E. Colmenárez',
        prize_won: '650.000 Bs (1er Lugar)',
        winning_date: '18 Agosto 2026',
        city: 'San Cristóbal, Táchira',
        is_recent: false,
      },
    ],
    banner: {
      id: 'banner-default-1',
      title: '¡Gran Pozo Acumulado de 1.500.000 Bs! Participa por solo 1.000 Bs',
      image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&h=600&q=85',
      target_link: '#',
      is_active: true,
    },
    banners: [
      {
        id: 'slide-1',
        title: '¡Gran Pozo Acumulado de 1.500.000 Bs! Participa por solo 1.000 Bs',
        image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1920&h=650&q=85',
        image_url_mobile: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1080&h=1250&q=85',
        button_text: 'Ver Cartelera de Partidos →',
        target_section: '#partidos',
        is_active: true,
        sort_order: 1,
        created_at: now.toISOString(),
      },
      {
        id: 'slide-2',
        title: 'La Emoción del Fútbol: Vinotinto, Libertadores y Clásicos Europeos',
        image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&h=650&q=85',
        image_url_mobile: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1080&h=1250&q=85',
        button_text: 'Consultar Premios →',
        target_section: '#premios',
        is_active: true,
        sort_order: 2,
        created_at: now.toISOString(),
      },
      {
        id: 'slide-3',
        title: 'Salón de Campeones: Transparencia y Premios Garantizados',
        image_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&h=650&q=85',
        image_url_mobile: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1080&h=1250&q=85',
        button_text: 'Conoce los Ganadores →',
        target_section: '#campeones',
        is_active: true,
        sort_order: 3,
        created_at: now.toISOString(),
      },
    ],
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
    
    // Auto-migración si no existía la lista de banners en LocalStorage
    if (!Array.isArray(parsed.banners) || parsed.banners.length === 0) {
      parsed.banners = getDefaultSeed().banners;
      writeLocalData(parsed);
    }

    // Auto-migración si no existían copys en LocalStorage
    if (!parsed.copys) {
      parsed.copys = DEFAULT_COPYS;
      writeLocalData(parsed);
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
 * Obtiene el estado completo de la Kiniela:
 * Prioriza Supabase si está disponible; de lo contrario o ante falla, devuelve LocalStorage.
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

      const hasEdition = editionsRes.data && editionsRes.data.length > 0;
      if (hasEdition) {
        const localBanners = readLocalData().banners;
        const fetchedBanners = (bannersRes.data as unknown as BannerSlide[]) || [];
        const state: KinielaDataState = {
          edition: editionsRes.data[0] as KinielaEdition,
          matches: (matchesRes.data as Match[]) || [],
          winners: (winnersRes.data as Winner[]) || [],
          banners: fetchedBanners.length > 0 ? fetchedBanners : localBanners,
          banner: (bannersRes.data && bannersRes.data[0] ? (bannersRes.data[0] as unknown as Banner) : null),
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
    } catch (err) {
      console.warn('[LigaKiniela] Falla consultando Supabase, recurriendo a LocalStorage:', err);
    }
  }

  const localState = readLocalData();
  localState.source = 'local';
  return localState;
};

/**
 * Actualiza la edición actual (Títulos, precios, fechas, pozo acumulado).
 */
export const updateEdition = async (editionUpdate: Partial<KinielaEdition>): Promise<KinielaEdition> => {
  const current = readLocalData();
  const updatedEdition: KinielaEdition = {
    ...current.edition,
    ...editionUpdate,
  };

  const client = getSupabase();
  if (client) {
    try {
      const query = client.from('kiniela_editions').update(editionUpdate);
      const { data, error } =
        updatedEdition.id && !updatedEdition.id.startsWith('edition-default')
          ? await query.eq('id', updatedEdition.id).select().single()
          : await query.eq('is_active', true).select().single();

      if (!error && data) {
        current.edition = data as KinielaEdition;
        current.source = 'supabase';
        writeLocalData(current);
        return data as KinielaEdition;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al actualizar edición en Supabase, aplicando fallback local:', err);
    }
  }

  current.edition = updatedEdition;
  current.source = 'local';
  writeLocalData(current);
  return updatedEdition;
};

/**
 * Añade un nuevo encuentro deportivo a la cartelera.
 */
export const addMatch = async (matchData: Omit<Match, 'id'>): Promise<Match> => {
  const current = readLocalData();

  const client = getSupabase();
  if (client) {
    try {
      let targetEditionId = matchData.edition_id || current.edition.id;
      if (!targetEditionId || targetEditionId.startsWith('edition-default')) {
        targetEditionId = 'f5141dac-6248-48d8-9626-0ae9cce4c3fe';
      }
      const payload = {
        ...matchData,
        edition_id: targetEditionId,
      };
      const { data, error } = await client
        .from('matches')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        const newMatch = data as Match;
        current.matches.push(newMatch);
        current.source = 'supabase';
        writeLocalData(current);
        return newMatch;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al insertar partido en Supabase, aplicando fallback local:', err);
    }
  }

  const newMatch: Match = {
    ...matchData,
    id: 'match-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    edition_id: matchData.edition_id || current.edition.id,
    created_at: new Date().toISOString(),
  };

  current.matches.push(newMatch);
  current.source = 'local';
  writeLocalData(current);
  return newMatch;
};

/**
 * Actualiza un encuentro deportivo existente (estado, marcador, minuto, nombres).
 */
export const updateMatch = async (id: string, matchUpdate: Partial<Match>): Promise<Match> => {
  const current = readLocalData();
  const matchIndex = current.matches.findIndex((m) => m.id === id);

  if (supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('matches')
        .update(matchUpdate)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updated = data as Match;
        if (matchIndex !== -1) {
          current.matches[matchIndex] = updated;
        }
        current.source = 'supabase';
        writeLocalData(current);
        return updated;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al actualizar partido en Supabase, aplicando fallback local:', err);
    }
  }

  if (matchIndex === -1) {
    throw new Error(`Encuentro con id ${id} no encontrado.`);
  }

  const updatedMatch: Match = {
    ...current.matches[matchIndex],
    ...matchUpdate,
  };

  current.matches[matchIndex] = updatedMatch;
  current.source = 'local';
  writeLocalData(current);
  return updatedMatch;
};

/**
 * Elimina un partido de la cartelera.
 */
export const deleteMatch = async (id: string): Promise<boolean> => {
  const current = readLocalData();

  if (supabaseInstance) {
    try {
      const { error } = await supabaseInstance.from('matches').delete().eq('id', id);
      if (!error) {
        current.matches = current.matches.filter((m) => m.id !== id);
        current.source = 'supabase';
        writeLocalData(current);
        return true;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al eliminar partido en Supabase, aplicando fallback local:', err);
    }
  }

  current.matches = current.matches.filter((m) => m.id !== id);
  current.source = 'local';
  writeLocalData(current);
  return true;
};

/**
 * Actualiza o reemplaza el banner publicitario activo.
 */
export const updateBanner = async (bannerUpdate: Partial<Banner>): Promise<Banner> => {
  const current = readLocalData();
  const existingBanner = current.banner || {
    id: 'banner-default-1',
    title: '¡Pozo Millonario!',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    target_link: '#',
    is_active: true,
  };

  const updatedBanner: Banner = {
    ...existingBanner,
    ...bannerUpdate,
  };

  if (supabaseInstance && updatedBanner.id) {
    try {
      const { data, error } = await supabaseInstance
        .from('banners')
        .upsert(updatedBanner)
        .select()
        .single();

      if (!error && data) {
        current.banner = data as Banner;
        current.source = 'supabase';
        writeLocalData(current);
        return data as Banner;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al actualizar banner en Supabase, aplicando fallback local:', err);
    }
  }

  current.banner = updatedBanner;
  current.source = 'local';
  writeLocalData(current);
  return updatedBanner;
};

/**
 * Añade un nuevo slide al Hero Billboard Slider.
 */
export const addBannerSlide = async (slideData: Omit<BannerSlide, 'id'>): Promise<BannerSlide> => {
  const current = readLocalData();
  const client = getSupabase();

  if (client) {
    try {
      const payload = {
        title: slideData.title,
        image_url: slideData.image_url,
        image_url_mobile: slideData.image_url_mobile || slideData.image_url,
        button_text: slideData.button_text || 'Ver Partidos →',
        target_section: slideData.target_section || '#partidos',
        target_link: '#',
        is_active: slideData.is_active ?? true,
        sort_order: slideData.sort_order || ((current.banners || []).length + 1),
      };

      const { data, error } = await client
        .from('banners')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        const createdSlide = data as BannerSlide;
        current.banners = [...(current.banners || []), createdSlide];
        current.source = 'supabase';
        writeLocalData(current);
        return createdSlide;
      } else if (error) {
        console.warn('[LigaKiniela] Error al crear banner en Supabase:', error);
      }
    } catch (err) {
      console.warn('[LigaKiniela] Excepción al crear banner en Supabase, aplicando fallback local:', err);
    }
  }

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
 * Actualiza un slide existente del Hero Billboard Slider.
 */
export const updateBannerSlide = async (id: string, update: Partial<BannerSlide>): Promise<BannerSlide> => {
  const current = readLocalData();
  const client = getSupabase();

  if (client && !id.startsWith('slide-default')) {
    try {
      const { data, error } = await client
        .from('banners')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updatedSlide = data as BannerSlide;
        const index = (current.banners || []).findIndex((s) => s.id === id);
        if (index !== -1) {
          current.banners[index] = updatedSlide;
        } else {
          current.banners = [...(current.banners || []), updatedSlide];
        }
        current.source = 'supabase';
        writeLocalData(current);
        return updatedSlide;
      } else if (error) {
        console.warn('[LigaKiniela] Error al actualizar banner en Supabase:', error);
      }
    } catch (err) {
      console.warn('[LigaKiniela] Excepción al actualizar banner en Supabase:', err);
    }
  }

  const index = (current.banners || []).findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Banner con id ${id} no encontrado.`);
  }

  const updated: BannerSlide = {
    ...current.banners[index],
    ...update,
  };

  current.banners[index] = updated;
  current.source = 'local';
  writeLocalData(current);
  return updated;
};

/**
 * Elimina un slide del Hero Billboard Slider.
 */
export const deleteBannerSlide = async (id: string): Promise<boolean> => {
  const current = readLocalData();
  const client = getSupabase();

  if (client && !id.startsWith('slide-default')) {
    try {
      const { error } = await client.from('banners').delete().eq('id', id);
      if (error) {
        console.warn('[LigaKiniela] Error al eliminar banner en Supabase:', error);
      }
    } catch (err) {
      console.warn('[LigaKiniela] Excepción al eliminar banner en Supabase:', err);
    }
  }

  current.banners = (current.banners || []).filter((s) => s.id !== id);
  current.source = 'supabase';
  writeLocalData(current);
  return true;
};

/**
 * Añade un ganador al Salón de Campeones.
 */
export const addWinner = async (winnerData: Omit<Winner, 'id'>): Promise<Winner> => {
  const current = readLocalData();

  if (supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('winners')
        .insert([winnerData])
        .select()
        .single();

      if (!error && data) {
        const newWinner = data as Winner;
        current.winners.unshift(newWinner);
        current.source = 'supabase';
        writeLocalData(current);
        return newWinner;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al registrar ganador en Supabase, aplicando fallback local:', err);
    }
  }

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
  const current = readLocalData();

  if (supabaseInstance) {
    try {
      const { error } = await supabaseInstance.from('winners').delete().eq('id', id);
      if (!error) {
        current.winners = current.winners.filter((w) => w.id !== id);
        current.source = 'supabase';
        writeLocalData(current);
        return true;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al eliminar ganador en Supabase, aplicando fallback local:', err);
    }
  }

  current.winners = current.winners.filter((w) => w.id !== id);
  current.source = 'local';
  writeLocalData(current);
  return true;
};

/**
 * Actualiza un ganador existente.
 */
export const updateWinner = async (id: string, winnerUpdate: Partial<Winner>): Promise<Winner> => {
  const current = readLocalData();

  if (supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('winners')
        .update(winnerUpdate)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        const updated = data as Winner;
        current.winners = current.winners.map((w) => (w.id === id ? updated : w));
        current.source = 'supabase';
        writeLocalData(current);
        return updated;
      }
    } catch (err) {
      console.warn('[LigaKiniela] Error al actualizar ganador en Supabase, aplicando fallback local:', err);
    }
  }

  const existing = current.winners.find((w) => w.id === id);
  const updated: Winner = {
    ...(existing || ({} as Winner)),
    ...winnerUpdate,
    id,
  };

  current.winners = current.winners.map((w) => (w.id === id ? updated : w));
  current.source = 'local';
  writeLocalData(current);
  return updated;
};

/**
 * Actualiza los textos y copys de los módulos de la web.
 */
export const updateSiteCopys = async (copysUpdate: Partial<SiteCopys>): Promise<SiteCopys> => {
  const current = readLocalData();
  const updatedCopys: SiteCopys = {
    ...(current.copys || DEFAULT_COPYS),
    ...copysUpdate,
  };
  current.copys = updatedCopys;
  writeLocalData(current);

  if (supabaseInstance) {
    try {
      await supabaseInstance
        .from('site_copys')
        .upsert({ id: 'main_copys', ...updatedCopys });
    } catch {
      // Fallback a LocalStorage garantizado
    }
  }

  return updatedCopys;
};

/**
 * Restablece todos los datos al estado de prueba por defecto.
 */
export const resetToDefault = async (): Promise<KinielaDataState> => {
  const freshSeed = getDefaultSeed();
  writeLocalData(freshSeed);
  return freshSeed;
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


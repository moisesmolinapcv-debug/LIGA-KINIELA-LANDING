export type MatchStatus = 'EN ESPERA' | 'EN VIVO' | 'FINALIZADO';

export interface KinielaEdition {
  id: string;
  title: string;
  edition_number: string;
  ticket_price_usd: number;
  ticket_price_bs: number;
  prize_amount_usd: number;
  prize_amount_bs: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at?: string;
}

export interface Match {
  id: string;
  edition_id?: string;
  home_team: string;
  away_team: string;
  home_logo: string;
  away_logo: string;
  match_date: string;
  status: MatchStatus;
  home_score: number;
  away_score: number;
  minute: string;
  sort_order: number;
  created_at?: string;
}

export interface Winner {
  id: string;
  edition_title: string;
  winner_name: string;
  prize_won: string;
  winning_date: string;
  city: string;
  is_recent: boolean;
  created_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  target_link: string;
  is_active: boolean;
  created_at?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  image_url: string; // Panorámica para escritorio (21:9 o 16:6)
  image_url_mobile?: string; // Vertical/cuadrada para móvil (4:5 o 1:1)
  button_text?: string;
  target_section?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface SiteCopys {
  // Hero
  hero_title?: string;
  hero_subtitle?: string;
  hero_badge_tag?: string;
  hero_countdown_label?: string;
  hero_prize_title?: string;
  hero_prize_desc?: string;
  hero_ticket_title?: string;
  hero_ticket_desc?: string;

  // Partidos
  matches_badge?: string;
  matches_title?: string;
  matches_subtitle?: string;

  // Ganadores
  winners_badge?: string;
  winners_title?: string;
  winners_subtitle?: string;

  // Reglas & FAQ
  rules_badge?: string;
  rules_title?: string;
  rules_subtitle?: string;

  // Aliados
  allies_badge?: string;
  allies_title?: string;
  allies_subtitle?: string;
}

export interface KinielaDataState {
  edition: KinielaEdition;
  matches: Match[];
  winners: Winner[];
  banner: Banner | null;
  banners: BannerSlide[];
  copys?: SiteCopys;
  source: 'supabase' | 'local';
  lastUpdated: string;
}


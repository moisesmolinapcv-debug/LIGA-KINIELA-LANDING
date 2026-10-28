// Clases compartidas del panel. Objetivos táctiles de al menos 44 px; el foco visible lo
// pone el estilo global (:focus-visible), por eso no se usa outline-none.

export const LABEL = 'block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5';

export const INPUT =
  'w-full min-h-[44px] px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-sm placeholder:text-slate-400 focus:border-kiniela-gold transition-colors disabled:opacity-60';

export const CARD = 'bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-4 sm:p-5';

export const BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] hover:from-[#9f2c52] hover:to-kiniela-vinotinto border border-kiniela-gold/40 shadow-lg shadow-kiniela-vinotinto/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

export const BTN_GOLD =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl font-black text-sm text-kiniela-navy bg-gradient-to-r from-kiniela-gold to-kiniela-gold-hover shadow-brand-gold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

export const BTN_GHOST =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-sm text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const BTN_DANGER =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 border border-rose-400/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

/** Botón cuadrado de icono (44 × 44). */
export const BTN_ICON =
  'inline-flex shrink-0 items-center justify-center w-11 h-11 rounded-xl text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

export const HELP = 'text-xs text-slate-300 leading-relaxed';

export const SPINNER = 'inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin';

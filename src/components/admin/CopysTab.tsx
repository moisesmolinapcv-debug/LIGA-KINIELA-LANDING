'use client';

import React, { useState, useEffect } from 'react';
import { SiteCopys } from '../../types/kiniela';
import { DEFAULT_COPYS } from '../../lib/kiniela-store';
import { Save, RotateCcw, Sparkles, MessageSquareText, CheckCircle2 } from 'lucide-react';

interface CopysTabProps {
  copys?: SiteCopys;
  onUpdateCopys: (update: Partial<SiteCopys>) => Promise<void>;
}

export const CopysTab: React.FC<CopysTabProps> = ({ copys, onUpdateCopys }) => {
  const [formData, setFormData] = useState<SiteCopys>(copys || DEFAULT_COPYS);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (copys) {
      setFormData({
        ...DEFAULT_COPYS,
        ...copys,
      });
    }
  }, [copys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await onUpdateCopys(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('¿Restablecer todos los textos a los valores oficiales de fábrica?')) {
      setFormData(DEFAULT_COPYS);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-kiniela-navy-card p-6 rounded-2xl border border-kiniela-gold/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kiniela-gold/15 text-kiniela-gold text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>Gestión Editorial</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Textos, Títulos y Copys de la Web
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Edita de forma instantánea cualquier mensaje, subtítulo o llamada a la acción de los módulos públicos de Liga Kiniela.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
            title="Valores por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 flex items-center gap-3 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">
            ¡Textos actualizados exitosamente! Ya se reflejan en tiempo real en la página pública.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================================================= */}
        {/* 1. MÓDULO HERO / CABECERA PRINCIPAL                                       */}
        {/* ========================================================================= */}
        <div className="bg-kiniela-navy-card p-6 rounded-2xl border border-kiniela-navy-border/60 shadow-xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-kiniela-gold uppercase flex items-center gap-2">
              <span>🏟️ 1. Módulo Hero (Cabecera y Presentación)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Controla el título grande, párrafo persuasivo y textos de las tarjetas de premio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Título Principal
              </label>
              <input
                type="text"
                value={formData.hero_title || ''}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. KINIELA MILLONARIA - UEFA NATIONS"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Etiqueta del Badge Superior
              </label>
              <input
                type="text"
                value={formData.hero_badge_tag || ''}
                onChange={(e) => setFormData({ ...formData, hero_badge_tag: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. Pronósticos Oficiales"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Subtítulo Persuasivo del Hero
            </label>
            <textarea
              rows={2}
              value={formData.hero_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs sm:text-sm focus:border-kiniela-gold outline-none resize-y"
              placeholder="Descripción motivacional..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Texto del Contador Regresivo
            </label>
            <input
              type="text"
              value={formData.hero_countdown_label || ''}
              onChange={(e) => setFormData({ ...formData, hero_countdown_label: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              placeholder="Ej. Tiempo restante para el cierre de jugadas"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-kiniela-navy-deep border border-white/10 space-y-3">
              <span className="text-xs font-bold text-kiniela-gold uppercase">Tarjeta: Gran Premio</span>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Título de la Tarjeta</label>
                <input
                  type="text"
                  value={formData.hero_prize_title || ''}
                  onChange={(e) => setFormData({ ...formData, hero_prize_title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-kiniela-navy text-white text-xs border border-white/15 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Descripción Inferior</label>
                <input
                  type="text"
                  value={formData.hero_prize_desc || ''}
                  onChange={(e) => setFormData({ ...formData, hero_prize_desc: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-kiniela-navy text-white text-xs border border-white/15 outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-kiniela-navy-deep border border-white/10 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase">Tarjeta: Precio Ticket</span>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Título de la Tarjeta</label>
                <input
                  type="text"
                  value={formData.hero_ticket_title || ''}
                  onChange={(e) => setFormData({ ...formData, hero_ticket_title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-kiniela-navy text-white text-xs border border-white/15 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Descripción Inferior</label>
                <input
                  type="text"
                  value={formData.hero_ticket_desc || ''}
                  onChange={(e) => setFormData({ ...formData, hero_ticket_desc: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-kiniela-navy text-white text-xs border border-white/15 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MÓDULO CARTELERA DE PARTIDOS                                           */}
        {/* ========================================================================= */}
        <div className="bg-kiniela-navy-card p-6 rounded-2xl border border-kiniela-navy-border/60 shadow-xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-kiniela-gold uppercase flex items-center gap-2">
              <span>⚽ 2. Módulo Cartelera de Partidos</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Badge / Etiqueta Superior
              </label>
              <input
                type="text"
                value={formData.matches_badge || ''}
                onChange={(e) => setFormData({ ...formData, matches_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Cartelera Oficial de Pronósticos"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Título de la Sección
              </label>
              <input
                type="text"
                value={formData.matches_title || ''}
                onChange={(e) => setFormData({ ...formData, matches_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Encuentros de la Jornada"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Subtítulo Explicativo
            </label>
            <textarea
              rows={2}
              value={formData.matches_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, matches_subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs sm:text-sm focus:border-kiniela-gold outline-none resize-y"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. MÓDULO SALÓN DE CAMPEONES                                              */}
        {/* ========================================================================= */}
        <div className="bg-kiniela-navy-card p-6 rounded-2xl border border-kiniela-navy-border/60 shadow-xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-kiniela-gold uppercase flex items-center gap-2">
              <span>🏆 3. Módulo Salón de Campeones (Ganadores)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Badge / Etiqueta Superior
              </label>
              <input
                type="text"
                value={formData.winners_badge || ''}
                onChange={(e) => setFormData({ ...formData, winners_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Título de la Sección
              </label>
              <input
                type="text"
                value={formData.winners_title || ''}
                onChange={(e) => setFormData({ ...formData, winners_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Subtítulo Explicativo
            </label>
            <textarea
              rows={2}
              value={formData.winners_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, winners_subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs sm:text-sm focus:border-kiniela-gold outline-none resize-y"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MÓDULO ¿DÓNDE JUGAR? (ALIADOS COMERCIALES)                            */}
        {/* ========================================================================= */}
        <div className="bg-kiniela-navy-card p-6 rounded-2xl border border-kiniela-navy-border/60 shadow-xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-kiniela-gold uppercase flex items-center gap-2">
              <span>🤝 4. Módulo ¿Dónde Jugar? (Aliados Oficiales)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Badge / Etiqueta Superior
              </label>
              <input
                type="text"
                value={formData.allies_badge || ''}
                onChange={(e) => setFormData({ ...formData, allies_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Título de la Sección
              </label>
              <input
                type="text"
                value={formData.allies_title || ''}
                onChange={(e) => setFormData({ ...formData, allies_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Párrafo Descriptivo
            </label>
            <textarea
              rows={2}
              value={formData.allies_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, allies_subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs sm:text-sm focus:border-kiniela-gold outline-none resize-y"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. MÓDULO REGLAMENTO & FAQ                                                */}
        {/* ========================================================================= */}
        <div className="bg-kiniela-navy-card p-6 rounded-2xl border border-kiniela-navy-border/60 shadow-xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="text-base font-black text-kiniela-gold uppercase flex items-center gap-2">
              <span>📖 5. Módulo Reglamento & Preguntas Frecuentes</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Badge / Etiqueta Superior
              </label>
              <input
                type="text"
                value={formData.rules_badge || ''}
                onChange={(e) => setFormData({ ...formData, rules_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Título de la Sección
              </label>
              <input
                type="text"
                value={formData.rules_title || ''}
                onChange={(e) => setFormData({ ...formData, rules_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Subtítulo de la Sección
            </label>
            <textarea
              rows={2}
              value={formData.rules_subtitle || ''}
              onChange={(e) => setFormData({ ...formData, rules_subtitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs sm:text-sm focus:border-kiniela-gold outline-none resize-y"
            />
          </div>
        </div>

        {/* Botón de Guardar Flotante / Fijo */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-kiniela-gold to-kiniela-gold-hover text-kiniela-navy font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Todos los Textos'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

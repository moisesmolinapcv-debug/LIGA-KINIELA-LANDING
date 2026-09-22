'use client';

import React, { useState, useEffect } from 'react';
import { KinielaEdition } from '@/types/kiniela';
import { formatBs } from '@/lib/kiniela-store';
import { Trophy, Calendar, Clock, Sparkles, Check, Save, Ticket, Coins } from 'lucide-react';

interface EditionTabProps {
  edition: KinielaEdition;
  onSave: (updated: Partial<KinielaEdition>) => Promise<void>;
}

// Helpers para inputs datetime-local (formato: YYYY-MM-DDTHH:mm)
const toLocalInput = (iso?: string): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
};

const toIsoString = (localValue: string): string => {
  if (!localValue) return new Date().toISOString();
  try {
    const d = new Date(localValue);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const TITLE_PRESETS = [
  'KINIELA MILLONARIA',
  'KINIELA CHAMPIONS LEAGUE',
  'KINIELA DOMINGUERA',
  'KINIELA VINOTINTO',
  'KINIELA LIBERTADORES',
  'EDICIÓN CLÁSICO DE ORO',
];

export const EditionTab: React.FC<EditionTabProps> = ({ edition, onSave }) => {
  const [formData, setFormData] = useState({
    title: edition.title || 'KINIELA MILLONARIA',
    edition_number: edition.edition_number || 'Edición Especial #24',
    ticket_price_bs: edition.ticket_price_bs ?? 1000,
    prize_amount_bs: edition.prize_amount_bs ?? 1500000,
    start_date: toLocalInput(edition.start_date),
    end_date: toLocalInput(edition.end_date),
    is_active: edition.is_active ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedRecently, setHasSavedRecently] = useState(false);

  // Sincronizar si cambia externamente
  useEffect(() => {
    setFormData({
      title: edition.title || 'KINIELA MILLONARIA',
      edition_number: edition.edition_number || 'Edición Especial #24',
      ticket_price_bs: edition.ticket_price_bs ?? 1000,
      prize_amount_bs: edition.prize_amount_bs ?? 1500000,
      start_date: toLocalInput(edition.start_date),
      end_date: toLocalInput(edition.end_date),
      is_active: edition.is_active ?? true,
    });
  }, [edition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        title: formData.title.trim(),
        edition_number: formData.edition_number.trim(),
        ticket_price_bs: Number(formData.ticket_price_bs),
        prize_amount_bs: Number(formData.prize_amount_bs),
        start_date: toIsoString(formData.start_date),
        end_date: toIsoString(formData.end_date),
        is_active: Boolean(formData.is_active),
      });
      setHasSavedRecently(true);
      setTimeout(() => setHasSavedRecently(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado descriptivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a2785]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-rockwell">
            <Trophy className="w-6 h-6 text-kiniela-gold" />
            <span>Configuración de la Edición Actual</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Actualiza el nombre semanal de la kiniela, los montos en Bolívares (Bs) y el cronograma de cierre.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              formData.is_active
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${formData.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}
            />
            {formData.is_active ? 'Edición Publicada' : 'Edición Pausada'}
          </span>
        </div>
      </div>

      {/* Formulario y Vista Previa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de Parámetros */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Título de la Kiniela y Presets */}
            <div className="bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Título Semanal de la Kiniela
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: KINIELA MILLONARIA"
                  className="w-full px-4 py-3 bg-[#00063E] border border-[#1a2785] rounded-xl text-white font-rockwell font-bold text-lg tracking-wide focus:outline-none focus:border-kiniela-gold focus:ring-1 focus:ring-kiniela-gold transition-all"
                />
              </div>

              {/* Presets Rápidos */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Sugerencias Rápidas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {TITLE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, title: preset })}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        formData.title === preset
                          ? 'bg-kiniela-gold text-kiniela-navy border-kiniela-gold font-bold shadow-md'
                          : 'bg-[#0c186b]/60 text-slate-300 border-[#1a2785] hover:bg-[#1a2785] hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Número o Denominación de Edición */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Número o Denominación de Edición
                </label>
                <input
                  type="text"
                  value={formData.edition_number}
                  onChange={(e) => setFormData({ ...formData, edition_number: e.target.value })}
                  placeholder="Ej: Edición Especial #24"
                  className="w-full px-4 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white font-semibold text-sm focus:outline-none focus:border-kiniela-gold transition-all"
                />
              </div>
            </div>

            {/* Montos Exclusivamente en Bolívares (Bs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Pozo Acumulado (Premio en Bs) */}
              <div className="bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-kiniela-gold border-b border-[#1a2785] pb-2">
                  <Sparkles className="w-4 h-4 text-kiniela-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Gran Pozo Acumulado (Premio)
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Monto en Bolívares (Bs)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-kiniela-gold font-bold text-sm font-mono">
                      Bs
                    </span>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={formData.prize_amount_bs}
                      onChange={(e) => setFormData({ ...formData, prize_amount_bs: parseFloat(e.target.value) || 0 })}
                      placeholder="1500000"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-kiniela-gold font-mono font-black text-lg focus:outline-none focus:border-kiniela-gold"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Visualización: <span className="text-kiniela-gold font-bold">{formatBs(formData.prize_amount_bs)}</span>
                  </p>
                </div>
              </div>

              {/* Precio del Ticket en Bs */}
              <div className="bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-kiniela-gold border-b border-[#1a2785] pb-2">
                  <Ticket className="w-4 h-4" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Precio del Ticket
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Costo en Bolívares (Bs)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white font-bold text-sm font-mono">
                      Bs
                    </span>
                    <input
                      type="number"
                      step="10"
                      min="0"
                      value={formData.ticket_price_bs}
                      onChange={(e) => setFormData({ ...formData, ticket_price_bs: parseFloat(e.target.value) || 0 })}
                      placeholder="1000"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white font-mono font-bold text-lg focus:outline-none focus:border-kiniela-gold"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Visualización: <span className="text-white font-bold">{formatBs(formData.ticket_price_bs)}</span>
                  </p>
                </div>
              </div>

            </div>

            {/* Fechas y Horas de Inicio y Cierre */}
            <div className="bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1a2785] pb-2 text-white">
                <Calendar className="w-4 h-4 text-kiniela-gold" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Cronograma Oficial de la Jornada
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Fecha y Hora de Inicio</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-sm focus:outline-none focus:border-kiniela-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-kiniela-gold" />
                    <span>Fecha y Hora de Cierre (Límite)</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-sm focus:outline-none focus:border-kiniela-gold font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    El contador de la landing descuenta en tiempo real hacia esta fecha.
                  </p>
                </div>
              </div>
            </div>

            {/* Interruptor de Visibilidad */}
            <div className="bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white block">Estado de Publicación</span>
                <span className="text-xs text-slate-400">
                  Define si esta edición está activa y visible para el público en la landing.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Botón de Guardar */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] hover:from-[#9f2c52] hover:to-kiniela-vinotinto text-white font-bold rounded-xl shadow-lg shadow-kiniela-vinotinto/30 border border-kiniela-gold/40 flex items-center justify-center gap-2 uppercase tracking-wider text-sm transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando Cambios...
                  </>
                ) : hasSavedRecently ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    ¡Parámetros Guardados!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-kiniela-gold" />
                    Guardar Parámetros de Edición
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Vista previa en vivo (Tarjeta resumen para el administrador) */}
        <div className="space-y-4">
          <div className="bg-[#0c186b]/40 border border-[#1a2785] rounded-2xl p-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-[#1a2785] pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-kiniela-gold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Vista Previa en Vivo
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                Tarjeta Landing
              </span>
            </div>

            {/* Tarjeta de Pozo Estilo Landing */}
            <div className="rounded-2xl p-5 bg-gradient-to-b from-[#882445]/50 via-[#060e4f] to-[#000428] border-2 border-kiniela-gold/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-kiniela-gold/10 rounded-full blur-2xl pointer-events-none" />

              <div className="text-center space-y-2">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-kiniela-gold/20 text-kiniela-gold border border-kiniela-gold/30">
                  {formData.edition_number || 'Edición #24'}
                </span>

                <h3 className="font-rockwell font-black text-xl sm:text-2xl text-white tracking-wide leading-tight">
                  {formData.title || 'KINIELA MILLONARIA'}
                </h3>

                <div className="pt-2">
                  <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold block">
                    Gran Pozo Acumulado
                  </span>
                  <div className="font-rockwell font-black text-3xl sm:text-4xl text-kiniela-gold tracking-tight drop-shadow-[0_0_12px_rgba(255,175,63,0.5)]">
                    {formatBs(formData.prize_amount_bs)}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/60 mt-3 p-3 rounded-xl bg-[#00063E]/80 border border-[#1a2785]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Precio del Ticket Oficial
                  </span>
                  <span className="text-lg font-black text-white font-mono">
                    {formatBs(formData.ticket_price_bs)}
                  </span>
                </div>

                {formData.end_date && (
                  <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-kiniela-gold" />
                    <span>Cierra: {new Date(formData.end_date).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
              Los cambios guardados se reflejan inmediatamente en tiempo real para todos los visitantes de la plataforma.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

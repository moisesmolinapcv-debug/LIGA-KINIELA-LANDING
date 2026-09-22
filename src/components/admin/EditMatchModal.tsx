'use client';

import React, { useState, useEffect } from 'react';
import { Match, MatchStatus } from '../../types/kiniela';
import { X, Save } from 'lucide-react';

interface EditMatchModalProps {
  isOpen: boolean;
  match: Match | null;
  onClose: () => void;
  onSave: (id: string, update: Partial<Match>) => Promise<void>;
}

const toLocalInput = (iso: string): string => {
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

export const EditMatchModal: React.FC<EditMatchModalProps> = ({
  isOpen,
  match,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    home_team: '',
    away_team: '',
    home_logo: '',
    away_logo: '',
    match_date: '',
    status: 'EN ESPERA' as MatchStatus,
    home_score: 0,
    away_score: 0,
    minute: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (match) {
      setFormData({
        home_team: match.home_team || '',
        away_team: match.away_team || '',
        home_logo: match.home_logo || '',
        away_logo: match.away_logo || '',
        match_date: toLocalInput(match.match_date),
        status: match.status || 'EN ESPERA',
        home_score: match.home_score ?? 0,
        away_score: match.away_score ?? 0,
        minute: match.minute || '',
      });
    }
  }, [match]);

  if (!isOpen || !match) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(match.id, {
        home_team: formData.home_team.trim() || 'Equipo Local',
        away_team: formData.away_team.trim() || 'Equipo Visitante',
        home_logo: formData.home_logo.trim() || 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
        away_logo: formData.away_logo.trim() || 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
        match_date: toIsoString(formData.match_date),
        status: formData.status,
        home_score: Number(formData.home_score) || 0,
        away_score: Number(formData.away_score) || 0,
        minute: formData.minute.trim(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-kiniela-navy-card rounded-2xl border border-kiniela-gold/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-kiniela-navy-deep">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase flex items-center gap-2">
              <span>✏️ Editar Encuentro Deportivo</span>
            </h3>
            <p className="text-xs text-slate-400">
              {match.home_team || 'Local'} vs {match.away_team || 'Visitante'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario con Scroll si es necesario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Equipos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Equipo Local
              </label>
              <input
                type="text"
                value={formData.home_team}
                onChange={(e) => setFormData({ ...formData, home_team: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. Alemania"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Equipo Visitante
              </label>
              <input
                type="text"
                value={formData.away_team}
                onChange={(e) => setFormData({ ...formData, away_team: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. Grecia"
              />
            </div>
          </div>

          {/* Logos / Banderas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                URL Logo Local
              </label>
              <input
                type="text"
                value={formData.home_logo}
                onChange={(e) => setFormData({ ...formData, home_logo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs focus:border-kiniela-gold outline-none font-mono"
                placeholder="https://... o /allies/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                URL Logo Visitante
              </label>
              <input
                type="text"
                value={formData.away_logo}
                onChange={(e) => setFormData({ ...formData, away_logo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs focus:border-kiniela-gold outline-none font-mono"
                placeholder="https://... o /allies/..."
              />
            </div>
          </div>

          {/* Marcador Actual */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-kiniela-navy-deep p-3 rounded-xl border border-white/10">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Goles Local
              </label>
              <input
                type="number"
                min="0"
                value={formData.home_score}
                onChange={(e) => setFormData({ ...formData, home_score: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-kiniela-navy text-kiniela-gold font-mono font-bold text-center border border-white/15 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Goles Visitante
              </label>
              <input
                type="number"
                min="0"
                value={formData.away_score}
                onChange={(e) => setFormData({ ...formData, away_score: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-kiniela-navy text-kiniela-gold font-mono font-bold text-center border border-white/15 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Estatus
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MatchStatus })}
                className="w-full px-2 py-2 rounded-lg bg-kiniela-navy text-white text-xs font-bold border border-white/15 outline-none"
              >
                <option value="EN ESPERA">Por Jugar</option>
                <option value="EN VIVO">En Vivo</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Minuto
              </label>
              <input
                type="text"
                value={formData.minute}
                onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-kiniela-navy text-white text-xs text-center border border-white/15 outline-none"
                placeholder="45', HT, 90'"
              />
            </div>
          </div>

          {/* Fecha y Hora */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Fecha y Hora (Hora Venezuela)
            </label>
            <input
              type="datetime-local"
              value={formData.match_date}
              onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
            />
          </div>

          {/* Acciones del Modal */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-kiniela-gold to-kiniela-gold-hover text-kiniela-navy font-black text-xs uppercase tracking-wider shadow-brand-gold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

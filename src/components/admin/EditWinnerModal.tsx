'use client';

import React, { useState, useEffect } from 'react';
import { Winner } from '../../types/kiniela';
import { X, Save, Trophy } from 'lucide-react';

interface EditWinnerModalProps {
  isOpen: boolean;
  winner: Winner | null;
  onClose: () => void;
  onSave: (id: string, update: Partial<Winner>) => Promise<void>;
}

export const EditWinnerModal: React.FC<EditWinnerModalProps> = ({
  isOpen,
  winner,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    winner_name: '',
    edition_title: '',
    prize_won: '',
    city: '',
    winning_date: '',
    is_recent: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (winner) {
      setFormData({
        winner_name: winner.winner_name || '',
        edition_title: winner.edition_title || '',
        prize_won: winner.prize_won || '',
        city: winner.city || '',
        winning_date: winner.winning_date || '',
        is_recent: Boolean(winner.is_recent),
      });
    }
  }, [winner]);

  if (!isOpen || !winner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(winner.id, {
        winner_name: formData.winner_name.trim() || 'Ganador Oficial',
        edition_title: formData.edition_title.trim() || 'Jornada Deportiva',
        prize_won: formData.prize_won.trim() || 'Premio Garantizado',
        city: formData.city.trim() || 'Venezuela',
        winning_date: formData.winning_date.trim() || new Date().toLocaleDateString('es-VE'),
        is_recent: formData.is_recent,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-kiniela-navy-card rounded-2xl border border-kiniela-gold/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-kiniela-navy-deep">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase flex items-center gap-2">
              <span>🏆 Editar Campeón</span>
            </h3>
            <p className="text-xs text-slate-400">
              {winner.winner_name} — {winner.edition_title}
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Nombre del Ganador / Seudónimo
            </label>
            <input
              type="text"
              value={formData.winner_name}
              onChange={(e) => setFormData({ ...formData, winner_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              placeholder="Ej. Carlos M. (El Imparable)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Edición de la Kiniela
              </label>
              <input
                type="text"
                value={formData.edition_title}
                onChange={(e) => setFormData({ ...formData, edition_title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. Edición #24"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Premio Entregado (en Bs)
              </label>
              <input
                type="text"
                value={formData.prize_won}
                onChange={(e) => setFormData({ ...formData, prize_won: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-kiniela-gold font-bold text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. 1.500.000 Bs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Ciudad / Estado
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. Maracaibo, Zulia"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Fecha de Entrega
              </label>
              <input
                type="text"
                value={formData.winning_date}
                onChange={(e) => setFormData({ ...formData, winning_date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
                placeholder="Ej. 20 de septiembre de 2026"
              />
            </div>
          </div>

          {/* Marcar como más reciente */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="edit_is_recent"
              checked={formData.is_recent}
              onChange={(e) => setFormData({ ...formData, is_recent: e.target.checked })}
              className="w-4 h-4 rounded text-kiniela-gold accent-kiniela-gold cursor-pointer"
            />
            <label htmlFor="edit_is_recent" className="text-xs text-slate-300 cursor-pointer select-none">
              Destacar como <span className="text-kiniela-gold font-bold">Último Ganador</span>
            </label>
          </div>

          {/* Acciones */}
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

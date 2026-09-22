'use client';

import React, { useState } from 'react';
import { Winner } from '@/types/kiniela';
import { Trophy, Award, Trash2, Plus, MapPin, Calendar, DollarSign, AlertTriangle, Sparkles } from 'lucide-react';

interface WinnersTabProps {
  winners: Winner[];
  onAddWinner: (newWinner: Omit<Winner, 'id'>) => Promise<void>;
  onDeleteWinner: (id: string) => Promise<void>;
}

const CITY_PRESETS = [
  'Caracas, Dto. Capital',
  'Maracaibo, Zulia',
  'Valencia, Carabobo',
  'Barquisimeto, Lara',
  'Maracay, Aragua',
  'San Cristóbal, Táchira',
  'Puerto La Cruz, Anzoátegui',
  'Maturín, Monagas',
];

export const WinnersTab: React.FC<WinnersTabProps> = ({ winners, onAddWinner, onDeleteWinner }) => {
  const [formData, setFormData] = useState({
    winner_name: '',
    edition_title: 'Edición #24 - Kiniela Millonaria',
    prize_won: '1.500.000 Bs (Acumulado)',
    city: 'Caracas, Dto. Capital',
    winning_date: new Date().toLocaleDateString('es-VE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    is_recent: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [winnerToDelete, setWinnerToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.winner_name || !formData.prize_won) return;

    setIsSubmitting(true);
    try {
      await onAddWinner({
        winner_name: formData.winner_name.trim(),
        edition_title: formData.edition_title.trim(),
        prize_won: formData.prize_won.trim(),
        city: formData.city.trim(),
        winning_date: formData.winning_date.trim(),
        is_recent: Boolean(formData.is_recent),
      });

      // Limpiar para el siguiente
      setFormData({
        winner_name: '',
        edition_title: 'Edición #24 - Kiniela Millonaria',
        prize_won: '1.500.000 Bs (Acumulado)',
        city: 'Caracas, Dto. Capital',
        winning_date: new Date().toLocaleDateString('es-VE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        is_recent: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!winnerToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteWinner(winnerToDelete);
      setWinnerToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a2785]">
        <div>
          <h2 className="text-2xl font-black font-rockwell text-white flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-kiniela-gold" />
            Salón de Campeones & Ganadores Históricos
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Registra a los ganadores de los premios mayores para mostrar confianza, transparencia y testimonios reales.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0c186b]/70 border border-[#1a2785] px-3.5 py-1.5 rounded-full self-start sm:self-auto">
          <Award className="w-4 h-4 text-kiniela-gold" />
          <span className="text-xs text-slate-300 font-medium">Campeones Registrados:</span>
          <span className="text-xs font-mono font-bold text-kiniela-gold">{winners.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario para Registrar Nuevo Ganador (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#060e4f]/80 border border-[#1a2785] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1a2785] pb-3 text-white">
              <Plus className="w-4 h-4 text-kiniela-gold" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Registrar Nuevo Ganador
              </h3>
            </div>

            {/* Nombre del Ganador */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre Completo del Ganador *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Carlos Mendoza o Yorvis Silva"
                value={formData.winner_name}
                onChange={(e) => setFormData({ ...formData, winner_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white font-semibold text-sm focus:outline-none focus:border-kiniela-gold"
              />
            </div>

            {/* Título de la Edición */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Título de la Edición Ganada *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Edición #24 - Kiniela Millonaria"
                value={formData.edition_title}
                onChange={(e) => setFormData({ ...formData, edition_title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-kiniela-gold"
              />
            </div>

            {/* Monto del Premio */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-kiniela-gold" />
                Monto del Premio Ganado en Bolívares (Bs) *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 1.500.000 Bs (Acumulado) o 800.000 Bs (1er Lugar)"
                value={formData.prize_won}
                onChange={(e) => setFormData({ ...formData, prize_won: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-kiniela-gold font-bold text-sm focus:outline-none focus:border-kiniela-gold"
              />
            </div>

            {/* Ciudad / Estado */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Ciudad / Estado *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Caracas, Dto. Capital"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-kiniela-gold"
              />
              {/* Presets de ciudades venezolanas */}
              <div className="flex flex-wrap gap-1 mt-2">
                {CITY_PRESETS.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, city: c })}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#0c186b]/70 text-slate-300 hover:text-white hover:bg-[#1a2785]"
                  >
                    {c.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha de Premiación *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 21 Septiembre 2026"
                value={formData.winning_date}
                onChange={(e) => setFormData({ ...formData, winning_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-kiniela-gold"
              />
            </div>

            {/* Switch Ganador Reciente */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c186b]/40 border border-[#1a2785]">
              <div>
                <h4 className="text-xs font-bold text-white">Destacar como Ganador Reciente</h4>
                <p className="text-[11px] text-slate-400">Mostrará la insignia dorada especial en la landing.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_recent}
                  onChange={(e) => setFormData({ ...formData, is_recent: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-kiniela-gold"></div>
              </label>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase text-white bg-gradient-to-r from-kiniela-vinotinto to-[#a62b53] hover:from-[#9f2c52] hover:to-kiniela-vinotinto border border-kiniela-vinotinto-hover shadow-lg shadow-kiniela-vinotinto/40 hover:shadow-brand-vinotinto disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 text-kiniela-gold" />
                  Inscribir Ganador en el Salón
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de Campeones Existentes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Campeones en Historial Oficial</span>
              <span className="text-xs bg-[#0c186b] text-kiniela-gold px-2 py-0.5 rounded-full font-mono">
                {winners.length}
              </span>
            </h3>
          </div>

          {winners.length === 0 ? (
            <div className="p-8 text-center bg-[#060e4f]/40 border border-[#1a2785] rounded-2xl text-slate-400">
              <Trophy className="w-10 h-10 mx-auto mb-2 text-slate-500 opacity-50" />
              <p className="font-medium text-sm">No hay ganadores registrados actualmente.</p>
              <p className="text-xs text-slate-500 mt-1">
                Registra a los afortunados ganadores de las quinielas anteriores.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {winners.map((winner) => (
                <div
                  key={winner.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    winner.is_recent
                      ? 'bg-gradient-to-r from-[#060e4f] to-[#0c186b] border-kiniela-gold/40 shadow-lg shadow-[#000428]/60 ring-1 ring-kiniela-gold/20'
                      : 'bg-[#060e4f]/70 border-[#1a2785]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-kiniela-vinotinto/80 border border-kiniela-gold/40 flex items-center justify-center shrink-0 text-kiniela-gold mt-0.5">
                      <Trophy className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h4 className="font-bold text-white text-sm sm:text-base font-rockwell">
                          {winner.winner_name}
                        </h4>
                        {winner.is_recent && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-kiniela-gold/20 text-kiniela-gold border border-kiniela-gold/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Reciente
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-medium">{winner.edition_title}</p>

                      <div className="flex items-center flex-wrap gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {winner.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {winner.winning_date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-[#1a2785]/60 pt-2 sm:pt-0">
                    <span className="font-rockwell font-black text-kiniela-gold text-base sm:text-lg">
                      {winner.prize_won}
                    </span>

                    <button
                      type="button"
                      onClick={() => setWinnerToDelete(winner.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all"
                      title="Eliminar ganador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación para Eliminar Ganador */}
      {winnerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#060e4f] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-rockwell">
              ¿Eliminar Ganador del Salón de Campeones?
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              El registro histórico será removido de la base de datos y de la lista pública.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setWinnerToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Sí, Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Winner } from '@/types/kiniela';
import { Trophy, Award, Trash2, Plus, MapPin, Calendar, Sparkles, Edit3 } from 'lucide-react';
import { EditWinnerModal } from './EditWinnerModal';
import { ConfirmDialog } from './ModalShell';
import { WinnerFields, emptyWinnerForm, validateWinner, type WinnerFormValues } from './WinnerFields';
import { BTN_GHOST, BTN_ICON, BTN_PRIMARY, CARD, SPINNER } from './ui';

interface WinnersTabProps {
  winners: Winner[];
  /** Cada acción devuelve true si se guardó bien (el aviso lo muestra la página). */
  onAddWinner: (newWinner: Omit<Winner, 'id'>) => Promise<boolean>;
  onDeleteWinner: (id: string) => Promise<boolean>;
  onUpdateWinner: (id: string, update: Partial<Winner>) => Promise<boolean>;
  /** Nombres de las Kinielas activas para el atajo "Usar: ...". */
  suggestedTitles?: string[];
}

export const WinnersTab: React.FC<WinnersTabProps> = ({
  winners,
  onAddWinner,
  onDeleteWinner,
  onUpdateWinner,
  suggestedTitles = [],
}) => {
  const [values, setValues] = useState<WinnerFormValues>(emptyWinnerForm());
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [winnerToDelete, setWinnerToDelete] = useState<Winner | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [winnerToEdit, setWinnerToEdit] = useState<Winner | null>(null);

  const errors = validateWinner(values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onAddWinner({
        winner_name: values.winner_name.trim(),
        edition_title: values.edition_title.trim(),
        prize_won: values.prize_won.trim(),
        city: values.city.trim() || 'Venezuela',
        winning_date: values.winning_date.trim(),
        is_recent: values.is_recent,
      });
      if (ok) {
        setValues(emptyWinnerForm());
        setShowErrors(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!winnerToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await onDeleteWinner(winnerToDelete.id);
      if (ok) setWinnerToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1a2785]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-rockwell text-white flex items-center gap-2.5 uppercase tracking-tight">
            <Trophy className="w-6 h-6 text-kiniela-gold" aria-hidden="true" />
            Campeones
          </h2>
          <p className="text-sm text-slate-200 mt-1 max-w-3xl">
            Registra a quienes ganaron un premio para mostrarlos en el Salón de Campeones de la web. Esta lista se carga a mano.
            El sello &quot;Premio Verificado y Cobrado&quot; ya aparece una sola vez en la sección, no hace falta ponerlo en cada campeón.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0c186b]/70 border border-[#1a2785] px-3.5 py-2 rounded-full self-start sm:self-auto">
          <Award className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
          <span className="text-sm text-slate-100 font-medium">Campeones registrados:</span>
          <span className="text-sm font-mono font-bold text-kiniela-gold">{winners.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className={`${CARD} space-y-4`} noValidate aria-labelledby="winner-add-title">
            <h3 id="winner-add-title" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1a2785] pb-3">
              <Plus className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              Registrar un campeón
            </h3>

            <WinnerFields idPrefix="new-winner" values={values} onChange={setValues} errors={showErrors ? errors : undefined} suggestedTitles={suggestedTitles} />

            <button type="submit" disabled={isSubmitting} className={`${BTN_PRIMARY} w-full`}>
              {isSubmitting ? (
                <>
                  <span className={SPINNER} aria-hidden="true" />
                  Guardando...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
                  Añadir al Salón de Campeones
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Campeones publicados</span>
            <span className="text-xs bg-[#0c186b] text-kiniela-gold px-2 py-0.5 rounded-full font-mono">{winners.length}</span>
          </h3>

          {winners.length === 0 ? (
            <div className="p-8 text-center bg-[#060e4f]/40 border border-[#1a2785] rounded-2xl text-slate-200">
              <Trophy className="w-10 h-10 mx-auto mb-2 text-slate-400" aria-hidden="true" />
              <p className="font-medium text-sm">Todavía no hay campeones registrados.</p>
              <p className="text-xs text-slate-300 mt-1">Mientras no haya ninguno, la web muestra el aviso &quot;Los campeones de las próximas ediciones se mostrarán aquí&quot;.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {winners.map((winner) => (
                <li
                  key={winner.id}
                  className={`p-4 rounded-xl border flex flex-col gap-3 ${
                    winner.is_recent ? 'bg-gradient-to-r from-[#060e4f] to-[#0c186b] border-kiniela-gold/40' : 'bg-[#060e4f]/70 border-[#1a2785]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-xl bg-kiniela-vinotinto/80 border border-kiniela-gold/40 flex items-center justify-center shrink-0 text-kiniela-gold">
                      <Trophy className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <h4 className="font-bold text-white text-base font-rockwell break-words">{winner.winner_name}</h4>
                        {winner.is_recent && (
                          <span className="text-xs font-bold bg-kiniela-gold/20 text-kiniela-gold border border-kiniela-gold/40 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                            Reciente
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-200">{winner.edition_title}</p>
                      <p className="font-rockwell font-black text-kiniela-gold text-lg">{winner.prize_won}</p>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" aria-hidden="true" />
                          {winner.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          {winner.winning_date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                    <button type="button" onClick={() => setWinnerToEdit(winner)} className={BTN_GHOST}>
                      <Edit3 className="w-4 h-4" aria-hidden="true" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setWinnerToDelete(winner)}
                      aria-label={`Eliminar a ${winner.winner_name}`}
                      className={`${BTN_ICON} text-rose-300 hover:bg-rose-950/50`}
                    >
                      <Trash2 className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-slate-300">Los cambios tardan hasta ~1 minuto en verse en la web.</p>
        </div>
      </div>

      <ConfirmDialog
        open={winnerToDelete !== null}
        title="¿Eliminar este campeón?"
        message={
          <>
            Se quitará de la lista y del Salón de Campeones de la web: <strong className="text-white">{winnerToDelete?.winner_name}</strong>. Esto no se puede deshacer.
          </>
        }
        confirmLabel="Sí, eliminar"
        busy={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setWinnerToDelete(null)}
      />

      <EditWinnerModal isOpen={Boolean(winnerToEdit)} winner={winnerToEdit} onClose={() => setWinnerToEdit(null)} onSave={onUpdateWinner} />
    </div>
  );
};

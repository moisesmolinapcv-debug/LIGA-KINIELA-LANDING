'use client';

import React, { useState, useEffect } from 'react';
import { Winner } from '../../types/kiniela';
import { X, Save, Trophy } from 'lucide-react';
import { ModalShell } from './ModalShell';
import { WinnerFields, emptyWinnerForm, validateWinner, type WinnerFormValues } from './WinnerFields';
import { BTN_GHOST, BTN_GOLD, SPINNER } from './ui';

interface EditWinnerModalProps {
  isOpen: boolean;
  winner: Winner | null;
  onClose: () => void;
  /** Devuelve true si se guardó (si falla, el modal queda abierto con lo escrito). */
  onSave: (id: string, update: Partial<Winner>) => Promise<boolean>;
}

export const EditWinnerModal: React.FC<EditWinnerModalProps> = ({ isOpen, winner, onClose, onSave }) => {
  const [values, setValues] = useState<WinnerFormValues>(emptyWinnerForm());
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (winner) {
      setValues({
        winner_name: winner.winner_name || '',
        edition_title: winner.edition_title || '',
        prize_won: winner.prize_won || '',
        city: winner.city || '',
        winning_date: winner.winning_date || '',
        is_recent: Boolean(winner.is_recent),
      });
      setShowErrors(false);
    }
  }, [winner]);

  if (!isOpen || !winner) return null;

  const errors = validateWinner(values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }
    setIsSaving(true);
    try {
      const ok = await onSave(winner.id, {
        winner_name: values.winner_name.trim(),
        edition_title: values.edition_title.trim(),
        prize_won: values.prize_won.trim(),
        city: values.city.trim() || 'Venezuela',
        winning_date: values.winning_date.trim(),
        is_recent: values.is_recent,
      });
      if (ok) onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalShell open={isOpen} onClose={onClose} titleId="edit-winner-title" busy={isSaving} maxWidth="max-w-xl">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-kiniela-navy-deep">
        <div className="min-w-0">
          <h3 id="edit-winner-title" className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-kiniela-gold shrink-0" aria-hidden="true" />
            <span>Editar campeón</span>
          </h3>
          <p className="text-xs text-slate-300 truncate">
            {winner.winner_name} · {winner.edition_title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          aria-label="Cerrar"
          className="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl text-slate-200 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1" noValidate>
        <div className="p-5 overflow-y-auto">
          <WinnerFields idPrefix="edit-winner" values={values} onChange={setValues} errors={showErrors ? errors : undefined} />
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-4 border-t border-white/10 bg-kiniela-navy-deep">
          <button type="button" onClick={onClose} disabled={isSaving} className={BTN_GHOST}>
            Cancelar
          </button>
          <button type="submit" disabled={isSaving} className={BTN_GOLD}>
            {isSaving ? (
              <>
                <span className={SPINNER} aria-hidden="true" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" aria-hidden="true" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import { BannerSlide } from '@/types/kiniela';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { ModalShell } from './ModalShell';
import { BannerFields, validateBannerForm, EMPTY_BANNER_FORM, type BannerFormValues } from './BannerFields';
import { BTN_GHOST, BTN_GOLD, SPINNER } from './ui';

interface EditBannerModalProps {
  isOpen: boolean;
  slide: BannerSlide | null;
  onClose: () => void;
  /** Devuelve true si se guardó (si falla, el modal queda abierto con lo escrito). */
  onSave: (id: string, update: Partial<BannerSlide>) => Promise<boolean>;
}

export const EditBannerModal: React.FC<EditBannerModalProps> = ({ isOpen, slide, onClose, onSave }) => {
  const [values, setValues] = useState<BannerFormValues>(EMPTY_BANNER_FORM);
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (slide) {
      setValues({
        title: slide.title || '',
        image_url: slide.image_url || '',
        image_url_mobile: slide.image_url_mobile || '',
        is_active: Boolean(slide.is_active),
      });
      setShowErrors(false);
    }
  }, [slide]);

  if (!isOpen || !slide) return null;

  const errors = validateBannerForm(values);
  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasErrors) {
      setShowErrors(true);
      return;
    }
    setIsSaving(true);
    try {
      // Solo se guardan los campos que el panel todavía maneja; los antiguos (botón y destino) no se tocan
      const ok = await onSave(slide.id, {
        title: values.title.trim(),
        image_url: values.image_url.trim(),
        image_url_mobile: values.image_url_mobile.trim() || null,
        is_active: values.is_active,
      });
      if (ok) onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalShell open={isOpen} onClose={onClose} titleId="edit-banner-title" busy={isSaving} maxWidth="max-w-3xl">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 bg-kiniela-navy-deep">
        <div className="min-w-0">
          <h3 id="edit-banner-title" className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-kiniela-gold shrink-0" aria-hidden="true" />
            <span>Editar banner</span>
          </h3>
          <p className="text-xs text-slate-300 truncate">{slide.title}</p>
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
          <BannerFields
            idPrefix="edit-banner"
            values={values}
            onChange={setValues}
            errors={showErrors ? errors : undefined}
          />
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

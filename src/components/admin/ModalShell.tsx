'use client';

import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BTN_DANGER, BTN_GHOST, SPINNER } from './ui';

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  /** id del título (aria-labelledby). */
  titleId: string;
  /** Mientras está ocupado no se cierra con Escape ni tocando fuera. */
  busy?: boolean;
  maxWidth?: string;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Cascarón accesible para ventanas modales: role=dialog, Escape para cerrar, foco atrapado,
 * foco devuelto al cerrar y el fondo sin desplazarse. En móvil sube desde abajo.
 */
export const ModalShell: React.FC<ModalShellProps> = ({
  open,
  onClose,
  titleId,
  busy = false,
  maxWidth = 'max-w-2xl',
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Foco inicial: primer campo del formulario (no el botón de cerrar)
    const dialog = dialogRef.current;
    if (dialog) {
      const first =
        dialog.querySelector<HTMLElement>('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') ||
        dialog.querySelector<HTMLElement>('button:not([disabled])');
      first?.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busyRef.current) {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full ${maxWidth} bg-[#060e4f] rounded-t-2xl sm:rounded-2xl border border-kiniela-gold/40 shadow-2xl overflow-hidden max-h-[92dvh] sm:max-h-[90dvh] flex flex-col`}
      >
        {children}
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmación para acciones que no se pueden deshacer (reemplaza a window.confirm). */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  const titleId = 'confirm-dialog-title';
  return (
    <ModalShell open={open} onClose={onCancel} titleId={titleId} busy={busy} maxWidth="max-w-md">
      <div className="p-6 text-center overflow-y-auto">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
          <AlertTriangle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 id={titleId} className="text-lg font-bold text-white font-rockwell">
          {title}
        </h3>
        <div className="text-slate-200 text-sm mt-2 leading-relaxed">{message}</div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-6">
          <button type="button" onClick={onCancel} disabled={busy} className={BTN_GHOST}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={BTN_DANGER}>
            {busy ? (
              <>
                <span className={SPINNER} aria-hidden="true" />
                Un momento...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

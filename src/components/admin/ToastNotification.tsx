'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

/** Avisos flotantes. En celular ocupan el ancho de la pantalla; el contenedor siempre existe para los lectores de pantalla. */
export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed z-[70] bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 sm:w-full sm:max-w-sm flex flex-col gap-3 pointer-events-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.type === 'error' ? 'alert' : 'status'}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl bg-[#060e4f]/95 text-white ${
            toast.type === 'success'
              ? 'border-emerald-500/50'
              : toast.type === 'error'
              ? 'border-rose-500/60'
              : 'border-kiniela-gold/50'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300" aria-hidden="true" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-kiniela-gold" aria-hidden="true" />}
          </div>

          <div className="flex-1 min-w-0 text-sm">
            <p className="font-semibold text-white">{toast.title}</p>
            {toast.message && <p className="text-slate-200 text-xs mt-0.5 leading-relaxed break-words">{toast.message}</p>}
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label="Cerrar aviso"
            className="shrink-0 -m-1 w-11 h-11 inline-flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
};

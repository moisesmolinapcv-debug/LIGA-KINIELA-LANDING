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

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-[#060e4f]/95 border-emerald-500/40 text-white shadow-emerald-950/50'
              : toast.type === 'error'
              ? 'bg-[#060e4f]/95 border-rose-500/40 text-white shadow-rose-950/50'
              : 'bg-[#060e4f]/95 border-kiniela-gold/40 text-white shadow-amber-950/50'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-kiniela-gold" />}
          </div>

          <div className="flex-1 text-sm">
            <h4 className="font-semibold text-white tracking-wide">{toast.title}</h4>
            {toast.message && <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{toast.message}</p>}
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

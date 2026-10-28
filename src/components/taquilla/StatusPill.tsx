import React from 'react';
import { Clock, Lock, Ticket } from 'lucide-react';
import type { KinielaStatus } from '../../types/kinielas';
import { ESTADOS_KINIELA } from '../../content/copys';

const STYLES: Record<KinielaStatus, string> = {
  abierta: 'bg-emerald-950/70 border-emerald-400/50 text-emerald-200',
  proxima: 'bg-kiniela-navy-card border-kiniela-gold/50 text-kiniela-gold-light',
  cerrada: 'bg-kiniela-vinotinto border-white/30 text-white',
};

const ICON = { abierta: Ticket, proxima: Clock, cerrada: Lock } as const;

/** Estado de la Kiniela: siempre texto + icono + color (nunca solo color). */
export function StatusPill({ status, className = '' }: { status: KinielaStatus; className?: string }) {
  const Icon = ICON[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${STYLES[status]} ${className}`}
    >
      {status === 'abierta' ? (
        <span aria-hidden="true" className="tq-live-dot h-2 w-2 rounded-full bg-emerald-400" />
      ) : (
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      )}
      {ESTADOS_KINIELA[status].etiqueta}
    </span>
  );
}

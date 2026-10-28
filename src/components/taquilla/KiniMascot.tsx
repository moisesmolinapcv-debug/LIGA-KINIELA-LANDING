'use client';

import React from 'react';
import Image from 'next/image';
import type { KinielaStatus } from '../../types/kinielas';

interface KiniMascotProps {
  status: KinielaStatus;
  /** Clases de tamaño, p. ej. "w-24 lg:w-72". */
  className?: string;
  priority?: boolean;
}

/**
 * Kini, la mascota. Entrada suave y reacción por estado:
 * abierta = saltito y halo dorado; próxima = vaivén lento; cerrada = apagado.
 * Usa la versión con reborde blanco para fondo oscuro.
 */
export function KiniMascot({ status, className = '', priority = false }: KiniMascotProps) {
  return (
    <div className={`relative aspect-[147/174] ${className}`}>
      {status === 'abierta' && (
        <span
          aria-hidden="true"
          className="tq-kini-glow absolute -inset-[12%] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(255,175,63,0.45), transparent)' }}
        />
      )}
      {/* key: al cambiar de estado se reproduce la entrada y la reacción */}
      <div key={status} className={`tq-kini-${status} absolute inset-0`}>
        <Image
          src="/brand/kini-dark.svg"
          alt="Kini, mascota de Liga Kiniela"
          fill
          sizes="(min-width: 1024px) 288px, 96px"
          className="object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.55)]"
          priority={priority}
        />
      </div>
    </div>
  );
}

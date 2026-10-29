'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { canOptimize } from '../../lib/optimizable';
import type { KinielaTeam } from '../../types/kinielas';

/** Iniciales para el respaldo del escudo: "Atlético Mineiro" -> "AM", "Bayern" -> "BA". */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Escudo del equipo; si no hay URL o falla la carga, muestra las iniciales. */
export function Crest({ team, size = 36 }: { team: KinielaTeam; size?: number }) {
  const [failed, setFailed] = useState(false);
  const [rawFallback, setRawFallback] = useState(false);
  useEffect(() => {
    setFailed(false);
    setRawFallback(false);
  }, [team.logoUrl]);
  const px = { width: size, height: size };

  if (!team.logoUrl || failed) {
    return (
      <span
        aria-hidden="true"
        style={px}
        className="inline-flex shrink-0 items-center justify-center rounded-full border border-kiniela-gold/40 bg-kiniela-navy-deep font-rockwell text-[11px] font-extrabold text-kiniela-gold-light"
      >
        {initialsOf(team.shortName || team.name)}
      </span>
    );
  }
  // Los escudos oficiales pesan ~40 KB y se muestran a 36 px: el optimizador los entrega a 2x en WebP (~1-2 KB).
  // Si el optimizador no puede leerlos (host no autorizado o error), se usa el archivo original.
  return (
    <Image
      src={team.logoUrl}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      quality={80}
      loading="lazy"
      unoptimized={!canOptimize(team.logoUrl) || rawFallback}
      onError={() => (canOptimize(team.logoUrl) && !rawFallback ? setRawFallback(true) : setFailed(true))}
      className="shrink-0 object-contain drop-shadow"
      style={px}
    />
  );
}

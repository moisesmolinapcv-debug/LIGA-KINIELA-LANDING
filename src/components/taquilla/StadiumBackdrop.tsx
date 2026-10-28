'use client';

import React, { useEffect } from 'react';

/** Detecta gama baja o ahorro de datos. */
function isLiteDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 2 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(prefers-reduced-data: reduce)').matches
  );
}

/**
 * Fondo "noche de estadio": reflectores, halo vinotinto y trama de césped, todo con CSS.
 * Los reflectores se encienden con el scroll (CSS scroll-driven, bajo @supports; sin soporte
 * quedan estáticos). En gama baja marca <html data-lite> y globals.css quita blur y animación.
 * Ocupa el contenedor relativo más cercano.
 */
export function StadiumBackdrop({ className = '' }: { className?: string }) {
  useEffect(() => {
    if (isLiteDevice()) document.documentElement.setAttribute('data-lite', '1');
  }, []);
  return (
    <div aria-hidden="true" className={`sb-root ${className}`}>
      <div className="sb-halo" />
      <div className="sb-beam sb-beam-l" />
      <div className="sb-beam sb-beam-c" />
      <div className="sb-beam sb-beam-r" />
      <div className="sb-turf" />
    </div>
  );
}

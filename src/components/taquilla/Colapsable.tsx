'use client';

import React from 'react';

/**
 * Contenedor plegable: se abre con grid-template-rows (0fr a 1fr) y opacidad, sin animar height.
 * Cerrado queda con visibility:hidden, así su contenido no recibe foco ni lo lee el lector de pantalla.
 * Los estilos viven en el bloque M3c de globals.css (.m3c-collapse).
 */
export function Colapsable({
  abierto,
  id,
  labelledBy,
  className = '',
  children,
}: {
  abierto: boolean;
  id: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={labelledBy}
      data-open={abierto}
      className={`m3c-collapse ${className}`}
    >
      <div className="m3c-collapse-inner">{children}</div>
    </div>
  );
}

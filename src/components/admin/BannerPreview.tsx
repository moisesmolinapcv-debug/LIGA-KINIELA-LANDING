'use client';

import React from 'react';
import type { BannerSpec } from './banner-specs';

interface BannerPreviewProps {
  spec: BannerSpec;
  src: string;
  alt: string;
  showSafe?: boolean;
  /** Ancho máximo del marco (CSS). */
  maxWidth?: string;
}

/**
 * Marco en la proporción real de la pieza (8:3 o 4:5). La imagen se ve COMPLETA (object-contain):
 * si no tiene la proporción correcta aparecen bordes en lugar de recortarse, para que se note el problema.
 * La zona segura se dibuja con los márgenes de docs/GUIA-BANNERS.md.
 */
export const BannerPreview: React.FC<BannerPreviewProps> = ({ spec, src, alt, showSafe = false, maxWidth = '100%' }) => {
  const insetX = (spec.safe.side / spec.width) * 100;
  const insetTop = (spec.safe.top / spec.height) * 100;
  const insetBottom = (spec.safe.bottom / spec.height) * 100;

  return (
    <div
      className="relative w-full mx-auto overflow-hidden rounded-xl border border-kiniela-gold/40 bg-[#000428]"
      style={{ aspectRatio: `${spec.width} / ${spec.height}`, maxWidth }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-contain" draggable={false} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-300 text-center px-3">
          Sin imagen
        </div>
      )}
      {showSafe && (
        <div
          aria-hidden="true"
          className="absolute border-2 border-dashed border-emerald-400 bg-emerald-400/10 pointer-events-none"
          style={{ left: `${insetX}%`, right: `${insetX}%`, top: `${insetTop}%`, bottom: `${insetBottom}%` }}
        />
      )}
    </div>
  );
};

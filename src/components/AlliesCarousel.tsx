import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ALIADOS } from '../content/aliados';
import { ALIADOS_SECCION } from '../content/landing';
import type { SiteCopys } from '../types/kiniela';

export interface Ally {
  name: string;
  url: string;
  logo: string;
  featured?: boolean;
}

// Aliados = Anexo A de la guía v2.0 (9 plataformas, en ese orden). Ver src/content/aliados.ts.
export const ALLIES_LIST: Ally[] = ALIADOS.map((a) => ({
  name: a.nombre,
  url: a.url,
  logo: a.logo ?? a.logoRemoto ?? '',
  featured: true,
}));

/**
 * Tamaño natural de cada archivo de /public/allies. Se declara en width/height para que el logo
 * reserve su espacio antes de cargar y nada cambie de tamaño durante la animación.
 */
const LOGO_MEDIDAS: Record<string, [number, number]> = {
  '/allies/parley-com-ve.png': [424, 180],
  '/allies/micasino.png': [230, 75],
  '/allies/triples.png': [170, 62],
  '/allies/sellatuparley.png': [206, 182],
  '/allies/juegaenlinea.png': [323, 62],
  '/allies/redhairbet.png': [265, 95],
  '/allies/meridianobet.png': [446, 86],
  '/allies/cordialito.png': [300, 60],
  '/allies/caman.png': [424, 125],
};

interface AlliesCarouselProps {
  // Se conservan por compatibilidad con la página. El rótulo, el título y el subtítulo
  // salen de src/content/landing.ts (subtítulo aprobado por el cliente, Q10).
  badgeText?: string;
  titleText?: string;
  subtitleText?: string;
  copys?: SiteCopys;
}

/**
 * Un juego completo de logos. Cada tarjeta mide exactamente lo mismo y lleva su separación
 * como margen derecho, de modo que el ancho del juego es 9 x (tarjeta + separación) sin
 * depender de que las imágenes hayan cargado.
 */
function Juego({ copia }: { copia: boolean }) {
  return (
    <ul className="m3c-set" role={copia ? 'presentation' : 'list'} aria-hidden={copia || undefined}>
      {ALLIES_LIST.map((ally) => {
        const [w, h] = LOGO_MEDIDAS[ally.logo] ?? [200, 80];
        return (
          <li key={ally.name} className="m3c-ally" role={copia ? 'presentation' : undefined}>
            <a
              href={ally.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ALIADOS_SECCION.enlace(ally.name)}
              tabIndex={copia ? -1 : undefined}
              className="m3c-ally-card"
            >
              <span className="m3c-ally-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ally.logo}
                  alt={copia ? '' : ally.name}
                  width={w}
                  height={h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  style={{ aspectRatio: `${w} / ${h}` }}
                />
              </span>
              <span className="m3c-ally-name">{ally.name}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export const AlliesCarousel: React.FC<AlliesCarouselProps> = () => {
  return (
    <section
      id="aliados"
      className="relative scroll-mt-20 overflow-hidden border-t border-[#1a2785]/50 bg-[#000428] py-16 sm:py-20"
    >
      <div className="relative z-10 mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFAF3F]/40 bg-[#882445]/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FFAF3F]">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[#FFAF3F]" />
            <span>{ALIADOS_SECCION.badge}</span>
          </div>

          <h2 className="font-rockwell text-3xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl">
            {ALIADOS_SECCION.titulo}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">{ALIADOS_SECCION.subtitulo}</p>
        </div>
      </div>

      {/* Marquesina continua: dos juegos idénticos y una sola animación CSS lineal (ver bloque M3c de globals.css) */}
      <div className="m3c-marquee" role="region" aria-label={ALIADOS_SECCION.ariaLista}>
        <div className="m3c-marquee-track">
          <Juego copia={false} />
          <Juego copia />
        </div>
      </div>
    </section>
  );
};

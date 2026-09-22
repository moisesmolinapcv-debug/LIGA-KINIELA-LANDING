'use client';

import React from 'react';
import { Banner } from '../types/kiniela';
import { Megaphone, ExternalLink, Sparkles } from 'lucide-react';

interface CommercialBannerProps {
  banner: Banner | null;
}

export const CommercialBanner: React.FC<CommercialBannerProps> = ({ banner }) => {
  if (!banner || !banner.is_active) {
    return null;
  }

  return (
    <section className="py-8 bg-kiniela-navy-deep/90 border-y border-kiniela-navy-border/50 relative overflow-hidden">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-kiniela-vinotinto/20 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-2xl overflow-hidden border border-kiniela-gold/30 bg-gradient-to-r from-kiniela-vinotinto/90 via-kiniela-navy-card/95 to-kiniela-navy-deep shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Imagen del Banner (si existe) */}
            {banner.image_url && (
              <div className="lg:col-span-4 h-48 lg:h-56 relative overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-kiniela-navy/40 to-kiniela-navy-card" />
              </div>
            )}

            {/* Contenido Informativo y Promocional */}
            <div className={`p-6 sm:p-8 ${banner.image_url ? 'lg:col-span-8' : 'lg:col-span-12 text-center'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kiniela-gold/20 border border-kiniela-gold/40 text-kiniela-gold text-xs font-bold uppercase tracking-wider mb-3">
                <Megaphone className="w-3.5 h-3.5 animate-bounce-subtle" />
                <span>Espacio Promocional Oficial</span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {banner.title}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Aprovecha las promociones especiales de la temporada y no te quedes fuera de la repartición 
                del pozo acumulado para esta gran jornada.
              </p>

              {/* Botón informativo de acción interna */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="#premios"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-kiniela-gold text-kiniela-navy font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-kiniela-gold-hover transition-colors shadow-brand-gold"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Consultar Premios de la Edición</span>
                </a>
                <a
                  href="#reglas"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold text-xs sm:text-sm transition-colors border border-white/15"
                >
                  <span>Ver Reglamento</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

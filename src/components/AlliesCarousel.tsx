'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export interface Ally {
  name: string;
  url: string;
  logo: string;
  featured?: boolean;
}

export const ALLIES_LIST: Ally[] = [
  {
    name: 'Parley.com.ve',
    url: 'https://parley.com.ve',
    logo: '/allies/parley-com-ve.png',
    featured: true,
  },
  {
    name: 'Sella Tu Parley',
    url: 'https://sellatuparley.com',
    logo: 'https://sellatuparley.com/_next/image?url=https%3A%2F%2Fcdn.sellatuparley.com%2Fs4pwa%2FPWA%2FPWA-1780400070.png&w=1920&q=75',
    featured: true,
  },
  {
    name: 'Fanaticash.com',
    url: 'https://fanaticash.com',
    logo: '/allies/fanaticash-com.jpeg',
    featured: true,
  },
  {
    name: 'Casa Grande Bets',
    url: '#',
    logo: '/allies/casa-grande-bets.jpeg',
    featured: true,
  },
  {
    name: 'Divino Play',
    url: '#',
    logo: '/allies/divino-play.jpeg',
    featured: true,
  },
  {
    name: 'Triunfobet',
    url: 'https://triunfobet.com',
    logo: 'https://whitewallets.igamingassets.co/triunfobet/commons/mesa-de-trabajo-1-copia-at-2x1682297632.png',
  },
  {
    name: 'Juega En Linea',
    url: 'https://www.juegaenlinea.com',
    logo: 'https://www.juegaenlinea.com/img/logo.png',
    featured: true,
  },
  {
    name: 'Cordialito',
    url: 'https://cordialito.la',
    logo: 'https://imagedelivery.net/nryTb-R0OMynkGTJ9JP7Sg/4bcabedb-5769-4429-ca33-9084a3e88f00/public',
    featured: true,
  },
  {
    name: 'Mi Casino',
    url: 'https://micasino.com',
    logo: 'https://storage.googleapis.com/micasino-sites/micasino/commons/logo-navidad-03-21733168513.png',
  },
  {
    name: 'King Deportes',
    url: 'https://kingdeportes.com',
    logo: 'https://whitewallets.igamingassets.co/kingdeportes/commons/recurso-1logo-horizontal-21761080908.png',
  },
  {
    name: 'Meridiano Bet',
    url: 'https://meridianobet.net',
    logo: 'https://imagedelivery.net/nryTb-R0OMynkGTJ9JP7Sg/79792d66-fbbd-4a9c-dd78-134a4fc24100/public',
  },
  {
    name: 'Triples.com.ve',
    url: 'https://triples.bet',
    logo: 'https://triples.bet/assets/img/logo-regular.png',
  },
  {
    name: 'El Ganador',
    url: 'https://elganador.bet',
    logo: 'https://whitewallets.igamingassets.co/elganador/commons/logo-version-alargada1764254439.png',
  },
  {
    name: 'Camanbet',
    url: 'https://camanbet.com',
    logo: 'https://images.virtualsoft.tech/m/msj0212T1754400564.png',
  },
  {
    name: 'Redhairbet',
    url: 'https://redhairbet.com',
    logo: 'https://redhairbet.com/storage/images/1733337657.png',
  },
];

interface AlliesCarouselProps {
  badgeText?: string;
  titleText?: string;
  subtitleText?: string;
}

export const AlliesCarousel: React.FC<AlliesCarouselProps> = ({
  badgeText,
  titleText,
  subtitleText,
}) => {
  // Duplicar lista para garantizar un ciclo infinito continuo y sin saltos
  const repeatedAllies = [...ALLIES_LIST, ...ALLIES_LIST];

  return (
    <section id="aliados" className="py-16 sm:py-20 bg-[#000428] relative overflow-hidden border-t border-[#1a2785]/50 scroll-mt-20">
      {/* Resplandores ambientales de marca */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#882445]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#FFAF3F]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#882445]/30 border border-[#FFAF3F]/40 text-[#FFAF3F] text-xs font-bold uppercase tracking-wider mb-3 shadow-brand-vinotinto">
            <ShieldCheck className="w-4 h-4 text-[#FFAF3F]" />
            <span>{badgeText || 'Red de Casas Autorizadas'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase font-rockwell">
            {titleText || '¿Dónde Jugar?'}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            {subtitleText ? (
              subtitleText
            ) : (
              <>
                <span className="text-[#FFAF3F] font-bold">Liga Kiniela</span> está inmersa en las casas de apuestas más importantes,
                serias y confiables de Venezuela. Revisa si está disponible en tu plataforma de confianza y participa directamente.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Riel de Carrusel Infinito con Pausa al Hover / Toque */}
      <div className="relative w-full overflow-hidden py-4 group">
        {/* Degradados laterales para difuminado suave */}
        <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#000428] via-[#000428]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#000428] via-[#000428]/80 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max">
          {repeatedAllies.map((ally, idx) => (
            <a
              key={`${ally.name}-${idx}`}
              href={ally.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visitar sitio oficial de ${ally.name}`}
              className="flex-shrink-0 w-52 sm:w-64 h-28 sm:h-32 px-5 py-4 rounded-2xl bg-gradient-to-b from-[#060e4f]/80 to-[#00063E]/95 border border-[#1a2785] hover:border-[#FFAF3F]/60 shadow-lg hover:shadow-[0_0_20px_rgba(255,175,63,0.3)] transition-all duration-300 hover:scale-105 flex flex-col items-center justify-between group/card relative backdrop-blur-sm"
            >
              {/* Badge sutil de link externo */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                <ExternalLink className="w-3.5 h-3.5 text-[#FFAF3F]" />
              </div>

              {/* Logo de la Casa de Apuestas */}
              <div className="h-14 sm:h-16 w-full flex items-center justify-center p-1">
                <img
                  src={ally.logo}
                  alt={ally.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md brightness-95 group-hover/card:brightness-110 transition-all"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback visual si el CDN del aliado no responde
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.fallback-name')) {
                      const span = document.createElement('span');
                      span.className = 'fallback-name text-xs font-bold text-white tracking-wider text-center uppercase';
                      span.innerText = ally.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>

              {/* Nombre y etiqueta de verificación */}
              <div className="w-full flex items-center justify-between border-t border-[#1a2785]/60 pt-2 text-[11px] text-slate-400 group-hover/card:text-[#FFAF3F] transition-colors">
                <span className="font-semibold truncate max-w-[130px]">{ally.name}</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Aliado
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Pie descriptivo del carrusel */}
      <div className="max-w-7xl mx-auto px-4 mt-6 text-center">
        <span className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FFAF3F]" />
          Haz clic en cualquier casa de apuestas para verificar y acceder a la plataforma oficial.
        </span>
      </div>
    </section>
  );
};

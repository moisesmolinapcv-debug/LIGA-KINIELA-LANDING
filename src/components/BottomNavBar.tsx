'use client';

import React, { useState, useEffect } from 'react';
import { Home, CalendarDays, Trophy, Award, Sparkles, ShieldCheck } from 'lucide-react';

interface BottomNavBarProps {
  prizeText?: string;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ prizeText = 'Premio' }) => {
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [isAtEdge, setIsAtEdge] = useState<boolean>(true); // Detecta si está al tope superior o inferior

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Detectar si está en el tope superior o tope inferior
      const isTop = scrollY < 120;
      const isBottom = scrollY + windowHeight >= documentHeight - 120;
      setIsAtEdge(isTop || isBottom);

      // Scroll Spy para secciones de la landing
      const sections = [
        { id: 'aliados', key: 'aliados' },
        { id: 'campeones', key: 'campeones' },
        { id: 'partidos', key: 'partidos' },
        { id: 'premios', key: 'premios' },
      ];

      let current = 'inicio';
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Si la sección está dentro de la ventana de visualización
          if (rect.top <= windowHeight * 0.45 && rect.bottom >= windowHeight * 0.15) {
            current = sec.key;
            break;
          }
        }
      }

      if (isTop) {
        current = 'inicio';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Chequeo inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string, key: string) => {
    setActiveSection(key);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // El botón central toma color completo cuando está en 'premios', o cuando el usuario está en los topes
  const isCenterActive = activeSection === 'premios' || isAtEdge;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none lg:hidden animate-fadeIn">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        {/* Contenedor Flotante Tipo Vidrio Templado Translúcido */}
        <nav
          aria-label="Navegación rápida móvil"
          className="relative rounded-3xl bg-[#00063E]/80 backdrop-blur-xl border border-[#FFAF3F]/30 shadow-[0_8px_32px_rgba(0,4,40,0.65)] px-2 py-2 flex items-center justify-between"
        >
          {/* 1. Atajo: Inicio */}
          <button
            type="button"
            onClick={() => scrollTo('top', 'inicio')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 relative ${
              activeSection === 'inicio'
                ? 'text-[#FFAF3F]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeSection === 'inicio' && (
              <span className="absolute inset-0 bg-[#FFAF3F]/15 rounded-2xl blur-sm" />
            )}
            <Home
              className={`w-5 h-5 transition-transform duration-300 ${
                activeSection === 'inicio' ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,175,63,0.8)]' : ''
              }`}
            />
            <span className="text-[10px] font-bold mt-1 tracking-tight">Inicio</span>
            {activeSection === 'inicio' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFAF3F] mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 2. Atajo: Partidos */}
          <button
            type="button"
            onClick={() => scrollTo('partidos', 'partidos')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 relative ${
              activeSection === 'partidos'
                ? 'text-[#FFAF3F]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeSection === 'partidos' && (
              <span className="absolute inset-0 bg-[#FFAF3F]/15 rounded-2xl blur-sm" />
            )}
            <CalendarDays
              className={`w-5 h-5 transition-transform duration-300 ${
                activeSection === 'partidos' ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,175,63,0.8)]' : ''
              }`}
            />
            <span className="text-[10px] font-bold mt-1 tracking-tight">Partidos</span>
            {activeSection === 'partidos' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFAF3F] mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 3. PUNTO MEDIO PROTAGONISTA: BOTÓN ELEVADO PREMIO / POZO */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-6">
            <button
              type="button"
              onClick={() => scrollTo('premios', 'premios')}
              aria-label="Ver Pozo de Premios"
              className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl active:scale-95 group ${
                isCenterActive
                  ? 'bg-gradient-to-tr from-[#882445] via-[#a32b53] to-[#FFAF3F] border-2 border-[#FFAF3F] shadow-[0_0_25px_rgba(255,175,63,0.6)] scale-110'
                  : 'bg-gradient-to-tr from-[#060e4f] to-[#0c186b] border-2 border-[#FFAF3F]/50 shadow-[0_0_15px_rgba(0,6,62,0.8)]'
              }`}
            >
              {/* Resplandor pulsante */}
              <span
                className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
                  isCenterActive
                    ? 'bg-[#FFAF3F]/30 blur-md animate-ping'
                    : 'opacity-0'
                }`}
              />

              <Trophy
                className={`w-7 h-7 relative z-10 transition-transform duration-300 ${
                  isCenterActive
                    ? 'text-white scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                    : 'text-[#FFAF3F] group-hover:scale-110'
                }`}
              />
            </button>
            <span
              className={`text-[10px] font-black uppercase tracking-wider mt-1 transition-colors ${
                isCenterActive ? 'text-[#FFAF3F] glow-gold-text' : 'text-slate-300'
              }`}
            >
              Premio
            </span>
          </div>

          {/* 4. Atajo: Campeones */}
          <button
            type="button"
            onClick={() => scrollTo('campeones', 'campeones')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 relative ${
              activeSection === 'campeones'
                ? 'text-[#FFAF3F]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeSection === 'campeones' && (
              <span className="absolute inset-0 bg-[#FFAF3F]/15 rounded-2xl blur-sm" />
            )}
            <Award
              className={`w-5 h-5 transition-transform duration-300 ${
                activeSection === 'campeones' ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,175,63,0.8)]' : ''
              }`}
            />
            <span className="text-[10px] font-bold mt-1 tracking-tight">Campeones</span>
            {activeSection === 'campeones' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFAF3F] mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 5. Atajo: Dónde Jugar (Aliados) */}
          <button
            type="button"
            onClick={() => scrollTo('aliados', 'aliados')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-300 relative ${
              activeSection === 'aliados'
                ? 'text-[#FFAF3F]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {activeSection === 'aliados' && (
              <span className="absolute inset-0 bg-[#FFAF3F]/15 rounded-2xl blur-sm" />
            )}
            <ShieldCheck
              className={`w-5 h-5 transition-transform duration-300 ${
                activeSection === 'aliados' ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,175,63,0.8)]' : ''
              }`}
            />
            <span className="text-[10px] font-bold mt-1 tracking-tight truncate max-w-[55px]">Aliados</span>
            {activeSection === 'aliados' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFAF3F] mt-0.5 animate-pulse" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};

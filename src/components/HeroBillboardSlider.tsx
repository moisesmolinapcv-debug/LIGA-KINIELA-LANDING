'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BannerSlide } from '../types/kiniela';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

interface HeroBillboardSliderProps {
  slides?: BannerSlide[];
}

export const HeroBillboardSlider: React.FC<HeroBillboardSliderProps> = ({ slides = [] }) => {
  // Filtrar solo banners activos y ordenar
  const activeSlides = slides
    .filter((s) => s.is_active)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const total = activeSlides.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay inteligente cada 5.5 segundos
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [total, isPaused, nextSlide]);

  // Manejo de gestos táctiles (Swipe en móviles y tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // Distancia mínima para considerar swipe

    if (distance > minSwipeDistance) {
      // Swipe hacia la izquierda -> Siguiente slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swipe hacia la derecha -> Slide anterior
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) {
    return null;
  }

  const currentSlide = activeSlides[currentIndex];

  const handleActionClick = (targetSection?: string) => {
    const sectionId = targetSection?.replace('#', '') || 'partidos';
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-8 animate-fadeIn">
      {/* Contenedor Principal de la Valla Publicitaria */}
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,4,40,0.8)] border border-[#FFAF3F]/40 group bg-[#000428]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Contenedor de Proporción Responsiva:
            - En Móvil: aspect-[16/10] min-h-[200px] max-h-[250px] compacto y atlético
            - En Tablet: aspect-[16/8] min-h-[300px]
            - En Escritorio: aspect-[21/8] min-h-[380px] max-h-[500px] panorámico */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] lg:aspect-[21/8] min-h-[200px] max-h-[250px] sm:min-h-[300px] sm:max-h-[500px] lg:min-h-[380px]">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id || idx}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Imagen Responsiva con corte panorámico para PC y corte vertical para Móvil */}
                <picture className="w-full h-full block">
                  {/* Imagen para Tablet y Escritorio (pantallas >= 640px) */}
                  <source media="(min-width: 640px)" srcSet={slide.image_url} />
                  {/* Imagen para Smartphones Móviles */}
                  <img
                    src={slide.image_url_mobile || slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center brightness-95 filter select-none transition-transform duration-700 hover:scale-[1.02]"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('photo-1579952363873-27f3bade9f55')) {
                        target.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1080&h=1250&q=80';
                      }
                    }}
                  />
                </picture>

                {/* Viñeta degradada protectora sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00063E]/95 via-[#00063E]/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#00063E]/70 via-transparent to-[#00063E]/40 pointer-events-none hidden sm:block" />

                {/* Contenido Comercial Sobrepuesto */}
                <div className="absolute inset-0 p-3 sm:p-6 md:p-10 flex flex-col justify-between z-10 pointer-events-none">
                  {/* Badge Superior */}
                  <div className="flex items-center justify-between pointer-events-auto">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#00063E]/85 backdrop-blur-md border border-[#FFAF3F]/50 text-[#FFAF3F] text-[9px] sm:text-xs font-black uppercase tracking-wider shadow-md">
                      <Sparkles className="w-3 h-3 text-[#FFAF3F]" />
                      <span>Promoción Oficial</span>
                    </div>

                    {/* Indicador de número de banner */}
                    {total > 1 && (
                      <span className="text-[9px] sm:text-xs font-mono font-bold text-slate-300 bg-[#000428]/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border border-white/10">
                        {currentIndex + 1} / {total}
                      </span>
                    )}
                  </div>

                  {/* Bloque Inferior: Título y Botón de Acción Táctil */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-4 pointer-events-auto">
                    <div className="max-w-xl">
                      <h3 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight font-rockwell leading-snug sm:leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] line-clamp-2 sm:line-clamp-none">
                        {slide.title}
                      </h3>
                    </div>

                    {/* Botón CTA Comercial de Alta Conversión */}
                    <button
                      type="button"
                      onClick={() => handleActionClick(slide.target_section)}
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#FFAF3F] to-[#ff9e1f] hover:from-[#ff9e1f] hover:to-[#FFAF3F] text-[#00063E] font-black text-[11px] sm:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(255,175,63,0.45)] hover:shadow-[0_6px_25px_rgba(255,175,63,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 min-h-[34px] sm:min-h-[44px]"
                    >
                      <span>{slide.button_text || 'Ver Partidos →'}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flechas de Navegación Lateral (Disponibles en Escritorio y Tablet) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#00063E]/75 backdrop-blur-md border border-[#FFAF3F]/40 text-white hover:text-[#FFAF3F] hover:border-[#FFAF3F] hover:bg-[#00063E] flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:flex shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Slide siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#00063E]/75 backdrop-blur-md border border-[#FFAF3F]/40 text-white hover:text-[#FFAF3F] hover:border-[#FFAF3F] hover:bg-[#00063E] flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:flex shadow-lg hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Puntos de Paginación (Dots como en SellaTuParley) */}
        {total > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
            {activeSlides.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={`dot-${idx}`}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Ir al slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#FFAF3F] shadow-[0_0_10px_#FFAF3F]'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BannerSlide } from '../types/kiniela';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Carrusel de banners. La pieza gráfica trae toda la información: aquí no se
 * sobrepone ningún texto ni botón. Proporciones fijas para que no se recorte:
 *  - Móvil (< 768 px): 4:5   → 1080 × 1350 px
 *  - Tablet y escritorio:     8:3   → 1920 × 720 px
 * Ver docs/GUIA-BANNERS.md (medidas, zonas seguras y plantillas).
 */

interface HeroBillboardSliderProps {
  slides?: BannerSlide[];
}

export const HeroBillboardSlider: React.FC<HeroBillboardSliderProps> = ({ slides = [] }) => {
  const activeSlides = slides
    .filter((s) => s.is_active)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = activeSlides.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Si se desactiva o elimina un banner, el índice no puede quedar fuera de rango
  useEffect(() => {
    if (currentIndex >= total && total > 0) setCurrentIndex(0);
  }, [currentIndex, total]);

  // Autoplay cada 5,5 s; se pausa con el cursor o el dedo encima
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) nextSlide();
    else if (distance < -45) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (total === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <div
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#FFAF3F]/30 group bg-[#000428]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Avisos de Liga Kiniela"
      >
        {/* Proporción exacta de cada pieza: la imagen llena el marco sin recortarse */}
        <div className="relative w-full aspect-[4/5] md:aspect-[8/3]">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id || idx}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <picture className="block w-full h-full">
                  <source media="(min-width: 768px)" srcSet={slide.image_url} />
                  <img
                    src={slide.image_url_mobile || slide.image_url}
                    alt={slide.title}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </picture>
              </div>
            );
          })}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Aviso anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#00063E]/75 border border-[#FFAF3F]/40 text-white hover:text-[#FFAF3F] hover:border-[#FFAF3F] items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hidden md:flex"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Aviso siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#00063E]/75 border border-[#FFAF3F]/40 text-white hover:text-[#FFAF3F] hover:border-[#FFAF3F] items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hidden md:flex"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1">
              {activeSlides.map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Ir al aviso ${idx + 1}`}
                    aria-current={isActive}
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive ? 'w-6 h-2 bg-[#FFAF3F]' : 'w-2 h-2 bg-white/50'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

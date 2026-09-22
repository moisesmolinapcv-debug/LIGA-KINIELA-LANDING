'use client';

import React, { useState, useEffect } from 'react';
import { KinielaEdition, BannerSlide } from '../types/kiniela';
import { formatBs } from '../lib/kiniela-store';
import { HeroBillboardSlider } from './HeroBillboardSlider';
import { Trophy, Ticket, Flame, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  edition: KinielaEdition;
  slides?: BannerSlide[];
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const Hero: React.FC<HeroProps> = ({ edition, slides = [] }) => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    setMounted(true);
    const calculateTime = () => {
      const targetTime = new Date(edition.end_date).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [edition.end_date]);

  return (
    <section id="inicio" className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20 overflow-hidden bg-gradient-to-b from-kiniela-navy-deep via-kiniela-navy to-kiniela-navy-deep scroll-mt-20">
      {/* Luces de fondo y resplandores de estadio */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-kiniela-vinotinto/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-kiniela-gold/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-kiniela-navy-cardLight/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Trama sutil deportiva */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,175,63,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      <div className="relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO BILLBOARD SLIDER (CARRUSEL PUBLICITARIO ESTILO SELLATUPARLEY)     */}
        {/* ========================================================================= */}
        <HeroBillboardSlider slides={slides} />

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            
            {/* Badge superior de edición activa */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-kiniela-vinotinto/40 border border-kiniela-gold/40 text-kiniela-gold-light text-[11px] sm:text-sm font-semibold mb-3 sm:mb-5 shadow-brand-vinotinto animate-fadeIn">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-kiniela-gold animate-bounce-subtle" />
              <span className="uppercase tracking-wider">{edition.edition_number || 'Jornada Deportiva'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-kiniela-gold"></span>
              <span className="text-white">Pronósticos Oficiales</span>
            </div>

            {/* Título Principal Dinámico de la Kiniela */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white uppercase max-w-4xl leading-tight font-rockwell">
              {edition.title || 'KINIELA MILLONARIA'}
            </h1>

            {/* Subtítulo Persuasivo */}
            <p className="mt-2 text-xs sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed px-1 sm:px-2">
              La emoción del fútbol nacional e internacional en una sola cartelera. Pronostica cada jornada, 
              sigue los marcadores en tiempo real y sé el próximo en levantar el trofeo.
            </p>

            {/* Contador Regresivo en Vivo */}
            <div className="mt-4 sm:mt-7 w-full max-w-2xl bg-kiniela-navy-deep/80 border border-kiniela-navy-border/80 rounded-xl sm:rounded-2xl p-3 sm:p-6 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-4 text-slate-300 text-[11px] sm:text-sm uppercase font-semibold tracking-wider">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-kiniela-gold animate-spin-slow" />
                <span>Tiempo restante para el cierre de jugadas</span>
              </div>

              {timeLeft.isExpired ? (
                <div className="py-2 sm:py-3 text-center">
                  <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-kiniela-vinotinto text-white rounded-lg font-bold text-xs sm:text-base animate-pulse">
                    ¡CIERRE DE RECEPCIÓN COMPLETADO! PARTIDOS EN DISPUTA
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5 sm:gap-4" suppressHydrationWarning>
                  {/* Días */}
                  <div className="flex flex-col items-center justify-center p-1.5 sm:p-4 rounded-lg sm:rounded-xl bg-kiniela-navy-card border border-kiniela-navy-border/60">
                    <span suppressHydrationWarning className="text-lg sm:text-3xl md:text-4xl font-extrabold text-kiniela-gold tracking-tight font-mono">
                      {mounted ? String(timeLeft.days).padStart(2, '0') : '00'}
                    </span>
                    <span className="text-[9px] sm:text-xs uppercase text-slate-400 font-medium mt-0.5 sm:mt-1">Días</span>
                  </div>

                  {/* Horas */}
                  <div className="flex flex-col items-center justify-center p-1.5 sm:p-4 rounded-lg sm:rounded-xl bg-kiniela-navy-card border border-kiniela-navy-border/60">
                    <span suppressHydrationWarning className="text-lg sm:text-3xl md:text-4xl font-extrabold text-kiniela-gold tracking-tight font-mono">
                      {mounted ? String(timeLeft.hours).padStart(2, '0') : '00'}
                    </span>
                    <span className="text-[9px] sm:text-xs uppercase text-slate-400 font-medium mt-0.5 sm:mt-1">Horas</span>
                  </div>

                  {/* Minutos */}
                  <div className="flex flex-col items-center justify-center p-1.5 sm:p-4 rounded-lg sm:rounded-xl bg-kiniela-navy-card border border-kiniela-navy-border/60">
                    <span suppressHydrationWarning className="text-lg sm:text-3xl md:text-4xl font-extrabold text-kiniela-gold tracking-tight font-mono">
                      {mounted ? String(timeLeft.minutes).padStart(2, '0') : '00'}
                    </span>
                    <span className="text-[9px] sm:text-xs uppercase text-slate-400 font-medium mt-0.5 sm:mt-1">Min</span>
                  </div>

                  {/* Segundos */}
                  <div className="flex flex-col items-center justify-center p-1.5 sm:p-4 rounded-lg sm:rounded-xl bg-kiniela-navy-card border border-kiniela-navy-border/60">
                    <span suppressHydrationWarning className="text-lg sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-mono animate-pulse">
                      {mounted ? String(timeLeft.seconds).padStart(2, '0') : '00'}
                    </span>
                    <span className="text-[9px] sm:text-xs uppercase text-slate-400 font-medium mt-0.5 sm:mt-1">Seg</span>
                  </div>
                </div>
              )}
            </div>

            {/* Tarjetas Destacadas de Precio del Ticket y Monto del Premio */}
            <div id="premios" className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-6 w-full max-w-3xl scroll-mt-24">
              
              {/* Tarjeta: Pozo de Premio Acumulado en Bs */}
              <div className="relative group overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-7 bg-gradient-to-br from-kiniela-vinotinto/60 via-kiniela-navy-card to-kiniela-navy-deep border-2 border-kiniela-gold/60 shadow-brand-gold transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 transition-opacity">
                  <Trophy className="w-20 sm:w-24 h-20 sm:h-24 text-kiniela-gold" />
                </div>
                
                <div className="flex items-center gap-2 text-kiniela-gold-light mb-1">
                  <Trophy className="w-4 sm:w-5 h-4 sm:h-5 text-kiniela-gold flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Gran Premio Acumulado</span>
                </div>
                
                <div className="mt-2 text-2xl sm:text-4xl md:text-5xl font-black text-kiniela-gold tracking-tight glow-gold-text font-rockwell">
                  {formatBs(edition.prize_amount_bs)}
                </div>
                
                <p className="mt-1.5 text-xs sm:text-sm text-slate-200 font-semibold">
                  Monto oficial garantizado para esta edición
                </p>
                
                <div className="mt-4 flex items-center gap-2 text-[11px] sm:text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 py-1 px-2.5 rounded-lg w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-bold">Garantizado al 100% de aciertos</span>
                </div>
              </div>

              {/* Tarjeta: Precio del Ticket en Bs */}
              <div className="relative group overflow-hidden rounded-2xl p-5 sm:p-7 bg-gradient-to-br from-kiniela-navy-card via-kiniela-navy to-kiniela-navy-deep border-2 border-kiniela-navy-border hover:border-kiniela-gold/50 shadow-xl transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-30 transition-opacity">
                  <Ticket className="w-20 sm:w-24 h-20 sm:h-24 text-white" />
                </div>
                
                <div className="flex items-center gap-2 text-slate-300 mb-1">
                  <Ticket className="w-4 sm:w-5 h-4 sm:h-5 text-kiniela-gold flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold tracking-wider uppercase">Precio del Ticket</span>
                </div>
                
                <div className="mt-2 text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-rockwell">
                  {formatBs(edition.ticket_price_bs)}
                </div>
                
                <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-medium">
                  Valor por cada combinación pronosticada
                </p>
                
                <div className="mt-4 flex items-center gap-2 text-[11px] sm:text-xs text-slate-200 bg-white/10 border border-white/15 py-1 px-2.5 rounded-lg w-fit">
                  <span className="w-2 h-2 rounded-full bg-kiniela-gold animate-pulse flex-shrink-0"></span>
                  <span className="font-medium">Costo único por jugada</span>
                </div>
              </div>

            </div>

            {/* Botón Informativo: Ver Cartelera */}
            <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#partidos"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold uppercase tracking-wider text-kiniela-navy bg-gradient-to-r from-kiniela-gold to-kiniela-gold-hover hover:from-kiniela-gold-hover hover:to-kiniela-gold text-center shadow-brand-gold transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>Ver Cartelera de Partidos</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

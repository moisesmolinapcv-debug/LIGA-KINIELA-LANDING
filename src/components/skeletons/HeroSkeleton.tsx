'use client';

import React from 'react';

export const HeroSkeleton: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-2 sm:pt-4 pb-12 sm:pb-20">
      {/* 1. Silueta del Billboard Slider */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <div className="w-full aspect-[4/3] sm:aspect-[16/7] md:aspect-[21/7] rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#060e4f]/80 via-[#1a2785]/50 to-[#060e4f]/80 animate-pulse border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 space-y-2 max-w-md">
            <div className="h-4 sm:h-6 w-48 sm:w-72 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-3 sm:h-4 w-32 sm:w-44 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. Siluetas de la Cabecera Hero */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge superior */}
          <div className="h-7 w-52 rounded-full bg-kiniela-vinotinto/30 border border-kiniela-gold/20 animate-pulse mb-4" />

          {/* Título Principal */}
          <div className="h-10 sm:h-14 md:h-16 w-3/4 max-w-2xl bg-white/10 rounded-2xl animate-pulse mb-3" />

          {/* Subtítulo */}
          <div className="space-y-2 w-full max-w-xl flex flex-col items-center mb-6">
            <div className="h-4 w-full bg-slate-700/50 rounded-lg animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-700/50 rounded-lg animate-pulse" />
          </div>

          {/* Contador Regresivo */}
          <div className="w-full max-w-2xl bg-kiniela-navy-deep/80 border border-kiniela-navy-border/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl mb-6">
            <div className="h-4 w-48 bg-white/10 rounded-md mx-auto mb-4 animate-pulse" />
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 sm:h-20 rounded-xl bg-kiniela-navy-card/80 border border-kiniela-navy-border/60 animate-pulse flex flex-col items-center justify-center p-2"
                >
                  <div className="h-6 sm:h-8 w-10 bg-kiniela-gold/20 rounded-md mb-1" />
                  <div className="h-2.5 w-8 bg-slate-700 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Tarjetas de Pozo y Ticket */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
            {/* Tarjeta Premio */}
            <div className="h-44 sm:h-52 rounded-2xl p-6 bg-kiniela-navy-card/70 border-2 border-kiniela-gold/30 animate-pulse flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-kiniela-gold/20 rounded-md" />
                <div className="h-10 w-52 bg-kiniela-gold/30 rounded-xl" />
              </div>
              <div className="h-3 w-40 bg-slate-700 rounded-md" />
            </div>

            {/* Tarjeta Ticket */}
            <div className="h-44 sm:h-52 rounded-2xl p-6 bg-kiniela-navy-card/70 border-2 border-kiniela-navy-border/60 animate-pulse flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-white/10 rounded-md" />
                <div className="h-10 w-40 bg-white/20 rounded-xl" />
              </div>
              <div className="h-3 w-36 bg-slate-700 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

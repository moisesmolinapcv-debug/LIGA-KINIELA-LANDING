'use client';

import React from 'react';

export const MatchesSkeleton: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-kiniela-navy relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div className="space-y-3">
            <div className="h-6 w-48 rounded-md bg-kiniela-vinotinto/30 border border-kiniela-gold/20 animate-pulse" />
            <div className="h-9 sm:h-11 w-72 sm:w-96 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-4 w-64 sm:w-80 rounded-md bg-slate-700/50 animate-pulse" />
          </div>

          {/* Filtros Skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 sm:w-24 rounded-xl bg-kiniela-navy-card/80 border border-kiniela-navy-border/60 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Grid de 4 Partidos Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 sm:p-6 bg-kiniela-navy-card/80 border border-kiniela-navy-border/60 animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="h-4 w-28 bg-white/10 rounded-md" />
                <div className="h-5 w-20 bg-slate-800 rounded-full" />
              </div>

              {/* Equipos */}
              <div className="grid grid-cols-3 items-center py-3">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800" />
                  <div className="h-3 w-16 bg-white/10 rounded-md" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="h-7 w-12 bg-kiniela-gold/20 rounded-lg" />
                  <div className="h-2.5 w-10 bg-slate-700 rounded-md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-800" />
                  <div className="h-3 w-16 bg-white/10 rounded-md" />
                </div>
              </div>

              {/* Botones de pronóstico 1 X 2 */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                {[1, 2, 3].map((b) => (
                  <div key={b} className="h-10 rounded-xl bg-slate-800/80 border border-white/5" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

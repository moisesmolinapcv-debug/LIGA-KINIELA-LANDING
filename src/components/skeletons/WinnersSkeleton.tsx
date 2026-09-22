'use client';

import React from 'react';

export const WinnersSkeleton: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-kiniela-navy-deep relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="h-6 w-44 rounded-full bg-kiniela-gold/15 border border-kiniela-gold/20 mx-auto animate-pulse" />
          <div className="h-10 sm:h-12 w-64 sm:w-80 rounded-2xl bg-white/10 mx-auto animate-pulse" />
          <div className="h-4 w-3/4 max-w-md bg-slate-700/50 rounded-md mx-auto animate-pulse" />
        </div>

        {/* 3 Tarjetas de Campeones Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-kiniela-navy-card/80 border border-kiniela-navy-border/60 animate-pulse flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="h-3 w-28 bg-slate-700 rounded-md" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex-shrink-0" />
                  <div className="space-y-1.5 flex-grow">
                    <div className="h-5 w-36 bg-white/10 rounded-md" />
                    <div className="h-3 w-24 bg-emerald-500/20 rounded-md" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="h-3 w-20 bg-slate-700 rounded-md" />
                <div className="h-7 w-44 bg-kiniela-gold/20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

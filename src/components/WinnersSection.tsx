'use client';

import React from 'react';
import { Winner, SiteCopys } from '../types/kiniela';
import { Trophy, Medal, MapPin, Calendar, CheckCircle, Award } from 'lucide-react';

interface WinnersSectionProps {
  winners: Winner[];
  copys?: SiteCopys;
}

export const WinnersSection: React.FC<WinnersSectionProps> = ({ winners, copys }) => {
  return (
    <section id="campeones" className="py-16 sm:py-24 bg-kiniela-navy-deep relative scroll-mt-20">
      {/* Luces sutiles */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-kiniela-gold/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-kiniela-vinotinto/15 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kiniela-gold/15 border border-kiniela-gold/30 text-kiniela-gold text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-4 h-4 text-kiniela-gold" />
            <span>{copys?.winners_badge || 'Transparencia & Cumplimiento'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            {copys?.winners_title || 'Salón de Campeones'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            {copys?.winners_subtitle || 'Conoce a los ganadores que acertaron sus pronósticos y se llevaron el pozo acumulado. En Liga Kiniela premiamos el conocimiento futbolístico de cada venezolano.'}
          </p>
        </div>

        {/* Tarjetas de Ganadores */}
        {winners.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-kiniela-navy-card/50 border border-kiniela-navy-border/50">
            <Award className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Los campeones de las próximas ediciones serán publicados aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner, idx) => (
              <div
                key={winner.id || idx}
                className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  winner.is_recent
                    ? 'bg-gradient-to-b from-kiniela-navy-card via-kiniela-navy to-kiniela-navy-deep border-2 border-kiniela-gold/60 shadow-brand-gold hover:scale-[1.02]'
                    : 'bg-kiniela-navy-card/75 backdrop-blur-md border border-kiniela-navy-border hover:border-kiniela-gold/30 hover:scale-[1.01]'
                }`}
              >
                {/* Badge de Campeón Reciente */}
                {winner.is_recent && (
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-kiniela-gold to-kiniela-gold-hover text-kiniela-navy text-[11px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Medal className="w-3.5 h-3.5" />
                    <span>Último Ganador</span>
                  </div>
                )}

                <div>
                  {/* Edición */}
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    {winner.edition_title}
                  </div>

                  {/* Nombre del Ganador */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-kiniela-vinotinto/40 border border-kiniela-gold/40 flex items-center justify-center text-kiniela-gold font-bold text-lg shadow-inner">
                      <Trophy className="w-6 h-6 text-kiniela-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                        {winner.winner_name}
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Premio Verificado y Cobrado</span>
                      </span>
                    </div>
                  </div>

                  {/* Premio Destacado */}
                  <div className="p-3.5 rounded-xl bg-kiniela-navy-deep/90 border border-kiniela-gold/25 mb-4">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-0.5">
                      Premio Obtenido
                    </span>
                    <span className="text-2xl font-black text-kiniela-gold tracking-tight font-serif glow-gold-text">
                      {winner.prize_won}
                    </span>
                  </div>
                </div>

                {/* Footer de la tarjeta con Ciudad y Fecha */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-kiniela-gold" />
                    <span>{winner.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{winner.winning_date}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Garantía Institucional de Transparencia */}
        <div className="mt-12 p-6 rounded-2xl bg-kiniela-navy-card/60 border border-kiniela-navy-border/60 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-full bg-kiniela-vinotinto/30 border border-kiniela-vinotinto flex items-center justify-center flex-shrink-0">
            <Award className="w-7 h-7 text-kiniela-gold" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Compromiso Total de Transparencia</h4>
            <p className="text-sm text-slate-300 mt-0.5">
              Cada edición cuenta con actas oficiales de premiación. Los resultados finales se auditan de forma 
              pública e inmediata al concluir el último encuentro de la jornada.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

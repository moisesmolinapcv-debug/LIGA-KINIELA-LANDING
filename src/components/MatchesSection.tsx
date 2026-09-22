'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Match, MatchStatus, SiteCopys } from '../types/kiniela';
import { Radio, Clock, CheckCircle2, Trophy, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface MatchesSectionProps {
  matches: Match[];
  copys?: SiteCopys;
}

type FilterType = 'TODOS' | 'EN VIVO' | 'EN ESPERA' | 'FINALIZADO';

export const MatchesSection: React.FC<MatchesSectionProps> = ({ matches, copys }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS');

  // Estadísticas rápidas para los contadores
  const stats = useMemo(() => {
    return {
      total: matches.length,
      enVivo: matches.filter((m) => m.status === 'EN VIVO').length,
      enEspera: matches.filter((m) => m.status === 'EN ESPERA').length,
      finalizados: matches.filter((m) => m.status === 'FINALIZADO').length,
    };
  }, [matches]);

  // Filtrado de partidos
  const filteredMatches = useMemo(() => {
    if (activeFilter === 'TODOS') return matches;
    return matches.filter((m) => m.status === activeFilter);
  }, [matches, activeFilter]);

  // Formateador de fecha amigable (Hora de Venezuela UTC-4)
  const formatMatchDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;

      return new Intl.DateTimeFormat('es-VE', {
        timeZone: 'America/Caracas',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="partidos" className="py-16 sm:py-24 bg-kiniela-navy relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-kiniela-vinotinto/30 text-kiniela-gold text-xs font-bold tracking-wider uppercase mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>{copys?.matches_badge || 'Cartelera Oficial de Pronósticos'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              {copys?.matches_title || 'Encuentros de la Jornada'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
              {copys?.matches_subtitle || 'Sigue el marcador y el estatus en tiempo real de cada uno de los partidos seleccionados para esta edición.'}
            </p>
          </div>

          {/* Filtros por Estado */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveFilter('TODOS')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeFilter === 'TODOS'
                  ? 'bg-kiniela-gold text-kiniela-navy shadow-brand-gold'
                  : 'bg-kiniela-navy-card text-slate-300 hover:bg-kiniela-navy-cardLight border border-kiniela-navy-border/60'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Todos ({stats.total})</span>
            </button>

            <button
              onClick={() => setActiveFilter('EN VIVO')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeFilter === 'EN VIVO'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
                  : 'bg-kiniela-navy-card text-red-400 hover:bg-kiniela-navy-cardLight border border-red-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>En Vivo ({stats.enVivo})</span>
            </button>

            <button
              onClick={() => setActiveFilter('EN ESPERA')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeFilter === 'EN ESPERA'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/40'
                  : 'bg-kiniela-navy-card text-sky-400 hover:bg-kiniela-navy-cardLight border border-sky-500/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Por Jugar ({stats.enEspera})</span>
            </button>

            <button
              onClick={() => setActiveFilter('FINALIZADO')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeFilter === 'FINALIZADO'
                  ? 'bg-slate-600 text-white shadow-lg'
                  : 'bg-kiniela-navy-card text-slate-400 hover:bg-kiniela-navy-cardLight border border-slate-700/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finalizados ({stats.finalizados})</span>
            </button>
          </div>
        </div>

        {/* Lista o Cuadrícula de Partidos Estilo Transmisión Deportiva */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-kiniela-navy-deep/60 border border-kiniela-navy-border/50">
            <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-lg font-medium text-slate-300">No hay partidos en esta categoría en este momento.</p>
            <button
              onClick={() => setActiveFilter('TODOS')}
              className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-kiniela-gold bg-kiniela-navy-card rounded-lg hover:bg-kiniela-navy-cardLight"
            >
              Ver todos los partidos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {filteredMatches.map((match, index) => {
              const isLive = match.status === 'EN VIVO';
              const isFinished = match.status === 'FINALIZADO';
              const isPending = match.status === 'EN ESPERA';

              return (
                <div
                  key={match.id}
                  className={`relative rounded-2xl overflow-hidden p-5 transition-all duration-300 border ${
                    isLive
                      ? 'bg-gradient-to-r from-kiniela-navy-card via-[#160b29] to-kiniela-navy-card border-red-500/60 shadow-lg shadow-red-950/30'
                      : 'bg-kiniela-navy-card/85 backdrop-blur-md border-kiniela-navy-border/60 hover:border-kiniela-gold/40 hover:shadow-xl'
                  }`}
                >
                  {/* Barra Superior de la Tarjeta */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <span className="text-kiniela-gold font-bold">#{index + 1}</span>
                      <span>•</span>
                      <span suppressHydrationWarning className="flex items-center gap-1 text-slate-300 capitalize">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatMatchDate(match.match_date)}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isLive && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/25 border border-red-500/50 text-red-400 font-bold uppercase text-[11px] animate-radar">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                          <span>EN VIVO {match.minute ? `(${match.minute})` : ''}</span>
                        </div>
                      )}

                      {isPending && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950/50 border border-sky-500/40 text-sky-300 font-semibold uppercase text-[11px]">
                          <span>PROGRAMADO</span>
                        </div>
                      )}

                      {isFinished && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-600/50 text-slate-300 font-bold uppercase text-[11px]">
                          <span>FINAL {match.minute ? `(${match.minute})` : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cuerpo del Partido: Equipos y Marcador */}
                  <div className="grid grid-cols-7 items-center gap-2">
                    {/* Equipo Local */}
                    <div className="col-span-3 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full p-2 bg-kiniela-navy-deep/80 border border-white/15 flex items-center justify-center shadow-inner relative mb-2">
                        {match.home_logo ? (
                          <img
                            src={match.home_logo}
                            alt={match.home_team}
                            className="w-10 h-10 object-contain drop-shadow"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback a balón de fútbol si el enlace falla
                              (e.target as HTMLImageElement).src =
                                'https://api.iconify.design/emojione-v1:soccer-ball.svg';
                            }}
                          />
                        ) : (
                          <span className="text-2xl">⚽</span>
                        )}
                      </div>
                      <span className="font-bold text-sm sm:text-base text-white line-clamp-2 leading-tight">
                        {match.home_team}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-0.5">
                        Local
                      </span>
                    </div>

                    {/* Marcador Central / VS */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                      {isPending ? (
                        <div className="w-10 h-10 rounded-full bg-kiniela-navy-deep border border-kiniela-navy-border flex items-center justify-center">
                          <span className="text-xs font-black text-kiniela-gold font-sans">VS</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 bg-kiniela-navy-deep/90 px-3 py-1.5 rounded-xl border border-kiniela-navy-border shadow-inner">
                            <span
                              className={`text-xl sm:text-2xl font-black font-mono ${
                                isLive ? 'text-kiniela-gold glow-gold-text' : 'text-white'
                              }`}
                            >
                              {match.home_score}
                            </span>
                            <span className="text-slate-500 font-bold">-</span>
                            <span
                              className={`text-xl sm:text-2xl font-black font-mono ${
                                isLive ? 'text-kiniela-gold glow-gold-text' : 'text-white'
                              }`}
                            >
                              {match.away_score}
                            </span>
                          </div>
                          {isLive && match.minute && (
                            <span className="text-[10px] text-red-400 font-bold uppercase mt-1 animate-pulse">
                              {match.minute}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Equipo Visitante */}
                    <div className="col-span-3 flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full p-2 bg-kiniela-navy-deep/80 border border-white/15 flex items-center justify-center shadow-inner relative mb-2">
                        {match.away_logo ? (
                          <img
                            src={match.away_logo}
                            alt={match.away_team}
                            className="w-10 h-10 object-contain drop-shadow"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://api.iconify.design/emojione-v1:soccer-ball.svg';
                            }}
                          />
                        ) : (
                          <span className="text-2xl">⚽</span>
                        )}
                      </div>
                      <span className="font-bold text-sm sm:text-base text-white line-clamp-2 leading-tight">
                        {match.away_team}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-0.5">
                        Visitante
                      </span>
                    </div>
                  </div>

                  {/* Detalle inferior */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-kiniela-gold-light">
                      <Sparkles className="w-3 h-3 text-kiniela-gold" />
                      Válido para pronóstico 1-X-2
                    </span>
                    <span className="text-slate-400 font-mono">ID: {match.id.substring(0, 10)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

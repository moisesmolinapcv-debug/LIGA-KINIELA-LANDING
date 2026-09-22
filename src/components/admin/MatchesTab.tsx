'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Match, MatchStatus } from '@/types/kiniela';
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  Radio,
  CheckCircle2,
  Hourglass,
  Minus,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MatchesTabProps {
  matches: Match[];
  onAddMatch: (newMatch: Omit<Match, 'id'>) => Promise<void>;
  onUpdateMatch: (id: string, matchUpdate: Partial<Match>) => Promise<void>;
  onDeleteMatch: (id: string) => Promise<void>;
}

// Helpers para inputs datetime-local
const toLocalInput = (iso?: string): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
};

const toIsoString = (localValue: string): string => {
  if (!localValue) return new Date().toISOString();
  try {
    const d = new Date(localValue);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

// Equipos Populares con sus logos oficiales o banderas SVG
const TEAM_PRESETS = [
  { name: 'Venezuela (Vinotinto)', logo: 'https://api.iconify.design/twemoji:flag-venezuela.svg' },
  { name: 'Brasil', logo: 'https://api.iconify.design/twemoji:flag-brazil.svg' },
  { name: 'Argentina', logo: 'https://api.iconify.design/twemoji:flag-argentina.svg' },
  { name: 'Colombia', logo: 'https://api.iconify.design/twemoji:flag-colombia.svg' },
  { name: 'Caracas FC', logo: 'https://api.iconify.design/twemoji:flag-venezuela.svg' },
  { name: 'Deportivo Táchira', logo: 'https://api.iconify.design/twemoji:flag-venezuela.svg' },
  { name: 'Real Madrid', logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg' },
  { name: 'FC Barcelona', logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg' },
  { name: 'Manchester City', logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg' },
  { name: 'Liverpool FC', logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg' },
];

const MINUTE_PRESETS = ["15'", "45'", 'HT', "60'", "75'", "90'", 'FT'];

export const MatchesTab: React.FC<MatchesTabProps> = ({
  matches,
  onAddMatch,
  onUpdateMatch,
  onDeleteMatch,
}) => {
  const [showAddForm, setShowAddForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Formulario de nuevo partido
  const now = new Date();
  const defaultMatchDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [newMatch, setNewMatch] = useState({
    home_team: '',
    away_team: '',
    home_logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
    away_logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
    match_date: toLocalInput(defaultMatchDate.toISOString()),
    status: 'EN ESPERA' as MatchStatus,
    home_score: 0,
    away_score: 0,
    minute: '',
  });

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.home_team || !newMatch.away_team) return;

    setIsSubmitting(true);
    try {
      await onAddMatch({
        home_team: newMatch.home_team.trim(),
        away_team: newMatch.away_team.trim(),
        home_logo: newMatch.home_logo.trim() || 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
        away_logo: newMatch.away_logo.trim() || 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
        match_date: toIsoString(newMatch.match_date),
        status: newMatch.status,
        home_score: Number(newMatch.home_score) || 0,
        away_score: Number(newMatch.away_score) || 0,
        minute: newMatch.minute.trim(),
        sort_order: matches.length + 1,
      });

      // Limpiar campos para el siguiente partido
      setNewMatch({
        home_team: '',
        away_team: '',
        home_logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
        away_logo: 'https://api.iconify.design/emojione-v1:soccer-ball.svg',
        match_date: toLocalInput(defaultMatchDate.toISOString()),
        status: 'EN ESPERA',
        home_score: 0,
        away_score: 0,
        minute: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScoreChange = async (match: Match, team: 'home' | 'away', delta: number) => {
    if (team === 'home') {
      const newScore = Math.max(0, match.home_score + delta);
      await onUpdateMatch(match.id, { home_score: newScore });
    } else {
      const newScore = Math.max(0, match.away_score + delta);
      await onUpdateMatch(match.id, { away_score: newScore });
    }
  };

  const handleStatusChange = async (matchId: string, status: MatchStatus) => {
    const update: Partial<Match> = { status };
    if (status === 'FINALIZADO') {
      update.minute = 'FT';
    } else if (status === 'EN ESPERA') {
      update.minute = '';
    } else if (status === 'EN VIVO') {
      update.minute = "1'";
    }
    await onUpdateMatch(matchId, update);
  };

  const confirmDelete = async () => {
    if (!matchToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteMatch(matchToDelete);
      setMatchToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Contadores de estado
  const countLive = matches.filter((m) => m.status === 'EN VIVO').length;
  const countPending = matches.filter((m) => m.status === 'EN ESPERA').length;
  const countFinished = matches.filter((m) => m.status === 'FINALIZADO').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado y Resumen Estadístico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a2785]">
        <div>
          <h2 className="text-2xl font-black font-rockwell text-white flex items-center gap-2.5">
            Cartelera Oficial de Partidos
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Inyecta encuentros deportivos, modifica estados (En Vivo / Finalizado) y actualiza marcadores al instante.
          </p>
        </div>

        {/* Resumen Pills */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-lg bg-[#0c186b]/80 border border-[#1a2785] text-slate-200">
            Total: <span className="text-kiniela-gold font-mono">{matches.length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Fin: <span className="font-mono">{countFinished}</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            En Vivo: <span className="font-mono">{countLive}</span>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Espera: <span className="font-mono">{countPending}</span>
          </span>
        </div>
      </div>

      {/* Bloque Colapsable: Agregar Nuevo Encuentro */}
      <div className="bg-[#060e4f]/80 border border-[#1a2785] rounded-2xl overflow-hidden transition-all shadow-xl">
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#0c186b]/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-kiniela-vinotinto/80 border border-kiniela-gold/30 flex items-center justify-center text-kiniela-gold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-rockwell">
                Agregar Nuevo Encuentro Deportivo
              </h3>
              <p className="text-xs text-slate-400">
                Añadir equipos, logos/banderas, fecha, hora y estado a la kiniela
              </p>
            </div>
          </div>
          <div className="text-slate-400">
            {showAddForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showAddForm && (
          <form onSubmit={handleCreateMatch} className="p-6 pt-2 border-t border-[#1a2785]/80 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Equipo Local */}
              <div className="p-4 rounded-xl bg-[#00063E]/80 border border-[#1a2785] space-y-3">
                <span className="text-xs font-bold text-kiniela-gold uppercase tracking-wider block">
                  🏟️ Equipo Local
                </span>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Equipo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Venezuela (Vinotinto) o Real Madrid"
                    value={newMatch.home_team}
                    onChange={(e) => setNewMatch({ ...newMatch, home_team: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#060e4f] border border-[#1a2785] rounded-lg text-white font-semibold text-sm focus:outline-none focus:border-kiniela-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">URL Logo / Bandera</label>
                  <input
                    type="url"
                    value={newMatch.home_logo}
                    onChange={(e) => setNewMatch({ ...newMatch, home_logo: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#060e4f] border border-[#1a2785] rounded-lg text-slate-300 text-xs font-mono focus:outline-none focus:border-kiniela-gold"
                  />
                </div>
                {/* Presets Rápidos Local */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TEAM_PRESETS.slice(0, 5).map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setNewMatch({ ...newMatch, home_team: p.name, home_logo: p.logo })}
                      className="text-[10px] px-2 py-1 rounded bg-[#0c186b] text-slate-300 hover:text-white hover:bg-[#1a2785] border border-[#1a2785] transition-all"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipo Visitante */}
              <div className="p-4 rounded-xl bg-[#00063E]/80 border border-[#1a2785] space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  ✈️ Equipo Visitante
                </span>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Equipo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Brasil o FC Barcelona"
                    value={newMatch.away_team}
                    onChange={(e) => setNewMatch({ ...newMatch, away_team: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#060e4f] border border-[#1a2785] rounded-lg text-white font-semibold text-sm focus:outline-none focus:border-kiniela-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">URL Logo / Bandera</label>
                  <input
                    type="url"
                    value={newMatch.away_logo}
                    onChange={(e) => setNewMatch({ ...newMatch, away_logo: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#060e4f] border border-[#1a2785] rounded-lg text-slate-300 text-xs font-mono focus:outline-none focus:border-kiniela-gold"
                  />
                </div>
                {/* Presets Rápidos Visitante */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {TEAM_PRESETS.slice(0, 5).map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setNewMatch({ ...newMatch, away_team: p.name, away_logo: p.logo })}
                      className="text-[10px] px-2 py-1 rounded bg-[#0c186b] text-slate-300 hover:text-white hover:bg-[#1a2785] border border-[#1a2785] transition-all"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fecha, Hora y Estado Inicial */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-kiniela-gold" />
                  Fecha y Hora del Encuentro *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newMatch.match_date}
                  onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-sm font-mono focus:outline-none focus:border-kiniela-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Estado Inicial
                </label>
                <select
                  value={newMatch.status}
                  onChange={(e) => setNewMatch({ ...newMatch, status: e.target.value as MatchStatus })}
                  className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-kiniela-gold"
                >
                  <option value="EN ESPERA">⏳ EN ESPERA</option>
                  <option value="EN VIVO">🔴 EN VIVO</option>
                  <option value="FINALIZADO">✅ FINALIZADO</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-kiniela-vinotinto to-[#a62b53] hover:from-[#9f2c52] hover:to-kiniela-vinotinto border border-kiniela-vinotinto-hover shadow-lg shadow-kiniela-vinotinto/40 hover:shadow-brand-vinotinto disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-kiniela-gold" />
                    Inyectar Encuentro a la Cartelera
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Lista de Partidos Existentes con Controles Rápidos en Tiempo Real */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Encuentros Deportivos Programados</span>
            <span className="text-xs bg-[#0c186b] text-kiniela-gold px-2.5 py-0.5 rounded-full font-mono">
              {matches.length}
            </span>
          </h3>
        </div>

        {matches.length === 0 ? (
          <div className="p-8 text-center bg-[#060e4f]/40 border border-[#1a2785] rounded-2xl text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-500 opacity-50" />
            <p className="font-medium text-sm">No hay partidos registrados en la cartelera.</p>
            <p className="text-xs text-slate-500 mt-1">Usa el formulario superior para agregar el primer encuentro.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {matches.map((match, index) => {
              const isLive = match.status === 'EN VIVO';
              const isFinished = match.status === 'FINALIZADO';
              const isPending = match.status === 'EN ESPERA';

              return (
                <div
                  key={match.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isLive
                      ? 'bg-gradient-to-r from-[#060e4f] to-[#882445]/30 border-rose-500/50 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
                      : isFinished
                      ? 'bg-[#060e4f]/60 border-[#1a2785]/80 opacity-90'
                      : 'bg-[#060e4f]/80 border-[#1a2785] hover:border-kiniela-gold/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Orden, Estado y Fecha */}
                    <div className="flex items-center justify-between lg:justify-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#00063E] border border-[#1a2785] text-slate-400 font-mono font-bold text-xs flex items-center justify-center">
                        #{index + 1}
                      </span>

                      {/* Badge de Estado Principal */}
                      <div>
                        {isLive && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            <Radio className="w-3.5 h-3.5" />
                            EN VIVO ({match.minute || "1'"})
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                            <Hourglass className="w-3.5 h-3.5 text-amber-400" />
                            EN ESPERA
                          </span>
                        )}
                        {isFinished && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            FINALIZADO
                          </span>
                        )}
                      </div>

                      {/* Fecha / Hora */}
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1 hidden sm:flex">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(match.match_date).toLocaleString('es-VE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Equipos y Marcador Rápido */}
                    <div className="flex items-center justify-center gap-3 sm:gap-6 my-1">
                      {/* Local */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end text-right min-w-[120px]">
                        <span className="font-bold text-sm sm:text-base text-white truncate max-w-[140px] sm:max-w-[180px]">
                          {match.home_team}
                        </span>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 p-1 shrink-0 flex items-center justify-center border border-slate-700">
                          <Image
                            src={match.home_logo || 'https://api.iconify.design/emojione-v1:soccer-ball.svg'}
                            alt={match.home_team}
                            width={24}
                            height={24}
                            className="w-full h-full object-contain"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Controles de Marcador (+ y -) */}
                      <div className="flex items-center gap-1.5 bg-[#00063E] px-3 py-1.5 rounded-xl border border-[#1a2785] shrink-0">
                        {/* Control Goles Local */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleScoreChange(match, 'home', -1)}
                            className="w-6 h-6 rounded bg-[#0c186b] hover:bg-[#1a2785] text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                            title="Restar gol local"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-rockwell font-black text-lg sm:text-xl text-kiniela-gold w-6 text-center">
                            {match.home_score}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleScoreChange(match, 'home', 1)}
                            className="w-6 h-6 rounded bg-[#0c186b] hover:bg-[#1a2785] text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                            title="Sumar gol local"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-slate-500 font-bold px-1">:</span>

                        {/* Control Goles Visitante */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleScoreChange(match, 'away', -1)}
                            className="w-6 h-6 rounded bg-[#0c186b] hover:bg-[#1a2785] text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                            title="Restar gol visitante"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-rockwell font-black text-lg sm:text-xl text-kiniela-gold w-6 text-center">
                            {match.away_score}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleScoreChange(match, 'away', 1)}
                            className="w-6 h-6 rounded bg-[#0c186b] hover:bg-[#1a2785] text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                            title="Sumar gol visitante"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Visitante */}
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-start text-left min-w-[120px]">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 p-1 shrink-0 flex items-center justify-center border border-slate-700">
                          <Image
                            src={match.away_logo || 'https://api.iconify.design/emojione-v1:soccer-ball.svg'}
                            alt={match.away_team}
                            width={24}
                            height={24}
                            className="w-full h-full object-contain"
                            unoptimized
                          />
                        </div>
                        <span className="font-bold text-sm sm:text-base text-white truncate max-w-[140px] sm:max-w-[180px]">
                          {match.away_team}
                        </span>
                      </div>
                    </div>

                    {/* Botones de 1 Clic para Estados y Minuto */}
                    <div className="flex items-center flex-wrap gap-2 justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1a2785]/60">
                      {/* Botones de Estado */}
                      <div className="flex items-center rounded-lg bg-[#00063E] p-0.5 border border-[#1a2785]">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(match.id, 'EN ESPERA')}
                          className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                          title="Marcar como En Espera"
                        >
                          ⏳ Espera
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(match.id, 'EN VIVO')}
                          className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                            isLive
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/60'
                              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                          }`}
                          title="Marcar como En Vivo"
                        >
                          🔴 En Vivo
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(match.id, 'FINALIZADO')}
                          className={`px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                            isFinished
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                              : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                          title="Marcar como Finalizado"
                        >
                          ✅ Fin
                        </button>
                      </div>

                      {/* Campo Minuto de Juego */}
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={match.minute || ''}
                          onChange={(e) => onUpdateMatch(match.id, { minute: e.target.value })}
                          placeholder="Min (68')"
                          className="w-16 px-2 py-1.5 bg-[#00063E] border border-[#1a2785] rounded-lg text-xs font-mono font-bold text-center text-white focus:outline-none focus:border-kiniela-gold"
                        />
                        {/* Selector rápido de minutos populares */}
                        <div className="hidden sm:flex items-center gap-1">
                          {MINUTE_PRESETS.slice(3, 7).map((mPreset) => (
                            <button
                              key={mPreset}
                              type="button"
                              onClick={() => onUpdateMatch(match.id, { minute: mPreset })}
                              className="text-[10px] px-1.5 py-1 rounded bg-[#0c186b]/60 text-slate-400 hover:text-white hover:bg-[#1a2785]"
                            >
                              {mPreset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Botón Eliminar Encuentro */}
                      <button
                        type="button"
                        onClick={() => setMatchToDelete(match.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-all"
                        title="Eliminar partido de la cartelera"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Confirmación para Eliminar Partido */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#060e4f] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-rockwell">
              ¿Eliminar Encuentro Deportivo?
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              El partido será removido inmediatamente de la cartelera oficial y de la vista del pronosticador.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setMatchToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  'Sí, Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

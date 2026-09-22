'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, RotateCcw, LogOut, Database, Zap, ShieldAlert } from 'lucide-react';

interface AdminHeaderProps {
  source: 'supabase' | 'local';
  onResetData: () => Promise<void>;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ source, onResetData, onLogout }) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await onResetData();
      setShowConfirmReset(false);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#00063E]/90 backdrop-blur-md border-b border-[#1a2785] px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Marca con reborde blanco oficial */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-10 h-10 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              <Image
                src="/brand/Recurso 4.svg"
                alt="Liga Kiniela Logo Oficial con Contorno Blanco"
                width={40}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-rockwell font-black text-xl tracking-wider text-white">
                  LIGA <span className="text-kiniela-gold">KINIELA</span>
                </span>
                <span className="bg-kiniela-vinotinto/80 text-kiniela-gold text-[10px] font-bold px-2 py-0.5 rounded-full border border-kiniela-gold/30 tracking-widest uppercase">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Panel de Control Deportivo & Gestión Integral
              </p>
            </div>
          </div>

          {/* Estado de Base de Datos y Acciones */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
            {/* Indicador de persistencia */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm transition-all ${
                source === 'supabase'
                  ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}
              title={
                source === 'supabase'
                  ? 'Sincronizado con Supabase PostgreSQL en la nube'
                  : 'Operando en Modo Reactivo Local (LocalStorage + Broadcast)'
              }
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    source === 'supabase' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    source === 'supabase' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              {source === 'supabase' ? (
                <>
                  <Database className="w-3.5 h-3.5 hidden sm:inline" />
                  <span>Supabase Conectado</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 hidden sm:inline" />
                  <span>Almacén Local Reactivo</span>
                </>
              )}
            </div>

            {/* Ver Landing en Vivo */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0c186b]/80 hover:bg-[#1a2785] text-slate-200 hover:text-white border border-[#1a2785] transition-all hover:shadow-brand-gold"
            >
              <ExternalLink className="w-3.5 h-3.5 text-kiniela-gold" />
              <span className="hidden sm:inline">Ver Landing en Vivo</span>
              <span className="sm:hidden">Landing</span>
            </Link>

            {/* Restablecer Valores de Demostración */}
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-all hover:shadow-brand-vinotinto"
              title="Restablecer datos a valores de prueba originales"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Restablecer Demo</span>
            </button>

            {/* Cerrar Sesión / Bloquear */}
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
              title="Bloquear panel y cerrar sesión administrativa"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Bloquear / Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de confirmación para restablecer demo */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#060e4f] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white font-rockwell">
              ¿Restablecer Valores de Demostración?
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Esta acción restablecerá los títulos semanales, encuentros deportivos, marcadores y
              campeones a los valores iniciales predeterminados.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                disabled={isResetting}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2"
              >
                {isResetting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Restableciendo...
                  </>
                ) : (
                  'Sí, Restablecer Todo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

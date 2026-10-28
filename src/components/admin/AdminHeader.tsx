'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, LogOut, Database, WifiOff } from 'lucide-react';

interface AdminHeaderProps {
  source: 'supabase' | 'local';
  onLogout: () => void;
}

/** Barra superior del panel. No es fija: la que se queda arriba al desplazarse es la de pestañas. */
export const AdminHeader: React.FC<AdminHeaderProps> = ({ source, onLogout }) => {
  const connected = source === 'supabase';

  return (
    <header className="bg-[#00063E] border-b border-[#1a2785] px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Logo y marca */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            <Image
              src="/brand/Recurso 4.svg"
              alt="Liga Kiniela"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 font-rockwell font-black text-lg sm:text-xl tracking-wider text-white leading-none">
              {/* En celular el logo ya trae el nombre: se oculta el texto para que quepan los botones */}
              <span className="hidden sm:inline">
                LIGA <span className="text-kiniela-gold">KINIELA</span>
              </span>
              <span className="bg-kiniela-vinotinto/80 text-kiniela-gold text-[11px] font-bold px-2 py-0.5 rounded-full border border-kiniela-gold/30 tracking-widest uppercase">
                Admin
              </span>
            </h1>
            <p className="text-xs text-slate-300 font-medium hidden sm:block mt-1">Panel de control</p>
          </div>
        </div>

        {/* Estado y acciones */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            role="status"
            className={`flex items-center gap-2 px-3 min-h-[44px] rounded-full text-xs font-semibold border ${
              connected
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            }`}
            title={
              connected
                ? 'Los cambios se guardan en la base de datos y se ven en la web'
                : 'No hay conexión con la base de datos: los cambios de banners y campeones solo se verían en este navegador'
            }
          >
            {connected ? <Database className="w-4 h-4" aria-hidden="true" /> : <WifiOff className="w-4 h-4" aria-hidden="true" />}
            <span className="hidden sm:inline">{connected ? 'Conectado a la base de datos' : 'Sin conexión a la base de datos'}</span>
            <span className="sm:hidden">{connected ? 'Conectado' : 'Sin conexión'}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver la web (se abre en otra pestaña)"
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 rounded-xl text-xs font-semibold bg-[#0c186b]/80 hover:bg-[#1a2785] text-slate-100 border border-[#1a2785] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
            <span className="hidden md:inline">Ver la web</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Cerrar sesión"
            className="flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-600 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-300" aria-hidden="true" />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

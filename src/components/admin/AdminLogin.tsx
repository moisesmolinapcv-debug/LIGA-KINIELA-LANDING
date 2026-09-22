'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const cleanInput = pin.trim().toLowerCase();
    // Claves maestras por defecto según requerimiento
    const validPins = ['kiniela2026', '123456'];

    setTimeout(() => {
      if (validPins.includes(cleanInput)) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('kiniela_admin_session', 'authenticated');
          sessionStorage.setItem('kiniela_admin_login_time', new Date().toISOString());
        }
        onSuccess();
      } else {
        setError('PIN o contraseña incorrecta. Utilice "kiniela2026" o "123456".');
        setIsSubmitting(false);
      }
    }, 250);
  };

  const handleKeypadPress = (digit: string) => {
    setError(null);
    if (digit === 'DEL') {
      setPin((prev) => prev.slice(0, -1));
    } else if (digit === 'CLEAR') {
      setPin('');
    } else {
      if (pin.length < 20) {
        setPin((prev) => prev + digit);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#000428] relative overflow-hidden">
      {/* Luces de fondo ambientadas con los colores de marca */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#882445]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FFAF3F]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#0c186b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Contenedor tipo Tarjeta de Cristal */}
        <div className="bg-[#060e4f]/85 backdrop-blur-xl border border-[#1a2785]/80 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-[#000428]/90">
          {/* Isologo Oficial con Reborde Blanco */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-20 h-20 mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <Image
                src="/brand/Recurso 4.svg"
                alt="Liga Kiniela Isologo Oficial"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <span className="font-rockwell font-black text-2xl tracking-wide text-white">
              LIGA <span className="text-kiniela-gold">KINIELA</span>
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-kiniela-gold" />
              <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold">
                Control Administrativo
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
              Ingresa el PIN de seguridad asignado para gestionar la cartelera, premios y parámetros de la edición.
            </p>
          </div>

          {/* Formulario de Entrada */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setError(null);
                  setPin(e.target.value);
                }}
                placeholder="PIN o Clave (kiniela2026)"
                autoFocus
                className="w-full pl-11 pr-11 py-3.5 bg-[#00063E]/90 border border-[#1a2785] rounded-xl text-white placeholder-slate-500 text-center text-base tracking-widest font-mono focus:outline-none focus:border-kiniela-gold focus:ring-2 focus:ring-kiniela-gold/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs text-center animate-shake leading-snug">
                {error}
              </div>
            )}

            {/* Teclado Rápido Numérico */}
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'DEL'].map((btn) => (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => handleKeypadPress(btn)}
                    className="py-2.5 rounded-xl bg-[#0c186b]/60 hover:bg-[#1a2785] text-white text-sm font-semibold border border-[#1a2785]/60 hover:border-kiniela-gold/50 transition-all active:scale-95 flex items-center justify-center font-mono"
                  >
                    {btn === 'DEL' ? '⌫' : btn === 'CLEAR' ? 'C' : btn}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón Principal de Acceso */}
            <button
              type="submit"
              disabled={isSubmitting || !pin}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-kiniela-vinotinto to-[#a62b53] hover:from-[#9f2c52] hover:to-kiniela-vinotinto border border-kiniela-vinotinto-hover shadow-lg shadow-kiniela-vinotinto/30 hover:shadow-brand-vinotinto disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-kiniela-gold" />
                  <span>Desbloquear Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Ayuda con clave por defecto */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400">
              Clave predeterminada:&nbsp;
              <button
                type="button"
                onClick={() => {
                  setPin('kiniela2026');
                  setError(null);
                }}
                className="text-kiniela-gold hover:underline font-mono font-semibold"
              >
                kiniela2026
              </button>
              &nbsp;o&nbsp;
              <button
                type="button"
                onClick={() => {
                  setPin('123456');
                  setError(null);
                }}
                className="text-kiniela-gold hover:underline font-mono font-semibold"
              >
                123456
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

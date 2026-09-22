'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Lock, Trophy, Award, CheckCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-kiniela-navy-deep border-t border-kiniela-gold/20 pt-16 pb-12 relative overflow-hidden">
      {/* Luz ambiental sutil en el pie */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-kiniela-vinotinto/15 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Columna Marca & Identidad */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-14 h-14 flex-shrink-0">
                <Image
                  src="/brand/Recurso 4.svg"
                  alt="Liga Kiniela Logo"
                  fill
                  className="brand-logo-dark object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wider text-white uppercase font-sans">
                  LIGA <span className="text-kiniela-gold">KINIELA</span>
                </span>
                <span className="text-xs text-kiniela-gold-light tracking-widest font-medium uppercase">
                  Fútbol & Pasión Deportiva
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              La plataforma oficial de referencia para el seguimiento y consulta de kinielas deportivas 
              en Venezuela. Transparencia certificada, marcadores en vivo y auditoría garantizada en cada fecha.
            </p>

            {/* Badges de Confianza y Juego Responsable */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-kiniela-navy-card border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Resultados Auditados</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-kiniela-navy-card border border-white/10">
                <Award className="w-4 h-4 text-kiniela-gold" />
                <span>Pagos Verificados</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-kiniela-navy-card border border-white/10">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <span>Juego Responsable +18</span>
              </div>
            </div>
          </div>

          {/* Columna Navegación Rápida */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-kiniela-gold mb-4">
              Navegación del Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <a href="#partidos" className="hover:text-kiniela-gold transition-colors">
                  Cartelera en Vivo
                </a>
              </li>
              <li>
                <a href="#premios" className="hover:text-kiniela-gold transition-colors">
                  Pozo y Premios Acumulados
                </a>
              </li>
              <li>
                <a href="#campeones" className="hover:text-kiniela-gold transition-colors">
                  Salón de Campeones
                </a>
              </li>
              <li>
                <a href="#reglas" className="hover:text-kiniela-gold transition-colors">
                  Reglamento Oficial
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-kiniela-gold transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Columna Transparencia & Términos */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-kiniela-gold mb-4">
              Juego Responsable y Aviso Legal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Liga Kiniela opera como una plataforma informativa de pronósticos deportivos. Todos los cálculos 
              de premios en moneda nacional se realizan tomando como referencia la tasa de cambio publicada 
              por el Banco Central de Venezuela (BCV).
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              La participación está estrictamente restringida a personas mayores de 18 años de edad. Juegue con 
              moderación. El entretenimiento deportivo debe disfrutarse con sensatez.
            </p>
          </div>

        </div>

        {/* Fila Inferior de Copyright & Enlace Admin Discreto */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Liga Kiniela. Todos los derechos reservados. Marca Registrada.
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500">Hecho para la afición venezolana</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

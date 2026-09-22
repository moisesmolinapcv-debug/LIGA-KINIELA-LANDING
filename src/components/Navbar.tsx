'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Trophy, Calendar, HelpCircle, BookOpen, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Partidos en Vivo', href: '#partidos', icon: Calendar },
    { name: 'Pozo & Premios', href: '#premios', icon: Trophy },
    { name: 'Salón de Campeones', href: '#campeones', icon: ShieldCheck },
    { name: 'Cómo Participar', href: '#reglas', icon: BookOpen },
    { name: 'Preguntas Frecuentes', href: '#faq', icon: HelpCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-kiniela-navy/95 backdrop-blur-md py-2 sm:py-2.5 border-b border-kiniela-gold/20 shadow-lg shadow-kiniela-navy-deep/70'
          : 'bg-gradient-to-b from-kiniela-navy-deep/90 via-kiniela-navy/60 to-transparent py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Oficial con reborde blanco protector (Brand Guidelines Pág. 6) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none">
            <div className="relative w-10 h-10 sm:w-13 sm:h-13 flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              <Image
                src="/brand/Recurso 4.svg"
                alt="Liga Kiniela Logo Oficial"
                fill
                className="brand-logo-dark object-contain group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-xl tracking-wider text-white uppercase leading-none font-sans">
                LIGA <span className="text-kiniela-gold">KINIELA</span>
              </span>
              <span className="text-[9px] sm:text-xs text-kiniela-gold-light tracking-widest font-medium uppercase mt-0.5">
                Plataforma Oficial
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-kiniela-gold hover:bg-white/5 transition-all duration-200 flex items-center gap-1.5"
                >
                  <IconComponent className="w-4 h-4 text-kiniela-gold opacity-80" />
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Trust Badges */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-kiniela-navy-card/90 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Oficial & Seguro</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Alternar Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-kiniela-navy-deep/98 border-b border-kiniela-gold/20 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-200 hover:text-kiniela-gold hover:bg-white/5"
              >
                <Icon className="w-5 h-5 text-kiniela-gold" />
                {link.name}
              </a>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Juego Responsable +18
            </span>
            <span className="text-slate-400 text-[11px]">
              Liga Kiniela Oficial
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

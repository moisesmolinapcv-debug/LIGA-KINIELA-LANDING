'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Calendar, HelpCircle, BookOpen, Menu, X, Award, Handshake } from 'lucide-react';
import { JUEGO_RESPONSABLE_FRANJA } from '../content/copys';

const NAV_LINKS = [
  { name: 'Partidos', href: '/#partidos', icon: Calendar },
  { name: 'Premio', href: '/#premios', icon: Trophy },
  { name: 'Cómo se juega', href: '/#reglas', icon: BookOpen },
  { name: 'Campeones', href: '/#campeones', icon: Award },
  { name: 'Aliados', href: '/#aliados', icon: Handshake },
  { name: 'Preguntas', href: '/#faq', icon: HelpCircle },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled || open
          ? 'border-b border-kiniela-gold/25 bg-kiniela-navy-deep/95 backdrop-blur-md'
          : 'bg-gradient-to-b from-kiniela-navy-deep/85 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo oficial con reborde blanco sobre fondo oscuro (manual de marca, pág. 6) */}
        <Link href="/" aria-label="Liga Kiniela, inicio" className="flex min-h-tap items-center">
          <span className="relative block h-12 w-11 flex-shrink-0">
            <Image
              src="/brand/Recurso 4.svg"
              alt="Liga Kiniela"
              fill
              sizes="44px"
              className="brand-logo-dark object-contain"
              priority
            />
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="inline-flex min-h-tap items-center rounded-lg px-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-kiniela-gold"
            >
              {l.name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full border border-white/25 px-2.5 py-1 text-xs font-bold text-white"
            title={JUEGO_RESPONSABLE_FRANJA.lema}
          >
            {JUEGO_RESPONSABLE_FRANJA.etiquetaEdad}
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 hover:text-white lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-movil"
          aria-label="Menú móvil"
          className="animate-fadeIn border-b border-kiniela-gold/25 bg-kiniela-navy-deep px-4 pb-5 pt-2 lg:hidden"
        >
          {NAV_LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-tap items-center gap-3 rounded-lg px-3 text-base font-medium text-slate-100 hover:bg-white/5 hover:text-kiniela-gold"
              >
                <Icon aria-hidden="true" className="h-5 w-5 text-kiniela-gold" />
                {l.name}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, HelpCircle } from 'lucide-react';

import { SiteCopys } from '../types/kiniela';
import { ENLACE_REGLAMENTO, FAQ_TEXTOS, REGLAS_SECCION } from '../content/landing';
import { Pizarra, PasosAcordeon } from './taquilla/Pizarra';
import { Calculadora } from './taquilla/Calculadora';
import { PreguntasFrecuentes } from './taquilla/PreguntasFrecuentes';

interface RulesAndFaqSectionProps {
  // Se conserva por compatibilidad con la página; los textos de esta sección vienen de src/content/landing.ts
  // (los textos antiguos guardados en la base de datos hablan de "pozo" y de pasos que ya no existen).
  copys?: SiteCopys;
}

export const RulesAndFaqSection: React.FC<RulesAndFaqSectionProps> = () => {
  return (
    <section id="reglas" className="relative scroll-mt-20 bg-kiniela-navy py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* PARTE 1: PIZARRA DEL DT, REGLAS ESENCIALES */}
        <div className="mb-16">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-kiniela-vinotinto bg-kiniela-vinotinto/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-kiniela-gold-light">
              <BookOpen aria-hidden="true" className="h-4 w-4 text-kiniela-gold" />
              <span>{REGLAS_SECCION.badge}</span>
            </div>
            <h2 className="font-rockwell text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              {REGLAS_SECCION.titulo}
            </h2>
            <p className="mt-3 text-base text-slate-300 sm:text-lg">{REGLAS_SECCION.subtitulo}</p>
          </div>

          <Pizarra />
          <PasosAcordeon />
          <Calculadora />

          <p className="mt-5 text-center">
            <Link
              href={ENLACE_REGLAMENTO.href}
              className="inline-flex min-h-tap items-center gap-2 rounded-lg px-3 text-sm font-semibold text-kiniela-gold underline-offset-4 hover:underline"
            >
              {ENLACE_REGLAMENTO.texto}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </p>
        </div>

        {/* PARTE 2: PREGUNTAS FRECUENTES */}
        <div id="faq" className="mx-auto max-w-3xl scroll-mt-24">
          <div className="mb-8 text-center">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-kiniela-navy-border bg-kiniela-navy-card px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
              <HelpCircle aria-hidden="true" className="h-4 w-4 text-kiniela-gold" />
              <span>{FAQ_TEXTOS.badge}</span>
            </div>
            <h3 className="font-rockwell text-2xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
              {FAQ_TEXTOS.titulo}
            </h3>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">{FAQ_TEXTOS.subtitulo}</p>
          </div>

          <PreguntasFrecuentes />
        </div>
      </div>
    </section>
  );
};

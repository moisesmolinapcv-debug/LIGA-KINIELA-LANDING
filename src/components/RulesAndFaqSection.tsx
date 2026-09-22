'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Target,
  Trophy,
} from 'lucide-react';

import { SiteCopys } from '../types/kiniela';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: '¿Cómo se determina al ganador de la Kiniela?',
    answer:
      'Gana el participante (o participantes) que acumule el mayor número de aciertos sobre los resultados finales (tiempo reglamentario 90 minutos más descuento) de la cartelera oficial. En caso de acierto total (10 de 10), se adjudica el Pozo Mayor Acumulado.',
  },
  {
    question: '¿Cómo y en qué moneda se liquidan los premios acumulados?',
    answer:
      'Todos los premios se liquidan de forma transparente e inmediata en Bolívares (Bs) a través de los métodos de pago oficiales de cada casa de apuestas aliada o transferencias bancarias nacionales (Pago Móvil / Bancos Nacionales) al titular verificado.',
  },
  {
    question: '¿Qué sucede si dos o más personas empatan con el máximo puntaje?',
    answer:
      'Si se produce un empate en el primer lugar con igual número de aciertos, el pozo total correspondiente a esa categoría se reparte de forma equitativa y transparente entre todos los acertantes.',
  },
  {
    question: '¿Qué ocurre si un partido de la cartelera es suspendido o pospuesto?',
    answer:
      'Si un encuentro es suspendido y no se reanuda dentro de las 24 horas siguientes a su programación oficial, se aplica el reglamento estándar: dicho partido se declara nulo y se homologa como acierto automático para todas las kinielas válidamente registradas.',
  },
  {
    question: '¿Hasta qué momento se puede registrar una jugada?',
    answer:
      'Las jugadas se cierran de forma estricta y automática según el contador regresivo mostrado en el portal, exactamente antes del pitazo inicial del primer partido de la jornada. No se admiten jugadas extemporáneas.',
  },
  {
    question: '¿Cuál es la edad requerida para participar?',
    answer:
      'Liga Kiniela promueve estrictamente el juego responsable. La participación está reservada con exclusividad para mayores de 18 años (+18).',
  },
];

interface RulesAndFaqSectionProps {
  copys?: SiteCopys;
}

export const RulesAndFaqSection: React.FC<RulesAndFaqSectionProps> = ({ copys }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      step: '01',
      title: 'Analiza la Cartelera',
      description:
        'Revisa los 10 encuentros seleccionados de las mejores ligas del mundo, copas internacionales y el fútbol venezolano.',
      icon: Target,
    },
    {
      step: '02',
      title: 'Pronostica 1 - X - 2',
      description:
        'Selecciona el resultado de cada partido: 1 para victoria local, X para empate o 2 para victoria visitante.',
      icon: Zap,
    },
    {
      step: '03',
      title: 'Confirma antes del Cierre',
      description:
        'Verifica que tus pronósticos queden validados antes de que el contador regresivo llegue a cero.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'Sigue la Emoción y Cobra',
      description:
        'Monitorea los marcadores en tiempo real en nuestra cartelera en vivo y celebra si eres el nuevo campeón del pozo.',
      icon: Trophy,
    },
  ];

  return (
    <section id="reglas" className="py-16 sm:py-24 bg-kiniela-navy relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PARTE 1: REGLAS BÁSICAS / CÓMO FUNCIONA */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kiniela-vinotinto/30 border border-kiniela-vinotinto text-kiniela-gold-light text-xs font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4 text-kiniela-gold" />
              <span>{copys?.rules_badge || 'Reglamento Deportivo'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              {copys?.rules_title || '¿Cómo Funciona la Kiniela?'}
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-300">
              {copys?.rules_subtitle || 'Un sistema sencillo, justo y transparente diseñado para que demuestres tu pasión por el fútbol.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative rounded-2xl p-6 bg-kiniela-navy-card/80 border border-kiniela-navy-border/60 hover:border-kiniela-gold/40 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-kiniela-vinotinto/40 border border-kiniela-gold/30 flex items-center justify-center text-kiniela-gold group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-kiniela-gold" />
                      </div>
                      <span className="text-3xl font-black text-white/15 font-mono">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-kiniela-gold transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fácil y Seguro</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PARTE 2: PREGUNTAS FRECUENTES (FAQ) */}
        <div id="faq" className="max-w-4xl mx-auto scroll-mt-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kiniela-navy-card border border-kiniela-navy-border text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-kiniela-gold" />
              <span>Dudas y Consultas Frecuentes</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Preguntas Frecuentes
            </h3>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Respuestas claras a las dudas más comunes de nuestra comunidad deportiva.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden border border-kiniela-navy-border/70 bg-kiniela-navy-card/60 transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-white/5 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-base sm:text-lg text-white">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-kiniela-navy-deep flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-kiniela-gold text-kiniela-navy' : 'text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

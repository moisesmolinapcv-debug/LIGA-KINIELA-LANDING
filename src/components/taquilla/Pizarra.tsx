'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PASOS_JUGAR } from '../../content/guia';
import { NOTA_MENU, PASOS_ACORDEON, PIZARRA_PASOS } from '../../content/landing';
import { Colapsable } from './Colapsable';

/* ------------------------------------------------------------------ */
/* Trazos de tiza                                                       */
/* ------------------------------------------------------------------ */

type Tono = 'blanco' | 'oro' | 'tenue';

/** Trazo que se dibuja con stroke-dashoffset (pathLength normalizado a 1). */
function Trazo({ d, delay = 0, tono = 'blanco', ancho }: { d: string; delay?: number; tono?: Tono; ancho?: number }) {
  return (
    <path
      d={d}
      pathLength={1}
      className={`m3c-chalk ${tono === 'oro' ? 'm3c-chalk-oro' : tono === 'tenue' ? 'm3c-chalk-tenue' : ''}`}
      style={{ ['--d' as string]: `${delay}ms`, ...(ancho ? { strokeWidth: ancho } : null) }}
    />
  );
}

function circulo(cx: number, cy: number, r: number) {
  return `M${cx + r},${cy} a${r},${r} 0 1,0 ${-2 * r},0 a${r},${r} 0 1,0 ${2 * r},0`;
}

/** 1. Marca los 10: dos filas de cinco círculos con su palomita. */
function DiagramaMarca() {
  const items = Array.from({ length: 10 }, (_, i) => {
    const cx = 32 + (i % 5) * 44;
    const cy = i < 5 ? 40 : 90;
    return { cx, cy, i };
  });
  return (
    <>
      {items.map(({ cx, cy, i }) => (
        <g key={i}>
          <Trazo d={circulo(cx, cy, 15)} delay={i * 70} />
          <Trazo d={`M${cx - 6},${cy + 1} l5,5 l9,-11`} delay={i * 70 + 260} tono="oro" ancho={2.6} />
        </g>
      ))}
    </>
  );
}

/** 2. Mínimo 7 aciertos: escalera de 10 barras; de la 7 en adelante, en oro. */
function DiagramaMinimo() {
  const barras = Array.from({ length: 10 }, (_, i) => {
    const x = 22 + i * 20.5;
    const alto = 12 + i * 9;
    return { x, y: 118 - alto, i };
  });
  const siete = barras[6];
  return (
    <>
      {barras.map(({ x, y, i }) => (
        <Trazo key={i} d={`M${x},118 V${y}`} delay={i * 80} tono={i >= 6 ? 'oro' : 'tenue'} ancho={8} />
      ))}
      <Trazo d="M10,118 H230" delay={0} tono="tenue" />
      <line
        x1="10"
        x2={siete.x}
        y1={siete.y - 4}
        y2={siete.y - 4}
        className="m3c-fade"
        style={{ ['--d' as string]: '800ms' }}
        stroke="rgba(255,213,138,0.75)"
        strokeWidth="1.8"
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      <g className="m3c-fade" style={{ ['--d' as string]: '1000ms' }}>
        <text x={siete.x} y={siete.y - 18} textAnchor="middle" className="m3c-chalk-text">
          7
        </text>
      </g>
    </>
  );
}

/** 3. Gana el máximo: escalones hasta el trofeo y una flecha hacia el saldo (Bs). */
function DiagramaMaximo() {
  return (
    <>
      <Trazo d="M12,118 H66 V94 H112 V70 H158 V46 H228" delay={0} tono="tenue" />
      {/* Copa */}
      <Trazo d="M178,14 H208 V26 Q208,40 193,40 Q178,40 178,26 Z" delay={500} tono="oro" ancho={2.6} />
      <Trazo d="M178,18 Q166,18 168,28 Q170,34 179,33 M208,18 Q220,18 218,28 Q216,34 207,33" delay={800} tono="oro" />
      <Trazo d="M193,40 V46" delay={1000} tono="oro" />
      {/* Flecha de la copa al saldo */}
      <Trazo d="M168,12 C146,0 104,2 86,26" delay={1100} />
      <Trazo d="M86,26 l9,-2 M86,26 l1,-10" delay={1500} />
      {/* Saldo */}
      <Trazo d={circulo(62, 44, 17)} delay={1300} tono="oro" />
      <g className="m3c-fade" style={{ ['--d' as string]: '1700ms' }}>
        <text x="62" y="49" textAnchor="middle" className="m3c-chalk-text">
          Bs
        </text>
      </g>
    </>
  );
}

const DIAGRAMAS = [DiagramaMarca, DiagramaMinimo, DiagramaMaximo];

/* ------------------------------------------------------------------ */
/* Pizarra del DT                                                       */
/* ------------------------------------------------------------------ */

export function Pizarra() {
  const ref = useRef<HTMLOListElement>(null);
  const [armada, setArmada] = useState(false);
  const [dibujada, setDibujada] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Con movimiento reducido (o sin IntersectionObserver) los trazos se quedan ya dibujados.
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || typeof IntersectionObserver === 'undefined') return;
    setArmada(true);
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setDibujada(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol
      ref={ref}
      className={`m3c-pizarra grid gap-4 md:grid-cols-3 ${armada ? 'm3c-armed' : ''} ${dibujada ? 'm3c-drawn' : ''}`}
    >
      {PIZARRA_PASOS.map((paso, idx) => {
        const Diagrama = DIAGRAMAS[idx];
        return (
          <li key={paso.numero} className="m3c-board flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <span aria-hidden="true" className="m3c-num">
                {paso.numero}
              </span>
              <svg
                viewBox="0 0 240 130"
                aria-hidden="true"
                focusable="false"
                className="h-auto w-full max-w-[250px] flex-1"
              >
                <Diagrama />
              </svg>
            </div>
            <h3 className="mt-3 font-rockwell text-xl font-extrabold uppercase tracking-tight text-white">
              <span className="sr-only">Paso {paso.numero}: </span>
              {paso.titulo}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-200">{paso.texto}</p>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Los 7 pasos para jugar (acordeón, cerrado por defecto)               */
/* ------------------------------------------------------------------ */

export function PasosAcordeon() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="m3c-panel mt-4">
      <h3>
        <button
          type="button"
          id="pasos-btn"
          aria-expanded={abierto}
          aria-controls="pasos-panel"
          onClick={() => setAbierto((v) => !v)}
          className="flex min-h-[56px] w-full items-center justify-between gap-4 rounded-2xl px-5 py-3 text-left"
        >
          <span>
            <span className="block text-base font-bold text-white sm:text-lg">{PASOS_ACORDEON.titulo}</span>
            <span className="block text-xs text-slate-300 sm:text-sm">{PASOS_ACORDEON.ayuda}</span>
          </span>
          <span aria-hidden="true" className={`m3c-chev ${abierto ? 'is-open' : ''}`}>
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
      </h3>
      <Colapsable abierto={abierto} id="pasos-panel" labelledBy="pasos-btn">
        <ol className="grid gap-3 border-t border-white/10 px-5 pb-5 pt-4 sm:grid-cols-2">
          {PASOS_JUGAR.map((p) => (
            <li key={p.numero} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-kiniela-gold/50 font-rockwell text-sm font-bold text-kiniela-gold"
              >
                {p.numero}
              </span>
              <span>
                <span className="block text-sm font-bold text-white">{p.titulo}</span>
                <span className="block text-sm leading-relaxed text-slate-300">{p.texto}</span>
              </span>
            </li>
          ))}
          <li className="text-xs leading-relaxed text-slate-300 sm:col-span-2">{NOTA_MENU}</li>
        </ol>
      </Colapsable>
    </div>
  );
}

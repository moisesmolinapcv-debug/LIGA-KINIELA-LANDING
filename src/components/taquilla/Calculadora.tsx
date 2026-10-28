'use client';

import React, { useEffect, useId, useState } from 'react';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { PREMIO_EJEMPLO_BS } from '../../content/guia';
import { CALCULADORA_ATAJOS, CALCULADORA_TEXTOS as T } from '../../content/landing';
import { useKinielasContext } from './KinielasProvider';
import { Colapsable } from './Colapsable';

/** Formato venezolano con dos decimales fijos: 2.500.000,00 (no depende del agrupado de Intl). */
export function formatoBs(n: number): string {
  const [entero, dec] = n.toFixed(2).split('.');
  return `Bs. ${entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`;
}

/** Art. 7 y 8.6: cada parte = premio total / tickets ganadores, con dos decimales. Se calcula en céntimos. */
export function calcularReparto(premio: number, aciertos: number, tickets: number, mios: number) {
  if (aciertos < 7 || tickets < 1) return { sinGanador: true as const };
  const centimosPorTicket = Math.round((Math.round(premio * 100)) / tickets);
  return {
    sinGanador: false as const,
    porTicket: centimosPorTicket / 100,
    tuyo: (centimosPorTicket * mios) / 100,
  };
}

/** Campo numérico con botones de sumar y restar (objetivos táctiles de 44 px). */
function Campo({
  etiqueta,
  ayuda,
  valor,
  min,
  max,
  onChange,
}: {
  etiqueta: string;
  ayuda: string;
  valor: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  const [texto, setTexto] = useState(String(valor));
  useEffect(() => setTexto(String(valor)), [valor]);

  const fijar = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(n))));

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-white">
        {etiqueta}
      </label>
      <p id={`${id}-ayuda`} className="mb-1.5 text-xs text-slate-400">
        {ayuda}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fijar(valor - 1)}
          disabled={valor <= min}
          aria-label={T.decrementar(etiqueta)}
          className="m3c-step"
        >
          <Minus aria-hidden="true" className="h-5 w-5" />
        </button>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={texto}
          aria-describedby={`${id}-ayuda`}
          onChange={(e) => {
            const limpio = e.target.value.replace(/\D/g, '').slice(0, 4);
            setTexto(limpio);
            if (limpio !== '') fijar(Number(limpio));
          }}
          onBlur={() => setTexto(String(valor))}
          className="m3c-input h-11 w-20 rounded-xl text-center font-rockwell text-lg font-bold"
        />
        <button
          type="button"
          onClick={() => fijar(valor + 1)}
          disabled={valor >= max}
          aria-label={T.incrementar(etiqueta)}
          className="m3c-step"
        >
          <Plus aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function Calculadora() {
  const { selected } = useKinielasContext();
  const [abierta, setAbierta] = useState(false);
  const [aciertos, setAciertos] = useState(9);
  const [tickets, setTickets] = useState(1);
  const [mios, setMios] = useState(1);

  // Premio de la Kiniela seleccionada; sin dato, el premio de ejemplo de la guía.
  const premioReal = selected && selected.prizeBs > 0 ? selected.prizeBs : null;
  const premio = premioReal ?? PREMIO_EJEMPLO_BS;
  const r = calcularReparto(premio, aciertos, tickets, mios);

  const cambiarTickets = (n: number) => {
    setTickets(n);
    if (mios > n) setMios(n);
  };

  const aplicar = (a: (typeof CALCULADORA_ATAJOS)[number]) => {
    setAciertos(a.aciertos);
    setTickets(a.tickets);
    setMios(a.mios);
  };

  return (
    <div className="m3c-panel mt-4" id="calculadora">
      <h3>
        <button
          type="button"
          id="calc-btn"
          aria-expanded={abierta}
          aria-controls="calc-panel"
          onClick={() => setAbierta((v) => !v)}
          className="flex min-h-[64px] w-full items-center justify-between gap-4 rounded-2xl px-5 py-3 text-left"
        >
          <span>
            <span className="block font-rockwell text-lg font-extrabold uppercase tracking-tight text-white sm:text-xl">
              {T.titulo}
            </span>
            <span className="block text-xs text-slate-300 sm:text-sm">{T.ayuda}</span>
          </span>
          <span className="flex items-center gap-3">
            <span className="sr-only">{abierta ? T.cerrar : T.abrir}</span>
            <span aria-hidden="true" className={`m3c-chev ${abierta ? 'is-open' : ''}`}>
              <ChevronDown className="h-4 w-4" />
            </span>
          </span>
        </button>
      </h3>

      <Colapsable abierto={abierta} id="calc-panel" labelledBy="calc-btn">
        <div className="border-t border-white/10 px-5 pb-5 pt-4">
          <p className="inline-flex rounded-full border border-kiniela-gold/50 bg-kiniela-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-kiniela-gold-light">
            {T.etiquetaEjemplo}
          </p>

          {/* Premio total */}
          <div className="mt-4 rounded-xl border border-white/10 bg-kiniela-navy-deep/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {premioReal && selected ? T.premioDe(selected.name) : T.premioEjemplo}
              {!premioReal && (
                <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[11px] normal-case tracking-normal text-white">
                  {T.tagEjemplo}
                </span>
              )}
            </p>
            <p className="mt-0.5 font-rockwell text-2xl font-extrabold text-kiniela-gold">{formatoBs(premio)}</p>
          </div>

          {/* Atajos: escenarios A, B, C y E de la guía */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-300">{T.atajos}</p>
            <div className="flex flex-wrap gap-2">
              {CALCULADORA_ATAJOS.map((a) => {
                const activo = a.aciertos === aciertos && a.tickets === tickets && a.mios === mios;
                return (
                  <button
                    key={a.clave}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => aplicar(a)}
                    className={`m3c-chip ${activo ? 'is-on' : ''}`}
                  >
                    {a.etiqueta}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Datos */}
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Campo etiqueta={T.aciertos} ayuda={T.aciertosAyuda} valor={aciertos} min={0} max={10} onChange={setAciertos} />
            <Campo
              etiqueta={T.tickets}
              ayuda={T.ticketsAyuda}
              valor={tickets}
              min={1}
              max={9999}
              onChange={cambiarTickets}
            />
            <Campo etiqueta={T.mios} ayuda={T.miosAyuda} valor={mios} min={1} max={tickets} onChange={setMios} />
          </div>

          {/* Resultado */}
          <div role="status" aria-live="polite" className="mt-5">
            {r.sinGanador ? (
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-4">
                <p className="font-rockwell text-lg font-bold text-white">{T.sinGanadorTitulo}</p>
                <p className="mt-1 text-sm text-slate-200">{T.sinGanadorTexto}</p>
              </div>
            ) : (
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-300">{T.cadaTicket}</dt>
                  <dd className="mt-0.5 font-rockwell text-xl font-extrabold text-white">{formatoBs(r.porTicket)}</dd>
                </div>
                <div className="rounded-xl border border-kiniela-gold/50 bg-kiniela-gold/10 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-kiniela-gold-light">{T.tuRecibes}</dt>
                  <dd className="mt-0.5 font-rockwell text-xl font-extrabold text-kiniela-gold">{formatoBs(r.tuyo)}</dd>
                </div>
              </dl>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-400">{T.nota}</p>
        </div>
      </Colapsable>
    </div>
  );
}

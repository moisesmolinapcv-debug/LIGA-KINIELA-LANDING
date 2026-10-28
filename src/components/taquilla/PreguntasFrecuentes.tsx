'use client';

import React, { useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import {
  FAQ_CATEGORIAS,
  FAQ_ITEMS,
  FAQ_MAS_CONSULTADAS,
  FAQ_TEXTOS,
  type FaqCategoriaId,
  type FaqItem,
} from '../../content/landing';
import { Colapsable } from './Colapsable';

/** Texto sin tildes ni mayúsculas, para que la búsqueda no dependa de cómo se escriba. */
function normalizar(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const MAS_CONSULTADAS = FAQ_MAS_CONSULTADAS.map((p) => FAQ_ITEMS.find((f) => f.pregunta === p)).filter(
  (f): f is FaqItem => Boolean(f),
);

/** Una pregunta del acordeón. Solo una abierta a la vez (el estado vive en el padre). */
function Pregunta({
  item,
  abierta,
  onToggle,
  etiqueta,
}: {
  item: FaqItem;
  abierta: boolean;
  onToggle: () => void;
  etiqueta?: string;
}) {
  return (
    <li className="m3c-panel">
      <h4>
        <button
          type="button"
          id={`${item.id}-btn`}
          aria-expanded={abierta}
          aria-controls={`${item.id}-panel`}
          onClick={onToggle}
          className="flex min-h-[56px] w-full items-center justify-between gap-4 rounded-2xl px-5 py-3 text-left"
        >
          <span>
            {etiqueta && (
              <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wider text-kiniela-gold">
                {etiqueta}
              </span>
            )}
            <span className="block text-base font-semibold leading-snug text-white">{item.pregunta}</span>
          </span>
          <span aria-hidden="true" className={`m3c-chev ${abierta ? 'is-open' : ''}`}>
            <ChevronDown className="h-4 w-4" />
          </span>
        </button>
      </h4>
      <Colapsable abierto={abierta} id={`${item.id}-panel`} labelledBy={`${item.id}-btn`}>
        <p className="border-t border-white/10 px-5 pb-5 pt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
          {item.respuesta}
        </p>
      </Colapsable>
    </li>
  );
}

export function PreguntasFrecuentes() {
  const [abiertaId, setAbiertaId] = useState<string | null>(null);
  const [todas, setTodas] = useState(false);
  const [cat, setCat] = useState<FaqCategoriaId>('jugar');
  const [consulta, setConsulta] = useState('');
  const raiz = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const toggle = (id: string) => setAbiertaId((a) => (a === id ? null : id));

  const termino = normalizar(consulta.trim());
  const buscando = termino.length > 0;

  const porCategoria = useMemo(() => {
    const m: Record<string, FaqItem[]> = {};
    for (const it of FAQ_ITEMS) (m[it.categoria] ||= []).push(it);
    return m;
  }, []);

  const resultados = useMemo(
    () =>
      buscando
        ? FAQ_ITEMS.filter((f) => normalizar(`${f.pregunta} ${f.respuesta}`).includes(termino))
        : [],
    [buscando, termino],
  );

  const visibles = buscando ? resultados : porCategoria[cat] ?? [];

  const alternar = () => {
    const siguiente = !todas;
    setTodas(siguiente);
    setAbiertaId(null);
    // Al volver a la vista corta, se regresa al inicio de las preguntas si quedó arriba de la pantalla.
    if (!siguiente) {
      const top = raiz.current?.getBoundingClientRect().top ?? 0;
      if (top < 0) raiz.current?.scrollIntoView({ block: 'start' });
    }
  };

  const elegirCategoria = (id: FaqCategoriaId) => {
    setCat(id);
    setConsulta('');
    setAbiertaId(null);
  };

  // Navegación por teclado en las pestañas (flechas, Inicio y Fin).
  const onTabKey = (e: React.KeyboardEvent, idx: number) => {
    const n = FAQ_CATEGORIAS.length;
    let destino = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') destino = (idx + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') destino = (idx - 1 + n) % n;
    else if (e.key === 'Home') destino = 0;
    else if (e.key === 'End') destino = n - 1;
    if (destino < 0) return;
    e.preventDefault();
    const id = FAQ_CATEGORIAS[destino].id;
    elegirCategoria(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div ref={raiz}>
      {!todas ? (
        <>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-kiniela-gold">
            {FAQ_TEXTOS.masConsultadas}
          </p>
          <ul className="space-y-2.5">
            {MAS_CONSULTADAS.map((it) => (
              <Pregunta key={it.id} item={it} abierta={abiertaId === it.id} onToggle={() => toggle(it.id)} />
            ))}
          </ul>
        </>
      ) : (
        <div>
          {/* Buscador */}
          <div className="relative">
            <label htmlFor="faq-buscar" className="sr-only">
              {FAQ_TEXTOS.buscarEtiqueta}
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              id="faq-buscar"
              type="search"
              value={consulta}
              onChange={(e) => {
                setConsulta(e.target.value);
                setAbiertaId(null);
              }}
              placeholder={FAQ_TEXTOS.buscarPlaceholder}
              autoComplete="off"
              className="m3c-input h-12 w-full rounded-2xl pl-12 pr-12 text-base"
            />
            {consulta && (
              <button
                type="button"
                onClick={() => setConsulta('')}
                aria-label={FAQ_TEXTOS.limpiar}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-slate-300 hover:text-white"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Categorías */}
          <div role="tablist" aria-label={FAQ_TEXTOS.categorias} className="mt-3 flex flex-wrap gap-2">
            {FAQ_CATEGORIAS.map((c, idx) => {
              const activa = !buscando && cat === c.id;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabRefs.current[c.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`faq-tab-${c.id}`}
                  aria-selected={activa}
                  aria-controls="faq-vista"
                  tabIndex={cat === c.id ? 0 : -1}
                  onClick={() => elegirCategoria(c.id)}
                  onKeyDown={(e) => onTabKey(e, idx)}
                  className={`m3c-chip ${activa ? 'is-on' : ''}`}
                >
                  {c.nombre}
                  <span className="ml-1.5 text-xs opacity-80">{porCategoria[c.id]?.length ?? 0}</span>
                </button>
              );
            })}
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {buscando ? FAQ_TEXTOS.resultados(resultados.length) : ''}
          </p>

          <div
            id="faq-vista"
            role="tabpanel"
            aria-labelledby={buscando ? 'faq-buscar' : `faq-tab-${cat}`}
            className="mt-4"
          >
            {buscando && (
              <p className="mb-3 text-sm text-slate-300" aria-hidden="true">
                {FAQ_TEXTOS.resultados(resultados.length)}
              </p>
            )}
            {visibles.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center text-sm text-slate-300">
                {FAQ_TEXTOS.sinResultados}
              </p>
            ) : (
              <ul className="space-y-2.5">
                {visibles.map((it) => (
                  <Pregunta
                    key={it.id}
                    item={it}
                    abierta={abiertaId === it.id}
                    onToggle={() => toggle(it.id)}
                    etiqueta={
                      buscando ? FAQ_CATEGORIAS.find((c) => c.id === it.categoria)?.nombre : undefined
                    }
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          aria-expanded={todas}
          aria-controls={todas ? 'faq-vista' : undefined}
          onClick={alternar}
          className="m3c-btn-ghost"
        >
          {todas ? FAQ_TEXTOS.verMenos : FAQ_TEXTOS.verTodas(FAQ_ITEMS.length)}
          <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${todas ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}

'use client';

// Cartelera "La Taquilla": el boleto troquelado de la Kiniela seleccionada, con sus líneas
// (Local / E / Visitante), contador, talón y tarjeta para compartir.
// Es un EJERCICIO: nada se envía ni se registra. Datos solo del contexto de Kinielas.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, RefreshCw, RotateCcw, Scissors, Share2 } from 'lucide-react';
import type { Kiniela } from '../types/kinielas';
import { BOLETO, ESTADOS_KINIELA } from '../content/copys';
import { useKinielasContext } from './taquilla/KinielasProvider';
import { KiniMascot } from './taquilla/KiniMascot';
import { MatchLine } from './taquilla/MatchLine';
import { ShareDialog } from './taquilla/ShareDialog';
import { buzz, scorePractice, usePractice } from './taquilla/practice';
import type { Pick } from './taquilla/practice';

const MIN_BASE = 7;

/** Mínimo para ganar según partidos suspendidos (Art. 9): 1 baja a 6, 2 baja a 5, 3 o más cancela. */
function minimoPara(suspendidos: number): number {
  return Math.max(MIN_BASE - suspendidos, 1);
}

/** true mientras el elemento esté (en parte) dentro de la pantalla. */
function useInView<T extends Element>(): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/* -------------------------------------------------------------------------- */

export const MatchesSection: React.FC = () => {
  const { data, kinielas, selected, setSelected, statusOf, loading, refresh } = useKinielasContext();

  let body: React.ReactNode;
  if (!data && loading) body = <BoletoLoading />;
  else if (!data) body = <BoletoError onRetry={refresh} />;
  else if (!selected) body = <p className="rounded-xl border border-white/15 bg-kiniela-navy-card p-6 text-center text-slate-300">{BOLETO.vacio}</p>;
  else {
    body = (
      <>
        {kinielas.length > 1 && <KinielaSwitch list={kinielas} selectedId={selected.id} onSelect={setSelected} statusOf={statusOf} />}
        <Boleto key={selected.id} kiniela={selected} status={statusOf(selected)} panel={kinielas.length > 1} />
      </>
    );
  }

  return (
    <section id="partidos" className="relative scroll-mt-20 bg-kiniela-navy py-14 sm:py-20">
      {/* #boleto: destino del CTA del hero; incluye el encabezado para no aterrizar a media sección */}
      <div id="boleto" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-2xl sm:mb-8">
          <h2 className="font-rockwell text-3xl font-extrabold uppercase leading-tight text-white sm:text-4xl">{BOLETO.titulo}</h2>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">{BOLETO.subtitulo}</p>
        </div>
        {body}
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */

function KinielaSwitch({
  list,
  selectedId,
  onSelect,
  statusOf,
}: {
  list: Kiniela[];
  selectedId: number;
  onSelect: (id: number) => void;
  statusOf: (k: Kiniela) => 'proxima' | 'abierta' | 'cerrada';
}) {
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = list[(i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
    onSelect(next.id);
    document.getElementById(`bt-${next.id}`)?.focus();
  };
  return (
    <div role="tablist" aria-label={BOLETO.selector} className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {list.map((k, i) => {
        const active = k.id === selectedId;
        return (
          <button
            key={k.id}
            id={`bt-${k.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="boleto-panel"
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(k.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-tap shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
              active ? 'border-kiniela-gold bg-kiniela-gold text-kiniela-navy' : 'border-white/25 bg-kiniela-navy-card text-white hover:border-kiniela-gold/60'
            }`}
          >
            {k.name}
            <span className="ml-2 text-[11px] font-bold uppercase tracking-wide opacity-80">{ESTADOS_KINIELA[statusOf(k)].etiqueta}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** 10 marcas de progreso; la 7.ª lleva la referencia del mínimo. Decorativo (el texto lo dice). */
function Pips({ count, total, minimo, compact = false }: { count: number; total: number; minimo: number; compact?: boolean }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="relative">
          <span
            className={`block rounded-sm border transition-colors duration-tap ${compact ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${
              i < count ? 'border-kiniela-gold bg-kiniela-gold' : 'border-white/35 bg-transparent'
            }`}
          />
          {i === minimo - 1 && (
            <span className="absolute left-1/2 top-full mt-0.5 h-1 w-px -translate-x-1/2 bg-kiniela-gold-light" />
          )}
        </span>
      ))}
    </div>
  );
}

function Boleto({ kiniela: k, status, panel }: { kiniela: Kiniela; status: 'proxima' | 'abierta' | 'cerrada'; panel: boolean }) {
  const { picks, toggle, reset } = usePractice(k);
  const matches = k.matches;
  const total = matches.length;
  const count = matches.filter((m) => picks[m.key]).length;
  const complete = total > 0 && count === total;
  const score = useMemo(() => scorePractice(matches, picks), [matches, picks]);

  // Partidos suspendidos (capa manual): bajan el mínimo para ganar o cancelan la Kiniela (Art. 9)
  const suspendidos = matches.filter((m) => m.manual?.status === 'SUSPENDIDO').length;
  const minimo = minimoPara(suspendidos);
  const cancelada = suspendidos >= 3;

  const anyKickoff = matches.some((m) => m.manual?.kickoff);

  const [stamp, setStamp] = useState<{ key: string; opt: Pick } | null>(null);
  const interacted = useRef(false);
  const [live, setLive] = useState('');

  const onPick = useCallback(
    (matchKey: string, option: Pick) => {
      interacted.current = true;
      const marked = toggle(matchKey, option);
      setStamp(marked ? { key: matchKey, opt: option } : null);
      if (marked) buzz();
    },
    [toggle],
  );

  const onReset = () => {
    interacted.current = true;
    setStamp(null);
    reset();
    setLive(BOLETO.reiniciado);
  };

  // Anuncio para lector de pantalla: pausado para no repetir en cada toque.
  useEffect(() => {
    if (!interacted.current) return;
    const id = window.setTimeout(() => setLive(BOLETO.anuncio(count, total)), 700);
    return () => window.clearTimeout(id);
  }, [count, total]);

  const [linesRef, linesInView] = useInView<HTMLOListElement>();
  const [stubRef, stubInView] = useInView<HTMLElement>();
  const showBar = linesInView && !stubInView;

  // Con la venta abierta el Hero ya lo dice todo: aquí solo se avisa si no abrió o ya cerró.
  const estadoMsg = status === 'proxima' ? BOLETO.estado.proxima : status === 'cerrada' ? BOLETO.estado.cerrada : '';

  const matchWarning = k.warnings.some((w) => /partido|Fila suelta/i.test(w));
  const expected = k.totalMatches > 0 ? k.totalMatches : 10;

  return (
    <div id="boleto-panel" role={panel ? 'tabpanel' : undefined} aria-labelledby={panel ? `bt-${k.id}` : undefined}>
      <article className="tq-ticket flex flex-col lg:flex-row">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 rounded-t-[19px] bg-gold-foil" />

        {/* Cuerpo del boleto */}
        <div className="min-w-0 flex-1 px-3 pb-4 pt-6 sm:px-6 sm:pb-6">
          <header>
            <h3 className="break-words font-rockwell text-2xl font-extrabold uppercase leading-tight text-white sm:text-3xl">{k.name}</h3>
            {estadoMsg && <p className="mt-1 text-sm text-slate-300">{estadoMsg}</p>}

            {/* Rótulo obligatorio: la única aparición en pantalla (la otra va dentro de la imagen para compartir) */}
            <p
              role="note"
              className="mt-3 rounded-lg border-2 border-dashed border-kiniela-gold bg-kiniela-vinotinto/60 px-3 py-2 text-xs font-bold leading-snug text-white sm:text-[13px]"
            >
              {BOLETO.rotulo}
            </p>
            {matchWarning && (
              <p role="status" className="mt-2 rounded-lg border border-kiniela-gold/40 bg-kiniela-navy-deep px-3 py-2 text-xs text-kiniela-gold-light">
                {BOLETO.avisoPartidos(total, expected)}
              </p>
            )}
            {total > 0 && (
              <p className="mt-2 text-xs text-slate-400">{anyKickoff ? BOLETO.horariosZona : BOLETO.horariosPorConfirmar}</p>
            )}
          </header>

          {total === 0 ? (
            <p className="mt-6 rounded-xl border border-white/15 bg-kiniela-navy-deep/60 p-5 text-center text-sm text-slate-200">{BOLETO.sinPartidos}</p>
          ) : (
            <ol ref={linesRef} aria-label={BOLETO.cartelera} className="mt-4 grid gap-3 xl:grid-cols-2">
              {matches.map((m, i) => (
                <MatchLine
                  key={m.key}
                  match={m}
                  number={i + 1}
                  pick={picks[m.key]}
                  stamped={stamp?.key === m.key ? stamp.opt : null}
                  onPick={onPick}
                  showPending={anyKickoff}
                />
              ))}
            </ol>
          )}
        </div>

        {/* Línea de corte + talón */}
        <div aria-hidden="true" className="tq-perf">
          <Scissors className="tq-scissors h-5 w-5 text-kiniela-gold" />
        </div>

        <aside ref={stubRef} aria-label={BOLETO.talon} className="px-4 pb-6 pt-5 sm:px-6 lg:w-[19rem] lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            <div className="flex items-end justify-between gap-3 lg:block">
              <div>
                <p className="font-rockwell font-extrabold leading-none text-white">
                  <span className="text-5xl text-kiniela-gold">{count}</span>
                  <span className="text-3xl text-slate-300">/{total}</span>
                  <span className="ml-2 text-sm font-bold uppercase tracking-wide text-slate-300">{BOLETO.marcados}</span>
                </p>
                <div className="mt-3 pb-3">
                  <Pips count={count} total={total} minimo={minimo} />
                </div>
                <p className="text-xs text-slate-300">{BOLETO.minimo(suspendidos, minimo)}</p>
              </div>
              <KiniMascot status={complete ? 'abierta' : 'proxima'} className="w-16 shrink-0 lg:mx-auto lg:mt-5 lg:w-36" />
            </div>

            {score.decided > 0 && score.picked > 0 && !cancelada && (
              <div className="mt-4 rounded-lg border border-white/20 bg-kiniela-navy-deep/70 p-3">
                <p className="font-rockwell text-lg font-extrabold text-white">{BOLETO.aciertosPractica(score.hits, score.decided)}</p>
              </div>
            )}

            {complete && (
              <div className="mt-4 rounded-lg border border-kiniela-gold/60 bg-kiniela-navy-deep/70 p-3">
                <p className="font-rockwell text-lg font-extrabold text-kiniela-gold">{BOLETO.celebracionTitulo}</p>
                <p className="mt-1 text-sm text-slate-200">{BOLETO.celebracionTexto}</p>
                <a
                  href="#aliados"
                  className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gold-foil px-5 text-base font-bold text-kiniela-navy shadow-brand-glow transition-transform duration-tap ease-stamp active:scale-[0.97]"
                >
                  {BOLETO.elegirPlataforma}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>
            )}

            <div className="mt-3 flex flex-col gap-2">
              {complete && <ShareButton kiniela={k} picks={picks} />}
              <button
                type="button"
                onClick={onReset}
                disabled={count === 0}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm font-semibold text-white transition-colors hover:border-kiniela-gold/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                {BOLETO.reiniciar}
              </button>
            </div>
          </div>
        </aside>
      </article>

      {/* Contador pegajoso (móvil): fijo sobre la barra inferior mientras las líneas están a la vista */}
      <div
        className={`fixed inset-x-0 z-40 px-3 transition-[opacity,transform] duration-reveal ease-out lg:hidden ${
          showBar ? 'translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-3 opacity-0'
        }`}
        style={{ bottom: 'calc(var(--safe-bottom) + 70px)' }}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border border-kiniela-gold/60 bg-kiniela-navy-deep px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          <div className="min-w-0">
            <p className="font-rockwell text-lg font-extrabold leading-none text-white">
              <span className="text-kiniela-gold">{count}</span>/{total}
              <span className="ml-1.5 text-xs font-bold uppercase tracking-wide text-slate-300">{BOLETO.marcados}</span>
            </p>
            <div className="mt-1.5 pb-1.5">
              <Pips count={count} total={total} minimo={minimo} compact />
            </div>
          </div>
          {complete && (
            <a
              href="#aliados"
              className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-lg bg-gold-foil px-3 text-sm font-bold text-kiniela-navy"
            >
              {BOLETO.elegirPlataforma}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Región viva única: anuncia el avance sin spamear */}
      <p className="sr-only" role="status" aria-live="polite">
        {live}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Genera la imagen (bajo demanda) y abre la vista previa; compartir/descargar ocurre dentro del diálogo. */
function ShareButton({ kiniela: k, picks }: { kiniela: Kiniela; picks: Record<string, Pick> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const cache = useRef<{ sig: string; blob: Blob } | null>(null);
  const sig = useMemo(() => `${k.id}|${k.matches.map((m) => `${m.key}:${picks[m.key] ?? '-'}`).join(',')}`, [k, picks]);

  const onOpen = async () => {
    setBusy(true);
    setError(false);
    try {
      let b = cache.current?.sig === sig ? cache.current.blob : null;
      if (!b) {
        const { renderShareCard } = await import('./taquilla/share-card'); // carga bajo demanda
        b = await renderShareCard({
          kinielaName: k.name,
          poolId: k.id,
          lines: k.matches.map((m, i) => ({
            number: i + 1,
            home: { id: m.homeTeam.id, name: m.homeTeam.name, shortName: m.homeTeam.shortName },
            away: { id: m.awayTeam.id, name: m.awayTeam.name, shortName: m.awayTeam.shortName },
            pick: picks[m.key] ?? 'E',
          })),
        });
        cache.current = { sig, blob: b };
      }
      setBlob(b);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        disabled={busy}
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-kiniela-gold px-4 text-sm font-bold text-kiniela-gold-light transition-colors hover:bg-kiniela-gold/10 disabled:opacity-60"
      >
        {busy ? <RefreshCw aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Share2 aria-hidden="true" className="h-4 w-4" />}
        {busy ? BOLETO.generando : BOLETO.compartir}
      </button>
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {BOLETO.compartirError}
        </p>
      )}
      {blob && <ShareDialog blob={blob} onClose={() => setBlob(null)} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */

function BoletoLoading() {
  return (
    <div aria-busy="true" aria-label={BOLETO.cargando} className="tq-ticket p-4 sm:p-6">
      <div className="tq-sk h-6 w-28 rounded-full" />
      <div className="tq-sk mt-3 h-8 w-2/3" />
      <div className="tq-sk mt-4 h-12 w-full" />
      <div className="mt-5 grid gap-3 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="tq-sk h-40 w-full" />
        ))}
      </div>
    </div>
  );
}

function BoletoError({ onRetry }: { onRetry: () => void }) {
  // El Hero ya explica el problema; aquí solo un aviso corto con reintento.
  return (
    <div role="status" className="tq-ticket flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
      <p className="text-sm text-slate-200">{BOLETO.errorBoleto}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gold-foil px-5 font-bold text-kiniela-navy transition-transform duration-tap ease-stamp active:scale-[0.97]"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4" />
        {BOLETO.reintentar}
      </button>
    </div>
  );
}

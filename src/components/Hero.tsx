'use client';

import React from 'react';
import { ArrowDown, RefreshCw } from 'lucide-react';
import type { BannerSlide } from '../types/kiniela';
import type { Kiniela, KinielaStatus } from '../types/kinielas';
import {
  getRemaining,
  formatDateVE,
  formatTimeVE,
} from '../lib/kinielas/time';
import { ESTADOS_KINIELA, FICHA, HORARIOS, HORA_VENEZUELA, MARCA } from '../content/copys';
import { HeroBillboardSlider } from './HeroBillboardSlider';
import { StadiumBackdrop } from './taquilla/StadiumBackdrop';
import { KiniMascot } from './taquilla/KiniMascot';
import { StatusPill } from './taquilla/StatusPill';
import { FlapNumber } from './taquilla/FlapNumber';
import { FlapClock } from './taquilla/FlapClock';
import { SplitFlap } from './taquilla/SplitFlap';
import { formatMiles, useNow } from './taquilla/hooks';
import { useKinielasContext } from './taquilla/KinielasProvider';

interface HeroProps {
  /** Banners del admin. Se muestran debajo del hero principal solo si hay activos. */
  slides?: BannerSlide[];
}

const PAD_FOR_KINI = 'max-lg:pr-24';

/** Lleva al boleto de práctica; mientras #boleto no exista, al siguiente bloque (#partidos). */
function goToTicket(e: React.MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('boleto') ?? document.getElementById('partidos');
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** "actualizado hace 3 min" */
function timeAgo(iso: string | undefined, now: Date | null): string {
  const t = iso ? new Date(iso).getTime() : NaN;
  if (!now || Number.isNaN(t)) return '';
  const s = Math.max(0, Math.floor((now.getTime() - t) / 1000));
  if (s < 60) return 'unos segundos';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

const hasWarning = (k: Kiniela, re: RegExp) => k.warnings.some((w) => re.test(w));

export const Hero: React.FC<HeroProps> = ({ slides = [] }) => {
  // Estado compartido con el boleto: una sola llamada a useKinielas() en el proveedor.
  const { data, kinielas, selected, setSelected, statusOf, loading, error, stale, refresh } = useKinielasContext();
  const now = useNow(1000);

  let body: React.ReactNode;
  if (!data && loading) {
    body = <HeroLoading />;
  } else if (!data) {
    body = <HeroError message={error} onRetry={refresh} />;
  } else if (!selected) {
    body = <HeroEmpty />;
  } else {
    body = (
      <HeroBody
        kiniela={selected}
        status={statusOf(selected)}
        now={now}
        list={kinielas}
        onSelect={setSelected}
        statusOf={statusOf}
        staleText={stale ? timeAgo(data.fetchedAt, now) : ''}
      />
    );
  }

  return (
    <section id="inicio" className="relative isolate scroll-mt-20">
      <StadiumBackdrop />
      <div className="relative z-10 pb-8 pt-24 sm:pt-28 lg:pb-14 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{body}</div>

        {/* Banners del admin: solo se renderiza si hay activos (el slider devuelve null si no). */}
        <div className="mt-8">
          <HeroBillboardSlider slides={slides} />
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */

interface BodyProps {
  kiniela: Kiniela;
  status: KinielaStatus;
  now: Date | null;
  list: Kiniela[];
  onSelect: (id: number) => void;
  statusOf: (k: Kiniela) => KinielaStatus;
  staleText: string;
}

function HeroBody({ kiniela: k, status, now, list, onSelect, statusOf, staleText }: BodyProps) {
  const prizeUnknown = (hasWarning(k, /prize_base_amount/) && !k.overrides?.prizeBs) || !(k.prizeBs > 0);
  const ticketUnknown = hasWarning(k, /ticket_price/) && !k.overrides?.ticketPriceBs;
  const datesUnknown = hasWarning(k, /sales_start|sales_finish/);

  const target = status === 'proxima' ? k.salesStart : k.closesAt;
  const remaining = now ? getRemaining(target, now) : null;
  const multiple = list.length > 1;

  const fmt = (iso: string) => `${formatDateVE(iso)}, ${formatTimeVE(iso)}`;
  const scheduleLine =
    status === 'proxima' ? `Abre el ${fmt(k.salesStart)}` : status === 'abierta' ? `Cierra el ${fmt(k.closesAt)}` : `Cerró el ${fmt(k.closesAt)}`;

  const ticketLine = k.isFree
    ? 'Edición gratuita · 1 ticket por usuario'
    : ticketUnknown
      ? 'Ticket: por confirmar'
      : `Ticket ${formatMiles(k.ticketPriceBs)} Bs`;

  const closed = status === 'cerrada';

  return (
    <div className="relative lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-12">
      <div
        className="min-w-0"
        role={multiple ? 'tabpanel' : undefined}
        id={multiple ? 'kiniela-panel' : undefined}
        aria-labelledby={multiple ? `kt-${k.id}` : undefined}
      >
        {multiple && <KinielaTabs list={list} selectedId={k.id} onSelect={onSelect} statusOf={statusOf} />}

        <div className={PAD_FOR_KINI}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kiniela-gold-light sm:text-xs">
            {MARCA.eslogan}
          </p>
          <div className="mt-2">
            <StatusPill status={status} />
          </div>
          <h1 className="mt-3 break-words font-rockwell text-[clamp(1.6rem,7.2vw,3.5rem)] font-extrabold uppercase leading-[1.05] text-white">
            {k.name}
          </h1>
        </div>

        {/* Premio total */}
        <div id="premios" className="tq-case mt-5 scroll-mt-28 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-kiniela-gold-light">{FICHA.premio}</p>
            {staleText && (
              <p className="text-[11px] text-slate-400">Datos de hace {staleText}: no pudimos actualizarlos.</p>
            )}
          </div>
          {prizeUnknown ? (
            <p className="mt-2 font-rockwell text-3xl font-extrabold text-kiniela-gold sm:text-5xl">Por confirmar</p>
          ) : (
            <div className="mt-2 flex items-end gap-2 text-[clamp(2rem,10.5vw,4.5rem)]">
              <FlapNumber key={k.id} value={k.prizeBs} unit="Bs" />
              <span aria-hidden="true" className="pb-[0.1em] font-rockwell text-[0.42em] font-extrabold leading-none text-kiniela-gold">
                Bs
              </span>
            </div>
          )}
          <p className="mt-3 text-sm font-semibold text-white sm:text-base">{ticketLine}</p>
        </div>

        {/* Reloj */}
        <div className="tq-case mt-3 px-3 py-4 sm:px-6 sm:py-5">
          {!datesUnknown && !closed && (
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-kiniela-gold-light">
              {ESTADOS_KINIELA[status].cuentaRegresiva}
            </p>
          )}
          {datesUnknown ? (
            <p className="text-center font-rockwell text-2xl font-extrabold text-white">{HORARIOS.porConfirmar}</p>
          ) : closed ? (
            <div className="flex justify-center text-[clamp(1.4rem,6.2vw,2.4rem)]">
              <SplitFlap value="VENTA CERRADA" label={ESTADOS_KINIELA.cerrada.etiqueta} />
            </div>
          ) : (
            <FlapClock remaining={remaining} className="text-[clamp(1.6rem,8.4vw,3rem)]" />
          )}
          {!datesUnknown && (
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-white">{scheduleLine}</p>
              <p className="mt-0.5 text-xs text-slate-300">{HORA_VENEZUELA}</p>
            </div>
          )}
        </div>

        {/* Acciones: una sola primaria */}
        <div className="mt-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          {closed ? (
            <>
              <PrimaryCta href="#reglas" label="Ver cómo se juega" />
              <a
                href="#boleto"
                onClick={goToTicket}
                className="inline-flex min-h-tap items-center justify-center px-3 text-sm font-semibold text-kiniela-gold-light underline decoration-kiniela-gold/40 underline-offset-4 hover:text-white"
              >
                Probar mi boleto
              </a>
            </>
          ) : (
            <>
              <PrimaryCta href="#boleto" label="Probar mi boleto" onClick={goToTicket} />
              <a
                href="#reglas"
                className="inline-flex min-h-tap items-center justify-center px-3 text-sm font-semibold text-kiniela-gold-light underline decoration-kiniela-gold/40 underline-offset-4 hover:text-white"
              >
                Ver cómo se juega
              </a>
            </>
          )}
        </div>
      </div>

      {/* Kini: junto al título en móvil, protagonista en escritorio */}
      <div className={`absolute right-0 w-[84px] lg:static lg:flex lg:w-auto lg:justify-center ${multiple ? 'top-[3.75rem]' : 'top-0'}`}>
        <div className="relative lg:w-[min(18rem,100%)] xl:w-[min(22rem,100%)]">
          <span
            aria-hidden="true"
            className="absolute -inset-10 hidden lg:block"
            style={{ background: 'radial-gradient(closest-side, rgba(255,213,138,0.16), transparent)' }}
          />
          <KiniMascot status={status} priority className="w-full" />
        </div>
      </div>
    </div>
  );
}

function PrimaryCta({ href, label, onClick }: { href: string; label: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a
      id="hero-cta"
      href={href}
      onClick={onClick}
      className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gold-foil px-7 text-base font-bold text-kiniela-navy shadow-brand-glow transition-transform duration-tap ease-stamp active:scale-[0.97]"
    >
      {label}
      <ArrowDown aria-hidden="true" className="h-4 w-4" />
    </a>
  );
}

/* -------------------------------------------------------------------------- */

interface TabsProps {
  list: Kiniela[];
  selectedId: number;
  onSelect: (id: number) => void;
  statusOf: (k: Kiniela) => KinielaStatus;
}

function KinielaTabs({ list, selectedId, onSelect, statusOf }: TabsProps) {
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = list[(i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
    onSelect(next.id);
    document.getElementById(`kt-${next.id}`)?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label="Kinielas activas"
      className="mb-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {list.map((k, i) => {
        const active = k.id === selectedId;
        return (
          <button
            key={k.id}
            id={`kt-${k.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls="kiniela-panel"
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(k.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`min-h-tap shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
              active
                ? 'border-kiniela-gold bg-kiniela-gold text-kiniela-navy'
                : 'border-white/25 bg-kiniela-navy-card text-white hover:border-kiniela-gold/60'
            }`}
          >
            {k.name}
            <span className="ml-2 text-[11px] font-bold uppercase tracking-wide opacity-80">
              {ESTADOS_KINIELA[statusOf(k)].etiqueta}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function HeroLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando la Kiniela" className="relative lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12">
      <div className="min-w-0 space-y-3">
        <div className="tq-sk h-3 w-52" />
        <div className="tq-sk h-7 w-28 rounded-full" />
        <div className="tq-sk h-10 w-3/4" />
        <div className="tq-case mt-5 space-y-3 px-4 py-5">
          <div className="tq-sk h-3 w-24" />
          <div className="tq-sk h-14 w-full max-w-sm" />
          <div className="tq-sk h-4 w-32" />
        </div>
        <div className="tq-case px-4 py-5">
          <div className="tq-sk mx-auto h-12 w-full max-w-md" />
        </div>
        <div className="tq-sk h-[52px] w-56 rounded-xl" />
      </div>
      <div className="hidden lg:flex lg:justify-center">
        <KiniMascot status="proxima" className="w-72 opacity-60" />
      </div>
    </div>
  );
}

function HeroError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center text-center">
      <KiniMascot status="cerrada" className="w-28" />
      <h1 className="mt-4 font-rockwell text-2xl font-extrabold text-white sm:text-3xl">No pudimos cargar la Kiniela</h1>
      <p className="mt-2 text-sm text-slate-300">Revisa tu conexión e inténtalo de nuevo.</p>
      {message && <p className="mt-1 text-xs text-slate-500">{message}</p>}
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex min-h-[52px] items-center gap-2 rounded-xl bg-gold-foil px-7 font-bold text-kiniela-navy transition-transform duration-tap ease-stamp active:scale-[0.97]"
      >
        <RefreshCw aria-hidden="true" className="h-4 w-4" />
        Reintentar
      </button>
    </div>
  );
}

function HeroEmpty() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <KiniMascot status="proxima" className="w-28" />
      <h1 className="mt-4 font-rockwell text-2xl font-extrabold text-white sm:text-3xl">No hay una Kiniela activa ahora</h1>
      <p className="mt-2 text-sm text-slate-300">Vuelve pronto: la taquilla abre de noche.</p>
    </div>
  );
}

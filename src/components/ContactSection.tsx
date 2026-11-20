'use client';

// Sección "Contacto": ventanilla de atención con formulario.
// Envía a /api/contacto (servidor), que verifica Turnstile y manda el correo por SMTP2GO a contacto@ligakiniela.com.ve.

import React, { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2, Instagram, Loader2, Mail, MessageSquareText, Send, ShieldCheck } from 'lucide-react';
import { CONTACTO, FORMULARIO_CONTACTO as T } from '../content/contacto';
import { LIMITES, MOTIVOS, validarContacto } from '../lib/contacto/schema';
import type { ContactoErrores, ContactoPayload, ContactoRespuesta } from '../lib/contacto/schema';
import { Turnstile, type TurnstileHandle } from './contacto/Turnstile';

type Valores = Record<keyof ContactoPayload, string>;
type ErrorGeneral = keyof typeof T.errores;

const VACIO: Valores = { nombre: '', correo: '', motivo: '', mensaje: '' };
const ORDEN: (keyof ContactoPayload)[] = ['nombre', 'correo', 'motivo', 'mensaje'];

const inputCls =
  'm3c-input block w-full rounded-xl px-4 text-base transition-colors focus:border-kiniela-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-kiniela-gold/60 aria-[invalid=true]:border-red-400';

export function ContactSection() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const seccion = useRef<HTMLElement>(null);
  const formulario = useRef<HTMLFormElement>(null);
  const exitoRef = useRef<HTMLDivElement>(null);
  const captcha = useRef<TurnstileHandle>(null);
  const montadoEn = useRef<number>(0);

  const [valores, setValores] = useState<Valores>(VACIO);
  const [errores, setErrores] = useState<ContactoErrores>({});
  const [intentado, setIntentado] = useState(false);
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'exito'>('listo');
  const [errorGeneral, setErrorGeneral] = useState<ErrorGeneral | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [captchaFallo, setCaptchaFallo] = useState(false);
  const [activo, setActivo] = useState(false);

  // El captcha se carga cuando la sección está a ~600 px de la pantalla (o al tocar un campo).
  useEffect(() => {
    montadoEn.current = Date.now();
    const el = seccion.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setActivo(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActivo(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (estado === 'exito') exitoRef.current?.focus();
  }, [estado]);

  const cambiar = (k: keyof Valores) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const nuevos = { ...valores, [k]: e.target.value };
    setValores(nuevos);
    setErrorGeneral(null);
    // Tras el primer intento, los errores se actualizan mientras el usuario corrige.
    if (intentado) setErrores(validarContacto(nuevos).errores);
  };

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === 'enviando') return;
    setIntentado(true);
    setErrorGeneral(null);

    const { errores: errs } = validarContacto(valores);
    setErrores(errs);
    const primero = ORDEN.find((k) => errs[k]);
    if (primero) {
      setErrorGeneral('validacion');
      document.getElementById(id(primero))?.focus();
      return;
    }
    if (!token) return; // el botón ya muestra "Verificando seguridad…"

    const trampa = (formulario.current?.elements.namedItem('sitio_web') as HTMLInputElement | null)?.value ?? '';

    setEstado('enviando');
    let respuesta: ContactoRespuesta | null = null;
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...valores,
          turnstile: token,
          sitio_web: trampa,
          transcurrido_ms: Date.now() - montadoEn.current,
        }),
      });
      respuesta = (await res.json().catch(() => null)) as ContactoRespuesta | null;
    } catch {
      respuesta = null;
    }

    // El token de Turnstile sirve una sola vez: se pide uno nuevo pase lo que pase.
    captcha.current?.reset();

    if (respuesta?.ok) {
      setValores(VACIO);
      setErrores({});
      setIntentado(false);
      setEstado('exito');
      return;
    }
    setEstado('listo');
    if (!respuesta) setErrorGeneral('red');
    else if (respuesta.error === 'validacion') {
      setErrores(respuesta.errores);
      setErrorGeneral('validacion');
    } else setErrorGeneral(respuesta.error);
  };

  const otroMensaje = () => {
    montadoEn.current = Date.now();
    setEstado('listo');
    setTimeout(() => document.getElementById(id('nombre'))?.focus(), 0);
  };

  const enviando = estado === 'enviando';
  const esperandoCaptcha = !token && !captchaFallo;
  const mostrarAlternativa = errorGeneral && errorGeneral !== 'validacion';

  const errorDe = (k: keyof ContactoPayload) =>
    errores[k] ? (
      <p id={id(`${k}-error`)} className="mt-1.5 text-sm text-red-300">
        {errores[k]}
      </p>
    ) : null;

  const describe = (k: keyof ContactoPayload, extra?: string) =>
    [errores[k] ? id(`${k}-error`) : null, extra].filter(Boolean).join(' ') || undefined;

  return (
    <section
      ref={seccion}
      id="contacto"
      aria-labelledby={id('titulo')}
      className="relative scroll-mt-20 bg-kiniela-navy py-16 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-kiniela-vinotinto bg-kiniela-vinotinto/30 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-kiniela-gold-light">
            <MessageSquareText aria-hidden="true" className="h-4 w-4 text-kiniela-gold" />
            <span>{T.badge}</span>
          </div>
          <h2 id={id('titulo')} className="font-rockwell text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            {T.titulo}
          </h2>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">{T.subtitulo}</p>
        </div>

        {/* Boleto de atención: talón con canales + cuerpo con el formulario */}
        <div className="tq-ticket flex flex-col lg:flex-row">
          <aside className="px-5 py-6 sm:px-7 lg:w-[34%] lg:py-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-kiniela-gold">{T.canalesTitulo}</h3>
            <ul className="mt-2">
              <li>
                <a
                  href={CONTACTO.correoUrl}
                  className="inline-flex min-h-tap items-center gap-2 break-all text-sm text-slate-200 hover:text-kiniela-gold"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-kiniela-gold" />
                  {CONTACTO.correo}
                </a>
              </li>
              <li>
                <a
                  href={CONTACTO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-tap items-center gap-2 text-sm text-slate-200 hover:text-kiniela-gold"
                >
                  <Instagram aria-hidden="true" className="h-4 w-4 shrink-0 text-kiniela-gold" />
                  {CONTACTO.instagram}
                </a>
              </li>
            </ul>
            <p className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3.5 py-3 text-xs leading-relaxed text-slate-300">
              {CONTACTO.nota}
            </p>
          </aside>

          <div className="tq-perf" aria-hidden="true" />

          <div className="flex-1 px-5 py-6 sm:px-7 lg:py-8">
            {estado === 'exito' ? (
              <div
                ref={exitoRef}
                tabIndex={-1}
                role="status"
                className="flex min-h-[320px] flex-col items-center justify-center text-center outline-none"
              >
                <CheckCircle2 aria-hidden="true" className="h-14 w-14 text-kiniela-gold" />
                <p className="mt-4 font-rockwell text-2xl font-extrabold text-white">{T.exitoTitulo}</p>
                <p className="mt-2 max-w-sm text-sm text-slate-300">{T.exitoTexto}</p>
                <button type="button" onClick={otroMensaje} className="m3c-btn-ghost mt-6">
                  {T.otroMensaje}
                </button>
              </div>
            ) : (
              <form ref={formulario} onSubmit={enviar} noValidate onFocus={() => setActivo(true)}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={id('nombre')} className="mb-1.5 block text-sm font-semibold text-white">
                      {T.campos.nombre}
                    </label>
                    <input
                      id={id('nombre')}
                      name="nombre"
                      type="text"
                      autoComplete="name"
                      maxLength={LIMITES.nombreMax}
                      value={valores.nombre}
                      onChange={cambiar('nombre')}
                      aria-invalid={!!errores.nombre}
                      aria-describedby={describe('nombre')}
                      className={`${inputCls} min-h-tap`}
                    />
                    {errorDe('nombre')}
                  </div>
                  <div>
                    <label htmlFor={id('correo')} className="mb-1.5 block text-sm font-semibold text-white">
                      {T.campos.correo}
                    </label>
                    <input
                      id={id('correo')}
                      name="correo"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      maxLength={LIMITES.correoMax}
                      value={valores.correo}
                      onChange={cambiar('correo')}
                      aria-invalid={!!errores.correo}
                      aria-describedby={describe('correo')}
                      className={`${inputCls} min-h-tap`}
                    />
                    {errorDe('correo')}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor={id('motivo')} className="mb-1.5 block text-sm font-semibold text-white">
                    {T.campos.motivo}
                  </label>
                  <select
                    id={id('motivo')}
                    name="motivo"
                    value={valores.motivo}
                    onChange={cambiar('motivo')}
                    aria-invalid={!!errores.motivo}
                    aria-describedby={describe('motivo')}
                    className={`${inputCls} min-h-tap ${valores.motivo ? '' : 'text-slate-400'}`}
                  >
                    <option value="" disabled className="bg-kiniela-navy-deep">
                      {T.campos.motivoPlaceholder}
                    </option>
                    {MOTIVOS.map((m) => (
                      <option key={m.value} value={m.value} className="bg-kiniela-navy-deep text-white">
                        {m.label}
                      </option>
                    ))}
                  </select>
                  {errorDe('motivo')}
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <label htmlFor={id('mensaje')} className="block text-sm font-semibold text-white">
                      {T.campos.mensaje}
                    </label>
                    <span id={id('contador')} className="text-xs tabular-nums text-slate-400">
                      {T.ayudaMensaje(valores.mensaje.length, LIMITES.mensajeMax)}
                    </span>
                  </div>
                  <textarea
                    id={id('mensaje')}
                    name="mensaje"
                    rows={5}
                    maxLength={LIMITES.mensajeMax}
                    value={valores.mensaje}
                    onChange={cambiar('mensaje')}
                    aria-invalid={!!errores.mensaje}
                    aria-describedby={describe('mensaje', id('contador'))}
                    className={`${inputCls} resize-y py-3`}
                  />
                  {errorDe('mensaje')}
                </div>

                {/* Campo trampa: invisible para personas y lectores de pantalla; los bots lo llenan. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor={id('sitio')}>No llenar</label>
                  <input id={id('sitio')} name="sitio_web" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                <div className="mt-4">
                  <Turnstile ref={captcha} activo={activo} onToken={setToken} onError={() => setCaptchaFallo(true)} />
                </div>

                <div role="alert" aria-live="assertive" className="empty:hidden">
                  {errorGeneral && (
                    <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      <p>{T.errores[errorGeneral]}</p>
                      {mostrarAlternativa && (
                        <p className="mt-1 text-slate-200">
                          {T.alternativa}{' '}
                          <a href={CONTACTO.correoUrl} className="font-semibold text-kiniela-gold underline underline-offset-2">
                            {CONTACTO.correo}
                          </a>
                          .
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={enviando || esperandoCaptcha || captchaFallo}
                    aria-busy={enviando}
                    className="inline-flex min-h-casilla shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gold-foil px-6 font-bold uppercase tracking-wide text-kiniela-navy shadow-brand-glow transition-transform duration-tap ease-stamp active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {enviando || esperandoCaptcha ? (
                      <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin motion-reduce:animate-none" />
                    ) : (
                      <Send aria-hidden="true" className="h-5 w-5" />
                    )}
                    {enviando ? T.enviando : esperandoCaptcha ? T.verificando : T.enviar}
                  </button>
                  <div className="text-xs leading-relaxed text-slate-400 sm:text-right">
                    <p>{T.privacidad}</p>
                    <p className="mt-0.5 flex items-start gap-1 sm:justify-end">
                      <ShieldCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-kiniela-gold" />
                      <span>{T.seguridad}</span>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

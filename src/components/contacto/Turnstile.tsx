'use client';

// Cloudflare Turnstile (captcha) en modo explícito.
// - El script de Cloudflare se descarga solo cuando el formulario se acerca a la pantalla (no afecta la carga inicial).
// - Modo "interaction-only": casi siempre es invisible; solo muestra una casilla si Cloudflare duda.
// - El token dura ~5 min y sirve una sola vez: el padre llama a reset() tras cada envío.

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

// Clave de sitio de PRUEBA publicada por Cloudflare (siempre aprueba). Solo en desarrollo local sin claves.
const SITIO_PRUEBA = '1x00000000000000000000AA';
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV === 'development' ? SITIO_PRUEBA : '');

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let promesaScript: Promise<void> | null = null;

function cargarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (promesaScript) return promesaScript;
  promesaScript = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => {
      promesaScript = null;
      reject(new Error('No cargó Turnstile'));
    };
    document.head.appendChild(s);
  });
  return promesaScript;
}

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileProps {
  /** Empieza a cargar cuando es true (el formulario está cerca de la pantalla o el usuario lo tocó). */
  activo: boolean;
  onToken: (token: string | null) => void;
  onError: () => void;
}

export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(function Turnstile({ activo, onToken, onError }, ref) {
  const contenedor = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [fallo, setFallo] = useState(!SITE_KEY);

  // Las funciones del padre cambian en cada render; se leen desde una ref para no re-montar el widget.
  const cb = useRef({ onToken, onError });
  cb.current = { onToken, onError };

  useImperativeHandle(ref, () => ({
    reset: () => {
      cb.current.onToken(null);
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY) {
      console.error('[Contacto] Falta NEXT_PUBLIC_TURNSTILE_SITE_KEY.');
      cb.current.onError();
      return;
    }
    if (!activo || widgetId.current) return;
    let cancelado = false;

    cargarScript()
      .then(() => {
        if (cancelado || !contenedor.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(contenedor.current, {
          sitekey: SITE_KEY,
          action: 'contacto',
          theme: 'dark',
          language: 'es',
          appearance: 'interaction-only',
          callback: (t: string) => cb.current.onToken(t),
          'expired-callback': () => cb.current.onToken(null),
          'timeout-callback': () => cb.current.onToken(null),
          'error-callback': () => {
            cb.current.onToken(null);
            cb.current.onError();
            setFallo(true);
          },
        });
      })
      .catch(() => {
        if (cancelado) return;
        setFallo(true);
        cb.current.onError();
      });

    return () => {
      cancelado = true;
    };
  }, [activo]);

  // Al desmontar, se quita el widget para no dejar iframes huérfanos.
  useEffect(
    () => () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    },
    [],
  );

  return (
    <div>
      <div ref={contenedor} className="empty:hidden [&_iframe]:max-w-full" />
      {fallo && (
        <p role="alert" className="mt-2 text-xs text-kiniela-gold-light">
          No pudimos cargar la verificación de seguridad. Revisa tu conexión o desactiva bloqueadores para este sitio y
          recarga la página.
        </p>
      )}
    </div>
  );
});

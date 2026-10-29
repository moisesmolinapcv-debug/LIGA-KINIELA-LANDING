'use client';

// Vista previa de la imagen del boleto, antes de compartir. Diálogo accesible:
// foco atrapado, Esc cierra, el foco vuelve al botón que lo abrió. El share nativo se dispara
// desde el botón "Compartir" de aquí, así el gesto del usuario siempre es válido.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { BOLETO } from '../../content/copys';

const FILE_NAME = 'mi-boleto-liga-kiniela.png';

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function ShareDialog({ blob, onClose }: { blob: Blob; onClose: () => void }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  const file = useMemo(() => new File([blob], FILE_NAME, { type: 'image/png' }), [blob]);
  const [canShare, setCanShare] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  useEffect(() => {
    try {
      setCanShare(typeof navigator.share === 'function' && Boolean(navigator.canShare?.({ files: [file] })));
    } catch {
      setCanShare(false);
    }
  }, [file]);

  // Foco, bloqueo de scroll, Esc y Tab atrapado
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    boxRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !boxRef.current) return;
      const items = Array.from(boxRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !boxRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !boxRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  const download = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = FILE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const share = async () => {
    try {
      await navigator.share({ files: [file], title: BOLETO.tituloCompartir, text: BOLETO.textoCompartir });
      onClose();
    } catch (e) {
      const name = e instanceof Error ? e.name : '';
      if (name === 'AbortError') return; // cerró la hoja de compartir: no es un error
      download(); // cualquier otro fallo: queda la descarga
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-dialog-title"
        className="flex max-h-full w-full max-w-md flex-col rounded-2xl border border-kiniela-gold/50 bg-kiniela-navy-deep p-4 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="share-dialog-title" className="font-rockwell text-lg font-extrabold text-white">
            {BOLETO.vistaPreviaTitulo}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={BOLETO.cerrar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 min-h-0 flex-1 overflow-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={BOLETO.imagenAlt} className="mx-auto max-h-[55vh] w-auto max-w-full rounded-lg" />
        </div>
        <div className="mt-4 flex gap-2">
          {canShare && (
            <button
              type="button"
              onClick={share}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-gold-foil px-4 text-sm font-bold text-kiniela-navy"
            >
              <Share2 aria-hidden="true" className="h-4 w-4" />
              {BOLETO.compartirAccion}
            </button>
          )}
          <button
            type="button"
            onClick={download}
            className={`inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold ${
              canShare ? 'border border-white/30 text-white' : 'bg-gold-foil text-kiniela-navy'
            }`}
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            {BOLETO.descargar}
          </button>
        </div>
      </div>
    </div>
  );
}

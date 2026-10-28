import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Instagram, Globe } from 'lucide-react';
import { CONTACTO } from '../content/contacto';
import { JUEGO_RESPONSABLE_FRANJA, MARCA, CTA } from '../content/copys';

const LINKS_JUGAR = [
  { name: 'Partidos', href: '/#partidos' },
  { name: 'Premio', href: '/#premios' },
  { name: 'Campeones', href: '/#campeones' },
  { name: 'Dónde jugar', href: '/#aliados' },
];

const linkCls =
  'inline-flex min-h-tap items-center text-sm text-slate-300 transition-colors hover:text-kiniela-gold';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-kiniela-gold/20 bg-kiniela-navy-deep pb-[calc(6rem+var(--safe-bottom))] lg:pb-0">
      {/* Franja permanente de juego responsable */}
      <div className="border-b border-white/10 bg-kiniela-vinotinto/40">
        <p className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-xs text-white sm:px-6 sm:text-sm lg:px-8">
          <span className="rounded-full border border-white/60 px-2 py-0.5 font-bold">
            {JUEGO_RESPONSABLE_FRANJA.etiquetaEdad}
          </span>
          <span className="text-slate-200">{JUEGO_RESPONSABLE_FRANJA.informa}</span>
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label="Liga Kiniela, inicio" className="inline-flex items-center">
              <span className="relative block h-20 w-[74px]">
                <Image src="/brand/Recurso 4.svg" alt="Liga Kiniela" fill sizes="74px" className="brand-logo-dark object-contain" />
              </span>
            </Link>
          </div>

          <nav aria-label="Secciones" className="md:col-span-3">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-kiniela-gold">Jugar</h2>
            <ul>
              {LINKS_JUGAR.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkCls}>
                    {l.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="/#reglas" className={linkCls}>
                  Cómo se juega
                </a>
              </li>
              <li>
                <a href="/#faq" className={linkCls}>
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                {/* La ruta /terminos aún no existe; el enlace queda preparado. */}
                <Link href="/terminos" className={linkCls}>
                  {CTA.verTerminos}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-kiniela-gold">{MARCA.contactoTitulo}</h2>
            <ul>
              <li>
                <a href={CONTACTO.correoUrl} className={`${linkCls} gap-2 break-all`}>
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-kiniela-gold" />
                  {CONTACTO.correo}
                </a>
              </li>
              <li>
                <a href={CONTACTO.instagramUrl} target="_blank" rel="noopener noreferrer" className={`${linkCls} gap-2`}>
                  <Instagram aria-hidden="true" className="h-4 w-4 shrink-0 text-kiniela-gold" />
                  {CONTACTO.instagram}
                </a>
              </li>
              <li>
                <a href={CONTACTO.webUrl} target="_blank" rel="noopener noreferrer" className={`${linkCls} gap-2`}>
                  <Globe aria-hidden="true" className="h-4 w-4 shrink-0 text-kiniela-gold" />
                  {CONTACTO.web}
                </a>
              </li>
            </ul>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{CONTACTO.nota}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 py-6 text-xs text-slate-400 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl leading-relaxed">{JUEGO_RESPONSABLE_FRANJA.pie}</p>
          <p className="shrink-0">© {new Date().getFullYear()} Liga Kiniela</p>
        </div>
      </div>
    </footer>
  );
};

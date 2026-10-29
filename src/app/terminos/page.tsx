import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUp, Info, Lightbulb, Scale } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { REGLAMENTO, TERMINOS, VERSION_GUIA, type ArticuloGuia } from '../../content/terminos';
import { TERMINOS_PAGINA as T } from '../../content/landing';

export const metadata: Metadata = {
  title: 'Reglamento y Términos y Condiciones | Liga Kiniela',
  description:
    'Reglamento oficial (Artículos 1 al 11) y Términos y Condiciones de uso (Artículos 12 al 26) de Liga Kiniela, con explicaciones en palabras simples.',
  alternates: { canonical: '/terminos' },
  openGraph: {
    title: 'Reglamento y Términos y Condiciones | Liga Kiniela',
    description: 'El texto completo de Liga Kiniela, artículo por artículo.',
    url: '/terminos',
    siteName: 'Liga Kiniela',
    images: [{ url: '/og/liga-kiniela-og.png', width: 1200, height: 630, alt: 'Liga Kiniela: Pronostica. Marca tus 10. Gana el máximo.' }],
    locale: 'es_VE',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reglamento y Términos y Condiciones | Liga Kiniela',
    description: 'El texto completo de Liga Kiniela, artículo por artículo.',
    images: ['/og/liga-kiniela-og.png'],
  },
};

const NUMERADO = /^(\d+\.\d+)\.\s+([\s\S]*)$/;
/** Subtítulo corto al inicio de un párrafo numerado ("Mínimo para ganar. Solo pueden..."). */
const ROTULO = /^([^.:]{3,40})\.\s+(\S[\s\S]*)$/;

/** Párrafo numerado: número en dorado y, si lo trae, el rótulo corto en negrita. */
function ParrafoNumerado({ numero, texto }: { numero: string; texto: string }) {
  const m = ROTULO.exec(texto);
  return (
    <p className="flex gap-3 leading-relaxed text-slate-100">
      <span className="w-10 flex-none pt-0.5 text-right font-rockwell text-sm font-bold text-kiniela-gold">
        {numero}
      </span>
      <span className="min-w-0">
        {m ? (
          <>
            <strong className="font-semibold text-white">{m[1]}.</strong> {m[2]}
          </>
        ) : (
          texto
        )}
      </span>
    </p>
  );
}

function Articulo({ a }: { a: ArticuloGuia }) {
  const hayNumerados = a.parrafos.some((p) => NUMERADO.test(p));
  return (
    <article id={`art-${a.articulo}`} className="scroll-mt-24 border-t border-white/10 pt-8 first:border-t-0 first:pt-0">
      <header className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-kiniela-gold">Artículo {a.articulo}</p>
        <h3 className="font-rockwell text-xl font-extrabold text-white sm:text-2xl">{a.titulo}</h3>
      </header>

      <div className="space-y-3 text-[15px] sm:text-base">
        {a.parrafos.map((p, i) => {
          const m = NUMERADO.exec(p);
          if (m) return <ParrafoNumerado key={i} numero={`${m[1]}.`} texto={m[2]} />;
          if (!hayNumerados) return <p key={i} className="leading-relaxed text-slate-100">{p}</p>;
          return (
            <p key={i} className="ml-[3.25rem] border-l-2 border-kiniela-gold/30 pl-3 leading-relaxed text-slate-200">
              {p}
            </p>
          );
        })}
      </div>

      {a.tabla && <Tabla tabla={a.tabla} />}

      {a.complementaria && (
        <div role="note" className="mt-5 rounded-xl border border-kiniela-vinotinto bg-kiniela-vinotinto/25 p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kiniela-gold-light">
            <Scale aria-hidden="true" className="h-4 w-4" />
            {T.complementariaEtiqueta}
          </p>
          <p className="mt-2 font-semibold text-white">{a.complementaria.titulo}</p>
          <p className="mt-1 leading-relaxed text-slate-100">{a.complementaria.texto}</p>
          <p className="mt-2 text-sm text-slate-300">{T.complementariaAviso}</p>
        </div>
      )}

      {a.enPalabrasSimples && (
        <div role="note" className="mt-5 rounded-xl border-l-4 border-kiniela-gold bg-kiniela-gold/10 p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kiniela-gold">
            <Lightbulb aria-hidden="true" className="h-4 w-4" />
            {T.enPalabrasSimples}
          </p>
          <p className="mt-1.5 leading-relaxed text-white">{a.enPalabrasSimples}</p>
        </div>
      )}

      {a.ejemplo && (
        <div role="note" className="mt-4 rounded-xl border border-white/15 bg-white/5 p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Info aria-hidden="true" className="h-4 w-4" />
            {T.ejemplo}
          </p>
          <p className="mt-1.5 leading-relaxed text-slate-100">{a.ejemplo}</p>
        </div>
      )}

      <p className="mt-4 text-right">
        <a
          href="#indice"
          className="inline-flex min-h-tap items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-300 hover:text-kiniela-gold"
        >
          <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
          {T.arriba}
        </a>
      </p>
    </article>
  );
}

/** Tabla: en pantallas pequeñas cada fila se vuelve una tarjeta con sus rótulos, sin scroll lateral. */
function Tabla({ tabla }: { tabla: NonNullable<ArticuloGuia['tabla']> }) {
  return (
    <div className="mt-5">
      <table className="hidden w-full border-collapse overflow-hidden rounded-xl text-left text-sm sm:table">
        <thead>
          <tr>
            {tabla.encabezados.map((h) => (
              <th key={h} scope="col" className="border border-white/15 bg-kiniela-navy-card px-3 py-2.5 font-semibold text-kiniela-gold-light">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.filas.map((fila, i) => (
            <tr key={i}>
              {fila.map((c, j) => (
                <td key={j} className="border border-white/10 px-3 py-2.5 text-slate-100">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="space-y-2 sm:hidden">
        {tabla.filas.map((fila, i) => (
          <li key={i} className="rounded-xl border border-white/15 bg-kiniela-navy-card/70 p-3">
            <dl className="space-y-1.5 text-sm">
              {fila.map((c, j) => (
                <div key={j}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-kiniela-gold-light">
                    {tabla.encabezados[j]}
                  </dt>
                  <dd className="text-slate-100">{c}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Indice({ idSufijo }: { idSufijo: string }) {
  const grupo = (titulo: string, rango: string, lista: ArticuloGuia[]) => (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-kiniela-gold">{titulo}</p>
      <p className="mb-1 text-xs text-slate-400">{rango}</p>
      <ul>
        {lista.map((a) => (
          <li key={a.articulo}>
            <a
              href={`#art-${a.articulo}`}
              aria-label={`${T.irAArticulo(a.articulo)}: ${a.titulo}`}
              className="flex min-h-tap items-center gap-2 rounded-lg px-2 text-sm text-slate-200 hover:bg-white/5 hover:text-kiniela-gold"
            >
              <span className="w-6 flex-none text-right font-rockwell font-bold text-kiniela-gold">{a.articulo}</span>
              <span>{a.titulo}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <nav aria-label={`${T.indice} (${idSufijo})`} className="space-y-4">
      {grupo(T.parteReglamento, T.parteReglamentoRango, REGLAMENTO)}
      {grupo(T.parteTerminos, T.parteTerminosRango, TERMINOS)}
    </nav>
  );
}

export default function TerminosPage() {
  return (
    <div className="relative flex min-h-screen max-w-full flex-col overflow-x-clip bg-kiniela-navy text-white selection:bg-kiniela-gold selection:text-kiniela-navy">
      <Navbar />

      <main id="contenido" tabIndex={-1} className="flex-grow pb-16 pt-24 outline-none sm:pt-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-tap items-center gap-2 rounded-lg pr-3 text-sm font-semibold text-kiniela-gold hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {T.volver}
          </Link>

          <header id="indice" className="mt-2 scroll-mt-24">
            <h1 className="font-rockwell text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl">
              {T.titulo}
            </h1>
            <p className="mt-2 text-base text-slate-200 sm:text-lg">{T.subtitulo}</p>
            <p className="mt-3 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200">
              Guía oficial v{VERSION_GUIA.version} · {VERSION_GUIA.emision} · Hora de Venezuela
            </p>
            <p className="mt-4 max-w-3xl rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-slate-200">
              {T.nota11_3}
            </p>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
            {/* Índice: plegable en móvil, fijo a la izquierda en escritorio */}
            <aside aria-label={T.indice} className="lg:sticky lg:top-24 lg:self-start">
              <details className="m3c-panel lg:hidden">
                <summary className="flex min-h-[56px] cursor-pointer items-center justify-between rounded-2xl px-5 py-3 font-semibold text-white">
                  {T.indice}
                </summary>
                <div className="border-t border-white/10 px-3 pb-4 pt-3">
                  <Indice idSufijo="móvil" />
                </div>
              </details>
              <div className="hidden max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 lg:block">
                <Indice idSufijo="escritorio" />
              </div>
            </aside>

            <div className="min-w-0 space-y-14">
              <section aria-labelledby="parte-reglamento" className="space-y-8">
                <div>
                  <h2 id="parte-reglamento" className="font-rockwell text-2xl font-black uppercase text-kiniela-gold-light sm:text-3xl">
                    {T.parteReglamento}
                  </h2>
                  <p className="text-sm text-slate-300">{T.parteReglamentoRango}</p>
                </div>
                {REGLAMENTO.map((a) => (
                  <Articulo key={a.articulo} a={a} />
                ))}
              </section>

              <section aria-labelledby="parte-terminos" className="space-y-8">
                <div>
                  <h2 id="parte-terminos" className="font-rockwell text-2xl font-black uppercase text-kiniela-gold-light sm:text-3xl">
                    {T.parteTerminos}
                  </h2>
                  <p className="text-sm text-slate-300">{T.parteTerminosRango}</p>
                </div>
                {TERMINOS.map((a) => (
                  <Articulo key={a.articulo} a={a} />
                ))}
              </section>

              <p>
                <Link
                  href="/"
                  className="inline-flex min-h-tap items-center gap-2 rounded-xl border border-kiniela-gold/60 px-5 font-semibold text-kiniela-gold hover:bg-kiniela-gold/10"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  {T.volver}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

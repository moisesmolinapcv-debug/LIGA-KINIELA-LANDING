import type { Metadata, Viewport } from 'next';
import { Poppins, Roboto_Slab } from 'next/font/google';
import './globals.css';

// Respaldo libre de Rockwell (Apache-2.0) hasta contar con licencia web (Plan v4, P4)
const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-slab',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  // Solo los pesos que usa la web (400 lectura, 500 y 600 énfasis, 700 negritas); 300/800/900 no se usan con Poppins.
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ligakiniela.com';
const TITULO = 'Liga Kiniela | Pronósticos Deportivos en Venezuela';
const DESCRIPCION =
  'Consulta la Kiniela activa con su premio y su cierre, prueba tu boleto de práctica y conoce las plataformas aliadas donde se juega. Solo para mayores de 18 años.';
const OG_IMAGEN = {
  url: '/og/liga-kiniela-og.png',
  width: 1200,
  height: 630,
  alt: 'Liga Kiniela: Pronostica. Marca tus 10. Gana el máximo.',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITULO,
  description: DESCRIPCION,
  applicationName: 'Liga Kiniela',
  authors: [{ name: 'Liga Kiniela' }],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/brand/Recurso 4.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: '/',
    siteName: 'Liga Kiniela',
    images: [OG_IMAGEN],
    locale: 'es_VE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITULO,
    description: DESCRIPCION,
    images: [OG_IMAGEN.url],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  // Barra del navegador del color de la marca (Azul Noche)
  themeColor: '#00063E',
  colorScheme: 'dark',
};

// Origen de datos de la base (banners, ganadores, ajustes): se conecta de antemano para ganar ~100-300 ms en móvil.
const SUPABASE_ORIGIN = (() => {
  try {
    const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^['"]|['"]$/g, '');
    return raw ? new URL(raw).origin : null;
  } catch {
    return null;
  }
})();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${robotoSlab.variable} scroll-smooth`} suppressHydrationWarning>
      <head>{SUPABASE_ORIGIN && <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />}</head>
      <body className="bg-kiniela-navy text-white min-h-screen antialiased selection:bg-kiniela-gold selection:text-kiniela-navy" suppressHydrationWarning>
        <a
          href="#contenido"
          className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-lg bg-kiniela-gold px-4 py-3 text-sm font-bold text-kiniela-navy shadow-lg focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}

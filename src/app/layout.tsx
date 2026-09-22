import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ligakiniela.com'),
  title: 'Liga Kiniela | Pronósticos Deportivos en Venezuela',
  description:
    'Plataforma oficial de pronósticos deportivos de Liga Kiniela. Consulta en tiempo real la cartelera de partidos, premios acumulados, estatus en vivo y salón de campeones.',
  keywords: [
    'Liga Kiniela',
    'Quiniela Venezuela',
    'Pronósticos de fútbol',
    'Resultados en vivo',
    'FUTVE',
    'Champions League',
    'Vinotinto',
  ],
  authors: [{ name: 'Liga Kiniela Oficial' }],
  icons: {
    icon: '/brand/Recurso 4.svg',
    shortcut: '/brand/Recurso 4.svg',
    apple: '/brand/Recurso 4k-logo.png',
  },
  openGraph: {
    title: 'Liga Kiniela | Pronósticos Deportivos en Venezuela',
    description:
      'Cartelera deportiva en vivo, premios acumulados en Bolívares (Bs) y salón de campeones de Liga Kiniela.',
    url: 'https://ligakiniela.com',
    siteName: 'Liga Kiniela',
    images: [
      {
        url: '/brand/Recurso 4k-logo.png',
        width: 800,
        height: 600,
        alt: 'Liga Kiniela Logo Oficial',
      },
    ],
    locale: 'es_VE',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#00063E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="bg-kiniela-navy text-white min-h-screen antialiased selection:bg-kiniela-gold selection:text-kiniela-navy" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

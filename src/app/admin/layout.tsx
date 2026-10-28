import type { Metadata } from 'next';

// El panel es privado: no debe aparecer en buscadores y su pestaña lleva su propio título.
export const metadata: Metadata = {
  title: 'Panel de control | Liga Kiniela',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

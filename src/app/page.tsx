import HomeClient from '../components/HomeClient';
import { getServerBanners } from '../lib/banners-server';

// La portada se genera en el servidor y se refresca cada 60 s con los banners del panel. El cliente vuelve a
// leerlos al abrir y se suscribe a cambios, así que un cambio del admin se ve de inmediato en su propio navegador.
export const revalidate = 60;

export default async function HomePage() {
  const initialBanners = await getServerBanners();
  return <HomeClient initialBanners={initialBanners} />;
}

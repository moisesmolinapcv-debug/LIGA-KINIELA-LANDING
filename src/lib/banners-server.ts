// Lectura de banners en el servidor para que la imagen principal (LCP) esté en el HTML inicial
// y el navegador la pida a la vez que el JavaScript, no después de hidratar y consultar la base.
// Si falla, devuelve [] y el cliente carga los banners como siempre.

import type { BannerSlide } from '../types/kiniela';
import { getSupabaseRestConfig } from './kiniela-store';

export async function getServerBanners(): Promise<BannerSlide[]> {
  const { ok, url, key } = getSupabaseRestConfig();
  if (!ok) return [];
  try {
    const res = await fetch(`${url}/rest/v1/banners?select=id,title,image_url,image_url_mobile,is_active,sort_order&is_active=eq.true&order=sort_order.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as BannerSlide[];
    return Array.isArray(rows) ? rows.filter((b) => b && b.image_url) : [];
  } catch {
    return [];
  }
}

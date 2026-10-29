// Hosts que el optimizador de imágenes de Next puede leer (deben coincidir con images.remotePatterns de next.config.mjs).
// Cualquier otro host se muestra con su archivo original, para que ninguna imagen quede en blanco.
export function canOptimize(url: string | null | undefined): url is string {
  if (!url || !/^https:\/\//i.test(url)) return false;
  try {
    const h = new URL(url).hostname;
    return h.endsWith('.supabase.co') || h === 'ligakiniela.com' || h === 'images.unsplash.com';
  } catch {
    return false;
  }
}

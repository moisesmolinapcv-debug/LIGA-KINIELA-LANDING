import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ligakiniela.com';

// /admin no se lista: es privado y además lleva noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/terminos`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}

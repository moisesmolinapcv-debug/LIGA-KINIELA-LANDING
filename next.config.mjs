/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Solo estos orígenes pasan por el optimizador (banners del admin en Supabase, escudos oficiales, Unsplash).
    // Cualquier otro host se muestra con su archivo original (ver HeroBillboardSlider y Crest).
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'ligakiniela.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/webp'],
    // Los escudos y banners no cambian a diario: 1 día de caché en el optimizador (el origen manda no-cache).
    minimumCacheTTL: 86400,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

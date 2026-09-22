'use client';

import React, { useEffect, useState } from 'react';
import { KinielaDataState } from '../types/kiniela';
import { getKinielaData, subscribeToKiniela, getDefaultSeed, formatBs } from '../lib/kiniela-store';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { MatchesSection } from '../components/MatchesSection';
import { WinnersSection } from '../components/WinnersSection';
import { RulesAndFaqSection } from '../components/RulesAndFaqSection';
import { AlliesCarousel } from '../components/AlliesCarousel';
import { Footer } from '../components/Footer';
import { BottomNavBar } from '../components/BottomNavBar';
import { HeroSkeleton } from '../components/skeletons/HeroSkeleton';
import { MatchesSkeleton } from '../components/skeletons/MatchesSkeleton';
import { WinnersSkeleton } from '../components/skeletons/WinnersSkeleton';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<KinielaDataState>(() => getDefaultSeed());

  useEffect(() => {
    let isMounted = true;

    // Caché Inteligente: Si este dispositivo ya tiene datos reales de Supabase en memoria, cargamos al instante (0ms)
    if (typeof window !== 'undefined') {
      try {
        const cached = window.localStorage.getItem('liga_kiniela_store_v1');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.edition && parsed.banners && parsed.source === 'supabase') {
            setData(parsed);
            setIsLoading(false);
          }
        }
      } catch (e) {
        // Fallback normal
      }
    }

    // Consulta fresca a Supabase en segundo plano
    getKinielaData()
      .then((initialData) => {
        if (isMounted) {
          setData(initialData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('[LigaKiniela] Error al sincronizar datos:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Suscripción reactiva en tiempo real
    const unsubscribe = subscribeToKiniela((updatedState) => {
      if (isMounted) {
        setData(updatedState);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-kiniela-navy text-white flex flex-col selection:bg-kiniela-gold selection:text-kiniela-navy relative pb-32 sm:pb-36 lg:pb-0 overflow-x-hidden max-w-full">
      {/* Navegación superior oficial */}
      <Navbar />

      {/* Contenido Principal de la Landing Page Comercial */}
      <main className="flex-grow">
        {isLoading ? (
          /* Esqueletos con Shimmer animado durante la carga inicial de Supabase */
          <div className="animate-fadeIn">
            <HeroSkeleton />
            <MatchesSkeleton />
            <WinnersSkeleton />
          </div>
        ) : (
          /* Contenido Real Sincronizado con Supabase */
          <div className="animate-fadeIn">
            {/* 1. Sección Hero con Carrusel Hero Billboard y montos en Bs */}
            <Hero edition={data.edition} slides={data.banners} copys={data.copys} />

            {/* 2. Cartelera de Partidos en Vivo con Filtros y Marcadores */}
            <MatchesSection matches={data.matches} copys={data.copys} />

            {/* 3. Salón de Campeones con Ganadores Previos y montos en Bs */}
            <WinnersSection winners={data.winners} copys={data.copys} />
          </div>
        )}

        {/* 4. Reglamento Paso a Paso y Acordeón FAQ */}
        <RulesAndFaqSection copys={data.copys} />

        {/* 5. Carrusel de Aliados: "En Dónde Jugar" con las casas de apuestas oficiales */}
        <AlliesCarousel
          badgeText={data.copys?.allies_badge}
          titleText={data.copys?.allies_title}
          subtitleText={data.copys?.allies_subtitle}
        />
      </main>

      {/* Pie de Página Institucional */}
      <Footer />

      {/* 6. Barra de Navegación Inferior Flotante Móvil (Estilo Yummy, translúcida con 5 accesos) */}
      <BottomNavBar prizeText={formatBs(data.edition.prize_amount_bs)} />
    </div>
  );
}

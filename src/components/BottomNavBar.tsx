'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, CalendarDays, Award, Handshake, Ticket } from 'lucide-react';

interface BottomNavBarProps {
  /** Heredado de la versión anterior; ya no se usa (el premio sale del endpoint, en el hero). */
  prizeText?: string;
}

const ITEMS = [
  { id: 'premios', label: 'Premio', icon: Trophy },
  { id: 'partidos', label: 'Partidos', icon: CalendarDays },
  { id: 'cta', label: 'Boleto', icon: Ticket },
  { id: 'campeones', label: 'Campeones', icon: Award },
  { id: 'aliados', label: 'Aliados', icon: Handshake },
] as const;

/**
 * Barra inferior móvil. El botón central es el acceso al CTA (boleto de práctica):
 * va relleno de oro solo cuando el CTA del hero no está a la vista, para no duplicar
 * la acción primaria. Respeta la zona segura inferior (--safe-bottom).
 */
export const BottomNavBar: React.FC<BottomNavBarProps> = () => {
  const [active, setActive] = useState<string>('');
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);

  useEffect(() => {
    const ids = ['premios', 'partidos', 'campeones', 'aliados'];
    const onScroll = () => {
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.45 && r.bottom >= window.innerHeight * 0.15) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Observa el CTA del hero (puede aparecer después, cuando llegan los datos).
  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let cancelled = false;
    const attach = () => {
      const el = document.getElementById('hero-cta');
      if (!el) {
        setHeroCtaVisible(false);
        if (!cancelled) window.setTimeout(attach, 600);
        return;
      }
      io = new IntersectionObserver(([e]) => setHeroCtaVisible(e.isIntersecting), { threshold: 0.6 });
      io.observe(el);
    };
    attach();
    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, []);

  const go = (id: string) => {
    const target =
      id === 'cta'
        ? document.getElementById('boleto') ?? document.getElementById('partidos')
        : document.getElementById(id);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Navegación rápida"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-kiniela-gold/30 bg-kiniela-navy-deep/95 lg:hidden"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <ul className="mx-auto flex max-w-md items-end justify-between px-1">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          if (it.id === 'cta') {
            return (
              <li key={it.id} className="flex flex-1 justify-center pb-1">
                <button
                  type="button"
                  onClick={() => go('cta')}
                  aria-label="Probar mi boleto"
                  className={`-mt-4 flex h-14 min-w-[56px] flex-col items-center justify-center rounded-2xl border-2 px-3 transition-transform duration-tap ease-stamp active:scale-95 ${
                    heroCtaVisible
                      ? 'border-kiniela-gold/60 bg-kiniela-navy-card text-kiniela-gold'
                      : 'border-kiniela-gold bg-gold-foil text-kiniela-navy shadow-brand-glow'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wide">{it.label}</span>
                </button>
              </li>
            );
          }
          const isActive = active === it.id;
          return (
            <li key={it.id} className="flex-1">
              <button
                type="button"
                onClick={() => go(it.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 ${
                  isActive ? 'text-kiniela-gold' : 'text-slate-300'
                }`}
              >
                {isActive && <span aria-hidden="true" className="absolute top-0 h-0.5 w-8 rounded-full bg-kiniela-gold" />}
                <Icon aria-hidden="true" className="h-5 w-5" />
                <span className="text-[10px] font-semibold">{it.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

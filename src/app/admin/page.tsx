'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KinielaDataState, Winner, BannerSlide } from '@/types/kiniela';
import {
  getKinielaData,
  addBannerSlide,
  updateBannerSlide,
  deleteBannerSlide,
  reorderBannerSlides,
  addWinner,
  updateWinner,
  deleteWinner,
  subscribeToKiniela,
} from '@/lib/kiniela-store';

import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { EditionTab } from '@/components/admin/EditionTab';
import { MatchesTab } from '@/components/admin/MatchesTab';
import { BannerTab } from '@/components/admin/BannerTab';
import { WinnersTab } from '@/components/admin/WinnersTab';
import { CopysTab } from '@/components/admin/CopysTab';
import { ToastNotification, ToastMessage } from '@/components/admin/ToastNotification';
import { useAdminKinielas, type Notify } from '@/components/admin/useAdminKinielas';

import { Trophy, CalendarDays, Megaphone, Award, MessageSquareText, WifiOff } from 'lucide-react';

type TabKey = 'edition' | 'matches' | 'banner' | 'winners' | 'copys';

const errText = (err: unknown, fallback: string): string => (err instanceof Error && err.message ? err.message : fallback);

function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<number[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast: Notify = useCallback(
    (type, title, message) => {
      const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 6);
      setToasts((prev) => [...prev, { id, type, title, message }]);
      // Los errores se quedan más tiempo para poder leerlos
      const t = window.setTimeout(() => dismissToast(id), type === 'error' ? 9000 : 4500);
      timers.current.push(t);
    },
    [dismissToast]
  );

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  return { toasts, addToast, dismissToast };
}

interface PanelProps {
  onLogout: () => void;
  addToast: Notify;
}

/** Panel ya autenticado: aquí viven los datos y las pestañas. */
function AdminPanel({ onLogout, addToast }: PanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('edition');
  const [kinielaData, setKinielaData] = useState<KinielaDataState | null>(null);
  const admin = useAdminKinielas();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Banners y campeones: carga inicial y suscripción a cambios
  useEffect(() => {
    let alive = true;
    getKinielaData().then((initial) => {
      if (alive) setKinielaData(initial);
    });
    const unsubscribe = subscribeToKiniela((updated) => {
      if (alive) setKinielaData(updated);
    });
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  // --- Banners ---------------------------------------------------------------
  const handleAddBannerSlide = async (slide: Omit<BannerSlide, 'id'>): Promise<boolean> => {
    try {
      await addBannerSlide(slide);
      addToast('success', 'Banner añadido', 'Ya está en el carrusel. Puede tardar hasta 1 minuto en verse en la web.');
      return true;
    } catch (err) {
      addToast('error', 'No se pudo añadir el banner', errText(err, 'Inténtalo de nuevo.'));
      return false;
    }
  };

  const handleUpdateBannerSlide = async (id: string, update: Partial<BannerSlide>): Promise<boolean> => {
    try {
      await updateBannerSlide(id, update);
      addToast('success', 'Banner guardado', 'Los cambios pueden tardar hasta 1 minuto en verse en la web.');
      return true;
    } catch (err) {
      addToast('error', 'No se pudo guardar el banner', errText(err, 'Inténtalo de nuevo.'));
      return false;
    }
  };

  const handleDeleteBannerSlide = async (id: string): Promise<boolean> => {
    try {
      await deleteBannerSlide(id);
      addToast('info', 'Banner eliminado', 'Ya no aparece en el carrusel.');
      return true;
    } catch (err) {
      addToast('error', 'No se pudo eliminar el banner', errText(err, 'Inténtalo de nuevo.'));
      return false;
    }
  };

  const handleReorderBanners = async (orders: { id: string; sort_order: number }[]): Promise<boolean> => {
    try {
      await reorderBannerSlides(orders);
      return true;
    } catch (err) {
      addToast('error', 'No se pudo cambiar el orden', errText(err, 'Inténtalo de nuevo.'));
      return false;
    }
  };

  // --- Campeones -------------------------------------------------------------
  const handleAddWinner = async (data: Omit<Winner, 'id'>): Promise<boolean> => {
    try {
      const winner = await addWinner(data);
      addToast('success', 'Campeón registrado', `${winner.winner_name} ya está en el Salón de Campeones.`);
      return true;
    } catch (err) {
      addToast('error', 'No se pudo registrar al campeón', errText(err, 'Inténtalo de nuevo.'));
      return false;
    }
  };

  const handleUpdateWinner = async (id: string, update: Partial<Winner>): Promise<boolean> => {
    try {
      await updateWinner(id, update);
      addToast('success', 'Campeón actualizado', 'Los cambios pueden tardar hasta 1 minuto en verse en la web.');
      return true;
    } catch (err) {
      addToast('error', 'No se pudo actualizar al campeón', errText(err, 'Inténtalo de nuevo.'));
      return false;
    }
  };

  const handleDeleteWinner = async (id: string): Promise<boolean> => {
    try {
      await deleteWinner(id);
      addToast('info', 'Campeón eliminado', 'Ya no aparece en el Salón de Campeones.');
      return true;
    } catch (err) {
      addToast('error', 'No se pudo eliminar al campeón', errText(err, 'Inténtalo de nuevo.'));
      return false;
    }
  };

  if (!kinielaData) {
    return (
      <div className="min-h-screen bg-[#00063E] flex items-center justify-center p-4" role="status">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-kiniela-gold border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-200">Cargando el panel...</span>
        </div>
      </div>
    );
  }

  // Indicadores de las pestañas
  const sel = admin.selected;
  const metaForSel = sel ? admin.manual.meta.filter((r) => r.poolId === sel.id) : [];
  const liveCount = metaForSel.filter((r) => r.status === 'EN VIVO').length;
  const withTime = sel ? sel.matches.filter((m) => metaForSel.some((r) => r.homeTeamId === m.homeTeam.id && r.awayTeamId === m.awayTeam.id && r.kickoff)).length : 0;
  const bannerCount = (kinielaData.banners || []).length;

  const tabs: { key: TabKey; label: string; Icon: typeof Trophy; badge?: React.ReactNode; badgeClass?: string }[] = [
    { key: 'edition', label: 'Kiniela activa', Icon: Trophy },
    {
      key: 'matches',
      label: 'Partidos',
      Icon: CalendarDays,
      badge: liveCount > 0 ? `${liveCount} en vivo` : sel ? `${withTime}/${sel.matches.length}` : undefined,
      badgeClass: liveCount > 0 ? 'bg-rose-600 text-white' : undefined,
    },
    { key: 'banner', label: 'Banners', Icon: Megaphone, badge: String(bannerCount) },
    { key: 'winners', label: 'Campeones', Icon: Award, badge: String(kinielaData.winners.length) },
    { key: 'copys', label: 'Textos antiguos', Icon: MessageSquareText },
  ];

  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setActiveTab(tabs[next].key);
    tabRefs.current[tabs[next].key]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#000428] text-white flex flex-col font-poppins selection:bg-kiniela-gold selection:text-kiniela-navy">
      <AdminHeader source={kinielaData.source} onLogout={onLogout} />

      {/* Pestañas: se quedan fijas arriba al desplazarse */}
      <nav aria-label="Secciones del panel" className="sticky top-0 z-40 bg-[#00063E]/95 border-b border-[#1a2785] px-3 sm:px-4 lg:px-8 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Secciones del panel"
          className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map(({ key, label, Icon, badge, badgeClass }, i) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[key] = el;
                }}
                id={`tab-${key}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${key}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveTab(key)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`flex items-center gap-2 min-h-[44px] px-3.5 sm:px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors border ${
                  active
                    ? 'bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] text-white shadow-lg shadow-kiniela-vinotinto/30 border-kiniela-gold/40'
                    : 'text-slate-200 hover:text-white hover:bg-[#0c186b]/60 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-kiniela-gold' : 'text-slate-300'}`} aria-hidden="true" />
                <span>{label}</span>
                {badge !== undefined && (
                  <span
                    className={`text-xs font-mono font-black px-2 py-0.5 rounded-full ${
                      badgeClass ?? (active ? 'bg-kiniela-gold text-kiniela-navy' : 'bg-slate-700 text-slate-100')
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {kinielaData.source === 'local' && (activeTab === 'banner' || activeTab === 'winners') && (
          <div role="alert" className="mb-6 flex gap-3 p-4 rounded-xl bg-amber-950/50 border border-amber-500/50 text-amber-100 text-sm">
            <WifiOff className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              No hay conexión con la base de datos. Lo que se muestra aquí viene de este navegador y lo que hagas no llegará a la
              web hasta que vuelva la conexión. Recarga la página para reintentar.
            </p>
          </div>
        )}

        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'edition' && <EditionTab admin={admin} notify={addToast} />}

          {activeTab === 'matches' && <MatchesTab admin={admin} notify={addToast} />}

          {activeTab === 'banner' && (
            <BannerTab
              banners={kinielaData.banners || []}
              onAddBannerSlide={handleAddBannerSlide}
              onUpdateBannerSlide={handleUpdateBannerSlide}
              onDeleteBannerSlide={handleDeleteBannerSlide}
              onReorderBanners={handleReorderBanners}
            />
          )}

          {activeTab === 'winners' && (
            <WinnersTab
              winners={kinielaData.winners}
              onAddWinner={handleAddWinner}
              onUpdateWinner={handleUpdateWinner}
              onDeleteWinner={handleDeleteWinner}
              suggestedTitles={admin.kinielas.map((k) => k.name)}
            />
          )}

          {activeTab === 'copys' && <CopysTab notify={addToast} />}
        </div>
      </main>

      <footer className="border-t border-[#1a2785]/60 py-4 px-6 text-center text-xs text-slate-300 font-medium">
        <p>Liga Kiniela &copy; {new Date().getFullYear()} &bull; Panel de control</p>
      </footer>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const { toasts, addToast, dismissToast } = useToasts();

  // Verificar sesión en sessionStorage
  useEffect(() => {
    try {
      if (sessionStorage.getItem('kiniela_admin_session') === 'authenticated') {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignorar errores de acceso a sessionStorage
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('kiniela_admin_session');
      sessionStorage.removeItem('kiniela_admin_login_time');
    } catch {
      // Ignorar
    }
    setIsAuthenticated(false);
    addToast('info', 'Sesión cerrada', 'El panel quedó bloqueado.');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#00063E] flex items-center justify-center p-4" role="status">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-kiniela-gold border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-200">Abriendo el panel...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminPanel onLogout={handleLogout} addToast={addToast} />
      ) : (
        <AdminLogin
          onSuccess={() => {
            setIsAuthenticated(true);
            addToast('success', 'Bienvenido', 'Entraste al panel de Liga Kiniela.');
          }}
        />
      )}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

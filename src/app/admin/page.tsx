'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { KinielaDataState, KinielaEdition, Match, Winner, Banner, BannerSlide, SiteCopys } from '@/types/kiniela';
import {
  getKinielaData,
  updateEdition,
  addMatch,
  updateMatch,
  deleteMatch,
  updateBanner,
  addBannerSlide,
  updateBannerSlide,
  deleteBannerSlide,
  addWinner,
  updateWinner,
  deleteWinner,
  updateSiteCopys,
  resetToDefault,
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

import { Trophy, CalendarDays, Megaphone, Award, MessageSquareText } from 'lucide-react';

type TabKey = 'edition' | 'matches' | 'banner' | 'winners' | 'copys';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabKey>('edition');
  const [kinielaData, setKinielaData] = useState<KinielaDataState | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Función para agregar Toast
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Descartar automáticamente tras 4 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Verificar sesión en sessionStorage
  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem('kiniela_admin_session');
      if (storedAuth === 'authenticated') {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignorar errores de acceso a sessionStorage
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  // 2. Cargar datos iniciales y suscribirse a cambios reactivos
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getKinielaData().then((initial) => {
      setKinielaData(initial);
    });

    unsubscribe = subscribeToKiniela((updatedState) => {
      setKinielaData(updatedState);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('kiniela_admin_session');
      sessionStorage.removeItem('kiniela_admin_login_time');
    } catch {
      // Ignorar
    }
    setIsAuthenticated(false);
    addToast('info', 'Sesión Bloqueada', 'El panel administrativo se ha cerrado con éxito.');
  };

  // Handlers de mutación con feedback en Toast
  const handleSaveEdition = async (updated: Partial<KinielaEdition>) => {
    try {
      await updateEdition(updated);
      addToast('success', 'Parámetros Actualizados', 'Los datos de la edición se han guardado con éxito.');
    } catch (err) {
      addToast('error', 'Error al Guardar', 'No fue posible actualizar los parámetros de la edición.');
    }
  };

  const handleAddMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      const created = await addMatch(matchData);
      addToast(
        'success',
        'Partido Agregado',
        `El encuentro ${created.home_team} vs ${created.away_team} fue inyectado a la cartelera.`
      );
    } catch (err) {
      addToast('error', 'Error al Agregar', 'Ocurrió un error al agregar el partido.');
    }
  };

  const handleUpdateMatch = async (id: string, matchUpdate: Partial<Match>) => {
    try {
      await updateMatch(id, matchUpdate);
      addToast('info', 'Cartelera Actualizada', 'Cambio de marcador o estado sincronizado.');
    } catch (err) {
      addToast('error', 'Error al Actualizar', 'No se pudo actualizar el partido seleccionado.');
    }
  };

  const handleDeleteMatch = async (id: string) => {
    try {
      await deleteMatch(id);
      addToast('info', 'Partido Eliminado', 'El encuentro fue removido de la cartelera.');
    } catch (err) {
      addToast('error', 'Error al Eliminar', 'No se pudo eliminar el encuentro.');
    }
  };

  const handleSaveBanner = async (bannerUpdate: Partial<Banner>) => {
    try {
      await updateBanner(bannerUpdate);
      addToast('success', 'Banner Guardado', 'El banner comercial fue actualizado en la plataforma.');
    } catch (err) {
      addToast('error', 'Error al Guardar', 'No se pudo actualizar el banner publicitario.');
    }
  };

  const handleAddBannerSlide = async (slide: Omit<BannerSlide, 'id'>) => {
    try {
      await addBannerSlide(slide);
      addToast('success', 'Banner Añadido', 'El banner fue incorporado al carrusel.');
    } catch (err) {
      addToast('error', 'Error al Añadir', 'No se pudo añadir el banner.');
    }
  };

  const handleUpdateBannerSlide = async (id: string, update: Partial<BannerSlide>) => {
    try {
      await updateBannerSlide(id, update);
      addToast('info', 'Banner Actualizado', 'Los cambios en el banner fueron guardados.');
    } catch (err) {
      addToast('error', 'Error al Actualizar', 'No se pudo actualizar el banner.');
    }
  };

  const handleDeleteBannerSlide = async (id: string) => {
    try {
      await deleteBannerSlide(id);
      addToast('info', 'Banner Eliminado', 'El banner fue retirado del carrusel.');
    } catch (err) {
      addToast('error', 'Error al Eliminar', 'No se pudo eliminar el banner.');
    }
  };

  const handleAddWinner = async (winnerData: Omit<Winner, 'id'>) => {
    try {
      const winner = await addWinner(winnerData);
      addToast(
        'success',
        'Ganador Inscrito',
        `${winner.winner_name} fue registrado en el Salón de Campeones.`
      );
    } catch (err) {
      addToast('error', 'Error al Registrar', 'No se pudo registrar el nuevo campeón.');
    }
  };

  const handleDeleteWinner = async (id: string) => {
    try {
      await deleteWinner(id);
      addToast('info', 'Registro Eliminado', 'El ganador ha sido removido del salón.');
    } catch (err) {
      addToast('error', 'Error al Eliminar', 'No se pudo eliminar el ganador.');
    }
  };

  const handleUpdateWinner = async (id: string, update: Partial<Winner>) => {
    try {
      await updateWinner(id, update);
      addToast('success', 'Ganador Actualizado', 'Los datos del campeón se actualizaron con éxito.');
    } catch (err) {
      addToast('error', 'Error al Actualizar', 'No se pudo actualizar los datos del ganador.');
    }
  };

  const handleUpdateCopys = async (update: Partial<SiteCopys>) => {
    try {
      await updateSiteCopys(update);
      addToast('success', 'Textos Guardados', 'Los textos de la web se han actualizado con éxito.');
    } catch (err) {
      addToast('error', 'Error al Guardar', 'No se pudieron actualizar los textos.');
    }
  };

  const handleResetData = async () => {
    try {
      const fresh = await resetToDefault();
      setKinielaData(fresh);
      addToast(
        'success',
        'Valores de Prueba Restablecidos',
        'Todos los datos han vuelto a su estado de fábrica predeterminado.'
      );
    } catch (err) {
      addToast('error', 'Fallo al Restablecer', 'No se pudieron restablecer los datos por defecto.');
    }
  };

  // Pantalla de carga mientras se verifica sesión
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#00063E] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-kiniela-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-300">
            Iniciando Panel de Control...
          </span>
        </div>
      </div>
    );
  }

  // Pantalla de Bloqueo si no está autenticado
  if (!isAuthenticated) {
    return (
      <>
        <AdminLogin
          onSuccess={() => {
            setIsAuthenticated(true);
            addToast('success', 'Acceso Concedido', 'Bienvenido al panel administrativo de Liga Kiniela.');
          }}
        />
        <ToastNotification toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // Si no han cargado los datos todavía
  if (!kinielaData) {
    return (
      <div className="min-h-screen bg-[#00063E] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-kiniela-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-300">
            Cargando Base de Datos Kiniela...
          </span>
        </div>
      </div>
    );
  }

  const liveMatchesCount = kinielaData.matches.filter((m) => m.status === 'EN VIVO').length;

  return (
    <div className="min-h-screen bg-[#000428] text-white flex flex-col font-poppins selection:bg-kiniela-gold selection:text-kiniela-navy">
      {/* 1. Barra Superior del Admin */}
      <AdminHeader
        source={kinielaData.source}
        onResetData={handleResetData}
        onLogout={handleLogout}
      />

      {/* 2. Barra de Navegación por Pestañas */}
      <nav className="bg-[#00063E]/95 border-b border-[#1a2785] px-4 lg:px-8 py-2 sticky top-[69px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {/* Pestaña 1: Edición y Títulos */}
          <button
            type="button"
            onClick={() => setActiveTab('edition')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap transition-all ${
              activeTab === 'edition'
                ? 'bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] text-white shadow-lg shadow-kiniela-vinotinto/30 border border-kiniela-gold/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0c186b]/60 border border-transparent'
            }`}
          >
            <Trophy className={`w-4 h-4 ${activeTab === 'edition' ? 'text-kiniela-gold' : 'text-slate-400'}`} />
            <span>🏆 Edición y Títulos</span>
          </button>

          {/* Pestaña 2: Cartelera de Partidos */}
          <button
            type="button"
            onClick={() => setActiveTab('matches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap transition-all ${
              activeTab === 'matches'
                ? 'bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] text-white shadow-lg shadow-kiniela-vinotinto/30 border border-kiniela-gold/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0c186b]/60 border border-transparent'
            }`}
          >
            <CalendarDays
              className={`w-4 h-4 ${activeTab === 'matches' ? 'text-kiniela-gold' : 'text-slate-400'}`}
            />
            <span>⚽ Cartelera de Partidos</span>
            <span
              className={`text-[11px] font-mono font-black px-2 py-0.2 rounded-full ${
                liveMatchesCount > 0
                  ? 'bg-rose-500 text-white animate-pulse'
                  : activeTab === 'matches'
                  ? 'bg-kiniela-gold text-kiniela-navy'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {liveMatchesCount > 0 ? `🔴 ${liveMatchesCount} en vivo` : kinielaData.matches.length}
            </span>
          </button>

          {/* Pestaña 3: Banner Comercial */}
          <button
            type="button"
            onClick={() => setActiveTab('banner')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap transition-all ${
              activeTab === 'banner'
                ? 'bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] text-white shadow-lg shadow-kiniela-vinotinto/30 border border-kiniela-gold/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0c186b]/60 border border-transparent'
            }`}
          >
            <Megaphone
              className={`w-4 h-4 ${activeTab === 'banner' ? 'text-kiniela-gold' : 'text-slate-400'}`}
            />
            <span>📢 Vallas Publicitarias</span>
            <span
              className={`text-[11px] font-mono font-black px-2 py-0.2 rounded-full ${
                activeTab === 'banner' ? 'bg-kiniela-gold text-kiniela-navy' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {(kinielaData.banners || []).length}
            </span>
          </button>

          {/* Pestaña 4: Salón de Campeones */}
          <button
            type="button"
            onClick={() => setActiveTab('winners')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap transition-all ${
              activeTab === 'winners'
                ? 'bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] text-white shadow-lg shadow-kiniela-vinotinto/30 border border-kiniela-gold/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0c186b]/60 border border-transparent'
            }`}
          >
            <Award className={`w-4 h-4 ${activeTab === 'winners' ? 'text-kiniela-gold' : 'text-slate-400'}`} />
            <span>🥇 Salón de Campeones</span>
            <span
              className={`text-[11px] font-mono font-black px-2 py-0.2 rounded-full ${
                activeTab === 'winners' ? 'bg-kiniela-gold text-kiniela-navy' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {kinielaData.winners.length}
            </span>
          </button>

          {/* Pestaña 5: Textos y Copys */}
          <button
            type="button"
            onClick={() => setActiveTab('copys')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap transition-all ${
              activeTab === 'copys'
                ? 'bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] text-white shadow-lg shadow-kiniela-vinotinto/30 border border-kiniela-gold/40'
                : 'text-slate-300 hover:text-white hover:bg-[#0c186b]/60 border border-transparent'
            }`}
          >
            <MessageSquareText className={`w-4 h-4 ${activeTab === 'copys' ? 'text-kiniela-gold' : 'text-slate-400'}`} />
            <span>📝 Textos y Copys</span>
          </button>
        </div>
      </nav>

      {/* 3. Contenedor Central de Contenido */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'edition' && (
          <EditionTab edition={kinielaData.edition} onSave={handleSaveEdition} />
        )}

        {activeTab === 'matches' && (
          <MatchesTab
            matches={kinielaData.matches}
            onAddMatch={handleAddMatch}
            onUpdateMatch={handleUpdateMatch}
            onDeleteMatch={handleDeleteMatch}
          />
        )}

        {activeTab === 'banner' && (
          <BannerTab
            banners={kinielaData.banners || []}
            onAddBannerSlide={handleAddBannerSlide}
            onUpdateBannerSlide={handleUpdateBannerSlide}
            onDeleteBannerSlide={handleDeleteBannerSlide}
          />
        )}

        {activeTab === 'winners' && (
          <WinnersTab
            winners={kinielaData.winners}
            onAddWinner={handleAddWinner}
            onUpdateWinner={handleUpdateWinner}
            onDeleteWinner={handleDeleteWinner}
          />
        )}

        {activeTab === 'copys' && (
          <CopysTab
            copys={kinielaData.copys}
            onUpdateCopys={handleUpdateCopys}
          />
        )}
      </main>

      {/* 4. Footer Discreto del Panel */}
      <footer className="border-t border-[#1a2785]/60 py-4 px-6 text-center text-xs text-slate-500 font-medium">
        <p>
          Liga Kiniela &copy; {new Date().getFullYear()} &bull; Panel de Control Administrativo &bull; Modo Híbrido Supabase / LocalStore
        </p>
      </footer>

      {/* Sistema de Notificaciones Flotantes (Toasts) */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

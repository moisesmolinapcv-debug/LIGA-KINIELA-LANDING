'use client';

import React, { useMemo, useState } from 'react';
import { BannerSlide } from '@/types/kiniela';
import {
  Megaphone,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  Eye,
  Layers,
  Edit3,
  Copy,
  Database,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Download,
  TriangleAlert,
  Info,
} from 'lucide-react';
import { EditBannerModal } from './EditBannerModal';
import { ConfirmDialog } from './ModalShell';
import { BannerFields, EMPTY_BANNER_FORM, validateBannerForm, type BannerFormValues } from './BannerFields';
import { BannerPreview } from './BannerPreview';
import { DESKTOP_SPEC, MOBILE_SPEC, TEMPLATE_LINKS } from './banner-specs';
import { Switch } from './Switch';
import { BTN_GHOST, BTN_ICON, BTN_PRIMARY, CARD, HELP, SPINNER } from './ui';

interface BannerTabProps {
  banners?: BannerSlide[];
  /** Cada acción devuelve true si se guardó bien (el aviso de éxito o error lo muestra la página). */
  onAddBannerSlide: (slide: Omit<BannerSlide, 'id'>) => Promise<boolean>;
  onUpdateBannerSlide: (id: string, update: Partial<BannerSlide>) => Promise<boolean>;
  onDeleteBannerSlide: (id: string) => Promise<boolean>;
  onReorderBanners: (orders: { id: string; sort_order: number }[]) => Promise<boolean>;
}

const STORAGE_SQL = `-- 1. Crear el bucket público 'banners'
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Permitir lectura pública de las imágenes
CREATE POLICY "Public Read Banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');

-- 3. Permitir subidas directas desde el panel
CREATE POLICY "Public Upload Banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');

-- 4. Permitir actualización de imágenes
CREATE POLICY "Public Update Banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners');`;

export const BannerTab: React.FC<BannerTabProps> = ({
  banners = [],
  onAddBannerSlide,
  onUpdateBannerSlide,
  onDeleteBannerSlide,
  onReorderBanners,
}) => {
  const [values, setValues] = useState<BannerFormValues>(EMPTY_BANNER_FORM);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showSafe, setShowSafe] = useState(false);
  const [previewSelectedId, setPreviewSelectedId] = useState<string | null>(null);
  const [bannerToEdit, setBannerToEdit] = useState<BannerSlide | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<BannerSlide | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showSqlHelp, setShowSqlHelp] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const ordered = useMemo(
    () => [...banners].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [banners]
  );
  const activeCount = ordered.filter((b) => b.is_active).length;
  const selectedSlide = ordered.find((b) => b.id === previewSelectedId) ?? ordered[0] ?? null;

  const errors = validateBannerForm(values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setShowErrors(true);
      return;
    }
    setIsSubmitting(true);
    try {
      const ok = await onAddBannerSlide({
        title: values.title.trim(),
        image_url: values.image_url.trim(),
        image_url_mobile: values.image_url_mobile.trim() || null,
        is_active: values.is_active,
        sort_order: (ordered[ordered.length - 1]?.sort_order || 0) + 1,
      });
      if (ok) {
        setValues(EMPTY_BANNER_FORM);
        setShowErrors(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const move = async (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target], next[index]];
    const orders = next
      .map((b, i) => ({ id: b.id, sort_order: i + 1 }))
      .filter((o) => ordered.find((b) => b.id === o.id)?.sort_order !== o.sort_order);
    setBusyId(ordered[index].id);
    try {
      await onReorderBanners(orders);
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (slide: BannerSlide, next: boolean) => {
    setBusyId(slide.id);
    try {
      await onUpdateBannerSlide(slide.id, { is_active: next });
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      const ok = await onDeleteBannerSlide(bannerToDelete.id);
      if (ok) {
        if (previewSelectedId === bannerToDelete.id) setPreviewSelectedId(null);
        setBannerToDelete(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(STORAGE_SQL);
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 2500);
    } catch {
      setSqlCopied(false);
    }
  };

  const previewSpec = previewDevice === 'mobile' ? MOBILE_SPEC : DESKTOP_SPEC;
  const previewSrc = selectedSlide
    ? previewDevice === 'mobile'
      ? selectedSlide.image_url_mobile || selectedSlide.image_url
      : selectedSlide.image_url
    : '';
  const mobileMissing = previewDevice === 'mobile' && selectedSlide && !selectedSlide.image_url_mobile;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-[#1a2785]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-rockwell">
            <Megaphone className="w-6 h-6 text-kiniela-gold" aria-hidden="true" />
            <span>Banners del inicio</span>
          </h2>
          <p className="text-sm text-slate-200 mt-1 max-w-3xl">
            La web muestra solo la imagen del banner, sin ningún texto ni botón encima. Todo lo que quieras que se lea
            (título, monto, fechas, botón dibujado) debe estar dentro de la imagen. Sube siempre dos versiones: escritorio y
            celular.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATE_LINKS.map((t) => (
            <a key={t.href} href={t.href} download={t.file} className={BTN_GHOST}>
              <Download className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              {t.label}
            </a>
          ))}
        </div>
      </div>

      {/* Ayuda técnica del almacén de imágenes */}
      <div>
        <button
          type="button"
          onClick={() => setShowSqlHelp((v) => !v)}
          aria-expanded={showSqlHelp}
          className="inline-flex items-center gap-2 min-h-[44px] px-3 rounded-xl text-sm font-bold bg-[#00063E] text-slate-200 hover:text-white border border-[#1a2785] hover:border-kiniela-gold/50 transition-colors"
        >
          <Database className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
          <span>Ayuda técnica: si las imágenes no se suben</span>
          {showSqlHelp ? <ChevronUp className="w-4 h-4" aria-hidden="true" /> : <ChevronDown className="w-4 h-4" aria-hidden="true" />}
        </button>

        {showSqlHelp && (
          <div className="mt-3 p-4 rounded-2xl bg-[#00063E] border border-kiniela-gold/40 space-y-3">
            <p className={HELP}>
              Solo para el equipo técnico: si al subir una imagen aparece que el almacén no está configurado, hay que ejecutar este código
              una sola vez en el <strong>SQL Editor</strong> de Supabase.
            </p>
            <button type="button" onClick={copySql} className={BTN_GHOST}>
              {sqlCopied ? <CheckCheck className="w-4 h-4 text-emerald-300" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              <span>{sqlCopied ? 'Código copiado' : 'Copiar el código'}</span>
            </button>
            <pre className="p-3 bg-black/60 rounded-xl border border-white/10 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">{STORAGE_SQL}</pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna izquierda: lista y formulario */}
        <div className="lg:col-span-7 space-y-6">
          <section className={`${CARD} space-y-4`} aria-labelledby="banners-list-title">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1a2785] pb-2">
              <h3 id="banners-list-title" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
                <span>Banners en rotación ({ordered.length})</span>
              </h3>
              <span className="text-sm text-slate-200">
                Activos: <strong className="text-kiniela-gold">{activeCount}</strong>
              </span>
            </div>

            {activeCount === 0 && ordered.length > 0 && (
              <p role="status" className="flex gap-2 text-sm text-amber-200">
                <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                No hay ningún banner activo: el carrusel no se muestra en la web.
              </p>
            )}
            {activeCount > 5 && (
              <p role="status" className="flex gap-2 text-sm text-amber-200">
                <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                Hay {activeCount} banners activos. Se recomiendan entre 2 y 5: si hay más, casi nadie los ve todos.
              </p>
            )}
            {activeCount === 1 && (
              <p role="status" className="flex gap-2 text-sm text-slate-200">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-kiniela-gold" aria-hidden="true" />
                Con un solo banner activo no se mueve. Lo recomendado son entre 2 y 5, que rotan solos cada 5,5 segundos.
              </p>
            )}

            {ordered.length === 0 ? (
              <p className="text-sm text-slate-200 py-4 text-center">
                Todavía no hay banners. Añade el primero con el formulario de abajo.
              </p>
            ) : (
              <ul className="space-y-3">
                {ordered.map((slide, idx) => {
                  const isSel = selectedSlide?.id === slide.id;
                  const busy = busyId === slide.id;
                  return (
                    <li
                      key={slide.id}
                      className={`p-3 rounded-xl border transition-colors ${
                        isSel ? 'bg-[#0c186b]/80 border-kiniela-gold' : 'bg-[#00063E]/80 border-[#1a2785]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => setPreviewSelectedId(slide.id)}
                          aria-pressed={isSel}
                          aria-label={`Ver en la vista previa: ${slide.title}`}
                          className="w-28 min-h-[44px] shrink-0 rounded-lg overflow-hidden border border-white/15 bg-[#000428]"
                          style={{ aspectRatio: '8 / 3' }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={slide.image_url} alt="" className="w-full h-full object-contain" loading="lazy" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-2 text-sm font-bold text-white">
                            <span className="font-mono text-xs text-kiniela-gold">#{idx + 1}</span>
                            <span className="truncate">{slide.title}</span>
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {!slide.image_url_mobile && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-950/50 text-amber-200 border border-amber-500/40">
                                <Smartphone className="w-3 h-3" aria-hidden="true" />
                                Falta la imagen de celular
                              </span>
                            )}
                            {!slide.is_active && (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-slate-700 text-slate-100 border border-slate-500">
                                Pausado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-white/10">
                        <button type="button" onClick={() => move(idx, -1)} disabled={idx === 0 || busy} aria-label={`Subir el banner ${idx + 1}`} className={BTN_ICON}>
                          <ArrowUp className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <button type="button" onClick={() => move(idx, 1)} disabled={idx === ordered.length - 1 || busy} aria-label={`Bajar el banner ${idx + 1}`} className={BTN_ICON}>
                          <ArrowDown className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <Switch
                          checked={slide.is_active}
                          onChange={(v) => toggleActive(slide, v)}
                          disabled={busy}
                          label={`Mostrar el banner ${idx + 1} en la web`}
                          showText
                        />
                        <div className="flex-1" />
                        <button type="button" onClick={() => setBannerToEdit(slide)} className={BTN_GHOST}>
                          <Edit3 className="w-4 h-4" aria-hidden="true" />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerToDelete(slide)}
                          aria-label={`Eliminar el banner ${idx + 1}`}
                          className={`${BTN_ICON} text-rose-300 hover:bg-rose-950/50`}
                        >
                          <Trash2 className="w-5 h-5" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className={HELP}>Los cambios tardan hasta ~1 minuto en verse en la web. El orden es el de la lista (el #1 se ve primero).</p>
          </section>

          {/* Añadir banner */}
          <section className={`${CARD} space-y-4`} aria-labelledby="banner-add-title">
            <h3 id="banner-add-title" className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1a2785] pb-2">
              <Plus className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              <span>Añadir un banner nuevo</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <BannerFields idPrefix="new-banner" values={values} onChange={setValues} errors={showErrors ? errors : undefined} />
              <button type="submit" disabled={isSubmitting} className={`${BTN_PRIMARY} w-full`}>
                {isSubmitting ? (
                  <>
                    <span className={SPINNER} aria-hidden="true" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
                    Añadir banner al carrusel
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Columna derecha: vista previa en proporciones reales */}
        <div className="lg:col-span-5">
          <section className={`${CARD} lg:sticky lg:top-24 space-y-4`} aria-labelledby="banner-preview-title">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1a2785] pb-3">
              <h3 id="banner-preview-title" className="text-sm font-bold uppercase tracking-wider text-kiniela-gold flex items-center gap-1.5">
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>Vista previa</span>
              </h3>
              <div className="flex items-center bg-[#000428] rounded-xl p-1 border border-[#1a2785]" role="group" aria-label="Ver como">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  aria-pressed={previewDevice === 'desktop'}
                  className={`min-h-[44px] flex items-center gap-1.5 px-3 rounded-lg text-sm font-bold transition-colors ${
                    previewDevice === 'desktop' ? 'bg-kiniela-gold text-kiniela-navy' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <Monitor className="w-4 h-4" aria-hidden="true" />
                  <span>Escritorio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  aria-pressed={previewDevice === 'mobile'}
                  className={`min-h-[44px] flex items-center gap-1.5 px-3 rounded-lg text-sm font-bold transition-colors ${
                    previewDevice === 'mobile' ? 'bg-kiniela-gold text-kiniela-navy' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" aria-hidden="true" />
                  <span>Celular</span>
                </button>
              </div>
            </div>

            {selectedSlide ? (
              <>
                <p className="text-sm text-slate-200 truncate" title={selectedSlide.title}>
                  Banner: <strong className="text-white">{selectedSlide.title}</strong>
                </p>
                <BannerPreview
                  spec={previewSpec}
                  src={previewSrc}
                  alt={selectedSlide.title}
                  showSafe={showSafe}
                  maxWidth={previewDevice === 'mobile' ? '260px' : '100%'}
                />
                <p className={HELP}>
                  Proporción real {previewSpec.ratioLabel}. La imagen se ve completa, sin recortar: si ves bordes, la imagen no tiene
                  la proporción correcta y en la web se recortaría.
                </p>
                {mobileMissing && (
                  <p role="status" className="flex gap-2 text-sm text-amber-200">
                    <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                    Este banner no tiene imagen de celular: en celulares se usará la de escritorio.
                  </p>
                )}
                <label className="flex items-center gap-2 min-h-[44px] text-sm text-slate-100 cursor-pointer">
                  <input type="checkbox" checked={showSafe} onChange={(e) => setShowSafe(e.target.checked)} className="w-5 h-5 accent-kiniela-gold" />
                  Mostrar la zona segura
                </label>
              </>
            ) : (
              <p className="text-sm text-slate-200 text-center py-6">Cuando añadas un banner lo verás aquí.</p>
            )}
          </section>
        </div>
      </div>

      <EditBannerModal
        isOpen={Boolean(bannerToEdit)}
        slide={bannerToEdit}
        onClose={() => setBannerToEdit(null)}
        onSave={onUpdateBannerSlide}
      />

      <ConfirmDialog
        open={bannerToDelete !== null}
        title="¿Eliminar este banner?"
        message={
          <>
            Se quitará del carrusel y de la lista: <strong className="text-white">{bannerToDelete?.title}</strong>. Esto no se puede deshacer. Si solo quieres
            que no se vea por ahora, mejor páusalo con el interruptor.
          </>
        }
        confirmLabel="Sí, eliminar"
        busy={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setBannerToDelete(null)}
      />
    </div>
  );
};

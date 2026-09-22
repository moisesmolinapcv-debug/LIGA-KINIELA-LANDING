'use client';

import React, { useState } from 'react';
import { Banner, BannerSlide } from '@/types/kiniela';
import {
  Megaphone,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Smartphone,
  Monitor,
  Eye,
  ArrowRight,
  Layers,
  Image as ImageIcon,
  Edit3,
  Copy,
  Database,
  HelpCircle,
  CheckCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { EditBannerModal } from './EditBannerModal';
import { ImageUploadField } from './ImageUploadField';

interface BannerTabProps {
  banner?: Banner | null;
  banners?: BannerSlide[];
  onSaveBanner?: (updated: Partial<Banner>) => Promise<void>;
  onAddBannerSlide: (slide: Omit<BannerSlide, 'id'>) => Promise<void>;
  onUpdateBannerSlide: (id: string, update: Partial<BannerSlide>) => Promise<void>;
  onDeleteBannerSlide: (id: string) => Promise<void>;
}

const PRESET_SUGGESTIONS = [
  {
    title: '¡Gran Pozo Acumulado de 1.500.000 Bs! Participa por solo 1.000 Bs',
    image_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&h=650&q=85',
    image_url_mobile: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1080&h=1250&q=85',
    button_text: 'Ver Cartelera de Partidos →',
    target_section: '#partidos',
  },
  {
    title: 'La Pasión del Fútbol: Vinotinto, Libertadores y Clásicos Europeos',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1920&h=650&q=85',
    image_url_mobile: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1080&h=1250&q=85',
    button_text: 'Consultar Premios →',
    target_section: '#premios',
  },
  {
    title: 'Salón de Campeones: Transparencia y Premios Garantizados',
    image_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&h=650&q=85',
    image_url_mobile: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1080&h=1250&q=85',
    button_text: 'Conoce los Ganadores →',
    target_section: '#campeones',
  },
];

export const BannerTab: React.FC<BannerTabProps> = ({
  banners = [],
  onAddBannerSlide,
  onUpdateBannerSlide,
  onDeleteBannerSlide,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    image_url_mobile: '',
    button_text: 'Ver Partidos de la Jornada →',
    target_section: '#partidos',
    is_active: true,
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewSelectedId, setPreviewSelectedId] = useState<string | null>(null);
  const [bannerToEdit, setBannerToEdit] = useState<BannerSlide | null>(null);
  const [showSqlHelp, setShowSqlHelp] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const selectedSlide =
    banners.find((b) => b.id === previewSelectedId) ||
    banners[0] || {
      id: 'preview',
      title: formData.title || 'Título de Muestra del Banner',
      image_url: formData.image_url || PRESET_SUGGESTIONS[0].image_url,
      image_url_mobile: formData.image_url_mobile || PRESET_SUGGESTIONS[0].image_url_mobile,
      button_text: formData.button_text || 'Ver Partidos →',
      target_section: formData.target_section || '#partidos',
      is_active: true,
      sort_order: 1,
    };

  const handleApplyPreset = (preset: typeof PRESET_SUGGESTIONS[0]) => {
    setFormData({
      title: preset.title,
      image_url: preset.image_url,
      image_url_mobile: preset.image_url_mobile,
      button_text: preset.button_text,
      target_section: preset.target_section,
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddBannerSlide({
        title: formData.title.trim() || 'Promoción Liga Kiniela',
        image_url: formData.image_url.trim() || PRESET_SUGGESTIONS[0].image_url,
        image_url_mobile: (formData.image_url_mobile || formData.image_url).trim() || PRESET_SUGGESTIONS[0].image_url_mobile,
        button_text: formData.button_text.trim() || 'Ver Partidos →',
        target_section: formData.target_section.trim() || '#partidos',
        is_active: Boolean(formData.is_active),
        sort_order: (banners.length || 0) + 1,
      });

      // Limpiar formulario
      setFormData({
        title: '',
        image_url: '',
        image_url_mobile: '',
        button_text: 'Ver Partidos de la Jornada →',
        target_section: '#partidos',
        is_active: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado descriptivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a2785]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-rockwell">
            <Megaphone className="w-6 h-6 text-kiniela-gold" />
            <span>Gestor de Vallas Publicitarias (Hero Billboard Slider)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Administra los banners rotativos estilo SellaTuParley con arte optimizado para Escritorio y Móvil.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSqlHelp(!showSqlHelp)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-kiniela-navy text-slate-300 hover:text-white border border-[#1a2785] hover:border-kiniela-gold/50 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-kiniela-gold" />
            <span>Configuración Supabase Storage</span>
            {showSqlHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0c186b]/70 text-[#FFAF3F] border border-[#FFAF3F]/40">
            <Layers className="w-3.5 h-3.5" />
            <span>{banners.length} {banners.length === 1 ? 'Banner' : 'Banners'} Activos</span>
          </span>
        </div>
      </div>

      {/* Tarjeta Desplegable con Script SQL de Configuración de Storage */}
      {showSqlHelp && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#00063E] border border-kiniela-gold/40 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-kiniela-gold" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Habilitar Bucket de Imágenes en Supabase
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                const sql = `-- 1. Crear el bucket público 'banners'\nINSERT INTO storage.buckets (id, name, public) \nVALUES ('banners', 'banners', true)\nON CONFLICT (id) DO UPDATE SET public = true;\n\n-- 2. Permitir lectura pública\nCREATE POLICY "Public Read Banners" \nON storage.objects FOR SELECT \nUSING (bucket_id = 'banners');\n\n-- 3. Permitir subidas desde el admin\nCREATE POLICY "Public Upload Banners" \nON storage.objects FOR INSERT \nWITH CHECK (bucket_id = 'banners');\n\n-- 4. Permitir actualizaciones\nCREATE POLICY "Public Update Banners" \nON storage.objects FOR UPDATE \nUSING (bucket_id = 'banners');`;
                navigator.clipboard.writeText(sql);
                setSqlCopied(true);
                setTimeout(() => setSqlCopied(false), 2500);
              }}
              className="px-3 py-1.5 rounded-lg bg-kiniela-gold text-kiniela-navy text-xs font-bold flex items-center gap-1.5 hover:bg-kiniela-gold-hover transition-colors shadow-sm"
            >
              {sqlCopied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{sqlCopied ? '¡SQL Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Para que las imágenes se guarden automáticamente en tu cuenta de Supabase en lugar de requerir URLs externas, pega y ejecuta este código en el <strong>SQL Editor</strong> de tu consola de Supabase (solo se ejecuta 1 sola vez):
          </p>

          <pre className="p-3 bg-black/60 rounded-xl border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`-- 1. Crear el bucket público 'banners'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Permitir lectura pública de las imágenes
CREATE POLICY "Public Read Banners" ON storage.objects FOR SELECT USING (bucket_id = 'banners');

-- 3. Permitir subidas directas desde el panel
CREATE POLICY "Public Upload Banners" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners');

-- 4. Permitir actualización de imágenes
CREATE POLICY "Public Update Banners" ON storage.objects FOR UPDATE USING (bucket_id = 'banners');`}
          </pre>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda (7 cols): Lista de Banners y Formulario */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Banners Registrados */}
          <div className="bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1a2785] pb-2">
              <Layers className="w-4 h-4 text-kiniela-gold" />
              <span>Banners en Rotación ({banners.length})</span>
            </h3>

            {banners.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                No hay banners registrados. Agrega uno a continuación o usa las sugerencias rápidas.
              </p>
            ) : (
              <div className="space-y-3">
                {banners.map((slide, idx) => (
                  <div
                    key={slide.id}
                    onClick={() => setPreviewSelectedId(slide.id)}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      selectedSlide.id === slide.id
                        ? 'bg-[#0c186b]/80 border-kiniela-gold shadow-md'
                        : 'bg-[#00063E]/80 border-[#1a2785] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-white/10 relative">
                        <img
                          src={slide.image_url}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-kiniela-gold font-bold">#{idx + 1}</span>
                          <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">
                            {slide.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>Botón: &quot;{slide.button_text || 'Ver Partidos'}&quot;</span>
                          <span>&bull;</span>
                          <span className="text-emerald-400 font-semibold">{slide.target_section || '#partidos'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Switch Activo */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateBannerSlide(slide.id, { is_active: !slide.is_active });
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                          slide.is_active
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {slide.is_active ? 'Activo' : 'Pausado'}
                      </button>

                      {/* Editar */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBannerToEdit(slide);
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-kiniela-gold hover:bg-kiniela-gold/10 border border-white/10 hover:border-kiniela-gold/40 transition-all flex items-center gap-1 text-xs font-bold"
                        title="Editar banner"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>

                      {/* Eliminar */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar banner "${slide.title}"?`)) {
                            onDeleteBannerSlide(slide.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="Eliminar banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario para Añadir Nuevo Banner */}
          <div className="bg-[#060e4f]/70 border border-[#1a2785] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#1a2785] pb-2">
              <Plus className="w-4 h-4 text-kiniela-gold" />
              <span>Añadir Nuevo Banner Publicitario</span>
            </h3>

            {/* Presets de 1 toque */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Plantillas Rápidas de la Marca:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_SUGGESTIONS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="text-left p-2.5 rounded-xl bg-[#00063E]/90 border border-[#1a2785] hover:border-kiniela-gold/60 text-[11px] text-slate-300 hover:text-white transition-all group"
                  >
                    <span className="font-bold text-kiniela-gold block truncate">Opción #{i + 1}</span>
                    <span className="line-clamp-1">{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Título Principal del Banner
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: ¡Gran Pozo de 1.500.000 Bs! Juega tu Kiniela"
                  className="w-full px-3.5 py-2.5 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-sm focus:outline-none focus:border-kiniela-gold font-semibold"
                />
              </div>

              {/* Imagen para Escritorio con Subida Directa */}
              <ImageUploadField
                label="Imagen para Escritorio"
                aspectRatioLabel="Panorámica 1920x650 (16:6)"
                icon={<Monitor className="w-3.5 h-3.5 text-kiniela-gold" />}
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                placeholder="https://... o selecciona una imagen de tu equipo"
                helperText="Arte horizontal visible en pantallas de computadora y tablets."
                bucketName="banners"
              />

              {/* Imagen para Móvil con Subida Directa */}
              <ImageUploadField
                label="Imagen para Móvil"
                aspectRatioLabel="Vertical 1080x1250 (4:5)"
                icon={<Smartphone className="w-3.5 h-3.5 text-kiniela-gold" />}
                value={formData.image_url_mobile}
                onChange={(url) => setFormData({ ...formData, image_url_mobile: url })}
                placeholder="Opcional: Si se deja vacío se usará la versión de escritorio"
                helperText="Permite que en celulares se muestre el arte vertical sin deformarse, idéntico a SellaTuParley."
                bucketName="banners"
              />

              {/* Botón y Destino */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Texto del Botón Sobrepuesto
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    placeholder="Ej: Ver Cartelera de Partidos →"
                    className="w-full px-3.5 py-2 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-xs focus:outline-none focus:border-kiniela-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Sección a Desplazar (Destino)
                  </label>
                  <select
                    value={formData.target_section}
                    onChange={(e) => setFormData({ ...formData, target_section: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-xs focus:outline-none focus:border-kiniela-gold font-mono"
                  >
                    <option value="#partidos">#partidos (Cartelera Deportiva)</option>
                    <option value="#premios">#premios (Pozo y Tickets)</option>
                    <option value="#campeones">#campeones (Salón de Campeones)</option>
                    <option value="#aliados">#aliados (Dónde Jugar)</option>
                    <option value="#reglas">#reglas (Reglamento y FAQ)</option>
                  </select>
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-kiniela-vinotinto to-[#9f2c52] hover:from-[#9f2c52] hover:to-kiniela-vinotinto text-white font-bold rounded-xl shadow-lg border border-kiniela-gold/40 flex items-center justify-center gap-2 uppercase tracking-wider text-xs transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 text-kiniela-gold" />
                  <span>Añadir Banner al Carrusel</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Columna Derecha (5 cols): Previsualizador Dual Interactivo (Desktop / Mobile) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#060e4f]/80 border border-[#1a2785] rounded-2xl p-5 sticky top-24 space-y-4">
            
            {/* Header del Previsualizador con Conmutador de Dispositivo */}
            <div className="flex items-center justify-between border-b border-[#1a2785] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-kiniela-gold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Simulador Responsivo</span>
              </span>

              {/* Conmutador Escritorio vs Móvil */}
              <div className="flex items-center bg-[#000428] rounded-xl p-1 border border-[#1a2785]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'desktop'
                      ? 'bg-kiniela-gold text-kiniela-navy shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>PC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewDevice === 'mobile'
                      ? 'bg-kiniela-gold text-kiniela-navy shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Móvil</span>
                </button>
              </div>
            </div>

            {/* Marco de Simulación según Dispositivo */}
            <div className="flex items-center justify-center py-2">
              <div
                className={`transition-all duration-300 w-full overflow-hidden border-2 border-kiniela-gold/40 shadow-2xl relative rounded-2xl bg-[#000428] ${
                  previewDevice === 'mobile'
                    ? 'max-w-[270px] aspect-[4/5]'
                    : 'max-w-full aspect-[16/8]'
                }`}
              >
                {/* Imagen según dispositivo seleccionado */}
                <img
                  src={
                    previewDevice === 'mobile'
                      ? selectedSlide.image_url_mobile || selectedSlide.image_url
                      : selectedSlide.image_url
                  }
                  alt={selectedSlide.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* Viñeta degradada */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#00063E]/95 via-[#00063E]/30 to-transparent pointer-events-none" />

                {/* Contenido sobrepuesto simulado */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10 pointer-events-none">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#00063E]/80 border border-kiniela-gold/50 text-kiniela-gold text-[9px] font-black uppercase">
                      Promoción Oficial
                    </span>
                    <span className="text-[9px] font-mono text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                      {previewDevice === 'mobile' ? '4:5 Móvil' : 'Panorámica'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-black text-white uppercase font-rockwell leading-tight drop-shadow-md">
                      {selectedSlide.title}
                    </h4>

                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-kiniela-gold to-[#ff9e1f] text-[#00063E] font-black text-[10px] uppercase shadow-md">
                      <span>{selectedSlide.button_text || 'Ver Partidos →'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Puntos de paginación simulados */}
                <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1 z-20">
                  <span className="w-4 h-1.5 rounded-full bg-kiniela-gold shadow-[0_0_6px_#FFAF3F]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                </div>
              </div>
            </div>

            <div className="bg-[#00063E]/60 border border-[#1a2785] rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
              <span className="text-kiniela-gold font-bold block flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Garantía Responsiva:
              </span>
              <p>
                Al configurar la <strong>Imagen para Móvil</strong>, el arte vertical se adaptará sin deformaciones ni cortes en teléfonos, ofreciendo una experiencia inmersiva idéntica a SellaTuParley.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Modal para Editar Banner */}
      <EditBannerModal
        isOpen={Boolean(bannerToEdit)}
        slide={bannerToEdit}
        onClose={() => setBannerToEdit(null)}
        onSave={async (id, update) => {
          await onUpdateBannerSlide(id, update);
        }}
      />
    </div>
  );
};

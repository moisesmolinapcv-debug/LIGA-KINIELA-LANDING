'use client';

import React, { useState, useEffect } from 'react';
import { BannerSlide } from '@/types/kiniela';
import { X, Save, Image as ImageIcon, Monitor, Smartphone } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface EditBannerModalProps {
  isOpen: boolean;
  slide: BannerSlide | null;
  onClose: () => void;
  onSave: (id: string, update: Partial<BannerSlide>) => Promise<void>;
}

export const EditBannerModal: React.FC<EditBannerModalProps> = ({
  isOpen,
  slide,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    image_url_mobile: '',
    button_text: '',
    target_section: '#partidos',
    sort_order: 1,
    is_active: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title || '',
        image_url: slide.image_url || '',
        image_url_mobile: slide.image_url_mobile || '',
        button_text: slide.button_text || 'Ver Partidos →',
        target_section: slide.target_section || '#partidos',
        sort_order: slide.sort_order || 1,
        is_active: Boolean(slide.is_active),
      });
    }
  }, [slide]);

  if (!isOpen || !slide) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(slide.id, {
        title: formData.title.trim() || 'Promoción Liga Kiniela',
        image_url: formData.image_url.trim() || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1920&h=650&q=85',
        image_url_mobile: formData.image_url_mobile.trim() || formData.image_url.trim(),
        button_text: formData.button_text.trim() || 'Ver Partidos →',
        target_section: formData.target_section.trim() || '#partidos',
        sort_order: Number(formData.sort_order) || 1,
        is_active: formData.is_active,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-kiniela-navy-card rounded-2xl border border-kiniela-gold/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-kiniela-navy-deep">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-kiniela-gold" />
              <span>Editar Valla Publicitaria</span>
            </h3>
            <p className="text-xs text-slate-400">
              Slide #{slide.sort_order}: {slide.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Título Principal del Banner
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-sm focus:border-kiniela-gold outline-none"
              placeholder="Ej. ¡Gran Pozo Acumulado de 1.500.000 Bs!"
            />
          </div>

          {/* Imagen Escritorio */}
          <ImageUploadField
            label="Imagen Escritorio / PC"
            aspectRatioLabel="Panorámica 1920x650 (16:6)"
            icon={<Monitor className="w-3.5 h-3.5 text-kiniela-gold" />}
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            placeholder="https://... o sube una imagen"
            helperText="Arte horizontal para computadoras y pantallas grandes."
            bucketName="banners"
          />

          {/* Imagen Móvil */}
          <ImageUploadField
            label="Imagen Móvil / Smartphone"
            aspectRatioLabel="Vertical 1080x1250 (4:5)"
            icon={<Smartphone className="w-3.5 h-3.5 text-kiniela-gold" />}
            value={formData.image_url_mobile}
            onChange={(url) => setFormData({ ...formData, image_url_mobile: url })}
            placeholder="Opcional: Si se deja vacío se usará la de escritorio"
            helperText="Arte vertical adaptado para pantallas de teléfonos."
            bucketName="banners"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Texto del Botón CTA
              </label>
              <input
                type="text"
                value={formData.button_text}
                onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs focus:border-kiniela-gold outline-none"
                placeholder="Ver Partidos →"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Sección Destino
              </label>
              <select
                value={formData.target_section}
                onChange={(e) => setFormData({ ...formData, target_section: e.target.value })}
                className="w-full px-2 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs outline-none"
              >
                <option value="#partidos">#partidos (Cartelera)</option>
                <option value="#premios">#premios (Pozo & Precio)</option>
                <option value="#campeones">#campeones (Salón)</option>
                <option value="#aliados">#aliados (Dónde Jugar)</option>
                <option value="#reglas">#reglas (Reglamento)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Orden de Despliegue
              </label>
              <input
                type="number"
                min="1"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-3 py-2 rounded-xl bg-kiniela-navy border border-white/15 text-white text-xs font-mono text-center outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="edit_banner_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-kiniela-gold accent-kiniela-gold cursor-pointer"
            />
            <label htmlFor="edit_banner_active" className="text-xs text-slate-300 cursor-pointer select-none">
              Banner Activo en la Cartelera Pública
            </label>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-kiniela-gold to-kiniela-gold-hover text-kiniela-navy font-black text-xs uppercase tracking-wider shadow-brand-gold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

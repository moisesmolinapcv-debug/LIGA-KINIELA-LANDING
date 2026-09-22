'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw, X, Link as LinkIcon } from 'lucide-react';
import { uploadMediaFile } from '@/lib/storage';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  helperText?: string;
  icon?: React.ReactNode;
  bucketName?: string;
  aspectRatioLabel?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://... o sube una imagen',
  helperText,
  icon,
  bucketName = 'banners',
  aspectRatioLabel,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await uploadMediaFile(file, bucketName);
      if (result.url) {
        onChange(result.url);
        if (result.error) {
          setUploadError(result.error);
        }
      } else if (result.error) {
        setUploadError(result.error);
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Error al procesar el archivo seleccionado.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      {/* Etiqueta y Controles */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          {icon || <ImageIcon className="w-3.5 h-3.5 text-kiniela-gold" />}
          <span>{label}</span>
          {aspectRatioLabel && (
            <span className="text-[10px] lowercase font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {aspectRatioLabel}
            </span>
          )}
        </label>

        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-slate-400 hover:text-kiniela-gold flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualInput ? 'Ocultar URL manual' : 'Escribir URL manual'}</span>
        </button>
      </div>

      {/* Input de archivo nativo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Zona de Subida y Previsualización */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-[#1a2785] bg-[#00063E] p-2 flex items-center gap-3">
          {/* Miniatura */}
          <div className="w-20 h-14 sm:w-28 sm:h-16 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0 relative">
            <img
              src={value}
              alt="Previsualización"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Si la imagen falla en cargar
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Información y Acciones */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-0.5">
              <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Imagen vinculada con éxito</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 truncate max-w-[280px] sm:max-w-md">
              {value}
            </p>
          </div>

          {/* Botones de Cambio y Eliminación */}
          <div className="flex items-center gap-1.5 flex-shrink-0 pr-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-2.5 py-1.5 rounded-lg bg-kiniela-navy text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 border border-white/10 transition-colors flex items-center gap-1"
              title="Cambiar imagen"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Cambiar</span>
            </button>

            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Quitar imagen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Zona Drag & Drop cuando no hay imagen */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-kiniela-gold bg-kiniela-gold/10 scale-[1.01]'
              : 'border-[#1a2785] hover:border-kiniela-gold/60 bg-[#00063E]/60 hover:bg-[#00063E]'
          }`}
        >
          {isUploading ? (
            <div className="py-2 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 text-kiniela-gold animate-spin" />
              <span className="text-xs font-bold text-white">Subiendo imagen a Supabase Storage...</span>
              <span className="text-[10px] text-slate-400">Optimizando y generando enlace CDN</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-kiniela-vinotinto/30 border border-kiniela-gold/40 flex items-center justify-center text-kiniela-gold">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Haz clic para examinar o arrastra tu archivo aquí
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Formatos compatibles: .PNG, .JPG, .JPEG, .WEBP o .SVG (hasta 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Input manual opcional */}
      {showManualInput && (
        <div className="pt-1 animate-fadeIn">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2 bg-[#00063E] border border-[#1a2785] rounded-xl text-white text-xs font-mono focus:outline-none focus:border-kiniela-gold"
          />
        </div>
      )}

      {/* Mensaje de error o notificación si aplica */}
      {uploadError && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-tight">{uploadError}</p>
        </div>
      )}

      {/* Texto de ayuda */}
      {helperText && <p className="text-[10px] text-slate-400 leading-tight">{helperText}</p>}
    </div>
  );
};

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, RefreshCw, X, Link as LinkIcon, Download, TriangleAlert } from 'lucide-react';
import {
  ALLOWED_IMAGE_LABEL,
  ALLOWED_IMAGE_TYPES,
  uploadMediaFile,
  validateImageFile,
} from '@/lib/storage';
import { BannerPreview } from './BannerPreview';
import { checkImageDims, formatKb, TEMPLATE_LINKS, type BannerSpec } from './banner-specs';
import { BTN_GHOST, BTN_PRIMARY, INPUT, SPINNER } from './ui';

interface ImageUploadFieldProps {
  spec: BannerSpec;
  value: string;
  onChange: (url: string) => void;
  /** Si la imagen es opcional se explica qué pasa cuando falta. */
  optionalHint?: string;
  bucketName?: string;
  /** Prefijo para los id (varios campos en la misma pantalla). */
  idPrefix: string;
}

interface Dims {
  w: number;
  h: number;
}

function readDimsFromUrl(url: string): Promise<Dims | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

interface Pending {
  file: File;
  previewUrl: string;
  dims: Dims | null;
  warnings: string[];
}

/**
 * Campo de imagen de banner: muestra las medidas oficiales, revisa tipo, peso y proporción
 * al elegir el archivo (advierte, no bloquea) y sube a Supabase Storage solo cuando se confirma.
 */
export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  spec,
  value,
  onChange,
  optionalHint,
  bucketName = 'banners',
  idPrefix,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showSafe, setShowSafe] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [dims, setDims] = useState<Dims | null>(null);
  const [broken, setBroken] = useState(false);
  const [bytes, setBytes] = useState<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedBytes = useRef<{ url: string; bytes: number } | null>(null);
  const template = TEMPLATE_LINKS[spec.key === 'desktop' ? 0 : 1];

  // Mide la imagen vinculada (y su peso si el servidor lo permite) para avisar si no coincide con la medida
  useEffect(() => {
    let alive = true;
    setDims(null);
    setBroken(false);
    setBytes(undefined);
    if (!value) return;
    readDimsFromUrl(value).then((d) => {
      if (!alive) return;
      if (d) setDims(d);
      else setBroken(true);
    });
    if (uploadedBytes.current?.url === value) {
      setBytes(uploadedBytes.current.bytes);
    } else if (/^https?:\/\/[^/]+\/storage\/v1\/object\/public\//.test(value)) {
      // Solo imágenes de nuestro almacén (otros sitios suelen bloquear la consulta del peso)
      fetch(value, { method: 'HEAD' })
        .then((r) => {
          const len = Number(r.headers.get('content-length'));
          if (alive && Number.isFinite(len) && len > 0) setBytes(len);
        })
        .catch(() => undefined);
    }
    return () => {
      alive = false;
    };
  }, [value]);

  useEffect(() => {
    return () => {
      if (pending) URL.revokeObjectURL(pending.previewUrl);
    };
  }, [pending]);

  const doUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const result = await uploadMediaFile(file, bucketName);
      if (result.url) {
        uploadedBytes.current = { url: result.url, bytes: file.size };
        onChange(result.url);
      } else {
        setUploadError(result.error || 'No se pudo subir la imagen.');
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'No se pudo subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    const invalid = validateImageFile(file);
    if (invalid) {
      setUploadError(invalid);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const d = await readDimsFromUrl(previewUrl);
    if (!d) {
      URL.revokeObjectURL(previewUrl);
      setUploadError('No se pudo leer la imagen. Prueba con otro archivo.');
      return;
    }
    const check = checkImageDims(spec, d.w, d.h, file.size);
    if (check.level === 'ok') {
      URL.revokeObjectURL(previewUrl);
      await doUpload(file);
    } else {
      // Se advierte antes de subir: no se bloquea, pero tampoco se sube nada sin que se vea el aviso
      setPending({ file, previewUrl, dims: d, warnings: check.messages });
    }
  };

  const confirmPending = async () => {
    if (!pending) return;
    const file = pending.file;
    setPending(null);
    await doUpload(file);
  };

  const check = dims ? checkImageDims(spec, dims.w, dims.h, bytes) : null;
  const fieldId = `${idPrefix}-file`;

  return (
    <div className="rounded-2xl border border-[#1a2785] bg-[#00063E]/50 p-4 space-y-3">
      {/* Medidas oficiales, siempre visibles */}
      <div>
        <p className="text-sm font-bold text-white">{spec.label}</p>
        <ul className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-slate-200">
          <li>Se ve en: {spec.where}</li>
          <li>Proporción: {spec.ratioLabel}</li>
          <li>Peso máximo recomendado: {spec.maxKb} KB</li>
          <li>Formato: {ALLOWED_IMAGE_LABEL} (no GIF)</li>
          <li className="sm:col-span-2">
            Zona segura (textos y logos dentro): {spec.safe.side} px a cada lado, {spec.safe.top} px arriba y {spec.safe.bottom} px abajo.
          </li>
        </ul>
        <a
          href={template.href}
          download={template.file}
          className="mt-1 inline-flex items-center gap-1.5 min-h-[44px] text-xs font-bold text-kiniela-gold hover:underline"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Descargar la plantilla para diseñar encima
        </a>
        {optionalHint && <p className="text-xs text-amber-200 mt-0.5">{optionalHint}</p>}
      </div>

      <input
        id={fieldId}
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-label={`Elegir archivo: ${spec.label}`}
        onChange={(e) => {
          void handleFileSelect(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {/* Aviso antes de subir */}
      {pending && (
        <div role="alert" className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-3 space-y-3">
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pending.previewUrl} alt="Vista previa de la imagen elegida" className="w-24 h-16 object-contain rounded bg-[#000428] border border-white/10 shrink-0" />
            <div className="text-sm text-amber-100 space-y-1 min-w-0">
              <p className="font-bold flex items-center gap-1.5">
                <TriangleAlert className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                Revisa esta imagen antes de subirla
              </p>
              <p className="text-xs text-amber-200 truncate">
                {pending.file.name} · {pending.dims ? `${pending.dims.w} × ${pending.dims.h} px` : ''} · {formatKb(pending.file.size)}
              </p>
            </div>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-sm text-amber-100">
            {pending.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
          <p className="text-xs text-amber-200">Puedes subirla igual, pero lo mejor es usar las medidas indicadas.</p>
          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <button type="button" onClick={() => setPending(null)} className={BTN_GHOST}>
              Elegir otra imagen
            </button>
            <button type="button" onClick={confirmPending} className={BTN_PRIMARY}>
              <UploadCloud className="w-4 h-4 text-kiniela-gold" aria-hidden="true" />
              Subir de todas formas
            </button>
          </div>
        </div>
      )}

      {/* Imagen vinculada o zona de subida */}
      {!pending && value ? (
        <div className="space-y-3">
          <BannerPreview spec={spec} src={value} alt={`Vista previa: ${spec.label}`} showSafe={showSafe} maxWidth={spec.key === 'desktop' ? '480px' : '200px'} />

          <label className="flex items-center gap-2 min-h-[44px] text-sm text-slate-100 cursor-pointer">
            <input type="checkbox" checked={showSafe} onChange={(e) => setShowSafe(e.target.checked)} className="w-5 h-5 accent-kiniela-gold" />
            Mostrar la zona segura sobre la imagen
          </label>

          {broken ? (
            <p role="alert" className="flex gap-2 text-sm text-rose-200">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              No se pudo cargar esta imagen. Revisa la dirección o sube otro archivo.
            </p>
          ) : check ? (
            check.level === 'ok' ? (
              <p className="flex gap-2 text-sm text-emerald-300">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                Medidas correctas: {dims!.w} × {dims!.h} px{bytes ? ` · ${formatKb(bytes)}` : ''}
              </p>
            ) : (
              <ul className="space-y-1" role="status">
                {check.messages.map((m, i) => (
                  <li key={i} className="flex gap-2 text-sm text-amber-200">
                    <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            )
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className={BTN_GHOST}>
              {isUploading ? <span className={SPINNER} aria-hidden="true" /> : <RefreshCw className="w-4 h-4" aria-hidden="true" />}
              {isUploading ? 'Subiendo...' : 'Cambiar imagen'}
            </button>
            <button type="button" onClick={() => onChange('')} disabled={isUploading} className={BTN_GHOST}>
              <X className="w-4 h-4" aria-hidden="true" />
              Quitar imagen
            </button>
          </div>
        </div>
      ) : !pending ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Elegir o soltar un archivo. ${spec.label}`}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            void handleFileSelect(e.dataTransfer.files?.[0]);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 min-h-[132px] ${
            isDragging ? 'border-kiniela-gold bg-kiniela-gold/10' : 'border-[#2a3aa8] hover:border-kiniela-gold/60 bg-[#00063E]/60'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2" role="status">
              <RefreshCw className="w-6 h-6 text-kiniela-gold animate-spin" aria-hidden="true" />
              <span className="text-sm font-bold text-white">Subiendo la imagen...</span>
            </div>
          ) : (
            <>
              <span className="w-10 h-10 rounded-full bg-kiniela-vinotinto/30 border border-kiniela-gold/40 flex items-center justify-center text-kiniela-gold">
                <UploadCloud className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-white">Toca para elegir una imagen o arrástrala aquí</span>
              <span className="text-xs text-slate-300">{ALLOWED_IMAGE_LABEL} · hasta 5 MB (lo ideal: menos de {spec.maxKb} KB)</span>
            </>
          )}
        </div>
      ) : null}

      {/* Dirección manual */}
      <div>
        <button
          type="button"
          onClick={() => setShowManual((v) => !v)}
          aria-expanded={showManual}
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-kiniela-gold"
        >
          <LinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
          {showManual ? 'Ocultar la dirección de la imagen' : 'Pegar la dirección (URL) de una imagen ya publicada'}
        </button>
        {showManual && (
          <input
            id={`${idPrefix}-url`}
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value.trim())}
            aria-label={`Dirección (URL) de la imagen: ${spec.label}`}
            placeholder="https://..."
            className={`${INPUT} font-mono text-xs mt-1`}
          />
        )}
      </div>

      {uploadError && (
        <div role="alert" className="flex items-start gap-2 p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-100 text-sm">
          <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{uploadError}</p>
        </div>
      )}
    </div>
  );
};

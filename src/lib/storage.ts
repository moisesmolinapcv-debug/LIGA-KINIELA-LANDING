import { getSupabase, isSupabaseConfigured } from './kiniela-store';

export interface UploadResult {
  url: string | null;
  error: string | null;
  /** Se conserva por compatibilidad: ya no se hacen cargas "provisionales" en Base64. */
  isFallback?: boolean;
}

/** Tipos de imagen permitidos en el panel (sin GIF ni SVG: ver docs/GUIA-BANNERS.md). */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_LABEL = 'JPG, PNG o WebP';

/** Peso máximo permitido al subir. El recomendado (300 KB / 250 KB) solo genera una advertencia. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Valida tipo y peso máximo. Devuelve un mensaje claro o null si el archivo es aceptable. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Este archivo no es una imagen permitida. Usa ${ALLOWED_IMAGE_LABEL} (no se aceptan GIF ni SVG).`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1).replace('.', ',');
    return `La imagen pesa ${mb} MB y el máximo es 5 MB. Comprímela antes de subirla (lo ideal es menos de 300 KB).`;
  }
  return null;
}

/** Traduce los errores técnicos de Supabase Storage a un mensaje para una persona no técnica. */
function explainStorageError(message: string | undefined): string {
  const m = (message || '').toLowerCase();
  if (m.includes('bucket not found')) {
    return 'El almacén de imágenes todavía no está creado en la base de datos. Avisa al equipo técnico (hay una ayuda en la pestaña Banners).';
  }
  if (m.includes('row-level security') || m.includes('policy') || m.includes('unauthorized') || m.includes('not authorized')) {
    return 'La base de datos no permite subir imágenes todavía. Avisa al equipo técnico (hay una ayuda en la pestaña Banners).';
  }
  if (m.includes('failed to fetch') || m.includes('network') || m.includes('timeout')) {
    return 'No hay conexión con el almacén de imágenes. Revisa tu internet e inténtalo de nuevo.';
  }
  if (m.includes('exceeded') || m.includes('too large') || m.includes('payload')) {
    return 'La imagen es demasiado pesada para el almacén. Comprímela e inténtalo de nuevo.';
  }
  return 'No se pudo subir la imagen' + (message ? ` (${message})` : '') + '.';
}

/**
 * Sube un archivo de imagen al bucket de Supabase Storage y devuelve su URL pública.
 * Si la subida falla NO se guarda nada: antes se metía la imagen entera (Base64) en la base
 * de datos y eso volvía lentas la landing y el panel.
 */
export async function uploadMediaFile(
  file: File,
  bucketName: string = 'banners'
): Promise<UploadResult> {
  const invalid = validateImageFile(file);
  if (invalid) return { url: null, error: invalid };

  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured()) {
    return {
      url: null,
      error: 'No hay conexión con la base de datos, así que no se puede subir la imagen. Puedes pegar la dirección (URL) de una imagen ya publicada.',
    };
  }

  try {
    // Nombre sin caracteres raros ni acentos
    const cleanFileName = file.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');

    const uniquePath = `${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage.from(bucketName).upload(uniquePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

    if (error || !data) {
      console.warn('[Storage] Error al subir a Supabase Storage:', error);
      return { url: null, error: explainStorageError(error?.message) };
    }

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(uniquePath);
    if (!urlData?.publicUrl) {
      return { url: null, error: 'La imagen se subió, pero no se pudo obtener su dirección. Inténtalo de nuevo.' };
    }
    return { url: urlData.publicUrl, error: null, isFallback: false };
  } catch (err) {
    console.error('[Storage] Excepción durante la subida:', err);
    const message = err instanceof Error ? err.message : undefined;
    return { url: null, error: explainStorageError(message) };
  }
}

/**
 * Convierte un archivo local a Data URL Base64 (solo para vistas previas locales).
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

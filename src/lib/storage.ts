import { getSupabase, isSupabaseConfigured } from './kiniela-store';

export interface UploadResult {
  url: string | null;
  error: string | null;
  isFallback?: boolean;
}

/**
 * Sube un archivo de imagen al bucket de Supabase Storage.
 * Si el bucket aún no existe o hay problemas de RLS, provee un fallback
 * en formato Base64 para que el usuario no quede bloqueado en su sesión.
 */
export async function uploadMediaFile(
  file: File,
  bucketName: string = 'banners'
): Promise<UploadResult> {
  // Validación básica de tipo de archivo
  if (!file.type.startsWith('image/')) {
    return {
      url: null,
      error: 'El archivo seleccionado no es una imagen válida (debe ser PNG, JPG, JPEG, WEBP o SVG).',
    };
  }

  // Límite de tamaño: 10 MB
  const maxBytes = 10 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      url: null,
      error: 'La imagen excede el tamaño máximo permitido de 10 MB. Por favor optimiza el archivo.',
    };
  }

  const supabase = getSupabase();

  // Si Supabase está disponible, intentamos subir al storage en la nube
  if (supabase && isSupabaseConfigured()) {
    try {
      // Sanitizar el nombre del archivo eliminando caracteres especiales
      const cleanFileName = file.name
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, '-')
        .replace(/-+/g, '-');
      
      const uniquePath = `${Date.now()}_${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(uniquePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (!error && data) {
        // Obtener la URL pública oficial servida por Supabase CDN
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(uniquePath);

        if (urlData?.publicUrl) {
          return {
            url: urlData.publicUrl,
            error: null,
            isFallback: false,
          };
        }
      }

      console.warn('[Storage] Error al subir a Supabase Storage:', error);
      // Si el bucket no está creado o falta política RLS, notificamos y aplicamos fallback Base64
      const fallbackUrl = await fileToBase64(file);
      return {
        url: fallbackUrl,
        error: `Supabase Storage: ${error?.message || 'Bucket no configurado aún'}. Se aplicó carga local provisional. Recuerda ejecutar el script SQL en Supabase para habilitar el bucket público.`,
        isFallback: true,
      };
    } catch (err: any) {
      console.error('[Storage] Excepción durante la subida:', err);
      const fallbackUrl = await fileToBase64(file);
      return {
        url: fallbackUrl,
        error: err?.message || 'Error de conexión con Supabase Storage. Se aplicó carga provisional.',
        isFallback: true,
      };
    }
  }

  // Fallback cuando Supabase no está conectado
  try {
    const fallbackUrl = await fileToBase64(file);
    return {
      url: fallbackUrl,
      error: null,
      isFallback: true,
    };
  } catch {
    return {
      url: null,
      error: 'No se pudo procesar la imagen seleccionada.',
    };
  }
}

/**
 * Convierte un archivo local a Data URL Base64 para vista previa o contingencia.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

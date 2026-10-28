// Medidas oficiales de los banners (docs/GUIA-BANNERS.md). La web no escribe nada encima de la imagen.

export interface BannerSpec {
  key: 'desktop' | 'mobile';
  /** Texto del campo, con las medidas. */
  label: string;
  width: number;
  height: number;
  ratioLabel: string;
  /** Peso máximo recomendado, en KB. */
  maxKb: number;
  /** Margen de la zona segura, en px de la imagen original. */
  safe: { side: number; top: number; bottom: number };
  where: string;
}

export const DESKTOP_SPEC: BannerSpec = {
  key: 'desktop',
  label: 'Imagen de escritorio y tablet (1920 × 720 px)',
  width: 1920,
  height: 720,
  ratioLabel: '8:3 (horizontal)',
  maxKb: 300,
  safe: { side: 120, top: 56, bottom: 72 },
  where: 'Tablets, laptops y PC (pantallas de 768 px o más)',
};

export const MOBILE_SPEC: BannerSpec = {
  key: 'mobile',
  label: 'Imagen de celular (1080 × 1350 px)',
  width: 1080,
  height: 1350,
  ratioLabel: '4:5 (vertical)',
  maxKb: 250,
  safe: { side: 72, top: 72, bottom: 110 },
  where: 'Celulares (pantallas de menos de 768 px)',
};

export const TEMPLATE_LINKS = [
  { href: '/plantillas-banner/plantilla-escritorio-1920x720.png', label: 'Plantilla de escritorio (1920 × 720)', file: 'plantilla-escritorio-1920x720.png' },
  { href: '/plantillas-banner/plantilla-movil-1080x1350.png', label: 'Plantilla de celular (1080 × 1350)', file: 'plantilla-movil-1080x1350.png' },
];

/** Resultado de revisar una imagen contra su medida oficial. */
export interface ImageCheck {
  level: 'ok' | 'warn';
  messages: string[];
}

/** La proporción se considera correcta con hasta 2 % de diferencia. */
export function checkImageDims(spec: BannerSpec, w: number, h: number, bytes?: number): ImageCheck {
  const messages: string[] = [];
  const target = spec.width / spec.height;
  const ratio = w / h;
  const ratioOk = Math.abs(ratio - target) / target <= 0.02;

  if (!ratioOk) {
    messages.push(
      `Mide ${w} × ${h} px y no tiene la proporción ${spec.ratioLabel}. En la web se recortará o se verá con bordes. Lo correcto es ${spec.width} × ${spec.height} px.`
    );
  } else if (w < spec.width * 0.75) {
    messages.push(`Mide ${w} × ${h} px: tiene la proporción correcta, pero es más pequeña que ${spec.width} × ${spec.height} px y puede verse borrosa.`);
  }
  if (bytes !== undefined && bytes > spec.maxKb * 1024) {
    messages.push(
      `Pesa ${Math.round(bytes / 1024)} KB y lo recomendado es ${spec.maxKb} KB como máximo. Si es muy pesada, carga lento con datos móviles.`
    );
  }
  return { level: messages.length ? 'warn' : 'ok', messages };
}

export const formatKb = (bytes: number): string => `${Math.round(bytes / 1024)} KB`;

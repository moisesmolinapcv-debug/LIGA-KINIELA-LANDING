// Reglas del formulario de contacto, compartidas por el navegador (aviso inmediato) y el servidor (decisión final).
// El servidor nunca confía en la validación del navegador: vuelve a aplicar todo esto en /api/contacto.

export const MOTIVOS = [
  { value: 'consulta', label: 'Consulta general' },
  { value: 'error', label: 'Reportar un error' },
  { value: 'comercial', label: 'Aliados y comercial' },
  { value: 'otro', label: 'Otro' },
] as const;

export type Motivo = (typeof MOTIVOS)[number]['value'];

export const LIMITES = {
  nombreMin: 2,
  nombreMax: 80,
  correoMax: 254,
  mensajeMin: 10,
  mensajeMax: 2000,
  /** Un humano tarda más que esto en llenar el formulario; un bot suele enviarlo al instante. */
  tiempoMinimoMs: 3000,
} as const;

export interface ContactoPayload {
  nombre: string;
  correo: string;
  motivo: Motivo;
  mensaje: string;
}

export type ContactoErrores = Partial<Record<keyof ContactoPayload, string>>;

// Formato práctico (no RFC completo): algo@dominio.tld, sin espacios.
const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Quita caracteres de control y espacios sobrantes. En campos de una línea también quita los saltos de línea. */
export function limpiar(valor: unknown, multilinea = false): string {
  if (typeof valor !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  const sinControl = multilinea ? valor.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') : valor.replace(/[\u0000-\u001F\u007F]/g, ' ');
  return multilinea ? sinControl.replace(/\r\n?/g, '\n').trim() : sinControl.replace(/\s+/g, ' ').trim();
}

export function validarContacto(entrada: Record<string, unknown>): { datos: ContactoPayload; errores: ContactoErrores } {
  const datos: ContactoPayload = {
    nombre: limpiar(entrada.nombre),
    correo: limpiar(entrada.correo).toLowerCase(),
    motivo: (MOTIVOS.some((m) => m.value === entrada.motivo) ? entrada.motivo : '') as Motivo,
    mensaje: limpiar(entrada.mensaje, true),
  };

  const errores: ContactoErrores = {};
  if (datos.nombre.length < LIMITES.nombreMin) errores.nombre = 'Escribe tu nombre.';
  else if (datos.nombre.length > LIMITES.nombreMax) errores.nombre = `Máximo ${LIMITES.nombreMax} caracteres.`;

  if (!datos.correo) errores.correo = 'Escribe tu correo para poder responderte.';
  else if (datos.correo.length > LIMITES.correoMax || !CORREO_RE.test(datos.correo)) errores.correo = 'Revisa el correo: parece incompleto.';

  if (!datos.motivo) errores.motivo = 'Elige un motivo.';

  if (datos.mensaje.length < LIMITES.mensajeMin) errores.mensaje = `Cuéntanos un poco más (mínimo ${LIMITES.mensajeMin} caracteres).`;
  else if (datos.mensaje.length > LIMITES.mensajeMax) errores.mensaje = `Máximo ${LIMITES.mensajeMax} caracteres.`;

  return { datos, errores };
}

export function etiquetaMotivo(motivo: Motivo): string {
  return MOTIVOS.find((m) => m.value === motivo)?.label ?? 'Otro';
}

/** Respuesta de /api/contacto. */
export type ContactoRespuesta =
  | { ok: true }
  | { ok: false; error: 'validacion'; errores: ContactoErrores }
  | { ok: false; error: 'captcha' | 'demasiados_intentos' | 'no_configurado' | 'envio_fallido' | 'solicitud_invalida' };

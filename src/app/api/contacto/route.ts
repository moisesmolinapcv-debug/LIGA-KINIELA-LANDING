// POST /api/contacto
// Recibe el formulario de contacto, comprueba que no sea un bot y lo envía por SMTP2GO a contacto@ligakiniela.com.ve.
// (Se cambió de Mailgun a SMTP2GO el 20-nov-2026: Mailgun suspendió la cuenta al activarla. Decisión Q23.)
//
// Orden de defensas (de la más barata a la más cara), para no gastar envíos en bots:
//   1. Tamaño y formato de la solicitud.
//   2. Campo trampa (honeypot) y tiempo mínimo de llenado.
//   3. Límite de intentos por IP (en memoria; apoyo, no garantía en serverless).
//   4. Validación de los campos (src/lib/contacto/schema.ts).
//   5. Cloudflare Turnstile, verificado aquí con la clave secreta.
//   6. Recién entonces, el envío por SMTP2GO.
//
// Variables de entorno (ver .env.example y docs/CONTACTO-configuracion.md):
//   SMTP2GO_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, TURNSTILE_SECRET_KEY

import { NextResponse } from 'next/server';
import { CONTACTO } from '@/content/contacto';
import { LIMITES, etiquetaMotivo, validarContacto } from '@/lib/contacto/schema';
import type { ContactoPayload, ContactoRespuesta } from '@/lib/contacto/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ES_DESARROLLO = process.env.NODE_ENV === 'development';
const MAX_BYTES = 16_000;
const TIMEOUT_MS = 8_000;

// Clave secreta de PRUEBA publicada por Cloudflare (siempre aprueba). Solo se usa en desarrollo local sin claves.
const TURNSTILE_SECRETO_PRUEBA = '1x0000000000000000000000000000000AA';

/* ---------------------------- Límite por IP ---------------------------- */

const VENTANA_MS = 10 * 60_000;
const MAX_POR_VENTANA = 5;
const intentos = new Map<string, number[]>();

function excedeLimite(ip: string, ahora: number): boolean {
  const recientes = (intentos.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  recientes.push(ahora);
  intentos.set(ip, recientes);
  if (intentos.size > 5_000) intentos.clear(); // evita que el mapa crezca sin fin
  return recientes.length > MAX_POR_VENTANA;
}

function ipDe(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'desconocida';
}

/* ------------------------------ Utilidades ----------------------------- */

function responder(cuerpo: ContactoRespuesta, status = 200) {
  return NextResponse.json(cuerpo, { status, headers: { 'Cache-Control': 'no-store' } });
}

function escaparHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function fetchConTiempo(url: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, cache: 'no-store', signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------ Turnstile ------------------------------ */

async function verificarTurnstile(token: string, ip: string): Promise<boolean> {
  const secreto = process.env.TURNSTILE_SECRET_KEY || (ES_DESARROLLO ? TURNSTILE_SECRETO_PRUEBA : '');
  if (!secreto || !token) return false;
  try {
    const body = new URLSearchParams({ secret: secreto, response: token });
    if (ip !== 'desconocida') body.set('remoteip', ip);
    const res = await fetchConTiempo('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!data.success) console.warn('[Contacto] Turnstile rechazó el token:', data['error-codes']?.join(', '));
    return data.success === true;
  } catch (e) {
    console.error('[Contacto] No se pudo verificar Turnstile:', e instanceof Error ? e.message : e);
    return false;
  }
}

/* ------------------------- Contenido del correo ------------------------ */

function armarCorreo(d: ContactoPayload, fecha: Date) {
  const motivo = etiquetaMotivo(d.motivo);
  const hora = fecha.toLocaleString('es-VE', { timeZone: 'America/Caracas', dateStyle: 'long', timeStyle: 'short' });
  const asunto = `[Web Liga Kiniela] ${motivo}: ${d.nombre}`.slice(0, 150);

  const texto = [
    `Nuevo mensaje desde el formulario de contacto de ${CONTACTO.web}`,
    '',
    `Nombre: ${d.nombre}`,
    `Correo: ${d.correo}`,
    `Motivo: ${motivo}`,
    `Fecha: ${hora} (hora de Venezuela)`,
    '',
    'Mensaje:',
    d.mensaje,
    '',
    '---',
    'Para responder, usa "Responder": la respuesta llega directo al correo del usuario.',
  ].join('\n');

  const fila = (k: string, v: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#555;white-space:nowrap"><strong>${k}</strong></td><td style="padding:4px 0">${escaparHtml(v)}</td></tr>`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;max-width:600px">
<p style="margin:0 0 12px;color:#00063E;font-size:16px"><strong>Nuevo mensaje desde ${escaparHtml(CONTACTO.web)}</strong></p>
<table style="border-collapse:collapse">${fila('Nombre', d.nombre)}${fila('Correo', d.correo)}${fila('Motivo', motivo)}${fila('Fecha', `${hora} (hora de Venezuela)`)}</table>
<p style="margin:16px 0 4px"><strong>Mensaje:</strong></p>
<div style="white-space:pre-wrap;border-left:3px solid #FFAF3F;padding:8px 12px;background:#f7f7f9">${escaparHtml(d.mensaje)}</div>
<p style="margin-top:16px;color:#777;font-size:12px">Para responder, usa "Responder": la respuesta llega directo al correo del usuario.</p>
</div>`;

  return { asunto, texto, html };
}

/* ------------------------------- SMTP2GO ------------------------------- */
// API: POST https://api.smtp2go.com/v3/email/send (JSON). Ojo: puede responder 200 aunque el envío falle,
// por eso se revisa data.failed / data.error además del código HTTP.

interface Smtp2goRespuesta {
  data?: { succeeded?: number; failed?: number; failures?: unknown[]; email_id?: string; error?: string; error_code?: string };
}

async function enviarCorreo(d: ContactoPayload): Promise<'enviado' | 'simulado' | 'no_configurado' | 'fallido'> {
  const apiKey = process.env.SMTP2GO_API_KEY;
  const remitente = process.env.CONTACT_FROM_EMAIL;
  const destino = process.env.CONTACT_TO_EMAIL || CONTACTO.correo;

  if (!apiKey || !remitente) {
    if (ES_DESARROLLO) {
      // Sin claves en local: se simula el envío para poder probar la interfaz. No se registran datos personales.
      console.info('[Contacto] (desarrollo) SMTP2GO sin configurar: envío simulado.');
      return 'simulado';
    }
    console.error('[Contacto] Faltan SMTP2GO_API_KEY o CONTACT_FROM_EMAIL en el servidor.');
    return 'no_configurado';
  }

  const { asunto, texto, html } = armarCorreo(d, new Date());
  const nombreSeguro = d.nombre.replace(/["<>]/g, '');

  try {
    const res = await fetchConTiempo('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Smtp2go-Api-Key': apiKey },
      body: JSON.stringify({
        sender: `Web Liga Kiniela <${remitente}>`,
        to: [destino],
        subject: asunto,
        text_body: texto,
        html_body: html,
        custom_headers: [{ header: 'Reply-To', value: `${nombreSeguro} <${d.correo}>` }],
      }),
    });
    const data = ((await res.json().catch(() => null)) as Smtp2goRespuesta | null)?.data;
    if (!res.ok || !data || data.error || (data.failed ?? 0) > 0 || (data.succeeded ?? 1) < 1) {
      console.error(
        `[Contacto] SMTP2GO no envió (HTTP ${res.status}): ${data?.error_code ?? ''} ${data?.error ?? ''} ${JSON.stringify(data?.failures ?? []).slice(0, 300)}`,
      );
      return 'fallido';
    }
    return 'enviado';
  } catch (e) {
    console.error('[Contacto] Error de red con SMTP2GO:', e instanceof Error ? e.message : e);
    return 'fallido';
  }
}

/* -------------------------------- Ruta --------------------------------- */

export async function POST(req: Request) {
  // 1. Tamaño y formato
  const largo = Number(req.headers.get('content-length') ?? 0);
  if (largo > MAX_BYTES) return responder({ ok: false, error: 'solicitud_invalida' }, 413);

  let entrada: Record<string, unknown>;
  try {
    const crudo = await req.text();
    if (crudo.length > MAX_BYTES) return responder({ ok: false, error: 'solicitud_invalida' }, 413);
    const parsed: unknown = JSON.parse(crudo);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('no es objeto');
    entrada = parsed as Record<string, unknown>;
  } catch {
    return responder({ ok: false, error: 'solicitud_invalida' }, 400);
  }

  // 2. Campo trampa y tiempo mínimo: a un bot se le responde "ok" para que no aprenda a esquivarlo.
  const trampa = typeof entrada.sitio_web === 'string' && entrada.sitio_web.trim() !== '';
  const transcurrido = Number(entrada.transcurrido_ms);
  if (trampa || !Number.isFinite(transcurrido) || transcurrido < LIMITES.tiempoMinimoMs) {
    return responder({ ok: true });
  }

  // 3. Límite por IP
  const ip = ipDe(req);
  if (excedeLimite(ip, Date.now())) return responder({ ok: false, error: 'demasiados_intentos' }, 429);

  // 4. Campos
  const { datos, errores } = validarContacto(entrada);
  if (Object.keys(errores).length > 0) return responder({ ok: false, error: 'validacion', errores }, 422);

  // 5. Captcha
  const token = typeof entrada.turnstile === 'string' ? entrada.turnstile.slice(0, 2048) : '';
  if (!(await verificarTurnstile(token, ip))) return responder({ ok: false, error: 'captcha' }, 403);

  // 6. Envío
  const resultado = await enviarCorreo(datos);
  if (resultado === 'no_configurado') return responder({ ok: false, error: 'no_configurado' }, 503);
  if (resultado === 'fallido') return responder({ ok: false, error: 'envio_fallido' }, 502);
  return responder({ ok: true });
}

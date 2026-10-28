// Tarjeta para compartir (1080x1350) dibujada con Canvas 2D nativo. Sin dependencias.
// Se importa bajo demanda (import()) al pulsar "Compartir mi boleto".
//
// - Tipografías: se espera a document.fonts.load con las mismas familias que usa la página.
// - Escudos: el origen (ligakiniela.com/team/{id}/image) NO emite CORS, así que se piden a la
//   ruta propia /api/team-image/{id} (mismo origen, no ensucia el canvas). Si falla, iniciales.
// - Sin montos de premio ni afirmaciones de resultados.

import { MARCA, PRACTICA } from '../../content/copys';
import { CONTACTO } from '../../content/contacto';

export interface ShareTeam {
  id: number;
  name: string;
  shortName: string;
}

export interface ShareLine {
  number: number;
  home: ShareTeam;
  away: ShareTeam;
  pick: 'L' | 'E' | 'V';
}

export interface ShareCardInput {
  kinielaName: string;
  poolId: number;
  lines: ShareLine[];
}

const W = 1080;
const H = 1350;
const GOLD = '#FFAF3F';
const GOLD_LIGHT = '#ffd58a';
const NAVY = '#00063E';
const WINE = '#882445';

/** Familias reales de next/font (nombres con hash) leídas de las variables CSS de <html>. */
function families() {
  const cs = getComputedStyle(document.documentElement);
  const slab = cs.getPropertyValue('--font-slab').trim() || "'Roboto Slab', Georgia, serif";
  const pop = cs.getPropertyValue('--font-poppins').trim() || "'Poppins', sans-serif";
  return { slab, pop };
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Kini: el SVG solo trae viewBox; se le da tamaño explícito para que todos los navegadores lo dibujen. */
async function loadKini(): Promise<HTMLImageElement | null> {
  try {
    const res = await fetch('/brand/kini-dark.svg');
    if (!res.ok) return null;
    const text = (await res.text()).replace('<svg ', '<svg width="294" height="348" ');
    const url = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
    const img = await loadImage(url);
    URL.revokeObjectURL(url);
    return img;
  } catch {
    return null;
  }
}

function initials(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (w.length === 0) return '?';
  return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[1][0]).toUpperCase();
}

function fit(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCrest(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  team: ShareTeam,
  cx: number,
  cy: number,
  size: number,
  slab: string,
) {
  if (img && img.naturalWidth > 0) {
    const ratio = img.naturalWidth / img.naturalHeight;
    const w = ratio >= 1 ? size : size * ratio;
    const h = ratio >= 1 ? size / ratio : size;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
    return;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#000428';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,175,63,0.55)';
  ctx.stroke();
  ctx.fillStyle = GOLD_LIGHT;
  ctx.font = `800 ${Math.round(size * 0.36)}px ${slab}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials(team.shortName || team.name), cx, cy + 1);
}

export async function renderShareCard(input: ShareCardInput): Promise<Blob> {
  const { slab, pop } = families();
  const sample = 'BOLETO EJERCICIO DE EJEMPLO ÁÉÍÓÚÑ áéíóúñ @LigaKiniela 0123456789';

  // Las tipografías deben estar cargadas antes de dibujar (si no, el canvas usa la de respaldo).
  try {
    await Promise.all([
      document.fonts.load(`800 40px ${slab}`, sample),
      document.fonts.load(`700 28px ${slab}`, sample),
      document.fonts.load(`600 28px ${pop}`, sample),
      document.fonts.load(`500 24px ${pop}`, sample),
    ]);
  } catch {
    /* se dibuja con las fuentes de respaldo */
  }

  const teams = new Map<number, ShareTeam>();
  for (const l of input.lines) {
    teams.set(l.home.id, l.home);
    teams.set(l.away.id, l.away);
  }
  const ids = Array.from(teams.keys());
  const [kini, ...crestList] = await Promise.all([
    loadKini(),
    ...ids.map((id) => loadImage(`/api/team-image/${id}`)),
  ]);
  const crests = new Map<number, HTMLImageElement | null>();
  ids.forEach((id, i) => crests.set(id, crestList[i] ?? null));

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas no disponible');

  // Fondo: noche de estadio
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0c186b');
  bg.addColorStop(0.35, NAVY);
  bg.addColorStop(1, '#000428');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Reflectores
  for (const [x, rot] of [[150, -0.2], [540, 0], [930, 0.2]] as const) {
    ctx.save();
    ctx.translate(x, -20);
    ctx.rotate(rot);
    const beam = ctx.createLinearGradient(0, 0, 0, 900);
    beam.addColorStop(0, 'rgba(255,213,138,0.22)');
    beam.addColorStop(1, 'rgba(255,213,138,0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.lineTo(260, 900);
    ctx.lineTo(-260, 900);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Marco del boleto
  const bx = 48;
  const by = 48;
  const bw = W - 96;
  const bh = H - 96;
  roundRect(ctx, bx, by, bw, bh, 36);
  ctx.fillStyle = 'rgba(2,6,58,0.82)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,175,63,0.6)';
  ctx.stroke();

  // Cabecera: Kini a la izquierda; la esquina superior derecha queda libre
  if (kini) ctx.drawImage(kini, 84, 78, 118, 140);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = GOLD;
  ctx.font = `700 24px ${pop}`;
  ctx.fillText('BOLETO DE PRÁCTICA', 226, 118);
  ctx.fillStyle = '#ffffff';
  // El nombre se achica hasta caber (de 52 a 32 px) antes de recortarse con puntos suspensivos
  let nameSize = 52;
  const nameText = input.kinielaName.toUpperCase();
  ctx.font = `800 ${nameSize}px ${slab}`;
  while (nameSize > 32 && ctx.measureText(nameText).width > 760) {
    nameSize -= 2;
    ctx.font = `800 ${nameSize}px ${slab}`;
  }
  ctx.fillText(fit(ctx, nameText, 760), 226, 178);

  // Rótulo permanente
  const ry = 244;
  roundRect(ctx, 84, ry, W - 168, 58, 12);
  ctx.fillStyle = WINE;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = GOLD;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 24px ${pop}`;
  ctx.fillText(PRACTICA.rotuloTarjeta.toUpperCase(), W / 2, ry + 30);

  // Línea punteada (perforación)
  ctx.setLineDash([12, 10]);
  ctx.strokeStyle = 'rgba(255,175,63,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, 328);
  ctx.lineTo(W - 84, 328);
  ctx.stroke();
  ctx.setLineDash([]);

  // Las líneas
  const n = Math.max(input.lines.length, 1);
  const top = 350;
  const rowH = Math.min(76, Math.floor(770 / n));
  const colW = 64;
  const gap = 8;
  const boxesW = colW * 3 + gap * 2;
  const bxs = (W - boxesW) / 2;
  const sideW = 330;
  input.lines.forEach((line, i) => {
    const y = top + i * rowH;
    const cy = y + rowH / 2;
    if (i % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(84, y, W - 168, rowH);
    }
    // número
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = GOLD;
    ctx.font = `800 26px ${slab}`;
    ctx.fillText(String(line.number).padStart(2, '0'), 98, cy);
    // local
    drawCrest(ctx, crests.get(line.home.id) ?? null, line.home, 186, cy, 46, slab);
    ctx.fillStyle = '#ffffff';
    ctx.font = `600 25px ${pop}`;
    ctx.textAlign = 'left';
    ctx.fillText(fit(ctx, line.home.shortName || line.home.name, sideW - 70), 222, cy + 1);
    // visitante
    drawCrest(ctx, crests.get(line.away.id) ?? null, line.away, W - 186, cy, 46, slab);
    ctx.textAlign = 'right';
    ctx.fillText(fit(ctx, line.away.shortName || line.away.name, sideW - 70), W - 222, cy + 1);
    // casillas
    (['L', 'E', 'V'] as const).forEach((opt, j) => {
      const x = bxs + j * (colW + gap);
      const bh2 = Math.min(50, rowH - 18);
      const marked = line.pick === opt;
      roundRect(ctx, x, cy - bh2 / 2, colW, bh2, 10);
      if (marked) {
        ctx.fillStyle = GOLD;
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(6,14,79,0.9)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.stroke();
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = marked ? NAVY : 'rgba(255,255,255,0.7)';
      ctx.font = `800 24px ${slab}`;
      ctx.fillText(opt, x + colW / 2, cy + 1);
    });
  });

  // Pie: marca y contacto (sin montos ni resultados)
  const fy = top + n * rowH + 40;
  ctx.setLineDash([12, 10]);
  ctx.strokeStyle = 'rgba(255,175,63,0.5)';
  ctx.beginPath();
  ctx.moveTo(84, fy - 14);
  ctx.lineTo(W - 84, fy - 14);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = GOLD_LIGHT;
  ctx.font = `700 26px ${pop}`;
  ctx.fillText(MARCA.eslogan, W / 2, fy + 34);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 36px ${slab}`;
  ctx.fillText(`${CONTACTO.instagram}  ·  ${CONTACTO.web}`, W / 2, fy + 86);
  ctx.fillStyle = 'rgba(199,203,230,0.85)';
  ctx.font = `500 20px ${pop}`;
  ctx.fillText('Para jugar, ve a una plataforma aliada. +18 · Juega con moderación.', W / 2, fy + 122);

  return new Promise<Blob>((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('No se pudo generar la imagen'))), 'image/png');
    } catch (e) {
      reject(e instanceof Error ? e : new Error('Canvas contaminado'));
    }
  });
}

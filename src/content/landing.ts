/**
 * Textos de las secciones de reglas, preguntas, calculadora, aliados, campeones y la
 * página /terminos (M3c). Lenguaje sencillo para el aficionado, sin tecnicismos.
 * Regla de contenido: cada mensaje vive en un solo lugar de la página. Lo legal completo
 * está en /terminos; aquí solo se enlaza.
 */

import { FAQ } from './guia';

/* ------------------------------------------------------------------ */
/* Reglas: Pizarra del DT                                               */
/* ------------------------------------------------------------------ */

export const REGLAS_SECCION = {
  badge: 'Pizarra del DT',
  titulo: 'Cómo se juega',
  subtitulo: 'La jugada completa, en tres trazos.',
} as const;

export const PIZARRA_PASOS = [
  {
    numero: 1,
    titulo: 'Marca los 10',
    texto: 'Elige Local, E o Visitante en cada partido. Ninguno puede quedar en blanco.',
  },
  {
    numero: 2,
    titulo: 'Mínimo 7 aciertos',
    texto: 'Con menos de 7 aciertos no hay premio, aunque tengas el mejor ticket.',
  },
  {
    numero: 3,
    titulo: 'Gana el máximo',
    texto:
      'Se lleva el premio quien tenga más aciertos; si hay empate, se reparte en partes iguales. Tu premio llega solo a tu saldo, en no más de 24 h.',
  },
] as const;

export const PASOS_ACORDEON = {
  titulo: 'Los 7 pasos para jugar',
  ayuda: 'Del inicio de sesión hasta seguir tus resultados.',
} as const;

/** Q9: el Menú es de la taquilla de la plataforma aliada, no de esta web. */
export const NOTA_MENU =
  'El Menú de la taquilla (Historial, Resultados, Tickets Quinielas, Editar Usuario y Campeones) está dentro de la plataforma donde juegas.';

export const ENLACE_REGLAMENTO = {
  texto: 'Reglamento y Términos y Condiciones completos',
  href: '/terminos',
} as const;

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes                                                 */
/* ------------------------------------------------------------------ */

export type FaqCategoriaId = 'jugar' | 'premios' | 'reglas' | 'plataformas' | 'seguridad';

export const FAQ_CATEGORIAS: { id: FaqCategoriaId; nombre: string }[] = [
  { id: 'jugar', nombre: 'Jugar' },
  { id: 'premios', nombre: 'Premios' },
  { id: 'reglas', nombre: 'Reglas y partidos' },
  { id: 'plataformas', nombre: 'Plataformas y cuenta' },
  { id: 'seguridad', nombre: 'Seguridad y juego responsable' },
];

/**
 * Agrupamiento de las 23 preguntas de la guía (Anexo E) por categoría.
 * Se enlaza por el texto exacto de la pregunta; si una pregunta nueva no está aquí, cae en "Jugar".
 */
const CATEGORIA_POR_PREGUNTA: Record<string, FaqCategoriaId> = {
  '¿Necesito saber mucho de fútbol?': 'jugar',
  '¿Cuántos partidos debo marcar?': 'jugar',
  '¿Puedo elegir dos opciones en el mismo partido?': 'jugar',
  '¿Puedo jugar varios tickets?': 'jugar',
  '¿Hasta qué hora puedo jugar?': 'jugar',
  '¿Puedo cambiar mi ticket después de jugarlo?': 'jugar',
  '¿Cuántos aciertos necesito para ganar?': 'premios',
  'Tengo 8 aciertos, pero otra persona tiene 9. ¿Cobro?': 'premios',
  '¿Qué pasa si dos personas tienen el mismo máximo?': 'premios',
  'Tengo dos tickets con el máximo. ¿Cobro doble?': 'premios',
  '¿Y si nadie llega a 7 aciertos?': 'premios',
  '¿Dónde recibo el premio?': 'premios',
  '¿Cuánto tarda en llegar el premio?': 'premios',
  '¿Tengo que reclamar mi premio?': 'premios',
  '¿Cuenta la prórroga o los penales?': 'reglas',
  '¿Qué pasa si se suspende un partido?': 'reglas',
  '¿Y si se suspenden 3 o más?': 'reglas',
  '¿Qué hora se usa?': 'reglas',
  '¿Puedo ver las jugadas de los demás?': 'plataformas',
  '¿Dónde veo los resultados?': 'plataformas',
  '¿Dónde veo a los ganadores?': 'plataformas',
  '¿Me descuentan impuestos del premio?': 'seguridad',
  '¿A quién escribo si tengo dudas?': 'seguridad',
};

/** Las 6 que se muestran al inicio. No repiten la pizarra ni el boleto. La regla del cierre de venta vive aquí (el Hero ya no la dice). */
export const FAQ_MAS_CONSULTADAS: string[] = [
  '¿Hasta qué hora puedo jugar?',
  '¿Puedo jugar varios tickets?',
  '¿Puedo cambiar mi ticket después de jugarlo?',
  '¿Cuenta la prórroga o los penales?',
  '¿Qué pasa si se suspende un partido?',
  '¿Me descuentan impuestos del premio?',
];

export interface FaqItem {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: FaqCategoriaId;
}

export const FAQ_ITEMS: FaqItem[] = FAQ.map((f, i) => ({
  id: `faq-${i}`,
  pregunta: f.pregunta,
  respuesta: f.respuesta,
  categoria: CATEGORIA_POR_PREGUNTA[f.pregunta] ?? 'jugar',
}));

export const FAQ_TEXTOS = {
  badge: 'Dudas',
  titulo: 'Preguntas frecuentes',
  subtitulo: 'Las respuestas más consultadas, directas.',
  masConsultadas: 'Las más consultadas',
  verTodas: (n: number) => `Ver todas las preguntas (${n})`,
  verMenos: 'Ver solo las más consultadas',
  buscarEtiqueta: 'Buscar una pregunta',
  buscarPlaceholder: 'Buscar, por ejemplo: premio',
  limpiar: 'Borrar búsqueda',
  categorias: 'Categorías de preguntas',
  resultados: (n: number) => (n === 1 ? '1 pregunta encontrada' : `${n} preguntas encontradas`),
  sinResultados: 'No encontramos esa pregunta. Prueba con otra palabra.',
} as const;

/* ------------------------------------------------------------------ */
/* Calculadora ¿Cuánto cobro?                                           */
/* ------------------------------------------------------------------ */

export const CALCULADORA_TEXTOS = {
  titulo: '¿Cuánto cobro?',
  ayuda: 'Calcula tu parte según cuántos tickets compartan el máximo.',
  etiquetaEjemplo: 'Ejemplo de cálculo: no es un resultado real',
  abrir: 'Abrir calculadora',
  cerrar: 'Cerrar calculadora',
  premioDe: (nombre: string) => `Premio total de ${nombre}`,
  premioEjemplo: 'Premio total',
  tagEjemplo: 'ejemplo',
  atajos: 'Probar un caso',
  aciertos: 'Aciertos del mejor ticket',
  aciertosAyuda: 'El máximo de la edición',
  tickets: 'Tickets con ese máximo',
  ticketsAyuda: 'En total, de todos los jugadores',
  mios: 'De esos, tuyos',
  miosAyuda: 'Cada ticket cuenta como una parte',
  cadaTicket: 'Cada ticket recibe',
  tuRecibes: 'Tú recibirías',
  sinGanadorTitulo: 'Nadie gana',
  sinGanadorTexto:
    'Con menos de 7 aciertos no hay ganador: el premio no se entrega ni pasa a otra edición.',
  nota: 'Cálculo sin partidos suspendidos. Premio ÷ tickets que comparten el máximo, con dos decimales.',
  decrementar: (campo: string) => `Restar uno a ${campo}`,
  incrementar: (campo: string) => `Sumar uno a ${campo}`,
} as const;

/** Atajos de la calculadora: escenarios A, B, C y E de la guía (Q5: sin D). */
export const CALCULADORA_ATAJOS: {
  clave: 'A' | 'B' | 'C' | 'E';
  etiqueta: string;
  aciertos: number;
  tickets: number;
  mios: number;
}[] = [
  { clave: 'A', etiqueta: 'Un ticket gana', aciertos: 9, tickets: 1, mios: 1 },
  { clave: 'B', etiqueta: 'Empatan dos', aciertos: 9, tickets: 2, mios: 1 },
  { clave: 'C', etiqueta: 'Tres, dos tuyos', aciertos: 9, tickets: 3, mios: 2 },
  { clave: 'E', etiqueta: 'Nadie llega a 7', aciertos: 6, tickets: 1, mios: 1 },
];

/* ------------------------------------------------------------------ */
/* Aliados                                                              */
/* ------------------------------------------------------------------ */

export const ALIADOS_SECCION = {
  badge: 'Plataformas aliadas',
  titulo: '¿Dónde jugar?',
  /** Subtítulo aprobado por el cliente (Q10). */
  subtitulo: 'Plataformas aliadas donde encuentras la taquilla oficial de Liga Kiniela.',
  ariaLista: 'Plataformas aliadas',
  enlace: (nombre: string) => `Ir a ${nombre} (se abre en otra pestaña)`,
} as const;

/* ------------------------------------------------------------------ */
/* Campeones                                                            */
/* ------------------------------------------------------------------ */

export const CAMPEONES_SECCION = {
  badge: 'Vitrina de trofeos',
  titulo: 'Salón de Campeones',
  subtitulo: 'Quienes ya se llevaron el premio de una edición.',
  /** Decisión Q8: se mantiene, una sola vez a nivel de sección. */
  sello: 'Premio Verificado y Cobrado',
  premio: 'Premio',
  vacio: 'Los campeones de las próximas ediciones se mostrarán aquí.',
} as const;

/* ------------------------------------------------------------------ */
/* Página /terminos                                                     */
/* ------------------------------------------------------------------ */

export const TERMINOS_PAGINA = {
  titulo: 'Reglamento y Términos y Condiciones',
  subtitulo: 'El texto completo de Liga Kiniela, artículo por artículo.',
  volver: 'Volver a la página principal',
  indice: 'Índice',
  parteReglamento: 'Reglamento oficial',
  parteReglamentoRango: 'Artículos 1 al 11',
  parteTerminos: 'Términos y Condiciones de uso',
  parteTerminosRango: 'Artículos 12 al 26',
  enPalabrasSimples: 'En palabras simples',
  ejemplo: 'Ejemplo',
  ejemploAviso: 'Los montos son de ejemplo, solo para explicar.',
  nota11_3:
    'Las explicaciones en palabras simples y los ejemplos ayudan a entender. Si alguna difiere del texto del artículo, prevalece el texto del artículo (Art. 11.3).',
  complementariaEtiqueta: 'Regla complementaria de la edición',
  complementariaAviso:
    'Esta regla se aplica en la edición vigente y se incorporará a la próxima versión de la guía oficial.',
  irAArticulo: (n: number) => `Ir al Artículo ${n}`,
  arriba: 'Volver al índice',
} as const;

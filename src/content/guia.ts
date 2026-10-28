/**
 * Contenido estructurado de la GUÍA LIGA KINIELA v2.0 (Información general, Cómo jugar, Anexos).
 * Fuente única: docs/GUIA_LIGA_KINIELA_v2.md. La guía manda sobre cualquier otra fuente (D3).
 * Sin dependencias. Todo monto o resultado ilustrativo lleva `esEjemplo: true`.
 * El Reglamento (Art. 1-11) y los Términos (Art. 12-26) están en ./terminos.ts.
 */

import { REGLAMENTO } from './terminos';
import type { ArticuloGuia } from './terminos';

/* ------------------------------------------------------------------ */
/* 1. Lo esencial                                                       */
/* ------------------------------------------------------------------ */

export const QUE_ES =
  'Es un juego de pronósticos de fútbol. En cada edición te mostramos 10 partidos. Tú adivinas cómo terminará cada uno: gana el local, empate o gana el visitante. Cuando los partidos terminan, se cuentan tus aciertos. Gana quien consiga más aciertos, con un mínimo de 7, y se lleva el premio de esa edición.';

/** Lo esencial en 6 puntos (guía, "Liga Kiniela en 1 minuto"). */
export const ESENCIAL_6_PUNTOS: string[] = [
  '10 partidos por edición.',
  'En cada partido eliges una sola opción: Local, Empate (E) o Visitante.',
  'Tienes que marcar los 10 partidos para poder jugar.',
  'Puedes jugar hasta 1 minuto antes de que empiece el primer partido.',
  'Para ganar necesitas 7 aciertos o más, y que nadie más tenga más aciertos que tú.',
  'Si varios tickets empatan en el máximo, el premio se divide en partes iguales.',
];

export const REGLA_DE_ORO = {
  texto:
    'Solo cuentan los 90 minutos del partido más el tiempo que agrega el árbitro. La prórroga y los penales no cuentan.',
  enPalabrasSimples:
    'Si en un partido de eliminatoria hay empate a los 90 minutos y luego alguien gana en penales, para Liga Kiniela ese partido terminó empatado.',
  articulo: 5,
} as const;

/** Tres palabras que debes conocer. */
export const TRES_PALABRAS: { palabra: string; significado: string }[] = [
  { palabra: 'Ticket', significado: 'Tu boleto. Es la hoja con tus 10 pronósticos.' },
  {
    palabra: 'Acierto',
    significado: 'Un partido que adivinaste. Si adivinas 8 de 10, tienes 8 aciertos.',
  },
  {
    palabra: 'Taquilla',
    significado:
      'La ventanilla digital de Liga Kiniela, dentro de la página de apuestas donde juegas.',
  },
];

/* ------------------------------------------------------------------ */
/* 2. Parte I: información general                                      */
/* ------------------------------------------------------------------ */

export const DONDE_SE_JUEGA = {
  texto:
    'Liga Kiniela no tiene una página de pago aparte. Se juega dentro de las plataformas aliadas, que son las páginas de apuestas en las que ya puedes tener tu usuario y tu saldo. Dentro de cada plataforma encontrarás la taquilla oficial de "Liga Kiniela". Piensa en ella como la ventanilla donde compras tu boleto.',
  enPalabrasSimples:
    'Tu dinero y tu cuenta están en la plataforma aliada que tú elijas. Liga Kiniela es el juego al que accedes desde ahí.',
  seccion: '1.2',
} as const;

export const QUE_ES_EDICION = {
  texto:
    'Una edición es una Kiniela completa, con un nombre que la distingue de las demás. Cada edición dura desde que se abre la venta hasta que termina el último partido de su lista.',
  seccion: '1.3',
} as const;

/** Ficha de cada edición (sección 1.4). */
export const FICHA_EDICION: { dato: string; significado: string }[] = [
  { dato: 'Nombre', significado: 'El nombre que identifica a esta edición.' },
  { dato: 'Código', significado: 'Un identificador único de la edición.' },
  {
    dato: 'Premio total (acumulado)',
    significado:
      'El monto que se reparte entre los ganadores. Es fijo y lo establece la edición desde que abre la venta. Varía de una edición a otra.',
  },
  {
    dato: 'Costo del ticket',
    significado:
      'Lo que cuesta cada ticket. Varía de una edición a otra. Si es 0 Bs, la edición es gratuita.',
  },
  { dato: 'Juegos', significado: 'Siempre son 10 partidos.' },
  { dato: 'Inicio', significado: 'Fecha y hora del primer partido de la lista.' },
  {
    dato: 'Finalización',
    significado: 'Fecha y hora en que termina el último partido de la lista.',
  },
  { dato: 'Regla de ganador', significado: 'Más aciertos, con un mínimo de 7.' },
];

export const AVISO_MONTOS_EJEMPLO = {
  esEjemplo: true,
  texto:
    'Los montos que aparecen en la guía (por ejemplo, premio de 2.500.000 Bs y ticket de 1.000 Bs) son solo ejemplos para explicar. Los montos reales son los que ves en la taquilla de cada edición.',
} as const;

/** Lo que verás en la pantalla de la taquilla (sección 1.5). */
export const ZONAS_TAQUILLA: { zona: string; paraQueSirve: string }[] = [
  {
    zona: 'Quinielas disponibles',
    paraQueSirve: 'Muestra la edición activa, su código y su premio acumulado.',
  },
  {
    zona: 'Información y reglas sobre la quiniela',
    paraQueSirve: 'Botón "Ver información" que despliega las reglas.',
  },
  { zona: 'Selecciona tus jugadas', paraQueSirve: 'La lista de los 10 partidos para marcar.' },
  {
    zona: 'Columnas LOCAL, EMP y VISITANTE',
    paraQueSirve: 'Las tres opciones que puedes elegir en cada partido.',
  },
  { zona: 'Botón JUGAR QUINIELA', paraQueSirve: 'Confirma y registra tu ticket.' },
  {
    zona: 'Botón MENÚ',
    paraQueSirve:
      'Abre tus opciones: Historial, Resultados, Tickets Quinielas, Editar Usuario y Campeones.',
  },
];

export const TIP_LOCAL_VISITANTE =
  'En la lista, el equipo de la izquierda es el local y el de la derecha es el visitante. El recuadro del centro, con la letra E, es el empate.';

/* ------------------------------------------------------------------ */
/* 3. Parte II: cómo jugar                                              */
/* ------------------------------------------------------------------ */

/** Lista de verificación (sección 2.1). */
export const ANTES_DE_EMPEZAR: string[] = [
  'Un usuario creado en alguna de las plataformas aliadas.',
  'Saldo cargado en esa plataforma, suficiente para pagar tu ticket (no hace falta si la edición es gratuita).',
  'Ser mayor de 18 años y jugar desde Venezuela.',
];

export interface PasoJuego {
  numero: number;
  /** Título corto. */
  titulo: string;
  /** Texto simple, fiel a la guía. */
  texto: string;
}

/** Los 7 pasos para jugar (sección 2.2). */
export const PASOS_JUGAR: PasoJuego[] = [
  {
    numero: 1,
    titulo: 'Entra a tu plataforma aliada',
    texto: 'Entra a tu plataforma aliada de confianza e inicia sesión con tu usuario.',
  },
  {
    numero: 2,
    titulo: 'Busca la taquilla',
    texto: 'Busca la taquilla oficial de "Liga Kiniela". Está dentro de la misma plataforma.',
  },
  {
    numero: 3,
    titulo: 'Mira la Kiniela activa',
    texto: 'Verás la edición más reciente, con su código y su premio.',
  },
  {
    numero: 4,
    titulo: 'Revisa los 10 partidos',
    texto: 'Cada uno muestra la fecha, la hora, la liga o torneo y los dos equipos.',
  },
  {
    numero: 5,
    titulo: 'Marca tus pronósticos',
    texto: 'Debes marcar los 10 partidos. En cada uno eliges una sola opción: Local, E o Visitante.',
  },
  {
    numero: 6,
    titulo: 'Presiona "JUGAR QUINIELA"',
    texto:
      'Tu ticket queda registrado y su costo se descuenta de tu saldo. Desde ese momento no se puede cambiar.',
  },
  {
    numero: 7,
    titulo: 'Sigue tus resultados',
    texto: 'Desde el Menú ves tus jugadas, los marcadores en vivo y los campeones.',
  },
];

/** Cómo marcar cada partido (sección 2.3). */
export const COMO_MARCAR: { siCrees: string; marca: string; seVeAsi: string }[] = [
  {
    siCrees: 'Gana el equipo de la izquierda',
    marca: 'LOCAL (el nombre del equipo)',
    seVeAsi: 'El recuadro se pinta de azul oscuro.',
  },
  {
    siCrees: 'Los dos equipos empatan',
    marca: 'EMP (la letra E)',
    seVeAsi: 'El recuadro central se pinta de azul oscuro.',
  },
  {
    siCrees: 'Gana el equipo de la derecha',
    marca: 'VISITANTE (el nombre del equipo)',
    seVeAsi: 'El recuadro se pinta de azul oscuro.',
  },
];

export const EJEMPLO_MARCAR = {
  esEjemplo: true,
  partido: 'Barcelona (local) vs. Aston Villa (visitante)',
  casos: [
    {
      marcas: 'Barcelona',
      terminaCon: 'victoria de Barcelona a los 90 minutos',
      esAcierto: true,
    },
    { marcas: 'Barcelona', terminaCon: 'empate', esAcierto: false },
    { marcas: 'E', terminaCon: 'empate', esAcierto: true },
  ],
} as const;

export const TICKET_EXPLICACION =
  'Tu ticket es una lista de 10 respuestas. Cuando terminen los partidos, comparamos tus respuestas con lo que realmente pasó y contamos cuántas coinciden.';

/** Cuántos tickets puedo jugar (sección 2.5). */
export const CUANTOS_TICKETS = {
  conCosto: 'En ediciones con costo: todos los que quieras. Cada ticket se paga aparte y se evalúa por separado.',
  gratuitas: 'En ediciones gratuitas (costo 0 Bs): un solo ticket por usuario.',
  tip: 'Tener varios tickets con pronósticos distintos te da más oportunidades de acertar. Pero recuerda que cada ticket cuesta, y que no se pueden cambiar una vez jugados.',
} as const;

/** Hasta cuándo puedo jugar (sección 2.6, Art. 4.2). */
export const CIERRE_DE_VENTA = {
  texto:
    'Puedes crear tus tickets desde que se publica la Kiniela hasta 1 minuto antes del primer pitazo inicial (el comienzo del primer partido de la lista).',
  ejemplo: {
    esEjemplo: true,
    texto:
      'Si el primer partido empieza a las 9:00 a. m., la venta cierra a las 8:59 a. m. (hora de Venezuela). No esperes al último segundo: una conexión lenta puede dejarte sin jugar.',
  },
  articulo: 4,
} as const;

/** El Menú (sección 2.7). */
export const MENU_TAQUILLA: { opcion: string; queHaces: string }[] = [
  {
    opcion: 'Historial',
    queHaces: 'Ver tus jugadas: activas (en juego), procesadas (ya calculadas) o pendientes.',
  },
  {
    opcion: 'Resultados',
    queHaces: 'Ver el marcador real de los partidos en vivo y el resultado final.',
  },
  {
    opcion: 'Tickets Quinielas',
    queHaces: 'Ver las jugadas de los demás participantes de esta Kiniela o de ediciones anteriores.',
  },
  { opcion: 'Editar Usuario', queHaces: 'Revisar y actualizar los datos de tu usuario.' },
  {
    opcion: 'Campeones',
    queHaces: 'Conocer a los ganadores de la Kiniela en proceso y de las pasadas.',
  },
];

export const MENU_INSTAGRAM = 'Además, en el Menú encuentras el botón "Síguenos en Instagram" (@LigaKiniela).';

/** Qué pasa cuando terminan los partidos (sección 2.8). */
export const AL_TERMINAR: string[] = [
  'Se confirman los resultados de los 10 partidos (90 minutos más tiempo agregado).',
  'Se cuentan los aciertos de cada ticket.',
  'Se identifica el máximo de aciertos (debe ser 7 o más).',
  'Se reparte el premio entre los tickets con ese máximo.',
  'El premio se abona automáticamente en tu saldo de la plataforma, en no más de 24 horas después de que termina el último partido que se jugó. No tienes que pedirlo ni reclamarlo.',
];

/** Errores frecuentes de quien juega por primera vez (sección 2.9). */
export const ERRORES_FRECUENTES: { error: string; comoEvitarlo: string }[] = [
  {
    error: 'Dejar partidos sin marcar',
    comoEvitarlo: 'El ticket exige los 10. Revisa que todos estén en azul antes de jugar.',
  },
  {
    error: 'Pensar que la prórroga o los penales cuentan',
    comoEvitarlo: 'Solo valen los 90 minutos más el tiempo agregado.',
  },
  {
    error: 'Pensar que con 7 aciertos siempre ganas',
    comoEvitarlo:
      'Ganas con el máximo de aciertos de la edición. Si alguien tiene 9, los de 7 u 8 no cobran.',
  },
  { error: 'Esperar al último minuto', comoEvitarlo: 'La venta cierra 1 minuto antes del primer partido.' },
  {
    error: 'Querer corregir un ticket ya jugado',
    comoEvitarlo: 'No se puede. Revisa bien antes de presionar JUGAR QUINIELA.',
  },
  { error: 'Olvidar el saldo', comoEvitarlo: 'Carga saldo en tu plataforma con tiempo.' },
  {
    error: 'Buscar el pago en otro lugar',
    comoEvitarlo: 'El premio llega a tu saldo en la plataforma donde jugaste.',
  },
];

/* ------------------------------------------------------------------ */
/* 4. Reglamento resumido para el usuario (Art. 3 a 10)                  */
/* ------------------------------------------------------------------ */

export interface ReglaResumen {
  articulo: number;
  titulo: string;
  /** Resumen fiel, en pocas frases. */
  resumen: string[];
  /** Frase "En palabras simples" de la guía, si existe. */
  enPalabrasSimples?: string;
}

/**
 * Versión resumida fiel de los artículos relevantes para el usuario (Art. 3 a 10).
 * Si hubiera diferencia con el texto del artículo, prevalece el artículo (Art. 11.3).
 * El texto íntegro está en REGLAMENTO (./terminos.ts).
 */
export const REGLAS_RESUMEN: ReglaResumen[] = [
  {
    articulo: 3,
    titulo: 'Pronósticos',
    resumen: [
      'En cada partido eliges una sola opción: Local, Empate (E) o Visitante.',
      'El ticket debe tener un pronóstico para cada uno de los 10 partidos. No se registran tickets incompletos.',
      'Puedes jugar combinaciones distintas en tickets distintos; cada ticket se evalúa por separado.',
    ],
    enPalabrasSimples: 'Un ticket = 10 respuestas, una por partido, ninguna en blanco.',
  },
  {
    articulo: 4,
    titulo: 'Tickets',
    resumen: [
      'Cantidad libre, excepto en ediciones gratuitas (0 Bs), donde solo se permite un ticket por usuario.',
      'Puedes crear tickets desde la publicación de la Kiniela hasta 1 minuto antes del primer pitazo inicial.',
      'Al presionar "Jugar quiniela" el ticket queda registrado y su costo se descuenta de tu saldo. No puede modificarse ni anularse, salvo cancelación de la edición (Art. 9 y 18).',
      'El ticket registrado es el único válido; puedes consultarlo en Historial.',
    ],
    enPalabrasSimples:
      'Puedes comprar los tickets que quieras hasta 1 minuto antes de que empiece el primer partido. Una vez jugado, tu ticket no se cambia.',
  },
  {
    articulo: 5,
    titulo: 'Qué parte del partido cuenta',
    resumen: [
      'Cuentan únicamente los 90 minutos reglamentarios más el tiempo de reposición (el que agrega el árbitro).',
      'No cuentan la prórroga ni los penales.',
      'Local: gana el local al terminar el tiempo reglamentario. Empate (E): marcador igualado. Visitante: gana el visitante.',
    ],
    enPalabrasSimples:
      'Mira el marcador cuando el árbitro pita el final de los 90 minutos (más lo agregado). Eso es lo que cuenta. Lo que pase después, no.',
  },
  {
    articulo: 6,
    titulo: 'Aciertos',
    resumen: [
      'Un pronóstico es acierto cuando coincide con el resultado según el Art. 5.',
      'Cada ticket suma un acierto por partido acertado, máximo 10.',
      'Los resultados salen de las fuentes oficiales que usa Liga Kiniela y se publican en Resultados. Si el organizador corrige oficialmente un resultado antes de pagar el premio, prevalece el corregido.',
    ],
  },
  {
    articulo: 7,
    titulo: 'Quién gana',
    resumen: [
      'Mínimo para ganar: 7 aciertos o más (sin perjuicio del Art. 9 para partidos anulados).',
      'Ganan los tickets con el mayor número de aciertos de la edición, siempre que alcance el mínimo.',
      'Solo el nivel más alto cobra: los tickets con menos aciertos que el máximo no reciben premio.',
      'Si varios tickets empatan en el máximo, el premio se reparte en partes iguales. Cada ticket ganador es una parte (dos tickets ganadores = dos partes).',
      'Si nadie alcanza el mínimo, todos pierden: el premio no se entrega, no se acumula a otra edición y los tickets no se reembolsan.',
    ],
    enPalabrasSimples:
      'Imagina una escalera de 0 a 10 aciertos. Solo cuenta el escalón más alto que alguien alcanzó, y solo si es el 7 o más. Todos los que estén en ese escalón se reparten el premio a partes iguales. Si nadie llega al 7, nadie gana.',
  },
  {
    articulo: 8,
    titulo: 'Premio',
    resumen: [
      'El premio total es fijo: lo establece la edición desde que abre la venta y no cambia por la cantidad de tickets vendidos. Se expresa en bolívares (Bs).',
      'Se abona automáticamente en el balance de la plataforma aliada donde jugaste el ticket ganador, en no más de 24 horas desde que termina el último partido realmente jugado.',
      'No existe trámite de reclamo: el premio se abona por sí solo.',
      'Liga Kiniela no aplica descuentos, retenciones ni impuestos. El uso o retiro del saldo se rige por la plataforma aliada.',
      'Con reparto, cada parte = premio total entre el número de tickets ganadores, con dos decimales.',
    ],
    enPalabrasSimples:
      'El premio es un monto fijo que se anuncia desde el principio. Si ganas, el dinero aparece solo en tu saldo en no más de 24 horas después de que termine el último partido que se jugó.',
  },
  {
    articulo: 9,
    titulo: 'Partidos suspendidos',
    resumen: [
      'Suspendido: el partido que, por cualquier causa (postergación, suspensión, abandono o cancelación), no se juega o no completa el tiempo reglamentario en la fecha programada.',
      '1 o 2 partidos suspendidos: se anulan (ni acierto ni fallo) y el mínimo para ganar baja en esa misma cantidad.',
      '3 o más: se cancela toda la Kiniela y se devuelve el dinero de los tickets en el balance de la plataforma aliada.',
      'Regla complementaria de la edición: un partido reprogramado con más de 1 día de diferencia respecto a su fecha programada también se anula.',
    ],
    enPalabrasSimples:
      'Si se cae algún partido (lluvia, suspensión, etc.), ese partido se borra de la Kiniela para todos y se ajusta el mínimo. Si se caen 3 o más, se anula todo y recuperas lo que pagaste.',
  },
  {
    articulo: 10,
    titulo: 'Transparencia',
    resumen: [
      'Los tickets de los participantes se consultan en Tickets Quinielas (edición actual y anteriores).',
      'Marcadores en vivo y resultados finales: en Resultados.',
      'Los ganadores de cada edición se publican en Campeones.',
    ],
  },
];

/** Referencia al texto íntegro de los mismos artículos (Art. 3 a 10). */
export const REGLAMENTO_ARTICULOS_USUARIO: ArticuloGuia[] = REGLAMENTO.filter(
  (a) => a.articulo >= 3 && a.articulo <= 10,
);

/* ------------------------------------------------------------------ */
/* 5. Partidos suspendidos (Art. 9) como datos                          */
/* ------------------------------------------------------------------ */

export interface FilaSuspendidos {
  /** Cantidad de partidos suspendidos. `3` significa "3 o más". */
  suspendidos: number;
  etiqueta: string;
  /** Partidos que cuentan (null = ninguno). */
  partidosQueCuentan: number | null;
  /** Mínimo para ganar (null = no aplica). */
  minimoParaGanar: number | null;
  cancelada: boolean;
  quePasa: string;
}

export const TABLA_SUSPENDIDOS: FilaSuspendidos[] = [
  {
    suspendidos: 0,
    etiqueta: '0',
    partidosQueCuentan: 10,
    minimoParaGanar: 7,
    cancelada: false,
    quePasa: 'Edición normal.',
  },
  {
    suspendidos: 1,
    etiqueta: '1',
    partidosQueCuentan: 9,
    minimoParaGanar: 6,
    cancelada: false,
    quePasa: 'El partido se anula. La edición sigue.',
  },
  {
    suspendidos: 2,
    etiqueta: '2',
    partidosQueCuentan: 8,
    minimoParaGanar: 5,
    cancelada: false,
    quePasa: 'Los dos partidos se anulan. La edición sigue.',
  },
  {
    suspendidos: 3,
    etiqueta: '3 o más',
    partidosQueCuentan: null,
    minimoParaGanar: null,
    cancelada: true,
    quePasa: 'Se cancela la Kiniela y se devuelve el dinero de todos los tickets.',
  },
];

export const EJEMPLO_SUSPENDIDO = {
  esEjemplo: true,
  texto:
    'Se suspende 1 partido. La Kiniela se juega con 9 partidos y el mínimo para ganar es 6. Si el mejor ticket tiene 8 aciertos sobre 9, ese ticket gana.',
} as const;

/* ------------------------------------------------------------------ */
/* 6. Anexo C: ejemplos resueltos, como DATOS                           */
/* ------------------------------------------------------------------ */

/** Anexo C: "Todos los montos y resultados son inventados, solo para explicar." */
export const AVISO_ANEXO_C = 'Todos los montos y resultados son inventados, solo para explicar.';

/** C.1 Cómo se cuentan los aciertos. */
export const EJEMPLO_ACIERTOS = {
  esEjemplo: true,
  totalAciertos: 8,
  filas: [
    { n: 1, partido: 'Atlético vs. Bayern', real: 'Empate', pronostico: 'Local', acierto: false },
    { n: 2, partido: 'Barcelona vs. Aston Villa', real: 'Local', pronostico: 'Local', acierto: true },
    { n: 3, partido: 'Feyenoord vs. Inter', real: 'Visitante', pronostico: 'Visitante', acierto: true },
    { n: 4, partido: 'Man Utd vs. Roma', real: 'Empate', pronostico: 'Empate', acierto: true },
    { n: 5, partido: 'Villarreal vs. PSG', real: 'Visitante', pronostico: 'Visitante', acierto: true },
    { n: 6, partido: 'AEK vs. R. Madrid', real: 'Visitante', pronostico: 'Visitante', acierto: true },
    { n: 7, partido: 'Fenerbahce vs. Liverpool', real: 'Visitante', pronostico: 'Visitante', acierto: true },
    { n: 8, partido: 'Porto vs. Napoli', real: 'Local', pronostico: 'Local', acierto: true },
    { n: 9, partido: 'RB Leipzig vs. Man City', real: 'Visitante', pronostico: 'Local', acierto: false },
    { n: 10, partido: 'Slavia Praga vs. Arsenal', real: 'Visitante', pronostico: 'Visitante', acierto: true },
  ],
} as const;

export const PREMIO_EJEMPLO_BS = 2_500_000;

export interface TicketEjemplo {
  /** Etiqueta del ticket dentro del escenario. */
  id: string;
  /** Usuario ficticio, para ilustrar que un usuario puede tener varios tickets. */
  usuario: string;
  aciertos: number;
}

export interface EscenarioPremio {
  esEjemplo: true;
  clave: 'A' | 'B' | 'C' | 'D' | 'E';
  descripcion: string;
  /** Tickets que intervienen en el nivel que cobra (o el máximo). Vacío si la guía no da detalle numérico. */
  tickets: TicketEjemplo[];
  /** Máximo de aciertos de la edición en el escenario. */
  maximoAciertos: number;
  /** Cantidad de tickets que se reparten el premio (0 = nadie gana). */
  ticketsGanadores: number;
  /** Cálculo: premio / tickets ganadores, 2 decimales (Art. 8.6). null si nadie cobra. */
  montoPorTicket: number | null;
  /** Totales por usuario cuando algún usuario tiene más de un ticket ganador. */
  totalPorUsuario?: { usuario: string; tickets: number; monto: number }[];
  /** Resultado tal como lo escribe la guía. */
  resultado: string;
  /** Artículos que respalda el escenario. */
  articulos: number[];
}

export const ESCENARIOS_PREMIO: EscenarioPremio[] = [
  {
    esEjemplo: true,
    clave: 'A',
    descripcion: 'Un solo ticket tiene 9 aciertos y es el máximo.',
    tickets: [{ id: 'T1', usuario: 'Usuario 1', aciertos: 9 }],
    maximoAciertos: 9,
    ticketsGanadores: 1,
    montoPorTicket: 2_500_000.0,
    resultado: 'Gana ese ticket: 2.500.000,00 Bs.',
    articulos: [7, 8],
  },
  {
    esEjemplo: true,
    clave: 'B',
    descripcion: 'Dos tickets de usuarios distintos tienen 9 aciertos.',
    tickets: [
      { id: 'T1', usuario: 'Usuario 1', aciertos: 9 },
      { id: 'T2', usuario: 'Usuario 2', aciertos: 9 },
    ],
    maximoAciertos: 9,
    ticketsGanadores: 2,
    montoPorTicket: 1_250_000.0,
    resultado: 'Cada ticket recibe 1.250.000,00 Bs.',
    articulos: [7, 8],
  },
  {
    esEjemplo: true,
    clave: 'C',
    descripcion: 'Tres tickets tienen 9 aciertos; dos son del mismo usuario.',
    tickets: [
      { id: 'T1', usuario: 'Usuario 1', aciertos: 9 },
      { id: 'T2', usuario: 'Usuario 1', aciertos: 9 },
      { id: 'T3', usuario: 'Usuario 2', aciertos: 9 },
    ],
    maximoAciertos: 9,
    ticketsGanadores: 3,
    montoPorTicket: 833_333.33,
    totalPorUsuario: [
      { usuario: 'Usuario 1', tickets: 2, monto: 1_666_666.66 },
      { usuario: 'Usuario 2', tickets: 1, monto: 833_333.33 },
    ],
    resultado:
      'Cada ticket recibe 833.333,33 Bs. El usuario con dos tickets cobra 1.666.666,66 Bs.',
    articulos: [7, 8],
  },
  {
    esEjemplo: true,
    clave: 'D',
    descripcion: 'Un ticket con 9 aciertos y varios con 7 y 8.',
    // La guía no da la cantidad de tickets con 7 y 8 ("varios"): no se inventa.
    tickets: [{ id: 'T1', usuario: 'Usuario 1', aciertos: 9 }],
    maximoAciertos: 9,
    ticketsGanadores: 1,
    montoPorTicket: 2_500_000.0,
    resultado: 'Gana solo el de 9. Los de 7 y 8 no cobran.',
    articulos: [7],
  },
  {
    esEjemplo: true,
    clave: 'E',
    descripcion: 'El máximo de la edición es 6 aciertos y no hubo partidos suspendidos.',
    tickets: [],
    maximoAciertos: 6,
    ticketsGanadores: 0,
    montoPorTicket: null,
    resultado:
      'Nadie gana, porque el mínimo es 7. El premio no se entrega ni se acumula.',
    articulos: [7],
  },
];

/** Regla de cálculo para la calculadora futura (Art. 8.6): premio / ganadores, 2 decimales. */
export const REGLA_CALCULO_PREMIO =
  'Cada parte = premio total dividido entre el número de tickets ganadores, con dos decimales. Un usuario con varios tickets ganadores recibe una parte por ticket.';

/** C.3 Prórroga y penales. */
export const EJEMPLO_PRORROGA_PENALES = {
  esEjemplo: true,
  filas: [
    { situacion: 'Gana el local 2-1 en el minuto 90+3', cuenta: 'Local' },
    { situacion: '1-1 a los 90 minutos y gana el local en prórroga', cuenta: 'Empate' },
    { situacion: '0-0 a los 90 minutos y gana el visitante por penales', cuenta: 'Empate' },
  ],
} as const;

/** C.4 Qué pasa si se suspenden partidos. */
export const EJEMPLO_SUSPENDIDOS_C4 = {
  esEjemplo: true,
  filas: [
    { situacion: 'Se suspende 1 partido', resultado: 'Se anula. Se juega con 9 partidos y el mínimo es 6 aciertos.' },
    { situacion: 'Se suspenden 2 partidos', resultado: 'Se anulan. Se juega con 8 partidos y el mínimo es 5 aciertos.' },
    {
      situacion: 'Se suspenden 3 o más partidos',
      resultado: 'Se cancela la Kiniela y se devuelve el dinero de todos los tickets.',
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 7. Anexo B: ejemplo de lista oficial de juegos                        */
/* ------------------------------------------------------------------ */

export const EJEMPLO_LISTA_OFICIAL = {
  esEjemplo: true,
  edicion: 'Domingo de Clásicos y Élite Europea',
  inicio: '20/09/2026, 09:00 a. m.',
  finalizacion: '20/09/2026, 05:30 p. m.',
  zonaHoraria: 'hora de Venezuela (UTC-4)',
  cierreVenta: '08:59 a. m.',
  partidos: [
    { n: 1, liga: 'Premier League', partido: 'Man City vs. Sunderland', hora: '09:00 a. m.' },
    { n: 2, liga: 'Premier League', partido: 'Bournemouth vs. Liverpool', hora: '09:00 a. m.' },
    { n: 3, liga: 'Bundesliga', partido: 'Leverkusen vs. Leipzig', hora: '09:30 a. m.' },
    { n: 4, liga: 'LaLiga', partido: 'Atl. Madrid vs. Real Madrid', hora: '10:15 a. m.' },
    { n: 5, liga: 'Premier League', partido: 'Fulham vs. Man Utd', hora: '11:30 a. m.' },
    { n: 6, liga: 'Serie A', partido: 'Juventus vs. Atalanta', hora: '12:00 p. m.' },
    { n: 7, liga: 'LaLiga', partido: 'Villarreal vs. Levante', hora: '12:30 p. m.' },
    { n: 8, liga: 'Serie A', partido: 'Milan vs. Lecce', hora: '02:45 p. m.' },
    { n: 9, liga: 'Ligue 1', partido: 'Marseille vs. PSG', hora: '02:45 p. m.' },
    { n: 10, liga: 'Liga Portugal', partido: 'Porto vs. Benfica', hora: '03:30 p. m.' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 8. Anexo D: glosario                                                 */
/* ------------------------------------------------------------------ */

export const GLOSARIO: { termino: string; significado: string }[] = [
  { termino: 'Kiniela / Quiniela', significado: 'Juego en el que se pronostica el resultado de varios partidos.' },
  { termino: 'Edición', significado: 'Cada Kiniela publicada, con nombre, código, premio y costo propios.' },
  { termino: 'Ticket', significado: 'Tu boleto con los 10 pronósticos.' },
  { termino: 'Pronóstico / Jugada', significado: 'La opción que eliges para un partido: Local, Empate o Visitante.' },
  { termino: 'Acierto', significado: 'Un pronóstico que coincide con el resultado real.' },
  { termino: 'Local', significado: 'El equipo que juega en casa. Aparece a la izquierda.' },
  { termino: 'Visitante', significado: 'El equipo que juega fuera de casa. Aparece a la derecha.' },
  { termino: 'EMP / E', significado: 'Empate.' },
  {
    termino: 'Tiempo reglamentario',
    significado:
      'Los 90 minutos del partido más el tiempo agregado por el árbitro. No incluye prórroga ni penales.',
  },
  {
    termino: 'Tiempo de reposición',
    significado: 'Minutos extra que el árbitro añade al final de cada tiempo.',
  },
  {
    termino: 'Prórroga',
    significado: 'Tiempo extra que se juega en algunas eliminatorias si hay empate. No cuenta.',
  },
  { termino: 'Penales', significado: 'Definición por tiros desde el punto penal. No cuentan.' },
  { termino: 'Primer pitazo', significado: 'El comienzo del primer partido de la lista.' },
  { termino: 'Premio total / Acumulado', significado: 'El monto fijo que se reparte en la edición.' },
  {
    termino: 'Taquilla',
    significado: 'La ventanilla digital de Liga Kiniela dentro de la plataforma aliada.',
  },
  {
    termino: 'Plataforma aliada',
    significado: 'La página de apuestas donde juegas y donde está tu saldo.',
  },
  {
    termino: 'Balance / Saldo',
    significado: 'El dinero disponible en tu cuenta de la plataforma aliada.',
  },
  { termino: 'Partido anulado', significado: 'Partido suspendido que deja de contar en la Kiniela.' },
  {
    termino: 'Cancelación',
    significado: 'Anulación de toda la edición, con devolución del dinero de los tickets.',
  },
  {
    termino: 'Edición gratuita',
    significado: 'Edición con costo de ticket de 0 Bs. Un ticket por usuario.',
  },
];

/* ------------------------------------------------------------------ */
/* 9. Anexo E: preguntas frecuentes (completo, en el orden de la guía)  */
/* ------------------------------------------------------------------ */

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export const FAQ: PreguntaFrecuente[] = [
  { pregunta: '¿Necesito saber mucho de fútbol?', respuesta: 'No. Solo debes decidir en cada partido quién ganará o si habrá empate.' },
  { pregunta: '¿Cuántos partidos debo marcar?', respuesta: 'Los 10. No se puede jugar un ticket incompleto.' },
  { pregunta: '¿Puedo elegir dos opciones en el mismo partido?', respuesta: 'No. Una sola por partido, en cada ticket.' },
  { pregunta: '¿Puedo jugar varios tickets?', respuesta: 'Sí, los que quieras. En ediciones gratuitas, solo uno por usuario.' },
  { pregunta: '¿Hasta qué hora puedo jugar?', respuesta: 'Hasta 1 minuto antes del primer partido de la lista.' },
  { pregunta: '¿Puedo cambiar mi ticket después de jugarlo?', respuesta: 'No. Los tickets jugados no se modifican ni se anulan.' },
  { pregunta: '¿Cuántos aciertos necesito para ganar?', respuesta: 'Mínimo 7, y además tener el máximo de aciertos de la edición.' },
  { pregunta: 'Tengo 8 aciertos, pero otra persona tiene 9. ¿Cobro?', respuesta: 'No. El premio va solo al nivel más alto.' },
  { pregunta: '¿Qué pasa si dos personas tienen el mismo máximo?', respuesta: 'El premio se divide en partes iguales entre los tickets.' },
  { pregunta: 'Tengo dos tickets con el máximo. ¿Cobro doble?', respuesta: 'Sí. Cada ticket ganador es una parte.' },
  { pregunta: '¿Y si nadie llega a 7 aciertos?', respuesta: 'Nadie gana. El premio no se entrega ni se acumula, y los tickets no se reembolsan.' },
  { pregunta: '¿Cuenta la prórroga o los penales?', respuesta: 'No. Solo los 90 minutos más el tiempo agregado.' },
  { pregunta: '¿Qué pasa si se suspende un partido?', respuesta: 'Se anula y el mínimo baja en 1. Si son 2, baja en 2. También se anula un partido reprogramado con más de 1 día de diferencia (regla complementaria de la edición).' },
  { pregunta: '¿Y si se suspenden 3 o más?', respuesta: 'Se cancela toda la Kiniela y se te devuelve el dinero de tus tickets.' },
  { pregunta: '¿Dónde recibo el premio?', respuesta: 'En tu saldo de la plataforma aliada donde jugaste.' },
  { pregunta: '¿Cuánto tarda en llegar el premio?', respuesta: 'No más de 24 horas después de que termine el último partido que se jugó.' },
  { pregunta: '¿Tengo que reclamar mi premio?', respuesta: 'No. Se abona automáticamente.' },
  {
    pregunta: '¿Me descuentan impuestos del premio?',
    respuesta:
      'Liga Kiniela no aplica descuentos ni retenciones. Tu plataforma tiene sus propias condiciones para el uso o retiro del saldo.',
  },
  { pregunta: '¿Puedo ver las jugadas de los demás?', respuesta: 'Sí, en Menú > Tickets Quinielas.' },
  { pregunta: '¿Dónde veo los resultados?', respuesta: 'En Menú > Resultados.' },
  { pregunta: '¿Dónde veo a los ganadores?', respuesta: 'En Menú > Campeones.' },
  { pregunta: '¿Qué hora se usa?', respuesta: 'La hora de Venezuela.' },
  {
    pregunta: '¿A quién escribo si tengo dudas?',
    respuesta: 'A aasolucionesdigitales@gmail.com o a @LigaKiniela en Instagram.',
  },
];

/* ------------------------------------------------------------------ */
/* 10. Anexo F: ficha resumen                                           */
/* ------------------------------------------------------------------ */

export const FICHA_RESUMEN: { concepto: string; detalle: string }[] = [
  { concepto: 'Producto', detalle: 'Liga Kiniela' },
  { concepto: 'Tipo de juego', detalle: 'Pronósticos de fútbol' },
  { concepto: 'País y hora', detalle: 'Venezuela, UTC-4' },
  { concepto: 'Partidos por edición', detalle: '10' },
  { concepto: 'Pronóstico por partido', detalle: 'Local, Empate o Visitante (solo una)' },
  { concepto: 'Qué cuenta', detalle: '90 minutos más tiempo agregado (sin prórroga ni penales)' },
  { concepto: 'Mínimo para ganar', detalle: '7 aciertos' },
  { concepto: 'Quién gana', detalle: 'Quien tenga el máximo de aciertos de la edición' },
  { concepto: 'Empate en el máximo', detalle: 'Premio dividido en partes iguales, una por ticket' },
  { concepto: 'Si nadie llega a 7', detalle: 'Todos pierden. Sin reembolso ni acumulación' },
  { concepto: 'Premio', detalle: 'Fijo, definido por la edición al abrir la venta' },
  { concepto: 'Costo del ticket', detalle: 'Varía por edición; 0 Bs significa edición gratuita' },
  { concepto: 'Tickets por usuario', detalle: 'Libre; uno solo en ediciones gratuitas' },
  { concepto: 'Cierre de la venta', detalle: '1 minuto antes del primer partido' },
  { concepto: 'Cambios al ticket', detalle: 'No se permiten' },
  { concepto: '1 o 2 partidos suspendidos', detalle: 'Se anulan; el mínimo baja 1 o 2' },
  { concepto: '3 o más partidos suspendidos', detalle: 'Se cancela la edición y se devuelve el dinero' },
  { concepto: 'Pago del premio', detalle: 'Automático, en no más de 24 horas, en el saldo de la plataforma' },
  { concepto: 'Reclamos de premio', detalle: 'No existen; el pago es automático' },
  { concepto: 'Edad mínima', detalle: '18 años' },
  { concepto: 'Contacto', detalle: 'aasolucionesdigitales@gmail.com y @LigaKiniela' },
];

/* ------------------------------------------------------------------ */
/* 11. Juego responsable (Art. 20) y naturaleza del servicio (Art. 13)  */
/* ------------------------------------------------------------------ */

export const JUEGO_RESPONSABLE = {
  articulo: 20,
  edadMinima: 18,
  /** Texto fiel del Art. 20. */
  parrafos: [
    'Liga Kiniela promueve el juego responsable. Juega solo con dinero que puedas permitirte perder. Los pronósticos no garantizan ganancias.',
    'Si sientes que pierdes el control, deja de jugar y busca ayuda profesional. Puedes pedir a tu plataforma aliada herramientas de límites o autoexclusión.',
    'Está prohibida la participación de menores de edad.',
  ],
} as const;

export const NATURALEZA_SERVICIO = {
  articulo: 13,
  /** Resumen fiel del Art. 13 para el público. */
  parrafos: [
    'Liga Kiniela es un producto de pronósticos que se ofrece a través de plataformas aliadas. La cuenta del usuario, su saldo, los depósitos y los retiros son gestionados por la plataforma aliada correspondiente y se rigen también por los términos de esa plataforma.',
    'El usuario es responsable de conocer y cumplir los términos de la plataforma aliada en la que juega.',
    'Liga Kiniela no es responsable de las políticas de depósito, retiro, verificación de identidad o cierre de cuentas de las plataformas aliadas.',
  ],
  /** Fórmula de la web (derivada de Art. 13 y sección 1.2): esta página informa; no se juega aquí. */
  enUnaFrase:
    'Esta página solo informa. Liga Kiniela se juega dentro de las plataformas aliadas.',
} as const;

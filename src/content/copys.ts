/**
 * Textos de apoyo de la web, en tono de marca: profesional, enérgico, nocturno, prestigioso.
 * Reglas de contenido: sin cifras ni plazos fuera de la guía v2.0. Hora siempre
 * "hora de Venezuela" (sin siglas técnicas). Esta web informa; el juego ocurre en la plataforma aliada.
 */

export const HORA_VENEZUELA = 'hora de Venezuela';

/** Boleto de práctica (P1): rótulo de la imagen compartible. El rótulo visible vive en BOLETO.rotulo. */
export const PRACTICA = {
  /** Rótulo para la imagen compartible. */
  rotuloTarjeta: 'EJERCICIO DE EJEMPLO · No es una jugada registrada',
} as const;

/** Llamadas a la acción. Los botones abren el sitio oficial del aliado (D5). */
export const CTA = {
  verTerminos: 'Términos y Condiciones',
} as const;

/** Estados de la Kiniela (próxima / abierta / cerrada). */
export const ESTADOS_KINIELA = {
  proxima: {
    etiqueta: 'Próxima',
    cuentaRegresiva: 'Abre en',
  },
  abierta: {
    etiqueta: 'Venta abierta',
    cuentaRegresiva: 'Cierra en',
  },
  cerrada: {
    etiqueta: 'Venta cerrada',
    cuentaRegresiva: 'Cerrada',
  },
} as const;

/** Textos de horario. */
export const HORARIOS = {
  porConfirmar: 'Horario por confirmar',
} as const;

/** Datos de la ficha de la edición, rótulos. */
export const FICHA = {
  premio: 'Premio total',
} as const;

/** Franja de juego responsable (fija, pequeña, sin modal). */
export const JUEGO_RESPONSABLE_FRANJA = {
  etiquetaEdad: '+18',
  lema: 'Juega con moderación',
  informa:
    'Esta página solo informa; el juego ocurre en el sitio de tu plataforma aliada.',
  pie: 'Juega solo con dinero que puedas permitirte perder. Los pronósticos no garantizan ganancias. Está prohibida la participación de menores de edad.',
} as const;

/** Mensajes de marca usados en la web. */
export const MARCA = {
  eslogan: 'Pronostica. Marca tus 10. Gana el máximo.',
  contactoTitulo: 'Contacto',
} as const;

/** Boleto de práctica (M3b). Cada mensaje vive en un solo lugar: ver docs/M3-mapa-de-mensajes.md. */
export const BOLETO = {
  titulo: 'Prueba tu boleto',
  subtitulo: 'Marca Local, E o Visitante en cada partido y mira cómo te quedaría el boleto.',
  /** Rótulo obligatorio: aparece UNA vez en el boleto (y dentro de la imagen para compartir). */
  rotulo: 'EJERCICIO DE EJEMPLO · no es una jugada registrada. Para jugar, ve a una plataforma aliada',
  talon: 'Talón',
  cartelera: 'Los 10 partidos del boleto',
  marcados: 'marcados',
  anuncio: (n: number, total: number) =>
    n >= total ? `Boleto completo: ${total} de ${total} partidos marcados.` : `${n} de ${total} partidos marcados.`,
  /** Mínimo para ganar según partidos suspendidos (Art. 9 de la guía). */
  minimo: (suspendidos: number, minimo: number) => {
    if (suspendidos >= 3) {
      return `Hay ${suspendidos} partidos suspendidos: la Kiniela se cancela y se devuelve el dinero.`;
    }
    if (suspendidos > 0) {
      return `Para ganar necesitas ${minimo} aciertos como mínimo (hay ${suspendidos} ${suspendidos === 1 ? 'partido suspendido' : 'partidos suspendidos'}).`;
    }
    return `Para ganar necesitas ${minimo} aciertos como mínimo.`;
  },
  opciones: { L: 'Local', E: 'E', V: 'Visitante' },
  opcionAria: (n: number, opcion: string) => `Partido ${n}: ${opcion}`,
  grupoAria: (n: number, local: string, visitante: string) => `Partido ${n}: ${local} contra ${visitante}`,
  marcado: 'marcado',
  reiniciar: 'Reiniciar',
  reiniciado: 'Boleto reiniciado.',
  compartir: 'Compartir mi boleto',
  generando: 'Preparando imagen…',
  compartirError: 'No pudimos preparar la imagen. Inténtalo de nuevo.',
  descargar: 'Descargar',
  compartirAccion: 'Compartir',
  vistaPreviaTitulo: 'Así se verá tu boleto',
  cerrar: 'Cerrar',
  imagenAlt: 'Imagen de tu boleto de práctica, lista para compartir',
  tituloCompartir: 'Mi boleto de práctica · Liga Kiniela',
  textoCompartir: 'Mi ejercicio de ejemplo en Liga Kiniela. No es una jugada registrada. @LigaKiniela',
  celebracionTitulo: 'Boleto completo',
  celebracionTexto: 'Marcaste los 10. ¿Listo para jugarlo de verdad?',
  elegirPlataforma: 'Elegir plataforma',
  /** Solo cuando la Kiniela aún no abre o ya cerró (si está abierta, el Hero lo dice todo). */
  estado: {
    proxima: 'Todavía no abre la venta, pero ya puedes practicar.',
    cerrada: 'La venta ya cerró. Puedes seguir practicando.',
  },
  avisoPartidos: (armados: number, total: number) => `Solo pudimos mostrar ${armados} de ${total} partidos de esta Kiniela.`,
  /** Una sola vez en la cabecera, no en cada línea. */
  horariosPorConfirmar: 'Horarios de los partidos por confirmar.',
  horariosZona: 'Horas en hora de Venezuela.',
  porConfirmar: 'Por confirmar',
  suspendidoNota: 'Partido suspendido: no cuenta.',
  acierto: 'Acierto',
  fallo: 'Fallo',
  resultado: 'Resultado',
  aciertosPractica: (aciertos: number, definidos: number) =>
    `Hasta ahora tendrías ${aciertos} ${aciertos === 1 ? 'acierto' : 'aciertos'} en ${definidos} ${definidos === 1 ? 'partido con resultado' : 'partidos con resultado'}`,
  cargando: 'Cargando el boleto',
  errorBoleto: 'El boleto aparece cuando carga la Kiniela.',
  reintentar: 'Reintentar',
  vacio: 'El boleto aparece cuando hay una Kiniela activa.',
  sinPartidos: 'Esta Kiniela todavía no tiene partidos para mostrar.',
  selector: 'Kinielas activas',
} as const;

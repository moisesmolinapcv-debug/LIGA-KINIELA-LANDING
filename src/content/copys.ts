/**
 * Textos de apoyo de la web, en tono de marca: profesional, enérgico, nocturno, prestigioso.
 * Reglas de contenido: sin cifras ni plazos fuera de la guía v2.0. Hora siempre
 * "hora de Venezuela" (sin siglas técnicas). Esta web informa; el juego ocurre en la plataforma aliada.
 */

export const HORA_VENEZUELA = 'hora de Venezuela';

/** Boleto de práctica (P1): debe quedar clarísimo que es un EJERCICIO DE EJEMPLO. */
export const PRACTICA = {
  titulo: 'Prueba tu boleto',
  rotuloFijo: 'EJERCICIO DE EJEMPLO',
  aviso:
    'Boleto de práctica: no es una jugada registrada. Para jugar, ve a una plataforma aliada.',
  avisoLargo:
    'Esto es un ejercicio de ejemplo. Tus pronósticos se guardan solo en este dispositivo y no participan en ninguna Kiniela. Para jugar de verdad, entra a una plataforma aliada y busca la taquilla de Liga Kiniela.',
  instruccion: 'Marca Local, E o Visitante en los 10 partidos.',
  contador: (marcados: number) => `${marcados}/10 marcados`,
  completo: 'Boleto de práctica completo. Recuerda: es solo un ejercicio.',
  incompleto: 'Te faltan partidos por marcar. En la taquilla real hacen falta los 10.',
  guardado: 'Guardado solo en tu dispositivo.',
  reiniciar: 'Empezar de nuevo',
  compartir: 'Compartir mi ejercicio',
  /** Rótulo para la imagen compartible. */
  rotuloTarjeta: 'EJERCICIO DE EJEMPLO · No es una jugada registrada',
  etiquetaInstagram: '@LigaKiniela',
  opciones: { local: 'Local', empate: 'E', visitante: 'Visitante' },
} as const;

/** Llamadas a la acción. Los botones abren el sitio oficial del aliado (D5). */
export const CTA = {
  principal: 'Elige tu plataforma y juega',
  jugarEn: (aliado: string) => `Jugar en ${aliado}`,
  verAliados: 'Ver plataformas aliadas',
  comoJugar: 'Cómo jugar en 7 pasos',
  verReglas: 'Ver reglas',
  verTerminos: 'Términos y Condiciones',
  abreSitioOficial: 'Se abre el sitio oficial de la plataforma.',
  siguenosInstagram: 'Síguenos en Instagram',
  juegaEnTuPlataforma: 'El juego ocurre en tu plataforma aliada.',
} as const;

/** Estados de la Kiniela (próxima / abierta / cerrada). */
export const ESTADOS_KINIELA = {
  proxima: {
    etiqueta: 'Próxima',
    descripcion: 'La venta aún no abre.',
    cuentaRegresiva: 'Abre en',
  },
  abierta: {
    etiqueta: 'Venta abierta',
    descripcion: 'Ya puedes jugar desde tu plataforma aliada.',
    cuentaRegresiva: 'Cierra en',
  },
  cerrada: {
    etiqueta: 'Venta cerrada',
    descripcion: 'La venta de esta Kiniela ya cerró.',
    cuentaRegresiva: 'Cerrada',
  },
} as const;

/** Textos de horario y cierre. */
export const HORARIOS = {
  zona: HORA_VENEZUELA,
  cierre: 'La venta cierra 1 minuto antes del primer partido.',
  noEsperes: 'No esperes al último segundo: una conexión lenta puede dejarte sin jugar.',
  porConfirmar: 'Horario por confirmar',
  cierraA: (hora: string) => `Cierra a las ${hora} (${HORA_VENEZUELA})`,
} as const;

/** Datos de la ficha de la edición, rótulos. */
export const FICHA = {
  premio: 'Premio total',
  costo: 'Costo del ticket',
  gratuita: 'Edición gratuita: un ticket por usuario',
  juegos: '10 partidos',
  inicio: 'Inicio',
  finalizacion: 'Finalización',
  reglaGanador: 'Gana el máximo de aciertos, con un mínimo de 7',
} as const;

/** Franja de juego responsable (fija, pequeña, sin modal). */
export const JUEGO_RESPONSABLE_FRANJA = {
  etiquetaEdad: '+18',
  lema: 'Juega con moderación',
  informa:
    'Esta página solo informa; el juego ocurre en el sitio de tu plataforma aliada.',
  linea: '+18 · Juega con moderación · Esta página solo informa; el juego ocurre en el sitio de tu plataforma aliada.',
  pie: 'Juega solo con dinero que puedas permitirte perder. Los pronósticos no garantizan ganancias. Está prohibida la participación de menores de edad.',
} as const;

/** Mensajes de marca por sección. */
export const MARCA = {
  eslogan: 'Pronostica. Marca tus 10. Gana el máximo.',
  heroTitulo: 'La taquilla abre de noche',
  heroSubtitulo:
    'Marca los 10 partidos, elige tu plataforma aliada y juega. Gana quien consiga más aciertos, con un mínimo de 7.',
  reglasTitulo: 'Cómo se juega',
  reglasSubtitulo: 'Sin letra pequeña: 10 partidos, una opción por partido, el máximo de aciertos se lleva el premio.',
  premioLlega: 'Tu premio llega solo: se abona automáticamente en tu saldo, en no más de 24 horas después del último partido. No hay trámite de reclamo.',
  faqTitulo: 'Preguntas frecuentes',
  faqSubtitulo: 'Respuestas directas, tomadas de la guía oficial de Liga Kiniela.',
  aliadosTitulo: '¿Dónde jugar?',
  aliadosSubtitulo:
    'Liga Kiniela se juega dentro de nuestras plataformas aliadas. Elige la tuya y entra a su sitio oficial.',
  aliadosNota:
    'Necesitas un usuario y saldo en la plataforma que elijas. La lista puede ampliarse; la vigente es la que se muestre en los canales oficiales de Liga Kiniela.',
  terminosTitulo: 'Términos y Condiciones',
  reglamentoTitulo: 'Reglamento oficial',
  contactoTitulo: 'Contacto',
  guiaVersion: 'Guía oficial v2.0',
} as const;

/** Recordatorio de cierre dentro de la página. */
export const RECORDATORIO = {
  poco: 'Queda poco para el cierre de ventas.',
  cierraEn: (tiempo: string) => `Cierra en ${tiempo}`,
} as const;

/** Calculadora "¿Cuánto cobro?" (a partir del Anexo C de la guía). */
export const CALCULADORA = {
  titulo: '¿Cuánto cobro?',
  aviso:
    'Cálculo de ejemplo con montos ilustrativos. El premio real es el que ves en la taquilla de cada edición.',
  regla: 'Cada parte = premio total entre el número de tickets ganadores, con dos decimales.',
  sinGanador: 'Si nadie llega al mínimo, nadie gana: el premio no se entrega ni se acumula.',
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
  minimoCorto: (minimo: number) => `mín. ${minimo}`,
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

/**
 * Reglamento (Parte III, Art. 1-11) y Términos y Condiciones (Parte IV, Art. 12-26)
 * de la GUÍA LIGA KINIELA v2.0. Texto fiel a la guía; solo se estructura.
 * Fuente: docs/GUIA_LIGA_KINIELA_v2.md. La guía manda sobre cualquier otra fuente (D3).
 * Art. 11.3: las explicaciones "En palabras simples" y los ejemplos son informativos;
 * si hay diferencia, prevalece el texto del artículo.
 */

export interface TablaContenido {
  encabezados: string[];
  filas: string[][];
}

export interface ArticuloGuia {
  /** Número de artículo, para citarlo ("Art. 7"). */
  articulo: number;
  titulo: string;
  /** Un párrafo por elemento; los incisos (a, b, c) van como elementos separados. */
  parrafos: string[];
  /** Frase "En palabras simples" de la guía, cuando existe (informativa, Art. 11.3). */
  enPalabrasSimples?: string;
  /** Ejemplo de la guía, cuando existe. Es ilustrativo. */
  ejemplo?: string;
  tabla?: TablaContenido;
  /**
   * Regla complementaria de la edición (Q1, PLAN §10). Se muestra aparte del texto de la guía v2.0
   * hasta que salga la guía v2.1. No forma parte de los párrafos oficiales.
   */
  complementaria?: { titulo: string; texto: string };
}

export const VERSION_GUIA = {
  version: '2.0',
  emision: '27 de octubre de 2026',
  pais: 'Venezuela',
  horaOficial: 'Venezuela (UTC-4)',
} as const;

/** PARTE III. REGLAMENTO OFICIAL (Art. 1 a 11) */
export const REGLAMENTO: ArticuloGuia[] = [
  {
    articulo: 1,
    titulo: 'Objeto',
    parrafos: [
      'Este Reglamento regula la organización, el desarrollo, la determinación de ganadores y el pago de premios de cada edición de Liga Kiniela.',
    ],
  },
  {
    articulo: 2,
    titulo: 'Estructura de cada edición',
    parrafos: [
      '2.1. Cada edición consta de diez (10) partidos de fútbol seleccionados y publicados por Liga Kiniela.',
      '2.2. Cada edición tiene nombre, código, premio total y costo de ticket propios, publicados en la taquilla.',
      '2.3. El inicio de la edición es la hora del primer partido de la lista. La finalización es la hora en que termina el último partido.',
      '2.4. La lista de partidos publicada en la taquilla es la lista oficial de la edición. Indica, para cada partido: número, fecha, hora, liga o torneo y encuentro.',
      '2.5. Todos los horarios están expresados en hora de Venezuela (UTC-4).',
    ],
  },
  {
    articulo: 3,
    titulo: 'Pronósticos',
    parrafos: [
      '3.1. En cada partido el usuario debe elegir una (1) sola de estas tres opciones: Local, Empate (E) o Visitante.',
      '3.2. El ticket debe incluir un pronóstico para cada uno de los diez (10) partidos. No se registran tickets incompletos.',
      '3.3. No se puede marcar más de una opción por partido dentro de un mismo ticket.',
      '3.4. Un usuario puede jugar combinaciones distintas en tickets distintos. Cada ticket se evalúa de forma independiente.',
    ],
    enPalabrasSimples: 'Un ticket = 10 respuestas, una por partido, ninguna en blanco.',
  },
  {
    articulo: 4,
    titulo: 'Tickets',
    parrafos: [
      '4.1. Cantidad. El número de tickets por usuario es libre, excepto en las ediciones con costo de ticket de 0 Bs (gratuitas), donde solo se permite un (1) ticket por usuario.',
      '4.2. Período de venta. El usuario puede crear tickets desde la publicación de la Kiniela hasta un (1) minuto antes del primer pitazo inicial. Pasado ese límite no se aceptan nuevos tickets.',
      '4.3. Firmeza. Al presionar "Jugar quiniela", el ticket queda registrado y su costo se descuenta del saldo del usuario. Los tickets registrados no pueden modificarse ni anularse, salvo los casos de cancelación de la edición previstos en los Artículos 9 y 18.',
      '4.4. Registro válido. El ticket registrado en los sistemas de Liga Kiniela es el único válido para determinar aciertos y premios. El usuario puede consultarlo en Historial.',
    ],
    enPalabrasSimples:
      'Puedes comprar los tickets que quieras hasta 1 minuto antes de que empiece el primer partido. Una vez jugado, tu ticket no se cambia.',
  },
  {
    articulo: 5,
    titulo: 'Qué parte del partido cuenta',
    parrafos: [
      '5.1. Para efectos de la Kiniela cuentan únicamente los noventa (90) minutos reglamentarios más el tiempo de reposición (tiempo agregado por el árbitro).',
      '5.2. No cuentan la prórroga (tiempo extra) ni los penales.',
      '5.3. El resultado de cada partido es:',
      'Local: el equipo local gana al terminar el tiempo reglamentario.',
      'Empate (E): el marcador está igualado al terminar el tiempo reglamentario.',
      'Visitante: el equipo visitante gana al terminar el tiempo reglamentario.',
    ],
    tabla: {
      encabezados: ['Situación real', 'Resultado que cuenta'],
      filas: [
        ['Gana el local 2-1 (gol al minuto 90+3)', 'Local'],
        ['1-1 a los 90 minutos; el local gana en prórroga', 'Empate'],
        ['0-0 a los 90 minutos; el visitante gana por penales', 'Empate'],
        ['Gana el visitante 0-1', 'Visitante'],
      ],
    },
    enPalabrasSimples:
      'Mira el marcador cuando el árbitro pita el final de los 90 minutos (más lo agregado). Eso es lo que cuenta. Lo que pase después, no.',
  },
  {
    articulo: 6,
    titulo: 'Aciertos',
    parrafos: [
      '6.1. Un pronóstico es un acierto cuando coincide con el resultado del partido determinado conforme al Artículo 5.',
      '6.2. Cada ticket suma un (1) acierto por cada partido acertado, con un máximo de diez (10).',
      '6.3. Los resultados se toman de las fuentes oficiales de resultados que utilice Liga Kiniela y se publican en la sección Resultados de la taquilla. Si el organizador de la competición corrige oficialmente un resultado antes de pagar el premio, prevalece el resultado corregido.',
    ],
  },
  {
    articulo: 7,
    titulo: 'Quién gana',
    parrafos: [
      '7.1. Mínimo para ganar. Solo pueden ganar los tickets con siete (7) o más aciertos (7, 8, 9 o 10), sin perjuicio de lo dispuesto en el Artículo 9 para partidos anulados.',
      '7.2. Gana el máximo. Ganan los tickets con el mayor número de aciertos de la edición, siempre que alcance el mínimo.',
      '7.3. Solo el nivel más alto cobra. El premio se otorga exclusivamente al nivel de aciertos más alto alcanzado. Los tickets con menos aciertos que el máximo no reciben premio, aunque hayan llegado al mínimo.',
      '7.4. Empate en el máximo. Si más de un ticket alcanza el máximo de aciertos (7, 8, 9 o 10), el premio se reparte en partes iguales entre todos esos tickets.',
      '7.5. Un usuario con varios tickets. Cada ticket ganador cuenta como una parte del reparto. Un usuario con dos tickets ganadores recibe dos partes.',
      '7.6. Sin ganador. Si ningún ticket alcanza el mínimo para ganar, todos los participantes se consideran perdedores. En ese caso el premio no se entrega, no se acumula a otra edición y los tickets no se reembolsan.',
    ],
    enPalabrasSimples:
      'Imagina una escalera de 0 a 10 aciertos. Solo cuenta el escalón más alto que alguien alcanzó, y solo si es el 7 o más. Todos los que estén en ese escalón se reparten el premio a partes iguales. Si nadie llega al 7, nadie gana.',
    ejemplo:
      'Premio de 2.500.000 Bs. Resultados: un ticket con 9 aciertos, tres tickets con 8 y muchos con 7. Gana solo el ticket de 9 aciertos y se lleva los 2.500.000 Bs. Los de 8 y 7 aciertos no cobran, porque hay un ticket en un escalón más alto. (Montos de ejemplo, solo para explicar.)',
  },
  {
    articulo: 8,
    titulo: 'Premio',
    parrafos: [
      '8.1. El premio total de cada edición es fijo. Lo establece la edición desde su apertura a la venta y se publica en la taquilla como "Premio total" o "Acumulado". Varía entre ediciones y no cambia por la cantidad de tickets vendidos.',
      '8.2. El premio se expresa en bolívares (Bs).',
      '8.3. Pago automático. El premio se abona automáticamente en el balance del usuario de la plataforma aliada donde jugó el ticket ganador, en un plazo no mayor de veinticuatro (24) horas contadas desde que termina el último partido realmente jugado de la edición.',
      '8.4. No existe trámite de reclamo del premio. El usuario no necesita solicitar ni reclamar nada: el premio se abona por sí solo.',
      '8.5. Liga Kiniela no aplica descuentos, retenciones ni impuestos sobre el premio. Las condiciones de uso o retiro del saldo acreditado son las de cada plataforma aliada.',
      '8.6. Cuando haya reparto, el monto de cada parte se calcula dividiendo el premio total entre el número de tickets ganadores, con dos decimales.',
    ],
    enPalabrasSimples:
      'El premio es un monto fijo que se anuncia desde el principio. Si ganas, el dinero aparece solo en tu saldo en no más de 24 horas después de que termine el último partido que se jugó.',
  },
  {
    articulo: 9,
    titulo: 'Partidos suspendidos',
    parrafos: [
      '9.1. Definición. Se considera suspendido el partido que, por cualquier causa (postergación, suspensión, abandono o cancelación), no se juega o no completa el tiempo reglamentario en la fecha programada.',
      '9.2. Uno (1) o dos (2) partidos suspendidos. Esos partidos se anulan: no cuentan para ningún ticket, ni como acierto ni como fallo. La edición continúa con los partidos restantes y el mínimo para ganar baja en la misma cantidad de partidos anulados.',
      '9.3. Tres (3) o más partidos suspendidos. Se cancela toda la Kiniela y se devuelve a cada usuario el dinero invertido en tickets, en su balance de la plataforma aliada.',
    ],
    tabla: {
      encabezados: ['Partidos suspendidos', 'Partidos que cuentan', 'Mínimo para ganar', 'Qué pasa'],
      filas: [
        ['0', '10', '7 aciertos', 'Edición normal.'],
        ['1', '9', '6 aciertos', 'El partido se anula. La edición sigue.'],
        ['2', '8', '5 aciertos', 'Los dos partidos se anulan. La edición sigue.'],
        ['3 o más', 'Ninguno', 'No aplica', 'Se cancela la Kiniela y se devuelve el dinero de todos los tickets.'],
      ],
    },
    enPalabrasSimples:
      'Si se cae algún partido (lluvia, suspensión, etc.), ese partido se borra de la Kiniela para todos y se ajusta el mínimo. Si se caen 3 o más, se anula todo y recuperas lo que pagaste.',
    ejemplo:
      'Se suspende 1 partido. La Kiniela se juega con 9 partidos y el mínimo para ganar es 6. Si el mejor ticket tiene 8 aciertos sobre 9, ese ticket gana.',
    complementaria: {
      titulo: 'Partido reprogramado',
      texto:
        'Un partido reprogramado con más de 1 día de diferencia respecto a su fecha programada se considera anulado, igual que un partido suspendido: se aplica lo previsto en este artículo.',
    },
  },
  {
    articulo: 10,
    titulo: 'Transparencia',
    parrafos: [
      '10.1. Los tickets de los participantes pueden consultarse en Tickets Quinielas, para la edición actual y para ediciones anteriores.',
      '10.2. Los marcadores en vivo y los resultados finales se consultan en Resultados.',
      '10.3. Los ganadores de cada edición se publican en Campeones.',
    ],
  },
  {
    articulo: 11,
    titulo: 'Casos no previstos',
    parrafos: [
      '11.1. Cualquier situación no prevista en este Reglamento será resuelta por Liga Kiniela con criterios de equidad y buena fe, y de la misma manera para todos los participantes.',
      '11.2. Liga Kiniela puede publicar reglas particulares para una edición. Prevalecen sobre este Reglamento solo en lo que regulen expresamente y se publican en la taquilla antes de abrir la venta.',
      '11.3. Las explicaciones en lenguaje sencillo ("En palabras simples", ejemplos y guías) tienen fines informativos. Si hubiera alguna diferencia con el texto de los artículos, prevalece el texto del artículo.',
    ],
  },
];

/** PARTE IV. TÉRMINOS Y CONDICIONES DE USO (Art. 12 a 26) */
export const TERMINOS: ArticuloGuia[] = [
  {
    articulo: 12,
    titulo: 'Aceptación',
    parrafos: [
      '12.1. Al registrar un ticket, el usuario declara que ha leído, entendido y aceptado este documento completo (Información General, Cómo Jugar, Reglamento y Términos y Condiciones).',
      '12.2. Si el usuario no está de acuerdo con alguna parte, debe abstenerse de jugar.',
    ],
    enPalabrasSimples: 'Al presionar "Jugar quiniela" estás confirmando que leíste y aceptas estas reglas.',
  },
  {
    articulo: 13,
    titulo: 'Naturaleza del servicio y plataformas aliadas',
    parrafos: [
      '13.1. Liga Kiniela es un producto de pronósticos que se ofrece a través de plataformas aliadas (Anexo A). La cuenta del usuario, su saldo, los depósitos y los retiros son gestionados por la plataforma aliada correspondiente y se rigen también por los términos de esa plataforma.',
      '13.2. El usuario es responsable de conocer y cumplir los términos de la plataforma aliada en la que juega.',
      '13.3. Liga Kiniela no es responsable de las políticas de depósito, retiro, verificación de identidad o cierre de cuentas de las plataformas aliadas.',
    ],
  },
  {
    articulo: 14,
    titulo: 'Quién puede jugar',
    parrafos: [
      '14.1. El usuario debe ser mayor de dieciocho (18) años.',
      '14.2. El usuario debe jugar desde Venezuela, y es su responsabilidad verificar que su participación sea legal donde se encuentre.',
      '14.3. El usuario debe tener una cuenta activa y con saldo en una plataforma aliada (salvo en ediciones gratuitas, donde basta tener cuenta activa).',
      '14.4. No pueden participar los empleados y directivos de Liga Kiniela, ni quienes tengan acceso a información privilegiada sobre los partidos.',
    ],
  },
  {
    articulo: 15,
    titulo: 'Conducta del usuario',
    parrafos: [
      '15.1. El usuario debe dar datos verdaderos y mantenerlos actualizados (opción Editar Usuario).',
      '15.2. El usuario es el único responsable de mantener en secreto sus credenciales y de todo lo que ocurra desde su cuenta.',
      '15.3. Está prohibido:',
      'a) Usar programas, bots o scripts para registrar tickets.',
      'b) Manipular, o intentar manipular, resultados, sistemas o datos.',
      'c) Ponerse de acuerdo con otros participantes para alterar la competencia.',
      'd) Usar la cuenta de otra persona.',
      'e) Cualquier acto fraudulento o contrario a la buena fe.',
      '15.4. Si hay indicios de incumplimiento, Liga Kiniela puede anular los tickets afectados, negar el premio y solicitar a la plataforma aliada la suspensión de la cuenta, sin perjuicio de otras acciones.',
    ],
  },
  {
    articulo: 16,
    titulo: 'Pagos y saldo',
    parrafos: [
      '16.1. El costo del ticket se descuenta del saldo del usuario al presionar "Jugar quiniela". Si el saldo es insuficiente, el ticket no se registra.',
      '16.2. Los premios y devoluciones se abonan en el balance del usuario en la plataforma aliada correspondiente.',
      '16.3. El uso o retiro del saldo abonado se rige por los términos de la plataforma aliada.',
      '16.4. Los premios no son transferibles ni canjeables por conceptos distintos al previsto en este documento.',
    ],
  },
  {
    articulo: 17,
    titulo: 'Información publicada',
    parrafos: [
      '17.1. La información de cada edición (partidos, horarios, premio, costo) es la que se muestra en la taquilla. El usuario debe revisarla antes de jugar.',
      '17.2. Todos los horarios se expresan en hora de Venezuela (UTC-4).',
    ],
  },
  {
    articulo: 18,
    titulo: 'Errores de publicación y fallas técnicas',
    parrafos: [
      '18.1. Si una edición se publica con un error evidente (por ejemplo, un partido mal indicado o un premio o costo equivocados), Liga Kiniela lo corregirá. Si ya se hubieran registrado tickets, podrá cancelar la edición y devolver el dinero de los tickets, avisando en la taquilla.',
      '18.2. Las fallas de conexión o técnicas ajenas a Liga Kiniela pueden afectar la compra de tickets. Solo son válidos los tickets efectivamente registrados antes del cierre de la venta.',
    ],
  },
  {
    articulo: 19,
    titulo: 'Limitación de responsabilidad',
    parrafos: [
      '19.1. Liga Kiniela no garantiza que la taquilla ni las plataformas aliadas funcionen sin interrupciones, y no responde por caídas de internet, fallas de las plataformas ni hechos de fuerza mayor.',
      '19.2. La participación es voluntaria y bajo el propio riesgo del usuario. Liga Kiniela no responde por las decisiones de pronóstico del usuario ni por las pérdidas que de ellas se deriven.',
      '19.3. Los resultados deportivos no dependen de Liga Kiniela. Ante cualquier suspensión, adelanto, retraso o alteración de partidos, se aplica lo previsto en el Artículo 9.',
    ],
  },
  {
    articulo: 20,
    titulo: 'Juego responsable',
    parrafos: [
      '20.1. Liga Kiniela promueve el juego responsable. Juega solo con dinero que puedas permitirte perder. Los pronósticos no garantizan ganancias.',
      '20.2. Si sientes que pierdes el control, deja de jugar y busca ayuda profesional. Puedes pedir a tu plataforma aliada herramientas de límites o autoexclusión.',
      '20.3. Está prohibida la participación de menores de edad.',
    ],
  },
  {
    articulo: 21,
    titulo: 'Datos personales y privacidad',
    parrafos: [
      '21.1. Liga Kiniela y las plataformas aliadas usarán los datos del usuario solo para operar el servicio, determinar y pagar premios, prevenir fraudes y cumplir obligaciones legales.',
      '21.2. El usuario acepta que su nombre de usuario, sus tickets y su condición de ganador puedan ser vistos por otros participantes en las secciones Tickets Quinielas y Campeones.',
      '21.3. Para consultas sobre sus datos, el usuario puede escribir a los canales del Artículo 24.',
    ],
  },
  {
    articulo: 22,
    titulo: 'Propiedad intelectual',
    parrafos: [
      '22.1. La marca "Liga Kiniela", su logotipo, su mascota, el diseño de la taquilla y sus contenidos son de su titular y no pueden usarse sin autorización.',
      '22.2. Los nombres y escudos de equipos, ligas y torneos pertenecen a sus dueños y se muestran solo con fines informativos.',
    ],
  },
  {
    articulo: 23,
    titulo: 'Cambios a este documento',
    parrafos: [
      '23.1. Liga Kiniela puede modificar este documento. La versión vigente es la publicada en la taquilla y en los canales oficiales.',
      '23.2. Los cambios no afectan a los tickets ya registrados, que se rigen por la versión vigente al momento de jugarse.',
    ],
  },
  {
    articulo: 24,
    titulo: 'Contacto',
    parrafos: [
      '24.1. Las consultas y el aviso de errores se atienden por estos canales:',
      'Correo: aasolucionesdigitales@gmail.com',
      'Instagram: @LigaKiniela',
      'Web: ligakiniela.com',
      '24.2. Estos canales son para consultas y para avisar de errores. No existe trámite de reclamo de premios, porque el premio se abona automáticamente (Artículo 8).',
    ],
  },
  {
    articulo: 25,
    titulo: 'Ley aplicable y tribunales',
    parrafos: [
      '25.1. Este documento se rige por las leyes de la República Bolivariana de Venezuela.',
      '25.2. Las controversias se someterán a los tribunales competentes de Venezuela.',
    ],
  },
  {
    articulo: 26,
    titulo: 'Divisibilidad',
    parrafos: [
      '26.1. Si alguna disposición de este documento fuera declarada inválida, las demás seguirán vigentes.',
    ],
  },
];

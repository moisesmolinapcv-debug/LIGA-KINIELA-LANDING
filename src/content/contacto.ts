/** Canales de contacto (Art. 24 de la guía v2.0). Públicos por decisión del cliente (P5). */
export const CONTACTO = {
  correo: 'contacto@ligakiniela.com.ve',
  correoUrl: 'mailto:contacto@ligakiniela.com.ve',
  instagram: '@LigaKiniela',
  instagramUrl: 'https://www.instagram.com/ligakiniela/',
  web: 'ligakiniela.com',
  webUrl: 'https://ligakiniela.com',
  /** Art. 24.2 */
  nota: 'Estos canales son para consultas y para avisar de errores. No existe trámite de reclamo de premios, porque el premio se abona automáticamente.',
} as const;

/** Textos de la sección "Contacto" (formulario). Decisiones Q17 a Q21. */
export const FORMULARIO_CONTACTO = {
  badge: 'Ventanilla de atención',
  titulo: 'Contacto',
  subtitulo: 'Escríbenos tu consulta o avísanos de un error. Te respondemos al correo que nos dejes.',
  canalesTitulo: 'Otros canales',
  campos: {
    nombre: 'Nombre',
    correo: 'Correo electrónico',
    motivo: 'Motivo',
    motivoPlaceholder: 'Elige una opción',
    mensaje: 'Mensaje',
  },
  ayudaMensaje: (n: number, max: number) => `${n}/${max}`,
  enviar: 'Enviar mensaje',
  enviando: 'Enviando…',
  verificando: 'Verificando seguridad…',
  privacidad: 'Usamos tus datos solo para responderte (Términos, art. 21.4).',
  seguridad: 'Protegido por Cloudflare Turnstile contra envíos automáticos.',
  exitoTitulo: '¡Mensaje enviado!',
  exitoTexto: 'Gracias por escribirnos. Te responderemos al correo que indicaste.',
  otroMensaje: 'Enviar otro mensaje',
  errores: {
    validacion: 'Revisa los campos marcados.',
    captcha: 'No pudimos confirmar que eres una persona. Espera unos segundos e inténtalo de nuevo.',
    demasiados_intentos: 'Has enviado varios mensajes seguidos. Espera unos minutos e inténtalo de nuevo.',
    no_configurado: 'El formulario no está disponible en este momento.',
    envio_fallido: 'No pudimos enviar tu mensaje en este momento.',
    solicitud_invalida: 'No pudimos procesar el mensaje. Recarga la página e inténtalo de nuevo.',
    red: 'Sin conexión con el servidor. Revisa tu internet e inténtalo de nuevo.',
  },
  alternativa: 'También puedes escribirnos directo a',
} as const;

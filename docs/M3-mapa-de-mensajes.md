# M3: mapa de mensajes (Hero, Boleto, Navegación, Pie)

Regla del cliente: cada regla, instrucción o dato se dice **una sola vez** en la página, en el mejor lugar. M3c: antes de escribir un texto nuevo, revisa si ya vive aquí.

## Dónde vive cada mensaje

| Mensaje | Dónde vive (componente / clave) | Por qué ahí |
|---|---|---|
| Eslogan "Pronostica. Marca tus 10. Gana el máximo." | Hero (`MARCA.eslogan`). También dentro de la imagen para compartir (es una imagen aparte) | Es lo primero que se ve; ahí el eslogan cumple su trabajo |
| Premio total y costo del ticket | Hero (`FICHA.premio`, datos del endpoint) | Es el dato estrella; va en el tablero |
| Hora de cierre y cuenta regresiva | Solo Hero (`HeroBody`, `scheduleLine` + `FlapClock`) | El reloj y la fecha juntos; el boleto ya no la repite |
| "hora de Venezuela" (sin UTC-4) | Hero, una vez (`HORA_VENEZUELA`). En el boleto, solo si algún partido trae horario: "Horas en hora de Venezuela" (`BOLETO.horariosZona`) | Son horas distintas (cierre vs. partidos). Una mención por bloque |
| Estado de la Kiniela (Próxima / Venta abierta / Venta cerrada) | Hero (`StatusPill`) y pestañas de Kinielas | El boleto ya no repite la etiqueta |
| Aviso "todavía no abre / ya cerró, puedes practicar" | Boleto, solo si no está abierta (`BOLETO.estado`) | Es lo único del estado que el Hero no dice |
| Rótulo "EJERCICIO DE EJEMPLO · no es una jugada registrada. Para jugar, ve a una plataforma aliada" | Boleto, **una vez**, en la cabecera destacada (`BOLETO.rotulo`). Y dentro de la imagen para compartir (`PRACTICA.rotuloTarjeta`) | Obligatorio por decisión del cliente; una aparición visible y fuerte |
| Cómo se usa el boleto ("Marca Local, E o Visitante…") | Subtítulo de la sección (`BOLETO.subtitulo`) | Una instrucción, justo encima del boleto |
| Contador "n/10 marcados" | Talón (escritorio) y barra pegajosa (móvil) (`BOLETO.marcados`) | Es el mismo dato en dos pantallas distintas, nunca juntas: la barra se oculta cuando se ve el talón |
| Mínimo para ganar (7, o 6/5 con suspendidos; 3+ cancela) | Talón (`BOLETO.minimo`) | Dato útil y cambia con los partidos; la regla general vive en Reglas (M3c) |
| Aciertos de práctica ("Hasta ahora tendrías X aciertos…") | Talón (`BOLETO.aciertosPractica`) | Solo aparece con resultados cargados |
| Horarios por confirmar | Una vez en la cabecera del boleto (`BOLETO.horariosPorConfirmar`) | Antes se repetía en las 10 líneas |
| Celebración al completar | Talón (`celebracionTitulo/Texto`) + botón "Elegir plataforma" | Único CTA del boleto; lleva a #aliados |
| Vista previa y compartir imagen | `ShareDialog` (`vistaPreviaTitulo`, Compartir, Descargar) | El share nativo sale del botón del diálogo (gesto válido) |
| Juego responsable +18 completo | Pie de página (franja + párrafo final) (`JUEGO_RESPONSABLE_FRANJA`) | Un solo lugar completo |
| Chip "+18" | Navbar (chip existente) | Basta el chip en el menú móvil |
| "Esta página solo informa; el juego ocurre en tu plataforma aliada" | Franja del pie (`JUEGO_RESPONSABLE_FRANJA.informa`) | Una vez; el rótulo del boleto lo dice a su manera solo en el ejercicio |
| Contacto, @LigaKiniela y correo | Pie (`CONTACTO`) | Contacto en un lugar |
| Regla "la venta cierra 1 minuto antes del primer partido" | **No está en el Hero ni en el boleto**. Vive en Reglas/FAQ (`guia.ts`, `CIERRE_DE_VENTA`, Art. 4.2) | El Hero ya muestra hora y reloj; la regla es de reglamento |
| Módulos del Menú (Resultados, Tickets, Campeones dentro de la taquilla de tu plataforma, Q9) | **Pendiente para M3c**: va en Reglas con `MENU_TAQUILLA` | Se quitó de debajo del boleto |

## Lo que quité

- Hero: subtítulo "Gana el máximo de aciertos, con un mínimo de 7" (pedido por el cliente). Equivalentes que también salieron del Hero: el aviso "Boleto de práctica: no es una jugada registrada…" bajo el botón y la línea "La venta cierra 1 minuto antes del primer partido". Sigue la frase del eslogan "Gana el máximo" (aprobada en Q15).
- Hero: "Actualizado hace X min" ya no sale en la carga normal; solo si el dato está desactualizado de verdad (respaldo del servidor o fallo al actualizar), con texto "Datos de hace X: no pudimos actualizarlos".
- Boleto: etiqueta de sección "Cartelera · Boleto de práctica", pastilla de estado repetida, folio "N.º 00032", fecha y hora de cierre, mensaje "Tu ejercicio no se registra; para jugar, entra a tu plataforma aliada" (ya lo dice el rótulo), rótulo repetido en el talón, rótulo en la barra pegajosa, "Completa los 10 para compartir", "En la taquilla real gana el máximo con un mínimo de 7", párrafo final de módulos de la plataforma, "Horario por confirmar" en cada línea, nota de "no es un resultado oficial".
- Boleto sin datos: la pantalla de error ya no repite título y Kini (el Hero lo explica); queda un aviso corto con "Reintentar".
- Navbar: la línea "+18 · Juega con moderación" del menú móvil.
- Footer: el eslogan y la frase "El juego ocurre en tu plataforma aliada" bajo el logo; "Juega con moderación" de la franja (la idea queda en el párrafo final).
- "(UTC-4)" en todo el texto visible de estos componentes (`HORA_VENEZUELA` ahora es solo "hora de Venezuela"). Quedan menciones en `guia.ts` y `terminos.ts`, que son de M4/M3c.

## Claves de copys.ts sin uso (no se borraron; M3c decide)

`PRACTICA.aviso`, `PRACTICA.avisoLargo`, `PRACTICA.instruccion`, `PRACTICA.contador`, `PRACTICA.completo`, `PRACTICA.incompleto`, `PRACTICA.guardado`, `PRACTICA.reiniciar`, `PRACTICA.compartir`, `HORARIOS.cierre`, `HORARIOS.noEsperes`, `HORARIOS.cierraA`, `FICHA.reglaGanador`, `ESTADOS_KINIELA.*.descripcion`, `CTA.juegaEnTuPlataforma`, `RECORDATORIO.*`. Varias duplican textos que ya viven arriba; no usarlas sin revisar esta tabla.

## Reglas de suspendidos en el boleto (Art. 9)

Mínimo para ganar = 7 menos los partidos suspendidos (1 suspendido: 6; 2: 5). Con 3 o más el texto dice que la Kiniela se cancela y se devuelve el dinero (sin plazo, por Q2). Se calcula con el estado SUSPENDIDO de la capa manual.

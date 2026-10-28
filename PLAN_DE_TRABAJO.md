# PLAN DE TRABAJO MAESTRO v4: LIGA KINIELA "NEXT LEVEL"
> **Fuente de verdad del proyecto.** Todo agente y todo entregable se guía únicamente por este documento.
> Reemplaza al plan de la Fase 3 (sigue en el historial de git).
> Estado: **BORRADOR PENDIENTE DE APROBACIÓN.** No se construye nada hasta el visto bueno.

---

## 0. DECISIONES YA TOMADAS (respuestas del cliente)

| # | Decisión | Consecuencia en el plan |
|---|---|---|
| D1 | Fecha, hora y liga de cada partido **no tienen fuente**. Se automatiza lo que da el endpoint, el resto es manual | La cartelera tiene capa automática y capa manual (ver §3) |
| D2 | Marcadores y resultados: manuales por ahora, API en el futuro | La capa de resultados se diseña **enchufable** para cambiar a API sin reescribir la UI |
| D3 | **La guía v2.0 manda** sobre cualquier otra fuente, incluido el campo `info` del endpoint | Las reglas se escriben desde la guía. Las `rules` del endpoint no se muestran |
| D4 | La cuenta regresiva termina en `sales_finish` **menos 1 minuto** | Regla fija del contador |
| D5 | Aliados = **Anexo A de la guía** (9 plataformas). Sin URL directa a la taquilla: se redirige al **sitio oficial** | Se eliminan Casa Grande, Divino Play y Fanaticash. Los botones "Jugar" abren el sitio oficial de cada aliado |
| D6 | Campeones/ganadores: manual | Se mantiene el módulo actual de ganadores |
| D7 | **Seguridad del admin: se deja como está** | Fuera de alcance. Queda registrado como **riesgo aceptado por el cliente** (§8) |
| D8 | Libertad creativa total, sin moldes ni plantillas genéricas | Concepto propio (§2) |

---

## 1. OBJETIVOS DE PRODUCCIÓN (criterios de "listo")

1. **Aspecto y tecnología de primera.** El concepto de §2 está implementado y supera a las landings de apuestas del mercado (benchmark en M1).
2. **Retención y retorno.** Hay ganchos que dan motivo para volver: boleto de práctica, calculadora de premio, tarjeta para compartir (§2.4).
3. **Toda la información del producto en un solo lugar,** fiel a la guía v2.0 y sin contradicciones (M4).
4. **Datos automatizados** desde `get-active-kinielas`, con soporte para **N kinielas simultáneas** (M2).
5. **Jugable en celular** (Android e iOS) antes que en escritorio. Se diseña mobile-first (M6).
6. **Admin funcional.** Se corrigen los errores visibles de funcionamiento, no la seguridad (D7).

---

## 2. CONCEPTO CREATIVO: "LA TAQUILLA"

**Idea rectora:** la web es la **taquilla de un estadio de noche**. El usuario llega, ve el marcador, compra su boleto y entra. Todo el lenguaje visual sale de ahí, no de una plantilla de casa de apuestas.

### 2.1 Piezas firma (lo que no se ve en otras landings)

| Pieza | Descripción | Dónde |
|---|---|---|
| **Tablero split-flap** | Marcador mecánico de estadio donde los dígitos **voltean** como en una estación antigua. Muestra el premio y la cuenta regresiva | Hero |
| **Boleto troquelado** | Cada Kiniela es un **boleto físico**: perforaciones, talón desprendible, folio y foil dorado. Con N kinielas, son N boletos apilados o en carrusel | Cartelera |
| **Las 10 líneas del boleto** | Cada partido es una línea con escudos y tres casillas **L / E / V** que se "sellan" con animación y vibración en móvil | Cartelera |
| **Pizarra del DT** | Las reglas se explican con **diagramas de pizarra táctica** (trazos tipo tiza, flechas, círculos) que se dibujan al hacer scroll | Reglas |
| **Noche de estadio** | Fondo en capas con **reflectores** que se encienden con el scroll, partículas de luz y textura de césped | Global |
| **Selector de taquilla** | Los 9 aliados como **ventanillas numeradas**; al elegir una, el cliente va al sitio oficial | ¿Dónde jugar? |
| **Muro de trofeos** | Los campeones como trofeos en vitrina, no como una tabla | Campeones |

### 2.2 Sistema visual
- Colores de marca intactos: Azul Noche `#00063E`, Vinotinto `#882445`, Oro `#FFAF3F`, Blanco.
- Tipografía: Rockwell (títulos y cifras), Poppins (lectura). Pendiente de confirmar licencia/fuente web (§7).
- Logo **siempre** en versión con reborde blanco sobre fondo oscuro (manual de marca, pág. 6).
- Solo tema oscuro, por coherencia con "noche de estadio".

### 2.3 Movimiento (motion)
- Librería de animación de UI (`motion`) + animaciones por scroll nativas en CSS donde se pueda, para pesar poco en celulares de gama baja.
- Interacciones: sellado de casillas, volteo split-flap, troquel que se "rasga", progreso de scroll como reflectores.
- **Reglas de rendimiento:** solo `transform` y `opacity` en animaciones, presupuesto de JS definido (§6), y `prefers-reduced-motion` desactiva el movimiento no esencial.
- Sonido **apagado por defecto**, con interruptor visible.

### 2.4 Ganchos de retención (Objetivo 2)
1. **"Prueba tu boleto" (práctica):** el usuario marca sus 10 pronósticos sobre el boleto, sin registrar nada, y se guarda en su dispositivo. Rótulo permanente: *"Boleto de práctica: no es una jugada registrada. Para jugar, ve a una plataforma aliada"*.
2. **Tarjeta para compartir:** genera una imagen del boleto de práctica para WhatsApp e Instagram (@LigaKiniela), con el logo.
3. **Calculadora "¿Cuánto cobro?":** premio × tickets ganadores, a partir de los escenarios del Anexo C de la guía.
4. **Recordatorio de cierre** dentro de la página mientras queda poco tiempo para el cierre.
> **Punto de decisión del cliente (P1):** la práctica (2.4-1) podría confundirse con una jugada real. Por eso lleva rótulo fijo. Necesito tu visto bueno explícito para incluirla.

---

## 3. ARQUITECTURA DE DATOS (M2)

### 3.1 Capa automática
- Ruta propia `/api/kinielas` (servidor). Razón: el endpoint **no emite CORS**, así que el navegador no puede llamarlo directo.
- Consume `https://ligakiniela.com/get-active-kinielas`, **cachea ~60 s** y devuelve siempre el último dato bueno si el origen falla.
- **Normalización:**
  - Agrupa las filas por `id` de pool, una **Kiniela** por cada `id` distinto (soporta N).
  - Parsea `info` (viene como texto JSON) con manejo de error.
  - Une filas local y visitante en **partidos**, validando que cada par tenga un `home` y un `away` (el orden varía entre partidos). Si un par no valida, se marca la Kiniela con alerta y no se rompe la página.
  - Escudo: `image_home` / `image_away`, con respaldo local si falla.
  - Hora: `sales_finish` UTC convertida a **hora de Venezuela (UTC-4)**.
- **Estados por Kiniela:** `próxima` (antes de `sales_start`), `abierta`, `cerrada` (desde `sales_finish` menos 1 min).
- **Campos automáticos:** nombre/código, premio, costo, total de partidos, equipos y escudos, inicio y cierre de ventas, gratuita si `ticket_price` = 0 (ticket único por usuario).

### 3.2 Capa manual (superpone a la automática)
- Por partido: **fecha y hora, liga/torneo, estado, marcador, minuto, resultado final.**
- Se enlaza por **ID de equipo local + ID de equipo visitante** (estable), no por posición.
- Sin dato manual: la tarjeta muestra "Horario por confirmar" y nunca un dato inventado.
- Preparada para reemplazar la fuente manual por la API futura (D2) tocando solo esta capa.
- **Cambio de esquema Supabase:** necesitará columnas para enlazar por ID de equipo y por Kiniela. Te entrego el **SQL mínimo para que lo ejecutes tú**. No toco tu Supabase por mi cuenta.

### 3.3 Overrides del admin
- Si el admin escribe un valor (título, premio, precio), **gana sobre el endpoint**. Se muestra una marca "editado manualmente" en el admin.

---

## 4. CONTENIDO Y COHERENCIA CON LA GUÍA (M4)

Fuente única: **GUÍA LIGA KINIELA v2.0**. Reescritura obligatoria de lo que hoy la contradice:

| Hoy en el sitio | Corrección según la guía |
|---|---|
| "10 de 10 gana el Pozo Mayor" | Gana el **máximo de aciertos, mínimo 7**; empates en el máximo reparten en partes iguales (Art. 7) |
| Partido suspendido = "acierto automático" | Se **anula**. 1 o 2 suspendidos: el mínimo baja 1 o 2. 3 o más: se cancela y se devuelve el dinero (Art. 9) |
| Pago por Pago Móvil / transferencia | **Abono automático** en el saldo de la plataforma en **≤ 24 h**, sin reclamo (Art. 8) |
| Paso "Cobra" | "Tu premio llega solo". No hay trámite |
| "1 - X - 2" | **Local / E / Visitante**, como en la taquilla real |
| Sin datos de hora | Todo en **hora de Venezuela (UTC-4)** |
| Faltan | Edición gratuita (1 ticket), prórroga y penales no cuentan, 7 pasos para jugar, Menú de la taquilla, cierre de ventas, juego responsable +18, Venezuela, Términos y Condiciones |
| Aliados desactualizados | Anexo A: PARLEY.COM.VE, MICASINO.COM, TRIPLES.BET, SELLATUPARLEY.COM, JUEGAENLINEA.NET, READHAIRBET.COM, MERIDIANOBET.NET, CORDIALITO.LA, CAMAN.VIP |

Entregables de contenido: sección Cómo jugar (7 pasos), Reglas por artículos en lenguaje simple, FAQ completo (Anexo E), glosario, ficha resumen, página de Términos y Condiciones, y rótulos de juego responsable.

Hallazgo registrado: la guía escribe `READHAIRBET.COM` y `CAMAN.VIP`, mientras el pool de logos usa `redhairbet.com` y `camanbet`. **Se sigue la guía**. Los logos se verifican visualmente (§7, P3).

---

## 5. MÓDULOS, AGENTES Y FLUJO

Un **Agente Master/Validador** (yo, como director) tiene la última palabra. Ningún módulo se da por cerrado sin su aprobación. Cada subagente **analiza, planifica y reporta antes de ejecutar**, piensa en voz alta, y devuelve entregable + reporte.

| Mód. | Agente | Entrega | Depende de |
|---|---|---|---|
| **M0** | Cimientos | Limpieza del repo (los scripts `.py` sueltos se mueven o se ignoran **con tu OK**), base del nuevo sistema de diseño, tokens de marca | n/a |
| **M1** | Investigación UX/UI | Benchmark de landings líderes de apuestas y quinielas: patrones de motion, atajos, botones, CTAs. Informe con qué copiar, qué superar y qué evitar | n/a |
| **M2** | Datos | `/api/kinielas`, normalizador, caché, capa manual, SQL mínimo, soporte N kinielas | M0 |
| **M3** | Frontend / Diseño | Hero split-flap, boletos troquelados, cartelera, práctica, selector de taquilla, muro de trofeos | M0, M1, M2 |
| **M4** | Contenido | Reglas, FAQ, pasos, T&C, glosario, copys desde la guía | M0 |
| **M5** | Admin | Revisión y corrección de errores visibles del panel, adaptación a la capa manual, overrides | M2 |
| **M6** | Móvil y rendimiento | Calibración Android/iOS, tamaños táctiles, presupuesto de rendimiento | M3 |
| **M7** | QA / Validación | Pruebas de aceptación contra §6, informe final | todos |

**Ciclo de control:** subagente entrega → Master revisa contra este plan → si hay fallas, devuelve instrucciones estrictas → el subagente corrige → repite hasta el visto bueno.

**Orden:** M1 → M0 → M2 y M4 en paralelo → M3 → M5 → M6 → M7. Entre cada módulo te presento avance y espero tu feedback (Regla 9).

---

## 6. CRITERIOS DE ACEPTACIÓN (QA)

- `npm run build` con **0 errores** de TypeScript y lint.
- **Rendimiento móvil:** Lighthouse Performance ≥ 85, LCP < 2.5 s, CLS < 0.1, INP < 200 ms en un Android de gama media simulado.
- **Viewports probados:** 360, 390, 414, 768, 1024, 1440 y 1920 px. Sin scroll horizontal.
- **Navegadores:** Safari iOS, Chrome Android, Chrome/Edge/Firefox de escritorio.
- **Accesibilidad:** contraste AA, objetivos táctiles ≥ 44×44 px, foco visible, `prefers-reduced-motion` respetado, navegación por teclado.
- **Datos:** con el endpoint caído, la página sigue funcionando con el último dato bueno. Con 2 o más Kinielas simultáneas (simuladas) se muestran bien.
- **Contenido:** revisión cruzada línea por línea contra la guía v2.0. Cero contradicciones.
- **Marca:** logo con reborde blanco en fondo oscuro, colores y tipografías oficiales.

---

## 7. PENDIENTES Y RESOLUCIONES

- **P1 (RESUELTO):** la práctica de boleto **se incluye**, con rótulo fijo y visible de que es un **ejercicio de ejemplo**, no una jugada registrada.
- **P2 (RESUELTO):** la mascota es **KINI**, el perro del logo (bulldog con corona dorada, lentes oscuros y camiseta vinotinto). Es personaje oficial de la web. Fuentes: `public/brand/Recurso 3.svg` (Kini + wordmark) y `Recurso 1.svg` (logo completo con reborde blanco). Las identidades se leen de `liga-kiniela-ai-identity.md` (tono: profesional, enérgico, nocturno, prestigioso).
- **P3 (RESUELTO):** se sigue la guía para los 9 aliados. Los dominios exactos se validan en M4 antes de enlazar.
- **P4 (EN CURSO, a cargo del Director):** el cliente no tiene licencia de Rockwell. Opciones a decidir en M0: (a) Adobe Fonts, si el cliente tiene suscripción; (b) licencia web de Monotype (por dominio, anual, por pageviews); (c) **alternativa libre: Roboto Slab** (Apache-2.0), con Arvo y Bitter como respaldo. Mientras tanto, el código mantiene la pila actual con Roboto Slab como respaldo.
- **P5 (RESUELTO):** Instagram `@LigaKiniela` y el correo de contacto de la guía **van públicos** en el pie de página.

---

## 8. RIESGOS Y ALCANCE EXCLUIDO

- **Seguridad del admin (excluida por decisión D7):** el PIN se valida en el navegador y las políticas de Supabase permiten escritura pública. **Riesgo aceptado por el cliente.** No se modifica, pero queda anotado para una fase posterior.
- **Sin fecha/hora/liga automáticas:** si no se carga el dato manual, la tarjeta del partido muestra "por confirmar".
- **Cambio en el formato del endpoint:** el normalizador valida y falla de forma segura, pero un cambio estructural requiere ajuste.
- **Datos de Campeones y Resultados** son manuales: son tan correctos como lo que se cargue.
- **No incluido:** compra de tickets, cuentas de usuario, pagos o conexión con taquillas de aliados (no hay URL directa, D5).

---

## 10. DECISIONES DEL CLIENTE POST M2/M4 (28-oct-2026), VINCULANTES

| # | Decisión | Módulo que la aplica |
|---|---|---|
| Q1 | Se añade a la guía la regla: partido **reprogramado con más de 1 día = anulado**. En la web se muestra como regla complementaria hasta que salga la guía v2.1 | M4 (contenido) |
| Q2 | La web **no promete plazo de devolución**: solo dice que el dinero se devuelve en el saldo de la plataforma | M4 |
| Q3 | Las 24 h del premio cuentan desde que termina el último partido **realmente jugado** | M4 |
| Q4 | Resultado corregido tras el pago: **no se menciona**; se resuelve caso a caso (Art. 11) | M4 |
| Q5 | La calculadora usa **solo los escenarios A, B, C y E** del Anexo C (sin D) | M3 |
| Q6 | Rótulo principal: **"Premio total"** | M3 |
| Q7 | "Pozo" se sustituye por **"Premio"** en menú, pie y botones | M3 |
| Q8 | **Se mantiene "Premio Verificado y Cobrado"** en el Salón de Campeones. Nota del Director: choca con Art. 8.4 (no hay trámite de cobro); queda como decisión del cliente | M3 |
| Q9 | Los módulos del Menú de la taquilla se explican como "dentro de la taquilla de tu plataforma". Solo Campeones y Resultados (manuales) viven en esta web | M3/M4 |
| Q10 | Subtítulo de aliados: "Plataformas aliadas donde encuentras la taquilla oficial de Liga Kiniela." | M3 |
| Q11 | **No se muestra** "Finalización" de la edición | M3 |
| Q12 | Los banners por defecto **no llevan montos fijos**; los montos salen del endpoint | M5 |
| Q13 | `caman.vip` es correcto | M4 (ya aplicado) |
| Q14 | No se usan `pool_status_id`, `draw_result`, `full_match`, `max_tickets_per_user` | M2 (ya aplicado) |
| Q15 | Aprobados: eslogan "Pronostica. Marca tus 10. Gana el máximo.", nombres comerciales de aliados y enlace de Instagram `instagram.com/ligakiniela/` | M3 |
| Q16 | Los copys viejos de la BD se revisan desde el admin cuando M5 los exponga | M5 |

---

## 9. RESULTADOS M1 (INVESTIGACIÓN), APROBADO CON RESERVAS

**Observado en navegador (viewport 375×812, 28-oct-2026):** sellatuparley.com, triples.bet, meridianobet.net, kicktipp.com, sorare.com. **Bloqueados, sin análisis:** juegaenlinea.net (Cloudflare) y fanduel.com.

**Reserva:** no se pudo ver ninguna casilla 1X2 real (están tras registro). Las decisiones de tamaño y estado de casillas son criterio de diseño, no observación.

**Hallazgos que guían el diseño**
- Entre los aliados, **casi ninguno muestra premio ni cuenta regresiva en la home**. Solo Meridiano tiene reloj, en tipografía plana. El split-flap con premio + reloj en la primera pantalla diferencia.
- Un solo CTA repetido y de color saturado es norma. Se usa oro `#FFAF3F` y un CTA fijo abajo en móvil.
- Meridiano comunica reglas con "1-2-3" gigante. La pizarra del DT debe ser igual de directa: **marca 10, mínimo 7 aciertos, gana el máximo**.
- Sorare muestra ganadores recientes con cifra. Se replica en el muro de trofeos.
- **Evitar:** carruseles de 15+ banners, texto SEO largo, rejilla de promos, tema estacional pegado, banner de cookies grande, popups de chat.
- Juego responsable: línea fija pequeña (+18), sin modal (nivel de Meridiano y Triples).

**Fuera de alcance (descartado):** ligas privadas, clasificación entre amigos y notificaciones. No existen en el producto.

**Reglas técnicas adoptadas:** animar solo `transform` y `opacity`; split-flap propio (<2 kB); `html-to-image` cargado bajo demanda con `pixelRatio` fijo; scroll-driven CSS solo con `@supports` y respaldo; Motion mini o WAAPI en vez de GSAP salvo necesidad; casillas ≥48 px con contador fijo "7/10".

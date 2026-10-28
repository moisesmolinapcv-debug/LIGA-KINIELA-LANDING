# M4: Revisión cruzada sitio vs. GUÍA LIGA KINIELA v2.0

Fuente: `docs/GUIA_LIGA_KINIELA_v2.md` (manda sobre todo lo demás, D3). Fecha: 28-oct-2026.
Estados: CORREGIDO (ya editado), PENDIENTE (fuera de mis rutas; lo debe tocar M3/M5/M2), OK.

## 1. Afirmaciones del sitio (antes) vs. guía

### RulesAndFaqSection.tsx (FAQ)

| # | Afirmación del sitio antes | Fuente en la guía | Estado |
|---|---|---|---|
| 1 | "Gana quien acumule el mayor número de aciertos... En caso de acierto total (10 de 10), se adjudica el Pozo Mayor Acumulado" | Art. 7.1 a 7.4: gana el máximo, mínimo 7; no hay "Pozo Mayor" | CORREGIDO (FAQ Anexo E: "Mínimo 7, y además el máximo") |
| 2 | Premios "inmediata" por métodos de pago de la casa o Pago Móvil / transferencias | Art. 8.3 y 8.4: abono automático en el saldo de la plataforma, en no más de 24 h, sin trámite | CORREGIDO |
| 3 | Empate en el primer lugar: "el pozo de esa categoría se reparte" | Art. 7.4 (partes iguales por ticket) | CORREGIDO (texto de la guía, Anexo E) |
| 4 | Partido suspendido sin reanudar en 24 h = "nulo y acierto automático para todos" | Art. 9.2 y 9.3: se anula (ni acierto ni fallo), el mínimo baja; 3 o más cancela y devuelve | CORREGIDO. El plazo de 24 h del sitio NO está en la guía |
| 5 | "Las jugadas se cierran... según el contador regresivo... exactamente antes del pitazo inicial" | Art. 4.2: 1 minuto antes del primer pitazo | CORREGIDO |
| 6 | "Edad 18+" y "promueve estrictamente el juego responsable" | Art. 14.1, 20 | OK (reemplazado por FAQ de la guía; la edad está en Art. 14 y Ficha) |

### RulesAndFaqSection.tsx (pasos)

| # | Antes | Fuente | Estado |
|---|---|---|---|
| 7 | 4 pasos (analiza, pronostica, confirma, cobra) | Sec. 2.2: son 7 pasos | CORREGIDO (7 pasos desde `PASOS_JUGAR`) |
| 8 | "Pronostica 1 - X - 2" (1 local, X empate, 2 visitante) | Sec. 2.3 y Art. 3.1: Local / Empate (E) / Visitante | CORREGIDO |
| 9 | Paso "Sigue la emoción y Cobra" | Art. 8.4: no hay trámite; el premio llega solo | CORREGIDO |
| 10 | "los 10 encuentros de las mejores ligas, copas y el fútbol venezolano" | La guía no dice qué ligas; Anexo B es solo un ejemplo | CORREGIDO (eliminado) |
| 11 | "Fácil y Seguro" bajo cada paso | No es afirmación de la guía | CORREGIDO (ahora "Paso N de 07") |
| 12 | Subtítulo por defecto "sistema sencillo, justo y transparente" (fallback de `rules_subtitle`) | Sin respaldo textual (Art. 10 habla de transparencia) | PENDIENTE: lo decide M3; es texto de marca, no regla |

### AlliesCarousel.tsx

| # | Antes | Fuente | Estado |
|---|---|---|---|
| 13 | 15 aliados (Fanaticash, Casa Grande, Divino Play, Triunfobet, King Deportes, El Ganador, etc.) | Anexo A: 9 plataformas | CORREGIDO (solo los 9, desde `ALIADOS`) |
| 14 | Juega En Línea apuntaba a `juegaenlinea.com` | Anexo A: JUEGAENLINEA.NET | CORREGIDO |
| 15 | Triples (`triples.bet`), Meridiano, Cordialito, Mi Casino, Sella Tu Parley | Anexo A | OK (dominio igual) |
| 16 | Camanbet `camanbet.com`; Redhairbet `redhairbet.com` | Anexo A: CAMAN.VIP, READHAIRBET.COM | CORREGIDO a la guía (ver sec. 3) |
| 17 | Subtítulo por defecto: "casas de apuestas más importantes, serias y confiables de Venezuela" | Sin respaldo en la guía | PENDIENTE (no lo toqué, solo me pidieron la lista): sugerido `MARCA.aliadosSubtitulo` |
| 18 | "Red de Casas Autorizadas" / "Aliado" con punto verde | Anexo A habla de "plataformas aliadas", no "autorizadas" | PENDIENTE (M3) |

### Otros archivos (fuera de mis rutas, solo hallazgos)

| Archivo | Afirmación | Fuente | Estado |
|---|---|---|---|
| `src/components/MatchesSection.tsx:281` | "Válido para pronóstico 1-X-2" | Local / E / Visitante | PENDIENTE (M3) |
| `src/components/WinnersSection.tsx:77` | "Premio Verificado y Cobrado" | Art. 8.4: sin trámite de cobro; "verificado" no figura en la guía | PENDIENTE (M3) |
| `src/lib/kiniela-store.ts:301,309,648` y `admin/BannerTab.tsx:39` | Banner "Gran Pozo Acumulado de 1.500.000 Bs... por solo 1.000 Bs" como dato por defecto | Anexo C/1.4: 2.500.000 y 1.000 Bs son ejemplos; los montos reales vienen de la taquilla | PENDIENTE (M2/M5): no mostrar montos fijos por defecto |
| `Navbar`, `Footer`, `Hero`, `BottomNavBar` | Rótulos "Pozo & Premios", "Pozo y Premios Acumulados" | La guía usa "Premio total / Acumulado" (Art. 8.1) | PENDIENTE (M3): se sugiere "Premio" |
| `SiteCopys` / textos de la BD (admin) | No pude leer la BD; los copys editables pueden seguir con texto viejo | n/a | NO VERIFICADO |

## 2. Incoherencias internas de la guía (sin resolver, para decisión del cliente)

| # | Incoherencia | Dónde | Por qué importa |
|---|---|---|---|
| G1 | Art. 9.1 define suspendido como el partido que "no se juega o no completa el tiempo reglamentario **en la fecha programada**". Un partido aplazado un par de horas por lluvia y jugado ese mismo día ¿es suspendido? No se dice; y la regla de "más de 1 día" del endpoint/M2 no figura en la guía | Art. 9.1 vs. endpoint | La guía no da umbral de tiempo. Hace falta confirmar si un partido que se juega después de la fecha programada pero antes de pagar sigue contando |
| G2 | Art. 9.2: el mínimo "baja en la misma cantidad de partidos anulados", pero Art. 7.1 dice "7, 8, 9 o 10" y la tabla da mínimo 6 o 5. Si hay 8 partidos, el máximo posible es 8; coherente, pero 7.1 no se actualiza | Art. 7.1 vs. 9.2 | Menor: 7.1 ya remite a Art. 9 |
| G3 | Art. 9.3 devuelve el dinero con 3 o más suspendidos; el Art. 4.3 y Art. 18.1 también hablan de cancelación. No se aclara si la devolución de Art. 18 cubre también tickets gratuitos o plazo de devolución (sin plazo definido) | Art. 4.3, 9.3, 18.1 | Falta un plazo para devolver el dinero; no lo inventé |
| G4 | Art. 8.3 cuenta las 24 h "desde la finalización del último partido de la edición". Con partido suspendido pero reprogramado, ¿cuenta la nueva fecha? No se dice | Art. 8.3 vs. 9.1 | Ambigüedad de plazo de pago |
| G5 | Sec. 1.3: la edición dura "hasta que termina el último partido"; Sec. 1.4 "Finalización" = hora en que termina el último partido. Es una hora que se conoce solo después (la taquilla muestra una hora estimada). El endpoint no trae ese dato (D1) | 1.3, 1.4, 2.3 | La web no puede mostrar "Finalización" automática |
| G6 | Sec. 2.7 / Art. 10 prometen "marcadores en vivo", "Tickets Quinielas" y "Campeones" en el Menú de la taquilla. Esos módulos son de la taquilla (aliado), no de esta web; la web de M3 solo tiene Campeones manual (D6) | 2.7, Art. 10 | Evitar que la web prometa funciones que solo existen en la taquilla |
| G7 | Art. 7.1 y Anexo C.2 E: "el mínimo es 7" y "El premio no se entrega ni se acumula"; pero el glosario "Premio total / Acumulado" usa la palabra "Acumulado" aunque la guía dice que no se acumula entre ediciones | Art. 7.6, Anexo D | Posible confusión de "acumulado"; usar "Premio total" como rótulo principal |
| G8 | Art. 6.3: resultados oficiales corregidos "antes de pagar" prevalecen; pago a ≤ 24 h (Art. 8.3). No hay ventana definida si el organizador corrige tras el pago | Art. 6.3 vs. 8.3 | Caso no previsto (cae en Art. 11.1) |
| G9 | Anexo C.2 D: "varios" tickets con 7 y 8; sin cantidades. Lo dejé sin cifras en `ESCENARIOS_PREMIO` | C.2 D | Para la calculadora solo hay 5 escenarios con datos completos (A, B, C, E y D parcial) |
| G10 | Anexo A: READHAIRBET.COM y CAMAN.VIP vs. pool de logos (redhairbet.com, camanbet) | Anexo A | Ver sec. 3; posible error tipográfico de la guía |
| G11 | La guía llama al producto "Kiniela" y "Quiniela" indistintamente (botón "JUGAR QUINIELA", "Tickets Quinielas") | todo | Es la forma de la taquilla; la web usa "Kiniela" |

## 3. Aliados: verificación de dominios (curl -sI con -L, timeout 8 s, 28-oct-2026)

| # | Dominio guía | Respuesta | Nota |
|---|---|---|---|
| 1 | PARLEY.COM.VE | 200, redirige a `parley.la` | Redirección de dominio |
| 2 | MICASINO.COM | 200, redirige a `promociones.micasino.com/country-landing/us/` | Redirección por geolocalización (desde mi red) |
| 3 | TRIPLES.BET | 200 | OK |
| 4 | SELLATUPARLEY.COM | 200, redirige a `/es` | OK |
| 5 | JUEGAENLINEA.NET | 403 (Cloudflare, responde `www.juegaenlinea.net`) | Existe; bloquea clientes sin navegador |
| 6 | READHAIRBET.COM | **sin respuesta (código 000)** | No resuelve/ no responde. `redhairbet.com` sí responde 200. Probable error tipográfico de la guía |
| 7 | MERIDIANOBET.NET | 200 | OK |
| 8 | CORDIALITO.LA | 200 | OK |
| 9 | CAMAN.VIP | 200 | OK; `camanbet.com` también responde 200 (puede ser otro sitio) |

Decisión aplicada: se conserva el dominio de la guía (D3) en `dominioGuia` y en `url`. **READHAIRBET.COM no responde**, por lo que el botón de ese aliado hoy llevaría a un sitio caído hasta que el cliente confirme el dominio correcto.

Logos: tienen archivo servible en `public/allies`: Parley, Juega En Línea. Descargados en `downloaded_logos` (no servibles desde ahí, hay que moverlos a `public/allies`): Mi Casino, Triples, Sella Tu Parley, Redhairbet (para READHAIRBET), Meridiano (svg y png), Cordialito, Caman (camanbet.png). **Faltan: ninguno de los 9**, pero 7 aún no están en `public/`; mientras tanto el carrusel usa el `logoRemoto` del pool. No verifiqué visualmente que los archivos sean correctos (P3).

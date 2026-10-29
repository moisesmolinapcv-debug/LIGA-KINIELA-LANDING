# M6: Móvil, rendimiento y accesibilidad

Método de medición (igual antes y después): build de producción (`next start -p 3001`), Lighthouse 12 móvil (throttling simulado por defecto: 4G lento, CPU 4x) sobre Microsoft Edge 156 headless, ruta `/`, con los datos reales de Supabase y del endpoint. La máquina de pruebas tiene carga variable: la puntuación oscila entre corridas, por eso se dan todas.

## 1. Tabla antes / después (landing `/`)

| Métrica | Antes (1 corrida) | Después (6 corridas) |
|---|---|---|
| Performance | 42 | 75, 81, 83, 85, 89, 91 (mediana 84) |
| LCP | 17,4 s | 2,9 a 4,6 s (mediana 3,1 s) |
| CLS | 0,824 | 0 (0,0001) en todas |
| TBT | 373 ms | 179 a 459 ms |
| FCP | 0,9 s | 0,8 a 1,1 s |
| Peso transferido | 3.985 KB | 441 a 448 KB (-89 %) |
| Peticiones | 59 | 52 |
| Accesibilidad / Buenas prácticas / SEO | 100 / 96 / 100 | 100 / 100 / 100 |
| JS primera carga `/` | 203 kB | 200 kB (compartido 87,4 kB) |

Metas del plan: CLS < 0,1 cumplida. Performance >= 85 cumplida en 3 de 6 corridas (no de forma estable). LCP < 2,5 s NO cumplida (mejor 2,9 s). INP: Lighthouse no lo mide en carga; no hay long tasks de interacción, solo de arranque.

Cuello de botella restante del LCP: el elemento es la imagen del primer banner (ya sirve 60 KB en WebP, y llega en el HTML inicial). Su carga ya no es el problema (descarga ~45 ms); el retraso es el trabajo de JavaScript del arranque bajo CPU 4x (hidratación de React, 87 kB compartidos + 28 kB de la página, de los cuales `supabase-js` es un chunk de 52 kB con 80 % sin usar). Bajarlo más exige quitar `supabase-js` de la landing (leer banners y campeones por REST) o servir también campeones desde el servidor; es un cambio de la capa de datos y se deja como pendiente.

La causa principal del antes: un banner JPG de 2,9 MB subido al admin (viola la guía de 250/300 KB) era el LCP, y el salto de diseño venía de los reflectores del fondo, que medían % de la altura de la sección y la sección crecía al cargar datos/banners.

## 2. Problemas corregidos

Rendimiento
- Banners del admin por el optimizador de Next (WebP, a 1080/1920 px, calidad 70) con respaldo al archivo original si falla o el host no está autorizado. 2,9 MB pasa a ~60 KB.
- Primer banner leído en el servidor (ISR 60 s, `src/lib/banners-server.ts`, `src/app/page.tsx` + `HomeClient`): su `<img>` está en el HTML con `fetchpriority=high`. El cliente sigue leyendo y escuchando cambios como antes. Si falla el servidor, se cae al comportamiento anterior.
- Escudos de equipos por `next/image` (36 px a 2x en WebP, ~1-2 KB c/u en lugar de ~40 KB; 20 escudos = ~800 KB menos), con respaldo a iniciales.
- CLS: reflectores y halo con tamaño en px/svh (no %), esqueleto del hero con la misma altura que el contenido real (600 px móvil, 660 px desde 640 px de ancho).
- Poppins: de 7 pesos a 4 (400, 500, 600, 700). Roboto Slab es una fuente variable de un archivo: se mantiene.
- Logos de aliados: Parley (39 a 6,5 KB) y Camanbet (19 a 5,6 KB) redimensionados a 424 px y cuantizados (idénticos a la vista). Marquesina con `loading="lazy"` (antes 18 imágenes eager al inicio).
- Calculadora, Preguntas frecuentes y ShareDialog en `next/dynamic` (ShareDialog solo se descarga al compartir). Ganancia pequeña (-3 kB en `/`).
- `preconnect` a Supabase.
- `next.config.mjs`: el optimizador solo acepta `*.supabase.co`, `ligakiniela.com` e `images.unsplash.com` (antes cualquier host `**`: cualquiera podía usar la cuota del optimizador).
- `/api/kinielas` ya tenía `s-maxage=60, stale-while-revalidate=300`: sin cambios.

Móvil / iOS
- `min-h-screen` y body con `100dvh` (respaldo `vh`); `overflow-x: clip` con respaldo `hidden` (Safari < 16); `text-size-adjust`; `touch-action: manipulation` en controles; campos de 16 px en pantallas táctiles (evita el zoom de iOS al enfocar el buscador de FAQ, calculadora y formularios del admin); `padding-bottom` con `env(safe-area-inset-bottom)` en el diálogo de compartir. Ya existían los prefijos `-webkit-` para `backdrop-filter` y `mask-image`, el padding seguro de la barra inferior y del contador pegajoso, y el tap highlight transparente.
- Sin scroll horizontal a 360, 375, 390, 414, 768, 1024, 1440 y 1920 px (landing, y /terminos y /admin a 375). Ningún botón, enlace o campo visible mide menos de 44 px en la landing a esos anchos y en /terminos y las 5 pestañas del admin (solo los `input type=file` ocultos y los checkbox dentro de etiquetas de 44 px).
- Canvas de la tarjeta: 1080 x 1350 = 1,46 Mpx (el límite de iOS es ~16,7 Mpx). Confirmado: genera el PNG de 1080 x 1350 y el diálogo atrapa el foco.
- `vibrate` ya estaba protegido con `typeof navigator.vibrate === 'function'`. Web Share con archivos: se detecta con `canShare({files})`; si no hay soporte solo se muestra "Descargar"; si falla, descarga.
- No se añadió `viewport-fit=cover` a propósito: sin él, iOS ya respeta la zona segura en vertical y horizontal, y con él habría que rehacer los márgenes laterales del menú. Las variables `--safe-bottom` quedan listas.

Accesibilidad
- axe-core 4.9.1 (wcag2a/aa, 2.1, 2.2, best-practice): `/` 0 violaciones (solo "imagen con alt repetido" menor en logos de aliados, ya resuelto por Lighthouse 100; ver pendientes); `/terminos`: 2 moderadas corregidas (10 `<aside>` anidados pasan a `role="note"`, el índice lateral recibe `aria-label`); `/admin` login: 0; `/admin` con sesión: 2 graves (lista de definición con `div` anidados en "Kiniela activa") corregidas; resto de pestañas 0.
- Contraste: comprobado con script propio sobre todos los textos visibles (fondo azul, degradados tratados como el azul base): sin fallos; axe deja 137 "por revisar" solo por degradados/pseudo-elementos.
- Enlace "Saltar al contenido" nuevo (visible al pulsar Tab) y `<main id="contenido">` en `/`, `/terminos`, `/admin` (el login del admin ahora es `<main>`).
- prefers-reduced-motion: el panel no lo emula; se inyectaron las reglas de ese bloque como hoja forzada: 0 animaciones infinitas, marquesina, reflectores y glow quedan quietos, duraciones de 0,01 ms; el marcador muestra el valor final.
- Teclado: Esc cierra menú móvil y diálogo, flechas en casillas L/E/V y pestañas de FAQ, Tab atrapado en el diálogo, acordeones con `aria-expanded`, 0 `tabindex` positivos.

SEO / compartir
- Imagen OG 1200 x 630 de marca (`public/og/liga-kiniela-og.png`, 81 KB): Azul Noche, Kini con reborde blanco, "LIGA KINIELA", eslogan aprobado, "+18 · Juega con moderación". Sin montos ni afirmaciones. Tipografía Roboto Slab y Poppins (no Rockwell, sin licencia). Generada con Edge headless (PIL no renderiza SVG) y optimizada con PIL.
- Metadatos: título único por página, descripción fiel a la guía (sin "oficial verificado", sin cifras), `canonical`, Open Graph y `twitter:card=summary_large_image` en `/` y `/terminos`, `theme-color`, `lang="es"`. Eliminadas las `keywords` (FUTVE, Champions) y "Oficial" del autor.
- `app/robots.ts` (bloquea /admin y /api) y `app/sitemap.ts` (/ y /terminos); /admin con `noindex, nofollow` (ya lo tenía).
- Favicon: `public/favicon.ico` (16/32/48) y `public/apple-touch-icon.png` (180 px, fondo azul; antes se usaba un PNG 1103 x 1195 no cuadrado).

Código muerto
- Eliminados: `CommercialBanner`, `HeroSkeleton`, `MatchesSkeleton`; en `copys.ts` `RECORDATORIO`, `CALCULADORA` y todas las claves sin uso de `PRACTICA`, `CTA`, `HORARIOS`, `FICHA`, `MARCA`, `ESTADOS_KINIELA.*.descripcion`, `JUEGO_RESPONSABLE_FRANJA.linea`, `BOLETO.minimoCorto`; en `kiniela-store.ts` `updateEdition`, `addMatch`, `updateMatch`, `deleteMatch`, `updateBanner`, `updateSiteCopys`, `resetToDefault`; en `storage.ts` `fileToBase64`. `tsc --noEmit --noUnusedLocals` limpio.
- NO se tocó `content/guia.ts`: ~40 exports sin uso, pero son el banco de contenido de M4 (guía v2.0) que M3c/el cliente pueden reutilizar.
- Lint: no hay ESLint instalado en el proyecto (`next lint` pide instalarlo y no puedo tocar `package.json`). Se ejecutó ESLint 8 + `next/core-web-vitals` desde un directorio temporal sobre 76 archivos: 0 errores y 0 advertencias. `ignoreDuringBuilds` se deja en `true`; para activarlo basta añadir `eslint` y `eslint-config-next` a devDependencies y poner `false`.

## 3. Consola y 404

- Todas las peticiones de la página (landing, terminos, admin) responden 200/304 en el build de producción; `performance.getEntriesByType('resource')` no tiene ninguna con error. El agente anterior vio los 404 casi seguro en modo dev o por `/favicon.ico` y `/apple-touch-icon.png`, que no existían (corregido: ahora 200).
- Quedan en consola del panel integrado un 404 y un `ERR_CONNECTION_REFUSED` que no son del sitio: el 404 coincide con la sonda de DevTools `/.well-known/appspecific/com.chrome.devtools.json` (confirmado 404 en el servidor, no la pide ninguna página nuestra) y el rechazo no corresponde a ninguna petición de la página. Sin errores ni warnings propios.

## 4. No verificable aquí

iPhone y Android reales: teclado virtual y elementos fijos, zoom al enfocar, Web Share con archivo (hoja nativa), vibración, safe-area con notch y barra de Safari, rendimiento en gama baja real, WebP en Safari antiguos, `dvh`. Lighthouse corre en Edge de escritorio simulando móvil.

## LISTA DE PRUEBAS PARA EL TELÉFONO (cliente)

1. Abre la web: el premio y el reloj aparecen sin que la página "salte" y el banner se ve completo.
2. Gira el teléfono a horizontal y vuelve: no aparece scroll hacia los lados ni se agranda el texto.
3. Toca "Probar mi boleto": baja suave al boleto, sin quedar tapado por la barra fija de arriba.
4. Marca los 10 partidos tocando L, E o V: el sello suena a vibración (solo Android; en iPhone no vibra y no pasa nada) y el contador "n/10" sube y queda sobre la barra inferior.
5. Completa los 10 y pulsa "Compartir mi boleto": se abre una imagen vertical; pulsa Compartir: sale la hoja del teléfono (WhatsApp, Instagram). En iPhone, confirma que la imagen se adjunta; si no, debe ofrecer "Descargar".
6. Cierra la vista previa con la X: el foco vuelve al botón y la página no queda bloqueada.
7. En "Preguntas frecuentes" toca el buscador: la pantalla NO debe hacer zoom (iPhone). Escribe y abre un par de preguntas.
8. En la calculadora toca el campo de tickets: aparece el teclado numérico y no tapa el resultado.
9. Abre el menú (icono de arriba a la derecha): se abre, y un toque fuera o la X lo cierra.
10. Baja hasta "¿Dónde jugar?": los logos se deslizan solos y al tocar uno abre el sitio oficial en otra pestaña.
11. Entra a `/terminos` y toca un número del índice: baja al artículo sin pasarse.
12. Comparte el enlace de la web por WhatsApp: debe mostrarse la imagen azul con Kini y el eslogan (si no sale, espera o fuerza actualizar la vista previa; WhatsApp la guarda en caché).

## 5. Pendientes y dudas

- Dominio: `metadataBase`, canonical, sitemap e imágenes OG usan `https://ligakiniela.com` (como estaba). `ligakiniela.com` es también el sitio de donde salen los datos; si esta web se publica en otro dominio, hay que definir `NEXT_PUBLIC_SITE_URL`. DUDA para el cliente.
- Hosting del optimizador de imágenes: en Vercel funciona sin cambios (sharp incluido). Si se aloja de forma autoalojada con `next start`, conviene instalar `sharp`. Las imágenes del optimizador se cachean 1 día.
- Peso de los banners: el admin permite hasta 5 MB y la guía pide 250/300 KB; el optimizador lo amortigua, pero conviene validar en el admin (sugerencia, es M5).
- Para bajar el LCP bajo 2,5 s: quitar `supabase-js` de la landing (REST para banners y campeones) y que el servidor entregue también los campeones. Toca la capa de datos.
- La landing hace 4 consultas a Supabase al cargar, y 2 (edición y partidos antiguos) ya no se usan en pantalla.
- Logos sin referencia en `public/allies` (casa-grande, divino-play, fanaticash; D5 los descartó): se pueden borrar, no se enviaron al usuario. `images/unsplash` ya no se usa pero sigue autorizado en `next.config.mjs`.
- 9 `img` de aliados tienen `alt` igual al texto vecino (axe "minor"; Lighthouse da 100): opcional poner `alt=""`.
- Contraste de la marca: no hubo que cambiar ningún color.
- D7 (PIN del admin visible en pantalla de login) sigue como está por decisión del cliente.

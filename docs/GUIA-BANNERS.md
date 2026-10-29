# Guía de banners de Liga Kiniela

La pieza gráfica trae **toda** la información (título, monto, fechas, llamado a la acción). La web no escribe nada encima: solo muestra la imagen. Todo lo que quieras que se lea debe estar dentro de la imagen.

## Cuántas piezas hay que crear por banner

**Dos versiones del mismo banner**, porque la forma de la pantalla es distinta:

| Versión | Dónde se ve | Medida | Proporción |
|---|---|---|---|
| **Móvil** | Celulares (pantallas de menos de 768 px de ancho) | **1080 × 1350 px** | 4:5 (vertical) |
| **Escritorio** | Tablets, laptops y PC (768 px o más) | **1920 × 720 px** | 8:3 (horizontal) |

Si subes solo una, la web usa esa en todas las pantallas y se verá recortada o con las letras muy pequeñas. Sube siempre las dos.

## Zonas seguras

Todo lo importante (textos, logos, cifras, caras) debe quedar **dentro de la zona segura**. Lo que quede fuera puede recortarse en pantallas raras, quedar bajo las esquinas redondeadas, o tapado por los puntitos del carrusel y las flechas.

| Versión | Margen lateral | Margen superior | Margen inferior | Zona segura (útil) |
|---|---|---|---|---|
| Móvil 1080 × 1350 | 72 px | 72 px | **110 px** | 936 × 1168 px |
| Escritorio 1920 × 720 | **120 px** | 56 px | **72 px** | 1680 × 592 px |

- El margen **inferior** es mayor porque ahí van los puntitos del carrusel.
- En escritorio, el margen **lateral** es mayor porque ahí aparecen las flechas al pasar el cursor.
- Las esquinas de la imagen se redondean, así que no pongas nada pegado a ellas.

Plantillas listas para abrir en tu editor y diseñar encima (la zona verde es la segura; la roja, no):

- `docs/banners/plantilla-escritorio-1920x720.png`
- `docs/banners/plantilla-movil-1080x1350.png`

Borra la capa de la plantilla antes de exportar.

## Tamaño de texto legible

En un celular, la imagen de 1080 px se reduce a unos 350 px (un tercio). Por eso:

- Móvil: letra principal de **90 px o más**; textos secundarios de **54 px o más**.
- Escritorio: en un laptop se ve a un 63% aproximado. Letra principal de **90 px o más**; secundaria de **48 px o más**.
- Evita texto fino, muy pequeño o con poco contraste con el fondo.

## Formato y peso

- **WebP** o **JPG** (calidad 80 a 85) para fotos y diseños con degradados. **PNG** solo si hay mucho texto plano y pocos colores.
- Peso: lo ideal es hasta **300 KB** el de escritorio y **250 KB** el de móvil. Más que eso carga lento con datos móviles.
- **Límite que bloquea el admin: 600 KB.** Una imagen más pesada no se sube; hay que comprimirla antes (por ejemplo en squoosh.app).
- Modo de color **sRGB**.
- No uses GIF ni imágenes animadas.

## Cuántos banners

Entre **2 y 5** activos. Se rotan solos cada 5,5 segundos. Si hay más, nadie los ve todos.

## Cómo se ven en pantalla

- La imagen llena todo el marco con su proporción exacta. Si respetas las medidas, **no se recorta nada**.
- No hay botón ni texto de la web encima. Si quieres un botón, dibújalo en la pieza (será parte de la imagen, no clicable).
- El campo "título" del admin ya no se muestra; sirve solo como descripción para personas con lector de pantalla. Descríbelo en una frase corta ("Premio de 2.500.000 Bs en la Kiniela Champions IV").

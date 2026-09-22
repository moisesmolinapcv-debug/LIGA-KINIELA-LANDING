# PLAN DE TRABAJO MAESTRO — LIGA KINIELA
> **Documento Oficial de Respaldo y Verdad Absoluta**
> **Dirección Técnica & Supervisión de Sistemas: LIGA KINIELA**
> **Actualización: Fase 3 — Carrusel Hero Billboard Comercial de Alto Impacto (Estilo SellaTuParley) & Optimización Ultra-Responsive Móvil/Tablet/Escritorio**

---

## 1. OBJETIVOS Y ALCANCE ACTUALIZADO

1. **Nuevo Concepto de Banner Comercial: Hero Billboard Slider (Estilo Casas de Apuestas / SellaTuParley):**
   - Transformación del banner en una **valla publicitaria gráfica completa (Billboard)** con rotación multibanner en carrusel, puntos de paginación (dots), flechas táctiles de navegación y soporte de deslizamiento swipe.
   - Ubicación estelar: en la parte superior del Hero, inmediatamente debajo del Navbar, sirviendo de entrada visual de máxima atracción.
   - Soporte Dual Responsivo:
     - **Escritorio (Desktop):** Imagen panorámica widescreen apaisada (`aspect-[21/8]` o `aspect-[3/1]`).
     - **Móvil / Tablet:** Imagen vertical/cuadrada (`aspect-[4/5]` o `aspect-[1/1]`) para que el arte nunca se corte ni encoja en teléfonos.
   - Botón interactivo sobrepuesto con microanimación (ej: *"Ver Partidos de la Jornada →"* o *"Consultar Premios →"*) que realiza scroll suave hacia la sección interna sin salir del sitio.
   - Rotación automática inteligente (autoplay con pausa en hover o touch).
2. **Gestión Multibanner en el Panel Administrativo (/admin):**
   - Capacidad para crear, editar, reordenar y activar/desactivar múltiples slides publicitarios.
   - Campos por banner: Título, URL Imagen Escritorio, URL Imagen Móvil, Texto de Botón, Destino de Scroll interno (`#partidos`, `#premios`, etc.) y Estado activo.
   - Selector de vista previa dual en el Admin: conmutador [🖥️ Vista Escritorio] / [📱 Vista Móvil] para validar en tiempo real antes de guardar.
3. **Mandato de Optimización Responsiva Extrema (Mobile-First / Tablet / Desktop):**
   - Dimensiones, paddings y jerarquía tipográfica calibradas milimétricamente en todas las resoluciones (desde 360px en smartphones compactos, pasando por 768px en tablets, hasta 1920px en pantallas ultra-wide).
   - Prevención de desbordamientos horizontales (`overflow-x-hidden`), áreas táctiles mínimas de 44x44px para accesibilidad táctil, y renderizado fluido a 60fps.

---

## 2. MANUAL DE IDENTIDAD Y BRANDING (REGLA ESTRICTA)

- **Colores Oficiales:**
  - `Azul Noche (Fondo Base)`: `#00063E` (RGB `0, 6, 62`)
  - `Vinotinto Deportivo`: `#882445` (RGB `136, 36, 69`)
  - `Oro / Amarillo Cálido`: `#FFAF3F` (RGB `255, 175, 63`)
  - `Blanco Puro`: `#FFFFFF`
- **Tipografías:**
  - `Rockwell`: Títulos principales, denominaciones de kinielas, cifras en `Bs`.
  - `Poppins`: Textos de lectura, interfaz de usuario, tablas de partidos, barra inferior y paneles.
- **Uso del Isologo:**
  - Sobre fondo oscuro se debe utilizar estrictamente la versión con **reborde/outline blanco protector** (según página 6 del manual).

---

## 3. MÓDULOS DE IMPLEMENTACIÓN FASE 3

### Módulo A: Modelo de Datos y Tienda Reactiva Multibanner
- Actualizar interfaces en `src/types/kiniela.ts`:
  ```ts
  export interface BannerSlide {
    id: string;
    title: string;
    image_url: string; // Versión de escritorio panorámica
    image_url_mobile?: string; // Versión vertical/cuadrada para teléfonos
    button_text?: string;
    target_section?: string;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
  }
  ```
- Adaptar `src/lib/kiniela-store.ts` con CRUD para banners múltiples (`addBannerSlide`, `updateBannerSlide`, `deleteBannerSlide`, `getBannerSlides`). Semilla inicial con 3 banners deportivos venezolanos de alto calibre con arte dual.

### Módulo B: Componente HeroBillboardSlider (`src/components/HeroBillboardSlider.tsx`)
- Carrusel responsivo con soporte táctil (swipe), flechas anterior/siguiente y puntos de paginación (dots).
- Alternancia visual fluida entre `image_url` e `image_url_mobile` según la resolución mediante elementos `<picture>` o clases responsive (`hidden md:block` / `block md:hidden`).
- Botón de acción con estilo deportivo vinotinto/oro que desplaza suavemente hacia `#partidos` o `#premios`.

### Módulo C: Integración en Landing y Calibración Responsiva Total
- Colocación del `HeroBillboardSlider` en la cabecera del `Hero`.
- Ajustes de espaciado y tipografía para garantizar experiencia inmersiva perfecta en Móvil, Tablet y Escritorio.

### Módulo D: Módulo CMS de Banners en el Panel Administrativo
- Actualización de `BannerTab.tsx` para gestionar la colección de banners con switch de dispositivo [🖥️ Desktop / 📱 Móvil].

### Módulo E: Verificación Técnica del Agente Validador
- Compilación de producción con 0 errores TypeScript (`npm run build`).
- Verificación visual en vivo en `http://localhost:3000` y `/admin`.

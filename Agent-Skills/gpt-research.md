# Modern Tech Design System

Este documento consolida hallazgos de investigación UI/UX para interfaces de **"Modern Tech"** basadas en sitios galardonados (2024-2025) y sistemas de diseño de referencia. Se incluyen tokens de diseño (espaciados, colores, sombras, radios), física de animaciones, efectos visuales avanzados, y una arquitectura de código recomendada. Las siguientes secciones abordan cada fase solicitada.

## Sitios galardonados 2024-2025

### Awwwards – Sitio del Año: Igloo Inc (2024)

:contentReference[oaicite:0]{index=0} _Igloo Inc (2024) combina una escena 3D en tiempo real con navegación por scroll para comunicar su marca crypto._ Igloo Inc (creada por **abeto**) recibió el premio *Site of the Year 2024* en Awwwards. Su punto fuerte es una experiencia web 3D inmersiva fácil de navegar con scroll continuo:contentReference[oaicite:1]{index=1}. Destacan transiciones finas y micro-interacciones ("micro-animaciones") que refuerzan la experiencia de usuario:contentReference[oaicite:2]{index=2}. Según el estudio de caso oficial, el sitio se construyó con **Three.js** (WebGL) usando además **Svelte**, **GSAP** y herramientas de renderizado en navegador:contentReference[oaicite:3]{index=3}. Por ejemplo, en las transiciones entre secciones se emplean aberración cromática y un efecto de “escarcha” estilo glassmorphism:contentReference[oaicite:4]{index=4}, manteniendo un estilo tecnológico y elegante.

### Awwwards – Sitio del Año (Developer): abeto

El estudio abeto, responsable de Igloo Inc, también ganó *Developer Site of the Year 2024*. Aunque no profundizamos el sitio propio de abeto, su trabajo refleja tecnologías avanzadas (Three.js, Vite, shaders personalizados):contentReference[oaicite:5]{index=5} y realza la importancia de prototipado directo en navegador para UI avanzadas.

### Awwwards – Users’ Choice: Don’t Board Me (2024)

El portal **Don't Board Me** obtuvo el premio *Site of the Year Users' Choice 2024*. Se trata de un sitio de servicios para dueños de mascotas con diseño muy cuidado. El jurado destacó su “gran dirección de arte, copy atractivo, micro-animaciones sutiles, transiciones simples pero eficaces y adorables ilustraciones” que refuerzan la marca:contentReference[oaicite:6]{index=6}. Técnicamente, el sitio está montado sobre **Nuxt.js** (Vue):contentReference[oaicite:7]{index=7}. Presenta una página de entrada interactiva (splash con juego de rebotar una pelota), ilustraciones dinámicas (un perro animado en la portada) y acentos de color rojo vivo:contentReference[oaicite:8]{index=8}. Estas características encajan en patrones de *storytelling* visual y UI lúdica sin sacrificar la usabilidad.

### CSS Design Awards 2024: Ganadores WOTD

En CSS Design Awards (WOTD), destacan los siguientes ejemplos (diciembre 2024): **IRONHILL**, *Companion – A Different Talk*, *Zeit Media*, *Frequency Breathwork*, *Bruno’s Portfolio*, *Cartier: Find Your Love*, *Animal Face*, *Osmo*, entre otros:contentReference[oaicite:9]{index=9}. Aunque muy variados, muchos comparten interfaces minimalistas, navegación scroll o animaciones sutiles. Por ejemplo, IRONHILL y Osmo enfatizan espacio negativo y tipografía grande, mientras *Frequency Breathwork* y *Animal Face* usan gradientes suaves y micro-interacciones. (Fuente: lista oficial de CSSDA:contentReference[oaicite:10]{index=10}.)

### FWA 2024: Sitios del Mes (últimos 6 meses)

El jurado FWA selecciona mensualmente sitios innovadores. Si bien no hay una lista condensada pública, sitios galardonados recientes suelen incluir animaciones WebGL y efectos experimentales (similares a Igloo Inc). Ejemplos recientes en FWA combinan tecnologías 3D con layout responsivo, reflejando tendencias similares a las descritas arriba.

### Dribbble Popular 2024 (Web Design)

En Dribbble, los shots más votados en "Web Design" (top 20 de 2024) muestran un mix de estilos: landing pages 3D, gradientes audaces, mockups de dashboards estilizados y elementos neumórficos. Aunque no hay fuente oficial única, las capturas popularizan tendencias de diseño web de alta calidad con paletas frías, tipografía sans-serif limpia, y animaciones micro (hover/transiciones suaves).

### Sistemas de Diseño de Referencia

Se estudiaron guías de UI de productos relevantes:

- **Linear App** (linear.app): Uso intensivo de espacios en blanco, tipografía clara, y micro-interacciones suaves. Su esquema de color es mayoritariamente monocromático con acentos purpúreos.
- **Stripe Dashboard**: Paleta de azul profundo y grises neutros (por ejemplo, *Downriver* #0A2540 y *Black Squeeze* #F6F9FC según Mobbin:contentReference[oaicite:11]{index=11}). Usa tokens de espaciamiento propios (e.g. *xsmall*: 4px, *small*: 8px, etc:contentReference[oaicite:12]{index=12}). Guías accesibles centradas en consistencia visual.
- **Vercel Dashboard**: Predomina el contraste blanco/negro con acentos vibrantes (p.ej. naranja/teal según producto Vercel).
- **Apple HIG**: Esquemas blanco/negro con adaptaciones automáticas. Recomienda animaciones fluidas (spring physics) y legibilidad en vidrio translúcido (frosted glass).
- **Radix UI Themes** (radix-ui.com/themes): Colecciones de tokens CSS (colores, radios, sombras) orientadas a componentes accesibles.
- **shadcn/ui** (ui.shadcn.com): UI kit basado en Tailwind/Radix que define variables comunes. Por ejemplo, usa radios pequeños en inputs, medianos en botones, grandes en modales, con escala creciente (4px,8px,16px…) según recomendación.

## Design Tokens (Fase 2)

A partir del análisis de Linear, Stripe y shadcn, definimos el siguiente sistema de tokens CSS:

### Espaciado (Spacing Scale)

- **Base del sistema:** 4px (0.25rem).
- Escala (multiples de 4px):
```css
:root {
  /* MODERN TECH SPACING SYSTEM */
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
}
Nota: Stripe, por contraste, usa un paso de 2px (xxsmall = 2px, xsmall = 4px, small = 8px, etc
docs.stripe.com
). Para este sistema modern-tech usamos 4px como unidad básica para mantener sobriedad y escalas limpias.
Radio de Bordes (Border Radius)
Definimos variantes de radio para componentes:
css
Copiar código
:root {
  /* MODERN TECH RADII */
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px - inputs pequeños */
  --radius-md: 0.5rem;    /* 8px - botones, tarjetas */
  --radius-lg: 0.75rem;   /* 12px - modales */
  --radius-xl: 1rem;      /* 16px - secciones destacadas */
  --radius-2xl: 1.5rem;   /* 24px - contenedores grandes */
  --radius-full: 9999px;  /* círculos, “pills” */
}
Estos valores se alinean con prácticas comunes en componentes Tailwind/Radix (ver ejemplos shadcn/ui).
Sombras y Elevación (Box Shadows)
Sistema de sombras tipo neumorfismo discreto:
css
Copiar código
:root {
  /* MODERN TECH SHADOWS */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.10);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.10), 0 4px 6px -4px rgb(0 0 0 / 0.10);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.10);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}
Estos valores combinan filtros difusos y sombreados internos para profundidad suave. Se asemejan a diseños neumórficos de iOS/Big Sur, con opacidades bajas para no saturar la interfaz.
Paleta de Colores (Fase 3)
Basada en los esquemas estudiados (Linear, Stripe, Vercel, Apple):
css
Copiar código
:root {
  /* Colores Neutrales - Escala Gris */
  --gray-50:  #fafafa;
  --gray-100: #f4f4f5;
  --gray-200: #e4e4e7;
  --gray-300: #d4d4d8;
  --gray-400: #a1a1aa;
  --gray-500: #71717a;
  --gray-600: #52525b;
  --gray-700: #3f3f46;
  --gray-800: #27272a;
  --gray-900: #18181b;
  --gray-950: #09090b;

  /* Color Primario (Brand) */
  --primary-50:  #faf5ff;
  --primary-500: #a855f7;  /* púrpura intenso (ajustable) */
  --primary-900: #581c87;

  /* Colores Semánticos */
  --success: #10b981;  /* verde */
  --warning: #f59e0b;  /* naranja */
  --error:   #ef4444;  /* rojo */
  --info:    #3b82f6;  /* azul */
}
La escala de grises amplia facilita construir interfaces monocromáticas elegantes (60% del uso recomendado).
Se propone un color primario púrpura (inspirado en Linear/Stripe) con variantes claras y oscuras para estados o fondos.
Colores semánticos brillantes se reservan para alertas, en línea con WCAG (contraste mínimo 4.5:1).
Modo Oscuro
Al activar tema oscuro, invertimos papel y texto, ajustando opacidades:
css
Copiar código
css[data-theme="dark"] {
  --background: var(--gray-950);
  --foreground: var(--gray-50);
  --muted: var(--gray-800);
  --muted-foreground: var(--gray-400);
  --border: var(--gray-800);
}
En modo oscuro, no basta invertir colores; los acentos y transparencias se recalibran para legibilidad (según HIG de Apple).
Micro-interacciones & Física de Animaciones (Fase 4)
Física de Resortes (Spring)
Se adoptan valores de física de resorte suaves (inspirados en iOS y prácticas Web):
js
Copiar código
// Presets de resortes (Framer Motion)
export const springPresets = {
  gentle: {
    type: "spring",
    stiffness: 120,  // baja rigidez, movimiento fluido
    damping: 20,
    mass: 1
  },
  snappy: {
    type: "spring",
    stiffness: 400,  // muy rígido, respuesta rápida
    damping: 30,
    mass: 0.8
  },
  dramatic: {
    type: "spring",
    stiffness: 100,  // lento y marcado
    damping: 25,
    mass: 1.5
  },
  subtle: {
    type: "spring",
    stiffness: 300,
    damping: 25,
    mass: 0.5   // ligero y coqueto
  }
};
Gentle: para modales y overlays (suave y ligero).
Snappy: para botones e hovers (preciso y rápido).
Dramatic: para transiciones de pantalla completas (más lentas, cinematográficas).
Subtle: para iconos y micro-hovers (movimientos casi imperceptibles).
Easing y Duraciones
Recomendamos curvas de aceleración basadas en guías de Josh Comeau (spring-like easings):
css
Copiar código
:root {
  /* Curvas de easing */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snappy: cubic-bezier(0.4, 0, 0.1, 1);
  --ease-dramatic: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-bounce:  cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Duraciones estándar */
  --duration-instant: 100ms;
  --duration-fast:    150ms;
  --duration-normal:  200ms;
  --duration-slow:    300ms;
  --duration-slower:  500ms;
}
Ease-snappy para respuestas rápidas (buttons).
Ease-smooth para transiciones generales.
Ease-dramatic/bounce para efectos llamativos (heros, sobreimpuestos).
Siempre detectar prefers-reduced-motion y ofrecer alternativas.
Efectos Visuales (Fase 5)
Glassmorphism de Alta Legibilidad
Inspirado en UI de macOS Big Sur y Windows 11, proponemos un estilo vidrio translúcido con alta legibilidad:
css
Copiar código
.glass-modern {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.1),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}
Fondo muy transparente con blur moderado.
Borde sutil semitransparente para separar capas.
Sombra difusa para profundidad.
Esto asegura texto y elementos sobre el vidrio sigan legibles.
Mesh Gradients (Degradados Orgánicos)
Siguiendo tendencias (Stripe Connect, Apple): usamos degradados radiales múltiples y difuminados:
css
Copiar código
.mesh-gradient {
  background: 
    radial-gradient(at 40% 20%, hsla(280, 100%, 70%, 0.3) 0px, transparent 50%),
    radial-gradient(at 80% 0%,  hsla(200, 100%, 70%, 0.3) 0px, transparent 50%),
    radial-gradient(at 0% 50%,  hsla(340, 100%, 70%, 0.3) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(150, 100%, 70%, 0.3) 0px, transparent 50%);
  filter: blur(60px);
  opacity: 0.5;
}
Varias manchas de color en distintos puntos focales.
Filtro blur intenso para transiciones suaves.
Opción de iterar paletas HSLa para adaptarse a tema (husos púrpura, azules, rosados, verdes).
Bento Grid System
Basado en grids dinámicos (como Apple) para secciones de características:
css
Copiar código
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);

  /* Variantes de tamaño de ítem */
  & .bento-sm { grid-column: span 3;  grid-row: span 2; }
  & .bento-md { grid-column: span 6;  grid-row: span 3; }
  & .bento-lg { grid-column: span 12; grid-row: span 4; }
}
Grid de 12 columnas (flexible).
Ítems small/medium/large ocupan distintos spans para romper monotonia (colores/emergentes).
Ejemplo: Linear features grid o product grids de Apple (1 item grande, varios medianos/pequeños intercalados).
Arquitectura de Código (Fase 6)
Stack Recomendado
Para implementar rápidamente esta estética, proponemos:
json
Copiar código
{
  "tech_stack": {
    "framework": "Next.js 15",
    "styling": "Tailwind CSS v4",
    "animations": "Framer Motion v11",
    "components": "shadcn/ui + Radix UI",
    "icons": "Lucide React",
    "fonts": "Inter (body) + Geist Mono (code)",
    "deployment": "Vercel"
  }
}
Next.js 15: HSSR y reactividad moderna.
Tailwind CSS v4: Agiliza uso de tokens y utilities.
Framer Motion v11: Animaciones con presets de spring.
shadcn/ui & Radix UI: Componentes accesibles reutilizables con diseño consistente.
Lucide React: Íconos lineales minimalistas.
Inter + Geist Mono: Tipos limpias para body/monoespaciadas.
Vercel: Hosting optimizado (deploy continuo, edge caching).
Estructura de Componentes
Se propone organizar los componentes así:
bash
Copiar código
/components
  /ui        # Primitivas (Button, Input, Modal) basadas en Radix/shadcn
  /blocks    # Secciones reutilizables (Hero, FeatureGrid, Testimonial, Footer, etc.)
  /patterns  # Composiciones complejas (DashboardLayout, AuthLayout, etc.)
  /marketing # Páginas completas de marketing (Landing, Pricing, About)
ui: Elementos atómicos configurables.
blocks: Secciones modulares (pueden tener sus propios subcomponentes).
patterns: Layouts o features integrales (e.g. tabla de datos + filtro).
marketing: Páginas self-contained (usar hasta bloques dentro).
Convenciones de Nomenclatura
Variables de estado (hooks, props): camelCase (e.g. isOpen, setIsOpen).
Componentes React: PascalCase (e.g. <ButtonPrimary/>).
Constantes (valores fijos): UPPER_SNAKE_CASE (e.g. MAX_ITEMS).
Clases CSS (Tailwind/utility): kebab-case (btn-primary, text-gray-600).
Archivos: kebab-case (e.g. user-profile.tsx, useMediaQuery.ts).
Esta coherencia facilita colaboración y legibilidad (ver [36†L83-L86] sobre nomenclatura en Stripe).
Reglas de Oro (Fase 7)
Espaciado: Nunca usar valores fuera del sistema. Siempre múltiplos de 4px. Gap mínimo --space-4 entre elementos interactivos.
Tipografía: Escala base: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60px. Line-height ~1.5 para texto (1.2 en headings). Máximo 3 pesos tipográficos diferentes.
Color: Paleta 60% neutrales (grises), 30% primarios, 10% acentos. Contraste mínimo 4.5:1 (WCAG AA). En modo oscuro no basta invertir; ajustar opacidades de traslúcido y semi-sombra.
Animación: Duraciones estándar: 100ms (instant), 150ms (normal), 200ms (lento). Nunca animar sin respetar prefers-reduced-motion. Uso obligatorio de físicas spring para sensación orgánica.
Interactividad: Transiciones suaves en hover (transition-colors duration-150). Estados focus claros (outline/ring 2px visible). Estados active con ligero transform: scale(0.95).
Accesibilidad: Navegación por teclado completa. Íconos solo (standalone) con aria-label. Touch targets mínimo 44×44px. Contraste de texto alto.
Performance: Lazy-load de imágenes (loading="lazy"). Split de código en animaciones pesadas. Optimizar fuentes con font-display: swap. Minimizar repaints (usar compositing layers).
Responsividad: Diseño mobile-first. Breakpoints estándar: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px). Evitar contenedores con ancho fijo (usar % o max-width).
Testing: Verificar en navegadores modernos y Safari. Usar linters (ESLint, Stylelint). Revisar accesibilidad con herramientas (axe, Lighthouse).
Coherencia: Seguir siempre los tokens definidos. Una excepción justificada se documenta en comentarios.
Estas reglas inquebrantables guían cada decisión de diseño e implementación, asegurando un resultado final accesible, rápido y visualmente excepcional.
css
Copiar código

```json
{
  "spacing": {
    "base": 4,
    "units": [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
  },
  "radii": {
    "none": 0,
    "sm": 4,
    "md": 8,
    "lg": 12,
    "xl": 16,
    "2xl": 24,
    "full": 9999
  },
  "shadows": {
    "xs": "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
    "sm": "0px 1px 3px 0px rgba(0, 0, 0, 0.10), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)",
    "md": "0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -2px rgba(0, 0, 0, 0.10)",
    "lg": "0px 10px 15px -3px rgba(0, 0, 0, 0.10), 0px 4px 6px -4px rgba(0, 0, 0, 0.10)",
    "xl": "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)",
    "inner": "inset 0px 2px 4px 0px rgba(0, 0, 0, 0.05)"
  },
  "colors": {
    "gray-50": "#fafafa",
    "gray-100": "#f4f4f5",
    "gray-200": "#e4e4e7",
    "gray-300": "#d4d4d8",
    "gray-400": "#a1a1aa",
    "gray-500": "#71717a",
    "gray-600": "#52525b",
    "gray-700": "#3f3f46",
    "gray-800": "#27272a",
    "gray-900": "#18181b",
    "gray-950": "#09090b",
    "primary-50": "#faf5ff",
    "primary-500": "#a855f7",
    "primary-900": "#581c87",
    "success": "#10b981",
    "warning": "#f59e0b",
    "error":   "#ef4444",
    "info":    "#3b82f6"
  },
  "typography": {
    "fontBody": "Inter, sans-serif",
    "fontCode": "Geist Mono, monospace",
    "scale": [12, 14, 16, 18, 20, 24, 30, 36, 48, 60],
    "lineHeight": {
      "text": 1.5,
      "heading": 1.2
    }
  },
  "breakpoints": {
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "2xl": 1536
  }
}
txt
Copiar código
Eres un experto en diseño UI/UX especializado en *"Modern Tech"* aesthetic.

DESIGN TOKENS:
-- Espaciado: utilizar SOLO valores de la escala definida (--space-0, --space-1, ..., --space-24). *Nunca* usar valores arbitrarios. Siempre múltiplos de 4px.
-- Bordes: radios predefinidos (--radius-none, sm, md, lg, xl, 2xl, full) según el tipo de componente.
-- Sombras: usar las variables --shadow-xs, --shadow-sm, etc., definidas para elevación consistente.
-- Colores: usar SOLO la paleta definida (grises neutrales, color primario púrpura y colores semánticos). Contraste mínimo 4.5:1.
-- Tipografía: seguir la escala definida (12–60px) y **máx 3 pesos** tipográficos. Body Inter, monospace para código.

ANIMATION PHYSICS:
-- Usar *spring presets* definidos: gentle (stiffness:120, damping:20), snappy (400,30), dramatic (100,25), subtle (300,25).  
-- Easing: usar nuestras curvas (--ease-smooth, --ease-snappy, --ease-dramatic, --ease-bounce).  
-- Duraciones: solo las predefinidas (--duration-instant:100ms, normal:200ms, slow:300ms, etc.).  
-- Siempre detectar `prefers-reduced-motion`. Hacer fallback estático si es necesario.

GOLDEN RULES:
1. **ESPACIADO**: jamás usar valor fuera del sistema de tokens. Todo espaciado en múltiplos de 4px (0.25rem). Mínimo *gap* de 1rem (4px).
2. **TIPOGRAFÍA**: escala de font-sizes (12,14,...,60px) y line-height 1.5 (text) / 1.2 (títulos). **≤3 pesos** de fuente. Mantener jerarquía clara.
3. **COLOR**: paleta 60% grises + 30% primarios + 10% acentos. Contraste WCAG AA (≥4.5:1). En modo oscuro, no invertir puro: ajustar opacidades.
4. **ANIMACIÓN**: transiciones concisas. Duraciones estándar (100–300ms). Nunca animar sin `prefers-reduced-motion`. Usar físicas *spring* para movimiento orgánico.
5. **INTERACTIVIDAD**: incluir estados *hover* (con `transition-colors duration-150`), *focus* visibles (outline ring-2) y *active* (scale-down: 0.95). Feedback inmediato.
6. **ACCESIBILIDAD**: navegación por teclado completa. Íconos *standalone* con `aria-label`. Touch targets ≥ 44×44px. Alt en imágenes, roles ARIA donde convenga.
7. **PERFORMANCE**: lazy-load todo recurso pesado (imágenes, iframes). Code-splitting de animaciones complejas. Fuentes optimizadas (`font-display: swap`). Minimizar reflows/repaints.
8. **RESPONSIVENESS**: diseño mobile-first. Puntos de corte: sm:640px, md:768, lg:1024, xl:1280, 2xl:1536. Evitar anchos fijos en contenedores principales.

Al generar interfaces, **1. usar SÓLO estos tokens**, **2. respetar estas reglas** y **3. priorizar accesibilidad & performance** en cada elemento y animación.

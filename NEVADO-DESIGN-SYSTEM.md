# NEVADO TREK // DESIGN SYSTEM & TOKENS

Este archivo es la **Única Fuente de Verdad (Single Source of Truth)** para el lenguaje visual de Nevado Trek. Define la jerarquía, tipografía y variables que garantizan una experiencia cohesiva y profesional.

---

## 🖼️ 1. MARCOS Y MÁRGENES (The Page Frame)

Esta es la regla más importante para la consistencia visual. Todas las secciones deben usar la variable global de espaciado **`frame`** para sus márgenes laterales (`px-frame`, `left-frame`, etc.).

| Dispositivo | Valor Real | Variable CSS | Descripción |
| :--- | :--- | :--- | :--- |
| **Móvil** | **12px** | `--page-frame: 0.75rem` | Margen compacto para pantallas pequeñas. |
| **Tablet** | **32px** | `--page-frame: 2rem` | Ajuste proporcional para tablets. |
| **Desktop** | **96px** | `--page-frame: 6rem` | Margen máximo de inmersión. |

> **Nota Técnica:** En Tailwind v4, usa la clase `px-frame` para aplicar estos márgenes de forma automática y responsiva.

---

## 📐 2. TYPOGRAPHY TOKENS (Tailwind)

| Token | Categoría | Tailwind Classes | Uso Principal |
| :--- | :--- | :--- | :--- |
| **DISPLAY XL** | H1 / H2 Section | `text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]` | Títulos masivos de sección. |
| **SUB-LABEL** | Eyebrow | `font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-500` | Pequeñas etiquetas sobre los títulos. |
| **HEADING L** | H3 / Item Title | `text-2xl md:text-3xl font-bold tracking-tight` | Títulos de tarjetas, beneficios o tours. |
| **BODY LEAD** | Paragraph | `text-sm md:text-lg font-light leading-relaxed` | Párrafos descriptivos y testimonios. |
| **TECH CAPTION** | Data / Metadata | `font-mono text-[9px] tracking-[0.2em] uppercase opacity-60` | Coordenadas, logs técnicos, fechas. |

---

## 📱 3. RESPONSIVE LAYOUT TOKENS

### A. Espaciado Vertical (Section Padding)
- **Compact:** `py-20 md:py-32` - Para secciones de datos o grids.
- **Narrative:** `py-32 md:py-48 lg:py-60` - Para Statement y Hero donde el scroll debe respirar.

### B. Contenedores (Max-Width)
- **Standard:** `max-w-7xl` (1280px) - Para la mayoría de las secciones.
- **Cinematic:** `max-w-[1400px]` - Para secciones con mucho impacto visual.
- **Reading:** `max-w-4xl` (896px) - Para bloques de texto largo o manifiestos.

### C. Gaps (Grids & Stacks)
- **Micro:** `gap-4 md:gap-6` - Entre iconos y textos.
- **Component:** `gap-10 md:gap-16` - Entre tarjetas de un grid.
- **Section Flow:** `gap-24 md:gap-32` - Entre bloques grandes de contenido.

---

## 🎨 4. COLOR PALETTE

- **Atmosphere Dark:** `#020617` (Slate-950) - Fondo principal para inmersión.
- **Atmosphere Light:** `#ffffff` / `#f8fafc` (Slate-50) - Fondos editoriales limpios.
- **Electric Accent:** `text-cyan-500` (Dark) / `text-cyan-600` (Light) - Call to action y datos vivos.
- **Muted Text:** `text-slate-400` / `text-slate-500` - Jerarquía secundaria.

---

## 🛠 5. UI CONVENTIONS

- **Borders:** `border-white/10` (Dark) o `border-slate-100` (Light).
- **Rounding:** `rounded-2xl` para tarjetas estándar, `rounded-[2.5rem]` para elementos masivos.
- **Motion:** GSAP `scrub: 1`, `ease: "power2.out"` o `"expo.out"` para una sensación premium.
- **Textures:** Capa de ruido (grain) SVG obligatoria en secciones masivas para evitar banding.

---

## 🤖 6. AI PROMPT GUIDE (Instrucciones para la IA)

> **"Actúa como el Director de Diseño de Nevado Trek. Cada vez que crees o refactorices una UI, DEBES leer los tokens definidos en `NEVADO-DESIGN-SYSTEM.md`. No inventes tamaños de texto ni márgenes nuevos. Respeta estrictamente la regla de los Marcos (px-6 / 24px en mobile). Si una nueva sección requiere un estilo que no existe en este inventario, DETENTE, propón el nuevo token al usuario y, tras su aprobación, actualiza este archivo antes de escribir código."**

---

## 📝 7. LOG DE ACTUALIZACIONES
- **2025-12-25:** Promoción de los **Marcos laterales (24px mobile)** a regla de primer nivel.
- **2025-12-25:** Añadida sección de **Responsive Layout Tokens**.
- **2025-12-25:** Creación inicial del sistema. Estandarización de 5 niveles tipográficos y paleta base.
# NEVADO TREK // DESIGN SYSTEM & TOKENS

Este archivo es la **Única Fuente de Verdad (Single Source of Truth)** para el lenguaje visual de Nevado Trek. Define la jerarquía, tipografía y variables que garantizan una experiencia cohesiva y profesional.

---

## 📐 1. TYPOGRAPHY TOKENS (Tailwind)

| Token | Categoría | Tailwind Classes | Uso Principal |
| :--- | :--- | :--- | :--- |
| **DISPLAY XL** | H1 / H2 Section | `text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]` | Títulos masivos de sección. |
| **SUB-LABEL** | Eyebrow | `font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-500` | Pequeñas etiquetas sobre los títulos. |
| **HEADING L** | H3 / Item Title | `text-2xl md:text-3xl font-bold tracking-tight` | Títulos de tarjetas, beneficios o tours. |
| **BODY LEAD** | Paragraph | `text-sm md:text-lg font-light leading-relaxed` | Párrafos descriptivos y testimonios. |
| **TECH CAPTION** | Data / Metadata | `font-mono text-[9px] tracking-[0.2em] uppercase opacity-60` | Coordenadas, logs técnicos, fechas. |

---

## 🎨 2. COLOR PALETTE

- **Atmosphere Dark:** `#020617` (Slate-950) - Fondo principal para inmersión.
- **Atmosphere Light:** `#ffffff` / `#f8fafc` (Slate-50) - Fondos editoriales limpios.
- **Electric Accent:** `text-cyan-500` (Dark) / `text-cyan-600` (Light) - Call to action y datos vivos.
- **Muted Text:** `text-slate-400` / `text-slate-500` - Jerarquía secundaria.

---

## 🛠 3. UI CONVENTIONS

- **Borders:** `border-white/10` (Dark) o `border-slate-100` (Light).
- **Rounding:** `rounded-2xl` para tarjetas estándar, `rounded-[2.5rem]` para elementos masivos.
- **Motion:** GSAP `scrub: 1`, `ease: "power2.out"` o `"expo.out"` para una sensación premium.
- **Textures:** Capa de ruido (grain) SVG obligatoria en secciones masivas para evitar banding.

---

## 🤖 4. AI PROMPT GUIDE (Instrucciones para la IA)

> **"Actúa como el Director de Diseño de Nevado Trek. Cada vez que crees o refactorices una UI, DEBES leer los tokens definidos en `NEVADO-DESIGN-SYSTEM.md`. No inventes tamaños nuevos. Respeta estrictamente el tracking-tighter en títulos masivos y el espaciado mono en los sub-labels. Si una nueva sección requiere un estilo que no existe en este inventario, DETENTE, propón el nuevo token al usuario y, tras su aprobación, actualiza este archivo antes de escribir código."**

---

## 📝 5. LOG DE ACTUALIZACIONES
- **2025-12-25:** Creación inicial del sistema. Estandarización de 5 niveles tipográficos y paleta base.

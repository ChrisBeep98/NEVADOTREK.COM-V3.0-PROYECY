# NEVADO TREK // DESIGN SYSTEM & TOKENS

Este archivo es la **Única Fuente de Verdad (Single Source of Truth)**. Define la jerarquía visual que debe estar sincronizada con `app-v1/app/globals.css`.

---

## 🛠️ IMPLEMENTACIÓN TÉCNICA
- **Ubicación de Variables:** `app-v1/app/globals.css`
- **Metodología:** Tailwind v4 (@theme inline + @utility)

---

## 🖼️ 1. MARCOS Y MÁRGENES (The Page Frame)
Usa siempre la variable `--spacing-frame` para consistencia.

| Dispositivo | Valor Real | Clase CSS |
| :--- | :--- | :--- |
| **Móvil** | **12px** | `px-frame` |
| **Tablet** | **32px** | `px-frame` |
| Desktop | 96px | `px-frame` |

---

## 📏 1.2 ESPACIADO VERTICAL (Section Padding)
Define el **ritmo vertical** entre bloques de contenido.

| Escenario | Espacio Total Deseado | Clase CSS |
| :--- | :--- | :--- |
| **Móvil** | **80px** | `.section-v-spacing` |
| **Desktop** | **160px** | `.section-v-spacing` |

---

## 📐 2. TYPOGRAPHY TOKENS (Semánticos)

| Token | Clase CSS | Estilos Base |
| :--- | :--- | :--- |
| **H-TOUR-TITLE** | `.text-h-tour-title` | `text-6xl md:text-8xl lg:text-[6vw] font-medium tracking-tighter leading-[0.95]` |
| **H-SECTION-TITLE** | `.text-h-section-title` | `text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.2]` |
| **SUB-LABEL** | `.text-sub-label` | `font-bold text-[11px] tracking-[0.15em] uppercase text-cyan-500` |
| **JOURNAL DATA** | `.text-journal-data` | `font-semibold text-[10px] tracking-[0.05em] uppercase opacity-70` |
| **TEXT-SM** | `.text-sm` (Utility) | `text-sm tracking-[0.04em] leading-relaxed` |

---

## 🎨 3. COLOR PALETTE & MODES

### 3.0 FILOSOFÍA ATMOSFÉRICA (The Mood Direction)
- **🌑 NIGHT CAMP (Dark Mode):** Direccionalidad hacia adentro. Evoca misterio, seguridad en el refugio y la inmensidad del cielo nocturno. El contraste se logra mediante **Glows** (resplandores) y **Blurs**.
- **☀️ GLACIAL DAY (Light Mode):** Direccionalidad hacia afuera. Evoca la pureza del hielo, el aire nítido de la cumbre y la escala monumental de la montaña. El contraste se logra mediante **Sombras Finas** y **Tipografía Profunda** (#050B1A).

### 3.1 NÚCLEO ATMOSFÉRICO (Semantic Mapping)

| Variable CSS | Token Tailwind | Dark Mode (Night Camp) 🌑 | Light Mode (Glacial Day) ☀️ | Uso |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `bg-background` | `#040918` (Deep Navy) | `#F8FAFC` (Ice White) | Lienzo principal |
| `--foreground` | `text-foreground` | `#EDEDED` (Off White) | `#050B1A` (Deep Blue Slate) | Texto principal (Títulos) |
| `--muted` | `text-muted` | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) | Textos secundarios / Lead |
| `--border` | `border-border` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.1)` | Líneas divisorias sutiles |
| `--surface` | `bg-surface` | `rgba(255,255,255,0.03)` | `rgba(0,0,0,0.03)` | Tarjetas / Paneles base |
| `--glass` | `bg-glass` | `rgba(2,6,23,0.7)` | `rgba(255,255,255,0.7)` | Fondos con backdrop-blur |

### 3.2 BRAND ACCENTS (Universal)
Estos colores mantienen su vibrancia en ambos modos, pero su percepción cambia por contraste.
- **Summit Cyan:** `--color-cyan-500` (`#06b6d4`)
- **Andean Green:** `--color-emerald-400` (`#34d399`)
- **Páramo Orange:** `--color-orange-500` (`#f97316`)

> **Nota de Diseño Light Mode:** En modo claro, los acentos cian/naranja deben usarse con moderación para no competir con el fondo blanco. Preferir bordes o textos pequeños sobre fondos sólidos grandes.

---

## 🔘 4. INTERACTIVE COMPONENTS

### **BTN-PRIMARY** (`.btn-primary`)
El botón de mayor jerarquía. Debe destacar por su pureza y contraste.
- **Fondo:** `White` (#FFFFFF)
- **Texto:** `Slate-950` (#040a16)
- **Tipografía:** `font-bold text-[11px] tracking-[0.2em] uppercase`
- **Forma:** `Pill (rounded-full)`
- **Efecto Hover:** Fondo `Cyan-400`, Sombra `Cyan-500/20`, icon shift.
- **Efecto Active:** `Scale 95%`.

---

## 🤖 5. AI PROMPT & SYNC RULE
> **"Si vas a crear un botón o elemento interactivo, verifica siempre la sección 4 de este documento."**

---

## 📝 7. LOG DE ACTUALIZACIONES
- **2025-12-30:** Refinamiento de atmósfera: Cambio de tono de fondo a Glacial Core (#040a16) para mayor energía visual.
- **2025-12-30:** Ajuste global de atmósfera: Cambio de Slate-950 de #020617 a #01040a (tono más azulado/frío).
- **2025-12-29:** Refinamiento visual del token `BTN-PRIMARY` (especificaciones de sombra y tipografía).
- **2025-12-29:** Creación del token `H-SECTION-TITLE` (Leading 1.2).
- **2025-12-29:** Adición de `Andean Green`.
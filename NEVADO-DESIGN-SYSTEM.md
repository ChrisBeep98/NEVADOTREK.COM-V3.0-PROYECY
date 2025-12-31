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

---

## 🎨 3. COLOR PALETTE & MODES
Nevado Trek utiliza **Tokens Semánticos** para asegurar la compatibilidad con Light y Dark Mode.

### 3.1 NÚCLEO ATMOSFÉRICO
| Token | Dark Mode (Default) | Light Mode (Próximamente) | Uso |
| :--- | :--- | :--- | :--- |
| **`color-background`** | `#040918` (Deep Mountain Navy) | `#F8FAFC` | Fondo principal de sección |
| **`color-foreground`** | `#EDEDED` | `#0F172A` | Texto base |
| **`color-surface`** | `rgba(255,255,255,0.02)` | `rgba(0,0,0,0.02)` | Contenedores sutiles |

### 3.2 BRAND ACCENTS
- **Summit Cyan:** `--color-cyan-500` (`#06b6d4`)
- **Andean Green:** `--color-emerald-400` (`#34d399`)
- **Páramo Orange:** `--color-orange-500` (`#f97316`)

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
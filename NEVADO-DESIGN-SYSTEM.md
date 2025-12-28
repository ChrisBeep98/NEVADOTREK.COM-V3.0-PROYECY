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
Define los márgenes superiores e inferiores de cada bloque de contenido.

| Escenario | Valor Real | Clase CSS |
| :--- | :--- | :--- |
| **Móvil** | **80px** | `.section-v-spacing` |
| **Desktop** | **160px** | `.section-v-spacing` |

---

## 📐 2. TYPOGRAPHY TOKENS (Semánticos)
*No uses clases manuales de font-weight o size en componentes. Usa estos tokens:*

| Token | Clase CSS | Estilos Base (Sincronizados) |
| :--- | :--- | :--- |
| **DISPLAY XL** | `.text-display-xl` | `text-5xl md:text-8xl font-bold tracking-normal leading-[1.3]` |
| **HEADING XL** | `.text-heading-xl` | `text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.3] uppercase` |
| **STATEMENT** | `.text-statement` | `text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-relaxed` |
| **SUB-LABEL** | `.text-sub-label` | `font-mono text-[10px] tracking-[0.4em] uppercase text-cyan-500` |
| **HEADING L** | `.text-heading-l` | `text-2xl md:text-3xl font-medium tracking-tight` |
| **BODY LEAD** | `.text-body-lead` | `text-sm md:text-lg font-light leading-relaxed` |
| **BODY STANDARD** | `.text-body-std` | `text-xs md:text-base font-light leading-relaxed opacity-70` |
| **JOURNAL DATA** | `.text-journal-data` | `font-mono text-[9px] tracking-[0.2em] uppercase opacity-60 italic` |

---

## 🎨 3. COLOR PALETTE
- **Atmosphere Dark:** `--color-slate-950` (`#020617`)
- **Summit Cyan (Accent):** `--color-cyan-500` (`#06b6d4`)
- **Glacier Blue:** `--color-blue-500` (`#3b82f6`)
- **Páramo Orange:** `--color-orange-500` (`#f97316`)
- **Vertical Purple:** `--color-purple-500` (`#a855f7`)

---

## 🤖 4. AI PROMPT & SYNC RULE (Regla de Oro)

> **"Actúa como el Guardián del Sistema de Diseño. Cuando el usuario pida un cambio visual (ej: 'baja el peso de los títulos'), DEBES realizar una acción doble obligatoria:
> 1. Actualizar este archivo (`NEVADO-DESIGN-SYSTEM.md`) con el nuevo valor.
> 2. Actualizar inmediatamente `app-v1/app/globals.css` en las secciones `@theme` o `@utility`.
> NUNCA modifiques clases manuales en los componentes para cambios globales. Si un componente no usa tokens semánticos, tu primera tarea es refactorizarlo para que los use."**

---

## 🛑 REGLA DE ORO PARA LA IA (AI PROTOCOL)
> **"Si estás leyendo esto para realizar un cambio visual: DETENTE. No edites clases de Tailwind directamente en los archivos `.tsx`. 
> 1. Identifica el token semántico que el componente está usando (ej: `text-display-xl`).
> 2. Realiza el cambio en el valor del token dentro de `app-v1/app/globals.css` bajo la directiva `@utility`.
> 3. Refleja el cambio en este documento.
> De esta forma, un solo cambio actualizará toda la plataforma de manera consistente."**

---

## 📝 7. LOG DE ACTUALIZACIONES
- **2025-12-26:** Expansión de la paleta cromática: Adición de Blue, Orange y Purple como acentos técnicos secundarios.
- **2025-12-26:** Creación del token `HEADING XL` (text-7xl uppercase) para encabezados creativos de alto impacto.
- **2025-12-26:** Creación del token `STATEMENT` (text-5xl) para manifiestos tipográficos sin títulos.
- **2025-12-26:** Adición del token `BODY STANDARD` para bloques de texto largos y minimalistas.
- **2025-12-26:** Estandarización técnica: Mapeo de tokens a clases CSS semánticas en `globals.css`.
- **2025-12-26:** Refinamiento estético: Reducción de peso tipográfico (Display XL -> Bold, Heading L -> Medium).
- **2025-12-25:** Creación inicial.

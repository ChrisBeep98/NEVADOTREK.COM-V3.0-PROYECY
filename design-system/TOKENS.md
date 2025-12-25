# Nevado Trek - Design Tokens

Based on "Modern Tech" Standard (Linear/Vercel) + "Andean Nature".

## 1. Colors (Tailwind CSS Variables)

```css
:root {
  /* BACKGROUNDS (Volcanic Rock Scale) */
  --bg-deep:   #020617; /* Slate-950: The darkest volcanic night */
  --bg-surface:#0f172a; /* Slate-900: Dark rock */
  --bg-card:   rgba(15, 23, 42, 0.6); /* Glass effect base */

  /* PRIMARY (Frailejón Gold - Adventure & Warmth) */
  /* Purpose: Primary Buttons, Key Highlights */
  --primary-glow: #fbbf24; /* Amber-400 */
  --primary:      #f59e0b; /* Amber-500 */
  --primary-dark: #d97706; /* Amber-600 */

  /* SECONDARY (Wax Palm Green - Nature & Safety) */
  /* Purpose: Success states, nature badges */
  --nature-light: #4ade80; /* Green-400 */
  --nature:       #22c55e; /* Green-500 */
  --nature-deep:  #14532d; /* Green-900 */

  /* ACCENT (Glacial Ice - Tech & Cold) */
  /* Purpose: Links, Hovers, Active States */
  --ice:      #06b6d4; /* Cyan-500 */
  --ice-glow: #67e8f9; /* Cyan-300 */

  /* TEXT */
  --text-primary:   #f8fafc; /* Slate-50 (White-ish) */
  --text-secondary: #94a3b8; /* Slate-400 (Grey) */
  --text-muted:     #475569; /* Slate-600 */
}
```

## 2. Typography

*   **Display Font:** `Syne` (Google Fonts).
    *   *Why?* Es una fuente diseñada originalmente para una galería de arte. Su peso "Extra Bold" es excepcionalmente ancho, lo que le da un carácter arquitectónico y monumental, ideal para representar la inmensidad de los volcanes.
    *   *Usage:* Headings (H1-H3), Big Numbers, y frases de impacto.
*   **Body Font:** `Inter` o `Geist Sans`.

## 3. Spacing System (4px Grid)

Strict adherence to the `Agent-Skills` spacing.
*   `space-1` (4px): Icon gaps.
*   `space-4` (16px): Card padding (internal).
*   `space-8` (32px): Section gaps (mobile).
*   `space-20` (80px): Section gaps (desktop).

## 4. Effects (Glassmorphism & Shadows)

**The "Mist" Effect (Glass):**
Used for cards to simulate the foggy paramo atmosphere.
```css
.glass-panel {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}
```

**The "Summit" Shadow (Elevation):**
```css
.shadow-summit {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
}
```

## 5. Radii (Modern Tech)
*   `rounded-lg` (8px): Standard UI elements (inputs).
*   `rounded-2xl` (24px): Cards and Containers. Soft, friendly corners contrasting with the "sharp" mountains.

# Nevado Trek - Component Guide

## 1. Buttons

### Primary (The "Expedition" Button)
High visibility, used for "Book Now" or "See Itinerary".
*   **Bg:** `bg-primary` (Amber-500).
*   **Text:** `text-slate-950` (Dark contrast).
*   **Shape:** `rounded-full` (Pill shape) or `rounded-xl`.
*   **Interaction:**
    *   Hover: Lift (`-translate-y-1`) + Glow (`shadow-[0_0_20px_rgba(245,158,11,0.5)]`).
    *   Click: Scale down (`scale-95`).

```jsx
<button className="bg-amber-500 text-slate-950 px-6 py-3 rounded-xl font-bold font-display 
                   hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/20 
                   active:scale-95 transition-all duration-200">
  Reservar Cupo
</button>
```

### Secondary (The "Info" Button)
Ghost/Glass style.
*   **Bg:** `bg-white/5` (Glass).
*   **Border:** `border border-white/10`.
*   **Text:** `text-slate-200`.

## 2. Cards (The "Trek" Card)

Designed to hold beautiful photography + key data (Altitude, Difficulty).

*   **Structure:** Vertical Stack.
*   **Image:** Aspect Ratio 4:5 (Tall) or 16:9.
*   **Overlay:** Gradient from bottom (black) to transparent for text readability.
*   **Data Badges:** Small glass pills on top of the image.

```jsx
<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
  {/* Image with Zoom Effect */}
  <div className="aspect-[4/5] overflow-hidden">
     <img src="/nevado.jpg" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
  </div>
  
  {/* Content Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
     <span className="text-amber-400 text-xs font-mono mb-2">3 DÍAS / 2 NOCHES</span>
     <h3 className="text-2xl font-display text-white mb-1">Cima del Tolima</h3>
     <p className="text-slate-300 text-sm line-clamp-2">Experiencia de alta montaña para caminantes expertos.</p>
  </div>
</div>
```

## 3. Navigation (The "Compass")

Floating navigation bar (Mac OS Dock style or Floating Island).
*   **Position:** Fixed bottom (mobile) or Sticky top (desktop).
*   **Style:** Heavy Blur Glass (`backdrop-blur-xl`).
*   **Border:** High contrast border (`border-white/20`).

## 4. Typography Scale (Syne)

*   **H1 (Hero):** `text-5xl md:text-7xl font-bold tracking-tighter`.
*   **H2 (Section):** `text-3xl md:text-4xl font-bold`.
*   **Eyebrow (Labels):** `text-xs font-mono uppercase tracking-widest text-amber-500`.

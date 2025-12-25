# Nevado Trek - Competitor & Trend Research

## 1. Competitor Landscape (Salento/Quindío)

### Key Players
*   **Páramo Trek:** Strong reputation, functional website. Design is standard (White/Green), text-heavy. Focus on safety and logistics.
*   **Colombian Summit:** Adventure focused. Layout is traditional. Good photos but lacks interactive "wow" factor.
*   **Montañas Colombianas:** Basic booking interface.

### The Gap (Oportunidad)
None of the local competitors use a **narrative-driven, cinematic web experience**. They sell a "service", not a "feeling".
*   **Nevado Trek Strategy:** Use the **"Modern Tech"** aesthetic to position the brand as the premium, high-tech, safe, and professional choice.
*   **Differentiation:** While others show static photos, Nevado Trek will use **Motion** (Parallax, Scroll-trigger) to simulate the ascent.

## 2. Visual Identity Concept: "Volcanic Glass"

Merging the `Agent-Skills` (Modern Tech) with the Andean environment.

### Color Palette Rationale
*   **Base:** Instead of `Zinc-950` (Standard Tech), we use `Slate-950` (Blue-tinted dark grey) to represent the **Volcanic Rock** and **Twilight** in the mountains.
*   **Primary:** `Frailejón Gold`. The Frailejón leaves reflect sunlight. This yellow/amber cuts through the fog (and the dark UI) effectively.
*   **Accent:** `Glacial Blue`. Represents the snow/ice of Santa Isabel/Tolima. Used sparingly for hover states.

## 3. UX/UI Trends 2025 Applied

*   **Bento Grids:** Use for Itineraries. Instead of a long list, a grid of "Day 1", "Day 2", "Gear" boxes looks modern and organized.
*   **Scrollytelling:** The homepage should feel like a hike.
    *   *Top:* Cocora Valley (Green/Warm).
    *   *Middle:* Cloud Forest/Páramo (Foggy/Mystical).
    *   *Bottom:* Summit/Snow (Dark/Stark/Minimal).
*   **Immersive Video:** Hero section must be a looping drone video of the peaks/palms with a dark overlay.

## 4. Technical Constraints
*   **Performance:** High-quality images of mountains are heavy. We must use `Next.js Image` optimization and `WebP`.
*   **Offline:** Users might check itinerary in Salento (spotty WiFi). The UI should look good even while loading.

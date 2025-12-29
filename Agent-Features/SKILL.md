---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: For **Nevado Trek**, the tone is **Editorial, Cinematic, High-Altitude, and Premium**. It is not just "adventure"; it is "Expedition". Think National Geographic meets high-end fashion editorial.
- **Constraints**: Technical requirements (Next.js, Tailwind v4, GSAP, TypeScript).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: STRICTLY use the defined typography tokens from `NEVADO-DESIGN-SYSTEM.md` and `globals.css` (e.g., `text-h-expedition`, `text-hero-title`). Do not use raw Tailwind sizes unless absolutely necessary for a custom effect. Typography should be treated as a graphical element.
- **Color & Theme**: Commit to the **Nevado Brand Palette**. Use `slate-950` (Atmosphere Dark) as the primary background. Use Accents (`cyan-500`, `orange-500`, `blue-500`) sparingly but sharply to guide attention.
- **Motion (The "Creative Motion" Standard)**: 
    - Use **GSAP** for all complex animations. 
    - Prioritize **ScrollTrigger** for revealing content. Elements should not just "appear"; they should enter the stage.
    - Use `clip-path` for revealing images.
    - Use `parallax` (different scroll speeds) to create depth.
- **Spatial Composition**: 
    - **Vertical Rhythm**: Respect the `section-v-spacing` utility.
    - **Page Frame**: Always respect `--spacing-frame` / `px-frame`.
    - **Asymmetry**: Avoid perfect centering everywhere. Use offset grids and overlapping elements to create tension and interest.
- **Backgrounds & Visual Details**: 
    - Avoid flat backgrounds. Use subtle gradients (e.g., `from-slate-900 to-slate-950`) or noise textures.
    - Use `backdrop-blur` for overlays but keep them legible.
  
NEVER use generic AI-generated aesthetics like overused font families, cliched color schemes (particularly purple gradients on white backgrounds unless specified by brand), predictable layouts, and cookie-cutter design.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

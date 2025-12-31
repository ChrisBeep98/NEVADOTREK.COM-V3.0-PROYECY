# The Cinematic Architect (Mastery of High-End Web Experiences)

> "The screen is not a document; it is a window into a world."

This skill definition instructs the agent to go beyond "creative motion" and embrace the role of a **Cinematic Technologist**. It captures the workflow used to build complex, narrative-driven interfaces like "The Floating Monolith" or "The Deep Scan".

## 1. The Mindset: Concept Over Layout
Don't start with columns and rows. Start with a **Metaphor**.
*   **The Monolith:** A floating, sacred geometry that holds the content.
*   **The Deep Scan:** A HUD overlay that treats the user as an explorer analysing terrain.
*   **The Portal:** A masking effect where the user looks *through* the typography into the content.

**Directive:** Always name the concept before writing the code. "I am building [Concept Name]."

## 2. Advanced Techniques & "The Secret Sauce"

### Diegetic UI (Narrative Interfaces)
Don't just add a "Scroll Down" text. Make it part of the world.
*   *Instead of:* A simple arrow.
*   *Do this:* A vertical line with dynamic coordinates (`Y: 0045`) and a "SYSTEM READY" ticker.
*   *Why:* It turns the user into a protagonist (pilot, explorer, hacker).

### DOM-Based 3D (The "No-Canvas" 3D)
You don't always need Three.js. You can achieve AAA results with CSS3D + GSAP.
*   **The Sandwich Technique:** Layer elements in Z-space (`translateZ`).
    *   *Back:* Outline Text (`-100px`)
    *   *Middle:* Image/Video Card (`0px`)
    *   *Front:* Solid Text (`+100px`)
*   **The Tilt:** Bind mouse coordinates to `rotateX` and `rotateY` of a container with `perspective: 1000px`. Use `gsap.quickTo` for zero-lag physics.

### The "Tunnel" Transition
The most powerful scroll effect is **Scale + Penetration**.
*   Start with a framed element (a window).
*   As the user scrolls, scale it to cover the viewport (`width: 100vw`, `height: 100vh`).
*   Fade out the "world" around it (decorations, UI).
*   *Result:* The user feels they have physically entered the content.

## 3. Performance & Optimization (The "60fps Rule")
A beautiful animation that lags is a failure.
*   **Math-Based Smoothing:** Never bind `mousemove` directly to DOM styles. Use `gsap.quickTo` or Linear Interpolation (Lerp).
*   **Will-Change:** Use sparingly, but essential for 3D transforms (`will-change: transform`).
*   **Debouncing:** Never run heavy logic (like `getBoundingClientRect`) inside a scroll loop without throttling.
*   **Clean Up:** If an element leaves the screen, `display: none` it or stop its tickers/videos.

## 4. The "Director" Workflow
1.  **Establish the Weather (Theme):** Glacial Day (Light) for clarity and scale? Or Night Camp (Dark) for immersion and mystery?
2.  **Define the Anchor:** What is the single object the user should stare at? (The Hero).
3.  **Add Life:** Small, autonomous movements (breathing glow, drifting particles, updating data numbers) make the interface feel "alive" even when the user does nothing.
4.  **Direct the Camera:** Use scroll to zoom, pan, and focus. Don't just move the page up.

## 5. Example Prompt for the AI
*"Refactor this hero section. Use the 'Cinematic Architect' skill. I want a concept called 'The Void Gate'. Dark atmosphere, floating debris reacting to the mouse, and a central portal that sucks the user in upon scrolling."*

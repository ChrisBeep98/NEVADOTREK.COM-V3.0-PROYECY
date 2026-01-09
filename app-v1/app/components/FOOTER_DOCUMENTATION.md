# Footer System Documentation

## Overview

The Footer system consists of three interconnected components that work together to create a cinematic horizontal scroll effect where a weather widget slides in from the right as the user scrolls vertically.

## Architecture

```
FooterWithWidget (Wrapper)
├── Footer (Main footer content)
└── FooterWidget (Weather panel)
```

## Components

### 1. FooterWithWidget.tsx (Orchestrator)

**Purpose**: Wrapper component that manages the horizontal scroll animation using GSAP ScrollTrigger.

**Key Features**:
- Pins the viewport when the footer section is reached
- Converts vertical scroll into horizontal movement
- Responsive behavior: 94vw push on mobile, 40vw on desktop

**GSAP Animation Logic**:
```typescript
const isMobile = window.innerWidth < 768; // md breakpoint
const widgetWidthPercent = isMobile ? 0.94 : 0.4;
const scrollDistance = window.innerWidth * widgetWidthPercent;

gsap.to(horizontalRef.current, {
    x: `-${widgetWidthPercent * 100}vw`,  // Push footer left
    ease: 'none',
    scrollTrigger: {
        trigger: containerRef.current,
        pin: true,                         // Pin viewport
        scrub: 1,                          // Sync with scroll
        end: () => "+=" + scrollDistance,  // Scroll distance
    }
});
```

**How It Works**:
1. User scrolls down to footer
2. Viewport gets pinned (fixed in place)
3. Continued vertical scrolling moves content horizontally
4. Footer slides left, widget slides in from right
5. Animation completes when widget is fully visible

---

### 2. Footer.tsx (Main Content)

**Purpose**: The main footer component with contact information, navigation, and the iconic "EXPLORE" text.

**Dimensions**:
- Width: `w-screen` (100vw)
- Height: `h-screen` (100vh)
- Shrink: `flex-shrink-0` (prevents compression)

**Theme System**:
- Light mode: `bg-[#FAFAFA]` with `text-[#02040a]`
- Dark mode: `dark:bg-[#02040a]` with `dark:text-[#EDEDED]`

**Visual Effects**:
1. **Inset Shadow** (right edge for depth):
   - Light: `shadow-[inset_-20px_0_30px_-10px_rgba(0,0,0,0.1)]`
   - Dark: `shadow-[inset_-20px_0_30px_-10px_rgba(0,0,0,0.3)]`

2. **Background Glow**:
   - Subtle radial gradient centered at 30% from top
   - Light: `bg-indigo-900/10`
   - Dark: `bg-cyan-900/5`

**GSAP Letter Animations** (O, R, E in "EXPLORE"):

The last three letters of "EXPLORE" have a "Focus Pull" animation:

```typescript
// Shared animation properties
const focusAnim = {
    filter: 'blur(0px)',    // Sharp focus
    opacity: 1,             // Full opacity
    ease: 'power2.out',
    scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 20%',
        end: 'bottom bottom',
        scrub: 1
    }
};

// Letter 'O' - Subtle rise
gsap.fromTo(letterORef.current, 
    { y: '2vw', filter: 'blur(12px)', opacity: 0.4 },
    { ...focusAnim, y: '-1vw' }
);

// Letter 'R' - Peak (highest)
gsap.fromTo(letterRRef.current, 
    { y: '2vw', filter: 'blur(12px)', opacity: 0.4 },
    { ...focusAnim, y: '-4vw', scrollTrigger: { ...focusAnim.scrollTrigger, scrub: 1.5 } }
);

// Letter 'E' - Medium rise
gsap.fromTo(letterERef.current, 
    { y: '2vw', filter: 'blur(12px)', opacity: 0.4 },
    { ...focusAnim, y: '-2vw', scrollTrigger: { ...focusAnim.scrollTrigger, scrub: 2 } }
);
```

**Animation Effect**:
- Letters start blurred and low
- As user scrolls, they sharpen and rise
- Creates a "mountain peak" effect: O (low) → R (peak) → E (medium)

**Content Structure**:
1. Top label: "+ Contact Us"
2. Main heading: "Ready to start your next adventure?"
3. Email link with arrow icon
4. Navigation links (Inicio, Expediciones, Galería)
5. Social media bubbles (Facebook, Instagram, WhatsApp)
6. Giant "EXPLORE" text with animated letters
7. Bottom bar: Copyright and "Nevado Trek" branding

---

### 3. FooterWidget.tsx (Weather Panel)

**Purpose**: A premium weather widget displaying live time, date, and weather information for Salento, Quindío.

**Dimensions**:
- Mobile: `w-[94vw]` (94% of viewport)
- Desktop: `md:w-[40vw]` (40% of viewport)
- Height: `h-screen` (100vh)

**Responsive Design**:

| Element | Mobile | Desktop |
|---------|--------|---------|
| Padding | `px-6` (24px) | `md:px-16` (64px) |
| Clock Size | `text-[5rem]` | `md:text-[8rem]` |
| Temperature | `text-5xl` | `md:text-6xl` |
| Spacing | `space-y-8` | `md:space-y-12` |

**Visual Design**:

1. **Border** (left edge):
   - Light: `border-gray-200` (visible separator)
   - Dark: `border-white/5` (subtle)

2. **Background**:
   - Subtle gradient glow: `from-cyan-500/5 via-transparent to-purple-500/5`

3. **Dividers**:
   - Light: `via-gray-200`
   - Dark: `via-white/10`

**Content Sections**:

1. **Date & Time**:
   - Live clock (updates every second)
   - Format: 24-hour (HH:MM)
   - Date with calendar icon
   - Gradient text: `from-cyan-400 via-blue-500 to-purple-600`

2. **Weather Card**:
   - Location: Salento, Quindío
   - Temperature: 18°C
   - Condition: Partly Cloudy
   - Icon: Sun with gradient background

3. **Weather Stats** (3-column grid):
   - Wind: 8 km/h
   - Humidity: 75%
   - Altitude: 1,895m

4. **Trek Status Badge**:
   - Pulsing green dot
   - Text: "Perfect Trek Conditions"
   - Emerald color scheme

5. **Credit**:
   - "Made By Christian Sandoval"
   - Left-aligned, gray text
   - Separated by border

**Live Clock Implementation**:
```typescript
const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
}, []);
```

---

## User Experience Flow

1. **Initial State**: User sees page content normally
2. **Scroll to Footer**: User scrolls down to footer section
3. **Pin Activation**: Viewport pins when footer reaches trigger point
4. **Horizontal Scroll**: Continued vertical scrolling moves content horizontally
5. **Footer Slides Left**: Footer pushes left (40vw desktop, 94vw mobile)
6. **Widget Reveals**: Weather widget slides in from right
7. **Letter Animation**: O, R, E letters animate (blur → sharp, rise)
8. **Complete**: Widget fully visible, footer partially visible

---

## Technical Details

### Scroll Trigger Points

**FooterWithWidget**:
- Trigger: `containerRef.current`
- Pin: `true`
- Scrub: `1` (smooth sync)
- End: `"+=" + scrollDistance`

**Footer Letters**:
- Trigger: `containerRef.current`
- Start: `'top 20%'`
- End: `'bottom bottom'`
- Scrub: `1` (O), `1.5` (R), `2` (E)

### Responsive Breakpoints

- Mobile: `< 768px` (Tailwind `md` breakpoint)
- Desktop: `≥ 768px`

### Z-Index Hierarchy

1. Footer content: `z-10` (relative)
2. Background glow: Default (behind content)
3. Widget: Same level as footer (horizontal siblings)

---

## Integration

All pages use `FooterWithWidget` instead of `Footer` directly:

```tsx
import FooterWithWidget from './components/FooterWithWidget';

export default function Page() {
    return (
        <main>
            {/* Page content */}
            <FooterWithWidget />
        </main>
    );
}
```

**Pages Updated**:
- `app/page.tsx` (Home)
- `app/tours/page.tsx` (Expeditions)
- `app/tours/[id]/page.tsx` (Tour Detail)

---

## Performance Considerations

1. **GSAP ScrollTrigger**: Optimized for 60fps
2. **GPU Acceleration**: Transforms use `x` (not `left`)
3. **Scrub**: Smooth interpolation with `scrub: 1`
4. **Will-change**: Implicit via GSAP transforms
5. **Live Clock**: Single interval, cleaned up on unmount

---

## Maintenance Notes

### To Modify Widget Width:
1. Update `FooterWidget.tsx`: `w-[94vw] md:w-[40vw]`
2. Update `FooterWithWidget.tsx`: `widgetWidthPercent` values

### To Adjust Letter Animation:
- Modify `y` values in `Footer.tsx` GSAP animations
- Adjust `scrub` values for speed differences

### To Change Weather Data:
- Update location, temperature, stats in `FooterWidget.tsx`
- Consider integrating real weather API

### To Disable Horizontal Scroll:
- Replace `<FooterWithWidget />` with `<Footer />` in pages
- Footer will behave as normal static component

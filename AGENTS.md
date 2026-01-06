# AGENTS.md - Nevado Trek Project Guidelines

This document serves as a guide for agentic coding assistants working on this Next.js tourism booking application.

## PROJECT OVERVIEW
Next.js 16 + React 19 + TypeScript tourism website with Spanish/English i18n, GSAP animations, and static export for GitHub Pages deployment.

## ESSENTIAL COMMANDS

```bash
# Development
npm run dev              # Start development server on localhost:3000

# Build & Deploy
npm run build            # Production build with static export
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## TESTING
No test framework is currently configured. When adding tests, consult with the team first.

## CODE STYLE & CONVENTIONS

### File Organization
```
app-v1/
├── app/
│   ├── components/          # Reusable UI components
│   ├── context/            # React Context providers
│   ├── services/           # API calls and data fetching
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Helper functions
├── dictionaries/           # i18n translations (es.json, en.json)
└── public/                 # Static assets
```

### Component Conventions
- Use functional components with TypeScript
- Add `"use client"` at top when using hooks (useState, useEffect, useRef, etc.)
- Define interfaces for all props: `interface TourCardProps { tour: Tour; index: number; }`
- Export default components: `export default function TourCard()`
- Use `const` for variables, only use `let` when reassignment is needed
- Refs: `const containerRef = useRef<HTMLDivElement>(null)`

### Naming Conventions
- **Components**: PascalCase (HeroMonolith, TourCard, BookingModal)
- **Functions**: camelCase (getTours, toggleLang, fetchDepartures)
- **Interfaces/Types**: PascalCase (Tour, TourCardProps, LocalizedText)
- **Variables**: camelCase (tourList, isVisible, currentDate)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL, CACHE_DURATION)
- **Boolean prefixes**: is/has/should (isActive, hasTours, shouldAnimate)

### Import Organization
1. React imports first
2. Third-party libraries (lucide-react, gsap, next/link)
3. Local imports (context, services, types, components)
4. CSS imports (if any)

```tsx
import React, { useRef, useEffect } from 'react';
import { Calendar, Thermometer } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { getTours } from '../services/nevado-api';
import { Tour } from '../types/api';
```

### TypeScript Best Practices
- All API responses must have typed interfaces (see app/types/api.ts)
- Use optional chaining `?.` for nested properties
- Define enums for fixed sets: `type Locale = 'ES' | 'EN'; type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';`
- Strict mode is enabled - ensure all types are properly defined
- Use `Readonly` for props that shouldn't change: `Readonly<{ children: React.ReactNode; }>`

### Styling Guidelines
- Use Tailwind CSS v4 utilities extensively
- Prefer semantic utility classes from globals.css:
  - Typography: `text-h-tour-title`, `text-h-section-title`, `text-sub-label`, `text-journal-data`, `text-body-std`
  - Components: `btn-primary`, `btn-secondary`, `section-v-spacing`
- Use CSS variables for theming: `bg-background`, `text-foreground`, `text-muted`, `border-border`
- Dark mode: Add `dark` class to parent or use `@variant dark (&:where(.dark, .dark *))`
- Responsive design: Mobile-first approach with `md:` and `lg:` breakpoints
- Animations: Use GSAP with `@gsap/react` hook: `useGSAP(() => { gsap.to(...) }, { scope: ref })`
- GPU optimization: Use `transform-gpu`, `will-change-transform` for animated elements

### API Integration
- API service functions in app/services/
- Use Next.js fetch with caching: `fetch(url, { next: { revalidate: 300 } })`
- Error handling with try-catch, return empty array on failure:
```tsx
try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed: ${response.status}`);
    return await response.json();
} catch (error) {
    console.error("Error fetching:", error);
    return []; // or undefined for single items
}
```
- Filter active tours: `tours.filter(tour => tour.isActive)`

### Internationalization (i18n)
- Use `useLanguage()` hook in client components
- Dictionary key access: `t.hero.title` or `t.tours.name`
- Always handle both ES and EN translations
- Store language preference in localStorage

### GSAP Animation Patterns
- Register plugins: `gsap.registerPlugin(ScrollTrigger, useGSAP)`
- Use `useGSAP` hook for component lifecycle cleanup
- ScrollTrigger for scroll-based animations
- GPU-optimized transforms: avoid animating `width`, `height`, `left`, `top`
- Use `will-change` and `transform-gpu` for better performance

### Error Handling
- Always use try-catch for async operations
- Log errors with descriptive messages: `console.error("Error fetching tours:", error)`
- Return fallback values (empty array, undefined) rather than throwing
- Validate data before rendering: `tours?.map(tour => ...)` or optional chaining

### Accessibility
- Use semantic HTML (header, main, section, nav)
- Add alt text to images: `alt={tour.name[l]}`
- Use ARIA labels where appropriate
- Keyboard navigation support
- Focus states for interactive elements

### Performance
- Use Next.js Image component when available (currently unoptimized in config)
- Lazy load heavy components
- Debounce/throttle event handlers
- Code splitting with dynamic imports where beneficial
- Use `will-change` sparingly (only on animating elements)

### Component Patterns
- Separation of concerns: Keep data fetching in services, UI in components
- Props drilling is okay for shallow hierarchies, use Context for global state
- Keep components small and focused (<200 lines preferred)
- Extract reusable subcomponents

### Git & Deployment
- Static export for GitHub Pages (next.config.ts: `output: "export"`)
- basePath and assetPrefix only in production
- Images are unoptimized for static export compatibility
- Build output goes to `out/` directory

### CODE REVIEWS CHECKLIST
- [ ] All imports used and organized
- [ ] TypeScript types properly defined (no `any`)
- [ ] Error handling in async functions
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Dark mode compatible
- [ ] Accessibility features present
- [ ] Performance considerations (will-change, GPU transforms)
- [ ] No console.log in production code
- [ ] Follows NEVADO-DESIGN-SYSTEM.md tokens
- [ ] i18n translations added for both ES and EN

## IMPORTANT NOTES
- No test framework configured - add only when approved
- GSAP animations should be GPU-optimized (use `transform-gpu`, `scale`, `translate`, `rotate`)
- Always use semantic typography classes from globals.css
- The design system is documented in NEVADO-DESIGN-SYSTEM.md - consult it for color tokens, spacing, and component specifications
- Static export mode requires careful handling of dynamic routes and APIs

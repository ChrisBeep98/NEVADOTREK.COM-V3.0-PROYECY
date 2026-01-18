# 🏗️ Frontend Architecture & Tech Stack

> **Last Updated:** 2026-01-16
> **Project:** Nevado Trek Frontend (App v1)

## 1. Core Technology Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS v4
- **Animation:** GSAP (GreenSock) + ScrollTrigger
- **Notifications:** Sonner (Toast System)
- **Icons:** Lucide React
- **Package Manager:** NPM

## 2. Architectural Patterns

### 2.1 Design System: Liquid Glass (Apple-Style)
We use a high-end "Liquid Glass" aesthetic characterized by:
- **Depth:** High-intensity backdrop blur (40px) and semi-transparent layers.
- **Atmosphere:** Dynamic gradients (Iridescent White in Light Mode, Deep Navy in Dark Mode).
- **Precision:** Sub-pixel borders (`border-slate-200/60` or `white/10`) and inner rings for object definition.

### 2.2 Component Strategy
- **Server Components (RSC):** Used for initial data fetching (`page.tsx`) to ensure SEO and performance.
- **Client Components (`'use client'`):** Used for interactive elements like the `BookingModal` (92vw width, max-width 1520px), `BoldCheckout`, and GSAP animations.
- **Defensive Rendering:** Components use optional chaining and fallbacks to handle incomplete API data gracefully.

### 2.2 Hybrid API Architecture
We employ a split API strategy to maintain content reliability while testing new features:
- **Production API:** Fetches tour content, prices, and departures.
- **Staging API:** Handles secure booking creation and payment initialization (Bold Sandbox).

### 2.3 Form Persistence
The `BookingModal` implements a "Smart Form" pattern:
- **Local Storage:** User data (name, email, phone, document) is persisted in `localStorage` (`nevado_user_draft`) to prevent data loss on accidental reloads.
- **Auto-Formatting:** Phone numbers are automatically converted to international format (`+57`) before submission.

## 3. Performance & Stability
- **Build Resilience:** Google Fonts are handled with system fallbacks to prevent build failures during network instability.
- **Script Injection:** Third-party scripts (Bold) are injected programmatically with strict DOM cleanup to avoid race conditions and duplicate elements.
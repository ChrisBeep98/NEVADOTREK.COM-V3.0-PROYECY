# 🏗️ Frontend Architecture & Tech Stack

> **Last Updated:** 2026-01-19
> **Project:** Nevado Trek Frontend (App v1)
> **Environment:** 🟢 PRODUCTION

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
- **Client Components (`'use client'`):** Used for interactive elements like the `BookingModal` (92vw width, max-width 1520px) and GSAP animations.
- **Defensive Rendering:** Components use optional chaining and fallbacks to handle incomplete API data gracefully.

### 2.3 API Architecture (Production)
We employ a centralized API strategy pointing to the Production Environment:
- **Base URL:** `https://api-wgfhwjbpva-uc.a.run.app/public`
- **Responsibilities:**
    - **Content:** Fetches tour content, prices, and departures from the live database.
    - **Transactions:** Handles real booking creation and payment initialization via Bold Smart Links.

### 2.4 Production Guards
- **Phone Sanitization:** Automatic removal of spaces and non-numeric characters from phone numbers to comply with messaging API standards.
- **Error Handling:** Robust error catching for API failures with user-friendly Toast notifications.

### 2.5 Form Persistence
The `BookingModal` implements a "Smart Form" pattern:
- **Local Storage:** User data (name, email, phone, document) is persisted in `localStorage` (`nevado_user_draft`) to prevent data loss on accidental reloads.
- **Auto-Formatting:** Phone numbers are automatically converted to international format (`+57`) before submission.

## 3. Performance & Stability
- **Build Resilience:** Google Fonts are handled with system fallbacks.
- **Smart Links:** Payments are handled via direct redirection to `checkout.bold.co`, eliminating risks associated with embedded scripts/widgets.
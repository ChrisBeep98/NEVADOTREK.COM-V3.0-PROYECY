# 🔌 External Integrations & Bold Payments

## 1. Bold Checkout Integration (v1.0)

The Bold payment button is integrated following a secure "Backend-First" handshake pattern.

### 1.1 The Handshake Flow
1.  **Booking Creation:** Frontend sends user data to `POST /bookings/private` (Staging).
2.  **Payment Init:** Frontend calls `POST /payments/init` with the resulting `bookingId`.
3.  **Secure Payload:** Backend returns signed data (`integritySignature`, `apiKey`, `paymentReference`).
4.  **Clean Injection:** Frontend injects the Bold script programmatically into a dedicated container.

### 1.2 "Clean Injection" Pattern
To avoid the common "data-api-key required" error in React/Next.js, the `BoldCheckout` component uses a strict injection sequence:
- **Wipe Container:** Clear previous script/elements using `innerHTML = ''`.
- **Pre-configure:** Create `<script>` element and set all `data-` attributes *before* appending to DOM.
- **Append & Execute:** Append to DOM to trigger script loading and execution.

### 1.3 Mandatory Attributes
| Attribute | Source | Description |
| :--- | :--- | :--- |
| `data-bold-button` | Static | Always "true" |
| `data-api-key` | API | Public key from backend |
| `data-integrity-signature` | API | Secure hash for the transaction |
| `data-order-id` | API | Maps to `paymentReference` |
| `data-redirection-url` | API | Targeted to `/payment-result` |

## 3. Circular Payment Flow (UX)

To provide a seamless experience, the application uses a "Circular Flow" that returns the user exactly where they started after payment.

### 3.1 Path Persistence
- **Trigger:** When the `BookingModal` is opened, it immediately saves the current `window.location.pathname` to `localStorage` under the key `lastTourPath`.
- **Reason:** This ensures that even if the user is redirected to an external gateway (Bold), the application remembers which tour they were booking.

### 3.2 The Redirect Loop
1.  **Bold Gateway:** Upon completion, redirects to `/payment-result?bold-tx-status=approved`.
2.  **Trampoline Page (`/payment-result`):**
    - Reads `lastTourPath` from `localStorage`.
    - Redirects the user back to the tour page, appending `?payment_status=approved&ref=...`.
3.  **Auto-Aperture (Client-side):**
    - `TourHeader` and `BookingModal` use vanilla JavaScript (`window.location.search`) to detect the success parameter.
    - If detected, the modal opens automatically and skips to **Step 3 (Success State)**.

### 3.3 Technical Stability (No-Suspense Pattern)
To maintain the high-end GSAP animations and static build performance, we avoid Next.js `useSearchParams` in the main layout components. Instead, we use a standard `useEffect` with `URLSearchParams(window.location.search)`. This prevents "Hydration Bailout" and "Missing Suspense" errors that would otherwise break the Hero section's visual integrity.


# 🔌 External Integrations & Bold Payments

## 1. Bold Checkout Integration (v2.0 - Payment Bridge Pattern)

### 1.1 The Payment Bridge Pattern
We isolate the payment process in a separate "disposable" tab to handle third-party script hijacking and improve UX stability.

1.  **Modal (Main Tab):** User clicks "Ir a Pagar" -> Opens `/payment-bridge` in new tab.
2.  **Bridge (New Tab):** Loads the Bold script safely. User completes payment here.
3.  **Synchronization:** The Main Tab enters a "Waiting/Polling" state, checking the backend status periodically.

### 1.2 Handshake Flow & Dual-Endpoint Strategy
The frontend determines the appropriate backend endpoint based on the booking mode:

- **Private Mode:** Calls `POST /bookings/private` with `tourId` and `date`.
- **Public Mode:** Calls `POST /bookings/join` with `departureId`.

**Financial Formula:** 
- `Total = Price * Pax`.
- `Deposit = 30% of Total`.
- `Final Pay Now = Deposit * 1.05` (Includes 5% Transactional Tax).

### 1.3 Synchronization & Polling
While the Payment Bridge is open, the `BookingModal` polls the following endpoint every 5 seconds:
**Endpoint:** `GET /public/bookings/:bookingId`

**Status Logic:**
- **`approved`:** Polling stops, modal mutates to Success state.
- **`rejected`:** Polling stops, modal shows error message allowing for retry.

---

## 2. Notification Hooks (Telegram/Instagram)

The Staging Backend is configured to send notifications to Telegram upon successful booking creation.
- **Requirement:** The `tourId` sent must exist in the Staging database.
- **Dev Bypass:** The frontend forces `test-tour-001` during local development to ensure these notifications are triggered regardless of the page content.

---

## 3. Circular Payment Flow (UX)

- **Bridge Redirection:** Upon successful payment, Bold redirects the Bridge Tab to `/payment-result`.
- **Parallel Sync:** Simultaneously, the Main Tab detects the success via polling and updates its UI, ensuring the user sees the confirmation immediately upon returning to the site.

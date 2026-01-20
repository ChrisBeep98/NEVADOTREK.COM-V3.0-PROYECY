# 🔌 External Integrations & Bold Payments

## 1. Bold Checkout Integration (v2.7.5 - Production Smart Links)

### 1.1 The Smart Link Pattern
We use a robust **Server-to-Server Smart Link** strategy pointing to the Production Environment. This ensures maximum security and compliance.

1.  **Request:** User clicks "Pagar" -> Frontend calls `initBoldPayment`.
2.  **Generation:** Production Backend talks to Bold API -> Returns a unique `paymentUrl`.
3.  **Redirection:** Frontend redirects the popup/tab directly to `checkout.bold.co`.
4.  **Return:** After payment, Bold redirects back to `/payment-result`.

### 1.2 Handshake Flow & Endpoints
The frontend determines the appropriate backend endpoint based on the booking mode:

- **Private Mode:** Calls `POST /bookings/private` with `tourId` and `date`.
- **Public Mode:** Calls `POST /bookings/join` with `departureId`.

**Financial Formula (Server-Side):**
- **Calculation:** Performed entirely on the server to ensure integrity.
- **Deposit:** 30% of the total tour value.
- **Fee:** 5% "Management Fee" (Costos de Gestión) added to the deposit.
- **Frontend Display:** Shows the pre-calculated `amount` provided by the API.

### 1.3 Synchronization & Polling
While the user is on the Bold page, the `BookingModal` (which remains open in the original tab) polls the status:
**Endpoint:** `GET /public/bookings/:bookingId`

**Status Logic (Extended):**
- **`approved`:** Payment successful -> Show Green "Success" UI.
- **`rejected`:** Bank rejection -> Show Red "Payment Rejected" UI.
- **`expired`:** Time limit reached -> Show Warning "Link Expired" UI.
- **`voided`:** Transaction voided -> Show Warning "Transaction Voided" UI.

---

## 2. Notification Hooks (Telegram/Instagram)

The Production Backend is configured to send real notifications to the sales team upon successful booking creation.
- **Requirement:** The `tourId` sent must exist in the Production database (Contentful/Firestore).
- **Previous Staging Logic:** The "Force Staging Mode" (test-tour-001) has been **removed** for production deployment.

---

## 3. UX Resilience

- **Self-Healing UI:** If the payment fails or expires, the UI allows retry without data loss.
- **Language Persistence:** The `payment-result` page detects the user's language preference (`localStorage`) to display status messages in English or Spanish.

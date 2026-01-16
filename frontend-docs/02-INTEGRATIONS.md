# 🔌 External Integrations & Bold Payments

## 1. Bold Checkout Integration (v2.0 - Payment Bridge Pattern)

> **Changed in v2.0:** Moved from direct in-modal script injection to a "Payment Bridge" pattern to handle third-party script hijacking and improve UX stability.

### 1.1 The Payment Bridge Pattern
Instead of rendering the Bold button directly inside the `BookingModal`, we isolate the payment process in a separate "disposable" tab.

1.  **Modal (Main Tab):** User clicks "Ir a Pagar" -> Opens `/payment-bridge` in new tab.
2.  **Bridge (New Tab):** Loads the Bold script safely. User completes payment here.
3.  **Synchronization:** The Main Tab enters a "Waiting/Polling" state, checking the backend status periodically until the payment is confirmed or rejected.

### 1.2 Component Responsibilities
*   **`BookingModal.tsx`**: Orchestrator. Handles booking creation, opens the bridge, and polls for status.
*   **`payment-bridge/page.tsx`**: Isolation container. Renders `BoldCheckout` and handles the visual transition for the user in the new tab.
*   **`BoldCheckout.tsx`**: Pure UI wrapper. Injects the Bold script into the bridge page.

### 1.3 The Handshake Flow
1.  **Booking Creation:** Frontend sends user data to `POST /bookings/private`.
2.  **Bridge Open:** Frontend opens `window.open('/payment-bridge?bookingId=...', '_blank')`.
3.  **Payment Init (In Bridge):** The bridge page calls `POST /payments/init`.
4.  **Polling (In Modal):** The modal starts calling `GET /public/bookings/:id` every 5 seconds.

---

## 2. API Endpoints (Polling & Status)

To support the bridge pattern, we use a public endpoint to monitor the transaction status from the main tab.

### 2.1 Get Booking Status
**Endpoint:** `GET /public/bookings/:bookingId`

**Response:**
```json
{
  "bookingId": "B7Gs...",
  "status": "confirmed",        // 'pending' | 'confirmed'
  "paymentStatus": "approved",  // 'pending' | 'approved' | 'rejected'
  "paymentRef": "NTK-..."       // Full transaction reference (optional)
}
```

**Logic:**
- **Approved:** If `paymentStatus === 'approved'`, the modal closes and shows the Success screen using `paymentRef`.
- **Rejected:** If `paymentStatus === 'rejected'`, the modal stops polling and shows an inline error ("Pago rechazado"), allowing the user to retry.

---

## 3. Circular Payment Flow (UX)

Even with the Bridge pattern, we maintain the circular flow for the user's peace of mind.

### 3.1 Bridge Behavior
The Bridge page (`/payment-bridge`) is designed to be a "dead end" for the application logic but a "live wire" for the payment.
- If the payment is successful, Bold redirects the Bridge Tab to `/payment-result`.
- **Parallel Sync:** Simultaneously, the Main Tab detects the success via polling and updates its UI, often faster than the user can return to it.

### 3.2 Resilience
- **Unhappy Path:** If the payment fails (e.g., insufficient funds), the backend Webhook updates the status to `rejected`. The Modal picks this up via polling and alerts the user *without* reloading the page, preserving their form data.
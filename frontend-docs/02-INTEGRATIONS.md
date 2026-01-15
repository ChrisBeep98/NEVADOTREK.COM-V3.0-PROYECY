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

## 2. API Endpoints (Hybrid)

### Content (Production)
- `GET /public/tours`: List all active tours.
- `GET /public/departures`: List all future departure dates.

### Transactions (Staging)
- `POST /public/bookings/private`: Create temporary reservation.
- `POST /public/payments/init`: Generate Bold signature and reference.

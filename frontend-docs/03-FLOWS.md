# 🔄 System Flows

## 1. Booking & Payment Sequence

```mermaid
sequenceDiagram
    actor User
    participant Frontend as Next.js App
    participant Backend as Backend (Staging)
    participant Bold as Bold Gateway

    User->>Frontend: Fill Info -> Click "Continue"
    Frontend->>Frontend: Auto-format phone (+57)
    Frontend->>Backend: POST /bookings/private
    Backend-->>Frontend: Return bookingId
    
    Note over Frontend: Step 2: Payment Prep
    
    Frontend->>Backend: POST /payments/init {bookingId}
    Backend-->>Frontend: Return Secure Payload (Signature, API Key)
    
    Frontend->>Frontend: [Clean Injection] Inject Bold Script
    Frontend->>User: Render "PAGAR AHORA" Button
    
    User->>Bold: Click Pay -> Complete Sandbox Transaction
    Bold->>Frontend: Redirect to /payment-result
    Frontend->>User: Show Success State
```

## 2. Navigation Flow
- **Tour Detail:** Main conversion point.
- **Bold Checkout:** In-modal interaction (Step 2).
- **Payment Result:** Standalone landing page for transaction status confirmation.

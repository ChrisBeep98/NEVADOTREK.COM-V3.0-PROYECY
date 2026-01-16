# 🔄 System Flows

## 1. Booking & Payment Sequence (Bridge Pattern)

```mermaid
sequenceDiagram
    actor User
    participant MainTab as Booking Modal (Tab A)
    participant Bridge as Payment Bridge (Tab B)
    participant Backend
    participant Bold

    User->>MainTab: Fill Info -> Click "Ir a Pagar"
    MainTab->>Backend: POST /bookings/private
    Backend-->>MainTab: Return bookingId
    
    par Parallel Processes
        MainTab->>User: Show "Finalizando reserva..." (Step 2.5)
        MainTab->>Backend: Polling GET /bookings/:id (Every 5s)
    and
        MainTab->>Bridge: window.open('/payment-bridge?id=...')
        Bridge->>Backend: POST /payments/init
        Backend-->>Bridge: Payload
        Bridge->>Bold: Render Payment Button
        User->>Bold: Click Pay -> Transaction
    end
    
    alt Payment Approved
        Bold->>Backend: Webhook (SALE_APPROVED)
        Backend->>Backend: Update DB (status: confirmed)
        
        Note right of MainTab: Polling detects change
        MainTab->>User: Show Success (Step 3)
        
        Bold->>Bridge: Redirect to /payment-result
    else Payment Rejected
        Bold->>Backend: Webhook (SALE_REJECTED)
        Backend->>Backend: Update DB (paymentStatus: rejected)
        
        Note right of MainTab: Polling detects rejection
        MainTab->>User: Show Error "Pago rechazado"
        MainTab->>User: Return to Step 2 (Retry)
    end
```

## 2. Navigation Flow
- **Tour Detail (Modal):** Main conversion point. Maintains state via Polling.
- **Payment Bridge (`/payment-bridge`):** Dedicated tab for Bold interaction.
- **Payment Result:** Landing page for the Bridge tab (User confirmation).
# 📂 Project Structure Map

## Core Components

### `/app/components/tour-detail`
- **`BookingModal.tsx`**: **Orchestrator.** Handles step management, Public/Private routing, Phone sanitization, and Production Payment initiation.

### `/app/services`
- **`nevado-api.ts`**: Centralizes all backend communication. Points to the Production API Gateway (`api-wgfhwjbpva`).

### `/app/payment-bridge`
- **Legacy/Fallback:** Previously used for iframe injection. Now primarily serves as a routing concept, although direct redirection is preferred.

### `/app/components/ui`
- **`BoldCheckout.tsx`**: **DEPRECATED.** Kept only for legacy test compatibility. Returns `null` in production.

## 💾 State Persistence Strategy
We use `localStorage` under the key `'nevado_user_draft'` to ensure data survival:
- **Automatic Draft:** User Info (Name, email, etc.) is saved in real-time.
- **Booking Persistence:** The `bookingId` is stored to allow UI recovery upon returning from the external Bold tab.
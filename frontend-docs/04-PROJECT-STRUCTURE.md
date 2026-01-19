# 📂 Project Structure Map

## Core Components

### `/app/components/tour-detail`
- **`BookingModal.tsx`**: **Orchestrator.** Handles step management, Public/Private routing, Phone sanitization, and the Staging Force Mode logic.

### `/app/services`
- **`nevado-api.ts`**: Centralizes all backend communication including the `joinPublicBooking` and `getTestTourDepartures` methods.

### `/app/payment-bridge`
- Isolated environment for secure script injection.

## 💾 State Persistence Strategy
We use `localStorage` under the key `'nevado_user_draft'` to ensure data survival:
- **Automatic Draft:** User Info (Name, email, etc.) is saved in real-time.
- **Booking Persistence:** The `bookingId` is stored to allow UI recovery upon returning from an external tab.
- **Testing Bypass:** During the current testing phase, `bookingId` restoration is partially bypassed to ensure fresh test cycles and notification triggers.

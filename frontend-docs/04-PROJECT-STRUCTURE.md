# 📂 Project Structure Map

## New Additions

### `/app`
- **`/payment-bridge`**: **(New)** Isolated environment for Bold payment gateway execution.
- **`/payment-result`**: Landing page for Bold payment status feedback.
- **`layout.tsx`**: Updated with system font fallbacks for build stability.

### `/app/components/ui`
- **`BoldCheckout.tsx`**: Specialized component for secure Bold script injection.

### `/app/services`
- **`nevado-api.ts`**: Updated with `getBookingStatus` polling logic.

## Key Files
- **`BookingModal.tsx`**: Orchestrates the multi-step booking process, handles Payment Bridge flow, and polls for transaction status.
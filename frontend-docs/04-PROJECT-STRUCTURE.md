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

## 💾 State Persistence Strategy
We use `localStorage` under the key `'nevado_user_draft'` to ensure data survival:
- **User Info:** Name, email, phone, and document are saved as the user types.
- **Booking Context:** During the payment phase, we store the `realBookingId`, date, and pax to ensure the ticket can be reconstructed if the user returns via a redirect (e.g., from Bold's success page).
- **Cleanup:** On a successful transaction completion, the booking context is cleared but user personal info is kept for future convenience.
'use client';

/**
 * @deprecated 
 * This component used the old Bold Widget integration. 
 * Since v2.7.5, we use direct 'Smart Link' redirection in BookingModal.tsx.
 * This file is kept only to avoid breaking legacy tests.
 */
export default function BoldCheckout({ bookingId }: { bookingId: string }) {
    console.warn("BoldCheckout is deprecated. Use Smart Link redirection instead.");
    return null;
}

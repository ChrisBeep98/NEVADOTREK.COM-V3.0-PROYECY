import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import BoldCheckout from '../app/components/ui/BoldCheckout';
import * as api from '../app/services/nevado-api';

vi.mock('../app/services/nevado-api', () => ({
    initBoldPayment: vi.fn(),
}));

describe('BoldCheckout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should inject Bold script correctly', async () => {
        (api.initBoldPayment as any).mockResolvedValue({
            paymentReference: 'REF123',
            apiKey: 'KEY',
            integritySignature: 'SIG',
            amount: 50000,
            currency: 'COP',
            redirectionUrl: 'url',
            description: 'desc'
        });

        const { container } = render(<BoldCheckout bookingId="123" />);

        // Wait for loading to finish
        await waitFor(() => {
            const boldContainer = container.querySelector('div.opacity-100');
            expect(boldContainer).toBeTruthy();
        });

        const boldContainer = container.querySelector('div.opacity-100');
        expect(boldContainer).toBeTruthy();
        
        // Check if script is injected
        if (boldContainer) {
             const script = boldContainer.querySelector('script');
             expect(script).toBeTruthy();
             expect(script?.getAttribute('src')).toContain('boldPaymentButton.js');
             expect(script?.getAttribute('data-order-id')).toBe('REF123');
        }
    });
});
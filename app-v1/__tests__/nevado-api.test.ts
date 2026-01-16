import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBookingStatus } from '../app/services/nevado-api';

// Mock global fetch
global.fetch = vi.fn();

describe('nevado-api', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getBookingStatus should fetch correct endpoint and return json', async () => {
        const mockBookingId = 'test-id-123';
        const mockResponse = { status: 'confirmed', paymentStatus: 'approved' };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await getBookingStatus(mockBookingId);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/bookings/${mockBookingId}`),
            expect.objectContaining({ cache: 'no-store' })
        );
        expect(result).toEqual(mockResponse);
    });

    it('getBookingStatus should throw error on failed request', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
        });

        await expect(getBookingStatus('bad-id')).rejects.toThrow('Failed to check booking status');
    });
});

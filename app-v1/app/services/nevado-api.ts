import { Tour, Departure } from "../types/api";

// 🚀 PRODUCTION API CONFIGURATION
const API_BASE_URL = 'https://api-wgfhwjbpva-uc.a.run.app/public';
const PAYMENTS_API_URL = 'https://api-wgfhwjbpva-uc.a.run.app/public';
// Legacy Staging URL kept for reference/fallback if needed, but app now defaults to Prod
const STAGING_API_URL = 'https://api-wgfhwjbpva-uc.a.run.app/public'; 

const ADMIN_SECRET_KEY = 'ntk_admin_staging_key_2026_x8K9mP3nR7wE5vJ2hQ9zY4cA6bL8sD1fG5jH3mN0pX7';

export interface BoldPaymentData {
    paymentUrl: string;
    paymentReference: string;
    amount: number;
    currency: string;
    description: string;
}

export interface BookingResponse {
    bookingId: string;
    departureId: string;
    booking: {
        status: string;
        pricing: {
            finalPrice: number;
        };
    };
}

// Helper function with retry logic for Cloud Functions cold starts
async function fetchWithRetry(url: string, options?: RequestInit, maxRetries = 3): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            
            // If it's a 503, retry with delay
            if (response.status === 503 && attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
                console.warn(`Received 503 on attempt ${attempt}/${maxRetries}, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            
            return response;
        } catch (error) {
            lastError = error as Error;
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000;
                console.warn(`Fetch failed on attempt ${attempt}/${maxRetries}, retrying in ${delay}ms...`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError || new Error('Max retries exceeded');
}

/**
 * Creates a private booking reservation on the backend.
 */
export async function createPrivateBooking(data: {
    tourId: string;
    date: string;
    pax: number;
    customer: {
        name: string;
        email: string;
        phone: string;
        document: string;
    };
}): Promise<BookingResponse> {
    const response = await fetch(`${PAYMENTS_API_URL}/bookings/private`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        // Backend returns { error: "Message" } or { message: "Message" }
        throw new Error(error.error || error.message || `Failed to create booking: ${response.status}`);
    }

    return response.json();
}

/**
 * Joins an existing public departure (Group Tour).
 */
export async function joinPublicBooking(data: {
    departureId: string;
    pax: number;
    customer: {
        name: string;
        email: string;
        phone: string;
        document: string;
    };
}): Promise<BookingResponse> {
    const response = await fetch(`${PAYMENTS_API_URL}/bookings/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || `Failed to join booking: ${response.status}`);
    }

    return response.json();
}

/**
 * Initializes a Bold payment by creating a secure transaction on the backend.
 */
export async function initBoldPayment(bookingId: string): Promise<BoldPaymentData> {
    const response = await fetch(`${PAYMENTS_API_URL}/payments/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || `Failed to initialize payment: ${response.status}`);
    }

    return response.json();
}

/**
 * Checks the status of a specific booking.
 */
export async function getBookingStatus(bookingId: string): Promise<{ status: string; paymentStatus?: string; paymentRef?: string }> {
    try {
        const response = await fetch(`${PAYMENTS_API_URL}/bookings/${bookingId}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to check booking status');
        }

        return response.json();
    } catch (error) {
        console.error("Error checking booking status:", error);
        throw error;
    }
}

/**
 * Fetches list of active tours.
 * @param forceRefresh If true, adds a timestamp to bypass CDN/Browser cache.
 */
export async function getTours(forceRefresh = false): Promise<Tour[]> {
    try {
        const url = forceRefresh 
            ? `${API_BASE_URL}/tours?t=${Date.now()}` 
            : `${API_BASE_URL}/tours`;

        const response = await fetchWithRetry(url, {
            next: { revalidate: forceRefresh ? 0 : 300 } 
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tours: ${response.status}`);
        }

        const tours: Tour[] = await response.json();
        return tours.filter(tour => tour.isActive);
    } catch (error) {
        console.error("Error fetching tours:", error);
        return [];
    }
}

/**
 * Fetches a single tour by ID.
 */
export async function getTourById(id: string): Promise<Tour | undefined> {
    const tours = await getTours();
    return tours.find(tour => tour.tourId === id);
}

/**
 * Fetches all available departures for a specific tour.
 */
export async function getDeparturesByTourId(tourId: string): Promise<Departure[]> {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/departures`, {
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch departures: ${response.status}`);
        }

        const departures: Departure[] = await response.json();
        
        // Filter by tourId, future dates, and open status
        const now = Math.floor(Date.now() / 1000);
        return departures.filter(dep => 
            dep.tourId === tourId && 
            dep.date._seconds > now &&
            dep.status === 'open'
        ).sort((a, b) => a.date._seconds - b.date._seconds);
    } catch (error) {
        console.error("Error fetching departures:", error);
        return [];
    }
}

/**
 * Fetches the test tour from staging backend for testing purposes.
 * Returns the 'test-tour-001' tour or null if not found.
 */
export async function getStagingTestTour(): Promise<Tour | null> {
    try {
        const response = await fetch(`${STAGING_API_URL}/tours`, {
            // No cache for test tour - always fetch fresh data
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch staging tours: ${response.status}`);
        }

        const tours: Tour[] = await response.json();
        return tours.find(t => t.tourId === 'test-tour-001') || null;
    } catch (error) {
        console.error("Error fetching staging test tour:", error);
        return null;
    }
}

/**
 * Fetches departures for the staging test tour.
 */
export async function getTestTourDepartures(): Promise<Departure[]> {
    try {
        const response = await fetch(`${STAGING_API_URL}/departures`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch staging departures: ${response.status}`);
        }

        const departures: Departure[] = await response.json();
        const now = Math.floor(Date.now() / 1000);
        
        return departures.filter(dep => 
            dep.tourId === 'test-tour-001' && 
            dep.date._seconds > now &&
            dep.status === 'open'
        ).sort((a, b) => a.date._seconds - b.date._seconds);
    } catch (error) {
        console.error("Error fetching staging test departures:", error);
        return [];
    }
}

import { Tour, Departure } from "../types/api";

const API_BASE_URL = 'https://us-central1-nevadotrektest01.cloudfunctions.net/api/public';
const PAYMENTS_API_URL = 'https://api-6ups4cehla-uc.a.run.app/public';

export interface BoldPaymentData {
    paymentReference: string;
    amount: number;
    currency: string;
    apiKey: string;
    integritySignature: string;
    redirectionUrl: string;
    description: string;
    tax: number;
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
 * Fetches list of active tours.
 */
export async function getTours(): Promise<Tour[]> {
    try {
        const response = await fetchWithRetry(`${API_BASE_URL}/tours`, {
            next: { revalidate: 300 } // 5 minutes cache
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

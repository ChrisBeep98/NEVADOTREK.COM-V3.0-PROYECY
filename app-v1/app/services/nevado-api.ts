import { Tour, Departure } from "../types/api";

const API_BASE_URL = 'https://us-central1-nevadotrektest01.cloudfunctions.net/api/public';

/**
 * Fetches the list of active tours.
 */
export async function getTours(): Promise<Tour[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/tours`, {
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
    return tours.find(t => t.tourId === id);
}

/**
 * Fetches all available departures for a specific tour.
 */
export async function getDeparturesByTourId(tourId: string): Promise<Departure[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/departures`, {
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

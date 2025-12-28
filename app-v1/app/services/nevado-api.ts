import { Tour } from "../types/api";

const API_BASE_URL = 'https://us-central1-nevadotrektest01.cloudfunctions.net/api/public';

/**
 * Fetches the list of active tours.
 * Uses Next.js standard fetch with revalidation matching the API's cache-control (5 minutes).
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
        
        // Filter mainly just in case, though API should return only active ones per docs
        return tours.filter(tour => tour.isActive);
    } catch (error) {
        console.error("Error fetching tours:", error);
        // Return empty array to avoid crashing the UI, allowing the grid to render empty or with a fallback
        return [];
    }
}

/**
 * Fetches a single tour by ID.
 * Since the API doesn't support fetching by ID, we fetch all and find.
 * This benefits from the Next.js fetch cache of getTours().
 */
export async function getTourById(id: string): Promise<Tour | undefined> {
    const tours = await getTours();
    return tours.find(t => t.tourId === id);
}

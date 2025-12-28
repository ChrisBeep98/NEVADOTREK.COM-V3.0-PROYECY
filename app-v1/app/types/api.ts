// Localized content is central to the API
export interface LocalizedText {
    es: string;
    en: string;
}

export interface LocalizedList {
    es: string[];
    en: string[];
}

export interface PricingTier {
    minPax: number;
    maxPax: number;
    priceCOP: number;
    priceUSD: number;
}

export interface ItineraryDay {
    day: number;
    title: LocalizedText;
    description: LocalizedText;
}

export interface FAQ {
    question: LocalizedText;
    answer: LocalizedText;
}

export interface Tour {
    tourId: string;
    name: LocalizedText;
    description: LocalizedText;
    shortDescription: LocalizedText;
    subtitle?: LocalizedText; // Optional
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme'; // Inferred from context, but string in JSON
    totalDays: number;
    distance: string;
    altitude: LocalizedText;
    temperature: LocalizedText;
    images: string[];
    pricingTiers: PricingTier[];
    inclusions: LocalizedList;
    exclusions: LocalizedList;
    itinerary: ItineraryDay[];
    faqs: FAQ[];
    recommendations: LocalizedList;
    isActive: boolean;
    // Firestore Timestamps
    createdAt: { _seconds: number; _nanoseconds: number };
    updatedAt: { _seconds: number; _nanoseconds: number };
}

import React from 'react';
import { notFound } from 'next/navigation';
import { getTours, getTourById, getDeparturesByTourId } from '../../services/nevado-api';
import TourPageClient from '../../components/tour-detail/TourPageClient';

// Generate segments for all tours at build time
export async function generateStaticParams() {
    const tours = await getTours();
    return tours.map((tour) => ({
        id: tour.tourId,
    }));
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tour = await getTourById(id);

    if (!tour) {
        return {
            title: 'Tour Not Found - Nevado Trek',
        };
    }

    return {
        title: `${tour.name.es} | Nevado Trek`,
        description: tour.shortDescription.es,
        openGraph: {
            images: [tour.images[0]],
        },
    };
}

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tour = await getTourById(id);

    if (!tour) {
        notFound();
    }

    // Fetch departures for this specific tour
    const departures = await getDeparturesByTourId(id);

    return (
        <main>
            <TourPageClient tour={tour} departures={departures} />
        </main>
    );
}
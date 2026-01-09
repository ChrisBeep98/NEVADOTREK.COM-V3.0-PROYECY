import React from 'react';
import { notFound } from 'next/navigation';
import { getTours, getTourById, getDeparturesByTourId } from '../../services/nevado-api';
import TourHeader from '../../components/tour-detail/TourHeader';
import TourOverview from '../../components/tour-detail/TourOverview';
import TourItinerary from '../../components/tour-detail/TourItinerary';
import TourGallery from '../../components/tour-detail/TourGallery';
import TourDepartures from '../../components/tour-detail/TourDepartures';
import TourNavigation from '../../components/tour-detail/TourNavigation';
import FooterWithWidget from '../../components/FooterWithWidget';

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

    // Imágenes restantes para la galería (omitiendo la primera que es del hero)
    const galleryImages = tour.images.length > 1 ? tour.images.slice(1) : [];

    return (
        <main className="bg-background min-h-screen text-foreground selection:bg-cyan-500/30 transition-colors duration-500">
            {/* 1. HERO: Fullscreen Impact (Always Dark Atmosphere) */}
            <TourHeader tour={tour} departures={departures} />

            <div className="flex flex-col lg:flex-row relative">
                
                 {/* 2. STICKY NAVIGATION (Desktop) */}
                 <div className="hidden lg:block lg:w-80 flex-shrink-0 pt-24 pl-[6vw]">
                      <TourNavigation hasDepartures={departures.length > 0} />
                 </div>

                {/* 3. MAIN CONTENT */}
                <div className="flex-1 w-full min-w-0">
                    
                    {/* OVERVIEW: Hook, Description & Stats */}
                    <TourOverview tour={tour} />

                    {/* GALLERY: Visual Break */}
                    <TourGallery images={galleryImages} />

                    {/* ITINERARY: The Journey */}
                    <TourItinerary itinerary={tour.itinerary} />

                    {/* DEPARTURES: Scheduled Dates */}
                    <TourDepartures departures={departures} tourId={id} />
                </div>
            </div>

            {/* 4. FOOTER */}
            <FooterWithWidget />
        </main>
    );
}

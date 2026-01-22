'use client';

import React, { useState, useEffect } from 'react';
import { Tour, Departure } from '../../types/api';
import TourHeader from './TourHeader';
import TourOverview from './TourOverview';
import TourItinerary from './TourItinerary';
import TourGallery from './TourGallery';
import TourDepartures from './TourDepartures';
import TourNavigation from './TourNavigation';
import BookingModal from './BookingModal';
import FooterWithWidget from '../FooterWithWidget';

interface TourPageClientProps {
    tour: Tour;
    departures: Departure[];
}

export default function TourPageClient({ tour, departures }: TourPageClientProps) {
    // --- BOOKING STATE ---
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingMode, setBookingMode] = useState<'public' | 'private'>('public');
    const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
    const [initialStep, setInitialStep] = useState(0);

    // --- ACTIONS ---
    const openGeneralBooking = () => {
        setBookingMode('public');
        setSelectedDeparture(null);
        setInitialStep(0);
        setIsBookingOpen(true);
    };

    const openDepartureBooking = (departure: Departure) => {
        setBookingMode('public');
        setSelectedDeparture(departure);
        setInitialStep(1); // Skip date selection, go to form
        setIsBookingOpen(true);
    };

    const galleryImages = tour.images.length > 1 ? tour.images.slice(1) : [];

    // Check for payment return on mount to reopen modal
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('payment_status') === 'approved') {
                setIsBookingOpen(true);
                // Payment state is handled internally by BookingModal checking params
            }
        }
    }, []);

    return (
        <div className="bg-background min-h-screen text-foreground selection:bg-cyan-500/30 transition-colors duration-500">
            {/* 1. HERO with booking callback */}
            <TourHeader 
                tour={tour} 
                departures={departures} 
                onBookNow={openGeneralBooking} 
            />

            <div className="flex flex-col lg:flex-row relative">
                 {/* 2. STICKY NAVIGATION */}
                 <div className="hidden lg:block lg:w-80 flex-shrink-0 pt-24 pl-[6vw]">
                      <TourNavigation hasDepartures={departures.length > 0} />
                 </div>

                {/* 3. MAIN CONTENT */}
                <div className="flex-1 w-full min-w-0">
                    <TourOverview tour={tour} />
                    <TourGallery images={galleryImages} />
                    <TourItinerary itinerary={tour.itinerary} />
                    
                    {/* DEPARTURES with selection callback */}
                    <TourDepartures 
                        departures={departures} 
                        tourId={tour.tourId}
                        onSelectDeparture={openDepartureBooking}
                    />
                </div>
            </div>

            <FooterWithWidget />

            {/* GLOBAL MODAL */}
            <BookingModal 
                isOpen={isBookingOpen} 
                onClose={() => setIsBookingOpen(false)} 
                tour={tour} 
                departures={departures}
                initialMode={bookingMode}
                initialDeparture={selectedDeparture}
                initialStep={initialStep}
            />
        </div>
    );
}
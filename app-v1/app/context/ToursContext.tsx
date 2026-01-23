'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tour } from '../types/api';
import { getTours, getAllActiveDepartures } from '../services/nevado-api';

interface ToursContextType {
    tours: Tour[];
    loading: boolean;
    refreshTours: () => Promise<void>;
}

const ToursContext = createContext<ToursContextType | undefined>(undefined);

export function ToursProvider({ children, initialTours = [] }: { children: ReactNode, initialTours?: Tour[] }) {
    const [tours, setTours] = useState<Tour[]>(initialTours);
    const [loading, setLoading] = useState(initialTours.length === 0);

    const refreshTours = async () => {
        if (tours.length === 0) setLoading(true);
        try {
            // Fetch both in parallel
            const [toursData, departuresData] = await Promise.all([
                getTours(true),
                getAllActiveDepartures()
            ]);

            // Enrich tours with real departure dates
            const enrichedTours = toursData.map(tour => {
                const nextDep = departuresData.find(d => d.tourId === tour.tourId);
                let formattedDate = undefined;

                if (nextDep) {
                    const date = new Date(nextDep.date._seconds * 1000);
                    formattedDate = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }).toUpperCase();
                }

                return { ...tour, nextDepartureDate: formattedDate };
            });

            setTours(enrichedTours);
        } catch (error) {
            console.error("Error refreshing tours:", error);
        } finally {
            setLoading(false);
        }
    };

    // Always fetch fresh data on mount to ensure client has latest version,
    // even if initialTours (static) were provided.
    useEffect(() => {
        refreshTours();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ToursContext.Provider value={{ tours, loading, refreshTours }}>
            {children}
        </ToursContext.Provider>
    );
}

export function useTours() {
    const context = useContext(ToursContext);
    if (context === undefined) {
        throw new Error('useTours must be used within a ToursProvider');
    }
    return context;
}

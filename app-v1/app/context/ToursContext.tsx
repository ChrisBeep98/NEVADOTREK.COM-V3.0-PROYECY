'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tour } from '../types/api';
import { getTours } from '../services/nevado-api';

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
        // Don't set loading to true if we already have data (silent update)
        if (tours.length === 0) setLoading(true);
        try {
            // Force refresh from API to bypass cache
            const data = await getTours(true);
            setTours(data);
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

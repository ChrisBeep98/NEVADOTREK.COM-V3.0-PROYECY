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
        setLoading(true);
        try {
            const data = await getTours();
            setTours(data);
        } catch (error) {
            console.error("Error refreshing tours:", error);
        } finally {
            setLoading(false);
        }
    };

    // If we didn't get initial tours, fetch them
    useEffect(() => {
        if (initialTours.length === 0) {
            refreshTours();
        }
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

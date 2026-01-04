"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import esDict from '../../dictionaries/es.json';
import enDict from '../../dictionaries/en.json';

type Locale = 'ES' | 'EN';
type Dictionary = typeof esDict;

interface LanguageContextType {
    lang: Locale;
    toggleLang: () => void;
    t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Locale>('ES');

    // Load initial preference
    useEffect(() => {
        const savedLang = localStorage.getItem('lang') as Locale;
        if (savedLang && (savedLang === 'ES' || savedLang === 'EN') && savedLang !== lang) {
            setLang(savedLang);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleLang = () => {
        setLang((prev) => {
            const newLang = prev === 'ES' ? 'EN' : 'ES';
            localStorage.setItem('lang', newLang);
            return newLang;
        });
    };

    const t = lang === 'ES' ? esDict : enDict;

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
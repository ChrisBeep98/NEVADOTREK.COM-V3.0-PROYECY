'use client';

import React from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';
import TourCard from './TourCard';
import { useLanguage } from '../context/LanguageContext';
import { Tour } from '../types/api';

interface ExpeditionsGridProps {
    initialTours: Tour[];
}

export default function ExpeditionsGrid({ initialTours }: ExpeditionsGridProps) {
    const { t, lang } = useLanguage();
    // Slice only if we have more than 6, though usually parent should handle limiting logic if strictly needed, but design requires specific grid.
    const tours = initialTours.slice(0, 6);

    // Configuración del "Cinematic Rhythm"
    // Define tanto el ancho (cols) como la altura (h) para crear una narrativa visual.
    const getGridClass = (index: number) => {
        const baseMobileHeight = "h-[500px]";
        switch (index) {
            // 1. THE OPENING (Impacto Total)
            case 0: return `md:col-span-12 ${baseMobileHeight} md:h-[80vh] md:min-h-[600px]`; 
            
            // 2. THE DETAILS (Ritmo Rápido)
            case 1: return `md:col-span-5 ${baseMobileHeight}`;
            case 2: return `md:col-span-7 ${baseMobileHeight}`; 
            
            // 3. THE PAUSE (Segundo Acto - Panorámica)
            case 3: return `md:col-span-12 ${baseMobileHeight} md:h-[65vh] md:min-h-[500px]`; 

            // 4. THE FINALE (Asimetría Agresiva)
            case 4: return `md:col-span-8 ${baseMobileHeight}`; 
            case 5: return `md:col-span-4 ${baseMobileHeight}`; 
            
            default: return `md:col-span-4 ${baseMobileHeight}`;
        }
    };

    return (
        <section className="bg-background section-v-spacing" style={{ paddingBottom: '0px' }}>
            <div className="px-frame max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-display-xl text-foreground mb-4 whitespace-pre-line text-left">
                            {t.expeditions.title}
                        </h2>
                        <div className="flex items-center gap-2 justify-start">
                            <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" strokeWidth={2} />
                            <span className="text-body-lead italic tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-foreground">
                                {t.expeditions.upcoming}
                            </span>
                        </div>
                    </div>
                    <button className="btn-secondary group max-w-[160px] md:max-w-none">
                        <span className="opacity-90">{t.expeditions.view_all}</span>
                        <div className="btn-icon-bubble">
                            <ArrowUpRight width={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500" />
                        </div>
                    </button>
                </div>

                {/* Grid con espaciado arquitectónico (gap-4) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {tours.map((tour, index) => (
                        <TourCard 
                            key={tour.tourId}
                            tour={tour}
                            index={index}
                            className={getGridClass(index)}
                            lang={lang}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}



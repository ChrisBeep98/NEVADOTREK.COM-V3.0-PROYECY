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
        switch (index) {
            // 1. THE OPENING (Impacto Total)
            case 0: return "md:col-span-12 h-[80vh] min-h-[600px]"; 
            
            // 2. THE DETAILS (Ritmo Rápido)
            case 1: return "md:col-span-5 h-[500px]";
            case 2: return "md:col-span-7 h-[500px]"; 
            
            // 3. THE PAUSE (Segundo Acto - Panorámica)
            case 3: return "md:col-span-12 h-[65vh] min-h-[500px]"; 

            // 4. THE FINALE (Asimetría Agresiva)
            case 4: return "md:col-span-8 h-[500px]"; 
            case 5: return "md:col-span-4 h-[500px]"; 
            
            default: return "md:col-span-4 h-[500px]";
        }
    };

    return (
        <section className="bg-background section-v-spacing">
            <div className="px-frame max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-display-xl text-foreground mb-4 whitespace-pre-line text-left">
                            {t.expeditions.title}
                        </h2>
                        <div className="flex items-center gap-2 justify-start">
                            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" strokeWidth={2} />
                            <span className="text-body-lead italic tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-400">
                                {t.expeditions.upcoming}
                            </span>
                        </div>
                    </div>
                    <button className="btn-secondary md:w-auto group">
                        <span>{t.expeditions.view_all.toLowerCase()}</span>
                        <div className="btn-icon-bubble">
                            <ArrowUpRight width={18} strokeWidth={2} />
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



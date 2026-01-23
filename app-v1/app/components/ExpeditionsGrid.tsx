'use client';

import React, { useRef } from 'react';
import { ArrowUpRight, ArrowRight, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import TourCard from './TourCard';
import SectionTitle from './ui/SectionTitle';
import { useLanguage } from '../context/LanguageContext';
import { Tour } from '../types/api';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ExpeditionsGridProps {
    initialTours: Tour[];
}

export default function ExpeditionsGrid({ initialTours }: ExpeditionsGridProps) {
    const { t, lang } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    // Slice only if we have more than 6, though usually parent should handle limiting logic if strictly needed, but design requires specific grid.
    const tours = initialTours.slice(0, 6);

    useGSAP(() => {
        gsap.fromTo(".section-reveal",
            { y: 40, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1.4, 
                ease: "power4.out",
                stagger: 0.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    }, { scope: containerRef });

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
        <section ref={containerRef} className="bg-background section-v-spacing" style={{ paddingBottom: '0px' }}>
            <div className="px-frame max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="flex flex-col md:block w-full md:w-auto">
                        <Link href="/tours" className="flex items-end md:hidden mb-4 group section-reveal">
                            <SectionTitle 
                                title={t.expeditions.title} 
                                className="text-display-xl whitespace-pre-line text-left flex-1 group-hover:opacity-80 transition-opacity"
                            />
                            <ArrowRight className="w-6 h-6 text-foreground mb-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <SectionTitle 
                            title={t.expeditions.title} 
                            className="text-display-xl whitespace-pre-line text-left mb-4 hidden md:block section-reveal"
                        />
                        <div ref={subtitleRef} className="flex items-center gap-2 justify-start section-reveal">
                            <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" strokeWidth={2} />
                            <span className="text-body-lead italic tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-foreground">
                                {t.expeditions.upcoming}
                            </span>
                        </div>
                    </div>
                    <button ref={buttonRef} className="btn-secondary group max-w-[160px] md:w-[160px] hidden md:flex justify-between items-center section-reveal">
                        <span className="opacity-90 text-left text-xs">{t.expeditions.view_all}</span>
                        <div className="btn-icon-bubble shrink-0">
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
                            nextDate={(tour as any).nextDepartureDate} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}



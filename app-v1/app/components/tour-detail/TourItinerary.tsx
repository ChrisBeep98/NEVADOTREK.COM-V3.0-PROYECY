'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ItineraryDay } from '../../types/api';
import { MapPin } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourItinerary({ itinerary }: { itinerary: { days: ItineraryDay[] } }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const days = gsap.utils.toArray('.day-row');
        
        days.forEach((day: any) => {
            // Animar la línea y el punto al entrar
            gsap.fromTo(day.querySelector('.timeline-node'),
                { scale: 0, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: day,
                        start: "top 70%",
                    }
                }
            );

            // Animar contenido suavemente
            gsap.fromTo(day.querySelector('.day-content'),
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: day,
                        start: "top 75%",
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <section id="itinerary" ref={containerRef} className="bg-slate-950 py-32 md:py-48 px-frame border-t border-white/5 relative">
            
            <div className="max-w-6xl mx-auto">
                {/* Header de Sección */}
                <div className="mb-24 md:mb-32">
                    <span className="text-sub-label text-cyan-500 mb-6 block">THE JOURNEY</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-none">
                        ITINERARIO <br/>
                        <span className="text-slate-600">PASO A PASO</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Línea de Tiempo Vertical Continua */}
                    <div className="absolute left-[15px] md:left-[33.33%] top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>

                    <div className="flex flex-col gap-0">
                        {itinerary?.days?.map((day, index) => (
                            <div key={day.dayNumber || index} className="day-row grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 py-12 md:py-20 border-b border-white/5 last:border-0 relative">
                                
                                {/* IZQUIERDA: Info Sticky (Día y Título) */}
                                <div className="md:col-span-4 md:text-right md:sticky md:top-32 self-start">
                                    <div className="inline-block">
                                        <span className="text-6xl md:text-8xl font-bold text-white/10 leading-none block -mb-4 md:-mb-6">
                                            0{day.dayNumber}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-medium text-white relative z-10">
                                            {day.title?.es}
                                        </h3>
                                    </div>
                                </div>

                                {/* CENTRO: Nodo de Tiempo (Solo Desktop) */}
                                <div className="hidden md:flex md:col-span-1 justify-center relative">
                                    <div className="timeline-node w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-500 z-10 sticky top-40 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                                </div>

                                {/* DERECHA: Contenido */}
                                <div className="md:col-span-7 day-content pl-4 md:pl-0 border-l border-white/10 md:border-l-0">
                                    {/* Mobile Day Indicator (para no perder contexto) */}
                                    <span className="md:hidden text-xs font-mono text-cyan-500 mb-4 block">DÍA 0{day.dayNumber}</span>
                                    
                                    <div className="prose prose-invert prose-lg">
                                        {day.activities?.map((act, i) => (
                                            <div key={i} className="mb-6 last:mb-0">
                                                <p className="text-lg md:text-xl font-light text-slate-300 leading-relaxed">
                                                    {act.es}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Micro-interacción: Badge de ubicación si aplica (decorativo) */}
                                    <div className="mt-8 flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-widest opacity-60">
                                        <MapPin className="w-3 h-3" />
                                        <span>Checkpoint {day.dayNumber}</span>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
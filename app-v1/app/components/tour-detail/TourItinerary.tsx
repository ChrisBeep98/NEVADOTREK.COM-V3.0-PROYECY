'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ItineraryDay } from '../../types/api';
import { Target, MapPin, MoveRight, ChevronRight } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = [
    '#f97316', // Páramo Orange
    '#3b82f6', // Glacier Blue
    '#a855f7', // Vertical Purple
    '#06b6d4', // Summit Cyan
];

export default function TourItinerary({ itinerary }: { itinerary: { days: ItineraryDay[] } }) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const days = itinerary.days;
        if (!days || days.length === 0) return;

        const totalWidth = railRef.current?.scrollWidth || 0;
        const containerWidth = pinRef.current?.offsetWidth || 0;
        const scrollDistance = totalWidth - containerWidth;

        if (scrollDistance > 0) {
            // PINNING THE WHOLE CONTENT (Pinned at the absolute top of viewport during scroll)
            gsap.to(railRef.current, {
                x: -scrollDistance,
                ease: "none",
                scrollTrigger: {
                    trigger: pinRef.current,
                    pin: true,
                    start: "top top", // Pegado al borde superior del navegador
                    end: `+=${totalWidth}`,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });
        }

        // Animated reveal for content blocks
        days.forEach((_, index) => {
            gsap.fromTo(`.day-slab-${index} .reveal-item`, 
                { opacity: 0, x: 20 },
                { 
                    opacity: 1, x: 0, duration: 0.8, stagger: 0.05,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: `.day-slab-${index}`,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: sectionRef, dependencies: [itinerary] });

    return (
        <section id="itinerary" ref={sectionRef} className="bg-slate-950 pb-[80px] md:pb-[160px] px-frame border-t border-white/5 overflow-hidden">
            
            {/* Contenedor sin padding superior (pt-0) para reducir el margen top durante el pin */}
            <div ref={pinRef} className="max-w-6xl mx-auto h-[70vh] flex flex-col justify-start pt-0">
                
                {/* 1. TÍTULO FIJO - Máxima proximidad al tope de la sección */}
                <div className="mb-8 md:mb-10 pt-8 md:pt-12">
                    <span className="text-sub-label text-cyan-500 mb-2 block">THE JOURNEY</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-none">
                        ITINERARIO <br/>
                        <span className="text-slate-600">PASO A PASO</span>
                    </h2>
                </div>

                {/* 2. CARRUSEL HORIZONTAL (Tarjetas Ultra-Anchas) */}
                <div className="relative flex-grow flex items-start">
                    
                    {/* Línea de horizonte técnica */}
                    <div className="absolute top-0 left-0 w-full h-px bg-white/5 z-0"></div>

                    <div 
                        ref={railRef} 
                        className="flex flex-nowrap gap-0 items-start pt-6"
                    >
                        {itinerary?.days?.map((day, index) => {
                            const color = THEME_COLORS[index % THEME_COLORS.length];
                            
                            return (
                                <div 
                                    key={day.dayNumber || index}
                                    className={`day-slab-${index} flex-shrink-0 w-[90vw] md:w-[850px] pr-16 md:pr-32`}
                                >
                                    {/* Contenedor Panorámico */}
                                    <div className="flex flex-col border-l border-white/5 pl-8 md:pl-16 relative h-full">
                                        
                                        {/* Marca de agua de día */}
                                        <span 
                                            className="absolute -left-4 top-0 text-[140px] font-bold opacity-[0.02] select-none pointer-events-none italic"
                                            style={{ color: color }}
                                        >
                                            0{day.dayNumber}
                                        </span>

                                        <div className="reveal-item flex items-center gap-4 mb-8 relative z-10">
                                            <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color, color: color }}></div>
                                            <span className="text-journal-data" style={{ color: color }}>EXPEDITION_NODE_STAGE_0{day.dayNumber}</span>
                                        </div>

                                        <h3 className="reveal-item text-2xl md:text-3xl font-medium text-white mb-8 relative z-10 leading-tight">
                                            {day.title?.es}
                                        </h3>

                                        {/* Contenedor de Texto con tipografía más pequeña (sm/base) */}
                                        <div className="reveal-item space-y-5 mb-12 relative z-10 w-full">
                                            {day.activities?.map((act, i) => (
                                                <div key={i} className="flex gap-5 items-start group">
                                                    <ChevronRight className="w-3.5 h-3.5 mt-1 text-slate-700 group-hover:text-cyan-500 transition-colors shrink-0" />
                                                    <p className="text-sm md:text-base font-light text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">
                                                        {act.es}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="reveal-item mt-auto pt-8 border-t border-white/5 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity duration-700">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 rounded-full bg-white/5">
                                                    <MapPin className="w-3.5 h-3.5" style={{ color: color }} />
                                                </div>
                                                <div>
                                                    <span className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">Sector_Verified</span>
                                                    <span className="text-white/60 text-[10px] font-mono uppercase tracking-tighter italic">Nevado_Node_{index + 1}</span>
                                                </div>
                                            </div>
                                            <Target className="w-5 h-5" style={{ color: color }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Summit Visual Anchor */}
                        <div className="flex-shrink-0 w-[400px] flex flex-col justify-center border-l border-white/5 pl-16 opacity-10 hover:opacity-100 transition-all duration-1000">
                            <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-6">
                                <MoveRight className="w-8 h-8 text-white rotate-[-45deg]" />
                            </div>
                            <h4 className="text-heading-xl text-white tracking-tighter leading-none">THE<br/>SUMMIT</h4>
                            <span className="text-sub-label text-[10px] mt-4">ASCENT_AUTHORIZED</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Espacio de salida */}
            <div className="h-[10vh]"></div>

        </section>
    );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ItineraryDay } from '../../types/api';
import { MapPin, ChevronRight, Clock, Info } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = [
    '#06b6d4', // Summit Cyan
    '#f97316', // Páramo Orange
    '#3b82f6', // Glacier Blue
    '#a855f7', // Vertical Purple
];

export default function TourItinerary({ itinerary }: { itinerary: { days: ItineraryDay[] } }) {
    const [activeDay, setActiveDay] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const tabsRef = useRef<HTMLDivElement>(null);

    // Filter valid days just in case
    const days = itinerary?.days || [];

    // Animation when activeDay changes
    useGSAP(() => {
        if (!contentRef.current) return;

        // Animate Content Entry
        gsap.fromTo(contentRef.current.children, 
            { y: 20, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.6, 
                stagger: 0.05, 
                ease: "power3.out",
                clearProps: "all" 
            }
        );

        // Animate Active Tab Indicator/Scale (Optional polish)
        const activeTab = tabsRef.current?.children[activeDay];
        if (activeTab) {
            gsap.to(tabsRef.current?.children, { opacity: 0.4, scale: 0.95, duration: 0.3 });
            gsap.to(activeTab, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
        }

    }, { scope: containerRef, dependencies: [activeDay] });

    // Initial Scroll Trigger for the whole section Title
    useGSAP(() => {
        gsap.fromTo(".itinerary-header",
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 1, ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    if (days.length === 0) return null;

    const currentDayData = days[activeDay];
    const currentColor = THEME_COLORS[activeDay % THEME_COLORS.length];

    return (
        <section id="itinerary" ref={containerRef} className="bg-slate-950 py-[80px] md:py-[160px] px-frame border-t border-white/5 relative overflow-hidden min-h-screen flex flex-col">
            
            {/* Background Gradient - Organic Depth */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-900/50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto w-full z-10">
                
                {/* 1. SECTION HEADER */}
                <div className="mb-16 md:mb-24 itinerary-header">
                    <span className="text-sub-label text-cyan-500 mb-2 block">TU EXPERIENCIA</span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight leading-none">
                        ITINERARIO <br/>
                        <span className="text-slate-600">PASO A PASO</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    
                    {/* 2. TABS NAVIGATOR */}
                    <div className="lg:w-1/3 flex-shrink-0">
                        
                        {/* Mobile Label */}
                        <div className="lg:hidden mb-4 flex items-center justify-between text-slate-500">
                            <span className="text-journal-data">EXPLORA LA RUTA</span>
                            <span className="text-journal-data">{activeDay + 1} / {days.length}</span>
                        </div>

                        {/* Scrollable Container */}
                        <div 
                            ref={tabsRef}
                            className="flex lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {days.map((day, index) => {
                                const isActive = index === activeDay;
                                const tabColor = THEME_COLORS[index % THEME_COLORS.length];

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setActiveDay(index)}
                                        className={`
                                            group relative flex-shrink-0 snap-start flex items-center gap-6 p-4 md:p-6 rounded-sm border transition-all duration-300 w-[240px] lg:w-full text-left
                                            ${isActive 
                                                ? 'bg-white/[0.03] border-white/20' 
                                                : 'bg-transparent border-transparent hover:bg-white/[0.01] hover:border-white/5'
                                            }
                                        `}
                                    >
                                        {/* Active Indicator Line (Left) */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${isActive ? '' : 'bg-transparent'}`} style={{ backgroundColor: isActive ? tabColor : 'transparent' }}></div>

                                        {/* Day Number */}
                                        <span 
                                            className={`text-4xl md:text-5xl font-bold tracking-tighter leading-none transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-600'}`}
                                        >
                                            {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                                        </span>

                                        {/* Label */}
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[11px] font-bold tracking-wider uppercase ${isActive ? 'text-cyan-500' : 'text-slate-600'}`}>
                                                DÍA
                                            </span>
                                            <span className={`text-sm font-medium line-clamp-1 ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {day.title?.es || `Día ${day.dayNumber}`}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. CONTENT DISPLAY (Right Side) */}
                    <div className="lg:w-2/3 min-h-[500px] relative">
                        {/* Decorative background line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 hidden lg:block"></div>

                        <div ref={contentRef} className="lg:pl-12">
                            
                            {/* Dynamic Header */}
                            <div className="mb-10 pb-8 border-b border-white/5 relative">
                                <div className="flex items-center gap-3 mb-4 opacity-70">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: currentColor }}></div>
                                    <span className="text-journal-data" style={{ color: currentColor }}>
                                        ETAPA {currentDayData.dayNumber}
                                    </span>
                                </div>
                                
                                <h3 className="text-3xl md:text-5xl font-medium text-white mb-6 leading-tight">
                                    {currentDayData.title?.es}
                                </h3>

                                {/* Optional Description */}
                                {currentDayData.description?.es && (
                                    <p className="text-body-lead text-slate-400 max-w-2xl">
                                        {currentDayData.description.es}
                                    </p>
                                )}
                            </div>

                            {/* Activities List */}
                            <div className="space-y-6">
                                <span className="text-sub-label text-slate-600 mb-4 block">DETALLES DE LA JORNADA</span>
                                
                                {currentDayData.activities?.map((activity, i) => (
                                    <div key={i} className="group flex gap-6 items-start p-4 rounded-lg hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                                        <div className="mt-1 shrink-0 p-2 rounded-full bg-slate-900 border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base md:text-lg font-light text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                                                {activity.es}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {(!currentDayData.activities || currentDayData.activities.length === 0) && (
                                    <div className="flex items-center gap-4 p-6 rounded-lg border border-dashed border-white/10 bg-white/[0.01]">
                                        <Info className="w-5 h-5 text-slate-600" />
                                        <span className="text-slate-500 font-light italic">Información detallada no disponible.</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer / Stats for the day */}
                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 opacity-60">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duración: Día Completo</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Zona: PNN Los Nevados</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

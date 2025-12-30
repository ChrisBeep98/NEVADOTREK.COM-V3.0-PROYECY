/**
 * TOUR ITINERARY COMPONENT
 * ------------------------
 * This component manages the multi-day expedition plan.
 * 
 * DESIGN PHILOSOPHY:
 * - Editorial & Cinematic: High-contrast typography and generous negative space.
 * - Tabbed Navigation: Allows exploration of complex schedules without excessive scrolling.
 * - Mobile-First: Navigation switches from sidebar (desktop) to a compact horizontal chip-bar (mobile) 
 *   to maximize vertical readability.
 * 
 * INTERACTION LOGIC:
 * - State-driven: 'activeDay' controls both the content display and GSAP triggers.
 * - GSAP: Staggered entry animations for text and activities on day change.
 * - Symmetrical Spacing: Uses 'px-frame' and 'section-v-spacing' tokens for layout consistency.
 */
'use client';

import React, { useState, useRef } from 'react';
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

    const days = itinerary?.days || [];

    useGSAP(() => {
        if (!contentRef.current) return;

        // Animate Content Entry
        gsap.fromTo(contentRef.current.children, 
            { y: 15, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 0.5, 
                stagger: 0.03, 
                ease: "power2.out",
                clearProps: "all" 
            }
        );

        // Animate Active Tab Indicator
        const activeTab = tabsRef.current?.children[activeDay];
        if (activeTab) {
            gsap.to(tabsRef.current?.children, { opacity: 0.4, scale: 0.9, duration: 0.3 });
            gsap.to(activeTab, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
        }

    }, { scope: containerRef, dependencies: [activeDay] });

    if (days.length === 0) return null;

    const currentDayData = days[activeDay];
    const currentColor = THEME_COLORS[activeDay % THEME_COLORS.length];

    return (
        <section id="itinerary" ref={containerRef} className="bg-slate-950 section-v-spacing px-frame border-t border-white/5 relative overflow-hidden flex flex-col">
            
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-slate-900/0 via-slate-900/0 to-slate-900/30 pointer-events-none"></div>

            <div className="max-w-6xl mx-auto w-full z-10">
                
                {/* 1. SECTION HEADER - Title stays the same as you liked it */}
                <div className="mb-12 md:mb-20 itinerary-header">
                    <span className="text-sub-label text-cyan-500 mb-2 block">TU EXPERIENCIA</span>
                    <h2 className="text-h-section-title text-white">
                        Itinerario <br/>
                        <span className="text-slate-600">paso a paso</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
                    
                    {/* 2. TABS NAVIGATOR - Top on Mobile, Side on Desktop */}
                    <div className="lg:w-1/4 flex-shrink-0">
                        
                        {/* Mobile Navigator Header */}
                        <div className="lg:hidden mb-6 flex items-center justify-between">
                            <span className="text-journal-data text-slate-500">FASE DE EXPEDICIÓN</span>
                            <span className="text-journal-data text-cyan-500 font-bold">{activeDay + 1} / {days.length}</span>
                        </div>

                        {/* Tabs: Now more compact */}
                        <div 
                            ref={tabsRef}
                            className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x"
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
                                            group relative flex-shrink-0 snap-start flex items-center gap-4 p-3 md:p-4 rounded-sm border transition-all duration-300 w-[140px] lg:w-full text-left
                                            ${isActive 
                                                ? 'bg-white/[0.05] border-white/20' 
                                                : 'bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                                            }
                                        `}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${isActive ? '' : 'bg-transparent'}`} style={{ backgroundColor: isActive ? tabColor : 'transparent' }}></div>

                                        <span 
                                            className={`text-2xl md:text-3xl font-bold tracking-tighter leading-none transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-400'}`}
                                        >
                                            {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                                        </span>

                                        <div className="flex flex-col gap-0.5 overflow-hidden">
                                            <span className={`text-[9px] font-bold tracking-wider uppercase ${isActive ? 'text-cyan-500' : 'text-slate-600'}`}>
                                                DÍA
                                            </span>
                                            <span className={`text-[11px] font-medium line-clamp-1 ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                                                {day.title?.es || `Día ${day.dayNumber}`}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. CONTENT DISPLAY */}
                    <div className="lg:w-3/4 min-h-[400px] relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 hidden lg:block"></div>

                        <div ref={contentRef} className="lg:pl-16">
                            
                            {/* Dynamic Header - Hidden on Mobile to avoid redundancy with Tabs */}
                            <div className="hidden lg:block mb-8 pb-6 border-b border-white/5 relative">
                                <div className="flex items-center gap-3 mb-3 opacity-70">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentColor }}></div>
                                    <span className="text-journal-data" style={{ color: currentColor }}>
                                        ETAPA {currentDayData.dayNumber}
                                    </span>
                                </div>
                                
                                <h3 className="text-2xl md:text-4xl font-medium text-white mb-4 leading-tight">
                                    {currentDayData.title?.es}
                                </h3>
                            </div>

                            {/* Optional Description - Always visible if exists */}
                            {currentDayData.description?.es && (
                                <p className="text-body-std text-slate-400 max-w-2xl mb-8 lg:mb-0">
                                    {currentDayData.description.es}
                                </p>
                            )}

                            {/* Activities List - Compact */}
                            <div className="space-y-4">
                                <span className="text-journal-data text-slate-600 mb-2 block uppercase tracking-widest">Actividades Clave</span>
                                
                                {currentDayData.activities?.map((activity, i) => (
                                    <div key={i} className="group flex gap-4 items-start p-3 rounded-lg hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                                        <div className="mt-1 shrink-0 p-1.5 rounded-full bg-slate-900 border border-white/10 group-hover:border-cyan-500/30 transition-colors hidden md:block">
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base font-light text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                                                {activity.es}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {(!currentDayData.activities || currentDayData.activities.length === 0) && (
                                    <div className="flex items-center gap-4 p-4 rounded-lg border border-dashed border-white/10 bg-white/[0.01]">
                                        <Info className="w-4 h-4 text-slate-600" />
                                        <span className="text-xs text-slate-500 font-light italic">Información detallada no disponible.</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer Stats - Compact */}
                            <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap gap-6 opacity-50">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Duración: Full Day</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Zona: PNN Nevados</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
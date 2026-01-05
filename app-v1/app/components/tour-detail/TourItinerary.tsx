'use client';

import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ItineraryDay } from '../../types/api';
import { MapPin, ChevronRight, Clock, Info, Zap, Flag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = [
    'var(--color-cyan-500)',
    'var(--color-orange-500)',
    'var(--color-blue-500)',
    'var(--color-purple-500)',
];

export default function TourItinerary({ itinerary }: { itinerary: { days: ItineraryDay[] } }) {
    const { t, lang } = useLanguage();
    const l = lang.toLowerCase() as 'es' | 'en';
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

    }, { scope: containerRef, dependencies: [activeDay] });

    if (days.length === 0) return null;

    const currentDayData = days[activeDay];
    const currentColor = THEME_COLORS[activeDay % THEME_COLORS.length];

    return (
        <section id="itinerary" ref={containerRef} className="bg-background section-v-spacing px-frame border-t border-border relative overflow-hidden flex flex-col transition-colors duration-500">
            
            <div className="max-w-6xl mx-auto w-full z-10">
                
                {/* 1. SECTION HEADER */}
                <div className="mb-12 md:mb-24 itinerary-header">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-sub-label">{t.tour_detail.itinerary.pretitle}</span>
                    </div>
                    <h2 className="text-h-section-title text-foreground">
                        {t.tour_detail.itinerary.title_main} <br/>
                        <span className="text-muted opacity-50">{t.tour_detail.itinerary.title_sub}</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                    
                    {/* 2. TABS NAVIGATOR */}
                    <div className="lg:w-1/4 flex-shrink-0">
                        
                        {/* Mobile Navigator Header */}
                        <div className="lg:hidden mb-6 flex items-center justify-between border-b border-border pb-6">
                            <span className="text-journal-data text-muted">{t.tour_detail.itinerary.phase}</span>
                            <span className="text-journal-data text-cyan-500 font-bold">{activeDay + 1} / {days.length}</span>
                        </div>

                        {/* Tabs */}
                        <div 
                            ref={tabsRef}
                            className="flex lg:flex-col gap-3 overflow-x-auto pb-0 lg:pb-0 scrollbar-hide snap-x"
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
                                            group relative flex-shrink-0 snap-start flex items-center gap-4 p-4 rounded-[6px] border transition-all duration-300 w-[140px] lg:w-full text-left
                                            ${isActive 
                                                ? 'bg-surface border-border shadow-lg' 
                                                : 'bg-transparent border-border/50 hover:border-border hover:bg-surface'
                                            }
                                        `}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${isActive ? '' : 'bg-transparent'}`} style={{ backgroundColor: isActive ? tabColor : 'transparent' }}></div>

                                        <span 
                                            className={`text-2xl md:text-3xl font-bold tracking-tighter leading-none transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted/40 group-hover:text-muted'}`}
                                        >
                                            {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                                        </span>

                                        <div className="flex flex-col gap-0.5 overflow-hidden">
                                            <span className={`text-[9px] font-bold tracking-wider uppercase ${isActive ? 'text-cyan-500' : 'text-muted/60'}`}>
                                                {t.tour_detail.itinerary.day}
                                            </span>
                                            <span className={`text-[11px] font-medium line-clamp-1 ${isActive ? 'text-foreground' : 'text-muted/60'}`}>
                                                {day.title?.[l] || `${t.tour_detail.itinerary.day} ${day.dayNumber}`}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. CONTENT DISPLAY */}
                    <div className="lg:w-3/4 min-h-[400px] relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden lg:block"></div>

                        <div ref={contentRef} className="lg:pl-16">
                            
                            {/* Dynamic Header */}
                            <div className="hidden lg:block mb-4 pb-4 border-b border-border relative">
                                <div className="flex items-center gap-3 mb-4 opacity-70">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentColor }}></div>
                                    <span className="text-journal-data" style={{ color: currentColor }}>
                                        {t.tour_detail.itinerary.stage} {currentDayData.dayNumber}
                                    </span>
                                </div>
                                
                                <h3 className="text-2xl md:text-4xl font-medium text-foreground mb-6 leading-tight max-w-2xl">
                                    {currentDayData.title?.[l]}
                                </h3>
                            </div>

                            {/* Activities List */}
                            <div className="space-y-4">
                                {currentDayData.activities?.map((activity, i) => (
                                    <div key={i} className="group flex gap-5 items-start pb-4 transition-colors">
                                        <div className="mt-1 shrink-0">
                                            <Flag className="w-4 h-4 text-cyan-500 fill-cyan-500/20" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-body-std text-foreground/80">
                                                {activity[l]}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {(!currentDayData.activities || currentDayData.activities.length === 0) && (
                                    <div className="flex items-center gap-4 p-6 rounded-[6px] border border-dashed border-border bg-surface">
                                        <Info className="w-4 h-4 text-muted" />
                                        <span className="text-body-std text-muted italic">{t.tour_detail.itinerary.update_info}</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

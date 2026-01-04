'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour } from '../../types/api';
import { Thermometer, Mountain, Ruler, X, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourOverview({ tour }: { tour: Tour }) {
    const { t, lang } = useLanguage();
    const l = lang.toLowerCase() as 'es' | 'en';
    const containerRef = useRef<HTMLDivElement>(null);

    const fullDesc = tour.description[l];
    const splitIndex = fullDesc.indexOf('.');
    const hook = splitIndex !== -1 ? fullDesc.substring(0, splitIndex + 1) : fullDesc;
    const body = splitIndex !== -1 ? fullDesc.substring(splitIndex + 1) : '';

    useGSAP(() => {
        gsap.fromTo(".reveal-content",
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.15,
                scrollTrigger: {
                    trigger: ".overview-start",
                    start: "top 85%"
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section id="overview" ref={containerRef} className="bg-background text-foreground section-v-spacing px-frame relative overflow-hidden transition-colors duration-500">
            
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

            <div className="max-w-6xl mx-auto overview-start">
                
                {/* 1. Header & Hook */}
                <div className="mb-24">
                    <div className="flex items-center gap-2 mb-4 reveal-content">
                        <Zap className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-sub-label">{t.tour_detail.overview.pretitle}</span>
                    </div>
                    
                    <h2 className="text-h-section-title text-foreground mb-12 reveal-content max-w-4xl">
                        {hook}
                    </h2>

                    {body && (
                        <div className="md:columns-2 gap-20 reveal-content border-l border-border pl-8 md:pl-0 md:border-l-0">
                            <p className="text-body-lead text-muted mb-4">{body}</p>
                        </div>
                    )}
                </div>

                {/* 2. HUD Stats Grid - Technical Ledger Style */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-32 reveal-content border-y border-border divide-y md:divide-y-0 md:divide-x divide-border">
                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-surface transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Mountain className="w-4 h-4 text-cyan-500" />
                            <span className="text-journal-data text-foreground">{t.tour_detail.header.altitude}</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">{tour.altitude[l]}</span>
                    </div>
                    
                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-surface transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Ruler className="w-4 h-4 text-blue-500" />
                            <span className="text-journal-data text-foreground">{t.tour_detail.header.distance}</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">{tour.distance}</span>
                    </div>

                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-surface transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="text-journal-data text-foreground">{t.hero.status.temp}</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">{tour.temperature[l]}</span>
                    </div>

                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-surface transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                             <div className={`w-1.5 h-1.5 rounded-full 
                                ${tour.difficulty === 'Extreme' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 
                                  tour.difficulty === 'Hard' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`} 
                            />
                            <span className="text-journal-data text-foreground">{t.tour_detail.header.difficulty}</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-foreground">{tour.difficulty}</span>
                    </div>
                </div>

                {/* 3. Inclusions - Technical Ledger Design */}
                <div className="flex flex-col md:flex-row gap-16 reveal-content">
                    <div className="md:w-1/2">
                        <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
                            <span className="text-sub-label text-foreground">{t.tour_detail.overview.inclusions}</span>
                        </div>
                        <ul className="grid grid-cols-1 gap-5">
                            {tour.inclusions?.map((item, i) => (
                                <li key={i} className="flex items-baseline gap-4 group">
                                    <Zap className="w-3 h-3 text-emerald-400 mt-1.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-body-std text-muted group-hover:text-foreground transition-colors">{item[l]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:w-1/2 md:pl-12 md:border-l border-border">
                        <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
                            <span className="text-sub-label text-muted">{t.tour_detail.overview.exclusions}</span>
                        </div>
                        <ul className="grid grid-cols-1 gap-5 opacity-60 hover:opacity-100 transition-opacity duration-500">
                            {tour.exclusions?.map((item, i) => (
                                <li key={i} className="flex items-baseline gap-4 group">
                                    <X className="w-3 h-3 text-muted shrink-0 mt-1.5" />
                                    <span className="text-body-std text-muted">{item[l]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    );
}
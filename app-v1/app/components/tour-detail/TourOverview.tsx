'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour } from '../../types/api';
import { Thermometer, Mountain, Ruler, Check, X } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourOverview({ tour }: { tour: Tour }) {
    const containerRef = useRef<HTMLDivElement>(null);

    const fullDesc = tour.description.es;
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
        <section id="overview" ref={containerRef} className="bg-slate-950 text-slate-200 section-v-spacing px-frame relative">
            <div className="max-w-6xl mx-auto overview-start">
                
                {/* 1. Header & Hook - MÁS AIRE Y JERARQUÍA */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-8 reveal-content">
                        <span className="h-px w-12 bg-cyan-500/50"></span>
                        <span className="text-sub-label text-cyan-400">THE EXPERIENCE</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-12 reveal-content leading-[1.1] max-w-4xl">
                        {hook}
                    </h2>

                    {body && (
                        <div className="md:columns-2 gap-20 text-lg font-light leading-relaxed text-slate-400 reveal-content border-l border-white/10 pl-8 md:pl-0 md:border-l-0">
                            <p className="mb-4">{body}</p>
                        </div>
                    )}
                </div>

                {/* 2. HUD Stats Grid - TRANSPARENTE Y MINIMALISTA */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-32 reveal-content border-y border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-white/[0.02] transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Mountain className="w-4 h-4 text-cyan-500" />
                            <span className="text-journal-data text-slate-400">ALTITUD</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-white">{tour.altitude.es}</span>
                    </div>
                    
                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-white/[0.02] transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Ruler className="w-4 h-4 text-blue-500" />
                            <span className="text-journal-data text-slate-400">DISTANCIA</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-white">{tour.distance}</span>
                    </div>

                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-white/[0.02] transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="text-journal-data text-slate-400">CLIMA</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-white">{tour.temperature.es}</span>
                    </div>

                    <div className="p-8 md:px-12 md:py-10 flex flex-col items-start justify-center group hover:bg-white/[0.02] transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                             <div className={`w-2 h-2 rounded-full 
                                ${tour.difficulty === 'Extreme' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 
                                  tour.difficulty === 'Hard' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]'}`} 
                            />
                            <span className="text-journal-data text-slate-400">NIVEL</span>
                        </div>
                        <span className="text-2xl md:text-3xl font-medium tracking-tight text-white">{tour.difficulty.toUpperCase()}</span>
                    </div>
                </div>

                {/* 3. Inclusions - DISEÑO ASIMÉTRICO */}
                <div className="flex flex-col md:flex-row gap-16 reveal-content">
                    <div className="md:w-1/2">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-8 border-b border-white/10 pb-4 inline-block pr-12">
                            INCLUYE
                        </h3>
                        <ul className="grid grid-cols-1 gap-4">
                            {tour.inclusions?.map((item, i) => (
                                <li key={i} className="flex items-baseline gap-4 text-base font-light text-slate-300 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 mt-2 shrink-0 group-hover:bg-cyan-400 transition-colors"></span>
                                    <span className="group-hover:text-slate-100 transition-colors">{item.es}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:w-1/2 md:pl-12 md:border-l border-white/5">
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-8 border-b border-white/10 pb-4 inline-block pr-12">
                            NO INCLUYE
                        </h3>
                        <ul className="grid grid-cols-1 gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
                            {tour.exclusions?.map((item, i) => (
                                <li key={i} className="flex items-baseline gap-4 text-sm font-light text-slate-400">
                                    <X className="w-3 h-3 text-slate-600 shrink-0 mt-1" />
                                    <span>{item.es}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    );
}

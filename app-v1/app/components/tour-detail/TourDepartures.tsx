'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Departure } from '../../types/api';
import { Users, ArrowRight, MapPin, Wind } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = {
    cyan: '#06b6d4',
    orange: '#f97316',
    purple: '#a855f7',
    blue: '#3b82f6'
};

export default function TourDepartures({ departures }: { departures: Departure[]; tourId: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Drawing the "Route" lines
        const lines = gsap.utils.toArray('.route-line');
        lines.forEach((line: any) => {
            gsap.fromTo(line, 
                { scaleX: 0, opacity: 0 },
                { 
                    scaleX: 1, opacity: 1, ease: "none",
                    scrollTrigger: {
                        trigger: line,
                        start: "top 90%",
                        end: "bottom 60%",
                        scrub: true
                    }
                }
            );
        });

        // Staggered node entry
        gsap.from(".expedition-node", {
            scale: 0,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%"
            }
        });

    }, { scope: containerRef });

    if (!departures || departures.length === 0) return null;

    return (
        <section id="dates" ref={containerRef} className="bg-slate-950 section-v-spacing px-frame border-t border-white/5 relative overflow-hidden">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-6xl mx-auto w-full relative z-10">
                
                {/* 1. Header: Clean & Standardized */}
                <div className="mb-24 md:mb-32 max-w-2xl">
                    <span className="text-sub-label text-cyan-500 mb-3 block tracking-[0.3em]">Temporal Planning</span>
                    <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight uppercase leading-none">
                        CALENDARIO <br/>
                        <span className="text-slate-600">DE EXPEDICIÓN</span>
                    </h2>
                </div>

                {/* 2. TOPOGRAPHIC ROUTE LAYOUT */}
                <div className="space-y-32 md:space-y-48">
                    {departures.map((dep, index) => {
                        const date = new Date(dep.date._seconds * 1000);
                        const day = date.getDate();
                        const month = date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
                        const isEven = index % 2 === 0;
                        
                        // Semantic colors based on availability
                        const available = dep.maxPax - dep.currentPax;
                        const statusColor = available <= 2 ? THEME_COLORS.orange : (index % 2 === 0 ? THEME_COLORS.cyan : THEME_COLORS.purple);

                        return (
                            <div key={dep.departureId} className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                                
                                {/* --- THE NODE (THE PEAK) --- */}
                                <div className="expedition-node relative shrink-0">
                                    <div 
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm z-20 relative transition-transform duration-500 hover:scale-110"
                                        style={{ borderColor: `${statusColor}40` }}
                                    >
                                        <span className="text-4xl md:text-5xl font-black text-white leading-none tracking-tighter">
                                            {day < 10 ? `0${day}` : day}
                                        </span>
                                        <span className="text-[10px] md:text-xs font-bold tracking-widest mt-1" style={{ color: statusColor }}>
                                            {month}
                                        </span>
                                    </div>
                                    {/* Pulse Effect */}
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: statusColor }}></div>
                                </div>

                                {/* --- THE DATA CARD (EDITORIAL STYLE) --- */}
                                <div className={`flex-1 ${isEven ? 'text-left' : 'md:text-right'} space-y-6`}>
                                    <div className={`flex flex-wrap items-center gap-4 ${isEven ? 'justify-start' : 'md:justify-end'}`}>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="text-journal-data">{available} VACANTES</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="text-journal-data">SALENTO BASE</span>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl md:text-4xl font-medium text-white uppercase tracking-tight leading-none">
                                        Expedición de <span className="text-slate-500">Temporada</span>
                                    </h3>

                                    <p className={`text-body-std text-slate-400 max-w-md ${isEven ? '' : 'ml-auto'} leading-relaxed`}>
                                        Planificada bajo condiciones óptimas. Incluye logística de alta montaña y guías con certificación internacional.
                                    </p>

                                    <button className={`flex items-center gap-4 group/btn ${isEven ? '' : 'flex-row-reverse ml-auto'}`}>
                                        <div className="flex flex-col items-start px-2">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">RESERVAR</span>
                                            <span className="text-[8px] font-mono text-slate-600 uppercase">Confirm link established</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-slate-950 transition-all duration-500">
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                                        </div>
                                    </button>
                                </div>

                                {/* --- DECORATIVE ROUTE LINE --- */}
                                {index < departures.length - 1 && (
                                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-px h-32 md:h-48 bg-white/5 hidden md:block`}>
                                        <div className="route-line w-full h-full bg-gradient-to-b from-white/20 to-transparent origin-top"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Perspective Coordinate (Visual unique detail) */}
                <div className="absolute right-0 bottom-0 p-12 opacity-5 flex flex-col items-end pointer-events-none">
                    <span className="text-sm font-mono tracking-widest uppercase">LAT: 4.6371</span>
                    <span className="text-sm font-mono tracking-widest uppercase">LON: -75.4831</span>
                    <Wind className="w-12 h-12 mt-4" />
                </div>

            </div>
        </section>
    );
}

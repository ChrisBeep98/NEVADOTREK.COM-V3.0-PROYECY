'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Departure } from '../../types/api';
import { Users, ArrowRight, MapPin, Activity } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = {
    cyan: '#06b6d4',
    orange: '#f97316',
    purple: '#a855f7',
};

export default function TourDepartures({ departures }: { departures: Departure[]; tourId: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const frames = gsap.utils.toArray('.expedition-frame');
        
        frames.forEach((frame: any) => {
            const available = parseInt(frame.getAttribute('data-available') || '0');
            const color = available <= 2 ? THEME_COLORS.orange : THEME_COLORS.cyan;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: frame,
                    start: "top 90%", // Starts sooner
                    end: "top 20%",   // Ends sooner
                    scrub: 0.5,       // Faster reaction
                }
            });

            // The "Merged Bracket" animation with subtle colors and faster speed
            tl.fromTo(frame.querySelector('.bracket-line-top'), 
                { width: "0%", backgroundColor: "rgba(255,255,255,0.05)" },
                { width: "100%", backgroundColor: `${color}4D`, duration: 0.6 } // 4D = 30% opacity
            )
            .fromTo(frame.querySelector('.frame-content'),
                { opacity: 0.2, x: -10 },
                { opacity: 1, x: 0, duration: 0.4 }, "-=0.4"
            );

            // If it's the last one, animate the bottom closing line too
            const bottomLine = frame.querySelector('.bracket-line-bottom');
            if (bottomLine) {
                tl.fromTo(bottomLine,
                    { width: "0%", backgroundColor: "rgba(255,255,255,0.05)" },
                    { width: "100%", backgroundColor: `${color}4D`, duration: 0.6 }, 0
                );
            }
        });

    }, { scope: containerRef });

    if (!departures || departures.length === 0) return null;

    return (
        <section id="dates" ref={containerRef} className="bg-slate-950 section-v-spacing px-frame border-t border-white/5 relative">
            <div className="max-w-6xl mx-auto w-full">
                
                {/* 1. Header */}
                <div className="mb-16 md:mb-24 flex items-end justify-between">
                    <div>
                        <span className="text-sub-label text-cyan-500 mb-2 block uppercase tracking-widest">Temporal Log</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight uppercase leading-none">
                            PROGRAMACIÓN <br/>
                            <span className="text-slate-600">DE SALIDAS</span>
                        </h2>
                    </div>
                    <div className="hidden md:flex items-center gap-2 opacity-20">
                        <Activity className="w-4 h-4 text-white" />
                        <span className="text-[8px] font-mono text-white uppercase tracking-[0.4em]">Grid established</span>
                    </div>
                </div>

                {/* 2. THE MERGED FRAMES */}
                <div className="flex flex-col">
                    {departures.map((dep, index) => {
                        const date = new Date(dep.date._seconds * 1000);
                        const day = date.getDate();
                        const month = date.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
                        const available = dep.maxPax - dep.currentPax;
                        const isLast = index === departures.length - 1;

                        return (
                            <div 
                                key={dep.departureId} 
                                data-available={available}
                                className="expedition-frame relative py-10 md:py-14 group"
                            >
                                {/* Top Line */}
                                <div className="bracket-line-top absolute top-0 left-0 h-px bg-white/5 origin-left"></div>
                                
                                {/* Bottom Line ONLY for the last item */}
                                {isLast && (
                                    <div className="bracket-line-bottom absolute bottom-0 right-0 h-px bg-white/5 origin-right"></div>
                                )}

                                {/* Content */}
                                <div className="frame-content flex flex-col md:flex-row md:items-center justify-between gap-8 px-2 transition-all duration-500">
                                    
                                    {/* Date */}
                                    <div className="flex items-center gap-6 min-w-[180px]">
                                        <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter tabular-nums">
                                            {day < 10 ? `0${day}` : day}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-base md:text-lg font-bold text-white tracking-widest uppercase">
                                                {month}
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">Season 2025</span>
                                        </div>
                                    </div>

                                    {/* Technical Data */}
                                    <div className="flex flex-wrap items-center gap-8 md:gap-12">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1 opacity-30">
                                                <Users className="w-3 h-3 text-white" />
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-white">Slots</span>
                                            </div>
                                            <span className={`text-xs font-bold ${available <= 2 ? 'text-orange-500' : 'text-emerald-400'}`}>
                                                {available} / {dep.maxPax} DISPONIBLES
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1 opacity-30">
                                                <MapPin className="w-3 h-3 text-white" />
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-white">Base</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Salento, Quindío</span>
                                        </div>
                                    </div>

                                    {/* Interaction - Responsive Button */}
                                    <button className="flex items-center gap-4 group/btn self-end md:self-center bg-white/[0.02] border border-white/5 hover:border-white/20 px-4 md:px-6 py-3 rounded-full transition-all duration-500">
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 group-hover:text-white transition-all uppercase hidden md:inline">
                                            UNIRSE AL GRUPO
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all duration-500">
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </button>

                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
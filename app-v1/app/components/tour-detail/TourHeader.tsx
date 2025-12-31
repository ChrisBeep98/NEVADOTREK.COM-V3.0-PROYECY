'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour, Departure } from '../../types/api';
import Header from '../Header';
import { Mountain, ArrowRight, Activity, Map, Compass, Flame, Zap } from 'lucide-react';
import BookingModal from './BookingModal';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour, departures }: { tour: Tour; departures: Departure[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. SECUENCIA DE ENTRADA (Intro Cinemática)
        tl.fromTo(imageRef.current,
            { scale: 1.15, opacity: 0 },
            { scale: 1, opacity: 0.6, duration: 2, ease: "power2.out" }
        )
        .fromTo(".hero-line", 
            { scaleX: 0, transformOrigin: "left" },
            { scaleX: 1, duration: 1, ease: "expo.out", stagger: 0.1 },
            "-=1.5"
        )
        .fromTo(".hero-text-reveal",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1 },
            "-=1.2"
        );

        // 2. EFECTO SCROLL (Parallax & Fade)
        gsap.to(imageRef.current, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(contentRef.current, {
            y: -100,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "60% top",
                scrub: true
            }
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full h-[95vh] bg-slate-950 overflow-hidden">
            <Header />

            {/* --- BACKGROUND LAYER (The Visual Anchor) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <img 
                    ref={imageRef}
                    src={tour.images[0]} 
                    alt={tour.name.es} 
                    className="w-full h-[120%] object-cover object-center absolute -top-[10%] opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/20 to-transparent"></div>
            </div>

            {/* --- CONTENT LAYER (The HUD) --- */}
            <div ref={contentRef} className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-12 md:pb-20">
                
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
                    
                    {/* LEFT: Main Typography */}
                    <div className="flex-1">
                        {/* Meta Badge - LIQUID GLASS UPDATE */}
                        <div className="flex items-center gap-4 mb-6 hero-text-reveal">
                            <div className="h-10 px-5 flex items-center gap-3 rounded-full bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
                                <span className="text-sm font-medium tracking-[0.04em] text-slate-300">
                                    Tour muy solicitado
                                </span>
                            </div>
                            <span className="hidden md:block text-xs font-mono text-slate-500 tracking-widest">
                                Season 2025 • high altitude
                            </span>
                        </div>

                        {/* Massive Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold text-white leading-[0.85] tracking-tighter uppercase mb-8 hero-text-reveal drop-shadow-2xl">
                            {tour.name.es}
                        </h1>

                        <div className="w-24 h-1 bg-cyan-500 mb-8 hero-line"></div>

                        {/* Subtitle / Lead */}
                        <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl leading-relaxed hero-text-reveal border-l-2 border-white/10 pl-6">
                            {tour.subtitle?.es}
                        </p>
                    </div>

                    {/* RIGHT: Technical Dashboard (Refactored Spec Sheet) */}
                    <div className="w-full lg:w-72 bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-lg hero-text-reveal shrink-0 overflow-hidden group hover:border-white/20 transition-colors duration-500">
                        
                        {/* Status Header */}
                        <div className="bg-white/[0.03] p-4 flex items-center justify-between border-b border-white/5">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Estado</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">Confirmado</span>
                            </div>
                        </div>

                        {/* Specs List */}
                        <div className="p-4 flex flex-col gap-4">
                            
                            {/* Altitude */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 opacity-60">
                                    <Mountain className="w-3.5 h-3.5 text-white" />
                                    <span className="text-[10px] uppercase tracking-widest text-slate-300">Cumbre</span>
                                </div>
                                <span className="text-sm font-bold text-white tabular-nums tracking-wide">
                                    {tour.altitude.es}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/5 w-full"></div>

                            {/* Distance */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 opacity-60">
                                    <Map className="w-3.5 h-3.5 text-white" />
                                    <span className="text-[10px] uppercase tracking-widest text-slate-300">Ruta</span>
                                </div>
                                <span className="text-sm font-bold text-white tabular-nums tracking-wide">
                                    {tour.distance}
                                </span>
                            </div>

                             {/* Divider */}
                             <div className="h-px bg-white/5 w-full"></div>

                            {/* Difficulty - Compact Bar */}
                            <div className="flex flex-col gap-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 opacity-60">
                                        <Zap className="w-3.5 h-3.5 text-white" />
                                        <span className="text-[10px] uppercase tracking-widest text-slate-300">Nivel</span>
                                    </div>
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${tour.difficulty === 'Extreme' ? 'text-purple-400' : tour.difficulty === 'Hard' ? 'text-orange-400' : 'text-emerald-400'}`}>
                                        {tour.difficulty}
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1">
                                    <div 
                                        className={`h-full ${tour.difficulty === 'Extreme' ? 'bg-purple-500' : tour.difficulty === 'Hard' ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                        style={{ width: tour.difficulty === 'Extreme' ? '95%' : tour.difficulty === 'Hard' ? '75%' : '50%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tour={tour} departures={departures} />
        </div>
    );
}
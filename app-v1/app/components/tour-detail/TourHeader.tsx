'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour, Departure } from '../../types/api';
import Header from '../Header';
import { Mountain, ArrowRight, Activity, Map, Compass } from 'lucide-react';
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
        // La imagen se mueve más lento que el scroll para dar profundidad
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

        // El contenido se desvanece y sube ligeramente al hacer scroll
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
                {/* Degradados cinemáticos para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/20 to-transparent"></div>
            </div>

            {/* --- CONTENT LAYER (The HUD) --- */}
            <div ref={contentRef} className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col justify-end pb-12 md:pb-20">
                
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
                    
                    {/* LEFT: Main Typography */}
                    <div className="flex-1">
                        {/* Meta Badge */}
                        <div className="flex items-center gap-4 mb-6 hero-text-reveal">
                            <div className="flex items-center gap-2 px-3 py-1.5 border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md rounded-full">
                                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-300 uppercase">
                                    Expedición Activa
                                </span>
                            </div>
                            <span className="hidden md:block text-xs font-mono text-slate-400 tracking-widest uppercase">
                                Season 2025 • High Altitude
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

                    {/* RIGHT: Technical Dashboard (HUD) */}
                    <div className="w-full lg:w-80 xl:w-96 bg-slate-950/40 backdrop-blur-sm border border-white/10 p-5 md:p-6 rounded-xl hero-text-reveal shrink-0">
                        <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">Datos Técnicos</span>
                            <Compass className="w-3.5 h-3.5 text-cyan-500 animate-[spin_10s_linear_infinite]" />
                        </div>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-2">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1 opacity-60">
                                    <Mountain className="w-3 h-3 text-white" />
                                    <span className="text-[9px] uppercase tracking-widest text-slate-300">Cumbre</span>
                                </div>
                                <span className="text-xl md:text-2xl font-bold text-white tabular-nums tracking-tight">
                                    {tour.altitude.es}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1 opacity-60">
                                    <Map className="w-3 h-3 text-white" />
                                    <span className="text-[9px] uppercase tracking-widest text-slate-300">Distancia</span>
                                </div>
                                <span className="text-xl md:text-2xl font-bold text-white tabular-nums tracking-tight">
                                    {tour.distance}
                                </span>
                            </div>

                            <div className="flex flex-col col-span-2 mt-2">
                                <div className="flex items-center gap-2 mb-2 opacity-60">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tour.difficulty === 'Extreme' ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                                    <span className="text-[9px] uppercase tracking-widest text-slate-300">Exigencia</span>
                                </div>
                                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${tour.difficulty === 'Extreme' ? 'bg-purple-500' : tour.difficulty === 'Hard' ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                        style={{ width: tour.difficulty === 'Extreme' ? '95%' : tour.difficulty === 'Hard' ? '75%' : '50%' }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-mono text-right mt-1 text-slate-500 uppercase">{tour.difficulty}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tour={tour} departures={departures} />
        </div>
    );
}
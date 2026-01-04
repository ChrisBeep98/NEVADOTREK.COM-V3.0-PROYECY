'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour, Departure } from '../../types/api';
import Header from '../Header';
import { Mountain, ArrowRight, Activity, Map, Compass, Flame, Zap, ArrowDown } from 'lucide-react';
import BookingModal from './BookingModal';
import { useLanguage } from '../../context/LanguageContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour, departures }: { tour: Tour; departures: Departure[] }) {
    const { t, lang } = useLanguage();
    const l = lang.toLowerCase() as 'es' | 'en';
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

            {/* --- FIXED ACTION BUTTON (The Conversion Point) --- */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-[var(--spacing-frame)] lg:bottom-auto lg:top-24 right-[var(--spacing-frame)] z-40 btn-primary !w-auto !h-[56px] shadow-[0_30px_60px_rgba(0,0,0,0.2)] hero-text-reveal px-6 group flex items-center gap-4"
            >
                <span>{t.tour_detail.header.book_slot}</span>
                <div className="w-8 h-8 rounded-full bg-slate-950/5 flex items-center justify-center transition-transform group-hover:scale-110">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
            </button>

            {/* --- BACKGROUND LAYER (The Visual Anchor) --- */}
            <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                <img 
                    ref={imageRef}
                    src={tour.images[0]} 
                    alt={tour.name[l]} 
                    className="w-full h-[120%] object-cover object-center absolute -top-[10%] opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/20 to-transparent"></div>
            </div>

            {/* --- CONTENT LAYER (The HUD) --- */}
            <div ref={contentRef} className="relative z-10 w-full h-full max-w-[1600px] mx-auto px-3 md:px-10 flex flex-col justify-center lg:justify-end pb-12 lg:pb-20 pt-20 lg:pt-0">
                
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
                    
                    {/* LEFT: Main Typography */}
                    <div className="flex-1">
                        {/* Meta Badge - LIQUID GLASS UPDATE */}
                        <div className="flex items-center gap-4 mb-6 hero-text-reveal">
                            <div className="h-10 px-5 flex items-center gap-3 rounded-full bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
                                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
                                <span className="text-sm font-medium tracking-[0.04em] text-slate-300">
                                    {t.tour_detail.header.hot_tour}
                                </span>
                            </div>
                            <span className="hidden md:block text-xs font-mono text-slate-500 tracking-widest">
                                Season 2025 • high altitude
                            </span>
                        </div>

                        {/* Massive Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold text-white leading-[0.85] tracking-tighter uppercase mb-8 hero-text-reveal drop-shadow-2xl">
                            {tour.name[l]}
                        </h1>

                        <div className="w-24 h-1 bg-cyan-500 mb-8 hero-line"></div>

                        {/* Subtitle / Lead */}
                        <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl leading-relaxed hero-text-reveal border-l-2 border-white/10 pl-6">
                            {tour.subtitle?.[l]}
                        </p>
                    </div>

                    {/* RIGHT: Technical Dashboard (Liquid Glass Card) */}
                    <div className="hidden lg:block w-80 bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 rounded-2xl hero-text-reveal shrink-0 shadow-2xl">
                        
                        {/* Data Grid Vertical */}
                        <div className="flex flex-col gap-5">
                            
                            {/* 1. Altitude */}
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all">
                                        <Mountain className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 tracking-wider">{t.tour_detail.header.altitude}</span>
                                </div>
                                <span className="text-lg font-bold text-white tabular-nums tracking-tight">
                                    {tour.altitude?.[l] || "N/A"}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/5 w-full"></div>

                            {/* 2. Distance */}
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all">
                                        <Map className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 tracking-wider">{t.tour_detail.header.distance}</span>
                                </div>
                                <span className="text-lg font-bold text-white tabular-nums tracking-tight">
                                    {tour.distance || "N/A"}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/5 w-full"></div>

                            {/* 3. Difficulty */}
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-slate-400 tracking-wider">{t.tour_detail.header.difficulty}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px_currentColor] ${
                                        tour.difficulty === 'Extreme' ? 'bg-purple-500 text-purple-500' : 
                                        tour.difficulty === 'Hard' ? 'bg-orange-500 text-orange-500' : 
                                        'bg-emerald-400 text-emerald-400'
                                    }`}></div>
                                    <span className={`text-sm font-bold tracking-wide ${
                                        tour.difficulty === 'Extreme' ? 'text-purple-400' : 
                                        tour.difficulty === 'Hard' ? 'text-orange-400' : 
                                        'text-emerald-400'
                                    }`}>
                                        {tour.difficulty || "Medium"}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Mobile Scroll Indicator (Nano-Mouse) */}
                <div className="lg:hidden absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20">
                    <div className="w-[20px] h-[32px] rounded-full border border-white/20 flex justify-center pt-2 bg-white/[0.01] backdrop-blur-[2px]">
                        <div className="w-[2px] h-[4px] bg-cyan-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    </div>
                </div>
            </div>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tour={tour} departures={departures} />
        </div>
    );
}
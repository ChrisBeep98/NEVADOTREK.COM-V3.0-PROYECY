'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour } from '../../types/api';
import { Mountain, Clock, Trophy, ArrowDown } from 'lucide-react';
import Header from '../Header'; // Import Global Header

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour }: { tour: Tour }) {
    const headerRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        // --- 1. INTRO ANIMATION (Load) ---
        // Asymmetrical Entry: Starts with gap on RIGHT, expands slightly but keeps gap.
        const introTl = gsap.timeline();
        
        introTl.fromTo(".hero-text-element", 
            { x: -40, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out" }
        )
        // Image Entry: Starts aligned LEFT.
        // From: 40% gap on right. To: 20% gap on right.
        .fromTo(imageWrapperRef.current,
            { clipPath: "inset(0% 40% 0% 0%)", opacity: 0 }, 
            { clipPath: "inset(0% 20% 0% 0%)", opacity: 1, duration: 1.5, ease: "expo.out" },
            "-=0.8"
        )
        // Inner Zoom
        .fromTo(imageRef.current,
            { scale: 1.3 },
            { scale: 1.1, duration: 1.5, ease: "expo.out" },
            "<"
        )
        // Chips stagger in
        .fromTo(".glass-chip",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)" },
            "-=1.0"
        );

        // --- 2. SCROLL ANIMATION ---
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top top",     
                end: "+=40%", // Fast expansion
                scrub: 0.5,           
            }
        });

        scrollTl
            // Expand Clip Path to FULL WIDTH (fill the right gap)
            .to(imageWrapperRef.current, {
                clipPath: "inset(0% 0% 0% 0%)", 
                ease: "none"
            })
            // Scale Down Image (From 1.1 to 1.0) & Parallax
            .to(imageRef.current, {
                scale: 1.0,
                yPercent: 10,
                ease: "none"
            }, 0);

    }, { scope: headerRef });

    return (
        <>
            {/* GLOBAL NAVIGATION HEADER */}
            <Header />

            <header 
                ref={headerRef} 
                className="relative w-full bg-slate-950 font-sans overflow-hidden"
            >
                {/* --- 1. TYPOGRAPHY HEADER --- */}
                {/* 
                    Desktop: Left aligned but indented (pl-[15vw]) for editorial look.
                    Mobile: Standard px-frame padding.
                */}
                <div className="pt-[20vh] pb-[8vh] px-frame md:pl-[15vw] flex flex-col items-start text-left z-20 relative">
                    
                    <div className="overflow-hidden mb-6">
                         <span className="hero-text-element block text-sub-label text-cyan-500">
                            The Expedition
                         </span>
                    </div>
                    
                    {/* TOKEN: text-hero-title + font-semibold (Reduced weight) */}
                    <h1 className="hero-text-element text-hero-title font-semibold text-white mb-8 max-w-5xl break-words">
                        {tour.name.es}
                    </h1>

                    {/* TOKEN: text-body-lead */}
                    <p className="hero-text-element text-body-lead text-slate-400 max-w-2xl opacity-80">
                        {tour.subtitle?.es || "Explora los límites de lo posible en una travesía inolvidable."}
                    </p>

                </div>

                {/* --- 2. IMAGE MONOLITH --- */}
                {/* Justify Start ensures strict Left Alignment from initial render */}
                <div className="relative w-full flex justify-start pb-0">
                    
                    <div 
                        ref={imageWrapperRef}
                        className="relative w-full h-[60vh] md:h-[900px] bg-slate-900 will-change-[clip-path]"
                        // Initial State: Gap on the RIGHT side only (Left Aligned)
                        style={{ clipPath: "inset(0% 20% 0% 0%)" }}
                    >
                        <img 
                            ref={imageRef}
                            src={tour.images[0]} 
                            alt={tour.name.es} 
                            className="w-full h-full object-cover origin-center will-change-transform" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 md:h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                        {/* --- HUD GLASS CHIPS --- */}
                        <div className="absolute bottom-0 left-0 w-full px-frame py-8 md:py-16 z-10">
                            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                                
                                {/* Stats Chips Container */}
                                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                                    
                                    {/* Chip 1: Altitude */}
                                    <div className="glass-chip flex items-center gap-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-6 py-2 hover:bg-white/10 transition-colors duration-300">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                            <Mountain className="w-4 h-4 text-cyan-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Altitud</span>
                                            <span className="text-sm font-bold text-white tracking-tight">{tour.altitude.es}</span>
                                        </div>
                                    </div>

                                    {/* Chip 2: Level */}
                                    <div className="glass-chip flex items-center gap-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-6 py-2 hover:bg-white/10 transition-colors duration-300">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                            <Trophy className="w-4 h-4 text-orange-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Nivel</span>
                                            <span className="text-sm font-bold text-white tracking-tight uppercase">{tour.difficulty}</span>
                                        </div>
                                    </div>

                                    {/* Chip 3: Time */}
                                    <div className="glass-chip flex items-center gap-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-6 py-2 hover:bg-white/10 transition-colors duration-300">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <Clock className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Tiempo</span>
                                            <span className="text-sm font-bold text-white tracking-tight">{tour.totalDays} Días</span>
                                        </div>
                                    </div>

                                </div>

                                {/* Scroll Hint */}
                                <div className="glass-chip hidden md:flex items-center gap-3 text-white/40 animate-pulse bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5">
                                    <span className="text-journal-data">SCROLL TO EXPLORE</span>
                                    <ArrowDown className="w-4 h-4" />
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

            </header>
        </>
    );
}

'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour } from '../../types/api';
import { ArrowDown, Mountain, MapPin } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour }: { tour: Tour }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // 1. LATERAL SLIDE EXPANSION
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=100%", 
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        tl.to(imageWrapperRef.current, {
            width: "100%",
            left: "0%",
            ease: "power2.inOut"
        })
        .to(".text-mask-effect", {
            x: 20, 
            ease: "power2.inOut"
        }, "<")
        .to(".hero-hud-lateral, .scroll-indicator-container", {
            opacity: 0,
            y: 20,
            ease: "power2.inOut"
        }, "<");

        // 2. INTRO ANIMATIONS
        gsap.fromTo(".hero-reveal", 
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power4.out" }
        );

        // 3. SCROLL INDICATOR DOT ANIMATION (The "Beautiful" detail)
        gsap.to(".scroll-dot", {
            y: 40,
            opacity: 0,
            duration: 1.5,
            repeat: -1,
            ease: "power2.inOut"
        });

    }, { scope: containerRef });

    return (
        <header ref={containerRef} className="relative h-screen w-full bg-slate-950 overflow-hidden flex items-center">
            
            {/* 1. THE SLIDING IMAGE (High Illumination, No Border Radius) */}
            <div 
                ref={imageWrapperRef}
                className="absolute right-0 top-0 h-full w-[60vw] z-0 will-change-[width,left] overflow-hidden"
            >
                <img 
                    src={tour.images[0]} 
                    alt={tour.name.es} 
                    className="w-full h-full object-cover brightness-[0.9] saturate-[1.1]"
                />
                {/* Overlay sutil para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* 2. LEFT ALIGNED CONTENT */}
            <div 
                ref={textRef}
                className="relative z-10 w-full px-frame flex flex-col items-start justify-center h-full pointer-events-none"
            >
                {/* HUD Top-Left */}
                <div className="absolute top-12 left-frame hero-hud-lateral hero-reveal">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-cyan-500"></div>
                        <span className="text-sub-label text-cyan-500 uppercase tracking-[0.4em]">Expedition_Node</span>
                    </div>
                </div>

                <div className="max-w-4xl text-mask-effect">
                    <h1 
                        className="text-[8vw] md:text-[7vw] font-bold uppercase leading-[0.85] tracking-tighter break-words text-left hero-reveal"
                        style={{
                            backgroundImage: `url(${tour.images[0]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                            backgroundAttachment: 'fixed'
                        }}
                    >
                        {tour.name.es}
                    </h1>
                    
                    <div className="mt-8 flex flex-col gap-6 items-start hero-reveal">
                        <p className="text-body-lead text-slate-400 max-w-md font-light leading-relaxed border-l border-white/10 pl-6">
                            {tour.shortDescription.es}
                        </p>
                        
                        <div className="flex gap-12 pt-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-journal-data text-slate-500 uppercase">Elevation</span>
                                <span className="text-xl font-bold text-white uppercase">{tour.altitude.es}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-journal-data text-slate-500 uppercase">Difficulty</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tour.difficulty === 'Hard' ? 'bg-orange-500' : 'bg-cyan-500'} animate-pulse`}></div>
                                    <span className="text-xl font-bold text-white uppercase">{tour.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. REFACTORED SCROLL INDICATOR (The Path Tracker) */}
                <div className="scroll-indicator-container absolute bottom-12 left-frame flex items-center gap-6 hero-reveal">
                    <div className="relative h-16 w-px bg-white/10 overflow-hidden">
                        <div className="scroll-dot absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/40 mb-1">Navigation</span>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-white">Scroll to Align</span>
                    </div>
                </div>
            </div>

            {/* Subtle Decorative Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none z-0"></div>

        </header>
    );
}

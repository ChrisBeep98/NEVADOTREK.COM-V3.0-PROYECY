'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour } from '../../types/api';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour }: { tour: Tour }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const curtainRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<SVGCircleElement>(null);

    useGSAP(() => {
        // 1. THE ARCHITECTURAL REVEAL (Linked to Scroll)
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

        tl.to(curtainRef.current, {
            xPercent: -100,
            ease: "power2.inOut"
        })
        // Image scale effect requested
        .to(".bg-image-hero", {
            scale: 1.1,
            ease: "none"
        }, "<")
        .to(".hero-content-reveal", {
            x: -50,
            opacity: 0,
            ease: "power2.inOut"
        }, "<")
        // Progress ring linked to scroll
        .to(progressRef.current, {
            strokeDashoffset: 0,
            ease: "none"
        }, "<");

        // 2. IDLE ANIMATIONS
        gsap.fromTo(".scroll-chevron", 
            { y: -2 },
            { y: 2, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );

        // 3. INTRO ANIMATION
        gsap.fromTo(".hero-reveal", 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power4.out" }
        );

    }, { scope: containerRef });

    return (
        <header ref={containerRef} className="relative h-screen w-full bg-slate-950 overflow-hidden flex items-center">
            
            {/* 1. BACKGROUND IMAGE (Vibrant, scaled on scroll) */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={tour.images[0]} 
                    alt={tour.name.es} 
                    className="bg-image-hero w-full h-full object-cover brightness-[1.1] saturate-[1.1] will-change-transform"
                />
                {/* Subtle gradient for initial text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent"></div>
            </div>

            {/* 2. THE CURTAIN (Architectural Slider) */}
            <div 
                ref={curtainRef}
                className="absolute left-0 top-0 h-full w-[45vw] bg-slate-950 z-10 border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.8)]"
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]"></div>
            </div>

            {/* 3. CONTENT LAYER (Aligned Left) */}
            <div className="relative z-20 w-full px-frame flex flex-col items-start justify-center h-full pointer-events-none">
                
                <div className="hero-content-reveal max-w-5xl">
                    {/* SUB-LABEL TOKEN */}
                    <div className="hero-reveal flex items-center gap-3 mb-8">
                        <div className="w-12 h-px bg-cyan-500/50"></div>
                        <span className="text-sub-label">Expedition_Brief</span>
                    </div>

                    {/* H-EXPEDITION TOKEN (Matte Crystal Style) */}
                    <div className="relative hero-reveal">
                        <h1 
                            className="text-h-expedition break-words text-left uppercase"
                            style={{
                                backgroundImage: `
                                    linear-gradient(165deg, rgba(255,255,255,1) 0%, rgba(214,245,255,0.9) 50%, rgba(255,255,255,0.8) 100%),
                                    url(${tour.images[0]})
                                `,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                WebkitTextStroke: '1px rgba(255,255,255,0.4)',
                                backgroundAttachment: 'fixed',
                                filter: 'brightness(1.2)'
                            }}
                        >
                            {tour.name.es}
                        </h1>
                    </div>
                    
                    <div className="mt-12 flex flex-col gap-8 items-start hero-reveal">
                        {/* BODY LEAD TOKEN */}
                        <p className="text-body-lead text-slate-400 max-w-md border-l border-white/10 pl-8 italic">
                            {tour.shortDescription.es}
                        </p>
                        
                        <div className="flex gap-16 pt-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-journal-data text-slate-500 uppercase">Elevation</span>
                                <span className="text-heading-l !font-light text-white/90 tracking-tight">{tour.altitude.es}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-journal-data text-slate-500 uppercase">Intensity</span>
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tour.difficulty === 'Hard' ? 'bg-orange-500 shadow-[0_0_10px_#f97316]' : 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]'}`}></div>
                                    <span className="text-heading-l !font-light text-white/90 tracking-tight uppercase">{tour.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. PROGRESS DIAL (Liquid Glass Visual Indicator) */}
            <div className="absolute bottom-12 right-frame z-50 hero-reveal">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="1" className="opacity-[0.05]" />
                        <circle 
                            ref={progressRef}
                            cx="50" cy="50" r="42" 
                            fill="none" stroke="#06b6d4" strokeWidth="2" 
                            strokeDasharray="264" 
                            strokeDashoffset="264" 
                            strokeLinecap="round"
                            className="opacity-60"
                        />
                    </svg>
                    <div className="relative flex flex-col items-center justify-center">
                        <svg className="scroll-chevron w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none"></div>
                </div>
            </div>

        </header>
    );
}

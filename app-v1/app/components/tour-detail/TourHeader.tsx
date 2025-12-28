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
        // 1. THE ARCHITECTURAL REVEAL (Curtain slides left)
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
        .to(".hero-content-reveal", {
            x: -50,
            opacity: 0,
            ease: "power2.inOut"
        }, "<")
        // Vincular el anillo de progreso al scroll
        .to(progressRef.current, {
            strokeDashoffset: 0,
            ease: "none"
        }, "<");

        // 2. IDLE ANIMATIONS
        // Chevron pulsing down
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
        <header ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center">
            
            {/* 1. BACKGROUND IMAGE (Full screen, stationary) */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={tour.images[0]} 
                    alt={tour.name.es} 
                    className="w-full h-full object-cover brightness-[1.1] saturate-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* 2. THE CURTAIN (Architectural Slider) */}
            <div 
                ref={curtainRef}
                className="absolute left-0 top-0 h-full w-[45vw] bg-slate-950 z-10 border-r border-white/5 shadow-[20px_0_60px_rgba(0,0,0,0.8)]"
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]"></div>
            </div>

            {/* 3. CONTENT LAYER */}
            <div className="relative z-20 w-full px-frame flex flex-col items-start justify-center h-full pointer-events-none">
                
                <div className="hero-content-reveal max-w-5xl">
                    <div className="hero-reveal flex items-center gap-3 mb-8">
                        <div className="w-12 h-px bg-cyan-500/50"></div>
                        <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-[0.5em]">Expedition_Node</span>
                    </div>

                    <h1 
                        className="text-[8vw] md:text-[7vw] font-bold uppercase leading-[1.1] tracking-tighter break-words text-left hero-reveal"
                        style={{
                            backgroundImage: `url(${tour.images[0]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            WebkitTextStroke: '1px rgba(255,255,255,0.15)',
                            backgroundAttachment: 'fixed',
                            filter: 'blur(0.8px) brightness(1.2)'
                        }}
                    >
                        {tour.name.es}
                    </h1>
                    
                    <div className="mt-12 flex flex-col gap-8 items-start hero-reveal">
                        <p className="text-body-lead text-slate-400 max-w-md font-light leading-relaxed border-l border-white/10 pl-8 italic">
                            {tour.shortDescription.es}
                        </p>
                        
                        <div className="flex gap-16 pt-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest opacity-60">Elevation</span>
                                <span className="text-lg md:text-xl font-light text-white/90 tracking-wide">{tour.altitude.es}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest opacity-60">Difficulty</span>
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full ${tour.difficulty === 'Hard' ? 'bg-orange-500' : 'bg-cyan-500'} shadow-[0_0_10px_currentColor]`}></div>
                                    <span className="text-lg md:text-xl font-light text-white/90 tracking-wide uppercase">{tour.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. LIQUID GLASS PROGRESS DIAL (Persistent Scroll Indicator) */}
            <div className="absolute bottom-12 right-frame z-50 hero-reveal">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden">
                    
                    {/* The Circular Progress Ring (SVG) */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle 
                            cx="50" cy="50" r="42" 
                            fill="none" stroke="white" strokeWidth="1" className="opacity-[0.05]"
                        />
                        {/* Dynamic Progress Circle */}
                        <circle 
                            ref={progressRef}
                            cx="50" cy="50" r="42" 
                            fill="none" stroke="#06b6d4" strokeWidth="2" 
                            strokeDasharray="264" // 2 * PI * r (42)
                            strokeDashoffset="264" // Full offset initially
                            strokeLinecap="round"
                            className="opacity-60"
                        />
                    </svg>

                    {/* Central Visual: Pulsing Chevron */}
                    <div className="relative flex flex-col items-center justify-center">
                        <svg className="scroll-chevron w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>

                    {/* Glass Gloss Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none"></div>
                </div>
            </div>

        </header>
    );
}
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
    const textRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // 1. Initial Reveal
        tl.fromTo(bgRef.current, 
            { scale: 1.2, opacity: 0 },
            { scale: 1, opacity: 0.6, duration: 1.5, ease: "power2.out" }
        )
        .fromTo(textRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
            "-=1"
        );

        // 2. Scroll Parallax (Cinematic Pacing)
        gsap.to(bgRef.current, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // 3. Text Fade Out on Scroll
        gsap.to(textRef.current, {
            opacity: 0,
            y: -50,
            ease: "power1.in",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "center center",
                end: "bottom top",
                scrub: true
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            
            {/* Background Image (Video Mask effect conceptually) */}
            <div className="absolute inset-0 bg-slate-950 z-0">
                <img 
                    ref={bgRef}
                    src={tour.images[0]} 
                    alt={tour.name.es} 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            </div>

            {/* Content: Fearless Scale */}
            <div ref={textRef} className="relative z-10 px-frame text-center max-w-7xl mx-auto">
                <span className="text-sub-label block mb-4 md:mb-8">{tour.difficulty} EXPEDITION // {tour.totalDays} DAYS</span>
                <h1 className="text-display-xl text-white mb-6 leading-none">
                    {tour.name.es.toUpperCase()}
                </h1>
                {tour.subtitle && (
                    <p className="text-body-lead text-slate-300 max-w-2xl mx-auto">
                        {tour.subtitle.es}
                    </p>
                )}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce text-slate-500">
                <span className="text-journal-data">SCROLL TO EXPLORE</span>
            </div>
        </section>
    );
}

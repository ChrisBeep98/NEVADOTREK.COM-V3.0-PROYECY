'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour } from '../../types/api';
import { ArrowDown, Mountain, Clock } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour }: { tour: Tour }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLImageElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Parallax Simple: Fondo baja lento, Título sube un poco
        tl.to(bgRef.current, { yPercent: 20, scale: 1.1, ease: "none" })
          .to(titleRef.current, { yPercent: -10, opacity: 0, ease: "none" }, "<");

        // Intro Animation
        gsap.fromTo(titleRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
        );

    }, { scope: containerRef });

    return (
        <header ref={containerRef} className="relative h-screen w-full bg-slate-950 overflow-hidden flex items-center justify-center">
            
            {/* 1. BACKGROUND (Darkened) */}
            <div className="absolute inset-0 z-0">
                <img 
                    ref={bgRef}
                    src={tour.images[0]} 
                    alt={tour.name.es} 
                    className="w-full h-full object-cover brightness-[0.4]"
                />
            </div>

            {/* 2. CENTER TITLE (Pure Image Clip) */}
            <div className="relative z-10 w-full px-frame text-center">
                <h1 
                    ref={titleRef}
                    className="text-[10vw] md:text-[8vw] font-bold uppercase leading-none tracking-tighter break-words"
                    style={{
                        // La magia pura: La imagen dentro del texto
                        backgroundImage: `url(${tour.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        // Aseguramos que la imagen del texto coincida con la del fondo (fixed position trick visual)
                        backgroundAttachment: 'fixed' 
                    }}
                >
                    {tour.name.es}
                </h1>
            </div>

            {/* 3. MINIMAL HUD (Corner Anchors) */}
            <div className="absolute bottom-12 left-0 w-full px-frame flex justify-between items-end z-20 text-white pointer-events-none">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Elevation</span>
                    <div className="flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-white" />
                        <span className="text-xl font-bold font-mono">{tour.altitude.es}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 text-white/30 animate-pulse">
                    <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                    <ArrowDown className="w-4 h-4" />
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                    <span className="text-[10px] uppercase tracking-widest text-white/50">Duration</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono">{tour.totalDays} DAYS</span>
                        <Clock className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

        </header>
    );
}
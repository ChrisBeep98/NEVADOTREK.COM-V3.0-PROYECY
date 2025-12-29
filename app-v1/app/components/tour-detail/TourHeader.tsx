'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour } from '../../types/api';
import Header from '../Header';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour }: { tour: Tour }) {
    const headerRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useGSAP(() => {
        // --- 1. INTRO ANIMATION (Load) ---
        const introTl = gsap.timeline();
        
        introTl.fromTo(".hero-text-element", 
            { x: -40, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power3.out" }
        )
        // Image Entry: Starts aligned LEFT.
        // Target: 74% width (26% right gap). 
        // We start slightly narrower (40%) and animate TO 26%.
        .fromTo(imageWrapperRef.current,
            { clipPath: "inset(0% 40% 0% 0%)", opacity: 0 }, 
            { clipPath: "inset(0% 26% 0% 0%)", opacity: 1, duration: 1.5, ease: "expo.out" },
            "-=0.8"
        )
        // Inner Zoom
        .fromTo(imageRef.current,
            { scale: 1.3 },
            { scale: 1.1, duration: 1.5, ease: "expo.out" },
            "<"
        )
        .fromTo(".scroll-hint-wrapper",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        );

        // --- 2. SCROLL ANIMATION ---
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top top",
                end: "+=40%",
                scrub: 0.5,
            }
        });

        scrollTl
            .to(imageWrapperRef.current, {
                clipPath: "inset(0% 0% 0% 0%)", 
                ease: "none"
            })
            .to(imageRef.current, {
                scale: 1.0,
                yPercent: 10,
                ease: "none"
            }, 0)
            .to(".scroll-hint-wrapper", {
                opacity: 0,
                y: 20,
                ease: "power1.in"
            }, 0);

    }, { scope: headerRef });

    return (
        <>
            <Header />

            <header 
                ref={headerRef} 
                className="relative w-full bg-slate-950 font-sans overflow-hidden"
            >
                {/* --- 1. TYPOGRAPHY HEADER --- */}
                <div className="pt-[20vh] pb-[8vh] px-frame md:pl-[15vw] flex flex-col items-start text-left z-20 relative text-white">
                    
                    <div className="overflow-hidden mb-6">
                         <span className="hero-text-element block text-sub-label text-cyan-500">
                            The Expedition
                         </span>
                    </div>
                    
                    {/* H-TOUR-TITLE: Now 8.5vw / 6xl font-medium */}
                    <h1 className="hero-text-element text-h-tour-title mb-8 max-w-5xl break-words uppercase">
                        {tour.name.es}
                    </h1>

                    <p className="hero-text-element text-body-lead text-slate-400 max-w-2xl opacity-80">
                        {tour.subtitle?.es || "Explora los límites de lo posible en una travesía inolvidable."}
                    </p>

                </div>

                {/* --- 2. IMAGE MONOLITH --- */}
                <div className="relative w-full flex justify-start pb-0">
                    
                    <div 
                        ref={imageWrapperRef}
                        className="relative w-full h-[60vh] md:h-[900px] bg-slate-900 will-change-[clip-path]"
                        // Initial State: 26% gap on right = 74% width
                        style={{ clipPath: "inset(0% 26% 0% 0%)" }}
                    >
                        <img 
                            ref={imageRef}
                            src={tour.images[0]} 
                            alt={tour.name.es} 
                            className="w-full h-full object-cover origin-center will-change-transform" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                        {/* --- SCROLL HINT --- */}
                        <div className="scroll-hint-wrapper absolute bottom-12 left-0 w-full px-frame md:pl-[15vw] z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                                    <div className="w-1 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                                </div>
                                <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">
                                    Scroll to explore
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

            </header>
        </>
    );
}

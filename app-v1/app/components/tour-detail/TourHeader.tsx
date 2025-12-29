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
    const scrollHintRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // --- 1. CINEMATIC INTRO (Load) ---
        const introTl = gsap.timeline({
            defaults: { ease: "expo.out", duration: 1.6 }
        });
        
        introTl
        // Title Reveal: Rise, Rotate and Unblur
        .fromTo(".hero-text-element", 
            { y: 100, opacity: 0, rotateX: -15, filter: "blur(10px)" },
            { y: 0, opacity: 1, rotateX: 0, filter: "blur(0px)", stagger: 0.12 }
        )
        // Image Monolith: Precise 74% width landing (26% inset right)
        .fromTo(imageWrapperRef.current,
            { clipPath: "inset(0% 50% 0% 0%)", opacity: 0 }, 
            { clipPath: "inset(0% 26% 0% 0%)", opacity: 1, duration: 1.8 },
            "-=1.2"
        )
        // Counter-Zoom
        .fromTo(imageRef.current,
            { scale: 1.4 },
            { scale: 1.1, duration: 1.8 },
            "<"
        )
        // Persistent Scroll Hint
        .fromTo(scrollHintRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1 },
            "-=1"
        );

        // --- 2. SCROLL CHOREOGRAPHY ---
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top top",
                end: "+=60%", // Extended for better feel
                scrub: 1,     // Slightly more lag for "heavy" cinematic feel
            }
        });

        scrollTl
            // Expand Image to fill the 26% gap
            .to(imageWrapperRef.current, {
                clipPath: "inset(0% 0% 0% 0%)", 
                ease: "power2.inOut"
            })
            // Parallax & Settle
            .to(imageRef.current, {
                scale: 1.0,
                yPercent: 12,
                ease: "power2.inOut"
            }, 0)
            // Title subtle movement
            .to(".hero-text-element", {
                y: -40,
                opacity: 0.5,
                stagger: 0.05,
                ease: "none"
            }, 0)
            // Scroll Hint: Fades but stays as a ghost element
            .to(scrollHintRef.current, {
                opacity: 0.2,
                y: 40,
                ease: "none"
            }, 0);

    }, { scope: headerRef });

    return (
        <>
            <Header />

            <header 
                ref={headerRef} 
                className="relative w-full bg-slate-950 font-sans overflow-hidden select-none"
                style={{ perspective: '1000px' }} // Enables 3D rotations for intro
            >
                {/* --- 1. TEXT LAYER --- */}
                <div className="pt-[22vh] pb-[10vh] px-frame md:pl-[15vw] flex flex-col items-start text-left z-20 relative will-change-transform">
                    
                    <div className="overflow-hidden mb-6">
                         <span className="hero-text-element block text-sub-label text-cyan-500 tracking-[0.3em]">
                            THE EXPEDITION
                         </span>
                    </div>
                    
                    <h1 className="hero-text-element text-h-tour-title text-white mb-10 max-w-5xl break-words uppercase leading-none will-change-[transform,opacity]">
                        {tour.name.es}
                    </h1>

                    <p className="hero-text-element text-body-lead text-slate-400 max-w-2xl opacity-70 font-light leading-relaxed">
                        {tour.subtitle?.es || "Explora los límites de lo posible en una travesía inolvidable."}
                    </p>

                </div>

                {/* --- 2. IMAGE MONOLITH --- */}
                <div className="relative w-full flex justify-start pb-0 overflow-hidden">
                    
                    <div 
                        ref={imageWrapperRef}
                        className="relative w-full h-[65vh] md:h-[900px] bg-slate-900 will-change-[clip-path,transform]"
                        style={{ 
                            clipPath: "inset(0% 26% 0% 0%)",
                            transform: 'translateZ(0)' // GPU Acceleration
                        }}
                    >
                        <img 
                            ref={imageRef}
                            src={tour.images[0]} 
                            alt={tour.name.es} 
                            className="w-full h-full object-cover origin-center will-change-transform" 
                            style={{ transform: 'scale(1.1) translateZ(0)' }}
                        />
                        
                        {/* Dramatic Atmospheric Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>

                        {/* --- PERSISTENT SCROLL INDICATOR --- */}
                        <div 
                            ref={scrollHintRef}
                            className="scroll-hint-wrapper absolute bottom-12 left-0 w-full px-frame md:pl-[15vw] z-30 pointer-events-none"
                        >
                            <div className="flex items-center gap-5">
                                <div className="relative w-[30px] h-[50px] border border-white/10 rounded-full flex justify-center p-1.5 bg-white/5 backdrop-blur-sm">
                                    <div className="w-1 h-3 bg-cyan-500 rounded-full animate-[bounce_2s_infinite] shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-mono tracking-[0.4em] text-white/60 uppercase">
                                        Discovery Track
                                    </span>
                                    <span className="text-[8px] font-mono tracking-[0.2em] text-white/20 uppercase">
                                        Scroll to reveal details
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </header>
        </>
    );
}
"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatementSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const compassRef = useRef<HTMLDivElement>(null);
    const ringsRef = useRef<{ outer: SVGGElement | null, middle: SVGGElement | null, inner: SVGGElement | null }>({ outer: null, middle: null, inner: null });

    useGSAP(() => {
        if (!sectionRef.current) return;

        // 1. Text Reveal Animation (Cinematic Blur Reveal)
        const words = containerRef.current?.querySelectorAll('.word');
        if (words) {
            gsap.fromTo(words, 
                { opacity: 0.1, y: 15, filter: "blur(8px)" },
                { 
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    stagger: 0.03,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 90%",
                        end: "bottom 60%",
                        scrub: 1.5,
                    }
                }
            );
        }

        // 2. Compass Parallax (Floating Effect)
        if (compassRef.current) {
            gsap.to(compassRef.current, {
                y: -50, // Moves up slightly faster than scroll
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                }
            });
        }

        // 3. Compass Rings Rotation (Technical Precision)
        const { outer, middle, inner } = ringsRef.current;
        
        if (outer) {
            gsap.to(outer, {
                rotation: 120,
                svgOrigin: "150 150",
                ease: "none",
                scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
            });
        }
        if (middle) {
            gsap.to(middle, {
                rotation: -60,
                svgOrigin: "150 150",
                ease: "none",
                scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 }
            });
        }
        if (inner) {
            gsap.to(inner, {
                rotation: 180,
                svgOrigin: "150 150",
                ease: "none",
                scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 2.5 }
            });
        }

    }, { scope: sectionRef });

    const manifesto = "Dejamos atrás el ruido del valle para encontrar la señal de la montaña. Construimos el umbral hacia lo salvaje, donde el aire escasea y la claridad mental se vuelve absoluta. Aquí, cada paso es una promesa de regreso transformado.";

    return (
        <section 
            ref={sectionRef} 
            className="relative h-auto section-v-spacing bg-background overflow-hidden flex items-center transform-gpu"
        >
            <div className="relative z-10  w-full px-frame flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-24">
                
                {/* Left: Manifesto Text */}
                <div ref={containerRef} className="w-full max-w-6xl">
                    <p className="block">
                        {manifesto.split(" ").map((word, i) => (
                            <span key={i} className="word text-statement leading-[1.3] inline-block mr-[0.3em] font-medium text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 will-change-transform will-change-opacity">
                                {word}
                            </span>
                        ))}
                    </p>
                </div>

                {/* Right: Advanced Topographic Compass */}
                <div ref={compassRef} className="hidden lg:flex items-center justify-center opacity-40 mix-blend-screen scale-90 select-none pointer-events-none shrink-0">
                    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-500">
                        
                        {/* Outer Technical Ring */}
                        <g ref={(el) => { ringsRef.current.outer = el }}>
                            <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 6" />
                            <circle cx="150" cy="150" r="130" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
                            <path d="M150 5V15" stroke="currentColor" strokeWidth="2" />
                            <path d="M150 285V295" stroke="currentColor" strokeWidth="2" />
                            <path d="M295 150H285" stroke="currentColor" strokeWidth="2" />
                            <path d="M15 150H5" stroke="currentColor" strokeWidth="2" />
                        </g>

                        {/* Middle Data Ring */}
                        <g ref={(el) => { ringsRef.current.middle = el }}>
                            <circle cx="150" cy="150" r="100" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="2 2" />
                            <path d="M150 50L150 70" stroke="white" strokeWidth="1" />
                            <text x="150" y="45" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" className="opacity-60">N</text>
                            <text x="255" y="153" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" className="opacity-60">E</text>
                            <text x="150" y="265" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" className="opacity-60">S</text>
                            <text x="45" y="153" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" className="opacity-60">W</text>
                        </g>

                        {/* Inner Precision Crosshair */}
                        <g ref={(el) => { ringsRef.current.inner = el }}>
                             <circle cx="150" cy="150" r="40" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" />
                             <path d="M150 110V190" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                             <path d="M110 150H190" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                             <rect x="148" y="148" width="4" height="4" fill="white" />
                        </g>
                        
                    </svg>
                </div>

            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-30"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}>
            </div>
        </section>
    );
}

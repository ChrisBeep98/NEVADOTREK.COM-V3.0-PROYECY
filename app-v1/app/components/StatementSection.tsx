"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatementSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const graphicRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        // Text Reveal
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

        // Compass Rotation
        if (graphicRef.current) {
            gsap.to(graphicRef.current, {
                rotation: 180,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2,
                }
            });
        }
    }, { scope: sectionRef });

    const manifesto = "Dejamos atrás el ruido del valle para encontrar la señal de la montaña. Construimos el umbral hacia lo salvaje, donde el aire escasea y la claridad mental se vuelve absoluta. Aquí, cada paso es una promesa de regreso transformado.";

    return (
        <section 
            ref={sectionRef} 
            className="relative h-auto section-v-spacing bg-slate-950 overflow-hidden flex items-center transform-gpu"
        >
            <div className="relative z-10 w-full px-frame flex justify-between items-center gap-12">
                
                <div ref={containerRef} className="w-full max-w-6xl">
                    <p className="block">
                        {manifesto.split(" ").map((word, i) => (
                            <span key={i} className="word text-statement leading-[1.3] inline-block mr-[0.3em] font-medium text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 will-change-transform will-change-opacity">
                                {word}
                            </span>
                        ))}
                    </p>
                </div>

                {/* Right Visual Detail - Rotating Compass Ring */}
                <div ref={graphicRef} className="hidden lg:flex items-center justify-center opacity-30 mix-blend-screen">
                    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-500">
                        {/* Outer Ring */}
                        <circle cx="120" cy="120" r="119" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
                        {/* Middle Ring */}
                        <circle cx="120" cy="120" r="80" stroke="white" strokeWidth="1" className="opacity-20" />
                        {/* Inner Cross */}
                        <path d="M120 40V200" stroke="currentColor" strokeWidth="1" className="opacity-50" />
                        <path d="M40 120H200" stroke="currentColor" strokeWidth="1" className="opacity-50" />
                        {/* North Marker */}
                        <path d="M120 20L125 35H115L120 20Z" fill="white" />
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

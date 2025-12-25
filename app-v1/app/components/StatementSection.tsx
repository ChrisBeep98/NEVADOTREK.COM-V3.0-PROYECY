"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatementSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const blocks = containerRef.current?.querySelectorAll('.text-block');
        
        if (blocks) {
            blocks.forEach((block) => {
                gsap.fromTo(block, 
                    { opacity: 0.1, y: 30, filter: "blur(10px)" },
                    { 
                        opacity: 1, y: 0, filter: "blur(0px)",
                        duration: 1.5,
                        scrollTrigger: {
                            trigger: block,
                            start: "top 85%",
                            end: "top 45%",
                            scrub: true,
                        }
                    }
                );
            });
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-24 px-6 flex flex-col items-center bg-[#020617] overflow-hidden">
            
            {/* Ambient Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-slate-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                </div>
            </div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col gap-24 md:gap-32">
                
                {/* 01. THE SILENCE */}
                <div className="text-block flex flex-col items-start">
                    <span className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] mb-4">PHILOSOPHY</span>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                        THE SILENCE
                    </h2>
                    <p className="text-slate-500 text-base md:text-lg font-light italic mt-4 max-w-sm leading-relaxed">
                        Where the wind stops being a sound and starts being a voice you can finally understand.
                    </p>
                </div>

                {/* 02. THE ASCENT */}
                <div className="text-block flex flex-col items-end text-right ml-auto">
                    <span className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] mb-4">CHALLENGE</span>
                    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                        THE ASCENT
                    </h2>
                    <p className="text-slate-500 text-base md:text-lg font-light italic mt-4 max-w-sm leading-relaxed">
                        A negotiation with gravity. Every breath is a victory, every step a promise to the peak.
                    </p>
                </div>

                {/* 03. THE LIMIT */}
                <div className="text-block flex flex-col items-center text-center mx-auto">
                    <span className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] mb-4">DESTINY</span>
                    <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tight leading-none">
                        THE BORDER
                    </h2>
                    <p className="text-slate-400 text-lg md:text-xl font-medium mt-8 max-w-lg leading-snug">
                        There is no glory in conquering peaks, only in the courage to return transformed.
                    </p>
                </div>

            </div>

        </section>
    );
}
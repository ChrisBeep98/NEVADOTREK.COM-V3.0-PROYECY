"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatementSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const counterBoxRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current || !counterBoxRef.current) return;

        const section = sectionRef.current;
        const counterBox = counterBoxRef.current;

        // 1. KINETIC TEXT REVEAL
        const words = containerRef.current?.querySelectorAll('.word');
        if (words) {
            gsap.fromTo(words, 
                { opacity: 0.05, filter: "blur(8px)", y: 10 },
                { 
                    opacity: 1, filter: "blur(0px)", y: 0,
                    stagger: 0.02,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        end: "bottom 40%",
                        scrub: true,
                    }
                }
            );
        }

        // 2. VERTICAL COUNTER MOVEMENT (Natural Scroll Sync)
        const sectionHeight = section.offsetHeight;
        const boxHeight = counterBox.offsetHeight;
        const travelDistance = sectionHeight - boxHeight - 80;

        gsap.fromTo(counterBox, 
            { y: 0 }, 
            { 
                y: travelDistance,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom", 
                    end: "bottom top",    
                    scrub: true,          
                }
            }
        );

        // 3. COUNTER VALUE (0 to 5364m)
        gsap.to({ val: 0 }, {
            val: 5364,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
            onUpdate: function() {
                if (counterRef.current) {
                    counterRef.current.innerText = Math.floor(this.targets()[0].val).toLocaleString();
                }
            }
        });

    }, { scope: sectionRef });

    const manifesto = "Dejamos atrás el ruido del valle para encontrar la señal de la montaña. En Nevado Trek, no diseñamos excursiones; construimos el umbral técnico hacia lo salvaje. Somos arquitectos de expediciones donde el aire escasea y la claridad mental se vuelve absoluta. Aquí, cada aliento es una decisión y cada paso es una promesa de regreso transformado.";

    return (
        <section 
            ref={sectionRef} 
            className="relative h-[880px] bg-slate-950 overflow-hidden border-none flex items-center"
        >
            
            {/* THE TRACK RAIL */}
            <div className="absolute right-frame top-0 bottom-0 w-[1px] bg-white/5 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent opacity-30"></div>
            </div>

            {/* COUNTER BOX - Optimized: Number above dot on mobile, dot aligned to the right */}
            <div 
                ref={counterBoxRef}
                className="absolute right-[var(--page-frame)] top-10 md:top-20 z-20 flex flex-col items-end will-change-transform"
            >
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-6">
                    <div className="flex flex-col items-end bg-slate-950/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 rounded-lg">
                        <div className="text-xl md:text-8xl font-mono text-white tabular-nums leading-none tracking-tighter flex items-baseline gap-1 md:gap-2">
                            <span ref={counterRef} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">0</span>
                            <span className="text-[10px] md:text-2xl text-cyan-500 uppercase">m</span>
                        </div>
                        
                        {/* Desktop Only Subtitle */}
                        <div className="hidden md:flex mt-4 items-center gap-3 opacity-40">
                            <span className="text-[8px] font-mono tracking-[0.4em] text-white uppercase whitespace-nowrap">Perspectiva_Altitud</span>
                            <div className="w-8 h-px bg-cyan-500/50"></div>
                        </div>
                    </div>
                    
                    {/* Visual Pointer/Indicator - Centered on the rail line */}
                    <div className="w-2 h-2 md:w-12 md:h-px bg-cyan-500 rounded-full md:rounded-none shadow-[0_0_10px_cyan] translate-x-1/2"></div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="relative z-10 w-full pl-frame pr-frame md:pr-[15vw] max-w-[1400px] flex flex-col justify-center">
                
                <div className="mb-6 md:mb-12 flex items-center gap-4 opacity-20">
                    <span className="text-[7px] md:text-[9px] font-mono tracking-[0.5em] text-cyan-500 uppercase">Mission_Briefing</span>
                    <div className="w-8 md:w-20 h-px bg-white"></div>
                </div>

                <div ref={containerRef} className="w-full">
                    <div className="block">
                        {manifesto.split(" ").map((word, i) => (
                            <span 
                                key={i} 
                                className="word text-statement leading-[1.3] inline-block will-change-[opacity,filter] mr-[0.3em]"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Perspective detail */}
                <div className="absolute left-frame bottom-[-180px] md:bottom-[-200px] flex items-center gap-4 md:gap-6 opacity-20">
                    <div className="w-px h-6 md:h-12 bg-gradient-to-b from-white to-transparent"></div>
                    <span className="text-[6px] md:text-[8px] font-mono tracking-[0.4em] rotate-90 origin-left translate-y-3">PNN_LOS_NEVADOS</span>
                </div>

            </div>

            <div className="absolute inset-0 opacity-[0.015] pointer-events-none select-none mix-blend-overlay"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

        </section>
    );
}
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

        // 1. KINETIC TEXT REVEAL (GPU OPTIMIZED)
        const words = containerRef.current?.querySelectorAll('.word');
        if (words) {
            gsap.fromTo(words, 
                { 
                    opacity: 0.05, 
                    filter: "blur(8px)", 
                    y: 15,
                    z: 0 
                },
                { 
                    opacity: 1, 
                    filter: "blur(0px)", 
                    y: 0,
                    stagger: 0.04,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        end: "bottom 15%",
                        scrub: 1,
                    }
                }
            );
        }

        // 2. VERTICAL MOVEMENT (TOP TO BOTTOM)
        // Calculamos el recorrido total restando la altura del propio contador
        const sectionHeight = sectionRef.current.offsetHeight;
        const boxHeight = counterBoxRef.current.offsetHeight;
        
        gsap.fromTo(counterBoxRef.current, 
            { y: 0 },
            { 
                y: sectionHeight - boxHeight, 
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.2, // Inercia mínima para suavidad extrema
                }
            }
        );

        // 3. COUNTER VALUE ANIMATION (0 to 5364m)
        gsap.to({ val: 0 }, {
            val: 5364,
            scrollTrigger: {
                trigger: sectionRef.current,
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
            className="relative h-[880px] bg-slate-950 overflow-hidden border-none"
        >
            
            {/* THE TRACK RAIL */}
            <div className="absolute right-frame top-0 bottom-0 w-[1px] bg-white/5 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent opacity-30"></div>
            </div>

            {/* COUNTER BOX - The traveler (Mobile: smaller text and offsets) */}
            <div 
                ref={counterBoxRef}
                className="absolute right-[calc(var(--page-frame)-12px)] md:right-[calc(var(--page-frame)-24px)] top-0 z-20 flex flex-col items-end py-10 will-change-transform"
            >
                <div className="flex items-center gap-3 md:gap-6">
                    <div className="flex flex-col items-end">
                        <div className="text-4xl md:text-8xl font-mono text-white tabular-nums leading-none tracking-tighter flex items-baseline gap-1 md:gap-2">
                            <span ref={counterRef} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">0</span>
                            <span className="text-lg md:text-2xl text-cyan-500/50">m</span>
                        </div>
                        <div className="mt-2 md:mt-4 flex items-center gap-2 md:gap-3 opacity-40">
                            <span className="text-[6px] md:text-[8px] font-mono tracking-[0.4em] text-white uppercase">Perspectiva_Altitud</span>
                            <div className="w-4 md:w-8 h-px bg-cyan-500/50"></div>
                        </div>
                    </div>
                    <div className="w-6 md:w-12 h-px bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
                </div>
            </div>

            {/* MAIN CONTENT - Standard Page Frame applied */}
            <div className="relative z-10 h-full w-full pl-frame pr-[25vw] md:pr-frame max-w-[1400px] flex flex-col justify-center">
                
                <div className="mb-8 md:mb-12 flex items-center gap-4 opacity-20">
                    <span className="text-[8px] md:text-[9px] font-mono tracking-[0.5em] text-cyan-500 uppercase">Mission_Briefing</span>
                    <div className="w-12 md:w-20 h-px bg-white"></div>
                </div>

                <div ref={containerRef} className="w-full">
                    <div className="flex flex-wrap gap-x-[0.3em] gap-y-2 md:gap-y-6">
                        {manifesto.split(" ").map((word, i) => (
                            <span 
                                key={i} 
                                className="word text-statement leading-[1.1] inline-block will-change-[opacity,filter,transform]"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Perspective detail */}
                <div className="absolute left-frame bottom-10 md:bottom-20 flex items-center gap-4 md:gap-6 opacity-20">
                    <div className="w-px h-8 md:h-12 bg-gradient-to-b from-white to-transparent"></div>
                    <span className="text-[7px] md:text-[8px] font-mono tracking-[0.4em] rotate-90 origin-left translate-y-3">PNN_LOS_NEVADOS</span>
                </div>

            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

        </section>
    );
}

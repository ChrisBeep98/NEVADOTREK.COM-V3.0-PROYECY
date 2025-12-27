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

        gsap.fromTo(counterBox, 
            { y: 0 }, 
            { 
                y: () => section.offsetHeight - counterBox.offsetHeight - 80,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom", 
                    end: "bottom top",    
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            }
        );

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

    const manifesto = "Dejamos atrás el ruido del valle para encontrar la señal de la montaña. Construimos el umbral técnico hacia lo salvaje, donde el aire escasea y la claridad mental se vuelve absoluta. Aquí, cada paso es una promesa de regreso transformado.";

    return (
        <section 
            ref={sectionRef} 
            className="relative min-h-[500px] md:h-[800px] bg-slate-950 overflow-hidden section-v-spacing flex items-center"
        >
            <div className="absolute right-frame top-0 bottom-0 w-[1px] bg-white/5 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent opacity-30"></div>
            </div>

            <div 
                ref={counterBoxRef}
                className="absolute right-[var(--page-frame)] top-20 z-20 flex flex-col items-end will-change-transform"
            >
                <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-6">
                    <div className="flex flex-col items-end bg-slate-950/80 md:bg-transparent backdrop-blur-sm p-2 rounded-lg">
                        <div className="text-xl md:text-8xl font-mono text-white tabular-nums leading-none tracking-tighter flex items-baseline gap-1 md:gap-2">
                            <span ref={counterRef} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">0</span>
                            <span className="text-[10px] md:text-2xl text-cyan-500 uppercase">m</span>
                        </div>
                        <div className="hidden md:flex mt-4 items-center gap-3 opacity-40">
                            <span className="text-[8px] font-mono tracking-[0.4em] text-white uppercase whitespace-nowrap">Perspectiva_Altitud</span>
                            <div className="w-8 h-px bg-cyan-500/50"></div>
                        </div>
                    </div>
                    <div className="w-2 h-2 md:w-12 md:h-px bg-cyan-500 rounded-full md:rounded-none shadow-[0_0_10px_cyan] translate-x-1/2"></div>
                </div>
            </div>

            <div className="relative z-10 w-full pl-frame pr-[20vw] md:pr-frame max-w-[1400px]">
                <div className="mb-6 md:mb-12 flex items-center gap-4 opacity-20">
                    <span className="text-tech-caption text-cyan-500">Mission_Briefing</span>
                    <div className="w-8 md:w-20 h-px bg-white"></div>
                </div>

                <div ref={containerRef} className="w-full">
                    <div className="block">
                        {manifesto.split(" ").map((word, i) => (
                            <span key={i} className="word text-statement leading-[1.3] inline-block will-change-[opacity,filter] mr-[0.3em]">
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
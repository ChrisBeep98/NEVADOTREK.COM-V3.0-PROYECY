"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatementSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

        // 1. TEXT REVEAL - Ultra Optimized (No filters, only GPU-friendly props)
        const words = containerRef.current?.querySelectorAll('.word');
        if (words) {
            gsap.fromTo(words, 
                { opacity: 0.1 },
                { 
                    opacity: 1,
                    stagger: 0.01,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 90%",
                        end: "bottom 60%",
                        scrub: 0.5,
                    }
                }
            );
        }

    }, { scope: sectionRef });

    const manifesto = "Dejamos atrás el ruido del valle para encontrar la señal de la montaña. Construimos el umbral técnico hacia lo salvaje, donde el aire escasea y la claridad mental se vuelve absoluta. Aquí, cada paso es una promesa de regreso transformado.";

    return (
        <section 
            ref={sectionRef} 
            className="relative h-auto section-v-spacing bg-slate-950 overflow-hidden flex items-center transform-gpu"
        >
            <div className="relative z-10 w-full px-frame max-w-[1400px] mx-auto">
                <div className="mb-8 md:mb-16 flex items-center gap-4 opacity-30">
                    <span className="text-tech-caption text-cyan-500 font-bold tracking-[0.3em]">MISSION_STATEMENT</span>
                    <div className="w-12 md:w-24 h-px bg-white/20"></div>
                </div>

                <div ref={containerRef} className="w-full">
                    <div className="block">
                        {manifesto.split(" ").map((word, i) => (
                            <span key={i} className="word text-statement leading-[1.2] inline-block mr-[0.3em] font-medium text-white/10 will-change-opacity">
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

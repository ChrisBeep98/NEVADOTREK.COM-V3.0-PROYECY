"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Cloud, Map, Compass } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatementSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!sectionRef.current) return;

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

    const manifesto = "Dejamos atrás el ruido del valle para encontrar la señal de la montaña. Construimos el umbral hacia lo salvaje, donde el aire escasea y la claridad mental se vuelve absoluta. Aquí, cada paso es una promesa de regreso transformado.";

    return (
        <section 
            ref={sectionRef} 
            className="relative h-auto section-v-spacing bg-slate-950 overflow-hidden flex items-center transform-gpu"
        >
            <div className="relative z-10 w-full px-frame max-w-[1400px] mx-auto">
                
                {/* Journal Header - Auténtico Montañismo */}
                <div className="mb-12 md:mb-20 flex items-center gap-6 opacity-30">
                    <div className="flex items-center gap-3">
                        <Map className="w-4 h-4 text-cyan-500" />
                        <span className="text-[10px] font-mono tracking-[0.4em] text-white uppercase font-bold">Ruta // El Tolima</span>
                    </div>
                    <div className="h-px w-12 bg-white/20"></div>
                    <div className="flex items-center gap-3">
                        <Cloud className="w-4 h-4 text-white/40" />
                        <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">Clima: Despejado</span>
                    </div>
                </div>

                <div ref={containerRef} className="w-full">
                    <p className="block">
                        {manifesto.split(" ").map((word, i) => (
                            <span key={i} className="word text-statement leading-[1.3] inline-block mr-[0.3em] font-medium text-white/10 will-change-opacity">
                                {word}
                            </span>
                        ))}
                    </p>
                </div>

                {/* Journal Footer - Detalles de Guianza */}
                <div className="mt-20 md:mt-32 flex flex-wrap gap-12 opacity-20">
                    <div className="flex flex-col gap-2">
                        <span className="text-[8px] font-mono tracking-[0.5em] text-white uppercase">Hito de Altitud</span>
                        <span className="text-xl font-bold text-white tracking-tighter">1.900m <span className="text-cyan-500 text-xs">▲</span></span>
                    </div>
                    <div className="flex flex-col gap-2 border-l border-white/10 pl-12">
                        <span className="text-[8px] font-mono tracking-[0.5em] text-white uppercase">Guía de Cabeza</span>
                        <span className="text-sm font-bold text-white tracking-widest uppercase">Salento Heritage</span>
                    </div>
                    <div className="flex flex-col gap-2 border-l border-white/10 pl-12">
                        <span className="text-[8px] font-mono tracking-[0.5em] text-white uppercase">Orientación</span>
                        <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-cyan-500 animate-spin-slow" />
                            <span className="text-xs font-mono text-white/60">NORTE_SÉCURO</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-30"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}>
            </div>
        </section>
    );
}

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

        const words = containerRef.current?.querySelectorAll('.word');
        if (words) {
            gsap.fromTo(words, 
                { opacity: 0.1, color: "rgba(255, 255, 255, 0.1)" },
                { 
                    opacity: 1,
                    color: "rgba(255, 255, 255, 1)",
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
                
                <div ref={containerRef} className="w-full">
                    <p className="block">
                        {manifesto.split(" ").map((word, i) => (
                            <span key={i} className="word text-statement leading-[1.3] inline-block mr-[0.3em] font-medium text-white/10 will-change-opacity">
                                {word}
                            </span>
                        ))}
                    </p>
                </div>

            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-30"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}>
            </div>
        </section>
    );
}

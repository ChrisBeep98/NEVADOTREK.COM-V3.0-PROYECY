"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function IntroSection() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const text = textRef.current;
        if (!text) return;

        const pills = text.querySelectorAll('.img-pill');
        const innerImgs = text.querySelectorAll('.img-pill img');
        const content = text.querySelectorAll('span.text-content');

        // 1. ANIMACIÓN DE ENTRADA (Texto + Pills)
        const entryTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });

        entryTl.fromTo(content, 
            { autoAlpha: 0, y: 15, filter: "blur(5px)" },
            { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.1, ease: "power2.out" }
        );

        // Punto de inicio con delay un toque más marcado (0.4s)
        const PILLS_START = 0.4;

        pills.forEach((pill, i) => {
            const img = innerImgs[i];
            // Ligera secuencialidad (0.1s entre cada una)
            const startTime = PILLS_START + (i * 0.1);
            
            entryTl.fromTo(pill, 
                { clipPath: "inset(0% 50% 0% 50% rounded 999px)", opacity: 0, scale: 0.9 },
                { 
                    clipPath: "inset(0% 0% 0% 0% rounded 999px)", 
                    opacity: 1, 
                    scale: 1,
                    duration: 1.2, 
                    ease: "expo.out" 
                }, 
                startTime
            );

            entryTl.fromTo(img,
                { scale: 1.4 },
                { scale: 1, duration: 1.5, ease: "power2.out" },
                startTime
            );
        });

        // 2. SEPARADOR (Scroll-driven)
        gsap.fromTo(glowRef.current,
            { y: "-100%" },
            { 
                y: "100%", 
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );

    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="w-full mt-[64px] md:mt-[72px] py-16 md:py-24 px-frame bg-background flex items-center relative overflow-hidden"
        >
            <div className="max-w-[1600px] mx-auto w-full grid grid-cols-12 gap-2 md:gap-4">
                
                {/* Separador Minimalista Alineado */}
                <div className="col-span-1 md:col-span-1 hidden md:flex justify-end items-start pr-4 md:pr-6 relative pt-4">
                    <div className="relative h-48 w-[1px] bg-white/5 overflow-hidden">
                        <div 
                            ref={glowRef}
                            className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent"
                        ></div>
                    </div>
                </div>

                {/* Bloque de Texto */}
                <div className="col-span-12 md:col-span-11 relative z-10">
                    <h2 
                        ref={textRef} 
                        className="text-h-section-title text-foreground text-left"
                    >
                        <span className="text-content relative inline">{t.intro?.part1}</span>
                        
                        {/* Pill 1: Volcán */}
                        <span className="img-pill inline-flex items-center justify-center align-middle mx-3 h-[0.7em] w-[1.8em] md:w-[2.2em] relative top-[-0.05em] bg-surface rounded-full will-change-transform transform-gpu overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1611605645802-c21be743c321?q=80&w=400&auto=format&fit=crop" 
                                alt="Active Volcano" 
                                className="w-full h-full object-cover opacity-80 will-change-transform" 
                            />
                        </span>

                        <span className="text-content relative inline">{t.intro?.part2}</span>

                        {/* Pill 2: Hielo */}
                        <span className="img-pill inline-flex items-center justify-center align-middle mx-3 h-[0.7em] w-[1.8em] md:w-[2.2em] relative top-[-0.05em] bg-surface rounded-full will-change-transform transform-gpu overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=400&auto=format&fit=crop" 
                                alt="Glacial Ice" 
                                className="w-full h-full object-cover opacity-90 brightness-110 will-change-transform" 
                            />
                        </span>

                        <span className="text-content relative inline">{t.intro?.part3}</span>

                        {/* Pill 3: Cumbre */}
                        <span className="img-pill inline-flex items-center justify-center align-middle mx-3 h-[0.7em] w-[1.8em] md:w-[2.2em] relative top-[-0.05em] bg-surface rounded-full will-change-transform transform-gpu overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop" 
                                alt="Mountain Peak" 
                                className="w-full h-full object-cover opacity-80 will-change-transform" 
                            />
                        </span>

                        <span className="text-content relative inline text-muted">{t.intro?.part4}</span>
                    </h2>
                </div>
            </div>
        </section>
    );
}

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

    useGSAP(() => {
        const text = textRef.current;
        if (!text) return;

        const pills = text.querySelectorAll('.img-pill');
        // Seleccionamos el texto completo para animarlo como bloque, o spans si queremos detalle
        const content = text.querySelectorAll('span.text-content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                end: "top 20%",
                toggleActions: "play none none reverse"
            }
        });

        // 1. Animación suave del texto (Opacity + Blur)
        tl.fromTo(content, 
            { autoAlpha: 0, filter: "blur(10px)", y: 20 },
            { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.5, stagger: 0.2, ease: "power2.out" }
        );

        // 2. Las Pills se expanden desde el centro (Scale X)
        // Usamos scaleX en lugar de width para no afectar el flujo del texto (reflow)
        tl.fromTo(pills, 
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.1 },
            "<0.3"
        );

        // 3. Línea lateral
        tl.fromTo(".deco-border", 
            { scaleY: 0 },
            { scaleY: 1, duration: 1.5, ease: "power2.inOut" },
            0
        );

    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="w-full py-32 md:py-48 px-frame bg-background flex items-center relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8">
                
                {/* Línea Decorativa Izquierda */}
                <div className="col-span-1 md:col-span-1 hidden md:flex justify-end pr-8">
                    <div className="deco-border w-[1px] h-full bg-gradient-to-b from-white/0 via-white/20 to-white/0 origin-top h-64"></div>
                </div>

                {/* Bloque de Texto */}
                <div className="col-span-12 md:col-span-10 relative z-10">
                    <h2 
                        ref={textRef} 
                        className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight leading-[1.15] text-slate-200 text-left"
                    >
                        {/* Bloque 1 */}
                        <span className="text-content relative inline">{t.intro?.part1}</span>
                        
                        {/* Pill 1: Volcán */}
                        <span className="img-pill inline-flex items-center justify-center align-middle mx-3 h-[0.7em] w-[1.8em] md:w-[2.2em] rounded-full overflow-hidden relative top-[-0.05em] bg-stone-800">
                            <img 
                                src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=400&auto=format&fit=crop" 
                                alt="Volcano"
                                className="w-full h-full object-cover opacity-80"
                            />
                        </span>

                        {/* Bloque 2 */}
                        <span className="text-content relative inline">{t.intro?.part2}</span>

                        {/* Pill 2: Hielo */}
                        <span className="img-pill inline-flex items-center justify-center align-middle mx-3 h-[0.7em] w-[1.8em] md:w-[2.2em] rounded-full overflow-hidden relative top-[-0.05em] bg-slate-800">
                            <img 
                                src="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=400&auto=format&fit=crop" 
                                alt="Glacial Ice"
                                className="w-full h-full object-cover opacity-90 brightness-110"
                            />
                        </span>

                        {/* Bloque 3 */}
                        {/* Forzamos un break sutil para la parte final si es necesario, o dejamos fluir */}
                        <span className="text-content relative inline text-slate-400">{t.intro?.part3}</span>
                    </h2>
                </div>
            </div>
        </section>
    );
}

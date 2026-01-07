'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sprout, Tent, Wind } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TextMarquee() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<HTMLDivElement>(null);
    const line2Ref = useRef<HTMLDivElement>(null);
    const line3Ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5, // Suavizado aumentado para mayor peso "cinemático"
            }
        });

        // OPTIMIZACIÓN: Uso de .fromTo para control absoluto de coordenadas GPU
        // Delta de movimiento unificado (aprox 15-20%) para velocidad constante sin jitter.
        
        // Línea 1: Se mueve hacia la IZQUIERDA
        tl.fromTo(line1Ref.current, 
            { xPercent: 0 }, 
            { xPercent: -15, ease: "none", force3D: true }, 
            0
        );

        // Línea 2: Se mueve hacia la DERECHA (Opuesta)
        // Empieza desplazada (-20%) y va hacia el origen (-5%). Delta: 15%.
        tl.fromTo(line2Ref.current, 
            { xPercent: -20 }, 
            { xPercent: -5, ease: "none", force3D: true }, 
            0
        );

        // Línea 3: Se mueve hacia la IZQUIERDA
        tl.fromTo(line3Ref.current, 
            { xPercent: 0 }, 
            { xPercent: -15, ease: "none", force3D: true }, 
            0
        );

    }, { scope: containerRef });

    const textStyle = "text-h-tour-title uppercase whitespace-nowrap select-none will-change-transform flex items-center";

    const renderLine = (text: string = "", Icon: React.ElementType, iconColor: string) => {
        if (!text) return null;
        const parts = text.split(/\s*\/\/\s*/).filter(Boolean);
        return parts.map((part, i) => (
            <div key={i} className="flex items-center">
                <span className="flex-none">{part}</span>
                <Icon className={`w-[0.8em] h-[0.8em] ${iconColor} mx-8 shrink-0 -translate-y-[0.05em] md:mt-[6px]`} strokeWidth={1.5} />
            </div>
        ));
    };

    return (
        <section 
            ref={containerRef} 
            className="bg-background min-h-[800px] overflow-hidden flex flex-col justify-center gap-12"
        >
            <div ref={line1Ref} className={`${textStyle} text-blue-400/35`}>
                {renderLine(t.marquee.line1, Sprout, "text-cyan-500/50 dark:text-cyan-500/70")}
            </div>
            
            <div ref={line2Ref} className={`${textStyle} text-blue-400/35`}>
                {renderLine(t.marquee.line2, Tent, "text-cyan-500/50 dark:text-cyan-500/70")}
            </div>

            <div ref={line3Ref} className={`${textStyle} text-blue-400/35`}>
                {renderLine(t.marquee.line3, Wind, "text-cyan-500/50 dark:text-cyan-500/70")}
            </div>
        </section>
    );
}

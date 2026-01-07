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

        const mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            const { isDesktop, isMobile } = context.conditions || {};
            const movement = isMobile ? -50 : -15;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1.5,
                }
            });

            tl.fromTo(line1Ref.current,
                { xPercent: 0 },
                { xPercent: movement, ease: "none", force3D: true },
                0
            );

            tl.fromTo(line2Ref.current,
                { xPercent: movement * 1.3 },
                { xPercent: movement * 0.3, ease: "none", force3D: true },
                0
            );

            tl.fromTo(line3Ref.current,
                { xPercent: 0 },
                { xPercent: movement, ease: "none", force3D: true },
                0
            );
        });

        return () => mm.revert();
    }, { scope: containerRef });

    const textStyle = "text-4xl md:text-h-tour-title uppercase whitespace-nowrap select-none will-change-transform flex items-center";

    const renderLine = (text: string = "", Icon: React.ElementType, iconColor: string) => {
        if (!text) return null;
        const parts = text.split(/\s*\/\/\s*/).filter(Boolean);
        return parts.map((part, i) => (
            <div key={i} className="flex items-center">
                <span className="flex-none">{part}</span>
                <Icon className={`w-[0.8em] h-[0.8em] ${iconColor} mx-4 md:mx-8 shrink-0 -translate-y-[0.05em] md:mt-[6px]`} strokeWidth={1.5} />
            </div>
        ));
    };

    return (
        <section 
            ref={containerRef} 
            className="bg-background min-h-[580px] md:min-h-[800px] overflow-hidden flex flex-col justify-center gap-6"
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

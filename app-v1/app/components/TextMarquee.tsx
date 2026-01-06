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
                scrub: 1,
            }
        });

        tl.to(line1Ref.current, { xPercent: -15, ease: "none", force3D: true }, 0);
        tl.to(line2Ref.current, { xPercent: 15, ease: "none", force3D: true }, 0);
        tl.to(line3Ref.current, { xPercent: -15, ease: "none", force3D: true }, 0);

    }, { scope: containerRef });

    const textStyle = "text-[8vw] md:text-[6vw] font-bold uppercase tracking-tighter whitespace-nowrap leading-none select-none will-change-transform flex items-center";

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
            className="bg-background py-24 overflow-hidden flex flex-col justify-center gap-8"
        >
            <div ref={line1Ref} className={`${textStyle} text-foreground/10`}>
                {renderLine(t.marquee.line1, Sprout, "text-blue-500")}
            </div>
            
            <div ref={line2Ref} className={`${textStyle} text-blue-500/80 -translate-x-1/4`}>
                {renderLine(t.marquee.line2, Tent, "text-foreground")}
            </div>

            <div ref={line3Ref} className={`${textStyle} text-foreground/10`}>
                {renderLine(t.marquee.line3, Wind, "text-blue-500")}
            </div>
        </section>
    );
}

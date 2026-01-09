"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Footer from './Footer';
import FooterWidget from './FooterWidget';

gsap.registerPlugin(ScrollTrigger);

export default function FooterWithWidget() {
    const containerRef = useRef<HTMLDivElement>(null);
    const horizontalRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!horizontalRef.current || !containerRef.current) return;

        // Only enable horizontal scroll on desktop (>= 768px)
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const widgetWidthPercent = 0.4;
        const scrollDistance = window.innerWidth * widgetWidthPercent;

        gsap.to(horizontalRef.current, {
            x: `-${widgetWidthPercent * 100}vw`,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                end: () => "+=" + scrollDistance,
            }
        });
    }, { scope: containerRef, dependencies: [] });

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            <div ref={horizontalRef} className="flex w-fit">
                <Footer />
                <FooterWidget className="hidden md:block" />
            </div>
        </div>
    );
}

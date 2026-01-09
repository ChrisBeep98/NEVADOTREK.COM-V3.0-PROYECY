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

        // Calculate widget width based on viewport
        const isMobile = window.innerWidth < 768; // md breakpoint
        const widgetWidthPercent = isMobile ? 0.94 : 0.4; // 94vw mobile, 40vw desktop
        const scrollDistance = window.innerWidth * widgetWidthPercent;

        // Horizontal scroll: Footer slides left by widget width to reveal Widget
        gsap.to(horizontalRef.current, {
            x: `-${widgetWidthPercent * 100}vw`,  // Move left by widget width
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                end: () => "+=" + scrollDistance, // Scroll distance = widget width
            }
        });
    }, { scope: containerRef, dependencies: [] });

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            <div ref={horizontalRef} className="flex w-fit">
                <Footer />
                <FooterWidget />
            </div>
        </div>
    );
}

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

        // Horizontal scroll: Footer (100vw) slides left by 40vw to reveal Widget (40vw)
        gsap.to(horizontalRef.current, {
            x: '-40vw',  // Move left by exactly the widget width
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                end: () => "+=" + (window.innerWidth * 0.4), // Scroll distance = widget width
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

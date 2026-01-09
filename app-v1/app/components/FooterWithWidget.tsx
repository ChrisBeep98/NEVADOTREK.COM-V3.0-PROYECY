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

        // Horizontal scroll controlled by vertical scroll
        const sections = gsap.utils.toArray<HTMLElement>('.horizontal-section');
        
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                end: () => "+=" + horizontalRef.current!.offsetWidth,
            }
        });
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            <div ref={horizontalRef} className="flex w-fit">
                <div className="horizontal-section">
                    <Footer />
                </div>
                <div className="horizontal-section">
                    <FooterWidget />
                </div>
            </div>
        </div>
    );
}

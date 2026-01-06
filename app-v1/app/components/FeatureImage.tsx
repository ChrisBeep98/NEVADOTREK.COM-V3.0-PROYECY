"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function FeatureImage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        // Desktop & Tablet Animation: Expands from margin to full width
        mm.add("(min-width: 768px)", () => {
            gsap.fromTo(imageWrapperRef.current, 
                { 
                    width: "80%", 
                    y: 50,
                    borderRadius: "0px"
                },
                {
                    width: "100%",
                    y: 0,
                    borderRadius: "0px",
                    ease: "none", // Scrub controls the easing
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "center center",
                        scrub: 1
                    }
                }
            );
        });

        // Mobile Animation: Simpler scale up
        mm.add("(max-width: 767px)", () => {
             gsap.fromTo(imageWrapperRef.current, 
                { 
                    scale: 0.85,
                    borderRadius: "0px"
                },
                {
                    scale: 1,
                    borderRadius: "0px",
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 90%",
                        end: "center center",
                        scrub: 1
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full h-[80vh] md:h-[85vh] overflow-hidden flex items-center justify-center bg-background relative z-20">
            <div 
                ref={imageWrapperRef} 
                className="relative w-full h-full overflow-hidden will-change-transform shadow-2xl"
            >
                {/* Fallback image using Unsplash since we don't have local assets guaranteed yet. 
                    In production, replace with local asset. */}
                <Image
                    src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=2600&auto=format&fit=crop"
                    alt="Nevado Landscape Exploration"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                
                {/* Gradient Overlay for seamless transition if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
        </section>
    );
}

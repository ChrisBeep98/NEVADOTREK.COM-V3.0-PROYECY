"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function StatementSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);

    const sentence = "The mountain doesn't ask for your strength. It demands your presence. In the absolute silence of the ascent, we leave behind who we were, to finally discover who we are meant to be.";
    const words = sentence.split(" ");

    useGSAP(() => {
        const wordsElements = containerRef.current?.querySelectorAll('.word');
        
        if (wordsElements && wordsElements.length > 0) {
            gsap.fromTo(wordsElements, 
                { 
                    opacity: 0.1, 
                    color: "rgba(100, 116, 139, 0.5)", // Slate 500 faded
                    filter: "blur(2px)"
                }, 
                {
                    opacity: 1,
                    color: "#ffffff",
                    filter: "blur(0px)",
                    stagger: 0.1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                        end: "bottom 45%",
                        scrub: 1,
                    }
                }
            );
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-48 px-6 flex justify-center items-center min-h-screen overflow-hidden bg-[#020617]">
            
            {/* --- STUDIO LIGHTING BACKGROUND (MESH) --- */}
            
            {/* Ambient Background Noise Overlay */}
            <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none mix-blend-overlay"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Mesh 1: Top Left Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
            
            {/* Mesh 2: Center Bottom Accent */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] bg-blue-950/40 rounded-[100%] blur-[100px] mix-blend-multiply opacity-80"></div>

            {/* Mesh 3: Right Side Warmth */}
            <div className="absolute top-[20%] right-[-15%] w-[50vw] h-[50vw] bg-slate-800/20 rounded-full blur-[150px] mix-blend-overlay opacity-40"></div>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto text-center relative z-20">
                <p ref={textRef} className="text-3xl md:text-5xl lg:text-7xl font-medium leading-tight md:leading-[1.15] tracking-tight text-white/10 selection:bg-cyan-500/30">
                    {words.map((word, i) => (
                        <span key={i} className="word inline-block mr-[0.25em] will-change-[opacity,color,filter]">
                            {word}
                        </span>
                    ))}
                </p>
            </div>

            {/* Decorative Edge Glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

        </section>
    );
}

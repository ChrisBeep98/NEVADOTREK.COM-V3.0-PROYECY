"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from './Header';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroMonolith() {
    const { t } = useLanguage();
    
    // Refs for animation targets
    const wrapperRef = useRef<HTMLDivElement>(null);
    const monolithRef = useRef<HTMLDivElement>(null);
    const textFrontRef = useRef<HTMLHeadingElement>(null);
    const compassRef = useRef<HTMLDivElement>(null);
    const gaugeDotRef = useRef<HTMLDivElement>(null);
    const pitchValRef = useRef<HTMLSpanElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); 
    const wordWrapperRef = useRef<HTMLSpanElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null); // New ref for status text

    // State for Word Cycle only (simpler to keep in React for the .map rendering)
    const [wordIndex, setWordIndex] = useState(0);
    const words = t.hero.words;
    
    // 1. OPTIMIZED WORD CYCLE
    useEffect(() => {
        const interval = setInterval(() => {
            if (!wordWrapperRef.current) return;
            
            const ctx = gsap.context(() => {
                gsap.to(".letter", {
                    y: -20,
                    opacity: 0,
                    filter: "blur(8px)",
                    stagger: 0.03,
                    duration: 0.5,
                    ease: "power3.in",
                    onComplete: () => {
                        setWordIndex((prev) => (prev + 1) % words.length);
                    }
                });
            }, wordWrapperRef);

            return () => ctx.revert();
        }, 4000);
        return () => clearInterval(interval);
    }, [words.length]);

    useGSAP(() => {
        if (!wordWrapperRef.current) return;
        
        gsap.fromTo(".letter", 
            { 
                y: 30, 
                opacity: 0, 
                filter: "blur(12px)",
                willChange: "transform, opacity, filter" // Hint browser
            },
            { 
                y: 0, 
                opacity: 1, 
                filter: "blur(0px)",
                stagger: 0.05, 
                duration: 1.2, 
                ease: "expo.out" 
            }
        );
    }, { dependencies: [wordIndex, words], scope: wordWrapperRef });

    // 2. OPTIMIZED STATUS TICKER (No React Renders)
    useEffect(() => {
        const statusMessages = [
            `${t.hero.status.alt}: 4500M`, 
            `${t.hero.status.temp}: -15C`, 
            `${t.hero.status.wind}: 40KT`, 
            `${t.hero.status.o2}: 88%`
        ];
        
        // Initial set
        if (statusRef.current) statusRef.current.innerText = statusMessages[0];
        
        let statusIdx = 0;
        const interval = setInterval(() => {
            statusIdx = (statusIdx + 1) % statusMessages.length;
            if (statusRef.current) {
                // Direct DOM manipulation avoids re-rendering the whole component
                statusRef.current.innerText = statusMessages[statusIdx];
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [t.hero.status]);

    useGSAP(() => {
        const wrapper = wrapperRef.current;
        const monolith = monolithRef.current;
        const textFront = textFrontRef.current;
        const compass = compassRef.current;
        const gaugeDot = gaugeDotRef.current;
        const pitchVal = pitchValRef.current;
        const video = videoRef.current;

        if (!wrapper || !monolith || !textFront || !compass) return;

        // --- MOUSE INTERACTION (Optimized) ---
        // quickTo is highly performant
        const rotateX = gsap.quickTo(wrapper, "rotationX", {duration: 0.8, ease: "power2.out"});
        const rotateY = gsap.quickTo(wrapper, "rotationY", {duration: 0.8, ease: "power2.out"});
        const frontX = gsap.quickTo(textFront, "x", {duration: 1, ease: "power2.out"});
        const compX = gsap.quickTo(compass, "x", {duration: 0.2, ease: "power2.out"});
        const compY = gsap.quickTo(compass, "y", {duration: 0.2, ease: "power2.out"});

        const handleMouseMove = (e: MouseEvent) => {
            // Using requestAnimationFrame implicitly via gsap.ticker isn't needed with quickTo 
            // as quickTo handles interpolation, but we can ensure lightweight math here.
            const { clientX, clientY } = e;
            const width = window.innerWidth;
            const height = window.innerHeight;

            compX(clientX + 20);
            compY(clientY + 20);
            
            // Only animate opacity if needed (check computed style matches?) 
            // simpler: just set it.
            if (compass.style.opacity !== '1') gsap.to(compass, {opacity: 1, duration: 0.3});

            const xNorm = (clientX / width - 0.5) * 2;
            const yNorm = (clientY / height - 0.5) * 2;

            rotateY(xNorm * 15);
            rotateX(-yNorm * 15);
            frontX(xNorm * -80);

            if (pitchVal && gaugeDot) {
                const pitch = Math.round(yNorm * 15);
                pitchVal.innerText = `${pitch}°`;
                gsap.to(gaugeDot, {
                    x: xNorm * 10,
                    y: yNorm * 10,
                    duration: 0.1,
                    overwrite: true // Prevent conflict
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });


        // --- SCROLL ANIMATION (Optimized) ---
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top top",
                end: "+=100%",
                pin: true,
                scrub: 0.5, // Reduced scrub lag for snappier feel
                fastScrollEnd: true,
                preventOverlaps: true
            }
        });

        // Use will-change hint on the monolith before animation starts
        gsap.set(monolith, { willChange: "width, height, border-radius" });

        tl.to(monolith, {
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
            ease: "power2.inOut",
            duration: 1
        }, 0);

        tl.to([textFront, compass, ".monolith-ui", "#dynamic-message"], {
            opacity: 0,
            scale: 1.1,
            ease: "power2.out",
            duration: 0.5
        }, 0);

        tl.to(video, {
            scale: 1,
            ease: "power2.inOut",
            duration: 1
        }, 0);

        tl.to(wrapper, {
            rotationX: 0,
            rotationY: 0,
            ease: "power2.inOut",
            duration: 1
        }, 0);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            gsap.set(monolith, { willChange: "auto" }); // Cleanup
        };

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="dark relative bg-[#040918] text-slate-300 antialiased overflow-x-hidden">
             
             {/* Navigation */}
            <Header />

            {/* HERO SECTION */}
            <header ref={heroSectionRef} id="hero-section" className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#040918]">
                
                {/* Background Video (Blurred) */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                     <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-[1.1] blur-xl opacity-40 will-change-transform">
                        <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* Mouse Tracking Compass */}
                <div ref={compassRef} id="mouse-compass" className="fixed top-0 left-0 z-50 pointer-events-none opacity-0 hidden md:block mix-blend-difference will-change-transform">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1px] bg-white/50"></div>
                        <div className="relative w-10 h-10 border border-white/50 rounded-full flex items-center justify-center">
                            <div ref={gaugeDotRef} className="w-1 h-1 bg-white rounded-full will-change-transform"></div>
                        </div>
                        <div className="flex flex-col text-[8px] font-mono text-white leading-tight">
                            <span className="opacity-50">{t.hero.ui.pitch}</span>
                            <span ref={pitchValRef}>0°</span>
                        </div>
                    </div>
                </div>

                {/* 3D SCENE */}
                <div className="relative z-20 w-full h-full flex items-center justify-center perspective-container" style={{perspective: '1200px'}}>
                    
                    <div ref={wrapperRef} id="monolith-wrapper" className="relative flex items-center justify-center transform-style-3d will-change-transform" style={{transformStyle: 'preserve-3d'}}>
                        
                        {/* MONOLITH */}
                        <div ref={monolithRef} id="monolith" className="relative w-[30vw] h-[60vh] md:w-[28vw] md:h-[65vh] bg-slate-900 rounded-sm overflow-hidden shadow-2xl z-10 transform-gpu"
                             style={{transform: 'translateZ(0px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'}}>
                            
                            <div className="absolute inset-0">
                                <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover scale-150 will-change-transform">
                                    <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                                </video>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 mix-blend-overlay"></div>

                            {/* UI Elements inside Monolith */}
                            <div className="monolith-ui absolute top-6 right-6 flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-mono text-white tracking-widest uppercase">{t.hero.ui.live_feed}</span>
                                </div>
                                {/* Direct DOM manipulation target */}
                                <span ref={statusRef} className="text-[9px] font-mono text-white/60 tracking-wider mt-1"></span>
                            </div>

                            <div className="monolith-ui absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                            <div className="monolith-ui absolute bottom-8 left-8 h-8 w-[1px] bg-white/20"></div>
                            <span className="monolith-ui absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest">EXP. 2025</span>
                        </div>

                        {/* TREK TEXT */}
                        <h1 ref={textFrontRef} id="text-front" className="text-display-xl absolute top-[58%] left-[52%] text-white select-none pointer-events-none mix-blend-overlay z-20 will-change-transform"
                            style={{transform: 'translateZ(100px)'}}>
                            TREK
                        </h1>

                    </div>
                </div>

                {/* DYNAMIC MESSAGE (Middle Left) */}
                <div id="dynamic-message" className="absolute top-[45%] left-8 md:left-24 z-30 max-w-[320px] pointer-events-none mix-blend-difference overflow-hidden py-2 will-change-transform">
                    <p className="text-sm md:text-base font-light italic leading-relaxed text-white/80">
                        {t.hero.message.prefix} 
                        <span ref={wordWrapperRef} className="inline-flex font-bold text-cyan-300 ml-2 tracking-wider overflow-hidden">
                            {words[wordIndex].split("").map((char, i) => (
                                <span key={`${wordIndex}-${i}`} className="letter inline-block">
                                    {char}
                                </span>
                            ))}
                        </span>
                    </p>
                </div>

                {/* Scroll Indicator */}
                 <div className="monolith-ui absolute bottom-12 left-8 md:left-12 flex items-center gap-4 opacity-60 mix-blend-difference z-30 hidden md:flex">
                    <div className="w-[1px] h-12 bg-white/50 origin-bottom animate-[scale-y_2s_ease-in-out_infinite]"></div>
                    <span className="text-[9px] tracking-[0.3em] font-mono text-white -rotate-90 origin-left translate-y-3">{t.hero.ui.scroll}</span>
                </div>

            </header>
        </div>
    );
}
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
    const cursorRef = useRef<HTMLDivElement>(null); 
    const cursorGeoRef = useRef<HTMLDivElement>(null); // The shape itself
    const pitchValRef = useRef<HTMLSpanElement>(null); // Unused but kept for structure if needed
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); 
    const wordWrapperRef = useRef<HTMLSpanElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null); 
    const scrollRingRef = useRef<HTMLDivElement>(null);

    // State for Word Cycle
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
                willChange: "transform, opacity, filter"
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

    // 2. OPTIMIZED STATUS TICKER
    useEffect(() => {
        const statusMessages = [
            `${t.hero.status.alt}: 4500M`, 
            `${t.hero.status.temp}: -15C`, 
            `${t.hero.status.wind}: 40KT`, 
            `${t.hero.status.o2}: 88%`
        ];
        
        if (statusRef.current) statusRef.current.innerText = statusMessages[0];
        
        let statusIdx = 0;
        const interval = setInterval(() => {
            statusIdx = (statusIdx + 1) % statusMessages.length;
            if (statusRef.current) {
                statusRef.current.innerText = statusMessages[statusIdx];
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [t.hero.status]);

    useGSAP(() => {
        const wrapper = wrapperRef.current;
        const monolith = monolithRef.current;
        const textFront = textFrontRef.current;
        const video = videoRef.current;
        const cursor = cursorRef.current;
        const cursorGeo = cursorGeoRef.current;

        if (!wrapper || !monolith || !textFront) return;

        // --- MONOLITH INTERACTION ---
        const rotateX = gsap.quickTo(wrapper, "rotationX", {duration: 0.8, ease: "power2.out"});
        const rotateY = gsap.quickTo(wrapper, "rotationY", {duration: 0.8, ease: "power2.out"});
        const frontX = gsap.quickTo(textFront, "x", {duration: 1, ease: "power2.out"});

        // --- GEOMETRIC CURSOR LOGIC ---
        // We use a custom ticker for physics-based stretching
        const mouse = { x: 0, y: 0 };
        const pos = { x: 0, y: 0 };
        let isHovering = false;

        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            // Monolith Tilt Logic
            const width = window.innerWidth;
            const height = window.innerHeight;
            const xNorm = (e.clientX / width - 0.5) * 2;
            const yNorm = (e.clientY / height - 0.5) * 2;
            rotateY(xNorm * 15);
            rotateX(-yNorm * 15);
            frontX(xNorm * -80);
        };
        
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Hover Listeners
        const onEnter = () => { isHovering = true; };
        const onLeave = () => { isHovering = false; };
        // Select all interactive elements: Header links, buttons, and scroll indicator
        const interactiveElements = document.querySelectorAll('nav a, nav button, .scroll-indicator-container');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', onEnter);
            el.addEventListener('mouseleave', onLeave);
        });

        // The Physics Loop
        const tickerFunc = (time: number, deltaTime: number) => {
            if (!cursor || !cursorGeo) return;

            const dt = 1.0 - Math.pow(1.0 - 0.15, deltaTime * 0.06); // Lag factor
            
            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;
            
            xSet(pos.x);
            ySet(pos.y);

            // Calculate Velocity for Distortion
            const dx = mouse.x - pos.x;
            const dy = mouse.y - pos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (!isHovering) {
                // STRETCH STATE (Square -> Rect)
                // Angle of movement
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                // Stretch factor based on speed
                const stretch = Math.min(dist * 0.04, 0.6); // Cap stretch at 0.6
                
                gsap.to(cursorGeo, {
                    rotation: angle,
                    scaleX: 1 + stretch,
                    scaleY: 1 - stretch * 0.4,
                    borderRadius: "0%", // Square
                    backgroundColor: "white",
                    border: "none",
                    opacity: 1,
                    scale: 1 + (stretch * 0.2), // Slight overall scale up on move
                    duration: 0.1,
                    overwrite: true
                });
            } else {
                // HOVER STATE (Circle)
                gsap.to(cursorGeo, {
                    rotation: 0,
                    scaleX: 3.5,
                    scaleY: 3.5,
                    borderRadius: "50%", // Circle
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255,255,255,0.8)", // Hollow ring
                    opacity: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)", // Snappy pop effect
                    overwrite: true
                });
            }
        };

        gsap.ticker.add(tickerFunc);


        // --- SCROLL ANIMATION ---
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top top",
                end: "+=100%",
                pin: true,
                scrub: 0.5,
                fastScrollEnd: true,
                preventOverlaps: true
            }
        });

        gsap.set(monolith, { willChange: "width, height, border-radius" });

        tl.to(monolith, {
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
            ease: "power2.inOut",
            duration: 1
        }, 0);

        // Hide cursor and UI on scroll
        tl.to([textFront, cursor, ".monolith-ui", "#dynamic-message", ".scroll-indicator-container"], {
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

        // Scroll Indicator Animation
        gsap.to(".scroll-dot", {
            y: 12,
            opacity: 0,
            duration: 2,
            repeat: -1,
            ease: "power2.inOut"
        });

        if (scrollRingRef.current) {
            gsap.to(scrollRingRef.current, {
                rotation: 360,
                duration: 15,
                repeat: -1,
                ease: "none"
            });
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            gsap.ticker.remove(tickerFunc); // Stop physics loop
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
            });
            gsap.set(monolith, { willChange: "auto" });
        };

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="dark relative bg-[#040918] text-slate-300 antialiased overflow-x-hidden">
            <Header />

            <header ref={heroSectionRef} id="hero-section" className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#040918]">
                
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                     <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-[1.1] blur-xl opacity-40 will-change-transform">
                        <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* Shifting Geometry Cursor */}
                <div ref={cursorRef} className="fixed top-0 left-0 z-50 pointer-events-none mix-blend-difference will-change-transform">
                     {/* Center the shape within the cursor container so rotation happens around center */}
                     <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <div ref={cursorGeoRef} className="w-3 h-3 bg-white will-change-transform origin-center"></div>
                     </div>
                </div>

                <div className="relative z-20 w-full h-full flex items-center justify-center perspective-container" style={{perspective: '1200px'}}>
                    <div ref={wrapperRef} id="monolith-wrapper" className="relative flex items-center justify-center transform-style-3d will-change-transform" style={{transformStyle: 'preserve-3d'}}>
                        <div ref={monolithRef} id="monolith" className="relative w-[30vw] h-[60vh] md:w-[28vw] md:h-[65vh] bg-slate-900 rounded-sm overflow-hidden shadow-2xl z-10 transform-gpu"
                             style={{transform: 'translateZ(0px)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'}}>
                            <div className="absolute inset-0">
                                <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover scale-150 will-change-transform">
                                    <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 mix-blend-overlay"></div>
                            <div className="monolith-ui absolute top-6 right-6 flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-mono text-white tracking-widest uppercase">{t.hero.ui.live_feed}</span>
                                </div>
                                <span ref={statusRef} className="text-[9px] font-mono text-white/60 tracking-wider mt-1"></span>
                            </div>
                            <div className="monolith-ui absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                            <div className="monolith-ui absolute bottom-8 left-8 h-8 w-[1px] bg-white/20"></div>
                            <span className="monolith-ui absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest">EXP. 2025</span>
                        </div>
                        <h1 ref={textFrontRef} id="text-front" className="text-display-xl absolute top-[58%] left-[52%] text-white select-none pointer-events-none mix-blend-overlay z-20 will-change-transform"
                            style={{transform: 'translateZ(100px)'}}>
                            TREK
                        </h1>
                    </div>
                </div>

                {/* DYNAMIC MESSAGE - Aligned with px-frame */}
                <div id="dynamic-message" className="absolute top-[45%] left-3 md:left-8 lg:left-24 z-30 max-w-[320px] pointer-events-none mix-blend-difference overflow-hidden py-2 will-change-transform">
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

                {/* Scroll Indicator - Aligned with px-frame */}
                <div className="scroll-indicator-container monolith-ui absolute bottom-12 left-3 md:left-8 lg:left-24 flex items-center justify-center z-30 hidden md:flex">
                    <div ref={scrollRingRef} className="scroll-text-ring absolute w-[90px] h-[90px] flex items-center justify-center opacity-30 mix-blend-difference">
                         <svg viewBox="0 0 100 100" width="100" height="100" className="overflow-visible">
                            <defs>
                                <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                            </defs>
                            <text fontSize="8" fill="white" letterSpacing="0.2em" fontWeight="300" fontFamily="monospace">
                                <textPath xlinkHref="#circlePath" startOffset="0%">
                                    {t.hero.ui.scroll} • {t.hero.ui.scroll} •
                                </textPath>
                            </text>
                        </svg>
                    </div>
                    <div className="relative w-[14px] h-[24px] border border-white/20 rounded-full flex justify-center p-[2px] mix-blend-difference opacity-60 z-10">
                        <div className="scroll-dot w-[1px] h-[4px] bg-cyan-400 rounded-full shadow-[0_0_4px_rgba(34,211,238,0.8)]"></div>
                    </div>
                </div>

            </header>
        </div>
    );
}
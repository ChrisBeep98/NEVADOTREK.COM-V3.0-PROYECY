"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from './Header';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Componente de ciclo de palabras aislado para rendimiento de React
function WordCycle({ words, prefix }: { words: string[], prefix: string }) {
    const [wordIndex, setWordIndex] = useState(0);
    const wordWrapperRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!wordWrapperRef.current) return;
            gsap.to(".letter", {
                y: -20, opacity: 0, filter: "blur(8px)", stagger: 0.03, duration: 0.5, ease: "power3.in",
                onComplete: () => setWordIndex((prev) => (prev + 1) % words.length)
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [words.length]);

    useGSAP(() => {
        if (!wordWrapperRef.current) return;
        gsap.fromTo(".letter", 
            { y: 30, opacity: 0, filter: "blur(12px)", willChange: "transform, opacity, filter" },
            { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.05, duration: 1.2, ease: "expo.out" }
        );
    }, { dependencies: [wordIndex, words], scope: wordWrapperRef });

    return (
        <p className="text-sm md:text-base font-light italic leading-relaxed text-white/80">
            {prefix} 
            <span ref={wordWrapperRef} className="inline-flex font-bold text-cyan-300 ml-2 tracking-wider overflow-hidden">
                {words[wordIndex].split("").map((char, i) => (
                    <span key={`${wordIndex}-${i}`} className="letter inline-block">
                        {char}
                    </span>
                ))}
            </span>
        </p>
    );
}

export default function HeroMonolith() {
    const { t } = useLanguage();
    
    // Refs
    const wrapperRef = useRef<HTMLDivElement>(null);
    const monolithRef = useRef<HTMLDivElement>(null);
    const textFrontRef = useRef<HTMLHeadingElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null); 
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null); 
    const statusRef = useRef<HTMLSpanElement>(null); 
    const scrollRingRef = useRef<HTMLDivElement>(null);

    // 1. Status Ticker (DOM Directo)
    useEffect(() => {
        const msgs = [`${t.hero.status.alt}: 4500M`, `${t.hero.status.temp}: -15C`, `${t.hero.status.wind}: 40KT`, `${t.hero.status.o2}: 88%`];
        if (statusRef.current) statusRef.current.innerText = msgs[0];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % msgs.length;
            if (statusRef.current) statusRef.current.innerText = msgs[i];
        }, 3000);
        return () => clearInterval(interval);
    }, [t.hero.status]);

    useEffect(() => {
        if (videoRef.current) videoRef.current.play().catch(() => {});
    }, []);

    // 2. MAIN GPU ANIMATION
    useGSAP(() => {
        const wrapper = wrapperRef.current;
        const monolith = monolithRef.current;
        const textFront = textFrontRef.current;
        const video = videoRef.current;

        if (!wrapper || !monolith || !textFront) return;

        // --- CÁLCULOS DE ESCALA (GPU) ---
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isDesktop = w >= 768;
        
        // Tamaños objetivo originales expresados en ratio de escala
        const targetScaleX = isDesktop ? 0.28 : 0.30;
        const targetScaleY = isDesktop ? 0.65 : 0.60;

        // Configuración inicial del texto (Centrado absoluto)
        gsap.set(textFront, { xPercent: -50, yPercent: -50, x: 0, y: 0 });

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

        // ANIMACIÓN DE ESCALA (GPU)
        // Escalamos el contenedor hacia abajo y el contenido hacia arriba (Counter-Scale)
        const innerContent = monolith.querySelectorAll('.inner-gpu');

        tl.fromTo(monolith, 
            { scaleX: targetScaleX, scaleY: targetScaleY, borderRadius: "4px" },
            { scaleX: 1, scaleY: 1, borderRadius: "0px", ease: "none", duration: 1 }, 
            0
        );

        tl.fromTo(innerContent,
            { scaleX: 1 / targetScaleX, scaleY: 1 / targetScaleY },
            { scaleX: 1, scaleY: 1, ease: "none", duration: 1 },
            0
        );

        // UI Transitions
        tl.to([textFront, ".monolith-ui", "#dynamic-message", ".scroll-indicator-container"], {
            opacity: 0, y: -40, duration: 0.5
        }, 0);

        tl.to(wrapper, { rotationX: 0, rotationY: 0, duration: 1 }, 0);

        // Mouse Interaction
        const rotateX = gsap.quickTo(wrapper, "rotationX", {duration: 0.8, ease: "power2.out"});
        const rotateY = gsap.quickTo(wrapper, "rotationY", {duration: 0.8, ease: "power2.out"});
        const frontX = gsap.quickTo(textFront, "x", {duration: 1, ease: "power2.out"});

        const handleMouseMove = (e: MouseEvent) => {
            const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
            const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
            rotateY(xNorm * 12);
            rotateX(-yNorm * 12);
            frontX(xNorm * -40);
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Cursor Physics
        const mouse = { x: 0, y: 0 };
        const pos = { x: 0, y: 0 };
        const xSet = gsap.quickSetter(cursorRef.current, "x", "px");
        const ySet = gsap.quickSetter(cursorRef.current, "y", "px");
        const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        window.addEventListener('mousemove', onMove, { passive: true });
        const ticker = (time: number, dt: number) => {
            const f = 1.0 - Math.pow(1.0 - 0.15, dt * 0.06);
            pos.x += (mouse.x - pos.x) * f;
            pos.y += (mouse.y - pos.y) * f;
            xSet(pos.x); ySet(pos.y);
        };
        gsap.ticker.add(ticker);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousemove', onMove);
            gsap.ticker.remove(ticker);
        };
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="dark relative bg-[#040918] text-slate-300 antialiased overflow-x-hidden">
            <Header />

            <header ref={heroSectionRef} className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#040918]">
                
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                     <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-[1.1] blur-xl opacity-40">
                        <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                    </video>
                </div>

                <div ref={cursorRef} className="fixed top-0 left-0 z-50 pointer-events-none mix-blend-difference">
                     <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 bg-white"></div>
                     </div>
                </div>

                <div className="relative z-20 w-full h-full flex items-center justify-center perspective-[1200px]">
                    <div ref={wrapperRef} className="relative w-full h-full flex items-center justify-center transform-style-3d" style={{transformStyle: 'preserve-3d'}}>
                        
                        {/* 
                            OPTIMIZED MONOLITH (GPU):
                            Ocupa el 100% (inset-0) para centrado absoluto. 
                            Se escala mediante GSAP para el estado inicial.
                        */}
                        <div ref={monolithRef} 
                             className="absolute inset-0 bg-slate-900 overflow-hidden shadow-2xl z-10 transform-gpu will-change-transform">
                            
                            {/* Contenido con escala inversa para evitar deformación */}
                            <div className="inner-gpu absolute inset-0 transform-gpu will-change-transform">
                                <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover scale-150">
                                    <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                                </video>
                                
                                <div className="monolith-ui absolute inset-0 pointer-events-none">
                                    <div className="absolute top-6 right-6 flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                            <span className="text-[9px] font-mono text-white tracking-widest uppercase">{t.hero.ui.live_feed}</span>
                                        </div>
                                        <span ref={statusRef} className="text-[9px] font-mono text-white/60 tracking-wider mt-1"></span>
                                    </div>
                                    <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                                    <div className="absolute bottom-8 left-8 h-8 w-[1px] bg-white/20"></div>
                                    <span className="absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest">EXP. 2025</span>
                                </div>
                            </div>
                        </div>

                        <h1 ref={textFrontRef} className="text-display-xl absolute top-1/2 left-1/2 text-white select-none pointer-events-none mix-blend-overlay z-20 whitespace-nowrap"
                            style={{ transform: 'translate3d(-50%, -50%, 100px)' }}>
                            TREK
                        </h1>
                    </div>
                </div>

                <div id="dynamic-message" className="absolute top-[45%] left-8 lg:left-24 z-30 max-w-[320px] pointer-events-none mix-blend-difference py-2">
                    <WordCycle words={t.hero.words} prefix={t.hero.message.prefix} />
                </div>

                <div className="scroll-indicator-container absolute bottom-12 left-8 lg:left-24 hidden md:flex items-center justify-center z-30">
                    <div ref={scrollRingRef} className="absolute w-[90px] h-[90px] flex items-center justify-center opacity-30 mix-blend-difference">
                         <svg viewBox="0 0 100 100" width="100" height="100">
                            <defs><path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" /></defs>
                            <text fontSize="8" fill="white" letterSpacing="0.2em" fontFamily="monospace">
                                <textPath xlinkHref="#circlePath">{t.hero.ui.scroll} • {t.hero.ui.scroll} •</textPath>
                            </text>
                        </svg>
                    </div>
                    <div className="w-[14px] h-[24px] border border-white/20 rounded-full flex justify-center p-[2px] opacity-60">
                        <div className="scroll-dot w-[1px] h-[4px] bg-cyan-400 rounded-full shadow-[0_0_4px_rgba(34,211,238,0.8)]"></div>
                    </div>
                </div>

            </header>
        </div>
    );
}
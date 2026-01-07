"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CircleDot, Disc, Video, Radio, Aperture } from 'lucide-react';
import Header from './Header';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Componente de ciclo de palabras aislado
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
        <p className="text-sm md:text-base font-light italic leading-relaxed text-white drop-shadow-lg flex flex-wrap">
            <span>{prefix} </span>
            <span ref={wordWrapperRef} className="inline-flex font-bold text-white tracking-wider overflow-hidden drop-shadow-md">
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
    const monolithRef = useRef<HTMLDivElement>(null);
    const innerContentRef = useRef<HTMLDivElement>(null);
    const textFrontRef = useRef<HTMLHeadingElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null);
    const scrollRingRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const liveIndicatorRef = useRef<HTMLDivElement>(null);

    // Status Ticker
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

    // --- GPU OPTIMIZED ANIMATION (COUNTER-SCALE) ---
    useGSAP(() => {
        const monolith = monolithRef.current;
        const inner = innerContentRef.current;
        const textFront = textFrontRef.current;
        const liveIndicator = liveIndicatorRef.current;

        if (!monolith || !inner || !textFront) return;

        // 1. Calcular Ratios de Escala Inicial (Para que parezca el monolito de diseño)
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isDesktop = w >= 768;
        
        const startScaleX = isDesktop ? 0.28 : 0.70;
        const startScaleY = isDesktop ? 0.65 : 0.85;

        // Centrado inicial del título
        gsap.set(textFront, { xPercent: -50, yPercent: -50, x: 0, y: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: 0.5,
                fastScrollEnd: true,
                preventOverlaps: true
            }
        });

        // 2. Animación de "La Ventana"
        tl.fromTo(monolith, 
            { scaleX: startScaleX, scaleY: startScaleY, borderRadius: "4px", y: isDesktop ? 0 : "20%" },
            { scaleX: 1, scaleY: isDesktop ? 1 : 1.25, y: 0, borderRadius: "0px", ease: "none", duration: 1 }, 
            0
        );

        // 3. Contrarrestar Escala del Contenido (Para que el video se vea normal)
        tl.fromTo(inner,
            { scaleX: 1 / startScaleX, scaleY: 1 / startScaleY },
            { scaleX: 1, scaleY: isDesktop ? 1 : 0.80, ease: "none", duration: 1 },
            0
        );

        // 4. Animación de Posición del Indicador Live (Sin deformación)
        // Calculamos dónde está visualmente la esquina del monolito al inicio
        // Monolito ancho inicial = 100% * startScaleX
        // Margen desde el borde derecho de la pantalla = (100% - AnchoMonolito) / 2
        
        const initialMarginX = (w * (1 - startScaleX)) / 2; // Distancia desde el borde derecho hasta el borde del monolito
        const initialMarginY = (h * (1 - startScaleY)) / 2; // Distancia desde el borde superior hasta el borde del monolito
        
        // Queremos que esté a 24px (1.5rem / top-6 right-6) ADENTRO del borde del monolito
        // Posición start: right: initialMarginX + 24, top: initialMarginY + 24
        // Posición end: right: 24, top: 24
        
        if (liveIndicator) {
            // Reset transforms primero por si acaso
            gsap.set(liveIndicator, { clearProps: "all" });
            
            tl.fromTo(liveIndicator,
                { 
                    right: initialMarginX + 24, 
                    top: initialMarginY + 24,
                    scale: 1 // Aseguramos escala 1:1 siempre
                },
                { 
                    right: 24, 
                    top: 24, 
                    ease: "none", 
                    duration: 1 
                },
                0
            );
        }

        // UI Fade
        tl.to([textFront, ".monolith-ui", "#dynamic-message", ".scroll-indicator-container"], {
            opacity: 0, y: -40, duration: 0.5
        }, 0);

        // Scroll Ring Rotation
        if (scrollRingRef.current) gsap.to(scrollRingRef.current, { rotation: 360, duration: 15, repeat: -1, ease: "none" });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="dark relative bg-[#040918] text-slate-300 antialiased overflow-x-hidden">
            <Header />

            <header ref={heroSectionRef} className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#040918]">
                
                {/* FONDO: Video Desenfocado (Siempre Visible) */}
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                     <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-[1.1] blur-xl opacity-40">
                        <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* EL MONOLITO (VENTANA GPU) */}
                <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                    
                    {/* 
                        Este div es la "Ventana". 
                        Ocupa el 100% para que el centro sea inamovible.
                        Lo escalamos con GSAP.
                    */}
                     <div 
                        ref={monolithRef}
                        className="relative w-full h-full overflow-hidden bg-slate-900 shadow-2xl transform-gpu will-change-transform"
                        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}
                    >
                        {/* 
                            CONTENIDO INTERNO:
                            Aquí aplicamos la escala inversa para que el video parezca estático 
                            mientras la ventana de arriba se expande.
                        */}
                        <div ref={innerContentRef} className="absolute inset-0 w-full h-full transform-gpu will-change-transform">
                            
                            {/* Video Nítido */}
                            <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover">
                                <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                            </video>

                            {/* UI del Monolito (Se escala con el contenido) */}
                            <div className="monolith-ui absolute inset-0">
                                <div className="absolute top-6 right-6 flex flex-col items-end">
                                    <span ref={statusRef} className="text-[9px] font-mono text-white/60 tracking-wider mt-1"></span>
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                                <div className="absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest uppercase opacity-60">Exp. 2025</div>
                            </div>
                        </div>

                        {/* LIVE INDICATOR: Removed from here to place outside */}
                    </div>

                    {/* TÍTULO TREK: Centrado Absoluto sobre el monolito */}
                    <h1 ref={textFrontRef} className="text-display-xl absolute top-1/2 left-1/2 text-white select-none pointer-events-none mix-blend-overlay z-20 whitespace-nowrap">
                        TREK
                    </h1>

                    {/* LIVE INDICATOR: Flotando sobre todo, posicionado por GSAP para coincidir con la esquina del monolito */}
                    <div 
                        ref={liveIndicatorRef}
                        className="absolute z-50 items-center gap-3 group hidden md:flex"
                        style={{ right: '24px', top: '24px' }}
                    >
                        <div className="flex flex-col items-end leading-none gap-[2px]">
                            {(Array.isArray(t.hero.ui.live_now) ? t.hero.ui.live_now : [t.hero.ui.live_now]).map((line, i) => (
                                <span key={i} className="text-[9px] font-mono text-white/90 tracking-[0.2em] uppercase font-light shadow-black drop-shadow-sm">
                                    {line}
                                </span>
                            ))}
                        </div>
                        <Aperture className="w-4 h-4 text-red-500 animate-spin-slow drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </div>
                </div>

                {/* UI EXTERIOR */}
                <div id="dynamic-message" className="absolute bottom-6 lg:top-[45%] left-3 lg:left-24 z-30 max-w-[160px] lg:max-w-[400px] pointer-events-none mix-blend-difference py-2">
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
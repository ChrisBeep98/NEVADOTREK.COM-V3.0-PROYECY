"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Aperture, ArrowRight, ChevronDown } from 'lucide-react';
import Header from '../Header';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VIDEO_URL = "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4";

export default function DesktopHero() {
    const { t } = useLanguage();

    const monolithRef = useRef<HTMLDivElement>(null);
    const innerContentRef = useRef<HTMLDivElement>(null);
    const textFrontRef = useRef<HTMLHeadingElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null);
    const scrollRingRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const rightRailRef = useRef<HTMLDivElement>(null);

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

    useGSAP(() => {
        const monolith = monolithRef.current;
        const inner = innerContentRef.current;
        const textFront = textFrontRef.current;

        if (!monolith || !inner || !textFront) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        const startScaleX = 0.28;
        const startScaleY = 0.65;

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

        tl.fromTo(monolith,
            { scaleX: startScaleX, scaleY: startScaleY, borderRadius: "4px" },
            { scaleX: 1, scaleY: 1, borderRadius: "0px", ease: "none", duration: 1 },
            0
        );

        tl.fromTo(inner,
            { scaleX: 1 / startScaleX, scaleY: 1 / startScaleY },
            { scaleX: 1, scaleY: 1, ease: "none", duration: 1 },
            0
        );

        const initialMarginX = (w * (1 - startScaleX)) / 2;
        const initialMarginY = (h * (1 - startScaleY)) / 2;

        // Animate TREK text position to stick to the corner as monolith expands
        tl.fromTo(textFront, 
            { right: "18%", bottom: "14.7%" }, 
            { right: "3rem", bottom: "3.2rem", ease: "none", duration: 1 }, 
            0
        );

        // Remove textFront from the quick fade-out group to let it ride the corner
        tl.to([".monolith-ui", "#dynamic-message", ".scroll-indicator-container"], {
            opacity: 0, y: -40, duration: 0.5
        }, 0);

        if (scrollRingRef.current) {
            const chevrons = scrollRingRef.current.querySelectorAll('.scroll-chevron');
            
            const tl = gsap.timeline({ repeat: -1 });
            
            tl.fromTo(chevrons, 
                { y: -10, opacity: 0 },
                { y: 5, opacity: 1, duration: 0.8, stagger: 0.4, ease: "power2.out" }
            ).to(chevrons, 
                { y: 20, opacity: 0, duration: 0.8, stagger: 0.4, ease: "power2.in" },
                "-=0.4"
            );
        }

        // Right Rail (Minimalist Entry)
        if (rightRailRef.current) {
            gsap.fromTo(rightRailRef.current, 
                { opacity: 0, height: 0 },
                { opacity: 1, height: "auto", duration: 1.5, delay: 0.5, ease: "power3.out" }
            );

            // Subtle Color Flow
            gsap.to(rightRailRef.current, {
                filter: "hue-rotate(360deg) saturate(1.5)",
                duration: 20,
                repeat: -1,
                ease: "none"
            });
        }

        // HUD Entrance Animation
        gsap.from(".hud-accent", {
            scale: 0,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            delay: 0.8,
            ease: "back.out(2)",
            clearProps: "all"
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="hidden md:block relative bg-[#040918] text-slate-300 antialiased overflow-x-hidden">
            <Header />

            <header ref={heroSectionRef} className="relative h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-[#040918]">

                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-[1.1] blur-xl opacity-40">
                        <source src={VIDEO_URL} type="video/mp4" />
                    </video>
                </div>

                <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">

                    <div
                        ref={monolithRef}
                        className="relative w-full h-full overflow-hidden bg-slate-900 shadow-2xl transform-gpu will-change-transform"
                        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}
                    >
                        <div ref={innerContentRef} className="absolute inset-0 w-full h-full transform-gpu will-change-transform">

                            <video ref={videoRef} autoPlay muted loop playsInline className="w-full h-full object-cover">
                                <source src={VIDEO_URL} type="video/mp4" />
                            </video>

                            <div className="monolith-ui absolute inset-0">
                                <div className="absolute top-6 right-6 flex flex-col items-end z-40">
                                    <div className="flex items-center gap-3 group">
                                        <div className="flex flex-col items-end leading-none gap-[2px]">
                                            {(Array.isArray(t.hero.ui.live_now) ? t.hero.ui.live_now : [t.hero.ui.live_now]).map((line, i) => (
                                                <span key={i} className="text-[9px] font-mono text-white/90 tracking-[0.2em] uppercase font-light shadow-black drop-shadow-sm">
                                                    {line}
                                                </span>
                                            ))}
                                        </div>
                                        <Aperture className="w-4 h-4 text-red-500 animate-spin-slow drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                    </div>
                                    <span ref={statusRef} className="text-[9px] font-mono text-white/60 tracking-wider mt-2"></span>
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                                <div className="absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest uppercase opacity-60">Exp. 2025</div>
                            </div>
                        </div>
                    </div>

                    <div ref={textFrontRef} className="absolute z-20 select-none pointer-events-none mix-blend-overlay will-change-transform flex flex-col items-end group">
                        {/* Technical Frame Accents */}
                        <div className="hud-accent absolute -top-6 -left-6 w-8 h-8 border-t border-l border-white/20" />
                        
                        <h1 className="text-[12vw] font-bold text-white leading-[0.8] tracking-tighter">
                            TREK
                        </h1>
                        
                        <div className="hud-accent flex items-center gap-4 mt-4">
                            <div className="hud-accent w-8 h-[1px] bg-white/20" />
                            <span className="text-[10px] font-mono tracking-[0.3em] text-white/50">
                                4.6372° N // 75.5708° W
                            </span>
                        </div>

                        <div className="hud-accent absolute -bottom-6 -right-6 w-8 h-8 border-b border-r border-white/20" />
                    </div>
                </div>

                <div id="dynamic-message" className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-center pl-3 lg:pl-32">
                    <div className="flex flex-col gap-8 items-start">
                        <h2 className="text-3xl md:text-5xl lg:text-[4vw] font-medium text-white uppercase leading-[0.9] tracking-tighter italic mix-blend-difference">
                            Un<br />
                            Paraíso<br />
                            En<br />
                            Salento
                        </h2>
                        <div className="pointer-events-auto">
                            <button className="btn-primary group w-fit pl-8 pr-2 py-2 gap-4">
                                <span>{t.common.explore_tours}</span>
                                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator-container absolute bottom-12 left-8 lg:left-32 hidden md:flex flex-col items-center z-30 mix-blend-difference pointer-events-none">
                    <div ref={scrollRingRef} className="flex flex-col items-center -gap-1 opacity-70">
                        <ChevronDown className="scroll-chevron w-5 h-5 text-white" />
                        <ChevronDown className="scroll-chevron w-5 h-5 text-white -mt-3" />
                    </div>
                </div>

                {/* Vertical Data Rail (Right) - Variant 4: Minimalist Structural */}
                <div ref={rightRailRef} className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 z-30 mix-blend-screen pointer-events-none select-none">
                    <div className="text-xs font-light text-cyan-400/80">+</div>
                    <div className="w-[1px] h-32 bg-gradient-to-b from-cyan-400 via-emerald-400 to-blue-500 opacity-60"></div>
                    <span className="text-[10px] font-mono tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 bg-gradient-to-b from-cyan-200 via-emerald-200 to-blue-300 bg-clip-text text-transparent opacity-90 font-semibold">
                        COL - QND
                    </span>
                </div>

            </header>
        </div>
    );
}

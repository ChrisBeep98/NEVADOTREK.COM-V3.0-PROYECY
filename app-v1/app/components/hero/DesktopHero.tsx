"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Aperture, ArrowRight, ChevronDown, Radio } from 'lucide-react';
import Header from '../Header';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';

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
    const liveIndicatorRef = useRef<HTMLDivElement>(null);
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
        const liveIndicator = liveIndicatorRef.current;

        if (!monolith || !inner || !textFront) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        const startScaleX = 0.28;
        const startScaleY = 0.65;

        // 1. Subtle Cinematic Entry (Optimized)
        // We set the scale immediately to match the layout requirements.
        // Then we just fade it in with a slight vertical drift.
        // This avoids heavy scaling operations during the critical first render.
        gsap.set(monolith, { scaleX: startScaleX, scaleY: startScaleY });

        gsap.fromTo(monolith,
            { 
                opacity: 0, 
                y: 40,
                force3D: true
            },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.8, 
                ease: "power2.out" 
            }
        );

        // 2. Monolith UI Details Reveal (REC & Info)
        // Subtle fade-in for the technical details inside/around the monolith
        const uiTargets = [".monolith-ui"];
        if (liveIndicator) uiTargets.push(liveIndicator);
        
        gsap.fromTo(uiTargets,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 1, delay: 0.5, stagger: 0.2, ease: "power2.out" }
        );

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

        // Animate Live Indicator to corner
        if (liveIndicator) {
            tl.fromTo(liveIndicator,
                { right: "36%", top: "18%" },
                { right: "1.5rem", top: "1.5rem", ease: "none", duration: 1 },
                0
            );
        }

        // Animate TREK text to fade out to the right on scroll
        tl.to(textFront, 
            { x: 100, opacity: 0, ease: "power1.out", duration: 0.5 }, 
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

        // TREK Text Reveal Animation (On Load) - Soft Fade & Lift
        const trekTitle = textFrontRef.current?.querySelector("h1");
        if (trekTitle) {
            gsap.fromTo(trekTitle,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.3 }
            );
        }

        // New Masked Slide-Up Reveal for "Un Paraíso En Salento"
        gsap.fromTo(".hero-text-reveal", 
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: "power3.out", delay: 0.9 }
        );

        // Tagline Reveal
        gsap.fromTo(".hero-tagline-reveal",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.0 }
        );

        // Hero Button Reveal
        gsap.fromTo(".hero-button-reveal",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 1.1 }
        );

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
                                <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                                <div className="absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest uppercase opacity-60">Exp. 2025</div>
                            </div>
                        </div>
                    </div>

                    {/* Live Indicator (Animated to corner) */}
                    <div ref={liveIndicatorRef} className="absolute top-[18%] right-[36%] flex flex-col items-end gap-1 z-40 pointer-events-none mix-blend-overlay will-change-transform">
                        <div className="flex items-center gap-2 px-2 py-1 rounded border border-white/10 bg-black/20 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                            <span className="text-[10px] font-mono font-bold tracking-widest text-white">REC</span>
                        </div>
                        <span ref={statusRef} className="text-[9px] font-mono text-white/50 tracking-widest uppercase text-right pr-2"></span>
                    </div>

                    <div ref={textFrontRef} style={{ right: "18%", bottom: "14.7%" }} className="absolute z-20 select-none pointer-events-none mix-blend-overlay will-change-transform flex flex-col items-end group">
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
                        <h2 className="text-3xl md:text-5xl lg:text-[4vw] font-medium text-white uppercase leading-[0.9] tracking-tighter italic mix-blend-difference flex flex-col">
                            <div className="overflow-hidden"><span className="hero-text-reveal block">{t.hero.message.title_line1}</span></div>
                            <div className="overflow-hidden"><span className="hero-text-reveal block">{t.hero.message.title_line2}</span></div>
                            <div className="overflow-hidden"><span className="hero-text-reveal block">{t.hero.message.title_line3}</span></div>
                            <div className="overflow-hidden"><span className="hero-text-reveal block">{t.hero.message.title_line4}</span></div>
                        </h2>
                        
                        <p className="hero-tagline-reveal text-sm md:text-base text-white/60 tracking-[0.1em] font-light mix-blend-difference whitespace-pre-line leading-relaxed">
                            {t.hero.message.tagline}
                        </p>

                        <div className="pointer-events-auto hero-button-reveal">
                            <Link href="/tours" className="btn-primary group w-fit pl-8 pr-2 py-2 gap-4 cursor-pointer">
                                <span>{t.common.explore_tours}</span>
                                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
                                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </div>
                            </Link>
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

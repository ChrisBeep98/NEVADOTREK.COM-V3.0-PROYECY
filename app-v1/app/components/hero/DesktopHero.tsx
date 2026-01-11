"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Aperture, ArrowRight } from 'lucide-react';
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
    const liveIndicatorRef = useRef<HTMLDivElement>(null);

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

        if (liveIndicator) {
            // Set initial stable position (end state) via CSS in JSX, 
            // use GSAP to animate FROM the offset position using transforms (GPU efficient)
            // instead of animating top/right (CPU layout thrashing).
            gsap.set(liveIndicator, { 
                right: 24, 
                top: 24,
                x: -initialMarginX, // Move left (away from right edge)
                y: initialMarginY   // Move down (away from top edge)
            });

            tl.to(liveIndicator,
                {
                    x: 0,
                    y: 0,
                    ease: "none",
                    duration: 1
                },
                0
            );
        }

        tl.to([textFront, ".monolith-ui", "#dynamic-message", ".scroll-indicator-container"], {
            opacity: 0, y: -40, duration: 0.5
        }, 0);

        if (scrollRingRef.current) {
            gsap.to(scrollRingRef.current, { rotation: 360, duration: 15, repeat: -1, ease: "none" });
        }

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
                                <div className="absolute top-6 right-6 flex flex-col items-end">
                                    <span ref={statusRef} className="text-[9px] font-mono text-white/60 tracking-wider mt-1"></span>
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                                <div className="absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest uppercase opacity-60">Exp. 2025</div>
                            </div>
                        </div>
                    </div>

                    <h1 ref={textFrontRef} className="text-display-xl absolute top-1/2 left-1/2 text-white select-none pointer-events-none mix-blend-overlay z-20 whitespace-nowrap">
                        TREK
                    </h1>

                    <div
                        ref={liveIndicatorRef}
                        className="absolute z-50 items-center gap-3 group hidden md:flex will-change-transform"
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

                <div id="dynamic-message" className="absolute inset-0 z-30 pointer-events-none mix-blend-difference flex flex-col justify-center pl-3 lg:pl-32">
                    <div className="flex flex-col gap-8 items-start">
                        <h2 className="text-3xl md:text-5xl lg:text-[4vw] font-medium text-white uppercase leading-[0.9] tracking-tighter italic">
                            Un<br />
                            Paraíso<br />
                            En<br />
                            Salento
                        </h2>
                        <div className="pointer-events-auto">
                            <button className="btn-primary group w-fit">
                                {t.common.explore_tours}
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator-container absolute bottom-12 left-8 lg:left-32 hidden md:flex items-center justify-center z-30">
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

                {/* Vertical Data Rail (Right) */}
                <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-30 opacity-60 mix-blend-overlay pointer-events-none">
                    <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/40 to-white/40"></div>
                    <span className="text-[10px] font-mono tracking-[0.3em] text-white whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                        QUINDÍO // COLOMBIA
                    </span>
                    <div className="w-[1px] h-24 bg-gradient-to-t from-transparent via-white/40 to-white/40"></div>
                </div>

            </header>
        </div>
    );
}

"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Header from '../Header';
import { useLanguage } from '../../context/LanguageContext';
import WordCycle from './WordCycle';
import StatusTicker from './StatusTicker';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VIDEO_URL = "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4";

export default function DesktopHero() {
    const { t } = useLanguage();

    const monolithRef = useRef<HTMLDivElement>(null);
    const innerContentRef = useRef<HTMLDivElement>(null);
    const textFrontRef = useRef<HTMLHeadingElement>(null);
    const liveIndicatorRef = useRef<HTMLDivElement>(null);
    const scrollRingRef = useRef<HTMLDivElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
            gsap.set(liveIndicator, { clearProps: "all" });

            tl.fromTo(liveIndicator,
                {
                    right: initialMarginX + 24,
                    top: initialMarginY + 24,
                    scale: 1
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

                            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                                <source src={VIDEO_URL} type="video/mp4" />
                            </video>

                            <div className="monolith-ui absolute inset-0">
                                <div className="absolute top-6 right-6 flex flex-col items-end">
                                    <StatusTicker showLiveIndicator={false} />
                                </div>
                                <div className="absolute bottom-8 left-8 right-8 h-[1px] bg-white/20"></div>
                                <div className="absolute bottom-10 left-10 text-[10px] text-white font-mono tracking-widest uppercase opacity-60">Exp. 2025</div>
                            </div>
                        </div>

                        <h1 ref={textFrontRef} className="text-display-xl absolute top-1/2 left-1/2 text-white select-none pointer-events-none mix-blend-overlay z-20 whitespace-nowrap">
                            TREK
                        </h1>

                        <div
                            ref={liveIndicatorRef}
                            className="absolute z-50 items-center gap-3 hidden md:flex"
                            style={{ right: '24px', top: '24px' }}
                        >
                            <StatusTicker />
                        </div>
                    </div>
                </div>

                <div id="dynamic-message" className="absolute bottom-6 lg:top-[45%] left-24 z-30 max-w-[400px] pointer-events-none mix-blend-difference py-2">
                    <WordCycle words={t.hero.words} prefix={t.hero.message.prefix} size="lg" />
                </div>

                <div className="scroll-indicator-container absolute bottom-12 left-24 hidden md:flex items-center justify-center z-30">
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

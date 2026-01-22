"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, MountainSnow, Compass, Thermometer, Wind, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';

// Static Imports for GitHub Pages Compatibility
import cloudHero1 from '../../../public/images/cloud-hero-1.webp';
import cloudHero2 from '../../../public/images/cloud-hero-2.webp';
import cloudHero3 from '../../../public/images/cloud-hero-3.webp';
import cloudHero4 from '../../../public/images/cloud-hero-4.webp';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VIDEO_URL = "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4";

// --- ATMOSPHERIC WORD COMPONENT (Refined Cycle) ---
const AtmosphericWord = ({ words, className }: { words: string[], className?: string }) => {
    const [index, setIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;
        
        const chars = containerRef.current.children;
        gsap.killTweensOf(chars);

        const tl = gsap.timeline();

        // 1. CONDENSE (Enter)
        tl.fromTo(chars, 
            { 
                autoAlpha: 0, 
                filter: "blur(12px)", 
                y: 15,
                scale: 1.1,
                rotateX: -45
            },
            { 
                autoAlpha: 1, 
                filter: "blur(0px)", 
                y: 0, 
                scale: 1,
                rotateX: 0,
                duration: 1.2, 
                stagger: { amount: 0.5, from: "random" },
                ease: "power2.out"
            }
        );

        // 2. DISSOLVE (Exit)
        tl.to(chars, {
            autoAlpha: 0,
            filter: "blur(15px)",
            y: -15,
            scale: 1.1,
            rotateX: 45,
            duration: 1.0,
            stagger: { amount: 0.3, from: "random" },
            ease: "power2.in",
            delay: 3.0, 
            onComplete: () => {
                setIndex((prev) => (prev + 1) % words.length);
            }
        });

    }, { scope: containerRef, dependencies: [index] });

    const currentWord = words[index] || "";

    return (
        <div ref={containerRef} className={`flex gap-[0.05em] min-w-[200px] sm:min-w-[300px] perspective-[500px] ${className}`}>
            {currentWord.split("").map((char, i) => (
                <span 
                    key={`${index}-${i}`} 
                    className="inline-block origin-center will-change-transform will-change-filter backface-hidden invisible"
                >
                    {char}
                </span>
            ))}
        </div>
    );
};

export default function DesktopHero() {
    const { t } = useLanguage();
    
    const containerRef = useRef<HTMLDivElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const contentGroupRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const [weather] = useState({ temp: -5, wind: 12 });

    useGSAP(() => {
        const tl = gsap.timeline();

        // Initial Video Reveal
        tl.fromTo(videoRef.current, 
            { scale: 1.1, filter: "brightness(0)", autoAlpha: 0 },
            { scale: 1.05, filter: "brightness(1)", autoAlpha: 1, duration: 2, ease: "power2.out" }
        );

        // Corner UI Elements
        tl.from(".corner-ui", {
            y: -20,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=1.5");

        // Main Title Characters
        tl.from(".hero-char", {
            y: 100,
            autoAlpha: 0,
            rotateX: -90,
            stagger: 0.03,
            duration: 1.2,
            ease: "expo.out"
        }, "-=1");

        // Meta Line, Tagline, Button
        tl.from(".hero-meta-line", { scaleY: 0, transformOrigin: "top", autoAlpha: 0, duration: 0.8, ease: "power3.inOut" }, "-=0.8");
        tl.from(".hero-tagline", { y: 20, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
        tl.from(".hero-btn", { y: 20, autoAlpha: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");

        // Cloud Entrance
        tl.from(".animate-cloud", {
            autoAlpha: 0,
            y: 40,
            stagger: {
                each: 0.05,
                from: "random"
            },
            duration: 2,
            ease: "power2.out"
        }, "-=1.2");

        // Parallax Scroll Effects
        gsap.to(contentGroupRef.current, {
            y: -150,
            ease: "none",
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(videoRef.current, {
            y: 50,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
                trigger: heroSectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

        // Magnetic Button (Desktop mainly)
        const btn = buttonRef.current;
        if (btn && window.matchMedia("(min-width: 768px)").matches) { 
            const magnetStrength = 0.15;
            const magnetArea = 50;

            const handleMouseMove = (e: MouseEvent) => {
                const rect = btn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance < magnetArea + Math.max(rect.width, rect.height)) {
                    gsap.to(btn, {
                        x: deltaX * magnetStrength,
                        y: deltaY * magnetStrength,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                } else {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.3)"
                    });
                }
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }

    }, { scope: containerRef });

    return (
        // Outer container now uses theme background for the rounded corners "leak"
        <div ref={containerRef} className="bg-background text-white relative h-screen z-40 overflow-x-clip">
            <header ref={heroSectionRef} className="bg-[#02040a] relative h-full w-full flex items-center justify-center overflow-hidden rounded-b-[32px] md:rounded-none">
                
                <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                    <video 
                        ref={videoRef}
                        autoPlay muted loop playsInline 
                        className="w-full h-full object-cover will-change-transform invisible"
                    >
                        <source src={VIDEO_URL} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none"></div>
                    
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, transparent 40%, rgba(2, 4, 10, 0.65) 100%)'
                        }}
                    ></div>
                </div>

                {/* UI Elements Container - Adjusted padding for mobile */}
                <div className="absolute inset-0 z-10 pointer-events-none p-3 md:p-[var(--spacing-frame)] flex flex-col justify-between overflow-hidden">
                    <div className="flex justify-between items-start">
                    </div>

                    {/* Left Year Label - Hidden on Mobile */}
                    <div className="corner-ui hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-center gap-6 pl-8 invisible">
                        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-[10px] font-mono font-bold text-white/40 tracking-[0.5em] [writing-mode:vertical-lr]">2026</span>
                        </div>
                        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                    </div>
                    
                    <div className="flex justify-between items-end w-full">
                         {/* Scroll Indicator - Centered on Mobile, Left on Desktop */}
                        <div className="corner-ui flex flex-col items-center gap-2 group cursor-pointer w-full md:w-auto invisible" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                            <div className="relative w-5 h-9 rounded-full border border-white/10 bg-white/5 backdrop-blur-[2px] flex justify-center pt-1.5 group-hover:border-cyan-400/40 transition-colors duration-500 shadow-lg shadow-black/20">
                                <div className="w-1 h-1.5 bg-cyan-400 rounded-full animate-scroll-shuttle shadow-[0_0_8px_rgba(34,211,238,0.8)] will-change-transform"></div>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-white/30 group-hover:text-cyan-400 group-hover:translate-y-0.5 transition-all duration-500" />
                        </div>
                        
                        <div className="corner-ui text-right hidden md:block invisible">
                        </div>
                    </div>

                    {/* Right Weather Widget - Hidden on Mobile */}
                    <div className="corner-ui hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-center gap-6 pr-8 invisible">
                        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-1 group cursor-default">
                                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-400/30 transition-colors backdrop-blur-sm">
                                    <Thermometer className="w-4 h-4 text-white/70 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <span className="text-[10px] font-mono font-medium text-white/60 tracking-wider">{weather.temp}°C</span>
                            </div>
                            
                            <div className="flex flex-col items-center gap-1 group cursor-default">
                                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-400/30 transition-colors backdrop-blur-sm">
                                    <Wind className="w-4 h-4 text-white/70 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <span className="text-[10px] font-mono font-medium text-white/60 tracking-wider">{weather.wind}KT</span>
                            </div>
                        </div>

                        <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                    </div>
                </div>

                {/* Main Content Group - Responsive Alignment and Spacing */}
                <div 
                    ref={contentGroupRef} 
                    className="relative z-[70] flex flex-col justify-center items-start md:items-center text-left md:text-center px-3 md:px-4 w-full"
                >
                    <h2 className="text-6xl md:text-7xl lg:text-[7rem] font-bold italic text-white leading-[0.9] tracking-tighter mix-blend-overlay drop-shadow-lg mb-4 md:mb-2 w-full">
                        {/* Mobile: Stacked | Desktop: Inline/Flex */}
                        <div className="flex justify-start md:justify-center gap-[0.05em] flex-wrap overflow-hidden py-1 md:py-2">
                            {t.hero.message.title_line1.split("").map((char, i) => (
                                <span key={`l1-${i}`} className="hero-char inline-block origin-bottom invisible">{char}</span>
                            ))}
                        </div>
                        
                        {/* Atmospheric Word - Left align on mobile */}
                        <div className="flex justify-start md:justify-center gap-[0.01em] py-1 md:py-2 text-cyan-100/90 font-mono italic">
                            <AtmosphericWord words={t.hero.message.accent_words || [t.hero.message.title_line2]} className="justify-start md:justify-center" />
                        </div>

                        <div className="flex justify-start md:justify-center gap-[0.05em] flex-wrap overflow-hidden py-1 md:py-2">
                            {(t.hero.message.title_line3 + " " + t.hero.message.title_line4).split("").map((char, i) => (
                                <span key={`l3-${i}`} className="hero-char inline-block origin-bottom invisible">{char === " " ? "\u00A0" : char}</span>
                            ))}
                        </div>
                    </h2>

                    {/* Gradient Line - Hidden on Mobile or Adjusted */}
                    <div className="hero-meta-line w-px h-12 md:h-16 bg-gradient-to-b from-cyan-400 to-transparent mb-6 md:mb-4 opacity-80 hidden md:block invisible"></div>
                    <div className="hero-meta-line w-16 h-px bg-gradient-to-r from-cyan-400 to-transparent mb-6 opacity-80 md:hidden ml-1 invisible"></div>


                    <p className="hero-tagline text-lg md:text-2xl text-slate-200 font-light max-w-2xl leading-relaxed drop-shadow-md mb-8 md:mb-6 whitespace-pre-line w-full md:w-auto invisible">
                        {t.hero.message.tagline_prefix} <span className="italic font-semibold text-white/90">{t.hero.message.tagline_highlight}</span>
                    </p>

                    <div ref={buttonRef} className="hero-btn pointer-events-auto relative z-[60] self-start md:self-center invisible">
                        <Link href="/tours" className="btn-primary !w-auto !h-[56px] shadow-[0_30px_60px_rgba(0,0,0,0.2)] px-6 group flex items-center gap-4">
                            <span>{t.common.explore_tours}</span>
                            <div className="w-8 h-8 rounded-full bg-slate-950/5 flex items-center justify-center transition-transform group-hover:scale-110">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-[-5%] md:bottom-[-15%] mb-[20px] left-0 w-full h-[50vh] md:h-[45vh] z-50 pointer-events-none select-none overflow-visible">
                    
                    {/* Background Layers (Slowest, smallest, lowest opacity) */}
                    <div className="absolute bottom-[5%] left-0 w-full animate-cloud opacity-20 invisible" style={{ animationDuration: '150s', animationDelay: '-10s' }}>
                         <img src={cloudHero1.src} alt="" className="w-[110vw] md:w-[40vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[10%] left-0 w-full animate-cloud opacity-15 invisible" style={{ animationDuration: '170s', animationDelay: '-80s' }}>
                         <img src={cloudHero3.src} alt="" className="w-[100vw] md:w-[35vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full animate-cloud opacity-25 invisible" style={{ animationDuration: '135s', animationDelay: '-40s' }}>
                         <img src={cloudHero4.src} alt="" className="w-[120vw] md:w-[44vw] h-auto object-contain" />
                    </div>

                    {/* Mid Layers (Medium speed, medium opacity) */}
                    <div className="absolute bottom-[2%] left-0 w-full animate-cloud opacity-40 invisible" style={{ animationDuration: '115s', animationDelay: '-25s' }}>
                         <img src={cloudHero2.src} alt="" className="w-[90vw] md:w-[31vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-5%] left-0 w-full animate-cloud opacity-50 invisible" style={{ animationDuration: '100s', animationDelay: '-65s' }}>
                         <img src={cloudHero1.src} alt="" className="w-[100vw] md:w-[34vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[8%] left-0 w-full animate-cloud opacity-35 invisible" style={{ animationDuration: '110s', animationDelay: '-15s' }}>
                         <img src={cloudHero3.src} alt="" className="w-[80vw] md:w-[26vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-2%] left-0 w-full animate-cloud opacity-45 invisible" style={{ animationDuration: '90s', animationDelay: '-95s' }}>
                         <img src={cloudHero4.src} alt="" className="w-[105vw] md:w-[37vw] h-auto object-contain" />
                    </div>

                    {/* Foreground Layers (Fastest, brightest, sharpest) */}
                    <div className="absolute bottom-[-10%] left-0 w-full animate-cloud opacity-70 invisible" style={{ animationDuration: '75s', animationDelay: '-35s' }}>
                         <img src={cloudHero2.src} alt="" className="w-[90vw] md:w-[29vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[4%] left-0 w-full animate-cloud opacity-60 invisible" style={{ animationDuration: '65s', animationDelay: '-55s' }}>
                         <img src={cloudHero1.src} alt="" className="w-[80vw] md:w-[25vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-8%] left-0 w-full animate-cloud opacity-85 invisible" style={{ animationDuration: '55s', animationDelay: '-10s' }}>
                         <img src={cloudHero3.src} alt="" className="w-[95vw] md:w-[32vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-4%] left-0 w-full animate-cloud opacity-90 invisible" style={{ animationDuration: '45s', animationDelay: '-85s' }}>
                         <img src={cloudHero4.src} alt="" className="w-[85vw] md:w-[27vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-5%] left-0 w-full animate-cloud opacity-50 invisible" style={{ animationDuration: '125s', animationDelay: '-110s' }}>
                         <img src={cloudHero2.src} alt="" className="w-[115vw] md:w-[42vw] h-auto object-contain" />
                    </div>
                    
                    <style jsx>{`
                        @keyframes cloud-travel-optimized {
                            0% { transform: translate3d(-100%, 0, 0); }
                            100% { transform: translate3d(100vw, 0, 0); }
                        }
                        .animate-cloud { 
                            animation: cloud-travel-optimized linear infinite; 
                            will-change: transform;
                            backface-visibility: hidden;
                            mix-blend-mode: screen;
                        }
                    `}</style>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[30vh] z-50 pointer-events-none select-none">
                    <div className="absolute bottom-0 w-full h-full backdrop-blur-[4px] [mask-image:linear-gradient(to_top,black,transparent_80%)] opacity-40"></div>
                    <div className="absolute bottom-0 w-full h-[10vh] translate-y-1/2 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,transparent,black_50%,transparent)] opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/20 to-transparent opacity-40"></div>
                </div>

            </header>
        </div>
    );
}
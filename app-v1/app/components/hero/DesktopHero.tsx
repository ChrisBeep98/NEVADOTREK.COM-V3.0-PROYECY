"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, MountainSnow, Compass, Thermometer, Wind } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const VIDEO_URL = "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4";

export default function DesktopHero() {
    const { t } = useLanguage();
    
    const containerRef = useRef<HTMLDivElement>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const contentGroupRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [weather] = useState({ temp: -5, wind: 12 });

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.fromTo(videoRef.current, 
            { scale: 1.1, filter: "brightness(0)" },
            { scale: 1.05, filter: "brightness(1)", duration: 2, ease: "power2.out" }
        );

        tl.from(".corner-ui", {
            y: -20,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out"
        }, "-=1.5");

        tl.from(".hero-char", {
            y: 100,
            opacity: 0,
            rotateX: -90,
            stagger: 0.03,
            duration: 1.2,
            ease: "expo.out"
        }, "-=1");

        tl.from(".hero-meta-line", { scaleY: 0, transformOrigin: "top", duration: 0.8, ease: "power3.inOut" }, "-=0.8");
        tl.from(".hero-tagline", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
        tl.from(".hero-btn", { y: 20, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");

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

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="hidden md:block bg-[#02040a] text-white relative h-screen z-40 overflow-x-clip">
            <header ref={heroSectionRef} className="relative h-full w-full flex items-center justify-center overflow-hidden">
                
                <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                    <video 
                        ref={videoRef}
                        autoPlay muted loop playsInline 
                        className="w-full h-full object-cover will-change-transform"
                    >
                        <source src={VIDEO_URL} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none"></div>
                </div>

                <div className="absolute inset-0 z-10 pointer-events-none p-[var(--spacing-frame)] flex flex-col justify-between overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="corner-ui flex flex-col">
                            <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase mb-1">Est. 2025</span>
                            <div className="flex items-center gap-2">
                                <MountainSnow className="w-4 h-4 text-white/80" />
                                <span className="text-xs font-bold tracking-widest text-white/90">THE ANDEAN EXPERIENCE</span>
                            </div>
                        </div>
                        
                        <div className="corner-ui flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                                <Thermometer className="w-3.5 h-3.5" />
                                <span>{weather.temp}°C</span>
                            </div>
                            <div className="w-px h-3 bg-white/20"></div>
                            <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                                <Wind className="w-3.5 h-3.5" />
                                <span>{weather.wind}KT</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div className="corner-ui flex items-center gap-3 group">
                            <div className="w-[1px] h-8 bg-gradient-to-b from-cyan-500 to-transparent group-hover:h-12 transition-all duration-500"></div>
                            <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 group-hover:text-cyan-400 transition-colors">
                                Scroll to Explore
                            </span>
                        </div>
                        
                        <div className="corner-ui text-right">
                             <div className="flex items-center justify-end gap-2 mb-2">
                                <Compass className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                                <span className="text-[9px] font-mono tracking-widest text-cyan-400">LOC: 4.63°N 75.57°W</span>
                             </div>
                             <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/40 w-full h-full -translate-x-full animate-[shimmer_3s_infinite]"></div>
                             </div>
                        </div>
                    </div>
                </div>

                <div 
                    ref={contentGroupRef} 
                    className="relative z-20 flex flex-col justify-center items-center text-center px-4"
                >
                    <h2 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-white leading-[0.9] tracking-tighter uppercase mix-blend-overlay drop-shadow-lg mb-8">
                        <div className="flex justify-center gap-[0.05em] flex-wrap overflow-hidden py-2">
                            {t.hero.message.title_line1.split("").map((char, i) => (
                                <span key={`l1-${i}`} className="hero-char inline-block origin-bottom">{char}</span>
                            ))}
                        </div>
                        <div className="flex justify-center gap-[0.05em] flex-wrap overflow-hidden py-2 text-cyan-100/90">
                            {t.hero.message.title_line2.split("").map((char, i) => (
                                <span key={`l2-${i}`} className="hero-char inline-block origin-bottom">{char}</span>
                            ))}
                        </div>
                        <div className="flex justify-center gap-[0.05em] flex-wrap overflow-hidden py-2">
                            {(t.hero.message.title_line3 + " " + t.hero.message.title_line4).split("").map((char, i) => (
                                <span key={`l3-${i}`} className="hero-char inline-block origin-bottom">{char === " " ? "\u00A0" : char}</span>
                            ))}
                        </div>
                    </h2>

                    <div className="hero-meta-line w-px h-16 bg-gradient-to-b from-cyan-400 to-transparent mb-8 opacity-80"></div>

                    <p className="hero-tagline text-lg md:text-2xl text-slate-200 font-light max-w-2xl leading-relaxed drop-shadow-md mb-10">
                        {t.hero.message.tagline}
                    </p>

                    <div className="hero-btn pointer-events-auto">
                        <Link href="/tours" className="group relative flex items-center gap-5 pl-8 pr-2 py-2 bg-white/5 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300">
                            <span className="text-sm font-bold tracking-[0.2em] text-white uppercase group-hover:text-cyan-400 transition-colors">
                                {t.common.explore_tours}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-cyan-400 text-black flex items-center justify-center group-hover:rotate-[-45deg] group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* --- LAYER 4: ULTRA-DENSE CLOUD SEA (Optimized Parallax) --- */}
                <div className="absolute bottom-[-15%] mb-[20px] left-0 w-full h-[45vh] z-50 pointer-events-none select-none overflow-visible">
                    
                    {/* Background Layers (Slowest, smallest, lowest opacity) */}
                    <div className="absolute bottom-[5%] left-0 w-full animate-cloud opacity-20" style={{ animationDuration: '180s', animationDelay: '-10s' }}>
                         <img src="/images/cloud-hero-1.png" alt="" className="w-[45vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[10%] left-0 w-full animate-cloud opacity-15" style={{ animationDuration: '200s', animationDelay: '-80s' }}>
                         <img src="/images/cloud-hero-3.png" alt="" className="w-[40vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full animate-cloud opacity-25" style={{ animationDuration: '160s', animationDelay: '-40s' }}>
                         <img src="/images/cloud-hero-4.png" alt="" className="w-[50vw] h-auto object-contain" />
                    </div>

                    {/* Mid Layers (Medium speed, medium opacity) */}
                    <div className="absolute bottom-[2%] left-0 w-full animate-cloud opacity-40" style={{ animationDuration: '140s', animationDelay: '-25s' }}>
                         <img src="/images/cloud-hero-2.png" alt="" className="w-[35vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-5%] left-0 w-full animate-cloud opacity-50" style={{ animationDuration: '120s', animationDelay: '-65s' }}>
                         <img src="/images/cloud-hero-1.png" alt="" className="w-[38vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[8%] left-0 w-full animate-cloud opacity-35" style={{ animationDuration: '130s', animationDelay: '-15s' }}>
                         <img src="/images/cloud-hero-3.png" alt="" className="w-[30vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-2%] left-0 w-full animate-cloud opacity-45" style={{ animationDuration: '110s', animationDelay: '-95s' }}>
                         <img src="/images/cloud-hero-4.png" alt="" className="w-[42vw] h-auto object-contain" />
                    </div>

                    {/* Foreground Layers (Fastest, brightest, sharpest) */}
                    <div className="absolute bottom-[-10%] left-0 w-full animate-cloud opacity-70" style={{ animationDuration: '90s', animationDelay: '-35s' }}>
                         <img src="/images/cloud-hero-2.png" alt="" className="w-[33vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[4%] left-0 w-full animate-cloud opacity-60" style={{ animationDuration: '80s', animationDelay: '-55s' }}>
                         <img src="/images/cloud-hero-1.png" alt="" className="w-[28vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-8%] left-0 w-full animate-cloud opacity-85" style={{ animationDuration: '70s', animationDelay: '-10s' }}>
                         <img src="/images/cloud-hero-3.png" alt="" className="w-[36vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-4%] left-0 w-full animate-cloud opacity-90" style={{ animationDuration: '60s', animationDelay: '-85s' }}>
                         <img src="/images/cloud-hero-4.png" alt="" className="w-[31vw] h-auto object-contain" />
                    </div>
                    <div className="absolute bottom-[-5%] left-0 w-full animate-cloud opacity-50" style={{ animationDuration: '150s', animationDelay: '-110s' }}>
                         <img src="/images/cloud-hero-2.png" alt="" className="w-[48vw] h-auto object-contain" />
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
                            /* Cinematic Filter: Unified Atmosphere */
                            filter: grayscale(1) contrast(0.85) brightness(2.2) drop-shadow(0 4px 6px rgba(0,0,0,0.1));
                            mix-blend-mode: screen;
                        }
                    `}</style>
                </div>

                {/* --- PROFESSIONAL ATMOSPHERIC SEAM (Transparent Silk Update) --- */}
                <div className="absolute bottom-0 left-0 w-full h-[30vh] z-50 pointer-events-none select-none">
                    
                    {/* Layer 1: The 'Seam Eraser' (Masked Blur) */}
                    {/* This layer blurs without adding black, just softening whatever is behind it */}
                    <div className="absolute bottom-0 w-full h-full backdrop-blur-[4px] [mask-image:linear-gradient(to_top,black,transparent_80%)] opacity-40"></div>
                    
                    {/* Layer 2: Precision Edge Softener */}
                    <div className="absolute bottom-0 w-full h-[10vh] translate-y-1/2 backdrop-blur-[12px] [mask-image:linear-gradient(to_top,transparent,black_50%,transparent)] opacity-50"></div>

                    {/* Layer 3: Ultra-Soft Shadow Buffer (Very Transparent) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/20 to-transparent opacity-40"></div>
                </div>

            </header>
        </div>
    );
}
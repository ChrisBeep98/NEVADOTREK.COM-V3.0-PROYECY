'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Tour } from '../types/api';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Thermometer, Calendar, Mountain, Filter } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ToursClientProps {
    initialTours: Tour[];
}

type DifficultyFilter = 'ALL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';

export default function ToursClient({ initialTours }: ToursClientProps) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<DifficultyFilter>('ALL');
    
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Filter Logic
    const filteredTours = useMemo(() => {
        if (filter === 'ALL') return initialTours;
        return initialTours.filter(tour => 
            tour.difficulty.toUpperCase().includes(filter)
        );
    }, [filter, initialTours]);

    // Handle Filter Change & Animation Refresh
    const handleFilterChange = (newFilter: DifficultyFilter) => {
        setFilter(newFilter);
        // Reset scroll position slightly to re-trigger calculations smoothly
        if (scrollContainerRef.current) {
            gsap.to(window, { scrollTo: { y: scrollContainerRef.current, offsetY: 0 }, duration: 1 });
        }
    };

    // GSAP Horizontal Scroll Logic
    useGSAP(() => {
        if (!trackRef.current || !scrollContainerRef.current) return;

        const track = trackRef.current;
        const scrollContainer = scrollContainerRef.current;
        
        // Calculate the total width needed to scroll
        // (Track Width - Viewport Width)
        const getScrollAmount = () => {
            return -(track.scrollWidth - window.innerWidth);
        };

        const tween = gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
                trigger: scrollContainer,
                start: "top top",
                end: () => `+=${track.scrollWidth - window.innerWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // Update Progress Bar
                    if (progressBarRef.current) {
                        gsap.set(progressBarRef.current, { scaleX: self.progress });
                    }
                }
            }
        });

        // Parallax for images inside cards
        const images = gsap.utils.toArray('.tour-image-parallax') as HTMLElement[];
        images.forEach(img => {
            gsap.to(img, {
                objectPosition: "100% 50%",
                ease: "none",
                scrollTrigger: {
                    trigger: img.closest('.tour-card'),
                    containerAnimation: tween,
                    start: "left right",
                    end: "right left",
                    scrub: true
                }
            });
        });

        return () => {
            // Cleanup
            tween.kill();
        };

    }, { scope: containerRef, dependencies: [filteredTours] }); // Re-run when tours change

    return (
        <div ref={containerRef} className="bg-[#040918] min-h-screen text-white overflow-x-hidden">
            
            {/* 1. INTRO MANIFESTO */}
            <section className="h-[70vh] flex flex-col justify-center px-frame relative z-10">
                <div className="max-w-4xl">
                    <span className="text-cyan-500 font-bold tracking-[0.3em] text-xs mb-6 block">
                        THE COLLECTION // 2026
                    </span>
                    <h1 className="text-6xl md:text-8xl lg:text-[7vw] leading-[0.9] font-medium tracking-tighter mb-8 mix-blend-overlay opacity-90">
                        CHOOSE YOUR <br />
                        <span className="text-outline-white text-transparent bg-clip-text bg-white/10">EXPEDITION</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed border-l border-white/20 pl-6">
                        From the cloud forests of the lower Andes to the glacial peaks of the Cocuy. 
                        Each journey is crafted for a specific kind of spirit. 
                        Select your difficulty, breathe the thin air, and begin.
                    </p>
                </div>

                {/* Filter Interface */}
                <div className="mt-16 flex flex-wrap gap-4 items-center">
                    <Filter size={16} className="text-cyan-500 mr-2" />
                    {(['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'] as DifficultyFilter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => handleFilterChange(f)}
                            className={`px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border border-transparent hover:border-white/20 ${
                                filter === f 
                                    ? 'bg-white text-slate-950' 
                                    : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </section>

            {/* 2. HORIZONTAL SCROLL TRACK */}
            <section ref={scrollContainerRef} className="h-screen w-full relative flex flex-col justify-center overflow-hidden bg-[#020611]">
                
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5 z-50">
                    <div ref={progressBarRef} className="h-full bg-cyan-500 origin-left scale-x-0 will-change-transform"></div>
                </div>

                {/* The Track */}
                <div ref={trackRef} className="flex gap-[5vw] px-[5vw] items-center h-[80vh] w-fit">
                    
                    {filteredTours.map((tour, index) => (
                        <TourCardHorizontal key={tour.tourId} tour={tour} index={index} />
                    ))}

                    {/* End Card */}
                    <div className="w-[30vw] h-full flex items-center justify-center shrink-0 opacity-50">
                        <div className="text-center">
                            <h3 className="text-4xl font-bold text-white/20 mb-4">END OF LIST</h3>
                            <p className="text-xs tracking-widest text-white/40">SCROLL UP TO RETURN</p>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full px-frame py-6 flex justify-between items-center text-[10px] tracking-widest text-white/30 border-t border-white/5 bg-[#040918]">
                    <span>SCROLL TO EXPLORE</span>
                    <span>LAT: 6.2442° N // LON: 75.5812° W</span>
                </div>
            </section>

            {/* 3. SPACER / OUTRO */}
            <section className="h-[50vh] flex items-center justify-center bg-[#040918] relative z-20">
                <Link href="/contact" className="group flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                        <ArrowRight className="group-hover:-rotate-45 transition-transform duration-500" />
                    </div>
                    <span className="text-xs font-bold tracking-[0.3em]">START CUSTOM TRIP</span>
                </Link>
            </section>

        </div>
    );
}

// --- INTERNAL COMPONENT: HORIZONTAL CARD ---
function TourCardHorizontal({ tour, index }: { tour: Tour, index: number }) {
    return (
        <Link 
            href={`/tours/${tour.tourId}`}
            className="tour-card group relative w-[80vw] md:w-[60vw] lg:w-[40vw] h-[60vh] md:h-[70vh] shrink-0 block overflow-hidden border-l border-white/10 bg-[#060c21] hover:border-cyan-500/50 transition-colors duration-500"
        >
            {/* Image Container with Clip Path Reveal */}
            <div className="absolute inset-0 z-0 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                <img 
                    src={tour.images[0]} 
                    alt={tour.name.en}
                    className="tour-image-parallax w-full h-full object-cover object-left grayscale group-hover:grayscale-0 transition-all duration-700 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040918] via-transparent to-transparent opacity-90" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12">
                
                {/* Top: Meta */}
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500">
                        NO. 0{index + 1}
                    </span>
                    <div className="flex gap-2">
                        <span className={`px-3 py-1 text-[9px] font-bold tracking-wider uppercase border ${
                            tour.difficulty === 'Extreme' ? 'border-red-500 text-red-400' :
                            tour.difficulty === 'Hard' ? 'border-orange-500 text-orange-400' :
                            'border-white/20 text-white/60'
                        }`}>
                            {tour.difficulty}
                        </span>
                    </div>
                </div>

                {/* Bottom: Title & Info */}
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-none mb-4 text-white group-hover:text-cyan-50">
                        {tour.name.es}
                    </h2>
                    
                    <div className="flex items-center gap-6 text-xs text-slate-400 font-mono tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span className="flex items-center gap-2">
                            <Calendar size={12} /> {tour.totalDays} DAYS
                        </span>
                        <span className="flex items-center gap-2">
                            <Mountain size={12} /> {tour.altitude.es}
                        </span>
                        <span className="flex items-center gap-2">
                            <Thermometer size={12} /> {tour.temperature.es}
                        </span>
                    </div>
                </div>
            </div>

            {/* Hover Line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </Link>
    );
}
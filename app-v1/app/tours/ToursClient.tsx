'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Tour } from '../types/api';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ArrowLeft, Thermometer, Calendar, Mountain, Filter, ChevronDown, MapPin } from 'lucide-react';

interface ToursClientProps {
    initialTours: Tour[];
}

type DifficultyFilter = 'ALL' | 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';

export default function ToursClient({ initialTours }: ToursClientProps) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<DifficultyFilter>('ALL');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // Filter Logic
    const filteredTours = useMemo(() => {
        const result = filter === 'ALL' 
            ? initialTours 
            : initialTours.filter(tour => tour.difficulty.toUpperCase().includes(filter));
        return result;
    }, [filter, initialTours]);

    // Reset index when filter changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [filter]);

    // Navigation Handlers
    const nextSlide = () => {
        if (isAnimating) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % filteredTours.length);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + filteredTours.length) % filteredTours.length);
    };

    // --- ANIMATION LOGIC ---
    useGSAP(() => {
        if (filteredTours.length === 0) return;

        setIsAnimating(true);
        const currentTour = filteredTours[currentIndex];
        
        // Select elements
        const activeSlide = document.querySelector(`.slide-${currentIndex}`);
        const textElements = activeSlide?.querySelectorAll('.animate-text');
        const bgImage = activeSlide?.querySelector('.bg-image');
        const hudElements = activeSlide?.querySelectorAll('.animate-hud');

        // Reset state for entry
        gsap.set(activeSlide, { zIndex: 10, visibility: 'visible' });
        gsap.set(textElements, { y: 100, opacity: 0 });
        gsap.set(hudElements, { opacity: 0 });
        gsap.set(bgImage, { scale: 1.2 });

        const tl = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
                // Hide other slides
                filteredTours.forEach((_, idx) => {
                    if (idx !== currentIndex) {
                        gsap.set(`.slide-${idx}`, { zIndex: 0, visibility: 'hidden' });
                    }
                });
            }
        });

        // 1. Reveal Background (Clip Path Wipe)
        const clipStart = direction === 1 ? 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)';
        const clipEnd = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

        gsap.fromTo(activeSlide,
            { clipPath: clipStart },
            { clipPath: clipEnd, duration: 1.0, ease: "expo.inOut" }
        );

        // 2. Scale Image
        tl.to(bgImage, {
            scale: 1, duration: 1.5, ease: "power2.out"
        }, 0);

        // 3. Text Stagger
        tl.to(textElements, {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power3.out"
        }, 0.5);

        // 4. HUD Fade
        tl.to(hudElements, {
            opacity: 1, duration: 0.5
        }, 0.8);

    }, { dependencies: [currentIndex, filteredTours], scope: containerRef });


    if (filteredTours.length === 0) {
        return (
            <div className="h-screen bg-[#040918] flex flex-col items-center justify-center text-white">
                <p className="text-xl font-mono mb-4">NO EXPEDITIONS FOUND</p>
                <button 
                    onClick={() => setFilter('ALL')}
                    className="text-cyan-500 hover:underline tracking-widest text-xs"
                >
                    RESET FILTERS
                </button>
            </div>
        );
    }

    const currentTour = filteredTours[currentIndex];

    return (
        <div ref={containerRef} className="bg-[#040918] h-screen w-full relative overflow-hidden select-none">
            
            {/* --- GRAIN OVERLAY --- */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.07] mix-blend-overlay" 
                 style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/Noise.png")' }}>
            </div>

            {/* --- FILTER (HUD TOP RIGHT) --- */}
            <div className="absolute top-8 right-8 z-50 flex flex-col items-end">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-white/70 hover:text-cyan-400 uppercase transition-colors"
                >
                    [{filter}] FILTER <ChevronDown size={10} className={isFilterOpen ? 'rotate-180' : ''} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 flex flex-col items-end gap-1 mt-2 ${isFilterOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
                    {(['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'] as DifficultyFilter[]).map(f => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setIsFilterOpen(false); }}
                            className={`text-[9px] font-bold tracking-[0.2em] uppercase hover:text-white transition-colors py-1 ${filter === f ? 'text-cyan-500' : 'text-white/40'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN SLIDES --- */}
            {filteredTours.map((tour, index) => (
                <div 
                    key={tour.tourId} 
                    className={`slide-${index} absolute inset-0 w-full h-full bg-[#040918] flex items-center justify-center`}
                    style={{ visibility: index === 0 ? 'visible' : 'hidden' }} // Init first slide visible
                >
                    {/* Background */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img 
                            src={tour.images[0]} 
                            alt={tour.name.en} 
                            className="bg-image w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-80" />
                    </div>

                    {/* Content */}
                    <div className="relative z-20 container mx-auto px-frame w-full h-full flex flex-col justify-center">
                        
                        {/* Huge Title */}
                        <div className="overflow-hidden mb-4">
                            <h1 className="animate-text text-[12vw] md:text-[9vw] font-black tracking-tighter leading-[0.85] text-white mix-blend-overlay uppercase">
                                {tour.name.es.split(' ')[0]}
                            </h1>
                        </div>
                        <div className="overflow-hidden mb-8">
                             <h1 className="animate-text text-[12vw] md:text-[9vw] font-black tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 uppercase ml-[5vw]">
                                {tour.name.es.split(' ').slice(1).join(' ') || "EXPEDITION"}
                            </h1>
                        </div>

                        {/* Details */}
                        <div className="max-w-xl ml-[5vw]">
                            <p className="animate-text text-lg md:text-xl text-slate-300 leading-relaxed font-light mb-8 border-l-2 border-cyan-500 pl-6">
                                {tour.shortDescription.es}
                            </p>

                            <div className="animate-text flex gap-4">
                                <Link 
                                    href={`/tours/${tour.tourId}`}
                                    className="btn-primary flex items-center gap-3 bg-white text-black px-8 py-4 rounded-none font-bold text-xs tracking-[0.2em] hover:bg-cyan-400 transition-colors uppercase"
                                >
                                    Start Mission <ArrowRight size={14} />
                                </Link>
                                <div className="flex items-center gap-4 px-6 border border-white/20 text-white/60 font-mono text-xs tracking-widest uppercase">
                                    <span>{tour.difficulty}</span>
                                    <span>//</span>
                                    <span>{tour.totalDays} Days</span>
                                </div>
                            </div>
                        </div>

                        {/* HUD Elements */}
                        <div className="animate-hud absolute bottom-12 left-8 md:left-12 flex flex-col gap-2 font-mono text-[9px] text-cyan-500/80 tracking-widest">
                            <div className="flex items-center gap-2">
                                <Mountain size={12} /> ALT: {tour.altitude.es}
                            </div>
                            <div className="flex items-center gap-2">
                                <Thermometer size={12} /> TMP: {tour.temperature.es}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={12} /> LAT: {6.0 + (index * 0.1)}° N
                            </div>
                        </div>

                        <div className="animate-hud absolute top-12 left-8 md:left-12">
                             <span className="text-[10px] font-bold tracking-[0.3em] text-white/40 border border-white/10 px-3 py-1">
                                No. {String(index + 1).padStart(2, '0')}
                             </span>
                        </div>

                    </div>
                </div>
            ))}

            {/* --- CONTROLS --- */}
            {/* Clickable Areas */}
            <div onClick={prevSlide} className="absolute inset-y-0 left-0 w-[15vw] z-40 cursor-pointer group flex items-center justify-start pl-8 hover:bg-gradient-to-r hover:from-black/50 hover:to-transparent transition-all">
                <ArrowLeft className="text-white/20 group-hover:text-cyan-400 transition-colors scale-150" />
            </div>
            <div onClick={nextSlide} className="absolute inset-y-0 right-0 w-[15vw] z-40 cursor-pointer group flex items-center justify-end pr-8 hover:bg-gradient-to-l hover:from-black/50 hover:to-transparent transition-all">
                <ArrowRight className="text-white/20 group-hover:text-cyan-400 transition-colors scale-150" />
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
                <div 
                    className="h-full bg-cyan-500 transition-all duration-500 ease-out"
                    style={{ width: `${((currentIndex + 1) / filteredTours.length) * 100}%` }}
                />
            </div>

        </div>
    );
}
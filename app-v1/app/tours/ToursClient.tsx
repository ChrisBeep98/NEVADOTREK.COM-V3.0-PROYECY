'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTours } from '../context/ToursContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Filter, SlidersHorizontal, Clock, Mountain, RefreshCcw } from 'lucide-react';
import TourCard from '../components/TourCard';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type DurationFilter = 'ALL' | 'SHORT' | 'MEDIUM' | 'LONG';

export default function ToursClient() {
    const { t, lang } = useLanguage();
    const { tours, loading } = useTours();
    
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // --- STATE ---
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
    const [durationFilter, setDurationFilter] = useState<DurationFilter>('ALL');

    // --- INTELLIGENT FILTER DATA ---
    const availableOptions = useMemo(() => {
        const diffs = new Set<string>();
        const durations = new Set<string>(['ALL']);

        tours.forEach(tour => {
            if (tour.difficulty) diffs.add(tour.difficulty.toUpperCase());
            const d = tour.totalDays;
            if (d < 3) durations.add('SHORT');
            else if (d >= 3 && d <= 5) durations.add('MEDIUM');
            else if (d > 5) durations.add('LONG');
        });

        return {
            difficulties: Array.from(diffs).sort(),
            durations: ['ALL', 'SHORT', 'MEDIUM', 'LONG'].filter(d => durations.has(d))
        };
    }, [tours]);

    // --- FILTER LOGIC ---
    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            const diff = (tour.difficulty || '').toUpperCase();
            const matchesDifficulty = selectedDifficulties.length === 0 || 
                                     selectedDifficulties.includes(diff);
            
            let matchesDuration = true;
            const d = tour.totalDays;
            if (durationFilter === 'SHORT') matchesDuration = d < 3;
            else if (durationFilter === 'MEDIUM') matchesDuration = d >= 3 && d <= 5;
            else if (durationFilter === 'LONG') matchesDuration = d > 5;

            return matchesDifficulty && matchesDuration;
        });
    }, [tours, selectedDifficulties, durationFilter]);


    // --- HANDLERS ---
    const toggleDifficulty = (diff: string) => {
        setSelectedDifficulties(prev => 
            prev.includes(diff) 
                ? prev.filter(d => d !== diff)
                : [...prev, diff]
        );
    };

    // --- ANIMATIONS ---
    useGSAP(() => {
        const tl = gsap.timeline();
        tl.fromTo('.hero-text', 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out" }
        )
        .fromTo('.filter-sidebar',
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        )
        .fromTo('.tour-grid-item',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" },
            "-=0.4"
        );
    }, { scope: containerRef, dependencies: [loading] });

    useEffect(() => {
        if (!gridRef.current || loading) return;
        gsap.fromTo(gridRef.current.children, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: true }
        );
    }, [filteredTours, loading]);


    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="text-cyan-500 animate-spin" size={40} />
                    <span className="text-journal-data text-muted">LOADING ARCHIVE...</span>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="bg-background min-h-screen text-foreground pb-32">
            
            {/* --- TOP SECTION: TACTICAL EXPEDITION DOSSIER --- */}
            <header className="relative pt-48 pb-40 px-frame overflow-hidden border-b border-white/5 bg-[#040918]">
                
                {/* 1. Tactical UI Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    {/* Corner Crosshairs */}
                    <div className="absolute top-12 left-12 w-8 h-8 border-t border-l border-white/20" />
                    <div className="absolute top-12 right-12 w-8 h-8 border-t border-r border-white/20" />
                    
                    {/* Altitude Scale (Right Edge) */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-8 items-center text-[8px] font-mono text-white/20 tracking-tighter">
                        <span>6000M</span>
                        <div className="w-[1px] h-12 bg-white/10" />
                        <span className="text-cyan-500 font-bold">4500M</span>
                        <div className="w-[1px] h-12 bg-white/10" />
                        <span>3000M</span>
                    </div>

                    {/* Scanner Line Animation */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/10 animate-scan-slow" />
                </div>
                
                <div className="max-w-none mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                    
                    {/* 2. LEFT SIDE: MASSIVE EDITORIAL TITLE */}
                    <div className="lg:col-span-8">
                        <div className="flex items-start gap-6">
                            <div className="w-[1px] h-32 bg-gradient-to-b from-cyan-500 via-white/20 to-transparent mt-4" />
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-[10px] font-mono text-cyan-500 tracking-[0.4em] uppercase">
                                        [ Archive_Type: {t.expeditions.archive.pretitle} ]
                                    </span>
                                </div>
                                <h1 className="hero-text text-[clamp(4rem,10vw,8rem)] leading-[0.85] font-black tracking-[-0.05em] text-white uppercase break-words">
                                    {lang === 'ES' ? (
                                        <>Nuestras<br /><span className="text-transparent stroke-text">Tours</span></>
                                    ) : (
                                        <>Our<br /><span className="text-transparent stroke-text">Tours</span></>
                                    )}
                                </h1>
                            </div>
                        </div>
                    </div>

                    {/* 3. RIGHT SIDE: METADATA & SYSTEM INFO */}
                    <div className="lg:col-span-4 lg:pl-12 border-l border-white/5 space-y-8">
                        
                        {/* Technical Metadata Table */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Location</span>
                                <span className="text-xs font-bold text-white tracking-wider uppercase">Colombian Andes</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Status</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                    <span className="text-xs font-bold text-white tracking-wider uppercase">Active_Feed</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Coord</span>
                                <span className="text-[10px] font-mono text-white/60 tracking-wider">4°35'56"N 74°04'51"W</span>
                            </div>
                        </div>

                        {/* Description Treated as Marginalia */}
                        <div className="relative">
                            <span className="absolute -left-6 top-0 text-[10px] font-mono text-cyan-500">01.</span>
                            <p className="hero-text text-sm md:text-base text-white/60 leading-relaxed italic font-light">
                                {t.expeditions.archive.description}
                            </p>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .stroke-text {
                        -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
                    }
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        50% { opacity: 0.5; }
                        100% { top: 100%; opacity: 0; }
                    }
                    .animate-scan-slow {
                        animation: scan 8s linear infinite;
                    }
                `}</style>
            </header>

            {/* --- MAIN CONTENT: FILTERS + GRID --- */}
            <div className="max-w-none mx-auto px-frame pt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* SIDEBAR: FILTERS */}
                    <aside className="filter-sidebar lg:w-64 flex-shrink-0">
                        <div className="sticky top-32 space-y-10">
                            
                            {/* Difficulty */}
                            <div>
                                <h3 className="text-journal-data text-muted mb-6 flex items-center gap-2">
                                    <Mountain size={12} /> {t.expeditions.archive.difficulty}
                                </h3>
                                <div className="space-y-2">
                                    {availableOptions.difficulties.map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => toggleDifficulty(diff)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-300 ${
                                                selectedDifficulties.includes(diff)
                                                    ? 'bg-foreground text-background border-foreground'
                                                    : 'bg-transparent text-muted border-border hover:border-foreground/30'
                                            }`}
                                        >
                                            <span className="text-journal-data font-bold">{diff}</span>
                                            {selectedDifficulties.includes(diff) && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <h3 className="text-journal-data text-muted mb-6 flex items-center gap-2">
                                    <Clock size={12} /> {t.expeditions.archive.duration}
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableOptions.durations.map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setDurationFilter(val as DurationFilter)}
                                            className={`py-3 rounded-lg border text-journal-data transition-all ${
                                                durationFilter === val
                                                    ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/50'
                                                    : 'bg-transparent text-muted border-surface hover:border-border hover:text-foreground'
                                            }`}
                                        >
                                            {val === 'ALL' ? 'ALL' : val === 'SHORT' ? '< 3D' : val === 'MEDIUM' ? '3-5D' : '> 5D'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Results Counter */}
                            <div className="pt-6 border-t border-border">
                                <span className="text-journal-data text-muted/50">
                                    {t.expeditions.archive.results_found.replace('{count}', filteredTours.length.toString())}
                                </span>
                            </div>

                        </div>
                    </aside>

                    {/* MAIN: GRID */}
                    <div className="flex-grow">
                        {filteredTours.length > 0 ? (
                            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-12">
                                {filteredTours.map((tour, index) => (
                                    <div key={tour.tourId} className="tour-grid-item">
                                        <TourCard 
                                            tour={tour} 
                                            index={index} 
                                            lang={lang} 
                                            className="h-[700px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-40 flex flex-col items-center justify-center border border-dashed border-border rounded-3xl bg-surface">
                                <Filter size={48} className="text-muted/20 mb-6" />
                                <h3 className="text-heading-l text-foreground mb-2 uppercase">{t.expeditions.archive.no_results}</h3>
                                <p className="text-body-std text-muted mb-8">{t.expeditions.archive.no_results_desc}</p>
                                <button 
                                    onClick={() => { setSelectedDifficulties([]); setDurationFilter('ALL'); }}
                                    className="btn-primary w-auto"
                                >
                                    {t.expeditions.archive.reset_filters}
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}
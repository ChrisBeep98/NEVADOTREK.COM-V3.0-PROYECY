'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTours } from '../context/ToursContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Filter, Clock, Mountain, RefreshCcw, Map } from 'lucide-react';
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
    const heroRef = useRef<HTMLDivElement>(null);

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
        
        // 1. Fog Movement (Organic Atmosphere)
        gsap.to('.fog-layer', {
            x: '-10%',
            duration: 20,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });

        // 2. Elegant Title Reveal
        tl.fromTo('.hero-reveal', 
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: "power3.out" }
        );

        // 3. Stats Fade In
        tl.fromTo('.hero-stats',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
            "-=0.5"
        );

    }, { scope: containerRef, dependencies: [loading] });

    useEffect(() => {
        if (!gridRef.current || loading) return;
        gsap.fromTo(gridRef.current.children, 
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", overwrite: true }
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
            
            {/* --- TOP SECTION: THE SILENT PEAK (Atmospheric Minimalism) --- */}
            <header ref={heroRef} className="relative h-[60vh] min-h-[500px] flex flex-col justify-end px-frame pb-12 md:pb-24 overflow-hidden bg-background -mt-20 md:mt-[104px]">
                
                {/* 0. Organic Atmosphere */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
                <div className="fog-layer absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/20 via-background to-background blur-3xl scale-150" />

                {/* 1. Main Typography Content */}
                <div className="relative z-10 w-full max-w-[1800px] mx-auto">
                    
                    {/* Top Tagline */}
                    <div className="mb-6 overflow-hidden">
                        <span className="hero-reveal block text-sub-label text-cyan-500 tracking-[0.2em] ml-1">
                            {lang === 'ES' ? 'EXPLORACIÓN GUIADA' : 'GUIDED EXPLORATION'}
                        </span>
                    </div>

                    {/* Clean Title */}
                    <div className="relative">
                        <h1 className="leading-[0.9] tracking-tight uppercase font-medium text-foreground select-none">
                            <div className="overflow-hidden">
                                <span className="hero-reveal block text-[10vw] md:text-[8vw]">
                                    {lang === 'ES' ? 'NUESTRAS' : 'OUR'}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="hero-reveal block text-[10vw] md:text-[8vw] text-muted-foreground/50">
                                    EXPEDICIONES
                                </span>
                            </div>
                        </h1>
                    </div>

                    {/* Bottom Info / Connection to Grid */}
                    <div className="hero-stats mt-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 border-l border-foreground/20 pl-6">
<div className="max-w-md hidden md:block">
                            <p className="text-body-std text-muted">
                                {lang === 'ES' 
                                    ? 'Descubre rutas diseñadas para conectar con la esencia de los Andes. Desde caminatas de un día hasta expediciones de alta montaña.' 
                                    : 'Discover routes designed to connect with essence of Andes. From day hikes to high mountain expeditions.'}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-2 md:gap-4 md:ml-auto">
                            <div className="bg-surface p-3 rounded-full">
                                <Map className="text-cyan-500 w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                                <span className="block text-2xl font-medium text-foreground leading-none">{tours.length}</span>
                                <span className="text-[10px] text-muted uppercase tracking-wider">Routes Available</span>
                            </div>
                        </div>
                    </div>

                </div>

            </header>

{/* --- MAIN CONTENT: FILTERS + GRID --- */}
            <div className="max-w-none mx-auto px-frame pt-0 md:pt-12">
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
                                                    : 'bg-transparent text-muted border-border hover:border-foreground/30'
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

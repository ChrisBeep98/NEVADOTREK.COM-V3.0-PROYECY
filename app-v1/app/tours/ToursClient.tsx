'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTours } from '../context/ToursContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Filter, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ, Clock, Mountain, RefreshCcw } from 'lucide-react';
import TourCard from '../components/TourCard';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

type SortOption = 'RECOMMENDED' | 'DURATION_ASC' | 'DURATION_DESC';
type DurationFilter = 'ALL' | 'SHORT' | 'MEDIUM' | 'LONG';

export default function ToursClient() {
    const { t, lang } = useLanguage();
    const { tours, loading } = useTours();
    
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // --- STATE ---
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
    const [durationFilter, setDurationFilter] = useState<DurationFilter>('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('RECOMMENDED');

    // --- FILTER LOGIC ---
    const filteredTours = useMemo(() => {
        let result = tours.filter(tour => {
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

        if (sortBy === 'DURATION_ASC') {
            result.sort((a, b) => a.totalDays - b.totalDays);
        } else if (sortBy === 'DURATION_DESC') {
            result.sort((a, b) => b.totalDays - a.totalDays);
        }

        return result;
    }, [tours, selectedDifficulties, durationFilter, sortBy]);


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
            
            {/* --- TOP SECTION: EDITORIAL HEADER --- */}
            <header className="pt-40 pb-20 px-frame border-b border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="hero-text inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md text-journal-data text-cyan-500 mb-6 uppercase">
                        {t.expeditions.archive.pretitle}
                    </div>
                    <h1 className="hero-text text-hero-title mb-8 uppercase italic text-foreground">
                        {t.expeditions.archive.title}
                    </h1>
                    <p className="hero-text text-body-lead text-muted max-w-2xl leading-relaxed">
                        {t.expeditions.archive.description}
                    </p>
                </div>
            </header>

            {/* --- MAIN CONTENT: FILTERS + GRID --- */}
            <div className="max-w-7xl mx-auto px-frame pt-12">
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
                                    {['EASY', 'MEDIUM', 'HARD', 'EXTREME'].map((diff) => (
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
                                    {[
                                        { label: 'ALL', value: 'ALL' },
                                        { label: '< 3D', value: 'SHORT' },
                                        { label: '3-5D', value: 'MEDIUM' },
                                        { label: '> 5D', value: 'LONG' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setDurationFilter(opt.value as DurationFilter)}
                                            className={`py-3 rounded-lg border text-journal-data transition-all ${
                                                durationFilter === opt.value
                                                    ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/50'
                                                    : 'bg-transparent text-muted border-surface hover:border-border hover:text-foreground'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <h3 className="text-journal-data text-muted mb-6 flex items-center gap-2">
                                    <SlidersHorizontal size={12} /> {t.expeditions.archive.sort_by}
                                </h3>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="w-full bg-surface border border-border rounded-lg py-3 px-4 text-journal-data text-foreground outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                                >
                                    <option value="RECOMMENDED">RECOMMENDED</option>
                                    <option value="DURATION_ASC">DURATION (SHORT - LONG)</option>
                                    <option value="DURATION_DESC">DURATION (LONG - SHORT)</option>
                                </select>
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
                                            className="h-[500px]"
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
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Tour } from '../types/api';
import { useLanguage } from '../context/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Filter, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ, Clock, Mountain } from 'lucide-react';
import TourCard from '../components/TourCard';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ToursClientProps {
    initialTours: Tour[];
}

type SortOption = 'RECOMMENDED' | 'DURATION_ASC' | 'DURATION_DESC';
type DurationFilter = 'ALL' | 'SHORT' | 'MEDIUM' | 'LONG'; // <3, 3-5, >5

export default function ToursClient({ initialTours }: ToursClientProps) {
    const { t, lang } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // --- STATE ---
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
    const [durationFilter, setDurationFilter] = useState<DurationFilter>('ALL');
    const [sortBy, setSortBy] = useState<SortOption>('RECOMMENDED');
    const [isFilterExpanded, setIsFilterExpanded] = useState(true); // Default open on desktop? Let's make it toggleable but distinct.

    // --- FILTER LOGIC ---
    const filteredTours = useMemo(() => {
        let result = [...initialTours];

        // 1. Difficulty Filter (Multi-select logic could be added, currently treating as OR if array used, logic below)
        if (selectedDifficulties.length > 0) {
            result = result.filter(tour => 
                selectedDifficulties.includes(tour.difficulty.toUpperCase())
            );
        }

        // 2. Duration Filter
        if (durationFilter !== 'ALL') {
            result = result.filter(tour => {
                const d = tour.totalDays;
                if (durationFilter === 'SHORT') return d < 3;
                if (durationFilter === 'MEDIUM') return d >= 3 && d <= 5;
                if (durationFilter === 'LONG') return d > 5;
                return true;
            });
        }

        // 3. Sorting
        if (sortBy === 'DURATION_ASC') {
            result.sort((a, b) => a.totalDays - b.totalDays);
        } else if (sortBy === 'DURATION_DESC') {
            result.sort((a, b) => b.totalDays - a.totalDays);
        }
        // Recommended usually means default API order or specific logic (isFeatured, etc). 
        // We'll assume initialTours order is 'Recommended'.

        return result;
    }, [initialTours, selectedDifficulties, durationFilter, sortBy]);


    // --- HANDLERS ---
    const toggleDifficulty = (diff: string) => {
        setSelectedDifficulties(prev => 
            prev.includes(diff) 
                ? prev.filter(d => d !== diff)
                : [...prev, diff]
        );
    };

    // --- ANIMATION ---
    // Animate Grid Items on Filter Change
    useEffect(() => {
        if (!gridRef.current) return;
        
        const ctx = gsap.context(() => {
            gsap.fromTo(gridRef.current?.children || [], 
                { opacity: 0, y: 30, scale: 0.98 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    duration: 0.4, 
                    stagger: 0.05, 
                    ease: "power2.out", 
                    overwrite: true 
                }
            );
        }, gridRef);

        return () => ctx.revert();
    }, [filteredTours]);

    // Hero Animation
    useGSAP(() => {
        const tl = gsap.timeline();
        tl.fromTo('.hero-title-char', 
            { y: 100, opacity: 0, rotateX: -45 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.05, ease: "power3.out" }
        )
        .fromTo('.filter-panel',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        );
    }, { scope: containerRef });


    return (
        <div ref={containerRef} className="bg-[#040918] min-h-screen text-white selection:bg-cyan-500/30">
            
            {/* --- HERO SECTION --- */}
            <section className="pt-32 pb-16 px-frame relative z-10">
                <div className="max-w-7xl mx-auto">
                    <span className="text-cyan-500 font-mono text-xs tracking-[0.3em] uppercase block mb-6">
                        The Collection // 2026
                    </span>
                    <h1 className="overflow-hidden flex flex-wrap gap-x-6 gap-y-2 text-6xl md:text-8xl lg:text-[7vw] font-bold tracking-tighter leading-[0.9] mb-8 text-white">
                        {"NEVADO EXPEDITIONS".split(' ').map((word, i) => (
                            <span key={i} className="inline-block overflow-hidden">
                                <span className="hero-title-char inline-block">{word}</span>
                            </span>
                        ))}
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed border-l-2 border-white/10 pl-6">
                        Curated journeys into the heart of the Andes. From beginner treks to technical ascents, find the expedition that calls to you.
                    </p>
                </div>
            </section>

            {/* --- FILTER CONSOLE (Sticky) --- */}
            <div className="sticky top-[80px] z-40 px-frame mb-12">
                <div className="filter-panel max-w-7xl mx-auto bg-[#060c21]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300">
                    
                    {/* Header / Toggle (Visible on Mobile) */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 gap-4 border-b border-white/5">
                        
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                <SlidersHorizontal size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold tracking-widest uppercase text-white">Filter Console</h3>
                                <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                                    {filteredTours.length} RESULTS FOUND
                                </span>
                            </div>
                        </div>

                        {/* Sort Control */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:block">SORT BY:</span>
                            <div className="relative">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="appearance-none bg-black/40 border border-white/10 rounded-lg py-2 pl-4 pr-10 text-xs font-bold tracking-wider text-white hover:border-cyan-500/50 transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-cyan-500"
                                >
                                    <option value="RECOMMENDED">RECOMMENDED</option>
                                    <option value="DURATION_ASC">DURATION (SHORT - LONG)</option>
                                    <option value="DURATION_DESC">DURATION (LONG - SHORT)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                                    {sortBy === 'DURATION_ASC' ? <ArrowUpAZ size={14} /> : <ArrowDownAZ size={14} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Options Area */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                        
                        {/* Difficulty Column */}
                        <div className="lg:col-span-7">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Mountain size={12} /> Difficulty Level
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {['EASY', 'MEDIUM', 'HARD', 'EXTREME'].map((diff) => {
                                    const isActive = selectedDifficulties.includes(diff);
                                    return (
                                        <button
                                            key={diff}
                                            onClick={() => toggleDifficulty(diff)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase border transition-all duration-200 ${
                                                isActive 
                                                    ? 'bg-white text-slate-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                                                    : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                                            }`}
                                        >
                                            {diff}
                                        </button>
                                    );
                                })}
                                {selectedDifficulties.length > 0 && (
                                    <button 
                                        onClick={() => setSelectedDifficulties([])}
                                        className="px-4 py-2 text-[10px] text-cyan-500 hover:text-cyan-300 font-bold tracking-widest underline decoration-cyan-500/30 hover:decoration-cyan-500"
                                    >
                                        CLEAR
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Duration Column */}
                        <div className="lg:col-span-5 border-t md:border-t-0 md:border-l border-white/5 md:pl-8 pt-6 md:pt-0">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Clock size={12} /> Duration
                            </span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setDurationFilter('ALL')}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                                        durationFilter === 'ALL' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50' : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    ANY
                                </button>
                                <button
                                    onClick={() => setDurationFilter('SHORT')}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                                        durationFilter === 'SHORT' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50' : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    &lt; 3 DAYS
                                </button>
                                <button
                                    onClick={() => setDurationFilter('MEDIUM')}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                                        durationFilter === 'MEDIUM' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50' : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    3-5 DAYS
                                </button>
                                <button
                                    onClick={() => setDurationFilter('LONG')}
                                    className={`px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all ${
                                        durationFilter === 'LONG' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50' : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    &gt; 5 DAYS
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            {/* --- GRID SECTION --- */}
            <section className="px-frame pb-32">
                <div ref={gridRef} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
                    {filteredTours.length > 0 ? (
                        filteredTours.map((tour, index) => (
                            <TourCard key={tour.tourId} tour={tour} index={index} lang={lang} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-60">
                            <Filter size={48} className="text-slate-600 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">NO EXPEDITIONS FOUND</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">
                                Adjust your filters to find your next adventure.
                            </p>
                            <button 
                                onClick={() => { setSelectedDifficulties([]); setDurationFilter('ALL'); }}
                                className="btn-secondary w-auto px-8"
                            >
                                RESET ALL FILTERS
                            </button>
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}
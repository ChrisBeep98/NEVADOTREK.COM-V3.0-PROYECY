'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Departure } from '../../types/api';
import { Users, ArrowRight, Activity, Flame, Tag, Zap } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const THEME_COLORS = {
    cyan: '#06b6d4',
    orange: '#f97316',
    purple: '#a855f7',
};

export default function TourDepartures({ departures }: { departures: Departure[]; tourId: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    const getDynamicPrice = (currentPax: number, tiers: any[]) => {
        const nextPaxCount = currentPax + 1;
        const tier = tiers.find(t => nextPaxCount >= t.minPax && nextPaxCount <= t.maxPax) || tiers[0];
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(tier.priceCOP);
    };

    useGSAP(() => {
        const frames = gsap.utils.toArray('.expedition-frame');
        
        frames.forEach((frame: any) => {
            const available = parseInt(frame.getAttribute('data-available') || '0');
            const color = available <= 4 ? THEME_COLORS.orange : THEME_COLORS.cyan;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: frame,
                    start: "top 85%", 
                    toggleActions: "play none none none" 
                }
            });

            tl.fromTo(frame.querySelector('.bracket-line-top'), 
                { width: "0%", backgroundColor: "rgba(255,255,255,0.05)" },
                { width: "100%", backgroundColor: `${color}4D`, duration: 0.5, ease: "power2.out" }
            )
            .fromTo(frame.querySelector('.frame-content'),
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, "-=0.3"
            );

            const bottomLine = frame.querySelector('.bracket-line-bottom');
            if (bottomLine) {
                tl.fromTo(bottomLine,
                    { width: "0%", backgroundColor: "rgba(255,255,255,0.05)" },
                    { width: "100%", backgroundColor: `${color}4D`, duration: 0.5, ease: "power2.out" }, 0
                );
            }
        });

    }, { scope: containerRef });

    if (!departures || departures.length === 0) return null;

    return (
        <section id="dates" ref={containerRef} className="bg-background section-v-spacing px-frame border-t border-border relative transition-colors duration-500">
            <div className="max-w-6xl mx-auto w-full">
                
                {/* 1. Header */}
                <div className="mb-12 md:mb-24 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-cyan-500" />
                            <span className="text-sub-label text-cyan-500 block uppercase tracking-widest">Únete a la cordada</span>
                        </div>
                        <h2 className="text-h-section-title text-foreground">
                            Próximas salidas
                        </h2>
                    </div>
                    <div className="hidden md:flex items-center gap-2 opacity-20">
                        <Activity className="w-4 h-4 text-foreground" />
                        <span className="text-[8px] font-mono text-foreground uppercase tracking-[0.4em]">Grid established</span>
                    </div>
                </div>

                {/* 2. The Grid */}
                <div className="flex flex-col">
                    {departures.map((dep, index) => {
                        const date = new Date(dep.date._seconds * 1000);
                        const day = date.getDate();
                        const month = date.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
                        const available = dep.maxPax - dep.currentPax;
                        const isLast = index === departures.length - 1;
                        const isHot = available <= 4;
                        const currentPrice = getDynamicPrice(dep.currentPax, dep.pricingSnapshot);

                        return (
                            <div 
                                key={dep.departureId} 
                                data-available={available}
                                className="expedition-frame relative py-8 md:py-14 px-6 md:px-4 mb-3 md:mb-0 group cursor-pointer bg-surface md:bg-transparent border border-border md:border-none rounded-[6px] md:rounded-none transition-all duration-500 md:hover:bg-surface active:scale-[0.98] md:active:scale-100 md:hover:translate-x-2"
                            >
                                {/* Desktop Separators */}
                                <div className="bracket-line-top absolute top-0 left-0 h-px bg-border origin-left hidden md:block"></div>
                                {isLast && (
                                    <div className="bracket-line-bottom absolute bottom-0 right-0 h-px bg-border origin-right hidden md:block"></div>
                                )}

                                <div className="frame-content flex flex-col md:grid md:grid-cols-4 md:items-center gap-5 md:gap-0 transition-all duration-500">
                                    
                                    {/* Column 1: Date */}
                                    <div className="flex items-center gap-5 min-w-[160px] md:min-w-0 relative">
                                        <span className="text-5xl md:text-6xl font-bold text-foreground tracking-tighter tabular-nums leading-none">
                                            {day < 10 ? `0${day}` : day}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-base md:text-lg font-bold text-foreground tracking-widest uppercase leading-none">
                                                {month}
                                            </span>
                                            <span className="text-[9px] font-mono text-muted uppercase tracking-[0.2em] mt-1">Season 2025</span>
                                        </div>

                                        {/* Mobile Action */}
                                        <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2">
                                            <ArrowRight className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                                        </div>
                                    </div>

                                    {/* md:contents allows the direct children to be columns of the parent grid */}
                                    <div className="grid grid-cols-2 md:contents border-t border-border pt-5 md:border-none md:pt-0">
                                        {/* Column 2: Availability */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-2 opacity-30 md:opacity-40 h-4">
                                                {isHot ? <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> : <Users className="w-3.5 h-3.5 text-foreground" />}
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-foreground">Disponibilidad</span>
                                            </div>
                                            <span className={`text-xs md:text-xl font-bold leading-none ${isHot ? 'text-orange-500' : 'text-emerald-500'} tabular-nums`}>
                                                {available} <span className="text-[10px] md:text-xs opacity-50 font-medium tracking-normal">{isHot ? '¡ÚLTIMOS!' : 'CUPOS'}</span>
                                            </span>
                                        </div>

                                        {/* Column 3: Price */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-2 opacity-30 md:opacity-40 h-4">
                                                <Tag className="w-3.5 h-3.5 text-foreground hidden md:block" />
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-foreground hidden md:block">Precio por persona</span>
                                            </div>
                                            <span className="text-base md:text-xl font-bold text-foreground/80 uppercase tracking-tight tabular-nums leading-none">
                                                {currentPrice} <span className="text-[9px] md:text-[11px] text-muted font-medium">COP</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Column 4: Desktop Action */}
                                    <div className="hidden md:flex flex-col items-end">
                                        <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center transition-all duration-500 group-hover:bg-foreground group-hover:text-background">
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                        <span className="mt-2 text-[8px] font-black tracking-[0.2em] text-foreground/20 uppercase text-center w-10 block">Join</span>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
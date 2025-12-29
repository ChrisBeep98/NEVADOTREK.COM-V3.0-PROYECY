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
        <section id="dates" ref={containerRef} className="bg-slate-950 section-v-spacing px-frame border-t border-white/5 relative">
            <div className="max-w-6xl mx-auto w-full">
                
                {/* 1. Header Updated */}
                <div className="mb-12 md:mb-24 flex items-end justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-cyan-500" />
                            <span className="text-sub-label text-cyan-500 block uppercase tracking-widest">Únete a la cordada</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight uppercase leading-none">
                            PRÓXIMAS SALIDAS
                        </h2>
                    </div>
                    <div className="hidden md:flex items-center gap-2 opacity-20">
                        <Activity className="w-4 h-4 text-white" />
                        <span className="text-[8px] font-mono text-white uppercase tracking-[0.4em]">Grid established</span>
                    </div>
                </div>

                {/* 2. The List */}
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
                                className="expedition-frame relative p-5 md:py-14 md:px-4 mb-3 md:mb-0 group cursor-pointer bg-white/[0.03] md:bg-transparent border border-white/5 md:border-none rounded-[6px] md:rounded-none transition-all duration-500 md:hover:bg-white/[0.01] active:scale-[0.98] md:active:scale-100"
                            >
                                {/* Desktop Separators */}
                                <div className="bracket-line-top absolute top-0 left-0 h-px bg-white/5 origin-left hidden md:block"></div>
                                {isLast && (
                                    <div className="bracket-line-bottom absolute bottom-0 right-0 h-px bg-white/5 origin-right hidden md:block"></div>
                                )}

                                <div className="frame-content flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8 transition-all duration-500 md:group-hover:translate-x-2">
                                    
                                    {/* Date Block */}
                                    <div className="flex items-center gap-5 min-w-[160px] md:min-w-[180px] relative">
                                        <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter tabular-nums leading-none">
                                            {day < 10 ? `0${day}` : day}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-base md:text-lg font-bold text-white tracking-widest uppercase leading-none">
                                                {month}
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em] mt-1">Season 2025</span>
                                        </div>

                                        {/* Mobile Action: Centered with Date vertically */}
                                        <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2">
                                            <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>

                                    {/* Tech Data Grid */}
                                    <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-6 md:gap-12 border-t border-white/5 pt-5 md:border-none md:pt-0">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1 opacity-30 md:opacity-40">
                                                {isHot ? <Flame className="w-3 h-3 text-orange-500 animate-pulse" /> : <Users className="w-3 h-3 text-white" />}
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-white">Cupos</span>
                                            </div>
                                            <span className={`text-xs font-bold ${isHot ? 'text-orange-500' : 'text-emerald-400'}`}>
                                                {available} {isHot ? '¡ÚLTIMOS!' : ''}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1 opacity-30 md:opacity-40">
                                                <Tag className="w-3 h-3 text-white hidden md:block" />
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-white hidden md:block">Precio por persona</span>
                                            </div>
                                            <span className="text-base md:text-lg font-bold text-slate-300 uppercase tracking-tight">
                                                {currentPrice} <span className="text-[9px] text-slate-600 font-medium">COP</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Desktop Action */}
                                    <div className="hidden md:block">
                                        <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-slate-950">
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                        <span className="mt-2 text-[8px] font-black tracking-[0.2em] text-white/20 uppercase text-center block">Join</span>
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

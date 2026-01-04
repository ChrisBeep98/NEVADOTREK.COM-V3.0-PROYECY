'use client';

import React from 'react';
import { PricingTier } from '../../types/api';
import { Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TourPricingProps {
    pricing: PricingTier[];
}

export default function TourPricing({ pricing }: TourPricingProps) {
    const { t, lang } = useLanguage();
    const sortedPricing = pricing ? [...pricing].sort((a, b) => a.minPax - b.minPax) : [];

    return (
        <section id="pricing" className="bg-background section-v-spacing px-frame border-t border-white/5 relative overflow-hidden">
            
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/[0.02] -skew-x-12 translate-x-1/4 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* 1. Header Standardized */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 md:mb-32 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-cyan-500" />
                            <span className="text-sub-label">{t.tour_detail.pricing.pretitle}</span>
                        </div>
                        <h2 className="text-h-section-title text-white">{t.tour_detail.pricing.title.replace('{year}', '2025')}</h2>
                    </div>
                    <div className="md:text-right border-l md:border-l-0 md:border-r border-white/10 pl-6 md:pl-0 md:pr-6">
                        <p className="text-body-std text-slate-400 max-w-sm">
                            {t.tour_detail.pricing.desc}
                        </p>
                    </div>
                </div>

                {/* 2. Technical Matrix Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sortedPricing.map((tier, i) => {
                        const isBestValue = tier.minPax >= 3; 

                        return (
                            <div 
                                key={i}
                                className={`
                                    relative p-8 rounded-[6px] flex flex-col h-full transition-all duration-500 group
                                    ${isBestValue 
                                        ? 'bg-blue-500/[0.05] border border-blue-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)]' 
                                        : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'
                                    }
                                `}
                            >
                                {/* Group Size Indicator */}
                                <div className="flex items-center gap-3 mb-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isBestValue ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-white/10 bg-white/5 text-slate-500'}`}>
                                        <Users className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-journal-data text-slate-400">
                                        {tier.minPax === tier.maxPax 
                                            ? t.tour_detail.pricing.group_size.replace('{count}', tier.minPax.toString())
                                            : t.tour_detail.pricing.group_range.replace('{min}', tier.minPax.toString()).replace('{max}', tier.maxPax.toString())
                                        }
                                    </span>
                                </div>
                                
                                {/* Price Display */}
                                <div className="mb-10">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-4xl lg:text-5xl font-bold text-white tracking-tighter tabular-nums">
                                            {(tier.priceCOP / 1000000).toFixed(1)}
                                        </span>
                                        <span className="text-xl font-bold text-white tracking-tighter">M</span>
                                        <span className="text-[10px] font-mono text-slate-600 ml-2">COP</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                                            Est. ${(tier.priceUSD).toLocaleString(lang === 'ES' ? 'es-ES' : 'en-US')} USD
                                        </span>
                                    </div>
                                </div>

                                {/* Features Ledger */}
                                <div className="border-t border-white/5 pt-8 mb-10 flex-1">
                                    <ul className="space-y-4">
                                        {t.tour_detail.pricing.features.map((feat: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-3 text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                                                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500/50" /> 
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action Pill */}
                                <button className={`
                                    w-full py-4 px-6 rounded-full font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-3
                                    ${isBestValue 
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' 
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                                    }
                                `}>
                                    {t.tour_detail.pricing.request_slot} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info Footer */}
                <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 opacity-30">
                    <div className="h-px bg-white/10 flex-1 hidden md:block"></div>
                    <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-white text-center">
                        {t.tour_detail.pricing.disclaimer}
                    </span>
                    <div className="h-px bg-white/10 flex-1 hidden md:block"></div>
                </div>

            </div>
        </section>
    );
}
'use client';

import React from 'react';
import { PricingTier } from '../../types/api';
import { Users, Check, ArrowRight } from 'lucide-react';

interface TourPricingProps {
    pricing: PricingTier[];
    tourId: string;
}

export default function TourPricing({ pricing, tourId }: TourPricingProps) {
    
    // Sort pricing by minPax to show hierarchy (Solo -> Group)
    // Add safety check in case pricing is undefined/null
    const sortedPricing = pricing ? [...pricing].sort((a, b) => a.minPax - b.minPax) : [];

    return (
        <section id="pricing" className="bg-slate-950 section-v-spacing px-frame border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div>
                        <span className="text-sub-label text-orange-500 mb-4 block">INVESTMENT</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">TARIFAS 2025</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-light text-slate-400 max-w-sm leading-relaxed">
                            Precios por persona en Pesos Colombianos (COP). <br className="hidden md:block"/>
                            Incluye seguro, guianza experta y logística integral.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sortedPricing.map((tier, i) => {
                        const isBestValue = tier.minPax >= 3; 

                        return (
                            <div 
                                key={i}
                                className={`
                                    relative p-8 rounded-2xl flex flex-col h-full transition-all duration-500 group
                                    ${isBestValue 
                                        ? 'bg-blue-950/20 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]' 
                                        : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
                                    }
                                `}
                            >
                                {isBestValue && (
                                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase shadow-lg">
                                        Recomendado
                                    </div>
                                )}

                                <div className="mb-8 mt-2">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className={`p-2 rounded-lg ${isBestValue ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-400'}`}>
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
                                            {tier.minPax === tier.maxPax 
                                                ? `${tier.minPax} AVENTURERO` 
                                                : `${tier.minPax} - ${tier.maxPax} AVENTUREROS`
                                            }
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-4xl lg:text-5xl font-bold text-white tracking-tighter">
                                            {(tier.priceCOP / 1000000).toFixed(1)}
                                        </span>
                                        <span className="text-xl font-bold text-white tracking-tighter">M</span>
                                        <span className="text-xs text-slate-500 font-mono ml-2">COP</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-mono opacity-60">
                                        Approx ${tier.priceUSD} USD
                                    </p>
                                </div>

                                <div className="border-t border-white/5 pt-8 mb-8 flex-1">
                                    <ul className="space-y-4">
                                        <li className="flex items-center gap-3 text-sm font-light text-slate-300">
                                            <Check className="w-4 h-4 text-cyan-500 shrink-0" /> 
                                            <span>Guianza Personalizada</span>
                                        </li>
                                        <li className="flex items-center gap-3 text-sm font-light text-slate-300">
                                            <Check className="w-4 h-4 text-cyan-500 shrink-0" /> 
                                            <span>Seguro Total</span>
                                        </li>
                                        {tier.minPax === 1 && (
                                            <li className="flex items-center gap-3 text-sm font-light text-orange-300">
                                                <Check className="w-4 h-4 shrink-0" /> 
                                                <span>Salida Privada VIP</span>
                                            </li>
                                        )}
                                         <li className="flex items-center gap-3 text-sm font-light text-slate-300">
                                            <Check className="w-4 h-4 text-cyan-500 shrink-0" /> 
                                            <span>Equipo Técnico</span>
                                        </li>
                                    </ul>
                                </div>

                                <button className={`
                                    w-full py-4 px-6 rounded-xl font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-4
                                    ${isBestValue 
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50' 
                                        : 'bg-white/5 hover:bg-white/10 text-white'
                                    }
                                `}>
                                    Reservar <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

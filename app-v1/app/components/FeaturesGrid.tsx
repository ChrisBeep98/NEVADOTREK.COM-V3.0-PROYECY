"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mountain, Compass, ShieldCheck, Users, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES_STATIC = {
    "01": {
        icon: Mountain,
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop"
    },
    "02": {
        icon: Compass,
        img: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop"
    },
    "03": {
        icon: ShieldCheck,
        img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop"
    },
    "04": {
        icon: Users,
        img: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=1200&auto=format&fit=crop"
    }
};

export default function FeaturesGrid() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number>(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = t.features.items.map((item: any) => ({
        ...item,
        ...FEATURES_STATIC[item.id as keyof typeof FEATURES_STATIC]
    }));

    useGSAP(() => {
        gsap.fromTo(".feature-section-header", 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, y: 0, 
                duration: 1,
                ease: "power2.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 90%" }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-background section-v-spacing border-t border-border overflow-hidden transition-colors duration-500">
            
            {/* Header */}
            <div className="px-frame max-w-[1400px] mx-auto mb-16 md:mb-24 feature-section-header">
                <span className="text-sub-label mb-6 block opacity-50">{t.features.pretitle}</span>
                <h2 className="text-display-xl text-foreground">
                    {t.features.title_primary} <br/> <span className="text-muted opacity-40">{t.features.title_secondary}</span>
                </h2>
            </div>

            {/* Accordion Grid */}
            <div className="px-frame max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row h-[850px] md:h-[650px] gap-4">
                    
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {features.map((f: any, i: number) => {
                        const Icon = f.icon;
                        const isActive = activeId === i;
                        
                        return (
                            <div 
                                key={f.id}
                                onClick={() => setActiveId(i)}
                                onMouseEnter={() => { if (window.innerWidth >= 768) setActiveId(i); }}
                                className={`
                                    relative overflow-hidden cursor-pointer rounded-2xl border 
                                    transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[flex,height]
                                    ${isActive 
                                        ? 'flex-[12] md:flex-[15] border-cyan-500/20 shadow-2xl' 
                                        : 'h-16 md:h-auto md:flex-1 border-border opacity-60'
                                    }
                                `}
                            >
                                {/* BACKGROUND IMAGE */}
                                <div className="absolute inset-0 z-0 overflow-hidden bg-surface">
                                    <img 
                                        src={f.img} 
                                        alt={f.title}
                                        decoding="async"
                                        className={`
                                            w-full h-full object-cover transition-all duration-1000
                                            ${isActive ? 'opacity-100 scale-105 saturate-[1.1]' : 'opacity-30 scale-100 saturate-0'}
                                        `}
                                    />
                                    {/* MANTENIDO: Destello azul profundo para legibilidad de texto blanco */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-blue-950/80 via-blue-950/20' : 'from-transparent'} to-transparent z-10 transition-opacity duration-700`}></div>
                                </div>

                                {/* CONTENT */}
                                <div className={`absolute inset-0 p-6 md:p-10 flex flex-col z-20 pointer-events-none transition-all duration-500 ${isActive ? 'justify-between' : 'justify-center'}`}>
                                    
                                    {/* Active Badge */}
                                    <div className={`hidden md:flex items-center gap-4 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="p-3 bg-blue-950 text-white rounded-xl shadow-xl">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-journal-data font-bold text-white tracking-[0.2em] drop-shadow-md">{f.tag}</span>
                                    </div>

                                    {/* Mobile Centered Bar */}
                                    {!isActive && (
                                        <div className="flex md:hidden items-center justify-between w-full px-2">
                                            <span className="text-[10px] font-bold tracking-[0.3em] text-foreground uppercase">{f.title}</span>
                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                                        </div>
                                    )}

                                    {/* Labeling Section */}
                                    <div className={`flex flex-col gap-4 ${!isActive ? 'hidden md:flex' : 'flex'}`}>
                                        <div className={`transition-all duration-500 ${isActive ? 'translate-y-0' : 'md:rotate-[-90deg] md:-translate-y-20 opacity-20'}`}>
                                            <h3 className={`font-bold tracking-tighter uppercase transition-all duration-500
                                                ${isActive ? 'text-4xl md:text-6xl text-white' : 'text-xl text-foreground'}
                                            `}>
                                                {f.title}
                                            </h3>
                                        </div>

                                        <div className={`overflow-hidden transition-all duration-700 delay-100
                                            ${isActive ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}
                                        `}>
                                            <p className="text-sm md:text-body-std text-white max-w-lg mb-8 leading-relaxed font-medium border-l-2 border-white/30 pl-6 italic drop-shadow-md">
                                                &quot;{f.desc}&quot;
                                            </p>
                                            <div className="flex items-center gap-3 text-white group/btn pointer-events-auto">
                                                <span className="text-[10px] font-bold tracking-widest uppercase">{t.features.cta}</span>
                                                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                            </div>
                                        </div>
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
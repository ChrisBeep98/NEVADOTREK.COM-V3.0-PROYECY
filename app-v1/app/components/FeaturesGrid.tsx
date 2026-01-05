"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShieldCheck, MapPin, Sprout, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES_STATIC = {
    "01": { icon: ShieldCheck },
    "02": { icon: MapPin },
    "03": { icon: Sprout },
    "04": { icon: Compass }
};

export default function FeaturesGrid() {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = t.features.items.map((item: any) => ({
        ...item,
        ...FEATURES_STATIC[item.id as keyof typeof FEATURES_STATIC]
    }));

    useGSAP(() => {
        // Optimized Animation: Batch animate columns for better performance
        gsap.from(".feature-col", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            clearProps: "all", // Clear styles after animation to prevent layout issues
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-background section-v-spacing pb-32 border-t border-border relative">
            
            <div className="px-frame max-w-[1600px] mx-auto">
                
                {/* Header */}
                <div className="mb-20 md:mb-32 max-w-2xl">
                    <span className="text-sm font-bold tracking-[0.1em] text-muted-foreground mb-4 block normal-case">
                        // {t.features.pretitle}
                    </span>
                    <h2 className="text-h-section-title text-foreground normal-case">
                        {t.features.title_primary} <span className="text-muted-foreground">{t.features.title_secondary}</span>
                    </h2>
                </div>

                {/* Swiss Grid Layout - Clean & Performant */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative border-t border-border">
                    
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {features.map((f: any, i: number) => {
                        const Icon = f.icon;
                        
                        return (
                            <div key={f.id} className="feature-col relative p-6 md:p-8 lg:px-10 lg:py-12 flex flex-col gap-8 group hover:bg-surface transition-colors duration-300">
                                
                                {/* Vertical Divider (Desktop) */}
                                {i !== 0 && (
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden lg:block"></div>
                                )}
                                {/* Horizontal Divider (Mobile/Tablet) */}
                                {i !== 0 && (
                                    <div className="absolute top-0 left-0 right-0 h-px bg-border lg:hidden"></div>
                                )}

                                {/* Header: Icon & ID */}
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-sm font-medium tracking-wide text-foreground normal-case opacity-50 mt-2">0{i + 1}</span>
                                    
                                    {/* Icon with Dynamic System Colors */}
                                    <div className={`p-3 rounded-lg transition-transform duration-300 group-hover:scale-105 ${
                                        i === 0 ? 'bg-cyan-500/10 text-cyan-500' :
                                        i === 1 ? 'bg-orange-500/10 text-orange-500' :
                                        i === 2 ? 'bg-emerald-400/10 text-emerald-400' :
                                                  'bg-purple-500/10 text-purple-500'
                                    }`}>
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Title - Top Aligned */}
                                <div className="min-h-[60px] flex items-start">
                                    <h3 className="text-heading-l text-foreground normal-case">
                                        {f.title}
                                    </h3>
                                </div>

                                {/* Highlights List */}
                                {f.highlights && (
                                    <ul className="flex flex-col gap-3 py-4 border-t border-border/50 border-dashed">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {f.highlights.map((h: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm font-medium tracking-wide text-foreground/80 normal-case">
                                                <div className={`w-1 h-1 rounded-full mt-2 shrink-0 ${
                                                    i === 0 ? 'bg-cyan-500' :
                                                    i === 1 ? 'bg-orange-500' :
                                                    i === 2 ? 'bg-emerald-400' :
                                                              'bg-purple-500'
                                                }`}></div>
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Description */}
                                <p className="text-body-std text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                    {f.desc}
                                </p>

                            </div>
                        );
                    })}
                </div>

            </div>
            
        </section>
    );
}
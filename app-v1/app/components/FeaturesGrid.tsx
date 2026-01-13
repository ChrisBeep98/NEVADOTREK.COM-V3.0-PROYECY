"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ShieldCheck, MapPin, Sprout, Compass } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import { useLanguage } from '../context/LanguageContext';

interface FeatureItem {
    id: string;
    title: string;
    tag: string;
    highlights: string[];
    desc: string;
}

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
    const pretitleRef = useRef<HTMLSpanElement>(null);

    const features = t.features.items.map((item: FeatureItem) => ({
        ...item,
        ...FEATURES_STATIC[item.id as keyof typeof FEATURES_STATIC]
    }));

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useGSAP(() => {
        if (pretitleRef.current) {
            gsap.fromTo(pretitleRef.current,
                { y: 30, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1.0, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: pretitleRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        gsap.from(".altitude-card", {
            opacity: 0,
            y: 80,
            scale: 0.9,
            rotationX: 15,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

    }, { scope: containerRef });

    const iconColors = ['text-cyan-400', 'text-orange-400', 'text-emerald-400', 'text-purple-400'];
    const bgGradients = [
        'from-cyan-500/5 to-transparent',
        'from-orange-500/5 to-transparent',
        'from-emerald-400/5 to-transparent',
        'from-purple-500/5 to-transparent'
    ];
    const borderColors = ['border-cyan-500/15', 'border-orange-500/15', 'border-emerald-400/15', 'border-purple-500/15'];
    
    // Configuración de "Escalón" (Staircase Effect) para Desktop
    const stairSteps = [
        'lg:mt-8',       // Inicio suave
        'lg:mt-0',       // Punto alto
        'lg:mt-12',      // Valle suave
        'lg:mt-4'        // Recuperación
    ];

    return (
        <section ref={containerRef} className="bg-background section-v-spacing relative overflow-hidden">
            
            <div className="px-frame max-w-[1400px] mx-auto relative z-10">
                
                {/* Header */}
                <div className="mb-8 md:mb-16 text-center">
                    <span ref={pretitleRef} className="text-sub-label mb-4 block opacity-0">
                        {t.features.pretitle}
                    </span>
                    <div className="flex flex-wrap justify-center gap-x-3 text-h-section-title">
                        <SectionTitle 
                            title={t.features.title_primary} 
                            className="text-foreground"
                        />
                        <SectionTitle 
                            title={t.features.title_secondary} 
                            className="text-muted"
                        />
                    </div>
                </div>

                {/* Altitude Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-8 gap-y-2 lg:gap-y-0 items-start">
                    {features.map((f: FeatureItem & { icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }, i: number) => {
                        const Icon = f.icon;
                        const isHovered = hoveredIndex === i;
                        
                        return (
                            <div key={f.id} 
                                className={`altitude-card relative group perspective-1000 ${stairSteps[i]}`}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                
                                {/* Card Container with 3D Effect */}
                                <div 
                                    className={`relative px-3 md:px-6 py-4 md:py-8 rounded-lg md:rounded-xl min-h-[280px] bg-gradient-to-br ${bgGradients[i]} border border-foreground/5 
                                        backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]
                                        transition-all duration-700 ease-out
                                        ${isHovered ? 'scale-105 translate-y-[-8px] shadow-2xl shadow-foreground/5' : 'hover:translate-y-[-4px]'}
                                        will-change-transform`}
                                    style={{ 
                                        transformStyle: 'preserve-3d'
                                    }}
                                >
                                    
                                    {/* Altitude Marker */}
                                    <div className="hidden md:block absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-background rounded-full border border-foreground/10 text-[10px] font-mono tracking-widest text-foreground/40">
                                        {2000 + i * 1000}m
                                    </div>

                                    {/* Icon */}
                                    <div className={`mb-4 md:mb-6 p-2 md:p-3 rounded-2xl bg-background ${iconColors[i]} 
                                        transition-all duration-500 ${isHovered ? 'scale-110 rotate-12' : 'group-hover:rotate-6'}`}>
                                        <Icon size={20} strokeWidth={1.5} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg md:text-xl text-foreground font-medium mb-4 md:mb-5">
                                        {f.title}
                                    </h3>

                                    {/* Highlights */}
                                    {f.highlights && (
                                        <ul className={`space-y-3 md:space-y-4 border-t ${borderColors[i]} pt-5`}>
                                            {f.highlights.map((h: string, idx: number) => (
                                                <li key={idx} className="flex items-start" style={{ gap: '2px' }}>
                                                    <span className={`w-1 h-1 rounded-full mt-1.5 md:mt-2 shrink-0 ${iconColors[i]}`}></span>
                                                    <span className="text-xs md:text-sm text-muted group-hover:text-foreground/80 transition-colors leading-relaxed normal-case">{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Altitude Line Decorative */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-0 bg-gradient-to-t from-foreground/20 to-transparent 
                                        group-hover:h-12 transition-all duration-700" />
                                </div>

                            </div>
                        );
                    })}
                </div>

                {/* Base Line */}
                <div className="mt-16 md:mt-24 flex items-center justify-center gap-4 text-foreground/30">
                    <div className="flex-1 max-w-[200px] h-px bg-gradient-to-r from-transparent to-foreground/20" />
                    <span className="text-xs font-mono tracking-[0.2em]">BASE CAMP</span>
                    <div className="flex-1 max-w-[200px] h-px bg-gradient-to-l from-transparent to-foreground/20" />
                </div>

            </div>
            
        </section>
    );
}

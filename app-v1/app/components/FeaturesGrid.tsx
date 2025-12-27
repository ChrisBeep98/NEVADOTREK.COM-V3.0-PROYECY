"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mountain, Compass, ShieldCheck, Users, ArrowUpRight, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES = [
    {
        id: 0,
        title: "ALTA MONTAÑA",
        subtitle: "SUMMIT_GEAR",
        desc: "Dominamos el ascenso al Nevado del Tolima con estándares internacionales de alpinismo.",
        icon: Mountain,
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 1,
        title: "GUÍAS NATIVOS",
        subtitle: "LOCAL_HERITAGE",
        desc: "Expertos nacidos en Salento. Conocemos cada secreto del bosque de niebla.",
        icon: Compass,
        img: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "SEGURIDAD ELITE",
        subtitle: "SAFETY_PROTOCOL",
        desc: "Protocolos de rescate certificados y comunicación satelital constante.",
        icon: ShieldCheck,
        img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "CULTURA ANDINA",
        subtitle: "COMMUNITY",
        desc: "Experiencias de inmersión auténtica con las comunidades locales.",
        icon: Users,
        img: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=800&auto=format&fit=crop"
    }
];

export default function FeaturesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number>(0);

    useGSAP(() => {
        // Solo animamos el header con GSAP para mantener el hilo principal libre para las imágenes
        gsap.fromTo(".feature-header-anim", 
            { opacity: 0, y: 20 },
            { 
                opacity: 1, y: 0, 
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: { 
                    trigger: containerRef.current, 
                    start: "top 90%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section 
            ref={containerRef} 
            className="bg-slate-950 section-v-spacing border-t border-white/5 overflow-hidden"
            style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }} // Pro-tip: content-visibility
        >
            
            <div className="px-frame max-w-[1400px] mx-auto mb-12 md:mb-20 feature-header-anim">
                <span className="text-sub-label mb-4 block opacity-40">TECNOLOGÍA DE EXPEDICIÓN</span>
                <h2 className="text-display-xl text-white uppercase leading-tight">
                    DIFERENCIAL <br/> <span className="text-white/20">TÁCTICO.</span>
                </h2>
            </div>

            <div className="px-frame max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row h-[750px] md:h-[650px] gap-3 items-stretch">
                    
                    {FEATURES.map((f) => {
                        const Icon = f.icon;
                        const isActive = activeId === f.id;
                        
                        return (
                            <div 
                                key={f.id}
                                onMouseEnter={() => setActiveId(f.id)}
                                onClick={() => setActiveId(f.id)}
                                className={`
                                    relative overflow-hidden cursor-pointer border border-white/5 
                                    transition-[flex-grow,height,border-color] duration-[500ms] ease-out
                                    rounded-[2rem] transform-gpu
                                    ${isActive ? 'flex-grow-[10] md:flex-[12] border-white/20' : 'h-16 md:h-auto md:flex-1'}
                                `}
                                style={{ transform: 'translateZ(0)' }}
                            >
                                {/* BACKGROUND - Optimized opacity mapping */}
                                <div className="absolute inset-0 z-0 transform-gpu overflow-hidden bg-slate-900">
                                    <img 
                                        src={f.img} 
                                        alt={f.title}
                                        decoding="async"
                                        loading="lazy"
                                        className={`
                                            w-full h-full object-cover transition-all duration-700
                                            ${isActive ? 'opacity-60 scale-105' : 'opacity-20 scale-100'}
                                        `}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
                                </div>

                                {/* CONTENT - Minimalist and light */}
                                <div className={`absolute inset-0 p-6 md:p-10 flex flex-col z-20 pointer-events-none transition-all duration-500 ${isActive ? 'justify-between' : 'justify-center md:justify-end'}`}>
                                    
                                    <div className={`flex items-start justify-between transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-900/90 rounded-2xl border border-white/10">
                                                <Icon className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <span className="text-tech-caption font-bold text-white tracking-widest">{f.subtitle}</span>
                                        </div>
                                    </div>

                                    {!isActive && (
                                        <div className="flex md:hidden items-center justify-between w-full opacity-30">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">{f.title}</span>
                                            <Target className="w-3 h-3 text-cyan-500" />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-4">
                                        <div className={`transition-transform duration-500 ${isActive ? 'translate-y-0' : 'hidden md:block md:rotate-[-90deg] md:-translate-y-20 opacity-20'}`}>
                                            <h3 className={`font-bold tracking-tighter uppercase transition-all duration-500
                                                ${isActive ? 'text-4xl md:text-6xl text-white' : 'text-xl text-white'}
                                            `}>
                                                {f.title}
                                            </h3>
                                        </div>

                                        <div className={`overflow-hidden transition-all duration-500
                                            ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}
                                        `}>
                                            <p className="text-body-std text-slate-300 max-w-lg mb-8 leading-relaxed border-l border-cyan-500/30 pl-6 italic">
                                                "{f.desc}"
                                            </p>
                                            <div className="flex items-center gap-2 text-cyan-400">
                                                <span className="text-[10px] font-mono tracking-widest uppercase">Protocol_Active</span>
                                                <ArrowUpRight className="w-3 h-3" />
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
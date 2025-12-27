"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Mountain, Compass, ShieldCheck, Users, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES_DATA = [
    {
        id: 0,
        title: "ALTA MONTAÑA",
        tag: "LOGÍSTICA TÉCNICA",
        desc: "Dominamos el ascenso al Nevado del Tolima con estándares internacionales de alpinismo y equipo técnico de élite.",
        icon: Mountain,
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
        accent: "text-cyan-400"
    },
    {
        id: 1,
        title: "GUÍAS NATIVOS",
        tag: "HERENCIA LOCAL",
        desc: "Expertos nacidos en Salento. Conocemos cada secreto del bosque de niebla y los caminos ancestrales del Páramo.",
        icon: Compass,
        img: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1000&auto=format&fit=crop",
        accent: "text-orange-400"
    },
    {
        id: 2,
        title: "SEGURIDAD ELITE",
        tag: "PROTOCOLO CERO RIESGO",
        desc: "Protocolos de rescate certificados y comunicación satelital constante. Tu integridad es nuestra única prioridad.",
        icon: ShieldCheck,
        img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000&auto=format&fit=crop",
        accent: "text-blue-400"
    },
    {
        id: 3,
        title: "CULTURA ANDINA",
        tag: "EXPERIENCIA HUMANA",
        desc: "Experiencias de inmersión auténtica con las comunidades locales, respetando la herencia y el ecosistema.",
        icon: Users,
        img: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=1000&auto=format&fit=crop",
        accent: "text-purple-400"
    }
];

export default function FeaturesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number>(0);

    useGSAP(() => {
        // Entrada elegante de la sección
        gsap.fromTo(".feature-intro", 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, y: 0, 
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: { trigger: containerRef.current, start: "top 85%" }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-slate-950 section-v-spacing border-t border-white/5 overflow-hidden">
            
            {/* Header: Design System Synced */}
            <div className="px-frame max-w-[1400px] mx-auto mb-16 md:mb-24 feature-intro">
                <span className="text-sub-label mb-6 block font-bold">
                    ESTÁNDAR DE EXPEDICIÓN
                </span>
                <h2 className="text-display-xl text-white">
                    EL DIFERENCIAL <br/> DE CUMBRE.
                </h2>
            </div>

            {/* Interactive Grid: High Performance */}
            <div className="px-frame max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row h-[800px] md:h-[700px] gap-3 md:gap-4 items-stretch">
                    
                    {FEATURES_DATA.map((f) => {
                        const Icon = f.icon;
                        const isActive = activeId === f.id;
                        
                        return (
                            <div 
                                key={f.id}
                                onMouseEnter={() => setActiveId(f.id)}
                                onClick={() => setActiveId(f.id)}
                                className={`
                                    relative overflow-hidden cursor-pointer rounded-[2rem] border border-white/5
                                    transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                                    will-change-[flex,height] transform-gpu
                                    ${isActive 
                                        ? 'flex-grow-[12] md:flex-[12] border-white/20 shadow-2xl' 
                                        : 'h-16 md:h-auto md:flex-1 border-white/5 hover:border-white/10'
                                    }
                                `}
                                style={{ transform: 'translateZ(0)' }}
                            >
                                {/* BACKGROUND IMAGE: Optimized (No dynamic filters) */}
                                <div className="absolute inset-0 z-0 transform-gpu overflow-hidden">
                                    <img 
                                        src={f.img} 
                                        alt={f.title} 
                                        className={`
                                            w-full h-full object-cover transition-all duration-1000 transform-gpu
                                            ${isActive ? 'opacity-60 scale-105' : 'opacity-20 scale-100'}
                                        `}
                                        style={{ transform: 'translateZ(0)' }}
                                    />
                                    {/* Overlay for depth without expensive blend modes */}
                                    <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-40' : 'opacity-80'} bg-slate-950`}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
                                </div>

                                {/* CONTENT: Tactical Layout */}
                                <div className={`absolute inset-0 p-6 md:p-12 flex flex-col z-20 pointer-events-none transition-all duration-500 ${isActive ? 'justify-end' : 'justify-center md:justify-end'}`}>
                                    
                                    {/* Mobile Collapsed Label (Exactly 64px visual) */}
                                    {!isActive && (
                                        <div className="flex md:hidden items-center justify-between w-full opacity-40">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">{f.title}</span>
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                    )}

                                    {/* Active Details (Icon & Tag) */}
                                    <div className={`hidden md:flex items-center gap-4 mb-6 transition-all duration-700 
                                        ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-xl">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-tech-caption text-white font-bold tracking-widest">{f.tag}</span>
                                    </div>

                                    {/* Title Section: Responsive & Stable */}
                                    <div className={`transition-all duration-700 ${isActive ? 'mb-4' : 'hidden md:block md:rotate-[-90deg] md:-translate-y-20'}`}>
                                        <h3 className={`font-bold tracking-tight uppercase transition-all duration-700
                                            ${isActive ? 'text-3xl md:text-6xl text-white' : 'text-xl text-white/20'}
                                        `}>
                                            {f.title}
                                        </h3>
                                    </div>

                                    {/* Description: GPU Accelerated Reveal */}
                                    <div className={`overflow-hidden transition-all duration-700 delay-100
                                        ${isActive ? 'max-h-60 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}
                                    `}>
                                        <p className="text-sm md:text-body-lead text-slate-300 max-w-lg mb-8 font-light leading-relaxed border-l border-cyan-500/50 pl-6 italic">
                                            "{f.desc}"
                                        </p>
                                        <div className="flex items-center gap-3 text-cyan-400 font-bold">
                                            <span className="text-[10px] uppercase tracking-widest">Protocolo Activo</span>
                                            <ArrowUpRight className="w-4 h-4" />
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

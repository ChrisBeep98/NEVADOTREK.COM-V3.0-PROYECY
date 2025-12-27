"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Leaf, Users, ShieldCheck, Map, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number>(0);

    const features = [
        {
            id: 0,
            title: "TURISMO SOSTENIBLE",
            subtitle: "CONSERVATION",
            desc: "Compromiso de impacto mínimo. Salvaguardamos la biodiversidad del Valle de Cocora.",
            icon: Leaf,
            img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 1,
            title: "GUÍAS LOCALES",
            subtitle: "HERITAGE",
            desc: "Nativos de Salento con certificación profesional. Expertos en la geografía local.",
            icon: Map,
            img: "https://images.unsplash.com/photo-1589407633195-6548a804473e?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "PERMISOS LEGALES",
            subtitle: "COMPLIANCE",
            desc: "Operación formal con acceso autorizado a predios privados y Reservas Nacionales.",
            icon: Users,
            img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "ELITE SAFETY",
            subtitle: "SAFETY PROTOCOL",
            desc: "Tecnología satelital y equipo de rescate alpino. Tu vida es nuestra prioridad.",
            icon: ShieldCheck,
            img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    useGSAP(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, y: 0, 
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-white section-v-spacing px-frame border-t border-slate-100 transform-gpu">
            
            <div className="max-w-[1400px] mx-auto mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
                <div>
                    <span className="text-sub-label text-cyan-600 block mb-6">
                        Why Choose Nevado
                    </span>
                    <h2 className="text-display-xl text-slate-900">
                        THE NEVADO <br/> DIFFERENCE.
                    </h2>
                </div>
                <p className="text-body-lead text-slate-500 max-w-md italic leading-relaxed hidden md:block">
                    "More than a tour agency, we are the guardians of the Salento heritage and the high Andean peaks."
                </p>
            </div>

            <div className="w-full h-[800px] md:h-[700px] flex flex-col md:flex-row gap-2 md:gap-4 overflow-hidden rounded-3xl shadow-2xl bg-slate-100">
                {features.map((f) => {
                    const IconComp = f.icon;
                    const isActive = activeId === f.id;

                    return (
                        <div 
                            key={f.id}
                            onMouseEnter={() => setActiveId(f.id)}
                            onClick={() => setActiveId(f.id)}
                            className={`
                                relative overflow-hidden cursor-pointer group 
                                transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] will-change-[flex-grow] transform-gpu
                                ${isActive ? 'flex-[10] md:flex-[12]' : 'flex-[1] grayscale brightness-50 md:brightness-100'}
                            `}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0 overflow-hidden">
                                <img 
                                    src={f.img} 
                                    alt={f.title} 
                                    className={`w-full h-full object-cover transition-transform duration-[2000ms] ${isActive ? 'scale-110' : 'scale-100'}`} 
                                />
                                <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${isActive ? 'opacity-20' : 'opacity-60'}`}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                            </div>

                            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end z-10 pointer-events-none">
                                
                                {/* Inactive Label */}
                                <div className={`transition-all duration-500 absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2 
                                    ${isActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 delay-200'}
                                    left-8 bottom-8
                                `}>
                                    <span className="text-white font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase md:rotate-180 md:[writing-mode:vertical-rl] whitespace-nowrap opacity-60">
                                        {f.title}
                                    </span>
                                </div>

                                {/* Active Content */}
                                <div className={`transition-all duration-700 transform will-change-[opacity,transform]
                                    ${isActive ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8'}
                                `}>
                                    <div className="flex items-center gap-4 mb-6 text-cyan-400">
                                        <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                                            <IconComp className="w-6 h-6" />
                                        </div>
                                        <span className="text-tech-caption text-cyan-400 font-bold">{f.subtitle}</span>
                                    </div>
                                    
                                    <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6 leading-none uppercase">
                                        {f.title}
                                    </h3>
                                    
                                    <div className={`overflow-hidden transition-all duration-700
                                         ${isActive ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}
                                    `}>
                                        <p className="text-body-lead text-slate-200 max-w-2xl italic mb-8 border-l-2 border-cyan-500 pl-6">
                                            "{f.desc}"
                                        </p>
                                        
                                        <div className="flex items-center gap-3 text-white/40 text-[10px] font-mono tracking-widest uppercase">
                                            <ArrowUpRight className="w-4 h-4" />
                                            <span>TECHNICAL_READY</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </section>
    );
}
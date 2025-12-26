"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Leaf, Users, ShieldCheck, Map, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<number | null>(0);

    const features = [
        {
            id: 0,
            title: "TURISMO SOSTENIBLE",
            subtitle: "CONSERVATION",
            desc: "Compromiso de impacto mínimo. Salvaguardamos la biodiversidad del Valle de Cocora.",
            icon: <Leaf />,
            img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 1,
            title: "GUÍAS LOCALES",
            subtitle: "HERITAGE",
            desc: "Nativos de Salento con certificación profesional. Expertos en la geografía local.",
            icon: <Map />,
            img: "https://images.unsplash.com/photo-1589407633195-6548a804473e?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "PERMISOS LEGALES",
            subtitle: "COMPLIANCE",
            desc: "Operación formal con acceso autorizado a predios privados y Reservas Nacionales.",
            icon: <Users />,
            img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "ELITE SAFETY",
            subtitle: "SAFETY PROTOCOL",
            desc: "Tecnología satelital y equipo de rescate alpino. Tu vida es nuestra prioridad.",
            icon: <ShieldCheck />,
            img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000&auto=format&fit=crop"
        }
    ];

    useGSAP(() => {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, y: 0, 
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-white py-24 md:py-40 px-4 md:px-12 border-t border-slate-100">
            
            <div className="max-w-[1400px] mx-auto mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
                <div>
                    {/* TOKEN: SUB-LABEL */}
                    <span className="text-cyan-600 font-mono text-[10px] tracking-[0.4em] uppercase block mb-6">
                        Why Choose Nevado
                    </span>
                    {/* TOKEN: DISPLAY XL */}
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                        THE NEVADO <br/> DIFFERENCE.
                    </h2>
                </div>
                {/* TOKEN: BODY LEAD */}
                <p className="text-slate-500 max-w-md text-sm md:text-lg font-light italic leading-relaxed hidden md:block">
                    "More than a tour agency, we are the guardians of the Salento heritage and the high Andean peaks."
                </p>
            </div>

            <div className="w-full h-[800px] md:h-[700px] flex flex-col md:flex-row gap-2 md:gap-4 overflow-hidden rounded-[2.5rem] shadow-2xl">
                {features.map((f) => (
                    <div 
                        key={f.id}
                        onMouseEnter={() => setActiveId(f.id)}
                        onClick={() => setActiveId(f.id)}
                        className={`
                            panel-item relative overflow-hidden rounded-2xl cursor-pointer group 
                            transition-[flex-grow] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[flex-grow]
                            ${activeId === f.id ? 'flex-[10]' : 'flex-[1] grayscale hover:grayscale-0'}
                        `}
                    >
                        <div className="absolute inset-0 z-0">
                            <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${activeId === f.id ? 'opacity-20' : 'opacity-60'}`}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                        </div>

                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10 pointer-events-none">
                            
                            {/* Inactive Label */}
                            <div className={`transition-opacity duration-300 absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2 
                                ${activeId === f.id ? 'opacity-0' : 'opacity-100 delay-200'}
                                left-8 bottom-8
                            `}>
                                <span className="text-white font-bold tracking-[0.2em] text-sm uppercase md:rotate-180 md:[writing-mode:vertical-rl] whitespace-nowrap">
                                    {f.title}
                                </span>
                            </div>

                            {/* Active Content */}
                            <div className={`transition-all duration-700 transform
                                ${activeId === f.id ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-8'}
                            `}>
                                <div className="flex items-center gap-4 mb-6 text-cyan-400">
                                    <div className="p-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                                        {React.cloneElement(f.icon as React.ReactElement, { className: "w-6 h-6" })}
                                    </div>
                                    <span className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase">{f.subtitle}</span>
                                </div>
                                
                                {/* TOKEN: HEADING L (Upscaled for panel) */}
                                <h3 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-none uppercase">
                                    {f.title}
                                </h3>
                                
                                <div className={`overflow-hidden transition-all duration-700
                                     ${activeId === f.id ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    {/* TOKEN: BODY LEAD */}
                                    <p className="text-slate-200 text-sm md:text-xl font-light leading-relaxed max-w-2xl italic mb-8">
                                        "{f.desc}"
                                    </p>
                                    
                                    <div className="flex items-center gap-3 text-white/40 text-[10px] font-mono tracking-widest uppercase">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span>PROTOCOL_ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}

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
            title: "LOCAL ROOTS",
            subtitle: "Guides from Salento",
            desc: "Born in the coffee region. We don't use GPS; we use generations of memory.",
            icon: <Users />,
            img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop",
            color: "bg-emerald-900"
        },
        {
            id: 1,
            title: "SECRET COCORA",
            subtitle: "Private Access",
            desc: "Unlock gates that are closed to others. See the wax palms in total solitude.",
            icon: <Map />,
            img: "https://images.unsplash.com/photo-1589407633195-6548a804473e?q=80&w=1000&auto=format&fit=crop",
            color: "bg-cyan-900"
        },
        {
            id: 2,
            title: "ZERO TRACE",
            subtitle: "Sustainable Trek",
            desc: "We guard the Paramo. Our expeditions leave nothing but footprints behind.",
            icon: <Leaf />,
            img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
            color: "bg-slate-900"
        },
        {
            id: 3,
            title: "ELITE SAFETY",
            subtitle: "Certified Protocol",
            desc: "Satellite tech & alpine rescue gear. Your life is our absolute priority.",
            icon: <ShieldCheck />,
            img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1000&auto=format&fit=crop",
            color: "bg-indigo-900"
        }
    ];

    useGSAP(() => {
        // Animación de entrada simple y ligera
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
        <section ref={containerRef} className="bg-white py-20 md:py-32 px-4 md:px-12 border-t border-slate-100">
            
            <div className="max-w-[1400px] mx-auto mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div>
                    <span className="text-cyan-600 font-mono text-[10px] tracking-[0.4em] uppercase block mb-4">Why Choose Nevado</span>
                    <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
                        THE NEVADO <br/> DIFFERENCE.
                    </h2>
                </div>
                <p className="text-slate-500 max-w-md text-sm md:text-base font-light italic hidden md:block">
                    "More than a tour agency, we are the guardians of the Salento heritage and the high Andean peaks."
                </p>
            </div>

            {/* 
               OPTIMIZACIÓN CLAVE:
               1. 'will-change-[flex-grow]': Prepara al navegador para la animación de tamaño.
               2. 'transform-gpu': Fuerza el renderizado en la GPU.
               3. Imágenes optimizadas con 'loading="lazy"'.
            */}
            <div className="w-full h-[800px] md:h-[700px] flex flex-col md:flex-row gap-2 md:gap-4 overflow-hidden rounded-3xl transform-gpu">
                {features.map((f) => (
                    <div 
                        key={f.id}
                        onClick={() => setActiveId(f.id)} // Tap instantáneo en móvil
                        onMouseEnter={() => setActiveId(f.id)} // Hover en desktop
                        className={`
                            panel-item relative overflow-hidden rounded-2xl cursor-pointer group 
                            transition-[flex-grow] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[flex-grow]
                            ${activeId === f.id ? 'flex-[8] md:flex-[10]' : 'flex-[1] grayscale hover:grayscale-0'}
                        `}
                    >
                        {/* Background Image - Static to reduce repaint */}
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={f.img} 
                                alt={f.title} 
                                className="w-full h-full object-cover transition-transform duration-[1.5s] scale-100 group-hover:scale-105" 
                                loading="lazy"
                                decoding="async"
                            />
                            {/* Static overlay - Removed dynamic blend modes for performance */}
                            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${activeId === f.id ? 'opacity-20' : 'opacity-60'}`}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                        </div>

                        {/* Content Container */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10 pointer-events-none">
                            
                            {/* Inactive Labels */}
                            <div className={`transition-opacity duration-300 absolute md:bottom-8 md:left-1/2 md:-translate-x-1/2 
                                ${activeId === f.id ? 'opacity-0' : 'opacity-100 delay-200'}
                                left-6 bottom-6 md:auto
                            `}>
                                {/* Mobile: Horizontal Title */}
                                <span className="md:hidden text-white/90 font-bold tracking-widest text-sm uppercase block drop-shadow-md">
                                    {f.title}
                                </span>
                                {/* Desktop: Vertical Title */}
                                <span className="hidden md:block text-white font-bold tracking-widest text-xl whitespace-nowrap rotate-180 [writing-mode:vertical-rl]">
                                    {f.title}
                                </span>
                            </div>

                            {/* Active Content */}
                            <div className={`transition-all duration-500 transform
                                ${activeId === f.id ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-4'}
                            `}>
                                <div className="flex items-center gap-3 mb-3 text-cyan-400">
                                    <div className="p-2 md:p-3 bg-white/10 rounded-lg md:rounded-xl border border-white/20">
                                        {React.cloneElement(f.icon as React.ReactElement, { className: "w-5 h-5 md:w-6 md:h-6" })}
                                    </div>
                                    <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase drop-shadow-sm">{f.subtitle}</span>
                                </div>
                                
                                <h3 className="text-3xl md:text-6xl font-black text-white tracking-tight mb-4 leading-none drop-shadow-lg">
                                    {f.title}
                                </h3>
                                
                                <div className={`overflow-hidden transition-all duration-500
                                     ${activeId === f.id ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
                                `}>
                                    <p className="text-slate-200 text-sm md:text-xl font-light leading-relaxed max-w-xl italic mb-4 md:mb-6 drop-shadow-md">
                                        "{f.desc}"
                                    </p>
                                    
                                    <div className="flex items-center gap-2 text-white/50 text-[10px] md:text-xs font-mono tracking-widest uppercase">
                                        <span>Discover</span>
                                        <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 md:hidden text-center opacity-40">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Tap to expand details</span>
            </div>

        </section>
    );
}
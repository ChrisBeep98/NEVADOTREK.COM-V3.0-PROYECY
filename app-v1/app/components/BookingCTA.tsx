"use client";

import React, { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FAUNA_STATIC = {
    barranquero: {
        sciName: "Momotus aequatorialis",
        img: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2000&auto=format&fit=crop", 
        accentClass: "text-cyan-400"
    },
    danta: {
        sciName: "Tapirus pinchaque",
        img: "https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=2000&auto=format&fit=crop",
        accentClass: "text-orange-400"
    },
    oso: {
        sciName: "Tremarctos ornatus",
        img: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=2000&auto=format&fit=crop",
        accentClass: "text-purple-400"
    }
};

export default function BookingCTA() {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Memoize fauna to prevent array recreation on every render
    const fauna = useMemo(() => {
        if (!t.fauna?.items) return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return t.fauna.items.map((item: any) => ({
            ...item,
            ...FAUNA_STATIC[item.id as keyof typeof FAUNA_STATIC]
        }));
    }, [t.fauna]);

    useGSAP(() => {
        const slides = gsap.utils.toArray<HTMLElement>('.animal-slide');
        
        if (slides.length === 0) return;

        // --- CONFIGURACIÓN UNIFICADA (Estilo "Peel" / Baraja) ---
        // Inicializamos todos visibles y sin recortes
        gsap.set(slides, { autoAlpha: 1, z: 0, clipPath: 'inset(0% 0% 0% 0%)' });
        
        // Creamos una única línea de tiempo para todas las resoluciones
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=200%", // Ajustado a 200% para evitar scroll muerto al final
                pin: true,
                scrub: 0.5, // 0.5 es más responsivo (menos "lag" que 1.5)
            }
        });

        // Animación combinada: Peel del contenedor + Zoom de imagen
        slides.forEach((slide, i) => {
            // 1. Zoom FLUIDO Y ANTICIPADO
            const img = slide.querySelector('img');
            if (img) {
                // Empezamos el zoom UN PASO ANTES (i - 1) para que cuando se revele
                // la imagen ya se esté moviendo suavemente.
                // Duración extendida (2.5) para cubrir la "espera" + el "corte".
                tl.fromTo(img, 
                    { scale: 1 }, 
                    { scale: 1.15, duration: 2.5, ease: "power1.inOut" }, 
                    Math.max(0, i - 1) // Start time adelantado
                );
            }

            // 2. Recorte del contenedor (Peel)
            if (i < slides.length - 1) {
                tl.to(slide, { 
                    clipPath: 'inset(0% 0% 100% 0%)', 
                    duration: 1, 
                    ease: "power1.inOut" 
                }, i);
            }
        });

        // Animación del botón final
        tl.fromTo(".final-cta", 
            { autoAlpha: 0, scale: 0.9, y: 20 }, 
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.5 }, 
            slides.length - 1.5 // Aparece un poco antes de terminar
        );

    }, { scope: sectionRef }); // Dependencies removed: GSAP runs once, React updates text in DOM.

    return (
        <section ref={sectionRef} className="dark relative w-full h-screen bg-[#040918] overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 z-50">
                <div ref={progressRef} className="w-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>
            </div>

            <div className="relative w-full h-full">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {fauna.map((animal: any, i: number) => (
                    <div 
                        key={animal.id}
                        className={`animal-slide absolute inset-0 w-full h-full flex items-center justify-center will-change-[clip-path,transform,opacity]`}
                        style={{ zIndex: fauna.length - i }}
                    >
                        {/* BACKGROUND: Optimizado (Sin mask-image pesada) */}
                        <div className="absolute inset-0 z-0 overflow-hidden transform-gpu">
                            <img 
                                src={animal.img} 
                                alt={animal.name}
                                className="w-full h-full object-cover saturate-[0.7] sepia-[0.1] brightness-[0.6] will-change-transform transform-gpu"
                            />
                            {/* Gradiente sutil para enfoque visual (mucho más rápido que una máscara radial) */}
                            <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_30%,_#040918_90%] opacity-80 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#040918] via-transparent to-transparent opacity-60"></div>
                        </div>

                        <div className="relative z-20 w-full h-full px-frame flex flex-col justify-end md:justify-center pb-32 md:pb-0">
                            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12">
                                <div className="col-span-12 md:col-span-6 space-y-4 md:space-y-6 md:pl-12">
                                    <div className="flex items-center gap-4 text-reveal">
                                        <span className={`text-[10px] font-mono tracking-[0.4em] ${animal.accentClass} font-black uppercase`}>
                                            0{i + 1} {'//'} {animal.role}
                                        </span>
                                        <div className="h-px bg-white/20 w-12 hidden md:block"></div>
                                    </div>

                                    <h2 className="text-display-xl text-white leading-[1.3] text-reveal uppercase drop-shadow-2xl">
                                        {animal.name}
                                    </h2>

                                    <div className="text-reveal">
                                        <span className="text-[10px] font-mono text-white/40 block mb-2 italic">{animal.sciName}</span>
                                        <p className="text-body-std md:text-body-lead text-slate-200 max-w-sm drop-shadow-lg leading-relaxed">
                                            &quot;{animal.desc}&quot;
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-white/60 font-mono text-[9px] md:text-xs pt-2 md:pt-4 text-reveal font-bold">
                                        <MapPin className="w-4 h-4 text-cyan-500" />
                                        <span className="tracking-widest uppercase">{animal.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="final-cta absolute bottom-12 md:bottom-24 left-0 w-full z-[60] flex justify-center px-frame pointer-events-none opacity-0">
                <button className="pointer-events-auto w-full md:w-auto group bg-white px-10 py-5 flex items-center justify-center gap-4 hover:bg-cyan-500 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <span className="text-black font-bold tracking-widest text-xs md:text-sm uppercase group-hover:text-white">{t.fauna.book_expedition}</span>
                    <ArrowRight className="text-black w-4 h-4 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </section>
    );
}
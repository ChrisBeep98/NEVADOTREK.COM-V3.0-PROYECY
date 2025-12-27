"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FAUNA = [
    {
        id: "barranquero",
        name: "BARRANQUERO",
        sciName: "Momotus aequatorialis",
        role: "EL RELOJ DE LA MONTAÑA",
        desc: "Su canto marca el tiempo en los cafetales de niebla. Un destello turquesa en la penumbra.",
        location: "1.900M // VALLE DE COCORA",
        img: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2000&auto=format&fit=crop", 
        accentClass: "text-cyan-400"
    },
    {
        id: "danta",
        name: "DANTA DE PÁRAMO",
        sciName: "Tapirus pinchaque",
        role: "EL ARQUITECTO DEL BOSQUE",
        desc: "Jardinera solitaria de las alturas. Abre caminos ancestrales entre los frailejones.",
        location: "3.200M // ALTO QUINDÍO",
        img: "https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=2000&auto=format&fit=crop",
        accentClass: "text-orange-400"
    },
    {
        id: "oso",
        name: "OSO DE ANTEOJOS",
        sciName: "Tremarctos ornatus",
        role: "EL GUARDIÁN DE AGUA",
        desc: "Espíritu sagrado de los Andes. Donde él camina, nace la vida.",
        location: "3.600M // ROMERALES",
        img: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=2000&auto=format&fit=crop",
        accentClass: "text-purple-400"
    }
];

export default function BookingCTA() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        const slides = gsap.utils.toArray<HTMLElement>('.desktop-slide');
        
        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=400%", // Más espacio de scroll = más suavidad
                    pin: true,
                    scrub: 0.8, // Inercia aumentada para suavidad total
                    snap: {
                        snapTo: [0, 0.48, 0.92, 1],
                        duration: { min: 0.4, max: 0.8 },
                        delay: 0.1,
                        ease: "sine.inOut" // Snap mucho más fluido
                    },
                    onUpdate: (self) => {
                        if (progressRef.current) {
                            gsap.set(progressRef.current, { height: `${self.progress * 100}%` });
                        }
                    }
                }
            });

            gsap.set(slides, { transformPerspective: 1000, force3D: true });

            // --- SECUENCIA 0 -> 1 (Suavizada) ---
            tl.to(slides[0], { 
                autoAlpha: 0, 
                scale: 1.1, 
                z: 50, 
                duration: 1.5, 
                ease: "sine.inOut" 
            }, 0)
            .to(slides[0].querySelectorAll('.text-reveal'), { 
                y: -30, 
                autoAlpha: 0, 
                stagger: 0.05,
                duration: 0.8 
            }, 0)
            .fromTo(slides[1], 
                { autoAlpha: 0, scale: 0.95, z: -50 },
                { autoAlpha: 1, scale: 1, z: 0, duration: 1.5, ease: "sine.inOut" }, 0.2)
            .fromTo(slides[1].querySelectorAll('.text-reveal'), 
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "sine.out" }, 0.6);

            // --- SECUENCIA 1 -> 2 (Suavizada) ---
            tl.to(slides[1], { 
                autoAlpha: 0, 
                scale: 1.1, 
                z: 50, 
                duration: 1.5, 
                ease: "sine.inOut" 
            }, 2)
            .to(slides[1].querySelectorAll('.text-reveal'), { 
                y: -30, 
                autoAlpha: 0, 
                stagger: 0.05,
                duration: 0.8 
            }, 2)
            .fromTo(slides[2], 
                { autoAlpha: 0, scale: 0.95, z: -50 },
                { autoAlpha: 1, scale: 1, z: 0, duration: 1.5, ease: "sine.inOut" }, 2.2)
            .fromTo(slides[2].querySelectorAll('.text-reveal'), 
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "sine.out" }, 2.6);

            // FINAL CTA (Suave)
            tl.fromTo(".final-cta", 
                { autoAlpha: 0, y: 30 }, 
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "sine.out" }, 3.2);
        });

        // MOBILE REVEAL (Suave)
        mm.add("(max-width: 767px)", () => {
            gsap.utils.toArray<HTMLElement>('.mobile-slide').forEach((slide) => {
                gsap.fromTo(slide.querySelectorAll('.text-reveal-mobile'), 
                    { y: 20, autoAlpha: 0 },
                    {
                        y: 0, autoAlpha: 1,
                        stagger: 0.1,
                        duration: 1,
                        ease: "sine.out",
                        scrollTrigger: {
                            trigger: slide,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative w-full bg-slate-950 overflow-hidden">
            
            <div className="hidden md:block w-full h-screen relative">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 z-50">
                    <div ref={progressRef} className="w-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>
                </div>

                {FAUNA.map((animal, i) => (
                    <div 
                        key={animal.id}
                        className={`desktop-slide absolute inset-0 w-full h-full flex items-center justify-center will-change-[transform,opacity] ${i === 0 ? 'visible' : 'invisible'}`}
                    >
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={animal.img} 
                                alt={animal.name}
                                className="w-full h-full object-cover saturate-[0.7] sepia-[0.15] contrast-[1.1] brightness-[0.7] will-change-transform"
                                style={{
                                    maskImage: 'radial-gradient(circle at 70% center, black 35%, transparent 85%)',
                                    WebkitMaskImage: 'radial-gradient(circle at 70% center, black 35%, transparent 85%)'
                                }}
                            />
                        </div>

                        <div className="relative z-10 w-full h-full px-frame flex flex-col justify-center">
                            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12">
                                <div className="col-span-6 space-y-6 pl-12">
                                    <div className="flex items-center gap-4 text-reveal">
                                        <span className={`text-tech-caption ${animal.accentClass} tracking-[0.4em] font-black`}>
                                            0{i + 1} // {animal.role}
                                        </span>
                                        <div className="h-px bg-white/20 w-12"></div>
                                    </div>

                                    <h2 className="text-display-xl text-white text-reveal uppercase drop-shadow-2xl">
                                        {animal.name}
                                    </h2>

                                    <div className="text-reveal">
                                        <span className="text-tech-caption text-white/40 block mb-2 italic font-mono">{animal.sciName}</span>
                                        <p className="text-body-lead text-slate-200 max-w-sm drop-shadow-lg leading-relaxed">
                                            "{animal.desc}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-white/60 font-mono text-xs pt-4 text-reveal font-bold">
                                        <MapPin className="w-4 h-4 text-cyan-500" />
                                        <span className="tracking-widest">{animal.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="final-cta absolute bottom-24 left-0 w-full z-50 flex justify-center pointer-events-none opacity-0">
                    <button className="pointer-events-auto group bg-white px-10 py-5 flex items-center gap-4 hover:bg-cyan-500 transition-all duration-500 rounded-sm">
                        <span className="text-black font-bold tracking-widest text-sm uppercase group-hover:text-white">Reservar Expedición</span>
                        <ArrowRight className="text-black w-4 h-4 group-hover:text-white transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>

            <div className="md:hidden block">
                {FAUNA.map((animal, i) => (
                    <div key={animal.id} className="mobile-slide relative w-full h-[85vh] overflow-hidden flex flex-col justify-end pb-24 border-b border-white/5 bg-slate-950">
                        <div className="absolute inset-0 z-0">
                            <img src={animal.img} alt={animal.name} className="w-full h-full object-cover saturate-[0.7] sepia-[0.15] contrast-[1.1] brightness-[0.6]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                        </div>
                        
                        <div className="relative z-20 px-frame space-y-4">
                            <div className="text-reveal-mobile">
                                <span className={`text-[10px] font-mono tracking-[0.3em] ${animal.accentClass} block font-black uppercase drop-shadow-lg`}>
                                    0{i + 1} // {animal.role}
                                </span>
                            </div>
                            <h2 className="text-5xl font-bold text-white leading-none tracking-tighter text-reveal-mobile uppercase drop-shadow-2xl">{animal.name}</h2>
                            <p className="text-sm text-slate-200 font-medium text-reveal-mobile max-w-[90%] drop-shadow-lg">"{animal.desc}"</p>
                            <div className="flex items-center gap-2 text-white pt-2 text-reveal-mobile font-bold drop-shadow-lg">
                                <MapPin className="w-3 h-3 text-cyan-400" />
                                <span className="text-[9px] font-mono tracking-[0.2em]">{animal.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="py-20 px-frame bg-slate-950 flex flex-col justify-center items-center z-[50]">
                    <button className="w-full bg-white py-5 flex items-center justify-center gap-4 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                         <span className="text-black font-bold tracking-widest uppercase text-xs">Solicitar Acceso</span>
                         <ArrowRight className="text-black w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-[100] sticky top-0 h-screen"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

        </section>
    );
}

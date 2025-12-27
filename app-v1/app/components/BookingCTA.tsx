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
        const slides = gsap.utils.toArray<HTMLElement>('.animal-slide');
        
        // --- ESTADO INICIAL ---
        gsap.set(slides, { autoAlpha: 0, scale: 0.95, z: -50, force3D: true });
        gsap.set(slides[0], { autoAlpha: 1, scale: 1, z: 0 });

        // --- DESKTOP: CINEMATIC SMOOTH VAULT ---
        mm.add("(min-width: 768px)", () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=500%", 
                    pin: true,
                    scrub: 0.8, // Suavidad extrema (Inercia premium)
                    snap: {
                        snapTo: [0, 0.5, 1],
                        duration: { min: 0.4, max: 0.8 },
                        delay: 0.1,
                        ease: "sine.inOut"
                    },
                    onUpdate: (self) => {
                        if (progressRef.current) {
                            gsap.set(progressRef.current, { height: `${self.progress * 100}%` });
                        }
                    }
                }
            });

            // Slide 0 -> 1
            tl.to(slides[0], { autoAlpha: 0, scale: 1.05, z: 30, duration: 1.5, ease: "sine.inOut" }, 0.5)
              .to(slides[0].querySelectorAll('.text-reveal'), { y: -30, autoAlpha: 0, duration: 0.8 }, 0.5)
              .fromTo(slides[1], 
                { autoAlpha: 0, scale: 0.95, z: -30 }, 
                { autoAlpha: 1, scale: 1, z: 0, duration: 1.5, ease: "sine.inOut" }, 0.5)
              .fromTo(slides[1].querySelectorAll('.text-reveal'), 
                { y: 30, autoAlpha: 0 }, 
                { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "sine.out" }, 1);

            // ZONA DE DESCANSO (Danta sólida)
            tl.to({}, { duration: 1 }); 

            // Slide 1 -> 2
            tl.to(slides[1], { autoAlpha: 0, scale: 1.05, z: 30, duration: 1.5, ease: "sine.inOut" }, 2.5)
              .to(slides[1].querySelectorAll('.text-reveal'), { y: -30, autoAlpha: 0, duration: 0.8 }, 2.5)
              .fromTo(slides[2], 
                { autoAlpha: 0, scale: 0.95, z: -30 }, 
                { autoAlpha: 1, scale: 1, z: 0, duration: 1.5, ease: "sine.inOut" }, 2.5)
              .fromTo(slides[2].querySelectorAll('.text-reveal'), 
                { y: 30, autoAlpha: 0 }, 
                { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "sine.out" }, 3);

            // Final CTA (Entrada sutil)
            tl.fromTo(".final-cta", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: "sine.out" }, 4.2);
        });

        // --- MOBILE: THE DOWNWARD PEEL (Top to Bottom) ---
        mm.add("(max-width: 767px)", () => {
            gsap.set(slides, { autoAlpha: 1, z: 0, clipPath: 'inset(0% 0% 0% 0%)' });
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=300%",
                    pin: true,
                    scrub: 0.5,
                }
            });

            tl.to(slides[0], { clipPath: 'inset(100% 0% 0% 0%)', duration: 1, ease: "power1.inOut" })
              .fromTo(slides[1].querySelectorAll('.text-reveal'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5)
              .to(slides[1], { clipPath: 'inset(100% 0% 0% 0%)', duration: 1, ease: "power1.inOut" }, 1)
              .fromTo(slides[2].querySelectorAll('.text-reveal'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 1.5)
              .fromTo(".final-cta", { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 2.5);
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative w-full h-screen bg-slate-950 overflow-hidden">
            
            {/* PROGRESS BAR */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 z-50">
                <div ref={progressRef} className="w-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"></div>
            </div>

            {/* SLIDES STACK */}
            <div className="relative w-full h-full">
                {FAUNA.map((animal, i) => (
                    <div 
                        key={animal.id}
                        className={`animal-slide absolute inset-0 w-full h-full flex items-center justify-center will-change-[clip-path,transform,opacity]`}
                        style={{ zIndex: FAUNA.length - i }}
                    >
                        {/* BACKGROUND IMAGE */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img 
                                src={animal.img} 
                                alt={animal.name}
                                className="w-full h-full object-cover saturate-[0.7] sepia-[0.15] contrast-[1.1] brightness-[0.7] will-change-transform"
                                style={{
                                    maskImage: 'radial-gradient(circle at center, black 35%, transparent 85%)',
                                    WebkitMaskImage: 'radial-gradient(circle at center, black 35%, transparent 85%)'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 md:hidden"></div>
                        </div>

                        {/* CONTENT */}
                        <div className="relative z-20 w-full h-full px-frame flex flex-col justify-end md:justify-center pb-32 md:pb-0">
                            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12">
                                <div className="col-span-12 md:col-span-6 space-y-4 md:space-y-6 md:pl-12">
                                    <div className="flex items-center gap-4 text-reveal">
                                        <span className={`text-[10px] font-mono tracking-[0.4em] ${animal.accentClass} font-black uppercase drop-shadow-md`}>
                                            0{i + 1} // {animal.role}
                                        </span>
                                        <div className="h-px bg-white/20 w-12 hidden md:block"></div>
                                    </div>

                                    <h2 className="text-display-xl text-white leading-[1.3] text-reveal uppercase drop-shadow-2xl">
                                        {animal.name}
                                    </h2>

                                    <div className="text-reveal">
                                        <span className="text-[10px] font-mono text-white/40 block mb-2 italic">{animal.sciName}</span>
                                        <p className="text-body-std md:text-body-lead text-slate-200 max-w-sm drop-shadow-lg leading-relaxed">
                                            "{animal.desc}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-white/60 font-mono text-[9px] md:text-xs pt-2 md:pt-4 text-reveal font-bold">
                                        <MapPin className="w-4 h-4 text-cyan-500" />
                                        <span className="tracking-widest uppercase drop-shadow-sm">{animal.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* FINAL CTA */}
            <div className="final-cta absolute bottom-12 md:bottom-24 left-0 w-full z-[60] flex justify-center px-frame pointer-events-none opacity-0">
                <button className="pointer-events-auto w-full md:w-auto group bg-white px-10 py-5 flex items-center justify-center gap-4 hover:bg-cyan-500 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <span className="text-black font-bold tracking-widest text-xs md:text-sm uppercase group-hover:text-white">Reservar Expedición</span>
                    <ArrowRight className="text-black w-4 h-4 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            {/* GRAIN */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-[100] h-full"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

        </section>
    );
}

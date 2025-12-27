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
        // Visualmente idéntico: Kingfisher vibrante
        img: "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2000&auto=format&fit=crop", 
        accentClass: "text-cyan-500",
        position: "object-center"
    },
    {
        id: "danta",
        name: "DANTA DE PÁRAMO",
        sciName: "Tapirus pinchaque",
        role: "EL ARQUITECTO DEL BOSQUE",
        desc: "Jardinera solitaria de las alturas. Abre caminos ancestrales entre los frailejones.",
        location: "3.200M // ALTO QUINDÍO",
        // Tapir en entorno natural
        img: "https://images.unsplash.com/photo-1549471013-3364d7220b75?q=80&w=2000&auto=format&fit=crop",
        accentClass: "text-orange-500",
        position: "object-center"
    },
    {
        id: "oso",
        name: "OSO DE ANTEOJOS",
        sciName: "Tremarctos ornatus",
        role: "EL GUARDIÁN DE AGUA",
        desc: "Espíritu sagrado de los Andes. Donde él camina, nace la vida.",
        location: "3.600M // ROMERALES",
        // Nueva imagen: Oso Negro Americano en entorno boscoso (mejor silueta)
        img: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?q=80&w=2000&auto=format&fit=crop",
        accentClass: "text-purple-500",
        position: "object-center"
    }
];

export default function BookingCTA() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();
        
        // --- DESKTOP CINEMATIC SCROLL (Pinned) ---
        mm.add("(min-width: 768px)", () => {
            const slides = gsap.utils.toArray('.desktop-slide');
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=350%",
                    pin: true,
                    scrub: 0.8,
                    snap: {
                        snapTo: 1 / (slides.length - 1),
                        duration: { min: 0.4, max: 0.8 },
                        delay: 0.1,
                        ease: "power2.inOut"
                    },
                    onUpdate: (self) => {
                        if (progressRef.current) {
                            progressRef.current.style.height = `${self.progress * 100}%`;
                        }
                    }
                }
            });

            slides.forEach((slide, i) => {
                const textElements = (slide as HTMLElement).querySelectorAll('.text-reveal');

                if (i < slides.length - 1) {
                    const nextSlide = slides[i + 1];
                    const nextTextElements = (nextSlide as HTMLElement).querySelectorAll('.text-reveal');
                    
                    tl.to(slide as HTMLElement, {
                        scale: 1.2, 
                        opacity: 0,
                        filter: "blur(20px)",
                        duration: 1.2,
                        ease: "power2.in"
                    });
                    
                    tl.to(textElements, {
                        y: -20,
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.05
                    }, "<");

                    tl.fromTo(nextSlide as HTMLElement, 
                        { opacity: 0, scale: 0.9, filter: "blur(15px)", zIndex: i + 2 },
                        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }, 
                        "<+=0.1" 
                    );

                    tl.fromTo(nextTextElements, 
                        { y: 30, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
                        "<+=0.4"
                    );
                }
            });

            tl.fromTo(".final-cta", 
                { autoAlpha: 0, y: 30 }, 
                { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }, 
                ">-=0.2"
            );
        });

        // --- MOBILE ANIMATIONS (Vertical Scroll Reveal) ---
        mm.add("(max-width: 767px)", () => {
            const mobileSlides = gsap.utils.toArray('.mobile-slide');
            
            mobileSlides.forEach((slide) => {
                const el = slide as HTMLElement;
                const text = el.querySelectorAll('.text-reveal-mobile');
                const img = el.querySelector('img');

                // Image Parallax Effect
                gsap.to(img, {
                    scale: 1.15,
                    y: "10%", // Slight parallax movement
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });

                // Text Reveal Animation
                gsap.fromTo(text, 
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 65%", // Trigger when element is 65% up the viewport
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        });

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative w-full bg-slate-950 overflow-hidden">
            
            {/* --- DESKTOP LAYOUT --- */}
            <div className="hidden md:block w-full h-screen relative">
                
                {/* PROGRESS BAR */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/5 z-50">
                    <div ref={progressRef} className="w-full bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
                </div>

                {FAUNA.map((animal, i) => (
                    <div 
                        key={animal.id}
                        className={`desktop-slide absolute inset-0 w-full h-full flex items-center justify-center ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={animal.img} 
                                alt={animal.name}
                                className={`w-full h-full object-cover grayscale contrast-[1.25] brightness-[0.7] ${animal.position}`}
                                style={{
                                    maskImage: 'radial-gradient(circle at 70% center, black 35%, transparent 85%)',
                                    WebkitMaskImage: 'radial-gradient(circle at 70% center, black 35%, transparent 85%)'
                                }}
                            />
                        </div>

                        <div className="relative z-10 w-full h-full px-frame flex flex-col justify-center">
                            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-12 gap-8 items-center">
                                <div className="col-span-6 space-y-6 pl-12">
                                    <div className="flex items-center gap-4 text-reveal">
                                        <span className={`text-tech-caption ${animal.accentClass} tracking-[0.4em]`}>
                                            0{i + 1} // {animal.role}
                                        </span>
                                        <div className="h-px bg-white/20 w-12"></div>
                                    </div>

                                    <h2 className="text-5xl md:text-7xl font-bold text-white mix-blend-overlay opacity-90 leading-[0.9] tracking-tighter text-reveal uppercase">
                                        {animal.name}
                                    </h2>

                                    <div className="text-reveal">
                                        <span className="text-tech-caption text-white/40 block mb-2 italic font-mono">{animal.sciName}</span>
                                        <p className="text-body-lead text-slate-300 max-w-sm drop-shadow-lg leading-relaxed">
                                            "{animal.desc}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 text-white/50 font-mono text-xs pt-2 text-reveal">
                                        <MapPin className="w-4 h-4" />
                                        <span className="tracking-widest">{animal.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="final-cta absolute bottom-24 left-0 w-full z-50 flex justify-center pointer-events-none opacity-0">
                    <button className="pointer-events-auto group bg-white px-10 py-5 flex items-center gap-4 hover:bg-cyan-500 transition-colors duration-300">
                        <span className="text-black font-bold tracking-widest text-sm uppercase group-hover:text-white transition-colors">Reservar Expedición</span>
                        <ArrowRight className="text-black w-4 h-4 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

            {/* --- MOBILE LAYOUT (Parallax Reveal) --- */}
            <div className="md:hidden block">
                {FAUNA.map((animal, i) => (
                    <div 
                        key={animal.id} 
                        className="mobile-slide relative w-full h-[85vh] overflow-hidden flex flex-col justify-end pb-24 border-b border-white/5 bg-slate-950"
                    >
                        {/* Image Background */}
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={animal.img} 
                                alt={animal.name}
                                className={`w-full h-full object-cover grayscale contrast-[1.3] brightness-[0.7] ${animal.position}`}
                                style={{
                                    maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)'
                                }}
                            />
                        </div>
                        
                        {/* Text Content */}
                        <div className="relative z-10 px-frame space-y-4">
                            <div className="text-reveal-mobile">
                                <span className={`text-tech-caption ${animal.accentClass} block`}>
                                    0{i + 1} // {animal.role}
                                </span>
                            </div>
                            <h2 className="text-5xl font-bold text-white leading-none tracking-tighter text-reveal-mobile uppercase drop-shadow-lg">
                                {animal.name}
                            </h2>
                            <p className="text-sm text-slate-300 font-light text-reveal-mobile max-w-[90%]">
                                "{animal.desc}"
                            </p>
                            <div className="flex items-center gap-2 text-white/40 pt-2 text-reveal-mobile">
                                <MapPin className="w-3 h-3" />
                                <span className="text-tech-caption">{animal.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Mobile CTA (Standard Block) */}
                <div className="py-20 px-frame bg-slate-950 flex flex-col justify-center items-center z-[50]">
                    <h3 className="text-white text-xl font-bold uppercase tracking-tight mb-6">Tu viaje comienza aquí</h3>
                    <button className="w-full bg-white py-5 flex items-center justify-center gap-4">
                         <span className="text-black font-bold tracking-widest uppercase text-xs">Solicitar Acceso</span>
                         <ArrowRight className="text-black w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* GLOBAL GRAIN */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-[100] sticky top-0 h-screen"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

        </section>
    );
}

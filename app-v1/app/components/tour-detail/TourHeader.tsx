'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Tour, Departure } from '../../types/api';
import Header from '../Header';
import { Calendar, Mountain, ArrowDown, MapPin, Wind } from 'lucide-react';
import BookingModal from './BookingModal';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourHeader({ tour, departures }: { tour: Tour; departures: Departure[] }) {
    const scopeRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openBooking = () => setIsModalOpen(true);

    useGSAP(() => {
        // 1. INTRO: Revelado Editorial
        const introTl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });
        
        introTl
            .fromTo(".fj-title-box", 
                { y: 50, opacity: 0, filter: "blur(15px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", delay: 0.3 }
            )
            .fromTo(".fj-image-shutter",
                { clipPath: "inset(100% 0% 0% 0%)" }, // Cortina cerrada (abajo)
                { clipPath: "inset(0% 0% 0% 0%)", duration: 2, ease: "power3.inOut" },
                "-=1.2"
            )
            .fromTo(".fj-main-img",
                { scale: 1.2 },
                { scale: 1.1, duration: 2.5 },
                "<"
            );

        // 2. SCROLL: Parallax Cinematográfico
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: ".fj-hero-section",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            }
        });

        scrollTl
            // El texto sube a velocidad normal
            .to(".fj-title-box", {
                y: -100,
                opacity: 0,
                ease: "none"
            })
            // La montaña sube más lento (Parallax real)
            .to(".fj-main-img", {
                yPercent: 15,
                ease: "none"
            }, 0)
            // Sutil desvanecimiento de la base
            .to(".fj-image-overlay", {
                opacity: 1,
                ease: "none"
            }, 0);

    }, { scope: scopeRef });

    return (
        <div ref={scopeRef} className="fj-root bg-background">
            <Header />

            {/* CTA ACCIÓN - ESTILO BOUTIQUE */}
            <div className="hidden md:block fixed top-24 right-frame z-[100] mix-blend-difference pointer-events-auto">
                <button onClick={openBooking} className="group flex flex-col items-end gap-3">
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-2xl">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                        Reservar
                    </span>
                </button>
            </div>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tour={tour} departures={departures} />

            <section className="fj-hero-section relative w-full flex flex-col pt-[120px] md:pt-[160px] overflow-hidden">
                
                {/* 1. HEADER (EDITORIAL) */}
                <div className="fj-title-box relative z-20 px-frame max-w-7xl mx-auto w-full text-left md:text-center mb-16 md:mb-24">
                    <div className="flex items-center justify-start md:justify-center gap-4 mb-8">
                        <div className="w-8 h-px bg-cyan-500/40"></div>
                        <span className="text-sub-label text-cyan-500 tracking-[0.4em] uppercase">Expedición de Alta Ruta</span>
                        <div className="w-8 h-px bg-cyan-500/40 hidden md:block"></div>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl lg:text-[8vw] font-black text-white tracking-tighter uppercase leading-[0.85] mb-10 drop-shadow-2xl">
                        {tour.name.es}
                    </h1>
                    
                    <p className="text-body-lead text-slate-400 max-w-2xl mx-auto font-light leading-relaxed opacity-80 md:text-center">
                        {tour.subtitle?.es}
                    </p>
                </div>

                {/* 2. THE IMAGE CANVAS (Fijo 1000px) */}
                <div className="relative w-full flex justify-center items-start overflow-visible">
                    <div 
                        className="fj-image-shutter relative w-full h-[60vh] md:h-[1000px] overflow-hidden bg-slate-900 will-change-[clip-path]"
                    >
                        <img 
                            src={tour.images[0]} 
                            alt={tour.name.es} 
                            className="fj-main-img w-full h-[120%] object-cover absolute top-[-10%] left-0 will-change-transform"
                        />
                        
                        {/* Capas de fundido orgánico */}
                        <div className="fj-image-overlay absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-background z-20"></div>

                        {/* Annotations (Bitácora) */}
                        <div className="absolute top-12 left-12 z-30 hidden md:flex flex-col gap-6 text-white/20 font-mono text-[10px] tracking-[0.4em] uppercase">
                            <div className="flex items-center gap-3">
                                <Mountain className="w-3 h-3" /> Peak Elev: {tour.altitude.es}
                            </div>
                            <div className="flex items-center gap-3">
                                <Wind className="w-3 h-3" /> Air_Conditions: Stable
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. SCROLL INDICATOR */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20">
                    <span className="text-[8px] font-bold tracking-[0.4em] text-white uppercase">Explorar Crónica</span>
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>

            </section>
        </div>
    );
}
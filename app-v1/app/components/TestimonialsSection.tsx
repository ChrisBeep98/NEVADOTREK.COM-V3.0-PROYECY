"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Star, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const reviews = [
        {
            name: "MARCUS CHEN",
            trip: "TOLIMA GLACIER",
            text: "Nevado Trek transformed a simple climb into a technical masterpiece.",
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
        },
        {
            name: "SARAH JENKINS",
            trip: "PRIVATE COCORA",
            text: "The silence I found in the private palm forests is something I will carry forever.",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
        },
        {
            name: "LUCAS MARTINEZ",
            trip: "PARAMO EXPEDITION",
            text: "Authentic, raw, and professional. Seeing the Frailejones changed my perspective.",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
        },
        {
            name: "EMMA WILSON",
            trip: "COFFEE HERITAGE",
            text: "A deep dive into the soul of Salento. The most respectful tour I've joined.",
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
        }
    ];

    useGSAP(() => {
        const track = trackRef.current;
        const section = sectionRef.current;
        if (!track || !section) return;

        // Horizonal Scroll linked to Vertical
        gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${track.scrollWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // Dynamic Progress Bar
        gsap.fromTo(progressRef.current, 
            { scaleX: 0, transformOrigin: "left" },
            { 
                scaleX: 1, 
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${track.scrollWidth}`,
                    scrub: 1
                }
            }
        );

    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative h-screen bg-[#020617] overflow-hidden">
            
            {/* Header - Fixed during scroll */}
            <div className="absolute top-12 left-12 md:left-24 z-20">
                <span className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-2 block">Voices</span>
                <h2 className="text-4xl font-bold text-white tracking-tighter">THE ECHOES.</h2>
            </div>

            {/* CUSTOM SCROLLBAR (TECHNICAL) */}
            <div className="absolute bottom-12 left-24 right-24 h-[1px] bg-white/10 z-20 overflow-hidden">
                <div ref={progressRef} className="absolute inset-0 bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
            </div>

            {/* THE TRACK */}
            <div ref={trackRef} className="flex flex-nowrap h-full items-center px-[10vw] gap-24 md:gap-40">
                {reviews.map((review, i) => (
                    <div key={i} className="flex-shrink-0 w-[300px] md:w-[600px] flex flex-col gap-8 md:gap-12">
                        
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-700">
                                <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 fill-cyan-400 text-cyan-400" />)}
                                </div>
                                <span className="text-white font-bold tracking-tight text-xl">{review.name}</span>
                                <span className="text-[10px] font-mono text-cyan-500 tracking-widest uppercase">{review.trip}</span>
                            </div>
                        </div>

                        <p className="text-2xl md:text-5xl lg:text-6xl font-light text-white leading-tight italic tracking-tighter">
                            "{review.text}"
                        </p>

                        <div className="font-mono text-[8px] text-white/20 tracking-[0.5em] uppercase">
                            Expedition_Log // 0{i + 1}
                        </div>
                    </div>
                ))}
            </div>

            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-50"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
        </section>
    );
}
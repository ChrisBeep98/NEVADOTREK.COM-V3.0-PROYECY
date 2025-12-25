"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, Shield, Mountain, Map, Coffee, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    const services = [
        {
            id: "01",
            title: "LOCAL ORIGIN",
            desc: "Guides born and raised in Salento. We don't just know the trails; we belong to them.",
            icon: <Coffee className="w-5 h-5" />
        },
        {
            id: "02",
            title: "PRIVATE ACCESS",
            desc: "Exclusive permits to private Cocora estates. We find the silence where others find crowds.",
            icon: <Map className="w-5 h-5" />
        },
        {
            id: "03",
            title: "ELITE SAFETY",
            desc: "Satellite tracking and professional alpine gear. Your safety is our technical obsession.",
            icon: <Shield className="w-5 h-5" />
        },
        {
            id: "04",
            title: "EXPERT GUIDANCE",
            desc: "Technical excellence for the Nevado del Tolima glacier. We lead the way home.",
            icon: <Mountain className="w-5 h-5" />
        }
    ];

    useGSAP(() => {
        const items = containerRef.current?.querySelectorAll('.feature-item');
        const introWords = containerRef.current?.querySelectorAll('.intro-word');
        
        // Animación Pro para el texto de introducción
        if (introWords) {
            gsap.fromTo(introWords, 
                { 
                    opacity: 0.1, 
                    filter: "blur(12px)",
                    color: "rgba(255,255,255,0.1)"
                },
                { 
                    opacity: 1, 
                    filter: "blur(0px)",
                    color: "#ffffff",
                    stagger: 0.05,
                    duration: 0.8,
                    ease: "sine.inOut",
                    scrollTrigger: {
                        trigger: ".intro-text",
                        start: "top 85%",
                        end: "bottom 60%",
                        scrub: true,
                    }
                }
            );
        }

        if (items) {
            gsap.fromTo(items, 
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, y: 0, 
                    stagger: 0.1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                    }
                }
            );
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="bg-[#020617] py-24 md:py-40 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 md:mb-32 items-end">
                    <div>
                        <span className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] uppercase block mb-4">Nevado Trek Essentials</span>
                        <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter leading-none">
                            THE <br/>ADVANTAGE.
                        </h2>
                    </div>
                    <div className="flex justify-end items-center md:ml-auto w-full md:w-auto">
                        <div className="group relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-crosshair transition-transform duration-700 hover:scale-105">
                            
                            {/* Ultra-minimalist Circle Frame */}
                            <div className="absolute inset-0 border border-white/[0.05] rounded-full transition-colors duration-700 group-hover:border-white/20"></div>
                            
                            {/* The Vector Mountain */}
                            <svg width="60%" height="60%" viewBox="0 0 100 100" className="relative z-10 overflow-visible transition-all duration-700">
                                {/* The Base Path */}
                                <path 
                                    d="M0,80 L35,80 L50,20 L65,80 L100,80" 
                                    fill="none" 
                                    stroke="rgba(255,255,255,0.1)" 
                                    strokeWidth="0.5" 
                                />
                                
                                {/* The Glowing Peak Line */}
                                <path 
                                    d="M35,80 L50,20 L65,80" 
                                    fill="none" 
                                    stroke="#22d3ee" 
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    className="opacity-40 transition-opacity duration-700 group-hover:opacity-100"
                                />

                                {/* The Goal Point */}
                                <circle cx="50" cy="20" r="1.5" fill="#22d3ee" className="animate-pulse shadow-[0_0_10px_#22d3ee]" />
                                
                                {/* Orbiting Signal Dot */}
                                <g className="animate-[spin_8s_linear_infinite] origin-[50px_50px] group-hover:animate-[spin_3s_linear_infinite] transition-all">
                                    <circle cx="50" cy="0" r="1" fill="white" className="opacity-20 group-hover:opacity-60 transition-opacity duration-700" />
                                </g>
                            </svg>

                            {/* Minimal Crosshair Accents */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white/20 transition-all duration-700 group-hover:h-4 group-hover:bg-cyan-500/50"></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-white/20 transition-all duration-700 group-hover:h-4 group-hover:bg-cyan-500/50"></div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-white/20 transition-all duration-700 group-hover:w-4 group-hover:bg-cyan-500/50"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-white/20 transition-all duration-700 group-hover:w-4 group-hover:bg-cyan-500/50"></div>

                        </div>
                    </div>
                </div>

                {/* Features List - Optimized for all screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 md:gap-y-32">
                    {services.map((service, i) => (
                        <div key={i} className="feature-item group flex flex-col gap-6">
                            {/* Top info */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-cyan-500">
                                        {service.icon}
                                    </div>
                                    <span className="text-[10px] font-mono tracking-widest text-white/40">
                                        PROTOCOL // {service.id}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-white/20 group-hover:text-cyan-500 transition-colors">
                                    0{i + 1}
                                </span>
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-slate-400 text-base md:text-lg font-light leading-relaxed max-w-md">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Detail */}
                <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 opacity-30">
                    <div className="flex items-center gap-4">
                        <Users className="w-4 h-4 text-white" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-white">100% LOCAL OPERATION</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono tracking-[0.3em] text-white">EST. 1998 // QUINDÍO, COLOMBIA</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
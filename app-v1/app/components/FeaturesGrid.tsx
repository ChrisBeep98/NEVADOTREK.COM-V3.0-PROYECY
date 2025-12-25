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
        <section ref={containerRef} className="bg-slate-50 py-24 md:py-40 px-6 border-t border-slate-200">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 md:mb-32 items-end">
                    <div className="flex flex-col gap-4">
                        <span className="text-cyan-600 font-mono text-[10px] tracking-[0.5em] uppercase block">Nevado Trek Essentials</span>
                        <h2 className="text-5xl md:text-8xl font-bold text-slate-950 tracking-tighter leading-none">
                            THE <br/>ADVANTAGE.
                        </h2>
                    </div>
                    
                    {/* Minimalist Visual Element (Adapted for Light Mode) */}
                    <div className="flex justify-end items-center md:ml-auto w-full md:w-auto">
                        <div className="group relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center cursor-crosshair transition-transform duration-700 hover:scale-105">
                            <div className="absolute inset-0 border border-slate-900/[0.05] rounded-full transition-colors duration-700 group-hover:border-slate-900/10"></div>
                            <svg width="60%" height="60%" viewBox="0 0 100 100" className="relative z-10 overflow-visible">
                                <path d="M0,80 L35,80 L50,20 L65,80 L100,80" fill="none" stroke="rgba(15,23,42,0.1)" strokeWidth="0.5" />
                                <path d="M35,80 L50,20 L65,80" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" className="opacity-40 group-hover:opacity-100 transition-opacity duration-700" />
                                <circle cx="50" cy="20" r="1.5" fill="#0891b2" />
                                <g className="animate-[spin_8s_linear_infinite] origin-[50px_50px] group-hover:animate-[spin_3s_linear_infinite] transition-all">
                                    <circle cx="50" cy="0" r="1" fill="#0f172a" className="opacity-10 group-hover:opacity-30" />
                                </g>
                            </svg>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-slate-900/10 group-hover:bg-cyan-600 group-hover:h-4 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-slate-900/10 group-hover:bg-cyan-600 group-hover:h-4 transition-all duration-700"></div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-slate-900/10 group-hover:bg-cyan-600 group-hover:w-4 transition-all duration-700"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-2 bg-slate-900/10 group-hover:bg-cyan-600 group-hover:w-4 transition-all duration-700"></div>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 md:gap-y-32">
                    {services.map((service, i) => (
                        <div key={i} className="feature-item group flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-cyan-600">
                                        {service.icon}
                                    </div>
                                    <span className="text-[10px] font-mono tracking-widest text-slate-400">
                                        PROTOCOL // {service.id}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-600 transition-colors">
                                    0{i + 1}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-2xl md:text-4xl font-bold text-slate-950 mb-4 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed max-w-md">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Detail */}
                <div className="mt-32 pt-16 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 opacity-60">
                    <div className="flex items-center gap-4">
                        <Users className="w-4 h-4 text-slate-950" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-slate-950">100% LOCAL OPERATION</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono tracking-[0.3em] text-slate-950 uppercase">Est. 1998 // Quindío, Colombia</span>
                    </div>
                </div>

            </div>
        </section>
    );
}

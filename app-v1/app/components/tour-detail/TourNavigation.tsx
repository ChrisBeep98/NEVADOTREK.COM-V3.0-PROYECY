'use client';

import React, { useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const SECTIONS = [
    { id: 'overview', label: 'RESUMEN' },
    { id: 'gallery', label: 'GALERÍA' },
    { id: 'itinerary', label: 'ITINERARIO' },
    { id: 'dates', label: 'SALIDAS' },
    { id: 'pricing', label: 'TARIFAS' }
];

export default function TourNavigation() {
    const [activeSection, setActiveSection] = useState('overview');

    useGSAP(() => {
        SECTIONS.forEach(section => {
            ScrollTrigger.create({
                trigger: `#${section.id}`,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveSection(section.id),
                onEnterBack: () => setActiveSection(section.id),
            });
        });
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="hidden lg:flex flex-col gap-6 sticky top-32 w-48 z-40 mix-blend-difference">
            <span className="text-journal-data text-white mb-2">
                Índice de ruta
            </span>
            <div className="flex flex-col gap-4 border-l border-white/20 pl-6">
                {SECTIONS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollTo(item.id)}
                        className={`text-left text-xs tracking-widest uppercase transition-all duration-300 ${
                            activeSection === item.id 
                                ? 'text-white font-bold translate-x-2' 
                                : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

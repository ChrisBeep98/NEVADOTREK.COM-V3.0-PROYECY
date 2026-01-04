'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/LanguageContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourNavigation() {
    const { t } = useLanguage();
    
    const SECTIONS = React.useMemo(() => [
        { id: 'overview', label: t.tour_detail.nav.overview },
        { id: 'gallery', label: t.tour_detail.nav.gallery },
        { id: 'itinerary', label: t.tour_detail.nav.itinerary },
        { id: 'dates', label: t.tour_detail.nav.dates }
    ], [t.tour_detail.nav]);

    const [activeSection, setActiveSection] = useState('overview');
    const indicatorRef = useRef<HTMLDivElement>(null);
    const navItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
    
    const INDICATOR_HEIGHT = 16; // Short technical bar

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
    }, [t.tour_detail.nav, SECTIONS]);

    // Animate the short sliding bar to center with active text
    useEffect(() => {
        const activeIndex = SECTIONS.findIndex(s => s.id === activeSection);
        const targetElement = navItemsRef.current[activeIndex];
        
        if (targetElement && indicatorRef.current) {
            const centerY = targetElement.offsetTop + (targetElement.offsetHeight / 2) - (INDICATOR_HEIGHT / 2);
            
            gsap.to(indicatorRef.current, {
                y: centerY,
                duration: 0.6,
                ease: "expo.out"
            });
        }
    }, [activeSection, t.tour_detail.nav, SECTIONS]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="hidden lg:flex flex-col gap-6 sticky top-32 w-48 z-40 mix-blend-difference">
            <span className="text-journal-data text-white mb-2">
                {t.tour_detail.nav.index}
            </span>
            
            <div className="relative pl-6">
                
                {/* 1. Static Rail */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10"></div>
                
                {/* 2. Short Technical Indicator */}
                <div 
                    ref={indicatorRef}
                    className="absolute left-[-1px] w-[3px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] rounded-full z-10"
                    style={{ height: `${INDICATOR_HEIGHT}px` }}
                ></div>

                {/* 3. Compact Navigation Links */}
                <div className="flex flex-col gap-1.5">
                    {SECTIONS.map((item, index) => (
                        <button
                            key={item.id}
                            ref={el => { navItemsRef.current[index] = el }}
                            onClick={() => scrollTo(item.id)}
                            className={`text-left text-sm tracking-widest transition-all duration-500 ${
                                activeSection === item.id 
                                    ? 'text-white font-medium translate-x-3' 
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { List, X } from 'lucide-react';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const navItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    
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

    // Mobile menu animation
    useEffect(() => {
        if (isMobileMenuOpen) {
            gsap.to(mobileMenuRef.current, {
                height: 'auto',
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(mobileMenuRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in'
            });
        }
    }, [isMobileMenuOpen]);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Floating Bubble - Positioned Above Booking Button */}
            <div className="lg:hidden fixed bottom-[68px] left-[var(--spacing-frame)] z-50">
                <div className="relative">
                    {/* Mobile Menu Panel - Minimalist Expansion */}
                    <div 
                        ref={mobileMenuRef}
                        className="absolute bottom-full left-0 w-48 bg-glass backdrop-blur-xl border border-border rounded-t-xl overflow-hidden mb-3"
                        style={{ height: 0, opacity: 0 }}
                    >
                        <div className="p-4 space-y-3">
                            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                                {t.tour_detail.nav.index}
                            </span>
                            {SECTIONS.map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    ref={el => { navItemsRef.current[index] = el }}
                                    className={`w-full text-left py-2 px-3 rounded-lg transition-all duration-300 ${
                                        activeSection === item.id
                                            ? 'bg-foreground text-background font-medium'
                                            : 'text-foreground/70 hover:bg-surface'
                                    }`}
                                >
                                    <span className="text-sm tracking-wide">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bubble Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`w-12 h-12 rounded-full border border-border bg-glass backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-lg ${
                            isMobileMenuOpen 
                                ? 'bg-foreground text-background border-foreground' 
                                : 'hover:border-cyan-500/50'
                        }`}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <List className="w-5 h-5 text-foreground" />
                        )}
                    </button>
                </div>
            </div>

            {/* Desktop Sidebar Navigation */}
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
        </>
    );
}


"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MountainSnow, Sun, Moon, MessageCircle, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Header() {
    const [isDark, setIsDark] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { lang, toggleLang, t } = useLanguage();
    const navRef = useRef<HTMLElement>(null);

    // Initial Theme Check
    useEffect(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);

        if (shouldBeDark !== isDark) {
            setIsDark(shouldBeDark);
        }
        
        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Body Scroll Lock
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isMenuOpen]);

    // Header Entrance Animation
    useGSAP(() => {
        gsap.fromTo(".header-reveal",
            { y: -20, opacity: 0 },
            { 
                y: 0, 
                opacity: 1, 
                duration: 1.2, 
                stagger: 0.1, 
                ease: "power3.out", 
                delay: 1.3,
                force3D: true 
            }
        );
    }, { scope: navRef });

    const toggleTheme = () => {
        const newMode = !isDark;
        setIsDark(newMode);
        
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <>
            <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-frame mix-blend-difference text-white/90">
                <div className="flex items-center gap-2 cursor-pointer header-reveal">
                    <MountainSnow width={24} strokeWidth={1.5} />
                    <span className="font-bold tracking-tighter text-xl uppercase">Nevado Trek</span>
                </div>
                
                <div className="flex items-center gap-4 md:gap-8">
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide header-reveal">
                        <Link href="/" className="hover:text-cyan-400 transition-colors uppercase">{t.navigation.home}</Link>
                        <Link href="/tours" className="hover:text-cyan-400 transition-colors uppercase">{t.navigation.tours}</Link>
                    </div>

                    <div className="flex items-center gap-2 header-reveal">
                        {/* Language Toggle */}
                        <button
                            onClick={toggleLang}
                            className="w-9 h-9 rounded-full border border-white/20 hover:bg-white/10 hover:border-cyan-400/50 flex items-center justify-center transition-all pointer-events-auto"
                            aria-label="Switch Language"
                        >
                            <span className="text-[10px] font-bold tracking-widest translate-y-[1px]">
                                {lang}
                            </span>
                        </button>

                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-full border border-white/20 hover:bg-white/10 hover:border-cyan-400/50 flex items-center justify-center transition-all pointer-events-auto"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? (
                                <Sun className="w-4 h-4 text-white" />
                            ) : (
                                <Moon className="w-4 h-4 text-white" />
                            )}
                        </button>

                        {/* Hamburger Button (Mobile Only) */}
                        <button 
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 transition-all pointer-events-auto"
                            aria-label="Open Menu"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Contact CTA (Desktop Only) */}
                    <a 
                        href="https://wa.me/573147995791"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:flex group border border-white/20 items-center justify-between pl-4 pr-1.75 py-2.5 rounded-full hover:bg-white hover:text-slate-950 transition-all font-normal text-[11px] tracking-[0.05em] capitalize h-[44px] w-[160px] hover:scale-105 active:scale-95 header-reveal"
                    >
                        <span className="text-sm">{t.common.contact}</span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                    </a>
                </div>
            </nav>

            <MobileMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                isDark={isDark}
                toggleTheme={toggleTheme}
            />
        </>
    );
}

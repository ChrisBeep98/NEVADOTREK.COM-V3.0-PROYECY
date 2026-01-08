"use client";

import React, { useRef } from 'react';
import { X, MessageCircle, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isDark: boolean;
    toggleTheme: () => void;
}

export default function MobileMenu({ isOpen, onClose, isDark, toggleTheme }: MobileMenuProps) {
    const { lang, toggleLang, t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

    useGSAP(() => {
        if (isOpen) {
            // Open animation
            gsap.to(containerRef.current, {
                clipPath: 'circle(150% at calc(100% - 40px) 40px)',
                duration: 0.8,
                ease: 'power3.inOut',
                pointerEvents: 'auto'
            });

            // Stagger links
            gsap.fromTo(linksRef.current.filter(Boolean), 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
            );
        } else {
            // Close animation
            gsap.to(containerRef.current, {
                clipPath: 'circle(0% at calc(100% - 40px) 40px)',
                duration: 0.6,
                ease: 'power3.inOut',
                pointerEvents: 'none'
            });
        }
    }, { dependencies: [isOpen], scope: containerRef });

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-glass backdrop-blur-xl flex flex-col pointer-events-none overflow-hidden text-foreground"
            style={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
        >
            {/* Header inside Menu */}
            <div className="flex justify-between items-center py-6 px-frame">
                <div className="flex items-center gap-2">
                    <span className="font-bold tracking-tighter text-xl">NEVADO</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Language Toggle */}
                    <button 
                        onClick={toggleLang}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-surface hover:border-cyan-500/50 transition-colors"
                        aria-label="Switch Language"
                    >
                        <span className="text-[10px] font-bold tracking-widest">
                            {lang}
                        </span>
                    </button>

                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-surface hover:border-cyan-500/50 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun className="w-4 h-4 text-cyan-500" /> : <Moon className="w-4 h-4 text-cyan-500" />}
                    </button>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-surface transition-transform active:scale-90"
                        aria-label="Close menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 flex flex-col justify-center px-frame gap-8">
                <span className="text-sub-label opacity-50 mb-[-1rem]">{t.mobile_menu.exploration}</span>
                <Link 
                    href="/" 
                    onClick={onClose}
                    ref={(el) => { linksRef.current[0] = el; }}
                    className="text-h-section-title hover:text-cyan-500 transition-colors uppercase"
                >
                    {t.navigation.home}
                </Link>
                <Link 
                    href="/tours" 
                    onClick={onClose}
                    ref={(el) => { linksRef.current[1] = el; }}
                    className="text-h-section-title hover:text-cyan-500 transition-colors uppercase"
                >
                    {t.navigation.tours}
                </Link>
                
                <button className="btn-primary flex justify-between items-center group">
                    <span>{t.common.contact}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-950/10 flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                </button>
            </div>
        </div>
    );
}

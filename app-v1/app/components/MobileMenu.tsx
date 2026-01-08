"use client";

import React, { useRef } from 'react';
import { X, Sun, Moon, ArrowRight, MapPin } from 'lucide-react';
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
    const decorativeLineRef = useRef<HTMLDivElement>(null);
    const dividerLinesRef = useRef<(HTMLDivElement | null)[]>([]);
    const contactButtonRef = useRef<HTMLButtonElement>(null);

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

            // Divider lines animation
            gsap.fromTo(dividerLinesRef.current.filter(Boolean),
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.5 }
            );

            // Decorative line animation
            gsap.fromTo(decorativeLineRef.current,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.7 }
            );

            // Contact button entry
            gsap.fromTo(contactButtonRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.9 }
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
                    <span className="font-bold tracking-tighter text-xl">MENU</span>
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
            <div className="flex-1 flex flex-col justify-center px-frame pb-8">
                <span className="text-sub-label opacity-50 mb-4 text-right">{t.mobile_menu.exploration}</span>
                
                <div className="space-y-4">
                    <Link 
                        href="/" 
                        onClick={onClose}
                        ref={(el) => { linksRef.current[0] = el; }}
                        className="group flex items-center justify-end gap-4 py-2"
                    >
                        <span className="text-h-section-title group-hover:text-cyan-500 group-hover:-translate-x-2 transition-all duration-300 uppercase text-right">
                            {t.navigation.home}
                        </span>
                        <span className="text-journal-data text-cyan-500 font-bold w-6 text-right">01</span>
                    </Link>
                    
                    <div 
                        ref={(el) => { dividerLinesRef.current[0] = el; }}
                        className="w-full h-[1px] bg-border/50 origin-right"
                    ></div>
                    
                    <Link 
                        href="/tours" 
                        onClick={onClose}
                        ref={(el) => { linksRef.current[1] = el; }}
                        className="group flex items-center justify-end gap-4 py-2"
                    >
                        <span className="text-h-section-title group-hover:text-cyan-500 group-hover:-translate-x-2 transition-all duration-300 uppercase text-right">
                            {t.navigation.tours}
                        </span>
                        <span className="text-journal-data text-cyan-500 font-bold w-6 text-right">02</span>
                    </Link>
                </div>

                {/* Decorative Line */}
                <div 
                    ref={decorativeLineRef}
                    className="w-full h-[1px] bg-border/50 my-6 origin-right"
                />

                {/* Contact - Minimalist Design */}
                <Link 
                    href="#contact"
                    onClick={onClose}
                    ref={contactButtonRef as unknown as React.Ref<HTMLAnchorElement>}
                    className="flex items-center gap-4 py-4 group border border-border rounded-full px-6 bg-surface/30 hover:border-cyan-500/50 hover:bg-surface/60 transition-all duration-300 self-end"
                >
                    <div className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center group-hover:border-cyan-500 group-hover:bg-cyan-500/10 transition-all">
                        <MapPin className="w-4 h-4 text-muted group-hover:text-cyan-500" />
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium tracking-wide group-hover:text-cyan-500 transition-colors">
                            {t.common.contact}
                        </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>
        </div>
    );
}

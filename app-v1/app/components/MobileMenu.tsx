"use client";

import React, { useRef } from 'react';
import { X, Sun, Moon, MessageCircle } from 'lucide-react';
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
    const menuTitleRef = useRef<HTMLSpanElement>(null);
    const headerButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const labelRef = useRef<HTMLSpanElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const decorativeLineRef = useRef<HTMLDivElement>(null);
    const dividerLinesRef = useRef<(HTMLDivElement | null)[]>([]);
    const contactButtonWrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (isOpen) {
            // Open animation - container
            gsap.to(containerRef.current, {
                clipPath: 'circle(150% at calc(100% - 40px) 40px)',
                duration: 0.6,
                ease: 'power3.inOut',
                pointerEvents: 'auto'
            });

            const tl = gsap.timeline({ delay: 0.15 });

            // All content fade in simultaneously with minimal stagger
            tl.fromTo([menuTitleRef.current, ...headerButtonsRef.current.filter(Boolean), labelRef.current],
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.35, stagger: 0.02, ease: 'power2.out' }
            );

            tl.fromTo([...linksRef.current.filter(Boolean), ...dividerLinesRef.current.filter(Boolean), decorativeLineRef.current, contactButtonWrapperRef.current],
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: 'power2.out' },
                '-=0.2'
            );
        } else {
            // Close animation
            gsap.to(containerRef.current, {
                clipPath: 'circle(0% at calc(100% - 40px) 40px)',
                duration: 0.5,
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
                    <span ref={menuTitleRef} className="font-bold tracking-tighter text-xl">MENU</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Language Toggle */}
                    <button
                        ref={(el) => { headerButtonsRef.current[0] = el; }}
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
                        ref={(el) => { headerButtonsRef.current[1] = el; }}
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center bg-surface hover:border-cyan-500/50 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun className="w-4 h-4 text-cyan-500" /> : <Moon className="w-4 h-4 text-cyan-500" />}
                    </button>

                    {/* Close Button */}
                    <button
                        ref={(el) => { headerButtonsRef.current[2] = el; }}
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
                <span ref={labelRef} className="text-sub-label opacity-50 mb-4 text-right">{t.mobile_menu.exploration}</span>

                <div className="space-y-0">
                    <Link
                        href="/"
                        onClick={onClose}
                        ref={(el) => { linksRef.current[0] = el; }}
                        className="group flex items-center justify-end gap-4 py-6 transition-all duration-300 active:bg-cyan-500/10 rounded-md"
                    >
                        <span className="text-h-section-title group-hover:text-cyan-500 group-hover:-translate-x-2 uppercase text-right">
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
                        className="group flex items-center justify-end gap-4 py-6 transition-all duration-300 active:bg-cyan-500/10 rounded-md"
                    >
                        <span className="text-h-section-title group-hover:text-cyan-500 group-hover:-translate-x-2 uppercase text-right">
                            {t.navigation.tours}
                        </span>
                        <span className="text-journal-data text-cyan-500 font-bold w-6 text-right">02</span>
                    </Link>
                </div>

                {/* Decorative Line */}
                <div
                    ref={decorativeLineRef}
                    className="w-full h-[1px] bg-border/50 my-10 origin-right"
                />

                {/* Contact - Desktop Header Style */}
                <div 
                    ref={contactButtonWrapperRef}
                    className="self-end"
                >
                    <a 
                        href="https://wa.me/573147995791"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between border border-border pl-4 pr-1.5 py-2 rounded-full hover:bg-foreground hover:text-background transition-all font-normal text-[11px] tracking-[0.05em] capitalize h-[44px] w-[160px] hover:scale-105 active:scale-95"
                    >
                        <span className="text-sm">{t.common.contact}</span>
                        <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

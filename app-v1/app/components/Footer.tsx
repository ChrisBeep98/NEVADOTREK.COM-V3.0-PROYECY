import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const { t, lang } = useLanguage();
    const containerRef = useRef(null);
    const letterORef = useRef(null);
    const letterRRef = useRef(null);
    const letterERef = useRef(null);

    useGSAP(() => {
        // Shared "Focus Pull" Animation Properties
        const focusAnim = {
            filter: 'blur(0px)',
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 20%', 
                end: 'bottom bottom',
                scrub: 1
            }
        };

        // Animation for 'O'
        gsap.fromTo(letterORef.current, 
            { y: '2vw', filter: 'blur(12px)', opacity: 0.4 },
            { ...focusAnim, y: '-1vw' }
        );

        // Animation for 'R' - Peak
        gsap.fromTo(letterRRef.current, 
            { y: '2vw', filter: 'blur(12px)', opacity: 0.4 },
            { ...focusAnim, y: '-4vw', scrollTrigger: { ...focusAnim.scrollTrigger, scrub: 1.5 } }
        );

        // Animation for 'E' - Lower than R
        gsap.fromTo(letterERef.current, 
            { y: '2vw', filter: 'blur(12px)', opacity: 0.4 },
            { ...focusAnim, y: '-2vw', scrollTrigger: { ...focusAnim.scrollTrigger, scrub: 2 } }
        );
    }, { scope: containerRef });

    return (
        <footer ref={containerRef} className="w-screen h-screen flex-shrink-0 bg-[#FAFAFA] text-[#02040a] dark:bg-[#02040a] dark:text-[#EDEDED] flex flex-col overflow-hidden transition-colors duration-500 shadow-[inset_-20px_0_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[inset_-20px_0_30px_-10px_rgba(0,0,0,0.3)]">
            {/* Minimalist Background: Subtle Central Light Source */}
            {/* Theme: Deep Blue hint (Light Mode) / Clean Cyan hint (Dark Mode) */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-indigo-900/10 dark:bg-cyan-900/5 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Main Content Container - Using px-frame for strict Design System compliance matching Header */}
            <div className="flex-1 flex flex-col px-frame pt-24 md:pt-0 relative z-10 w-full justify-between pb-12 md:pb-0">
                {/* Top Label */}
                <div className="flex items-center gap-2 mb-8 md:mb-0 md:mt-12 flex-none">
                    <span className="text-cyan-500 text-xl font-bold">+</span>
                    <span className="text-sm font-medium tracking-wide text-gray-400 dark:text-gray-500">{t.page_footer.contact}</span>
                </div>

                {/* Hero Query - Centered naturally by flex spacing */}
                <div className="flex items-center py-8 md:py-0">
                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-medium tracking-tight leading-[1.05] max-w-6xl text-[#02040a] dark:text-[#EDEDED]">
                        {t.page_footer.cta}
                    </h2>
                </div>

                {/* Middle Section: Contact & Nav */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-0 mb-8 md:mb-12 flex-none">
                    
                    {/* Contact Info */}
                    <div className="space-y-3 md:space-y-4">
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Contact us at:</p>
                        <a href="mailto:expeditions@nevadotrek.com" className="group flex items-center gap-2 text-lg md:text-3xl font-medium hover:opacity-80 active:scale-95 transition-all text-[#02040a] dark:text-[#EDEDED]">
                            {t.page_footer.email}
                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-gray-500 dark:text-gray-400 group-hover:text-[#02040a] dark:group-hover:text-[#EDEDED] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-3 md:gap-12">
                        <Link href="/" className="text-lg md:text-xl font-medium text-[#02040a] dark:text-[#EDEDED] hover:text-cyan-500 dark:hover:text-cyan-600 active:scale-95 active:text-cyan-600 transition-all">{t.page_footer.nav.home}</Link>
                        <Link href="/tours" className="text-lg md:text-xl font-medium text-[#02040a] dark:text-[#EDEDED] hover:text-cyan-500 dark:hover:text-cyan-600 active:scale-95 active:text-cyan-600 transition-all">{t.page_footer.nav.expeditions}</Link>
                        <Link href="/gallery" className="text-lg md:text-xl font-medium text-[#02040a] dark:text-[#EDEDED] hover:text-cyan-500 dark:hover:text-cyan-600 active:scale-95 active:text-cyan-600 transition-all">{t.page_footer.nav.gallery}</Link>
                    </nav>
                </div>
            </div>

            {/* Giant Logo Area - Fixed at bottom but flows naturally */}
            <div className="relative w-full flex-none">
                <div className="px-frame pt-4 pb-48 md:pb-32">
                   {/* Logo Refinements: 
                       - Align Left
                       - Reduced Weight (Bold -> Medium)
                       - Removed Opacity/Blend Modes for solid visibility
                       - Optical Alignment: Aggressive negative margin to kill bearing
                       - Visibility: Increased contrast (text-foreground/40)
                       - Animation: GSAP Scroll Scrub Stepped Offset
                   */}
                   <h1 className="text-[23vw] md:text-[17vw] leading-[0.75] tracking-tighter font-medium text-left select-none text-[#02040a]/40 dark:text-[#EDEDED]/40 transition-colors duration-500 -ml-[1.5vw] flex items-end overflow-visible drop-shadow-lg">
                        {/* Static Letters */}
                        <span>E</span>
                        <span>X</span>
                        <span>P</span>
                        <span>L</span>
                        
                        {/* Animated Letters - Minimal Focus Pull */}
                        <span ref={letterORef} className="inline-block transform-gpu will-change-transform">O</span>
                        <span ref={letterRRef} className="inline-block transform-gpu will-change-transform">R</span>
                        <span ref={letterERef} className="inline-block transform-gpu will-change-transform">{lang === 'ES' ? 'A' : 'E'}</span>
                   </h1>
                </div>

                {/* Bottom Footer Bar - Theme Reactivity Fixed & Social Bubbles Added */}
                <div className="absolute bottom-6 left-0 w-full px-frame flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] md:text-xs font-medium gap-6 md:gap-0">
                    <p className="text-gray-500/60 dark:text-gray-400/60 uppercase tracking-wider">© 2026 Nevado Trek. All rights reserved.</p>
                    
                    <div className="flex gap-4">
                        {/* Facebook - Blue Gradient */}
                        <a href="https://www.facebook.com/nevado.trek/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center text-gray-400 dark:text-gray-600 transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-400 hover:scale-110 active:scale-90 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>

                        {/* Instagram - Pink/Orange/Purple Gradient */}
                        <a href="https://www.instagram.com/nevadotrek" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center text-gray-400 dark:text-gray-600 transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:scale-110 active:scale-90 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>

                        {/* WhatsApp - Green Gradient */}
                        <a href="https://wa.me/573147995791" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center text-gray-400 dark:text-gray-600 transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-400 hover:scale-110 active:scale-90 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

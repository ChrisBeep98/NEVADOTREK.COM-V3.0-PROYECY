import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative min-h-[100dvh] w-full bg-background text-foreground flex flex-col overflow-hidden z-50 transition-colors duration-500">
            {/* Background Glow Effect - Adapts to Mode */}
            {/* Dark: Blue/Purple Glow | Light: Soft Cyan/Blue Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[120px] md:blur-[150px] pointer-events-none" />
            
            {/* Main Content Container - Using px-frame for strict Design System compliance matching Header */}
            <div className="flex-1 flex flex-col px-frame pt-24 md:pt-0 relative z-10 w-full justify-between pb-12 md:pb-0">
                {/* Top Label */}
                <div className="flex items-center gap-2 mb-8 md:mb-0 md:mt-12 flex-none">
                    <span className="text-cyan-500 text-xl font-bold">+</span>
                    <span className="text-sm font-medium tracking-wide text-muted">Contact Us</span>
                </div>

                {/* Hero Query - Centered naturally by flex spacing */}
                <div className="flex items-center py-8 md:py-0">
                    <h2 className="text-3xl md:text-4xl lg:text-6xl font-medium tracking-tight leading-[1.05] max-w-6xl text-foreground">
                        Interested in starting your expedition, <span className="text-muted/60">pushing your limits</span> or simply <span className="text-muted/60">exploring nature?</span>
                    </h2>
                </div>

                {/* Middle Section: Contact & Nav */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-0 mb-8 md:mb-12 flex-none">
                    
                    {/* Contact Info */}
                    <div className="space-y-3 md:space-y-4">
                        <p className="text-sm text-muted font-medium">Contact us at:</p>
                        <a href="mailto:expeditions@nevadotrek.com" className="group flex items-center gap-2 text-2xl md:text-3xl font-medium hover:opacity-80 transition-opacity text-foreground">
                            expeditions@nevadotrek.com
                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-muted group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-3 md:gap-12">
                        {['Destinations', 'Journal', 'Team', 'Manifesto'].map((item) => (
                            <a key={item} href="#" className="text-lg md:text-xl font-medium text-foreground hover:text-cyan-500 transition-colors">
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Giant Logo Area - Fixed at bottom but flows naturally */}
            <div className="relative w-full border-t border-border flex-none">
                <div className="px-frame pt-4 pb-48 md:pb-32">
                   {/* Logo Refinements: 
                       - Align Left
                       - Reduced Weight (Bold -> Medium)
                       - Removed Opacity/Blend Modes for solid visibility
                       - Optical Alignment: Aggressive negative margin to kill bearing
                       - Visibility: Increased contrast (text-foreground/40)
                   */}
                   <h1 className="text-[17vw] leading-[0.75] tracking-tighter font-medium text-left select-none text-foreground/40 dark:text-foreground/40 transition-colors duration-500 -ml-[1.5vw]">
                        EXPLORE
                   </h1>
                </div>

                {/* Bottom Footer Bar - Theme Reactivity Fixed & Social Bubbles Added */}
                <div className="absolute bottom-6 left-0 w-full px-frame flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] md:text-xs font-medium gap-6 md:gap-0">
                    <p className="text-muted/60 uppercase tracking-wider">© 2026 Nevado Trek. All rights reserved.</p>
                    
                    <div className="flex gap-4">
                        {/* Facebook - Blue Gradient */}
                        <a href="#" className="w-12 h-12 rounded-full bg-foreground/5 dark:bg-white/5 flex items-center justify-center text-muted transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>

                        {/* Instagram - Pink/Orange/Purple Gradient */}
                        <a href="#" className="w-12 h-12 rounded-full bg-foreground/5 dark:bg-white/5 flex items-center justify-center text-muted transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:scale-110 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>

                        {/* WhatsApp - Green Gradient */}
                        <a href="#" className="w-12 h-12 rounded-full bg-foreground/5 dark:bg-white/5 flex items-center justify-center text-muted transition-all duration-300 hover:text-white hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-400 hover:scale-110 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

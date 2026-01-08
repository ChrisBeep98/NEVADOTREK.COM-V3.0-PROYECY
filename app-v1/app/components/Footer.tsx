import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative min-h-screen w-full bg-background text-foreground flex flex-col overflow-hidden z-50 transition-colors duration-500">
            {/* Background Glow Effect - Adapts to Mode */}
            {/* Dark: Blue/Purple Glow | Light: Soft Cyan/Blue Gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-500/5 dark:bg-blue-900/10 rounded-full blur-[120px] md:blur-[150px] pointer-events-none" />
            
            {/* Main Content Container - Using px-frame for strict Design System compliance matching Header */}
            <div className="flex-1 flex flex-col px-frame pt-20 md:pt-24 relative z-10 w-full">
                {/* Top Label */}
                <div className="flex items-center gap-2 mb-8 md:mb-12 flex-none">
                    <span className="text-cyan-500 text-xl font-bold">+</span>
                    <span className="text-sm font-medium tracking-wide text-muted">Contact Us</span>
                </div>

                {/* Hero Query - Centered vertically in available space */}
                <div className="flex-1 flex items-center">
                    <h2 className="text-2xl md:text-4xl lg:text-6xl font-medium tracking-tight leading-[1.05] max-w-6xl text-foreground">
                        Interested in starting your expedition, <span className="text-muted/60">pushing your limits</span> or simply <span className="text-muted/60">exploring nature?</span>
                    </h2>
                </div>

                {/* Middle Section: Contact & Nav */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 md:gap-0 mt-12 mb-12 flex-none">
                    
                    {/* Contact Info */}
                    <div className="space-y-3 md:space-y-4">
                        <p className="text-sm text-muted font-medium">Contact us at:</p>
                        <a href="mailto:expeditions@nevadotrek.com" className="group flex items-center gap-2 text-xl md:text-3xl font-medium hover:opacity-80 transition-opacity text-foreground">
                            expeditions@nevadotrek.com
                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-muted group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap gap-6 md:gap-12">
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
                <div className="px-frame pt-4 pb-20 md:pb-24">
                   {/* Logo Refinements: 
                       - Align Left
                       - Reduced Weight (Bold -> Medium)
                       - Removed Opacity/Blend Modes for solid visibility
                       - Optical Alignment: Aggressive negative margin to kill bearing
                   */}
                   <h1 className="text-[17vw] leading-[0.75] tracking-tighter font-medium text-left select-none text-muted/20 dark:text-muted/20 transition-colors duration-500 -ml-[1.5vw]">
                        EXPLORE
                   </h1>
                </div>

                {/* Bottom Footer Bar - Now positioned within the padded area safely */}
                <div className="absolute bottom-6 left-0 w-full px-frame flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-muted uppercase tracking-wider font-medium mix-blend-plus-lighter dark:mix-blend-plus-lighter">
                    <p>© 2026 Nevado Trek. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
                        <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

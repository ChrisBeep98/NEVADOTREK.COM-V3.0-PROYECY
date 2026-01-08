import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative min-h-screen w-full bg-[#02040a] text-[#EDEDED] flex flex-col overflow-hidden z-50">
            {/* Background Glow Effect - Night Camp Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
            
            {/* Main Content Container - Using px-frame for strict Design System compliance matching Header */}
            <div className="flex-1 flex flex-col px-frame pt-20 md:pt-24 relative z-10 w-full">
                {/* Top Label */}
                <div className="flex items-center gap-2 mb-8 md:mb-12 flex-none">
                    <span className="text-cyan-500 text-xl font-bold">+</span>
                    <span className="text-sm font-medium tracking-wide text-slate-400">Contact Us</span>
                </div>

                {/* Hero Query - Centered vertically in available space */}
                <div className="flex-1 flex items-center">
                    <h2 className="text-2xl md:text-4xl lg:text-6xl font-medium tracking-tight leading-[1.05] max-w-6xl">
                        Interested in starting your expedition, <span className="opacity-50">pushing your limits</span> or simply <span className="opacity-50">exploring nature?</span>
                    </h2>
                </div>

                {/* Middle Section: Contact & Nav */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 md:gap-0 mt-12 mb-12 flex-none">
                    
                    {/* Contact Info */}
                    <div className="space-y-3 md:space-y-4">
                        <p className="text-sm text-slate-500 font-medium">Contact us at:</p>
                        <a href="mailto:expeditions@nevadotrek.com" className="group flex items-center gap-2 text-xl md:text-3xl font-medium hover:opacity-80 transition-opacity">
                            expeditions@nevadotrek.com
                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-slate-500 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap gap-6 md:gap-12">
                        {['Destinations', 'Journal', 'Team', 'Manifesto'].map((item) => (
                            <a key={item} href="#" className="text-lg md:text-xl font-medium hover:text-cyan-400 transition-colors">
                                {item}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Giant Logo Area - Fixed at bottom but flows naturally */}
            <div className="relative w-full border-t border-white/5 flex-none">
                <div className="px-frame pt-4 pb-20 md:pb-24">
                   <h1 className="text-[17vw] leading-[0.75] tracking-tighter font-bold text-center select-none text-white mix-blend-overlay opacity-90">
                        NEVADO
                   </h1>
                </div>

                {/* Bottom Footer Bar - Now positioned within the padded area safely */}
                <div className="absolute bottom-6 left-0 w-full px-frame flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-medium mix-blend-plus-lighter">
                    <p>© 2026 Nevado Trek. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

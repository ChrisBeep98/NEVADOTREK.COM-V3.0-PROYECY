"use client";

import React, { useEffect, useState } from 'react';
import { MountainSnow, Sun, Moon } from 'lucide-react';
import esDict from '../../dictionaries/es.json';
import enDict from '../../dictionaries/en.json';

const DICTIONARIES = {
    ES: esDict,
    EN: enDict
};

export default function Header() {
    const [isDark, setIsDark] = useState(true);
    const [lang, setLang] = useState<'ES' | 'EN'>('ES');
    const t = DICTIONARIES[lang];

    // Initial Theme Check
    useEffect(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

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

    const toggleLang = () => {
        setLang(prev => prev === 'ES' ? 'EN' : 'ES');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-frame mix-blend-difference text-white">
            <div className="flex items-center gap-2 cursor-pointer">
                <MountainSnow width={24} strokeWidth={1.5} />
                <span className="font-bold tracking-tighter text-xl">NEVADO TREK</span>
            </div>
            <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
                    <a href="#" className="hover:text-cyan-400 transition-colors uppercase">{t.navigation.tours}</a>
                    <a href="#" className="hover:text-cyan-400 transition-colors uppercase">{t.navigation.philosophy}</a>
                </div>

                <div className="flex items-center gap-3">
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
                </div>

                <button className="hidden md:block border border-white/20 w-32 py-2 rounded-full hover:bg-white hover:text-slate-950 transition-all font-bold text-[11px] tracking-[0.2em] uppercase text-center">
                    {t.common.join}
                </button>
            </div>
        </nav>
    );
}
"use client";

import React, { useEffect, useState } from 'react';
import { MountainSnow, Sun, Moon } from 'lucide-react';

export default function Header() {
    const [isDark, setIsDark] = useState(true);

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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-frame mix-blend-difference text-white">
            <div className="flex items-center gap-2 cursor-pointer">
                <MountainSnow width={24} strokeWidth={1.5} />
                <span className="font-bold tracking-tighter text-xl">NEVADO TREK</span>
            </div>
            <div className="flex items-center gap-6 md:gap-12">
                <div className="hidden md:flex items-center gap-12 text-sm font-medium tracking-wide">
                    <a href="#" className="hover:text-cyan-400 transition-colors">EXPEDICIONES</a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">FILOSOFÍA</a>
                </div>

                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors pointer-events-auto"
                    aria-label="Toggle Theme"
                >
                    {isDark ? (
                        <Sun className="w-4 h-4 text-white" />
                    ) : (
                        <Moon className="w-4 h-4 text-white" />
                    )}
                </button>

                <button className="hidden md:block border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-slate-950 transition-all">
                    UNIRSE
                </button>
            </div>
        </nav>
    );
}
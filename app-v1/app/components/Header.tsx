"use client";

import React from 'react';
import { MountainSnow } from 'lucide-react';

export default function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-frame mix-blend-difference text-white">
            <div className="flex items-center gap-2 cursor-pointer">
                <MountainSnow width={24} strokeWidth={1.5} />
                <span className="font-bold tracking-tighter text-xl">NEVADO TREK</span>
            </div>
            <div className="hidden md:flex items-center gap-12 text-sm font-medium tracking-wide">
                <a href="#" className="hover:text-cyan-400 transition-colors">EXPEDICIONES</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">FILOSOFÍA</a>
                <button className="border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-slate-950 transition-all">
                    UNIRSE
                </button>
            </div>
        </nav>
    );
}
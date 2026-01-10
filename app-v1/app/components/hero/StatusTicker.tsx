"use client";

import React, { useRef, useEffect } from 'react';
import { Aperture } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface StatusTickerProps {
    className?: string;
    showLiveIndicator?: boolean;
}

export default function StatusTicker({ className = '', showLiveIndicator = true }: StatusTickerProps) {
    const { t } = useLanguage();
    const statusRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const msgs = [`${t.hero.status.alt}: 4500M`, `${t.hero.status.temp}: -15C`, `${t.hero.status.wind}: 40KT`, `${t.hero.status.o2}: 88%`];
        if (statusRef.current) statusRef.current.innerText = msgs[0];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % msgs.length;
            if (statusRef.current) statusRef.current.innerText = msgs[i];
        }, 3000);
        return () => clearInterval(interval);
    }, [t.hero.status]);

    return (
        <div className={`flex flex-col items-end gap-1 ${className}`}>
            {showLiveIndicator && (
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end leading-none">
                        {(Array.isArray(t.hero.ui.live_now) ? t.hero.ui.live_now : [t.hero.ui.live_now]).map((line, i) => (
                            <span key={i} className="text-[9px] font-mono text-white/90 tracking-[0.2em] uppercase font-light shadow-black drop-shadow-sm">
                                {line}
                            </span>
                        ))}
                    </div>
                    <Aperture className="w-4 h-4 text-red-500 animate-spin-slow drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </div>
            )}
            <span ref={statusRef} className="text-[9px] font-mono text-white/60 tracking-wider"></span>
        </div>
    );
}

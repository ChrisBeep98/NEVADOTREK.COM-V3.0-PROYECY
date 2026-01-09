"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, MapPin, Calendar } from 'lucide-react';

export default function FooterWidget() {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = () => {
        return currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    const formatDate = () => {
        return currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="flex w-[94vw] md:w-[40vw] h-screen flex-shrink-0 border-l border-gray-200 dark:border-white/5">
            <div className="h-full w-full flex flex-col justify-center px-6 md:px-16 py-16 relative">
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                
                {/* Content */}
                <div className="relative z-10 space-y-8 md:space-y-12">
                    {/* Date & Time Section */}
                    <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate()}</span>
                        </div>
                        <div className="text-[5rem] md:text-[8rem] font-bold leading-none tracking-tighter bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            {formatTime()}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

                    {/* Weather Section */}
                    <div className="space-y-6">
                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>Salento, Quindío</span>
                        </div>

                        {/* Temperature & Condition */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <Sun className="w-14 h-14 text-white" />
                            </div>
                            <div>
                                <div className="text-5xl md:text-6xl font-bold text-[#02040a] dark:text-[#EDEDED]">18°</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Partly Cloudy</div>
                            </div>
                        </div>

                        {/* Weather Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-white/5">
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Wind</div>
                                <div className="text-lg font-semibold text-[#02040a] dark:text-[#EDEDED]">8 km/h</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Humidity</div>
                                <div className="text-lg font-semibold text-[#02040a] dark:text-[#EDEDED]">75%</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Altitude</div>
                                <div className="text-lg font-semibold text-[#02040a] dark:text-[#EDEDED]">1,895m</div>
                            </div>
                        </div>
                    </div>

                    {/* Trek Status Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Perfect Trek Conditions</span>
                    </div>

                    {/* Credit */}
                    <div className="pt-12 border-t border-gray-200 dark:border-white/5">
                        <p className="text-xs text-gray-400 dark:text-gray-500 text-left">
                            Made By Christian Sandoval
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

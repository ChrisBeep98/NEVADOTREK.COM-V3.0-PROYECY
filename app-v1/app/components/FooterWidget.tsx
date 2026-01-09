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
        <div className="hidden md:flex w-screen h-screen flex-shrink-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-600/20 dark:from-cyan-400/10 dark:via-blue-400/10 dark:to-purple-500/10 backdrop-blur-2xl border-l border-white/20 dark:border-white/10">
            <div className="h-full w-full flex flex-col justify-center items-center px-12 py-16 relative overflow-hidden">
                {/* Animated gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Content */}
                <div className="relative z-10 w-full max-w-2xl space-y-8">
                    {/* Time Display */}
                    <div className="text-center">
                        <div className="text-8xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                            {formatTime()}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate()}</span>
                        </div>
                    </div>

                    {/* Weather Card */}
                    <div className="bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-cyan-500" />
                                <span className="text-lg font-medium text-[#02040a] dark:text-[#EDEDED]">Bogotá, Colombia</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Sun className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <div className="text-5xl font-bold text-[#02040a] dark:text-[#EDEDED]">24°</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Partly Cloudy</div>
                                </div>
                            </div>
                        </div>

                        {/* Weather Details */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                            <div className="text-center">
                                <Wind className="w-5 h-5 text-cyan-500 mx-auto mb-2" />
                                <div className="text-xs text-gray-500 dark:text-gray-400">Wind</div>
                                <div className="text-sm font-medium text-[#02040a] dark:text-[#EDEDED]">12 km/h</div>
                            </div>
                            <div className="text-center">
                                <CloudRain className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                                <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
                                <div className="text-sm font-medium text-[#02040a] dark:text-[#EDEDED]">65%</div>
                            </div>
                            <div className="text-center">
                                <Cloud className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                                <div className="text-xs text-gray-500 dark:text-gray-400">Pressure</div>
                                <div className="text-sm font-medium text-[#02040a] dark:text-[#EDEDED]">1013 mb</div>
                            </div>
                        </div>
                    </div>

                    {/* Trek Conditions */}
                    <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl">✓</span>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Perfect Trek Conditions</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-500">Ideal for high-altitude expeditions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

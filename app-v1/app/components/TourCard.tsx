'use client';

import React, { useRef } from 'react';
import { Calendar, Thermometer, Activity } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Tour } from '../types/api';
import Link from 'next/link';

// Registrar plugins solo en el cliente
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface TourCardProps {
    tour: Tour;
    index: number;
    className?: string;
    lang: 'ES' | 'EN';
    nextDate?: string; // New optional prop for upcoming departure
}

export default function TourCard({ tour, index, className = '', lang, nextDate }: TourCardProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);
    const l = lang.toLowerCase() as 'es' | 'en';

    // Animación On-Reveal (Mantenemos la optimización de performance)
    useGSAP(() => {
        const el = cardRef.current;
        if (!el) return;

        gsap.fromTo(el, 
            { y: 40, opacity: 0, scale: 0.98 },
            {
                y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    toggleActions: "play none none none"
                }
            }
        );
    }, { scope: cardRef });

    // Lógica de color: Prioridad Dificultad -> Fallback Rotación por Índice
    // Esto asegura variedad visual incluso si todos los tours son "Medium"
    const getThemeColors = () => {
        const diff = (tour.difficulty || 'medium').toLowerCase();
        
        // Colores específicos para dificultades altas
        if (diff.includes('hard')) return { accent: "text-orange-400", badge: "text-orange-500", badgeBg: "bg-orange-500/10 border-orange-500/20" };
        if (diff.includes('extreme')) return { accent: "text-blue-400", badge: "text-blue-500", badgeBg: "bg-blue-500/10 border-blue-500/20" };
        if (diff.includes('technical')) return { accent: "text-purple-400", badge: "text-purple-500", badgeBg: "bg-purple-500/10 border-purple-500/20" };

        // Rotación para el resto (Medium/Easy) para garantizar variedad
        const rotation = index % 4;
        if (rotation === 0) return { accent: "text-cyan-400", badge: "text-cyan-500", badgeBg: "bg-cyan-500/10 border-cyan-500/20" };
        if (rotation === 1) return { accent: "text-purple-400", badge: "text-purple-500", badgeBg: "bg-purple-500/10 border-purple-500/20" };
        if (rotation === 2) return { accent: "text-orange-400", badge: "text-orange-500", badgeBg: "bg-orange-500/10 border-orange-500/20" };
        return { accent: "text-blue-400", badge: "text-blue-500", badgeBg: "bg-blue-500/10 border-blue-500/20" };
    };

    const { accent: accentColor, badge: badgeColor, badgeBg } = getThemeColors();

    return (
        <Link 
            href={`/tours/${tour.tourId}`}
            ref={cardRef}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className={`group relative rounded-xl overflow-hidden bg-slate-900 cursor-pointer block shadow-2xl shadow-black/40 will-change-transform max-h-[520px] md:max-h-none ${className}`}
        >
            {/* Imagen Original con Hover scale sutil */}
            <img 
                src={tour.images[0]} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                alt={tour.name[l]} 
            />
            
            {/* Gradiente Original */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70"></div>
            
            {/* Badges (Top Right) */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {/* Next Date Chip (Liquid Glass) */}
                {nextDate && (
                    <span className="inline-flex items-center justify-center gap-1.5 h-8 px-4 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                        <Calendar width={10} className="text-white/80" />
                        <span className="text-[10px] font-medium tracking-wide uppercase leading-none">{nextDate}</span>
                    </span>
                )}
                
                {/* Difficulty Badge (Liquid Glass) */}
                <span className="inline-flex items-center justify-center h-8 px-4 rounded-[8px] bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-[10px] font-medium tracking-wide uppercase leading-none">
                    {tour.difficulty}
                </span>
            </div>

            {/* Contenido Original (Bottom) */}
            <div className="absolute bottom-0 left-0 p-6 px-4 md:p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {/* Sub-label formato original */}
                <span className={`text-sub-label ${accentColor} mb-3 block`}>
                    0{index + 1} {'//'} {tour.name[l].split(' ').slice(0, 2).join(' ').toUpperCase()}
                </span>
                
                {/* Título Blanco */}
                <h3 className="text-heading-l text-white mb-2">
                    {tour.name[l]}
                </h3>

                {/* Acordeón Original (h-0 -> h-auto) */}
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                    <p className="text-body-std text-white/90 mb-4 pt-4 border-t border-white/10">
                        {tour.shortDescription[l]}
                    </p>
                    
                    {/* Iconos Originales */}
                    <div className="flex items-center gap-4 text-journal-data text-slate-300">
                        <span className="flex items-center gap-1.5">
                            <Calendar width={12} className={badgeColor} /> {tour.totalDays} {l === 'es' ? 'Días' : 'Days'}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Thermometer width={12} className={badgeColor} /> {tour.temperature[l]}
                        </span>
                        {/* Mostramos Altitud si hay espacio */}
                        <span className="hidden xl:flex items-center gap-1.5">
                            <Activity width={12} className={badgeColor} /> {tour.altitude[l]}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
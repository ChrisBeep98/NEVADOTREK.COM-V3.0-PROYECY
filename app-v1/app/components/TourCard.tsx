'use client';

import React, { useRef } from 'react';
import { Calendar, Thermometer, Activity, MapPin, Users } from 'lucide-react';
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
}

export default function TourCard({ tour, index, className = '' }: TourCardProps) {
    const cardRef = useRef<HTMLAnchorElement>(null);

    // Animación On-Reveal (Mantenemos la optimización de performance)
    useGSAP(() => {
        const el = cardRef.current;
        if (!el) return;

        gsap.fromTo(el, 
            { y: 60, opacity: 0, scale: 0.98 },
            {
                y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, { scope: cardRef });

    // Lógica de color: Prioridad Dificultad -> Fallback Rotación por Índice
    // Esto asegura variedad visual incluso si todos los tours son "Medium"
    const getThemeColors = () => {
        const diff = tour.difficulty.toLowerCase();
        
        // Colores específicos para dificultades altas
        if (diff.includes('hard')) return { accent: "text-orange-400", badge: "text-orange-500" };
        if (diff.includes('extreme')) return { accent: "text-blue-400", badge: "text-blue-500" };
        if (diff.includes('technical')) return { accent: "text-purple-400", badge: "text-purple-500" };

        // Rotación para el resto (Medium/Easy) para garantizar variedad
        // Patrón: Cyan -> Purple -> Orange -> Blue
        const rotation = index % 4;
        if (rotation === 0) return { accent: "text-cyan-400", badge: "text-cyan-500" };
        if (rotation === 1) return { accent: "text-purple-400", badge: "text-purple-500" };
        if (rotation === 2) return { accent: "text-orange-400", badge: "text-orange-500" };
        return { accent: "text-blue-400", badge: "text-blue-500" };
    };

    const { accent: accentColor, badge: badgeColor } = getThemeColors();

    return (
        <Link 
            href={`/tours/${tour.tourId}`}
            ref={cardRef}
            className={`group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer block shadow-2xl shadow-black/40 will-change-transform ${className}`}
        >
            {/* Imagen Original con Hover scale sutil */}
            <img 
                src={tour.images[0]} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" 
                alt={tour.name.en} 
            />
            
            {/* Gradiente Original */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
            
            {/* Badge Original (Top Right) */}
            <div className="absolute top-6 right-6 z-20">
                <span className="text-journal-data px-3 py-1.5 rounded-md bg-white/10 backdrop-blur border border-white/10 text-white uppercase">
                    {tour.difficulty}
                </span>
            </div>

            {/* Contenido Original (Bottom) */}
            <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {/* Sub-label formato original */}
                <span className={`text-sub-label ${accentColor} mb-3 block`}>
                    0{index + 1} // {tour.name.es.split(' ').slice(0, 2).join(' ').toUpperCase()}
                </span>
                
                {/* Título Blanco */}
                <h3 className="text-heading-l text-white mb-2">
                    {tour.name.es}
                </h3>

                {/* Acordeón Original (h-0 -> h-auto) */}
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                    <p className="text-body-std text-slate-400 mb-4 pt-4 border-t border-white/10">
                        {tour.shortDescription.es}
                    </p>
                    
                    {/* Iconos Originales */}
                    <div className="flex items-center gap-4 text-journal-data text-slate-300">
                        <span className="flex items-center gap-1.5">
                            <Calendar width={12} className={badgeColor} /> {tour.totalDays} Días
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Thermometer width={12} className={badgeColor} /> {tour.temperature.es}
                        </span>
                        {/* Mostramos Altitud si hay espacio */}
                        <span className="hidden xl:flex items-center gap-1.5">
                            <Activity width={12} className={badgeColor} /> {tour.altitude.es}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
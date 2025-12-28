'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourGallery({ images }: { images: string[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Si no hay suficientes imágenes, no renderizamos
    if (!images || images.length === 0) return null;

    useGSAP(() => {
        const imgs = gsap.utils.toArray('.gallery-img');
        
        imgs.forEach((img: any, i) => {
            gsap.fromTo(img, 
                { y: 50, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
                    scrollTrigger: {
                        trigger: img,
                        start: "top 90%",
                        end: "bottom top",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

    }, { scope: containerRef });

    return (
        <section id="gallery" ref={containerRef} className="section-v-spacing px-frame bg-slate-950 border-t border-white/5">
             <div className="max-w-6xl mx-auto">
                <div className="mb-12 flex items-baseline justify-between">
                     <span className="text-sub-label text-slate-500">VISUAL DIARY</span>
                     <span className="text-journal-data text-slate-700 hidden md:inline">CAPTURING THE SUMMIT</span>
                </div>
                
                {/* Grid Layout - Mosaico Asimétrico */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
                    
                    {/* Imagen Principal - Ocupa más espacio */}
                    <div className="md:col-span-8 relative overflow-hidden rounded-sm group gallery-img">
                         <img 
                            src={images[0]} 
                            alt="Gallery Moment" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    {/* Segunda Imagen - Vertical o Cuadrada */}
                    {images[1] && (
                        <div className="md:col-span-4 relative overflow-hidden rounded-sm group gallery-img">
                            <img 
                                src={images[1]} 
                                alt="Gallery Moment" 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                            />
                        </div>
                    )}

                    {/* Tercera Imagen - Panorámica Inferior si existe */}
                    {images[2] && (
                        <div className="md:col-span-12 relative overflow-hidden rounded-sm group gallery-img md:h-[300px]">
                            <img 
                                src={images[2]} 
                                alt="Gallery Moment" 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                            />
                        </div>
                    )}
                </div>
             </div>
        </section>
    );
}

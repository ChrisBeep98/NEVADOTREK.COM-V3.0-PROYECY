'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourGallery({ images }: { images: string[] }) {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const imgs = gsap.utils.toArray('.gallery-img');
        
        imgs.forEach((img: unknown) => {
            const element = img as HTMLElement;
            gsap.fromTo(element, 
                { y: 30, opacity: 0, scale: 0.98 },
                {
                    y: 0, opacity: 1, scale: 1, 
                    duration: 1, 
                    ease: "power2.out",
                    force3D: true,
                    scrollTrigger: {
                        trigger: element,
                        start: "top 92%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });

    }, { scope: containerRef, dependencies: [images] });

    return (
        <section id="gallery" ref={containerRef} className="section-v-spacing px-frame bg-background relative overflow-hidden transition-colors duration-500">
             
             {/* Background Element - Sutil en ambos modos */}
             <div className="absolute -right-24 top-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

             <div className="max-w-6xl mx-auto pt-12">
                <div className="mb-10">
                     <div className="flex items-center gap-2 mb-4">
                        <Camera className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-sub-label">{t.tour_detail.gallery.pretitle}</span>
                     </div>
                     <h2 className="text-h-section-title text-foreground">{t.tour_detail.gallery.title}</h2>
                </div>
                
                {/* Grid Layout - Mosaico Asimétrico Dinámico */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-[300px] md:auto-rows-[450px]">
                    {images.map((img, i) => {
                        // Patrón de diseño: 8-4, 4-4-4, 12... y repite
                        const pattern = i % 6;
                        let colSpan = "md:col-span-4";
                        if (pattern === 0) colSpan = "md:col-span-8";
                        if (pattern === 5) colSpan = "md:col-span-12";

                        return (
                            <div 
                                key={i} 
                                className={`${colSpan} relative overflow-hidden rounded-[6px] group gallery-img shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-surface will-change-transform transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#040918]/60 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
                                <img 
                                    src={img} 
                                    alt={`Gallery Moment ${i + 1}`} 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-[1.5s] ease-out"
                                />
                                <div className="absolute bottom-6 left-6 flex items-center gap-3 z-20">
                                    <span className="text-[10px] font-mono text-white/60 tracking-[0.2em] uppercase bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        {i + 1 < 10 ? `0${i + 1}` : i + 1} {pattern === 5 ? '/ Panorama' : i === 0 ? '/ Journal' : ''}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
             </div>
        </section>
    );
}
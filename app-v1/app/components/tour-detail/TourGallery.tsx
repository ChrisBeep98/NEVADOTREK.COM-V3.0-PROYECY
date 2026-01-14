'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import GalleryModal from '../ui/GalleryModal';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourGallery({ images }: { images: string[] }) {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openModal = (index: number) => {
        setSelectedIndex(index);
        setIsModalOpen(true);
    };

    useGSAP(() => {
        // 1. Text Reveal (Header)
        gsap.fromTo(".gallery-text-reveal",
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: ".gallery-header",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );

        // 2. High-Performance Image Batching (Solves Scroll Lag)
        // Instead of one watcher per image, we batch them effectively.
        ScrollTrigger.batch(".gallery-img", {
            start: "top 85%",
            once: true, // Key for performance: don't recalc on scroll up
            onEnter: (batch) => {
                gsap.fromTo(batch, 
                    { autoAlpha: 0, y: 40, scale: 0.96 },
                    {
                        autoAlpha: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.8, 
                        ease: "power2.out", 
                        stagger: 0.1, // Flow effect
                        overwrite: true
                    }
                );
            }
        });

    }, { scope: containerRef, dependencies: [images] });

    return (
        <section id="gallery" ref={containerRef} className="section-v-spacing px-frame bg-background relative overflow-hidden transition-colors duration-500">
             
             {/* Background Element - Sutil en ambos modos */}
             <div className="absolute -right-24 top-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

             <div className="max-w-6xl mx-auto pt-12">
                <div className="mb-10 gallery-header">
                     <div className="flex items-center gap-2 mb-4 gallery-text-reveal">
                        <Camera className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-sub-label">{t.tour_detail.gallery.pretitle}</span>
                     </div>
                     <h2 className="text-h-section-title text-foreground gallery-text-reveal">{t.tour_detail.gallery.title}</h2>
                </div>
                
                {/* Grid Layout - Mosaico Asimétrico Dinámico */}
                <div className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-3 auto-rows-[160px] md:auto-rows-[450px]">
                    {images.map((img, i) => {
                        const pattern = i % 6;
                        
                        // Mobile Layout (3 Columns)
                        // 0: Big Square (2x2) -> Takes 2/3 width, 2 rows height
                        // 1: Small (1x1) -> Top right
                        // 2: Small (1x1) -> Bottom right (under 1)
                        // 3: Banner (3x1) -> Full width
                        // 4: Small (1x1) -> Left
                        // 5: Medium (2x1) -> Right
                        let mobileClass = "col-span-1";
                        if (pattern === 0) mobileClass = "col-span-2 row-span-2";
                        else if (pattern === 3) mobileClass = "col-span-3";
                        else if (pattern === 5) mobileClass = "col-span-2";

                        // Desktop Layout (12 Columns)
                        // Reset row-span to 1 for all desktop items to override mobile 2x2
                        let desktopClass = "md:col-span-4 md:row-span-1";
                        if (pattern === 0) desktopClass = "md:col-span-8 md:row-span-1";
                        if (pattern === 5) desktopClass = "md:col-span-12 md:row-span-1";

                        return (
                            <button 
                                key={i} 
                                onClick={() => openModal(i)}
                                className={`${mobileClass} ${desktopClass} relative overflow-hidden rounded-[6px] group gallery-img opacity-0 will-change-transform shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-surface transition-shadow duration-700 hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] cursor-zoom-in`}
                            >
                                {/* Vignette & Gradient Overlay */}
                                <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_40%,_rgba(4,9,24,0.4)_100%] z-10 opacity-100 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#040918]/60 via-transparent to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
                                <img 
                                    src={img} 
                                    alt={`Gallery Moment ${i + 1}`} 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-[1.5s] ease-out"
                                />
                                <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6 flex items-center gap-3 z-20 hidden md:flex">
                                    <span className="text-[9px] md:text-[10px] font-light text-white/90 tracking-widest uppercase bg-white/10 backdrop-blur-xl px-2.5 py-0.5 md:px-3 md:py-1 rounded-full border border-white/20 shadow-[0_4px_10px_rgba(0,0,0,0.1)] group-hover:bg-white/20 transition-colors">
                                        {i + 1 < 10 ? `0${i + 1}` : i + 1} {pattern === 5 ? '/ Panorama' : i === 0 ? '/ Journal' : ''}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
             </div>

             <GalleryModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                images={images} 
                initialIndex={selectedIndex} 
             />
        </section>
    );
}
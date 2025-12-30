'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Camera } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function TourGallery({ images }: { images: string[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Si no hay suficientes imágenes, no renderizamos
    if (!images || images.length === 0) return null;

    useGSAP(() => {
        const imgs = gsap.utils.toArray('.gallery-img');
        
        imgs.forEach((img: any) => {
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
        <section id="gallery" ref={containerRef} className="section-v-spacing px-frame bg-slate-950 border-t border-white/5 relative overflow-hidden">
             
             {/* Background Element */}
             <div className="absolute -right-24 top-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

             <div className="max-w-6xl mx-auto">
                <div className="mb-20">
                     <div className="flex items-center gap-2 mb-4">
                        <Camera className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-sub-label">Visual diary</span>
                     </div>
                     <h2 className="text-h-section-title text-white">Capturando la cima</h2>
                </div>
                
                {/* Grid Layout - Mosaico Asimétrico */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[450px]">
                    
                    {/* Imagen Principal */}
                    <div className="md:col-span-8 relative overflow-hidden rounded-[6px] group gallery-img border border-white/5">
                         <img 
                            src={images[0]} 
                            alt="Gallery Moment" 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                        />
                        <div className="absolute bottom-6 left-6 flex items-center gap-3">
                            <span className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                01 / Journal
                            </span>
                        </div>
                    </div>

                    {/* Segunda Imagen */}
                    {images[1] && (
                        <div className="md:col-span-4 relative overflow-hidden rounded-[6px] group gallery-img border border-white/5">
                            <img 
                                src={images[1]} 
                                alt="Gallery Moment" 
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                            />
                            <div className="absolute bottom-6 left-6">
                                <span className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    02
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Tercera Imagen */}
                    {images[2] && (
                        <div className="md:col-span-12 relative overflow-hidden rounded-[6px] group gallery-img md:h-[400px] border border-white/5">
                            <img 
                                src={images[2]} 
                                alt="Gallery Moment" 
                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                            />
                            <div className="absolute bottom-6 left-6">
                                <span className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    03 / Panorama
                                </span>
                            </div>
                        </div>
                    )}
                </div>
             </div>
        </section>
    );
}
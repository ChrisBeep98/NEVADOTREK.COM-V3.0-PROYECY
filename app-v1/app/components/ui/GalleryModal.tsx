'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex?: number;
}

export default function GalleryModal({ isOpen, onClose, images, initialIndex = 0 }: GalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    
    // UI State for cursor/ticker control
    const [isDraggingUI, setIsDraggingUI] = useState(false);
    
    // Animation Refs
    const modalRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    
    // Logic Refs
    const isDraggingRef = useRef(false);
    const dragOrigin = useRef({ x: 0, y: 0 });
    const imagePos = useRef({ x: 0, y: 0 }); // Committed position (start of drag)
    const currentDrag = useRef({ x: 0, y: 0 }); // Current delta from origin
    
    // Mirror state to ref for stable Ticker access
    const isZoomedRef = useRef(false);
    
    // GSAP Setters
    const xSetter = useRef<((value: number) => void) | null>(null);
    const ySetter = useRef<((value: number) => void) | null>(null);
    
    useEffect(() => {
        isZoomedRef.current = isZoomed;
    }, [isZoomed]);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsZoomed(false);
            imagePos.current = { x: 0, y: 0 };
            currentDrag.current = { x: 0, y: 0 };
            isDraggingRef.current = false;
        }
    }, [isOpen, initialIndex]);

    // Initialize QuickSetters
    useEffect(() => {
        if (imageRef.current) {
            xSetter.current = gsap.quickSetter(imageRef.current, "x", "px");
            ySetter.current = gsap.quickSetter(imageRef.current, "y", "px");
        }
    }, [isOpen]); 

    // --- GAME LOOP (High Frequency) ---
    const tick = useCallback(() => {
        if (!xSetter.current || !ySetter.current) return;

        const dx = currentDrag.current.x;
        const dy = currentDrag.current.y;

        if (isZoomedRef.current) {
            // Panning: Absolute Position = Start + Delta
            xSetter.current(imagePos.current.x + dx);
            ySetter.current(imagePos.current.y + dy);
        } else {
            // Swipe Hint: Just Delta
            xSetter.current(dx);
        }
    }, []); // No deps, stable function

    // Ticker Management
    useEffect(() => {
        if (isDraggingUI) {
            gsap.ticker.add(tick);
        } else {
            gsap.ticker.remove(tick);
        }
        return () => gsap.ticker.remove(tick);
    }, [isDraggingUI, tick]);


    // --- ANIMATIONS ---
    useGSAP(() => {
        if (isOpen) {
            const tl = gsap.timeline();
            tl.to(modalRef.current, { autoAlpha: 1, duration: 0.01 }) 
              .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" })
              .fromTo(imageRef.current, 
                  { opacity: 0, scale: 0.95, y: 20 }, 
                  { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "expo.out" }, "-=0.8")
              .fromTo(controlsRef.current,
                  { opacity: 0, y: -10 },
                  { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }, "-=0.2");
        }
    }, [isOpen]);

    useGSAP(() => {
        if (!isOpen || !imageRef.current) return;
        
        setIsZoomed(false);
        imagePos.current = { x: 0, y: 0 };
        currentDrag.current = { x: 0, y: 0 };
        isDraggingRef.current = false;
        
        if (xSetter.current) xSetter.current(0);
        if (ySetter.current) ySetter.current(0);

        gsap.fromTo(imageRef.current,
            { autoAlpha: 0, scale: 0.96, x: 0, y: 0 }, 
            { 
                autoAlpha: 1, 
                scale: 1, 
                x: 0, 
                y: 0, 
                duration: 0.4, 
                ease: "power2.out",
                overwrite: true 
            }
        );

        if (bgImageRef.current) {
            gsap.fromTo(bgImageRef.current,
                { opacity: 0, scale: 1.3 },
                { 
                    opacity: 0.7, 
                    scale: 1.25, 
                    duration: 0.8, 
                    ease: "power2.out",
                    overwrite: true 
                }
            );
        }
    }, [currentIndex, isOpen]);

    useGSAP(() => {
        if (!imageRef.current) return;
        
        gsap.to(imageRef.current, {
            scale: isZoomed ? 2 : 1, 
            x: isZoomed ? imagePos.current.x : 0,
            y: isZoomed ? imagePos.current.y : 0,
            duration: 0.5,
            ease: "expo.out",
            overwrite: "auto"
        });
    }, [isZoomed]);

    const handleClose = useCallback(() => {
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to([imageRef.current, controlsRef.current], { opacity: 0, scale: 0.98, duration: 0.25 })
          .to(overlayRef.current, { opacity: 0, duration: 0.3 }, "<")
          .to(modalRef.current, { autoAlpha: 0, duration: 0.1 });
    }, [onClose]);

    const nextImage = useCallback(() => setCurrentIndex(prev => (prev + 1) % images.length), [images.length]);
    const prevImage = useCallback(() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length), [images.length]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (!isZoomed) {
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, isZoomed, handleClose, nextImage, prevImage]);

    // --- GESTURES ---
    const handlePointerDown = (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        
        isDraggingRef.current = true;
        dragOrigin.current = { x: e.clientX, y: e.clientY };
        currentDrag.current = { x: 0, y: 0 }; // Reset
        setIsDraggingUI(true); // Start Ticker
        
        if (imageRef.current) {
            imageRef.current.style.willChange = 'transform';
            imageRef.current.style.cursor = 'grabbing';
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        e.preventDefault(); 
        
        // LIGHTWEIGHT INPUT CAPTURE
        currentDrag.current = {
            x: e.clientX - dragOrigin.current.x,
            y: e.clientY - dragOrigin.current.y
        };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setIsDraggingUI(false); // Stop Ticker
        
        if (imageRef.current) {
            imageRef.current.style.willChange = 'auto'; 
            imageRef.current.style.cursor = isZoomed ? 'grab' : 'zoom-in';
        }

        const dx = currentDrag.current.x;
        const dy = currentDrag.current.y;
        
        const totalDist = Math.hypot(dx, dy);
        if (totalDist < 5) return;

        if (isZoomed) {
            // Commit final position
            imagePos.current = { 
                x: imagePos.current.x + dx, 
                y: imagePos.current.y + dy 
            };
        } else {
            const swipeThreshold = 60; 
            
            if (Math.abs(dx) > swipeThreshold) {
                gsap.to(imageRef.current, {
                    x: dx > 0 ? 500 : -500,
                    autoAlpha: 0,
                    duration: 0.2, 
                    ease: "power2.in",
                    onComplete: () => {
                        if (dx > 0) prevImage();
                        else nextImage();
                    }
                });
            } else {
                gsap.to(imageRef.current, { 
                    x: 0, 
                    duration: 0.4, 
                    ease: "back.out(1.2)" 
                });
            }
        }
    };

    const toggleZoom = (e: React.MouseEvent) => {
        if (isDraggingRef.current) return;
        
        const dx = e.clientX - dragOrigin.current.x;
        const dy = e.clientY - dragOrigin.current.y;
        if (Math.hypot(dx, dy) > 5) return;

        const newZoomState = !isZoomed;
        setIsZoomed(newZoomState);
        
        if (!newZoomState) {
            imagePos.current = { x: 0, y: 0 };
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={modalRef} 
            className="fixed inset-0 z-[9999] flex items-center justify-center invisible overflow-hidden bg-black"
        >
            <div 
                ref={overlayRef} 
                className="absolute inset-0 overflow-hidden"
                onClick={handleClose}
            >
                <img
                    ref={bgImageRef}
                    src={images[currentIndex]}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-[40px] scale-125 opacity-70 will-change-transform pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"></div>
            </div>

            <div 
                className="relative z-10 w-full h-full flex items-center justify-center touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <img 
                    ref={imageRef}
                    src={images[currentIndex]} 
                    alt={`Gallery ${currentIndex + 1}`}
                    loading="eager"
                    draggable={false}
                    className={`
                        max-h-[90vh] max-w-[95vw] md:max-w-[90vw] object-contain select-none shadow-2xl transition-cursor duration-200
                        ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in active:cursor-grabbing'}
                    `}
                    onClick={toggleZoom}
                />
            </div>

            <div ref={controlsRef} className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 md:p-8">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1 pointer-events-auto">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/50 uppercase">Gallery Mode</span>
                        <span className="text-sm md:text-lg font-bold text-white tracking-widest tabular-nums font-mono">
                            {String(currentIndex + 1).padStart(2, '0')} <span className="text-white/20">/</span> {String(images.length).padStart(2, '0')}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                            className="pointer-events-auto hidden md:flex p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all backdrop-blur-md border border-white/5 group"
                        >
                            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                        </button>

                        <button 
                            onClick={handleClose} 
                            className="pointer-events-auto p-3 -mr-2 text-white/60 hover:text-white transition-colors hover:rotate-90 duration-500"
                        >
                            <X className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
                        </button>
                    </div>
                </div>

                {!isZoomed && (
                    <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between pointer-events-none">
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="hidden md:flex pointer-events-auto w-14 h-14 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 text-white/40 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/10 transition-all group"
                        >
                            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1} />
                        </button>
                        
                        <button 
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="hidden md:flex pointer-events-auto w-14 h-14 items-center justify-center rounded-full bg-black/20 hover:bg-white/10 text-white/40 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/10 transition-all group"
                        >
                            <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" strokeWidth={1} />
                        </button>
                    </div>
                )}

                <div className="w-full flex justify-center pb-safe md:pb-0 pointer-events-auto">
                    <div className="flex gap-2 p-3 bg-black/40 backdrop-blur-xl rounded-full border border-white/5 hover:bg-black/60 transition-colors">
                         {images.map((_, idx) => (
                             <button 
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`
                                    w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 
                                    ${idx === currentIndex 
                                        ? 'bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.5)]' 
                                        : 'bg-white/20 hover:bg-white/50 scale-100'}
                                `}
                             />
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
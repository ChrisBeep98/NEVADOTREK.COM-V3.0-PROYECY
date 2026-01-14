'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ChevronLeft, ChevronRight, Minimize2, Maximize2 } from 'lucide-react';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex?: number;
}

export default function GalleryModal({ isOpen, onClose, images, initialIndex = 0 }: GalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    // Animation Refs
    const modalRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<HTMLDivElement>(null);
    
    // Drag/Swipe Logic Refs
    const dragOrigin = useRef({ x: 0, y: 0 });
    const imagePos = useRef({ x: 0, y: 0 }); // Current XY translation
    
    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsZoomed(false);
            imagePos.current = { x: 0, y: 0 };
        }
    }, [isOpen, initialIndex]);

    // --- ANIMATIONS ---
    useGSAP(() => {
        if (isOpen) {
            // Cinematic Entrance
            const tl = gsap.timeline();
            tl.to(modalRef.current, { autoAlpha: 1, duration: 0.01 }) // Instant visibility container
              .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" })
              .fromTo(imageRef.current, 
                  { opacity: 0, scale: 0.95, y: 20 }, 
                  { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "expo.out" }, "-=0.4")
              .fromTo(controlsRef.current,
                  { opacity: 0 },
                  { opacity: 1, duration: 0.5, delay: 0.2 });
        }
    }, [isOpen]);

    // Image Slide Transition (When index changes)
    useGSAP(() => {
        if (!isOpen || !imageRef.current) return;
        
        // Reset Zoom/Pos on change
        setIsZoomed(false);
        imagePos.current = { x: 0, y: 0 };
        
        gsap.fromTo(imageRef.current,
            { opacity: 0, scale: 0.98 },
            { 
                opacity: 1, 
                scale: 1, 
                x: 0, 
                y: 0, 
                duration: 0.5, 
                ease: "power2.out",
                overwrite: true 
            }
        );
    }, [currentIndex, isOpen]);

    // Zoom Animation
    useGSAP(() => {
        if (!imageRef.current) return;
        
        gsap.to(imageRef.current, {
            scale: isZoomed ? 1.75 : 1, // Luxurious zoom level
            x: isZoomed ? imagePos.current.x : 0,
            y: isZoomed ? imagePos.current.y : 0,
            duration: 0.5,
            ease: "expo.out"
        });
        
        // Change cursor
        imageRef.current.style.cursor = isZoomed ? 'grab' : 'zoom-in';
    }, [isZoomed]);

    // --- NAVIGATION LOGIC ---
    const handleClose = useCallback(() => {
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to([imageRef.current, controlsRef.current], { opacity: 0, duration: 0.3 })
          .to(overlayRef.current, { opacity: 0, duration: 0.3 }, "<")
          .to(modalRef.current, { autoAlpha: 0, duration: 0.1 });
    }, [onClose]);

    const nextImage = useCallback(() => setCurrentIndex(prev => (prev + 1) % images.length), [images.length]);
    const prevImage = useCallback(() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length), [images.length]);

    // Keyboard Support
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

    // --- GESTURES (SWIPE & PAN) ---
    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        dragOrigin.current = { x: e.clientX, y: e.clientY };
        // If zoomed, we pan. If not zoomed, we swipe.
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const dx = e.clientX - dragOrigin.current.x;
        const dy = e.clientY - dragOrigin.current.y;

        if (isZoomed && imageRef.current) {
            // PANNING LOGIC
            const newX = imagePos.current.x + dx;
            const newY = imagePos.current.y + dy;
            
            gsap.set(imageRef.current, { x: newX, y: newY });
            
            // Update ref for next frame/release
            // (In a full physics engine we'd update state on Up, but direct set is faster for 60fps)
        } else {
            // SWIPE HINT LOGIC (Visual feedback only)
            // Move image slightly to show resistance
             gsap.set(imageRef.current, { x: dx * 0.4 });
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        const dx = e.clientX - dragOrigin.current.x;
        const dy = e.clientY - dragOrigin.current.y;

        if (isZoomed) {
            // Commit new position
            imagePos.current = { x: imagePos.current.x + dx, y: imagePos.current.y + dy };
            
            // Update cursor
            if (imageRef.current) imageRef.current.style.cursor = 'grab';
        } else {
            // SNAP BACK OR NAVIGATE
            if (Math.abs(dx) > 100) { // Swipe Threshold
                if (dx > 0) prevImage();
                else nextImage();
            } else {
                // Snap back to center
                gsap.to(imageRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
            }
        }
    };

    const toggleZoom = (e: React.MouseEvent) => {
        if (isDragging) return; // Don't zoom if we were dragging
        
        // Don't toggle if dragging slightly occurred (click threshold)
        const moveDist = Math.hypot(e.clientX - dragOrigin.current.x, e.clientY - dragOrigin.current.y);
        if (moveDist > 5) return;

        setIsZoomed(!isZoomed);
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={modalRef} 
            className="fixed inset-0 z-[100] flex items-center justify-center invisible overflow-hidden"
        >
            {/* 1. The Void Backdrop */}
            <div 
                ref={overlayRef} 
                className="absolute inset-0 bg-[#050505]/98 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* 2. Main Viewport */}
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
                    alt={`Gallery ${currentIndex}`}
                    className="max-h-[90vh] max-w-[95vw] object-contain select-none will-change-transform shadow-2xl"
                    onClick={toggleZoom}
                    draggable={false}
                />
            </div>

            {/* 3. Minimal UI Layer (Pointer Events pass through where possible) */}
            <div ref={controlsRef} className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-10">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-white/40 uppercase">Gallery</span>
                        <span className="text-sm md:text-base font-medium text-white tracking-widest tabular-nums">
                            {currentIndex + 1} <span className="text-white/20">—</span> {images.length}
                        </span>
                    </div>
                    <button 
                        onClick={handleClose} 
                        className="pointer-events-auto group p-2 -mr-2 text-white/50 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Footer / Thumbnails (Only visible on bottom hover area ideally, but for now fixed minimal) */}
                <div className="w-full flex justify-center pb-4 md:pb-0">
                    <div className="hidden md:flex gap-1.5 p-2 bg-white/5 backdrop-blur-md rounded-full border border-white/5 pointer-events-auto transition-opacity duration-300 hover:opacity-100 opacity-60">
                         {images.map((_, idx) => (
                             <button 
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/20 hover:bg-white/50'}`}
                             />
                         ))}
                    </div>
                </div>

                {/* Desktop Navigation Arrows (Hover Zones) */}
                {!isZoomed && (
                    <>
                        <button 
                            onClick={prevImage} 
                            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 items-center justify-center rounded-full text-white/20 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <ChevronLeft className="w-8 h-8" strokeWidth={1} />
                        </button>
                        <button 
                            onClick={nextImage} 
                            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto w-12 h-12 items-center justify-center rounded-full text-white/20 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <ChevronRight className="w-8 h-8" strokeWidth={1} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
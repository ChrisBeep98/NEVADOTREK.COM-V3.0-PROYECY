'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CursorFollower() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        // Configuración de movimiento con inercia diferenciada
        const moveCursor = (e: MouseEvent) => {
            // El núcleo (dot) es reactivo y rápido
            gsap.to(dotRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });

            // El eco (ring) tiene mucha más inercia y "peso"
            gsap.to(ringRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.5,
                ease: "power3.out"
            });

            // Detección de interactividad
            const target = e.target as HTMLElement;
            const isInteractive = 
                target.closest('button') || 
                target.closest('a') || 
                window.getComputedStyle(target).cursor === 'pointer';
            
            setIsHovered(!!isInteractive);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    // Mutación Cinemática
    useEffect(() => {
        if (!dotRef.current || !ringRef.current) return;

        if (isHovered) {
            // Modo "Magnético / Aurora"
            gsap.to(dotRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.3
            });
            gsap.to(ringRef.current, {
                scale: 1.8,
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6, 182, 212, 0.05)",
                borderWidth: "1px",
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.2)",
                duration: 0.4,
                ease: "expo.out"
            });
        } else {
            // Modo "Glacial / Silencio"
            gsap.to(dotRef.current, {
                scale: 1,
                opacity: 1,
                backgroundColor: "#ffffff",
                duration: 0.4
            });
            gsap.to(ringRef.current, {
                scale: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
                backgroundColor: "transparent",
                borderWidth: "1px",
                boxShadow: "none",
                duration: 0.6,
                ease: "power2.out"
            });
        }
    }, [isHovered]);

    return (
        <>
            {/* El Núcleo (Rápido) */}
            <div 
                ref={dotRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block will-change-transform"
            />
            
            {/* El Eco / Anillo (Lento con inercia) */}
            <div 
                ref={ringRef}
                className="fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 border border-white/20 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden md:block will-change-transform"
            />
        </>
    );
}

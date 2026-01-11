'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CursorFollower() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(dotRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: "power2.out",
                overwrite: "auto"
            });

            gsap.to(ringRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: "power3.out",
                overwrite: "auto"
            });

            // Detección de interactividad rápida
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

    useEffect(() => {
        if (!dotRef.current || !ringRef.current) return;

        if (isHovered) {
            // Modo Interactivo
            gsap.to(dotRef.current, {
                scale: 1.5,
                backgroundColor: "#06b6d4",
                duration: 0.3,
                overwrite: "auto"
            });
            gsap.to(ringRef.current, {
                scale: 1.6,
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6, 182, 212, 0.1)",
                duration: 0.4,
                ease: "back.out(1.7)",
                overwrite: "auto"
            });
        } else {
            // Modo Normal
            gsap.to(dotRef.current, {
                scale: 1,
                backgroundColor: "#ffffff",
                duration: 0.4,
                overwrite: "auto"
            });
            gsap.to(ringRef.current, {
                scale: 1,
                borderColor: "rgba(255, 255, 255, 0.3)",
                backgroundColor: "transparent",
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    }, [isHovered]);

    return (
        <>
            <div 
                ref={dotRef}
                className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block will-change-transform"
            />
            <div 
                ref={ringRef}
                className="fixed top-0 left-0 w-9 h-9 -ml-[18.5px] -mt-[18.5px] border border-white/30 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden md:block will-change-transform"
            />
        </>
    );
}
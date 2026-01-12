'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionTitleProps {
    title: string;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

/**
 * Soft Fade Reveal
 * Versión ultra-optimizada que usa solo opacidad y movimiento.
 * Mantiene la elegancia del stagger línea por línea.
 */
export default function SectionTitle({ title, className = "", as: Tag = 'h2' }: SectionTitleProps) {
    const titleRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        const element = titleRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(element.querySelectorAll('.title-line'), 
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.0,
                    ease: "power3.out",
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, titleRef);

        return () => ctx.revert();
    }, [title]);

    const renderContent = () => {
        return title.split('\n').map((line, index) => (
            <span key={index} className="title-line block will-change-transform will-change-opacity">
                {line}
            </span>
        ));
    };

    return (
        <Tag ref={titleRef} className={`text-foreground ${className}`}>
            {renderContent()}
        </Tag>
    );
}

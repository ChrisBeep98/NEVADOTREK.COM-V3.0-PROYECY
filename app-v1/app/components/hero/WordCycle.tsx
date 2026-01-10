"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface WordCycleProps {
    words: string[];
    prefix: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function WordCycle({ words, prefix, className = '', size = 'md' }: WordCycleProps) {
    const [wordIndex, setWordIndex] = useState(0);
    const wordWrapperRef = useRef<HTMLSpanElement>(null);

    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm md:text-base',
        lg: 'text-lg md:text-xl'
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!wordWrapperRef.current) return;
            gsap.to(".letter", {
                y: -20, opacity: 0, filter: "blur(8px)", stagger: 0.03, duration: 0.5, ease: "power3.in",
                onComplete: () => setWordIndex((prev) => (prev + 1) % words.length)
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [words.length]);

    useGSAP(() => {
        if (!wordWrapperRef.current) return;
        gsap.fromTo(".letter",
            { y: 30, opacity: 0, filter: "blur(12px)", willChange: "transform, opacity, filter" },
            { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.05, duration: 1.2, ease: "expo.out" }
        );
    }, { dependencies: [wordIndex, words], scope: wordWrapperRef });

    return (
        <p className={`${sizeClasses[size]} font-light italic leading-relaxed text-white drop-shadow-lg flex flex-wrap ${className}`}>
            <span>{prefix} </span>
            <span ref={wordWrapperRef} className="inline-flex font-bold text-white tracking-wider overflow-hidden drop-shadow-md">
                {words[wordIndex].split("").map((char, i) => (
                    <span key={`${wordIndex}-${i}`} className="letter inline-block">
                        {char}
                    </span>
                ))}
            </span>
        </p>
    );
}

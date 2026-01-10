"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '../Header';
import { useLanguage } from '../../context/LanguageContext';
import WordCycle from './WordCycle';

const VIDEO_URL = "https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4";

export default function MobileHero() {
    const { t } = useLanguage();

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, []);

    useGSAP(() => {
        const content = contentRef.current;
        const title = titleRef.current;

        if (!content || !title) return;

        const tl = gsap.timeline();

        tl.fromTo(title,
            { y: 100, opacity: 0, filter: "blur(10px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }
        );

        tl.fromTo(content.children,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power2.out" },
            "-=0.5"
        );

        gsap.to(containerRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: -50,
            opacity: 0.5
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="md:hidden relative bg-[#040918] text-slate-300 antialiased overflow-hidden">
            <Header />

            <section className="relative h-screen w-full overflow-hidden flex flex-col">

                <div className="absolute inset-0 z-0">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src={VIDEO_URL} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#040918]/30 via-transparent to-[#040918]/80" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pt-16">
                    <div ref={contentRef} className="space-y-6">

                        <div className="flex items-center gap-2 text-cyan-400 text-xs tracking-[0.3em] uppercase">
                            <span className="w-8 h-[1px] bg-cyan-400"></span>
                            Nevado Trek
                        </div>

                        <h1 ref={titleRef} className="text-6xl font-bold text-white tracking-tighter leading-none">
                            <span className="block text-white/80">Beyond</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">The Edge</span>
                        </h1>

                        <div className="py-2">
                            <WordCycle
                                words={t.hero.words}
                                prefix={t.hero.message.prefix}
                                size="sm"
                                className="max-w-[280px]"
                            />
                        </div>

                        <div className="pt-4">
                            <Link
                                href="/tours"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#040918] font-medium text-sm tracking-wide rounded-full hover:bg-cyan-50 transition-all duration-300"
                            >
                                Ver Expediciones
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                    </div>
                </div>

                <div className="relative z-10 px-6 pb-8">
                    <div className="flex items-center justify-between text-xs text-white/50 tracking-wider">
                        <span>Exp. 2025</span>
                        <span>4500M</span>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <div className="flex flex-col items-center gap-2 animate-bounce">
                            <span className="text-[10px] uppercase tracking-widest text-white/60">Desliza</span>
                            <ChevronDown className="w-5 h-5 text-white/40" />
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}

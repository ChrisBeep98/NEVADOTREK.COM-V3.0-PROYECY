"use client";

import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Quote, ArrowRight, CornerRightDown } from 'lucide-react';
import SectionTitle from './ui/SectionTitle';
import { useLanguage } from '../context/LanguageContext';

interface Review {
    id: string;
    name: string;
    role: string;
    trip: string;
    altitude: string;
    quote: string;
    image: string;
    date: string;
}

const ALL_REVIEWS: Review[] = [
    {
        id: "01",
        name: "Hugo Besnard",
        role: "Senderista",
        trip: "Expedición Páramo",
        altitude: "3,800m",
        date: "Hace 1 semana",
        quote: "Muchas gracias a David y al equipo de Nevado Trek por organizar esta aventura extraordinaria en el Páramo. Caminamos durante 4 días y fue absolutamente impresionante. Son muy atentos y se adaptan a tus expectativas.",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "02",
        name: "Cèlia Nisarre",
        role: "Exploradora",
        trip: "La Carbonera",
        altitude: "2,900m",
        date: "Hace 2 meses",
        quote: "¡La ruta por La Carbonera ha sido simplemente increíble! El mejor paisaje de Colombia por ahora. Si buscas una experiencia de naturaleza pura, no puedes perdértelo. Todo fue rápido y muy confiable.",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "03",
        name: "Gustavo Fajardo",
        role: "Montañista",
        trip: "Nevado del Tolima",
        altitude: "5,220m",
        date: "Hace 3 meses",
        quote: "Logré la cumbre a pesar de una lesión de espalda gracias a la paciencia y ayuda de los guías. Están preparados para cualquier situación y son extremadamente serviciales. Me sentí seguro en todo momento.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop"
    },
    {
        id: "04",
        name: "Debbie Peng",
        role: "Viajera",
        trip: "Paramillo del Quindío",
        altitude: "4,400m",
        date: "Hace 1 mes",
        quote: "Fue una caminata desafiante pero gratificante. Nuestro guía Andrés fue fantástico y nos ayudó mucho en las zonas de humedales. Los frailejones y las vistas son simplemente impresionantes.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "05",
        name: "Renata Buti",
        role: "Senderista",
        trip: "La Carbonera",
        altitude: "3,100m",
        date: "Hace 2 meses",
        quote: "Una experiencia completamente diferente a lo habitual. Aprendimos mucho sobre el santuario y la palma de cera. Es una experiencia recomendada a ojo cerrado junto a Nevado Trek.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "06",
        name: "Simon Ritter",
        role: "Aventurero",
        trip: "Trekking Paramillo",
        altitude: "4,000m",
        date: "Hace 4 meses",
        quote: "¡Una gran aventura! Organización espontánea y perfecta para nuestra caminata de 3 días. Gracias al equipo por un viaje tan divertido y hermoso.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
    }
];

export default function TestimonialsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [displayedReviews, setDisplayedReviews] = useState<Review[]>(ALL_REVIEWS.slice(0, 3));
    const [hasMore, setHasMore] = useState(true);

    const getAccentColor = (index: number) => {
        const colors = ['text-cyan-500', 'text-orange-500', 'text-purple-500'];
        return colors[index % colors.length];
    };

    const getBgAccent = (index: number) => {
        const colors = ['bg-cyan-500', 'bg-orange-500', 'bg-purple-500'];
        return colors[index % colors.length];
    };

    const loadMore = () => {
        const currentLength = displayedReviews.length;
        const nextBatch = ALL_REVIEWS.slice(currentLength, currentLength + 5);
        if (nextBatch.length > 0) setDisplayedReviews(prev => [...prev, ...nextBatch]);
        if (currentLength + nextBatch.length >= ALL_REVIEWS.length) setHasMore(false);
    };

    useLayoutEffect(() => {
        const track = trackRef.current;
        const container = containerRef.current;
        if (!track || !container) return;

        const oldTriggers = ScrollTrigger.getAll();
        oldTriggers.forEach(t => { if (t.vars.trigger === container) t.kill(); });

        const ctx = gsap.context(() => {
            const totalWidth = track.scrollWidth;
            const windowWidth = window.innerWidth;
            const scrollAmount = totalWidth - windowWidth;

            if (scrollAmount > 0) {
                gsap.to(track, {
                    x: -scrollAmount,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        start: "top top",
                        end: () => `+=${scrollAmount + 200}`,
                        pin: true,
                        scrub: 0.5,
                        fastScrollEnd: true,
                        preventOverlaps: true,
                        invalidateOnRefresh: true,
                    }
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [displayedReviews]);

    return (
        <section ref={containerRef} className="relative h-screen bg-background text-foreground overflow-hidden selection:bg-cyan-500/30 transition-colors duration-500">
            
            <div className="absolute inset-0 z-0 pointer-events-none will-change-transform transform-gpu">
                <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply dark:mix-blend-screen"
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                </div>
            </div>

            {/* FIXED HEADER - Adjusted for Mobile Spacing */}
            <div className="absolute top-16 md:top-24 left-0 w-full z-20 px-[var(--page-frame)] flex justify-between items-start pointer-events-none">
                <div className="mt-4 md:mt-0">
                    <span className="text-sub-label mb-2 block">
                        Bitácora de expedición
                    </span>
                    <SectionTitle 
                        title="Los ecos" 
                        className="text-display-xl text-foreground"
                    />
                </div>
                <div className="hidden md:flex flex-col items-end">
                     <span className="font-mono text-[9px] text-muted tracking-widest uppercase">
                        Estado de ruta
                    </span>
                    <div className="flex gap-1 mt-1">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 bg-cyan-500/80"></div>)}
                    </div>
                </div>
            </div>

            {/* HORIZONTAL TRACK - Adjusted PT for Mobile */}
            <div ref={trackRef} className="flex h-full items-center pl-[var(--page-frame)] pr-[20vw] md:pr-[50vw] will-change-transform backface-hidden">
                
                {/* INTRO BLOCK */}
                <div className="flex-shrink-0 w-[85vw] md:w-[25vw] mr-20 md:mr-32 flex flex-col justify-center z-10 pt-40 md:pt-20">
                    <p className="font-mono text-[10px] md:text-sm text-cyan-500 tracking-widest mb-4 md:mb-6 uppercase">
                        {'//'} testimonios_cliente
                    </p>
                    <p className="text-lg md:text-xl font-light leading-relaxed text-muted">
                        Explorando las vivencias de quienes alcanzaron la cumbre con nosotros.
                    </p>
                    <div className="mt-8 flex items-center gap-4 text-[10px] font-mono text-muted tracking-[0.2em] uppercase">
                        <ArrowRight className="w-4 h-4 text-cyan-500" />
                        Desliza para explorar
                    </div>
                </div>

                {/* CARDS LOOP - More Spacing in Mobile */}
                {displayedReviews.map((review, i) => {
                    const accent = getAccentColor(i);
                    return (
                        <div key={review.id} className="flex-shrink-0 relative group flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 mr-20 md:mr-24 w-[85vw] md:w-[65vw] lg:w-[50vw] pt-40 md:pt-20">
                            
                            <div className="relative w-full md:w-[45%] aspect-[16/9] md:aspect-[4/5] overflow-hidden rounded-sm transition-all duration-700 ease-out shrink-0 bg-surface shadow-2xl">
                                {/* Gradiente fijo oscuro para proteger legibilidad de textos blancos */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#040918]/70 via-transparent to-transparent z-10"></div>
                                <img src={review.image} alt={review.name} className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000" />
                                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20 flex justify-between items-end font-mono text-[9px] tracking-widest text-white drop-shadow-md">
                                    <span className="">{review.date}</span>
                                    <span className={`${accent} font-bold`}>{review.altitude}</span>
                                </div>
                            </div>

                            <div className="w-full md:w-[55%] flex flex-col items-start relative z-10">
                                <Quote className={`w-6 h-6 md:w-12 md:h-12 ${accent} opacity-20 mb-3 md:mb-4 transform -scale-x-100`} />
                                <h3 className="text-base md:text-2xl font-light leading-relaxed tracking-tight text-foreground mb-6 md:mb-8 line-clamp-[8] md:line-clamp-none">
                                    &quot;{review.quote}&quot;
                                </h3>
                                <div className="flex items-center gap-4 border-t border-border pt-4 w-full">
                                    <div className="font-mono text-xs">
                                        <div className={`${accent} font-bold tracking-wide text-sm`}>{review.name}</div>
                                        <div className="text-muted mt-1 text-[10px]">{review.role} {'//'} {review.trip}</div>
                                    </div>
                                    <div className="ml-auto font-mono text-[9px] text-muted opacity-40">
                                        Ref_{review.id}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* LOAD MORE */}
                <div className="flex-shrink-0 w-[80vw] md:w-[30vw] flex items-center justify-center ml-12 md:ml-24 pt-40 md:pt-20">
                    {hasMore ? (
                         <button onClick={loadMore} className="group relative flex items-center gap-4 md:gap-6 px-8 py-5 md:px-10 md:py-6 overflow-hidden border border-border hover:border-cyan-500/30 transition-colors duration-500">
                            <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-border group-hover:border-cyan-500 transition-colors"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-border group-hover:border-cyan-500 transition-colors"></div>
                            <span className="relative z-10 font-mono text-[10px] md:text-xs tracking-[0.2em] text-foreground group-hover:text-cyan-500 group-hover:tracking-[0.3em] transition-all duration-500 whitespace-nowrap uppercase">
                                Ver más historias
                            </span>
                            <CornerRightDown className="relative z-10 w-4 h-4 text-muted group-hover:text-cyan-500 transition-colors duration-300" />
                        </button>
                    ) : (
                        <div className="text-center">
                            <div className="text-4xl md:text-9xl leading-none font-bold text-foreground opacity-5 select-none tracking-tighter">
                                FIN_RUTA
                            </div>
                        </div>
                    )}
                </div>

            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-border">
                 <div className="h-full bg-gradient-to-r from-cyan-500 to-transparent w-[30%] opacity-50"></div>
            </div>

        </section>
    );
}

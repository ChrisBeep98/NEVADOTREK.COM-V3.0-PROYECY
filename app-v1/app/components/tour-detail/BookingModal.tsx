'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, Users, Calendar as CalendarIcon, ChevronRight, ChevronLeft, Flag, Crown, ChevronDown, CheckCircle2, Info } from 'lucide-react';
import { Tour, Departure } from '../../types/api';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tour: Tour;
    departures?: Departure[];
}

export default function BookingModal({ isOpen, onClose, tour, departures = [] }: BookingModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const calendarDropdownRef = useRef<HTMLDivElement>(null);
    
    // Selection State
    const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
    const [selectionType, setSelectionType] = useState<'public' | 'private' | null>(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Process Public Departures
    const publicDates = departures.map(dep => {
        const date = new Date(dep.date._seconds * 1000);
        const nextPaxCount = dep.currentPax + 1;
        const priceTier = dep.pricingSnapshot.find(t => nextPaxCount >= t.minPax && nextPaxCount <= t.maxPax) || dep.pricingSnapshot[0];
        
        return {
            id: dep.departureId,
            day: date.getDate().toString(),
            month: date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', ''),
            slots: dep.maxPax - dep.currentPax,
            total: dep.maxPax,
            price: priceTier.priceCOP,
            status: (dep.maxPax - dep.currentPax) <= 4 ? 'limited' : 'open'
        };
    });

    useGSAP(() => {
        if (isOpen) {
            gsap.set(backdropRef.current, { opacity: 0 });
            gsap.to(backdropRef.current, { opacity: 1, duration: 0.6, ease: "power2.out" });

            const mm = gsap.matchMedia();
            mm.add("(min-width: 768px)", () => {
                gsap.set(modalRef.current, { scale: 0.95, opacity: 0, y: 20 });
                gsap.to(modalRef.current, { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "expo.out" });
            });
            mm.add("(max-width: 767px)", () => {
                gsap.set(modalRef.current, { y: "100%" });
                gsap.to(modalRef.current, { y: "0%", duration: 0.5, ease: "power3.out" });
            });
        }
    }, [isOpen]);

    // Click Outside Listener for Calendar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarDropdownRef.current && !calendarDropdownRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };
        if (isCalendarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCalendarOpen]);

    const handleClose = () => {
        gsap.to(modalRef.current, { opacity: 0, y: 20, duration: 0.3 });
        gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
    };

    const selectPublic = (id: string) => {
        setSelectionType('public');
        setSelectedDateId(id);
        setIsCalendarOpen(false);
    };

    const selectPrivate = (day: number) => {
        setSelectionType('private');
        setSelectedDateId(`priv_${day}`);
        setIsCalendarOpen(false); // Auto close on selection
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center pointer-events-none px-0 md:px-6">
            <div ref={backdropRef} className="absolute inset-0 bg-background/90 backdrop-blur-md pointer-events-auto" onClick={handleClose}></div>

            <div 
                ref={modalRef}
                className="pointer-events-auto relative w-full md:w-[95vw] lg:w-[85vw] h-[95vh] md:h-[85vh] bg-slate-900 md:rounded-[24px] rounded-t-[24px] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            >
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/5 shrink-0 z-20 bg-slate-900">
                    <div>
                        <span className="text-sub-label block mb-1">Paso 1 de 3</span>
                        <h2 className="text-xl md:text-2xl font-medium text-white tracking-tight">Selecciona tu fecha</h2>
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/5 transition-colors text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* CONTENT GRID */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-full divide-y lg:divide-y-0 lg:divide-x divide-white/5">

                        {/* LEFT COL: PRICING (Technical Data Grid) */}
                        <div className="lg:col-span-5 p-5 md:p-10 bg-slate-900 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">
                            
                            <div className="flex-1 flex flex-col justify-center w-full">
                                {/* Title Anchor */}
                                <div className="mb-4 md:mb-6 flex items-center justify-between opacity-50 px-1">
                                    <span className="text-journal-data text-white uppercase">Tabla de Precios</span>
                                    <div className="h-px bg-white/20 w-8 md:w-12"></div>
                                </div>

                                {/* Balanced Cards Layout */}
                                <div className="flex flex-col gap-2.5 md:gap-3 w-full">
                                    {tour.pricingTiers?.map((tier, idx) => (
                                        <div 
                                            key={idx} 
                                            className="relative p-3.5 md:p-5 rounded-lg border border-white/5 bg-white/[0.01]"
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                
                                                {/* Left: Pax Configuration */}
                                                <div className="flex flex-col gap-1 md:gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-0.5 md:w-1 h-2.5 md:h-3 rounded-full ${tier.minPax === 1 ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]'}`}></div>
                                                        <span className="text-xs md:text-sm font-medium text-slate-200">
                                                            {tier.minPax === tier.maxPax 
                                                                ? `${tier.minPax} Pasajero` 
                                                                : `${tier.minPax} - ${tier.maxPax} Personas`
                                                            }
                                                        </span>
                                                    </div>
                                                    <span className="text-[9px] font-semibold tracking-wider text-slate-600 uppercase pl-2.5 md:pl-3">
                                                        {tier.minPax === 1 ? 'Privada' : 'Grupal'}
                                                    </span>
                                                </div>

                                                {/* Right: Price Focus */}
                                                <div className="text-right">
                                                    <span className="block text-base md:text-xl font-bold text-white tracking-tighter tabular-nums">
                                                        $ {tier.priceCOP.toLocaleString()}
                                                    </span>
                                                    <span className="text-[8px] md:text-[9px] font-mono text-slate-600 block mt-0.5 uppercase tracking-widest">COP / pax</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-8 md:mt-10 px-1 flex gap-3 md:gap-4 items-start opacity-40 group hover:opacity-100 transition-opacity duration-500">
                                    <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-cyan-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] md:text-xs leading-relaxed text-slate-400 font-medium italic">
                                        El precio final se ajustará automáticamente según el número de personas seleccionadas en el siguiente paso.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COL: SELECTION (7 cols) */}
                        <div className="lg:col-span-7 p-6 md:p-10 relative">
                            
                            {/* 1. PUBLIC DEPARTURES (Detailed Cards) */}
                            <div className="mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Flag className="w-3 h-3 text-emerald-400" />
                                        <h3 className="text-journal-data text-white opacity-100">Salidas Grupales</h3>
                                    </div>
                                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Cupos limitados</span>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {publicDates.map((date) => {
                                        const isSel = selectionType === 'public' && selectedDateId === date.id;
                                        const percent = ((date.total - date.slots) / date.total) * 100;
                                        
                                        return (
                                            <button
                                                key={date.id}
                                                onClick={() => selectPublic(date.id)}
                                                className={`
                                                    relative p-3 rounded-[6px] border flex flex-col justify-between h-36 transition-all duration-300 group overflow-hidden text-left
                                                    ${isSel 
                                                        ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                                                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                                                    }
                                                `}
                                            >
                                                <div className="flex justify-between items-start w-full">
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isSel ? 'text-emerald-400' : 'text-slate-600'}`}>
                                                        {date.month}
                                                    </span>
                                                    {isSel ? (
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                    ) : (
                                                        <Users className="w-3 h-3 text-slate-700" />
                                                    )}
                                                </div>

                                                <div className="my-1">
                                                    <span className={`text-3xl font-light tracking-tighter ${isSel ? 'text-white' : 'text-slate-400'}`}>
                                                        {date.day}
                                                    </span>
                                                    <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${date.status === 'limited' ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[9px] mt-1 block font-medium text-slate-600">
                                                        {date.slots} cupos
                                                    </span>
                                                </div>

                                                <div className="pt-2 border-t border-white/5 w-full">
                                                     <span className="text-journal-data text-slate-500 opacity-100">
                                                        $ {(date.price / 1000000).toFixed(1)} M
                                                     </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* SEPARATOR */}
                            <div className="flex items-center gap-4 mb-8 opacity-20">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-[8px] font-mono uppercase tracking-[0.4em]">OR</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            {/* 2. PRIVATE SELECTOR (Floating Dropdown) */}
                            <div className="relative" ref={calendarDropdownRef}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Crown className="w-3 h-3 text-purple-400" />
                                    <h3 className="text-journal-data text-white opacity-100">Fecha Privada</h3>
                                </div>

                                <button 
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                    className={`
                                        w-full flex items-center justify-between p-4 rounded-[8px] border transition-all duration-300
                                        ${isCalendarOpen || selectionType === 'private'
                                            ? 'bg-purple-500/10 border-purple-500/20 text-white shadow-lg shadow-purple-950/20'
                                            : 'bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="w-4 h-4 opacity-40" />
                                        <span className="text-journal-data opacity-100 font-medium lowercase tracking-normal">
                                            {selectionType === 'private' && selectedDateId 
                                                ? `Seleccionado: ${selectedDateId.replace('priv_', '')} de Febrero` 
                                                : "Seleccionar fecha en calendario"}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* FLOATING CALENDAR DROPDOWN */}
                                {isCalendarOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                            <span className="text-journal-data text-white opacity-100 uppercase tracking-widest">Febrero 2025</span>
                                            <div className="flex gap-1">
                                                <ChevronLeft className="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                                                <ChevronRight className="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="p-4 grid grid-cols-7 gap-2">
                                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                                                <span key={d} className="text-[10px] font-bold text-slate-700 text-center">{d}</span>
                                            ))}
                                            {[...Array(28)].map((_, i) => {
                                                const day = i + 1;
                                                const isAvailable = day > 5;
                                                const dateId = `priv_${day}`;
                                                const isSel = selectionType === 'private' && selectedDateId === dateId;

                                                return (
                                                    <button
                                                        key={day}
                                                        disabled={!isAvailable}
                                                        onClick={(e) => { e.stopPropagation(); selectPrivate(day); }}
                                                        className={`
                                                            aspect-square rounded-[4px] flex items-center justify-center text-xs transition-all duration-200 border
                                                            ${isSel 
                                                                ? 'bg-purple-600 border-purple-500 text-white font-bold' 
                                                                : isAvailable 
                                                                    ? 'bg-white/[0.02] border-white/5 text-slate-500 hover:bg-white/10 hover:border-white/20 hover:text-white' 
                                                                    : 'opacity-10 cursor-not-allowed text-slate-800'
                                                            }
                                                        `}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 md:px-10 py-5 border-t border-white/5 shrink-0 flex justify-between items-center z-20 bg-slate-900">
                    <span className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">
                        {selectionType === 'public' && "Confirmación inmediata"}
                        {selectionType === 'private' && "Sujeto a disponibilidad"}
                        {!selectionType && "Sync pending"}
                    </span>
                    <button 
                        disabled={!selectedDateId}
                        className={`
                            btn-primary w-auto px-10 transition-all duration-300
                            ${selectedDateId ? 'opacity-100 translate-y-0' : 'opacity-30 cursor-not-allowed translate-y-1 grayscale'}
                        `}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
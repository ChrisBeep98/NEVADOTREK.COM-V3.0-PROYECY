'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Users, Crown } from 'lucide-react';
import { Tour, Departure } from '../../types/api';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tour: Tour;
    departures?: Departure[];
}

interface UserData {
    name: string;
    email: string;
    phone: string;
    document: string;
}

export default function BookingModal({ isOpen, onClose, tour, departures = [] }: BookingModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    
    const [step, setStep] = useState(0); 
    const [mode, setMode] = useState<'public' | 'private'>('public');
    const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
    const [selectedPrivateDate, setSelectedPrivateDate] = useState<number | null>(null);
    const [formData, setFormData] = useState<UserData>({ name: '', email: '', phone: '', document: '' });
    
    const [currentMonth] = useState(new Date().getMonth());
    const [currentYear] = useState(new Date().getFullYear());
    const publicDepartures = departures.filter(d => (d.maxPax - d.currentPax) > 0);

    // --- ANIMATIONS ---
    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(modalRef.current, 
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 0.8, ease: "power4.out" }
            );
        }
    }, [isOpen]);

    // Smooth step transition
    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current.children,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [step, mode]);

    const handleClose = () => {
        gsap.to(modalRef.current, { autoAlpha: 0, y: 20, duration: 0.4, ease: "power2.in", onComplete: onClose });
        setTimeout(() => { 
            setStep(0); setSelectedDeparture(null); setSelectedPrivateDate(null); setMode('public');
        }, 400);
    };

    const formatMoney = (amount: number) => `$ ${amount.toLocaleString('es-CO')} COP`;
    const getMonthName = (m: number) => new Date(currentYear, m).toLocaleDateString('es-ES', { month: 'long' });
    
    const getPrice = () => {
        if (mode === 'public' && selectedDeparture) {
            const nextPax = selectedDeparture.currentPax + 1;
            const tier = selectedDeparture.pricingSnapshot.find(t => nextPax >= t.minPax && nextPax <= t.maxPax) || selectedDeparture.pricingSnapshot[0];
            return tier.priceCOP;
        }
        return tour.pricingTiers[0].priceCOP; 
    };

    const isStepValid = () => {
        if (step === 0) return mode === 'public' ? !!selectedDeparture : !!selectedPrivateDate;
        if (step === 1) return formData.name && formData.email && formData.phone;
        return true;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-xl">
            
            {/* THE MINIMAL MONOLITH */}
            <div 
                ref={modalRef} 
                className="w-full md:w-[90vw] h-[95vh] md:h-[90vh] bg-[#020617] rounded-3xl overflow-hidden flex flex-col md:flex-row border border-white/[0.05] shadow-2xl relative"
            >
                
                {/* === LEFT PANE: CONTENT ANCHOR (40%) === */}
                <div className="hidden md:flex w-[40%] bg-white/[0.01] border-r border-white/[0.03] flex-col p-16 lg:p-24 relative overflow-hidden">
                    <div className="relative z-10 flex-1 flex flex-col">
                        <div className="space-y-4 mb-20">
                            <h1 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em]">Reserva</h1>
                            <h2 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-[0.9]">{tour.name.es}</h2>
                        </div>

                        {/* Minimalist Price List */}
                        <div className="mt-auto space-y-12">
                            <div className="space-y-4">
                                <span className="text-journal-data text-muted block ml-1">Precio por persona</span>
                                <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                                    {tour.pricingTiers.map((tier, i) => (
                                        <div 
                                            key={i} 
                                            className={`flex justify-between items-center p-4 ${i !== tour.pricingTiers.length - 1 ? 'border-b border-border' : ''} hover:bg-white/[0.01] transition-colors`}
                                        >
                                            <span className="text-sub-label text-muted">
                                                {tier.minPax === tier.maxPax ? `${tier.minPax} Pax` : `${tier.minPax}-${tier.maxPax} Pax`}
                                            </span>
                                            <span className="text-sm font-bold text-foreground tabular-nums">
                                                {formatMoney(tier.priceCOP)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RIGHT PANE: INTERACTION (60%) === */}
                <div className="flex-1 flex flex-col bg-transparent relative">
                    
                    {/* Minimal Header */}
                    <div className="h-24 flex items-center justify-between px-12 lg:px-20 border-b border-white/[0.03]">
                        <div className="flex gap-4">
                            {[0, 1, 2].map(s => (
                                <div key={s} className={`h-0.5 w-12 transition-all duration-700 ${step === s ? 'bg-white' : 'bg-white/10'}`}></div>
                            ))}
                        </div>
                        <button onClick={handleClose} className="p-2 text-white/20 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:pt-16 lg:pb-24 lg:px-24" ref={contentRef}>
                        <div className="max-w-4xl">
                            
                            {/* STEP 0: SELECTION */}
                            {step === 0 && (
                                <div className="space-y-10">
                                    
                                    {/* Minimal Mode Switcher */}
                                    <div className="flex gap-12 border-b border-white/[0.03]">
                                        <button 
                                            onClick={() => setMode('public')}
                                            className={`pb-4 text-xs font-bold uppercase tracking-[0.3em] transition-all relative flex items-center gap-2.5 ${mode === 'public' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                                        >
                                            <Users className={`w-3.5 h-3.5 transition-transform duration-500 ${mode === 'public' ? 'scale-110' : 'scale-100 opacity-50'}`} />
                                            <span>Grupal</span>
                                            {mode === 'public' && <div className="absolute bottom-0 left-0 w-full h-px bg-white"></div>}
                                        </button>
                                        <button 
                                            onClick={() => setMode('private')}
                                            className={`pb-4 text-xs font-bold uppercase tracking-[0.3em] transition-all relative flex items-center gap-2.5 ${mode === 'private' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                                        >
                                            <Crown className={`w-3.5 h-3.5 transition-transform duration-500 ${mode === 'private' ? 'scale-110' : 'scale-100 opacity-50'}`} />
                                            <span>Privada</span>
                                            {mode === 'private' && <div className="absolute bottom-0 left-0 w-full h-px bg-white"></div>}
                                        </button>
                                    </div>

                                    {mode === 'public' ? (
                                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {publicDepartures.map((dep) => {
                                                const isSelected = selectedDeparture?.departureId === dep.departureId;
                                                const date = new Date(dep.date._seconds * 1000);
                                                const price = tour.pricingTiers.find(t => (dep.currentPax + 1) >= t.minPax && (dep.currentPax + 1) <= t.maxPax)?.priceCOP || tour.pricingTiers[0].priceCOP;

                                                return (
                                                    <button
                                                        key={dep.departureId}
                                                        onClick={() => setSelectedDeparture(dep)}
                                                        className={`
                                                            aspect-square flex flex-col p-8 transition-all duration-500 text-left
                                                            ${isSelected 
                                                                ? 'bg-white text-black' 
                                                                : 'bg-white/[0.02] text-white hover:bg-white/[0.05]'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest mb-auto ${isSelected ? 'text-black/40' : 'text-white/20'}`}>
                                                            {date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                                                        </span>
                                                        <span className="text-5xl font-bold leading-none tracking-tighter mb-1">{date.getDate()}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isSelected ? 'text-emerald-600' : 'text-emerald-400'}`}>
                                                            {dep.maxPax - dep.currentPax} cupos
                                                        </span>
                                                        <span className="text-sm font-bold font-mono tracking-tighter mt-auto">{formatMoney(price)}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="max-w-md">
                                            <div className="flex justify-between items-center mb-12">
                                                <span className="text-2xl font-bold text-white tracking-tighter uppercase">{getMonthName(currentMonth)} {currentYear}</span>
                                                <div className="flex gap-4">
                                                    <button className="text-white/20 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
                                                    <button className="text-white/20 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-2 text-center">
                                                {['L','M','M','J','V','S','D'].map(d => <span key={d} className="text-[10px] font-bold text-white/10 pb-6">{d}</span>)}
                                                {Array.from({length: 30}, (_, i) => i + 1).map(day => {
                                                    const isAvail = day > 5;
                                                    const isSel = selectedPrivateDate === day;
                                                    return (
                                                        <button 
                                                            key={day} disabled={!isAvail} onClick={() => setSelectedPrivateDate(day)}
                                                            className={`aspect-square rounded-full text-sm font-medium transition-all ${isSel ? 'bg-white text-black font-bold' : isAvail ? 'text-white hover:bg-white/10' : 'text-white/5 cursor-not-allowed'}`}
                                                        >
                                                            {day}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 1: FORM */}
                            {step === 1 && (
                                <div className="space-y-20">
                                    <h3 className="text-4xl lg:text-6xl font-bold text-white tracking-tighter">Identidad</h3>
                                    <div className="grid gap-16">
                                        <div className="group border-b border-white/10 focus-within:border-white transition-all">
                                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4 block group-focus-within:text-white">Nombre Completo</label>
                                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-none py-6 px-0 text-2xl lg:text-4xl text-white focus:ring-0 placeholder:text-white/5" placeholder="REQUERIDO" />
                                        </div>
                                        <div className="group border-b border-white/10 focus-within:border-white transition-all">
                                            <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4 block group-focus-within:text-white">Email</label>
                                            <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-none py-6 px-0 text-2xl lg:text-4xl text-white focus:ring-0 placeholder:text-white/5" placeholder="EMAIL@DOMINIO.COM" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-12">
                                            <div className="group border-b border-white/10 focus-within:border-white transition-all">
                                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4 block group-focus-within:text-white">Teléfono</label>
                                                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-none py-6 px-0 text-xl lg:text-2xl text-white focus:ring-0 placeholder:text-white/5" placeholder="+57" />
                                            </div>
                                            <div className="group border-b border-white/10 focus-within:border-white transition-all">
                                                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4 block group-focus-within:text-white">ID</label>
                                                <input value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full bg-transparent border-none py-6 px-0 text-xl lg:text-2xl text-white focus:ring-0 placeholder:text-white/5" placeholder="ID NUMBER" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: CONFIRMATION */}
                            {step === 2 && (
                                <div className="space-y-16">
                                    <div className="space-y-4">
                                        <Check className="w-16 h-16 text-white mb-8" />
                                        <h3 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-none">Solicitud<br/>Lista.</h3>
                                        <p className="text-white/40 text-xl font-light">Procesaremos tu reserva en breve.</p>
                                    </div>
                                    
                                    <div className="pt-16 border-t border-white/10 space-y-8">
                                        <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Expedición</span><span className="text-xl font-bold text-white">{tour.name.es}</span></div>
                                        <div className="flex justify-between items-end"><span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Inversión</span><span className="text-5xl lg:text-6xl font-bold text-white tracking-tighter">{formatMoney(getPrice())}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Minimal Footer */}
                    <div className="h-32 px-12 lg:px-24 flex items-center justify-between shrink-0 z-20">
                        {step > 0 ? (
                            <button onClick={() => setStep(s => s - 1)} className="text-white/20 hover:text-white text-[10px] font-bold uppercase tracking-[0.4em] transition-colors">
                                Volver
                            </button>
                        ) : <div />}
                        
                        <button 
                            disabled={!isStepValid()}
                            onClick={() => setStep(s => Math.min(s + 1, 2))}
                            className={`h-16 px-16 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] transition-all ${isStepValid() ? 'bg-white text-black hover:scale-105' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                        >
                            {step === 2 ? 'Cerrar' : 'Continuar'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 2px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
            `}</style>
        </div>
    );
}
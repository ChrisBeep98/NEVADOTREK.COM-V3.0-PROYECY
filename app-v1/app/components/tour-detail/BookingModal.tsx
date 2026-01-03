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

    useGSAP(() => {
        if (isOpen) {
            const isMobile = window.innerWidth < 768;
            gsap.fromTo(modalRef.current, 
                { autoAlpha: 0, y: isMobile ? "100%" : 20 },
                { autoAlpha: 1, y: 0, duration: 0.5, ease: "power4.out" }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current.children,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power2.out" }
            );
        }
    }, [step, mode]);

    const handleClose = () => {
        const isMobile = window.innerWidth < 768;
        gsap.to(modalRef.current, { autoAlpha: 0, y: isMobile ? "100%" : 10, duration: 0.3, ease: "power2.in", onComplete: onClose });
        setTimeout(() => { 
            setStep(0); setSelectedDeparture(null); setSelectedPrivateDate(null); setMode('public');
        }, 300);
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
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-background/90 backdrop-blur-xl p-0 md:p-8 lg:p-12 xl:p-24">
            
            {/* THE COMPACT MONOLITH */}
            <div 
                ref={modalRef} 
                className="w-full h-[90vh] md:h-full max-w-7xl bg-background rounded-t-[2rem] md:rounded-2xl overflow-hidden flex flex-col md:flex-row border-none md:border border-border shadow-2xl relative px-3 md:px-0"
            >
                {/* === LEFT PANE (Compact) === */}
                <div className="hidden md:flex w-[32%] bg-background border-r border-border flex-col p-8 lg:p-10 relative overflow-hidden shrink-0">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="space-y-2 mb-10">
                            <h1 className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">Reserva</h1>
                            <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">{tour.name.es}</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] block ml-1">Precio por persona</span>
                                <div className="bg-surface/50 border border-border rounded-lg overflow-hidden backdrop-blur-sm">
                                    {tour.pricingTiers.map((tier, i) => (
                                        <div key={i} className={`flex justify-between items-center p-3 ${i !== tour.pricingTiers.length - 1 ? 'border-b border-border' : ''} hover:bg-white/[0.01] transition-colors`}>
                                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{tier.minPax === tier.maxPax ? `${tier.minPax} Pax` : `${tier.minPax}-${tier.maxPax} Pax`}</span>
                                            <span className="text-xs font-bold text-foreground tabular-nums">{formatMoney(tier.priceCOP)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RIGHT PANE (Compact Interaction) === */}
                <div className="flex-1 flex flex-col bg-transparent relative h-full">
                    
                    {/* Compact Header */}
                    <div className="h-14 md:h-16 flex items-center justify-between px-frame md:px-10 border-b border-border shrink-0">
                        <div className="flex gap-2">
                            {[0, 1, 2].map(s => (
                                <div key={s} className={`h-0.5 w-8 transition-all duration-700 ${step === s ? 'bg-foreground' : 'bg-white/10'}`}></div>
                            ))}
                        </div>
                        <button onClick={handleClose} className="p-2 text-muted hover:text-foreground transition-colors">
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>

                    {/* Content Area (Reduced spacing) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-frame md:p-10 lg:p-12" ref={contentRef}>
                        <div className="max-w-4xl">
                            
                            {step === 0 && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    
                                    {/* Compact Switcher */}
                                    <div className="flex gap-8 border-b border-border max-w-fit">
                                        <button 
                                            onClick={() => setMode('public')}
                                            className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${mode === 'public' ? 'text-foreground' : 'text-muted hover:text-foreground/40'}`}
                                        >
                                            <Users className={`w-3 h-3 transition-transform ${mode === 'public' ? 'scale-110' : 'scale-100 opacity-50'}`} />
                                            <span>Grupal</span>
                                            {mode === 'public' && <div className="absolute bottom-0 left-0 w-full h-px bg-foreground"></div>}
                                        </button>
                                        <button 
                                            onClick={() => setMode('private')}
                                            className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${mode === 'private' ? 'text-foreground' : 'text-muted hover:text-foreground/40'}`}
                                        >
                                            <Crown className={`w-3 h-3 transition-transform ${mode === 'private' ? 'scale-110' : 'scale-100 opacity-50'}`} />
                                            <span>Privada</span>
                                            {mode === 'private' && <div className="absolute bottom-0 left-0 w-full h-px bg-foreground"></div>}
                                        </button>
                                    </div>

                                    {mode === 'public' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2 md:gap-3">
                                            {publicDepartures.map((dep) => {
                                                const isSelected = selectedDeparture?.departureId === dep.departureId;
                                                const date = new Date(dep.date._seconds * 1000);
                                                const price = tour.pricingTiers.find(t => (dep.currentPax + 1) >= t.minPax && (dep.currentPax + 1) <= t.maxPax)?.priceCOP || tour.pricingTiers[0].priceCOP;

                                                return (
                                                    <button
                                                        key={dep.departureId}
                                                        onClick={() => setSelectedDeparture(dep)}
                                                        className={`
                                                            flex flex-col p-4 md:p-5 transition-all duration-300 text-left rounded-xl
                                                            ${isSelected 
                                                                ? 'bg-foreground text-background shadow-lg scale-[1.02]' 
                                                                : 'bg-surface text-foreground border border-border md:border-transparent hover:border-border'
                                                            }
                                                        `}
                                                    >
                                                        <span className={`text-[9px] font-bold uppercase tracking-wider mb-2 ${isSelected ? 'opacity-60' : 'text-muted'}`}>
                                                            {date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
                                                        </span>
                                                        <span className="text-3xl font-bold leading-none tracking-tighter mb-1">{date.getDate()}</span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest mb-3 ${isSelected ? 'text-background/60' : 'text-emerald-400'}`}>
                                                            {dep.maxPax - dep.currentPax} cupos
                                                        </span>
                                                        <span className="text-xs font-bold font-mono tracking-tighter mt-auto">{formatMoney(price)}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="max-w-xs">
                                            <div className="flex justify-between items-center mb-6"><span className="text-lg font-bold text-foreground tracking-tighter uppercase">{getMonthName(currentMonth)} {currentYear}</span>
                                                <div className="flex gap-2">
                                                    <button className="text-muted hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
                                                    <button className="text-muted hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center">
                                                {['L','M','M','J','V','S','D'].map(d => <span key={d} className="text-[9px] font-bold text-muted pb-3">{d}</span>)}
                                                {Array.from({length: 30}, (_, i) => i + 1).map(day => {
                                                    const isAvail = day > 5;
                                                    const isSel = selectedPrivateDate === day;
                                                    return (<button key={day} disabled={!isAvail} onClick={() => setSelectedPrivateDate(day)} className={`h-8 w-8 rounded-full text-xs font-medium transition-all ${isSel ? 'bg-foreground text-background font-bold' : isAvail ? 'text-foreground hover:bg-surface' : 'text-muted/20 cursor-not-allowed'}`}>{day}</button>)
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-10">
                                    <h3 className="text-2xl font-bold text-foreground tracking-tighter">Identidad</h3>
                                    <div className="grid gap-6">
                                        <div className="group border-b border-border focus-within:border-foreground transition-all">
                                            <label className="text-[9px] font-bold text-muted mb-2 block group-focus-within:text-foreground uppercase tracking-widest">Nombre Completo</label>
                                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-none py-3 px-0 text-lg text-foreground focus:ring-0 placeholder:text-muted/20" placeholder="REQUERIDO" />
                                        </div>
                                        <div className="group border-b border-border focus-within:border-foreground transition-all">
                                            <label className="text-[9px] font-bold text-muted mb-2 block group-focus-within:text-foreground uppercase tracking-widest">Email</label>
                                            <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-none py-3 px-0 text-lg text-foreground focus:ring-0 placeholder:text-muted/20" placeholder="EMAIL@DOMINIO.COM" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="group border-b border-border focus-within:border-foreground transition-all">
                                                <label className="text-[9px] font-bold text-muted mb-2 block group-focus-within:text-foreground uppercase tracking-widest">Teléfono</label>
                                                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-none py-3 px-0 text-lg text-foreground focus:ring-0 placeholder:text-muted/20" placeholder="+57" />
                                            </div>
                                            <div className="group border-b border-border focus-within:border-foreground transition-all">
                                                <label className="text-[9px] font-bold text-muted mb-2 block group-focus-within:text-foreground uppercase tracking-widest">ID</label>
                                                <input value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full bg-transparent border-none py-3 px-0 text-lg text-foreground focus:ring-0 placeholder:text-muted/20" placeholder="ID NUMBER" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <Check className="w-10 h-10 text-foreground mb-4" />
                                        <h3 className="text-3xl font-bold text-foreground leading-none tracking-tight">Solicitud Lista.</h3>
                                        <p className="text-muted text-sm font-light">Procesaremos tu reserva en breve.</p>
                                    </div>
                                    <div className="pt-8 border-t border-border space-y-4">
                                        <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-muted uppercase tracking-widest">Expedición</span><span className="text-base font-bold text-foreground">{tour.name.es}</span></div>
                                        <div className="flex justify-between items-end"><span className="text-[9px] font-bold text-muted uppercase tracking-widest">Total Inversión</span><span className="text-3xl font-bold text-foreground tracking-tighter">{formatMoney(getPrice())}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Compact Footer */}
                    <div className="h-16 md:h-20 px-frame md:px-10 flex items-center justify-between shrink-0 z-20 bg-background/80 backdrop-blur-md border-t border-border">
                        {step > 0 ? (
                            <button onClick={() => setStep(s => s - 1)} className="text-[9px] font-bold text-muted hover:text-foreground transition-colors uppercase tracking-[0.2em]">Volver</button>
                        ) : <div />}
                        <button disabled={!isStepValid()} onClick={() => setStep(s => Math.min(s + 1, 2))} className={`h-10 md:h-12 px-8 md:px-10 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] transition-all ${isStepValid() ? 'bg-foreground text-background hover:scale-105 active:scale-95 shadow-xl' : 'bg-surface text-muted/20 cursor-not-allowed'}`}>
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
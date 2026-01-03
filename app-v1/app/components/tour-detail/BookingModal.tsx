'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Users, Crown, Calendar as CalendarIcon, Info, Plus, Minus } from 'lucide-react';
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
    note: string;
    pax: number;
}

export default function BookingModal({ isOpen, onClose, tour, departures = [] }: BookingModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    
    const [step, setStep] = useState(0); 
    const [mode, setMode] = useState<'public' | 'private'>('public');
    const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
    
    // Calendar Engine
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [formData, setFormData] = useState<UserData>({ 
        name: '', 
        email: '', 
        phone: '', 
        document: '', 
        note: '', 
        pax: 1 
    });
    
    const publicDepartures = departures.filter(d => (d.maxPax - d.currentPax) > 0);

    // Helpers
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => {
        const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // Mon start
    };

    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
    const prevMonth = () => {
        const now = new Date();
        if (viewDate.getMonth() <= now.getMonth() && viewDate.getFullYear() <= now.getFullYear()) return;
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
    };

    const isDateSelected = (day: number) => {
        return selectedDate?.getDate() === day && 
               selectedDate?.getMonth() === viewDate.getMonth() && 
               selectedDate?.getFullYear() === viewDate.getFullYear();
    };

    const isPast = (day: number) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return date < today;
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
    };

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
            setStep(0); setSelectedDeparture(null); setSelectedDate(null); setMode('public');
        }, 300);
    };

    const formatMoney = (amount: number) => `$ ${amount.toLocaleString('es-CO')} COP`;
    const getMonthName = (date: Date) => date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    
    const getPrice = () => {
        const pricing = mode === 'public' && selectedDeparture ? selectedDeparture.pricingSnapshot : tour.pricingTiers;
        const totalPax = (mode === 'public' && selectedDeparture ? selectedDeparture.currentPax : 0) + formData.pax;
        const tier = pricing.find(t => totalPax >= t.minPax && totalPax <= t.maxPax) || pricing[0];
        return tier.priceCOP;
    };

    const isStepValid = () => {
        if (step === 0) return mode === 'public' ? !!selectedDeparture : !!selectedDate;
        if (step === 1) return formData.name && formData.email && formData.phone && formData.pax > 0;
        return true;
    };

    const updatePax = (val: number) => {
        setFormData(prev => ({
            ...prev,
            pax: Math.max(1, Math.min(8, prev.pax + val))
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-background/90 backdrop-blur-xl p-0 md:p-8 lg:p-12 xl:p-24">
            <div ref={modalRef} className="w-full h-[90vh] md:h-full max-w-7xl bg-background rounded-t-[2rem] md:rounded-2xl overflow-hidden flex flex-col md:flex-row border-none md:border border-border shadow-2xl relative px-3 md:px-0">
                
                {/* LEFT PANE */}
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

                {/* RIGHT PANE */}
                <div className="flex-1 flex flex-col bg-transparent relative h-full">
                    <div className="h-14 md:h-16 flex items-center justify-between px-frame md:px-10 border-b border-border shrink-0">
                        <div className="flex gap-2">
                            {[0, 1, 2].map(s => (
                                <div key={s} className={`h-0.5 w-8 transition-all duration-700 ${step === s ? 'bg-foreground' : 'bg-white/10'}`}></div>
                            ))}
                        </div>
                        <button onClick={handleClose} className="p-2 text-muted hover:text-foreground transition-colors"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-frame md:p-10 lg:p-12" ref={contentRef}>
                        <div className="max-w-4xl">
                            {step === 0 && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex gap-8 border-b border-border max-w-fit">
                                        <button onClick={() => setMode('public')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${mode === 'public' ? 'text-foreground' : 'text-muted hover:text-foreground/40'}`}>
                                            <Users className={`w-3 h-3 transition-transform ${mode === 'public' ? 'scale-110' : 'scale-100 opacity-50'}`} />
                                            <span>Grupal</span>
                                            {mode === 'public' && <div className="absolute bottom-0 left-0 w-full h-px bg-foreground"></div>}
                                        </button>
                                        <button onClick={() => setMode('private')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${mode === 'private' ? 'text-foreground' : 'text-muted hover:text-foreground/40'}`}>
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
                                                    <button key={dep.departureId} onClick={() => setSelectedDeparture(dep)} className={`flex flex-col p-4 md:p-5 transition-all duration-300 text-left rounded-xl ${isSelected ? 'bg-foreground text-background shadow-lg scale-[1.02]' : 'bg-surface text-foreground border border-border md:border-transparent hover:border-border'}`}>
                                                        <div className="flex items-center gap-1.5 mb-2">
                                                            <CalendarIcon className={`w-2.5 h-2.5 ${isSelected ? 'opacity-60' : 'text-muted'}`} />
                                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'opacity-60' : 'text-muted'}`}>{date.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}</span>
                                                        </div>
                                                        <span className="text-3xl font-bold leading-none tracking-tighter mb-1">{date.getDate()}</span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest mb-3 ${isSelected ? 'text-background/60' : 'text-emerald-400'}`}>{dep.maxPax - dep.currentPax} cupos</span>
                                                        <span className="text-xs font-bold font-mono tracking-tighter mt-auto">{formatMoney(price)}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="max-w-md animate-in fade-in duration-500">
                                            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                                                <span className="text-xl font-bold text-foreground tracking-tight uppercase tabular-nums">{getMonthName(viewDate)}</span>
                                                <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 shadow-sm">
                                                    <button onClick={prevMonth} className="p-2 hover:bg-foreground/5 rounded-md text-muted hover:text-foreground transition-all disabled:opacity-5 disabled:cursor-not-allowed group" disabled={viewDate.getMonth() <= new Date().getMonth() && viewDate.getFullYear() <= new Date().getFullYear()}><ChevronLeft className="w-4 h-4 transition-transform group-active:-translate-x-0.5" /></button>
                                                    <div className="w-px h-4 bg-border mx-0.5 opacity-50"></div>
                                                    <button onClick={nextMonth} className="p-2 hover:bg-foreground/5 rounded-md text-muted hover:text-foreground transition-all group"><ChevronRight className="w-4 h-4 transition-transform group-active:translate-x-0.5" /></button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-2 text-center w-fit">
                                                {['L','M','X','J','V','S','D'].map(d => <div key={d} className="w-10 h-10 flex items-center justify-center text-[10px] font-bold text-muted/40 uppercase tracking-widest">{d}</div>)}
                                                {Array.from({ length: getFirstDayOfMonth(viewDate) }).map((_, i) => <div key={`empty-${i}`} className="w-10 h-10"></div>)}
                                                {Array.from({ length: getDaysInMonth(viewDate) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const disabled = isPast(day);
                                                    const active = isDateSelected(day);
                                                    return (
                                                        <button key={day} disabled={disabled} onClick={() => handleDateSelect(day)} className={`w-10 h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center relative shadow-sm ${active ? 'bg-foreground text-background shadow-xl scale-110 z-10' : disabled ? 'bg-transparent text-muted/10 cursor-not-allowed' : 'bg-surface text-foreground/60 hover:bg-white/5 hover:text-foreground hover:shadow-md'}`}>
                                                            {day}{active && <div className="absolute bottom-1 w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-10 max-w-4xl animate-in fade-in duration-500">
                                    <h3 className="text-2xl font-bold text-foreground tracking-tight">Información personal</h3>
                                    <div className="grid gap-8">
                                        <div className="relative">
                                            <label className="text-[11px] text-muted font-medium mb-2 block">Nombre completo del responsable</label>
                                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder="Ej. Juan Sebastián Pérez" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">Correo electrónico de contacto</label>
                                                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder="nombre@dominio.com" />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">Número de viajeros</label>
                                                <div className="flex items-center justify-between border border-border rounded-lg h-14 px-4 bg-transparent">
                                                    <button onClick={() => updatePax(-1)} className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface rounded-md transition-all"><Minus className="w-4 h-4" /></button>
                                                    <span className="text-xl font-bold tabular-nums text-foreground">{formData.pax}</span>
                                                    <button onClick={() => updatePax(1)} className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface rounded-md transition-all"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">Teléfono móvil / WhatsApp</label>
                                                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder="+57 000 000 0000" />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">Documento de identidad</label>
                                                <input value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder="C.C. o Pasaporte" />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="text-[11px] text-muted font-medium mb-2 block">Notas o requerimientos especiales</label>
                                            <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg py-4 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10 resize-none h-32" placeholder="Indica alergias, restricciones alimenticias o mensajes para el guía..." />
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
                                        <div className="flex justify-between items-end"><span className="text-[9px] font-bold text-muted uppercase tracking-widest">Total Inversión</span><span className="text-3xl font-bold text-foreground tracking-tighter">{formatMoney(getPrice() * formData.pax)}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

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
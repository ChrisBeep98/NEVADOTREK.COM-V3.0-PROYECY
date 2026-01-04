'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Users, Crown, Calendar as CalendarIcon, Info, Plus, Minus, Mountain, User, CreditCard } from 'lucide-react';
import { Tour, Departure } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';

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
    const { t, lang } = useLanguage();
    const l = lang.toLowerCase() as 'es' | 'en';
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

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat(lang === 'ES' ? 'es-CO' : 'en-US', { 
            style: 'currency', 
            currency: 'COP', 
            maximumFractionDigits: 0 
        }).format(amount);
    };

    const getMonthName = (date: Date) => date.toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' });
    
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
                            <h1 className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">{t.booking_modal.step_label}</h1>
                            <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">{tour.name[l]}</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] block ml-1">{t.booking_modal.price_per_person}</span>
                                <div className="bg-surface/50 border border-border rounded-lg overflow-hidden backdrop-blur-sm">
                                    {tour.pricingTiers.map((tier, i) => (
                                        <div key={i} className={`flex justify-between items-center p-3 ${i !== tour.pricingTiers.length - 1 ? 'border-b border-border' : ''} hover:bg-white/[0.01] transition-colors`}>
                                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                                {tier.minPax === tier.maxPax 
                                                    ? `${tier.minPax} ${t.booking_modal.pax_label}` 
                                                    : `${tier.minPax}-${tier.maxPax} ${t.booking_modal.pax_label}`
                                                }
                                            </span>
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
                    
                    {/* Tactical Animated Progress Header */}
                    <div className="h-16 md:h-20 flex items-center justify-between px-frame md:px-10 border-b border-border shrink-0">
                        <div className="relative w-32 md:w-48 flex items-center h-4">
                            {/* Track Background */}
                            <div className="absolute w-full h-[1px] bg-white/10"></div>
                            
                            {/* Progress Fill */}
                            <div 
                                className="absolute top-1/2 -translate-y-1/2 left-0 h-[1px] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-1000 ease-in-out z-10"
                                style={{ width: `${(step / 2) * 100}%` }}
                            ></div>

                            {/* Checkpoints */}
                            <div className="absolute w-full flex justify-between z-20">
                                {[0, 1, 2].map(s => (
                                    <div 
                                        key={s}
                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-700 border border-background ${step >= s ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-110' : 'bg-white/20 scale-75'}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 text-muted hover:text-foreground transition-all hover:rotate-90 duration-500">
                            <X className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-frame md:p-10 lg:p-12" ref={contentRef}>
                        <div className="max-w-4xl">
                            {step === 0 && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex gap-8 border-b border-border max-w-fit">
                                        <button onClick={() => setMode('public')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${mode === 'public' ? 'text-foreground' : 'text-muted hover:text-foreground/40'}`}>
                                            <Users className={`w-3 h-3 transition-transform ${mode === 'public' ? 'scale-110' : 'scale-100 opacity-50'}`} />
                                            <span>{t.booking_modal.mode_group}</span>
                                            {mode === 'public' && <div className="absolute bottom-0 left-0 w-full h-px bg-foreground"></div>}
                                        </button>
                                        <button onClick={() => setMode('private')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 ${mode === 'private' ? 'text-foreground' : 'text-muted hover:text-foreground/40'}`}>
                                            <Crown className={`w-3 h-3 transition-transform ${mode === 'private' ? 'scale-110' : 'scale-100 opacity-50'}`} />
                                            <span>{t.booking_modal.mode_private}</span>
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
                                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'opacity-60' : 'text-muted'}`}>{date.toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { month: 'short' }).toUpperCase()}</span>
                                                        </div>
                                                        <span className="text-3xl font-bold leading-none tracking-tighter mb-1">{date.getDate()}</span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest mb-3 ${isSelected ? 'text-background/60' : 'text-emerald-400'}`}>
                                                            {t.booking_modal.slots_left.replace('{count}', (dep.maxPax - dep.currentPax).toString())}
                                                        </span>
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
                                                {(lang === 'ES' ? ['L','M','X','J','V','S','D'] : ['M','T','W','T','F','S','S']).map(d => <div key={d} className="w-10 h-10 flex items-center justify-center text-[10px] font-bold text-muted/40 uppercase tracking-widest">{d}</div>)}
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
                                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{t.booking_modal.info_title}</h3>
                                    <div className="grid gap-8">
                                        <div className="relative">
                                            <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.name_label}</label>
                                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder={t.booking_modal.form.name_placeholder} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.email_label}</label>
                                                <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder={t.booking_modal.form.email_placeholder} />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.pax_count_label}</label>
                                                <div className="flex items-center justify-between border border-border rounded-lg h-14 px-4 bg-transparent">
                                                    <button onClick={() => updatePax(-1)} className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface rounded-md transition-all"><Minus className="w-4 h-4" /></button>
                                                    <span className="text-xl font-bold tabular-nums text-foreground">{formData.pax}</span>
                                                    <button onClick={() => updatePax(1)} className="w-10 h-10 flex items-center justify-center text-muted hover:text-foreground hover:bg-surface rounded-md transition-all"><Plus className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.phone_label}</label>
                                                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder={t.booking_modal.form.phone_placeholder} />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.document_label}</label>
                                                <input value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" placeholder={t.booking_modal.form.document_placeholder} />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.notes_label}</label>
                                            <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg py-4 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10 resize-none h-32" placeholder={t.booking_modal.form.notes_placeholder} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: REFINED MINIMAL TICKET */}
                            {step === 2 && (
                                <div className="space-y-10 animate-in fade-in duration-700 max-w-xl">
                                    <h3 className="text-2xl font-bold text-foreground tracking-tight ml-1">{t.booking_modal.confirmation.title}</h3>
                                    
                                    <div className="relative">
                                        {/* THE TICKET BODY */}
                                        <div className="bg-white text-slate-950 rounded-2xl shadow-xl overflow-hidden relative">
                                            {[
                                                { label: t.booking_modal.confirmation.responsible, value: formData.name || t.booking_modal.confirmation.guest, icon: User },
                                                { 
                                                    label: t.booking_modal.confirmation.start_date, 
                                                    value: mode === 'public' && selectedDeparture 
                                                        ? new Date(selectedDeparture.date._seconds * 1000).toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' })
                                                        : selectedDate?.toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
                                                    icon: CalendarIcon
                                                },
                                                { label: t.booking_modal.confirmation.travelers, value: `${formData.pax} ${formData.pax === 1 ? t.booking_modal.confirmation.pax_singular : t.booking_modal.confirmation.pax_plural}`, icon: Users }
                                            ].map((item, i) => (
                                                <div 
                                                    key={i} 
                                                    className="px-10 py-6 flex justify-between items-center border-b border-slate-100"
                                                >
                                                    <div className="flex items-center gap-3 text-muted">
                                                        <item.icon className="w-3.5 h-3.5 opacity-50" />
                                                        <span className="text-[11px] font-medium">{item.label}</span>
                                                    </div>
                                                    <span className="text-base font-bold text-slate-900 tracking-tight text-right">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            ))}

                                            {/* Perforated Total Section */}
                                            <div className="relative px-10 py-7 bg-slate-50/50">
                                                {/* Top Dashed Line */}
                                                <div className="absolute top-0 left-10 right-10 border-t border-dashed border-slate-200"></div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3 text-muted">
                                                        <CreditCard className="w-3.5 h-3.5 opacity-50" />
                                                        <span className="text-[11px] font-medium">{t.booking_modal.confirmation.total_investment}</span>
                                                    </div>
                                                    <span className="text-base font-bold text-slate-900 tracking-tight font-mono">
                                                        {formatMoney(getPrice() * formData.pax)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Physical Ticket Notches (Side circles) */}
                                        <div className="absolute top-[218px] -left-3 w-6 h-6 bg-background rounded-full border-r border-border z-10"></div>
                                        <div className="absolute top-[218px] -right-3 w-6 h-6 bg-background rounded-full border-l border-border z-10"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-16 md:h-20 px-frame md:px-10 flex items-center justify-between shrink-0 z-20 bg-background/80 backdrop-blur-md border-t border-border">
                        {step > 0 ? (
                            <button onClick={() => setStep(s => s - 1)} className="text-[9px] font-bold text-muted hover:text-foreground transition-colors uppercase tracking-[0.2em]">{t.booking_modal.footer.back}</button>
                        ) : <div />}
                        <button 
                            disabled={!isStepValid()}
                            onClick={() => setStep(s => Math.min(s + 1, 2))}
                            className={`h-10 md:h-12 px-8 md:px-10 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] transition-all ${isStepValid() ? 'bg-foreground text-background hover:scale-105 active:scale-95 shadow-xl' : 'bg-surface text-muted/20 cursor-not-allowed'}`}
                        >
                            {step === 2 ? t.booking_modal.footer.confirm_send : t.booking_modal.footer.continue}
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
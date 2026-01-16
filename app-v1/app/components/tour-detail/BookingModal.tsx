'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ChevronLeft, ChevronRight, Users, Crown, Calendar as CalendarIcon, Plus, Minus, User, CreditCard, Loader2, CheckCircle, ExternalLink, RefreshCw, Clock, FileCheck, MessageCircle, ShieldCheck } from 'lucide-react';
import { Tour, Departure } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';
import BoldCheckout from '../ui/BoldCheckout';
import { createPrivateBooking, getStagingTestTour, getBookingStatus } from '../../services/nevado-api';

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
    
    // Booking Flow State
    const [realBookingId, setRealBookingId] = useState<string | null>(null);
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);
    const [paymentRef, setPaymentRef] = useState<string | null>(null);
    
    // Payment Waiting State (Step 2.5)
    const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // Test Mode State
    const [isTestMode, setIsTestMode] = useState(false);
    const [testTour, setTestTour] = useState<Tour | null>(null);

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
    
    const effectiveTour = testTour || tour;
    
    // --- SMART FORM LOGIC: Load & Save Draft ---
    useEffect(() => {
        // Load saved data on mount
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem('nevado_user_draft');
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setFormData(prev => ({
                        ...prev,
                        name: parsed.name || '',
                        email: parsed.email || '',
                        phone: parsed.phone || '',
                        document: parsed.document || ''
                    }));
                } catch (e) {
                    console.error("Error loading form draft", e);
                }
            }
        }
    }, []);

    useEffect(() => {
        // Save data when fields change (Debounced slightly by React batching)
        if (formData.name || formData.email || formData.phone || formData.document) {
            const draft = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                document: formData.document
            };
            localStorage.setItem('nevado_user_draft', JSON.stringify(draft));
        }
    }, [formData.name, formData.email, formData.phone, formData.document]);

    // Load test tour from staging when modal opens
    useEffect(() => {
        if (!isOpen) return;

        async function loadTestTour() {
            const fetched = await getStagingTestTour();
            if (fetched) {
                setTestTour(fetched);
                setIsTestMode(true);
                console.log("Test tour loaded from staging:", fetched);
            } else {
                console.log("Test tour not available, using production tour");
            }
        }

        loadTestTour();
    }, [isOpen]);

    // --- PAYMENT POLLING LOGIC ---
    const checkPaymentStatus = async (manual = false) => {
        if (!realBookingId) return;
        
        try {
            if (manual) setIsCheckingStatus(true);
            setPaymentError(null); // Clear previous errors on new check
            
            const data = await getBookingStatus(realBookingId);
            console.log("Checking Booking Status (Staging):", data);

            // Check for approved payment status from backend (populated by Bold Webhook)
            if (data.paymentStatus === 'approved' || data.status === 'confirmed') {
                setIsWaitingForPayment(false);
                setPaymentRef(data.paymentRef || realBookingId); 
                setStep(3);
                window.scrollTo(0, 0);
            } else if (data.paymentStatus === 'rejected') {
                // Handle failed payment
                setIsWaitingForPayment(false);
                setPaymentError("El pago fue rechazado por el banco. Intenta con otro medio de pago.");
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
        } finally {
            if (manual) setIsCheckingStatus(false);
        }
    };

    // Auto-poll every 5 seconds when waiting
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isWaitingForPayment && realBookingId) {
            interval = setInterval(() => {
                checkPaymentStatus();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isWaitingForPayment, realBookingId]);

    
    const publicDepartures = departures.filter(d => (d.maxPax - (d.currentPax || 0)) > 0);

    // Check for payment return (Vanilla JS for safety - Legacy Redirect Support)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const paymentStatus = params.get('payment_status');
            const ref = params.get('ref');
            console.log("BookingModal - Payment Status:", paymentStatus, "Ref:", ref); // DEBUG

            if (paymentStatus === 'approved') {
                console.log("BookingModal - Setting to Step 3 and opening modal"); // DEBUG
                setStep(3);
                setPaymentRef(ref);
                // Ensure modal is open if parent controls it
                if (typeof window !== 'undefined') {
                    window.scrollTo(0, 0);
                }
            }
        }
    }, []);

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
            // Save path immediately upon opening
            if (typeof window !== 'undefined') {
                localStorage.setItem('lastTourPath', window.location.pathname);
            }

            const isMobile = window.innerWidth < 768;
            gsap.fromTo(modalRef.current,
                { autoAlpha: 0, y: isMobile ? '100vh' : 20 },
                { autoAlpha: 1, y: 0, duration: 0.5, ease: "power4.out" }
            );
        }
    }, [isOpen]);

    useEffect(() => {
        if (contentRef.current) {
            gsap.fromTo(contentRef.current.children,
                { autoAlpha: 0, y: 15 },
                { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.025, ease: "power2.out", force3D: true }
            );
        }
    }, [step, mode, isWaitingForPayment]); // Added isWaitingForPayment to trigger anim

    const handleNextStep = () => {
        setStep(s => Math.min(s + 1, 2));
    };

    const handlePay = async () => {
        // 1. Pre-open tab to bypass popup blockers (Crucial: Must happen immediately on user click)
        const bridgeWindow = window.open('', '_blank');
        
        if (!bridgeWindow) {
            setPaymentError("El navegador bloqueó la ventana de pago. Por favor habilita popups.");
            return;
        }

        // UX: Show loading state in the new tab while backend processes
        bridgeWindow.document.write(`
            <html>
                <head><title>Iniciando Pago...</title></head>
                <body style="background:#09090b;color:#e4e4e7;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui,sans-serif;">
                    <div style="text-align:center">
                        <div style="width:40px;height:40px;border:3px solid #3f3f46;border-top-color:#06b6d4;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px;"></div>
                        <h3 style="font-weight:500;letter-spacing:0.05em;">Iniciando pasarela segura...</h3>
                    </div>
                    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
                </body>
            </html>
        `);

        try {
            setIsCreatingBooking(true);
            setPaymentError(null);

            let bookingIdToUse = realBookingId;

            // 2. Create Booking ONLY if it doesn't exist yet
            if (!bookingIdToUse) {
                // Format date for API (YYYY-MM-DD)
                const dateObj = mode === 'public' && selectedDeparture 
                    ? new Date(selectedDeparture.date._seconds * 1000)
                    : selectedDate;
                
                if (!dateObj) throw new Error("Fecha no seleccionada");
                
                const formattedDate = dateObj.toISOString().split('T')[0];
                const tourIdToUse = effectiveTour.tourId;

                let finalPhone = formData.phone.trim();
                if (!finalPhone.startsWith('+')) {
                    finalPhone = `+57${finalPhone}`;
                }

                const response = await createPrivateBooking({
                    tourId: tourIdToUse,
                    date: formattedDate,
                    pax: formData.pax,
                    customer: {
                        name: formData.name,
                        email: formData.email,
                        phone: finalPhone,
                        document: formData.document
                    }
                });

                bookingIdToUse = response.bookingId;
                setRealBookingId(response.bookingId);
            }

            // 3. Redirect the pre-opened tab to the Bridge
            if (bookingIdToUse) {
                bridgeWindow.location.href = `/payment-bridge?bookingId=${bookingIdToUse}`;
                setIsWaitingForPayment(true);
            } else {
                throw new Error("No se pudo generar el ID de reserva.");
            }

        } catch (error) {
            console.error("Payment Start Error:", error);
            bridgeWindow.close(); // Close the dead tab
            setPaymentError(error instanceof Error ? error.message : "Error al iniciar el pago.");
        } finally {
            setIsCreatingBooking(false);
        }
    };

    const handleClose = () => {
        const isMobile = window.innerWidth < 768;
        gsap.to(modalRef.current, { autoAlpha: 0, y: isMobile ? '100vh' : 10, duration: 0.3, ease: "power2.in", onComplete: onClose });
        setTimeout(() => {
            setStep(0); setSelectedDeparture(null); setSelectedDate(null); setMode('public');
            setRealBookingId(null);
            setIsWaitingForPayment(false); // Reset waiting state
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
        const pricing = mode === 'public' && selectedDeparture ? selectedDeparture.pricingSnapshot : effectiveTour.pricingTiers;
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
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-slate-950/60 backdrop-blur-md p-0 md:p-8 lg:p-12 xl:p-24 transform-gpu will-change-transform">
            <div ref={modalRef} className="w-full h-[90vh] md:h-full max-w-7xl bg-background rounded-t-[2rem] md:rounded-2xl overflow-hidden flex flex-col md:flex-row border-none md:border border-border shadow-2xl relative px-3 md:px-0 transform-gpu will-change-transform">
                
                {/* LEFT PANE */}
                <div className="hidden md:flex w-[32%] bg-background border-r border-border flex-col p-8 lg:p-10 relative overflow-hidden shrink-0">
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="space-y-2 mb-10">
                            <h1 className="text-[10px] font-bold text-muted uppercase tracking-[0.4em]">{t.booking_modal.step_label}</h1>
                            <h2 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">{effectiveTour.name[l]}</h2>
                        </div>
                        <div className="space-y-8">
                            {isWaitingForPayment ? (
                                    <div className="animate-in fade-in zoom-in-95 duration-700">
                                        <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#4A148C] via-[#311B92] to-[#4A148C] rounded-xl border border-purple-400/20 shadow-2xl shadow-purple-950/50 relative overflow-hidden p-6 flex flex-col justify-between group">
                                            {/* Background Effects */}
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(170,100,255,0.2),transparent)] opacity-70" />
                                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                                            
                                            {/* Header */}
                                            <div className="flex justify-between items-start z-10">
                                                <div className="w-10 h-6 rounded bg-gradient-to-r from-amber-200 to-amber-400 shadow-lg" />
                                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                            </div>

                                            {/* Dynamic Status */}
                                            <div className="z-10 space-y-4">
                                                <div className="flex gap-1.5 justify-center py-4">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-[bounce_1s_infinite_0ms]" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-[bounce_1s_infinite_200ms]" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-300 animate-[bounce_1s_infinite_400ms]" />
                                                </div>
                                            </div>
                                            
                                            {/* Footer Info */}
                                            <div className="space-y-1 z-10">
                                                <p className="text-[9px] font-mono text-purple-300/70 tracking-widest uppercase">SECURE GATEWAY</p>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-xl font-black text-white tracking-[0.2em] font-sans">BOLD</p>
                                                    <CreditCard className="w-5 h-5 text-white/20" />
                                                </div>
                                            </div>

                                            {/* Scanline Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-[scan_3s_linear_infinite] pointer-events-none" />
                                        </div>
                                        
                                        <div className="mt-6 text-center">
                                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest animate-pulse">Sincronizando Pago...</p>
                                        </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] block ml-1">{t.booking_modal.price_per_person}</span>
                                    <div className="bg-surface/50 border border-border rounded-lg overflow-hidden backdrop-blur-sm">
                                        {effectiveTour.pricingTiers.map((tier, i) => (
                                            <div key={i} className={`flex justify-between items-center p-3 ${i !== effectiveTour.pricingTiers.length - 1 ? 'border-b border-border' : ''} hover:bg-white/[0.01] transition-colors`}>
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
                            )}
                        </div>
                    </div>
                </div>

                {/* === RIGHT PANE (Compact Interaction) === */}
                <div className="flex-1 flex flex-col bg-transparent relative h-full">
                    
                    {/* Tactical Animated Progress Header */}
                    <div className="h-16 md:h-20 flex items-center justify-between px-frame md:px-10 border-b border-border shrink-0 relative">
                        {/* Test Mode Indicator */}
                        {isTestMode && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500/10 border border-amber-500/50 text-amber-500 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 z-30">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                TEST MODE
                            </div>
                        )}
                        
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

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-frame md:p-10 lg:p-12 transform-gpu will-change-transform" ref={contentRef}>
                        <div className="w-full">
                            
                            {/* === WAITING FOR PAYMENT STATE (Step 2.5) === */}
                            {isWaitingForPayment && step === 2 ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center justify-center h-full min-h-[300px] text-center w-full">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                                            <FileCheck className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-lg border border-border">
                                            <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                                        </div>
                                    </div>

                                    <div className="space-y-6 w-full">
                                        <h3 className="text-2xl md:text-3xl font-bold text-foreground">¡Reserva Recibida!</h3>
                                        
                                        <div className="flex flex-col md:flex-row md:items-stretch gap-4 w-full">
                                            {/* Left side: Message */}
                                            <div className="flex-1 bg-surface/50 border border-border rounded-xl p-5 md:p-6 flex items-start gap-4 text-left backdrop-blur-sm shadow-sm">
                                                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                                <p className="text-muted text-base leading-relaxed">
                                                    Hemos recibido tus <strong className="text-foreground font-semibold">datos de forma segura</strong>. 
                                                    Ahora solo estamos esperando la <strong className="text-foreground font-semibold">confirmación del pago</strong> en la otra pestaña para asegurar tus cupos.
                                                </p>
                                            </div>

                                            {/* Right side: Summary Card */}
                                            <div className="flex-1 bg-surface/30 border border-border/50 rounded-xl p-5 md:p-6 text-xs space-y-3 shadow-sm flex flex-col justify-center">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted text-[9px] uppercase tracking-wider font-bold">Titular</span>
                                                    <span className="font-medium text-foreground text-sm truncate max-w-[160px]">{formData.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted text-[9px] uppercase tracking-wider font-bold">Fecha</span>
                                                    <span className="font-medium text-foreground text-sm">
                                                        {mode === 'public' && selectedDeparture 
                                                            ? new Date(selectedDeparture.date._seconds * 1000).toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' })
                                                            : selectedDate?.toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' })
                                                    }
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-muted text-[9px] uppercase tracking-wider font-bold">Pasajeros</span>
                                                    <span className="font-medium text-foreground text-sm">{formData.pax} {formData.pax === 1 ? 'Pers.' : 'Pers.'}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-1">
                                                    <span className="text-muted text-[9px] uppercase tracking-wider font-bold">Total</span>
                                                    <span className="font-bold text-emerald-400 font-mono text-lg tracking-tighter">{formatMoney(getPrice() * formData.pax)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mt-8">
                                        <a 
                                            href="https://wa.me/573103953530?text=Hola,%20tengo%20dudas%20con%20mi%20pago%20de%20la%20reserva..."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-12 flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Ayuda / WhatsApp</span>
                                        </a>

                                        <button 
                                            onClick={() => checkPaymentStatus(true)}
                                            disabled={isCheckingStatus}
                                            className="h-12 flex-1 bg-transparent border border-border hover:bg-surface text-foreground rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                        >
                                            {isCheckingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                            {isCheckingStatus ? 'Verificando...' : 'Ya realicé el pago'}
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setIsWaitingForPayment(false)}
                                        className="text-[10px] text-muted hover:text-foreground underline underline-offset-4 decoration-muted/30 hover:decoration-foreground transition-all mt-2"
                                    >
                                        Cancelar espera
                                    </button>
                                </div>
                            ) : (
                                // === REGULAR STEPS ===
                                <>
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
                                                const price = effectiveTour.pricingTiers.find(t => (dep.currentPax + 1) >= t.minPax && (dep.currentPax + 1) <= t.maxPax)?.priceCOP || effectiveTour.pricingTiers[0].priceCOP;
                                                return (
                                                    <button key={dep.departureId} onClick={() => setSelectedDeparture(dep)} className={`flex flex-col p-4 md:p-5 transition-all duration-300 text-left rounded-xl ${isSelected ? 'bg-foreground text-background shadow-lg scale-[1.02]' : 'bg-surface text-foreground border border-border md:border-transparent hover:border-border'}`}>
                                                        <div className="flex items-center gap-1.5 mb-2">
                                                            <CalendarIcon className={`w-2.5 h-2.5 ${isSelected ? 'opacity-60' : 'text-muted'}`} />
                                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'opacity-60' : 'text-muted'}`}>{date.toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { month: 'short' }).toUpperCase()}</span>
                                                        </div>
                                                        <span className="text-3xl font-bold leading-none tracking-tighter mb-1">{date.getDate()}</span>
                                                        <span className={`text-[9px] font-bold uppercase tracking-widest mb-3 ${isSelected ? 'text-background/60' : 'text-emerald-400'}`}>
                                                            {t.booking_modal.slots_left.replace('{count}', (dep.maxPax - (dep.currentPax || 0)).toString())}
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
                                            <input 
                                                value={formData.name} 
                                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                                className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" 
                                                placeholder={t.booking_modal.form.name_placeholder} 
                                                autoComplete="name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.email_label}</label>
                                                <input 
                                                    value={formData.email} 
                                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                                    className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" 
                                                    placeholder={t.booking_modal.form.email_placeholder} 
                                                    autoComplete="email"
                                                    type="email"
                                                />
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
                                                <input 
                                                    value={formData.phone} 
                                                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                                                    className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" 
                                                    placeholder={t.booking_modal.form.phone_placeholder} 
                                                    autoComplete="tel"
                                                    type="tel"
                                                />
                                            </div>
                                            <div className="relative">
                                                <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.document_label}</label>
                                                <input 
                                                    value={formData.document} 
                                                    onChange={e => setFormData({...formData, document: e.target.value})} 
                                                    className="w-full bg-transparent border border-border focus:border-foreground rounded-lg h-14 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10" 
                                                    placeholder={t.booking_modal.form.document_placeholder} 
                                                />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="text-[11px] text-muted font-medium mb-2 block">{t.booking_modal.form.notes_label}</label>
                                            <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-transparent border border-border focus:border-foreground rounded-lg py-4 px-5 text-base text-foreground transition-all outline-none placeholder:text-muted/10 resize-none h-32" placeholder={t.booking_modal.form.notes_placeholder} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: REFINED MINIMAL TICKET (Standard View) */}
                            {step === 2 && !isWaitingForPayment && (
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

                            {/* STEP 3: SUCCESS STATE */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in duration-700 max-w-xl text-center flex flex-col items-center justify-center py-10">
                                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-bold text-foreground tracking-tight">¡Todo Listo!</h3>
                                        <p className="text-muted text-sm max-w-xs mx-auto leading-relaxed">
                                            Tu lugar en la montaña está asegurado. Hemos enviado el itinerario detallado a tu correo.
                                        </p>
                                    </div>

                                    <div className="bg-surface/50 border border-border rounded-xl p-6 w-full max-w-sm mt-4 backdrop-blur-sm">
                                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">Referencia de Transacción</p>
                                        <p className="text-lg font-mono font-bold text-foreground tracking-tight">{paymentRef || 'N/A'}</p>
                                    </div>

                                    <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
                                        <button 
                                            onClick={handleClose} 
                                            className="h-12 w-full bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            Volver al Tour
                                        </button>
                                        <p className="text-[10px] text-muted/60 text-center">
                                            ¿Necesitas ayuda? <span className="underline hover:text-foreground cursor-pointer">Contáctanos</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                                </>
                            )}
                        </div>
                    </div>

                    {!isWaitingForPayment && (
                        <div className="h-16 md:h-20 px-frame md:px-10 flex items-center justify-between shrink-0 z-20 bg-background/80 backdrop-blur-md border-t border-border">
                            {step > 0 && step < 3 ? (
                                <button 
                                    disabled={isCreatingBooking}
                                    onClick={() => setStep(s => s - 1)} 
                                    className="text-[9px] font-bold text-muted hover:text-foreground transition-colors uppercase tracking-[0.2em] disabled:opacity-20"
                                >
                                    {t.booking_modal.footer.back}
                                </button>
                            ) : <div />}
                            
                            {/* Only show the Payment Bridge Button if we are in step 2 AND NOT waiting/success */}
                            {step === 2 && !isWaitingForPayment && !isCheckingStatus ? (
                                <div className="w-full max-w-[280px] flex flex-col gap-3">
                                    {paymentError && (
                                        <div className="text-[10px] text-rose-500 font-medium text-center bg-rose-500/5 border border-rose-500/20 p-2 rounded-lg animate-in fade-in slide-in-from-bottom-1">
                                            {paymentError}
                                        </div>
                                    )}
                                    <button 
                                        onClick={handlePay}
                                        disabled={isCreatingBooking}
                                        className="h-12 w-full bg-slate-900 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:scale-100"
                                    >
                                        {isCreatingBooking ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Procesando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Ir a Pagar</span>
                                                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : step < 2 ? (
                                <button 
                                    disabled={!isStepValid() || isCreatingBooking}
                                    onClick={handleNextStep}
                                    className={`h-10 md:h-12 px-8 md:px-10 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${isStepValid() ? 'bg-foreground text-background hover:scale-105 active:scale-95 shadow-xl' : 'bg-surface text-muted/20 cursor-not-allowed'}`}
                                >
                                    {isCreatingBooking && <Loader2 className="w-3 h-3 animate-spin" />}
                                    {isCreatingBooking ? 'Procesando...' : t.booking_modal.footer.continue}
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 2px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }

                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(500%); }
                }
            `}</style>
        </div>
    );
}

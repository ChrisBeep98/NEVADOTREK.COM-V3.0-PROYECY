'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, ChevronLeft, ChevronRight, Users, Crown, Calendar as CalendarIcon, Plus, Minus, User, CreditCard, Loader2, CheckCircle, ExternalLink, RefreshCw, Clock, FileCheck, MessageCircle, ShieldCheck, Info } from 'lucide-react';
import { Tour, Departure } from '../../types/api';
import { useLanguage } from '../../context/LanguageContext';
import BoldCheckout from '../ui/BoldCheckout';
import { createPrivateBooking, getStagingTestTour, getBookingStatus } from '../../services/nevado-api';
import { toast } from 'sonner';

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
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
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
                        document: parsed.document || '',
                        pax: parsed.pax || 1
                    }));

                    if (parsed.mode) setMode(parsed.mode);
                    if (parsed.selectedDate) setSelectedDate(new Date(parsed.selectedDate));
                    if (parsed.selectedDeparture) setSelectedDeparture(parsed.selectedDeparture);
                    if (parsed.realBookingId) setRealBookingId(parsed.realBookingId);
                    
                } catch (e) {
                    console.error("Error loading form draft", e);
                }
            }
        }
    }, []);

    useEffect(() => {
        // Save data when fields change (Debounced slightly by React batching)
        if (formData.name || formData.email || formData.phone || formData.document || selectedDate || selectedDeparture || realBookingId) {
            const draft = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                document: formData.document,
                pax: formData.pax,
                mode: mode,
                selectedDate: selectedDate?.toISOString(),
                selectedDeparture: selectedDeparture,
                realBookingId: realBookingId
            };
            localStorage.setItem('nevado_user_draft', JSON.stringify(draft));
        }
    }, [formData.name, formData.email, formData.phone, formData.document, formData.pax, mode, selectedDate, selectedDeparture, realBookingId]);

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
                setPaymentSuccess(true);
                setPaymentRef(data.paymentRef || realBookingId); 
                toast.dismiss('payment-status-stack');
                
                // Show success toast stack with emerald background (Persistent) - Desktop Only
                if (window.innerWidth >= 768) {
                    toast.custom((_toast) => (
                        <div className="flex flex-col gap-3 min-w-[360px] animate-in fade-in slide-in-from-right-5">
                            {/* Primary Success Card */}
                            <div className="bg-[#10B981] text-white px-5 py-4 rounded-lg shadow-2xl border-t border-white/20 flex items-center gap-4">
                                <div className="shrink-0">
                                    <div className="w-[59px] h-10 bg-white/10 rounded border border-white/10 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white/80" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white mb-0.5 tracking-tight uppercase">{t.booking_modal.success.payment_approved}</p>
                                    <p className="text-[11px] text-emerald-50 leading-tight font-medium">{t.booking_modal.success.booking_confirmed}</p>
                                </div>
                            </div>

                            {/* Contact Info Card */}
                            <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-4 rounded-lg shadow-2xl border border-white/10 flex items-center gap-4">
                                <div className="shrink-0">
                                    <div className="w-[59px] h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-white/40" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white leading-tight">Próximos Pasos</p>
                                    <p className="text-[11px] text-emerald-100/60 leading-relaxed font-medium mt-0.5">
                                        {t.booking_modal.success.success_contact}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ), { id: 'success-toast-stack', duration: Infinity });
                }
            } else if (data.paymentStatus === 'rejected') {
                // Handle failed payment
                setIsWaitingForPayment(false);
                setPaymentError("El pago fue rechazado por el banco. Intenta con otro medio de pago.");
                toast.dismiss('payment-status-stack');
                toast.error('Pago Rechazado', { description: 'La transacción no fue aprobada por el banco.' });
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
                console.log("BookingModal - Payment Success Redirect detected"); // DEBUG
                setStep(2);
                setIsWaitingForPayment(true);
                setPaymentSuccess(true);
                setPaymentRef(ref);
                
                // Show success toast stack with emerald background (Persistent) - Desktop Only
                if (window.innerWidth >= 768) {
                    toast.custom((_toast) => (
                        <div className="flex flex-col gap-3 min-w-[360px] animate-in fade-in slide-in-from-right-5">
                            {/* Primary Success Card */}
                            <div className="bg-[#10B981] text-white px-5 py-4 rounded-lg shadow-2xl border-t border-white/20 flex items-center gap-4">
                                <div className="shrink-0">
                                    <div className="w-[59px] h-10 bg-white/10 rounded border border-white/10 flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white/80" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white mb-0.5 tracking-tight uppercase">{t.booking_modal.success.payment_approved}</p>
                                    <p className="text-[11px] text-emerald-50 leading-tight font-medium">{t.booking_modal.success.booking_confirmed}</p>
                                </div>
                            </div>

                            {/* Contact Info Card */}
                            <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-4 rounded-lg shadow-2xl border border-white/10 flex items-center gap-4">
                                <div className="shrink-0">
                                    <div className="w-[59px] h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-white/40" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white leading-tight">Próximos Pasos</p>
                                    <p className="text-[11px] text-emerald-100/60 leading-relaxed font-medium mt-0.5">
                                        {t.booking_modal.success.success_contact}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ), { id: 'success-toast-stack', duration: Infinity });
                }

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
            toast.error("Ventana Bloqueada", { description: "Habilita los popups para continuar con el pago." });
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
                // Only show floating toast stack on Desktop
                if (window.innerWidth >= 768) {
                    toast.custom((_toast) => (
                        <div className="flex flex-col gap-3 min-w-[360px] animate-in fade-in slide-in-from-top-2">
                            {/* Primary Status Card */}
                            <div className="bg-[#1E40AF] text-white px-5 py-4 rounded-lg shadow-2xl border-t border-white/20 flex items-center gap-4">
                                <div className="shrink-0">
                                    <div className="w-[59px] h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center shadow-inner">
                                        <img 
                                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA1OSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjA3NDEgMTMuNTY2NEgzMi4zNDlDMzIuMDA1OCAxNy4xNzAxIDI4LjkzNjUgMTkuOTk5NCAyNS4yMTA5IDE5Ljk5OTRDMjEuNDg1NCAxOS45OTk0IDE4LjQxNjcgMTcuMTcwMSAxOC4wNzM1IDEzLjU2NjRIMTguMDc0MVpNNy44ODk2NyA1LjgyNDVWMTkuOTY3NEMxMS41MjUyIDE5LjYyNzMgMTQuMzgxNyAxNi41ODU5IDE0LjM4MTcgMTIuODk1N0MxNC4zODE3IDkuMjA1NDMgMTEuNTI1MiA2LjE2NTIgNy44ODk2NyA1LjgyNTA5VjUuODI0NVpNMjUuMjExNSA1Ljc5MjVDMjEuNDg2NiA1Ljc5MjUgMTguNDE3MyA4LjYyMjk4IDE4LjA3NDEgMTIuMjI2N0gzMi4zNDlDMzIuMDA1OCA4LjYyMjk4IDI4LjkzNjUgNS43OTI1IDI1LjIxMDkgNS43OTI1SDI1LjIxMTVaTTAuNjc5Njg4IDEwLjk1NDZWMjBINi40OTQzM1YwSDAuNjc5Njg4VjEwLjk1NDZaTTUyLjUwNTcgMFYxOS45OTk0SDU4LjMyMDNWMEg1Mi41MDU3Wk00NC42NTk5IDEyLjg5NjJDNDQuNjU5OSAxMy4zNDU0IDQ0LjcwNDEgMTMuNzgzOCA0NC43ODUgMTQuMjA5OUM0NS4zNjg4IDE3LjI4NTEgNDcuOTU4OCAxOS42NjgyIDUxLjE1MjYgMTkuOTY2OFY1LjgyNDVDNDcuNTE3MSA2LjE2NDYgNDQuNjYwNSA5LjIwNjAyIDQ0LjY2MDUgMTIuODk2Mkg0NC42NTk5Wk0zNS4yODk2IDE5Ljk5OTRINDEuMTA0MlYwSDM1LjI4OTZWMTkuOTk5NFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==" 
                                            alt="Bold" 
                                            className="h-2.5 w-auto"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white mb-0.5 tracking-tight uppercase">{t.booking_modal.waiting.syncing_bank}</h4>
                                    <p className="text-[11px] text-blue-50 leading-tight font-medium opacity-90">
                                        {t.booking_modal.waiting.processing_msg}
                                    </p>
                                    <div className="mt-2.5 w-full h-1 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#EE424E] via-[#8B5CF6] to-[#121E6C] w-1/2 animate-[shimmer_2s_infinite_linear] rounded-full shadow-[0_0_10px_rgba(238,66,78,0.4)]" />
                                    </div>
                                </div>
                            </div>

                            {/* Booking Info Card */}
                            <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-4 rounded-lg shadow-2xl border border-white/10 flex items-center gap-4">
                                <div className="shrink-0">
                                    <div className="w-[59px] h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center">
                                        <FileCheck className="w-5 h-5 text-white/40" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white leading-tight">Detalles de Reserva</p>
                                    <p className="text-[11px] text-blue-100/60 leading-relaxed font-medium mt-0.5">
                                        {t.booking_modal.waiting.booking_created} <span className="font-mono text-blue-300">{bookingIdToUse}</span>. {t.booking_modal.waiting.dont_close}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ), { id: 'payment-status-stack', duration: Infinity });
                }
            } else {
                throw new Error("No se pudo generar el ID de reserva.");
            }

        } catch (error) {
            console.error("Payment Start Error:", error);
            bridgeWindow.close(); // Close the dead tab
            const msg = error instanceof Error ? error.message : "Error al iniciar el pago.";
            setPaymentError(msg);
            toast.error('Error al iniciar', { description: msg });
        } finally {
            setIsCreatingBooking(false);
        }
    };

    const handleClose = () => {
        const isMobile = window.innerWidth < 768;
        gsap.to(modalRef.current, { autoAlpha: 0, y: isMobile ? '100vh' : 10, duration: 0.3, ease: "power2.in", onComplete: onClose });
        setTimeout(() => {
            // Clean up booking data from draft if successful, but keep user info
            if (paymentSuccess && typeof window !== 'undefined') {
                const savedData = localStorage.getItem('nevado_user_draft');
                if (savedData) {
                    try {
                        const parsed = JSON.parse(savedData);
                        const cleanDraft = {
                            name: parsed.name,
                            email: parsed.email,
                            phone: parsed.phone,
                            document: parsed.document
                        };
                        localStorage.setItem('nevado_user_draft', JSON.stringify(cleanDraft));
                    } catch (e) { console.error(e); }
                }
            }

            setStep(0); setSelectedDeparture(null); setSelectedDate(null); setMode('public');
            setRealBookingId(null);
            setPaymentRef(null);
            setPaymentSuccess(false);
            setIsWaitingForPayment(false); // Reset waiting state
            toast.dismiss('payment-status-stack');
            toast.dismiss('success-toast-stack');
        }, 300);
    };

    const formatMoney = (amount: number) => {
        const val = new Intl.NumberFormat(lang === 'ES' ? 'es-CO' : 'en-US', { 
            style: 'decimal', 
            maximumFractionDigits: 0 
        }).format(amount);
        return `$ ${val} COP`;
    };

    const getFormattedDate = () => {
        try {
            // Case 1: Public Departure
            if (mode === 'public' && selectedDeparture) {
                const seconds = selectedDeparture.date?._seconds;
                if (seconds) {
                    return new Date(seconds * 1000).toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                }
            }
            // Case 2: Private Selected Date
            if (selectedDate) {
                return selectedDate.toLocaleDateString(lang === 'ES' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            }
        } catch (e) {
            console.error("Error formatting date:", e);
        }
        return '---';
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
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-slate-900/20 dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900/80 via-black/90 to-black/95 backdrop-blur-3xl p-0 md:py-0 md:px-8 lg:px-12 xl:px-24 transform-gpu will-change-transform">
            <div ref={modalRef} className="w-full h-[96vh] md:h-[94vh] max-w-7xl bg-[#F8FAFC] dark:bg-[#040918] rounded-t-[8px] md:rounded-2xl overflow-hidden flex flex-col md:flex-row border-none md:border border-border shadow-2xl relative px-0 ring-1 ring-black/5 dark:ring-white/10 transform-gpu will-change-transform">
                
                {/* LEFT PANE */}
                <div className={`hidden md:flex w-[32%] bg-[#F1F5F9] dark:bg-[#020617] border-r border-border flex-col relative overflow-hidden shrink-0 ${isWaitingForPayment ? 'p-0' : 'p-8 lg:p-10'}`}>
                    {/* Background Image for Waiting State */}
                    {isWaitingForPayment && (
                        <div className="absolute inset-0 z-0 animate-in fade-in duration-1000">
                            <img 
                                src={effectiveTour?.images?.[0] || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"} 
                                alt={effectiveTour?.name?.[l] || "Tour Atmosphere"} 
                                className="w-full h-full object-cover opacity-90"
                            />
                            {/* Sophisticated Vignette / Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
                        </div>
                    )}

                    <div className={`relative z-10 flex flex-col h-full ${isWaitingForPayment ? 'p-8 lg:p-10' : ''}`}>
                        <div className="space-y-2 mb-10">
                            <h1 className={`text-[10px] font-bold uppercase tracking-[0.4em] ${isWaitingForPayment ? 'text-white/60' : 'text-muted'}`}>{t.booking_modal.step_label}</h1>
                            <h2 className={`text-2xl lg:text-3xl font-bold leading-tight tracking-tight ${isWaitingForPayment ? 'text-white' : 'text-foreground'}`}>{effectiveTour.name[l]}</h2>
                        </div>
                        
                        {!isWaitingForPayment && (
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

                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-10 lg:p-12 transform-gpu will-change-transform" ref={contentRef}>
                                            <div className="w-full">
                                                
                                                {/* === WAITING FOR PAYMENT STATE (Step 2.5) === */}
                                                {isWaitingForPayment && step === 2 ? (
                                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-start w-full max-w-xl pt-2 pb-4">
                                                        
                                                        {/* Header Section: Status & Icon (Flex Layout) */}
                                                        <div className="w-full space-y-4">
                                                            <div className="flex items-center gap-5">
                                                                {/* Hero Icon */}
                                                                <div className="relative w-16 h-16 shrink-0">
                                                                    <div className={`absolute inset-0 ${paymentSuccess ? 'bg-emerald-500/20' : 'bg-orange-500/10'} rounded-full animate-pulse blur-xl`} />
                                                                    <div className="relative w-full h-full bg-white/40 dark:bg-surface/40 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full flex items-center justify-center shadow-xl transition-all duration-700">
                                                                        {paymentSuccess ? (
                                                                            <CheckCircle className="w-7 h-7 text-emerald-400 animate-in zoom-in duration-500" />
                                                                        ) : (
                                                                            <Info className="w-6 h-6 text-orange-400" />
                                                                        )}
                                                                        
                                                                        {!paymentSuccess && (
                                                                            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#1E40AF] rounded-full border-2 border-background flex items-center justify-center shadow-lg">
                                                                                <RefreshCw className="w-3 h-3 text-white animate-spin-slow" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1 text-left">
                                                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight transition-all duration-700">
                                                                        {paymentSuccess ? (lang === 'ES' ? '¡Reserva Confirmada!' : 'Booking Confirmed!') : (lang === 'ES' ? 'Reserva Recibida' : 'Booking Received')}
                                                                    </h3>
                                                                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-700 ${paymentSuccess ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                                        {paymentSuccess ? (lang === 'ES' ? 'Todo listo para la montaña' : 'Ready for the mountain') : (lang === 'ES' ? 'Pago Pendiente' : 'Payment Pending')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                                
                                                            <div className="flex items-center pl-1 h-4">
                                                                {!paymentSuccess ? (
                                                                    <a 
                                                                        href={`/payment-bridge?bookingId=${realBookingId}`} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex text-[10px] text-muted hover:text-cyan-400 underline underline-offset-4 decoration-muted/30 hover:decoration-cyan-400/50 transition-all items-center gap-1.5"
                                                                    >
                                                                        <span>¿Se cerró la pestaña de pago?</span>
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </a>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 text-emerald-500/60 animate-in fade-in slide-in-from-left-2 duration-1000">
                                                                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Transacción Exitosa</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Mobile Embedded Status Notifications (Visible only on < 768px) - Positioned below Link */}
                                                        <div className="flex md:hidden flex-col gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                            {paymentSuccess ? (
                                                                <>
                                                                    {/* Primary Success Card (Mobile) */}
                                                                    <div className="bg-[#10B981] text-white px-5 py-4 rounded-lg shadow-2xl border-t border-white/20 flex items-center gap-4 w-full">
                                                                        <div className="shrink-0">
                                                                            <div className="w-[59px] h-10 bg-white/10 rounded border border-white/10 flex items-center justify-center">
                                                                                <CheckCircle className="w-5 h-5 text-white/80" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1 text-left">
                                                                            <p className="text-sm font-bold text-white mb-0.5 tracking-tight uppercase">{t.booking_modal.success.payment_approved}</p>
                                                                            <p className="text-[11px] text-emerald-50 leading-tight font-medium">{t.booking_modal.success.booking_confirmed}</p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Contact Info Card (Mobile) */}
                                                                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-4 rounded-lg shadow-2xl border border-white/10 flex items-center gap-4 w-full">
                                                                        <div className="shrink-0">
                                                                            <div className="w-[59px] h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center">
                                                                                <MessageCircle className="w-5 h-5 text-white/40" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1 text-left">
                                                                            <p className="text-sm font-bold text-white leading-tight">Próximos Pasos</p>
                                                                            <p className="text-[11px] text-emerald-100/60 leading-relaxed font-medium mt-0.5">
                                                                                {t.booking_modal.success.success_contact}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {/* Primary Waiting Card (Mobile) */}
                                                                    <div className="bg-[#1E40AF] text-white px-5 py-4 rounded-lg shadow-2xl border-t border-white/20 flex items-center gap-4 w-full">
                                                                        <div className="shrink-0">
                                                                            <div className="w-[59px] h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center shadow-inner">
                                                                                <img 
                                                                                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA1OSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4LjA3NDEgMTMuNTY2NEgzMi4zNDlDMzIuMDA1OCAxNy4xNzAxIDI4LjkzNjUgMTkuOTk5NCAyNS4yMTA5IDE5Ljk5OTRDMjEuNDg1NCAxOS45OTk0IDE4LjQxNjcgMTcuMTcwMSAxOC4wNzM1IDEzLjU2NjRIMTguMDc0MVpNNy44ODk2NyA1LjgyNDVWMTkuOTY3NEMxMS41MjUyIDE5LjYyNzMgMTQuMzgxNyAxNi41ODU5IDE0LjM4MTcgMTIuODk1N0MxNC4zODE3IDkuMjA1NDMgMTEuNTI1MiA2LjE2NTIgNy44ODk2NyA1LjgyNTA5VjUuODI0NVpNMjUuMjExNSA1Ljc5MjVDMjEuNDg2NiA1Ljc5MjUgMTguNDE3MyA4LjYyMjk4IDE4LjA3NDEgMTIuMjI2N0gzMi4zNDlDMzIuMDA1OCA4LjYyMjk4IDI4LjkzNjUgNS43OTI1IDI1LjIxMDkgNS43OTI1SDI1LjIxMTVaTTAuNjc5Njg4IDEwLjk1NDZWMjBINi40OTQzM1YwSDAuNjc5Njg4VjEwLjk1NDZaTTUyLjUwNTcgMFYxOS45OTk0SDU4LjMyMDNWMEg1Mi41MDU3Wk00NC42NTk5IDEyLjg5NjJDNDQuNjU5OSAxMy4zNDU0IDQ0LjcwNDEgMTMuNzgzOCA0NC43ODUgMTQuMjA5OUM0NS4zNjg4IDE3LjI4NTEgNDcuOTU4OCAxOS42NjgyIDUxLjE1MjYgMTkuOTY2OFY1LjgyNDVDNDcuNTE3MSA2LjE2NDYgNDQuNjYwNSA5LjIwNjAyIDQ0LjY2MDUgMTIuODk2Mkg0NC42NTk5Wk0zNS4yODk2IDE5Ljk5OTRINDEuMTA0MlYwSDM1LjI4OTZWMTkuOTk5NFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==" 
                                                                                    alt="Bold" 
                                                                                    className="h-2.5 w-auto"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1 text-left">
                                                                            <h4 className="text-sm font-bold text-white mb-0.5 tracking-tight uppercase">{t.booking_modal.waiting.syncing_bank}</h4>
                                                                            <p className="text-[11px] text-blue-50 leading-tight font-medium opacity-90">
                                                                                {t.booking_modal.waiting.processing_msg}
                                                                            </p>
                                                                            <div className="mt-2.5 w-full h-1 bg-black/20 rounded-full overflow-hidden">
                                                                                <div className="h-full bg-gradient-to-r from-[#EE424E] via-[#8B5CF6] to-[#121E6C] w-1/2 animate-[shimmer_2s_infinite_linear] rounded-full shadow-[0_0_10px_rgba(238,66,78,0.4)]" />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Booking Detail Card (Mobile) */}
                                                                    <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-4 rounded-lg shadow-2xl border border-white/10 flex items-center gap-4 w-full">
                                                                        <div className="shrink-0">
                                                                            <div className="w-[59px] h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center">
                                                                                <FileCheck className="w-5 h-5 text-white/40" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-1 text-left">
                                                                            <p className="text-sm font-bold text-white leading-tight">Detalles de Reserva</p>
                                                                            <p className="text-[11px] text-blue-200/60 leading-relaxed font-medium mt-0.5">
                                                                                {t.booking_modal.waiting.booking_created} <span className="font-mono text-blue-300">{realBookingId}</span>. {t.booking_modal.waiting.dont_close}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="bg-white/40 dark:bg-surface/30 bg-gradient-to-br from-white/80 via-blue-50/20 to-indigo-50/30 dark:bg-none backdrop-blur-md border border-slate-200/60 dark:border-white/5 rounded-[6px] md:rounded-xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative w-full group transition-all duration-700">
                                                            {/* Ultra-subtle Aurora Tint Overlay */}
                                                            <div className={`absolute inset-0 bg-gradient-to-br ${paymentSuccess ? 'from-emerald-500/[0.05]' : 'from-orange-500/[0.03]'} via-transparent to-indigo-500/[0.03] pointer-events-none transition-all duration-700`} />
                                                            
                                                            {/* Header: Trip Details */}
                                                            <div className="p-3 md:p-8 space-y-6">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="space-y-1">
                                                                        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">{t.booking_modal.confirmation.responsible}</span>
                                                                        <p className="text-lg font-medium text-foreground">{formData.name || t.booking_modal.confirmation.guest}</p>
                                                                    </div>
                                                                    <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                                                                        <User className="w-4 h-4 text-muted" />
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                                                    <div className="space-y-1">
                                                                        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">{t.booking_modal.confirmation.start_date}</span>
                                                                        <div className="flex items-center gap-2 text-foreground/90">
                                                                            <CalendarIcon className="w-3.5 h-3.5 opacity-50" />
                                                                            <span className="text-sm font-medium">
                                                                                {getFormattedDate()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1 text-right">
                                                                        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">{t.booking_modal.confirmation.travelers}</span>
                                                                        <div className="flex items-center justify-end gap-2 text-foreground/90">
                                                                            <Users className="w-3.5 h-3.5 opacity-50" />
                                                                            <span className="text-sm font-medium">{formData.pax} {formData.pax === 1 ? t.booking_modal.confirmation.pax_singular : t.booking_modal.confirmation.pax_plural}</span>
                                                                        </div>
                                                                    </div>                                                                </div>
                                                            </div>

                                                            {/* Digital Perforation Detail */}
                                                            <div className="relative flex items-center px-4 h-5">
                                                                <div className="absolute -left-2.5 w-5 h-5 rounded-full bg-[#F8FAFC] dark:bg-[#040918] border border-black/5 dark:border-white/5 shadow-inner z-10" />
                                                                <div className="flex-1 border-t border-dashed border-black/10 dark:border-white/10" />
                                                                <div className="absolute -right-2.5 w-5 h-5 rounded-full bg-[#F8FAFC] dark:bg-[#040918] border border-black/5 dark:border-white/5 shadow-inner z-10" />
                                                            </div>

                                                            {/* Footer: Financial Breakdown (Unified) */}
                                                            <div className="p-3 md:p-8 space-y-5">
                                                                {/* Summary Lines */}
                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <div className="flex items-center gap-1.5 group/tooltip relative">
                                                                            <span className="text-muted">{t.booking_modal.confirmation.total_investment}</span>
                                                                            <Info className="w-3 h-3 text-muted/40 cursor-help hover:text-cyan-500 transition-colors" />
                                                                            
                                                                            <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg text-[10px] leading-relaxed text-white font-medium shadow-xl opacity-0 translate-y-1 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all z-50">
                                                                                {t.booking_modal.confirmation.tooltip_total}
                                                                                <div className="absolute top-full left-4 -translate-y-px border-8 border-transparent border-t-slate-900/95"></div>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-foreground font-bold font-mono">{formatMoney(getPrice() * formData.pax)}</span>
                                                                    </div>

                                                                    <div className="h-px w-full bg-black/5 dark:bg-white/10" />

                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-muted">{t.booking_modal.confirmation.deposit_label}</span>
                                                                        <span className="text-foreground font-bold font-mono">{formatMoney((getPrice() * formData.pax) * 0.3)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-sm">
                                                                        <span className="text-muted">{t.booking_modal.confirmation.tax_label}</span>
                                                                        <span className="text-foreground font-bold font-mono">{formatMoney(((getPrice() * formData.pax) * 0.3) * 0.05)}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="h-px w-full bg-black/5 dark:bg-white/5" />

                                                                {/* Actionable Amount */}
                                                                <div className="flex justify-between items-end">
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex items-center gap-1.5 group/tooltip relative">
                                                                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-700 ${paymentSuccess ? 'text-emerald-400' : 'text-emerald-400'}`}>
                                                                                {paymentSuccess ? (lang === 'ES' ? 'Pagado con éxito' : 'Successfully Paid') : t.booking_modal.confirmation.pay_now}
                                                                            </span>
                                                                            <Info className={`w-3 h-3 cursor-help transition-colors duration-700 ${paymentSuccess ? 'text-emerald-400/40' : 'text-emerald-400/40'} hover:text-emerald-400`} />
                                                                            
                                                                            <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg text-[10px] leading-relaxed text-white font-medium shadow-xl opacity-0 translate-y-1 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all z-50">
                                                                                {t.booking_modal.confirmation.tooltip_pay_now}
                                                                                <div className="absolute top-full left-4 -translate-y-px border-8 border-transparent border-t-slate-900/95"></div>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-[10px] font-mono text-white/30">{paymentRef || realBookingId || '...'}</p>
                                                                    </div>
                                                                    <span className={`text-xl md:text-3xl font-bold font-mono tracking-tighter leading-none transition-all duration-700 ${paymentSuccess ? 'text-emerald-400' : 'text-emerald-400'}`}>
                                                                        {formatMoney(((getPrice() * formData.pax) * 0.3) * 1.05)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons Section */}
                                                        <div className="space-y-4 w-full">
                                                            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full">
                                                                {paymentSuccess ? (
                                                                    <button 
                                                                        onClick={handleClose}
                                                                        className="h-12 min-h-[48px] px-10 w-auto bg-foreground text-background rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                                                                    >
                                                                        <CheckCircle className="w-4 h-4" />
                                                                        <span>{lang === 'ES' ? 'VOLVER AL TOUR' : 'BACK TO TOUR'}</span>
                                                                    </button>
                                                                ) : (
                                                                    <>
                                                                        <a 
                                                                            href="https://wa.me/573103953530?text=Hola,%20tengo%20dudas%20con%20mi%20pago%20de%20la%20reserva..."
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="h-12 min-h-[48px] flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                                                                        >
                                                                            <MessageCircle className="w-4 h-4" />
                                                                            <span>{t.booking_modal.waiting.help_whatsapp}</span>
                                                                        </a>

                                                                        <button 
                                                                            onClick={() => checkPaymentStatus(true)}
                                                                            disabled={isCheckingStatus}
                                                                            className="h-12 min-h-[48px] flex-1 bg-transparent border border-border hover:bg-surface text-foreground rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                                                        >
                                                                            {isCheckingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                                                            {isCheckingStatus ? t.booking_modal.waiting.verifying : t.booking_modal.waiting.verify_payment}
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                            
                                                            {!paymentSuccess && (
                                                                <div className="flex justify-start">
                                                                    <button 
                                                                        onClick={() => setIsWaitingForPayment(false)}
                                                                        className="text-[10px] text-muted hover:text-foreground underline underline-offset-4 decoration-muted/30 hover:decoration-foreground transition-all"
                                                                    >
                                                                        {t.booking_modal.waiting.cancel_wait}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
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
                                                {(lang === 'ES' ? ['L','M','X','J','V','S','D'] : ['M','T','W','T','F','S','S']).map((d, idx) => <div key={`${d}-${idx}`} className="w-10 h-10 flex items-center justify-center text-[10px] font-bold text-muted/40 uppercase tracking-widest">{d}</div>)}
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

                            {/* STEP 2: REFINED DIGITAL LEDGER (Standard View) */}
                            {step === 2 && !isWaitingForPayment && (
                                <div className="space-y-8 animate-in fade-in duration-700 max-w-xl w-full flex flex-col items-start">
                                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{t.booking_modal.confirmation.title}</h3>
                                    
                                    <div className="bg-white/40 dark:bg-surface/30 bg-gradient-to-br from-white/80 via-blue-50/20 to-indigo-50/30 dark:bg-none backdrop-blur-md border border-slate-200/60 dark:border-white/5 rounded-[6px] md:rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative w-full group">
                                        {/* Ultra-subtle Aurora Tint Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-indigo-500/[0.03] pointer-events-none" />
                                        
                                        {/* Header: Trip Details */}
                                        <div className="p-3 md:p-8 space-y-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] uppercase tracking-widest text-muted font-bold">{t.booking_modal.confirmation.responsible}</span>
                                                    <p className="text-lg font-medium text-foreground">{formData.name || t.booking_modal.confirmation.guest}</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-muted" />
                                                </div>
                                            </div>

                                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">{t.booking_modal.confirmation.start_date}</span>
                                                        <div className="flex items-center gap-2 text-foreground/90">
                                                            <CalendarIcon className="w-3.5 h-3.5 opacity-50" />
                                                            <span className="text-sm font-medium">
                                                                {getFormattedDate()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 text-right">
                                                        <span className="text-[10px] uppercase tracking-widest text-muted font-bold">{t.booking_modal.confirmation.travelers}</span>
                                                        <div className="flex items-center justify-end gap-2 text-foreground/90">
                                                            <Users className="w-3.5 h-3.5 opacity-50" />
                                                            <span className="text-sm font-medium">{formData.pax} {formData.pax === 1 ? t.booking_modal.confirmation.pax_singular : t.booking_modal.confirmation.pax_plural}</span>
                                                        </div>
                                                    </div>                                            </div>
                                        </div>

                                        {/* Digital Perforation Detail */}
                                        <div className="relative flex items-center px-4 h-5">
                                            <div className="absolute -left-2.5 w-5 h-5 rounded-full bg-[#F8FAFC] dark:bg-[#040918] border border-black/5 dark:border-white/5 shadow-inner z-10" />
                                            <div className="flex-1 border-t border-dashed border-black/10 dark:border-white/10" />
                                            <div className="absolute -right-2.5 w-5 h-5 rounded-full bg-[#F8FAFC] dark:bg-[#040918] border border-black/5 dark:border-white/5 shadow-inner z-10" />
                                        </div>

                                        {/* Footer: Financial Breakdown (Unified) */}
                                        <div className="p-3 md:p-8 space-y-5">
                                            {/* Summary Lines */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-1.5 group/tooltip relative">
                                                        <span className="text-muted">{t.booking_modal.confirmation.total_investment}</span>
                                                        <Info className="w-3 h-3 text-muted/40 cursor-help hover:text-cyan-500 transition-colors" />
                                                        
                                                        {/* Tooltip Card */}
                                                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg text-[10px] leading-relaxed text-white font-medium shadow-xl opacity-0 translate-y-1 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all z-50">
                                                            {t.booking_modal.confirmation.tooltip_total}
                                                            <div className="absolute top-full left-4 -translate-y-px border-8 border-transparent border-t-slate-900/95"></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-foreground font-bold font-mono">{formatMoney(getPrice() * formData.pax)}</span>
                                                </div>

                                                <div className="h-px w-full bg-black/5 dark:bg-white/10" />

                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted">{t.booking_modal.confirmation.deposit_label}</span>
                                                    <span className="text-foreground font-bold font-mono">{formatMoney((getPrice() * formData.pax) * 0.3)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted">{t.booking_modal.confirmation.tax_label}</span>
                                                    <span className="text-foreground font-bold font-mono">{formatMoney(((getPrice() * formData.pax) * 0.3) * 0.05)}</span>
                                                </div>
                                            </div>

                                            <div className="h-px w-full bg-black/5 dark:bg-white/5" />

                                            {/* Actionable Amount */}
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 group/tooltip relative">
                                                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{t.booking_modal.confirmation.pay_now}</span>
                                                        <Info className="w-3 h-3 text-emerald-400/40 cursor-help hover:text-emerald-400 transition-colors" />
                                                        
                                                        {/* Tooltip Card */}
                                                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg text-[10px] leading-relaxed text-white font-medium shadow-xl opacity-0 translate-y-1 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all z-50">
                                                            {t.booking_modal.confirmation.tooltip_pay_now}
                                                            <div className="absolute top-full left-4 -translate-y-px border-8 border-transparent border-t-slate-900/95"></div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-muted">{t.booking_modal.confirmation.immediate_confirmation}</span>
                                                </div>
                                                <span className="text-xl md:text-3xl font-bold text-emerald-400 font-mono tracking-tight">
                                                    {formatMoney(((getPrice() * formData.pax) * 0.3) * 1.05)}
                                                </span>
                                            </div>
                                        </div>
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
                                        <h3 className="text-3xl font-bold text-foreground tracking-tight">{t.booking_modal.success.title}</h3>
                                        <p className="text-muted text-sm max-w-xs mx-auto leading-relaxed">
                                            {t.booking_modal.success.message}
                                        </p>
                                    </div>

                                    <div className="bg-surface/50 border border-border rounded-xl p-6 w-full max-w-sm mt-4 backdrop-blur-sm">
                                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">{t.booking_modal.success.transaction_ref}</p>
                                        <p className="text-lg font-mono font-bold text-foreground tracking-tight">{paymentRef || 'N/A'}</p>
                                    </div>

                                    <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
                                        <button 
                                            onClick={handleClose} 
                                            className="h-12 w-full bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                                        >
                                            {t.booking_modal.success.back_to_tour}
                                        </button>
                                        <p className="text-[10px] text-muted/60 text-center">
                                            {t.booking_modal.success.need_help} <span className="underline hover:text-foreground cursor-pointer">{t.booking_modal.success.contact_us}</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                                </>
                            )}
                        </div>
                    </div>

                    {!isWaitingForPayment && (
                        <div className="h-16 md:h-20 px-frame md:px-10 flex items-center justify-between shrink-0 z-20 bg-transparent border-t border-border">
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
                                        className="h-12 w-full bg-foreground text-background rounded-full font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:scale-100"
                                    >
                                        {isCreatingBooking ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>{t.booking_modal.footer.processing}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t.booking_modal.footer.pay_action}</span>
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
                                    {isCreatingBooking ? t.booking_modal.footer.processing : t.booking_modal.footer.continue}
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

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(400%); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes drop {
                    0% { top: -50%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }

                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { initBoldPayment, BoldPaymentData } from '../../services/nevado-api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function BoldCheckout({ bookingId }: { bookingId: string }) {
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadBoldButton() {
            if (!bookingId) return;

            try {
                setStatus('loading');
                setErrorMsg(null);

                const data: BoldPaymentData = await initBoldPayment(bookingId);
                
                if (!isMounted) return;
                
                console.log("Bold Payload Ready:", data.paymentReference);

                if (containerRef.current) {
                    containerRef.current.innerHTML = '';

                    const script = document.createElement('script');
                    script.src = "https://checkout.bold.co/library/boldPaymentButton.js";
                    script.async = true;

                    script.setAttribute('data-bold-button', 'true');
                    script.setAttribute('data-api-key', data.apiKey);
                    script.setAttribute('data-amount', data.amount.toString());
                    script.setAttribute('data-currency', data.currency);
                    script.setAttribute('data-order-id', data.paymentReference);
                    script.setAttribute('data-reference', data.paymentReference);
                    script.setAttribute('data-integrity-signature', data.integritySignature);
                    script.setAttribute('data-description', data.description);
                    script.setAttribute('data-redirection-url', data.redirectionUrl);
                    script.setAttribute('data-style-label', 'PAGAR AHORA');

                    containerRef.current.appendChild(script);
                    setStatus('ready');
                }

            } catch (err: any) {
                if (!isMounted) return;
                console.error("Bold Widget Error:", err);
                setStatus('error');
                setErrorMsg(err.message || "Error cargando pasarela");
            }
        }

        loadBoldButton();

        return () => {
            isMounted = false;
        };
    }, [bookingId]);

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[60px]">
            {status === 'loading' && (
                <div className="flex items-center gap-2 text-muted text-[10px] uppercase tracking-widest animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Conectando Bold...</span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex flex-col items-center gap-2 text-rose-500">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">No se pudo cargar el botón</span>
                    </div>
                    <span className="text-[9px] opacity-70">{errorMsg}</span>
                </div>
            )}

            <div ref={containerRef} className={`transition-all duration-500 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}></div>

            <style jsx global>{`
                .bold-payment-button {
                    background-color: #000000 !important;
                    color: #ffffff !important;
                    font-family: inherit !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.2em !important;
                    border-radius: 9999px !important;
                    padding: 14px 32px !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    font-size: 10px !important;
                    width: 100% !important;
                    min-width: 200px !important;
                    height: 48px !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    display: block !important;
                    margin: 0 auto !important;
                }
                .bold-payment-button:hover {
                    background-color: #1a1a1a !important;
                    transform: scale(1.02) !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
                }
            `}</style>
        </div>
    );
}
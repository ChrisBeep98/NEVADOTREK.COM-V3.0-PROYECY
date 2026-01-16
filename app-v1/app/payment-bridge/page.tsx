'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import BoldCheckout from '../components/ui/BoldCheckout';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { getBookingStatus } from '../services/nevado-api';

function PaymentBridgeContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const [status, setStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');

    useEffect(() => {
        if (!bookingId) {
            setStatus('invalid');
            return;
        }
        // Optional: Verify booking exists/is pending before showing button
        // For speed, we assume valid if ID is present, or let BoldCheckout handle errors.
        setStatus('valid');
    }, [bookingId]);

    if (!bookingId || status === 'invalid') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <h1 className="text-xl font-bold text-slate-900 mb-2">Enlace inválido</h1>
                    <p className="text-slate-500 text-sm">No se encontró la información de la reserva.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                {/* Header */}
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-emerald-400"></div>
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Lock className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight mb-1">Pasarela Segura</h1>
                    <p className="text-slate-400 text-xs uppercase tracking-widest">Nevado Trek</p>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-slate-500">Estás a un paso de tu aventura.</p>
                        <p className="text-xs text-slate-400">Haz clic abajo para completar el pago de forma segura con Bold.</p>
                    </div>

                    <div className="py-4">
                        <BoldCheckout bookingId={bookingId} />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Pagos procesados por Bold</span>
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-[10px] text-slate-400 max-w-xs text-center leading-relaxed">
                Esta ventana se cerrará automáticamente o te redirigirá al finalizar el proceso.
                Puedes volver a la pestaña anterior si deseas cancelar.
            </p>
        </div>
    );
}

export default function PaymentBridgePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        }>
            <PaymentBridgeContent />
        </Suspense>
    );
}

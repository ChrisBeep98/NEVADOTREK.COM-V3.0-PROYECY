'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BoldCheckout from '../components/ui/BoldCheckout';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Componente interno que usa useSearchParams
function PaymentBridgeContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 z-20 relative">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                    <Lock className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Enlace Inválido</h1>
                <p className="text-white/60 mb-8 max-w-md">No se encontró el identificador de la reserva. Por favor cierra esta pestaña e intenta nuevamente desde la página del tour.</p>
                <button onClick={() => window.close()} className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all">
                    Cerrar Pestaña
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md relative z-20 animate-in fade-in zoom-in-95 duration-1000">
            {/* Liquid Glass Card */}
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative group">
                {/* Ambient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10">
                    
                    {/* Header Logos */}
                    <div className="flex items-center gap-6 mb-10 opacity-90">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white tracking-tighter uppercase">Nevado</span>
                        </div>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-white tracking-widest font-sans">BOLD</span>
                        </div>
                    </div>

                    {/* Status Animation */}
                    <div className="relative mb-8">
                        <div className="w-20 h-20 relative flex items-center justify-center">
                            <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-2 border-cyan-500 rounded-full animate-spin-reverse"></div>
                            <ShieldCheck className="w-8 h-8 text-white/80" />
                        </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">Conectando Pasarela Segura</h2>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-xs mx-auto">
                        Estableciendo conexión encriptada de extremo a extremo para tu transacción.
                    </p>

                    {/* Security Badge */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 mb-8">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-white/60 font-mono uppercase tracking-widest">TLS 1.3 ENCRYPTED</span>
                    </div>

                    {/* The Bold Script Container */}
                    <div className="w-full relative min-h-[60px] flex justify-center">
                         {/* This component injects the script and replaces content when ready */}
                        <BoldCheckout bookingId={bookingId} />
                    </div>
                </div>

                {/* Footer Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                    <div className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 w-[200%] animate-gradient-slide" />
                </div>
            </div>

            {/* Bottom Help Link */}
            <div className="mt-8 text-center">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    No cierres esta pestaña hasta finalizar
                </p>
            </div>

            <style jsx global>{`
                @keyframes spin-reverse {
                    to { transform: rotate(-360deg); }
                }
                .animate-spin-reverse {
                    animation: spin-reverse 1.5s linear infinite;
                }
                @keyframes gradient-slide {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                .animate-gradient-slide {
                    animation: gradient-slide 2s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default function PaymentBridgePage() {
    return (
        <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#02040a]">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-[2px]" />
                <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover opacity-40 scale-105"
                >
                    <source src="https://cdn.prod.website-files.com/68cb38dfbae5b4c56edac13a/68cb38e0bae5b4c56edac1c0_2871918-hd_1920_1080_30fps-transcode.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Suspense Boundary for useSearchParams */}
            <Suspense fallback={
                <div className="z-20 flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span className="text-xs text-white/50 tracking-widest uppercase">Cargando...</span>
                </div>
            }>
                <PaymentBridgeContent />
            </Suspense>
        </main>
    );
}
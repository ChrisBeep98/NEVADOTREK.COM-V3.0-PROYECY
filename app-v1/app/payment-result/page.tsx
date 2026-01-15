'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Bold Query Params
    const status = searchParams.get('bold-tx-status');
    const orderId = searchParams.get('bold-order-id');
    
    const isApproved = status === 'approved';

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
                
                {/* Status Header */}
                <div className={`p-10 flex flex-col items-center justify-center text-center space-y-6 ${isApproved ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${isApproved ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {isApproved ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">
                            {isApproved ? '¡Reserva Confirmada!' : 'El pago no fue exitoso'}
                        </h1>
                        <p className="text-muted text-sm font-medium uppercase tracking-widest">
                            Referencia: <span className="text-foreground font-mono">{orderId || 'N/A'}</span>
                        </p>
                    </div>
                </div>

                {/* Receipt Details */}
                <div className="p-8 space-y-8">
                    {isApproved ? (
                        <div className="space-y-4">
                            <p className="text-center text-muted text-sm leading-relaxed">
                                Tu transacción ha sido aprobada exitosamente. Hemos enviado un correo con los detalles de tu expedición y el itinerario completo.
                            </p>
                            
                            <div className="bg-background border border-border rounded-xl p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-4 h-4 text-cyan-500 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Próximos Pasos</p>
                                        <p className="text-xs text-muted">Nuestro equipo de guías te contactará 48 horas antes de la salida.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <p className="text-muted text-sm">
                                Hubo un problema procesando tu pago. Por favor intenta nuevamente.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="h-12 w-full bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all">
                            Volver al Inicio
                        </Link>
                        
                        {!isApproved && (
                            <button onClick={() => router.back()} className="h-12 w-full bg-surface text-foreground border border-border rounded-full font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center hover:bg-white/5 transition-all">
                                Intentar de Nuevo
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <PaymentResultContent />
        </Suspense>
    );
}
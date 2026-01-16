'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function PaymentResultLogic() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState("Verificando pago...");
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const txStatus = searchParams.get('bold-tx-status');
        const orderId = searchParams.get('bold-order-id');

        // 1. Get the path we saved in BookingModal
        const savedPath = typeof window !== 'undefined' ? localStorage.getItem('lastTourPath') : null;
        console.log("Payment Result - Saved Path:", savedPath, "txStatus:", txStatus, "orderId:", orderId); // DEBUG

        const returnPath = savedPath || '/';

        if (txStatus === 'approved') {
            // Use setTimeout to avoid synchronous setState
            setTimeout(() => {
                setStatus('success');
                setMessage("¡Pago Exitoso! Volviendo a tu aventura...");

                // 2. Build URL with params that BookingModal will read
                const finalUrl = `${returnPath}${returnPath.includes('?') ? '&' : '?'}payment_status=approved&ref=${orderId}`;
                console.log("Payment Result - Final Redirect URL:", finalUrl); // DEBUG

                // 3. Redirect after delay using window.location.href for absolute navigation
                setTimeout(() => {
                    localStorage.removeItem('lastTourPath'); // Clean up
                    window.location.href = finalUrl;
                }, 2500); // 2.5s delay to see the success message
            }, 0);

        } else {
            setTimeout(() => {
                setStatus('error');
                setMessage("El pago no fue completado.");
                console.log("Payment Result - txStatus not approved:", txStatus); // DEBUG
            }, 0);
        }

    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
            
            {status === 'loading' && (
                <div className="w-16 h-16 border-4 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
            )}

            {status === 'success' && (
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
            )}

            {status === 'error' && (
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    <XCircle className="w-10 h-10 text-rose-500" />
                </div>
            )}
            
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-xl font-bold text-foreground tracking-tight">{message}</h2>
                {status === 'error' && (
                    <button onClick={() => router.back()} className="text-xs underline text-muted hover:text-foreground mt-4">
                        Volver a intentar
                    </button>
                )}
            </div>
        </div>
    );
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={null}>
            <PaymentResultLogic />
        </Suspense>
    );
}
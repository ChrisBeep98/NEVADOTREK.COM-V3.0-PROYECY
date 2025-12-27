import React from 'react';
import { Check } from 'lucide-react';

export default function BookingCTA() {
    return (
        <section className="py-32 px-frame relative overflow-hidden bg-slate-950">
            {/* Abstract Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 max-w-xl mx-auto text-center p-10 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
                <h2 className="text-heading-l text-white mb-4">La montaña te llama.</h2>
                <p className="text-body-lead text-slate-400 mb-8">Únete a la lista de espera para la temporada 2025. Plazas extremadamente limitadas.</p>
                
                <form className="flex flex-col gap-4">
                    <div className="relative group">
                        <input type="email" placeholder="tucorreo@ejemplo.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/30 transition-colors" />
                        <div className="absolute inset-0 rounded-lg border border-white/0 group-hover:border-white/10 pointer-events-none transition-colors"></div>
                    </div>
                    
                    <div className="flex gap-3 items-center justify-start mb-2">
                        <div className="relative flex items-center">
                            <input type="checkbox" id="terms" className="peer h-4 w-4 appearance-none rounded border border-slate-700 bg-slate-900 checked:bg-white checked:border-white transition-all cursor-pointer" />
                            <Check className="absolute left-0.5 top-0.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" width={12} />
                        </div>
                        <label htmlFor="terms" className="text-xs text-slate-500 select-none cursor-pointer">Acepto desafiar mis límites.</label>
                    </div>

                    <button type="submit" className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-slate-200 transition-colors text-sm tracking-wide">
                        Solicitar Acceso
                    </button>
                </form>
            </div>
        </section>
    );
}

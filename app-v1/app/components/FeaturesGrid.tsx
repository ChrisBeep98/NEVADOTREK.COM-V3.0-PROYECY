import React from 'react';
import { HeartPulse, ShieldCheck, Tent } from 'lucide-react';

export default function FeaturesGrid() {
    return (
        <section className="py-24 bg-slate-900/30 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white mb-6">Preparación de Elite</h2>
                    <p className="text-slate-400 text-sm md:text-base">No solo guiamos tours. Formamos atletas de montaña. Cada expedición incluye preparación integral.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-2xl border border-white/5 bg-slate-950/50 hover:bg-slate-900 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white mb-6">
                            <HeartPulse width={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Fisiología Avanzada</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Monitoreo biométrico previo al viaje y planes de entrenamiento personalizados para hipoxia.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-2xl border border-white/5 bg-slate-950/50 hover:bg-slate-900 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white mb-6">
                            <ShieldCheck width={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Seguridad Grado Militar</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Protocolos de evacuación satelital y equipo médico de última generación en cada campo base.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-2xl border border-white/5 bg-slate-950/50 hover:bg-slate-900 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white mb-6">
                            <Tent width={20} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Logística Premium</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Campamentos de lujo sostenible. Nutrición gourmet liofilizada. Equipo técnico ultraligero incluido.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

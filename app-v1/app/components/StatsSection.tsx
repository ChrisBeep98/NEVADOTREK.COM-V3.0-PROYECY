import React from 'react';

export default function StatsSection() {
    return (
        <section className="border-y border-white/5 bg-slate-950 py-12 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-1">
                    <span className="text-3xl font-medium text-white tracking-tight">8,848<span className="text-slate-500 text-lg">m</span></span>
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Altitud Máxima</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-3xl font-medium text-white tracking-tight">98<span className="text-slate-500 text-lg">%</span></span>
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Tasa de Éxito</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-3xl font-medium text-white tracking-tight">12<span className="text-slate-500 text-lg">p</span></span>
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Max por Grupo</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-3xl font-medium text-white tracking-tight">04</span>
                    <span className="text-xs text-slate-600 uppercase tracking-wider">Continentes</span>
                </div>
            </div>
        </section>
    );
}

import React from 'react';
import { ArrowUpRight, Calendar, MapPin, Users, Thermometer, Activity } from 'lucide-react';

export default function ExpeditionsGrid() {
    return (
        <section className="py-32 px-6 max-w-7xl mx-auto bg-slate-950">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-white mb-2">Expediciones Selectas</h2>
                    <p className="text-slate-400 text-sm max-w-md">Rutas meticulosamente curadas para aquellos que buscan silencio, desafío y belleza cruda.</p>
                </div>
                <a href="#" className="text-xs font-medium text-white flex items-center gap-1 hover:text-cyan-400 transition-colors pb-1 border-b border-white/20 hover:border-cyan-400">
                    Ver todo el catálogo
                    <ArrowUpRight width={14} strokeWidth={1.5} />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[500px]">
                
                {/* Card 1 */}
                <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Patagonia" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        <span className="px-2 py-1 rounded text-[10px] font-medium bg-white/10 backdrop-blur border border-white/10 text-white">DIFÍCIL</span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-cyan-400 font-mono mb-2 block tracking-widest">01 — PATAGONIA</span>
                        <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">Torres del Silencio</h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            <p className="text-sm text-slate-400 mb-4 pt-2 border-t border-white/10">14 días de travesía técnica a través de glaciares milenarios y agujas de granito.</p>
                            <div className="flex items-center gap-4 text-xs text-slate-300">
                                <span className="flex items-center gap-1"><Calendar width={12} /> Nov - Mar</span>
                                <span className="flex items-center gap-1"><MapPin width={12} /> Chile</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 (Span 2) */}
                <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 md:col-span-2 cursor-pointer">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Himalaya" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        <span className="px-2 py-1 rounded text-[10px] font-medium bg-white/10 backdrop-blur border border-white/10 text-white">EXTREMO</span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-2/3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-blue-400 font-mono mb-2 block tracking-widest">02 — HIMALAYA</span>
                        <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">La Corona de Hielo</h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            <p className="text-sm text-slate-400 mb-4 pt-2 border-t border-white/10">Una ascensión estratégica a 7,000m. Oxígeno suplementario opcional. Solo para veteranos.</p>
                            <div className="flex items-center gap-4 text-xs text-slate-300">
                                <span className="flex items-center gap-1"><Calendar width={12} /> Abr - May</span>
                                <span className="flex items-center gap-1"><Users width={12} /> Max 6</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Alps" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        <span className="px-2 py-1 rounded text-[10px] font-medium bg-white/10 backdrop-blur border border-white/10 text-white">MODERADO</span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-orange-400 font-mono mb-2 block tracking-widest">03 — ALPES</span>
                        <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">La Ruta Haute</h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            <p className="text-sm text-slate-400 mb-4 pt-2 border-t border-white/10">Esquí de travesía desde Chamonix hasta Zermatt. Alojamiento en refugios de altura.</p>
                            <div className="flex items-center gap-4 text-xs text-slate-300">
                                <span className="flex items-center gap-1"><Calendar width={12} /> Feb - Abr</span>
                                <span className="flex items-center gap-1"><Thermometer width={12} /> -15°C</span>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Card 4 */}
                 <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer md:col-span-2">
                    <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&amp;w=1368&amp;auto=format&amp;fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Dolomites" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        <span className="px-2 py-1 rounded text-[10px] font-medium bg-white/10 backdrop-blur border border-white/10 text-white">TÉCNICO</span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-purple-400 font-mono mb-2 block tracking-widest">04 — DOLOMITAS</span>
                        <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">Vertical Limit</h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            <p className="text-sm text-slate-400 mb-4 pt-2 border-t border-white/10">Escalada en roca pura y Vías Ferratas en el corazón de Italia. Vistas que cortan la respiración.</p>
                             <div className="flex items-center gap-4 text-xs text-slate-300">
                                <span className="flex items-center gap-1"><Calendar width={12} /> Jun - Sep</span>
                                <span className="flex items-center gap-1"><Activity width={12} /> Alta Exigencia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

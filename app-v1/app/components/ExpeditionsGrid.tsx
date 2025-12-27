import React from 'react';
import { ArrowUpRight, Calendar, MapPin, Users, Thermometer, Activity } from 'lucide-react';

export default function ExpeditionsGrid() {
    return (
        <section className="bg-slate-950 section-v-spacing">
            <div className="px-frame max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-display-xl text-white mb-4">
                            SELECT <br/>EXPEDITIONS.
                        </h2>
                        <p className="text-body-lead text-slate-400 max-w-md">
                            Rutas meticulosamente curadas para quienes buscan silencio, desafío y belleza pura.
                        </p>
                    </div>
                    <a href="#" className="text-sub-label text-white flex items-center gap-2 hover:text-cyan-400 transition-colors pb-1 border-b border-white/10 hover:border-cyan-400">
                        VER CATÁLOGO COMPLETO
                        <ArrowUpRight width={14} strokeWidth={1.5} />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[500px]">
                    {/* Card 1 */}
                    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer">
                        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Patagonia" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                        <div className="absolute top-6 right-6 z-20">
                            <span className="text-tech-caption px-3 py-1.5 rounded-md bg-white/10 backdrop-blur border border-white/10 text-white">HARD</span>
                        </div>
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="text-sub-label text-cyan-400 mb-3 block">01 // PATAGONIA</span>
                            <h3 className="text-heading-l text-white mb-2">Torres del Silencio</h3>
                            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                                <p className="text-body-std text-slate-400 mb-4 pt-4 border-t border-white/10">Travesía técnica por glaciares antiguos donde el silencio es absoluto.</p>
                                <div className="flex items-center gap-4 text-tech-caption text-slate-300">
                                    <span className="flex items-center gap-1.5"><Calendar width={12} className="text-cyan-500" /> Nov - Mar</span>
                                    <span className="flex items-center gap-1.5"><MapPin width={12} className="text-cyan-500" /> Chile</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ... Resto de tarjetas simplificadas para brevedad ... */}
                    <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 md:col-span-2 cursor-pointer">
                        <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80" alt="Himalaya" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-2/3">
                            <span className="text-sub-label text-blue-400 mb-3 block">02 // HIMALAYA</span>
                            <h3 className="text-heading-l text-white mb-2">La Corona de Hielo</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
import React from 'react';
import { ArrowUpRight, Calendar, MapPin, Users, Thermometer, Activity } from 'lucide-react';

export default function ExpeditionsGrid() {
    return (
        <section className="py-32 px-frame max-w-7xl mx-auto bg-slate-950">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                    {/* TOKEN: DISPLAY XL (Variant) */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[0.9] mb-4">
                        SELECT <br/>EXPEDITIONS.
                    </h2>
                    {/* TOKEN: BODY LEAD */}
                    <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed max-w-md">
                        Meticulously curated routes for those seeking silence, challenge, and raw beauty.
                    </p>
                </div>
                <a href="#" className="text-[10px] font-mono tracking-[0.3em] uppercase text-white flex items-center gap-2 hover:text-cyan-400 transition-colors pb-1 border-b border-white/10 hover:border-cyan-400">
                    VIEW FULL CATALOG
                    <ArrowUpRight width={14} strokeWidth={1.5} />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[500px]">
                
                {/* Card 1 */}
                <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Patagonia" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        {/* TOKEN: TECH CAPTION */}
                        <span className="px-3 py-1.5 rounded-md text-[9px] font-mono tracking-widest bg-white/10 backdrop-blur border border-white/10 text-white uppercase">
                            HARD
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {/* TOKEN: SUB-LABEL */}
                        <span className="text-[10px] text-cyan-400 font-mono mb-3 block tracking-[0.4em] uppercase">
                            01 // PATAGONIA
                        </span>
                        {/* TOKEN: HEADING L */}
                        <h3 className="text-2xl md:text-3xl font-medium text-white mb-2 tracking-tight">
                            Torres del Silencio
                        </h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            {/* TOKEN: BODY LEAD (Small variant) */}
                            <p className="text-sm text-slate-400 mb-4 pt-4 border-t border-white/10 font-light leading-relaxed">
                                A technical traverse through ancient glaciers and granite needles where the silence is absolute.
                            </p>
                            <div className="flex items-center gap-4 text-[9px] font-mono tracking-wider text-slate-300 uppercase">
                                <span className="flex items-center gap-1.5"><Calendar width={12} className="text-cyan-500" /> Nov - Mar</span>
                                <span className="flex items-center gap-1.5"><MapPin width={12} className="text-cyan-500" /> Chile</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 (Span 2) */}
                <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 md:col-span-2 cursor-pointer">
                    <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Himalaya" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        <span className="px-3 py-1.5 rounded-md text-[9px] font-mono tracking-widest bg-white/10 backdrop-blur border border-white/10 text-white uppercase">
                            EXTREME
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full md:w-2/3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-blue-400 font-mono mb-3 block tracking-[0.4em] uppercase">
                            02 // HIMALAYA
                        </span>
                        <h3 className="text-2xl md:text-4xl font-medium text-white mb-2 tracking-tight">
                            La Corona de Hielo
                        </h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            <p className="text-sm text-slate-400 mb-4 pt-4 border-t border-white/10 font-light leading-relaxed">
                                A strategic ascent into the death zone at 7,000m. Optional supplementary oxygen. Only for veterans.
                            </p>
                            <div className="flex items-center gap-4 text-[9px] font-mono tracking-wider text-slate-300 uppercase">
                                <span className="flex items-center gap-1.5"><Calendar width={12} className="text-blue-500" /> Apr - May</span>
                                <span className="flex items-center gap-1.5"><Users width={12} className="text-blue-500" /> Max 6</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&amp;w=2070&amp;auto=format&amp;fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Alps" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        <span className="px-3 py-1.5 rounded-md text-[9px] font-mono tracking-widest bg-white/10 backdrop-blur border border-white/10 text-white uppercase">
                            MODERATE
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-orange-400 font-mono mb-3 block tracking-[0.4em] uppercase">
                            03 // ALPS
                        </span>
                        <h3 className="text-2xl md:text-3xl font-medium text-white mb-2 tracking-tight">
                            La Ruta Haute
                        </h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            <p className="text-sm text-slate-400 mb-4 pt-4 border-t border-white/10 font-light leading-relaxed">
                                Classic ski touring from Chamonix to Zermatt. High altitude mountain huts and alpine perfection.
                            </p>
                            <div className="flex items-center gap-4 text-[9px] font-mono tracking-wider text-slate-300 uppercase">
                                <span className="flex items-center gap-1.5"><Calendar width={12} className="text-orange-500" /> Feb - Apr</span>
                                <span className="flex items-center gap-1.5"><Thermometer width={12} className="text-orange-500" /> -15°C</span>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Card 4 */}
                 <div className="group relative rounded-xl overflow-hidden border border-white/10 bg-slate-900 cursor-pointer md:col-span-2">
                    <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&amp;w=1368&amp;auto=format&amp;fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out" alt="Dolomites" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-6 right-6 z-20">
                        <span className="px-3 py-1.5 rounded-md text-[9px] font-mono tracking-widest bg-white/10 backdrop-blur border border-white/10 text-white uppercase">
                            TECHNICAL
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-[10px] text-purple-400 font-mono mb-3 block tracking-[0.4em] uppercase">
                            04 // DOLOMITES
                        </span>
                        <h3 className="text-2xl md:text-4xl font-medium text-white mb-2 tracking-tight">
                            Vertical Limit
                        </h3>
                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                            <p className="text-sm text-slate-400 mb-4 pt-4 border-t border-white/10 font-light leading-relaxed">
                                Pure rock climbing and Via Ferratas in the heart of Italy. Breathtaking vertical exposures.
                            </p>
                             <div className="flex items-center gap-4 text-[9px] font-mono tracking-wider text-slate-300 uppercase">
                                <span className="flex items-center gap-1.5"><Calendar width={12} className="text-purple-500" /> Jun - Sep</span>
                                <span className="flex items-center gap-1.5"><Activity width={12} className="text-purple-500" /> Elite Level</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
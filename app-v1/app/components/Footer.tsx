import React from 'react';
import { MountainSnow, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background pt-20 pb-10 px-frame">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-white font-medium tracking-tighter text-lg flex items-center gap-1 mb-6">
                            <MountainSnow width={18} />
                            NEVADO TREK
                        </span>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">
                            Diseñado para aquellos que encuentran paz en la altitud y propósito en el esfuerzo.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-wide uppercase mb-6">Destinos</h4>
                        <ul className="space-y-3 text-xs text-slate-500">
                            <li><a href="#" className="hover:text-white transition-colors">Himalaya</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Andes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Alpes</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Alaska</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-wide uppercase mb-6">Compañía</h4>
                        <ul className="space-y-3 text-xs text-slate-500">
                            <li><a href="#" className="hover:text-white transition-colors">Manifiesto</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Guías</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sostenibilidad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Prensa</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-wide uppercase mb-6">Social</h4>
                        <div className="flex gap-4 text-slate-500">
                            <a href="#" className="hover:text-white transition-colors"><Instagram width={18} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter width={18} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Youtube width={18} /></a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] text-slate-600">
                    <p>© 2024 Nevado Trek Expeditions. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-slate-400">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-400">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

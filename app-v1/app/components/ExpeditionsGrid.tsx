import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getTours } from '../services/nevado-api';
import TourCard from './TourCard';

export default async function ExpeditionsGrid() {
    const allTours = await getTours();
    const tours = allTours.slice(0, 6);

    // Configuración del "Cinematic Rhythm"
    // Define tanto el ancho (cols) como la altura (h) para crear una narrativa visual.
    const getGridClass = (index: number) => {
        switch (index) {
            // 1. THE OPENING (Impacto Total)
            case 0: return "md:col-span-12 h-[80vh] min-h-[600px]"; 
            
            // 2. THE DETAILS (Ritmo Rápido)
            case 1: return "md:col-span-5 h-[500px]";
            case 2: return "md:col-span-7 h-[500px]"; 
            
            // 3. THE PAUSE (Segundo Acto - Panorámica)
            case 3: return "md:col-span-12 h-[65vh] min-h-[500px]"; 

            // 4. THE FINALE (Asimetría Agresiva)
            case 4: return "md:col-span-8 h-[500px]"; 
            case 5: return "md:col-span-4 h-[500px]"; 
            
            default: return "md:col-span-4 h-[500px]";
        }
    };

    return (
        <section className="bg-background section-v-spacing">
            <div className="px-frame max-w-7xl mx-auto">
                
                {/* Header */}
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

                {/* Grid con espaciado arquitectónico (gap-4) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {tours.map((tour, index) => (
                        <TourCard 
                            key={tour.tourId}
                            tour={tour}
                            index={index}
                            className={getGridClass(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}



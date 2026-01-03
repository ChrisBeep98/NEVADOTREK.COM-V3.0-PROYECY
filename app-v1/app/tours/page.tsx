import React from 'react';
import { getTours } from '../services/nevado-api';
import ToursClient from './ToursClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Expeditions | Nevado Trek',
    description: 'Explore our guided trekking tours in the Colombian Andes.',
};

export default async function ToursPage() {
    const tours = await getTours();
    console.log(`[ToursPage] Fetched ${tours.length} tours from API`);

    return (
        <main className="bg-[#040918]">
            <Header />
            <ToursClient initialTours={tours} />
            <Footer />
        </main>
    );
}

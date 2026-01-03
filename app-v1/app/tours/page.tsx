import React from 'react';
import ToursClient from './ToursClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Expeditions | Nevado Trek',
    description: 'Explore our guided trekking tours in the Colombian Andes.',
};

export default function ToursPage() {
    return (
        <main className="bg-[#040918]">
            <Header />
            <ToursClient />
            <Footer />
        </main>
    );
}
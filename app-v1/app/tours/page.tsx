import React from 'react';
import ToursClient from './ToursClient';
import Header from '../components/Header';
import FooterWithWidget from '../components/FooterWithWidget';

export const metadata = {
    title: 'Expeditions | Nevado Trek',
    description: 'Explore our guided trekking tours in the Colombian Andes.',
};

export default function ToursPage() {
    return (
        <main>
            <Header />
            <ToursClient />
            <FooterWithWidget />
        </main>
    );
}
import { DesktopHero } from "./components/hero";
import IntroSection from "./components/IntroSection";
import ExpeditionsGrid from "./components/ExpeditionsGrid";
import TextMarquee from "./components/TextMarquee";
import FeaturesGrid from "./components/FeaturesGrid";
import FeatureImage from "./components/FeatureImage";
import TestimonialsSection from "./components/TestimonialsSection";
import BookingCTA from "./components/BookingCTA";
import FooterWithWidget from "./components/FooterWithWidget";
import Header from "./components/Header";
import { getTours, getAllActiveDepartures } from "./services/nevado-api";

export default async function Home() {
  const [tours, departures] = await Promise.all([
    getTours(),
    getAllActiveDepartures()
  ]);

  // Cruzar datos: Asignar a cada tour su salida más cercana
  const toursWithDates = tours.map(tour => {
    const nextDep = departures.find(d => d.tourId === tour.tourId);
    let formattedDate = undefined;

    if (nextDep) {
      const date = new Date(nextDep.date._seconds * 1000);
      // Formato: "FEB 14"
      formattedDate = date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }).toUpperCase();
    }

    return { ...tour, nextDepartureDate: formattedDate };
  });

  return (
    <main className="bg-background">
      <Header />
      <DesktopHero />
      <IntroSection />
      <div className="relative z-30">
        <ExpeditionsGrid initialTours={toursWithDates} />
        <TextMarquee />
        <BookingCTA />
        <FeaturesGrid />
        <FeatureImage />
        <TestimonialsSection />
        <FooterWithWidget />
      </div>
    </main>
  );
}
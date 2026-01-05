import HeroMonolith from "./components/HeroMonolith";
import IntroSection from "./components/IntroSection";
import ExpeditionsGrid from "./components/ExpeditionsGrid";
import FeaturesGrid from "./components/FeaturesGrid";
import TestimonialsSection from "./components/TestimonialsSection";
import BookingCTA from "./components/BookingCTA";
import Footer from "./components/Footer";
import { getTours } from "./services/nevado-api";

export default async function Home() {
  const tours = await getTours();

  return (
    <main className="bg-background">
      <HeroMonolith />
      <IntroSection />
      <div className="relative z-30">
        
        <ExpeditionsGrid initialTours={tours} />
        <BookingCTA />
        <FeaturesGrid />
        <TestimonialsSection />
        <Footer />
      </div>
    </main>
  );
}
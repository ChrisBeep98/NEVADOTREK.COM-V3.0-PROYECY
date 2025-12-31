import HeroMonolith from "./components/HeroMonolith";
import ExpeditionsGrid from "./components/ExpeditionsGrid";
import FeaturesGrid from "./components/FeaturesGrid";
import TestimonialsSection from "./components/TestimonialsSection";
import BookingCTA from "./components/BookingCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-background">
      <HeroMonolith />
      <div className="relative z-30">
        
        <ExpeditionsGrid />
        <BookingCTA />
        <FeaturesGrid />
        <TestimonialsSection />
        <Footer />
      </div>
    </main>
  );
}
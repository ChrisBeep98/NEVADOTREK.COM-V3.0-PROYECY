import HeroMonolith from "./components/HeroMonolith";
import StatementSection from "./components/StatementSection";
import ExpeditionsGrid from "./components/ExpeditionsGrid";
import FeaturesGrid from "./components/FeaturesGrid";
import TestimonialsSection from "./components/TestimonialsSection";
import BookingCTA from "./components/BookingCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-slate-950">
      <HeroMonolith />
      <div className="relative z-30">
        <StatementSection />
        <ExpeditionsGrid />
        <FeaturesGrid />
        <BookingCTA />
        <TestimonialsSection />
        <Footer />
      </div>
    </main>
  );
}
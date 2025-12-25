import HeroMonolith from "./components/HeroMonolith";
import StatsSection from "./components/StatsSection";
import ExpeditionsGrid from "./components/ExpeditionsGrid";
import FeaturesGrid from "./components/FeaturesGrid";
import BookingCTA from "./components/BookingCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-slate-950">
      <HeroMonolith />
      <div className="relative z-30"> {/* Ensures content stays above any hero artifacts */}
        <StatsSection />
        <ExpeditionsGrid />
        <FeaturesGrid />
        <BookingCTA />
        <Footer />
      </div>
    </main>
  );
}

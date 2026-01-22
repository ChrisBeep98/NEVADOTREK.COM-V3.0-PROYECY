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
import { getTours } from "./services/nevado-api";

export default async function Home() {
  const tours = await getTours();

  return (
    <main className="bg-background">
      <Header />
      <DesktopHero />
      <IntroSection />
      <div className="relative z-30">
        
        <ExpeditionsGrid initialTours={tours} />
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
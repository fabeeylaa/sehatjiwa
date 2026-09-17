import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhySection from "../components/WhySection";
import ScreeningPreview from "../components/ScreeningPreview";
import HabitTrackerPreview from "../components/HabitTrackerPreview";
import ArticlesPreview from "../components/ArticlesPreview";
import Footer from "../components/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhySection />
      <ScreeningPreview />
      <HabitTrackerPreview />
      <ArticlesPreview />
      <Footer />
    </>
  );
}

export default LandingPage;

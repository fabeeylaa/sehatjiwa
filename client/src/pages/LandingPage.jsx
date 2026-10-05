import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhySection from "../components/WhySection";
import ScreeningPreview from "../components/ScreeningPreview";
import HabitTrackerPreview from "../components/HabitTrackerPreview";
import ArticlesPreview from "../components/ArticlesPreview";
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
import "./LandingPage.css";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <RevealOnScroll as="div"><WhySection /></RevealOnScroll>
      <RevealOnScroll delay={80} as="div"><ScreeningPreview /></RevealOnScroll>
      <RevealOnScroll delay={160} as="div"><HabitTrackerPreview /></RevealOnScroll>
      <RevealOnScroll delay={80} as="div"><ArticlesPreview /></RevealOnScroll>
      <Footer />
    </>
  );
}

export default LandingPage;
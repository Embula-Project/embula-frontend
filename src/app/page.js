import HeroSection from "./Components/HeroSection";
import DiscountSection from "./Components/DiscountSection";
import SpecialDishesSection from "./Components/SpecialDishesSection";
import AboutSection from "./Components/AboutSection";
import CTASection from "./Components/CTASection";

export default function Home() {
  return (
    <div className="bg-black">
      <HeroSection />
      <DiscountSection />
      <SpecialDishesSection />
      <AboutSection />
      <CTASection />
    </div>
  );
}

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutSection } from "@/components/sections/about-section";
import { CTASection } from "@/components/sections/cta-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { InsightsSection } from "@/components/sections/insights-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <div className="font-sans text-gray-800 bg-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <CTASection />
        <TestimonialsSection />
        <InsightsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

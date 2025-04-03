import { GradientButton } from "@/components/ui/gradient-button";
import { GradientText } from "@/components/ui/gradient-text";
import { SiGoogle, SiAmazon, SiOracle } from "react-icons/si";

export function HeroSection() {
  return (
    <section id="home" className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gray-50">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="font-accent font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
            <span>Smart AI Solutions for</span><br />
            <GradientText>Smart Growth</GradientText>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-lg">
            Helping small and mid-sized businesses leverage the power of artificial intelligence to unlock efficiency, innovation, and sustainable growth.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#contact">
              <GradientButton>
                Schedule a Free Consultation
              </GradientButton>
            </a>
            <a href="#services">
              <GradientButton variant="outline">
                Explore Services
              </GradientButton>
            </a>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600 mb-3 block">Trusted by industry leaders:</span>
            <div className="flex space-x-8 items-center">
              <div className="flex items-center justify-center group transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <SiGoogle className="h-8 w-auto text-[#4285F4] opacity-80 group-hover:opacity-100 group-hover:drop-shadow-md" />
              </div>
              <div className="flex items-center justify-center group transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <SiAmazon className="h-8 w-auto text-[#FF9900] opacity-80 group-hover:opacity-100 group-hover:drop-shadow-md" />
              </div>
              <div className="flex items-center justify-center group transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                <SiOracle className="h-8 w-auto text-[#F80000] opacity-80 group-hover:opacity-100 group-hover:drop-shadow-md" />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-brand opacity-20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-brand opacity-20 rounded-full blur-xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="AI Business Solutions Visualization" 
              className="w-full h-auto rounded-xl shadow-lg object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

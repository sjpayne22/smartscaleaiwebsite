import { GradientButton } from "@/components/ui/gradient-button";

export function CTASection() {
  return (
    <section className="py-12 md:py-16 bg-gray-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business with AI?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Schedule a free 30-minute consultation to discuss how SmartScale AI can help you achieve your business goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#contact">
              <GradientButton>
                Schedule Consultation
              </GradientButton>
            </a>
            <a href="#services">
              <GradientButton variant="outline">
                Learn More About Our Services
              </GradientButton>
            </a>
          </div>
        </div>
      </div>
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#0AB5CE] blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#FDA035] blur-3xl"></div>
      </div>
    </section>
  );
}

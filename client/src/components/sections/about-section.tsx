import { GradientButton } from "@/components/ui/gradient-button";
import { Check } from "lucide-react";
import stanleyPaynePhoto from "@assets/StanleyPayneYounger.jpg";

export function AboutSection() {
  const valueProps = [
    {
      title: "Client-First Approach",
      description: "Solutions tailored to your specific needs"
    },
    {
      title: "Ethical AI Practices",
      description: "Responsible and transparent implementation"
    },
    {
      title: "Results-Driven",
      description: "Focused on measurable business outcomes"
    },
    {
      title: "Continuous Support",
      description: "Long-term partnership beyond implementation"
    }
  ];

  return (
    <section id="about" className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Empowering Businesses Through AI Innovation</h2>
            <p className="text-gray-500 mb-6">
              At SmartScale AI Consulting, we bridge the gap between complex artificial intelligence technologies and practical business applications. Our mission is to democratize AI, making it accessible and beneficial for small and mid-sized businesses across sectors.
            </p>
            <p className="text-gray-500 mb-8">
              Founded by Stanley Payne, a veteran in both AI development and business strategy, our team combines technical expertise with industry knowledge to deliver solutions that drive real results. We don't just implement technology; we partner with you to solve problems, identify opportunities, and create sustainable competitive advantages.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {valueProps.map((prop, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-[#0AB5CE]" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{prop.title}</h3>
                    <p className="text-sm text-gray-500">{prop.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <a href="#contact">
              <GradientButton>
                Schedule a Discovery Call
              </GradientButton>
            </a>
          </div>
          <div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-brand opacity-20 rounded-full blur-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Team collaborating on AI solutions" 
                className="w-full h-auto rounded-xl shadow-lg" 
              />
              
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md max-w-xs">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img 
                      src={stanleyPaynePhoto} 
                      alt="Stanley Payne" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Stanley Payne</h4>
                    <p className="text-sm text-gray-500">Founder & CEO</p>
                  </div>
                </div>
                <p className="text-sm italic text-gray-500">"Our mission is to make AI accessible, practical, and transformative for businesses of all sizes."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

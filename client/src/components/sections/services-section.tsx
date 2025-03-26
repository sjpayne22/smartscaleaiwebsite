import { ServiceCard } from "@/components/ui/service-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Brain, Settings, RotateCcw, BarChart3, GraduationCap } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      title: "AI Strategy & Consulting",
      description: "Develop a customized AI roadmap aligned with your business goals and industry challenges.",
      icon: Brain,
      color: "turquoise" as const
    },
    {
      title: "AI Implementation & Integration",
      description: "Seamlessly incorporate AI solutions into your existing systems and workflows with minimal disruption.",
      icon: Settings,
      color: "green" as const
    },
    {
      title: "Business Process Automation",
      description: "Automate repetitive tasks and streamline operations to boost productivity and reduce costs.",
      icon: RotateCcw,
      color: "orange" as const
    },
    {
      title: "Predictive Analytics & Insights",
      description: "Leverage data to forecast trends, identify opportunities, and make informed business decisions.",
      icon: BarChart3,
      color: "turquoise" as const
    },
    {
      title: "AI Training & Workshops",
      description: "Empower your team with knowledge and skills to harness AI technologies effectively in their roles.",
      icon: GraduationCap,
      color: "green" as const
    }
  ];

  return (
    <section id="services" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Help Your Business Grow</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Our comprehensive AI solutions are designed to transform your operations, enhance decision-making, and drive sustainable growth.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              color={service.color}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <GradientButton>
            Discuss Your AI Requirements
          </GradientButton>
        </div>
      </div>
    </section>
  );
}

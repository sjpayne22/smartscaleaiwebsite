import { ServiceCard } from "@/components/ui/service-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Brain, Settings, RotateCcw, BarChart3, GraduationCap, Check } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Service type definition with detailed content
interface Service {
  title: string;
  description: string;
  detailedContent: {
    overview: string;
    bulletPoints: string[];
    benefits: string[];
    approach: string;
  };
  icon: LucideIcon;
  color: "turquoise" | "green" | "orange";
}

export function ServicesSection() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  const services: Service[] = [
    {
      title: "AI Strategy & Consulting",
      description: "Develop a customized AI roadmap aligned with your business goals and industry challenges.",
      detailedContent: {
        overview: "Our AI Strategy & Consulting service helps you navigate the complex landscape of artificial intelligence technologies and develop a clear roadmap for implementation that aligns with your specific business objectives.",
        bulletPoints: [
          "Comprehensive AI readiness assessment",
          "Technology landscape analysis tailored to your industry",
          "Customized AI implementation roadmap",
          "ROI analysis and business case development",
          "Risk assessment and mitigation strategies"
        ],
        benefits: [
          "Clear direction for AI initiatives aligned with business goals",
          "Prioritized implementation plan based on impact and feasibility",
          "Reduced risk through expert guidance",
          "Competitive advantage through strategic AI adoption",
          "Optimization of existing technology investments"
        ],
        approach: "We begin with a thorough assessment of your current capabilities, business goals, and industry challenges. Our experts then develop a tailored AI strategy that outlines specific use cases, required technologies, implementation timelines, and expected outcomes. This roadmap serves as your guide to transforming your business through strategic AI adoption."
      },
      icon: Brain,
      color: "turquoise" as const
    },
    {
      title: "AI Implementation & Integration",
      description: "Seamlessly incorporate AI solutions into your existing systems and workflows with minimal disruption.",
      detailedContent: {
        overview: "Our AI Implementation & Integration services ensure that AI technologies are effectively incorporated into your existing technology ecosystem, with minimal disruption to your operations.",
        bulletPoints: [
          "System architecture and integration planning",
          "AI solution development or vendor selection",
          "Data integration and pipeline development",
          "API development and integration",
          "Testing, deployment, and monitoring setup"
        ],
        benefits: [
          "Seamless integration with existing systems",
          "Reduced implementation timeline and costs",
          "Minimized operational disruption",
          "Scalable solutions that grow with your business",
          "Technical debt prevention"
        ],
        approach: "Our implementation process begins with a detailed assessment of your current technology stack and integration requirements. We then design and develop the necessary components to connect AI capabilities with your existing systems, whether through custom development or vendor solutions. Throughout the process, we focus on creating scalable, maintainable solutions that deliver immediate value while supporting future growth."
      },
      icon: Settings,
      color: "green" as const
    },
    {
      title: "Business Process Automation",
      description: "Automate repetitive tasks and streamline operations to boost productivity and reduce costs.",
      detailedContent: {
        overview: "Our Business Process Automation service leverages AI and machine learning to identify, optimize, and automate routine business processes, freeing your team to focus on high-value activities.",
        bulletPoints: [
          "Process analysis and optimization assessment",
          "Automation opportunity identification",
          "Workflow redesign and optimization",
          "RPA (Robotic Process Automation) implementation",
          "Intelligent document processing solutions"
        ],
        benefits: [
          "Reduced operational costs through efficiency gains",
          "Minimized human error in routine processes",
          "Improved customer and employee experience",
          "Increased throughput and processing capacity",
          "Enhanced compliance and audit trails"
        ],
        approach: "We start by mapping and analyzing your current processes to identify automation opportunities. Our team then designs optimized workflows and implements the appropriate automation technologies, whether simple RPA for structured tasks or advanced AI for more complex scenarios. We ensure proper integration with existing systems and provide training for your team to manage and maintain these automated processes."
      },
      icon: RotateCcw,
      color: "orange" as const
    },
    {
      title: "Predictive Analytics & Insights",
      description: "Leverage data to forecast trends, identify opportunities, and make informed business decisions.",
      detailedContent: {
        overview: "Our Predictive Analytics & Insights service transforms your data into actionable business intelligence, enabling you to anticipate market changes, identify opportunities, and make data-driven decisions.",
        bulletPoints: [
          "Data strategy and architecture design",
          "Predictive model development and validation",
          "Advanced visualization dashboards",
          "Anomaly detection and pattern recognition",
          "Continuous model improvement and maintenance"
        ],
        benefits: [
          "Improved forecasting accuracy for better planning",
          "Early identification of market trends and opportunities",
          "Data-driven decision making across the organization",
          "Reduced business risk through proactive insights",
          "Competitive advantage through data intelligence"
        ],
        approach: "Our analytics process begins with a comprehensive assessment of your data assets and business questions. We then design and implement the appropriate data infrastructure, develop predictive models using machine learning techniques, and create intuitive dashboards that make insights accessible to decision-makers. Our iterative approach ensures that models continue to improve over time as more data becomes available."
      },
      icon: BarChart3,
      color: "turquoise" as const
    },
    {
      title: "AI Training & Workshops",
      description: "Empower your team with knowledge and skills to harness AI technologies effectively in their roles.",
      detailedContent: {
        overview: "Our AI Training & Workshops service builds AI literacy and technical skills within your organization, enabling your team to effectively leverage AI technologies and drive innovation from within.",
        bulletPoints: [
          "Executive AI literacy programs",
          "Technical training for development teams",
          "Department-specific AI application workshops",
          "Hands-on labs and implementation exercises",
          "Ongoing learning and support resources"
        ],
        benefits: [
          "Increased organizational AI literacy and adoption",
          "Reduced dependency on external consultants",
          "Internal innovation culture development",
          "Improved cross-functional collaboration",
          "Enhanced employee satisfaction and retention"
        ],
        approach: "We develop customized training programs based on your team's current skills and your organization's specific AI goals. Our workshops combine theoretical knowledge with practical applications relevant to your industry and business challenges. Training can be delivered through various formats, including executive briefings, technical workshops, online courses, and hands-on labs, ensuring that all levels of your organization develop the appropriate AI capabilities."
      },
      icon: GraduationCap,
      color: "green" as const
    }
  ];

  // Function to handle opening a service dialog
  const handleOpenServiceDetail = (title: string) => {
    setOpenDialog(title);
  };
  
  // Function to close any open dialog
  const handleCloseDialog = () => {
    setOpenDialog(null);
  };
  
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
              onClick={() => handleOpenServiceDetail(service.title)}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#contact">
            <GradientButton>
              Discuss Your AI Requirements
            </GradientButton>
          </a>
        </div>
      </div>
      
      {/* Service Detail Dialogs */}
      {services.map((service) => {
        const colorClass = service.color === 'turquoise' ? 'text-[#0AB5CE]' : 
                        service.color === 'green' ? 'text-[#5CDC74]' : 
                        'text-[#FDA035]';
        
        const bgColorClass = service.color === 'turquoise' ? 'bg-[#0AB5CE]' : 
                          service.color === 'green' ? 'bg-[#5CDC74]' : 
                          'bg-[#FDA035]';
        
        const lightBgColorClass = service.color === 'turquoise' ? 'bg-[#0AB5CE]/5' : 
                               service.color === 'green' ? 'bg-[#5CDC74]/5' : 
                               'bg-[#FDA035]/5';
                               
        return (
          <Dialog key={service.title} open={openDialog === service.title} onOpenChange={handleCloseDialog}>
            <DialogContent className="sm:max-w-3xl overflow-hidden">
              {/* Decorative header strip */}
              <div className={`absolute top-0 left-0 w-full h-1 ${bgColorClass}`}></div>
              
              <DialogHeader className={`pb-6 ${lightBgColorClass} -mx-6 -mt-6 px-6 pt-6 rounded-b-xl`}>
                <DialogTitle className="flex items-center text-2xl">
                  <div className={`p-2 rounded-lg mr-3 ${bgColorClass}`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  {service.title}
                </DialogTitle>
                <DialogDescription className="text-lg mt-2">
                  {service.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="border-l-4 pl-4 border-gray-200">
                  <h3 className={`text-lg font-medium mb-2 ${colorClass}`}>Overview</h3>
                  <p className="text-gray-600">{service.detailedContent.overview}</p>
                </div>
                
                <div className="border-l-4 pl-4 border-gray-200">
                  <h3 className={`text-lg font-medium mb-2 ${colorClass}`}>Our Approach</h3>
                  <p className="text-gray-600">{service.detailedContent.approach}</p>
                </div>
                
                <div className={`rounded-lg p-4 ${lightBgColorClass}`}>
                  <h3 className={`text-lg font-medium mb-3 ${colorClass}`}>What We Offer</h3>
                  <ul className="space-y-3">
                    {service.detailedContent.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${bgColorClass}`}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`rounded-lg p-4 ${lightBgColorClass}`}>
                  <h3 className={`text-lg font-medium mb-3 ${colorClass}`}>Key Benefits</h3>
                  <ul className="space-y-3">
                    {service.detailedContent.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${bgColorClass}`}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <DialogFooter className="border-t border-gray-100 pt-4 flex sm:justify-between items-center flex-wrap">
                <a href="#contact" className={`flex items-center ${colorClass} hover:underline font-medium`} onClick={handleCloseDialog}>
                  Get in touch to learn more
                </a>
                <DialogClose asChild>
                  <Button variant="outline" className="mt-2 sm:mt-0">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })}
    </section>
  );
}

import { Brain, Settings, RotateCcw, BarChart3, GraduationCap } from "lucide-react";
import { Service, Testimonial, Insight } from "./types";

export const services: Service[] = [
  {
    title: "AI Strategy & Consulting",
    description: "Develop a customized AI roadmap aligned with your business goals and industry challenges.",
    icon: Brain,
    color: "turquoise"
  },
  {
    title: "AI Implementation & Integration",
    description: "Seamlessly incorporate AI solutions into your existing systems and workflows with minimal disruption.",
    icon: Settings,
    color: "green"
  },
  {
    title: "Business Process Automation",
    description: "Automate repetitive tasks and streamline operations to boost productivity and reduce costs.",
    icon: RotateCcw,
    color: "orange"
  },
  {
    title: "Predictive Analytics & Insights",
    description: "Leverage data to forecast trends, identify opportunities, and make informed business decisions.",
    icon: BarChart3,
    color: "turquoise"
  },
  {
    title: "AI Training & Workshops",
    description: "Empower your team with knowledge and skills to harness AI technologies effectively in their roles.",
    icon: GraduationCap,
    color: "green"
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: "SmartScale AI transformed our customer service with their chatbot solution. We've seen a 40% reduction in response time and significantly improved customer satisfaction scores.",
    author: "Sarah Johnson",
    position: "CEO, RetailConnect",
    rating: 5
  },
  {
    quote: "The predictive analytics solution implemented by SmartScale AI has revolutionized our inventory management. We've reduced waste by 23% and improved our order fulfillment rate to 98%.",
    author: "Michael Rodriguez",
    position: "Operations Director, FreshGoods",
    rating: 5
  },
  {
    quote: "The AI workshops conducted by SmartScale were eye-opening for our team. We now have a clear AI strategy and the knowledge to implement it. The ROI has been exceptional.",
    author: "Lisa Chen",
    position: "CFO, TechWave Solutions",
    rating: 5
  }
];

export const insights: Insight[] = [
  {
    title: "5 Ways Small Businesses Can Leverage AI in 2023",
    description: "Discover practical AI applications that can help small businesses compete with larger corporations.",
    category: "AI Strategy",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    color: "turquoise"
  },
  {
    title: "The Power of Predictive Analytics for Inventory Management",
    description: "Learn how AI-powered predictive analytics can optimize your inventory and reduce costs.",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    color: "green"
  },
  {
    title: "How RetailConnect Achieved 40% Faster Response Times with AI",
    description: "A detailed look at how we helped RetailConnect transform their customer service with AI.",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    color: "orange"
  }
];

export const companyValues = [
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

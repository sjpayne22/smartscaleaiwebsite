import { Logo } from "@/components/ui/logo";
import { Facebook, Linkedin, Youtube } from "lucide-react";

interface FooterSectionProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href} className="text-gray-400 hover:text-white transition">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Insights", href: "#insights" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    { label: "AI Strategy & Consulting", href: "#services" },
    { label: "AI Implementation", href: "#services" },
    { label: "Process Automation", href: "#services" },
    { label: "Predictive Analytics", href: "#services" },
    { label: "AI Training & Workshops", href: "#services" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <a href="#home" className="flex items-center space-x-2 mb-4">
              <Logo darkMode />
            </a>
            <p className="text-gray-400 mb-6 max-w-md">
              SmartScale AI Consulting helps small and mid-sized businesses leverage artificial intelligence for smarter growth, efficiency, and innovation.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/stanley-payne-212092232" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61573967995732" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@SmartScaleai_ai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <FooterSection title="Quick Links" links={quickLinks} />
          <FooterSection title="Services" links={services} />
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} SmartScale AI Consulting LLC. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
              <a href="#terms" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
              <a href="#cookies" className="text-gray-500 hover:text-gray-400 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

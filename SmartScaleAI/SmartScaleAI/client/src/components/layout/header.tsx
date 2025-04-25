import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Insights", href: "#insights" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us 2", href: "https://blog.smartscaleai.ai/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Handle scroll for sticky header
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Handle active section
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id') || '';
        }
      });
      
      if (currentSection !== activeSection && currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed w-full bg-white/95 backdrop-blur-sm z-50 transition-shadow duration-300",
      scrolled ? "shadow-sm" : ""
    )}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#home">
          <Logo />
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            item.href.startsWith("/") ? (
              <Link 
                key={item.href}
                to={item.href}
                className={cn(
                  "relative text-gray-700 hover:text-gray-900 transition",
                  location === item.href ? "nav-link active" : "nav-link"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <a 
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-gray-700 hover:text-gray-900 transition",
                  activeSection === item.href.substring(1) ? "nav-link active" : "nav-link"
                )}
                onClick={() => setActiveSection(item.href.substring(1))}
              >
                {item.label}
              </a>
            )
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn("md:hidden bg-white border-t", mobileMenuOpen ? "block" : "hidden")}>
        <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
          {navItems.map((item) => (
            item.href.startsWith("/") ? (
              <Link 
                key={item.href}
                to={item.href}
                className="py-2 text-gray-700 hover:text-gray-900 transition"
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ) : (
              <a 
                key={item.href}
                href={item.href}
                className="py-2 text-gray-700 hover:text-gray-900 transition"
                onClick={closeMobileMenu}
              >
                {item.label}
              </a>
            )
          ))}
        </div>
      </div>
    </header>
  );
}

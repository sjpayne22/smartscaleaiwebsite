import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "turquoise" | "green" | "orange";
  href?: string;
  onClick?: () => void;
}

const colorClasses = {
  turquoise: {
    border: "border-t-4 border-[#0AB5CE]",
    iconBg: "bg-[#0AB5CE]/10",
    iconColor: "text-[#0AB5CE]",
    linkColor: "text-[#0AB5CE]"
  },
  green: {
    border: "border-t-4 border-[#5CDC74]",
    iconBg: "bg-[#5CDC74]/10",
    iconColor: "text-[#5CDC74]",
    linkColor: "text-[#5CDC74]"
  },
  orange: {
    border: "border-t-4 border-[#FDA035]",
    iconBg: "bg-[#FDA035]/10",
    iconColor: "text-[#FDA035]",
    linkColor: "text-[#FDA035]"
  }
};

export function ServiceCard({ title, description, icon: Icon, color, href = "#contact", onClick }: ServiceCardProps) {
  const { border, iconBg, iconColor, linkColor } = colorClasses[color];

  return (
    <div 
      className={cn(
        "bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden", 
        border,
        "transform hover:-translate-y-1"
      )}
      onClick={onClick}
    >
      {/* Color indicator that expands on hover */}
      <div 
        className={cn(
          "absolute top-0 left-0 w-full h-1 transition-all duration-300",
          color === "turquoise" ? "bg-[#0AB5CE]" : color === "green" ? "bg-[#5CDC74]" : "bg-[#FDA035]",
        )}
      />
      
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300", iconBg)}>
        <Icon className={cn("h-6 w-6 transition-all duration-300", iconColor)} />
      </div>
      <h3 className="text-xl font-semibold mb-2 transition-all duration-300">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when clicking the button
          if (onClick) onClick();
        }} 
        className={cn(
          "font-medium inline-flex items-center bg-transparent border-none p-0 transition-all duration-300", 
          linkColor,
          "group hover:underline"
        )}
      >
        Learn more
        <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

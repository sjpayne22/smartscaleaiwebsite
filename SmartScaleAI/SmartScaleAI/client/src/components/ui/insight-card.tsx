import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  category: string;
  image: string;
  color: "turquoise" | "green" | "orange";
  href?: string;
  onClick?: () => void;
}

const colorClasses = {
  turquoise: "text-[#0AB5CE]",
  green: "text-[#5CDC74]",
  orange: "text-[#FDA035]",
};

export function InsightCard({ 
  title, 
  description, 
  category, 
  image, 
  color, 
  href = "#contact",
  onClick
}: InsightCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 cursor-pointer" onClick={onClick}>
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="p-6">
        <p className={cn("text-sm font-medium mb-2", colorClasses[color])}>
          {category}
        </p>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-500 mb-4">{description}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }} 
          className={cn("font-medium inline-flex items-center bg-transparent border-none p-0 group", colorClasses[color])}
        >
          Read More
          <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

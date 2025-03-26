import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "turquoise" | "green" | "orange";
  href?: string;
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

export function ServiceCard({ title, description, icon: Icon, color, href = "#services" }: ServiceCardProps) {
  const { border, iconBg, iconColor, linkColor } = colorClasses[color];

  return (
    <div className={cn(
      "bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition", 
      border
    )}>
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", iconBg)}>
        <Icon className={cn("h-6 w-6", iconColor)} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <a href={href} className={cn("font-medium inline-flex items-center", linkColor)}>
        Learn more
        <ChevronRight className="h-4 w-4 ml-1" />
      </a>
    </div>
  );
}

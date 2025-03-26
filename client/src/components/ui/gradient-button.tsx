import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  size?: "default" | "sm" | "lg";
  asChild?: boolean;
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, className, variant = "primary", size = "default", ...props }, ref) => {
    const baseClasses = "transition transform hover:-translate-y-0.5";

    const variants = {
      primary: "bg-gradient-brand text-white font-semibold shadow-md hover:shadow-lg",
      outline: variant === "primary" 
        ? "border border-turquoise text-turquoise font-semibold hover:bg-turquoise/5" 
        : "border border-white/30 text-white font-semibold hover:bg-white/10"
    };

    const sizes = {
      default: "px-6 py-3",
      sm: "px-4 py-2 text-sm",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg", 
          baseClasses, 
          variants[variant], 
          sizes[size], 
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

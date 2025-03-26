import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function GradientText({ 
  children, 
  className, 
  as: Component = "span" 
}: GradientTextProps) {
  return (
    <Component className={cn("gradient-text", className)}>
      {children}
    </Component>
  );
}

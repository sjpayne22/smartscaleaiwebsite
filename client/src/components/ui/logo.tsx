import logoSrc from "@assets/Logox512blur_V2.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  darkMode?: boolean;
}

export function Logo({ size = "md", showText = true, darkMode = false }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  };

  return (
    <div className="flex items-center space-x-2">
      <img src={logoSrc} alt="SmartScale AI Consulting Logo" className={sizeClasses[size]} />
      {showText && (
        <span className={`font-accent font-semibold ${darkMode ? "text-white" : "text-gray-900"} hidden md:inline-block`}>
          SmartScale AI
        </span>
      )}
    </div>
  );
}

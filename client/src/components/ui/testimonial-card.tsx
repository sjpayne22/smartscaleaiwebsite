import { useState } from "react";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  position: string;
  rating?: number;
  image?: string;
}

export function TestimonialCard({ quote, author, position, rating = 5, image }: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-100 relative group transition-all duration-300 ease-in-out hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative quote icon */}
      <div className="absolute -top-4 -left-4 opacity-10 transition-all duration-300 group-hover:opacity-20 group-hover:scale-110">
        <Quote className="h-16 w-16 text-[#0AB5CE]" />
      </div>
      
      {/* Star rating */}
      <div className="flex items-center mb-6 relative z-10">
        {Array.from({ length: rating }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 text-yellow-400 transition-all duration-300 ${isHovered ? 'animate-pulse' : ''}`} 
            style={{ animationDelay: `${i * 0.1}s` }}
            fill="currentColor" 
          />
        ))}
      </div>
      
      {/* Quote text */}
      <blockquote className="mb-6 italic text-gray-600 relative z-10">
        "{quote}"
      </blockquote>
      
      {/* Author info with enhanced image */}
      <div className="flex items-center relative z-10">
        <div className={`w-12 h-12 rounded-full overflow-hidden mr-4 transition-all duration-300 border-2 ${isHovered ? 'border-[#0AB5CE] scale-105' : 'border-transparent'}`}>
          {image ? (
            <img 
              src={image} 
              alt={author} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-800 transition-all duration-300 group-hover:text-[#0AB5CE]">{author}</p>
          <p className="text-sm text-gray-500">{position}</p>
        </div>
      </div>
      
      {/* Background hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0AB5CE]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
    </div>
  );
}

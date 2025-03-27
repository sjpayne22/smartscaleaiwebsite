import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  position: string;
  rating?: number;
  image?: string;
}

export function TestimonialCard({ quote, author, position, rating = 5, image }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" />
        ))}
      </div>
      <blockquote className="mb-4 italic text-gray-500">{quote}</blockquote>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          {image ? (
            <img 
              src={image} 
              alt={author} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{position}</p>
        </div>
      </div>
    </div>
  );
}

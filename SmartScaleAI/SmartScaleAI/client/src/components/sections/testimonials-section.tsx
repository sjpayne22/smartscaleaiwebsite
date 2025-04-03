import { useState, useEffect } from "react";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const testimonials = [
    {
      quote: "SmartScale AI transformed our customer service with their chatbot solution. We've seen a 40% reduction in response time and significantly improved customer satisfaction scores.",
      author: "Sarah Johnson",
      position: "CEO, RetailConnect",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400"
    },
    {
      quote: "The predictive analytics solution implemented by SmartScale AI has revolutionized our inventory management. We've reduced waste by 23% and improved our order fulfillment rate to 98%.",
      author: "Michael Rodriguez",
      position: "Operations Director, FreshGoods",
      rating: 5,
      image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400"
    },
    {
      quote: "The AI workshops conducted by SmartScale were eye-opening for our team. We now have a clear AI strategy and the knowledge to implement it. The ROI has been exceptional.",
      author: "Lisa Chen",
      position: "CFO, TechWave Solutions",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=400&h=400"
    }
  ];

  // Set up autoplay functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay) {
      interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, testimonials.length]);

  const handleCarouselChange = (index: number) => {
    setActiveIndex(index);
    // Temporarily pause autoplay when manually changed
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Hear from businesses that have successfully leveraged AI solutions with our help.</p>
        </div>
        
        {/* Carousel for larger screens */}
        <div className="hidden md:block max-w-5xl mx-auto">
          <Carousel 
            className="testimonial-carousel"
            setApi={(api) => {
              api?.on('select', () => {
                setActiveIndex(api.selectedScrollSnap());
              });
            }}
            opts={{
              loop: true,
              align: "center",
              startIndex: activeIndex
            }}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-4/5 lg:basis-3/4">
                  <div className={cn(
                    "transition-all duration-500 ease-in-out",
                    index === activeIndex 
                      ? "scale-100 opacity-100 animate-glow active-testimonial"
                      : "scale-95 opacity-70"
                  )}>
                    <div className={cn(
                      "animate-shimmer",
                      index === activeIndex ? "animate-float" : ""
                    )}>
                      <TestimonialCard 
                        quote={testimonial.quote}
                        author={testimonial.author}
                        position={testimonial.position}
                        rating={testimonial.rating}
                        image={testimonial.image}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious 
              className="left-4 lg:left-0 bg-white/90 border-[#0AB5CE]/20 hover:bg-[#0AB5CE]/10 transition-all duration-300 shadow-md hover:shadow-lg" 
              onClick={() => handleCarouselChange((activeIndex - 1 + testimonials.length) % testimonials.length)} 
            />
            <CarouselNext 
              className="right-4 lg:right-0 bg-white/90 border-[#0AB5CE]/20 hover:bg-[#0AB5CE]/10 transition-all duration-300 shadow-md hover:shadow-lg"
              onClick={() => handleCarouselChange((activeIndex + 1) % testimonials.length)} 
            />
          </Carousel>
          
          {/* Carousel indicators */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleCarouselChange(index)}
                className={cn(
                  "rounded-full transition-all duration-500 ease-in-out relative overflow-hidden",
                  index === activeIndex
                    ? "w-8 h-3 bg-[#0AB5CE] shadow-[0_0_10px_rgba(10,181,206,0.5)]" 
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                {index === activeIndex && (
                  <span className="absolute inset-0 bg-white opacity-30 animate-shimmer"></span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid layout for mobile */}
        <div className="grid md:hidden gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              rating={testimonial.rating}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-10 left-0 w-64 h-64 rounded-full bg-[#0AB5CE]/5 blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-0 w-64 h-64 rounded-full bg-[#0AB5CE]/5 blur-3xl -z-10"></div>
    </section>
  );
}

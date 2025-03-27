import { TestimonialCard } from "@/components/ui/testimonial-card";

export function TestimonialsSection() {
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

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Hear from businesses that have successfully leveraged AI solutions with our help.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </section>
  );
}

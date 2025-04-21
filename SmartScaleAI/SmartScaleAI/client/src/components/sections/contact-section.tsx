import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import { submitContactForm } from "../../services/wordpressApi";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await submitContactForm(data);
      
      if (response && response.id) {
        setIsSuccess(true);
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. We'll get back to you soon.",
        });
        reset();
      } else {
        throw new Error('Invalid server response');
      }
      
      // Reset success state after a delay
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Show error message
      toast({
        title: "Message not sent",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
      
      // Fallback to client-side success for development/demo
      if (process.env.NODE_ENV === 'development') {
        setIsSuccess(true);
        reset();
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-500 mb-8">
              Ready to explore how AI can transform your business? Schedule a free consultation or reach out with any questions. Our team is here to help.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#0AB5CE]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="h-5 w-5 text-[#0AB5CE]" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-500">info@smartscaleai.ai</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#0AB5CE]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="h-5 w-5 text-[#0AB5CE]" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-500">(386) 801-6711</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#0AB5CE]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-5 w-5 text-[#0AB5CE]" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-gray-500">3143 Autumnwood Trl<br />Apopka, Florida 32703</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://www.linkedin.com/in/stanley-payne-212092232" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                  <Linkedin className="h-5 w-5 text-gray-700" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61573967995732" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                  <Facebook className="h-5 w-5 text-gray-700" />
                </a>
                <a href="https://www.youtube.com/@SmartScaleai_ai" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                  <Youtube className="h-5 w-5 text-gray-700" />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6">Schedule a Free Consultation</h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AB5CE] focus:border-transparent" 
                    {...register("name")}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AB5CE] focus:border-transparent" 
                    {...register("email")}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-2">Company Name</label>
                  <input 
                    type="text" 
                    id="company" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AB5CE] focus:border-transparent" 
                    {...register("company")}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AB5CE] focus:border-transparent" 
                    {...register("phone")}
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">How can we help?</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0AB5CE] focus:border-transparent" 
                    {...register("message")}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>
                
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 bg-gradient-brand text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
                
                {/* Success message */}
                {isSuccess && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">Your message has been sent! We'll be in touch soon.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

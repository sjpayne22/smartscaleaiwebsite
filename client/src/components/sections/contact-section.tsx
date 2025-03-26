import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

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

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContactFormValues) => {
    contactMutation.mutate(data);
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
                  <p className="text-gray-500">info@smartscaleai.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#0AB5CE]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="h-5 w-5 text-[#0AB5CE]" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-500">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-[#0AB5CE]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-5 w-5 text-[#0AB5CE]" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-gray-500">123 Tech Avenue, Suite 200<br />San Francisco, CA 94105</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                  <Linkedin className="h-5 w-5 text-gray-700" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
                  <Facebook className="h-5 w-5 text-gray-700" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
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
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { LucideIcon } from "lucide-react";

export type ColorVariant = "turquoise" | "green" | "orange";

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
  color: ColorVariant;
}

export interface Testimonial {
  quote: string;
  author: string;
  position: string;
  rating: number;
}

export interface Insight {
  title: string;
  description: string;
  category: string;
  image: string;
  color: ColorVariant;
}

export interface CompanyValue {
  title: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

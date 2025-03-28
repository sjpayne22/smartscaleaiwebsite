import { InsightPost } from "../lib/blog-data";

/**
 * Fetch blog posts from WordPress
 * @param options - Query options (pagination, categories, etc)
 */
export function fetchPosts(options?: {
  page?: number;
  perPage?: number;
  category?: string | null;
}): Promise<InsightPost[]>;

/**
 * Fetch a single page by slug
 * @param slug - The page slug
 */
export function fetchPage(slug: string): Promise<{
  id: number;
  title: string;
  content: string;
  featuredImage?: string;
  acf: Record<string, any>;
} | null>;

/**
 * Fetch services from custom API endpoint
 */
export function fetchServices(): Promise<{
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  detailedContent: Record<string, any>;
}[]>;

/**
 * Submit contact form data to WordPress
 * @param formData - Form data
 */
export function submitContactForm(formData: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}): Promise<any>;

/**
 * Fetch testimonials from custom API endpoint
 */
export function fetchTestimonials(): Promise<{
  id: number;
  quote: string;
  author: string;
  position: string;
  rating: number;
  image?: string | null;
}[]>;
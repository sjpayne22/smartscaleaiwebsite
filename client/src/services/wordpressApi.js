import axios from 'axios';
import WPAPI from 'wpapi';

// Using WordPress.com site as the headless CMS
// Replace with your actual WordPress.com site URL
const WP_API_URL = import.meta.env.VITE_WP_API_URL || 'https://blog.smartscaleai.ai/wp-json/wp/v2';

// Initialize the WordPress API client
let wp;
try {
  wp = new WPAPI({
    endpoint: WP_API_URL.replace('/wp/v2', ''),
  });
} catch (error) {
  console.error('Failed to initialize WordPress API:', error);
}

/**
 * Fetch blog posts from WordPress
 * @param {Object} options - Query options (pagination, categories, etc)
 * @returns {Promise<Array>} Array of blog posts
 */
export const fetchPosts = async (options = {}) => {
  try {
    const { page = 1, perPage = 9, category = null } = options;
    let url = `${WP_API_URL}/posts?_embed&page=${page}&per_page=${perPage}`;
    
    if (category) {
      url += `&categories=${category}`;
    }
    
    const response = await axios.get(url);
    
    // Format response to match your current data structure
    return response.data.map(post => ({
      id: post.id,
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, ""), // Strip HTML
      slug: post.slug,
      date: post.date,
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'AI Insights',
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      color: "turquoise", // You'd need to map this from WordPress custom fields
      detailedContent: {
        publishDate: new Date(post.date).toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }),
        readTime: post.acf?.read_time || '5 min read',
        author: post._embedded?.author?.[0]?.name || 'SmartScale AI Team',
        introText: post.acf?.intro_text || '',
        sections: parseContentSections(post.content.rendered),
        conclusion: post.acf?.conclusion || ''
      }
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

/**
 * Fetch a single page by slug
 * @param {string} slug - The page slug
 * @returns {Promise<Object>} Page data
 */
export const fetchPage = async (slug) => {
  try {
    const response = await axios.get(`${WP_API_URL}/pages?slug=${slug}&_embed`);
    if (response.data.length === 0) {
      return null;
    }
    const page = response.data[0];
    
    return {
      id: page.id,
      title: page.title.rendered,
      content: page.content.rendered,
      featuredImage: page._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      acf: page.acf || {} // Advanced Custom Fields data
    };
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
};

/**
 * Fetch services from custom API endpoint
 * @returns {Promise<Array>} Array of services
 */
export const fetchServices = async () => {
  try {
    const response = await axios.get(`${WP_API_URL}/services`);
    
    // Map the response to match your current data structure
    return response.data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      icon: mapIconName(service.icon), // Convert WordPress icon name to component
      color: service.color || "turquoise",
      detailedContent: service.detailed_content || {}
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    // Return empty array to prevent app from crashing
    return [];
  }
};

/**
 * Submit contact form data to WordPress
 * @param {Object} formData - Form data
 * @returns {Promise<Object>} Response
 */
export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(`${WP_API_URL}/contact-form`, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

/**
 * Fetch testimonials from custom API endpoint
 * @returns {Promise<Array>} Array of testimonials
 */
export const fetchTestimonials = async () => {
  try {
    const response = await axios.get(`${WP_API_URL}/testimonials`);
    
    return response.data.map(testimonial => ({
      id: testimonial.id,
      quote: testimonial.quote,
      author: testimonial.author,
      position: testimonial.position,
      rating: testimonial.rating || 5,
      image: testimonial.image || null
    }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

// Helper function to parse content into sections
function parseContentSections(content) {
  // This is a simple version - you might need more sophisticated parsing
  // based on how your content is structured in WordPress
  const sections = [];
  
  // Split by h2 or h3 tags as section dividers
  const sectionRegex = /<h[23][^>]*>(.*?)<\/h[23]>([\s\S]*?)(?=<h[23]|$)/g;
  let match;
  
  while ((match = sectionRegex.exec(content)) !== null) {
    const heading = match[1].replace(/<\/?[^>]+(>|$)/g, "");
    const sectionContent = match[2].trim();
    
    // Look for bullet points
    const bulletPoints = [];
    const bulletRegex = /<li[^>]*>(.*?)<\/li>/g;
    let bulletMatch;
    
    while ((bulletMatch = bulletRegex.exec(sectionContent)) !== null) {
      bulletPoints.push(bulletMatch[1].replace(/<\/?[^>]+(>|$)/g, ""));
    }
    
    // Clean the content of bullet lists if we found bullets
    let cleanContent = sectionContent;
    if (bulletPoints.length > 0) {
      cleanContent = sectionContent.replace(/<ul[^>]*>[\s\S]*?<\/ul>/g, "").trim();
    }
    
    sections.push({
      heading,
      content: cleanContent.replace(/<\/?[^>]+(>|$)/g, "").trim(),
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined
    });
  }
  
  return sections;
}

// Helper function to map WordPress icon names to your component props
function mapIconName(iconName) {
  // This mapping should match the icon names from WordPress with your React component names
  const iconMap = {
    'brain': 'Brain',
    'settings': 'Settings',
    'cpu': 'Cpu',
    'bar-chart': 'BarChart',
    'book': 'Book',
    // Add more mappings as needed
  };
  
  return iconMap[iconName.toLowerCase()] || 'Bot'; // Default to Bot if not found
}
/**
 * Isolated WordPress API Client
 * 
 * This client safely fetches WordPress content with fallback mechanisms
 * and isolation to prevent style conflicts with the main site.
 */

import axios from 'axios';

// WordPress API URL - Same as in the original wordpressApi.js
const WP_API_URL = 'https://blog.smartscaleai.ai/wp-json/wp/v2';

// Timeout for WordPress API requests (5 seconds)
const API_TIMEOUT = 5000;

/**
 * Safely fetch posts from WordPress with built-in fallback
 * @param {Object} options - Query parameters for the WordPress API
 * @param {Array} fallbackData - Data to use if WordPress API fails
 * @returns {Promise<Array>} - Array of posts or fallback data
 */
export const fetchPostsSafely = async (options = {}, fallbackData = []) => {
  try {
    // Create an abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    // Make the API request with timeout
    const response = await axios.get(`${WP_API_URL}/posts?_embed`, {
      params: options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.data || response.data.length === 0) {
      console.warn('WordPress API returned no posts');
      return fallbackData;
    }
    
    // Map WordPress posts to the expected format
    return response.data.map(post => ({
      id: post.id,
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim(),
      content: post.content.rendered,
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'path/to/fallback/image.jpg',
      category: post.categories?.length > 0 ? post.categories[0] : 'Uncategorized',
      publishDate: new Date(post.date).toLocaleDateString(),
      // Add any additional fields you need
      detailedContent: {
        publishDate: new Date(post.date).toLocaleDateString(),
        readTime: post.acf?.read_time || '5 min read',
        author: post.acf?.author || 'SmartScale AI Team',
        introText: post.acf?.intro_text || post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim(),
        sections: post.acf?.sections || [],
        conclusion: post.acf?.conclusion || ''
      }
    }));
  } catch (error) {
    console.warn('Error fetching WordPress posts:', error.message);
    return fallbackData;
  }
};

/**
 * Safely fetch a single post by slug or ID with built-in fallback
 * @param {string|number} identifier - Post slug or ID
 * @param {Object} fallbackData - Data to use if WordPress API fails
 * @returns {Promise<Object>} - Post data or fallback
 */
export const fetchPostSafely = async (identifier, fallbackData = null) => {
  try {
    const isNumeric = !isNaN(identifier);
    const endpoint = isNumeric 
      ? `${WP_API_URL}/posts/${identifier}?_embed` 
      : `${WP_API_URL}/posts?slug=${identifier}&_embed`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await axios.get(endpoint, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const post = isNumeric ? response.data : response.data[0];
    
    if (!post) {
      console.warn(`WordPress API returned no post for: ${identifier}`);
      return fallbackData;
    }
    
    return {
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      description: post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").trim(),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      publishDate: new Date(post.date).toLocaleDateString(),
      acf: post.acf || {}
    };
  } catch (error) {
    console.warn(`Error fetching WordPress post ${identifier}:`, error.message);
    return fallbackData;
  }
};

/**
 * Safely fetch a single page from WordPress with built-in fallback
 * @param {string} slug - The page slug
 * @param {Object} fallbackData - Data to use if WordPress API fails
 * @returns {Promise<Object>} - Page data or null
 */
export const fetchPageSafely = async (slug, fallbackData = null) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await axios.get(`${WP_API_URL}/pages?slug=${slug}&_embed`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.data || response.data.length === 0) {
      console.warn(`WordPress API returned no page data for slug: ${slug}`);
      return fallbackData;
    }
    
    const page = response.data[0];
    return {
      id: page.id,
      title: page.title.rendered,
      content: page.content.rendered,
      featuredImage: page._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      acf: page.acf || {}
    };
  } catch (error) {
    console.warn(`Error fetching WordPress page ${slug}:`, error.message);
    return fallbackData;
  }
};

/**
 * Safely fetch services from WordPress with built-in fallback
 * @param {Array} fallbackData - Data to use if the API call fails
 * @returns {Promise<Array>} - Services data
 */
export const fetchServicesSafely = async (fallbackData = []) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await axios.get(`${WP_API_URL}/services`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.data || response.data.length === 0) {
      console.warn('WordPress API returned no services');
      return fallbackData;
    }
    
    // Map the response to match your current data structure
    return response.data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      icon: service.icon, // You might need a mapping function for this
      color: service.color || "turquoise",
      detailedContent: service.detailed_content || {}
    }));
  } catch (error) {
    console.warn('Error fetching services:', error.message);
    return fallbackData;
  }
};

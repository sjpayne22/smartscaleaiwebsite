/**
 * WordPress Integration Fix for SmartScale AI Website
 * 
 * This script provides a simplified WordPress integration that isolates
 * WordPress content from the main site styling to prevent CSS conflicts.
 */

(function() {
  // WordPress API URL
  const WP_API_URL = 'https://blog.smartscaleai.ai/wp-json/wp/v2';
  
  // Configuration
  const CONFIG = {
    // API request timeout in milliseconds
    timeout: 5000,
    // CSS class for isolated containers
    containerClass: 'wp-content-container',
    // Debugging mode
    debug: false
  };
  
  // Create namespace for the integration
  window.wp_integration = window.wp_integration || {};
  
  /**
   * Initialize WordPress API integration with safeguards
   * to prevent styling issues
   */
  wp_integration.init = function() {
    // Add global stylesheet for WordPress content isolation if it doesn't exist
    if (!document.getElementById('wp-isolation-styles')) {
      const style = document.createElement('style');
      style.id = 'wp-isolation-styles';
      style.textContent = getIsolationStyles();
      document.head.appendChild(style);
    }
    
    // Add class to body to indicate WordPress integration is active
    document.body.classList.add('wp-integration-active');
    
    if (CONFIG.debug) {
      console.log('WordPress integration initialized with isolation');
    }
    
    return true;
  };
  
  /**
   * Safely render WordPress content in an isolated container
   * @param {string} htmlContent - The HTML content from WordPress
   * @param {string} containerId - The ID of the container element
   */
  wp_integration.safeRender = function(htmlContent, containerId) {
    if (!htmlContent) return '';
    
    const sanitizedHtml = sanitizeWordPressContent(htmlContent);
    
    // If a container ID is provided, render to that container
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = sanitizedHtml;
        container.classList.add(CONFIG.containerClass);
      }
    }
    
    return sanitizedHtml;
  };
  
  /**
   * Sanitize WordPress content to prevent styling issues
   * @param {string} html - Raw WordPress HTML content
   * @returns {string} Sanitized HTML
   */
  function sanitizeWordPressContent(html) {
    if (!html) return '';
    
    // Use DOMParser to safely parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove style tags to prevent global style injection
    const styles = doc.querySelectorAll('style');
    styles.forEach(style => style.remove());
    
    // Convert images to responsive images
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      img.classList.add('wp-image');
      img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', 'Image');
      }
    });
    
    // Make external links open in new tabs
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://')) &&
          !href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    return doc.body.innerHTML;
  }
  
  /**
   * Fetch WordPress content with fallback mechanism
   * @param {string} endpoint - API endpoint to fetch
   * @param {Object} options - Fetch options
   * @param {Function} callback - Callback function to handle the response
   * @param {any} fallbackData - Data to use if the fetch fails
   */
  wp_integration.fetchWithFallback = function(endpoint, options, callback, fallbackData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
    
    fetch(`${WP_API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal
    })
      .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (CONFIG.debug) {
          console.log(`WordPress API data for ${endpoint}:`, data);
        }
        callback(data);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.warn(`WordPress API error (${endpoint}):`, error);
        callback(fallbackData);
      });
  };
  
  /**
   * Generate isolation CSS styles
   * @returns {string} CSS rules for WordPress content isolation
   */
  function getIsolationStyles() {
    return `
      /* WordPress content isolation */
      .${CONFIG.containerClass} {
        isolation: isolate;
        contain: content;
        box-sizing: border-box;
        max-width: 100%;
        overflow-x: hidden;
      }
      
      .${CONFIG.containerClass} * {
        box-sizing: border-box;
        max-width: 100%;
      }
      
      .${CONFIG.containerClass} img.wp-image {
        height: auto;
        max-width: 100%;
        display: block;
        margin: 1em auto;
      }
    `;
  }
  
  // Auto-initialize if the script is loaded after DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    wp_integration.init();
  } else {
    document.addEventListener('DOMContentLoaded', wp_integration.init);
  }
})();

/**
 * IsolatedWordPressContent Component
 * 
 * This component isolates WordPress content to prevent it from affecting
 * the main site's styling. It creates a container with specific styling
 * rules that reset and contain WordPress styles.
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Component that safely renders WordPress content in an isolated container
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - HTML content from WordPress API
 * @param {string} props.className - Additional CSS classes to apply
 * @param {Object} props.style - Additional inline styles
 * @returns {React.ReactElement} Isolated WordPress content
 */
const IsolatedWordPressContent = ({ content, className, style, ...props }) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current && content) {
      // Add class to body when WordPress content is loaded
      document.body.classList.add('wp-content-loaded');
      
      // Clean up function to remove class when component unmounts
      return () => {
        if (!document.querySelectorAll('.wp-content-container').length) {
          document.body.classList.remove('wp-content-loaded');
        }
      };
    }
  }, [content]);
  
  if (!content) {
    return null;
  }
  
  return (
    <div 
      ref={containerRef}
      className={cn('wp-content-container wp-api-content', className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: sanitizeWordPressContent(content) }}
      {...props}
    />
  );
};

/**
 * Sanitize WordPress content to prevent style conflicts
 * 
 * @param {string} htmlContent - Raw HTML content from WordPress
 * @returns {string} Sanitized HTML content
 */
function sanitizeWordPressContent(htmlContent) {
  if (!htmlContent) return '';
  
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Remove potentially problematic elements/attributes
  
  // 1. Remove style tags to prevent global style injection
  const styleTags = tempDiv.querySelectorAll('style');
  styleTags.forEach(tag => tag.remove());
  
  // 2. Remove inline styles from elements (optional, can comment out if needed)
  // const elementsWithStyle = tempDiv.querySelectorAll('[style]');
  // elementsWithStyle.forEach(el => el.removeAttribute('style'));
  
  // 3. Remove classes that could conflict with site styles (optional)
  // const elementsWithClass = tempDiv.querySelectorAll('[class]');
  // elementsWithClass.forEach(el => {
  //   // Keep only wp-* classes to maintain WordPress-specific styling
  //   const classes = Array.from(el.classList).filter(cls => !cls.startsWith('wp-'));
  //   classes.forEach(cls => el.classList.remove(cls));
  // });
  
  // 4. Fix image paths if needed
  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => {
    // Ensure images have proper alt text
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', 'Image');
    }
    
    // Add loading="lazy" for better performance
    img.setAttribute('loading', 'lazy');
  });
  
  // 5. Make links open in new tab if they're external
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href.startsWith('http://') || href.startsWith('https://')) && 
        !href.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  return tempDiv.innerHTML;
}

export default IsolatedWordPressContent;
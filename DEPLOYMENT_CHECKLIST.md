# SmartScale AI Website Deployment Checklist

Use this checklist to ensure a smooth deployment process for the SmartScale AI website.

## Pre-Deployment

- [ ] Verify all website content is up-to-date
- [ ] Test all forms and interactive features locally
- [ ] Check that WordPress API integration is working correctly
- [ ] Ensure all links (internal and external) are working
- [ ] Optimize all images for web
- [ ] Run final performance tests and fix any issues
- [ ] Back up current website files (if updating an existing site)

## Deployment Tasks

- [ ] Set up WordPress instance as headless CMS (if not already done)
- [ ] Configure WordPress to enable CORS for API requests
- [ ] Purchase domain "smartscaleai.ai" (if not already owned)
- [ ] Set up hosting account on HostGator (or preferred provider)
- [ ] Upload files from `dist/public/` to web host
- [ ] Set up SSL certificate for secure HTTPS connections
- [ ] Configure DNS to point domain to hosting provider
- [ ] Set up .htaccess file for client-side routing (already included in build)

## Post-Deployment Testing

- [ ] Verify all pages load correctly
- [ ] Test contact form submission
- [ ] Verify blog posts load from WordPress API
- [ ] Test Sparky chatbot in both modes (local and WebSocket)
- [ ] Check responsive design on multiple devices (mobile, tablet, desktop)
- [ ] Verify SSL is working correctly (green lock in browser)
- [ ] Test site loading speed with tools like Google PageSpeed Insights
- [ ] Check that all analytics tracking is working correctly (if applicable)

## WordPress Headless CMS Setup

- [ ] Install and configure necessary WordPress plugins:
  - [ ] WP REST API
  - [ ] JWT Authentication for WP REST API
  - [ ] Custom Post Types UI
  - [ ] Advanced Custom Fields
- [ ] Create custom post types for services, testimonials, etc.
  - [ ] Services
  - [ ] Testimonials
  - [ ] Insights/Blog
- [ ] Import initial content
- [ ] Configure user roles and permissions

## Final Steps

- [ ] Submit sitemap to search engines (Google, Bing)
- [ ] Set up Google Search Console and Bing Webmaster Tools
- [ ] Configure any necessary 301 redirects (if migrating from another site)
- [ ] Implement and test Google Analytics or other tracking tools
- [ ] Perform a final security scan

## Maintenance Plan

- [ ] Set up regular backups
- [ ] Establish update schedule for WordPress plugins
- [ ] Create content calendar for blog posts
- [ ] Plan for periodic performance and security reviews
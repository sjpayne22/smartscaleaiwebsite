# WordPress API Integration Checklist for SmartScale AI Website

Use this checklist to ensure proper WordPress API integration before and after deployment.

## WordPress.com Configuration

### Required Plugins

- [ ] **Custom Post Types UI** - For creating custom post types like services, testimonials
- [ ] **Advanced Custom Fields** - For adding custom fields to posts and pages
- [ ] **REST API Filter Fields** - For custom filtering of API responses
- [ ] **JWT Authentication for WP REST API** - For secure API authentication

### CORS Configuration

- [ ] Add CORS headers to WordPress site via functions.php snippet:

```php
add_action('init', function() {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
});
```

### API Endpoints Configuration

- [ ] Verify REST API is enabled in WordPress settings
- [ ] Confirm Custom Post Types are exposed to the REST API
- [ ] Test that ACF fields are accessible via the API

## Local API Testing

### Connection Testing

- [ ] Run the WordPress API connection test:
  ```bash
  node check-wordpress-connection-fixed.js
  ```

- [ ] Verify basic connectivity to WordPress API
- [ ] Check all required endpoints are accessible
- [ ] Test authentication if applicable

### Data Validation

- [ ] Verify all required fields are present in API responses
- [ ] Check image URLs are properly formatted
- [ ] Validate date formats and other structured data

## Frontend Integration

### API Client Configuration

- [ ] Update WordPress API base URL in the frontend code
- [ ] Set proper error handling for API failures
- [ ] Implement loading states during API requests

### Component Integration

- [ ] Blog component uses React Query for data fetching
- [ ] Service cards properly display WordPress data
- [ ] Testimonials load correctly from WordPress API
- [ ] Contact form submits to WordPress API

## Post-Deployment Verification

### API Connectivity

- [ ] Verify deployed site can connect to WordPress API
- [ ] Check browser console for CORS errors
- [ ] Test all API-dependent features

### Content Management

- [ ] Create a test post in WordPress admin
- [ ] Verify it appears on the deployed site
- [ ] Test content updates propagate correctly

## Common Issues and Solutions

### CORS Errors

**Problem**: API requests blocked by CORS policy

**Solutions**:
- Verify WordPress CORS headers are correctly set
- Check that request headers match allowed headers
- Confirm API URL matches the allowed origin

### Authentication Issues

**Problem**: Cannot authenticate with WordPress API

**Solutions**:
- Check JWT plugin is correctly configured
- Verify authentication credentials
- Ensure token is properly included in requests

### Missing Content

**Problem**: Content not appearing from WordPress

**Solutions**:
- Verify custom post types are properly registered
- Check that fields are exposed in REST API
- Confirm API response structure matches frontend expectations

## API Endpoint Reference

```
# Main endpoints
${WORDPRESS_BASE_URL}/wp-json/wp/v2/posts
${WORDPRESS_BASE_URL}/wp-json/wp/v2/pages
${WORDPRESS_BASE_URL}/wp-json/wp/v2/testimonials (custom post type)
${WORDPRESS_BASE_URL}/wp-json/wp/v2/services (custom post type)

# Contact form endpoint (using WP forms or custom endpoint)
${WORDPRESS_BASE_URL}/wp-json/contact-form-7/v1/contact-forms/{form_id}/feedback
```

## Troubleshooting Tools

- Use `curl` to test API endpoints directly:
  ```bash
  curl -H "Content-Type: application/json" ${WORDPRESS_BASE_URL}/wp-json/wp/v2/posts
  ```
  
- Use browser Network tab to monitor API requests
- Check WordPress error logs for server-side issues

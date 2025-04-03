# SmartScale AI Website Deployment Guide

This document provides instructions for deploying the SmartScale AI website to a web hosting service like HostGator.

## Deployment Files

The application has been built and the production files are located in the `dist` directory:

- `dist/public/` - Contains all static frontend files (HTML, CSS, JavaScript, images)
- `dist/index.js` - The server-side Node.js application

## Deployment Options

### Option 1: Static Site Deployment (Frontend Only)

If you wish to deploy just the frontend and handle the backend separately (e.g., WordPress API is hosted elsewhere):

1. Upload the contents of the `dist/public/` directory to the web root of your hosting service.
2. Configure `.htaccess` for client-side routing:

```
# .htaccess file for React single-page application
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Option 2: Full-Stack Deployment (Frontend + Backend)

If you want to deploy both the frontend and backend together:

1. Ensure your hosting service supports Node.js applications.
2. Upload the entire `dist/` directory to your hosting service.
3. Install dependencies using npm:
   ```
   npm install express ws
   ```
4. Start the server:
   ```
   node dist/index.js
   ```
5. Configure your hosting service to run the Node.js application (varies by provider).

## WordPress Headless CMS Configuration

Since you're using WordPress as a headless CMS:

1. Ensure your WordPress installation has the necessary plugins:
   - WP REST API
   - JWT Authentication for WP REST API (if using JWT)
   - Custom Post Types UI (for services, testimonials, etc.)
   - Advanced Custom Fields (for extended content)

2. Enable CORS in your WordPress site to allow API requests from your frontend domain:
   - Add the following to your WordPress theme's `functions.php`:

```php
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    if ('OPTIONS' == $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
});
```

3. Update the API URLs in your React application to point to your WordPress site.

## SSL Configuration

For secure HTTPS connections:

1. Obtain an SSL certificate for your domain (many hosting providers offer free Let's Encrypt certificates).
2. Enable HTTPS in your hosting control panel.
3. Configure your site to redirect HTTP to HTTPS.

## Domain Configuration

To set up your custom domain (smartscaleai.ai):

1. Purchase the domain (if not already owned).
2. Update your DNS settings to point to your hosting provider.
3. Configure the domain in your hosting control panel.

## Post-Deployment Verification

After deployment, verify:

1. All pages load correctly.
2. The contact form submits successfully.
3. The blog posts load from the WordPress API.
4. The chatbot works in both modes (local and WebSocket).
5. All images and assets load properly.
6. The site works on mobile, tablet, and desktop devices.

## Troubleshooting

- If static assets don't load, check path references in the HTML/CSS.
- If API calls fail, verify CORS configuration and API endpoint URLs.
- For WebSocket issues, ensure your hosting provider supports WebSocket connections.
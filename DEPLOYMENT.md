# SmartScale AI Website Deployment Guide

## Overview

This document provides detailed instructions for deploying the SmartScale AI website. The site can be deployed to two primary environments:

1. **GitHub Pages**: Used for development, testing, and staging
2. **Vercel**: Used for production at smartscaleai.ai

Each deployment target requires specific configuration to ensure proper functionality.

## Prerequisites

Before deployment, ensure you have:

- Node.js installed (version 14 or later)
- Access to the GitHub repository
- Vercel account (for production deployment)
- All code changes committed and pushed

## Deployment Options

### GitHub Pages Deployment

GitHub Pages is used for development and testing. Follow these steps to deploy:

1. **Build the project for GitHub Pages**:

   ```bash
   node build.js github
   ```

   This script will:
   - Build the React application
   - Fix asset paths to use relative references (`./assets/`)
   - Add a proper base tag to the HTML
   - Create a 404.html page that redirects to index.html

2. **Deploy using the automated script**:

   ```bash
   node deploy-github.js
   ```

   This will build and deploy the site to GitHub Pages in one step.

3. **Verify the deployment**:
   - Check that the site is accessible at your GitHub Pages URL
   - Test all features and navigation
   - Verify WordPress API integration

Refer to [GITHUB_PAGES.md](GITHUB_PAGES.md) for detailed GitHub Pages deployment information.

### Vercel Deployment (Production)

Vercel is used for the production site at smartscaleai.ai. Follow these steps to deploy:

1. **Build the project for Vercel**:

   ```bash
   node vercel-build.js
   ```

   This script will:
   - Build the React application
   - Fix asset paths to use absolute references (`/assets/`)
   - Add a proper base tag to the HTML
   - Copy the Vercel configuration to the build directory

2. **Deploy using the automated script**:

   ```bash
   node deploy-vercel.js
   ```

   This will build and deploy the site to Vercel in one step.

3. **Verify the deployment**:
   - Check that the site is accessible at the Vercel URL provided
   - Test all features and navigation
   - Verify WordPress API integration

Refer to [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) for detailed Vercel deployment information.

## Critical Deployment Files

### Configuration Files

- **vercel.json**: Contains configuration for Vercel deployment
- **404.html**: Handles SPA routing for GitHub Pages
- **index.html**: The main entry point for the application

### Deployment Scripts

- **build.js**: Builds the project for any deployment target
- **build-vercel.js**: Special build script for Vercel
- **deploy-github.js**: Automates GitHub Pages deployment
- **deploy-vercel.js**: Automates Vercel deployment
- **fix-asset-paths.js**: Fixes asset references based on deployment target
- **fix-html-file.js**: Ensures HTML files have correct base tags and paths

## WordPress Integration

The website connects to WordPress.com as a headless CMS. Ensure the WordPress API is properly configured:

1. CORS headers are set up
2. Custom post types are available through the API
3. Authentication is working correctly (if used)

Test the WordPress connection with the diagnostic tool:

```bash
node check-wordpress-connection.js
```

## Troubleshooting

### Common Issues

1. **Asset loading failures**: Usually related to incorrect path references. Check for correct base tag and asset paths.
2. **SPA routing issues**: If page refreshes result in 404 errors, ensure proper redirect configurations are in place.
3. **API connectivity problems**: Verify CORS settings on the WordPress installation.

### Log Files

Both GitHub Pages and Vercel provide deployment logs that can help diagnose issues:

- Check GitHub Actions logs for GitHub Pages deployments
- Check the Vercel dashboard for production deployment logs

## Deployment Checklist

Use the [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) document to ensure all deployment steps are completed correctly.

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [WordPress REST API Documentation](https://developer.wordpress.org/rest-api/)

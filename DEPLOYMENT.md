# SmartScale AI Website Deployment Documentation

This document serves as the index to all deployment-related documentation for the SmartScale AI website.

## Overview

The SmartScale AI website is built with React using Vite and is designed to be deployed to both Vercel (for production) and GitHub Pages (for testing/development). It uses WordPress.com as a headless CMS for content management.

## Deployment Guides

### Deployment Preparation

- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Comprehensive checklist of items to verify before, during, and after deployment

### Deployment Targets

- [Vercel Deployment Guide](./DEPLOY_TO_VERCEL.md) - Instructions for deploying to Vercel
- [Vercel Deployment with CSS Fixes](./DEPLOY_TO_VERCEL_WITH_FIXES.md) - Special guide for addressing CSS formatting issues on Vercel
- [GitHub Pages Deployment Guide](./GITHUB_PAGES.md) - Instructions for deploying to GitHub Pages

### Integration Guides

- [WordPress API Integration Checklist](./WORDPRESS_API_CHECKLIST.md) - Guide for setting up and testing WordPress API integration
- [WebSocket Configuration Guide](./WEBSOCKET_CONFIGURATION.md) - Instructions for setting up and testing WebSockets

## Deployment Scripts

### Build Scripts

- `vercel-build-new.js` - Enhanced build script for Vercel deployment
- `build.js` - General-purpose build script
- `build.ps1`/`build.bat` - Windows build scripts

### Deployment Scripts

- `deploy-vercel.js` - Automated Vercel deployment script
- `deploy-github.js` - Automated GitHub Pages deployment script

### Path Fixing and Asset Scripts

- `fix-vercel-paths.js` - Fixes asset paths for Vercel deployment
- `fix-css-paths.js` - Fixes CSS-specific formatting issues
- `fix-asset-paths.js` - Generic asset path fixer
- `create-test-build.js` - Creates a test build to verify path fixing

## Testing Tools

- `check-wordpress-connection-fixed.js` - Tests WordPress API connectivity
- `test-websocket.html` - Simple page for testing WebSocket connections

## Deployment Flow

1. **Preparation**:
   - Verify code changes are committed
   - Run through the [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
   - Test WordPress API connection

2. **Build**:
   - For Vercel: Run `node vercel-build-new.js`
   - For GitHub Pages: Run `node build.js github`

3. **Deploy**:
   - For Vercel: Run `node deploy-vercel.js`
   - For GitHub Pages: Run `node deploy-github.js`

4. **Verify**:
   - Open the deployed site
   - Check for any console errors
   - Test WordPress integration
   - Verify all features are working

## Common Issues

### CSS Not Loading

If CSS is not loading properly, check:
- Content-Type headers are properly set
- Asset paths are correct (absolute for Vercel, relative for GitHub Pages)
- No MIME type warnings in the console

Solutions:
- Use the `fix-css-paths.js` script
- Ensure `_headers` file is present in the build
- Verify `vercel.json` has proper content type configurations

### WordPress API Connection Issues

If WordPress API is not connecting, check:
- CORS is properly configured
- API endpoints are accessible
- Authentication is working if required

Solutions:
- Run the WordPress API connection test
- Check for CORS errors in the console
- Verify API URL is correct

### Deployment Failures

If deployment fails, check:
- Build process completes successfully
- No 404 errors for assets
- Correct environment variables are set

Solutions:
- Use the enhanced build scripts
- Verify path fixing is working
- Check deployment logs for specific errors

## Contact

For deployment assistance, contact:
- Stanley Payne (stanley@smartscaleai.ai)
- Technical Support (support@smartscaleai.ai)

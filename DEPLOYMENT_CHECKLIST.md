# Deployment Checklist for SmartScale AI Website

Use this checklist to ensure successful deployment of the SmartScale AI website to either GitHub Pages or Vercel.

## Pre-Deployment

- [ ] All code changes are committed and pushed to the repository
- [ ] Website has been tested locally and all features are working
- [ ] WordPress API connection has been tested and is working correctly
- [ ] No console errors appear in the browser developer tools
- [ ] Website is responsive on all tested device sizes
- [ ] All images and assets are optimized for web
- [ ] SEO meta tags are properly set in index.html

## GitHub Pages Deployment

- [ ] Use the GitHub Pages build script:
      ```bash
      node build.js github
      ```
      or
      ```bash
      node deploy-github.js
      ```
- [ ] Verify that asset paths use relative references (`./assets/`)
- [ ] Verify `<base href="./">` is present in the HTML
- [ ] Custom domain is configured in GitHub repository settings (if applicable)
- [ ] HTTPS is enforced in GitHub Pages settings

## Vercel Deployment

- [ ] Use the Vercel build script:
      ```bash
      node vercel-build.js
      ```
      or
      ```bash
      node deploy-vercel.js
      ```
- [ ] Verify that asset paths use absolute references (`/assets/`)
- [ ] Verify `<base href="/">` is present in the HTML
- [ ] The `vercel.json` configuration file is included in the build
- [ ] Environment variables are configured in the Vercel dashboard (if applicable)
- [ ] Custom domain is configured in the Vercel dashboard (if applicable)

## Post-Deployment

- [ ] Test all website navigation and features on the live site
- [ ] Verify WordPress API integration is working on the deployed site
- [ ] Test form submissions on the live site
- [ ] Verify all links are working correctly
- [ ] Check that analytics is tracking properly (if applicable)
- [ ] Test chatbot functionality on the live site
- [ ] Verify the site is secure (HTTPS only)
- [ ] Test website performance using tools like Lighthouse
- [ ] Verify the site has proper cache headers for assets

## WordPress Configuration

- [ ] WordPress REST API endpoints are accessible from the deployed domain
- [ ] CORS headers are properly configured on the WordPress server
- [ ] Custom post types and fields are accessible via the API
- [ ] JWT authentication is working correctly (if applicable)
- [ ] WordPress permalinks are set to "Post name" (/sample-post/)

## DNS & Domain Configuration

- [ ] DNS records are properly configured for the custom domain
- [ ] CNAME records are set up correctly for GitHub Pages or Vercel
- [ ] A records point to the correct IP addresses
- [ ] Domain has proper SSL/TLS certificate
- [ ] www subdomain redirects to the main domain (or vice versa)

## Rollback Plan

In case of deployment issues:

1. For GitHub Pages: Revert to the previous successful commit and redeploy
2. For Vercel: Use the Vercel dashboard to roll back to a previous deployment
3. For critical issues: Temporarily point the domain to a maintenance page

## Contact Information

If you encounter deployment issues, contact:

- Stanley Payne (stanley@smartscaleai.ai)
- Technical Support (support@smartscaleai.ai)

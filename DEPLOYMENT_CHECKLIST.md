# SmartScale AI Website Deployment Checklist

Use this checklist to ensure a successful deployment of the SmartScale AI website to Vercel.

## Pre-Deployment Preparations

- [ ] Ensure all code changes are committed to the repository
- [ ] Run build locally to verify it completes successfully with `node vercel-build-new.js`
- [ ] Check that all assets (images, fonts, etc.) are properly referenced
- [ ] Verify all APIs are properly configured and accessible
- [ ] Test WordPress API connection with `node check-wordpress-connection-fixed.js`
- [ ] Check for any hardcoded URLs that may need to be updated

## CSS and Asset Path Verification

- [ ] Run the test build script: `node create-test-build.js`
- [ ] Verify that all asset paths in HTML are absolute (start with `/`)
- [ ] Confirm CSS files have proper MIME types in _headers file
- [ ] Check that all `url()` references in CSS are fixed to use absolute paths
- [ ] Ensure the base tag is present: `<base href="/">`

## Deployment Process

- [ ] Run the Vercel deployment script: `node deploy-vercel.js`
- [ ] When prompted, confirm that you want to use the new build process
- [ ] Wait for the build and deployment to complete
- [ ] Check the deployment URL provided by Vercel

## Post-Deployment Verification

- [ ] Open the deployed site in multiple browsers
- [ ] Verify that CSS is loading correctly (no MIME type errors)
- [ ] Check that all images and assets load properly
- [ ] Test responsive layouts on different device sizes
- [ ] Ensure API connections work in the deployed environment
- [ ] Test the WordPress integration
- [ ] Verify WebSocket functionality if applicable

## Common Issues and Solutions

### CSS Not Loading

**Problem**: CSS files are not being applied to the page

**Solutions**:
- Check the network tab in browser dev tools for 404 errors
- Verify MIME types are correct (`text/css` for CSS files)
- Ensure paths are absolute in the deployed environment
- Check for CORS issues if loading from external domains

### Missing Assets

**Problem**: Images or other assets not displaying

**Solutions**:
- Check for 404 errors in the console
- Verify paths are corrected from relative to absolute
- Ensure assets are included in the build directory

### API Connection Issues

**Problem**: Cannot connect to WordPress or other APIs

**Solutions**:
- Verify API endpoints are correct
- Check CORS headers are properly configured
- Test API connectivity with the check script
- Verify API keys and authentication are working

## Production Domain Configuration

- [ ] Set up custom domain in Vercel dashboard
- [ ] Configure DNS settings at domain registrar
- [ ] Verify SSL certificate is properly provisioned
- [ ] Test the site on the production domain
- [ ] Update WordPress API connection settings if needed

## Final Verification

- [ ] Complete a full site functional test on production domain
- [ ] Verify analytics and tracking are working
- [ ] Check all forms submit properly
- [ ] Test site performance and loading speed
- [ ] Ensure all SEO elements are correctly implemented

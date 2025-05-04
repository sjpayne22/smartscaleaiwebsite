# Deploying SmartScale AI Website to GitHub Pages

This guide walks through the process of deploying the SmartScale AI website to GitHub Pages, which is used for development and testing purposes.

## Prerequisites

- Git installed and configured
- Access to the GitHub repository (github.com/sjpayne22/smartscaaleai-website)
- Node.js 14+ installed

## Step-by-Step Deployment Guide

### 1. Prepare Your Environment

Ensure you have Git properly configured with your credentials:

```bash
# Configure Git (if not already set up)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Use the Automated Deployment Script

We've created a fully automated deployment script that handles the entire process for you:

```bash
node deploy-github.js
```

The script will:

1. Check if Git is installed and configured
2. Build the project using the GitHub Pages configuration
3. Fix asset paths for GitHub Pages (using relative paths)
4. Commit and push the build to the gh-pages branch

### 3. Manual Deployment (Alternative)

If you prefer to go through each step manually:

```bash
# Build the project for GitHub Pages
node build.js github

# Create or switch to the gh-pages branch
git checkout -b gh-pages

# Add all files from the build directory
git add -f build

# Commit the changes
git commit -m "Update GitHub Pages deployment"

# Push to the gh-pages branch
git push origin gh-pages -f

# Switch back to your working branch
git checkout main
```

## Key Configurations for GitHub Pages

GitHub Pages deployment uses several specific configurations:

1. **Relative Paths**: Uses relative paths (`./assets/`) instead of absolute paths
2. **Base Tag**: Sets `<base href="./">` for proper path resolution
3. **404 Page**: Includes a custom 404.html page for proper SPA routing
4. **Path Fixer**: Runs `fix-asset-paths.js github` to ensure paths are correct

## GitHub Pages URL Structure

Once deployed, your site will be available at:

```
https://sjpayne22.github.io/smartscaaleai-website/
```

## Testing Your Deployment

After deployment, verify that:

1. The site loads correctly at the GitHub Pages URL
2. CSS is applied properly and images load
3. All features work as expected
4. Navigation works correctly

## Common Issues with GitHub Pages

### Asset Loading Issues

**Problem**: Assets (CSS, images) fail to load

**Solution**:
- Make sure all paths are relative (starting with `./`)
- Check that the base tag is present and set to `<base href="./">`
- Verify no absolute paths are used in CSS or HTML

### 404 Errors on Page Refresh

**Problem**: Page refreshes result in a 404 error

**Solution**:
- This is a common issue with SPAs on GitHub Pages
- Use the custom 404.html page and redirect script included in the build
- Consider using hash-based routing for GitHub Pages

### CORS Issues with WordPress API

**Problem**: Cannot connect to WordPress API from GitHub Pages

**Solution**:
- Verify WordPress CORS settings allow requests from GitHub Pages domain
- Check browser console for specific CORS errors
- Consider using a CORS proxy for development/testing

## GitHub Pages vs. Production Deployment

It's important to understand the differences between GitHub Pages deployment and the production Vercel deployment:

1. **Path Handling**: GitHub Pages uses relative paths, Vercel uses absolute paths
2. **Base URL**: Different base URLs affect API endpoint configuration
3. **CORS Settings**: May need different CORS configurations

When testing on GitHub Pages, be aware of these differences and account for them in your code.

## Alternative GitHub Deployments

If you need more features than GitHub Pages provides:

1. **GitHub Actions**: Set up a custom workflow for more control
2. **Custom Domain**: Configure a custom domain for your GitHub Pages site

## Local Preview Before Deployment

To verify your build will work on GitHub Pages without deploying:

```bash
# Create a GitHub Pages build
node build.js github

# Serve it locally
npx serve build
```

This simulates how the site will behave when deployed to GitHub Pages.

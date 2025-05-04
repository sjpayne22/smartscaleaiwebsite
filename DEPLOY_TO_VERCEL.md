# Deploying SmartScale AI Website to Vercel

This guide walks you through the process of deploying the SmartScale AI website to Vercel, ensuring all assets and CSS files are correctly served.

## Prerequisites

- Vercel CLI installed
- Node.js 14+ installed
- A Vercel account

## Step-by-Step Deployment Guide

### 1. Prepare Your Environment

Make sure you have the Vercel CLI installed and that you're logged in:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

### 2. Use the Automated Deployment Script

We've created a fully automated deployment script that handles the entire process for you:

```bash
node deploy-vercel.js
```

The script will:

1. Check if Vercel CLI is installed and offer to install it if needed
2. Verify you're logged in to Vercel
3. Build the project using the enhanced build script
4. Fix asset paths and CSS content types
5. Deploy to either preview or production based on your choice

### 3. Manual Deployment (Alternative)

If you prefer to go through each step manually:

```bash
# Build the project for Vercel
node vercel-build-new.js

# Deploy to preview
vercel

# Or deploy to production
vercel --prod
```

## Key Improvements for Vercel Deployment

Our build process includes several key improvements to ensure proper operation on Vercel:

1. **Path Correction**: All relative paths (`./assets/`) are converted to absolute paths (`/assets/`)
2. **Base Tag**: Adds `<base href="/">` to ensure proper path resolution
3. **Content Type Headers**: Adds `_headers` file to ensure proper MIME types for assets
4. **URL Paths in CSS**: Fixes `url()` references in CSS files to use absolute paths
5. **Deployment Indication**: Adds `data-deployment="vercel"` attribute to the HTML tag

## Testing Your Deployment

After deployment, verify that:

1. The site loads correctly without errors in the browser console
2. CSS is applied properly and images load
3. All features (animations, forms, etc.) work as expected
4. The WordPress API integration works correctly

## Additional Configuration in Vercel Dashboard

After deployment, you may want to configure additional settings in the Vercel dashboard:

1. Set up a custom domain
2. Configure environment variables
3. Set up deployment notifications
4. Enable performance monitoring

## Troubleshooting

If you encounter issues with CSS loading, check:

- The Network tab in browser dev tools to see if CSS files are loading with the correct MIME type
- That the `_headers` file is present in the deployed build
- That all asset paths in the HTML are absolute (start with `/`)

For other deployment issues, consult the Vercel documentation or use the test script to verify path fixing:

```bash
node create-test-build.js
```

## Local Verification Before Deployment

To verify your build will work on Vercel without actually deploying, run:

```bash
# Create a test build with all Vercel-specific fixes
node create-test-build.js

# Serve the build locally
npx serve test-build
```

This will create a test build with all the necessary fixes applied and serve it locally for verification.

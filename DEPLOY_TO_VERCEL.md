# Deploying to Vercel

## Overview

This guide explains how to deploy the SmartScale AI website to Vercel. The deployment has been configured to handle SPA (Single Page Application) routing correctly and ensure all assets are properly referenced.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- The Vercel CLI installed (optional)
- Git repository with your code

## Deployment Options

### Option 1: Direct Deployment Through the Vercel UI

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import your Git repository
4. Configure the project with the following settings:
   - Framework Preset: Other
   - Build Command: `node vercel-build.js`
   - Output Directory: `build`
5. Click "Deploy"

### Option 2: Using the Deploy Script

We've included a convenient deploy script for Vercel that handles everything for you:

```bash
node deploy-vercel.js
```

This script will:
1. Build the project specifically for Vercel deployment
2. Fix asset paths to use absolute references (starting with `/`)
3. Deploy the project to Vercel using the Vercel CLI

## Understanding the Vercel Build Process

The `vercel-build.js` script handles several important tasks:

1. Runs the standard build process
2. Copies Vercel configuration to the build directory
3. Fixes asset paths to use absolute references (starting with `/`)
4. Adds a proper `<base href="/">` tag to the HTML
5. Creates necessary redirect configurations

## Environment Variables

If you need environment variables for your production deployment, add them through the Vercel UI:

1. Go to your project on the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add your environment variables

## Troubleshooting

### Asset Loading Issues

If assets aren't loading correctly:

1. Verify the `<base href="/">` tag is present in the HTML
2. Check that assets use absolute paths starting with `/`
3. Confirm the Vercel configuration has proper rewrites

### Routing Issues

If navigation within the SPA isn't working:

1. Ensure `vercel.json` contains the catch-all rewrite rule
2. Verify your React router is configured correctly

### Build Failures

If the build fails:

1. Check the build logs in the Vercel console
2. Ensure `vercel-build.js` is present in your repository root
3. Try running the build locally first with `node vercel-build.js`

## Post-Deployment

After successful deployment, Vercel will provide you with a preview URL. Test your deployment on this URL before connecting it to your production domain.

To connect your domain:

1. Go to "Project Settings" > "Domains"
2. Add your domain and configure DNS as instructed

## Support

If you encounter issues with the Vercel deployment, check the deployment logs in the Vercel dashboard or contact Vercel support for platform-specific questions.

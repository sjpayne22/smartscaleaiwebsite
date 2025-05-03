# Deploying to Vercel

This guide explains how to deploy your SmartScale AI React app to Vercel.

## Step 1: Build Your Application

```bash
# Build the application
npm run build

# Prepare the build for Vercel
node build-vercel.js
```

## Step 2: Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project directory:
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Build Command: `npm run build && node build-vercel.js`
   - Output Directory: `build`
5. Click "Deploy"

## Step 3: Configure Custom Domain

1. In your Vercel project dashboard, go to Settings → Domains
2. Add your domain (smartscaleai.ai)
3. Follow Vercel's instructions to update your DNS settings in Cloudflare

## Important Configuration Details

### vercel.json

The `vercel.json` file in this project configures:

1. **URL Rewrites** - Ensures all routes point to index.html for SPA routing
2. **Asset Handling** - Properly serves assets with correct caching
3. **Security Headers** - Sets appropriate security headers for production

### Asset Path Fixing

The `build-vercel.js` script ensures:

1. All asset paths are properly formatted for production
2. A base tag is included for proper routing

## Troubleshooting

If you encounter issues with asset loading:

1. Check that vercel.json is correctly deployed
2. Verify that build-vercel.js ran successfully
3. Inspect the source HTML in the browser to confirm asset paths

If routes aren't working correctly:

1. Make sure the rewrite rules in vercel.json are correct
2. Check for any route-specific code in your React application

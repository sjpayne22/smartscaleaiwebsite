# GitHub Pages Deployment Guide for SmartScale AI Website

This guide provides step-by-step instructions for deploying the SmartScale AI website to GitHub Pages.

## Prerequisites

- Git installed on your local machine
- Node.js and npm installed
- Access to the GitHub repository

## Build Process for GitHub Pages

### For Windows Users (PowerShell)

1. Open PowerShell in your project directory
2. Run the build script:
   ```powershell
   ./build.ps1
   ```
3. This will:
   - Build the project using Vite
   - Create necessary files for GitHub Pages compatibility
   - Set up the required redirects for SPA routing

### For Mac/Linux Users

1. Open Terminal in your project directory
2. Run the build script:
   ```bash
   node build.js
   ```

## Deploying to GitHub Pages

### Option 1: Deploy via GitHub Settings

1. Commit and push all changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git push origin main
   ```

2. Go to your repository on GitHub
3. Click on "Settings"
4. Navigate to "Pages" in the sidebar
5. Under "Build and deployment" > "Source", select "Deploy from a branch"
6. For "Branch", select "main" and "/" (root) or "/build" if available
7. Click "Save"
8. Wait for GitHub to build and deploy your site

### Option 2: Deploy via GitHub Actions

For more advanced deployments, you can set up a GitHub Actions workflow:

1. Create a file `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build
          branch: gh-pages
```

2. Commit and push this file to your repository
3. GitHub Actions will automatically build and deploy your site
4. Go to repository Settings > Pages and set the source to the `gh-pages` branch

## Troubleshooting

### 404 Errors When Navigating

If you encounter 404 errors when navigating directly to routes like `/blog`:

1. Ensure the 404.html file is present in your repository root
2. Make sure the JavaScript redirect code in index.html is working correctly
3. Check that your router in App.tsx has the correct base path:
   ```jsx
   const basePath = window.location.hostname === 'sjpayne22.github.io' ? '/smartscaaleai-website' : '';
   ```

### Asset Loading Issues

If assets (JS, CSS, images) aren't loading:

1. Check the paths in your built index.html
2. Make sure they use relative paths that start with `./` instead of absolute paths that start with `/`
3. If GitHub Pages is serving from a subdirectory, ensure all asset paths include this subdirectory

## Testing Your Deployment

After deployment, test the following:

1. Home page loads correctly
2. Navigation between pages works
3. Direct links to routes (e.g., https://sjpayne22.github.io/smartscaaleai-website/blog) work
4. All images and assets load properly
5. The contact form functions correctly
6. The blog posts load from WordPress API
7. Sparky chatbot functions in both modes

## For Production at smartscaleai.ai

For deploying to your actual production domain:

1. Use the build output from the `build` directory
2. Upload these files to your HostGator hosting
3. Make sure your production `.htaccess` file is properly configured
4. Test all functionality on the production domain

## Getting Help

If you encounter issues with GitHub Pages deployment, check:

- [GitHub Pages documentation](https://docs.github.com/en/pages)
- [Single Page Apps on GitHub Pages](https://github.com/rafgraph/spa-github-pages) for SPA routing solutions

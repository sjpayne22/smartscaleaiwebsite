# GitHub Pages Deployment Guide

## Overview

GitHub Pages serves as our development and testing environment for the SmartScale AI website. This document outlines the specific steps and considerations for deploying to GitHub Pages.

## Prerequisites

Before deploying to GitHub Pages, ensure:

- Your code repository has GitHub Pages enabled in repository settings
- You have appropriate permissions to the repository
- All code changes are committed and pushed

## GitHub Pages Specific Configuration

Unlike Vercel, GitHub Pages serves content from a repository subdirectory or branch. Our repository is configured to deploy from:

- Branch: `gh-pages`
- Folder: `/` (root of the branch)

## Deployment Process

### Option 1: Using the Automated Script

The simplest way to deploy is using our automated script:

```bash
node deploy-github.js
```

This script will:
1. Build the project specifically for GitHub Pages
2. Fix asset paths to use relative references (starting with `./`)
3. Create a `gh-pages` branch if it doesn't exist
4. Push the built files to the `gh-pages` branch

### Option 2: Manual Deployment

If you prefer to deploy manually:

1. Build the project for GitHub Pages:

   ```bash
   node build.js github
   ```

2. Create and switch to the gh-pages branch:

   ```bash
   git checkout -b gh-pages
   ```

3. Copy the build files to this branch:

   ```bash
   cp -r build/* .
   ```

4. Commit and push the changes:

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## Asset Path Configuration

Unlike Vercel, GitHub Pages typically serves content from a project subdirectory, which requires relative paths for assets.

Our build process automatically:

1. Adds `<base href="./">` to the HTML documents
2. Converts asset references from absolute (`/assets/`) to relative (`./assets/`)
3. Creates a 404.html file that redirects to index.html for SPA routing

## SPA Routing on GitHub Pages

GitHub Pages doesn't natively support SPA routing, so we use a 404 page redirect technique:

1. When a direct URL is accessed (e.g., `/blog/article-1`)
2. GitHub Pages initially returns a 404 error
3. Our custom 404.html page redirects to index.html with the original path stored in the URL hash
4. The React router then processes this hash and renders the correct page

## Testing Your Deployment

After deployment, test your site at your GitHub Pages URL:

```
https://username.github.io/repo-name/
```

Ensure all the following work correctly:

1. Initial page load
2. Navigation between routes
3. Direct access to deep links (e.g., `/blog/article-1`)
4. WordPress API integration
5. Assets loading properly

## Using a Custom Domain with GitHub Pages

If you want to use a custom domain for your GitHub Pages deployment:

1. Add your custom domain in the repository settings under "Pages"
2. Create a CNAME file in the root of your `gh-pages` branch containing your domain name
3. Configure your domain's DNS settings with appropriate CNAME or A records

For detailed instructions, see [GitHub's documentation on custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Troubleshooting Common Issues

### Blank Page After Deployment

Typically caused by incorrect asset paths. Verify:
- The `<base href="./">` tag is present in your HTML
- Asset references use `./assets/` instead of `/assets/`

### 404 Errors on Page Refresh

Verify that:
- The 404.html file is present in the root of your `gh-pages` branch
- The redirect code in 404.html is working correctly

### API Requests Failing

Check for:
- CORS configuration on your WordPress server
- API endpoints using HTTPS (GitHub Pages requires HTTPS connections)

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [SPA Routing for GitHub Pages](https://github.com/rafgraph/spa-github-pages)

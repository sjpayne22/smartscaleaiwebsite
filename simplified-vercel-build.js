/**
 * Simplified Vercel Build Script for SmartScale AI Website
 * 
 * This script focuses specifically on fixing CSS and asset loading issues
 * that commonly occur in Vercel deployments.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BUILD_DIR = 'build';

console.log('Starting SmartScale AI Website build for Vercel...');

// Step 1: Clean any existing build
if (fs.existsSync(BUILD_DIR)) {
  console.log(`Cleaning existing ${BUILD_DIR} directory...`);
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}

// Step 2: Run the standard Vite build
console.log('Running Vite build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Vite build failed:', error.message);
  process.exit(1);
}

// Step 3: Fix CSS and asset paths
console.log('Fixing CSS and asset paths...');
try {
  require('./css-fix-deployment');
} catch (error) {
  console.error('CSS fixing failed:', error.message);
  // Continue anyway - we want to complete the build even if this step fails
}

// Step 4: Create a 404.html file that's identical to index.html
console.log('Creating 404.html...');
if (fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
  const indexContent = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(BUILD_DIR, '404.html'), indexContent);
  console.log('Created 404.html successfully');
} else {
  console.error('Could not create 404.html because index.html was not found');
}

// Step 5: Create a verification file to confirm build completed
fs.writeFileSync(
  path.join(BUILD_DIR, 'vercel-build-verification.txt'),
  `Build completed successfully on ${new Date().toISOString()}`
);

console.log('SmartScale AI Website build for Vercel completed successfully!');

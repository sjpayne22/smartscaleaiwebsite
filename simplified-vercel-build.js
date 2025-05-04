/**
 * Simplified Vercel Build Script for SmartScale AI Website
 * 
 * This script focuses specifically on fixing CSS and asset loading issues
 * that commonly occur in Vercel deployments.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting simplified Vercel build process...');

// Configuration
const BUILD_DIR = 'build';
const ASSETS_DIR = path.join(BUILD_DIR, 'assets');
const CLIENT_DIR = 'client';
const WP_ISOLATION_FILES = [
  'wordpress-integration-fix.js',
  'client/src/css/wordpress-isolation.css',
  'client/src/components/ui/IsolatedWordPressContent.jsx'
];

try {
  // Step 1: Run the standard build process
  console.log('Step 1: Running standard build...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 2: Create build directory if it doesn't exist
  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  // Step 3: Copy WordPress isolation files to the build
  console.log('Step 3: Adding WordPress isolation solution...');
  WP_ISOLATION_FILES.forEach(file => {
    const srcPath = file;
    const destPath = path.join(BUILD_DIR, path.basename(file));
    
    try {
      if (fs.existsSync(srcPath)) {
        const content = fs.readFileSync(srcPath, 'utf8');
        fs.writeFileSync(destPath, content, 'utf8');
        console.log(`  - Copied ${path.basename(file)} to build directory`);
      } else {
        console.warn(`  - Warning: Could not find ${srcPath}`);
      }
    } catch (err) {
      console.warn(`  - Error copying ${srcPath}: ${err.message}`);
    }
  });

  // Step 4: Fix HTML files to include WordPress isolation script
  console.log('Step 4: Updating HTML to include WordPress isolation...');
  const htmlFiles = getAllFiles(BUILD_DIR)
    .filter(file => file.endsWith('.html'));

  htmlFiles.forEach(htmlFile => {
    try {
      let htmlContent = fs.readFileSync(htmlFile, 'utf8');
      
      // Add WordPress isolation script before the closing body tag
      if (!htmlContent.includes('wordpress-integration-fix.js')) {
        htmlContent = htmlContent.replace(
          '</body>',
          '<script src="/wordpress-integration-fix.js"></script>\n</body>'
        );
        fs.writeFileSync(htmlFile, htmlContent, 'utf8');
        console.log(`  - Added WordPress isolation script to ${path.basename(htmlFile)}`);
      }
    } catch (err) {
      console.warn(`  - Error updating ${htmlFile}: ${err.message}`);
    }
  });

  // Step 5: Fix CSS paths and ensure proper loading
  console.log('Step 5: Fixing CSS paths and ensuring proper loading...');
  const cssFiles = getAllFiles(BUILD_DIR)
    .filter(file => file.endsWith('.css'));

  cssFiles.forEach(cssFile => {
    try {
      let cssContent = fs.readFileSync(cssFile, 'utf8');
      
      // Fix any relative URLs in the CSS
      // This regex matches url(...) patterns and updates relative paths if needed
      cssContent = cssContent.replace(/url\(['"]?(\.\/|\.\.\/)([^)'"]+)['"]?\)/g, (match, prefix, url) => {
        return `url("/assets/${url}")`;
      });
      
      fs.writeFileSync(cssFile, cssContent, 'utf8');
      console.log(`  - Fixed CSS paths in ${path.basename(cssFile)}`);
    } catch (err) {
      console.warn(`  - Error fixing CSS paths in ${cssFile}: ${err.message}`);
    }
  });

  // Step 6: Add simplified Vercel configuration
  console.log('Step 6: Adding Vercel configuration...');
  try {
    const vercelConfig = {
      "version": 2,
      "builds": [
        { "src": "build/**", "use": "@vercel/static" }
      ],
      "routes": [
        { "src": "/assets/(.*)", "dest": "/build/assets/$1" },
        { "src": "/(.*)", "dest": "/build/$1" },
        { "src": "/.*", "dest": "/build/index.html" }
      ]
    };
    
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2), 'utf8');
    console.log('  - Created simplified vercel.json configuration');
  } catch (err) {
    console.warn(`  - Error creating vercel.json: ${err.message}`);
  }

  console.log('Simplified Vercel build completed successfully!');
  console.log('\nDeploy using the following command:\n  vercel --prod');

} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}

/**
 * Get all files in a directory recursively
 * @param {string} dirPath - Path to the directory
 * @param {Array} arrayOfFiles - Array to store files (used for recursion)
 * @returns {Array} - Array of file paths
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

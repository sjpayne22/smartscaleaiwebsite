/**
 * CSS and Asset Path Fix for Vercel Deployment
 * 
 * This script specifically targets CSS loading issues in the Vercel deployment.
 * Run this script after your site is built but before deployment.
 */

const fs = require('fs');
const path = require('path');

// Paths to check and fix
const BUILD_DIR = 'build';
const INDEX_HTML_PATH = path.join(BUILD_DIR, 'index.html');

// Ensure the build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error(`Build directory '${BUILD_DIR}' not found!`);
  process.exit(1);
}

// Ensure index.html exists
if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error(`index.html not found at ${INDEX_HTML_PATH}`);
  process.exit(1);
}

// Function to fix CSS links in HTML files
function fixHtmlCssLinks(filePath) {
  console.log(`Fixing CSS links in ${filePath}...`);
  
  let htmlContent = fs.readFileSync(filePath, 'utf8');
  
  // Add a base tag if it doesn't exist
  if (!htmlContent.includes('<base')) {
    htmlContent = htmlContent.replace(
      '<head>',
      '<head>\n  <base href="/">'
    );
    console.log('Added base tag to HTML');
  }
  
  // Ensure CSS files have the correct mime type
  htmlContent = htmlContent.replace(
    /(<link[^>]*\.css[^>]*>)/g,
    '$1\n  <meta http-equiv="Content-Type" content="text/css">'
  );
  
  // Fix relative paths in CSS links
  htmlContent = htmlContent.replace(
    /href="(\.\/)?assets\//g,
    'href="/assets/'
  );
  
  fs.writeFileSync(filePath, htmlContent);
  console.log(`Fixed ${filePath}`);
}

// Function to add explicit type attribute to CSS links
function fixCssLinks() {
  // Fix the main index.html file
  fixHtmlCssLinks(INDEX_HTML_PATH);
  
  // Look for any other HTML files in the build directory
  const files = fs.readdirSync(BUILD_DIR);
  files.forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
      fixHtmlCssLinks(path.join(BUILD_DIR, file));
    }
  });
}

// Function to ensure all CSS files have correct Content-Type
function fixCssFiles() {
  console.log('Checking CSS files in assets directory...');
  const assetsDir = path.join(BUILD_DIR, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.error(`Assets directory '${assetsDir}' not found!`);
    return;
  }
  
  const processFiles = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processFiles(filePath);
      } else if (file.endsWith('.css')) {
        // Add CSS comment to force content-type recognition
        const cssContent = fs.readFileSync(filePath, 'utf8');
        const updatedContent = `/* Content-Type: text/css */\n${cssContent}`;
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Added content-type comment to ${filePath}`);
      }
    });
  };
  
  processFiles(assetsDir);
}

// Execute the fixes
fixCssLinks();
fixCssFiles();

console.log('CSS and asset path fixing completed successfully!');

// Create a small verification file to ensure the script ran
fs.writeFileSync(
  path.join(BUILD_DIR, 'css-fix-verification.txt'),
  `CSS Fix script ran on ${new Date().toISOString()}`
);

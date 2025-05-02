/**
 * Script to fix asset paths in the built files for production
 * This converts absolute paths (/assets/) to relative paths (./assets/)
 * Run this script after building but before uploading to production
 */
const fs = require('fs');
const path = require('path');

// Path to the built index.html file (directly in build folder for this project)
const buildIndexHtmlPath = path.join(__dirname, 'build', 'index.html');

console.log('Fixing asset paths for production in:', buildIndexHtmlPath);

try {
  // Check if the file exists
  if (fs.existsSync(buildIndexHtmlPath)) {
    // Read the build/index.html file
    let buildIndexHtml = fs.readFileSync(buildIndexHtmlPath, 'utf8');
    
    // Replace absolute paths with relative paths
    buildIndexHtml = buildIndexHtml.replace(/src="\/assets\//g, 'src="./assets/');
    buildIndexHtml = buildIndexHtml.replace(/href="\/assets\//g, 'href="./assets/');
    
    // Write the fixed index.html file
    fs.writeFileSync(buildIndexHtmlPath, buildIndexHtml, 'utf8');
    
    console.log('Fixed asset paths in build/index.html');
  } else {
    console.log('build/index.html does not exist yet. Please run the build first.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error fixing asset paths in build/index.html:', error);
  process.exit(1);
}

console.log('Asset path fixing complete!');
console.log('You can now upload the build directory to your production server.');

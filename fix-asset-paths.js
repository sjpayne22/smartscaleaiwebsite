/**
 * Script to fix asset paths in the built files
 * This converts absolute paths (/assets/) to relative paths (./assets/)
 */
const fs = require('fs');
const path = require('path');

// Path to the built index.html file
const indexHtmlPath = path.join(__dirname, 'dist', 'public', 'index.html');

console.log('Fixing asset paths in:', indexHtmlPath);

try {
  // Read the index.html file
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Replace absolute paths with relative paths
  // - For CSS files
  indexHtml = indexHtml.replace(/src="\/assets\//g, 'src="./assets/');
  indexHtml = indexHtml.replace(/href="\/assets\//g, 'href="./assets/');
  
  // Write the fixed index.html file
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  
  console.log('Fixed asset paths in index.html');
} catch (error) {
  console.error('Error fixing asset paths:', error);
}

// Also update the index.html in the build directory if it exists
const buildIndexHtmlPath = path.join(__dirname, 'build', 'index.html');

if (fs.existsSync(buildIndexHtmlPath)) {
  console.log('Fixing asset paths in:', buildIndexHtmlPath);
  
  try {
    // Read the build/index.html file
    let buildIndexHtml = fs.readFileSync(buildIndexHtmlPath, 'utf8');
    
    // Replace absolute paths with relative paths
    buildIndexHtml = buildIndexHtml.replace(/src="\/assets\//g, 'src="./assets/');
    buildIndexHtml = buildIndexHtml.replace(/href="\/assets\//g, 'href="./assets/');
    
    // Write the fixed index.html file
    fs.writeFileSync(buildIndexHtmlPath, buildIndexHtml, 'utf8');
    
    console.log('Fixed asset paths in build/index.html');
  } catch (error) {
    console.error('Error fixing asset paths in build/index.html:', error);
  }
}

console.log('Asset path fixing complete!');

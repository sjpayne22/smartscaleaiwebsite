/**
 * Script to fix asset paths in the built files
 * This converts absolute paths (/assets/) to relative paths (./assets/)
 * Also adds a base tag for GitHub Pages compatibility
 */
const fs = require('fs');
const path = require('path');

// Only try the dist path if the dist directory exists
const distDir = path.join(__dirname, 'dist', 'public');
if (fs.existsSync(distDir)) {
  const indexHtmlPath = path.join(distDir, 'index.html');
  console.log('Fixing asset paths in:', indexHtmlPath);

  try {
    // Read the index.html file
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Replace absolute paths with relative paths
    indexHtml = indexHtml.replace(/src="\/assets\//g, 'src="./assets/');
    indexHtml = indexHtml.replace(/href="\/assets\//g, 'href="./assets/');
    
    // Add base tag for GitHub Pages
    if (!indexHtml.includes('<base')) {
      indexHtml = indexHtml.replace(
        '<head>',
        '<head>\n  <!-- Base tag for GitHub Pages --><base href=".">'  
      );
    }
    
    // Write the fixed index.html file
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    
    console.log('Fixed asset paths in dist/public/index.html');
  } catch (error) {
    console.error('Error fixing asset paths in dist/public/index.html:', error);
  }
}

// Always check the build directory
const buildIndexHtmlPath = path.join(__dirname, 'build', 'index.html');

if (fs.existsSync(buildIndexHtmlPath)) {
  console.log('Fixing asset paths in:', buildIndexHtmlPath);
  
  try {
    // Read the build/index.html file
    let buildIndexHtml = fs.readFileSync(buildIndexHtmlPath, 'utf8');
    
    // Replace absolute paths with relative paths
    buildIndexHtml = buildIndexHtml.replace(/src="\/assets\//g, 'src="./assets/');
    buildIndexHtml = buildIndexHtml.replace(/href="\/assets\//g, 'href="./assets/');
    
    // Add a base tag for GitHub Pages to handle the repository name
    const hasBaseTag = buildIndexHtml.includes('<base');
    if (!hasBaseTag) {
      // Add base tag right after the head tag
      buildIndexHtml = buildIndexHtml.replace(
        '<head>', 
        '<head>\n  <!-- Base tag for GitHub Pages --><base href=".">'  
      );
    }
    
    // Write the fixed index.html file
    fs.writeFileSync(buildIndexHtmlPath, buildIndexHtml, 'utf8');
    
    console.log('Fixed asset paths in build/index.html');
  } catch (error) {
    console.error('Error fixing asset paths in build/index.html:', error);
  }
}

console.log('Asset path fixing complete!');

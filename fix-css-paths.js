/**
 * Script to fix CSS and asset paths in the built files
 * This script fixes both absolute and relative paths to ensure compatibility
 */

const fs = require('fs');
const path = require('path');

console.log('Fixing CSS and asset path issues in build files...');

// Process index.html file
const indexPath = path.join('build', 'index.html');
if (fs.existsSync(indexPath)) {
  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    
    // Add base tag if it doesn't exist
    if (!html.includes('<base')) {
      html = html.replace('<head>', '<head>\n  <base href="/">');
      console.log('- Added base href="/" tag');
    }
    
    // Make all asset paths absolute (important for nested routes)
    html = html.replace(/src="\.\/assets\//g, 'src="/assets/');
    html = html.replace(/href="\.\/assets\//g, 'href="/assets/');
    console.log('- Updated asset paths to absolute');
    
    // Ensure correct content type for stylesheet links
    html = html.replace(/<link rel="stylesheet"([^>]*)>/g, '<link rel="stylesheet" type="text/css"$1>');
    console.log('- Added explicit type="text/css" to stylesheets');
    
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✅ Updated index.html successfully');
  } catch (error) {
    console.error('❌ Error processing index.html:', error.message);
  }
}

// Process CSS files
const cssDir = path.join('build', 'assets');
if (fs.existsSync(cssDir)) {
  try {
    const files = fs.readdirSync(cssDir);
    let cssFileCount = 0;
    
    files.forEach(file => {
      if (file.endsWith('.css')) {
        const cssPath = path.join(cssDir, file);
        let css = fs.readFileSync(cssPath, 'utf8');
        
        // Fix url() paths in CSS
        css = css.replace(/url\(\.\.\/([^)]+)\)/g, 'url(/$1)');
        css = css.replace(/url\(\.\//g, 'url(/');
        
        fs.writeFileSync(cssPath, css, 'utf8');
        cssFileCount++;
      }
    });
    
    if (cssFileCount > 0) {
      console.log(`✅ Fixed paths in ${cssFileCount} CSS files`);
    }
  } catch (error) {
    console.error('❌ Error processing CSS files:', error.message);
  }
}

// Create a _headers file to force correct content types
const headersPath = path.join('build', '_headers');
try {
  const headers = 
`# Force correct MIME types
/assets/*.css
  Content-Type: text/css
/assets/*.js
  Content-Type: application/javascript
/assets/*.map
  Content-Type: application/json
/assets/*.json
  Content-Type: application/json
`;
  
  fs.writeFileSync(headersPath, headers, 'utf8');
  console.log('✅ Created _headers file for content type control');
} catch (error) {
  console.error('❌ Error creating _headers file:', error.message);
}

console.log('✅ Path fixing complete!');

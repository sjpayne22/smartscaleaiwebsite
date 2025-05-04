/**
 * Fix asset paths for Vercel deployment
 * This script ensures all asset paths are correct for Vercel hosting
 */

const fs = require('fs');
const path = require('path');

// Process the index.html file
console.log('Fixing asset paths for Vercel deployment...');
// Allow customizing the build directory via command line parameter
const buildDir = process.argv[2] || 'build';
const indexPath = path.join(buildDir, 'index.html');

if (fs.existsSync(indexPath)) {
  try {
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Make sure we have a base tag with absolute path for Vercel
    if (htmlContent.includes('<base href="./">')) {
      htmlContent = htmlContent.replace('<base href="./">', '<base href="/">');
      console.log('- Updated base tag to use absolute paths');
    } else if (!htmlContent.includes('<base href="/">')) {
      htmlContent = htmlContent.replace('<head>', '<head>\n  <base href="/">');
      console.log('- Added base tag with absolute path');
    }
    
    // Ensure asset paths are absolute for Vercel
    if (htmlContent.includes('src="./assets/')) {
      htmlContent = htmlContent.replace(/src="\.\/assets\//g, 'src="/assets/');
      console.log('- Fixed script src attributes to use absolute paths');
    }
    
    if (htmlContent.includes('href="./assets/')) {
      htmlContent = htmlContent.replace(/href="\.\/assets\//g, 'href="/assets/');
      console.log('- Fixed link href attributes to use absolute paths');
    }
    
    // Ensure CSS has proper type
    if (htmlContent.includes('<link rel="stylesheet"') && !htmlContent.includes('type="text/css"')) {
      htmlContent = htmlContent.replace(/<link rel="stylesheet"([^>]*)>/g, '<link rel="stylesheet" type="text/css"$1>');
      console.log('- Added explicit type="text/css" to stylesheets');
    }
    
    // Add deployment indicator
    if (!htmlContent.includes('data-deployment="vercel"')) {
      htmlContent = htmlContent.replace('<html', '<html data-deployment="vercel"');
      console.log('- Added Vercel deployment indicator');
    }
    
    // Write the updated HTML
    fs.writeFileSync(indexPath, htmlContent, 'utf8');
    console.log('✅ Successfully updated index.html for Vercel');
  } catch (error) {
    console.error('❌ Failed to update index.html:', error.message);
  }
} else {
  console.error('❌ Could not find index.html in build directory');
}

// Process CSS files to ensure paths are correct
const cssDir = path.join(buildDir, 'assets');
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

// Create _headers file for content types
const headersPath = path.join(buildDir, '_headers');
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

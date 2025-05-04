/**
 * Special build script for Vercel deployments
 * This script handles the entire build process for Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run the standard build process first
console.log('Building for Vercel deployment...');

// Make sure we're using absolute paths for Vercel
console.log('\n1. Running normal build process...');
try {
  // Run the standard Vite build directly instead of using npm script
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('\u2705 Build completed successfully');
} catch (error) {
  console.error('\u274c Build failed:', error.message);
  process.exit(1);
}

// Copy vercel.json to the build directory
console.log('\n2. Copying Vercel configuration...');
if (fs.existsSync('vercel.json')) {
  try {
    fs.copyFileSync('vercel.json', path.join('build', 'vercel.json'));
    console.log('\u2705 Copied vercel.json to build directory');
  } catch (error) {
    console.error('\u274c Failed to copy vercel.json:', error.message);
  }
}

// Process the index.html file
console.log('\n3. Fixing asset paths for Vercel...');

// Use the dedicated path fixing script
try {
  console.log('- Running path fixing script...');
  // Call directly with build parameter to ensure correct directory is processed
  process.argv[2] = 'build'; // Set the command line arg for the required script
  require('./fix-vercel-paths.js');
  console.log('\u2705 Successfully fixed paths with external script');
} catch (error) {
  console.error('\u274c Path fixing with external script failed:', error.message);
  
  // Fallback to direct fix if script fails
  const indexPath = path.join('build', 'index.html');
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
      console.log('\u2705 Successfully updated index.html for Vercel');
    } catch (error) {
      console.error('\u274c Failed to update index.html:', error.message);
    }
  } else {
    console.error('\u274c Could not find index.html in build directory');
  }
}

// Create deployment helper files
console.log('\n4. Adding deployment helpers...');
try {
  // Create a _redirects file for additional compatibility
  const redirectsContent = "/*    /index.html   200\n";
  fs.writeFileSync(path.join('build', '_redirects'), redirectsContent);
  console.log('- Added _redirects file');
  
  // Create _headers file for content types
  const headersContent = 
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
  fs.writeFileSync(path.join('build', '_headers'), headersContent, 'utf8');
  console.log('- Added _headers file for content type control');
  
  // Create an indicator file for deployment info
  const deploymentInfo = {
    target: "vercel",
    timestamp: new Date().toISOString(),
    buildMode: "production"
  };
  fs.writeFileSync(
    path.join('build', 'deployment-info.json'), 
    JSON.stringify(deploymentInfo, null, 2),
    'utf8'
  );
  console.log('- Added deployment information file');
} catch (error) {
  console.error('\u274c Failed to create deployment helpers:', error.message);
}

// Process CSS files to ensure paths are correct
console.log('\n5. Checking CSS files for path issues...');
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
        const originalCss = css;
        css = css.replace(/url\(\.\.\/([^)]+)\)/g, 'url(/$1)');
        css = css.replace(/url\(\.\//g, 'url(/');
        
        if (css !== originalCss) {
          fs.writeFileSync(cssPath, css, 'utf8');
          cssFileCount++;
        }
      }
    });
    
    if (cssFileCount > 0) {
      console.log(`\u2705 Fixed paths in ${cssFileCount} CSS files`);
    } else {
      console.log('- No CSS files needed path fixes');
    }
  } catch (error) {
    console.error('\u274c Error processing CSS files:', error.message);
  }
}

console.log('\n\u2705 Vercel build preparation complete!');
console.log('Your build directory is now ready for Vercel deployment.');

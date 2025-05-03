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
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Copy vercel.json to the build directory
console.log('\n2. Copying Vercel configuration...');
if (fs.existsSync('vercel.json')) {
  try {
    fs.copyFileSync('vercel.json', path.join('build', 'vercel.json'));
    console.log('✅ Copied vercel.json to build directory');
  } catch (error) {
    console.error('❌ Failed to copy vercel.json:', error.message);
  }
}

// Process the index.html file
console.log('\n3. Fixing asset paths for Vercel...');
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
      htmlContent = htmlContent.replace(/src=\"\.\//g, 'src="/');
      console.log('- Fixed script src attributes to use absolute paths');
    }
    
    if (htmlContent.includes('href="./assets/')) {
      htmlContent = htmlContent.replace(/href=\"\.\//g, 'href="/');
      console.log('- Fixed link href attributes to use absolute paths');
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

// Create _redirects file for additional deployment compatibility
console.log('\n4. Adding deployment helpers...');
try {
  // Create a _redirects file for additional compatibility
  const redirectsContent = "/*    /index.html   200\n";
  fs.writeFileSync(path.join('build', '_redirects'), redirectsContent);
  console.log('- Added _redirects file');
  
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
  console.error('❌ Failed to create deployment helpers:', error.message);
}

console.log('\n✅ Vercel build preparation complete!');
console.log('Your build directory is now ready for Vercel deployment.');

/**
 * SmartScale AI Website Build Script
 * 
 * This script builds the website for different deployment targets:
 * - GitHub Pages
 * - Vercel
 * 
 * Usage:
 * - node build.js github   # Build for GitHub Pages
 * - node build.js vercel   # Build for Vercel
 * - node build.js          # Build for GitHub Pages (default)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Determine deployment target
const args = process.argv.slice(2);
const deploymentTarget = args[0]?.toLowerCase() || 'github';

if (deploymentTarget !== 'github' && deploymentTarget !== 'vercel') {
  console.warn(`Warning: Unknown deployment target '${deploymentTarget}'. Using 'github' as default.`);
}

console.log('====================================');
console.log(`Building for: ${deploymentTarget === 'github' ? 'GitHub Pages' : 'Vercel'}`);
console.log('====================================\n');

// Clean build directory
function cleanBuild() {
  console.log('Cleaning build directory...');
  try {
    if (fs.existsSync('build')) {
      // On Windows
      if (process.platform === 'win32') {
        execSync('rmdir /s /q build', { stdio: 'inherit' });
      } else {
        // On Unix-like systems
        execSync('rm -rf build', { stdio: 'inherit' });
      }
    }
    console.log('\u2705 Build directory cleaned');
    return true;
  } catch (error) {
    console.error('\u274c Failed to clean build directory:', error.message);
    return false;
  }
}

// Run the standard build process
function runBuild() {
  console.log('\nRunning build process...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('\u2705 Build completed successfully');
    return true;
  } catch (error) {
    console.error('\u274c Build failed:', error.message);
    return false;
  }
}

// Fix asset paths based on deployment target
function fixAssetPaths() {
  console.log('\nFixing asset paths...');
  try {
    execSync(`node fix-asset-paths.js ${deploymentTarget}`, { stdio: 'inherit' });
    console.log(`\u2705 Asset paths fixed for ${deploymentTarget}`);
    return true;
  } catch (error) {
    console.error(`\u274c Failed to fix asset paths for ${deploymentTarget}:`, error.message);
    return false;
  }
}

// Create 404.html for GitHub Pages (only for GitHub Pages)
function create404Page() {
  if (deploymentTarget !== 'github') {
    return true; // Skip for non-GitHub Pages deployments
  }
  
  console.log('\nCreating 404.html for GitHub Pages...');
  
  const indexPath = path.join('build', 'index.html');
  const notFoundPath = path.join('build', '404.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('\u274c Could not find build/index.html');
    return false;
  }
  
  try {
    // Copy index.html to 404.html
    fs.copyFileSync(indexPath, notFoundPath);
    console.log('\u2705 404.html created for GitHub Pages');
    return true;
  } catch (error) {
    console.error('\u274c Failed to create 404.html:', error.message);
    return false;
  }
}

// Run Vercel-specific post-processing
function runVercelPostProcessing() {
  if (deploymentTarget !== 'vercel') {
    return true; // Skip for non-Vercel deployments
  }
  
  console.log('\nRunning Vercel-specific post-processing...');
  try {
    execSync('node build-vercel.js', { stdio: 'inherit' });
    console.log('\u2705 Vercel post-processing completed');
    return true;
  } catch (error) {
    console.error('\u274c Vercel post-processing failed:', error.message);
    return false;
  }
}

// Create a root index.html for GitHub Pages
function createRootIndex() {
  if (deploymentTarget !== 'github') {
    return true; // Skip for non-GitHub Pages deployments
  }
  
  console.log('\nCreating root index.html for GitHub Pages...');
  
  const rootIndexPath = path.join(__dirname, 'index.html');
  
  try {
    const rootIndexContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=./build/index.html">
  <title>SmartScale AI - Redirecting...</title>
  <script>
    window.location.href = "./build/index.html";
  </script>
</head>
<body>
  If you are not redirected automatically, please <a href="./build/index.html">click here</a>.
</body>
</html>
`;
    
    fs.writeFileSync(rootIndexPath, rootIndexContent, 'utf8');
    console.log('\u2705 Root index.html created for GitHub Pages');
    return true;
  } catch (error) {
    console.error('\u274c Failed to create root index.html:', error.message);
    return false;
  }
}

// Run the build process
(async function() {
  let success = true;
  
  // Clean build directory
  success = cleanBuild() && success;
  
  // Run build process
  success = runBuild() && success;
  
  if (!success) {
    console.error('\n\u274c Build failed. Please fix the errors and try again.');
    process.exit(1);
  }
  
  // Fix asset paths
  success = fixAssetPaths() && success;
  
  // Create 404.html for GitHub Pages
  success = create404Page() && success;
  
  // Run Vercel-specific post-processing
  success = runVercelPostProcessing() && success;
  
  // Create root index.html for GitHub Pages
  success = createRootIndex() && success;
  
  if (success) {
    console.log('\n====================================');
    console.log(`\u2705 Build successful for ${deploymentTarget === 'github' ? 'GitHub Pages' : 'Vercel'}!`);
    console.log('====================================');
    
    if (deploymentTarget === 'github') {
      console.log('\nNext steps for GitHub Pages:');
      console.log('1. Commit and push the changes to your repository');
      console.log('2. Configure GitHub Pages in your repository settings');
      console.log('3. Set the GitHub Pages source to the main branch');
    } else {
      console.log('\nNext steps for Vercel:');
      console.log('1. Deploy to Vercel using one of these methods:');
      console.log('   - Run: vercel --prod');
      console.log('   - Upload the build directory to Vercel');
      console.log('2. Configure your custom domain in Vercel settings');
    }
  } else {
    console.error('\n\u274c Build process completed with errors.');
    process.exit(1);
  }
})();

/**
 * Universal Asset Path Fixer for SmartScale AI Website
 *
 * This script configures the built files for different deployment platforms:
 * - GitHub Pages: Changes absolute paths to relative (./assets/) and adds <base href="."> tag
 * - Vercel: Keeps absolute paths (/assets/) and adds <base href="/"> tag
 *
 * Usage:
 * - For GitHub Pages: node fix-asset-paths.js github
 * - For Vercel: node fix-asset-paths.js vercel
 * - Default (no argument): GitHub Pages configuration
 */
const fs = require('fs');
const path = require('path');

// Determine deployment target
const args = process.argv.slice(2);
const deploymentTarget = args[0]?.toLowerCase() || 'github';

if (deploymentTarget !== 'github' && deploymentTarget !== 'vercel') {
  console.warn(`Warning: Unknown deployment target '${deploymentTarget}'. Using 'github' as default.`);
}

// Configuration based on deployment target
const config = {
  github: {
    baseHref: '.',
    assetPathPrefix: './',
    description: 'GitHub Pages'
  },
  vercel: {
    baseHref: '/',
    assetPathPrefix: '/',
    description: 'Vercel'
  }
}[deploymentTarget] || config.github;

console.log(`\nConfiguring assets for ${config.description} deployment...\n`);

// Process a single HTML file
function processHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return false;
  }
  
  console.log(`Processing: ${filePath}`);
  
  try {
    // Read the HTML file
    let htmlContent = fs.readFileSync(filePath, 'utf8');
    
    // Handle asset paths based on deployment target
    if (deploymentTarget === 'github') {
      // For GitHub Pages: convert absolute to relative paths
      htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
      htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
    } else {
      // For Vercel: ensure absolute paths
      htmlContent = htmlContent.replace(/src="\.\/assets\//g, 'src="/assets/');
      htmlContent = htmlContent.replace(/href="\.\/assets\//g, 'href="/assets/');
    }
    
    // Update or add base tag
    if (htmlContent.includes('<base href=')) {
      // Update existing base tag
      htmlContent = htmlContent.replace(
        /<base href="[^"]*">/,
        `<base href="${config.baseHref}">`
      );
    } else {
      // Add base tag if it doesn't exist
      htmlContent = htmlContent.replace(
        '<head>',
        `<head>\n  <!-- Base tag for ${config.description} deployment --><base href="${config.baseHref}">`
      );
    }
    
    // Add deployment indicator
    if (!htmlContent.includes(`data-deployment="${deploymentTarget}"`)) {
      htmlContent = htmlContent.replace(
        '<html',
        `<html data-deployment="${deploymentTarget}"`
      );
    }
    
    // Write the modified HTML file
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`✅ Successfully configured ${filePath} for ${config.description}`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all relevant HTML files
function processAllFiles() {
  let successCount = 0;
  let failCount = 0;
  
  // Check Vite build directory
  const distDir = path.join(__dirname, 'dist');
  const distPublicDir = path.join(distDir, 'public');
  const distIndexPath = path.join(distPublicDir, 'index.html');
  
  if (fs.existsSync(distIndexPath)) {
    processHtmlFile(distIndexPath) ? successCount++ : failCount++;
  } else if (fs.existsSync(distDir)) {
    const distIndexAltPath = path.join(distDir, 'index.html');
    if (fs.existsSync(distIndexAltPath)) {
      processHtmlFile(distIndexAltPath) ? successCount++ : failCount++;
    }
  }
  
  // Check React build directory
  const buildDir = path.join(__dirname, 'build');
  const buildIndexPath = path.join(buildDir, 'index.html');
  
  if (fs.existsSync(buildIndexPath)) {
    processHtmlFile(buildIndexPath) ? successCount++ : failCount++;
  }
  
  // Process 404.html for GitHub Pages if it exists
  if (deploymentTarget === 'github') {
    const notFoundPath = path.join(__dirname, 'build', '404.html');
    if (fs.existsSync(notFoundPath)) {
      processHtmlFile(notFoundPath) ? successCount++ : failCount++;
    }
  }
  
  // Create deployment indicator file
  try {
    const deploymentIndicator = {
      target: deploymentTarget,
      configuredAt: new Date().toISOString(),
      baseHref: config.baseHref,
      assetPrefix: config.assetPathPrefix
    };
    
    if (fs.existsSync(buildDir)) {
      fs.writeFileSync(
        path.join(buildDir, 'deployment-config.json'),
        JSON.stringify(deploymentIndicator, null, 2),
        'utf8'
      );
    }
  } catch (error) {
    console.warn('Could not write deployment indicator file:', error.message);
  }
  
  return { successCount, failCount };
}

// Run the processor
const { successCount, failCount } = processAllFiles();

console.log('\n====================================');
console.log(`Deployment Configuration Summary:`);
console.log('====================================');
console.log(`Target:      ${config.description}`);
console.log(`Base Href:   ${config.baseHref}`);
console.log(`Asset Path:  ${config.assetPathPrefix}assets/`);
console.log(`Success:     ${successCount} file(s)`);
console.log(`Failed:      ${failCount} file(s)`);
console.log('====================================\n');

if (successCount === 0) {
  console.error('❌ No files were processed. Make sure your build directories exist.');
  process.exit(1);
} else if (failCount > 0) {
  console.warn(`⚠️ ${failCount} file(s) failed to process.`);
  process.exit(1);
} else {
  console.log(`✅ Assets successfully configured for ${config.description} deployment!`);
  console.log(`   You can now deploy your ${deploymentTarget === 'github' ? 'GitHub Pages' : 'Vercel'} project.`);
}


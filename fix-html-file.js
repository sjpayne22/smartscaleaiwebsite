/**
 * Script to fix the HTML file
 * This fixes the absolute paths and adds the proper base tag
 */

const fs = require('fs');
const path = require('path');

// Function to fix the HTML content
function fixHtml(htmlContent, deployTarget = 'github') {
  let fixed = htmlContent;
  
  // Add base tag if not present
  if (!fixed.includes('<base href=')) {
    // Different base href depending on deployment target
    const baseHref = deployTarget === 'github' ? './' : '/';
    fixed = fixed.replace('<head>', `<head>\n  <base href="${baseHref}">`);
  }
  
  // Fix asset paths based on deployment target
  if (deployTarget === 'github') {
    // GitHub Pages: convert absolute to relative paths
    fixed = fixed.replace(/src="\/assets\//g, 'src="./assets/');
    fixed = fixed.replace(/href="\/assets\//g, 'href="./assets/');
  }
  
  return fixed;
}

// Main function
function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  const deployTarget = args[0] || 'github'; // Default to GitHub Pages
  const inputFile = args[1] || 'index.html'; // Default input file
  
  console.log(`Fixing HTML file: ${inputFile}`);
  console.log(`Deployment target: ${deployTarget}`);
  
  try {
    // Read the HTML file
    if (!fs.existsSync(inputFile)) {
      console.error(`File not found: ${inputFile}`);
      return 1;
    }
    
    const originalHtml = fs.readFileSync(inputFile, 'utf8');
    
    // Fix the HTML
    const fixedHtml = fixHtml(originalHtml, deployTarget);
    
    // Write out the fixed HTML
    fs.writeFileSync(inputFile, fixedHtml, 'utf8');
    
    console.log(`\n✅ Successfully fixed ${inputFile}!`);
    console.log('Changes made:');
    
    // Compare to show what was changed
    if (originalHtml.includes('<base href=')) {
      console.log('- Updated existing base tag');
    } else {
      console.log('- Added base tag to head section');
    }
    
    if (deployTarget === 'github' && originalHtml.includes('src="/assets/')) {
      console.log('- Fixed asset paths from absolute to relative');
    } else if (deployTarget === 'vercel' && originalHtml.includes('src="./assets/')) {
      console.log('- Fixed asset paths from relative to absolute');
    }
    
    return 0;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return 1;
  }
}

main();

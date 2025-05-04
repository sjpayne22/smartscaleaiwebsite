/**
 * Test script to verify our CSS fixes
 * Creates a test build structure and applies fixes
 */

const fs = require('fs');
const path = require('path');

// Create a test build structure
const TEST_DIR = 'test-build';
const ASSETS_DIR = path.join(TEST_DIR, 'assets');

// Clean any existing test directory
if (fs.existsSync(TEST_DIR)) {
  console.log('Cleaning existing test directory...');
  
  // Recursive delete function for directories
  function deleteDir(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(file => {
        const curPath = path.join(dirPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteDir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dirPath);
    }
  }
  
  deleteDir(TEST_DIR);
}

// Create the directory structure
console.log('Creating test build structure...');
fs.mkdirSync(TEST_DIR);
fs.mkdirSync(ASSETS_DIR);

// Create a test index.html with relative paths
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmartScale AI Website</title>
  <link rel="stylesheet" href="./assets/styles.css">
  <script type="module" src="./assets/index.js"></script>
</head>
<body>
  <h1>SmartScale AI Consulting</h1>
  <img src="./assets/logo.png" alt="Logo">
  <div id="root"></div>
</body>
</html>`;

// Create a test CSS file with relative URLs
const cssContent = `/* Test styles with relative URLs */
body {
  background: url(../images/bg.jpg);
  color: #333;
  font-family: Arial, sans-serif;
}

.logo {
  background: url(./logo-small.png) no-repeat;
  width: 100px;
  height: 100px;
}`;

// Create a test JS file
const jsContent = `// Test JavaScript
console.log('SmartScale AI Website');

// Load some assets
const logo = new Image();
logo.src = './logo-full.png';
document.body.appendChild(logo);`;

// Write the test files
fs.writeFileSync(path.join(TEST_DIR, 'index.html'), indexHtml);
fs.writeFileSync(path.join(ASSETS_DIR, 'styles.css'), cssContent);
fs.writeFileSync(path.join(ASSETS_DIR, 'index.js'), jsContent);

// Create a test image directory
fs.mkdirSync(path.join(TEST_DIR, 'images'));

// Now run the fix scripts
console.log('\nApplying Vercel fixes...');

process.argv[2] = TEST_DIR; // Set the build directory argument

// Use the require method to run the script directly
require('./fix-vercel-paths.js');

// Print results
console.log('\nTest build created and processed. Check the results in the test-build directory.');
console.log('- index.html: Check for base tag, absolute paths');
console.log('- assets/styles.css: Check for absolute paths in url() references');
console.log('- _headers: Check for content type settings');

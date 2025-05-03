/**
 * Script to prepare files for Vercel deployment
 * - Fixes asset paths in HTML files
 * - Adds base tag for proper routing
 * - Copies Vercel configuration files
 */
const fs = require('fs');
const path = require('path');

console.log('Preparing build for Vercel deployment...');

// Function to fix asset paths in HTML files
function fixAssetPaths(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  
  // Fix asset paths (absolute to relative for Vercel)
  html = html.replace(/src="\/assets\//g, 'src="/assets/');
  html = html.replace(/href="\/assets\//g, 'href="/assets/');
  
  // Add a base tag if not already present
  if (!html.includes('<base')) {
    html = html.replace('<head>', '<head>\n  <base href="/">');
  } else if (html.includes('<base href=".">')) {
    // Replace relative base with absolute for Vercel
    html = html.replace('<base href=".">', '<base href="/">');
  }
  
  // Add meta tags for better SEO and viewport handling
  if (!html.includes('<meta name="viewport"')) {
    html = html.replace('</title>', '</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">');
  }
  
  // Add WordPress CMS connection indicators
  if (!html.includes('data-cms="wordpress"')) {
    html = html.replace('<html', '<html data-cms="wordpress"');
  }
  
  fs.writeFileSync(filePath, html);
  return true;
}

// Check if build exists
if (!fs.existsSync('build')) {
  console.log('Build directory not found. Run npm run build first.');
  process.exit(1);
}

// Create .vercel directory if it doesn't exist (for local dev with Vercel CLI)
const vercelDir = path.join('.vercel');
if (!fs.existsSync(vercelDir)) {
  fs.mkdirSync(vercelDir, { recursive: true });
  console.log('Created .vercel directory');
}

// Create project.json in .vercel directory if it doesn't exist
const projectConfigPath = path.join(vercelDir, 'project.json');
if (!fs.existsSync(projectConfigPath)) {
  const projectConfig = {
    "projectId": "smartscaleai",
    "orgId": "smartscaleai"
  };
  fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2));
  console.log('Created default project configuration');
}

// Copy vercel.json to build directory
fs.copyFileSync('vercel.json', path.join('build', 'vercel.json'));
console.log('Copied vercel.json to build directory');

// Fix asset paths in index.html
const indexPath = path.join('build', 'index.html');
if (fixAssetPaths(indexPath)) {
  console.log(`Fixed asset paths in ${indexPath}`);
}

// Create a _redirects file for additional safety (works with Netlify and some other hosts)
const redirectsContent = "/*    /index.html   200\n";
fs.writeFileSync(path.join('build', '_redirects'), redirectsContent);
console.log('Created _redirects file for additional hosting compatibility');

// Create a minimal server.js for potential Node.js hosting
const serverJsContent = `const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
fs.writeFileSync(path.join('build', 'server.js'), serverJsContent);
console.log('Created a simple server.js for Node.js hosting');

console.log('\nBuild is now ready for Vercel deployment!');
console.log('You can now run one of these commands:');
console.log('1. vercel --prod (if using Vercel CLI)');
console.log('2. Upload the build directory to Vercel via the dashboard');

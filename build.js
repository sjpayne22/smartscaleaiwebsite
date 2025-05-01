/**
 * Custom build script for SmartScale AI Website
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building SmartScale AI Website...');

// Run the standard Vite build
try {
  console.log('Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

console.log('Build completed successfully!');

// Function to fix the index.html file
function fixIndexHtml() {
  console.log('Fixing index.html for production...');
  
  const indexPath = path.join(__dirname, 'build', 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('Error: build/index.html not found!');
    return;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Remove any duplicate asset references
  const scriptMatches = html.match(/<script[^>]*src="[^"]*\.js"[^>]*>/g) || [];
  const styleMatches = html.match(/<link[^>]*href="[^"]*\.css"[^>]*>/g) || [];
  
  if (scriptMatches.length > 1) {
    console.log('Found duplicate script tags, fixing...');
    html = html.replace(scriptMatches.slice(1).join('\n'), '');
  }
  
  if (styleMatches.length > 1) {
    console.log('Found duplicate style tags, fixing...');
    html = html.replace(styleMatches.slice(1).join('\n'), '');
  }
  
  // Write the fixed HTML back to the file
  fs.writeFileSync(indexPath, html);
  console.log('index.html fixed successfully!');
}

// Function to create a proper .htaccess file
function createHtaccess() {
  console.log('Creating .htaccess file for production...');
  
  const htaccessPath = path.join(__dirname, 'build', '.htaccess');
  const htaccessContent = `# .htaccess file for React single-page application
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle client-side routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L,QSA]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
</IfModule>

# Enable CORS
Header set Access-Control-Allow-Origin "*"

# Set browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-XSS-Protection "1; mode=block"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Redirect HTTP to HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>`;
  
  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log('.htaccess file created successfully!');
}

// Create a GitHub Pages compatible 404.html
function create404Html() {
  console.log('Creating 404.html for GitHub Pages...');
  
  const html404Path = path.join(__dirname, 'build', '404.html');
  const html404Content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SmartScale AI</title>
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    // This needs to match your GitHub Pages repository name
    var repoName = "smartscaaleai-website";
    var segmentCount = 1; // Adjust based on your GitHub Pages structure
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + segmentCount).join('/') + '/?p=/' +
      l.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
      (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
</body>
</html>`;
  
  fs.writeFileSync(html404Path, html404Content);
  console.log('404.html created successfully!');
}

// Create GitHub Pages compatible root index.html
function createRootIndex() {
  console.log('Creating root index.html for GitHub Pages...');
  
  const rootIndexPath = path.join(__dirname, 'index.html');
  const buildIndexPath = path.join(__dirname, 'build', 'index.html');
  
  if (!fs.existsSync(buildIndexPath)) {
    console.error('Error: build/index.html not found!');
    return;
  }
  
  // Read the built index.html
  let buildHtml = fs.readFileSync(buildIndexPath, 'utf8');
  
  // Modify the paths to point to the build directory for GitHub Pages
  let rootHtml = buildHtml
    .replace(/src=\"\//g, 'src=\"./build/')
    .replace(/href=\"\//g, 'href=\"./build/')
    .replace(/<\/head>/, `
  <!-- Single Page Apps for GitHub Pages -->
  <script type="text/javascript">
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    (function(l) {
      if (l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
          return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
        );
      }
      
      // Also handle redirect from GitHub Pages 404 page
      // Special handling for p and q params from the 404.html redirect
      if (l.search.includes('?p=')) {
        const urlParams = new URLSearchParams(l.search);
        const redirectPath = urlParams.get('p');
        const queryParams = urlParams.get('q');
        const finalPath = redirectPath + (queryParams ? '?' + queryParams : '') + l.hash;
        
        window.history.replaceState(null, null, finalPath);
      }
    }(window.location))
  </script>
</head>`);
  
  fs.writeFileSync(rootIndexPath, rootHtml);
  console.log('Root index.html created successfully!');
}

// Execute all the functions
fixIndexHtml();
createHtaccess();
create404Html();
createRootIndex();

console.log('Post-build processing completed! Your website is ready for deployment.');

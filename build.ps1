# PowerShell script for building SmartScaleAI website for GitHub Pages

Write-Host "Building SmartScale AI Website for GitHub Pages..."

# Clean up previous build artifacts
if (Test-Path -Path "build") {
    Write-Host "Cleaning up previous build..."
    Remove-Item -Path "build" -Recurse -Force
}

# Clean dist directory if it exists
if (Test-Path -Path "dist") {
    Write-Host "Cleaning up dist directory..."
    Remove-Item -Path "dist" -Recurse -Force
}

# First, make sure client/index.html is correct
Write-Host "Checking client/index.html..."
$clientIndexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <style data-vite-theme="" data-inject-first="">:root {
--background: 0 0% 100%;
--foreground: 20 14.3% 4.1%;
--muted: 60 4.8% 95.9%;
--muted-foreground: 25 5.3% 44.7%;
--popover: 0 0% 100%;
--popover-foreground: 20 14.3% 4.1%;
--card: 0 0% 100%;
--card-foreground: 20 14.3% 4.1%;
--border: 20 5.9% 90%;
--input: 20 5.9% 90%;
--primary: 187 91% 43%;
--primary-foreground: 189 99% 7%;
--secondary: 60 4.8% 95.9%;
--secondary-foreground: 24 9.8% 10%;
--accent: 60 4.8% 95.9%;
--accent-foreground: 24 9.8% 10%;
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 60 9.1% 97.8%;
--ring: 20 14.3% 4.1%;
--radius: 0.5rem;
  }
  .dark {
--background: 240 10% 3.9%;
--foreground: 0 0% 98%;
--muted: 240 3.7% 15.9%;
--muted-foreground: 240 5% 64.9%;
--popover: 240 10% 3.9%;
--popover-foreground: 0 0% 98%;
--card: 240 10% 3.9%;
--card-foreground: 0 0% 98%;
--border: 240 3.7% 15.9%;
--input: 240 3.7% 15.9%;
--primary: 187 91% 43%;
--primary-foreground: 189 99% 7%;
--secondary: 240 3.7% 15.9%;
--secondary-foreground: 0 0% 98%;
--accent: 240 3.7% 15.9%;
--accent-foreground: 0 0% 98%;
--destructive: 0 62.8% 30.6%;
--destructive-foreground: 0 0% 98%;
--ring: 240 4.9% 83.9%;
--radius: 0.5rem;
  }</style>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SmartScale AI Consulting LLC | Smart AI Solutions for Smart Growth (Client)</title>
  <meta name="description" content="SmartScale AI helps small and mid-sized businesses leverage artificial intelligence for smarter growth, efficiency, and innovation." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
"@
Set-Content -Path "client/index.html" -Value $clientIndexHtml

# Run the standard Vite build
try {
    Write-Host "Running Vite build..."
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Vite build failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} catch {
    Write-Host "Build failed: $_"
    exit 1
}

Write-Host "Build completed successfully!"

# Create folder structure for GitHub Pages
Write-Host "Creating build directory for GitHub Pages..."

# Create build directory if it doesn't exist
if (-not (Test-Path -Path "build")) {
    New-Item -Path "build" -ItemType Directory | Out-Null
}

# Fix asset paths in dist/public/index.html
Write-Host "Fixing asset paths in built files..."
node fix-asset-paths.js

# Copy dist/public content to build
Write-Host "Copying build files to build directory..."
Copy-Item -Path "dist/public/*" -Destination "build" -Recurse -Force

# Create simple index.html for GitHub Pages
Write-Host "Creating index.html in the repository root..."
$indexContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SmartScale AI Consulting LLC | Smart AI Solutions for Smart Growth</title>
  <meta name="description" content="SmartScale AI helps small and mid-sized businesses leverage artificial intelligence for smarter growth, efficiency, and innovation." />
  
  <!-- GitHub Pages SPA - Very simple version that works with 404.html -->
  <script type="text/javascript">
    // Check if we're being redirected from 404.html
    if (window.location.search.includes('?p=')) {
      // Get the path from the p parameter
      var path = decodeURIComponent(window.location.search.split('?p=')[1].split('&')[0]);
      // Replace the current URL without reloading
      history.replaceState(null, null, path);
    }
  </script>
  
  <!-- Load the actual app -->
  <script type="text/javascript">
    // Redirect to the actual app
    window.location.href = 'build/index.html' + window.location.pathname.replace('index.html', '') + window.location.search;
  </script>
</head>
<body>
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px;">
    <h1>SmartScale AI</h1>
    <p>Redirecting to SmartScale AI website...</p>
  </div>
</body>
</html>
"@
Set-Content -Path "index.html" -Value $indexContent

# Create simple 404.html for GitHub Pages
Write-Host "Creating 404.html for GitHub Pages..."
$html404Content = @"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SmartScale AI - Page Not Found</title>
  <script type="text/javascript">
    // Simple redirect to the root with the current URL as a parameter
    var path = window.location.pathname;
    window.location.href = '/?p=' + encodeURIComponent(path);
  </script>
</head>
<body>
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 50px;">
    <h1>Page Not Found</h1>
    <p>Redirecting to homepage...</p>
  </div>
</body>
</html>
"@
Set-Content -Path "404.html" -Value $html404Content

Write-Host "The website is now ready for deployment!"
Write-Host "You can now commit these changes to your GitHub repository."
Write-Host "GitHub Pages will deploy the website."

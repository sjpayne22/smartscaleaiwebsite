# PowerShell script for building SmartScaleAI website

Write-Host "Building SmartScale AI Website..."

# Clean up previous build artifacts
if (Test-Path -Path "build") {
    Write-Host "Cleaning up previous build..."
    Remove-Item -Path "build" -Recurse -Force
}

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

# Copy the built files to the root for GitHub Pages
Write-Host "Setting up files for GitHub Pages..."

# Create index.html for GitHub Pages
Write-Host "Creating index.html in the repository root..."
$indexContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SmartScale AI Consulting LLC | Smart AI Solutions for Smart Growth</title>
  <meta name="description" content="SmartScale AI helps small and mid-sized businesses leverage artificial intelligence for smarter growth, efficiency, and innovation." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <meta http-equiv="refresh" content="0;url=./build/index.html">
  
  <!-- Single Page Apps for GitHub Pages -->
  <script type="text/javascript">
    window.location.href = './build/index.html' + window.location.search + window.location.hash;
  </script>
</head>
<body>
  Redirecting to SmartScale AI website...
</body>
</html>
"@
Set-Content -Path "index.html" -Value $indexContent

# Create 404.html for GitHub Pages
Write-Host "Creating 404.html for GitHub Pages..."
$html404Content = @"
<!DOCTYPE html>
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
</html>
"@
Set-Content -Path "404.html" -Value $html404Content

Write-Host "The website is now ready for deployment!"
Write-Host "You can now commit these changes to your GitHub repository."
Write-Host "GitHub Pages will deploy from the 'build' directory."

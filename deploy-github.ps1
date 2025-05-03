# PowerShell Script to deploy SmartScale AI Website to GitHub Pages

# Stop on error
$ErrorActionPreference = "Stop"

Write-Host "\nSmartScale AI - GitHub Pages Deployment" -ForegroundColor Cyan
Write-Host "======================================\n" -ForegroundColor Cyan

# Build for GitHub Pages
Write-Host "Step 1: Building for GitHub Pages..." -ForegroundColor Yellow
try {
    node build.js github
    if ($LASTEXITCODE -ne 0) { throw "Build failed with exit code $LASTEXITCODE" }
    Write-Host "\u2705 Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "\u274c Build failed: $_" -ForegroundColor Red
    exit 1
}

# Check if git is available
Write-Host "\nStep 2: Checking git installation..." -ForegroundColor Yellow
try {
    git --version | Out-Null
    Write-Host "\u2705 Git is installed" -ForegroundColor Green
} catch {
    Write-Host "\u274c Git is not installed. Please install Git to continue." -ForegroundColor Red
    exit 1
}

# Check if we're in a git repository
Write-Host "\nStep 3: Checking git repository..." -ForegroundColor Yellow
try {
    git status | Out-Null
    Write-Host "\u2705 Git repository is valid" -ForegroundColor Green
} catch {
    Write-Host "\u274c Not a git repository. Please run this script from your git repository." -ForegroundColor Red
    exit 1
}

# Get current branch
$currentBranch = git branch --show-current
Write-Host "\nCurrent branch: $currentBranch" -ForegroundColor Cyan

# Ask for confirmation
Write-Host "\nThis will deploy the build/ folder to GitHub Pages." -ForegroundColor Yellow
$confirm = Read-Host "Do you want to continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Create or switch to gh-pages branch
Write-Host "\nStep 4: Setting up gh-pages branch..." -ForegroundColor Yellow

# Check if gh-pages branch exists locally
$branchExists = git show-ref --verify --quiet refs/heads/gh-pages

if ($LASTEXITCODE -ne 0) {
    # Branch doesn't exist locally, check if it exists remotely
    git fetch origin
    $remoteBranchExists = git show-ref --verify --quiet refs/remotes/origin/gh-pages
    
    if ($LASTEXITCODE -ne 0) {
        # Branch doesn't exist remotely either, create a new orphan branch
        Write-Host "Creating new gh-pages branch..." -ForegroundColor Cyan
        git checkout --orphan gh-pages
        git rm -rf .
        Write-Host "\u2705 Created gh-pages branch" -ForegroundColor Green
    } else {
        # Branch exists remotely but not locally
        Write-Host "Setting up tracking of remote gh-pages branch..." -ForegroundColor Cyan
        git checkout -b gh-pages origin/gh-pages
        git rm -rf .
        Write-Host "\u2705 Checked out gh-pages branch" -ForegroundColor Green
    }
} else {
    # Branch exists locally
    Write-Host "Switching to existing gh-pages branch..." -ForegroundColor Cyan
    git checkout gh-pages
    git rm -rf .
    Write-Host "\u2705 Switched to gh-pages branch" -ForegroundColor Green
}

# Copy build files to root
Write-Host "\nStep 5: Copying build files..." -ForegroundColor Yellow
try {
    Copy-Item -Path "build/*" -Destination "." -Recurse -Force
    Write-Host "\u2705 Build files copied successfully" -ForegroundColor Green
} catch {
    Write-Host "\u274c Failed to copy build files: $_" -ForegroundColor Red
    exit 1
}

# Create .nojekyll file to prevent Jekyll processing
Write-Host "\nStep 6: Creating .nojekyll file..." -ForegroundColor Yellow
try {
    "" | Out-File -FilePath ".nojekyll" -Encoding utf8 -NoNewline
    Write-Host "\u2705 .nojekyll file created" -ForegroundColor Green
} catch {
    Write-Host "\u274c Failed to create .nojekyll file: $_" -ForegroundColor Red
    exit 1
}

# Add files to git
Write-Host "\nStep 7: Adding files to git..." -ForegroundColor Yellow
try {
    git add .
    Write-Host "\u2705 Files added to git" -ForegroundColor Green
} catch {
    Write-Host "\u274c Failed to add files to git: $_" -ForegroundColor Red
    exit 1
}

# Commit changes
Write-Host "\nStep 8: Committing changes..." -ForegroundColor Yellow
try {
    git commit -m "Update GitHub Pages site on $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    Write-Host "\u2705 Changes committed" -ForegroundColor Green
} catch {
    if ($LASTEXITCODE -eq 1) {
        Write-Host "\u26a0\ufe0f No changes to commit" -ForegroundColor Yellow
    } else {
        Write-Host "\u274c Failed to commit changes: $_" -ForegroundColor Red
        exit 1
    }
}

# Push to GitHub
Write-Host "\nStep 9: Pushing to GitHub..." -ForegroundColor Yellow
try {
    git push origin gh-pages
    Write-Host "\u2705 Successfully pushed to GitHub" -ForegroundColor Green
} catch {
    Write-Host "\u274c Failed to push to GitHub: $_" -ForegroundColor Red
    exit 1
}

# Switch back to original branch
Write-Host "\nStep 10: Switching back to original branch..." -ForegroundColor Yellow
try {
    git checkout $currentBranch
    Write-Host "\u2705 Switched back to $currentBranch" -ForegroundColor Green
} catch {
    Write-Host "\u274c Failed to switch back to original branch: $_" -ForegroundColor Red
    exit 1
}

Write-Host "\n======================================" -ForegroundColor Cyan
Write-Host "\u2705 GitHub Pages deployment completed!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "\nYour site will be available at: https://[username].github.io/[repository-name]/" -ForegroundColor Cyan
Write-Host "Note: It may take a few minutes for the changes to be visible." -ForegroundColor Yellow
Write-Host "\nNext steps:" -ForegroundColor Yellow
Write-Host "1. Configure your repository settings to use the gh-pages branch for GitHub Pages" -ForegroundColor White
Write-Host "2. Check your site at the URL above" -ForegroundColor White
Write-Host "3. Configure a custom domain in your repository settings (optional)" -ForegroundColor White

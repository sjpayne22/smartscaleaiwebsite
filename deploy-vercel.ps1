# PowerShell Script to deploy SmartScale AI Website to Vercel

# Stop on error
$ErrorActionPreference = "Stop"

Write-Host "\nSmartScale AI - Vercel Deployment" -ForegroundColor Cyan
Write-Host "======================================\n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
Write-Host "Step 1: Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    vercel --version | Out-Null
    Write-Host "\u2705 Vercel CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "\u274c Vercel CLI is not installed." -ForegroundColor Red
    Write-Host "Would you like to install Vercel CLI now? (y/n)" -ForegroundColor Yellow
    $installVercel = Read-Host
    
    if ($installVercel -eq "y") {
        Write-Host "Installing Vercel CLI..." -ForegroundColor Cyan
        try {
            npm install -g vercel
            Write-Host "\u2705 Vercel CLI installed successfully" -ForegroundColor Green
        } catch {
            Write-Host "\u274c Failed to install Vercel CLI: $_" -ForegroundColor Red
            Write-Host "Please install it manually with: npm install -g vercel" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "Please install Vercel CLI with: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
}

# Check Vercel login status
Write-Host "\nStep 2: Checking Vercel login status..." -ForegroundColor Yellow
try {
    $loginCheck = vercel whoami 2>&1
    # If the command succeeds, the user is logged in
    Write-Host "\u2705 Logged in to Vercel as: $loginCheck" -ForegroundColor Green
} catch {
    Write-Host "\u274c Not logged in to Vercel" -ForegroundColor Red
    Write-Host "Please login to Vercel" -ForegroundColor Yellow
    
    try {
        vercel login
        Write-Host "\u2705 Successfully logged in to Vercel" -ForegroundColor Green
    } catch {
        Write-Host "\u274c Failed to login to Vercel: $_" -ForegroundColor Red
        exit 1
    }
}

# Build for Vercel
Write-Host "\nStep 3: Building for Vercel..." -ForegroundColor Yellow
try {
    node build.js vercel
    if ($LASTEXITCODE -ne 0) { throw "Build failed with exit code $LASTEXITCODE" }
    Write-Host "\u2705 Build completed successfully" -ForegroundColor Green
} catch {
    Write-Host "\u274c Build failed: $_" -ForegroundColor Red
    exit 1
}

# Ask for confirmation
Write-Host "\nThis will deploy the build/ folder to Vercel." -ForegroundColor Yellow
$confirm = Read-Host "Do you want to continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

# Deploy to Vercel
Write-Host "\nStep 4: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "Would you like to:" -ForegroundColor Yellow
Write-Host "1. Deploy to preview (vercel)" -ForegroundColor White
Write-Host "2. Deploy to production (vercel --prod)" -ForegroundColor White
$deployOption = Read-Host "Enter option (1/2)"

try {
    if ($deployOption -eq "2") {
        Write-Host "Deploying to production..." -ForegroundColor Cyan
        vercel build --prod
        if ($LASTEXITCODE -ne 0) { throw "Vercel build failed with exit code $LASTEXITCODE" }
        
        vercel deploy --prebuilt --prod
        if ($LASTEXITCODE -ne 0) { throw "Vercel deployment failed with exit code $LASTEXITCODE" }
        
        Write-Host "\u2705 Successfully deployed to production" -ForegroundColor Green
    } else {
        Write-Host "Deploying to preview..." -ForegroundColor Cyan
        vercel
        if ($LASTEXITCODE -ne 0) { throw "Vercel deployment failed with exit code $LASTEXITCODE" }
        
        Write-Host "\u2705 Successfully deployed to preview" -ForegroundColor Green
    }
} catch {
    Write-Host "\u274c Failed to deploy to Vercel: $_" -ForegroundColor Red
    exit 1
}

Write-Host "\n======================================" -ForegroundColor Cyan
Write-Host "\u2705 Vercel deployment completed!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan

Write-Host "\nNext steps:" -ForegroundColor Yellow
Write-Host "1. Access your deployment at the URL provided by Vercel" -ForegroundColor White
Write-Host "2. Configure your custom domain in the Vercel dashboard" -ForegroundColor White
Write-Host "3. Set up environment variables in the Vercel dashboard (if needed)" -ForegroundColor White

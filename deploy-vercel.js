/**
 * Simple Vercel Deployment Script (JavaScript Version)
 * Works on any system with Node.js installed
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function execCommand(command) {
  console.log(`\n> ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function deploy() {
  console.log('\n=======================================');
  console.log('    SMARTSCALE AI VERCEL DEPLOYMENT    ');
  console.log('=======================================\n');
  
  // Step 1: Check for Vercel CLI
  console.log('Step 1: Checking for Vercel CLI...');
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.log('❌ Vercel CLI is not installed');
    const installVercel = await askQuestion('Would you like to install Vercel CLI now? (y/n): ');
    
    if (installVercel.toLowerCase() === 'y') {
      if (!execCommand('npm install -g vercel')) {
        console.error('\n❌ Failed to install Vercel CLI');
        console.log('Please install it manually with: npm install -g vercel');
        rl.close();
        return;
      }
      console.log('✅ Vercel CLI installed successfully');
    } else {
      console.log('\nPlease install Vercel CLI with: npm install -g vercel');
      rl.close();
      return;
    }
  }
  
  // Step 2: Check login status
  console.log('\nStep 2: Checking Vercel login status...');
  try {
    const loginCheck = execSync('vercel whoami', { stdio: 'pipe' }).toString().trim();
    console.log(`✅ Logged in to Vercel as: ${loginCheck}`);
  } catch (error) {
    console.log('❌ Not logged in to Vercel');
    console.log('\nPlease login to Vercel:');
    
    if (!execCommand('vercel login')) {
      console.error('\n❌ Failed to login to Vercel');
      rl.close();
      return;
    }
    console.log('✅ Successfully logged in to Vercel');
  }
  
  // Step 3: Build for Vercel
  console.log('\nStep 3: Building for Vercel...');
  if (!execCommand('node build.js vercel')) {
    console.error('\n❌ Build failed');
    rl.close();
    return;
  }
  console.log('✅ Build completed successfully');
  
  // Step 4: Deploy confirmation
  const confirm = await askQuestion('\nThis will deploy the build/ folder to Vercel. Continue? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('Deployment cancelled.');
    rl.close();
    return;
  }
  
  // Step 5: Select deployment type
  console.log('\nStep 4: Deploying to Vercel...');
  console.log('Would you like to:');
  console.log('1. Deploy to preview (vercel)');
  console.log('2. Deploy to production (vercel --prod)');
  const deployOption = await askQuestion('Enter option (1/2): ');
  
  if (deployOption === '2') {
    console.log('\nDeploying to production...');
    if (!execCommand('vercel --prod')) {
      console.error('\n❌ Production deployment failed');
      rl.close();
      return;
    }
    console.log('✅ Successfully deployed to production');
  } else {
    console.log('\nDeploying to preview...');
    if (!execCommand('vercel')) {
      console.error('\n❌ Preview deployment failed');
      rl.close();
      return;
    }
    console.log('✅ Successfully deployed to preview');
  }
  
  console.log('\n=======================================');
  console.log('✅ Vercel deployment completed!');
  console.log('=======================================');
  
  console.log('\nNext steps:');
  console.log('1. Access your deployment at the URL provided by Vercel');
  console.log('2. Configure your custom domain in the Vercel dashboard');
  console.log('3. Set up environment variables in the Vercel dashboard if needed');
  
  rl.close();
}

deploy().catch(error => {
  console.error('\n❌ Deployment failed:', error.message);
  rl.close();
});

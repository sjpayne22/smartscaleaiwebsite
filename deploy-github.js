/**
 * Simple GitHub Pages Deployment Script (JavaScript Version)
 * Works on any system with Node.js installed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
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
  console.log('  SMARTSCALE AI GITHUB PAGES DEPLOYMENT  ');
  console.log('=======================================\n');
  
  // Step 1: Check for git
  console.log('Step 1: Checking for git...');
  try {
    execSync('git --version', { stdio: 'pipe' });
    console.log('✅ Git is installed');
  } catch (error) {
    console.error('\n❌ Git is not installed');
    console.log('Please install Git to continue: https://git-scm.com/downloads');
    rl.close();
    return;
  }
  
  // Step 2: Check git repository
  console.log('\nStep 2: Checking git repository...');
  try {
    execSync('git status', { stdio: 'pipe' });
    console.log('✅ Git repository is valid');
  } catch (error) {
    console.error('\n❌ Not a git repository');
    console.log('Please run this script from your git repository.');
    rl.close();
    return;
  }
  
  // Get current branch
  const currentBranch = execSync('git branch --show-current', { stdio: 'pipe' }).toString().trim();
  console.log(`\nCurrent branch: ${currentBranch}`);
  
  // Step 3: Build for GitHub Pages
  console.log('\nStep 3: Building for GitHub Pages...');
  if (!execCommand('node build.js github')) {
    console.error('\n❌ Build failed');
    rl.close();
    return;
  }
  console.log('✅ Build completed successfully');
  
  // Step 4: Deploy confirmation
  const confirm = await askQuestion('\nThis will deploy the build/ folder to GitHub Pages. Continue? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('Deployment cancelled.');
    rl.close();
    return;
  }
  
  // Step 5: Set up gh-pages branch
  console.log('\nStep 5: Setting up gh-pages branch...');
  
  // Check if gh-pages branch exists locally
  try {
    execSync('git show-ref --verify --quiet refs/heads/gh-pages', { stdio: 'pipe' });
    // Branch exists locally
    console.log('Switching to existing gh-pages branch...');
    if (!execCommand('git checkout gh-pages') || !execCommand('git rm -rf .')) {
      console.error('\n❌ Failed to switch to gh-pages branch');
      rl.close();
      return;
    }
    console.log('✅ Switched to gh-pages branch');
  } catch (error) {
    // Branch doesn't exist locally, check if it exists remotely
    execCommand('git fetch origin');
    try {
      execSync('git show-ref --verify --quiet refs/remotes/origin/gh-pages', { stdio: 'pipe' });
      // Branch exists remotely but not locally
      console.log('Setting up tracking of remote gh-pages branch...');
      if (!execCommand('git checkout -b gh-pages origin/gh-pages') || !execCommand('git rm -rf .')) {
        console.error('\n❌ Failed to set up gh-pages branch');
        rl.close();
        return;
      }
      console.log('✅ Checked out gh-pages branch');
    } catch (error) {
      // Branch doesn't exist remotely either, create a new orphan branch
      console.log('Creating new gh-pages branch...');
      if (!execCommand('git checkout --orphan gh-pages') || !execCommand('git rm -rf .')) {
        console.error('\n❌ Failed to create gh-pages branch');
        rl.close();
        return;
      }
      console.log('✅ Created gh-pages branch');
    }
  }
  
  // Step 6: Copy build files to root
  console.log('\nStep 6: Copying build files...');
  try {
    // Implement a simple copy function in pure JS for cross-platform compatibility
    function copyFolderSync(from, to) {
      fs.mkdirSync(to, { recursive: true });
      fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.statSync(fromPath).isFile()) {
          fs.copyFileSync(fromPath, toPath);
        } else {
          copyFolderSync(fromPath, toPath);
        }
      });
    }
    
    copyFolderSync('build', '.');
    console.log('✅ Build files copied successfully');
  } catch (error) {
    console.error('\n❌ Failed to copy build files:', error.message);
    rl.close();
    return;
  }
  
  // Step 7: Create .nojekyll file
  console.log('\nStep 7: Creating .nojekyll file...');
  try {
    fs.writeFileSync('.nojekyll', '');
    console.log('✅ .nojekyll file created');
  } catch (error) {
    console.error('\n❌ Failed to create .nojekyll file:', error.message);
    rl.close();
    return;
  }
  
  // Step 8: Add files to git
  console.log('\nStep 8: Adding files to git...');
  if (!execCommand('git add .')) {
    console.error('\n❌ Failed to add files to git');
    rl.close();
    return;
  }
  console.log('✅ Files added to git');
  
  // Step 9: Commit changes
  console.log('\nStep 9: Committing changes...');
  try {
    execSync(`git commit -m "Update GitHub Pages site on ${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().split(' ')[0]}"`, { stdio: 'inherit' });
    console.log('✅ Changes committed');
  } catch (error) {
    if (error.status === 1) {
      console.log('⚠️ No changes to commit');
    } else {
      console.error('\n❌ Failed to commit changes:', error.message);
      rl.close();
      return;
    }
  }
  
  // Step 10: Push to GitHub
  console.log('\nStep 10: Pushing to GitHub...');
  if (!execCommand('git push origin gh-pages')) {
    console.error('\n❌ Failed to push to GitHub');
    rl.close();
    return;
  }
  console.log('✅ Successfully pushed to GitHub');
  
  // Step 11: Switch back to original branch
  console.log('\nStep 11: Switching back to original branch...');
  if (!execCommand(`git checkout ${currentBranch}`)) {
    console.error(`\n❌ Failed to switch back to ${currentBranch}`);
    rl.close();
    return;
  }
  console.log(`✅ Switched back to ${currentBranch}`);
  
  console.log('\n=======================================');
  console.log('✅ GitHub Pages deployment completed!');
  console.log('=======================================');
  
  console.log('\nYour site will be available at: https://[username].github.io/[repository-name]/');
  console.log('Note: It may take a few minutes for the changes to be visible.');
  
  console.log('\nNext steps:');
  console.log('1. Configure your repository settings to use the gh-pages branch for GitHub Pages');
  console.log('2. Check your site at the URL above');
  console.log('3. Configure a custom domain in your repository settings (optional)');
  
  rl.close();
}

deploy().catch(error => {
  console.error('\n❌ Deployment failed:', error.message);
  rl.close();
});

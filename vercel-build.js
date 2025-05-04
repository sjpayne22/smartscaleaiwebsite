/**
 * DEPRECATED: This script has been replaced by vercel-build-new.js
 * Please use the new script for better error handling and asset path correction.
 *
 * To use the new build script, run: node vercel-build-new.js
 */

console.log('⚠️ WARNING: This build script is deprecated!');
console.log('Please use the new script instead: node vercel-build-new.js');
console.log('\nRedirecting to the new build script...');

const { execSync } = require('child_process');

try {
  execSync('node vercel-build-new.js', { stdio: 'inherit' });
  console.log('\n✅ Build completed successfully using the new build script');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
/**
 * Simple WordPress API Connection Test
 * 
 * This script checks if your WordPress REST API is accessible
 * without requiring any special packages.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Your WordPress site URL
const WP_SITE_URL = process.env.WP_API_URL || 'https://blog.smartscaleai.ai';
const WP_API_URL = `${WP_SITE_URL}/wp-json/wp/v2`;

console.log('====================================');
console.log('WordPress API Connectivity Test');
console.log('====================================');
console.log(`Target WordPress site: ${WP_SITE_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const requestModule = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = requestModule.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: JSON.parse(data)
            });
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP Error: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Test basic WordPress API connectivity
async function testBasicConnectivity() {
  try {
    console.log('Testing basic WordPress API connection...');
    const response = await makeRequest(`${WP_SITE_URL}/wp-json`);
    
    console.log('✅ SUCCESS: WordPress REST API is accessible');
    console.log(`API Name: ${response.data?.name || 'Unknown'}`);
    console.log(`API Description: ${response.data?.description || 'No description'}\n`);
    return true;
  } catch (error) {
    console.error('❌ ERROR: Cannot connect to WordPress REST API');
    console.error(`Error details: ${error.message}\n`);
    return false;
  }
}

// Test fetching posts
async function testPosts() {
  try {
    console.log('Testing fetching posts...');
    const response = await makeRequest(`${WP_API_URL}/posts?per_page=1`);
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      console.log('✅ SUCCESS: Posts API is working');
      console.log(`Found ${response.data.length} post(s)`);
      console.log(`First post title: ${response.data[0].title?.rendered || 'No title'}\n`);
    } else {
      console.log('⚠️ WARNING: Posts API returned no posts\n');
    }
    return true;
  } catch (error) {
    console.error('❌ ERROR: Cannot fetch posts');
    console.error(`Error details: ${error.message}\n`);
    return false;
  }
}

// Test CORS headers
async function testCORS() {
  try {
    console.log('Testing CORS headers...');
    // We can't fully test CORS server-side, but we can check if the headers exist
    const response = await makeRequest(`${WP_API_URL}/posts?per_page=1`);
    
    const corsHeaders = [
      'access-control-allow-origin',
      'access-control-allow-methods',
      'access-control-allow-headers'
    ];
    
    const foundHeaders = corsHeaders.filter(header => {
      return Object.keys(response.headers).some(h => h.toLowerCase() === header);
    });
    
    if (foundHeaders.length > 0) {
      console.log('✅ SUCCESS: CORS headers are present');
      console.log(`Found CORS headers: ${foundHeaders.join(', ')}\n`);
      return true;
    } else {
      console.log('⚠️ WARNING: No CORS headers detected');
      console.log('This might cause issues with browser access\n');
      return false;
    }
  } catch (error) {
    console.error('❌ ERROR: CORS test failed');
    console.error(`Error details: ${error.message}\n`);
    return false;
  }
}

// Run all tests
async function runTests() {
  const basicResult = await testBasicConnectivity();
  if (!basicResult) {
    console.log('Basic connectivity test failed, stopping further tests.');
    return;
  }
  
  const postsResult = await testPosts();
  const corsResult = await testCORS();
  
  console.log('====================================');
  console.log('SUMMARY OF RESULTS');
  console.log('====================================');
  console.log(`Basic API Connection: ${basicResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Posts API: ${postsResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`CORS Headers: ${corsResult ? '✅ PASS' : '⚠️ WARNING'}`);
  
  const overallStatus = basicResult && postsResult;
  console.log(`\nOverall Status: ${overallStatus ? '✅ READY TO USE' : '❌ NEEDS ATTENTION'}`);
  
  if (!overallStatus) {
    console.log('\nTroubleshooting tips:');
    if (!basicResult) {
      console.log('- Verify your WordPress site URL is correct');
      console.log('- Check if your WordPress site is accessible');
      console.log('- Ensure the REST API is enabled on your WordPress site');
    }
    if (!postsResult) {
      console.log('- Check if there are any posts published on your WordPress site');
      console.log('- Verify that posts are public and accessible');
    }
    if (!corsResult) {
      console.log('- Configure CORS headers in your WordPress site');
      console.log('- You may need to add custom code to your WordPress theme or use a CORS plugin');
    }
  }
}

runTests();

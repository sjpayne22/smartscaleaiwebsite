/**
 * WordPress API Connection Test (v2)
 * 
 * This script checks if your WordPress.com REST API is properly configured
 * and can be accessed from your application.
 * 
 * Compatible with older Node.js versions.
 */

const WPAPI = require('wpapi');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Your WordPress site URL
const WP_SITE_URL = process.env.WP_API_URL || 'https://blog.smartscaleai.ai';

console.log('Testing WordPress API connectivity...');
console.log(`Target WordPress site: ${WP_SITE_URL}`);

// Simple HTTP request function
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Attempt to parse JSON
            try {
              const jsonData = JSON.parse(data);
              resolve({ statusCode: res.statusCode, headers: res.headers, body: jsonData });
            } catch (e) {
              // Not JSON
              resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
            }
          } else {
            resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
          }
        } catch (e) {
          reject(new Error(`Error parsing response: ${e.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Basic API connection test
async function testBasicConnection() {
  try {
    console.log('\n1. Testing basic REST API connection...');
    const response = await makeRequest(`${WP_SITE_URL}/wp-json`);
    
    if (response.statusCode === 200) {
      console.log('\u2705 Basic API connection successful!');
      console.log(`WordPress name: ${response.body.name}`);
      console.log(`WordPress description: ${response.body.description}`);
      console.log(`WordPress URL: ${response.body.url}`);
      return true;
    } else {
      console.error(`\u274c API connection failed with status: ${response.statusCode}`);
      console.error('Response:', response.body);
      return false;
    }
  } catch (error) {
    console.error('\u274c Failed to connect to WordPress API:');
    console.error(error.message);
    return false;
  }
}

// WPAPI test
async function testWPAPI() {
  try {
    console.log('\n2. Testing WPAPI connection...');
    const wp = new WPAPI({ endpoint: `${WP_SITE_URL}/wp-json` });
    
    const posts = await wp.posts().perPage(1).get();
    
    if (posts && posts.length > 0) {
      console.log('\u2705 WPAPI connection successful!');
      console.log(`Found ${posts.length} posts`);
      console.log('First post title:', posts[0].title.rendered);
      return true;
    } else {
      console.log('\u26a0\ufe0f WPAPI connected but no posts found');
      return true; // Still a successful connection
    }
  } catch (error) {
    console.error('\u274c WPAPI connection failed:');
    console.error(error.message);
    return false;
  }
}

// CORS test
async function testCORS() {
  try {
    console.log('\n3. Testing CORS configuration...');
    const options = {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };
    
    const response = await makeRequest(`${WP_SITE_URL}/wp-json/wp/v2/posts`, options);
    
    // Check for CORS headers
    const corsHeader = response.headers['access-control-allow-origin'];
    
    if (corsHeader) {
      console.log('\u2705 CORS is properly configured!');
      console.log(`CORS header: ${corsHeader}`);
      return true;
    } else {
      console.warn('\u26a0\ufe0f CORS headers not detected in the response');
      console.log('This might cause issues with browser access');
      // Convert headers to object manually for compatibility with older Node versions
      const headersObj = {};
      for (const key in response.headers) {
        headersObj[key] = response.headers[key];
      }
      console.log('Headers received:', headersObj);
      return false;
    }
  } catch (error) {
    console.error('\u274c CORS test failed:');
    console.error(error.message);
    return false;
  }
}

// Custom post types test
async function testCustomPostTypes() {
  try {
    console.log('\n4. Testing custom post types...');
    const response = await makeRequest(`${WP_SITE_URL}/wp-json/wp/v2/types`);
    
    if (response.statusCode === 200) {
      const types = response.body;
      console.log('\u2705 Successfully retrieved post types!');
      console.log('Available post types:');
      Object.keys(types).forEach(type => {
        if (type !== 'post' && type !== 'page' && type !== 'attachment') {
          console.log(`- ${type} (Custom post type)`);
        } else {
          console.log(`- ${type}`);
        }
      });
      return true;
    } else {
      console.error(`\u274c Failed to get post types: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.error('\u274c Custom post types test failed:');
    console.error(error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=======================================');
  console.log('   WORDPRESS API CONNECTION TESTER');  
  console.log('=======================================\n');
  
  const basicResult = await testBasicConnection();
  const wpapiResult = await testWPAPI();
  const corsResult = await testCORS();
  const typesResult = await testCustomPostTypes();
  
  console.log('\n=======================================');
  console.log('           TEST RESULTS');  
  console.log('=======================================');
  console.log(`Basic API Connection: ${basicResult ? '\u2705 PASS' : '\u274c FAIL'}`);
  console.log(`WPAPI Library: ${wpapiResult ? '\u2705 PASS' : '\u274c FAIL'}`);
  console.log(`CORS Configuration: ${corsResult ? '\u2705 PASS' : '\u26a0\ufe0f WARNING'}`);
  console.log(`Custom Post Types: ${typesResult ? '\u2705 PASS' : '\u274c FAIL'}`);
  
  const overallStatus = basicResult && wpapiResult;
  console.log('\nOverall Status:', overallStatus ? '\u2705 READY TO USE' : '\u274c NEEDS ATTENTION');
  
  if (!overallStatus) {
    console.log('\nTroubleshooting tips:');
    if (!basicResult) {
      console.log('- Verify your WordPress site URL is correct');
      console.log('- Check if your WordPress site is accessible');
      console.log('- Ensure the REST API is enabled on your WordPress site');
    }
    if (!wpapiResult) {
      console.log('- Check if WPAPI is properly installed');
      console.log('- Verify endpoint URL format');
    }
    if (!corsResult) {
      console.log('- Add CORS headers to your WordPress site');
      console.log('- Check for plugins that might block cross-origin requests');
    }
    if (!typesResult) {
      console.log('- Verify Custom Post Types UI plugin is active');
      console.log('- Check if custom post types are properly registered');
      console.log('- Ensure custom post types are set to "show in REST API"');
    }
  }
}

runAllTests();

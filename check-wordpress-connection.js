/**
 * WordPress API Connection Test
 * 
 * This script checks if your WordPress.com REST API is properly configured
 * and can be accessed from your application.
 */

const WPAPI = require('wpapi');
const fetch = require('node-fetch');

// Your WordPress site URL
const WP_SITE_URL = process.env.WP_API_URL || 'https://yoursitename.wordpress.com';

console.log('Testing WordPress API connectivity...');
console.log(`Target WordPress site: ${WP_SITE_URL}`);

// Basic fetch test
async function testBasicConnection() {
  try {
    console.log('\n1. Testing basic REST API connection...');
    const response = await fetch(`${WP_SITE_URL}/wp-json`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log('✅ Basic API connection successful!');
      console.log(`WordPress name: ${data.name}`);
      console.log(`WordPress description: ${data.description}`);
      console.log(`WordPress URL: ${data.url}`);
      return true;
    } else {
      console.error(`❌ API connection failed with status: ${response.status}`);
      console.error('Response:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to connect to WordPress API:');
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
      console.log('✅ WPAPI connection successful!');
      console.log(`Found ${posts.length} posts`);
      console.log('First post title:', posts[0].title.rendered);
      return true;
    } else {
      console.log('⚠️ WPAPI connected but no posts found');
      return true; // Still a successful connection
    }
  } catch (error) {
    console.error('❌ WPAPI connection failed:');
    console.error(error.message);
    return false;
  }
}

// CORS test
async function testCORS() {
  try {
    console.log('\n3. Testing CORS configuration...');
    const response = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/posts`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeader = response.headers.get('access-control-allow-origin');
    
    if (corsHeader) {
      console.log('✅ CORS is properly configured!');
      console.log(`CORS header: ${corsHeader}`);
      return true;
    } else {
      console.warn('⚠️ CORS headers not detected in the response');
      console.log('This might cause issues with browser access');
      console.log('Headers received:', Object.fromEntries([...response.headers]));
      return false;
    }
  } catch (error) {
    console.error('❌ CORS test failed:');
    console.error(error.message);
    return false;
  }
}

// Custom post types test
async function testCustomPostTypes() {
  try {
    console.log('\n4. Testing custom post types...');
    const response = await fetch(`${WP_SITE_URL}/wp-json/wp/v2/types`);
    
    if (response.status === 200) {
      const types = await response.json();
      console.log('✅ Successfully retrieved post types!');
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
      console.error(`❌ Failed to get post types: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Custom post types test failed:');
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
  console.log(`Basic API Connection: ${basicResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`WPAPI Library: ${wpapiResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`CORS Configuration: ${corsResult ? '✅ PASS' : '⚠️ WARNING'}`);
  console.log(`Custom Post Types: ${typesResult ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallStatus = basicResult && wpapiResult;
  console.log('\nOverall Status:', overallStatus ? '✅ READY TO USE' : '❌ NEEDS ATTENTION');
  
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

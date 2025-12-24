#!/usr/bin/env node

/**
 * Cloudinary URL Fetcher
 *
 * This script fetches all image URLs from your Cloudinary account
 * and saves them to a file for easy mapping.
 *
 * Usage:
 *   node fetch-cloudinary-urls.js
 *
 * Or make it executable:
 *   chmod +x fetch-cloudinary-urls.js
 *   ./fetch-cloudinary-urls.js
 */

const https = require('https');
const fs = require('fs');

// ============================================
// CONFIGURATION - Edit these values
// ============================================

const CONFIG = {
  cloudName: 'dlqfyv1qj',
  apiKey: 'YOUR_API_KEY_HERE',        // Get from Cloudinary console
  apiSecret: 'YOUR_API_SECRET_HERE',   // Get from Cloudinary console
  maxResults: 500                       // Maximum images to fetch
};

// ============================================
// Script Logic (Don't edit below)
// ============================================

console.log('🔍 Fetching images from Cloudinary...\n');

// Validate config
if (CONFIG.apiKey === 'YOUR_API_KEY_HERE' || CONFIG.apiSecret === 'YOUR_API_SECRET_HERE') {
  console.error('❌ Error: Please edit this file and add your API Key and Secret');
  console.error('   Get them from: https://cloudinary.com/console/settings/security\n');
  process.exit(1);
}

// Create Basic Auth header
const auth = Buffer.from(`${CONFIG.apiKey}:${CONFIG.apiSecret}`).toString('base64');

// API request options
const options = {
  hostname: 'api.cloudinary.com',
  path: `/v1_1/${CONFIG.cloudName}/resources/image?max_results=${CONFIG.maxResults}`,
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`
  }
};

// Make the request
const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`❌ API Error: ${res.statusCode}`);
      console.error(`Response: ${data}\n`);

      if (res.statusCode === 401) {
        console.error('💡 This usually means your API Key or Secret is incorrect.');
        console.error('   Check: https://cloudinary.com/console/settings/security\n');
      }

      process.exit(1);
    }

    try {
      const response = JSON.parse(data);

      if (!response.resources || response.resources.length === 0) {
        console.log('⚠️  No images found in your Cloudinary account.\n');
        process.exit(0);
      }

      const images = response.resources;
      console.log(`✅ Found ${images.length} images!\n`);

      // Extract URLs
      const urls = images.map(img => ({
        url: img.secure_url,
        publicId: img.public_id,
        format: img.format,
        createdAt: img.created_at
      }));

      // Save to file
      const outputFile = 'cloudinary-urls.txt';
      const output = urls.map(img => img.url).join('\n');

      fs.writeFileSync(outputFile, output);
      console.log(`📁 Saved all URLs to: ${outputFile}`);

      // Also save detailed JSON
      const jsonFile = 'cloudinary-images.json';
      fs.writeFileSync(jsonFile, JSON.stringify(urls, null, 2));
      console.log(`📁 Saved detailed info to: ${jsonFile}\n`);

      // Display summary
      console.log('📊 Summary:');
      console.log(`   Total images: ${urls.length}`);
      console.log(`   Output files: ${outputFile}, ${jsonFile}\n`);

      console.log('🎯 Next steps:');
      console.log('   1. Open cloudinary-url-mapper.html in your browser');
      console.log('   2. Copy the contents of cloudinary-urls.txt');
      console.log('   3. Paste into the mapper tool');
      console.log('   4. Click "Process URLs" and send me the mapping!\n');

    } catch (error) {
      console.error('❌ Error parsing response:', error.message);
      console.error('Response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network error:', error.message);
  process.exit(1);
});

req.end();

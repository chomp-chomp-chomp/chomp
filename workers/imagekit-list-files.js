/**
 * Cloudflare Worker for ImageKit File Listing
 * Lists images from ImageKit for the image browser
 *
 * Setup:
 * 1. Create a Cloudflare Worker at https://workers.cloudflare.com/
 * 2. Copy this code into the worker
 * 3. Add environment variables in Cloudflare Dashboard:
 *    - IMAGEKIT_PRIVATE_KEY: Your ImageKit private key
 *    - IMAGEKIT_PUBLIC_KEY: Your ImageKit public key (optional, defaults below)
 * 4. Deploy the worker
 * 5. Update admin/index.html with your worker URL
 */

// Default values (can be overridden with environment variables)
const DEFAULT_PUBLIC_KEY = 'public_hoCjk5sip7G9wwX4ObrUSur0Rs8=';

export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Get credentials from environment variables
      const privateKey = env.IMAGEKIT_PRIVATE_KEY;
      const publicKey = env.IMAGEKIT_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;

      if (!privateKey) {
        return new Response(
          JSON.stringify({ error: 'ImageKit private key not configured' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Get pagination parameters from query string
      const url = new URL(request.url);
      const skip = parseInt(url.searchParams.get('skip')) || 0;
      const limit = parseInt(url.searchParams.get('limit')) || 100;

      // Create Basic Auth header
      const authHeader = 'Basic ' + btoa(privateKey + ':');

      // Call ImageKit API
      const imagekitUrl = `https://api.imagekit.io/v1/files?skip=${skip}&limit=${limit}&sort=DESC_CREATED`;

      const response = await fetch(imagekitUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ImageKit API error: ${response.status} - ${errorText}`);
      }

      const files = await response.json();

      return new Response(JSON.stringify(files), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Failed to list files',
          details: error.message
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

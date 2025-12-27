/**
 * Cloudflare Worker for ImageKit Authentication
 * Generates secure authentication parameters for ImageKit uploads
 *
 * Setup:
 * 1. Create a Cloudflare Worker at https://workers.cloudflare.com/
 * 2. Copy this code into the worker
 * 3. Add environment variables in Cloudflare Dashboard:
 *    - IMAGEKIT_PRIVATE_KEY: Your ImageKit private key
 *    - IMAGEKIT_PUBLIC_KEY: Your ImageKit public key (optional, defaults below)
 *    - IMAGEKIT_URL_ENDPOINT: Your ImageKit URL endpoint (optional, defaults below)
 * 4. Deploy the worker
 * 5. Update admin/index.html with your worker URL
 */

// Import crypto for signature generation
import crypto from 'crypto';

// Default values (can be overridden with environment variables)
const DEFAULT_PUBLIC_KEY = 'public_hoCjk5sip7G9wwX4ObrUSur0Rs8=';
const DEFAULT_URL_ENDPOINT = 'https://ik.imagekit.io/chompchomp';

export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Get credentials from environment variables
      const privateKey = env.IMAGEKIT_PRIVATE_KEY;
      const publicKey = env.IMAGEKIT_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;
      const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT || DEFAULT_URL_ENDPOINT;

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

      // Generate authentication parameters
      const token = crypto.randomUUID();
      const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes
      const signature = crypto
        .createHmac('sha1', privateKey)
        .update(token + expire)
        .digest('hex');

      const authParams = {
        token,
        expire,
        signature,
      };

      return new Response(JSON.stringify(authParams), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Failed to generate authentication parameters',
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

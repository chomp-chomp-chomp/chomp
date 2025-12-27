/**
 * Cloudflare Pages Function for ImageKit File Listing
 * Auto-deployed at: /api/imagekit-list
 *
 * Set environment variable in Cloudflare Dashboard:
 * IMAGEKIT_PRIVATE_KEY: Your ImageKit private key
 */

export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
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
    // Get ImageKit private key from environment
    const privateKey = env.IMAGEKIT_PRIVATE_KEY;

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
}

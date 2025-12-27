/**
 * Cloudflare Pages Function for ImageKit Authentication
 * Auto-deployed at: /api/imagekit-auth
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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

    // Generate authentication parameters
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes

    // Create signature
    const encoder = new TextEncoder();
    const data = encoder.encode(token + expire);
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(privateKey),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const authParams = {
      token,
      expire,
      signature: signatureHex,
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
}

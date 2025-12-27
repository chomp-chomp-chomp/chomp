/**
 * Cloudflare Pages Function for ImageKit Upload Proxy
 * Handles the actual file upload server-side to avoid CORS issues
 * Auto-deployed at: /api/imagekit-upload
 *
 * Set environment variable in Cloudflare Dashboard:
 * IMAGEKIT_PRIVATE_KEY: Your ImageKit private key
 */

const IMAGEKIT_PUBLIC_KEY = 'public_hoCjk5sip7G9wwX4ObrUSur0Rs8=';
const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/chompchomp';

export async function onRequest(context) {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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

    // Get the uploaded file from the request
    const formData = await request.formData();
    const file = formData.get('file');
    const fileName = formData.get('fileName') || file.name;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        {
          status: 400,
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

    // Prepare upload to ImageKit
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('fileName', fileName);
    uploadFormData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    uploadFormData.append('signature', signatureHex);
    uploadFormData.append('expire', expire.toString());
    uploadFormData.append('token', token);

    // Upload to ImageKit from server-side
    const uploadResponse = await fetch(`${IMAGEKIT_URL_ENDPOINT}/api/v1/files/upload`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`ImageKit upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    const uploadResult = await uploadResponse.json();

    return new Response(JSON.stringify(uploadResult), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Upload failed',
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

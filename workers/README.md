# Cloudflare Workers for ImageKit Integration

These Cloudflare Workers provide serverless endpoints for ImageKit authentication and file listing, enabling secure image uploads without a backend server.

## Workers

1. **imagekit-auth.js** - Generates secure authentication parameters for ImageKit uploads
2. **imagekit-list-files.js** - Lists images from your ImageKit account

## Setup Instructions

### Option 1: Deploy via Cloudflare Dashboard (Easiest)

1. **Create a Cloudflare Account**
   - Go to https://workers.cloudflare.com/
   - Sign up for free (100,000 requests/day free tier)

2. **Create Workers**

   **For imagekit-auth worker:**
   - Click "Create a Worker"
   - Name it: `imagekit-auth`
   - Replace the code with contents of `imagekit-auth.js`
   - Click "Save and Deploy"

   **For imagekit-list-files worker:**
   - Click "Create a Worker"
   - Name it: `imagekit-list-files`
   - Replace the code with contents of `imagekit-list-files.js`
   - Click "Save and Deploy"

3. **Configure Environment Variables**
   - In your worker settings, go to "Settings" → "Variables"
   - Add the following environment variables:
     - `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key (from ImageKit dashboard)
     - `IMAGEKIT_PUBLIC_KEY`: `public_hoCjk5sip7G9wwX4ObrUSur0Rs8=` (optional, has default)
     - `IMAGEKIT_URL_ENDPOINT`: `https://ik.imagekit.io/chompchomp` (optional, has default)

4. **Get Your Worker URLs**
   - After deployment, you'll get URLs like:
     - `https://imagekit-auth.YOUR-SUBDOMAIN.workers.dev`
     - `https://imagekit-list-files.YOUR-SUBDOMAIN.workers.dev`

5. **Update admin/index.html**
   - Open `/admin/index.html`
   - Find these lines (around line 633):
     ```javascript
     const IMAGEKIT_AUTH_URL = 'https://us-central1-chomp-chomp-recipes.cloudfunctions.net/imagekitAuth';
     const IMAGEKIT_LIST_URL = 'https://us-central1-chomp-chomp-recipes.cloudfunctions.net/imagekitListFiles';
     ```
   - Replace with your worker URLs:
     ```javascript
     const IMAGEKIT_AUTH_URL = 'https://imagekit-auth.YOUR-SUBDOMAIN.workers.dev';
     const IMAGEKIT_LIST_URL = 'https://imagekit-list-files.YOUR-SUBDOMAIN.workers.dev';
     ```

### Option 2: Deploy via Wrangler CLI (Advanced)

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Configure wrangler.toml**
   - Edit `wrangler.toml` with your account details
   - Add your secrets:
     ```bash
     wrangler secret put IMAGEKIT_PRIVATE_KEY --name imagekit-auth
     wrangler secret put IMAGEKIT_PRIVATE_KEY --name imagekit-list-files
     ```

4. **Deploy Workers**
   ```bash
   cd workers
   wrangler deploy imagekit-auth.js --name imagekit-auth
   wrangler deploy imagekit-list-files.js --name imagekit-list-files
   ```

## Finding Your ImageKit Private Key

1. Go to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Navigate to **Developer Options** → **API Keys**
3. Copy your **Private Key** (starts with `private_...`)

## Testing

After deployment, test your workers:

```bash
# Test auth endpoint
curl https://imagekit-auth.YOUR-SUBDOMAIN.workers.dev

# Should return:
# {"token":"...","expire":...,"signature":"..."}

# Test list endpoint
curl https://imagekit-list-files.YOUR-SUBDOMAIN.workers.dev

# Should return array of image files
```

## Security Notes

- Private keys are stored as encrypted environment variables in Cloudflare
- Workers run on Cloudflare's edge network (fast and secure)
- CORS is enabled for your domain
- All communication is over HTTPS

## Troubleshooting

**Error: "ImageKit private key not configured"**
- Make sure you added the `IMAGEKIT_PRIVATE_KEY` environment variable in worker settings

**Error: CORS issues**
- Check that your admin domain is allowed
- Verify CORS headers are present in worker responses

**Error: "Failed to list files"**
- Verify your ImageKit private key is correct
- Check ImageKit API status at https://status.imagekit.io/

## Cost

Cloudflare Workers free tier includes:
- 100,000 requests per day
- More than enough for personal CMS usage
- No credit card required for free tier

# Cloudflare Pages Functions

These serverless functions are automatically deployed when you deploy to Cloudflare Pages via GitHub.

## Functions

- **`/api/imagekit-auth`** - Generates secure authentication for ImageKit uploads
- **`/api/imagekit-list`** - Lists images from your ImageKit account

## Setup Instructions

### 1. Deploy to Cloudflare Pages

You're already doing this! Complete the Cloudflare Pages setup:

1. Click "Continue with GitHub"
2. Select your `chomp` repository
3. Click "Deploy"

Cloudflare will automatically detect and deploy the functions in this `/functions` directory.

### 2. Add Environment Variable

After deployment:

1. Go to your Cloudflare Dashboard
2. Navigate to **Workers & Pages** → **chomp** (your project)
3. Click **Settings** → **Environment variables**
4. Click **Add variable**
5. Add:
   - **Name:** `IMAGEKIT_PRIVATE_KEY`
   - **Type:** Select "Encrypt" (important!)
   - **Value:** Your ImageKit private key
6. Click **Save**

### 3. Get Your ImageKit Private Key

1. Go to [ImageKit Dashboard](https://imagekit.io/dashboard)
2. Navigate to **Developer Options** → **API Keys**
3. Copy your **Private Key** (starts with `private_...`)
4. Paste it in the environment variable above

### 4. Test Your Functions

After deployment and adding the environment variable:

1. Open your admin interface at `https://YOUR-SITE.pages.dev/admin/`
2. Go to the **Images** tab
3. Click **Upload New Image**
4. Select an image - it should upload successfully!
5. Click **Reload Images** to see all your ImageKit images

## Function URLs

Once deployed, your functions will be available at:

- `https://YOUR-SITE.pages.dev/api/imagekit-auth`
- `https://YOUR-SITE.pages.dev/api/imagekit-list`

The admin interface is already configured to use these relative URLs (`/api/...`), so they'll work automatically!

## Troubleshooting

**Upload fails with "Failed to get authentication":**
- Make sure you added the `IMAGEKIT_PRIVATE_KEY` environment variable
- Make sure you clicked "Encrypt" when adding the variable
- Redeploy your site after adding environment variables

**Image browser is empty:**
- Check that your ImageKit private key is correct
- Try uploading a test image first
- Check the browser console for errors

**CORS errors:**
- This shouldn't happen with Cloudflare Pages Functions
- If it does, check that the functions are deployed correctly

## Local Development

To test functions locally:

```bash
npm install -g wrangler
wrangler pages dev
```

Then visit `http://localhost:8788` to test locally.

## Cost

Cloudflare Pages includes:
- **Unlimited requests** to Functions (on free tier!)
- **500 builds per month**
- **100 GB bandwidth per month**
- All FREE - no credit card required

Perfect for your CMS!

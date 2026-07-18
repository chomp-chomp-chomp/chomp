# Cloudflare Workers

Serverless endpoints backing parts of the site that need more than static hosting.

## Workers

1. **imagekit-auth.js** - Generates secure authentication parameters for ImageKit uploads
2. **imagekit-list-files.js** - Lists images from your ImageKit account
3. **archive-r2.js** - Lists/serves/uploads/deletes files in the `/archive` R2 bucket (replaces the old GitHub Contents API + PAT setup)

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

---

## Archive R2 Worker (archive-r2.js)

Serves the `/archive` file listing and downloads from a Cloudflare R2 bucket instead of committing PDFs/HTML into git and reading them back out through the (rate-limited, PAT-gated) GitHub Contents API.

### Setup

1. **Create the R2 bucket**
   - Cloudflare dashboard → R2 → Create bucket → name it e.g. `chomp-archive`
   - R2's free tier: 10GB storage, 1M Class A ops/month, zero egress fees

2. **Create the Worker**
   - Workers & Pages → Create Worker → name it `archive-r2`
   - Paste in the contents of `archive-r2.js` → Save and Deploy

3. **Bind the bucket**
   - Worker → Settings → Bindings → Add binding → R2 Bucket
   - Variable name: `ARCHIVE_BUCKET`, bucket: `chomp-archive`

4. **Set the admin secret**
   - Worker → Settings → Variables → Add variable → toggle "Encrypt"
   - Name: `ARCHIVE_ADMIN_TOKEN`, value: any long random string — this is the password the admin panel uses for uploads/edits/deletes. Generate one with `openssl rand -hex 32` or similar.

5. **Copy the deployed URL** (`https://archive-r2.YOUR-SUBDOMAIN.workers.dev`) into:
   - `archive/index.html` — the `WORKER_BASE` constant near the top of the `<script>` block
   - `admin/archive-admin.html` — same `WORKER_BASE` constant

6. **Migrate the existing files**: upload `archive/rilde jfs 1954.pdf`, `archive/thompson_rapid_internal_heating.pdf`, `archive/manifest.json`, and anything in `archive/wiki/` into the bucket (R2 dashboard "Upload" button, or `wrangler r2 object put`). Once they're confirmed live at `<worker-url>/file/<name>`, `git rm` them from `archive/` — going forward, uploads go through `admin/archive-admin.html` straight to R2, not through git.

### Note on old links

Existing direct links to `chompchomp.cc/archive/filename.pdf` (served by Firebase Hosting from the committed files) will break once those files are removed from the repo — new links live at the worker URL instead. Only the two current PDFs are affected; not expected to matter at this scale, but flagging it.

### Using the same Cloudflare account for another site

R2's free tier is pooled per-account, not per-bucket, so a second site can get its own bucket (e.g. `othersite-archive`) and its own worker (copy `archive-r2.js`, rebind `ARCHIVE_BUCKET` to the new bucket, set a separate `ARCHIVE_ADMIN_TOKEN`) at no extra cost, fully isolated from this one.

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

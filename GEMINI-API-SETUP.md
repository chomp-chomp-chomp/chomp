# How to Get Your Free Gemini API Key

## Step-by-Step Guide (2 minutes)

### 1. Visit Google AI Studio
Go to: **https://aistudio.google.com/apikey**

### 2. Sign in with your Google account
Use any Google account (Gmail, Workspace, etc.)

### 3. Click "Create API Key"
- You'll see a button that says "Create API key in new project" or "Get API key"
- Click it

### 4. Copy your API key
- It will look like: `AIzaSyB...` (about 39 characters)
- Copy this key

### 5. Add it to your site

**Option A: Quick Test (Less Secure)**
In `index.html` around line 737, replace:
```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
```
with:
```javascript
const GEMINI_API_KEY = 'AIzaSyB...'; // Your actual key
```

**Option B: Secure (Recommended for Production)**
Follow the Cloud Functions setup in `CHAT-WIDGET-SETUP.md`

### 6. Secure Your API Key (Important!)

Even though it's free, you should restrict it to prevent abuse:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions":
   - Choose "HTTP referrers (websites)"
   - Add: `https://chompchomp.cc/*`
   - Add: `https://*.chompchomp.cc/*` (if you have subdomains)
4. Under "API restrictions":
   - Choose "Restrict key"
   - Select only: **Generative Language API**
5. Click "Save"

## Free Tier Limits

- ✅ **60 requests per minute** (RPM)
- ✅ **1,500 requests per day** (RPD)
- ✅ **No credit card required**
- ✅ **No expiration**

This is plenty for a website with moderate traffic!

## What Happens When You Exceed Free Tier?

The API will return a 429 error (rate limit). You can either:
1. Wait for the rate limit to reset
2. Upgrade to paid tier (very cheap: ~$0.00025 per 1K characters)

## Cost Comparison

**Free Tier:**
- Cost: $0
- Limit: 60 requests/minute, 1,500/day
- Perfect for: Small to medium websites

**Paid Tier:**
- Cost: ~$0.00025 per 1,000 input characters
- Cost: ~$0.00050 per 1,000 output characters
- Example: 1,000 chat conversations ≈ $0.50
- Perfect for: High-traffic sites

## Monitoring Usage

Track your usage at:
https://console.cloud.google.com/apis/dashboard

## Quick Setup for Your Site

1. Get API key from: https://aistudio.google.com/apikey
2. Add to `index.html` line 737
3. Test locally by opening `index.html`
4. If it works, secure the key (steps above)
5. Deploy to production!

## Troubleshooting

**"API key not valid"**
- Make sure you copied the full key (starts with `AIza`)
- Check that Generative Language API is enabled

**"Quota exceeded"**
- You've hit the free tier limit
- Wait for reset (usually 1 minute for RPM limit)
- Or upgrade to paid tier

**"Access denied"**
- Check your API restrictions
- Make sure your domain is whitelisted

## Alternative: Google AI Studio (No Coding)

If you just want to test Gemini without coding:
- Visit: https://aistudio.google.com/
- Chat directly in the browser (no API key needed for web interface)
- Great for testing prompts!

---

**Summary:** Yes, it's free! You just need to create a free API key (takes 2 minutes). No credit card required.

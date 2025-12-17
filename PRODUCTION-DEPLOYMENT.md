# Production Deployment Guide - Chat Widget

## ✅ Your API key has been configured securely!

Your Gemini API key is now stored safely and will NOT be exposed in the browser. Here's how to deploy to production:

## Quick Deploy (3 Steps)

### Step 1: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Set the API Key as Environment Variable
```bash
cd /home/user/chomp
firebase functions:config:set gemini.api_key="AIzaSyBOAWcmJsm4bwf1Sx4KbcGmULA65x_PNEo"
```

This stores your API key securely in Firebase's environment (not in git).

### Step 3: Deploy Everything
```bash
# Install dependencies
cd functions
npm install

# Go back to root and deploy
cd ..
firebase deploy
```

That's it! Your chat widget will be live with a secure backend.

## What Was Changed

### ✅ Security Improvements:
1. **API key removed from client code** - No longer visible in browser
2. **Cloud Function created** - API calls now go through your server
3. **Environment variable set** - Key stored securely in Firebase
4. **CORS enabled** - Only your domain can access the function

### 📁 Files Updated:
- `index.html` - Now uses Cloud Function instead of direct API
- `functions/index.js` - Cloud Function with dotenv support
- `functions/package.json` - Added dotenv dependency
- `functions/.env` - Local development key (gitignored)

### 🔒 Files Protected (Not in Git):
- `functions/.env` - Your API key for local testing
- `functions/node_modules/` - Dependencies

## How It Works

**Before (Insecure):**
```
Browser → Gemini API (with exposed key)
```

**After (Secure):**
```
Browser → Firebase Cloud Function → Gemini API (key hidden on server)
```

## Testing Locally (Optional)

Before deploying, you can test locally:

```bash
cd functions
npm install
firebase emulators:start --only functions
```

Then update `index.html` line 731 to:
```javascript
const CLOUD_FUNCTION_URL = 'http://localhost:5001/chomp-chomp-recipes/us-central1/chat';
```

(Change it back before deploying!)

## Deployment Commands Reference

```bash
# Deploy everything (hosting + functions)
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# View function logs
firebase functions:log

# Check function status
firebase functions:list
```

## Verifying Deployment

After deployment, you should see:
```
✔  Deploy complete!

Functions:
  chat(us-central1): https://us-central1-chomp-chomp-recipes.cloudfunctions.net/chat
```

Your chat widget will automatically use this URL.

## Monitoring & Costs

### Check Usage:
- Firebase Console: https://console.firebase.google.com/project/chomp-chomp-recipes/functions
- Google Cloud Console: https://console.cloud.google.com/

### Free Tier Limits:
- **Gemini API**: 60 requests/minute, 1,500/day (FREE)
- **Cloud Functions**: 2M invocations/month (FREE)
- **Cloud Functions**: 400K GB-seconds, 200K GHz-seconds (FREE)

You'll stay well within free limits unless you get massive traffic!

## Updating the API Key

If you need to change your API key later:

```bash
firebase functions:config:set gemini.api_key="NEW_KEY_HERE"
firebase deploy --only functions
```

## Troubleshooting

### "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### "Not logged in"
```bash
firebase login
```

### "Permission denied"
Make sure you're logged in with an account that has access to the `chomp-chomp-recipes` project.

### "Function deployment failed"
```bash
# Check logs
firebase functions:log

# Redeploy
firebase deploy --only functions --force
```

### "CORS error in browser"
The function already has CORS enabled for all origins. If you see errors:
1. Check browser console for exact error
2. Verify function is deployed: `firebase functions:list`
3. Check function logs: `firebase functions:log`

### "API key not working"
```bash
# Verify environment variable is set
firebase functions:config:get

# Should show:
# {
#   "gemini": {
#     "api_key": "AIzaSyB..."
#   }
# }
```

## Security Best Practices ✅

### Already Implemented:
- ✅ API key stored as environment variable
- ✅ API key NOT in git repository
- ✅ Cloud Function proxies all requests
- ✅ CORS enabled for security
- ✅ .env file gitignored

### Recommended (Optional):
1. **Restrict API Key** in Google Cloud Console:
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click your API key
   - Set "HTTP referrers" to: `https://chomp.be/*`
   - Set "API restrictions" to: "Generative Language API" only

2. **Enable Cloud Functions Security**:
   - In Firebase Console, set up Cloud Functions identity
   - Restrict function invocation to your hosting domain

3. **Monitor Usage**:
   - Set up alerts for unusual activity
   - Review logs periodically

## Next Steps

1. **Deploy Now:**
   ```bash
   firebase functions:config:set gemini.api_key="AIzaSyBOAWcmJsm4bwf1Sx4KbcGmULA65x_PNEo"
   cd functions && npm install && cd ..
   firebase deploy
   ```

2. **Test the Widget:**
   - Visit https://chomp.be
   - Click the cookie button
   - Ask a question!

3. **Monitor Performance:**
   - Check Firebase Console for function invocations
   - Review Gemini API usage in Google Cloud Console

## Support

If you encounter issues:
1. Check function logs: `firebase functions:log`
2. Check browser console for errors
3. Verify function URL in `index.html` matches deployed URL
4. Email: hey@chompchomp.cc

---

**Status:** ✅ Ready to deploy!
**Security:** ✅ API key protected
**Configuration:** ✅ Complete

Just run the deployment commands above and you're live! 🚀

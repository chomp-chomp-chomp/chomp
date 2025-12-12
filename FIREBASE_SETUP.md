# Firebase Functions Setup Guide

## What's Been Done ✅

1. ✅ npm dependencies installed in `/functions` folder
2. ✅ GitHub Actions workflow created for automated deployment
3. ✅ Workflow configured for project: `chomp-chomp-recipes`

## What You Need to Do (One-Time Setup)

### Step 1: Get Firebase CI Token

You have two options:

#### Option A: Using Firebase Token (Simpler)
1. Install Firebase CLI locally on your computer (one-time):
   ```bash
   npm install -g firebase-tools
   ```
2. Login and get token:
   ```bash
   firebase login:ci
   ```
3. Copy the token it gives you

#### Option B: Using Service Account (More Secure)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **chomp-chomp-recipes**
3. Click gear icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Copy the entire contents

### Step 2: Add Token to GitHub

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_TOKEN`
5. Value: Paste the token from Step 1
6. Click **Add secret**

### Step 3: Set Gemini API Key in Firebase

Since you mentioned environment variables aren't showing up in the Firebase Console, use one of these alternatives:

#### Option A: Using .env.yaml file (Recommended)
1. Create a file: `functions/.env.yaml`
2. Add this content:
   ```yaml
   GEMINI_API_KEY: "AIzaSyBOAWcmJsm4bwf1Sx4KbcGmULA65x_PNEo"
   ```
3. This file will be used during deployment

#### Option B: Using Firebase CLI (if you have it installed)
```bash
firebase functions:config:set gemini.api_key="AIzaSyBOAWcmJsm4bwf1Sx4KbcGmULA65x_PNEo"
```

#### Option C: Google Cloud Secret Manager
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select project: **chomp-chomp-recipes**
3. Search for "Secret Manager" in the top search bar
4. Enable the API if needed
5. Click **Create Secret**
6. Name: `GEMINI_API_KEY`
7. Value: `AIzaSyBOAWcmJsm4bwf1Sx4KbcGmULA65x_PNEo`
8. Click **Create**

## How It Works

Once set up:
1. Push code to `main` or `claude/firebase-gemini-setup-HFqn4` branch
2. GitHub Actions automatically runs
3. Deploys Firebase Functions and Hosting
4. Your chat widget is live!

## Manual Deployment (Alternative)

If you prefer to deploy manually instead of using GitHub Actions:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Deploy:
   ```bash
   firebase deploy
   ```

## Testing the Chat Function

After deployment, your chat endpoint will be available at:
```
https://chomp-chomp-recipes.web.app/api/chat
```

Or check in Firebase Console → Functions → Dashboard to see the deployed function.

## Troubleshooting

### "Environment variables not showing"
- This feature might not be available in the free Spark plan
- Use Option A (.env.yaml file) or Option C (Secret Manager) instead

### "GitHub Actions failing"
- Check that `FIREBASE_TOKEN` secret is added correctly
- Make sure the token hasn't expired
- Check the Actions tab in GitHub for detailed error logs

### "Function not deploying"
- Verify you're on a paid Firebase plan (Blaze plan required for Cloud Functions)
- Check that billing is enabled in Google Cloud Console

## Next Steps

After completing the setup:
1. Push this code to your branch
2. GitHub Actions will deploy automatically
3. Check Firebase Console → Functions to verify deployment
4. Test the chat widget on your site!

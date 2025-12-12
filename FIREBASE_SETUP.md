# Firebase Functions Setup Guide

## What's Been Done ✅

1. ✅ npm dependencies installed in `/functions` folder
2. ✅ GitHub Actions workflow created for automated deployment
3. ✅ Workflow configured for project: `chomp-chomp-recipes`

## What You Need to Do (One-Time Setup)

### Step 1: Get Firebase Service Account Key

**Note:** The `firebase login:ci` method is deprecated. Use service accounts instead.

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **chomp-chomp-recipes**
3. Click gear icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Click **Generate Key** to confirm
7. Download the JSON file
8. Open the file and copy the entire contents

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Add **First Secret** (Firebase Service Account):
   - Click **New repository secret**
   - Name: `FIREBASE_SERVICE_ACCOUNT_CHOMP_CHOMP_RECIPES`
   - Value: Paste the entire JSON contents from Step 1
   - Click **Add secret**
4. Add **Second Secret** (Gemini API Key):
   - Click **New repository secret**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyA_-Jt-sE0LGDlEWCIBehN2HLrVHEcGYj8`
   - Click **Add secret**

### Step 3: Deploy Your Code

That's it! The Gemini API key is already configured:
- ✅ The `functions/.env.yaml` file is set up locally (gitignored for security)
- ✅ GitHub Actions will automatically inject the API key from your secret during deployment

You're all set! Just push your code or merge this branch to `main` and GitHub Actions will handle the deployment automatically.

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

2. Authenticate with service account:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
   ```
   (Replace with actual path to the JSON file you downloaded in Step 1)

3. Deploy:
   ```bash
   firebase deploy --project chomp-chomp-recipes
   ```

**Note:** Interactive login (`firebase login`) works for local development, but service accounts are required for CI/CD.

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
- Check that `FIREBASE_SERVICE_ACCOUNT_CHOMP_CHOMP_RECIPES` secret is added correctly
- Verify the JSON is valid (should start with `{` and end with `}`)
- Make sure the service account has proper permissions
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

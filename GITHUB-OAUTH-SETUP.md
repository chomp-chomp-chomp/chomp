# GitHub OAuth Setup - Quick Start

## Step 1: Create GitHub OAuth App (5 minutes)

1. **Go to GitHub Developer Settings:**
   - Click here: https://github.com/settings/developers
   - Or: GitHub → Settings → Developer Settings → OAuth Apps

2. **Click "New OAuth App"**

3. **Fill in the form with these exact values:**
   ```
   Application name: Chomp Chomp CMS
   Homepage URL: https://chompchomp.cc
   Application description: Content management for Chomp Chomp website
   Authorization callback URL: https://api.netlify.com/auth/done
   ```

   ⚠️ **IMPORTANT**: Use the exact callback URL above. Don't change it.

4. **Click "Register application"**

5. **Copy your Client ID:**
   - You'll see something like: `Iv1.a1b2c3d4e5f6g7h8`
   - Copy this to your clipboard

6. **Generate Client Secret:**
   - Click "Generate a new client secret"
   - Copy the secret immediately (you can only see it once!)
   - Example: `1234567890abcdef1234567890abcdef12345678`

## Step 2: Update Your CMS Config

You don't need to update config.yml! Sveltia CMS will automatically detect your GitHub repo and handle authentication.

## Step 3: Test Your CMS

1. **Navigate to your CMS:**
   - URL: `https://chompchomp.cc/admin/`
   - Or locally: Open `admin/index.html` in a browser with a local server

2. **You should see:**
   - "Login with GitHub" button
   - Click it

3. **Authorize:**
   - GitHub will ask you to authorize the app
   - Click "Authorize"

4. **You're in!**
   - You should now see the Sveltia CMS interface
   - Browse your collections in the sidebar
   - Start editing!

## Troubleshooting

### "Failed to load config.yml"
- Make sure you're accessing via a web server (not file://)
- Check that `admin/config.yml` exists
- Verify YAML syntax is correct

### "Authentication failed"
- Double-check your Client ID and Client Secret
- Make sure the callback URL is exactly: `https://api.netlify.com/auth/done`
- Try logging out of GitHub and back in

### "Can't find repository"
- Verify the repo name in config.yml: `chomp-chomp-pachewy/chomp`
- Check that you have write access to the repository
- Make sure the branch exists (main)

## What Happens When You Edit?

```
1. You edit content in the CMS
2. CMS commits changes to GitHub
3. JSON files in /data are updated
4. Your website automatically shows new content
```

**That's it!** Your CMS is ready to use.

## Next: Match Images with Recipes

After OAuth is set up, Claude will help you match the 48 Cloudinary images with your recipes!

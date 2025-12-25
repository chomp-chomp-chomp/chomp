# Sveltia CMS Setup Guide

## 🎉 Migration Complete!

Your Chomp Chomp website has been successfully migrated from Firebase to a static JSON-based system with Sveltia CMS!

## What Changed

### ✅ Frontend (Public Site)
- **All 9 HTML pages** now load from local `/data/*.json` files
- **Zero Firebase dependencies** - no more Firebase SDK imports
- **~100KB smaller** per page (removed Firebase SDK)
- **Faster load times** - simple fetch() instead of cloud database queries
- **Offline-capable** - works without internet once loaded

### ✅ Backend (Content Management)
- **Sveltia CMS** at `/admin/index.html` - modern, unified CMS
- **Git-based workflow** - all edits commit to GitHub
- **Cloudinary integration** - bulk image uploads via Media Library
- **All content types** in one place:
  - Recipes (123KB, 1,854 lines)
  - Posts (45KB, 141 lines)
  - Lexicon (17KB, 375 lines)
  - Reading List (empty, ready for content)
  - Playlists (8KB, 198 lines)

---

## 🔐 Step 1: Set Up GitHub OAuth (Required)

Sveltia CMS needs GitHub authentication to commit changes to your repository.

### Create GitHub OAuth App

1. **Go to GitHub Settings**
   - Navigate to: https://github.com/settings/developers
   - Click **"OAuth Apps"** → **"New OAuth App"**

2. **Fill in the form:**
   ```
   Application name: Chomp Chomp CMS
   Homepage URL: https://chompchomp.cc
   Authorization callback URL: https://api.netlify.com/auth/done
   ```

   > **Important:** Even though you're not using Netlify, Sveltia CMS uses Netlify's OAuth proxy for GitHub authentication. This callback URL is correct.

3. **Click "Register application"**

4. **Copy your credentials:**
   - Copy the **Client ID** (e.g., `Iv1.a1b2c3d4e5f6g7h8`)
   - Click **"Generate a new client secret"**
   - Copy the **Client Secret** (you'll only see this once!)

### Update config.yml with OAuth Credentials

1. Open `/admin/config.yml`

2. Update the backend section with your credentials:
   ```yaml
   backend:
     name: github
     repo: chomp-chomp-pachewy/chomp
     branch: main
     base_url: https://api.netlify.com
     auth_endpoint: auth
   ```

3. The CMS will prompt you to log in with GitHub when you visit `/admin/index.html`

---

## 🚀 Step 2: Access Your CMS

1. **Navigate to your CMS:**
   - URL: `https://chompchomp.cc/admin/`
   - Or locally: `http://localhost:8000/admin/` (if using local server)

2. **Log in with GitHub:**
   - Click "Login with GitHub"
   - Authorize the OAuth app
   - You'll be redirected back to the CMS

3. **Start editing!**
   - Choose a collection (Recipes, Posts, Lexicon, Reading List, or Playlists)
   - Create, edit, or delete entries
   - All changes auto-commit to GitHub

---

## 📝 Step 3: Using Sveltia CMS

### Editing Content

**Create New Entry:**
1. Choose collection from left sidebar
2. Click **"New [Collection Name]"**
3. Fill in the form fields
4. Upload images via Cloudinary widget (click image field)
5. Click **"Publish"** → commits to GitHub immediately

**Edit Existing Entry:**
1. Click entry from list
2. Make your changes
3. Click **"Publish"** → updates JSON file on GitHub

**Delete Entry:**
1. Click entry from list
2. Click **"Delete"** button
3. Confirm → removes from JSON file

### Using Cloudinary for Images

When you click an **image field** in the CMS:
1. Cloudinary Media Library opens
2. **Upload new images:**
   - Click "Upload" button
   - Select multiple files (bulk upload supported!)
   - Images upload to Cloudinary cloud
3. **Select existing images:**
   - Browse your 48+ existing images
   - Click to select
4. URL is automatically inserted into the field

**Cloudinary Dashboard:**
- URL: https://console.cloudinary.com
- Cloud name: `dlqfyv1qj`
- Manage/organize your images there

### Markdown Support

These fields support **Markdown** formatting:
- Recipe descriptions, ingredients, instructions, notes
- Post content, excerpts
- Lexicon definitions
- Book descriptions

**Markdown examples:**
```markdown
**Bold text**
*Italic text*
[Link text](https://example.com)
![Alt text](image-url.jpg)

# Heading 1
## Heading 2
### Heading 3

- Bullet list
- Another item

1. Numbered list
2. Another item
```

---

## 🔄 How It Works

### Content Flow

```
[You edit in Sveltia CMS]
         ↓
[CMS commits to GitHub]
         ↓
[JSON files updated in /data folder]
         ↓
[Website automatically fetches new data]
         ↓
[Changes appear live on site]
```

### File Structure

```
/chomp
├── data/                     # Content files (edited by CMS)
│   ├── recipes.json
│   ├── posts.json
│   ├── lexicon.json
│   ├── reading-list.json
│   └── playlists.json
├── admin/
│   ├── index.html           # Sveltia CMS interface
│   └── config.yml           # CMS configuration
├── index.html               # Homepage (loads from data/*.json)
├── recipes.html             # Recipe grid
├── recipe.html              # Individual recipe
├── stories.html             # Posts listing
├── post.html                # Individual post
├── lexicon.html             # Lexicon
├── reading-list.html        # Books
├── playlists.html           # Playlists
└── playlist.html            # Individual playlist
```

---

## 🎨 Collection Guides

### Recipes
- **ID**: Unique slug (e.g., `apple-rose-pie`)
- **Slug**: URL-friendly title (must match ID)
- **Title**: Display name
- **Category**: Choose from dropdown (default: "chomp chomp")
- **Dish Type**: Auto-categorizes recipe
- **Ingredients**: One per line, supports markdown
- **Instructions**: Numbered steps, supports markdown
- **Source**: Can be text or link (object field)
- **Times**: Prep, cook, total (free text, e.g., "20min")

### Posts
- **Status**: Draft or Published (only published show on site)
- **Category**: stories, anthropologies, zen, other
- **Slug**: URL for post (e.g., `my-story-slug`)
- **Date**: Publication date (YYYY-MM-DD)
- **Content**: Full markdown content
- **Excerpt**: Short preview text for homepage

### Lexicon
- **Term**: Word or phrase to define
- **Type**: ingredient, technique, equipment, concept
- **Definition**: Full markdown explanation
- **Image**: Optional visual (via Cloudinary)

### Reading List
- **Authors**: Comma-separated (e.g., "Jane Doe, John Smith")
- **Subjects**: List of topics/genres
- **Recommended**: Toggle to mark as featured
- **ISBN**: Optional for book lookups
- **Link**: Purchase or info link

### Playlists
- **Spotify Embed URL**: Get from Spotify (Share → Embed)
- **Status**: Draft or Published
- **Featured**: Shows with badge on playlists page
- **Moods**: Select from predefined list
- **Duration**: short, medium, long
- **Recipe Types**: Free text list

---

## ⚡ Tips & Best Practices

### Slugs
- Always use lowercase
- Replace spaces with hyphens
- No special characters (except hyphens)
- Example: "Apple Rose Pie" → `apple-rose-pie`

### Images
- **Upload to Cloudinary** for best performance
- Avoid huge files (optimize before upload)
- Use descriptive alt text
- Recommended sizes:
  - Recipe images: 1200x800px
  - Post featured images: 1600x900px
  - Lexicon images: 800x800px
  - Book covers: 400x600px

### Markdown Tips
- Preview your markdown before publishing
- Use headings to structure long content
- Link to related recipes/posts when relevant
- Add line breaks with double newlines

### Status Management
- **Posts**: Use "draft" while writing, "published" when ready
- **Playlists**: Same - drafts won't show on public site
- Other collections show all entries

---

## 🐛 Troubleshooting

### "Authentication failed"
- Check your GitHub OAuth credentials in config.yml
- Verify callback URL is exactly: `https://api.netlify.com/auth/done`
- Try logging out of GitHub and logging back in

### "Failed to load entries"
- Check JSON syntax in data files (must be valid JSON)
- Verify file paths in config.yml match actual files
- Look at browser console for specific errors

### Images not uploading
- Verify Cloudinary cloud name: `dlqfyv1qj`
- Check Cloudinary API key in config.yml
- Try uploading directly at https://console.cloudinary.com first

### Changes not appearing on site
- Changes are instant after CMS commit
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Check if file actually updated on GitHub
- Verify JSON syntax is valid

### JSON Syntax Errors
If you manually edit JSON files:
- Use a JSON validator: https://jsonlint.com
- Common issues:
  - Missing commas between objects
  - Extra comma after last item
  - Unclosed quotes or brackets
  - Use double quotes, not single quotes

---

## 📊 Current Content Stats

- **Recipes**: 74 recipes (~123KB)
- **Posts**: 9 published posts (~45KB)
- **Lexicon**: 23 terms (~17KB)
- **Reading List**: Empty (ready for your books!)
- **Playlists**: 11 playlists (~8KB)

**Total content**: ~193KB of JSON data

---

## 💰 Cost Savings

### Before (Firebase)
- Firebase Firestore: $X/month (variable)
- Firebase Storage: $Y/month (if over free tier)
- Firebase Hosting: $0 (free tier) or paid
- **Total**: $X + $Y per month

### After (JSON + Cloudinary + GitHub Pages)
- GitHub repository: **$0** (free)
- GitHub Pages hosting: **$0** (free)
- Cloudinary (Free tier): **$0** for first 25GB + 25GB bandwidth
- **Total**: **$0/month** 🎉

---

## 🔮 What's Next

### Optional Enhancements

1. **Custom Domain**
   - Already configured: chompchomp.cc
   - Verify CNAME file exists in repo root

2. **Local Development**
   - Enable local backend in config.yml:
     ```yaml
     local_backend: true
     ```
   - Run: `npx netlify-cms-proxy-server`
   - Edit locally without committing to GitHub

3. **Webhooks** (Advanced)
   - Set up GitHub webhook to trigger builds
   - Auto-deploy on every CMS edit

4. **Image Optimization**
   - Use Cloudinary transformations
   - Add parameters to image URLs:
     ```
     /upload/w_800,q_auto,f_auto/image.jpg
     ```

5. **Search Functionality**
   - Add Algolia or Meilisearch
   - Index your JSON files for fast search

---

## 📚 Resources

### Sveltia CMS
- Documentation: https://github.com/sveltia/sveltia-cms
- Issues/Support: https://github.com/sveltia/sveltia-cms/issues

### Cloudinary
- Dashboard: https://console.cloudinary.com
- Docs: https://cloudinary.com/documentation
- Media Library: https://cloudinary.com/documentation/media_library_widget

### GitHub
- OAuth Apps: https://github.com/settings/developers
- Repository: https://github.com/chomp-chomp-pachewy/chomp

---

## ✅ Migration Checklist

- [x] Export all Firebase data to JSON
- [x] Migrate 9 HTML pages to use JSON
- [x] Set up Sveltia CMS with all 5 collections
- [x] Configure Cloudinary integration
- [x] Remove old Firebase admin editors
- [ ] **Set up GitHub OAuth** (your next step!)
- [ ] Test CMS by creating/editing an entry
- [ ] Add more content to Reading List
- [ ] Configure custom domain (if not already done)

---

## 🆘 Need Help?

If you encounter issues:

1. **Check browser console** for error messages
2. **Verify JSON syntax** in data files
3. **Review config.yml** for typos
4. **Check GitHub OAuth** credentials
5. **Open a GitHub issue** if it's a Sveltia CMS bug

---

**Congratulations! Your site is now Firebase-free and running on a modern, zero-cost static stack! 🎉**

Access your CMS at: **https://chompchomp.cc/admin/**

(After setting up GitHub OAuth above)

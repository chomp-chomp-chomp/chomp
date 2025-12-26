# Firebase to JSON + Sveltia CMS Migration

**Status:** In Progress
**Site:** chompchomp.cc

---

## ✅ Step 1: Export Your Firebase Data

**Time:** ~2 minutes

### Instructions:

1. **Open the export tool:**
   - Open `export-firebase-data.html` in your web browser
   - Or navigate to: `file:///path/to/chomp/export-firebase-data.html`

2. **Click "Export All Collections"**
   - This will download 6 JSON files:
     - `recipes.json`
     - `posts.json`
     - `lexicon.json`
     - `books.json`
     - `playlists.json`
     - `firebase-export-all.json` (combined backup)

3. **Move the JSON files:**
   - Move all the individual JSON files (NOT the combined one) into the `/data` directory
   - Like this:
     ```
     /chomp/data/recipes.json
     /chomp/data/posts.json
     /chomp/data/lexicon.json
     /chomp/data/books.json
     /chomp/data/playlists.json
     ```

4. **Keep the backup:**
   - Save `firebase-export-all.json` somewhere safe as a backup

---

## 🔄 Step 2: Continue Migration (Claude will do this)

Once you've placed the JSON files in `/data`, let Claude know and they will:
- ✅ Update all HTML pages to load from JSON
- ✅ Convert your custom editors to use JSON
- ✅ Set up Sveltia CMS
- ✅ Configure Cloudinary integration
- ✅ Update URLs to chompchomp.cc
- ✅ Remove Firebase dependencies

---

## 📋 What's Happening:

**Before (Current):**
```
Firebase Firestore → Your Pages
Firebase Storage → Images (404s)
```

**After (New):**
```
/data/*.json → Your Pages
Cloudinary → Images (✅ working!)
Sveltia CMS → Edits /data/*.json
```

---

## ⏰ Timeline:

- **Step 1** (You): 2 minutes - Export data
- **Step 2** (Claude): ~1 hour - Update code
- **Step 3** (You): 5 minutes - Set up GitHub OAuth
- **Step 4** (Both): 10 minutes - Test everything

Total: ~1.5 hours

---

## 🎯 What You'll Have:

✅ **No Firebase dependency** - Free forever!
✅ **Sveltia CMS** - Beautiful editing interface
✅ **Your custom editors** - Updated to work with JSON
✅ **Cloudinary images** - Fast CDN (already done!)
✅ **Version control** - All changes tracked in Git
✅ **$0/month hosting** - GitHub Pages or Netlify

---

**Ready?** Open `export-firebase-data.html` in your browser and click "Export All Collections"!

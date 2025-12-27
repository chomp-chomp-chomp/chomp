# Simple CMS Editor for Chomp Chomp

## Overview

This is a lightweight, browser-based content management system that works with your existing JSON array files. Unlike Sveltia CMS (which requires individual files), this editor maintains your current data structure.

## ✨ Features

- ✅ **Works with JSON arrays** - No restructuring needed
- ✅ **All collections supported** - Recipes, Posts, Lexicon, Reading List, Playlists
- ✅ **Full CRUD operations** - Create, Read, Update, Delete
- ✅ **Search & filter** - Find items quickly
- ✅ **Clean UI** - Matches your site design
- ✅ **No dependencies** - Pure HTML/CSS/JavaScript
- ✅ **Git-based workflow** - Download JSON and commit to GitHub

## 🚀 How to Use

### 1. Open the Editor

Navigate to `/admin/simple-editor.html` in your browser:

```
http://localhost:8000/admin/simple-editor.html
```

Or on live site:
```
https://chompchomp.cc/admin/simple-editor.html
```

### 2. Edit Content

1. **Select a collection** - Click tabs: Recipes, Posts, Lexicon, etc.
2. **Search** - Use search box to filter items
3. **Edit** - Click "Edit" on any item to modify it
4. **Delete** - Click "Delete" to remove an item
5. **Create new** - Click "New Recipe" (or Post, Term, etc.)

### 3. Save Changes

After making edits:

1. **Download JSON** - Click "Download JSON" button
2. **Replace file** - Move downloaded file to `/data/` folder
3. **Commit to GitHub**:
   ```bash
   git add data/recipes.json  # (or posts.json, etc.)
   git commit -m "Update recipes via Simple CMS"
   git push
   ```

## 📋 Collection-Specific Features

### Recipes

- **Required fields**: Title, Slug, Ingredients, Instructions
- **Lists**: Add/remove ingredients and instruction steps dynamically
- **Image URLs**: Use Cloudinary pattern: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/[slug].jpg`
- **Categories**: Chomp Chomp, Desserts, Breads, Pastries, Other
- **Auto-generated**: ID, created_at, updated_at timestamps

### Posts/Stories

- **Required fields**: Title, Slug, Content
- **Categories**: Stories, Anthropologies, Zen, Other
- **Status**: Draft or Published
- **Markdown**: Content and excerpt support full Markdown
- **Featured images**: Use Cloudinary URLs

### Lexicon

- **Required fields**: Term, Slug, Definition
- **Types**: Ingredient, Technique, Equipment, Concept
- **Markdown**: Definitions support Markdown formatting

### Reading List

- **Required fields**: Title, Authors
- **Optional**: ISBN, Publisher, Publication Date, Cover Image, Link
- **Subjects**: Can be edited in the form

### Playlists

- **Required fields**: Title, Slug, Description, Spotify Embed URL
- **Duration**: Short, Medium, Long
- **Status**: Draft or Published
- **Moods**: Can be edited as needed

## 🔧 Workflow

### Typical Edit Session

1. Open `/admin/simple-editor.html`
2. Make your changes (edit, add, delete)
3. Download updated JSON file
4. Replace the file in `/data/` directory
5. Test locally to verify changes
6. Commit and push to GitHub

### Git Commands

```bash
# After downloading updated JSON:
mv ~/Downloads/recipes.json data/recipes.json

# Verify changes
git diff data/recipes.json

# Commit
git add data/recipes.json
git commit -m "Add new chocolate chip cookie recipe"
git push
```

## ⚙️ Technical Details

### Data Structure

- **Storage**: Single JSON array files in `/data/` directory
- **Files**:
  - `data/recipes.json` - Array of 54 recipes
  - `data/posts.json` - Array of 10 posts
  - `data/lexicon.json` - Array of 45 terms
  - `data/reading-list.json` - Array of books
  - `data/playlists.json` - Array of playlists

### How It Works

1. **Loads data** - Fetches JSON files from `/data/` via browser
2. **In-memory editing** - All changes happen in browser memory
3. **Downloads JSON** - Exports modified data as downloadable file
4. **Manual commit** - You manually replace files and commit to GitHub

### Why Not Sveltia CMS?

Sveltia CMS (and Decap CMS) require individual files:
```
data/_recipes/
  └── apple-rose-pie.json
  └── blackberry-cake.json
  └── ...
```

Your site uses JSON arrays:
```
data/recipes.json  →  [{recipe1}, {recipe2}, ...]
```

This Simple Editor maintains your current architecture without requiring a major restructure.

## 🎨 Customization

### Adding Fields

To add fields to forms, edit `simple-editor.html`:

1. Find the `generate[Collection]Form()` function
2. Add form group HTML:
   ```html
   <div class="form-group">
     <label>New Field</label>
     <input type="text" id="newField" value="${item.newField || ''}">
   </div>
   ```

### Styling

All styles are in the `<style>` section of `simple-editor.html`. CSS uses:
- Variables for colors
- Flexbox/Grid for layout
- Responsive design
- Modal overlays

## 🔐 Security

### Current Setup
- **No authentication** - Open access via URL
- **Read-only from site** - Public pages only read JSON
- **Manual git workflow** - You control commits

### Recommended for Production

If you want to protect the editor:

1. **Add password protection** via `.htaccess`:
   ```apache
   <Files "simple-editor.html">
     AuthType Basic
     AuthName "Admin Area"
     AuthUserFile /path/to/.htpasswd
     Require valid-user
   </Files>
   ```

2. **Use environment check**:
   ```javascript
   if (window.location.hostname !== 'localhost') {
     const password = prompt('Enter admin password:');
     if (password !== 'your-secret') {
       window.location.href = '/';
     }
   }
   ```

3. **Keep in private repo** - Don't publish `/admin/` folder publicly

## 📊 Comparison

| Feature | Simple Editor | Sveltia CMS |
|---------|---------------|-------------|
| **Data Structure** | JSON arrays ✅ | Individual files ❌ |
| **Git Workflow** | Manual download/commit | Auto-commit |
| **Setup** | Zero - just open file | OAuth + config |
| **Authentication** | Optional | Built-in GitHub OAuth |
| **Image Upload** | Manual Cloudinary | Integrated |
| **Markdown Preview** | No | Yes |
| **Media Library** | No | Yes |
| **Complexity** | Very simple | More complex |
| **Dependencies** | None | Sveltia CMS library |

## 🚦 Next Steps

1. **Test the editor** - Open it and try editing a recipe
2. **Make a change** - Edit a recipe, download JSON, commit
3. **Verify on site** - Check that the change appears on your live site
4. **Decide on protection** - Add password if needed
5. **Document for team** - Share this README with content editors

## 🐛 Troubleshooting

### "Failed to load recipes"
- **Cause**: JSON file not found or malformed
- **Fix**: Check that `/data/recipes.json` exists and is valid JSON

### "Changes not appearing on site"
- **Cause**: Old JSON file in `/data/` directory
- **Fix**: Verify you replaced the file and committed to GitHub

### "Download not working"
- **Cause**: Browser blocking downloads
- **Fix**: Check browser download settings, allow downloads from your domain

### "Ingredients/Instructions not saving"
- **Cause**: Empty list items
- **Fix**: Ensure at least one non-empty item in each list

## 📚 Resources

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Markdown Guide**: https://www.markdownguide.org/
- **JSON Validator**: https://jsonlint.com/
- **Git Basics**: https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

## 💡 Tips

1. **Always download before closing** - Changes are lost if you close without downloading
2. **Test locally first** - Verify JSON is valid before committing
3. **Use search** - Find items quickly instead of scrolling
4. **Backup before deletes** - Download JSON before deleting items
5. **Consistent slugs** - Use lowercase, hyphens, no spaces (e.g., `chocolate-chip-cookies`)

---

**Created**: 2025-12-27
**Version**: 1.0
**Compatibility**: Works with existing JSON array structure
**License**: Use freely for Chomp Chomp project

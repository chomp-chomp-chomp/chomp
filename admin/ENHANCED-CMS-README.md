# Enhanced CMS - Chomp Chomp

## 🎨 Features

### ✅ What's New
- **🔐 Password Protection** - Secure login to access CMS
- **👁️ Live Markdown Preview** - See formatted content as you type
- **🎯 Better UI** - Modern, clean interface with gradients
- **✅ Form Validation** - Required fields checked before saving
- **📸 Image Upload Helper** - Step-by-step Cloudinary instructions
- **⌨️ Keyboard Shortcuts** - `Ctrl+S` to save, `Esc` to close
- **🔍 Real-time Search** - Filter content instantly
- **💾 Auto-slug Generation** - Creates URL-friendly slugs from titles
- **📊 Stats Dashboard** - See content counts at a glance
- **🎨 Split-screen Editing** - Form on left, preview on right

## 🚀 Quick Start

### 1. Set Your Password

**IMPORTANT:** Before using, change the password!

Open `admin/enhanced-cms.html` and find this line (around line 541):
```javascript
const CMS_PASSWORD = 'chompchompbaker2025'; // Change this to your desired password
```

Change `'chompchompbaker2025'` to your own secure password.

### 2. Access the CMS

1. Open `/admin/enhanced-cms.html` in your browser
2. Enter your password
3. Start editing!

### 3. Edit Content

1. **Select a tab** - Recipes, Posts, Lexicon, etc.
2. **Click "Edit"** on any item, or **"New Recipe"** to create
3. **Type in the form** - See live preview on the right
4. **Click "Save"** (or press `Ctrl+S`)
5. **Download JSON** - Click the button at top
6. **Replace file** in `/data/` folder
7. **Commit to GitHub**

## 🔐 Password Protection

### How It Works
- Password is stored in the JavaScript file
- Session-based authentication (stays logged in during browser session)
- Logout clears session
- Refresh requires password again (if session cleared)

### Security Level
**Medium** - Suitable for:
- ✅ Personal projects
- ✅ Small teams
- ✅ Low-risk content

**NOT suitable for:**
- ❌ Highly sensitive data
- ❌ Public-facing admin panels
- ❌ Multi-user systems with different permissions

### To Increase Security

**Option 1: Server-side password check** (requires backend)
```javascript
// Replace password check with API call
async function login() {
  const response = await fetch('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
  if (response.ok) authenticate();
}
```

**Option 2: Environment variable** (if using build system)
```javascript
const CMS_PASSWORD = process.env.CMS_PASSWORD;
```

**Option 3: .htaccess** (Apache servers)
Create `.htaccess` in `/admin/`:
```apache
AuthType Basic
AuthName "CMS Access"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

## 📝 Features Guide

### Live Markdown Preview

**Supported in:**
- Recipe descriptions and notes
- Post content and excerpts
- Lexicon definitions
- Book descriptions
- Playlist descriptions and vibes

**Markdown syntax:**
```markdown
**bold text**
*italic text*
[link text](https://url.com)
# Heading 1
## Heading 2
- Bullet list
1. Numbered list
`code`
```

### Image Upload Workflow

**For each image field, you'll see helper text:**

1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Upload your image
3. Click on the uploaded image
4. Copy the URL
5. Paste into the CMS

**Pattern:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/...`

### Form Validation

**Required fields are marked with `*`**

- Title/Term (all content types)
- Slug (recipes, posts, lexicon, playlists)
- Content (posts)
- Definition (lexicon)
- Authors (books)

If you try to save without required fields, you'll see red borders and error messages.

### Auto-slug Generation

Start typing a title, and the slug field auto-fills with a URL-friendly version:

- `"Apple Rose Pie"` → `apple-rose-pie`
- `"Bébé's Breath Mints"` → `bebes-breath-mints`
- `"Crumb Coat"` → `crumb-coat`

You can edit the auto-generated slug if needed.

### Keyboard Shortcuts

- **`Ctrl+S` (or `Cmd+S` on Mac)** - Save current item
- **`Esc`** - Close modal
- **`Enter` on login screen** - Submit password

### Search

- Type in the search box to filter items instantly
- Searches across all fields (title, description, content, etc.)
- Case-insensitive
- Real-time results

## 📊 Collections

### Recipes
**Fields:**
- Title, Slug, Description (markdown)
- Image URL
- Category, Servings
- Prep/Cook/Total Time
- Ingredients (one per line)
- Instructions (one per line)
- Notes (markdown)

### Posts
**Fields:**
- Title, Slug
- Excerpt (markdown)
- Content (markdown)
- Category, Status, Date
- Featured Image URL

### Lexicon
**Fields:**
- Term, Slug
- Definition (markdown)
- Type (ingredient/technique/equipment/concept)
- Image URL (optional)

### Reading List
**Fields:**
- Title, Authors
- ISBN, Publisher, Publication Date
- Description (markdown)
- Cover Image URL
- Purchase Link

### Playlists
**Fields:**
- Title, Slug
- Description (markdown)
- Vibe (markdown)
- Spotify Embed URL
- Duration, Status
- Cover Image URL

## 🔧 Workflow

### Standard Edit Session

1. **Login** - Enter password
2. **Navigate** - Click tab (Recipes, Posts, etc.)
3. **Edit** - Click "Edit" on item
4. **Preview** - See changes in real-time on right side
5. **Save** - Click "Save" or press `Ctrl+S`
6. **Download** - Click "Download JSON" button
7. **Replace** - Move downloaded file to `/data/recipes.json` (or posts, etc.)
8. **Test** - Verify changes on local site
9. **Commit** -
   ```bash
   git add data/recipes.json
   git commit -m "Update chocolate chip cookie recipe"
   git push
   ```
10. **Logout** - Click "Logout" when done

### Creating New Content

1. Click **"New Recipe"** (or Post, Term, etc.)
2. Fill in required fields (marked with `*`)
3. Watch live preview as you type
4. Click **"Save"**
5. Download and commit as above

### Deleting Content

1. Click **"Delete"** on any item
2. Confirm in dialog
3. Download updated JSON
4. Commit to GitHub

## 🎨 Customization

### Change Colors

Find these CSS variables (around line 25):
```css
--color-accent: #e73b42;  /* Main red color */
--color-bg: #f5f5f5;      /* Page background */
```

### Change Password

Line 541:
```javascript
const CMS_PASSWORD = 'your-new-password-here';
```

### Add More Fields

To add a field to recipes (example):

1. Find `generateRecipeForm()` function
2. Add form group:
```javascript
<div class="form-group">
  <label>Your New Field</label>
  <input type="text" id="yourNewField" value="${item.yourNewField || ''}">
</div>
```

## 🆚 Comparison: Enhanced vs Simple CMS

| Feature | Simple CMS | Enhanced CMS |
|---------|------------|--------------|
| Password Protection | ❌ | ✅ |
| Markdown Preview | ❌ | ✅ Live split-screen |
| Form Validation | ❌ | ✅ Required fields |
| Image Helper | ❌ | ✅ Step-by-step guide |
| Keyboard Shortcuts | ❌ | ✅ Ctrl+S, Esc |
| Auto-slug | ❌ | ✅ From title |
| UI Design | Basic | Modern gradient |
| Session Persistence | ❌ | ✅ |

## 🐛 Troubleshooting

### "Incorrect password"
- Check you entered the right password
- Check password in code matches what you're typing
- Password is case-sensitive

### "Failed to load recipes"
- Check `/data/recipes.json` exists
- Verify file is valid JSON (use [JSONLint](https://jsonlint.com))
- Check browser console for errors

### "Changes not appearing on site"
- Did you download the JSON?
- Did you replace the file in `/data/`?
- Did you commit and push to GitHub?
- Try hard refresh (`Ctrl+F5`)

### Preview not updating
- Check you're editing a field that supports markdown
- Refresh page and try again
- Check browser console for errors

### Can't upload images
- CMS doesn't upload images directly
- You must upload to Cloudinary first
- Then paste the Cloudinary URL into the form

## 💡 Tips

1. **Backup before bulk edits** - Download JSON before making many changes
2. **Test locally first** - Verify changes work before pushing to GitHub
3. **Use markdown preview** - See formatted text before saving
4. **Search is your friend** - Use search to find content quickly instead of scrolling
5. **Keyboard shortcuts** - `Ctrl+S` is faster than clicking Save
6. **Auto-logout** - Close browser when done for security
7. **Commit often** - Make small, frequent commits instead of huge changes

## 🚀 Next Steps

### Immediate
1. Change the default password
2. Test creating/editing content
3. Practice the download → commit workflow

### Optional Enhancements
- Add more keyboard shortcuts
- Integrate image upload directly to Cloudinary (requires API)
- Add bulk actions (delete multiple, export all)
- Add user roles (if multiple editors)
- Integrate with GitHub API for direct commits

---

**Created**: 2025-12-27
**Version**: 1.0
**For**: Chomp Chomp project
**Replaces**: `simple-editor.html` (keep both, use either)

# CRITICAL: Fix Firestore Read Permissions

## Problem

You're seeing this error when trying to load posts:
```
Missing or insufficient permissions.
```

**You can WRITE to Firestore (create posts), but you CANNOT READ from Firestore (view posts).**

This is a Firestore Security Rules issue. Your current rules likely only allow writes, not reads.

---

## Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select project: **chomp-chomp-recipes**
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top

### Step 2: Update Rules for Posts Collection

Replace your current rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Posts collection - Public read, authenticated write
    match /artifacts/{projectId}/public/data/posts/{postId} {
      // Anyone can read published posts
      allow read: if true;

      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }

    // Recipes collection (if you have one)
    match /artifacts/{projectId}/public/data/recipes/{recipeId} {
      // Anyone can read
      allow read: if true;

      // Only authenticated users can write
      allow create, update, delete: if request.auth != null;
    }

    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Publish Rules

1. Click the **Publish** button
2. Wait for confirmation message: "Rules published successfully"

### Step 4: Test

1. Refresh your site
2. Posts should now load
3. Check browser console (F12) - errors should be gone

---

## Why This Happened

- **Firebase Storage rules** allow authenticated uploads ✓ (you can upload images)
- **Firestore write rules** allow authenticated writes ✓ (you can create posts)
- **Firestore read rules** were blocking all reads ✗ (you can't view posts)

The fix above allows:
- ✅ **Public reading** of posts (anyone can view)
- ✅ **Authenticated writing** (only logged-in users can create/edit)

---

## Recommended Image Sizes

### For Post Tiles (Homepage)
- **Optimal size:** 1200 x 800 pixels (3:2 ratio)
- **Aspect ratio:** 3:2 (landscape)
- **File size:** Under 500KB (compress with TinyPNG or similar)
- **Format:** JPEG or WebP

### For Recipe Tiles
- **Optimal size:** 800 x 800 pixels (1:1 ratio)
- **Aspect ratio:** 1:1 (square)
- **File size:** Under 300KB
- **Format:** JPEG or WebP

### For Full Post Hero Images
- **Optimal size:** 1600 x 900 pixels (16:9 ratio)
- **Aspect ratio:** 16:9 (widescreen)
- **File size:** Under 800KB
- **Format:** JPEG or WebP

### Quick Tips
- Use [TinyPNG.com](https://tinypng.com/) to compress images before upload
- Images auto-resize in CSS, but smaller files = faster loading
- Consistent aspect ratios make tiles look better

---

## After Fixing Permissions

Once rules are published, these should work:
- ✅ Homepage loads posts from Firestore
- ✅ Individual post pages load
- ✅ Post editor loads existing posts list
- ✅ Search and filtering work with real data

---

## Still Having Issues?

**Check browser console (F12) for specific error messages:**

1. **"Missing or insufficient permissions"** → Rules not published yet
2. **"posts is not a function"** → JavaScript error (let me know)
3. **No errors, but no posts** → Collection might be empty or path is wrong

**Verify collection path in Firestore:**
```
artifacts/chomp-chomp-recipes/public/data/posts
```

Each post document should have:
- `title` (string)
- `slug` (string)
- `author` (string)
- `category` (string: 'rituals', 'anthropologies', or 'zen')
- `excerpt` (string)
- `content` (string, markdown)
- `date` (string, ISO format: "2025-11-27")
- `status` (string: "published" or "draft")
- `featured_image` (string, URL - optional)

---

Last updated: 2025-11-27

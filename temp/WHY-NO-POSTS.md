# Why Posts Aren't Showing on Homepage

## Quick Answer
**The Firestore posts collection doesn't exist yet.**

The homepage (`index.html`) is trying to load posts from:
```
artifacts/chomp-chomp-recipes/public/data/posts
```

But this collection hasn't been created in Firestore yet.

---

## How to Fix

### Step 1: Create the Collection Manually

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **chomp-chomp-recipes**
3. Click **Firestore Database** in left sidebar
4. Click **Start collection**
5. Enter collection ID: `artifacts`
6. Add a document with ID: `chomp-chomp-recipes`
7. In this document, add a map field: `public`
8. Inside `public`, add a map field: `data`
9. Inside `data`, you'll see the `posts` option when you start adding posts

**OR** just create the full path directly:
1. Navigate to create: `artifacts/chomp-chomp-recipes/public/data/posts`
2. Click **Add document**

### Step 2: Add Your First Post

Use the post-editor.html to create a post, OR add one manually:

**Manual Test Post:**
```json
{
  "title": "Test Post",
  "slug": "test-post",
  "author": "Your Name",
  "category": "rituals",
  "excerpt": "This is a test post to verify everything works",
  "content": "# Hello World\n\nThis is a **test** post.",
  "featured_image": "",
  "status": "published",
  "date": "2025-11-30",
  "created_at": [Use Firestore timestamp - click "Set to current time"]
}
```

**IMPORTANT:** Make sure `status` is set to `"published"` (not "draft")!

### Step 3: Update Security Rules

Make sure your Firestore rules allow reading published posts:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Published posts are publicly readable
    match /artifacts/{projectId}/public/data/posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }

    // Recipes are publicly readable
    match /artifacts/{projectId}/public/data/recipes/{recipeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Testing the Fix

1. **Open index.html** in browser
2. **Open Developer Console** (F12)
3. **Look for errors** in the console
4. **Check the Console tab** for any Firestore errors

### Expected Console Output (Success):
```
No errors
Posts load successfully
```

### Common Error Messages:

**"Missing or insufficient permissions"**
→ Update Firestore security rules

**"Collection does not exist"**
→ Create the posts collection

**"No posts found"**
→ Check that:
- Posts exist in Firestore
- `status` field is set to `"published"`
- The collection path is correct

---

## Why It's Not Auto-Creating

Unlike some databases, Firestore collections are created:
1. When you explicitly create them in the console, OR
2. When code writes to them for the first time

Since the homepage only READS posts (doesn't write), it won't auto-create the collection.

---

## Quick Test

Want to see if it's working? Add one test post manually in Firestore Console, then refresh index.html. If it appears, everything is working!

---

**Created:** Nov 30, 2025

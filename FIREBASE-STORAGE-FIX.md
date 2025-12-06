# Firebase Storage Permissions Fix

## Issue
```
Firebase Storage: User does not have permission to access 'posts/images/...'
(storage/unauthorized)
```

## Solution

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select project: **chomp-chomp-recipes**
3. Click **Storage** in the left sidebar
4. Click the **Rules** tab

### Step 2: Update Storage Rules

Replace the existing rules with this:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // Allow anyone to read images
    match /recipes/{allPaths=**} {
      allow read: if true;
    }

    match /posts/images/{allPaths=**} {
      allow read: if true;
    }

    // Only authenticated users can write
    match /posts/images/{imageId} {
      allow write: if request.auth != null
                   && request.resource.size < 2 * 1024 * 1024  // Max 2MB
                   && request.resource.contentType.matches('image/.*');
    }

    match /recipes/{imageId} {
      allow write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish Rules
1. Click **Publish** button
2. Confirm the changes

### What This Does:
- ✅ Anyone can view/read images (public access)
- ✅ Only logged-in users can upload images
- ✅ Images limited to 2MB
- ✅ Only image file types allowed

### Alternative: Temporary Open Access (Testing Only)
If you just want to test quickly, use this (NOT recommended for production):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows any authenticated user to upload anywhere.

---

## After Updating Rules

1. Logout and login again in post-editor.html
2. Try uploading an image again
3. Should work now!

---

**Last Updated:** Nov 30, 2025

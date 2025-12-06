# Firestore Setup Guide for Blog Posts

This guide walks you through setting up a Firestore collection for blog posts and creating an admin interface to manage them.

---

## Table of Contents

1. [Understanding the Data Structure](#understanding-the-data-structure)
2. [Setting Up Firestore Collection](#setting-up-firestore-collection)
3. [Configuring Security Rules](#configuring-security-rules)
4. [Creating the Post Editor Interface](#creating-the-post-editor-interface)
5. [Image Upload Strategy](#image-upload-strategy)
6. [Testing Your Setup](#testing-your-setup)
7. [Troubleshooting](#troubleshooting)

---

## Understanding the Data Structure

### Post Object Schema

Each blog post document in Firestore will have the following structure:

```javascript
{
  // Required fields
  title: "Sunday Morning Ritual: Making Pancakes with My Daughter",
  slug: "sunday-morning-ritual",  // Auto-generated from title
  excerpt: "Every Sunday morning, we wake up early...",
  content: "Full markdown content of the post...",
  category: "stories",  // Options: "stories", "anthropology", "mindfulness"
  status: "published",  // Options: "draft", "published"
  date: "2025-11-27",  // ISO date string

  // Optional fields
  featured_image: "https://firebasestorage.googleapis.com/...",
  author: "Your Name",
  tags: ["ritual", "family", "pancakes"],

  // Auto-generated fields
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Collection Path

Posts will be stored at:
```
artifacts/chomp-chomp-recipes/public/data/posts
```

This matches the pattern used for recipes.

---

## Setting Up Firestore Collection

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **chomp-chomp-recipes**
3. Click on **Firestore Database** in the left sidebar
4. If prompted, enable Firestore in **Native mode**

### Step 2: Create the Collection Structure

1. Click **Start collection**
2. Enter collection ID: `artifacts`
3. Add a document with ID: `chomp-chomp-recipes`
4. In this document, create a map field called `public`
5. Inside `public`, create a map field called `data`
6. Inside `data`, you'll create the `posts` collection

**OR** Create the full path directly:

1. In Firestore, navigate to create nested collections
2. Create path: `artifacts/chomp-chomp-recipes/public/data/posts`
3. Click **Add document**

### Step 3: Add Your First Post (Manual)

Add a test document with these fields:

| Field | Type | Value |
|-------|------|-------|
| title | string | "Test Post: Getting Started" |
| slug | string | "test-post-getting-started" |
| excerpt | string | "This is a test post to verify everything works" |
| content | string | "# Welcome\n\nThis is a **test post** with *markdown*." |
| category | string | "stories" |
| status | string | "published" |
| date | string | "2025-11-27" |
| featured_image | string | "" (leave empty) |
| created_at | timestamp | Click "Set to current time" |

Click **Save**

---

## Configuring Security Rules

### Step 1: Access Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click the **Rules** tab

### Step 2: Update Rules for Posts

Add these rules to allow:
- Anyone to READ published posts
- Only authenticated users to WRITE posts

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read access to published recipes
    match /artifacts/{projectId}/public/data/recipes/{recipeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Public read access to published posts
    match /artifacts/{projectId}/public/data/posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }

    // Admin-only access to drafts
    match /artifacts/{projectId}/admin/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 3: Publish Rules

1. Click **Publish** button
2. Confirm the changes

**Important Notes:**
- Posts with `status: "draft"` are NOT publicly readable
- You must be authenticated (logged in) to create/edit posts
- The admin interface will need Firebase Auth

---

## Creating the Post Editor Interface

### Step 4: Create Admin Interface

Create a new file: `temp/post-editor.html`

This will be a secure admin page (should be gitignored like `recipe-admin-secure.html`).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post Editor - Chomp Recipes Admin</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">

  <style>
    .editor-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .editor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .editor-section {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
    }

    .preview-area {
      border: 1px solid #e0e0e0;
      padding: 20px;
      border-radius: 6px;
      min-height: 400px;
      background: white;
    }

    @media (max-width: 768px) {
      .editor-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <div class="editor-container">
    <h1 style="margin-bottom: 30px; color: #e73b42;">Post Editor</h1>

    <!-- Auth Status -->
    <div id="authStatus" style="margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
      Checking authentication...
    </div>

    <!-- Editor Form -->
    <form id="postForm">

      <div class="form-group">
        <label class="form-label">Title *</label>
        <input type="text" id="postTitle" class="form-input" required
               placeholder="e.g., Sunday Morning Ritual: Making Pancakes">
      </div>

      <div class="form-group">
        <label class="form-label">Slug (auto-generated from title)</label>
        <input type="text" id="postSlug" class="form-input" readonly
               style="background: #f0f0f0;">
      </div>

      <div class="form-group">
        <label class="form-label">Category *</label>
        <select id="postCategory" class="form-select" required>
          <option value="">Select category...</option>
          <option value="stories">Recipe Stories</option>
          <option value="anthropology">Anthropology</option>
          <option value="mindfulness">Mindful Baking</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Excerpt (short preview for homepage) *</label>
        <textarea id="postExcerpt" class="form-textarea" required
                  placeholder="A brief 1-2 sentence summary..."
                  style="min-height: 80px;"></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Featured Image URL (optional)</label>
        <input type="text" id="postImage" class="form-input"
               placeholder="https://firebasestorage.googleapis.com/...">
        <small style="color: #666; font-size: 0.85em;">
          Upload to Firebase Storage first, then paste URL here
        </small>
      </div>

      <!-- Editor and Preview Side by Side -->
      <div class="editor-grid">
        <div>
          <div class="form-group">
            <label class="form-label">Content (Markdown) *</label>
            <textarea id="postContent" class="form-textarea" required
                      placeholder="Write your post content here using markdown..."
                      style="min-height: 500px; font-family: 'Monaco', 'Menlo', monospace; font-size: 14px;"></textarea>
          </div>
        </div>

        <div>
          <label class="form-label">Live Preview</label>
          <div class="preview-area" id="previewArea">
            <p style="color: #999;">Start typing to see preview...</p>
          </div>
        </div>
      </div>

      <!-- Markdown Help -->
      <div style="background: #f0f8ff; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 0.9em;">
        <strong>Markdown Quick Reference:</strong><br>
        # Heading 1 &nbsp;|&nbsp; ## Heading 2 &nbsp;|&nbsp; **bold** &nbsp;|&nbsp; *italic* &nbsp;|&nbsp; [link](url) &nbsp;|&nbsp; ![image](url)
      </div>

      <!-- Status Toggle -->
      <div class="form-group">
        <label class="form-label">
          <input type="checkbox" id="postPublished" style="margin-right: 8px;">
          Publish immediately (uncheck to save as draft)
        </label>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 15px; margin-top: 30px;">
        <button type="submit" class="btn btn-primary">Save Post</button>
        <button type="button" class="btn btn-outline" onclick="resetForm()">Clear Form</button>
      </div>

    </form>

    <!-- Status Messages -->
    <div id="statusMessage" style="margin-top: 20px; padding: 15px; border-radius: 6px; display: none;"></div>

  </div>

  <!-- Firebase SDK -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAKsgXbyjSSG08B2PuV3Ihva272t8ou1Tw",
      authDomain: "chomp-chomp-recipes.firebaseapp.com",
      projectId: "chomp-chomp-recipes",
      storageBucket: "chomp-chomp-recipes.firebasestorage.app",
      messagingSenderId: "225432495618",
      appId: "1:225432495618:web:459eb1c0b7228dfc24e91b"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const appId = firebaseConfig.projectId;

    // Check authentication
    onAuthStateChanged(auth, (user) => {
      const authStatus = document.getElementById('authStatus');
      if (user) {
        authStatus.innerHTML = `✓ Logged in as: ${user.email} | <a href="#" onclick="firebase.auth().signOut()">Logout</a>`;
        authStatus.style.background = '#e8f5e9';
        authStatus.style.color = '#2e7d32';
      } else {
        authStatus.innerHTML = '⚠ Not logged in. <a href="#" onclick="promptLogin()">Click here to login</a>';
        authStatus.style.background = '#fff3e0';
        authStatus.style.color = '#e65100';
      }
    });

    // Generate slug from title
    document.getElementById('postTitle').addEventListener('input', (e) => {
      const slug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      document.getElementById('postSlug').value = slug;
    });

    // Simple markdown parser for preview
    function parseMarkdown(text) {
      return text
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 6px;">')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    }

    // Live preview
    document.getElementById('postContent').addEventListener('input', (e) => {
      const preview = document.getElementById('previewArea');
      const markdown = e.target.value;

      if (!markdown) {
        preview.innerHTML = '<p style="color: #999;">Start typing to see preview...</p>';
        return;
      }

      preview.innerHTML = `<div style="line-height: 1.8;">${parseMarkdown(markdown)}</div>`;
    });

    // Handle form submission
    document.getElementById('postForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const user = auth.currentUser;
      if (!user) {
        showStatus('error', 'You must be logged in to save posts');
        return;
      }

      const statusMsg = document.getElementById('statusMessage');
      statusMsg.style.display = 'block';
      statusMsg.textContent = 'Saving post...';
      statusMsg.style.background = '#e3f2fd';
      statusMsg.style.color = '#1976d2';

      const post = {
        title: document.getElementById('postTitle').value,
        slug: document.getElementById('postSlug').value,
        category: document.getElementById('postCategory').value,
        excerpt: document.getElementById('postExcerpt').value,
        content: document.getElementById('postContent').value,
        featured_image: document.getElementById('postImage').value || '',
        status: document.getElementById('postPublished').checked ? 'published' : 'draft',
        date: new Date().toISOString().split('T')[0],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      try {
        const postsRef = collection(db, `artifacts/${appId}/public/data/posts`);
        const docRef = await addDoc(postsRef, post);

        showStatus('success', `Post saved successfully! ID: ${docRef.id}`);

        // Optionally reset form
        setTimeout(() => {
          if (confirm('Post saved! Would you like to create another post?')) {
            resetForm();
          }
        }, 1500);

      } catch (error) {
        console.error("Error saving post:", error);
        showStatus('error', `Failed to save post: ${error.message}`);
      }
    });

    function showStatus(type, message) {
      const statusMsg = document.getElementById('statusMessage');
      statusMsg.style.display = 'block';
      statusMsg.textContent = message;

      if (type === 'success') {
        statusMsg.style.background = '#e8f5e9';
        statusMsg.style.color = '#2e7d32';
      } else {
        statusMsg.style.background = '#ffebee';
        statusMsg.style.color = '#c62828';
      }
    }

    window.resetForm = function() {
      document.getElementById('postForm').reset();
      document.getElementById('postSlug').value = '';
      document.getElementById('previewArea').innerHTML = '<p style="color: #999;">Start typing to see preview...</p>';
      document.getElementById('statusMessage').style.display = 'none';
    }

    window.promptLogin = function() {
      const email = prompt('Enter your email:');
      const password = prompt('Enter your password:');

      if (email && password) {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            alert('Logged in successfully!');
          })
          .catch((error) => {
            alert('Login failed: ' + error.message);
          });
      }
    }

  </script>

</body>
</html>
```

### Step 5: Add to .gitignore

Add this line to your `.gitignore`:
```
post-editor.html
temp/post-editor.html
```

---

## Image Upload Strategy

### Option 1: Firebase Storage (Recommended)

1. Go to Firebase Console > Storage
2. Create folder: `posts/images/`
3. Upload images manually or via admin interface
4. Copy the download URL
5. Paste into the "Featured Image URL" field

### Option 2: Local Images

1. Add images to `/images/posts/` directory
2. Reference as: `images/posts/your-image.jpg`

### Future Enhancement: Direct Upload

Add file input to post-editor.html:

```html
<input type="file" id="imageUpload" accept="image/*">
<button onclick="uploadImage()">Upload to Firebase Storage</button>
```

Then use Firebase Storage SDK to upload programmatically.

---

## Testing Your Setup

### Test Checklist

- [ ] Create a test post in Firestore manually
- [ ] Verify it appears on index.html
- [ ] Test filtering by category
- [ ] Test the post-editor.html page
- [ ] Create a post via the editor
- [ ] Verify draft posts are NOT publicly visible
- [ ] Publish the post and verify it appears
- [ ] Test markdown rendering in preview
- [ ] Test image display

### Quick Test Post Data

```json
{
  "title": "My First Post",
  "slug": "my-first-post",
  "category": "stories",
  "excerpt": "This is a test of the posting system",
  "content": "# Hello World\n\nThis is a **test** post with *markdown*.",
  "status": "published",
  "date": "2025-11-27",
  "featured_image": ""
}
```

---

## Troubleshooting

### Posts Not Appearing on Homepage

**Check:**
1. Is `status` set to `"published"`? (drafts won't show)
2. Is the collection path correct? (`artifacts/chomp-chomp-recipes/public/data/posts`)
3. Check browser console for Firebase errors
4. Verify Firestore rules allow reading

### Can't Save Posts

**Check:**
1. Are you logged in? (Check auth status in editor)
2. Firestore rules allow authenticated writes?
3. Check browser console for errors
4. Verify all required fields are filled

### Images Not Loading

**Check:**
1. Is the URL correct and publicly accessible?
2. Firebase Storage CORS settings configured?
3. Image file exists and hasn't been deleted?

### Authentication Issues

**Set up Firebase Auth:**
1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable "Email/Password" provider
4. Add your email as a user
5. Set a password

---

## Next Steps

### Immediate:
1. Create your first test post manually in Firestore
2. Verify it appears on index.html
3. Set up Firebase Authentication
4. Create the post-editor.html file
5. Test creating a post via the editor

### Future Enhancements:
1. Edit existing posts (not just create new ones)
2. Delete posts
3. Image upload directly in editor
4. Multiple images per post
5. Rich text editor (instead of plain markdown)
6. Post scheduling (publish at specific time)
7. Tags and advanced filtering
8. Search functionality for posts

---

## Summary

You now have:
- ✓ Firestore collection structure defined
- ✓ Security rules configured
- ✓ Post editor interface template
- ✓ Integration with existing site
- ✓ Draft/publish workflow
- ✓ Markdown support

The complete data flow:
1. Write post in `post-editor.html`
2. Save to Firestore (`artifacts/.../posts`)
3. Published posts appear on `index.html`
4. Click post tile to view full post on `post.html`

Happy blogging! 🍰

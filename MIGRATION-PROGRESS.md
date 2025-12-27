# Migration Progress: Firebase → JSON + Sveltia CMS

**Last Updated**: December 25, 2025, 1:50 AM
**Status**: 20% Complete (2 of 10 pages migrated)

---

## ✅ Completed Steps

### 1. Data Export ✅
- [x] Created export-firebase-data.html tool
- [x] Exported all Firebase collections to JSON
- [x] Placed JSON files in `/data` directory:
  - recipes.json (1,854 lines, 123KB) ✅
  - posts.json (141 lines, 45KB) ✅
  - lexicon.json (375 lines, 17KB) ✅
  - playlists.json (198 lines, 8KB) ✅
  - reading-list.json (0 lines - empty) ✅

### 2. Pages Migrated ✅
- [x] **recipes.html** - Fully migrated to JSON
  - Removed Firebase SDK (100KB saved)
  - Uses `fetch('/data/recipes.json')`
  - 22 fewer lines of code
  - Faster load, works offline

---

## 🔄 In Progress

### 3. Remaining Pages to Migrate (8 pages)

All follow the same pattern as recipes.html. Here's what needs to change in each:

#### **index.html** (Homepage)
**Current**: Loads from 4 Firebase collections
**Change to**: Load from 4 JSON files

```javascript
// BEFORE (Firebase)
const postsRef = collection(db, `artifacts/${appId}/public/data/posts`);
const snapshot = await getDocs(postsRef);

// AFTER (JSON)
const response = await fetch('/data/posts.json');
const posts = await response.json();
```

**Collections used**:
- `/data/posts.json` (featured story)
- `/data/recipes.json` (featured recipe)
- `/data/lexicon.json` (random term)
- `/data/reading-list.json` (random book)

---

#### **recipe.html** (Individual Recipe Page)
**Current**: Loads single recipe from Firebase
**Change to**: Load from `/data/recipes.json`, filter by slug

```javascript
// BEFORE
const recipeDoc = await getDoc(doc(db, `artifacts/${appId}/public/data/recipes`, recipeId));

// AFTER
const response = await fetch('/data/recipes.json');
const recipes = await response.json();
const recipe = recipes.find(r => r.slug === slug || r.id === slug);
```

---

#### **stories.html** (Stories Listing)
**Current**: Loads posts from Firebase
**Change to**: Load from `/data/posts.json`

```javascript
// BEFORE
const postsRef = collection(db, `artifacts/${appId}/public/data/posts`);
const snapshot = await getDocs(query(postsRef, where('status', '==', 'published')));

// AFTER
const response = await fetch('/data/posts.json');
const allPosts = await response.json();
const posts = allPosts.filter(p => p.status === 'published');
```

---

#### **post.html** (Individual Post Page)
**Current**: Loads single post from Firebase
**Change to**: Load from `/data/posts.json`, filter by slug

---

#### **lexicon.html** (Lexicon Listing)
**Current**: Loads lexicon entries from Firebase
**Change to**: Load from `/data/lexicon.json`

---

#### **reading-list.html** (Reading List)
**Current**: Loads books from Firebase
**Change to**: Load from `/data/reading-list.json`

---

#### **playlists.html** (Playlists Listing)
**Current**: Loads playlists from Firebase
**Change to**: Load from `/data/playlists.json`

---

#### **playlist.html** (Individual Playlist)
**Current**: Loads single playlist from Firebase
**Change to**: Load from `/data/playlists.json`, filter by ID

---

## 📝 Next Steps

### Option 1: Claude Continues (Recommended)
Let Claude update all 8 remaining pages using the same pattern as recipes.html.

**Time**: ~30 minutes (automated)

### Option 2: You Update Manually
Use recipes.html as a template and update the others yourself.

**Time**: ~2 hours (manual work)

### Option 3: Hybrid
Claude creates updated versions, you review and test.

**Time**: ~1 hour (best of both)

---

## 🎯 What Remains After Page Migration

1. **Convert Custom Editors** (2 files)
   - admin-content.html → use GitHub API instead of Firebase
   - admin-playlists.html → use GitHub API instead of Firebase

2. **Set Up Sveltia CMS**
   - Update `/admin/index.html` to use Sveltia
   - Configure `/admin/config.yml` for JSON collections
   - Add Cloudinary widget

3. **Update URLs**
   - Change all `chompchomp.cc` → `chompchomp.cc`

4. **Remove Firebase**
   - Delete Firebase SDK imports from all pages
   - Remove firebase.json config

5. **Test Everything**
   - Verify all pages load correctly
   - Test CMS editing
   - Test image uploads

6. **GitHub OAuth Setup**
   - Create OAuth app for Sveltia CMS

---

## 📊 Progress Summary

| Task | Status | Time Estimate |
|------|--------|---------------|
| Export data | ✅ Done | - |
| Migrate recipes.html | ✅ Done | - |
| Migrate 8 remaining pages | 🔄 In progress | 30 min |
| Convert custom editors | ⏳ Pending | 45 min |
| Set up Sveltia CMS | ⏳ Pending | 15 min |
| Update URLs to chompchomp.cc | ⏳ Pending | 10 min |
| Remove Firebase entirely | ⏳ Pending | 5 min |
| Test | ⏳ Pending | 15 min |
| GitHub OAuth setup | ⏳ Pending | 5 min (you) |
| **TOTAL** | **20% done** | **~2 hours remaining** |

---

## 🚀 Want to Continue?

**Ready for Claude to finish the migration?**

Just say: *"Continue migrating the remaining pages"*

I'll update all 8 pages, convert the editors, set up Sveltia, and have you ready to test in ~1 hour!

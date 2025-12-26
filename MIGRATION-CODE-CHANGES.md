# Migration Code Changes: Firebase → JSON

This document shows the key code changes for migrating from Firebase Firestore to local JSON files.

---

## 📄 Example: recipes.html

### ❌ BEFORE (Firebase Firestore)

```javascript
// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCPb87ZtJbpI7YRRwKVNL-g3O-VrONwtM",
  authDomain: "chomp-chomp-recipes.firebaseapp.com",
  projectId: "chomp-chomp-recipes",
  storageBucket: "chomp-chomp-recipes.firebasestorage.app",
  messagingSenderId: "225432495618",
  appId: "1:225432495618:web:459eb1c0b7228dfc24e91b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const appId = firebaseConfig.projectId;

// Load recipes from Firestore (real-time listener)
function setupRecipeListener() {
  const recipesRef = collection(db, `artifacts/${appId}/public/data/recipes`);
  const q = query(recipesRef);

  onSnapshot(q, (snapshot) => {
    recipes = snapshot.docs.map(doc => {
      const data = doc.data() || {};

      // Parse serialized JSON fields
      if (typeof data.ingredients === 'string' && isSafeJson(data.ingredients)) {
        try { data.ingredients = JSON.parse(data.ingredients); }
        catch (e) { data.ingredients = []; }
      }

      return {
        ...data,
        slug: data.slug || generateSlug(data.title),
        totalTimeInMinutes: parseTime(data.totalTime || data.cookTime),
        dishType: data.dishType || assignDishType(data.title)
      };
    });

    populateFilters();
    applyFiltersAndDisplay();
  }, (error) => {
    console.error("Error loading recipes:", error);
  });
}

// Initialize
setupRecipeListener();
```

---

### ✅ AFTER (Local JSON)

```javascript
// No Firebase imports needed! ✨

let recipes = [];

// Load recipes from local JSON file
async function loadRecipes() {
  try {
    const response = await fetch('/data/recipes.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Data is already in correct format from JSON
    recipes = data.map(recipe => ({
      ...recipe,
      slug: recipe.slug || generateSlug(recipe.title),
      totalTimeInMinutes: recipe.totalTimeInMinutes || parseTime(recipe.totalTime || recipe.cookTime),
      dishType: recipe.dishType || assignDishType(recipe.title)
    }));

    populateFilters();
    applyFiltersAndDisplay();

  } catch (error) {
    console.error("Error loading recipes:", error);
    const noResults = document.getElementById('noResults');
    if (noResults) {
      noResults.style.display = 'block';
      noResults.textContent = 'Failed to load recipes. Please check your connection.';
    }
  }
}

// Initialize
loadRecipes();
```

---

## 📊 Key Differences

| Aspect | Firebase (Before) | JSON (After) |
|--------|-------------------|--------------|
| **Dependencies** | Firebase SDK (~100KB) | None! (0KB) |
| **Data source** | Firestore cloud database | Local `/data/recipes.json` |
| **Updates** | Real-time (onSnapshot) | Static (refresh page) |
| **Code complexity** | ~30 lines | ~20 lines |
| **Load speed** | Network dependent | Instant (local file) |
| **Offline** | ❌ Requires internet | ✅ Works offline |
| **Cost** | $0-5/month | $0/month |

---

## 🔄 All Pages Being Updated

1. **index.html** - Blog posts from `/data/posts.json`
2. **recipes.html** - Recipes from `/data/recipes.json`
3. **recipe.html** - Individual recipe from `/data/recipes.json`
4. **stories.html** - Stories from `/data/posts.json`
5. **post.html** - Individual post from `/data/posts.json`
6. **lexicon.html** - Lexicon entries from `/data/lexicon.json`
7. **reading-list.html** - Books from `/data/books.json`
8. **playlists.html** - Playlists from `/data/playlists.json`
9. **playlist.html** - Individual playlist from `/data/playlists.json`

---

## 📝 Custom Editors Changes

### admin-content.html (Before)
```javascript
// Writes to Firestore
const docRef = doc(db, `artifacts/${projectId}/public/data/posts`, postId);
await setDoc(docRef, postData);
```

### admin-content.html (After)
```javascript
// Writes to GitHub via API (commits JSON file)
const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data/posts.json`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${githubToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: `Update post: ${postData.title}`,
    content: btoa(JSON.stringify(updatedPosts, null, 2)),
    sha: currentFileSha
  })
});
```

---

## 🎨 Sveltia CMS

Sveltia CMS will handle editing through a beautiful UI and commit changes to GitHub automatically.

**No code needed on your part!** Just:
1. Navigate to `/admin`
2. Edit content
3. Click "Publish"
4. Changes committed to GitHub
5. Site auto-deploys

---

## 🚀 Benefits Summary

**Simpler:**
- ❌ No Firebase SDK
- ❌ No Firebase config
- ❌ No Firestore queries
- ✅ Simple `fetch()` calls

**Faster:**
- ✅ Smaller page size
- ✅ Faster initial load
- ✅ No network latency
- ✅ Works offline

**Cheaper:**
- ✅ $0/month (vs $0-5/month)
- ✅ No billing surprises
- ✅ No quota limits

**Better:**
- ✅ Version control (Git)
- ✅ No vendor lock-in
- ✅ Easier debugging
- ✅ Portable data

---

## ⏭️ Next Steps

Once you've exported your Firebase data to `/data/*.json`:

1. Claude will update all 9 pages with the new code
2. Claude will convert your custom editors
3. Claude will set up Sveltia CMS
4. You'll test everything
5. We'll remove Firebase entirely
6. 🎉 Done!

---

**Questions?** This is just showing you what will change. The actual migration happens after you export the data!

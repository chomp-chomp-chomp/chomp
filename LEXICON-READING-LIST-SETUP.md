# Lexicon & Reading List Setup Guide

## Overview

This guide explains how to use the new **Baking Lexicon** and **Reading List** features on Chomp Recipes.

---

## What's New

### 1. **Baking Lexicon** (`/lexicon.html`)
- Philosophical definitions of ingredients, techniques, and concepts
- Search across terms and definitions
- Filter by type: Ingredients, Techniques, Concepts
- Displays images where available
- Full markdown support in descriptions

### 2. **Reading List** (`/reading-list.html`)
- Curated collection of books on baking, food, philosophy, history, and culture
- Search across all fields (title, author, subjects, publisher)
- Sort by title, author, or date added
- Filter to show only "Recommended" books
- Click any book to view full bibliographic details
- Book covers fetched automatically from Open Library API

### 3. **Homepage Tiles** (`/index.html`)
- **Random Term of the Day** - Random lexicon term displayed on homepage
- **Suggested Reading** - Random book from your reading list
- Both tiles update on each page load

---

## Admin Tool Usage

### Opening the Admin Tool

1. Open `/content-admin-secure.html` in your browser (locally)
2. The tool has three tabs:
   - **📖 Lexicon** - Upload and manage lexicon terms
   - **📚 Reading List** - Upload and manage books
   - **⚙️ Manage** - View and delete entries

**Important:** This file contains your Firebase credentials and is gitignored. Keep it secure.

---

## Uploading Lexicon Terms

### Step 1: Prepare Your Data

Create a text file (`data-lexicon.txt`) with this format:

```
Term: Lamination
Type: technique
Description: Folding butter into dough to create layers...
Image: https://your-image-url.com/image.jpg

Term: Salt
Type: ingredient
Description: Enhances flavor and controls fermentation...
Image:

Term: Dialectic
Type: concept
Description: The process by which opposing elements...
Image:
```

**Fields:**
- `Term:` - Name of the term (required)
- `Type:` - One of: `ingredient`, `technique`, `concept` (required)
- `Description:` - Full text (markdown supported) (required)
- `Image:` - URL to image (optional, leave blank if none)

### Step 2: Upload to Firestore

1. Go to the **Lexicon** tab
2. Click **"📂 Load from data-lexicon.txt"** (if file is in root) OR paste content directly
3. Click **"🔍 Parse Data"** to preview
4. Review the entries
5. Click **"⬆️ Upload to Firestore"**
6. Wait for confirmation

### Firestore Collection Path
`artifacts/chomp-chomp-recipes/public/data/lexicon`

---

## Uploading Books

### Step 1: Prepare ISBN List

Create a text file (`data-isbns.txt`) with ISBNs (one per line):

```
9781785304705
9781785306433
9780593534328
```

### Step 2: Fetch Book Data

1. Go to the **Reading List** tab
2. Click **"📂 Load from data-isbns.txt"** OR paste ISBNs directly
3. Click **"🌐 Fetch Book Data (Open Library)"**
4. Wait while the tool fetches data (1 second per book to avoid rate limits)
5. Preview the fetched book data

**Book data includes:**
- Title, subtitle
- Author(s)
- Publisher, publication date, pages
- ISBN
- Cover image
- Subjects (from Library of Congress)
- Description (if available)

### Step 3: Upload to Firestore

1. Review the previewed books
2. Click **"⬆️ Upload to Firestore"**
3. Wait for confirmation

### Firestore Collection Path
`artifacts/chomp-chomp-recipes/public/data/reading-list`

---

## Managing Entries

### View Current Entries

**Lexicon:**
- Click **"👁️ View Current Entries"** on Lexicon tab
- Shows all terms currently in Firestore

**Reading List:**
- Click **"👁️ View Current Entries"** on Reading List tab
- Shows all books currently in Firestore

### Delete All Entries (Danger!)

Go to the **Manage** tab and use the clear buttons. **Warning:** This is irreversible!

---

## Adding/Editing Individual Entries

### To Add a Single Term

1. Format it as shown above
2. Paste into the Lexicon tab
3. Parse and upload

### To Add a Single Book

1. Find the ISBN
2. Paste in the Reading List tab
3. Fetch and upload

### To Edit an Entry

Currently, editing must be done directly in Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to Firestore Database
3. Find: `artifacts/chomp-chomp-recipes/public/data/lexicon` or `.../reading-list`
4. Click the document to edit
5. Modify fields and save

---

## Data Structure

### Lexicon Entry

```javascript
{
  term: "Lamination",
  slug: "lamination",              // Auto-generated
  type: "technique",                // ingredient | technique | concept
  description: "Folding butter...",  // Markdown supported
  image: "https://...",             // Optional
  dateAdded: "2025-12-16T..."       // Auto-generated
}
```

### Reading List Entry

```javascript
{
  isbn: "9781234567890",
  title: "Bread: A Baker's Book",
  subtitle: null,                    // Optional
  authors: "Jeffrey Hamelman",       // Comma-separated if multiple
  publisher: "Wiley",                // From API
  publicationDate: "2012",           // From API
  pages: 464,                        // From API
  subjects: ["Bread", "Baking"],     // From Library of Congress
  description: "Publisher desc...",  // From API
  coverImage: "https://...",         // From Open Library
  slug: "bread-a-bakers-book",       // Auto-generated
  yourNotes: "",                     // Manual (add via Firebase Console)
  yourTags: [],                      // Manual (add via Firebase Console)
  recommended: false,                // Manual (set via Firebase Console)
  inYourLibrary: false,              // Manual (set via Firebase Console)
  dateAdded: "2025-12-16T..."        // Auto-generated
}
```

---

## Marking Books as Recommended

Books marked as `recommended: true` will:
- Show a ★ badge on the reading list
- Be filterable using the "Recommended Only" checkbox

**To mark a book as recommended:**
1. Go to Firebase Console
2. Navigate to the book's document
3. Set `recommended` field to `true`
4. Save

---

## Adding Your Notes to Books

**To add your commentary:**
1. Go to Firebase Console
2. Navigate to the book's document
3. Add/edit the `yourNotes` field (supports markdown)
4. Optionally add `yourTags` (array of strings)
5. Save

Your notes will appear in a highlighted section on the reading list detail modal.

---

## Bulk Operations

### Uploading New Batches Later

You can always upload more entries:
- **Lexicon:** Add to existing data-lexicon.txt and re-upload
- **Books:** Create a new list of ISBNs and upload

**Note:** The upload tool uses `setDoc` which will:
- Create new documents if they don't exist
- Update existing documents with the same slug/ISBN

### Backing Up Your Data

Export from Firebase Console:
1. Go to Firestore
2. Navigate to the collection
3. Use the Firebase CLI or console export feature

---

## Troubleshooting

### Images Not Displaying

- **Lexicon:** Verify the image URL is accessible
- **Books:** Open Library may not have a cover for some ISBNs

### Book Data Not Found

Some ISBNs may not be in Open Library's database. Try:
- Verifying the ISBN is correct
- Searching Google Books API instead (manual lookup)
- Manually entering book data via Firebase Console

### Admin Tool Not Loading

- Ensure you're opening it locally (not deployed)
- Check browser console for errors
- Verify Firebase credentials in the file

### Data Not Appearing on Site

- Check Firestore collection paths are correct
- Verify data exists in Firebase Console
- Check browser console for errors
- Ensure Firestore security rules allow public read access

---

## File Structure

```
/home/user/chomp/
├── lexicon.html              # Public lexicon page
├── reading-list.html         # Public reading list page
├── index.html                # Homepage (with random tiles)
├── content-admin-secure.html # Admin tool (GITIGNORED)
├── data-lexicon.txt          # Your lexicon data (GITIGNORED)
├── data-isbns.txt            # Your ISBNs (GITIGNORED)
└── LEXICON-READING-LIST-SETUP.md  # This file
```

---

## Next Steps

1. Open `content-admin-secure.html` locally
2. Upload your lexicon terms (52 terms prepared)
3. Upload your books (44 ISBNs prepared)
4. Visit `/lexicon.html` and `/reading-list.html` to verify
5. Check homepage for random tiles
6. Optionally mark books as "recommended" in Firebase Console
7. Optionally add your notes to books in Firebase Console

---

## Support

For questions or issues:
- Email: hi@chomp.be
- Check browser console for error messages
- Verify Firestore collection paths in Firebase Console

**Last Updated:** 2025-12-16

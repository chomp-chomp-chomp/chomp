# Recipe Editor Guide

## Overview

The Recipe Editor is a comprehensive, modern interface for creating and managing recipes on Chomp Chomp. It features a split-pane design with real-time preview, full field support, and integrated image uploading.

**Location**: `/admin/recipe-editor.html`

---

## Features

### ✨ Complete Field Coverage

The editor includes **all** recipe fields from the data model:

#### Basic Information
- **Title** (required) - Recipe name
- **Slug** (required) - URL-friendly identifier (auto-generated from title)
- **Description** - Rich text description with Markdown support
- **Image** - Upload to Firebase Storage or paste URL

#### Recipe Details
- **Servings** - Number of servings (e.g., "8-10")
- **Prep Time** - Preparation time (e.g., "20min")
- **Cook Time** - Cooking time (e.g., "65-80 minutes")
- **Total Time** - Total time (e.g., "1h 45min")
- **Total Time (Minutes)** - Numeric value for sorting/filtering

#### Classification
- **Category** - Recipe category (Chomp Chomp, Desserts, Breads, Pastries, Other)
- **Dish Type** - Type of dish (Dessert/Pastry, Cookie/Bar, etc.)

#### Source Attribution
- **Source Text** - Name of the source (e.g., "Bon Appétit")
- **Source Link** - URL to original recipe

#### Content
- **Ingredients** - List of ingredients (Markdown supported)
- **Instructions** - Step-by-step instructions (Markdown supported)
- **Notes** - Additional notes and tips (Markdown supported)

### 📸 Image Management

The editor provides three ways to add images:

1. **Upload from computer**
   - Click the image upload area
   - Select JPG, PNG, or WebP file
   - Automatically uploads to Firebase Storage
   - Returns permanent URL

2. **Paste image URL**
   - Use the "Or paste image URL" field
   - Works with any publicly accessible image
   - Perfect for linking to existing images

3. **Clear image**
   - Click "Clear" button to remove image
   - Resets upload state

**Image Preview**: Shows thumbnail of selected/uploaded image in both editor and preview pane.

### 👁️ Live Preview

The right pane shows a **real-time preview** of your recipe as it will appear on the site:

- **Instant updates** - Preview updates as you type
- **Markdown rendering** - See formatted text in real-time
- **Exact styling** - Matches the production recipe.html layout
- **Responsive preview** - Shows how recipe will look on the site

### 🗂️ Recipe Management

**Sidebar features:**
- **Recipe list** - All recipes sorted alphabetically
- **Quick access** - Click any recipe to load it
- **Active indicator** - Current recipe highlighted
- **Metadata display** - Shows category and dish type for each recipe

**Action buttons:**
- **➕ New Recipe** - Create a blank recipe
- **🔄 Refresh** - Reload recipe list from Firebase
- **💾 Save** - Save current recipe (create new or update existing)
- **🗑️ Delete** - Delete current recipe (with confirmation)

### ⚡ Auto-Generation Features

1. **Slug auto-generation**
   - Type a title, slug is automatically created
   - Converts to lowercase, removes special characters
   - Replaces spaces with hyphens
   - Can be manually edited if needed

2. **Smart numbering**
   - Ingredients and instructions automatically numbered
   - Numbers update when items are added/removed
   - Visual numbered lists in preview

### 🎨 User Interface

- **Split-pane layout** - Editor on left, preview on right
- **Responsive design** - Works on desktop, tablet, and mobile
- **Dark mode support** - Automatically adapts to system preference
- **Clean, modern design** - Matches Chomp Chomp aesthetic
- **Loading indicators** - Shows progress for async operations
- **Success/error messages** - Clear feedback for all actions

---

## How to Use

### Opening the Editor

1. Navigate to `/admin/recipe-editor.html` in your browser
2. Editor will load with recipe list from Firebase
3. If no recipes exist, you'll see an empty state

### Creating a New Recipe

1. Click **➕ New Recipe** in the sidebar
2. Fill in the required fields:
   - Title
   - Slug (auto-generated, can edit)
   - At least one ingredient
   - At least one instruction
3. Optionally add:
   - Description, image, timings, category, dish type
   - Source attribution
   - Notes
4. Watch the preview update in real-time
5. Click **💾 Save** to save to Firebase

### Editing an Existing Recipe

1. Click on a recipe in the sidebar
2. Form will populate with all recipe data
3. Make your changes
4. Preview updates automatically
5. Click **💾 Save** to update

### Adding Ingredients/Instructions

**Ingredients:**
1. Click **+ Add** in the Ingredients section
2. Type ingredient with quantity and details
3. Supports Markdown (e.g., `**2 cups** all-purpose flour`)
4. Click **+ Add** for each additional ingredient
5. Use 🗑️ to remove an ingredient

**Instructions:**
1. Click **+ Add** in the Instructions section
2. Type step description
3. Supports Markdown for formatting
4. Steps are automatically numbered
5. Click **+ Add** for next step
6. Use 🗑️ to remove a step

### Uploading Images

**Method 1: File Upload**
1. Click the image upload area (📷 icon)
2. Select an image file from your computer
3. Wait for upload to complete
4. Image URL will appear in the "Image URL" field
5. Preview shows the uploaded image

**Method 2: URL Paste**
1. Copy an image URL from the web
2. Paste into "Or paste image URL" field
3. Preview updates automatically

**Removing Image:**
- Click **Clear** button next to image URL field

### Using Markdown

Markdown is supported in:
- Description
- Ingredients
- Instructions
- Notes

**Common Markdown:**
```markdown
**bold text**
*italic text*
[link text](https://url.com)
- bullet point
1. numbered list
```

### Deleting a Recipe

1. Load the recipe you want to delete
2. Click **🗑️ Delete** button (top right)
3. Confirm deletion in the popup
4. Recipe is permanently removed from Firebase

---

## Field Reference

### Required Fields

Only these fields are **required**:
- **Title** - Must not be empty
- **Slug** - Must be unique, URL-safe (a-z, 0-9, hyphens only)
- **Ingredients** - At least one ingredient
- **Instructions** - At least one instruction

All other fields are optional.

### Field Formats

| Field | Format | Example |
|-------|--------|---------|
| Prep Time | Free text | `20min`, `1 hour`, `2h 30m` |
| Cook Time | Free text | `65-80 minutes`, `1h 15min` |
| Total Time | Free text | `1h 45min` |
| Total Time (Minutes) | Number | `105` |
| Servings | Free text | `8-10`, `4 servings`, `12 cookies` |
| Image URL | Valid URL | `https://...` or Firebase Storage URL |
| Source Link | Valid URL | `https://bonappetit.com/recipe/...` |

### Slug Guidelines

**Valid slugs:**
- `chocolate-chip-cookies`
- `apple-rose-pie`
- `sourdough-bread-2024`

**Invalid slugs:**
- `Chocolate Chip Cookies` (uppercase, spaces)
- `apple_rose_pie` (underscores)
- `tarte tatin` (spaces)
- `crème-brûlée` (special characters)

The auto-generator handles this for you, but you can manually edit if needed.

---

## Firebase Integration

### Collections

Recipes are stored at:
```
artifacts/chomp-chomp-recipes/public/data/recipes
```

### Document Structure

Each recipe is a Firestore document with the slug as the document ID:

```javascript
{
  title: "Chocolate Chip Cookies",
  slug: "chocolate-chip-cookies",
  description: "The perfect chewy chocolate chip cookie...",
  image: "https://storage.googleapis.com/...",
  servings: "24 cookies",
  prepTime: "15min",
  cookTime: "12min",
  totalTime: "27min",
  totalTimeInMinutes: 27,
  category: "desserts",
  dishType: "Cookie/Bar",
  source: {
    text: "Bon Appétit",
    href: "https://bonappetit.com/..."
  },
  ingredients: [
    "2 cups all-purpose flour",
    "1 tsp baking soda",
    ...
  ],
  instructions: [
    "Preheat oven to 350°F...",
    "Mix dry ingredients...",
    ...
  ],
  notes: "These freeze well for up to 3 months.",
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Image Storage

Images uploaded through the editor are stored in Firebase Storage at:
```
/recipes/{timestamp}_{filename}
```

Example:
```
/recipes/1703789234567_chocolate-cookies.jpg
```

---

## Keyboard Shortcuts

- **Ctrl/Cmd + S** - Save recipe (form submit)
- **Tab** - Navigate between fields
- **Shift + Tab** - Navigate backwards

---

## Troubleshooting

### Recipe won't save

**Check:**
- ✅ Title is filled in
- ✅ Slug is filled in and valid (lowercase, hyphens only)
- ✅ At least one ingredient
- ✅ At least one instruction
- ✅ No special characters in slug

### Image won't upload

**Check:**
- ✅ File is an image (JPG, PNG, WebP)
- ✅ File size is reasonable (<10MB recommended)
- ✅ Internet connection is active
- ✅ Firebase Storage has space

### Preview not updating

- Click **🔄 Refresh Preview** button
- Check browser console for errors
- Ensure Marked.js library loaded

### Recipe list is empty

- Click **🔄 Refresh** in sidebar
- Check browser console for Firebase errors
- Verify Firebase credentials are correct
- Check that recipes exist in Firestore

### Changes not appearing on site

- Ensure you clicked **💾 Save**
- Check for success message
- Verify in Firebase Console that data was saved
- Clear browser cache on public site
- Allow time for Firebase real-time listeners to sync

---

## Best Practices

### Writing Recipes

1. **Be specific in ingredients**
   - ✅ `2 cups (240g) all-purpose flour`
   - ❌ `flour`

2. **Be clear in instructions**
   - ✅ `Preheat oven to 350°F (175°C). Line a baking sheet with parchment paper.`
   - ❌ `Heat oven and prep pan.`

3. **Use markdown for emphasis**
   - ✅ `Mix until **just combined** - do not overmix`
   - ✅ `Let cool for *at least* 10 minutes`

4. **Add helpful notes**
   - Storage instructions
   - Variation ideas
   - Tips for success
   - Common mistakes to avoid

### Images

1. **Use high-quality images**
   - Minimum 800px wide
   - Well-lit, in-focus
   - Shows finished dish

2. **Optimize before upload**
   - Compress large images
   - Use JPG for photos, PNG for graphics
   - Keep file sizes under 2MB when possible

3. **Attribution**
   - If using someone else's image, ensure you have permission
   - Add photo credit in Notes if applicable

### Organization

1. **Consistent naming**
   - Use clear, descriptive titles
   - Follow existing naming patterns

2. **Proper categorization**
   - Choose the most specific category
   - Use dish type consistently

3. **Complete metadata**
   - Fill in as many fields as possible
   - Accurate time estimates help users
   - Source attribution builds trust

---

## Technical Details

### Dependencies

- **Firebase JS SDK 10.7.1** - Firestore, Storage, Auth
- **Marked.js** - Markdown parsing and rendering
- **Google Fonts** - Inter font family

### Browser Compatibility

- **Recommended**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Required**: ES6 module support, CSS Grid, Flexbox

### Performance

- **Lazy loading**: Recipes loaded on demand
- **Optimized queries**: Uses Firestore orderBy for sorted lists
- **Efficient updates**: Only saves changed data
- **Image optimization**: Firebase Storage CDN for fast delivery

---

## Security

### Authentication

Currently, the editor does not require authentication. For production use, consider:

1. Enabling Firebase Authentication
2. Adding auth checks in onAuthStateChanged
3. Requiring sign-in before allowing edits
4. Setting up Firestore security rules

### Data Validation

- Client-side validation for required fields
- Slug pattern validation (lowercase, hyphens only)
- URL format validation for links and images

### Recommended Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{projectId}/public/data/recipes/{recipeId} {
      // Anyone can read
      allow read: if true;

      // Only authenticated users can write
      allow write: if request.auth != null;
    }
  }
}
```

---

## Future Enhancements

Potential improvements for the recipe editor:

- [ ] Drag-and-drop reordering for ingredients/instructions
- [ ] Bulk import from CSV/JSON
- [ ] Recipe duplication
- [ ] Revision history
- [ ] Multi-image support (gallery)
- [ ] Nutrition information fields
- [ ] Tags/keywords for better search
- [ ] Recipe rating/difficulty
- [ ] Cooking mode (step-by-step view)
- [ ] Print recipe from editor
- [ ] Export to PDF
- [ ] Share recipe link
- [ ] Image cropping/editing
- [ ] Ingredient autocomplete
- [ ] Recipe validation (completeness check)

---

## Support

For issues or questions:

1. Check this documentation
2. Check browser console for errors
3. Verify Firebase Console for data
4. Review CLAUDE.md for site architecture
5. Check Firebase SDK documentation

---

## Changelog

### Version 1.0.0 (2025-12-28)

**Initial Release**
- ✨ Complete field coverage for all recipe data
- ✨ Split-pane editor with live preview
- ✨ Image upload to Firebase Storage
- ✨ Markdown support with live rendering
- ✨ Auto-slug generation
- ✨ Recipe list management
- ✨ Dark mode support
- ✨ Responsive design
- ✨ CRUD operations (Create, Read, Update, Delete)
- ✨ Real-time Firebase integration
- ✨ Form validation
- ✨ Success/error notifications
- ✨ Loading states

---

**Last Updated**: 2025-12-28
**Version**: 1.0.0
**Maintained by**: Claude Code
**File Location**: `/admin/recipe-editor.html`

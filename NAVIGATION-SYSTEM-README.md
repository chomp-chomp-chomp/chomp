# Automated Navigation System

## Problem Solved
No more updating 9+ pages every time you add a new tool or page to the dropdown menus!

## How It Works

### 1. Central Configuration
All navigation links are now stored in **`navigation.json`**. This single file controls the entire site's navigation.

### 2. Automatic Menu Generation
The **`navigation.js`** script automatically:
- Fetches navigation.json
- Builds the dropdown menus dynamically
- Highlights the current active page
- Works on all pages with zero code duplication

### 3. How to Add a New Tool

**Before (The Old Way):**
- Edit index.html
- Edit recipes.html
- Edit about.html
- Edit stories.html
- Edit lexicon.html
- Edit reading-list.html
- Edit post.html
- Edit recipe.html
- Edit store.html
- (9 files to update!)

**Now (The New Way):**
1. Open `navigation.json`
2. Add one line to the "Tools" dropdown:
   ```json
   { "label": "My New Tool", "url": "tools/mynew tool.html" }
   ```
3. Done! All pages automatically updated.

## Implementation

### For Each Page HTML File:

1. **Remove the old hardcoded menu** from inside `<ul class="tools-dropdown-menu" id="toolsDropdown">`:

**OLD (Delete this):**
```html
<ul class="tools-dropdown-menu" id="toolsDropdown">
  <li><a href="index.html">Home</a></li>
  <li class="menu-item-has-submenu">
    <a href="#">Content</a>
    <ul class="submenu">
      <li><a href="stories.html">Stories</a></li>
      <!-- ...etc... -->
    </ul>
  </li>
  <!-- ...etc... -->
</ul>
```

2. **Replace with empty container** (navigation.js will fill it):

**NEW:**
```html
<ul class="tools-dropdown-menu" id="toolsDropdown">
  <!-- Navigation menu loaded dynamically by navigation.js -->
</ul>
```

3. **Add script before closing `</body>` tag:**

```html
  <!-- Dynamic Navigation System -->
  <script src="/navigation.js"></script>

  <!-- Keep existing navigation toggle script -->
  <script>
    function toggleToolsDropdown() {
      const dropdown = document.getElementById('toolsDropdown');
      dropdown.classList.toggle('active');
    }
  </script>
</body>
```

## Files Updated
- ✅ `navigation.json` - Single source of truth for all navigation
- ✅ `navigation.js` - Automatic menu builder

## Example: Adding a New Tool

```json
{
  "label": "Tools",
  "type": "dropdown",
  "items": [
    { "label": "Index", "url": "tools/index.html" },
    { "label": "Color", "url": "tools/color.html" },
    { "label": "Convert", "url": "tools/convert.html" },
    { "label": "NEW TOOL HERE", "url": "tools/newtool.html" }, ← Add this line
    { "label": "Currency", "url": "tools/currency.html" },
    ...
  ]
}
```

Save the file, refresh any page, and the new tool appears in ALL dropdown menus automatically!

## Benefits
- ✅ Update once, deploy everywhere
- ✅ No more forgetting to update a page
- ✅ Consistent navigation across the entire site
- ✅ Easy to reorganize or rename items
- ✅ Works with existing CSS and structure
- ✅ Gracefully degrades if JavaScript is disabled (empty menu)

## Maintenance
Just edit `/navigation.json` - that's it!

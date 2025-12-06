# CLAUDE.md - AI Assistant Guide for Chomp Recipes

## Project Overview

**Chomp Recipes** is a static web application for displaying and managing baking recipes and culinary rituals. The site features a philosophical approach to baking with a manifesto-driven design.

- **Live Site**: https://chomp.be
- **Project Type**: Static HTML/CSS/JavaScript website with Firebase backend
- **Primary Purpose**: Recipe collection and sharing platform
- **Design Philosophy**: "Baking is the materialization of comfort itself"

---

## Technology Stack

### Frontend
- **HTML5/CSS3/JavaScript** - Vanilla JavaScript (ES6 modules), no framework
- **Styling**: Custom CSS with responsive design
  - Primary font: Inter (sans-serif)
  - Accent color: `#e73b42` (red)
  - Dark mode: Espresso theme (`#231f1f` background, `#ff6b7a` accents)
  - Mobile breakpoint: 768px
- **Layout Pattern**: Sidebar + content area (desktop), single column (mobile)

### Backend & Data
- **Firebase**:
  - Firestore: Recipe data storage
  - Firebase Auth: User authentication (optional, anonymous browsing supported)
  - Firebase Storage: Recipe images
  - Real-time listeners for live data updates
- **Data Storage Path**: `artifacts/${projectId}/public/data/recipes`

### Content Management
- **Decap CMS** (formerly Netlify CMS):
  - Located in `/admin` directory
  - Auth0 authentication for editors
  - Git-based workflow (commits directly to repository)
  - Configured via `admin/config.yml`

---

## Repository Structure

```
/
├── index.html              # Main application (primary file)
├── dark.html               # Dark mode variant (WIP)
├── grid.html               # Grid-only view variant (WIP)
├── in_progress.html        # Development version
├── progress1.html          # Development version
├── recipe-admin-secure.html # Admin interface (gitignored)
├── CNAME                   # Custom domain config
├── .gitignore              # Git ignore rules
├── admin/
│   ├── index.html          # Decap CMS entry point
│   └── config.yml          # CMS configuration
└── images/                 # Recipe images and assets
    ├── README.md           # Empty placeholder
    ├── chomp_recipes_logo.jpeg
    ├── Chomp Chomp logos.jpeg
    └── *.jpg               # Recipe photos
```

### Key Files

| File | Purpose | Notes |
|------|---------|-------|
| `index.html` | Main application | **Primary file** - ~1700 lines, contains all app logic |
| `admin/config.yml` | CMS configuration | Auth0 + backend settings |
| `recipe-admin-secure.html` | Secure admin panel | Gitignored (contains sensitive keys) |
| `.gitignore` | Version control exclusions | Ignores admin files with API keys, .env files |

---

## Application Architecture

### Main Application (`index.html`)

The entire application is a **single-page application** contained in one HTML file with:

1. **HTML Structure**:
   - Sidebar: Recipe list, search, sort controls
   - Content area: Home/manifesto, grid view, or individual recipe
   - Floating navigation icon (mobile)

2. **CSS Sections** (embedded `<style>`):
   - Base styles & layout
   - Search, sort & list items
   - Recipe content & home view
   - Grid view styles & controls
   - Media queries (mobile, print, dark mode)

3. **JavaScript Module** (embedded `<script type="module">`):
   - Firebase initialization and real-time listeners
   - Recipe data management
   - View rendering (home, grid, detail)
   - Search, filter, sort functionality
   - Markdown parsing
   - URL routing via hash navigation

### Data Model (Recipe Object)

```javascript
{
  title: string,           // Required
  slug: string,            // Auto-generated from title
  description: string,     // Markdown supported
  image: string,           // Path or Firebase Storage URL
  servings: string,
  prepTime: string,        // e.g., "20min"
  cookTime: string,        // e.g., "65-80 minutes"
  totalTime: string,
  source: string | object, // Plain text or {text, href} object
  category: string,        // e.g., "chomp chomp"
  ingredients: string[],   // Array of strings (Markdown supported)
  instructions: string[],  // Array of strings (Markdown supported)
  notes: string,           // Markdown supported
  totalTimeInMinutes: number, // Computed field
  dishType: string         // Auto-assigned based on title
}
```

### Navigation & Routing

**Hash-based routing**:
- `#home` or no hash → Manifesto/home view
- `#grid` → All recipes grid view
- `#recipe-{slug}` → Individual recipe view
- `?slug={slug}` → Permalink to specific recipe

**View Hierarchy**:
1. Home/Manifesto (default)
2. Grid View (all recipes with filters)
3. Recipe Detail View (individual recipe)

---

## Key Features & Components

### 1. Recipe Listing (Sidebar)
- Real-time sync with Firestore
- Search functionality (title, description, ingredients)
- Sort options: A-Z, Newest, Quickest Time
- Scrollable with fade effect
- Active recipe highlighting

### 2. Grid View
- Card-based layout (responsive grid)
- Filters: Category, Dish Type
- Search across all recipe fields
- Pagination (15 recipes per page)
- "Load More" infinite scroll
- Sticky filter state

### 3. Recipe Detail View
- Full recipe display with sections:
  - Header (title, metadata, actions)
  - Description
  - Image (if available)
  - Ingredients (with red accent bar)
  - Instructions (numbered steps)
  - Notes (gray box)
- Print button (hides navigation/UI)
- Copy permalink button
- Logo link (returns to grid)

### 4. Markdown Support

Custom markdown parser supports:
- Headers: `#`, `##`, `###`
- Links: `[text](url)`
- Bold: `**text**`
- Italic: `*text*`
- Complex objects: `{text, href}` for source links

### 5. Responsive Design

**Desktop (>768px)**:
- Sidebar visible
- Full layout with recipe content area
- Grid: Multi-column cards

**Mobile (≤768px)**:
- Sidebar hidden
- Header logo clickable (returns to home)
- Single column layout
- Floating navigation icon
- Grid: Single column cards

### 6. Dark Mode

Automatic via `@media (prefers-color-scheme: dark)`:
- Espresso color palette
- Background: `#231f1f`
- Accent: `#ff6b7a` (adjusted red)
- Text: `#d9d4d4`

---

## Development Workflows

### Making Changes to the Site

1. **Edit HTML/CSS/JS**:
   - All code is in `index.html` (or variant files)
   - Edit directly in file
   - Test locally by opening in browser

2. **Adding/Editing Recipes**:
   - **Option A**: Use Decap CMS at `/admin`
     - Requires Auth0 authentication
     - Git-based, commits directly to repo
   - **Option B**: Directly edit Firestore
     - Use Firebase Console
     - Faster for bulk operations
   - **Option C**: Use `recipe-admin-secure.html`
     - Requires Firebase credentials

3. **Adding Images**:
   - Upload to `/images` directory OR
   - Upload to Firebase Storage
   - Reference in recipe data:
     - Local: `images/filename.jpg`
     - Remote: Full Firebase Storage URL

### Git Workflow

**Current branch**: `claude/claude-md-migpu35mvu26x1q1-01EGsuwfTbt1JmZmGQGVteA2`

**Standard workflow**:
```bash
# Make changes to files
git add .
git commit -m "Descriptive message"
git push -u origin claude/claude-md-migpu35mvu26x1q1-01EGsuwfTbt1JmZmGQGVteA2
```

**Important**:
- Branch must start with `claude/` and end with session ID
- Push with `-u origin <branch-name>` format
- Retry on network failures (up to 4 times with exponential backoff)

### Testing Changes

**Local testing**:
- Open `index.html` in browser
- Check responsive design (DevTools mobile view)
- Test Firebase connection (requires internet)

**Important test cases**:
1. Recipe search and filtering
2. Grid view pagination
3. Recipe detail view rendering
4. Mobile responsive layout
5. Dark mode appearance
6. Print functionality
7. Permalink copying

---

## Code Conventions & Best Practices

### JavaScript Style

1. **ES6 Modules**: Use `import` statements for Firebase
2. **Arrow Functions**: Preferred for callbacks
3. **Template Literals**: Use for HTML generation
4. **Async/Await**: Use for Firebase operations
5. **Array Methods**: `.map()`, `.filter()`, `.forEach()` over loops

### HTML/CSS Patterns

1. **Inline Styles**: All CSS in `<style>` tag (no external files)
2. **BEM-like Naming**: `.recipe-item`, `.recipe-content`, `.card-title`
3. **Utility Classes**: Minimal - prefer semantic class names
4. **Responsive**: Mobile-first approach with `@media` queries

### Firebase Patterns

1. **Real-time Listeners**: Use `onSnapshot` for live updates
2. **Error Handling**: Always include error callbacks
3. **Data Validation**: Check types and parse JSON strings safely
4. **Security**: Firebase config in client (public, read-only data)

### Markdown Parsing

- **Headers in Lists**: Ingredients/instructions can contain headers
- **Link Objects**: Support both string and `{text, href}` format
- **Safe Parsing**: Check if string is JSON before parsing
- **Array Handling**: Safely handle arrays, objects, and strings

---

## Important Implementation Details

### 1. Slug Generation
```javascript
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}
```

### 2. Time Parsing
Parses various time formats:
- `"20min"` → 20 minutes
- `"2h 30min"` → 150 minutes
- `"65-80 minutes"` → 65 minutes (uses lower bound)

### 3. Dish Type Assignment
Auto-categorizes based on title keywords:
- `cake`, `torte`, `pie`, `brûlée` → Dessert/Pastry
- `cookie`, `cookies` → Cookie/Bar
- `custard` → Frozen Dessert
- `pudding` → Pudding/Cream
- `taco`, `main dish` → Main Dish
- `soup` → Soup
- Default → Other Baked Goods

### 4. Firebase Collection Path
Dynamic based on project ID:
```javascript
`artifacts/${appId}/public/data/recipes`
```

### 5. Image Handling
Supports both local and remote images:
```javascript
const imagePath = recipe.image.startsWith('http')
  ? recipe.image
  : `images/${recipe.image}`;
```

---

## Security Considerations

### Public Information
- Firebase config (API keys) are public read-only credentials
- No sensitive data stored in client-side code
- Firestore security rules enforce read-only access

### Gitignored Files
```
recipe-admin*.html    # Contains Firebase admin credentials
.env                  # Environment variables
.env.local           # Local environment overrides
```

### Authentication
- **Public Site**: No auth required for viewing
- **Admin Panel**: Auth0 authentication required
- **Decap CMS**: Auth0 OAuth flow

---

## Styling Guidelines

### Color Palette

**Light Mode**:
- Background: `#fdfdfd`
- Text: `#353535`
- Accent: `#e73b42` (primary red)
- Sidebar: `#f5f5f5`
- Borders: `#e0e0e0`

**Dark Mode** (Espresso Theme):
- Background: `#231f1f`
- Text: `#d9d4d4`
- Accent: `#ff6b7a` (lighter red)
- Sidebar: `#2b2626`
- Borders: `#3b3636`

### Typography
- Primary: `Inter` (300, 400, 500, 600 weights)
- Fallback: `Source Sans 3`
- Base line-height: 1.7
- Headings: 600 weight

### Spacing
- Content padding: 40px 50px (desktop)
- Content padding: 20px (mobile)
- Section margins: 25px between elements
- Sidebar width: 300px (desktop)

---

## Common Tasks for AI Assistants

### Task 1: Adding a New Recipe Feature
1. Locate relevant section in `index.html`
2. Update data model if needed (check Firebase structure)
3. Update `selectRecipe()` function for detail view
4. Update `renderCards()` for grid view
5. Update `admin/config.yml` if CMS needs new field
6. Test on both desktop and mobile

### Task 2: Fixing Styling Issues
1. Locate CSS section in `<style>` tag
2. Check for mobile-specific styles in `@media (max-width: 768px)`
3. Check for dark mode styles in `@media (prefers-color-scheme: dark)`
4. Test across viewports and color schemes
5. Ensure print styles work correctly

### Task 3: Updating Search/Filter Logic
1. Find `filterAndSortGrid()` function (line ~1475)
2. Update filter logic
3. Update `displayRecipeList()` for sidebar search
4. Test with various search terms and filters
5. Ensure "Clear Filters" button resets correctly

### Task 4: Modifying Firebase Integration
1. Locate Firebase config (line ~887)
2. Update collection path in `getRecipesCollectionPath()`
3. Modify `setupRecipeListener()` for data sync
4. Update data parsing in snapshot callback
5. Test real-time updates

### Task 5: Adjusting Mobile Experience
1. Locate mobile media query (line ~512)
2. Update responsive styles
3. Test floating navigation icon behavior
4. Check sidebar hiding/showing logic
5. Verify header logo clickability

---

## Debugging Tips

### Common Issues

**Issue: Recipes not loading**
- Check Firebase config (projectId, apiKey)
- Verify Firestore collection path
- Check browser console for errors
- Ensure internet connectivity

**Issue: Images not displaying**
- Verify image path format (local vs. Firebase Storage)
- Check image exists in `/images` directory
- Verify Firebase Storage CORS settings
- Check image URL format in data

**Issue: Search/filter not working**
- Verify `recipes` array is populated
- Check filter state in `savedGridFilters`
- Ensure event listeners are attached
- Check for JavaScript errors in console

**Issue: Mobile layout broken**
- Check viewport meta tag
- Verify media query breakpoint (768px)
- Test sidebar display logic
- Check floating icon positioning

**Issue: Dark mode not working**
- Verify browser supports `prefers-color-scheme`
- Check dark mode CSS rules
- Test in different browsers
- Verify color values are correct

---

## Performance Considerations

1. **Firebase Listeners**: Only one real-time listener for all recipes
2. **Pagination**: Grid view loads 15 recipes at a time
3. **Image Loading**: Lazy load images for better performance
4. **CSS**: All styles inline (no external stylesheet requests)
5. **JavaScript**: Single module bundle (no code splitting needed)

---

## Future Enhancements (Potential)

Based on the codebase structure, consider these when making improvements:

1. **Recipe Rating System** (commented out in current version)
2. **User Accounts** (Firebase Auth infrastructure present)
3. **Recipe Collections/Favorites** (requires user auth)
4. **Social Sharing** (Open Graph tags already present)
5. **Recipe Comments/Reviews**
6. **Advanced Search** (by ingredient exclusion, dietary restrictions)
7. **Unit Conversion** (metric/imperial)
8. **Recipe Scaling** (adjust serving sizes)

---

## Contact & Related Projects

- **Email**: hi@chomp.be
- **Main Site**: https://www.chomp.ltd
- **Tools**: https://chomp.be/tools

---

## Quick Reference

### Important Line Numbers in `index.html`

| Feature | Approximate Line |
|---------|------------------|
| Firebase Config | 887 |
| Recipe Data Model | 939 |
| Markdown Parser | 1015 |
| Search Box Listener | 1654 |
| Grid Filter Logic | 1475 |
| Recipe Detail Render | 1319 |
| Home/Manifesto Content | 1132 |
| Mobile Media Query | 512 |
| Dark Mode Styles | 640 |
| Print Styles | 617 |

### Key Functions

- `setupRecipeListener()` - Initializes Firebase real-time sync
- `displayRecipeList()` - Renders sidebar recipe list
- `displayGridPage()` - Renders grid view
- `selectRecipe()` - Displays individual recipe
- `filterAndSortGrid()` - Handles filtering/sorting logic
- `parseMarkdown()` - Converts markdown to HTML
- `resetRecipeView()` - Returns to home/manifesto view

---

## Development Checklist

When making changes, ensure:

- [ ] Changes work on desktop (>768px)
- [ ] Changes work on mobile (≤768px)
- [ ] Dark mode styling is correct
- [ ] Print view is not broken
- [ ] Search/filter functionality works
- [ ] Firebase connection is maintained
- [ ] No console errors
- [ ] Markdown rendering works
- [ ] Images load correctly
- [ ] Navigation (hash routing) works
- [ ] Permalink generation works
- [ ] Git commit message is descriptive
- [ ] Changes pushed to correct branch

---

**Last Updated**: 2025-11-27
**Document Version**: 1.0
**Repository**: chomp-chomp-pachewy/recipes

# CLAUDE.md - AI Assistant Guide for Chomp Chomp

## Project Overview

**Chomp Chomp** is a multi-page static website combining recipes, stories, tools, and a store. The site features a philosophical approach to baking and culinary culture with the tagline "Baking is the materialization of comfort itself."

- **Live Site**: https://chompchomp.cc
- **Project Type**: Multi-page static HTML/CSS/JavaScript website with Firebase backend
- **Primary Purpose**: Recipe collection, blog/stories, culinary lexicon, and web tools
- **Design Philosophy**: Philosophical depth meets practical baking

---

## Technology Stack

### Frontend
- **HTML5/CSS3/JavaScript** - Vanilla JavaScript (ES6 modules), no framework
- **Styling**:
  - Shared `styles.css` across all pages
  - CSS variables for theming
  - Primary font: Inter (300, 400, 500, 600 weights)
  - Fallback: Source Sans 3
  - Accent color: `#e73b42` (red)
  - Dark mode: Espresso theme (`#231f1f` background, `#ff6b7a` accents)
  - Mobile breakpoint: 768px
- **Layout Pattern**: Consistent navigation header across all pages

### Backend & Data
- **Firebase**:
  - Firestore: Storage for recipes, posts, lexicon entries, and reading list
  - Firebase Auth: Authentication for admin interfaces
  - Firebase Storage: Images and media files
  - Real-time listeners for live data updates
- **Collection Paths**:
  - Recipes: `artifacts/${projectId}/public/data/recipes`
  - Posts/Stories: `artifacts/${projectId}/public/data/posts`
  - Lexicon: `artifacts/${projectId}/public/data/lexicon`
  - Reading List: `artifacts/${projectId}/public/data/books`

### Content Management
- **Admin Interfaces** (gitignored):
  - `admin-content.html`: Unified admin for posts, lexicon, reading list
  - `recipe-admin*.html`: Recipe management
  - Various admin tools in `/admin` directory
- **Decap CMS**: Located in `/admin` directory with Auth0 authentication

---

## Site Architecture

### Page Structure

```
/
├── index.html              # Homepage (blog-style post grid)
├── recipes.html            # Recipe grid and search
├── recipe.html             # Individual recipe view
├── stories.html            # Stories/blog post listing
├── post.html               # Individual post view
├── lexicon.html            # Baking lexicon (dictionary)
├── reading-list.html       # Curated book recommendations
├── about.html              # About page and manifesto
├── store.html              # Store/shop page
├── styles.css              # Shared stylesheet (all pages)
├── CNAME                   # Custom domain config
├── .gitignore              # Git ignore rules
├── admin/                  # Decap CMS and admin tools
│   ├── index.html
│   ├── config.yml
│   ├── recipe-editor.html
│   ├── post-editor.html
│   └── image-manager.html
├── tools/                  # Web utility tools
│   ├── index.html          # Tools directory
│   ├── ip.html             # Whois/IP lookup
│   ├── weather.html        # Weather tool
│   ├── convert.html        # Unit conversions
│   ├── encode.html         # Encoding/decoding
│   ├── subnet.html         # Subnet calculator
│   ├── dante.html          # Dante's Inferno reference
│   ├── nautical.html       # Nautical reference
│   ├── philosophy.html     # Philosophy content
│   ├── baking.html         # Baking tools/calculators
│   └── css/                # Tool-specific styles
├── images/                 # Local image storage
│   ├── chomp_recipes_logo.jpeg
│   └── *.jpg               # Recipe and post images
├── functions/              # Firebase Cloud Functions
│   ├── index.js
│   └── package.json
└── temp/                   # Development/staging files
```

### Navigation Structure

All pages share a consistent header navigation:

```
Header:
  - Logo (links to store.html)
  - Center: Recipe banner (links to recipes.html)
  - Menu:
    - Home (index.html)
    - Content ▼
      - Stories (stories.html)
      - Recipes (recipes.html)
      - Lexicon (lexicon.html)
      - Reading List (reading-list.html)
    - About (about.html)
    - Store (store.html)
    - Tools ▼
      - Index (tools/index.html)
      - Whois (tools/ip.html)
      - Weather (tools/weather.html)
      - Convert (tools/convert.html)
      - Encode (tools/encode.html)
      - Subnet (tools/subnet.html)
      ... and more
```

---

## Data Models

### Recipe Object
```javascript
{
  title: string,              // Required
  slug: string,               // Auto-generated from title
  description: string,        // Markdown supported
  image: string,              // Path or Firebase Storage URL
  servings: string,
  prepTime: string,           // e.g., "20min"
  cookTime: string,           // e.g., "65-80 minutes"
  totalTime: string,
  source: string | object,    // Plain text or {text, href}
  category: string,           // e.g., "chomp chomp"
  ingredients: string[],      // Markdown supported
  instructions: string[],     // Markdown supported
  notes: string,              // Markdown supported
  totalTimeInMinutes: number, // Computed field
  dishType: string,           // Auto-assigned based on title
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Post/Story Object
```javascript
{
  title: string,              // Required
  slug: string,               // Auto-generated from title
  excerpt: string,            // Brief preview
  content: string,            // Full markdown content
  category: string,           // "stories", "anthropology", "mindfulness"
  status: string,             // "published" or "draft"
  date: string,               // YYYY-MM-DD
  featured_image: string,     // Optional Firebase Storage URL
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Lexicon Entry Object
```javascript
{
  term: string,               // Required (e.g., "Butter")
  definition: string,         // Markdown supported
  category: string,           // "ingredient", "technique", "equipment", "concept"
  slug: string,               // Auto-generated
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Book/Reading List Object
```javascript
{
  title: string,              // Required
  author: string,             // Required
  isbn: string,               // Optional
  description: string,        // Markdown supported
  category: string,           // "baking", "philosophy", "fiction", etc.
  coverImage: string,         // Optional URL
  link: string,               // Purchase/info link
  created_at: Timestamp,
  updated_at: Timestamp
}
```

---

## Key Features by Section

### 1. Homepage (index.html)
- Blog-style post grid
- Category filtering (Stories, Anthropology, Mindfulness)
- Real-time sync with Firestore posts collection
- Responsive card layout
- Featured images
- Links to individual post pages

### 2. Recipes (recipes.html)
- Grid view of all recipes
- Search functionality (title, description, ingredients)
- Category filter (e.g., "chomp chomp")
- Dish type filter (Dessert/Pastry, Cookie/Bar, etc.)
- Sort options: A-Z, Newest, Quickest Time
- Card-based responsive layout
- Links to recipe.html with slug parameter

### 3. Individual Recipe (recipe.html)
- Full recipe display:
  - Title and metadata
  - Featured image
  - Description
  - Ingredients list
  - Step-by-step instructions
  - Notes section
- Print functionality
- Permalink copying
- Navigation back to recipes

### 4. Stories (stories.html)
- Similar to homepage but focused on story content
- Category filtering
- Post previews with excerpts
- Links to post.html

### 5. Individual Post (post.html)
- Full markdown-rendered content
- Featured image
- Category and date
- Typography optimized for reading
- Social sharing meta tags

### 6. Lexicon (lexicon.html)
- Dictionary-style layout
- Search and filter by category
- Alphabetical organization
- Expandable/collapsible entries
- Definitions with markdown formatting

### 7. Reading List (reading-list.html)
- Book recommendations
- Cover images
- Category filtering
- Links to purchase/more info
- Descriptions and context

### 8. Tools (tools/)
- Collection of utility tools:
  - **IP/Whois**: IP lookup and WHOIS information
  - **Weather**: Weather information
  - **Convert**: Unit conversions
  - **Encode**: Encoding/decoding utilities
  - **Subnet**: Network subnet calculator
  - **Dante**: Dante's Inferno reference
  - **Nautical**: Nautical terminology/tools
  - **Philosophy**: Philosophy-related content
  - **Baking**: Baking calculators/converters

### 9. Store (store.html)
- Store/shop interface
- Product listings
- Links and purchase information

---

## Styling System

### CSS Variables (styles.css)

```css
:root {
  /* Colors - Light Mode */
  --color-bg: #fdfdfd;
  --color-text: #353535;
  --color-text-muted: #666;
  --color-accent: #e73b42;
  --color-border: #e0e0e0;
  --color-sidebar: #f5f5f5;

  /* Spacing */
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 20px;
  --spacing-lg: 30px;
  --spacing-xl: 40px;

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-fallback: 'Source Sans 3', sans-serif;
  --line-height-body: 1.7;
  --line-height-heading: 1.3;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #231f1f;
    --color-text: #d9d4d4;
    --color-text-muted: #a0a0a0;
    --color-accent: #ff6b7a;
    --color-border: #3b3636;
    --color-sidebar: #2b2626;
  }
}
```

### Component Classes

Common classes across pages:
- `.site-header` - Main navigation header
- `.site-nav` - Navigation container
- `.nav-tools-dropdown` - Dropdown menu
- `.card` - Content card (posts, recipes)
- `.content-container` - Main content wrapper
- `.post-grid` - Grid layout for posts/recipes
- `.filter-controls` - Search and filter UI

---

## Development Workflows

### Making Changes

#### 1. Edit Site Content (HTML/CSS/JS)
- **Styling**: Edit `styles.css` for site-wide changes
- **Individual pages**: Edit specific HTML files
- **Navigation**: Update header in all relevant pages
- Test locally by opening HTML files in browser

#### 2. Adding/Editing Recipes
**Option A**: Use admin interface (recommended)
- Open `admin-content.html` or `recipe-admin-secure.html`
- Requires Firebase credentials
- Direct Firestore integration

**Option B**: Decap CMS
- Navigate to `/admin`
- Auth0 authentication required
- Git-based workflow

**Option C**: Firebase Console
- Direct Firestore editing
- Useful for bulk operations

#### 3. Adding/Editing Posts
- Use `admin-content.html` (Posts section)
- Set status to "published" or "draft"
- Add featured images via Firebase Storage
- Content supports full Markdown

#### 4. Managing Lexicon
- Use `admin-content.html` (Lexicon section)
- Categories: ingredient, technique, equipment, concept
- Definitions support Markdown

#### 5. Managing Reading List
- Use `admin-content.html` (Reading List section)
- Add book details, ISBNs, links
- Upload cover images to Firebase Storage

### Git Workflow

**Standard workflow**:
```bash
# Check current branch
git status

# Make changes to files
git add .

# Commit with descriptive message
git commit -m "Descriptive message"

# Push to origin
git push -u origin <branch-name>
```

**Important Git Rules**:
- Branch names must start with `claude/` for Claude-initiated work
- Use `-u origin <branch-name>` when pushing
- Retry on network failures (up to 4 times with exponential backoff: 2s, 4s, 8s, 16s)
- Never force push to main/master
- Descriptive commit messages required

### Testing Checklist

**Before committing changes**:
- [ ] Desktop view works (>768px)
- [ ] Mobile view works (≤768px)
- [ ] Dark mode styling correct
- [ ] Navigation links work
- [ ] Firebase connection maintained
- [ ] No console errors
- [ ] Images load correctly
- [ ] Search/filter functionality works
- [ ] Forms submit correctly
- [ ] Print styles work (if applicable)

---

## Firebase Integration

### Initialization Pattern

All Firebase-connected pages use this pattern:

```javascript
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, onSnapshot }
  from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "chomp-chomp-recipes",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dynamic collection path
const collectionPath = `artifacts/${firebaseConfig.projectId}/public/data/recipes`;
const recipesRef = collection(db, collectionPath);

// Real-time listener
onSnapshot(recipesRef, (snapshot) => {
  const data = [];
  snapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  renderData(data);
});
```

### Collection Paths

All collections use the dynamic path pattern:
```
artifacts/${projectId}/public/data/${collectionName}
```

Collections:
- `recipes` - Recipe data
- `posts` - Blog posts/stories
- `lexicon` - Lexicon entries
- `books` - Reading list items

---

## Security Considerations

### Public Information
- Firebase config (API keys) are public read-only credentials
- No sensitive data in client-side code
- Firestore security rules enforce read-only access for public
- Write access requires authentication

### Gitignored Files

```gitignore
# Environment files
.env
.env.local
.env.yaml

# Admin tools with sensitive credentials
recipe-admin*.html
content-admin*.html

# Data files (used for bulk import)
data-*.txt
```

### Authentication
- **Public Site**: No auth required for viewing
- **Admin Interfaces**: Firebase Auth required
- **Decap CMS**: Auth0 OAuth flow

---

## Common Tasks for AI Assistants

### Task 1: Add a New Page
1. Create new HTML file in root directory
2. Copy header navigation from existing page
3. Link to `styles.css`
4. Add page to navigation menu in all other pages
5. Test navigation flow
6. Ensure mobile responsive

### Task 2: Update Site-Wide Navigation
1. Edit header in all main pages:
   - `index.html`
   - `recipes.html`
   - `recipe.html`
   - `stories.html`
   - `post.html`
   - `lexicon.html`
   - `reading-list.html`
   - `about.html`
   - `store.html`
2. Test dropdown menus
3. Verify mobile menu toggle

### Task 3: Add New Content Type
1. Define data model (see examples above)
2. Create Firestore collection
3. Update `admin-content.html` with new section
4. Create listing page (like recipes.html or stories.html)
5. Create detail page (like recipe.html or post.html)
6. Add to navigation
7. Test CRUD operations

### Task 4: Modify Styling
1. Edit `styles.css` for global changes
2. Use CSS variables for consistency
3. Test in light and dark modes
4. Check mobile breakpoints
5. Verify across all pages

### Task 5: Add New Tool
1. Create new HTML file in `tools/` directory
2. Link to shared `styles.css` or tool-specific CSS
3. Implement tool functionality
4. Add to `tools/index.html` directory listing
5. Add to main navigation dropdown
6. Test standalone and within site

---

## Debugging Tips

### Common Issues

**Firebase not connecting:**
- Check browser console for errors
- Verify Firebase config in page
- Ensure internet connectivity
- Check Firestore collection path
- Verify security rules

**Images not displaying:**
- Check Firebase Storage CORS settings
- Verify image URL format
- Test local vs. remote image paths
- Check file exists in `/images` directory

**Navigation broken:**
- Verify all pages have consistent header HTML
- Check JavaScript for dropdown functionality
- Test mobile menu toggle
- Verify link paths (relative vs. absolute)

**Styling inconsistent:**
- Ensure `styles.css` linked in all pages
- Check for inline styles overriding
- Verify CSS variable usage
- Test dark mode media query

**Content not appearing:**
- Check Firestore collection path
- Verify document structure matches data model
- Check for JavaScript errors
- Verify real-time listener setup
- Check `status: "published"` for posts

---

## Performance Considerations

1. **Firebase**: Real-time listeners for live updates
2. **Images**: Use Firebase Storage CDN for faster loading
3. **CSS**: Single shared stylesheet reduces requests
4. **JavaScript**: Vanilla JS, no framework overhead
5. **Caching**: Leverage browser caching for static assets
6. **Lazy Loading**: Consider for images in long lists

---

## Project Philosophy

### Design Principles

1. **Clarity over complexity** - Simple, readable code
2. **Consistency** - Shared navigation and styling
3. **Accessibility** - Semantic HTML, readable fonts
4. **Mobile-first** - Responsive at all breakpoints
5. **Content-focused** - Typography and readability prioritized
6. **Philosophical depth** - Meaningful content over trends

### Content Guidelines

- **Recipes**: Focus on technique and ritual, not just ingredients
- **Stories**: Personal, reflective, philosophical
- **Lexicon**: Thoughtful definitions that go beyond the literal
- **Reading List**: Curated with intention and context
- **Tools**: Practical utilities that serve a clear purpose

---

## File Organization Best Practices

### HTML Files
- Root level: Main pages (index, recipes, about, etc.)
- `/admin`: Administrative interfaces
- `/tools`: Utility tools and calculators
- `/temp`: Development and staging work

### CSS
- `styles.css` - Primary shared stylesheet
- `tools/css/` - Tool-specific styles when needed
- Use CSS variables for theming
- Keep dark mode styles in media queries

### JavaScript
- Inline `<script type="module">` for Firebase pages
- Separate JS files for complex tools
- ES6 modules for Firebase imports

### Images
- `/images` - Local images (logos, static assets)
- Firebase Storage - User-uploaded content (recipes, posts)
- Organized by content type in Storage

---

## Quick Reference

### Important Files

| File | Purpose | Firebase |
|------|---------|----------|
| `index.html` | Homepage (blog posts) | ✓ |
| `recipes.html` | Recipe grid | ✓ |
| `recipe.html` | Individual recipe | ✓ |
| `stories.html` | Story listing | ✓ |
| `post.html` | Individual post | ✓ |
| `lexicon.html` | Baking dictionary | ✓ |
| `reading-list.html` | Book recommendations | ✓ |
| `about.html` | About and manifesto | ✗ |
| `store.html` | Store page | ✗ |
| `styles.css` | Shared stylesheet | ✗ |
| `admin-content.html` | Admin interface | ✓ (gitignored) |

### Key URLs

- **Production**: https://chompchomp.cc
- **Recipes**: https://chompchomp.cc/recipes.html
- **Stories**: https://chompchomp.cc/stories.html
- **Tools**: https://chompchomp.cc/tools/
- **Admin**: Open locally (gitignored)

### Contact & Related

- **Email**: hey@chompchomp.cc
- **Main Site**: https://www.chomp.ltd
- **Tools**: https://chompchomp.cc/tools

---

## Future Enhancement Ideas

Based on current structure, consider:

1. **Recipe Collections** - User-created recipe collections
2. **Comments System** - Commenting on posts/recipes
3. **Newsletter** - Email subscription system
4. **RSS Feed** - For blog posts
5. **Recipe Ratings** - User ratings and reviews
6. **Search Across Site** - Global search for all content types
7. **Recipe Scaling** - Automatic ingredient scaling
8. **Print Recipes** - Optimized print layouts
9. **Social Sharing** - Enhanced social media integration
10. **Progressive Web App** - Offline functionality

---

## Development Checklist Template

When making significant changes:

```markdown
## Change Description
[Brief description of what was changed]

## Files Modified
- [ ] index.html
- [ ] recipes.html
- [ ] styles.css
- [ ] Other: ___________

## Testing Completed
- [ ] Desktop view (>768px)
- [ ] Mobile view (≤768px)
- [ ] Dark mode
- [ ] Navigation works
- [ ] Firebase connection
- [ ] No console errors
- [ ] Images load
- [ ] Search/filter works
- [ ] Cross-browser tested

## Deployment
- [ ] Changes committed
- [ ] Pushed to branch
- [ ] Tested on live site
- [ ] Verified CNAME
- [ ] Cache cleared
```

---

**Last Updated**: 2025-12-18
**Document Version**: 2.0
**Repository**: chomp-chomp-pachewy/chomp
**Primary Branch**: main

---

## Notes for AI Assistants

- This is a **multi-page static site**, not a single-page application
- **Firebase** is used for dynamic content, but pages are static HTML
- **Shared navigation** must be updated across all pages when changed
- **CSS variables** in styles.css control theming - use them!
- **Mobile responsiveness** is critical - always test at 768px breakpoint
- **Dark mode** is automatic via `prefers-color-scheme` - test it
- **Admin files** are gitignored - never commit files with credentials
- **Content structure** follows specific data models - reference them
- The site combines **practical tools** with **philosophical content** - maintain this balance

When in doubt, prioritize:
1. Consistency across pages
2. Mobile responsiveness
3. Dark mode compatibility
4. Semantic HTML
5. Clear, readable code

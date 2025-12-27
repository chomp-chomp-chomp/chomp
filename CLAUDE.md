# CLAUDE.md - AI Assistant Guide for Chomp Chomp

## Project Overview

**Chomp Chomp** is a multi-page static website combining recipes, stories, tools, playlists, and a store. The site features a philosophical approach to baking and culinary culture with the tagline "Baking is the materialization of comfort itself."

- **Live Site**: https://chompchomp.cc
- **Project Type**: Multi-page static HTML/CSS/JavaScript website with Firebase backend
- **Primary Purpose**: Recipe collection, blog/stories, culinary lexicon, music playlists, reading recommendations, and web tools
- **Design Philosophy**: Philosophical depth meets practical baking, blending theory with practice

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
  - Firestore: Storage for recipes, posts, lexicon entries, reading list, and playlists
  - Firebase Auth: Authentication for admin interfaces
  - Firebase Storage: Images and media files
  - Firebase Functions: Cloud Functions for API proxying (Gemini AI chat)
  - Real-time listeners for live data updates
- **Collection Paths**:
  - Recipes: `artifacts/${projectId}/public/data/recipes`
  - Posts/Stories: `artifacts/${projectId}/public/data/posts`
  - Lexicon: `artifacts/${projectId}/public/data/lexicon`
  - Reading List: `artifacts/${projectId}/public/data/books`
  - Playlists: `artifacts/${projectId}/public/data/playlists`

### Content Management
- **Admin Interfaces** (gitignored):
  - `admin-content.html`: Unified admin for posts, lexicon, reading list
  - `recipe-admin*.html`: Recipe management
  - Various admin tools in `/admin` directory
- **Decap CMS / Sveltia CMS**: Located in `/admin` directory with GitHub OAuth authentication
  - Enhanced with one-click GitHub publishing
  - Dark theme support
  - Mobile-responsive design
  - ISBN import functionality for reading list

### CI/CD
- **GitHub Actions**: Automated deployment via `.github/workflows/firebase-deploy.yml`
  - Deploys on push to main branch
  - Handles Firebase Functions and Hosting
  - Sets up Gemini API keys and service accounts
  - Runs on Node.js 20

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
├── playlists.html          # Music playlists for baking (NEW)
├── playlist.html           # Individual playlist view (NEW)
├── about.html              # About page and manifesto
├── store.html              # Store/shop page
├── store/
│   └── order.html          # Order processing page (NEW)
├── styles.css              # Shared stylesheet (all pages)
├── CNAME                   # Custom domain config
├── .gitignore              # Git ignore rules
├── .github/
│   └── workflows/
│       └── firebase-deploy.yml  # CI/CD workflow (NEW)
├── admin/                  # Decap/Sveltia CMS
│   ├── index.html
│   ├── config.yml
│   ├── ENHANCED-CMS-README.md
│   └── SIMPLE-EDITOR-README.md
├── tools/                  # Web utility tools
│   ├── index.html          # Tools directory
│   ├── ip.html             # Whois/IP lookup
│   ├── weather.html        # Weather tool
│   ├── convert.html        # Unit conversions
│   ├── encode.html         # Encoding/decoding
│   ├── encrypt.html        # Encryption tool
│   ├── subnet.html         # Subnet calculator
│   ├── dante.html          # Dante's Inferno reference
│   ├── inferno.html        # Inferno reference (alt)
│   ├── nautical.html       # Nautical reference
│   ├── philosophy.html     # Philosophy content
│   ├── baking.html         # Baking tools/calculators
│   └── chomp.html          # Chomp-specific tools
├── images/                 # Local image storage
│   ├── chomp_recipes_logo.jpeg
│   └── *.jpg               # Recipe and post images
├── functions/              # Firebase Cloud Functions (NEW)
│   ├── index.js            # Gemini API chat proxy
│   ├── package.json
│   └── .env.yaml           # Environment config (gitignored)
├── data/                   # JSON exports for backup (NEW)
│   ├── recipes.json
│   ├── posts.json
│   ├── lexicon.json
│   ├── books.json
│   ├── playlists.json
│   ├── reading-list.json
│   └── *.json.example      # Example data structures
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
      - Playlists (playlists.html) [NEW]
    - About (about.html)
    - Store (store.html)
    - Tools ▼
      - Index (tools/index.html)
      - Whois (tools/ip.html)
      - Weather (tools/weather.html)
      - Convert (tools/convert.html)
      - Encode (tools/encode.html)
      - Encrypt (tools/encrypt.html)
      - Subnet (tools/subnet.html)
      - Dante/Inferno (tools/dante.html)
      - Nautical (tools/nautical.html)
      - Philosophy (tools/philosophy.html)
      - Baking (tools/baking.html)
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
  image: string,              // Path or Firebase Storage URL / Cloudinary URL
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
  isbn: string,               // Optional (supports ISBN import)
  description: string,        // Markdown supported
  category: string,           // "baking", "philosophy", "fiction", etc.
  subject: string,            // Optional subject classification
  callNumber: string,         // Optional library call number
  coverImage: string,         // Optional URL
  link: string,               // Purchase/info link (being phased out)
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Playlist Object (NEW)
```javascript
{
  id: string,                 // Unique identifier (slug)
  title: string,              // Required (e.g., "Laffy Taffy")
  description: string,        // Philosophical/contextual description
  tracks: string[],           // Array of track names "Artist - Song"
  moods: string[],           // Associated moods/feelings
  recipes: string[],         // Associated recipe slugs (optional)
  duration: string,          // "any", "short", "medium", "long"
  maxTime: number,           // Maximum time in minutes
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
- Modal-based book details (mobile-optimized with touchstart events)
- ISBN import support via CMS
- Descriptions and context
- Purchase links being phased out per project philosophy

### 8. Playlists (playlists.html) - NEW
- Curated music playlists for baking
- Filter by mood/feeling
- Filter by recipe pairing
- Duration-based filtering
- Card-based layout with track counts
- Links to individual playlist pages
- Philosophical descriptions connecting music to baking

### 9. Individual Playlist (playlist.html) - NEW
- Full track listing
- Associated moods and recipes
- Duration information
- Philosophical context
- Streaming service links (optional)

### 10. Tools (tools/)
- Collection of utility tools:
  - **IP/Whois**: IP lookup and WHOIS information
  - **Weather**: Weather information
  - **Convert**: Unit conversions
  - **Encode**: Encoding/decoding utilities
  - **Encrypt**: Encryption/decryption tools
  - **Subnet**: Network subnet calculator
  - **Dante/Inferno**: Dante's Inferno reference guides
  - **Nautical**: Nautical terminology/tools
  - **Philosophy**: Philosophy-related content
  - **Baking**: Baking calculators/converters
  - **Chomp**: Chomp-specific utilities

### 11. Store (store.html & store/order.html)
- Store/shop interface
- Product listings
- Order processing page
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
- `.card` - Content card (posts, recipes, playlists)
- `.content-container` - Main content wrapper
- `.post-grid` - Grid layout for posts/recipes/playlists
- `.filter-controls` - Search and filter UI
- `.modal` - Modal overlays (used in reading list)

### Mobile-First Design
- Touch-optimized: Uses `touchstart` events for mobile interactions
- Mobile modals: Proper event delegation for touch devices
- Responsive breakpoints at 768px
- Mobile menu toggle for navigation
- Optimized for both mouse and touch interactions

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

**Option B**: Decap/Sveltia CMS
- Navigate to `/admin`
- GitHub OAuth authentication required
- Git-based workflow with one-click publishing
- Enhanced with dark theme and mobile support

**Option C**: Firebase Console
- Direct Firestore editing
- Useful for bulk operations

#### 3. Adding/Editing Posts
- Use `admin-content.html` (Posts section)
- Or use Decap/Sveltia CMS at `/admin`
- Set status to "published" or "draft"
- Add featured images via Firebase Storage
- Content supports full Markdown

#### 4. Managing Lexicon
- Use `admin-content.html` (Lexicon section)
- Categories: ingredient, technique, equipment, concept
- Definitions support Markdown

#### 5. Managing Reading List
- Use `admin-content.html` (Reading List section)
- Or use Decap/Sveltia CMS with ISBN import feature
- Add book details, ISBNs, subjects, call numbers
- Upload cover images to Firebase Storage
- Purchase links being phased out

#### 6. Managing Playlists (NEW)
- Use `admin-content.html` (Playlists section)
- Or use Decap/Sveltia CMS at `/admin`
- Add track listings, moods, recipe pairings
- Write philosophical descriptions
- Set duration and associated metadata

#### 7. Working with Firebase Functions
- Functions located in `/functions` directory
- Main function: Gemini API chat proxy
- Local development: Use `.env` file (gitignored)
- Deploy via Firebase CLI or GitHub Actions
- Configure environment variables via `functions/.env.yaml`

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
- GitHub Actions will auto-deploy on push to main

### CI/CD Workflow

**Automated Deployment**:
- GitHub Actions workflow: `.github/workflows/firebase-deploy.yml`
- Triggers on push to `main` branch
- Deploys both Firebase Functions and Hosting
- Sets up environment variables (Gemini API key)
- Uses service account authentication
- Can also be triggered manually via workflow_dispatch

**Manual Deployment**:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy functions and hosting
firebase deploy --only functions,hosting
```

### Testing Checklist

**Before committing changes**:
- [ ] Desktop view works (>768px)
- [ ] Mobile view works (≤768px)
- [ ] Touch events work on mobile (if applicable)
- [ ] Dark mode styling correct
- [ ] Navigation links work
- [ ] Firebase connection maintained
- [ ] No console errors
- [ ] Images load correctly
- [ ] Search/filter functionality works
- [ ] Forms submit correctly
- [ ] Modals work on mobile and desktop
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
- `playlists` - Music playlists (NEW)

### Firebase Functions (NEW)

**Chat Function** (`/api/chat`):
- Proxies requests to Gemini API
- Keeps API keys secure server-side
- Handles CORS for cross-origin requests
- Maintains conversation history
- System instruction: Zizekian/Marxist/Lacanian theory-infused responses
- Speaks as "Chomp Chomp collective" (plural "we/us/our")

**Function Configuration**:
```bash
# Set environment variable
firebase functions:config:set gemini.api_key="YOUR_KEY"

# Or use .env.yaml for local development
echo 'GEMINI_API_KEY: "YOUR_KEY"' > functions/.env.yaml
```

---

## Data Export & Backup (NEW)

### Data Directory Structure

The `/data` directory contains JSON exports of all Firestore collections:

```
data/
├── recipes.json          # All recipes
├── posts.json            # All posts/stories
├── lexicon.json          # All lexicon entries
├── books.json            # Reading list
├── playlists.json        # Music playlists
├── reading-list.json     # Alternative reading list format
└── *.json.example        # Example data structures
```

**Usage**:
- Backup: Export collections using `export-firebase-data.html`
- Migration: Use JSON files for bulk import/export
- Development: Use `.example` files as templates
- Version control: Track data changes over time

---

## Image Management

### Current State
- **Cloudinary**: Primary image CDN (migration in progress)
- **Firebase Storage**: Legacy image storage
- **Local Images**: Static assets in `/images` directory

### Cloudinary Migration Tools

Several tools exist for managing the Cloudinary migration:

```
cloudinary-url-mapper.html         # Map old URLs to new
collect-cloudinary-urls.html       # Collect all Cloudinary URLs
test-cloudinary-urls.html          # Test URL validity
get-cloudinary-api-urls.html       # Get URLs via API
match-cloudinary-images.html       # Match and update images
```

**Migration Scripts**:
- `fetch-cloudinary-urls.js` - Fetch URLs programmatically
- `match-and-update-images.js` - Update image references
- `update-recipe-images.js` - Update recipe images specifically
- `check-missing-images.js` - Check for broken image links

**Migration Data Files**:
- `cloudinary-urls.txt` - Master list of Cloudinary URLs
- `cloudinary-cookie-urls.txt` - Cookie/baking specific URLs
- `found-images.txt` - Successfully migrated images

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
functions/.env.yaml

# Admin tools with sensitive credentials
recipe-admin*.html
content-admin*.html

# Data files (used for bulk import)
data-*.txt
```

### Authentication
- **Public Site**: No auth required for viewing
- **Admin Interfaces**: Firebase Auth required
- **Decap/Sveltia CMS**: GitHub OAuth flow
- **Firebase Functions**: API key protection server-side

### API Security
- Gemini API key stored in Firebase Functions config
- CORS enabled for legitimate origins
- POST-only endpoints for mutations
- Environment variables never exposed to client

---

## Common Tasks for AI Assistants

### Task 1: Add a New Page
1. Create new HTML file in root directory
2. Copy header navigation from existing page
3. Link to `styles.css`
4. Add proper favicon links
5. Add meta tags for SEO and social sharing
6. Add page to navigation menu in all other pages
7. Test navigation flow
8. Ensure mobile responsive with touch support

### Task 2: Update Site-Wide Navigation
1. Edit header in all main pages:
   - `index.html`
   - `recipes.html`
   - `recipe.html`
   - `stories.html`
   - `post.html`
   - `lexicon.html`
   - `reading-list.html`
   - `playlists.html` (NEW)
   - `playlist.html` (NEW)
   - `about.html`
   - `store.html`
2. Test dropdown menus
3. Verify mobile menu toggle
4. Test touch events on mobile

### Task 3: Add New Content Type
1. Define data model (see examples above)
2. Create Firestore collection
3. Update `admin-content.html` with new section
4. Add to Decap/Sveltia CMS config (`admin/config.yml`)
5. Create listing page (like recipes.html or stories.html)
6. Create detail page (like recipe.html or post.html)
7. Add to navigation
8. Test CRUD operations
9. Add to data export script

### Task 4: Modify Styling
1. Edit `styles.css` for global changes
2. Use CSS variables for consistency
3. Test in light and dark modes
4. Check mobile breakpoints
5. Verify across all pages
6. Test touch interactions

### Task 5: Add New Tool
1. Create new HTML file in `tools/` directory
2. Link to shared `styles.css` or tool-specific CSS
3. Implement tool functionality
4. Add to `tools/index.html` directory listing
5. Add to main navigation dropdown
6. Test standalone and within site

### Task 6: Work with Firebase Functions
1. Navigate to `functions/` directory
2. Edit `index.js` for function logic
3. Test locally with Firebase emulator
4. Deploy via `firebase deploy --only functions`
5. Or push to main branch for auto-deploy
6. Monitor logs with `firebase functions:log`

### Task 7: Export Data for Backup
1. Open `export-firebase-data.html` in browser
2. Authenticate with Firebase
3. Click export buttons for each collection
4. Save JSON files to `/data` directory
5. Commit to version control for backup

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
- Check Cloudinary URL validity
- Verify Firebase Storage CORS settings
- Test local vs. remote image paths
- Check file exists in `/images` directory
- Use Cloudinary migration tools to fix broken links

**Navigation broken:**
- Verify all pages have consistent header HTML
- Check JavaScript for dropdown functionality
- Test mobile menu toggle
- Verify link paths (relative vs. absolute)
- Test touch events on mobile devices

**Styling inconsistent:**
- Ensure `styles.css` linked in all pages
- Check for inline styles overriding
- Verify CSS variable usage
- Test dark mode media query
- Clear browser cache

**Content not appearing:**
- Check Firestore collection path
- Verify document structure matches data model
- Check for JavaScript errors
- Verify real-time listener setup
- Check `status: "published"` for posts

**Mobile issues:**
- Test with actual touch devices, not just browser emulation
- Verify touchstart event handlers
- Check event delegation for dynamic content
- Test modals on mobile devices
- Verify viewport meta tag

**Firebase Functions not working:**
- Check function logs: `firebase functions:log`
- Verify environment variables are set
- Test CORS configuration
- Check API key validity
- Verify function region (us-central1)

**GitHub Actions deployment failing:**
- Check workflow logs in GitHub Actions tab
- Verify secrets are set (GEMINI_API_KEY, FIREBASE_SERVICE_ACCOUNT)
- Ensure Node.js version matches (20)
- Check Firebase CLI version compatibility
- Verify package.json dependencies

---

## Performance Considerations

1. **Firebase**: Real-time listeners for live updates
2. **Images**: Use Cloudinary CDN for faster loading with automatic optimization
3. **CSS**: Single shared stylesheet reduces requests
4. **JavaScript**: Vanilla JS, no framework overhead
5. **Caching**: Leverage browser caching for static assets (7200s for images)
6. **Lazy Loading**: Consider for images in long lists
7. **Cloud Functions**: Regional deployment (us-central1) for lower latency
8. **Data Export**: JSON backups prevent unnecessary Firestore reads

---

## Project Philosophy

### Design Principles

1. **Clarity over complexity** - Simple, readable code
2. **Consistency** - Shared navigation and styling
3. **Accessibility** - Semantic HTML, readable fonts, touch-optimized
4. **Mobile-first** - Responsive at all breakpoints with touch support
5. **Content-focused** - Typography and readability prioritized
6. **Philosophical depth** - Meaningful content over trends
7. **Theory-driven** - Zizekian, Marxist, Lacanian influences
8. **Collective voice** - "We/us/our" as Chomp Chomp collective

### Content Guidelines

- **Recipes**: Focus on technique and ritual, not just ingredients
- **Stories**: Personal, reflective, philosophical
- **Lexicon**: Thoughtful definitions that go beyond the literal
- **Reading List**: Curated with intention and context, no commercial links
- **Playlists**: Music as philosophical practice, not just background
- **Tools**: Practical utilities that serve a clear purpose
- **Voice**: Theoretical without being pretentious, plural without being corporate

### Theoretical Framework

The site embodies theoretical concepts through practice:
- **Ideology**: Baking as ideological materialization
- **Ritual**: Repetition and difference in technique
- **Commons**: Collective knowledge sharing
- **Praxis**: Theory realized through baking practice
- **Contradiction**: Precision and intuition coexisting

---

## File Organization Best Practices

### HTML Files
- Root level: Main pages (index, recipes, about, playlists, etc.)
- `/admin`: Administrative interfaces and CMS
- `/tools`: Utility tools and calculators
- `/store`: Store and order pages
- `/temp`: Development and staging work

### CSS
- `styles.css` - Primary shared stylesheet
- `tools/css/` - Tool-specific styles when needed
- Use CSS variables for theming
- Keep dark mode styles in media queries

### JavaScript
- Inline `<script type="module">` for Firebase pages
- Separate JS files for complex tools (`/functions`, migration scripts)
- ES6 modules for Firebase imports
- Utility scripts for data migration and image management

### Images
- `/images` - Local images (logos, static assets)
- Cloudinary - Primary CDN for user-uploaded content
- Firebase Storage - Legacy image storage (being migrated)
- Organized by content type in CDN

### Data
- `/data` - JSON exports for backup and migration
- `.example` files - Data structure templates
- Tracked in version control for change history

---

## Quick Reference

### Important Files

| File | Purpose | Firebase | New |
|------|---------|----------|-----|
| `index.html` | Homepage (blog posts) | ✓ | |
| `recipes.html` | Recipe grid | ✓ | |
| `recipe.html` | Individual recipe | ✓ | |
| `stories.html` | Story listing | ✓ | |
| `post.html` | Individual post | ✓ | |
| `lexicon.html` | Baking dictionary | ✓ | |
| `reading-list.html` | Book recommendations | ✓ | |
| `playlists.html` | Music playlists listing | ✓ | ✓ |
| `playlist.html` | Individual playlist | ✓ | ✓ |
| `about.html` | About and manifesto | ✗ | |
| `store.html` | Store page | ✗ | |
| `store/order.html` | Order processing | ✗ | ✓ |
| `styles.css` | Shared stylesheet | ✗ | |
| `functions/index.js` | Cloud Functions (chat) | ✓ | ✓ |
| `admin/index.html` | Decap/Sveltia CMS | ✓ | |
| `admin/config.yml` | CMS configuration | ✗ | |
| `.github/workflows/firebase-deploy.yml` | CI/CD | ✗ | ✓ |

### Key URLs

- **Production**: https://chompchomp.cc
- **Recipes**: https://chompchomp.cc/recipes.html
- **Stories**: https://chompchomp.cc/stories.html
- **Playlists**: https://chompchomp.cc/playlists.html (NEW)
- **Reading List**: https://chompchomp.cc/reading-list.html
- **Tools**: https://chompchomp.cc/tools/
- **Admin**: https://chompchomp.cc/admin/
- **Chat API**: https://chompchomp.cc/api/chat (Cloud Function)

### Contact & Related

- **Email**: hey@chompchomp.cc
- **Main Site**: https://www.chomp.ltd
- **Tools**: https://chompchomp.cc/tools
- **Repository**: chomp-chomp-chomp/chomp (GitHub)

---

## Recent Changes & Updates

### 2025-12-27
- **Playlists Feature**: Added comprehensive playlist system with listing and detail pages
- **Mobile Optimization**: Enhanced touchstart event support for modals and interactive elements
- **Reading List**: Removed purchase links, added ISBN import, improved mobile modals
- **CMS Enhancements**: Dark theme, mobile support, one-click GitHub publishing
- **Data Export**: JSON backup system in `/data` directory
- **CI/CD**: GitHub Actions workflow for automated deployment
- **Firebase Functions**: Gemini API chat proxy with theoretical voice

### Migration Status
- **Images**: Ongoing migration from Firebase Storage to Cloudinary
- **Tools**: Various HTML/JS tools created for image URL migration
- **Data**: JSON exports created for all collections

---

## Future Enhancement Ideas

Based on current structure and philosophy, consider:

1. **Enhanced Chat Interface** - Integrate Gemini chat more prominently
2. **Playlist/Recipe Pairing** - Better integration between playlists and recipes
3. **RSS Feed** - For blog posts and playlists
4. **Progressive Web App** - Offline functionality for recipes
5. **Recipe Collections** - User-created recipe collections
6. **Comments System** - Commenting on posts/recipes with theoretical discourse
7. **Newsletter** - Email subscription with philosophical content
8. **Recipe Scaling** - Automatic ingredient scaling
9. **Search Across Site** - Global search for all content types
10. **Social Sharing** - Enhanced social media integration
11. **Audio Integration** - Embed playlist audio directly
12. **Cross-linking** - Better connections between content types
13. **Advanced Filters** - Filter by multiple criteria simultaneously
14. **Recipe Timeline** - Visual timeline for multi-day recipes
15. **Theoretical Glossary** - Lexicon expansion with critical theory terms

---

## Development Checklist Template

When making significant changes:

```markdown
## Change Description
[Brief description of what was changed]

## Files Modified
- [ ] index.html
- [ ] recipes.html
- [ ] playlists.html
- [ ] styles.css
- [ ] functions/index.js
- [ ] admin/config.yml
- [ ] Other: ___________

## Testing Completed
- [ ] Desktop view (>768px)
- [ ] Mobile view (≤768px)
- [ ] Touch interactions on real device
- [ ] Dark mode
- [ ] Navigation works
- [ ] Firebase connection
- [ ] No console errors
- [ ] Images load (Cloudinary)
- [ ] Search/filter works
- [ ] Modals work on mobile
- [ ] Cross-browser tested
- [ ] Functions tested (if applicable)

## Deployment
- [ ] Changes committed
- [ ] Pushed to branch
- [ ] PR created (if not main)
- [ ] GitHub Actions passed
- [ ] Tested on live site
- [ ] Verified CNAME
- [ ] Cache cleared
- [ ] Functions deployed
```

---

**Last Updated**: 2025-12-27
**Document Version**: 3.0
**Repository**: chomp-chomp-chomp/chomp
**Primary Branch**: main

---

## Notes for AI Assistants

### Critical Reminders

- This is a **multi-page static site**, not a single-page application
- **Firebase** is used for dynamic content, but pages are static HTML
- **Shared navigation** must be updated across all pages when changed
- **CSS variables** in styles.css control theming - use them!
- **Mobile responsiveness** is critical - always test at 768px breakpoint
- **Touch events** are essential - test on actual mobile devices
- **Dark mode** is automatic via `prefers-color-scheme` - test it
- **Admin files** are gitignored - never commit files with credentials
- **Content structure** follows specific data models - reference them
- **Theoretical voice** - maintain Chomp Chomp collective voice in content
- **No commercial links** - philosophy over commerce in reading list
- **Cloudinary migration** - use Cloudinary for all new images

### When Making Changes

1. **Navigation**: Update all pages (11+ HTML files)
2. **Styling**: Use CSS variables, test light/dark modes
3. **Mobile**: Test touch events, not just responsive layout
4. **Firebase**: Follow collection path patterns exactly
5. **Functions**: Test locally before deploying
6. **CMS**: Update `admin/config.yml` for new content types
7. **Data Export**: Add new collections to export script
8. **CI/CD**: Verify GitHub Actions workflow on changes

### Philosophy Alignment

When adding content or features:
- Does it serve the collective?
- Does it deepen understanding?
- Does it materialize comfort?
- Does it resist commodification?
- Does it honor the ritual?

When in doubt, prioritize:
1. Consistency across pages
2. Mobile responsiveness with touch support
3. Dark mode compatibility
4. Semantic HTML
5. Clear, readable code
6. Theoretical depth
7. Collective voice

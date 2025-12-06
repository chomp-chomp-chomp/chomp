# Chomp Recipes - Multi-Page Site Redesign

This folder contains the foundation for your new multi-page recipe and blog site.

---

## 🎯 What's Been Created

### Core Files

1. **styles.css** - Shared stylesheet for entire site
   - CSS variables for easy theming
   - Dark mode support
   - Responsive layouts
   - Blog post styles
   - Recipe card styles
   - Navigation components

2. **index.html** - Blog-style homepage
   - Post grid layout
   - Category filtering (Stories, Anthropology, Mindfulness)
   - Connects to Firestore for posts
   - Live example tiles included

3. **about.html** - About page with manifesto
   - Complete manifesto text
   - Contact information
   - Links to related projects
   - Beautiful typography

4. **recipes.html** - Recipe browsing page
   - Grid view of all recipes
   - Search functionality
   - Category and dish type filters
   - Sort options (A-Z, Newest, Quickest Time)
   - Connects to existing Firestore recipes

5. **FIRESTORE-SETUP-GUIDE.md** - Step-by-step guide
   - How to create posts collection in Firestore
   - Security rules setup
   - Post editor interface code
   - Image upload strategies
   - Troubleshooting tips

---

## 🏗️ Architecture Overview

### Site Structure
```
┌─────────────────────────────────────────┐
│         Navigation (All Pages)          │
│   Home | Recipes | About                │
└─────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┐
│   index.html     │  recipes.html    │   about.html     │
│                  │                  │                  │
│ Blog Posts       │ Recipe Grid      │ Manifesto        │
│ - Stories        │ - Search         │ Contact Info     │
│ - Anthropology   │ - Filter         │ Philosophy       │
│ - Mindfulness    │ - Sort           │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

### Data Flow

**Posts** (New):
```
Firestore
artifacts/chomp-chomp-recipes/public/data/posts
  ↓
index.html (homepage grid)
  ↓
post.html?slug=... (individual post view)
```

**Recipes** (Existing):
```
Firestore
artifacts/chomp-chomp-recipes/public/data/recipes
  ↓
recipes.html (grid view)
  ↓
recipe.html?slug=... (individual recipe view)
```

---

## 📊 Data Models

### Blog Post Object
```javascript
{
  title: "Sunday Morning Ritual",
  slug: "sunday-morning-ritual",
  excerpt: "Brief preview text...",
  content: "Full markdown content...",
  category: "stories", // or "anthropology" or "mindfulness"
  status: "published", // or "draft"
  date: "2025-11-27",
  featured_image: "https://...", // optional
  created_at: Timestamp,
  updated_at: Timestamp
}
```

### Recipe Object (Existing)
```javascript
{
  title: "Chocolate Chip Cookies",
  slug: "chocolate-chip-cookies",
  description: "Classic cookies...",
  ingredients: ["flour", "sugar", ...],
  instructions: ["Mix dry...", "Cream butter...", ...],
  category: "chomp chomp",
  dishType: "Cookie/Bar",
  totalTime: "45min",
  image: "images/cookies.jpg"
}
```

---

## 🎨 Design System

### Color Palette

**Light Mode:**
- Background: `#fdfdfd`
- Text: `#353535`
- Accent: `#e73b42` (signature red)
- Sidebar: `#f5f5f5`

**Dark Mode:**
- Background: `#231f1f` (espresso)
- Text: `#d9d4d4`
- Accent: `#ff6b7a` (lighter red)
- Sidebar: `#2b2626`

### Typography
- Primary Font: Inter (300, 400, 500, 600)
- Fallback: Source Sans 3
- Line Height: 1.7 (body), 1.3 (headings)

### Spacing System
- XS: 8px
- SM: 12px
- MD: 20px
- LG: 30px
- XL: 40px

---

## 🚀 Next Steps

### Immediate (To Get Running)

1. **Review the Files**
   - Open each HTML file in a browser
   - Check that styles look correct
   - Verify navigation works

2. **Set Up Firestore Posts Collection**
   - Follow `FIRESTORE-SETUP-GUIDE.md`
   - Create the collection path
   - Add security rules
   - Create a test post manually

3. **Create Post Editor**
   - Copy the code from setup guide
   - Save as `post-editor.html` (gitignore it!)
   - Set up Firebase Auth
   - Test creating a post

4. **Add Missing Pages**
   - Create `post.html` (individual post view)
   - Create `recipe.html` (individual recipe view)
   - Both should follow the same nav structure

### Short Term (Polish)

5. **Test Everything**
   - Post creation and display
   - Category filtering
   - Recipe search and filtering
   - Mobile responsiveness
   - Dark mode appearance

6. **Move to Production**
   - Copy files from /temp to root
   - Update any paths
   - Test live deployment
   - Update CNAME if needed

### Medium Term (Enhancements)

7. **Image Upload System**
   - Add direct upload to Firebase Storage
   - Multiple images per post
   - Image optimization

8. **Post Management**
   - Edit existing posts
   - Delete posts
   - Post list/dashboard

9. **Advanced Features**
   - Comments system
   - Newsletter signup
   - RSS feed
   - Social sharing buttons

---

## 📁 File Organization

```
/temp/
├── styles.css                    # Shared stylesheet
├── index.html                    # Blog homepage
├── about.html                    # About/manifesto page
├── recipes.html                  # Recipe grid page
├── FIRESTORE-SETUP-GUIDE.md     # Firestore setup instructions
└── README.md                     # This file

/temp/ (to be created):
├── post.html                     # Individual post view
├── recipe.html                   # Individual recipe view
├── post-editor.html              # Admin post editor (gitignore)
└── images/                       # Local images folder
    └── posts/                    # Blog post images
```

---

## 🔒 Security Notes

### What Should Be Gitignored

```gitignore
# Admin interfaces with Firebase credentials
post-editor.html
temp/post-editor.html
recipe-admin*.html

# Environment files
.env
.env.local
```

### Public vs Private Data

**Public (anyone can read):**
- Published posts (`status: "published"`)
- All recipes
- Site content

**Private (auth required):**
- Draft posts
- Admin interfaces
- Writing/editing capabilities

---

## 💡 Personalization Ideas

### Make It Yours

1. **Voice & Tone**
   - Update manifesto to match your philosophy
   - Personalize about page with your story
   - Add author bio to posts

2. **Visual Identity**
   - Update logo/header image
   - Customize color scheme (edit CSS variables)
   - Add personal photos

3. **Content Strategy**
   - Decide post frequency
   - Choose categories that resonate
   - Mix personal stories with technique guides

4. **Community Features**
   - Email newsletter signup
   - Comments (Disqus, Firebase?)
   - Recipe submissions form
   - Guest contributors

---

## 🐛 Troubleshooting

### Common Issues

**Styles not loading:**
- Check that `styles.css` path is correct
- Verify CSS file exists in same directory as HTML

**Firebase not connecting:**
- Check console for errors
- Verify Firebase config is correct
- Ensure internet connection

**Posts not appearing:**
- Check Firestore collection path
- Verify `status: "published"`
- Check security rules allow reading

**Mobile layout broken:**
- Test at exactly 768px width
- Check media queries in styles.css
- Verify viewport meta tag exists

---

## 📚 Documentation

### Additional Resources

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
- [Markdown Guide](https://www.markdownguide.org/)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Internal Docs

- `CLAUDE.md` - Main developer guide (in root)
- `FIRESTORE-SETUP-GUIDE.md` - This folder
- `recipe-site-ideas.txt` - Future enhancement ideas (in root)

---

## ✅ Launch Checklist

Before going live:

- [ ] All pages created and tested
- [ ] Firestore collections set up
- [ ] Security rules configured
- [ ] First blog post published
- [ ] Mobile responsive tested
- [ ] Dark mode tested
- [ ] All links working
- [ ] Images loading correctly
- [ ] Analytics set up (optional)
- [ ] SEO meta tags added
- [ ] CNAME configured
- [ ] Backup of old site created

---

## 🎯 Success Metrics

### How to Know It's Working

1. **Technical:**
   - Pages load in < 2 seconds
   - No console errors
   - Works on mobile and desktop
   - Dark mode switches correctly

2. **Content:**
   - Can create posts easily
   - Posts appear immediately on homepage
   - Recipes are searchable
   - Navigation is intuitive

3. **Personal:**
   - You enjoy writing posts
   - The site reflects your voice
   - Feels personal and authentic
   - Easy to maintain

---

## 🙏 Questions?

This is your site's foundation. Feel free to:
- Modify any HTML/CSS
- Change the color scheme
- Reorganize navigation
- Add new pages
- Remove features you don't need

The goal is to make it **yours** while maintaining the philosophical depth that makes it special.

Happy baking and writing! 🍰✍️

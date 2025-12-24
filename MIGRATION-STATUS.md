# Cloudinary Migration Status

**Last Updated**: 2025-12-24
**Images Found**: 16 of 38 needed

---

## ✅ UPDATED - Working Images (16)

### Critical Images (3) - ALL WORKING ✅
1. ✅ **IMG_3432.png** - Logo (default state)
   - URL: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766535183/IMG_3432_w3bid3.png`
   - Used on: ALL pages

2. ✅ **IMG_3433.jpeg** - Logo (hover state)
   - URL: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766535181/IMG_3433_rqvbzu.jpg`
   - Used on: ALL pages

3. ✅ **chomp recipes logo.JPG** - Banner
   - URL: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532145/chomp_recipes_logo_copy_ofmspq.jpg`
   - Used on: ALL pages

### High Priority Images (13) - WORKING ✅

4. ✅ **chomp_recipes.png** - Recipe OG image
   - URL: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532145/chomp_recipes_logo_copy_ofmspq.jpg`
   - Used on: recipes.html, about.html

5. ✅ **Chomp Chomp store logo** - Store social media
   - URL: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531979/Chomp_Chomp_store_logo-compressed_r70bif.jpg`
   - Used on: store.html

6. ✅ **IMG_3837.jpeg** - Order link (dark mode)
   - URL: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532144/IMG_3837_irxpo1.jpg`
   - Used on: store.html

7. ✅ **IMG_3836.jpeg** - Order link (light mode)
   - URL: `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532145/IMG_3836_hlixgt.jpg`
   - Used on: store.html

### Cookie Product Images (9) - READY ✅
**Note**: These are saved to `cloudinary-cookie-urls.txt` for when needed

8. ✅ Blackstrap Five-Spice
9. ✅ Bonzer's Bones
10. ✅ Caffè & Rose
11. ✅ Cardamom Espresso
12. ✅ Cobanero Chocolate
13. ✅ Jordie's Chomp Chomps
14. ✅ Linus's Lite Bites
15. ✅ Matcha Amaretti
16. ✅ Ube Brûlée

---

## ❌ MISSING - Need to Upload (22)

### High Priority - Store Images (5)

17. ❌ **IMG_3460.jpeg** - Social media OG image
    - Purpose: Facebook/Twitter share preview
    - Used on: index.html, stories.html, post.html, recipe.html, about.html

18. ❌ **chomp store dark.PNG** - Store banner (dark mode)
    - Purpose: Store header for dark mode users
    - Used on: store.html

19. ❌ **chomp store light.PNG** - Store banner (light mode)
    - Purpose: Store header for light mode users
    - Used on: store.html

20. ❌ **Bébé's Breath Mints-compressed.jpeg**
    - Purpose: Cookie product image
    - Used on: store.html (likely)

21-24. ❌ **IMG_3846.jpeg, IMG_3847.jpeg, IMG_3848.jpeg, IMG_3849.jpeg**
    - Purpose: Additional store product images
    - Used on: store.html

### Medium Priority - Lexicon Images (14)

These are illustrations for your baking lexicon/dictionary:

25. ❌ Blind baking.jpg
26. ❌ Blooming.jpg
27. ❌ Contradiction.JPG
28. ❌ Crumb coat.jpg
29. ❌ Egg wash.jpg
30. ❌ Emulsifier.jpg
31. ❌ Fetish.JPG
32. ❌ Materiality.JPG
33. ❌ Proofing.jpg
34. ❌ Repetition.JPG
35. ❌ Ritual.JPG
36. ❌ Seeds and nuts.jpg
37. ❌ Temporality.JPG
38. ❌ Zest.jpg

---

## 🎯 Current Site Status

### What's Working Now:
- ✅ **All navigation** (logos and banner on every page)
- ✅ **Store page** (main logo, order links)
- ✅ **Recipe pages** (OG social images)
- ✅ **Cookie products** (URLs ready, may need Firestore update)

### What's Not Working Yet:
- ❌ Social media previews (IMG_3460 missing)
- ❌ Store banners light/dark (2 images missing)
- ❌ Some store products (4-5 images missing)
- ❌ Lexicon term illustrations (14 images missing)

---

## 📝 Next Steps

### Option 1: Find Missing Images in Your Files
Look for these specific files on your computer:
- `IMG_3460.jpeg`
- `chomp store dark.PNG`
- `chomp store light.PNG`
- `Bebe's Breath Mints-compressed.jpeg` (or similar)
- `IMG_3846.jpeg` through `IMG_3849.jpeg`
- The 14 lexicon images listed above

### Option 2: Use Placeholders
For now, the site works! We can:
- Use the main logo as a temporary social OG image
- Use one store banner for both light/dark mode
- Live without lexicon illustrations temporarily

### Option 3: Continue Collecting
Use the `collect-cloudinary-urls.html` tool to continue finding URLs from your Cloudinary account. The 335 URLs you have likely contain the missing images - they just weren't matched automatically.

---

## 🔍 Search Tips for Missing Images

When searching in Cloudinary, look for files containing:
- **IMG_3460** or **3460**
- **store** and **dark** or **light**
- **bebe** or **breath mint**
- **3846**, **3847**, **3848**, **3849**
- Lexicon terms: **blind**, **bloom**, **egg**, **proof**, etc.

---

**Status**: Site is functional with 16/38 images (42% complete)
**Priority**: Get the 5 missing HIGH priority images for full store functionality
**Optional**: Lexicon images can be added later

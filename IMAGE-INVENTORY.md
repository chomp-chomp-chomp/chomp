# Complete Image Inventory for Chomp Chomp

**Total Images Found**: 60+ images across Firebase Storage

All images are stored in Firebase Storage at:
`chomp-chomp-recipes.firebasestorage.app`

---

## 🌐 SITE-WIDE IMAGES (Used on ALL pages)

These images appear on multiple pages in the navigation header:

### Logo Images (Header)
1. **`posts/images/1764704134358_IMG_3432.png`**
   - **Purpose**: Main logo (default state)
   - **Used on**: index.html, stories.html, post.html, recipes.html, recipe.html, about.html, playlists.html, store.html, recipes1.html, recipegpt.html, recipesgpt.html
   - **Element**: `.logo-default` in header

2. **`posts/images/1764704133716_IMG_3433.jpeg`**
   - **Purpose**: Logo hover state
   - **Used on**: Same as above (all pages)
   - **Element**: `.logo-hover` in header

### Banner Image (Header)
3. **`posts/images/1764781386634_chomp recipes logo.JPG`**
   - **Purpose**: "Chomp Chomp Recipes" banner in header center
   - **Used on**: index.html, stories.html, post.html, recipes.html, recipe.html, about.html, playlists.html, recipes1.html, recipegpt.html, recipesgpt.html
   - **Element**: `.header-banner` in header

### Social Media / OG Images
4. **`posts/images/1764743197557_IMG_3460.jpeg`**
   - **Purpose**: Open Graph / Twitter social media preview image
   - **Used on**: index.html, stories.html, post.html, recipe.html, about.html, recipegpt.html, recipesgpt.html
   - **Element**: `<meta property="og:image">` and `<meta property="twitter:image">`

5. **`recipes/chomp_recipes.png`**
   - **Purpose**: OG image for recipe pages
   - **Used on**: recipes.html, about.html, recipegpt.html, recipesgpt.html
   - **Element**: `<meta property="og:image">`

---

## 🍪 STORE IMAGES (store.html)

### Store-specific Images
6. **`recipe-images/Chomp Chomp store logo-compressed.jpeg`**
   - **Purpose**: Store OG/social media image
   - **Used on**: store.html
   - **Element**: Social meta tags

7. **`recipe-images/chomp store dark.PNG`**
   - **Purpose**: Store banner (dark mode)
   - **Used on**: store.html
   - **Element**: `<picture>` element with dark mode media query

8. **`recipe-images/chomp store light.PNG`**
   - **Purpose**: Store banner (light mode)
   - **Used on**: store.html
   - **Element**: `<picture>` element (default)

9. **`recipe-images/IMG_3837.jpeg`**
   - **Purpose**: Order link image (dark mode)
   - **Used on**: store.html
   - **Element**: Order section

10. **`recipe-images/IMG_3836.jpeg`**
    - **Purpose**: Order link image (light mode)
    - **Used on**: store.html
    - **Element**: Order section

### Store Product Images (Cookies)
11. **`recipe-images/Bébé's Breath Mints-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html (likely dynamically loaded)

12. **`recipe-images/Blackstrap Five-Spice-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

13. **`recipe-images/Bonzer's Bones-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

14. **`recipe-images/Caffè & Rose-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

15. **`recipe-images/Cardamom Espresso-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

16. **`recipe-images/Cobanero Chocolate-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

17. **`recipe-images/Jordie's Chomp Chomps-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

18. **`recipe-images/Linus's Lite Bites-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

19. **`recipe-images/Matcha Amaretti-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

20. **`recipe-images/Ube Brûlée-compressed.jpeg`**
    - **Purpose**: Cookie product image
    - **Used on**: store.html

21. **`recipe-images/IMG_3846.jpeg`**
    - **Purpose**: Additional store product image
    - **Used on**: store.html

22. **`recipe-images/IMG_3847.jpeg`**
    - **Purpose**: Additional store product image
    - **Used on**: store.html

23. **`recipe-images/IMG_3848.jpeg`**
    - **Purpose**: Additional store product image
    - **Used on**: store.html

24. **`recipe-images/IMG_3849.jpeg`**
    - **Purpose**: Additional store product image
    - **Used on**: store.html

---

## 📖 LEXICON IMAGES (lexicon.txt / lexicon.html)

These images are referenced in lexicon entries (stored in Firestore):

25. **`posts/Blind baking.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Blind baking"

26. **`posts/Blooming.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Blooming"

27. **`posts/Contradiction.JPG`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Contradiction"

28. **`posts/Crumb coat.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Crumb coat"

29. **`posts/Egg wash.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Egg wash"

30. **`posts/Emulsifier.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Emulsifier"

31. **`posts/Fetish.JPG`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Fetish"

32. **`posts/Materiality.JPG`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Materiality"

33. **`posts/Proofing.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Proofing"

34. **`posts/Repetition.JPG`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Repetition"

35. **`posts/Ritual.JPG`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Ritual"

36. **`posts/Seeds and nuts.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Seeds and nuts"

37. **`posts/Temporality.JPG`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Temporality"

38. **`posts/Zest.jpg`**
    - **Purpose**: Lexicon term illustration
    - **Term**: "Zest"

---

## 🛠️ TOOLS SECTION IMAGES (tools/ pages)

These images are used for tool pages (both light and dark mode versions):

39. **`posts/Baking - dark.JPG`**
    - **Purpose**: Baking tools page header (dark mode)
    - **Used on**: tools/baking.html

40. **`posts/Convert - dark.JPG`**
    - **Purpose**: Convert tool page header (dark mode)
    - **Used on**: tools/convert.html

41. **`posts/Encode - dark.JPG`**
    - **Purpose**: Encode tool page header (dark mode)
    - **Used on**: tools/encode.html

42. **`posts/Inferno - dark.JPG`**
    - **Purpose**: Dante's Inferno page header (dark mode)
    - **Used on**: tools/dante.html

43. **`posts/Nautical - dark.JPG`**
    - **Purpose**: Nautical tools page header (dark mode)
    - **Used on**: tools/nautical.html

44. **`posts/Philosophy - dark.JPG`**
    - **Purpose**: Philosophy page header (dark mode)
    - **Used on**: tools/philosophy.html

45. **`posts/Subnet - dark.JPG`**
    - **Purpose**: Subnet calculator page header (dark mode)
    - **Used on**: tools/subnet.html

46. **`posts/Weather - dark.JPG`**
    - **Purpose**: Weather tool page header (dark mode)
    - **Used on**: tools/weather.html

47. **`posts/Weather - light.JPG`**
    - **Purpose**: Weather tool page header (light mode)
    - **Used on**: tools/weather.html

48. **`posts/Whois- dark.JPG`**
    - **Purpose**: Whois/IP tool page header (dark mode)
    - **Used on**: tools/ip.html

49. **`posts/Tools - dark 1.jpg`**
    - **Purpose**: Tools index page header (dark mode)
    - **Used on**: tools/index.html

50. **`posts/Tools - light 1.jpg`**
    - **Purpose**: Tools index page header (light mode)
    - **Used on**: tools/index.html

51. **`posts/images/1764612872597_tools.png`**
    - **Purpose**: Tools icon/thumbnail
    - **Used on**: tools pages or index

52. **`posts/images/1764687494472_MagicEraser_251202_001040.png`**
    - **Purpose**: Tools-related image
    - **Used on**: Tools section

53. **`posts/images/1764737716530_dante.jpg`**
    - **Purpose**: Dante's Inferno tool thumbnail
    - **Used on**: tools/dante.html or tools index

54. **`posts/images/1764737717497_nipsum.jpg`**
    - **Purpose**: Tool page thumbnail
    - **Used on**: Tools section

55. **`posts/images/1764737718159_who.jpg`**
    - **Purpose**: Whois tool thumbnail
    - **Used on**: tools/ip.html or tools index

56. **`posts/images/1764737718766_toolspin.jpg`**
    - **Purpose**: Tools page thumbnail
    - **Used on**: Tools section

57. **`posts/images/1764737719378_snet.jpg`**
    - **Purpose**: Subnet tool thumbnail
    - **Used on**: tools/subnet.html or tools index

58. **`posts/images/1764737720094_code.jpg`**
    - **Purpose**: Code/encode tool thumbnail
    - **Used on**: tools/encode.html or tools index

59. **`posts/images/1764737720669_vert.jpg`**
    - **Purpose**: Convert tool thumbnail
    - **Used on**: tools/convert.html or tools index

60. **`posts/images/1764743198558_IMG_3461.jpeg`**
    - **Purpose**: Additional tool/post image
    - **Used on**: Posts or tools section

---

## 📝 CHAT/INTERACTION IMAGES (index.html)

61. **`posts/images/1764704134358_IMG_3432.png`** (duplicate from site-wide)
    - **Additional use**: Chat icon/button on homepage
    - **Used on**: index.html
    - **Element**: Chat interface avatar

---

## 🎨 LEGACY/PROGRESS PAGES IMAGES

These appear in older versions or work-in-progress pages:

62. **`recipes/recipes logo.jpeg`**
    - **Purpose**: Recipes logo (legacy design)
    - **Used on**: progress1.html, in_progress.html
    - **Element**: Home image, background image

63. **`recipes/recipes cookie icon.png`**
    - **Purpose**: Cookie icon for animations/floating elements
    - **Used on**: progress1.html, in_progress.html
    - **Element**: Floating icon

64. **`recipes/recipes manifesto icon.png`**
    - **Purpose**: Manifesto page icon
    - **Used on**: progress1.html, in_progress.html
    - **Element**: Floating icon on manifesto page

65. **`recipes/chomp_recipes_logo.jpeg`**
    - **Purpose**: Favicon for recipes pages
    - **Used on**: recipes1.html, recipegpt.html, recipesgpt.html
    - **Element**: `<link rel="icon">`

---

## 📊 SUMMARY BY STORAGE FOLDER

### `/recipe-images/` folder (24 images)
- Store product images (cookies): 10 images
- Store branding: 3 images (logos, banners)
- Store interface: 6 images (IMG_3836-3849)

### `/posts/images/` folder (20 images)
- Navigation logos: 2 images (default + hover)
- Banner: 1 image
- Social media: 2 images (IMG_3460, IMG_3461)
- Tools thumbnails: 9 images (dante, nipsum, who, toolspin, snet, code, vert, tools.png, MagicEraser)

### `/posts/` folder (26 images)
- Lexicon illustrations: 14 images
- Tool page headers (dark mode): 8 images
- Tool page headers (light mode): 2 images

### `/recipes/` folder (5 images)
- Legacy logos and icons: 5 images

---

## 🎯 PRIORITY IMAGES TO RECOVER

### CRITICAL (Site won't work without these):
1. `posts/images/1764704134358_IMG_3432.png` - Main logo
2. `posts/images/1764704133716_IMG_3433.jpeg` - Logo hover
3. `posts/images/1764781386634_chomp recipes logo.JPG` - Banner

### HIGH PRIORITY (Store functionality):
4-23. All `/recipe-images/` folder images (store products and branding)

### MEDIUM PRIORITY (Enhanced content):
24-38. Lexicon images
39-60. Tools page images

### LOW PRIORITY (Legacy):
61-65. Old design assets (progress pages)

---

## 📝 NOTES FOR MANUAL RECOVERY

### File Naming Patterns:
- **Timestamp-based**: `1764XXXXXXXXX_filename.ext` (posts/images folder)
- **Descriptive**: `[Product Name]-compressed.jpeg` (recipe-images folder)
- **Category-based**: `[Page Name] - dark.JPG` (tools folder)

### Upload Destinations:
When re-uploading via `admin/image-manager.html`:

1. **For navigation/site-wide images**: Upload to `posts/images/`
2. **For store products**: Upload to `recipe-images/`
3. **For lexicon**: Upload to `posts/`
4. **For tool headers**: Upload to `posts/`
5. **For legacy/icons**: Upload to `recipes/`

### Dynamic Content Note:
- Recipe images are stored in Firestore documents (not hardcoded)
- Post featured images are stored in Firestore documents
- Use `admin-content.html` to view which images are referenced in your database

---

## ✅ NEXT STEPS

1. Run `check-firebase-storage.html` to see which images still exist
2. Search your local computer for these filenames
3. Check any backup drives or cloud storage (Google Drive, Dropbox, etc.)
4. Re-upload missing images using `admin/image-manager.html`
5. Verify each page loads correctly after restoration

---

**Document Created**: 2025-12-22
**Total Images Catalogued**: 65 unique images

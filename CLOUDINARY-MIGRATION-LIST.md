# Cloudinary to ImageKit Migration List

Complete list of all Cloudinary images across your site and where they need to be updated.

---

## 📍 Part 1: Hardcoded Images in HTML Files

### Logo Images (Used Site-Wide)

**Logo Default (PNG):**
- **URL:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766535183/IMG_3432_w3bid3.png`
- **Used in:**
  - `index.html` (line 62, 631, 637)
  - `recipe.html` (line 364)
  - `recipesgpt.html` (line 111)
  - `post.html` (line 62)
  - `store.html` (line 270)
  - `playlists.html` (line 396)

**Logo Hover (JPG):**
- **URL:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766535181/IMG_3433_rqvbzu.jpg`
- **Used in:**
  - `index.html` (line 63)
  - `recipe.html` (line 365)
  - `recipesgpt.html` (line 112)
  - `post.html` (line 63)
  - `store.html` (line 271)
  - `playlists.html` (line 397)

**Recipe Banner Logo:**
- **URL:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531937/chomp_recipes_logo_kh3zb4.jpg`
- **Used in:**
  - `index.html` (line 70)
  - `recipe.html` (line 372)
  - `recipesgpt.html` (line 119)
  - `post.html` (line 70)
  - `playlists.html` (line 404)

### Store Page Images

**Store Logo (OG Image):**
- **URL:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531979/Chomp_Chomp_store_logo-compressed_r70bif.jpg`
- **Used in:**
  - `store.html` (line 39 - og:image meta tag)
  - `store.html` (line 46 - twitter:image meta tag)

**Store Order Images:**
- **Dark Mode:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532144/IMG_3837_irxpo1.jpg`
  - Used in: `store.html` (line 386)
- **Light Mode:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532145/IMG_3836_hlixgt.jpg`
  - Used in: `store.html` (line 387)

### Other Hardcoded Images

**Recipe GPT Favicon:**
- **URL:** `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532145/chomp_recipes_logo_copy_ofmspq.jpg`
- **Used in:**
  - `recipesgpt.html` (line 32 - og:image)

---

## 📍 Part 2: Recipe Images (data/recipes.json)

Total: **57 recipes** with Cloudinary images

### Quick Import Recipes (Using v1 Path)
1. **Apple Rose Pie**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/apple-rose-pie.jpg`

2. **Blackberry Sage Chocolate Cake**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/blackberry-sage-chocolate-cake.jpg`

3. **Carrot Orange Olive Oil Cake**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/carrot-orange-olive-oil-cake.jpg`

4. **Dark Chocolate Olive Oil Cake**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/dark-chocolate-olive-oil-cake.jpg`

5. **Dubai Chocolate**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/dubai-chocolate.jpg`

6. **Easy Soft Gingerbread Cookies**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/easy-soft-gingerbread-cookies.jpg`

7. **Eggnog Cookies**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/eggnog-cookies.jpg`

8. **Five Spice Molasses**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/five-spice-molasses.jpg`

9. **Honey Ricotta Black Whites**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/honey-ricotta-black-whites.jpg`

10. **Honey Scones**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/honey-scones.jpg`

11. **MawMaw Walker's Banana Pudding**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/mawmaw-walkers-banana-pudding.jpg`

12. **Pezzetti di Cannella**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/pezzetti-di-cannella.jpg`

13. **Russian Spice Cookies (Pryaniki)**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/russian-spice-cookies-pryaniki.jpg`

14. **Spiced Rum Syrup**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/spiced-rum-syrup.jpg`

15. **The Best Sugar Cookies**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/the-best-sugar-cookies.jpg`

16. **The Ultimate Sticky Toffee Pudding**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/the-ultimate-sticky-toffee-pudding.jpg`

17. **Vanilla Frozen Custard**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/vanilla-frozen-custard-recipe.jpg`

### Cookie Recipes (Compressed Images)
18. **Ash-Baked Flats**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532030/Ash-Baked_Flats-compressed_sh9q3x.jpg`

19. **Baker's Lament**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531909/Baker_s_Lament-compressed_bw1ukg.jpg`

20. **Biscuit Bis Coctus**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531959/Biscuit_Bis_Coctus_-compressed_qrbhsj.jpg`

21. **Consolation Discs**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531938/Consolation_Discs-compressed_p4xxqh.jpg`

22. **Crumb Tokens**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532058/Crumb_Tokens-compressed_oa0ceg.jpg`

23. **Crumbwaifs**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531939/Crumbwaifs-compressed_byai4t.jpg`

24. **Crust-of-Argument**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531944/Crust-of-Argument-compressed_yz4r1g.jpg`

25. **Crustlets**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531960/Crustlets-compressed_ulrppd.jpg`

26. **Dockside Cakels**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532035/Dockside_Cakels-compressed_mgycis.jpg`

27. **Experimental Pastries**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532034/Experimental_Pastries-compressed_fhk8gt.jpg`

28. **Folly Bisques**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532059/Folly_Bisques-compressed_toxtz1.jpg`

29. **Hearth Circles**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531917/Hearth_Circles.-compressed_wdomt0.jpg`

30. **Hildevart's Folly-Cakes**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532073/Hildevart_s_Folly-Cakes.-compressed_lco7bg.jpg`

31. **Koekje**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531918/Koekje-compressed_m0jxhi.jpg`

32. **Koeklings**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532039/Koeklings-compressed_jirzkp.jpg`

33. **Lord's-Day Chewables**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532038/Lord_s-Day_Chewables-compressed_etm6cz.jpg`

34. **Matcha Amaretti**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532255/Matcha_Amaretti-compressed_ktjfje.jpg`

35. **Mercantile Rounds**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531932/Mercantile_Rounds-compressed_b31z9o.jpg`

36. **Mirthcakes**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531954/Mirthcakes-compressed_decaay.jpg`

37. **Misnomer Cakes**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532012/Misnomer_Cakes-compressed_k41nyr.jpg`

38. **Monk's Embers**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531916/Monk_s_Embers-compressed_gmsygt.jpg`

39. **Oath-Breakers**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531979/Oath-Breakers-compressed_w2a4xt.jpg`

40. **Oven-Wanderers**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532014/Oven-Wanderers-compressed_kbffol.jpg`

41. **Pan-Rounds of Reason**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531980/Pan-Rounds_of_Reason-compressed_sgaunt.jpg`

42. **Pilgrim's Stoics**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532038/Pilgrim_s_Stoics-compressed_axrbmk.jpg`

43. **Scribe's Regret**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532061/Scribe_s_Regret-compressed_wrnxdu.jpg`

44. **Ship's Stones**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532061/Ship_s_Stones-compressed_ydubwe.jpg`

45. **Smalls of Uncertain Texture**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531913/Smalls_of_Uncertain_Texture-compressed_kjft3a.jpg`

46. **Softlings**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532014/Softlings-compressed_hzvr6o.jpg`

47. **Sweet Rounds for the Road**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531931/Sweet_Rounds_for_the_Road-compressed_f0umdl.jpg`

48. **Tidings**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532073/Tidings-compressed_y14dyf.jpg`

49. **Traveler's Flats**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532058/Traveler_s_Flats-compressed_d3dowd.jpg`

50. **Twice-Baked Wafers**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532031/Twice-Baked_Wafers-compressed_qcgyiu.jpg`

51. **Twice-Browned Resentments**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531971/Twice-Browned_Resentments-compressed_qzg0ie.jpg`

52. **Ube Brûlée**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531973/Ube_Bru%CC%82le%CC%81e-compressed_ub5umd.jpg`

53. **Unnamables**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531962/Unnamables-compressed_hhipf6.jpg`

54. **Wayfarer's Puck**
    - `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532030/Wayfarer_s_Puck.-compressed_mczqcp.jpg`

---

## 📍 Part 3: Post Images (data/posts.json)

1. **Post Featured Image**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_3866-compressed_k98kr3.jpg`

---

## 📍 Part 4: Playlist Images (data/playlists.json)

1. **Playlist Cover Image**
   - `https://res.cloudinary.com/dlqfyv1qj/image/upload/DD19E3DA-5B65-4116-B683-C077524A0ECD_jyd625.png`

---

## 📍 Part 5: Lexicon Images (data/lexicon.json)

Total: **14 lexicon entries** with Cloudinary images

1. **IMG_4453** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4453_yctigq.jpg`
2. **IMG_4454** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4454_cw9ht0.jpg`
3. **IMG_4455** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4455_vu2wzr.jpg`
4. **IMG_4456** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4456_h0otyk.jpg`
5. **IMG_4457** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4457_uwt5xe.jpg`
6. **IMG_4458** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4458_eiek69.jpg`
7. **IMG_4459** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4459_cr9hdl.jpg`
8. **IMG_4460** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4460_bpoj1y.jpg`
9. **IMG_4461** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4461_t7htos.jpg`
10. **IMG_4462** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4462_ygwnrb.jpg`
11. **IMG_4463** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4463_hta2tw.jpg`
12. **IMG_4464** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4464_vnqbnc.jpg`
13. **IMG_4465** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4465_u9orgw.jpg`
14. **IMG_4466** - `https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4466_hj4rtj.jpg`

---

## 📊 Summary

| Category | Count | Location |
|----------|-------|----------|
| **Hardcoded HTML** | 7 unique images | Multiple HTML files |
| **Recipe Images** | 57 recipes | `data/recipes.json` |
| **Post Images** | 1 post | `data/posts.json` |
| **Playlist Images** | 1 playlist | `data/playlists.json` |
| **Lexicon Images** | 14 entries | `data/lexicon.json` |
| **TOTAL** | **80 images** | Across all files |

---

## 🔄 Migration Strategy Recommendations

### Priority 1: Hardcoded Logo Images (CRITICAL)
These appear on every page and need to be migrated first:
- `IMG_3432_w3bid3.png` (logo default)
- `IMG_3433_rqvbzu.jpg` (logo hover)
- `chomp_recipes_logo_kh3zb4.jpg` (recipe banner)

### Priority 2: JSON Data Files (CAN USE ADMIN)
Use your admin interface to:
1. Upload each image to ImageKit
2. Copy the new ImageKit URL
3. Update the JSON entry via the admin CMS

### Priority 3: Store and OG Images
Update meta tags and store-specific images

---

## 🛠️ Migration Tools

I can create a script to help you:
1. **Bulk upload** Cloudinary images to ImageKit
2. **Automatically update** JSON files with new URLs
3. **Find and replace** in HTML files

Would you like me to create a migration script?

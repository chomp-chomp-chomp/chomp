#!/bin/bash

# Script to replace all Firebase Storage URLs with Cloudinary URLs
# Created: 2025-12-22

echo "🔄 Updating all Firebase Storage URLs to Cloudinary..."

# Cloudinary base URL
CLOUDINARY_BASE="https://res.cloudinary.com/dlqfyv1qj/image/upload/images"

# List of HTML files to update
FILES=(
  "recipe.html"
  "stories.html"
  "post.html"
  "about.html"
  "store.html"
  "playlists.html"
  "recipes1.html"
  "recipegpt.html"
  "recipesgpt.html"
  "progress1.html"
  "in_progress.html"
  "lexicon.txt"
)

# Critical images (used on all pages)
declare -A REPLACEMENTS

# Logo images
REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2Fimages%2F1764704134358_IMG_3432.png?alt=media&token=24b33f57-609c-452c-b7cb-9e5cdf85859c"]="${CLOUDINARY_BASE}/1764704134358_IMG_3432.png"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2Fimages%2F1764704133716_IMG_3433.jpeg?alt=media&token=94d04258-f7c1-4eed-983a-a0eaad6c4f0b"]="${CLOUDINARY_BASE}/1764704133716_IMG_3433.jpeg"

# Banner
REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2Fimages%2F1764781386634_chomp%20recipes%20logo.JPG?alt=media&token=2b7daf1f-2392-493e-944c-512a194327f6"]="${CLOUDINARY_BASE}/1764781386634_chomp%20recipes%20logo.JPG"

# Social media OG images
REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2Fimages%2F1764743197557_IMG_3460.jpeg?alt=media&token=ead0f58a-8584-48a8-b1ed-ac29962d5c3e"]="${CLOUDINARY_BASE}/1764743197557_IMG_3460.jpeg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipes%2Fchomp_recipes.png?alt=media"]="${CLOUDINARY_BASE}/chomp_recipes.png"

# Store images
REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipe-images%2FChomp%20Chomp%20store%20logo-compressed.jpeg?alt=media&token=0def1f6e-93c6-4097-9fbf-2f445274f5e1"]="${CLOUDINARY_BASE}/Chomp%20Chomp%20store%20logo-compressed.jpeg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipe-images%2Fchomp%20store%20dark.PNG?alt=media&token=c525572f-6033-4ef0-b0ce-97c6b61542b8"]="${CLOUDINARY_BASE}/chomp%20store%20dark.PNG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipe-images%2Fchomp%20store%20light.PNG?alt=media&token=02a043ed-45ea-4f8b-bea0-bf92c1112af0"]="${CLOUDINARY_BASE}/chomp%20store%20light.PNG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipe-images%2FIMG_3837.jpeg?alt=media&token=764e18c6-1fc2-4ac2-bd37-496bdd705a7c"]="${CLOUDINARY_BASE}/IMG_3837.jpeg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipe-images%2FIMG_3836.jpeg?alt=media&token=f24a5e3b-8999-4959-b7f6-31a2312d9d33"]="${CLOUDINARY_BASE}/IMG_3836.jpeg"

# Lexicon images
REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FBlind%20baking.jpg?alt=media&token=5fb23e40-e467-436d-8a19-a086b8398c1b"]="${CLOUDINARY_BASE}/Blind%20baking.jpg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FBlooming.jpg?alt=media&token=16894f53-0c4a-4693-bed6-c149dc8fb6e3"]="${CLOUDINARY_BASE}/Blooming.jpg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FContradiction.JPG?alt=media&token=cfb62dbc-2854-4390-a05b-c4d502950950"]="${CLOUDINARY_BASE}/Contradiction.JPG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FCrumb%20coat.jpg?alt=media&token=7a2c34a1-53b8-4371-8e3c-236cac58e310"]="${CLOUDINARY_BASE}/Crumb%20coat.jpg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FEgg%20wash.jpg?alt=media&token=aac9178a-8329-4303-8da5-5ee3797a69f0"]="${CLOUDINARY_BASE}/Egg%20wash.jpg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FEmulsifier.jpg?alt=media&token=e7d0c6e9-6029-4f28-a76f-e9df5e35905e"]="${CLOUDINARY_BASE}/Emulsifier.jpg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FFetish.JPG?alt=media&token=58fa505e-6a8b-4b60-8cad-049f189397e7"]="${CLOUDINARY_BASE}/Fetish.JPG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FMateriality.JPG?alt=media&token=fd7109fa-765f-491c-82eb-476820634504"]="${CLOUDINARY_BASE}/Materiality.JPG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FProofing.jpg?alt=media&token=45581b7a-9d99-4877-af3b-f90cc13e4426"]="${CLOUDINARY_BASE}/Proofing.jpg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FRepetition.JPG?alt=media&token=d6922752-2533-4cce-9b99-90f23d23310c"]="${CLOUDINARY_BASE}/Repetition.JPG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FRitual.JPG?alt=media&token=2b7e49e1-ebbe-427b-8a9e-195588cbecba"]="${CLOUDINARY_BASE}/Ritual.JPG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FSeeds%20and%20nuts.jpg?alt=media&token=b4aa5730-c36a-43bc-8f0d-6d57ec025ff8"]="${CLOUDINARY_BASE}/Seeds%20and%20nuts.jpg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FTemporality.JPG?alt=media&token=6bf568cf-fcad-46ca-b6cc-327c44a8e8e8"]="${CLOUDINARY_BASE}/Temporality.JPG"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2FZest.jpg?alt=media&token=b1071f08-55b9-4aa1-98fa-6c7d77ac6cbf"]="${CLOUDINARY_BASE}/Zest.jpg"

# Legacy images
REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipes%2Frecipes%20logo.jpeg?alt=media"]="${CLOUDINARY_BASE}/recipes%20logo.jpeg"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipes%2Frecipes%20cookie%20icon.png?alt=media"]="${CLOUDINARY_BASE}/recipes%20cookie%20icon.png"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipes%2Frecipes%20manifesto%20icon.png?alt=media"]="${CLOUDINARY_BASE}/recipes%20manifesto%20icon.png"

REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/recipes%2Fchomp_recipes_logo.jpeg?alt=media"]="${CLOUDINARY_BASE}/chomp_recipes_logo.jpeg"

# Additional images
REPLACEMENTS["https://firebasestorage.googleapis.com/v0/b/chomp-chomp-recipes.firebasestorage.app/o/posts%2Fimages%2F1764743198558_IMG_3461.jpeg?alt=media&token="]="${CLOUDINARY_BASE}/1764743198558_IMG_3461.jpeg"

# Process each file
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Processing $file..."

    # Create backup
    cp "$file" "${file}.bak"

    # Perform replacements
    for old_url in "${!REPLACEMENTS[@]}"; do
      new_url="${REPLACEMENTS[$old_url]}"
      sed -i "s|${old_url}|${new_url}|g" "$file"
    done

    echo "✅ Updated $file"
  else
    echo "⚠️  Skipping $file (not found)"
  fi
done

echo ""
echo "✨ All files updated!"
echo ""
echo "📊 Summary:"
echo "  - Updated ${#FILES[@]} files"
echo "  - Replaced ${#REPLACEMENTS[@]} unique URLs"
echo "  - Backups created with .bak extension"
echo ""
echo "🔍 Next steps:"
echo "  1. Test the site locally"
echo "  2. Verify images load correctly"
echo "  3. If everything works, remove .bak files"
echo "  4. Commit and push changes"

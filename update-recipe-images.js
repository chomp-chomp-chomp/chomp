const fs = require('fs');

// Read recipes
const recipes = JSON.parse(fs.readFileSync('data/recipes.json', 'utf8'));

console.log('📊 Before: ' + recipes.length + ' recipes');
let updated = 0;
let firebaseCount = 0;

// Update all image URLs to Cloudinary
const updatedRecipes = recipes.map(recipe => {
  const slug = recipe.slug || recipe.id;
  const cloudinaryUrl = `https://res.cloudinary.com/dlqfyv1qj/image/upload/v1/${slug}.jpg`;

  if (recipe.image && recipe.image.includes('firebasestorage')) {
    firebaseCount++;
  }

  if (recipe.image !== cloudinaryUrl) {
    updated++;
  }

  return {
    ...recipe,
    image: cloudinaryUrl
  };
});

console.log('🔥 Found ' + firebaseCount + ' Firebase URLs');
console.log('✏️  Updated ' + updated + ' image URLs to Cloudinary');

// Save updated recipes
fs.writeFileSync('data/recipes.json', JSON.stringify(updatedRecipes, null, 2));

console.log('✓ Saved updated recipes.json');
console.log('\n📸 Sample updated URLs:');
updatedRecipes.slice(0, 5).forEach(r => {
  console.log('  ' + r.slug + ' → ' + r.image);
});

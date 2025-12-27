const fs = require('fs');

const recipes = JSON.parse(fs.readFileSync('data/recipes.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));
const lexicon = JSON.parse(fs.readFileSync('data/lexicon.json', 'utf8'));
const readingList = JSON.parse(fs.readFileSync('data/reading-list.json', 'utf8'));
const playlists = JSON.parse(fs.readFileSync('data/playlists.json', 'utf8'));

console.log('=== POSTS IMAGE STATUS ===');
const postsWithImages = posts.filter(p => p.featured_image);
const postsNeedingImages = posts.filter(p => !p.featured_image);
console.log(`Total posts: ${posts.length}`);
console.log(`Posts with images: ${postsWithImages.length}`);
console.log(`Posts NEEDING images: ${postsNeedingImages.length}`);
if (postsNeedingImages.length > 0) {
  console.log('\nPosts without images:');
  postsNeedingImages.forEach(p => {
    console.log(`  - ${p.title} (${p.slug})`);
  });
}

console.log('\n=== RECIPES WITHOUT IMAGES ===');
const recipesWithoutImages = recipes.filter(r => !r.image || r.image === '');
console.log(`Total recipes: ${recipes.length}`);
console.log(`Recipes WITHOUT images: ${recipesWithoutImages.length}`);
if (recipesWithoutImages.length > 0) {
  recipesWithoutImages.forEach(r => {
    console.log(`  - ${r.title} (${r.slug})`);
  });
}

console.log('\n=== LEXICON IMAGE STATUS ===');
const lexiconWithImages = lexicon.filter(l => l.image);
const lexiconWithoutImages = lexicon.filter(l => !l.image);
console.log(`Total lexicon entries: ${lexicon.length}`);
console.log(`With images: ${lexiconWithImages.length}`);
console.log(`Without images: ${lexiconWithoutImages.length}`);
console.log('(Most lexicon entries intentionally have no images)');

console.log('\n=== READING LIST IMAGE STATUS ===');
const booksWithImages = readingList.filter(b => b.coverImage);
const booksNeedingImages = readingList.filter(b => !b.coverImage);
console.log(`Total books: ${readingList.length}`);
console.log(`Books with cover images: ${booksWithImages.length}`);
console.log(`Books NEEDING cover images: ${booksNeedingImages.length}`);
if (booksNeedingImages.length > 0) {
  console.log('\nBooks without cover images:');
  booksNeedingImages.forEach(b => {
    console.log(`  - ${b.title} by ${b.authors}`);
  });
}

console.log('\n=== PLAYLISTS IMAGE STATUS ===');
const playlistsWithImages = playlists.filter(p => p.coverImage);
const playlistsNeedingImages = playlists.filter(p => !p.coverImage);
console.log(`Total playlists: ${playlists.length}`);
console.log(`Playlists with cover images: ${playlistsWithImages.length}`);
console.log(`Playlists NEEDING cover images: ${playlistsNeedingImages.length}`);
if (playlistsNeedingImages.length > 0) {
  console.log('\nPlaylists without cover images:');
  playlistsNeedingImages.forEach(p => {
    console.log(`  - ${p.title} (${p.slug})`);
  });
}

console.log('\n=== SUMMARY ===');
const totalNeeded = postsNeedingImages.length + recipesWithoutImages.length + booksNeedingImages.length + playlistsNeedingImages.length;
console.log(`Total images needed: ${totalNeeded}`);
console.log(`  - Posts: ${postsNeedingImages.length}`);
console.log(`  - Recipes: ${recipesWithoutImages.length}`);
console.log(`  - Reading List: ${booksNeedingImages.length}`);
console.log(`  - Playlists: ${playlistsNeedingImages.length}`);

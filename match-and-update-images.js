const fs = require('fs');

// Read data files
const recipes = JSON.parse(fs.readFileSync('data/recipes.json', 'utf8'));
const lexicon = JSON.parse(fs.readFileSync('data/lexicon.json', 'utf8'));
const posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf8'));

// Manual mappings from cloudinary-cookie-urls.txt
const cookieImages = {
  "bebes-breath-mints": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531946/Be%CC%81be%CC%81_s_Breath_Mints-compressed_aciyar.jpg",
  "blackstrap-five-spice": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532145/Blackstrap_Five-Spice-compressed_nimbqp.jpg",
  "bonzers-bones": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532089/Bonzer_s_Bones-compressed_pqp3r2.jpg",
  "caffe-rose": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532146/Caffee%CC%80_Rose-compressed_xkxxox.jpg",
  "cardamom-espresso": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531909/Cardamom_Espresso-compressed_a4krki.jpg",
  "cobanero-chocolate": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531961/Cobanero_Chocolate-compressed_hi6nsd.jpg",
  "jordies-chomp-chomps": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532290/Jordie_s_Chomp_Chomps-compressed_ebz2k0.jpg",
  "linuss-lite-bites": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532128/Linus_s_Lite_Bites-compressed_wytkyq.jpg",
  "matcha-amaretti": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532255/Matcha_Amaretti-compressed_ktjfje.jpg",
  "ube-brulee": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531973/Ube_Bru%CC%82le%CC%81e-compressed_ub5umd.jpg"
};

// Recipe images from cloudinary-urls.txt (matching filename patterns)
const recipeImages = {
  "ash-baked-flats": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532030/Ash-Baked_Flats-compressed_sh9q3x.jpg",
  "bakers-lament": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531909/Baker_s_Lament-compressed_bw1ukg.jpg",
  "biscuit-bis-coctus": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531959/Biscuit_Bis_Coctus_-compressed_qrbhsj.jpg",
  "consolation-discs": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531938/Consolation_Discs-compressed_p4xxqh.jpg",
  "crumb-tokens": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532058/Crumb_Tokens-compressed_oa0ceg.jpg",
  "crumbwaifs": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531939/Crumbwaifs-compressed_byai4t.jpg",
  "crust-of-argument": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531944/Crust-of-Argument-compressed_yz4r1g.jpg",
  "crustlets": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531960/Crustlets-compressed_ulrppd.jpg",
  "dockside-cakels": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532035/Dockside_Cakels-compressed_mgycis.jpg",
  "experimental-pastries": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532034/Experimental_Pastries-compressed_fhk8gt.jpg",
  "folly-bisques": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532059/Folly_Bisques-compressed_toxtz1.jpg",
  "hearth-circles": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531917/Hearth_Circles.-compressed_wdomt0.jpg",
  "hildevarts-folly-cakes": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532073/Hildevart_s_Folly-Cakes.-compressed_lco7bg.jpg",
  "koekje": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531918/Koekje-compressed_m0jxhi.jpg",
  "koeklings": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532039/Koeklings-compressed_jirzkp.jpg",
  "lords-day-chewables": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532038/Lord_s-Day_Chewables-compressed_etm6cz.jpg",
  "mercantile-rounds": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531932/Mercantile_Rounds-compressed_b31z9o.jpg",
  "mirthcakes": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531954/Mirthcakes-compressed_decaay.jpg",
  "misnomer-cakes": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532012/Misnomer_Cakes-compressed_k41nyr.jpg",
  "monks-embers": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531916/Monk_s_Embers-compressed_gmsygt.jpg",
  "oath-breakers": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531979/Oath-Breakers-compressed_w2a4xt.jpg",
  "oven-wanderers": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532014/Oven-Wanderers-compressed_kbffol.jpg",
  "pan-rounds-of-reason": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531980/Pan-Rounds_of_Reason-compressed_sgaunt.jpg",
  "pilgrims-stoics": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532038/Pilgrim_s_Stoics-compressed_axrbmk.jpg",
  "pilgrims-stoics-2": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532059/Pilgrim_s_Stoics_2-compressed_cso8md.jpg",
  "scribes-regret": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532061/Scribe_s_Regret-compressed_wrnxdu.jpg",
  "ships-stones": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532061/Ship_s_Stones-compressed_ydubwe.jpg",
  "smalls-of-uncertain-texture": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531913/Smalls_of_Uncertain_Texture-compressed_kjft3a.jpg",
  "softlings": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532014/Softlings-compressed_hzvr6o.jpg",
  "softlings-2": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531961/Softlings_2-compressed_afhlkn.jpg",
  "sweet-rounds-for-the-road": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531931/Sweet_Rounds_for_the_Road-compressed_f0umdl.jpg",
  "tidings": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532073/Tidings-compressed_y14dyf.jpg",
  "travelers-flats": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532058/Traveler_s_Flats-compressed_d3dowd.jpg",
  "twice-baked-wafers": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532031/Twice-Baked_Wafers-compressed_qcgyiu.jpg",
  "twice-browned-resentments": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531971/Twice-Browned_Resentments-compressed_qzg0ie.jpg",
  "unnamables": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531962/Unnamables-compressed_hhipf6.jpg",
  "wayfarers-puck": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532030/Wayfarer_s_Puck.-compressed_mczqcp.jpg",
  "wayfarers-puck-2": "https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531972/Wayfarer_s_Puck_2-compressed_r79uuo.jpg"
};

// Lexicon images from lexicon.txt
const lexiconImages = {
  "blind-baking": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Blind%20baking.jpg",
  "blooming": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Blooming.jpg",
  "contradiction": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Contradiction.JPG",
  "crumb-coat": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Crumb%20coat.jpg",
  "egg-wash": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Egg%20wash.jpg",
  "emulsifier": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Emulsifier.jpg",
  "fetish": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Fetish.JPG",
  "materiality": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Materiality.JPG",
  "proofing": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Proofing.jpg",
  "repetition": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Repetition.JPG",
  "ritual": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Ritual.JPG",
  "seeds-nuts": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Seeds%20and%20nuts.jpg",
  "temporality": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Temporality.JPG",
  "zest": "https://res.cloudinary.com/dlqfyv1qj/image/upload/images/Zest.jpg"
};

// Combine all image mappings
const allRecipeImages = { ...cookieImages, ...recipeImages };

// Update recipes
let recipeUpdates = 0;
const updatedRecipes = recipes.map(recipe => {
  const slug = recipe.slug || recipe.id;

  if (allRecipeImages[slug]) {
    console.log(`✓ Updating recipe: ${recipe.title} (${slug})`);
    console.log(`  Old: ${recipe.image}`);
    console.log(`  New: ${allRecipeImages[slug]}`);
    recipeUpdates++;
    return {
      ...recipe,
      image: allRecipeImages[slug]
    };
  }

  return recipe;
});

// Update lexicon
let lexiconUpdates = 0;
const updatedLexicon = lexicon.map(entry => {
  const slug = entry.slug || entry.id;

  // Check if needs update (has Firebase URL or no image)
  const needsUpdate = !entry.image ||
                      (entry.image && entry.image.includes('firebasestorage'));

  if (needsUpdate && lexiconImages[slug]) {
    console.log(`✓ Updating lexicon: ${entry.term} (${slug})`);
    console.log(`  Old: ${entry.image || 'none'}`);
    console.log(`  New: ${lexiconImages[slug]}`);
    lexiconUpdates++;
    return {
      ...entry,
      image: lexiconImages[slug]
    };
  }

  return entry;
});

// Write updated files
fs.writeFileSync('data/recipes.json', JSON.stringify(updatedRecipes, null, 2));
fs.writeFileSync('data/lexicon.json', JSON.stringify(updatedLexicon, null, 2));

console.log('\n=== Summary ===');
console.log(`Recipes updated: ${recipeUpdates}`);
console.log(`Lexicon entries updated: ${lexiconUpdates}`);
console.log(`Total updates: ${recipeUpdates + lexiconUpdates}`);

// Show unmatched recipes
console.log('\n=== Unmatched Recipes ===');
recipes.forEach(recipe => {
  const slug = recipe.slug || recipe.id;
  if (!allRecipeImages[slug]) {
    console.log(`- ${recipe.title} (${slug})`);
  }
});

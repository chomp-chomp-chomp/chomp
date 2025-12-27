#!/usr/bin/env node

/**
 * Apply Cloudinary to ImageKit URL migrations to JSON files
 * Based on the migration-report.md mappings
 */

const fs = require('fs');
const path = require('path');

// URL mappings from migration report
const urlMappings = {
  // Logos (for HTML files - not JSON)
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766535183/IMG_3432_w3bid3.png': 'https://ik.imagekit.io/chompchomp/logo-default_01ng4rCAq.png',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766535181/IMG_3433_rqvbzu.jpg': 'https://ik.imagekit.io/chompchomp/logo-hover_Xkgt_S3PG.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531937/chomp_recipes_logo_kh3zb4.jpg': 'https://ik.imagekit.io/chompchomp/recipe-banner_KrvmI80UM.jpg',

  // Recipe images
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532030/Ash-Baked_Flats-compressed_sh9q3x.jpg': 'https://ik.imagekit.io/chompchomp/recipe-ash-baked-flats_VLhHRCn2t.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531909/Baker_s_Lament-compressed_bw1ukg.jpg': 'https://ik.imagekit.io/chompchomp/recipe-bakers-lament_2dJ00ZXKS.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531959/Biscuit_Bis_Coctus_-compressed_qrbhsj.jpg': 'https://ik.imagekit.io/chompchomp/recipe-biscuit-bis-coctus_tJd-rMoVT.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531938/Consolation_Discs-compressed_p4xxqh.jpg': 'https://ik.imagekit.io/chompchomp/recipe-consolation-discs_P6gjSpZrX.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532058/Crumb_Tokens-compressed_oa0ceg.jpg': 'https://ik.imagekit.io/chompchomp/recipe-crumb-tokens_qda4TpIdh.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531939/Crumbwaifs-compressed_byai4t.jpg': 'https://ik.imagekit.io/chompchomp/recipe-crumbwaifs_NZP_GDcTc.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531944/Crust-of-Argument-compressed_yz4r1g.jpg': 'https://ik.imagekit.io/chompchomp/recipe-crust-of-argument_3xWml5z1t.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531960/Crustlets-compressed_ulrppd.jpg': 'https://ik.imagekit.io/chompchomp/recipe-crustlets_fDgxxhi63.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532035/Dockside_Cakels-compressed_mgycis.jpg': 'https://ik.imagekit.io/chompchomp/recipe-dockside-cakels_5E9iPvFMJ.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532034/Experimental_Pastries-compressed_fhk8gt.jpg': 'https://ik.imagekit.io/chompchomp/recipe-experimental-pastries_NtCYmO1-A.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532059/Folly_Bisques-compressed_toxtz1.jpg': 'https://ik.imagekit.io/chompchomp/recipe-folly-bisques_eWOI3BfvN.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531917/Hearth_Circles.-compressed_wdomt0.jpg': 'https://ik.imagekit.io/chompchomp/recipe-hearth-circles_QgmteBXl8c.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532073/Hildevart_s_Folly-Cakes.-compressed_lco7bg.jpg': 'https://ik.imagekit.io/chompchomp/recipe-hildevarts-folly-cakes_J_e6N9IOE.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531918/Koekje-compressed_m0jxhi.jpg': 'https://ik.imagekit.io/chompchomp/recipe-koekje_8avoVnEhj.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532039/Koeklings-compressed_jirzkp.jpg': 'https://ik.imagekit.io/chompchomp/recipe-koeklings_4oMT_qkkYh.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532038/Lord_s-Day_Chewables-compressed_etm6cz.jpg': 'https://ik.imagekit.io/chompchomp/recipe-lords-day-chewables_m2pnkES-E.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532255/Matcha_Amaretti-compressed_ktjfje.jpg': 'https://ik.imagekit.io/chompchomp/recipe-matcha-amaretti_g_USKyF8A.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531932/Mercantile_Rounds-compressed_b31z9o.jpg': 'https://ik.imagekit.io/chompchomp/recipe-mercantile-rounds_kMwXOHc_X.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531954/Mirthcakes-compressed_decaay.jpg': 'https://ik.imagekit.io/chompchomp/recipe-mirthcakes_IcCkBYnkn.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532012/Misnomer_Cakes-compressed_k41nyr.jpg': 'https://ik.imagekit.io/chompchomp/recipe-misnomer-cakes_Io6ubZWpF.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531916/Monk_s_Embers-compressed_gmsygt.jpg': 'https://ik.imagekit.io/chompchomp/recipe-monks-embers_HvCmgJ65D.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531979/Oath-Breakers-compressed_w2a4xt.jpg': 'https://ik.imagekit.io/chompchomp/recipe-oath-breakers_EBVkq5Ers.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532014/Oven-Wanderers-compressed_kbffol.jpg': 'https://ik.imagekit.io/chompchomp/recipe-oven-wanderers_q8-yGg0sO.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531980/Pan-Rounds_of_Reason-compressed_sgaunt.jpg': 'https://ik.imagekit.io/chompchomp/recipe-pan-rounds-of-reason_kYA_TkOi6.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532038/Pilgrim_s_Stoics-compressed_axrbmk.jpg': 'https://ik.imagekit.io/chompchomp/recipe-pilgrims-stoics_7BX3q69ua.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532061/Scribe_s_Regret-compressed_wrnxdu.jpg': 'https://ik.imagekit.io/chompchomp/recipe-scribes-regret_l22aaLddH.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532061/Ship_s_Stones-compressed_ydubwe.jpg': 'https://ik.imagekit.io/chompchomp/recipe-ships-stones_xUY3L_Y11.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531913/Smalls_of_Uncertain_Texture-compressed_kjft3a.jpg': 'https://ik.imagekit.io/chompchomp/recipe-smalls-of-uncertain-texture_SX4sC2L7B.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532014/Softlings-compressed_hzvr6o.jpg': 'https://ik.imagekit.io/chompchomp/recipe-softlings_2ZLBzyouq.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531931/Sweet_Rounds_for_the_Road-compressed_f0umdl.jpg': 'https://ik.imagekit.io/chompchomp/recipe-sweet-rounds-for-the-road_1cTip4D36.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532073/Tidings-compressed_y14dyf.jpg': 'https://ik.imagekit.io/chompchomp/recipe-tidings_qV58KdU1C.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532058/Traveler_s_Flats-compressed_d3dowd.jpg': 'https://ik.imagekit.io/chompchomp/recipe-travelers-flats_b6-7EA9n2.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532031/Twice-Baked_Wafers-compressed_qcgyiu.jpg': 'https://ik.imagekit.io/chompchomp/recipe-twice-baked-wafers_zg8HodzKG.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531971/Twice-Browned_Resentments-compressed_qzg0ie.jpg': 'https://ik.imagekit.io/chompchomp/recipe-twice-browned-resentments_mcvywf1h9.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531973/Ube_Bru%CC%82le%CC%81e-compressed_ub5umd.jpg': 'https://ik.imagekit.io/chompchomp/recipe-ube-brle_kNYt4TQnY.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766531962/Unnamables-compressed_hhipf6.jpg': 'https://ik.imagekit.io/chompchomp/recipe-unnamables_fEgD_8LCJ.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/v1766532030/Wayfarer_s_Puck.-compressed_mczqcp.jpg': 'https://ik.imagekit.io/chompchomp/recipe-wayfarers-puck_llTa7R7Hs.jpg',

  // Post images
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_3866-compressed_k98kr3.jpg': 'https://ik.imagekit.io/chompchomp/post-chomp-chomps-compendium-of-forgotten-cookies-thirty-four-confections-of-desire-discipline-and-semiotic-mischief-with-full-metric-conversions_hYxPiKOj5.jpg',

  // Playlist images
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/DD19E3DA-5B65-4116-B683-C077524A0ECD_jyd625.png': 'https://ik.imagekit.io/chompchomp/playlist-my-oven-goes_1QaR5TVC8.png',

  // Lexicon images
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4458_eiek69.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-blind-baking_cWd3oeZEA.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4457_uwt5xe.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-blooming_w98FNnOlU.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4463_hta2tw.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-contradiction_IV0CIm7l6.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4465_u9orgw.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-crumb-coat_pMU9L4vDe.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4456_h0otyk.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-egg-wash_t46nkvILi.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4459_cr9hdl.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-emulsifier_5NiarJBHQ.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4453_yctigq.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-fetish_wkwIVRN2d.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4462_ygwnrb.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-materiality_ijRduankQ.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4464_vnqbnc.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-proofing_gddQYwvkC.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4454_cw9ht0.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-repetition_dS0B-yJ4F.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4455_vu2wzr.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-ritual_dUjC7J60Y.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4466_hj4rtj.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-seeds-nuts_-wjFgMM0o.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4461_t7htos.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-temporality_O7hw_d_Lq.jpg',
  'https://res.cloudinary.com/dlqfyv1qj/image/upload/IMG_4460_bpoj1y.jpg': 'https://ik.imagekit.io/chompchomp/lexicon-zest_BCOJDp34X.jpg'
};

function applyMigrations() {
  console.log('🔄 Applying ImageKit migrations to JSON files...\n');

  const dataDir = path.join(__dirname, 'data');
  const files = ['recipes.json', 'posts.json', 'playlists.json', 'lexicon.json'];

  files.forEach(filename => {
    const filePath = path.join(dataDir, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${filename} - file not found`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;

    // Replace each URL
    Object.entries(urlMappings).forEach(([oldUrl, newUrl]) => {
      const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newUrl);
        changeCount += matches.length;
      }
    });

    if (changeCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filename}: Updated ${changeCount} URL(s)`);
    } else {
      console.log(`ℹ️  ${filename}: No changes needed`);
    }
  });

  console.log('\n✨ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Review the changes in git diff');
  console.log('2. Test your site locally');
  console.log('3. Commit and push the changes');
}

// Run the script
try {
  applyMigrations();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

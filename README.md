# Chomp Chomp (chom.ps)

Recipes, writing, a baking lexicon, tools, a store and a few books. A static HTML/CSS/vanilla-JS site: no framework and no build step. This README describes what the code does today. Many of the other `.md` files in the repo are historical notes from earlier migrations and are partly out of date (see [Old docs](#old-docs)).

> Written by reading the repo. Anything about dashboards or DNS (marked **check**) can't be seen from the code and is worth confirming.

---

## The short version

- **Content lives in git**, as JSON files in `data/`. Pages load them with `fetch('/data/recipes.json')`. **No live page reads from Firebase anymore.**
- **Editing content** is done at `/admin/` (a custom CMS). It logs in with a GitHub personal access token and commits JSON changes straight to `main`.
- **Images** are on ImageKit (`ik.imagekit.io/chompchomp`). Older ones are still on Cloudinary.
- **Firebase** still exists in the repo (a project, a deploy workflow, some Cloud Functions), but the site doesn't depend on it. See [Firebase, the refresher](#firebase-the-refresher).
- **Hosting** looks like Cloudflare Pages (**check**). See [Hosting](#hosting).

---

## Site map

| Page | What it is | Data source |
|---|---|---|
| `index.html` | Homepage: recipe grid with search, filters and sort, plus recent postscripts pulled from ps.chom.ps | `data/recipes.json` |
| `recipes.html` / `recipe.html?slug=` | Recipe list and single recipe | `data/recipes.json` |
| `stories.html` / `post.html?slug=` | Posts | `data/posts.json` |
| `lexicon.html` | Baking dictionary | `data/lexicon.json` |
| `reading-list.html` | Book recommendations | `data/reading-list.json` |
| `playlists.html` / `playlist.html` | Spotify playlists for baking | `data/playlists.json` |
| `editions.html` | Chomp Chomp Editions books and recommended links | `editions.json` (repo root) |
| `about.html`, `store.html`, `store/order.html` | Static pages. Orders go by email. | none |
| `tools/` | Utilities ("Lab"): convert, encode, subnet, whois/IP, weather, currency, color, JSON, text, time, random, plus the Ipsum generators | `tools/data/*.json`, `tools/js/*.js` |
| `archive-site/` | Browse and admin pages for the file archive at `archive.chom.ps` | Cloudflare R2, via `workers/archive-r2.js` |
| `admin/` | CMS and editors (see below) | writes to GitHub |

Writing lives on a separate site, **ps.chom.ps** (the ".ps").

`temp/`, `css/`, `grid.html`, `dark.html`, `recipes1.html`, `recipegpt.html`, `test1.html` and similar are old experiments, safe to ignore.

### Navigation
The menu on most pages is built by `navigation.js` from `navigation.json`. Edit that one file (or use the Navigation Editor in the admin) and every page updates. `editions.html` has its own small hard-coded menu on purpose.

### Styling
Everything shares `styles.css`. Theme colors are CSS variables at the top. Dark mode is automatic through `prefers-color-scheme` (espresso `#231f1f`; `editions.html` overrides to true black). Mobile breakpoint is 768px. Accent is `#e73b42` (light) and `#ff6b7a` (dark).

---

## Editing content

### The CMS: `/admin/`
1. Open `chom.ps/admin/`.
2. Paste a **GitHub personal access token** (starts with `ghp_` or `github_pat_`) with Contents read/write on `chomp-chomp-chomp/chomp`. Only usernames in `ALLOWED_USERS` inside `admin/index.html` get in. The token is kept in `sessionStorage` (cleared when the tab closes).
3. Tabs: **Recipes, Posts, Lexicon, Reading List, Playlists, Images, Page Editors**.
4. Saving commits the JSON file to `main` through the GitHub API ("Update recipes via CMS" in the git log). The live site updates in about a minute, after the host rebuilds.

The Page Editors tab links to the visual page editor, the WYSIWYG editor and the navigation editor.

`admin/config.yml` is a leftover Decap CMS config pointing at an old repo (`chomp-chomp-pachewy/chomp`). The current admin does not use it.

### Editions: `/admin/editions.html`
Manages `editions.json`. Each item can be placed under **Books** or **Recommended**, marked as an **affiliate** link (independent of section), tagged, made compact, hidden, reordered or deleted. It needs a fine-grained GitHub token with Contents read/write and commits to the branch you choose (default `main`).

### Editing by hand
Every content file is plain JSON and any commit to `main` publishes it. Recipe fields: `id, slug, title, description, image, servings, prepTime, cookTime, totalTime, source, category, ingredients[], instructions[], notes`. Look at an existing entry in `data/*.json` for the shape of the others. `*.json.example` files show the minimum.

### Images
- **ImageKit** is the current image host. Uploads from the admin go through `/api/imagekit-auth` (a Cloudflare Pages Function in `functions/api/`) which signs the request using the secret `IMAGEKIT_PRIVATE_KEY`.
- Some older images still point to **Cloudinary** (`res.cloudinary.com/dlqfyv1qj`). The `CLOUDINARY-*.md` files and `migrate-to-imagekit.html` document that migration.

---

## Firebase, the refresher

**What it was:** originally the whole backend. Recipes, posts, the lexicon and the reading list lived in **Firestore** (path `artifacts/chomp-chomp-recipes/public/data/<collection>`), images in **Firebase Storage**, and admin logins in **Firebase Auth**. Pages loaded the Firebase SDK from `gstatic.com`.

**What it is now:** the content moved into `data/*.json` in git. Searching the live pages, none of them import the Firebase SDK anymore. Only old test and migration pages do (`check-firebase-storage.html`, `export-firebase-data.html`, `grid.html`, `dark.html`, `recipes1.html`, `recipegpt.html`, `progress1.html`, `in_progress.html`, `test1.html`). `export-firebase-data.html` is the tool that pulled the data out of Firestore.

What remains in the repo:

| Piece | File | Status |
|---|---|---|
| Project | `.firebaserc` → project id `chomp-chomp-recipes` | Still exists in the Firebase console |
| Hosting config | `firebase.json` (serves the repo root, rewrites `/api/chat` to the `chat` function) | Possibly still deploying (below) |
| Cloud Functions | `functions/index.js`: `chat` (Gemini proxy), `imagekitAuth`, `imagekitListFiles` | Deployed on every push. Nothing in the current pages calls `chat`. |
| Deploy workflow | `.github/workflows/firebase-deploy.yml` | Runs `firebase deploy --only functions,hosting` on every push to `main` |

### Re-learning the tooling
```bash
npm install -g firebase-tools
firebase login                      # opens a browser
firebase projects:list              # confirm chomp-chomp-recipes appears
cd functions && npm ci              # Node 20 required
firebase emulators:start --only functions   # run functions locally
firebase functions:log              # see what's running
firebase deploy --only functions    # manual deploy
```
Console: https://console.firebase.google.com → project **chomp-chomp-recipes**. Check Firestore, Storage, Authentication and Functions → Logs to see what is still in use.

### Secrets the workflow expects (GitHub → Settings → Secrets → Actions)
- `FIREBASE_SERVICE_ACCOUNT_CHOMP_CHOMP_RECIPES`: service account JSON
- `GEMINI_API_KEY`: written to `functions/.env.yaml` during deploy

### Do you still need Firebase?
Probably not for the site itself. Reasonable options, in order of effort:
1. **Leave it.** It costs nothing noticeable, and the deploy workflow just runs.
2. **Pause the workflow** (delete or disable `.github/workflows/firebase-deploy.yml`) if you don't want every push to also deploy to Firebase.
3. **Retire it.** Back up Firestore with `export-firebase-data.html` first, then delete the project, the workflow and `functions/index.js`.

---

## Hosting

The repo carries traces of three setups:

- `.github/workflows/firebase-deploy.yml` + `firebase.json`: **Firebase Hosting** (`chomp-chomp-recipes.web.app`)
- `functions/api/*.js` (Pages Functions format), `_redirects`, the Cloudflare Insights beacon in `tools/*.html`, and `workers/` (Workers and an R2 bucket): **Cloudflare**
- Older docs mention Netlify (for CMS OAuth) and GitHub Pages (`CNAME`)

The admin's `/api/imagekit-*` calls and the `archive.chom.ps` R2 setup only make sense on Cloudflare, so **chom.ps is most likely served by Cloudflare Pages** from this repo's `main` branch. **Check:** the Cloudflare dashboard → Workers & Pages, or `dig chom.ps` to see where the domain points.

### Serverless pieces
| What | Where | Env var / binding |
|---|---|---|
| ImageKit upload signing and listing | `functions/api/imagekit-*.js` (Cloudflare Pages Functions) | `IMAGEKIT_PRIVATE_KEY` (secret) |
| Archive file listing/upload | `workers/archive-r2.js` + R2 bucket | `ARCHIVE_BUCKET`, `ARCHIVE_ADMIN_TOKEN` |
| Gemini chat proxy | `functions/index.js` → `chat` (Firebase) | `GEMINI_API_KEY` (unused by current pages) |

`_redirects` sends `/archive/` and `/admin/archive-admin.html` to `archive.chom.ps`.

---

## Running locally
No build needed, but pages use `fetch('/data/...')` so open them through a server, not `file://`:
```bash
python3 -m http.server 8000     # then visit http://localhost:8000
```
The admin and editions admin call GitHub's API, so they work locally too with a valid token. Image upload needs the Cloudflare function and won't work locally unless you run `wrangler pages dev`.

---

## Known issues and tidy-ups
1. **Rotate the Gemini API keys.** Two keys are committed in plain text: one as a fallback in `functions/index.js` and in `FIREBASE_SETUP.md`, another in `PRODUCTION-DEPLOYMENT.md`. Treat them as exposed: revoke them in Google AI Studio or Cloud Console, create a new one, store it only as a secret, and remove the fallback and the doc lines. Removing them from the files does not remove them from git history, so rotating is the part that matters.
2. **The Firebase deploy runs on every push** even though nothing uses it. See the options above.
3. `functions/` is shared by two systems: Firebase Functions (`index.js`) and Cloudflare Pages Functions (`api/`). It works, but it's confusing. If Firebase is retired, move or delete `index.js`.
4. `admin/config.yml` points at the wrong repo and is unused.
5. The admin is protected by a username allow-list in client-side code plus the token itself. The real security boundary is the GitHub token, so keep tokens short-lived and scoped to this repo.

---

## Old docs
Written during earlier phases and **not** reliable for today's setup: `FIREBASE*`, `FIRESTORE-*`, `WHY-NO-POSTS.md`, `MIGRATION-*`, `CLOUDINARY-*`, `RECOVERY-SUMMARY.md`, `UPDATES-SUMMARY.md`, `GITHUB-OAUTH-SETUP.md`, `SVELTIA-SETUP-GUIDE.md`, `PRODUCTION-DEPLOYMENT.md`, `ADMIN-EDITORS-PLAN.md`. Still useful: `CLAUDE.md` (project conventions, though its data-source section predates the JSON move), `NAVIGATION-SYSTEM-README.md`, `workers/README.md`, `admin/*-README.md`. Reading them for history is fine. Don't follow their setup steps without checking against this file.

---

## Contact
hey@chompchomp.cc · orders@chompchomp.cc

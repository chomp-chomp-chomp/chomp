/** Shared helpers for the member board API (not a route: exports no onRequest). */

// Keep field keys in sync with TYPES in member/index.html.
export const TYPES = {
  note: [],
  event: ['date', 'time', 'location'],
  link: ['url'],
};

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

export const validId = (id) => /^[a-z0-9]{1,16}-[a-z0-9]{1,16}$/.test(id || '');
export const newId = () =>
  Date.now().toString(36) + '-' + crypto.randomUUID().replace(/-/g, '').slice(0, 8);

export const clip = (v, n) => String(v ?? '').trim().slice(0, n);

export function needKV(env) {
  return env.MEMBER_KV ? null : json({ error: 'MEMBER_KV binding missing' }, 503);
}

export async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

/** Validate and normalise entry input. Returns { value } or { error }. */
export function cleanEntry(input, type) {
  if (!input || typeof input !== 'object') return { error: 'Bad request' };
  if (!(type in TYPES)) return { error: 'Unknown type' };
  const title = clip(input.title, 120);
  if (!title) return { error: 'Title required' };
  const fields = {};
  for (const f of TYPES[type]) {
    const v = clip(input.fields && input.fields[f], 200);
    if (f === 'url' && !/^https?:\/\/\S+$/i.test(v)) return { error: 'URL must start with http:// or https://' };
    if (f === 'date' && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) return { error: 'Bad date' };
    fields[f] = v;
  }
  return { value: { title, body: clip(input.body, 20000), fields, pinned: !!input.pinned } };
}

/** Small summary stored as KV metadata so the list needs no per-entry reads (1 KB limit). */
export const metaOf = (e) => ({
  t: e.title.slice(0, 120), k: e.type, a: e.author, c: e.created, u: e.updated, p: e.pinned ? 1 : 0,
  d: e.fields.date || '',
});
export const summaryOf = (id, m) => ({
  id, title: m.t, type: m.k, author: m.a, created: m.c, updated: m.u, pinned: !!m.p, date: m.d,
});

// ---- identity -------------------------------------------------------------
// Authors are stored as seat ids ("1".."12" or "admin") and shown by seat title.
export const ADMIN_LABEL = 'THE AUTHOR';
export const canTouch = (user, authorId) => user.admin || user.id === authorId;

// ---- "The Twelve" page ------------------------------------------------------
// Plain text, edited by the admin in the page. Blocks are separated by blank lines:
//   blocks before the first SEAT = opening, SEAT blocks (and one optional "AUTHOR ≃ TITLE" block)
//   = entries, blocks after = closing.
export const DEFAULT_ABOUT = `THE CATALAN TWELVE ≃ MEMBERS

Twelve seats. No names. The ledger is kept by hand, and the hand is not here.

SEAT 1 ≃ THE COLD HAND
Ledger: Not recorded ≃ Seal: Not verified
Keep the fat cold. Everything else follows.

SEAT 2 ≃ THE LONG REST
Ledger: Not recorded ≃ Seal: Not verified
The dough remembers longer than the baker does.

SEAT 3 ≃ THE FEEL
Ledger: Not recorded ≃ Seal: Not verified
Doneness is something the hands know first.

SEAT 4 ≃ THE LOCAL NAME
Ledger: Recorded under another name ≃ Seal: Not verified
Called whatever the table will accept.

SEAT 5 ≃ THE OPEN DOOR
Ledger: Disputed ≃ Seal: Not verified
A door, not a room.

SEAT 6 ≃ THE MISSING PAGE
Ledger: Gap ≃ Seal: Not verified
Some years are not in the ledger. Do not ask which.

SEAT 7 ≃ THE SOOT
Ledger: Stained ≃ Seal: Not verified
What the fire keeps, it keeps.

SEAT 8 ≃ THE SANDING SUGAR
Ledger: Partly recorded ≃ Seal: Not verified
Purple, green, gold. One feast, three witnesses.

SEAT 9 ≃ THE TALLY
Ledger: Recount in progress ≃ Seal: Not verified
Counted twice. Agreed once.

SEAT 10 ≃ THE HEEL OF THE LOAF
Ledger: Not recorded ≃ Seal: Not verified
Whoever eats the heel knows.

SEAT 11 ≃ THE MARGIN
Ledger: Annotated in red ink ≃ Seal: Not verified
Written beside, never in.

SEAT 12 ≃ THE SEAL
Ledger: Not recorded ≃ Seal: Unverified, present
It was here before the paper.

AUTHOR ≃ THE AUTHOR
Ledger: Held in the other hand ≃ Seal: Withheld
Writes it down afterward. Is never in the room when it happens.

There is no secret. The secret is waiting.

No charter survives. This page is not one.
Seats are held, not granted. Inquire at any table.`;

/** Parse the page text into { header, seats, footer } (each paragraph is an array of lines), or { error }. */
export function parseAbout(text) {
  const blocks = String(text).replace(/\r/g, '').split(/\n\s*\n/)
    .map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean)).filter((b) => b.length);
  const header = [], seats = [], footer = [];
  for (const lines of blocks) {
    const m = lines[0].match(/^(?:SEAT\s+(\d{1,2})|(AUTHOR))\s*[≃≈~:\-–—]\s*(.+)$/i);
    if (!m) { (seats.length ? footer : header).push(lines); continue; }
    const n = m[2] ? 'admin' : Number(m[1]);
    if (n !== 'admin' && (n < 1 || n > 12)) return { error: `Seat ${n}: seats run from 1 to 12.` };
    if (seats.some((s) => s.n === n)) return { error: `${n === 'admin' ? 'The AUTHOR entry' : 'Seat ' + n} appears twice.` };
    let rest = lines.slice(1), ledger = '', seal = '';
    const lm = rest[0] && rest[0].match(/^Ledger:\s*(.*?)\s*[≃≈~]\s*Seal:\s*(.*)$/i);
    if (lm) { ledger = lm[1]; seal = lm[2]; rest = rest.slice(1); }
    seats.push({ n, title: m[3].trim().slice(0, 60), ledger, seal, lines: rest });
  }
  return { header, seats, footer };
}

/** Load the page (KV copy or default) plus parsed form and author labels. */
export async function loadAbout(env) {
  const saved = await env.MEMBER_KV.get('about', 'json');
  const text = saved ? saved.text : DEFAULT_ABOUT;
  let parsed = parseAbout(text);
  if (parsed.error) parsed = parseAbout(DEFAULT_ABOUT);
  const labels = { admin: ADMIN_LABEL };
  for (const s of parsed.seats) labels[s.n] = s.title;
  return { text, updated: saved ? saved.updated : 0, parsed, labels };
}

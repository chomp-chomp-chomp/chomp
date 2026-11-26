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

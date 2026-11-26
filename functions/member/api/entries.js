/**
 * /member/api/entries
 *   GET  -> { entries: [summary...] }
 *   POST { type, title, body, fields } -> the new entry (author = logged-in seat)
 * Auth is enforced by ../_middleware.js. Needs the MEMBER_KV binding.
 * KV keys: e:<id> = entry (summary in metadata), r:<id> = replies array.
 */
import { json, needKV, readJson, cleanEntry, newId, metaOf, summaryOf } from '../_lib/board.js';

export async function onRequest({ request, env, data }) {
  const bad = needKV(env);
  if (bad) return bad;

  if (request.method === 'GET') {
    const entries = [];
    let cursor;
    for (let i = 0; i < 5; i++) {
      const page = await env.MEMBER_KV.list({ prefix: 'e:', cursor });
      for (const k of page.keys) if (k.metadata) entries.push(summaryOf(k.name.slice(2), k.metadata));
      if (page.list_complete) break;
      cursor = page.cursor;
    }
    return json({ entries });
  }

  if (request.method === 'POST') {
    const input = await readJson(request);
    const { value, error } = cleanEntry(input, input && input.type);
    if (error) return json({ error }, 400);
    const now = Date.now();
    const entry = { id: newId(), type: input.type, ...value, pinned: false, author: data.user.id, created: now, updated: now };
    await env.MEMBER_KV.put('e:' + entry.id, JSON.stringify(entry), { metadata: metaOf(entry) });
    return json(entry, 201);
  }

  return json({ error: 'Method not allowed' }, 405);
}

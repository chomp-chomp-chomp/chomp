/**
 * /member/api/entries/:id
 *   GET    -> { entry, replies }
 *   PUT    { title, body, fields, pinned, author, base } -> entry. `base` is the
 *          `updated` value the client last saw; a mismatch returns 409 + current.
 *   DELETE -> removes the entry and its replies
 */
import { json, needKV, readJson, cleanEntry, clip, validId, metaOf } from '../../_lib/board.js';

export async function onRequest({ request, env, params }) {
  const bad = needKV(env);
  if (bad) return bad;
  const id = params.id;
  if (!validId(id)) return json({ error: 'Bad id' }, 400);

  const entry = await env.MEMBER_KV.get('e:' + id, 'json');
  if (!entry) return json({ error: 'Not found' }, 404);

  if (request.method === 'GET') {
    const replies = (await env.MEMBER_KV.get('r:' + id, 'json')) || [];
    return json({ entry, replies });
  }

  if (request.method === 'PUT') {
    const input = await readJson(request);
    if (input && input.base !== entry.updated) return json({ error: 'Changed by someone else', entry }, 409);
    const { value, error } = cleanEntry(input, entry.type);
    if (error) return json({ error }, 400);
    const next = { ...entry, ...value, editedBy: clip(input.author, 40) || entry.author, updated: Date.now() };
    await env.MEMBER_KV.put('e:' + id, JSON.stringify(next), { metadata: metaOf(next) });
    return json(next);
  }

  if (request.method === 'DELETE') {
    await env.MEMBER_KV.delete('e:' + id);
    await env.MEMBER_KV.delete('r:' + id);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}

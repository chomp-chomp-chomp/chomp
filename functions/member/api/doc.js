/**
 * /member/api/doc - the shared member document, stored in Workers KV.
 * Auth is enforced by ../_middleware.js. Needs a KV binding named MEMBER_KV.
 *
 * GET -> { text, updated }
 * PUT { text, base } -> { updated }. `base` is the `updated` value the client
 *   last saw; if someone else saved since, responds 409 with the current doc.
 */

const KEY = 'member:doc';
const MAX_BYTES = 200 * 1024;
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

async function load(env) {
  return (await env.MEMBER_KV.get(KEY, 'json')) || { text: '', updated: 0 };
}

export async function onRequest({ request, env }) {
  if (!env.MEMBER_KV) return json({ error: 'MEMBER_KV binding missing' }, 503);

  if (request.method === 'GET') return json(await load(env));

  if (request.method === 'PUT') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Bad JSON' }, 400); }
    if (typeof body.text !== 'string') return json({ error: 'text required' }, 400);
    if (new TextEncoder().encode(body.text).length > MAX_BYTES) return json({ error: 'Too large (200 KB max)' }, 413);

    const current = await load(env);
    if (current.updated && body.base !== current.updated) {
      return json({ error: 'Changed by someone else', current }, 409);
    }
    const doc = { text: body.text, updated: Date.now() };
    await env.MEMBER_KV.put(KEY, JSON.stringify(doc));
    return json({ updated: doc.updated });
  }

  return json({ error: 'Method not allowed' }, 405);
}

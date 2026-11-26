/**
 * /member/api/about - the "Catalan Twelve" page text and who is logged in.
 *   GET -> { text, parsed, labels, me: { id, admin } }
 *   PUT { text } -> same shape (admin only). Rejected if the text can't be parsed.
 */
import { json, needKV, readJson, loadAbout, parseAbout } from '../_lib/board.js';

export async function onRequest({ request, env, data }) {
  const bad = needKV(env);
  if (bad) return bad;
  const me = data.user;

  if (request.method === 'PUT') {
    if (!me.admin) return json({ error: 'Only the author can edit this page' }, 403);
    const input = await readJson(request);
    const text = String((input && input.text) || '').trim();
    if (!text) return json({ error: 'Page text is empty' }, 400);
    if (text.length > 20000) return json({ error: 'Too long' }, 413);
    const parsed = parseAbout(text);
    if (parsed.error) return json({ error: parsed.error }, 400);
    await env.MEMBER_KV.put('about', JSON.stringify({ text, updated: Date.now() }));
  } else if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const about = await loadAbout(env);
  return json({ ...about, me: { id: me.id, admin: me.admin } });
}

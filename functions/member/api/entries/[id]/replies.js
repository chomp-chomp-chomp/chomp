/**
 * /member/api/entries/:id/replies
 *   POST   { author, body } -> the new reply
 *   DELETE ?rid=<reply id>  -> removes that reply
 * Replies live in one KV key per entry (read-modify-write). Two replies landing
 * in the same instant could lose one; fine for a small member board.
 */
import { json, needKV, readJson, clip, validId, newId } from '../../../_lib/board.js';

const MAX_REPLIES = 500;

export async function onRequest({ request, env, params }) {
  const bad = needKV(env);
  if (bad) return bad;
  const id = params.id;
  if (!validId(id)) return json({ error: 'Bad id' }, 400);
  if (!(await env.MEMBER_KV.get('e:' + id))) return json({ error: 'Not found' }, 404);
  const key = 'r:' + id;
  const replies = (await env.MEMBER_KV.get(key, 'json')) || [];

  if (request.method === 'POST') {
    const input = await readJson(request);
    const author = clip(input && input.author, 40);
    const body = clip(input && input.body, 2000);
    if (!author) return json({ error: 'Name required' }, 400);
    if (!body) return json({ error: 'Reply is empty' }, 400);
    if (replies.length >= MAX_REPLIES) return json({ error: 'Reply limit reached' }, 413);
    const reply = { id: newId(), author, body, created: Date.now() };
    replies.push(reply);
    await env.MEMBER_KV.put(key, JSON.stringify(replies));
    return json(reply, 201);
  }

  if (request.method === 'DELETE') {
    const rid = new URL(request.url).searchParams.get('rid');
    const kept = replies.filter((r) => r.id !== rid);
    if (kept.length !== replies.length) await env.MEMBER_KV.put(key, JSON.stringify(kept));
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}

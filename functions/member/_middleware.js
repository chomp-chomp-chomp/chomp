/**
 * Password gate for everything under /member/ (page and API).
 * Cloudflare Pages Function middleware: runs before the static page is served.
 *
 * Each member has their own password, tied to a seat. Cloudflare dashboard >
 * Pages > (project) > Settings:
 *   Variables and secrets: MEMBER_PASSWORDS (type: Secret), comma-separated
 *       seat:password pairs, e.g.  1:abc123def456,2:...,12:...,admin:...
 *       Seats are 1-12; "admin" is the author (edits the Twelve page, can
 *       moderate). Passwords: 8+ characters, unique, no commas.
 *   Bindings: MEMBER_KV (KV namespace)
 *
 * The session cookie is signed with that seat's own password, so changing or
 * removing one password signs out only that member.
 * The logged-in identity is passed to the API as context.data.user.
 */

const COOKIE = 'member_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const enc = new TextEncoder();

async function hmacHex(key, message) {
  const k = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function passwordMatches(input, password) {
  // Compare HMACs so length and timing don't leak anything about the password.
  const [a, b] = await Promise.all([hmacHex('member-pw', input), hmacHex('member-pw', password)]);
  return safeEqual(a, b);
}

/** Parse MEMBER_PASSWORDS into a Map(id -> password), or { error }. */
function parsePasswords(raw) {
  const map = new Map();
  for (const item of String(raw || '').split(',')) {
    if (!item.trim()) continue;
    const i = item.indexOf(':');
    const id = item.slice(0, i).trim().toLowerCase();
    const pw = item.slice(i + 1).trim();
    if (i < 0 || !/^(1[0-2]|[1-9]|admin)$/.test(id)) return { error: 'bad seat id in MEMBER_PASSWORDS' };
    if (map.has(id)) return { error: 'duplicate seat ' + id };
    if (pw.length < 8) return { error: 'password too short for seat ' + id };
    map.set(id, pw);
  }
  if (!map.size) return { error: 'MEMBER_PASSWORDS is empty' };
  if (new Set(map.values()).size !== map.size) return { error: 'two seats share a password' };
  return { map };
}

async function makeSession(id, password) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${id}.${await hmacHex(password, `member:${id}:${exp}`)}`;
}

/** Returns the seat id for a valid session cookie, else null. */
async function sessionId(request, passwords) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
  if (!m) return null;
  const [exp, id, sig] = m[1].split('.');
  const password = passwords.get(id);
  if (!password || !exp || !sig || Number(exp) < Date.now() / 1000) return null;
  return safeEqual(sig, await hmacHex(password, `member:${id}:${exp}`)) ? id : null;
}

function cookie(value, maxAge) {
  return `${COOKIE}=${value}; Path=/member; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

const baseHeaders = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

function loginPage(error) {
  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Members · Chomp Chomp</title>
<style>
  :root { --bg:#fdfdfd; --text:#353535; --muted:#666; --accent:#e73b42; --border:#e0e0e0; --panel:#f5f5f5; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#231f1f; --text:#d9d4d4; --muted:#a0a0a0; --accent:#ff6b7a; --border:#3b3636; --panel:#2b2626; }
  }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; padding:16px;
    font:15px/1.5 Inter, system-ui, sans-serif; background:var(--bg); color:var(--text); }
  form { width:100%; max-width:340px; background:var(--panel); border:1px solid var(--border);
    border-radius:8px; padding:20px; }
  h1 { font-size:1.2em; font-weight:600; margin:0 0 14px; }
  input { width:100%; padding:9px 10px; font:inherit; color:var(--text); background:var(--bg);
    border:1px solid var(--border); border-radius:6px; }
  button { margin-top:12px; width:100%; font:inherit; padding:9px; border-radius:6px; cursor:pointer;
    border:1px solid var(--accent); background:var(--accent); color:#fff; }
  .err { color:var(--accent); font-size:.85em; margin:0 0 10px; }
</style></head><body>
<form method="POST" action="/member/login">
  <h1>Members</h1>
  ${error ? '<p class="err">Wrong password.</p>' : ''}
  <input type="password" name="password" placeholder="Password" autocomplete="current-password" autofocus required>
  <button type="submit">Enter</button>
</form></body></html>`;
  return new Response(html, {
    status: error ? 401 : 200,
    headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export async function onRequest(context) {
  const { request, env, next, data } = context;
  const url = new URL(request.url);

  const parsed = parsePasswords(env.MEMBER_PASSWORDS);
  if (parsed.error) {
    console.error('Member area misconfigured:', parsed.error);
    return new Response('Member area is not configured correctly.', { status: 503, headers: baseHeaders });
  }
  const passwords = parsed.map;

  if (url.pathname === '/member/login' && request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const given = form ? String(form.get('password') || '') : '';
    let who = null;
    for (const [id, pw] of passwords) {
      if (await passwordMatches(given, pw)) who = id; // no early exit: same work either way
    }
    if (who) {
      return new Response(null, {
        status: 303,
        headers: { ...baseHeaders, Location: '/member/', 'Set-Cookie': cookie(await makeSession(who, passwords.get(who)), MAX_AGE) },
      });
    }
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return loginPage(true);
  }

  if (url.pathname === '/member/logout' && request.method === 'POST') {
    return new Response(null, {
      status: 303,
      headers: { ...baseHeaders, Location: '/member/', 'Set-Cookie': cookie('', 0) },
    });
  }

  const id = await sessionId(request, passwords);
  if (id) {
    data.user = { id, admin: id === 'admin' };
    const res = await next();
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(baseHeaders)) out.headers.set(k, v);
    return out;
  }

  if (url.pathname.startsWith('/member/api/')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...baseHeaders, 'Content-Type': 'application/json' },
    });
  }
  return loginPage(false);
}

/**
 * Password gate for everything under /member/ (page and API).
 * Cloudflare Pages Function middleware: runs before the static page is served.
 *
 * Cloudflare dashboard > Pages > (project) > Settings:
 *   Variables and secrets: MEMBER_PASSWORD  (type: Secret) - the shared password
 *   Bindings:              MEMBER_KV        (KV namespace)  - used by api/doc.js
 *
 * Sessions are an HMAC-signed cookie keyed on the password, so changing
 * MEMBER_PASSWORD signs everyone out.
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

async function makeSession(password) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return `${exp}.${await hmacHex(password, 'member:' + exp)}`;
}

async function isAuthed(request, password) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([^;]+)'));
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmacHex(password, 'member:' + exp));
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
  const { request, env, next } = context;
  const url = new URL(request.url);
  const password = env.MEMBER_PASSWORD;

  if (!password) {
    return new Response('Member area is not configured (MEMBER_PASSWORD missing).', { status: 503, headers: baseHeaders });
  }

  if (url.pathname === '/member/login' && request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const given = form ? String(form.get('password') || '') : '';
    if (await passwordMatches(given, password)) {
      return new Response(null, {
        status: 303,
        headers: { ...baseHeaders, Location: '/member/', 'Set-Cookie': cookie(await makeSession(password), MAX_AGE) },
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

  if (await isAuthed(request, password)) {
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

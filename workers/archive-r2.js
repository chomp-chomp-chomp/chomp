/**
 * Cloudflare Worker for the /archive R2 bucket.
 * Serves file listing + downloads publicly, gates uploads/deletes behind a
 * bearer token so the admin panel doesn't need a GitHub PAT in the browser.
 *
 * Setup:
 * 1. Create an R2 bucket (e.g. "chomp-archive") in the Cloudflare dashboard.
 * 2. Create a Worker, paste this file in, and deploy.
 * 3. Worker Settings > Bindings > R2 Bucket:
 *      Variable name: ARCHIVE_BUCKET  ->  bucket: chomp-archive
 * 4. Worker Settings > Variables > Secret:
 *      ARCHIVE_ADMIN_TOKEN  -> any long random string (this is your admin password)
 * 5. Note the deployed URL (https://archive-r2.YOUR-SUBDOMAIN.workers.dev)
 *    and put it into archive/index.html and admin/archive-admin.html.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function isAuthorized(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  return Boolean(token) && Boolean(env.ARCHIVE_ADMIN_TOKEN) && token === env.ARCHIVE_ADMIN_TOKEN;
}

async function handleList(url, env) {
  const rawPrefix = url.searchParams.get('path') || '';
  const prefix = rawPrefix ? rawPrefix.replace(/\/?$/, '/') : '';

  const listed = await env.ARCHIVE_BUCKET.list({ prefix, delimiter: '/' });

  const dirs = (listed.delimitedPrefixes || []).map((p) => ({
    name: p.slice(prefix.length).replace(/\/$/, ''),
    path: p.replace(/\/$/, ''),
    type: 'dir',
  }));

  const files = listed.objects
    .filter((o) => o.key !== prefix)
    .map((o) => ({
      name: o.key.slice(prefix.length),
      path: o.key,
      type: 'file',
      size: o.size,
    }));

  return json({ entries: [...dirs, ...files] });
}

async function handleGetFile(key, env) {
  const obj = await env.ARCHIVE_BUCKET.get(key);
  if (!obj) return json({ error: 'Not found' }, 404);

  const headers = new Headers(CORS_HEADERS);
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  return new Response(obj.body, { headers });
}

async function handlePutFile(key, request, env) {
  if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);

  const contentType = request.headers.get('Content-Type') || 'application/octet-stream';
  await env.ARCHIVE_BUCKET.put(key, request.body, {
    httpMetadata: { contentType },
  });
  return json({ ok: true, key });
}

async function handleDeleteFile(key, request, env) {
  if (!isAuthorized(request, env)) return json({ error: 'Unauthorized' }, 401);

  await env.ARCHIVE_BUCKET.delete(key);
  return json({ ok: true, key });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/list' && request.method === 'GET') {
        return handleList(url, env);
      }

      if (url.pathname === '/whoami' && request.method === 'GET') {
        return isAuthorized(request, env) ? json({ ok: true }) : json({ error: 'Unauthorized' }, 401);
      }

      if (url.pathname.startsWith('/file/')) {
        const key = decodeURIComponent(url.pathname.slice('/file/'.length));
        if (!key) return json({ error: 'Missing file key' }, 400);

        if (request.method === 'GET') return handleGetFile(key, env);
        if (request.method === 'PUT') return handlePutFile(key, request, env);
        if (request.method === 'DELETE') return handleDeleteFile(key, request, env);
      }

      return json({ error: 'Not found' }, 404);
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};

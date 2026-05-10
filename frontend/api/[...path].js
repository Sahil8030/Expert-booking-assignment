/**
 * Proxies /api/* to your Express server. Set BACKEND_URL in Vercel (server env only).
 * Example: BACKEND_URL=https://your-app.onrender.com
 */
export default async function handler(req, res) {
  const backend = process.env.BACKEND_URL?.trim()?.replace(/\/$/, '');
  if (!backend) {
    res.status(500).json({
      message:
        'Missing BACKEND_URL. In Vercel → Settings → Environment Variables, set BACKEND_URL to your API origin (no trailing slash), e.g. https://your-api.onrender.com',
    });
    return;
  }

  try {
    const host = req.headers.host || 'localhost';
    const url = new URL(req.url || '/', `http://${host}`);
    let rest = '';
    const q = req.query?.path;
    if (q != null && q !== '') {
      rest = Array.isArray(q) ? q.join('/') : String(q);
    } else {
      const match = url.pathname.match(/^\/api(?:\/(.*))?$/);
      rest = match?.[1] ?? '';
    }
    const targetUrl = `${backend}/api/${rest}${url.search}`;

    const headers = new Headers();
    const forward = ['content-type', 'accept', 'authorization', 'cookie'];
    for (const name of forward) {
      const v = req.headers[name];
      if (v) headers.set(name, Array.isArray(v) ? v[0] : v);
    }

    const init = {
      method: req.method,
      headers,
      redirect: 'manual',
    };

    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.body != null) {
      init.body =
        typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!headers.has('content-type')) {
        headers.set('content-type', 'application/json');
      }
    }

    const upstream = await fetch(targetUrl, init);
    const buf = Buffer.from(await upstream.arrayBuffer());
    const ct = upstream.headers.get('content-type');
    res.status(upstream.status);
    if (ct) res.setHeader('content-type', ct);
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: 'Bad gateway', detail: String(err?.message || err) });
  }
}

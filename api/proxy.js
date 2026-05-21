export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const fetchRes = await fetch(url, {
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    // Copy over headers but strip restrictive ones
    fetchRes.headers.forEach((val, key) => {
      const lowerKey = key.toLowerCase();
      // Remove headers that prevent iframe embedding or cross-origin access
      if (!['x-frame-options', 'content-security-policy', 'content-security-policy-report-only', 'clear-site-data', 'cross-origin-opener-policy'].includes(lowerKey)) {
        res.setHeader(key, val);
      }
    });

    // Enable CORS
    res.setHeader('access-control-allow-origin', '*');

    const arrayBuffer = await fetchRes.arrayBuffer();
    const contentType = fetchRes.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      let html = Buffer.from(arrayBuffer).toString('utf-8');
      
      try {
        const origin = new URL(url).origin;
        const baseTag = `<base href="${origin}/">`;
        const interceptScript = `
          <script>
            window.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href && !link.href.startsWith('javascript:')) {
                e.preventDefault();
                window.parent.postMessage({ type: 'PROXY_NAVIGATE', url: link.href }, '*');
                window.location.href = '/api/proxy?url=' + encodeURIComponent(link.href);
              }
            }, true);
            window.addEventListener('submit', function(e) {
              e.preventDefault();
              const form = e.target;
              let actionUrl = form.action || window.location.href;
              const urlObj = new URL(actionUrl, window.location.href);
              if (form.method.toLowerCase() === 'get') {
                const formData = new FormData(form);
                const searchParams = new URLSearchParams(formData);
                urlObj.search = searchParams.toString();
              }
              window.parent.postMessage({ type: 'PROXY_NAVIGATE', url: urlObj.toString() }, '*');
              window.location.href = '/api/proxy?url=' + encodeURIComponent(urlObj.toString());
            }, true);
          </script>
        `;

        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${baseTag}${interceptScript}`);
        } else {
          html = baseTag + interceptScript + html;
        }
      } catch (e) {}

      res.status(fetchRes.status).send(html);
    } else {
      const buffer = Buffer.from(arrayBuffer);
      res.status(fetchRes.status).send(buffer);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

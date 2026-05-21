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

    // Read response body as buffer and send it
    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.status(fetchRes.status).send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

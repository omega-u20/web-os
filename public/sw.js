let tunnelActive = false;
let proxyUrl = '';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('[Tunnel Server] Service Worker Installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  console.log('[Tunnel Server] Service Worker Activated & Running');
});

// Listen for state changes from the UI
self.addEventListener('message', (event) => {
  if (event.data.type === 'TUNNEL_STATE') {
    tunnelActive = event.data.active;
    proxyUrl = event.data.proxyUrl;
    console.log(`[Tunnel Server] State Updated: ${tunnelActive ? 'ACTIVE' : 'INACTIVE'} via ${proxyUrl}`);
  }
});

// Intercept fetches (Experimental: Global Proxy)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only proxy external requests if tunnel is active
  if (tunnelActive && !url.origin.includes(location.origin)) {
    console.log(`[Tunnel Server] Proxying request: ${url.href}`);
    
    // Construct the proxied URL
    const finalProxyUrl = proxyUrl.endsWith('/') ? `${proxyUrl}${url.href}` : `${proxyUrl}/${url.href}`;
    
    event.respondWith(
      fetch(finalProxyUrl, {
        method: event.request.method,
        headers: event.request.headers,
        mode: 'cors'
      }).catch(err => {
        console.error('[Tunnel Server] Proxy Error:', err);
        return fetch(event.request); // Fallback to direct if proxy fails
      })
    );
  }
});

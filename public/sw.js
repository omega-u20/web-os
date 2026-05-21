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
  
  // 1. Never proxy internal assets or the OS itself
  if (url.origin.includes(location.origin)) return;

  // 2. Recursion Guard: If we're already routing this specific request, don't double-proxy
  if (url.href.includes('stunnel-proxy=true')) return;

  // 3. Only proxy external requests if tunnel is active
  if (tunnelActive && proxyUrl) {
    const separator = proxyUrl.includes('?') ? '&' : '?';
    const finalProxyUrl = proxyUrl.endsWith('/') 
      ? `${proxyUrl}${url.href}${separator}stunnel-proxy=true` 
      : `${proxyUrl}/${url.href}${separator}stunnel-proxy=true`;
    
    event.respondWith(
      fetch(finalProxyUrl, {
        method: event.request.method,
        headers: event.request.headers,
        mode: 'cors'
      }).then(response => {
        // Strip security headers that block iframes
        const newHeaders = new Headers(response.headers);
        
        // Remove ALL possible frame-blocking headers
        newHeaders.delete('X-Frame-Options');
        newHeaders.delete('Content-Security-Policy');
        newHeaders.delete('Content-Security-Policy-Report-Only');
        newHeaders.set('Access-Control-Allow-Origin', '*');
        
        // Some sites use frame-ancestors in CSP, we already deleted CSP but just in case
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders
        });
      }).catch(err => {
        console.error('[Tunnel Server] Routing Error:', err);
        return fetch(event.request); 
      })
    );
  }
});

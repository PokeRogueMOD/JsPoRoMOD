// Prevent cache for mod.min.js
self.addEventListener('install', event => {
    self.skipWaiting();
  });
  
  self.addEventListener('fetch', event => {
    const url = event.request.url;
    if (url.includes('mod.min.js') || url.includes('index.html')) {
      event.respondWith(fetch(event.request));
    }
  });
  
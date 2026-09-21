var CACHE = 'gcprep-pc-v5';
self.addEventListener('install', function (e) {
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(e.request).then(function (hit) {
        var net = fetch(e.request).then(function (res) {
          if (res && res.status === 200 && res.type === 'basic') {
            try { c.put(e.request, res.clone()); } catch (err) {}
          }
          return res;
        }).catch(function () { return hit; });
        return hit || net;
      });
    }).catch(function () { return fetch(e.request); })
  );
});




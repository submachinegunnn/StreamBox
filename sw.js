self.addEventListener('install',e=>{
e.waitUntil(caches.open('streambox').then(c=>c.addAll(['/','/styles.css','/app.js'])));
});
self.addEventListener('fetch',e=>{
e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});

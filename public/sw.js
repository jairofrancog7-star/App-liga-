/* V1072: evitar que la PWA Android conserve estilos y módulos obsoletos. */
const CACHE='liga-juventino-v1072-quiz-no-stale';
const CORE=['./','./index.html','./manifest.webmanifest','./brand-neon-header.svg','./profile-reference.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(CORE))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin||event.request.headers.has('Authorization')||new URL(event.request.url).pathname.includes('/api/')) return;
  event.respondWith(
    fetch(event.request,{cache:'no-store'})
      .then(response=>{
        if(!response.ok)return response;
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
        return response;
      })
      .catch(()=>caches.match(event.request).then(r=>r||(event.request.mode==='navigate'?caches.match('./index.html'):Response.error())))
  );
});

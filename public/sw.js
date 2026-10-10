/* V1072: evitar que la PWA Android conserve estilos y módulos obsoletos. */
const CACHE='liga-juventino-v1130-referee-ready';
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
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&!k.startsWith('ljr-referee-offline-')).map(k=>caches.delete(k))))
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


/* V1073 news notifications: display only when permission has been granted.
   Delivery while the app is closed needs a separate Web Push server/subscription. */
self.addEventListener('push',function(event){
  if(!event.data)return;
  event.waitUntil((async function(){
    var payload={};
    try{payload=event.data.json()}catch(_){payload={body:event.data.text()}}
    var title=String(payload.title||'Liga Juventino Rosas').slice(0,130);
    var body=String(payload.body||'Nuevo aviso de la Liga').slice(0,400);
    var route=String(payload.route||'news').replace(/[^a-zA-Z0-9_-]/g,'');
    await self.registration.showNotification(title,{body:body,icon:'./assets/liga-logo.webp',tag:'liga-'+route,data:{url:new URL('./#/'+route,self.registration.scope).href}});
  })());
});
self.addEventListener('notificationclick',function(event){
  event.notification.close();
  event.waitUntil((async function(){
    var fallback=new URL('./#/news',self.registration.scope).href;
    var raw=event.notification.data&&event.notification.data.url||fallback;
    var url;
    try{url=new URL(raw,self.registration.scope)}catch(_){url=new URL(fallback)}
    if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))url=new URL(fallback);
    var tabs=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(var i=0;i<tabs.length;i++){if(tabs[i].url.startsWith(self.registration.scope)){await tabs[i].focus();tabs[i].navigate(url.href);return}}
    if(clients.openWindow)await clients.openWindow(url.href);
  })());
});

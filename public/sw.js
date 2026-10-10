/* V1230 — cache móvil global conservadora.
   PWA / Web Push: HTML y datos oficiales siempre intentan la red;
   solamente assets versionados (JS/CSS) usan cache-first.
   No intercepta endpoints API, peticiones privadas ni otros dominios. */
const CACHE='liga-juventino-v1230-mobile-fast';
const CORE=['./','./index.html','./manifest.webmanifest','./brand-neon-header.svg','./profile-reference.svg'];
const LIMIT=250,MAX_SIZE=750000;
let writes=0;
let prunePromise=Promise.resolve();

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&!k.startsWith('ljr-referee-offline-')).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
function isAsset(url){
  // Las versiones ?v=... y las compilaciones con hash evitan CSS/JS antiguos.
  if(!/\.(?:js|css)$/i.test(url.pathname))return false;
  return url.searchParams.has('v')||/[-.][\da-f]{8,}\.(?:js|css)$/i.test(url.pathname);
}
function cacheable(response){
  if(!response||!response.ok||response.type==='opaque')return false;
  const length=Number(response.headers.get('content-length')||0);
  return !length||length<=MAX_SIZE;
}
async function saveAsset(request,response){
  if(!cacheable(response))return;
  try{
    const cache=await caches.open(CACHE);
    await cache.put(request,response.clone());
    if(++writes%24===0){
      prunePromise=prunePromise.then(async()=>{
        const keys=await cache.keys();
        const excess=keys.length-LIMIT;
        if(excess>0)await Promise.all(keys.slice(0,excess).map(key=>cache.delete(key)));
      }).catch(()=>{});
      await prunePromise;
    }
  }catch(_){}
}
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||request.headers.has('Authorization'))return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin||url.pathname.includes('/api/'))return;
  // HTML, resultados, usuarios y demás JSON siguen frescos (red primero).
  if(request.mode==='navigate'){
    event.respondWith(fetch(request,{cache:'no-cache'})
      .catch(()=>caches.match('./index.html').then(r=>r||Response.error())));
    return;
  }
  if(isAsset(url)){
    event.respondWith((async()=>{
      const cached=await caches.match(request);
      if(cached)return cached;
      try{
        const response=await fetch(request,{cache:'default'});
        if(cacheable(response))event.waitUntil(saveAsset(request,response));
        return response;
      }catch(_){return Response.error()}
    })());
    return;
  }
  // Imágenes, vídeos, documentos y datos oficiales: caché HTTP normal.
  // Evita descargas forzadas en cada visita; las versiones nuevas siguen accesibles.
  event.respondWith(fetch(request,{cache:'default'})
    .catch(()=>caches.match(request).then(r=>r||Response.error())));
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

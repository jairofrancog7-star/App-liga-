/* Quiz Arena: service worker exclusivo para avisos locales. Sin cache, push ni datos privados. */
'use strict';
self.addEventListener('install',()=>{self.skipWaiting()});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL('../#/quizArena',self.registration.scope).href;
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const base=new URL('../',self.registration.scope).pathname;
    const matched=windows.find(w=>{try{return new URL(w.url).pathname.startsWith(base)}catch(_){return false}});
    if(matched){
      await matched.focus();
      if(typeof matched.navigate==='function')await matched.navigate(target);
    }else if(self.clients.openWindow){
      await self.clients.openWindow(target);
    }
  })().catch(()=>{}));
});

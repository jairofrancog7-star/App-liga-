/* V1073: notificaciones meteorologicas locales; no cache ni push ni avisos oficiales. */
'use strict';
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('notificationclick',function(event){
 event.notification.close();
 event.waitUntil((async function(){
  var base=new URL('../../',self.registration.scope);
  var target=new URL('#/venues',base).href;
  var clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  var match=clients.find(function(c){try{return new URL(c.url).pathname===base.pathname;}catch(_){return false;}});
  if(match){await match.focus();if(typeof match.navigate==='function')await match.navigate(target);}
  else if(self.clients.openWindow)await self.clients.openWindow(target);
 })().catch(function(){}));
});
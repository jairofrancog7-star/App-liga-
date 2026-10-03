import {Capacitor,registerPlugin} from '@capacitor/core';
window.LJR_ADMIN_BIOMETRIC=Capacitor.isNativePlatform()?registerPlugin('LigaBiometric'):null;

const adminRoutes=new Set(['publicationCenter','ligaControl','adminFut','jrControl','recruitment','refereeOffline','credentialBuilder','cedulaBuilder','agendaBuilder','motionHub','suspensionTool','bracketBuilder','disciplineTool','scheduleChanges']);
let opening=false;

function hasSavedAccess(){
 const media=window.LJR_MEDIA;
 if(media?.admin)return true;
 try{
   if(media?.hasSession?.())return true;
   if(media?.deviceRemembered?.())return true;
   return !!(localStorage.getItem('liga-media-session')||sessionStorage.getItem('liga-media-session'));
 }catch(_){return false}
}
function routeNow(route){
 if(window.LJR_MAIN_ROUTE?.go){window.LJR_MAIN_ROUTE.go(route);return}
 location.hash='#/'+route;
}
async function openAdminRoute(route){
 if(!adminRoutes.has(route)){routeNow(route);return true}
 const media=window.LJR_MEDIA;
 if(media?.admin){routeNow(route);return true}
 if(opening)return false;
 opening=true;
 try{
   if(hasSavedAccess()&&typeof media?.restoreAdminSession==='function'){
     const admin=await media.restoreAdminSession();
     if(admin){routeNow(route);return true}
   }
   await media?.login?.();
   return false;
 }catch(_){
   await media?.login?.();
   return false;
 }finally{opening=false}
}
function update(){
 const allowed=!!window.LJR_MEDIA?.admin||hasSavedAccess();
 document.querySelectorAll('[data-route]').forEach(button=>{
  if(adminRoutes.has(button.dataset.route)){
    button.classList.toggle('v612-admin-only',true);
    /* V623: a remembered device keeps its tools visible while the server
       restores the session. Do not hide every button during that short window. */
    button.hidden=!allowed;
    button.disabled=false;
    button.removeAttribute('aria-disabled');
  }
 });
}
document.addEventListener('click',event=>{
 const entry=event.target.closest('[data-liga-tools]');
 if(entry){
   event.preventDefault();event.stopImmediatePropagation();
   if(window.LJR_MEDIA?.admin)window.LJR_MEDIA.manage();
   else if(hasSavedAccess())window.LJR_MEDIA?.restoreAdminSession?.().then(a=>a?window.LJR_MEDIA.manage():window.LJR_MEDIA.login()).catch(()=>window.LJR_MEDIA?.login?.());
   else window.LJR_MEDIA?.login?.();
   return;
 }
 const button=event.target.closest('[data-route]');
 const route=button?.dataset?.route;
 if(button&&adminRoutes.has(route)&&!window.LJR_MEDIA?.admin){
   event.preventDefault();event.stopImmediatePropagation();
   openAdminRoute(route);
 }
},true);

window.addEventListener('liga:admin',()=>{update();window.LJR_MAIN_ROUTE?.render?.()});
window.addEventListener('hashchange',()=>setTimeout(update,80));
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(update).observe(screen,{childList:true,subtree:true});
update();
setTimeout(()=>{
 update();
 if(hasSavedAccess()&&!window.LJR_MEDIA?.admin)window.LJR_MEDIA?.restoreAdminSession?.().catch(()=>{});
},250);

window.LJR_ADMIN_ROUTE={routes:adminRoutes,open:openAdminRoute,hasSavedAccess};

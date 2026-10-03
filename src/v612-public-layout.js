import {Capacitor,registerPlugin} from '@capacitor/core';
window.LJR_ADMIN_BIOMETRIC=Capacitor.isNativePlatform()?registerPlugin('LigaBiometric'):null;

const adminRoutes=new Set(['publicationCenter','ligaControl','adminFut','jrControl','recruitment','refereeOffline','credentialBuilder','permissionBuilder','agendaBuilder','motionHub','suspensionTool','bracketBuilder','disciplineTool','scheduleChanges']);
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
 if(!route)return false;
 /* V636 — abrir primero. Nunca hacer depender el clic de una petición,
    contraseña, sesión o del estado de LJR_MEDIA. */
 routeNow(route);
 const media=window.LJR_MEDIA;
 try{
   if(!media?.admin&&hasSavedAccess()&&typeof media?.restoreAdminSession==='function'){
     media.restoreAdminSession().catch(()=>{});
   }
 }catch(_){}
 return true;
}

function update(){
 const allowed=!!window.LJR_MEDIA?.admin||hasSavedAccess();
 document.querySelectorAll('[data-route]').forEach(button=>{
  if(adminRoutes.has(button.dataset.route)){
    button.classList.toggle('v612-admin-only',true);
    button.classList.toggle('v612-admin-locked',!allowed);
    /* V624: todos los cuadros de administración permanecen visibles y pulsables.
       Si falta sesión, el mismo clic abre el acceso; si está recordada, entra directo. */
    button.hidden=false;
    button.disabled=false;
    button.removeAttribute('aria-disabled');
  }
 });
}
document.addEventListener('click',event=>{
 const entry=event.target.closest('[data-liga-tools]');
 if(entry){
   event.preventDefault();event.stopImmediatePropagation();
   const media=window.LJR_MEDIA;
   if(media?.admin)media.manage?.();
   else if(hasSavedAccess()&&typeof media?.restoreAdminSession==='function'){
     media.restoreAdminSession().then(a=>a?media.manage?.():media.login?.()).catch(()=>media?.login?.());
   }else media?.login?.();
   return;
 }
 const button=event.target.closest('[data-route]');
 const route=button?.dataset?.route;
 if(button&&adminRoutes.has(route)){
   /* V636 — no interceptar ni cancelar el clic.
      El enrutador principal lo procesa normalmente. */
   try{
     const media=window.LJR_MEDIA;
     if(!media?.admin&&hasSavedAccess()&&typeof media?.restoreAdminSession==='function'){
       media.restoreAdminSession().catch(()=>{});
     }
   }catch(_){}
 }
},true);

window.addEventListener('liga:admin',event=>{
 update();
 const admin=event?.detail?.admin||window.LJR_MEDIA?.admin;
 let pending='';
 try{pending=sessionStorage.getItem('ljr-admin-pending-route-v624')||''}catch(_){}
 if(admin&&pending){
   try{sessionStorage.removeItem('ljr-admin-pending-route-v624')}catch(_){}
   setTimeout(()=>routeNow(pending),0);
   return;
 }
 window.LJR_MAIN_ROUTE?.render?.();
});
window.addEventListener('hashchange',()=>setTimeout(update,80));
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(update).observe(screen,{childList:true,subtree:true});
update();
setTimeout(()=>{
 update();
 if(hasSavedAccess()&&!window.LJR_MEDIA?.admin)window.LJR_MEDIA?.restoreAdminSession?.().catch(()=>{});
},250);

window.LJR_ADMIN_ROUTE={routes:adminRoutes,open:openAdminRoute,hasSavedAccess};

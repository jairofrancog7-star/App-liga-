import {Capacitor,registerPlugin} from '@capacitor/core';
window.LJR_ADMIN_BIOMETRIC=Capacitor.isNativePlatform()?registerPlugin('LigaBiometric'):null;
const adminRoutes=new Set(['publicationCenter','ligaControl','adminFut','jrControl','recruitment','refereeOffline','credentialBuilder','cedulaBuilder','agendaBuilder','motionHub','suspensionTool','bracketBuilder','disciplineTool','scheduleChanges']);
function update(){
 document.querySelectorAll('[data-route]').forEach(button=>{
  if(adminRoutes.has(button.dataset.route)){button.classList.toggle('v612-admin-only',true);button.hidden=!window.LJR_MEDIA?.admin}
 });
}
document.addEventListener('click',event=>{
 const entry=event.target.closest('[data-liga-tools]');if(entry){event.preventDefault();event.stopImmediatePropagation();window.LJR_MEDIA?.manage();return}
 const button=event.target.closest('[data-route]');
 if(button&&adminRoutes.has(button.dataset.route)&&!window.LJR_MEDIA?.admin){event.preventDefault();event.stopImmediatePropagation();window.LJR_MEDIA?.login()}
},true);
window.addEventListener('liga:admin',()=>{update();window.LJR_MAIN_ROUTE?.render?.()});
window.addEventListener('hashchange',()=>setTimeout(update,100));
const screen=document.querySelector('#screen');if(screen)new MutationObserver(update).observe(screen,{childList:true});update();

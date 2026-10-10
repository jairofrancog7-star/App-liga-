/* V1160 — Centro de instalación unificado, público, sin permisos ni datos privados. */
(function(){
'use strict';
if(window.LJR_INSTALL_HUB)return;
const APK='https://github.com/jairofrancog7-star/App-liga-/releases/download/android-latest/Liga-Juventino.apk';
const RELEASE='https://github.com/jairofrancog7-star/App-liga-/releases/tag/android-latest';
const BUILD='https://github.com/jairofrancog7-star/App-liga-/actions/workflows/android-debug.yml';
const LOGO='./assets/branding/escudo-liga-camisetas-unificado-v1122.png';
const ua=navigator.userAgent||'';
const ios=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const android=/Android/i.test(ua);
const desktop=!ios&&!android;
let pendingPrompt=null,alreadyInstalled=false,lastFocus=null;
const standalone=()=>!!(window.matchMedia?.('(display-mode: standalone)')?.matches||navigator.standalone||alreadyInstalled);
const home=()=>location.origin+location.pathname+'#/home';
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(name,size=20)=>{
 // Icono Apple oficial: silueta rellena para evitar una manzana deformada.
 if(name==='apple')return '<svg class="ljr-install-apple-symbol" aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" style="fill:#fff;stroke:none" fill="#fff" stroke="none"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>';
 const paths={
 phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4"/><path d="M5 17v4h14v-4"/>',
 monitor:'<rect x="2" y="3" width="20" height="15" rx="2"/><path d="M8 22h8m-4-4v4"/>',
 check:'<path d="m5 12 5 5L20 7"/>',shield:'<path d="M12 2 20 5v6c0 5-3 8-8 11-5-3-8-6-8-11V5z"/><path d="m9 12 2 2 4-4"/>',
 share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 book:'<path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3z"/><path d="M4 5v15a3 3 0 0 1 3-3h13"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18m0-18c5 5 5 13 0 18"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a3 3 0 1 1 4.5 2.7C12.7 12.5 12 13 12 15m0 3h.01"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9a8 8 0 0 1 13-2l1.5 5M4 12l1.5 5a8 8 0 0 0 13-2"/>',
 close:'<path d="M5 5l14 14M19 5 5 19"/>'
 };
 return '<svg aria-hidden="true" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(paths[name]||paths.help)+'</svg>';
};
const MODES=[
 {id:'pwa',icon:'phone',name:'Instalar PWA',detail:'Recomendada para Android'},
 {id:'apk',icon:'download',name:'Descargar APK',detail:'Archivo para Android'},
 {id:'ios',icon:'apple',name:'iPhone / iPad',detail:'Añadir desde Safari'},
 {id:'pc',icon:'monitor',name:'Computadora',detail:'Chrome o Edge'}
];
const initial=()=>ios?'ios':desktop?'pc':'pwa';
const instructions={
 pwa:[
  'Abre este sitio en Google Chrome en tu teléfono.',
  'Toca “Instalar aplicación”. Si no aparece el aviso, abre el menú ⋮ de Chrome.',
  'Selecciona “Instalar app” o “Añadir a pantalla de inicio” y confirma.'
 ],
 apk:[
  'Toca “Descargar APK” para obtener el archivo desde GitHub Releases.',
  'Abre el archivo descargado desde tu teléfono Android.',
  'Sigue las instrucciones de Android. Si solicita autorización de instalación, comprueba primero que descargaste el archivo desde este repositorio.'
 ],
 ios:[
  'Abre Liga Juventino en Safari, no dentro de otra aplicación.',
  'Pulsa el icono Compartir del navegador (cuadro con flecha).',
  'Elige “Añadir a pantalla de inicio” y confirma “Añadir”.'
 ],
 pc:[
  'Abre Liga Juventino en Google Chrome o Microsoft Edge.',
  'Pulsa “Instalar aplicación”. Si no aparece el aviso, busca “Instalar” en el menú del navegador.',
  'Confirma la instalación para abrir Liga Juventino en una ventana propia.'
 ]
};
const explanation={
 pwa:{title:'Instalar como aplicación web',copy:'No necesitas descargar una APK. Se abre desde la pantalla de inicio y utiliza la versión web actualizada.',button:'Instalar aplicación'},
 apk:{title:'Aplicación Android (.APK)',copy:'Descarga la compilación Android publicada en GitHub. Es una instalación distinta de la PWA y el archivo puede ser grande.',button:'Descargar APK desde GitHub'},
 ios:{title:'Acceso directo para iPhone o iPad',copy:'En iOS no existe un botón web que instale automáticamente la aplicación. Se añade desde el menú Compartir de Safari.',button:'Compartir enlace'},
 pc:{title:'Instalar en computadora',copy:'En Chrome o Edge puedes instalar Liga Juventino y abrirla como aplicación, sin otra pestaña.',button:'Instalar en este equipo'}
};
/* V1240 local-install assistant: lightweight on-device decision rules, no model download,
   telemetry, account access, new worker registration, or automatic app reload. */
function assistantMarkup(){
 return '<section class="ljr-install-advisor" aria-label="Asistente local de instalación">'+
  '<div class="ljr-install-advisor-top"><span class="ljr-install-advisor-mark">'+svg('shield',19)+'</span>'+
   '<div><small>ASISTENTE LOCAL · DIAGNÓSTICO AUTOMÁTICO</small><h3>Instalación inteligente</h3>'+
    '<p>Revisa tu navegador y recomienda los siguientes pasos. Funciona con reglas locales, sin enviar datos ni descargar modelos de IA.</p></div></div>'+
  '<div class="ljr-install-diagnostics" aria-live="polite" role="status">'+
   '<b data-ljr-diagnostic-status>Preparando diagnóstico de este dispositivo…</b>'+
   '<span data-ljr-diagnostic-details>La recomendación se calcula en tu navegador.</span></div>'+
  '<div class="ljr-install-advisor-actions">'+
   '<button type="button" data-ljr-action="diagnose">'+svg('check',16)+' Revisar mi dispositivo</button>'+
   '<button type="button" data-ljr-action="updates">'+svg('refresh',16)+' Comprobar actualización</button></div>'+
  '<p class="ljr-install-update-note" data-ljr-update-note role="status" aria-live="polite"></p>'+
 '</section>';
}
async function diagnose(root){
 if(!root?.isConnected)return;
 const mode=root.dataset.ljrInstallMode||initial();
 const installed=standalone();
 const isOffline=navigator.onLine===false;
 let worker='Sin verificar';
 try{
   if('serviceWorker' in navigator){
     const reg=await navigator.serviceWorker.getRegistration(location.href);
     worker=reg?.active?'Servicio de actualización activo (sin garantía de acceso sin conexión)':'Servicio de actualización no detectado';
   }else worker='Tu navegador no admite servicio sin conexión';
 }catch(_){worker='Servicio sin conexión: estado desconocido'}
 if(!root.isConnected)return;
 let recommendation='';
 if(installed)recommendation='La aplicación web ya está abierta en modo instalado.';
 else if(ios)recommendation='En iPhone/iPad, abre Safari y usa Compartir → Añadir a pantalla de inicio.';
 else if(android)recommendation=pendingPrompt
   ?'Tu navegador permite solicitar la instalación PWA desde el botón principal.'
   :'En Android, prueba Chrome → menú ⋮ → Instalar app o Añadir a pantalla de inicio.';
 else recommendation=pendingPrompt
   ?'Instalación PWA disponible desde el botón principal.'
   :'En computadora, busca Instalar aplicación en Chrome o Edge.';
 if(mode==='apk'&&android)recommendation='Seleccionaste el archivo APK. Descárgalo únicamente desde la publicación GitHub de la Liga.';
 if(mode==='apk'&&!android)recommendation='El APK es exclusivo de Android; para este dispositivo usa la opción recomendada.';
 const primary=root.querySelector('[data-ljr-diagnostic-status]');
 const secondary=root.querySelector('[data-ljr-diagnostic-details]');
 if(primary)primary.textContent=recommendation;
 if(secondary)secondary.textContent=(isOffline?'El dispositivo informa que no hay conexión · ':'El dispositivo informa conexión · ')+worker+'. Diagnóstico orientativo, no confirma instalación ni acceso a Internet.';
}
async function checkUpdates(root){
 const target=root?.querySelector('[data-ljr-update-note]');
 if(!target)return;
 target.textContent='Comprobando cambios de la aplicación…';
 if(navigator.onLine===false){target.textContent='Parece que no hay conexión. Prueba de nuevo cuando tengas Internet.';return}
 if(!('serviceWorker' in navigator)){
   target.textContent='Este navegador no admite actualizaciones PWA automáticas. Puedes recargar desde el menú del navegador.';return;
 }
 try{
   const reg=await navigator.serviceWorker.getRegistration(location.href);
   if(!reg){
     target.textContent='No hay servicio de actualizaciones instalado. Recarga la página para obtener la versión publicada.';return;
   }
   const hadWaiting=!!reg.waiting;
   await reg.update();
   if(!root.isConnected)return;
   target.textContent=reg.waiting||hadWaiting
      ?'Hay una actualización pendiente. Cierra y vuelve a abrir la app cuando termines de trabajar.'
      :'Revisión solicitada. Si GitHub publicó cambios, el navegador los cargará según su caché; no se ha reiniciado la aplicación.';
 }catch(_){
   if(root.isConnected)target.textContent='No se pudo consultar la actualización. Comprueba tu conexión y vuelve a intentarlo.';
 }
}

function markup(mode,modal=false){
 const m=MODES.some(x=>x.id===mode)?mode:initial(),o=explanation[m],installed=standalone();
 const cards=MODES.map(x=>'<button type="button" class="ljr-install-choice '+(x.id===m?'is-active':'')+'" data-ljr-action="mode" data-ljr-mode="'+x.id+'" aria-pressed="'+(x.id===m)+'">'+
  '<span class="ljr-install-choice-icon">'+svg(x.icon,x.id==='ios'?28:22)+'</span><span><b>'+x.name+'</b><small>'+x.detail+'</small></span></button>').join('');
 const steps=instructions[m].map((s,i)=>'<li><span class="ljr-install-step-num">'+(i+1)+'</span><span>'+esc(s)+'</span></li>').join('');
 const cta=m==='apk'
 ?'<a class="ljr-install-primary" href="'+APK+'" target="_blank" rel="noopener noreferrer" data-ljr-action="apk">'+svg('download',18)+'<span>Descargar APK desde GitHub</span>'+svg('arrow',16)+'</a>'
 :'<button class="ljr-install-primary" type="button" data-ljr-action="'+(m==='ios'?'share':'prompt')+'">'+svg(m==='ios'?'share':'download',18)+'<span>'+(installed&&m!=='ios'?'Abrir Liga Juventino':o.button)+'</span>'+svg('arrow',16)+'</button>';
 return '<div class="ljr-install-shell">'+
  '<div class="ljr-install-head">'+
   '<img class="ljr-install-logo" src="'+LOGO+'" alt="Escudo de Liga Juventino" onerror="this.hidden=true">'+
   '<div class="ljr-install-head-copy"><span class="ljr-install-eyebrow">CENTRO DE INSTALACIÓN</span><h2>Instala Liga Juventino</h2>'+
   '<p>Elige tu dispositivo y sigue los pasos. No necesitas saber de tecnología.</p></div>'+
   (modal?'<button class="ljr-install-close" type="button" aria-label="Cerrar" data-ljr-action="close">'+svg('close',20)+'</button>':'')+
  '</div>'+
  '<div class="ljr-install-current"><span class="ljr-install-current-mark">'+svg(installed?'check':'shield',18)+'</span>'+
   '<div><b>'+(installed?'Ya estás usando la versión instalada':'Lista para instalar desde tu dispositivo')+'</b>'+
   '<small>'+(installed?'Puedes volver al inicio y utilizar Liga Juventino.':'Opciones para Android, iPhone, iPad y computadora.')+'</small></div></div>'+
  '<div class="ljr-install-choices" role="group" aria-label="Elige tu dispositivo">'+cards+'</div>'+
  '<section class="ljr-install-guide" aria-label="Guía paso a paso">'+
   '<div class="ljr-install-guide-heading"><span class="ljr-install-guide-icon">'+svg(MODES.find(x=>x.id===m).icon,m==='ios'?30:24)+'</span><div><small>PASO A PASO</small><h3>'+o.title+'</h3><p>'+o.copy+'</p></div></div>'+
   '<ol class="ljr-install-steps">'+steps+'</ol>'+
   '<div class="ljr-install-cta">'+cta+
    (m==='apk'?'<a class="ljr-install-secondary" href="'+RELEASE+'" target="_blank" rel="noopener noreferrer">'+svg('shield',17)+' Ver versión y detalles</a>':
    '<button class="ljr-install-secondary" type="button" data-ljr-action="copy">'+svg('copy',17)+' Copiar enlace de la app</button>')+
   '</div>'+
   '<p class="ljr-install-feedback" role="status" aria-live="polite" data-ljr-feedback></p>'+
  '</section>'+
  assistantMarkup()+
  '<div class="ljr-install-utilities">'+
    '<button type="button" data-ljr-action="share">'+svg('share',17)+' Compartir app</button>'+
    '<a href="'+BUILD+'" target="_blank" rel="noopener noreferrer">'+svg('refresh',17)+' Ver compilaciones Android</a>'+
    '<button type="button" data-ljr-action="help">'+svg('help',17)+' ¿Qué opción elijo?</button>'+
  '</div>'+
  '<p class="ljr-install-smallprint">La PWA y el acceso directo abren este sitio oficial. El APK se ofrece desde el repositorio GitHub de la Liga. No necesitas dar permisos de administrador para instalar.</p>'+
 '</div>';
}
function status(root,message){const target=root.querySelector('[data-ljr-feedback]');if(target)target.textContent=message}
function draw(root,mode){
 root.dataset.ljrInstallMode=mode;
 root.innerHTML=markup(mode,root.classList.contains('ljr-install-overlay'));
 diagnose(root);
}
function page(){
 return '<section class="v562-page ljr-install-page" data-v563-install-page data-ljr-install-hub data-ljr-install-mode="'+initial()+'">'+markup(initial())+'</section>';
}
function open(){
 lastFocus=document.activeElement;
 document.querySelector('.ljr-install-overlay')?.remove();
 const wrap=document.createElement('div');wrap.className='ljr-install-overlay';wrap.dataset.ljrInstallHub='';wrap.dataset.ljrInstallMode=initial();
 wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label','Instalar Liga Juventino');wrap.innerHTML=markup(initial(),true);
 document.body.appendChild(wrap);
 diagnose(wrap);
 wrap.querySelector('.ljr-install-close')?.focus();
}
function mountExisting(){
 if(!String(location.hash||'').includes('appInstall'))return;
 const el=document.querySelector('[data-v563-install-page]');
 if(!el)return;
 if(el.hasAttribute('data-ljr-install-hub')){
   if(!el.dataset.ljrDiagnosisReady){el.dataset.ljrDiagnosisReady='1';diagnose(el)}
   return;
 }
 el.dataset.ljrInstallHub='';el.dataset.ljrInstallMode=initial();el.classList.add('ljr-install-page');
 el.innerHTML=markup(initial());el.dataset.ljrDiagnosisReady='1';
 diagnose(el);
}
function close(){const old=document.querySelector('.ljr-install-overlay');if(!old)return;old.remove();try{lastFocus?.focus?.()}catch(_){}}
async function copy(){
 const value=home();
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);return true}}
 catch(_){}
 const field=document.createElement('textarea');field.value=value;field.style.position='fixed';field.style.left='-5000px';document.body.appendChild(field);field.select();
 const ok=!!document.execCommand?.('copy');field.remove();return ok;
}
function manualNote(mode){
 return mode==='ios'?'Abre este enlace en Safari y usa Compartir → Añadir a pantalla de inicio.':
 'En tu navegador abre el menú ⋮ y elige Instalar aplicación o Añadir a pantalla de inicio. Si estás en un navegador dentro de otra app, abre la página en Chrome.';
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();pendingPrompt=e;document.querySelectorAll('[data-ljr-install-hub]').forEach(diagnose)});
window.addEventListener('appinstalled',()=>{alreadyInstalled=true;document.querySelectorAll('[data-ljr-install-hub]').forEach(root=>draw(root,root.dataset.ljrInstallMode||initial()))});
window.addEventListener('online',()=>document.querySelectorAll('[data-ljr-install-hub]').forEach(diagnose));
window.addEventListener('offline',()=>document.querySelectorAll('[data-ljr-install-hub]').forEach(diagnose));
document.addEventListener('click',async e=>{
 const b=e.target.closest?.('[data-ljr-action]');if(!b)return;
 const root=b.closest('[data-ljr-install-hub]');if(!root)return;
 const action=b.dataset.ljrAction;
 if(action==='apk')return; // Anchor real: deja que el navegador descargue desde GitHub.
 e.preventDefault();
 if(action==='close'){close();return}
 if(action==='mode'){draw(root,b.dataset.ljrMode);return}
 if(action==='diagnose'){await diagnose(root);return}
 if(action==='updates'){await checkUpdates(root);return}
 if(action==='help'){
   status(root,'Android: instala la PWA desde Chrome. iPhone: usa Safari y “Añadir a pantalla de inicio”. La APK es opcional y exclusiva de Android.');
   return;
 }
 if(action==='copy'){
   const done=await copy().catch(()=>false);
   status(root,done?'Enlace copiado. Compártelo con quien quieras.':'No fue posible copiarlo. Puedes compartir la dirección desde el navegador.');return;
 }
 if(action==='share'){
   try{if(navigator.share){await navigator.share({title:'Liga Juventino',text:'Liga Municipal de Fútbol Juventino Rosas',url:home()});return}}
   catch(err){if(err?.name==='AbortError')return}
   const done=await copy().catch(()=>false);
   status(root,done?'Enlace copiado para compartir.':'Abre Compartir desde el menú del navegador.');return;
 }
 if(action==='prompt'){
   if(standalone()){location.hash='#/home';close();return}
   if(pendingPrompt){
     try{
       const current=pendingPrompt;pendingPrompt=null;
       await current.prompt();
       const choice=await current.userChoice;
       status(root,choice?.outcome==='accepted'?'Confirma la instalación en tu dispositivo.':'Puedes instalar la app después desde el menú del navegador.');
     }catch(_){status(root,manualNote(root.dataset.ljrInstallMode))}
   }else status(root,manualNote(root.dataset.ljrInstallMode));
 }
},true);
document.addEventListener('click',e=>{if(e.target?.classList?.contains('ljr-install-overlay'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
window.addEventListener('hashchange',()=>setTimeout(mountExisting,100));
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(mountExisting).observe(screen,{childList:true,subtree:false});
window.LJR_INSTALL_HUB={open,page,mount:mountExisting,version:'v1240'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountExisting,{once:true});else mountExisting();
})();
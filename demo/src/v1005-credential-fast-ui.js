/* V1005 · Acceso ligero a registro/credencial.
   No reemplaza formularios, fotos, OCR, validación ni exportadores existentes. */
(()=>{
'use strict';
if(window.__LJR_V1005_CREDENTIAL_UI__)return;
window.__LJR_V1005_CREDENTIAL_UI__=true;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const selectors={
 document:'[data-v64-doc]',
 portrait:'[data-v64-photo]',
 preview:'[data-v196-classic-preview],.v196-classic-preview',
 registry:'#v124-player-registry'
};
const svg=(kind)=>{
 const paths={
  document:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  portrait:'<circle cx="12" cy="8.5" r="3"/><path d="M5.5 20c.5-4.2 3-6.3 6.5-6.3s6 2.1 6.5 6.3"/>',
  preview:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="2"/><path d="M12 9h6M12 13h6M7 16h11"/>',
  registry:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>'
 };
 return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+paths[kind]+'</svg>';
};
function mount(){
 if(route()!=='credentialBuilder')return;
 const screen=document.querySelector('#screen');
 const page=screen?.querySelector('.v60-tool-page.v64-page');
 if(!page||page.querySelector('[data-v1005-credential-intro]'))return;
 const wrap=document.createElement('section');
 wrap.className='v1005-credential-intro';
 wrap.dataset.v1005CredentialIntro='1';
 wrap.innerHTML=
  '<div class="v1005-intro-main"><span class="v1005-intro-logo" aria-hidden="true">'+svg('preview')+'</span>'+
  '<div><small>REGISTRO OFICIAL · LIGA JUVENTINO ROSAS</small><h1>Registro y credenciales</h1><p>Captura, verifica y genera tu credencial en una misma pantalla.</p></div></div>'+
  '<div class="v1005-step-grid" role="group" aria-label="Accesos rápidos del registro">'+
  [['document','Documento','CURP / INE'],['portrait','Fotografía','Jugador'],['preview','Credencial','Vista previa'],['registry','Registros','Jugadores']].map(x=>
   '<button type="button" data-v1005-step="'+x[0]+'" aria-label="Ir a '+x[1]+'"><span class="v1005-step-icon">'+svg(x[0])+'</span><b>'+x[1]+'</b><small>'+x[2]+'</small></button>'
  ).join('')+
  '</div>'+
  '<details class="v1005-credential-help"><summary>Consejos para registrar más rápido <span aria-hidden="true">⌄</span></summary>'+
  '<p>Primero elige una foto clara del documento y del jugador. Revisa el nombre y la CURP detectados; después elige su equipo y comprueba la vista previa antes de guardar o descargar.</p>'+
  '</details>';
 const header=page.querySelector(':scope > .v60-tool-head');
 if(header)header.after(wrap);else page.prepend(wrap);
 wrap.querySelectorAll('[data-v1005-step]').forEach(button=>button.addEventListener('click',()=>{
  const type=button.dataset.v1005Step;
  const target=screen.querySelector(selectors[type]);
  const element=target?.closest('label')||target;
  if(element)element.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 }));
}
let queued=false;
function schedule(){
 if(queued)return;queued=true;
 requestAnimationFrame(()=>{queued=false;mount()});
}
window.addEventListener('hashchange',schedule);
window.addEventListener('pageshow',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();

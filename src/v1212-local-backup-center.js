/* V1212 · Centro de respaldo local: exportación cifrada y restauración con vista previa.
 * Solo datos de herramientas en localStorage: NO datos del servidor ni ficheros IndexedDB.
 * Importante: una interfaz administrativa no sustituye permisos de servidor. */
(function(){
'use strict';
if(window.__LJR_LOCAL_BACKUP_V1212__)return;
window.__LJR_LOCAL_BACKUP_V1212__=true;
const FORMAT='LJR_LOCAL_TOOLS_BACKUP', VERSION=2, MAX_FILE=12*1024*1024, MAX_DATA=8*1024*1024;
const META_KEY='v1212-local-backup-last';
const GROUPS=[
 {id:'tools',title:'Herramientas locales',prefixes:['v105-']},
 {id:'settings',title:'Preferencias y utilidades',prefixes:['v100-']},
 {id:'legacy',title:'Datos locales anteriores',prefixes:['v64-','v60-','ljr-']}
];
const BLOCKED=/(?:token|secret|password|passphrase|auth|session|cookie|credential|api[-_]?key|oauth|jwt|private|otp|csrf|bearer|access[-_]?key|^v105-activity$|^v100-activity$)/i;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const encoder=new TextEncoder(),decoder=new TextDecoder();
function groupOf(key){
 if(typeof key!=='string'||key.length>200||BLOCKED.test(key)||key===META_KEY)return null;
 return GROUPS.find(g=>g.prefixes.some(p=>key.startsWith(p)))?.id||null;
}
function collect(groupIds){
 const out=Object.create(null);let total=0;
 for(let i=0;i<localStorage.length;i++){
  const key=localStorage.key(i),group=groupOf(key);
  if(!group||!groupIds.includes(group))continue;
  const value=localStorage.getItem(key);
  if(typeof value!=='string')continue;
  total+=key.length+value.length;
  if(total>MAX_DATA)throw Error('Los datos exceden el límite de 8 MB para este respaldo. Exporta menos secciones.');
  out[key]=value;
 }
 return Object.fromEntries(Object.entries(out).sort(([a],[b])=>a.localeCompare(b)));
}
function sizeOf(text){return new Blob([text]).size}
function digest(text){
 if(!crypto?.subtle)throw Error('Se requiere HTTPS y un navegador compatible con Web Crypto.');
 return crypto.subtle.digest('SHA-256',encoder.encode(text)).then(buf=>
  Array.from(new Uint8Array(buf),x=>x.toString(16).padStart(2,'0')).join(''));
}
function b64(bytes){
 let raw='';
 for(let i=0;i<bytes.length;i+=16384)raw+=String.fromCharCode(...bytes.subarray(i,i+16384));
 return btoa(raw);
}
function unb64(value){
 if(typeof value!=='string'||value.length>MAX_FILE*2||!/^[A-Za-z0-9+/]*={0,2}$/.test(value))throw Error('El respaldo cifrado está dañado.');
 return Uint8Array.from(atob(value),c=>c.charCodeAt(0));
}
async function passwordKey(password,salt,iterations){
 const base=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function encodeBackup(items,password){
 const content=JSON.stringify({items}),sha256=await digest(JSON.stringify(items));
 const metadata={format:FORMAT,version:VERSION,createdAt:new Date().toISOString(),scope:'localStorage-tools',entries:Object.keys(items).length,sha256};
 if(password){
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),iterations=250000;
  const key=await passwordKey(password,salt,iterations);
  const bytes=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoder.encode(content));
  return {...metadata,encrypted:true,kdf:'PBKDF2-SHA256',cipher:'AES-256-GCM',iterations,salt:b64(salt),iv:b64(iv),payload:b64(new Uint8Array(bytes))};
 }
 return {...metadata,encrypted:false,items};
}
async function decodeBackup(raw,password){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('No es un archivo de respaldo válido.');
 let items;
 let legacy=false;
 if(raw.format===FORMAT&&raw.version===VERSION){
  if(raw.scope!=='localStorage-tools')throw Error('El respaldo corresponde a otro tipo de datos.');
  if(raw.encrypted){
   if(!password)throw Error('Escribe la contraseña del respaldo para revisarlo.');
   if(raw.cipher!=='AES-256-GCM'||raw.kdf!=='PBKDF2-SHA256'||raw.iterations!==250000)throw Error('Algoritmo de cifrado no compatible.');
   try{
    const key=await passwordKey(password,unb64(raw.salt),raw.iterations);
    const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(raw.iv)},key,unb64(raw.payload));
    items=JSON.parse(decoder.decode(data)).items;
   }catch(_){throw Error('Contraseña incorrecta o respaldo cifrado dañado.')}
  }else items=raw.items;
  if(!items||Array.isArray(items)||typeof items!=='object')throw Error('El respaldo no contiene registros válidos.');
  const actual=await digest(JSON.stringify(items));
  if(actual!==raw.sha256)throw Error('La comprobación SHA-256 falló: el archivo puede estar dañado.');
 }else if(raw.generatedAt&&raw.items&&typeof raw.items==='object'&&!Array.isArray(raw.items)){
  legacy=true;items=raw.items;
 }else throw Error('Formato no admitido. Usa un respaldo de las herramientas de la Liga.');
 const eligible=Object.create(null);let excluded=0;
 for(const [k,v] of Object.entries(items)){
  if(!groupOf(k)||typeof v!=='string'||v.length>MAX_DATA){excluded++;continue}
  eligible[k]=v;
 }
 if(sizeOf(JSON.stringify(eligible))>MAX_DATA)throw Error('El contenido supera 8 MB.');
 return {items:eligible,excluded,legacy,createdAt:raw.createdAt||raw.generatedAt||''};
}
function download(content,filename){
 const blob=new Blob([JSON.stringify(content,null,2)],{type:'application/json;charset=utf-8'});
 const href=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=href;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(href),30000);
}
function authorize(){
 if(window.LJR_MEDIA?.admin){open();return}
 const media=window.LJR_MEDIA;
 if(typeof media?.login!=='function'){alert('Inicia sesión como administrador para acceder a los respaldos.');return}
 const after=()=>{if(window.LJR_MEDIA?.admin)open()};
 try{const result=media.login(after);if(result&&typeof result.then==='function')result.then(after).catch(()=>{})}
 catch(_){alert('No se pudo abrir el inicio de sesión.')}
}
function open(){
 if(!window.LJR_MEDIA?.admin){authorize();return}
 $('.ljr-bc-overlay')?.remove();
 const overlay=document.createElement('div');
 overlay.className='ljr-bc-overlay';
 overlay.innerHTML=
 '<section class="ljr-bc-dialog" role="dialog" aria-modal="true" aria-labelledby="ljr-bc-title">'+
 '<header class="ljr-bc-head"><div class="ljr-bc-symbol" aria-hidden="true">⇩</div><div><small>ADMINISTRACIÓN · COPIAS LOCALES</small><h2 id="ljr-bc-title">Centro de respaldos</h2><p>Protege y recupera las herramientas de la Liga.</p></div><button class="ljr-bc-close" type="button" data-bc-close aria-label="Cerrar centro de respaldos">×</button></header>'+
 '<div class="ljr-bc-summary"><div><small>REGISTROS DISPONIBLES</small><b data-bc-count>—</b></div><div><small>ESPACIO APROX.</small><b data-bc-size>—</b></div><div><small>ÚLTIMA DESCARGA SOLICITADA</small><b data-bc-last>Sin registro</b></div></div>'+
 '<div class="ljr-bc-scroll">'+
 '<section class="ljr-bc-panel"><div class="ljr-bc-paneltitle"><span class="ljr-bc-num">01</span><div><h3>Crear respaldo</h3><p>Selecciona las secciones que deseas guardar.</p></div></div><div class="ljr-bc-options" data-bc-export-groups></div>'+
 '<label class="ljr-bc-check"><input type="checkbox" data-bc-encrypt checked><span>Cifrar con contraseña (recomendado)</span></label>'+
 '<div class="ljr-bc-password" data-bc-password-area><label>Contraseña del archivo<input type="password" data-bc-password minlength="10" autocomplete="new-password" placeholder="Mínimo 10 caracteres"></label><label>Confirmar contraseña<input type="password" data-bc-confirm autocomplete="new-password" placeholder="Repite la contraseña"></label></div>'+
 '<button type="button" class="ljr-bc-primary" data-bc-export>⇩ Descargar respaldo JSON</button></section>'+
 '<section class="ljr-bc-panel"><div class="ljr-bc-paneltitle"><span class="ljr-bc-num">02</span><div><h3>Restaurar respaldo</h3><p>Revisa el archivo antes de cambiar datos de este teléfono.</p></div></div>'+
 '<label class="ljr-bc-file">Seleccionar archivo JSON<input type="file" data-bc-file accept=".json,application/json"></label>'+
 '<label class="ljr-bc-import-password" data-bc-import-password-wrap hidden>Contraseña para abrir el archivo<input type="password" data-bc-import-password autocomplete="off" placeholder="Contraseña del respaldo"></label>'+
 '<button type="button" class="ljr-bc-secondary" data-bc-preview>Verificar y mostrar vista previa</button>'+
 '<div class="ljr-bc-preview" data-bc-preview-out hidden></div>'+
 '<div data-bc-restore-controls hidden><div class="ljr-bc-options" data-bc-import-groups></div><label class="ljr-bc-check"><input type="checkbox" data-bc-overwrite><span>Reemplazar registros locales existentes</span></label><button type="button" class="ljr-bc-primary" data-bc-restore>Restaurar secciones seleccionadas</button></div></section>'+
 '<p class="ljr-bc-note">Sólo guarda registros locales seleccionados de este navegador. No incluye resultados oficiales del servidor, fotos, documentos ni archivos IndexedDB. No sincroniza con Google Drive. Guarda el archivo y su contraseña en un lugar privado.</p>'+
 '</div><footer class="ljr-bc-footer"><p data-bc-status role="status" aria-live="polite">Tus archivos no se envían a ningún servidor.</p><button type="button" data-bc-close>Cerrar</button></footer></section>';
 document.body.appendChild(overlay);
 const status=$('[data-bc-status]',overlay);
 const say=(message,error=false)=>{status.textContent=message;status.classList.toggle('error',error)};
 const options=(selector,attribute)=>{const box=$(selector,overlay);box.innerHTML=GROUPS.map(g=>'<label class="ljr-bc-group"><input type="checkbox" '+attribute+'="'+g.id+'" checked><span>'+g.title+'</span><b data-bc-groupcount="'+g.id+'"></b></label>').join('')};
 options('[data-bc-export-groups]','data-bc-export-group');
 options('[data-bc-import-groups]','data-bc-import-group');
 const selected=attr=>$$('input['+attr+']:checked',overlay).map(el=>el.getAttribute(attr));
 function refresh(){
  try{
   const all=collect(GROUPS.map(x=>x.id));
   $('[data-bc-count]',overlay).textContent=Object.keys(all).length+' registros';
   $('[data-bc-size]',overlay).textContent=(sizeOf(JSON.stringify(all))/1024).toFixed(1)+' KB';
   GROUPS.forEach(g=>{const node=$('[data-bc-groupcount="'+g.id+'"]',overlay);if(node)node.textContent=Object.keys(all).filter(k=>groupOf(k)===g.id).length});
   const last=localStorage.getItem(META_KEY);
   if(last)$('[data-bc-last]',overlay).textContent=new Date(last).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'});
  }catch(e){say(e.message,true)}
 }
 refresh();
 $$('[data-bc-close]',overlay).forEach(b=>b.onclick=()=>overlay.remove());
 overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove()});
 const encryption=$('[data-bc-encrypt]',overlay);
 encryption.onchange=()=>{$('[data-bc-password-area]',overlay).hidden=!encryption.checked};
 let preview=null;
 const run=async(button,callback)=>{
  if(button.disabled)return;
  button.disabled=true;
  try{await callback()}catch(error){say(error.message||'No se pudo completar la operación.',true)}
  finally{button.disabled=false}
 };
 $('[data-bc-export]',overlay).onclick=()=>run($('[data-bc-export]',overlay),async()=>{
  const groups=selected('data-bc-export-group');
  if(!groups.length)throw Error('Selecciona al menos una sección.');
  const items=collect(groups);
  if(!Object.keys(items).length)throw Error('Este dispositivo no tiene registros de esas secciones.');
  let password='';
  if(encryption.checked){
   password=$('[data-bc-password]',overlay).value;
   const repeat=$('[data-bc-confirm]',overlay).value;
   if(password.length<10)throw Error('Utiliza una contraseña de al menos 10 caracteres.');
   if(password!==repeat)throw Error('Las contraseñas no coinciden.');
  }else if(!confirm('El respaldo no estará cifrado y podría incluir información personal. ¿Deseas continuar sin contraseña?'))return;
  say('Preparando respaldo local…');
  const data=await encodeBackup(items,password);
  const date=new Date().toISOString().replace(/[:.]/g,'-');
  download(data,'Liga_Juventino_Respaldo_Local_'+date+'.json');
  localStorage.setItem(META_KEY,new Date().toISOString());
  $('[data-bc-password]',overlay).value='';$('[data-bc-confirm]',overlay).value='';
  refresh();say('Descarga solicitada: '+Object.keys(items).length+' registros. Comprueba que el archivo se guardó.');
 });
 $('[data-bc-file]',overlay).onchange=()=>{
  preview=null;$('[data-bc-restore-controls]',overlay).hidden=true;$('[data-bc-preview-out]',overlay).hidden=true;
  $('[data-bc-import-password-wrap]',overlay).hidden=true;
  say('Archivo seleccionado. Pulsa Verificar para revisar su contenido.');
 };
 $('[data-bc-preview]',overlay).onclick=()=>run($('[data-bc-preview]',overlay),async()=>{
  const file=$('[data-bc-file]',overlay).files?.[0];
  if(!file)throw Error('Primero selecciona un archivo JSON.');
  if(file.size>MAX_FILE)throw Error('El archivo supera el límite de 12 MB.');
  const raw=JSON.parse(await file.text());
  $('[data-bc-import-password-wrap]',overlay).hidden=!raw.encrypted;
  preview=await decodeBackup(raw,$('[data-bc-import-password]',overlay).value);
  const keys=Object.keys(preview.items),existing=keys.filter(k=>localStorage.getItem(k)!==null).length;
  const detail=$('[data-bc-preview-out]',overlay);
  detail.textContent=keys.length+' registros compatibles · '+(keys.length-existing)+' nuevos · '+existing+' existentes · '+preview.excluded+' excluidos.'+(preview.legacy?' Archivo antiguo: no incluye verificación de integridad.':' Integridad SHA-256 verificada.')+' Ningún dato ha sido modificado.';
  detail.hidden=false;$('[data-bc-restore-controls]',overlay).hidden=false;
  say('Vista previa lista. La restauración necesita tu confirmación.');
 });
 $('[data-bc-restore]',overlay).onclick=()=>run($('[data-bc-restore]',overlay),async()=>{
  if(!preview)throw Error('Verifica primero el archivo.');
  if(!window.LJR_MEDIA?.admin)throw Error('La sesión de administrador ya no está activa.');
  const groups=selected('data-bc-import-group'),overwrite=$('[data-bc-overwrite]',overlay).checked;
  const changes=Object.entries(preview.items).filter(([k])=>groups.includes(groupOf(k))&&(overwrite||localStorage.getItem(k)===null));
  if(!changes.length)throw Error('No hay registros nuevos que restaurar con las opciones seleccionadas.');
  if(!confirm('Se restaurarán '+changes.length+' registros en ESTE dispositivo.'+(overwrite?' Los existentes seleccionados serán reemplazados.':' Los existentes no serán reemplazados.')+' ¿Continuar?'))return;
  const previous=new Map();
  try{
   for(const [k,v] of changes){previous.set(k,localStorage.getItem(k));localStorage.setItem(k,v)}
  }catch(error){
   for(const [k,v] of previous){if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}
   throw Error('No se pudo guardar todo (posible falta de espacio). Se intentó deshacer el cambio.');
  }
  say('Restaurados '+changes.length+' registros locales. Recarga la página para ver la información recuperada.');
  refresh();
 });
}
function takeover(){
 const prev=window.LJR_V105_OPEN_TOOL;
 if(typeof prev!=='function'){setTimeout(takeover,150);return}
 if(prev.__ljrBackupV1212)return;
 const wrapped=function(name){if(name==='backup-export'){authorize();return true}return prev.apply(this,arguments)};
 wrapped.__ljrBackupV1212=true;
 window.LJR_V105_OPEN_TOOL=wrapped;
}
window.addEventListener('click',e=>{
 const hit=e.target?.closest?.('[data-v105-action="backup-export"]');
 if(!hit||hit.disabled)return;
 e.preventDefault();e.stopImmediatePropagation();authorize();
},true);
window.LJR_LOCAL_BACKUP={open:authorize,version:VERSION};
takeover();
})();
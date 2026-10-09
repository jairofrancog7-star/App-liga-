/* V1011 · Indexacion local Dexie + respaldo AES-GCM (SIN NUBE).
   El localStorage existente conserva autoridad: no se borran ni migran registros.
   Los documentos y fotos permanecen en IndexedDB del dispositivo. */
import {REGISTRY_KEY,makeLocalIndex,parseRegistry,mergeRegistry,encryptRegistry,decryptRegistry,clean} from './local-registration-core.js?v=20261009-v1011-safe-merge';

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const $=(s,r=document)=>r.querySelector(s);
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const EMPTY='{"seasons":{}}';
const sleep=ms=>new Promise(ok=>setTimeout(ok,ms));
const dbName='ljr-registro-rapido-local-v1';
let dexiePromise=null,dbPromise=null,previousRaw='',busy=false,queued=null,lastGesture=0,mounted=false;
document.addEventListener('touchmove',()=>{lastGesture=Date.now()},{capture:true,passive:true});
document.addEventListener('scroll',()=>{lastGesture=Date.now()},{capture:true,passive:true});

function loadDexie(){
 if(window.Dexie)return Promise.resolve(window.Dexie);
 if(dexiePromise)return dexiePromise;
 dexiePromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src=new URL('./vendor/dexie-4.0.11.min.js',import.meta.url).href;
  script.async=true;script.onload=()=>window.Dexie?resolve(window.Dexie):reject(Error('No se pudo cargar Dexie local'));
  script.onerror=()=>reject(Error('Archivo de Dexie no disponible; el registro original sigue funcionando'));
  document.head.appendChild(script);
 }).catch(error=>{dexiePromise=null;throw error});
 return dexiePromise;
}
async function database(){
 if(dbPromise)return dbPromise;
 dbPromise=(async()=>{
  const Dexie=await loadDexie();
  const instance=new Dexie(dbName);
  instance.version(1).stores({players:'&key, season, nameKey, teamKey, *tokens',meta:'&key'});
  await instance.open();
  return instance;
 })().catch(error=>{dbPromise=null;throw error});
 return dbPromise;
}
function status(message){
 const el=$('[data-v1011-status]');
 if(el)el.textContent=message;
}
async function sha256(raw){
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));
 return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function syncLocalIndex(){
 if(busy||route()!=='credentialBuilder')return;
 if(Date.now()-lastGesture<850){queue(1200);return}
 busy=true;
 try{
  const raw=localStorage.getItem(REGISTRY_KEY)||EMPTY;
  const d=await database();
  const fingerprint=await sha256(raw);
  const old=await d.meta.get('registryHash');
  if(old?.value===fingerprint){
   status('Índice local actualizado · sin enviar datos');
   previousRaw=raw;return;
  }
  const rows=makeLocalIndex(raw),validKeys=new Set(rows.map(r=>r.key));
  status('Preparando índice local de '+rows.length+' jugadores…');
  for(let i=0;i<rows.length;i+=60){
   if(route()!=='credentialBuilder')return;
   while(Date.now()-lastGesture<650)await sleep(250);
   await d.players.bulkPut(rows.slice(i,i+60));
   await sleep(0);
  }
  const existing=await d.players.toCollection().primaryKeys();
  const removed=existing.filter(k=>!validKeys.has(k));
  for(let i=0;i<removed.length;i+=60){
   while(Date.now()-lastGesture<650)await sleep(250);
   await d.players.bulkDelete(removed.slice(i,i+60));
   await sleep(0);
  }
  // Sólo marcar como completo si el padrón no cambió durante el trabajo.
  if((localStorage.getItem(REGISTRY_KEY)||EMPTY)===raw){
   await d.meta.put({key:'registryHash',value:fingerprint});
   previousRaw=raw;
   status('Índice local listo · '+rows.length+' jugadores · sin nube');
  }else{
   status('Detecté cambios recientes; actualizaré el índice.');
   queue(1600);
  }
 }catch(error){
  status('El registro original sigue disponible. Índice local: '+(error?.message||'no disponible'));
 }finally{busy=false}
}
function queue(ms=1400){
 clearTimeout(queued);
 queued=setTimeout(()=>{
  const run=()=>syncLocalIndex();
  if('requestIdleCallback' in window)window.requestIdleCallback(run,{timeout:5500});
  else run();
 },ms);
}
function download(filename,data){
 const blob=new Blob([data],{type:'application/json;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),2500);
}
async function backup(){
 const password=prompt('Contraseña del respaldo local (mínimo 10 caracteres). Guárdala: sin ella no podrás restaurarlo.');
 if(password===null)return;
 if(password.length<10){status('Necesitas una contraseña de al menos 10 caracteres.');return}
 const confirmPassword=prompt('Repite la contraseña para confirmar');
 if(confirmPassword===null)return;
 if(password!==confirmPassword){status('Las contraseñas no coinciden. No se creó el respaldo.');return}
 status('Cifrando padrón en este dispositivo…');
 try{
  const raw=localStorage.getItem(REGISTRY_KEY)||EMPTY;
  const encrypted=await encryptRegistry(raw,password);
  const day=new Date().toISOString().slice(0,10);
  download('liga-registro-cifrado-'+day+'.json',JSON.stringify(encrypted));
  status('Respaldo cifrado descargado. Incluye jugadores y temporadas, no fotografías ni INE.');
 }catch(e){status('Respaldo: '+e.message)}
}
async function restore(file){
 if(!file)return;
 if(file.size>46*1024*1024){status('Archivo demasiado grande.');return}
 const password=prompt('Contraseña para abrir tu respaldo local');
 if(password===null)return;
 status('Comprobando respaldo cifrado…');
 try{
  const data=JSON.parse(await file.text());
  const recovered=await decryptRegistry(data,password);
  const current=localStorage.getItem(REGISTRY_KEY)||EMPTY;
  const merged=mergeRegistry(current,recovered);
  if(!merged.added){status('No hay jugadores nuevos. Tu padrón actual sigue intacto.');return}
  if(!confirm('Se agregarán '+merged.added+' registros y se conservarán '+merged.existing+' existentes. No se borrará ninguno. ¿Continuar?')){
   status('Restauración cancelada; datos intactos.');return;
  }
  localStorage.setItem(REGISTRY_KEY,JSON.stringify(merged.registry));
  window.dispatchEvent(new CustomEvent('ljr:local-roster-changed',{detail:{reason:'restore'}}));
  status('Recuperados '+merged.added+' jugadores. Actualizando pantalla…');
  location.reload();
 }catch(e){status('Restauración: '+(e.message||'no disponible'))}
}
async function lookup(value,root){
 const host=$('[data-v1011-results]',root);if(!host)return;
 host.replaceChildren();
 const q=clean(value);
 if(q.length<2)return;
 try{
  const d=await database();
  const matches=(await d.players.where('tokens').startsWith(q).distinct().limit(12).toArray());
  if(!matches.length){host.textContent='Sin coincidencias en temporadas guardadas';return}
  for(const record of matches){
   const b=document.createElement('button');b.type='button';b.className='v1011-result';
   const title=document.createElement('strong');title.textContent=record.name;
   const meta=document.createElement('small');meta.textContent=record.team+' · '+record.season;
   b.append(title,meta);
   b.addEventListener('click',()=>{
    const picker=$('[data-v124-season]');
    if(picker&&[...picker.options].some(x=>x.value===record.season)){
     if(picker.value!==record.season){picker.value=record.season;picker.dispatchEvent(new Event('change',{bubbles:true}))}
     setTimeout(()=>{
      const input=$('[data-v124-search]');if(input){input.value=record.name;input.dispatchEvent(new Event('input',{bubbles:true}));input.scrollIntoView({block:'center',behavior:'smooth'})}
     },180);
    }
   });
   host.append(b);
  }
 }catch(e){host.textContent='Busca después de preparar el índice local'}
}
function mount(){
 if(route()!=='credentialBuilder')return;
 const manager=$('#v124-player-registry'),head=manager?.querySelector('.v124-head');
 if(!head||manager.querySelector('[data-v1011-hub]'))return;
 const panel=document.createElement('section');panel.className='v1011-hub';panel.dataset.v1011Hub='1';
 panel.innerHTML='<div class="v1011-top"><span aria-hidden="true">▣</span><div><small>ALMACENAMIENTO PRIVADO</small><h3>Registro rápido · 100 % local</h3><p>Dexie indexa en tu teléfono. Nada se envía a una nube.</p></div></div>'+
 '<div class="v1011-actions"><button type="button" data-v1011-index>↻ Actualizar índice</button><button type="button" data-v1011-backup>⬇ Respaldo cifrado</button><button type="button" data-v1011-restore>↥ Restaurar respaldo</button><button type="button" data-v1011-persist>▣ Proteger almacenamiento</button></div>'+
 '<label class="v1011-search">Buscar en temporadas guardadas<input type="search" data-v1011-query placeholder="Nombre o apellido…" autocomplete="off"></label><div class="v1011-results" data-v1011-results></div>'+
 '<input data-v1011-file type="file" accept=".json,application/json" hidden>'+
 '<p class="v1011-status" data-v1011-status role="status" aria-live="polite">Activando índice privado sin modificar tus registros…</p>'+
 '<small class="v1011-note">Los respaldos cifrados incluyen el padrón, pero no las fotografías ni documentos. No borres los datos del navegador sin guardar también tus fotos.</small>';
 head.after(panel);
 const on=(selector,fn)=>$(selector,panel)?.addEventListener('click',fn);
 on('[data-v1011-index]',()=>queue(0));
 on('[data-v1011-backup]',backup);
 on('[data-v1011-restore]',()=> $('[data-v1011-file]',panel)?.click());
 on('[data-v1011-persist]',async()=>{
  try{
   if(!navigator.storage?.persist){status('Tu navegador no admite solicitar almacenamiento persistente.');return}
   const granted=await navigator.storage.persist();
   status(granted?'Almacenamiento persistente concedido en este dispositivo.':'El navegador no garantizó persistencia; descarga un respaldo cifrado.');
  }catch(e){status('No se pudo comprobar el permiso de almacenamiento.')}
 });
 $('[data-v1011-file]',panel)?.addEventListener('change',async e=>{
  const file=e.target.files?.[0];e.target.value='';await restore(file);
 });
 let searchTimer=0;
 $('[data-v1011-query]',panel)?.addEventListener('input',e=>{
  clearTimeout(searchTimer);
  const value=e.target.value;
  searchTimer=setTimeout(()=>lookup(value,panel),190);
 });
 queue(1500);
}
let mountTimer=0;
function scheduleMount(){clearTimeout(mountTimer);mountTimer=setTimeout(mount,110)}
window.addEventListener('hashchange',scheduleMount);
window.addEventListener('ljr:local-roster-changed',()=>queue(1300));
window.addEventListener('storage',e=>{if(e.key==='v124-player-registry')queue(1800)});
const screen=$('#screen');
if(screen)new MutationObserver(()=>{
 if(route()==='credentialBuilder'&&!$('#v124-player-registry [data-v1011-hub]'))scheduleMount();
}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});else scheduleMount();
window.LJR_LOCAL_REGISTRY={refresh:()=>queue(0),open:database};

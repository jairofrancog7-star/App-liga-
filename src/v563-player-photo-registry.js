/* V563 — Fotografía persistente para el registro propio de jugadores.
   Guarda fotos sólo en IndexedDB del dispositivo y las reutiliza en credencial/listados. */
(function(){
'use strict';
if(window.__LJR_V563_PLAYER_PHOTOS__)return;
window.__LJR_V563_PLAYER_PHOTOS__=true;

const DB='ljr-player-photos-v1',STORE='photos',REG_KEY='v124-player-registry',SEASON_KEY='v124-player-season',EDIT_KEY='v124-player-edit-id';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

function openDb(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window)){reject(new Error('IndexedDB no disponible'));return}
  const req=indexedDB.open(DB,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'})};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('No se pudo abrir fotos'));
 });
}
async function putPhoto(value){
 const db=await openDb();
 await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
 db.close();
}
async function getPhoto(id){
 if(!id)return null;
 try{
  const db=await openDb();
  const v=await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),req=tx.objectStore(STORE).get(id);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)});
  db.close();return v;
 }catch(_){return null}
}
async function delPhoto(id){
 try{const db=await openDb();await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});db.close()}catch(_){}
}
async function fileData(file){
 if(!file)return '';
 let img=null;
 try{if(typeof createImageBitmap==='function')img=await createImageBitmap(file,{imageOrientation:'from-image'})}catch(_){}
 if(!img){
  const src=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
  img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src});
 }
 const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
 const s=Math.min(1,720/iw,900/ih),w=Math.max(1,Math.round(iw*s)),h=Math.max(1,Math.round(ih*s));
 const cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);
 try{img.close?.()}catch(_){}
 return cv.toDataURL('image/jpeg',.9);
}
function registry(){
 try{return JSON.parse(localStorage.getItem(REG_KEY)||'{"seasons":{}}')||{seasons:{}}}catch(_){return {seasons:{}}}
}
function season(){
 const saved=localStorage.getItem(SEASON_KEY);if(saved)return saved;
 const n=new Date(),y=n.getMonth()>=7?n.getFullYear():n.getFullYear()-1;return y+'–'+(y+1);
}
function findRecord(){
 const d=registry(),rows=d?.seasons?.[season()]||[],edit=localStorage.getItem(EDIT_KEY)||'';
 if(edit){const r=rows.find(x=>x.id===edit);if(r)return r}
 const name=$('[data-v64-cred-name]')?.value?.trim()||'',team=$('[data-v64-cred-team]')?.value?.trim()||'';
 return rows.find(x=>norm(x.name)===norm(name)&&norm(x.team)===norm(team))||rows.find(x=>norm(x.name)===norm(name))||null;
}
function cache(rec,src){
 if(!rec||!src)return;
 const pub=window.LJR_PLAYER_PHOTOS&&typeof window.LJR_PLAYER_PHOTOS==='object'?window.LJR_PLAYER_PHOTOS:{};
 pub[norm(rec.name)+'|'+norm(rec.team)]=src;pub[norm(rec.name)]=src;window.LJR_PLAYER_PHOTOS=pub;
}
async function saveCurrent(){
 const input=$('[data-v64-photo]'),file=input?.files?.[0];if(!file)return;
 await new Promise(r=>setTimeout(r,180));
 const rec=findRecord();if(!rec)return;
 try{
  const dataUrl=await fileData(file);
  await putPhoto({id:rec.id,name:rec.name,team:rec.team,dataUrl,updatedAt:new Date().toISOString()});
  cache(rec,dataUrl);
  hydrate();
 }catch(e){console.warn('[V563 player photo save]',e)}
}
async function fileFromDataUrl(dataUrl,name='jugador.jpg'){
 const r=await fetch(dataUrl),blob=await r.blob();
 return new File([blob],name,{type:blob.type||'image/jpeg'});
}
async function restore(id){
 const row=await getPhoto(id);if(!row?.dataUrl)return;
 const d=registry(),rows=d?.seasons?.[season()]||[],rec=rows.find(x=>x.id===id)||row;cache(rec,row.dataUrl);
 const preview=$('[data-v64-player-mini-preview]');
 if(preview)preview.innerHTML='<img src="'+row.dataUrl+'" alt="Fotografía guardada del jugador">';
 const input=$('[data-v64-photo]');
 if(input&&typeof DataTransfer!=='undefined'){
  try{
   const file=await fileFromDataUrl(row.dataUrl,(row.name||'jugador')+'.jpg'),dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  }catch(_){}
 }
}
/* V1006: leer fotos desde IndexedDB sólo cuando aparece la tarjeta
   (y no mientras el usuario desplaza cientos de registros). */
const photoObserved=new Set();
let photoViewportObserver=null;
async function loadAvatar(card){
 const avatar=$('.v124-avatar',card),id=card.dataset.v124Id;
 if(!avatar||avatar.dataset.v563PhotoReady)return;
 avatar.dataset.v563PhotoReady='loading';
 const row=await getPhoto(id);
 if(!card.isConnected||route()!=='credentialBuilder'||card.dataset.v124Id!==id)return;
 avatar.dataset.v563PhotoReady='1';
 if(!row?.dataUrl)return;
 const d=registry(),rec=(d?.seasons?.[season()]||[]).find(x=>x.id===id)||row;
 cache(rec,row.dataUrl);
 const img=document.createElement('img');
 img.alt='';img.loading='lazy';img.decoding='async';img.src=row.dataUrl;
 avatar.replaceChildren(img);
 avatar.classList.add('has-photo');
}
function photoObserver(){
 if(typeof IntersectionObserver!=='function')return null;
 if(!photoViewportObserver){
  photoViewportObserver=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    photoViewportObserver.unobserve(entry.target);
    photoObserved.delete(entry.target);
    loadAvatar(entry.target);
   }
  },{rootMargin:'180px 0px',threshold:0});
 }
 return photoViewportObserver;
}
async function hydrate(){
 if(route()!=='credentialBuilder'){
  photoViewportObserver?.disconnect();photoObserved.clear();return;
 }
 const cards=$$('.v124-player-card[data-v124-id]');
 const current=new Set(cards),observer=photoObserver();
 for(const old of photoObserved){
  if(current.has(old))continue;
  observer?.unobserve(old);photoObserved.delete(old);
 }
 for(const card of cards){
  const avatar=$('.v124-avatar',card);
  if(!avatar||avatar.dataset.v563PhotoReady||photoObserved.has(card))continue;
  if(observer){photoObserved.add(card);observer.observe(card)}
  else loadAvatar(card);
 }
 const label=$('[data-v64-photo]')?.closest('label');
 if(label&&!label.dataset.v563PhotoLabel){
  label.dataset.v563PhotoLabel='1';
  const b=$('b',label);if(b)b.textContent='Fotografía del jugador';
  label.insertAdjacentHTML('beforeend','<small class="v563-photo-note">Se guarda con este registro en el teléfono y se usa en su credencial.</small>');
 }
}
document.addEventListener('click',e=>{
 if(route()!=='credentialBuilder'||!(e.target instanceof Element))return;
 if(e.target.closest('[data-v124-save]'))setTimeout(saveCurrent,40);
 const edit=e.target.closest('[data-v124-edit],[data-v124-card]');
 if(edit){const id=edit.dataset.v124Edit||edit.dataset.v124Card;setTimeout(()=>restore(id),190)}
 const del=e.target.closest('[data-v124-delete]');
 if(del){const id=del.dataset.v124Delete;setTimeout(()=>{const d=registry(),exists=Object.values(d.seasons||{}).some(list=>(list||[]).some(x=>x.id===id));if(!exists)delPhoto(id)},250)}
},true);
document.addEventListener('change',e=>{if(route()==='credentialBuilder'&&e.target instanceof Element&&e.target.matches('[data-v64-photo]'))setTimeout(hydrate,80)},true);

let t=0;function schedule(){clearTimeout(t);t=setTimeout(hydrate,120)}
window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);
const screen=$('#screen');
if(screen)new MutationObserver(records=>{
 if(route()!=='credentialBuilder')return;
 const newCards=records.some(r=>[...r.addedNodes].some(n=>
  n.nodeType===1&&(n.matches?.('.v124-player-card,#v124-player-registry,[data-v64-photo]')||
  n.querySelector?.('.v124-player-card,[data-v64-photo]'))));
 if(newCards)schedule();
}).observe(screen,{childList:true,subtree:true});
schedule();setTimeout(schedule,900);
window.LJR_V563_PHOTOS={get:getPhoto,put:putPhoto,delete:delPhoto,hydrate,restore};
})();
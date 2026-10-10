/* V1112 — Evidencia fotografica y PDF de incidencias: 100% local, sin CDN.
 * Fotografias: IndexedDB (no localStorage); informes PDF: pdf-lib alojada por la Liga.
 * Intercambio: copia manual JSON, nunca sincronizacion automatica ni permisos simulados.
 */
(()=>{
'use strict';
if(window.LJR_INCIDENTS_MEDIA)return;
const DB_NAME='ljr-incidents-media-v1',STORE='photos',MAX_FILE=8*1024*1024;
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
let database=null,dbPending=null,pdfPending=null;
let previewUrls=new Map(),renderVersion=0;
const pendingPreview={url:null};
function openDB(){
 if(database)return Promise.resolve(database);
 if(dbPending)return dbPending;
 dbPending=new Promise((resolve,reject)=>{
  if(!('indexedDB' in window))return reject(Error('Este navegador no permite guardar fotos locales.'));
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE,{keyPath:'id'})};
  req.onsuccess=()=>{database=req.result;database.onversionchange=()=>{database.close();database=null};resolve(database)};
  req.onerror=()=>reject(req.error||Error('No se pudo abrir el almacenamiento de fotos'));
  req.onblocked=()=>reject(Error('Cierra otras pestañas de la Liga y vuelve a intentar.'));
 }).catch(err=>{dbPending=null;throw err});
 return dbPending;
}
async function readPhoto(id){
 if(!id)return null;const db=await openDB();
 return new Promise((resolve,reject)=>{
  const req=db.transaction(STORE,'readonly').objectStore(STORE).get(String(id));
  req.onsuccess=()=>resolve(req.result?.blob instanceof Blob?req.result.blob:null);
  req.onerror=()=>reject(req.error||Error('Error leyendo fotografia'));
 });
}
async function writePhoto(id,blob){
 const db=await openDB();return new Promise((resolve,reject)=>{
  const req=db.transaction(STORE,'readwrite').objectStore(STORE).put({id:String(id),blob,updatedAt:new Date().toISOString()});
  req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error||Error('Sin espacio para la fotografia'));
 });
}
async function deletePhoto(id){
 const db=await openDB();return new Promise((resolve,reject)=>{
  const req=db.transaction(STORE,'readwrite').objectStore(STORE).delete(String(id));
  req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error||Error('No se pudo quitar la fotografia'));
 });
}
async function compress(file){
 if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Elige una imagen JPG, PNG o WebP.');
 if(file.size>MAX_FILE)throw Error('La imagen supera 8 MB. Usa una foto mas ligera.');
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(Error('No se pudo abrir la fotografia.'));image.src=url});
  if(!image.naturalWidth||!image.naturalHeight)throw Error('Fotografia no valida');
  const ratio=Math.min(1,1280/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
  const ctx=canvas.getContext('2d');
  if(!ctx)throw Error('El telefono no pudo preparar la imagen.');
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.76));
  canvas.width=1;canvas.height=1;
  if(!blob)throw Error('No se pudo convertir la fotografia.');
  return blob;
 }finally{URL.revokeObjectURL(url)}
}
function clearUrls(){
 for(const url of previewUrls.values())URL.revokeObjectURL(url);
 previewUrls.clear();
 if(pendingPreview.url){URL.revokeObjectURL(pendingPreview.url);pendingPreview.url=null}
}
function refresh(modal){
 if(!modal?.isConnected)return;
 const token=++renderVersion;
 for(const url of previewUrls.values())URL.revokeObjectURL(url);
 previewUrls.clear();
 const nodes=[...modal.querySelectorAll('[data-photo-for]')];
 for(const n of nodes){
  const id=n.dataset.photoFor;
  readPhoto(id).then(blob=>{
   if(!blob||token!==renderVersion||!n.isConnected)return;
   const url=URL.createObjectURL(blob);previewUrls.set(id,url);
   const img=document.createElement('img');img.src=url;img.alt='Fotografia local adjunta a incidencia';img.loading='lazy';
   img.width=96;img.height=64;n.replaceChildren(img);
  }).catch(()=>{});
 }
}
function loadPdfLib(){
 if(window.PDFLib?.PDFDocument)return Promise.resolve(window.PDFLib);
 if(pdfPending)return pdfPending;
 pdfPending=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=new URL('./vendor/pdf-lib-1.17.1.min.js',import.meta.url).href;script.async=true;
  script.onload=()=>window.PDFLib?.PDFDocument?resolve(window.PDFLib):reject(Error('No se pudo iniciar el motor PDF local.'));
  script.onerror=()=>reject(Error('No se encontro el motor PDF local.'));document.head.appendChild(script);
 }).catch(e=>{pdfPending=null;throw e});
 return pdfPending;
}
function latin(v){
 return String(v??'').replace(/\u2019/g,"'").replace(/[\u2013\u2014]/g,'-').replace(/[\u00a0]/g,' ').replace(/[^\u0020-\u00ff]/g,'');
}
function wrap(text,font,size,maxWidth,limit=3){
 const words=latin(text).trim().split(/\s+/).filter(Boolean),lines=[];let line='';
 for(const word of words){
  const next=line?line+' '+word:word;
  if(font.widthOfTextAtSize(next,size)>maxWidth&&line){lines.push(line);line=word}else line=next;
  if(lines.length>=limit){break}
 }
 if(line&&lines.length<limit)lines.push(line);
 return lines;
}
function download(bytes,name,type){
 const blob=new Blob([bytes],{type});const url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download=name;a.style.display='none';
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),25000);
}
async function pdfReport(items,heading,status){
 const lib=await loadPdfLib();
 const pdf=await lib.PDFDocument.create();
 const regular=await pdf.embedFont(lib.StandardFonts.Helvetica),bold=await pdf.embedFont(lib.StandardFonts.HelveticaBold);
 const C={blue:lib.rgb(.03,.13,.4),light:lib.rgb(.92,.96,1),white:lib.rgb(1,1,1),ink:lib.rgb(.12,.2,.4),gray:lib.rgb(.43,.5,.62)};
 const W=595.28,H=841.89,margin=38;
 let page=null,y=0,count=0;
 function nextPage(){
  page=pdf.addPage([W,H]);count++;
  page.drawRectangle({x:0,y:H-105,width:W,height:105,color:C.blue});
  page.drawText('LIGA JUVENTINO ROSAS',{x:margin,y:H-47,size:15,font:bold,color:C.white});
  page.drawText('REPORTE LOCAL DE INCIDENCIAS - NO OFICIAL',{x:margin,y:H-69,size:9,font:regular,color:C.white});
  for(const [i,line] of wrap(heading,regular,9,W-2*margin,2).entries()){
   page.drawText(line,{x:margin,y:H-88-i*11,size:9,font:regular,color:C.white});
  }
  page.drawText('Bitacora auxiliar. No modifica cedula, resultado ni sanciones oficiales.',{x:margin,y:25,size:8,font:regular,color:C.gray});
  y=H-127;
 }
 nextPage();
 for(let i=0;i<items.length;i++){
  const x=items[i],id=String(x.id||''),label=(x.min??'—')+(Number(x.extra)>0?'+'+x.extra:'')+"'  "+(x.type||'Evento');
  const headingLine=wrap(label,bold,11,380,2),teamLine=wrap([x.team,x.player].filter(Boolean).join(' | ')||'Sin equipo o jugador',regular,9,375,2);
  const note=wrap([x.secondary?('Asistencia / cambio: '+x.secondary):'',x.note||''].filter(Boolean).join(' - '),regular,9,375,3);
  const lines=headingLine.length+teamLine.length+note.length;
  const h=Math.max(74,23+lines*12);
  if(y-h<53)nextPage();
  page.drawRectangle({x:margin,y:y-h,width:W-margin*2,height:h-6,color:i%2?C.white:C.light});
  let lineY=y-20;
  for(const line of headingLine){page.drawText(line,{x:margin+12,y:lineY,size:11,font:bold,color:C.blue});lineY-=13}
  for(const line of teamLine){page.drawText(line,{x:margin+12,y:lineY,size:9,font:regular,color:C.ink});lineY-=12}
  for(const line of note){page.drawText(line,{x:margin+12,y:lineY,size:9,font:regular,color:C.gray});lineY-=12}
  try{
   const blob=await readPhoto(id);
   if(blob){
    const photo=await pdf.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const fitted=photo.scaleToFit(101,h-20);
    page.drawImage(photo,{x:W-margin-10-fitted.width,y:y-h+8,width:fitted.width,height:fitted.height});
   }
  }catch(_){/* La falta de foto no impide exportar el reporte */ }
  y-=h+6;
  if(i%12===0)status('Generando PDF '+(i+1)+' de '+items.length+'…');
 }
 pdf.setTitle('Incidencias locales - Liga Juventino Rosas');
 pdf.setSubject('Registro local de apoyo. NO OFICIAL');
 const bytes=await pdf.save({useObjectStreams:true});
 download(bytes,'incidencias-liga-juventino-rosas.pdf','application/pdf');
 return count;
}
async function asDataURL(blob){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(Error('Fallo al preparar respaldo'));reader.readAsDataURL(blob);
 });
}
function dataUrlBlob(url){
 if(typeof url!=='string'||!/^data:image\/jpeg;base64,[a-zA-Z0-9+/=]+$/.test(url)||url.length>2000000)return null;
 const bin=atob(url.slice(url.indexOf(',')+1)),arr=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
 return new Blob([arr],{type:'image/jpeg'});
}
async function backup(entries,status){
 if(!entries.length){status('No hay incidencias que respaldar.');return}
 if(entries.length>1500){status('Respalda primero menos de 1500 incidencias.');return}
 const photos={};
 for(const x of entries){
  try{
   const blob=await readPhoto(x.id);
   if(blob&&blob.size<=900000)photos[x.id]=await asDataURL(blob);
  }catch(_){}
 }
 const payload={format:'ljr-incidents-backup-v1',exportedAt:new Date().toISOString(),entries,photos};
 const text=JSON.stringify(payload);
 if(text.length>24000000)throw Error('El respaldo supera 24 MB. Exporta menos registros.');
 download(new TextEncoder().encode(text),'respaldo-privado-incidencias-liga.json','application/json');
 status('Respaldo privado descargado. Compartelo solo con personal autorizado.');
}
function attach({modal,getEntries,getVisible,getChosen,merge,status}){
 if(!modal||modal.dataset.v1112Enhanced)return;
 modal.dataset.v1112Enhanced='1';
 const form=$('.v1111-form',modal),bottom=$('.v1111-bottom',modal);
 const panel=document.createElement('div');panel.className='v1112-photo-panel';
 panel.innerHTML='<label><span>Fotografia de evidencia (opcional)</span><input type="file" data-photo-input accept="image/jpeg,image/png,image/webp" capture="environment"></label>'+
 '<div class="v1112-photo-controls"><button type="button" data-photo-clear>Quitar seleccion</button><label data-photo-delete-wrap hidden><input type="checkbox" data-photo-delete> Quitar foto guardada al guardar</label></div>'+
 '<div class="v1112-photo-preview" data-preview aria-live="polite"></div>'+
 '<small>Foto privada guardada solo en este navegador. Maximo 8 MB.</small>';
 form.appendChild(panel);
 bottom.insertAdjacentHTML('beforeend','<button type="button" data-pdf>↓ PDF</button><button type="button" data-backup>↓ Respaldo</button>'+
  '<label class="v1112-import"><span>↑ Importar respaldo</span><input type="file" data-import accept=".json,application/json"></label>');
 const input=$('[data-photo-input]',panel),preview=$('[data-preview]',panel);
 let pendingRemove=false;
 function reset(){
  input.value='';pendingRemove=false;$('[data-photo-delete-wrap]',panel).hidden=true;$('[data-photo-delete]',panel).checked=false;
  if(pendingPreview.url){URL.revokeObjectURL(pendingPreview.url);pendingPreview.url=null}
  preview.replaceChildren();
 }
 async function edit(entry){
  reset();
  try{
   const blob=await readPhoto(entry?.id);
   if(!blob||!modal.isConnected)return;
   const img=document.createElement('img'),url=URL.createObjectURL(blob);
   pendingPreview.url=url;img.src=url;img.alt='Foto guardada para esta incidencia';preview.replaceChildren(img);
   $('[data-photo-delete-wrap]',panel).hidden=false;
  }catch(_){status('Las fotos no estan disponibles en este navegador.')}
 }
 input.addEventListener('change',async()=>{
  if(pendingPreview.url){URL.revokeObjectURL(pendingPreview.url);pendingPreview.url=null}
  preview.replaceChildren();
  const file=input.files?.[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>MAX_FILE){status('Solo JPG, PNG o WebP de hasta 8 MB.');input.value='';return}
  const url=URL.createObjectURL(file);pendingPreview.url=url;
  const img=document.createElement('img');img.src=url;img.alt='Fotografia seleccionada';preview.appendChild(img);
 });
 $('[data-photo-clear]',panel).addEventListener('click',()=>{input.value='';if(pendingPreview.url){URL.revokeObjectURL(pendingPreview.url);pendingPreview.url=null}preview.replaceChildren()});
 $('[data-photo-delete]',panel).addEventListener('change',e=>{pendingRemove=!!e.target.checked});
 modal.addEventListener('ljr:incident:edit',e=>{edit(e.detail.entry)});
 modal.addEventListener('ljr:incident:reset',reset);
 modal.addEventListener('ljr:incident:saved',async e=>{
  const id=e.detail?.entry?.id,file=input.files?.[0],remove=pendingRemove;
  if(!id||(!file&&!remove))return;
  try{
   if(file){status('Comprimiendo y guardando fotografia…');await writePhoto(id,await compress(file))}
   else if(remove)await deletePhoto(id);
   refresh(modal);status('Incidencia y fotografia actualizadas en este dispositivo.');
  }catch(error){status('Incidencia guardada, pero la foto no: '+(error?.message||'error de almacenamiento'))}
 });
 $('[data-pdf]',modal).addEventListener('click',async e=>{
  const list=getVisible().slice().sort((a,b)=>Number(a.min||0)-Number(b.min||0));
  if(!list.length)return status('Agrega al menos una incidencia para generar PDF.');
  if(list.length>250)return status('El reporte admite hasta 250 incidencias por PDF. Selecciona un partido.');
  const button=e.currentTarget;button.disabled=true;
  try{
   status('Preparando PDF local…');
   const m=getChosen();const heading=m?'J'+m.round+' | '+m.home+' vs '+m.away:'Bitacora general';
   await pdfReport(list,heading,status);
   status('PDF descargado. Este reporte es NO OFICIAL.');
  }catch(error){status('No se pudo crear el PDF: '+(error?.message||'error'))}
  finally{button.disabled=false}
 });
 $('[data-backup]',modal).addEventListener('click',async e=>{
  const button=e.currentTarget;button.disabled=true;
  try{status('Preparando respaldo privado…');await backup(getEntries(),status)}
  catch(error){status('No se pudo exportar el respaldo: '+(error?.message||'error'))}
  finally{button.disabled=false}
 });
 $('[data-import]',modal).addEventListener('change',async e=>{
  const file=e.target.files?.[0];e.target.value='';
  if(!file)return;
  if(file.size>24000000)return status('El archivo supera 24 MB.');
  try{
   const backup=JSON.parse(await file.text());
   if(backup?.format!=='ljr-incidents-backup-v1'||!Array.isArray(backup.entries)||backup.entries.length>1500)throw Error('Formato de respaldo no reconocido.');
   if(!confirm('Importar incidencias en este dispositivo? Se conservaran los registros existentes; no se modifica ninguna cedula oficial.'))return;
   const result=merge(backup.entries);
   if(!result?.ok)return;
   const validIds=new Set(backup.entries.map(x=>String(x?.id||'')));
   let photos=0;
   for(const [id,url] of Object.entries(backup.photos||{})){
    if(!validIds.has(id))continue;
    const blob=dataUrlBlob(url);if(!blob)continue;
    try{await writePhoto(id,blob);photos++}catch(_){}
   }
   refresh(modal);status('Respaldo importado: '+result.added+' incidencias nuevas, '+photos+' fotos. Los registros previos se conservaron.');
  }catch(error){status('No se pudo importar: '+(error?.message||'archivo no valido'))}
 });
 const close=$('[data-close]',modal);
 close?.addEventListener('click',()=>{++renderVersion;clearUrls()},{once:true});
 const cleanup=new MutationObserver(()=>{if(!modal.isConnected){++renderVersion;clearUrls();cleanup.disconnect()}});
 cleanup.observe(document.body,{childList:true});
 refresh(modal);
}
const style=document.createElement('style');style.textContent=
'.v1111-incidents-modal .v1112-photo-panel{grid-column:1/-1;display:grid;gap:7px;padding:10px;border:1px solid #355cac;border-radius:12px;background:#102470}'+
'.v1111-incidents-modal .v1112-photo-panel>label{font-size:11px;font-weight:800;color:#b5edff;display:grid;gap:7px}'+
'.v1111-incidents-modal .v1112-photo-panel input[type=file]{height:auto!important;min-height:40px!important;padding:7px!important;font-size:11px!important}'+
'.v1111-incidents-modal .v1112-photo-controls{display:flex;align-items:center;gap:10px;flex-wrap:wrap}'+
'.v1111-incidents-modal .v1112-photo-controls button{background:#1a367e;color:#fff;border:1px solid #4772ba;border-radius:9px;padding:7px 10px;font-size:11px}'+
'.v1111-incidents-modal .v1112-photo-controls label{font-size:11px;color:#d1e7ff}'+
'.v1111-incidents-modal .v1112-photo-preview:empty{display:none}'+
'.v1111-incidents-modal .v1112-photo-preview img{display:block;width:110px;max-height:90px;object-fit:cover;border-radius:10px;border:1px solid #5b8dda}'+
'.v1111-incidents-modal .v1112-photo-panel small{font-size:10px;color:#abc9ea}'+
'.v1111-incidents-modal [data-photo-for]:empty{display:none}'+
'.v1111-incidents-modal [data-photo-for] img{display:block;max-width:116px;height:70px;object-fit:cover;border-radius:9px;margin-top:7px}'+
'.v1111-incidents-modal .v1112-import{display:flex;align-items:center;justify-content:center;cursor:pointer;padding:7px 10px;background:#142d83;border:1px solid #3963ac;border-radius:10px;color:#effaff;font-size:11px;font-weight:750}'+
'.v1111-incidents-modal .v1112-import input{display:none}'+
'html body > .v105-modal.v1111-incidents-modal .v1112-photo-controls [hidden]{display:none!important}';
document.head.appendChild(style);
window.LJR_INCIDENTS_MEDIA={attach,refresh};
})();
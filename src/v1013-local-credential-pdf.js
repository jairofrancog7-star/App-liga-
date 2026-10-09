/* V1013 · pdf-lib 1.17.1 servido localmente: credenciales sin servidor.
   No se recopila telemetria ni se transfieren CURP, fotos ni documentos. */
import {validateCurp,completion} from './registration-core.js';
import {credentialPlacement} from './credential-pdf-layout.js';

(()=>{
'use strict';
if(window.__LJR_V1013_PDF__)return;
window.__LJR_V1013_PDF__=true;
const $=(s,r=document)=>r.querySelector(s);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const MAX_BATCH=32;
let loading=null,busy=false,cancel=false,bootTimer=0;
let managerObserver=null;
const pause=()=>new Promise(resolve=>setTimeout(resolve,30));

function loadPdfLib(){
 if(window.PDFLib?.PDFDocument)return Promise.resolve(window.PDFLib);
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src=new URL('./vendor/pdf-lib-1.17.1.min.js',import.meta.url).href;
  script.async=true;
  script.onload=()=>window.PDFLib?.PDFDocument?resolve(window.PDFLib):reject(Error('No se pudo iniciar pdf-lib local'));
  script.onerror=()=>reject(Error('No se encontro la biblioteca PDF local. Recarga la aplicacion.'));
  document.head.appendChild(script);
 }).catch(error=>{loading=null;throw error});
 return loading;
}
function show(message){
 const e=$('[data-v1013-status]');
 if(e)e.textContent=message;
}
async function openDB(name,store){
 if(!('indexedDB' in window))return null;
 return new Promise(resolve=>{
  let done=false;
  try{
   const request=indexedDB.open(name);
   request.onsuccess=()=>{
    const db=request.result;
    if(!db.objectStoreNames.contains(store)){db.close();resolve(null)}
    else resolve(db);
   };
   request.onerror=()=>resolve(null);
   request.onblocked=()=>resolve(null);
   request.onupgradeneeded=()=>{
    // No crear almacenamiento adicional si el usuario aun no tiene imagenes.
    request.transaction?.abort();
   };
  }catch(_){if(!done)resolve(null)}
 });
}
async function stored(db,store,key){
 if(!db||!key)return null;
 return new Promise(resolve=>{
  try{
   const req=db.transaction(store,'readonly').objectStore(store).get(key);
   req.onsuccess=()=>resolve(req.result||null);
   req.onerror=()=>resolve(null);
  }catch(_){resolve(null)}
 });
}
function decodeDataImage(dataUrl){
 if(typeof dataUrl!=='string'||!/^data:image\/(png|jpeg|webp);base64,/i.test(dataUrl))return null;
 const [header,payload]=dataUrl.split(',',2);
 if(!payload||payload.length>8e6)return null;
 const mime=/image\/([a-z]+)/i.exec(header)?.[0]||'image/jpeg';
 try{
  const chars=atob(payload),size=chars.length,arr=new Uint8Array(size);
  for(let i=0;i<size;i++)arr[i]=chars.charCodeAt(i);
  return new File([arr],'fotografia.jpg',{type:mime});
 }catch(_){return null}
}
async function findPhoto(record,mediaDb,photosDb){
 const obj=await stored(mediaDb,'players',record.assetKey||record.id);
 if(obj?.photo instanceof Blob)return obj.photo;
 const other=await stored(photosDb,'photos',record.id);
 return decodeDataImage(other?.dataUrl);
}
function playerAge(dob){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(dob||''))return -1;
 const [y,m,d]=dob.split('-').map(Number);
 const now=new Date();let age=now.getFullYear()-y;
 if(now.getMonth()+1<m||(now.getMonth()+1===m&&now.getDate()<d))age--;
 return age;
}
function canPrint(record,photo){
 if(!record?.name?.trim()||!record?.team?.trim())return 'faltan nombre o equipo';
 if(!photo)return 'falta fotografia';
 const done=completion(record,true);
 if(!done.ready)return done.missing.join(', ');
 const curp=validateCurp(record.curp);
 if(!curp.ok)return 'CURP invalida';
 const category=String(record.category||'');
 const limit=/(?:^|\D)50\s*\+?(?:\D|$)/.test(category)?50:/(?:^|\D)35\s*\+?(?:\D|$)/.test(category)?35:0;
 if(limit&&playerAge(record.dob)<limit)return 'no cumple edad de Veteranos '+limit+'+';
 return null;
}
async function canvasBytes(canvas){
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.88));
 if(!blob)throw Error('El telefono no pudo convertir la credencial a imagen');
 return new Uint8Array(await blob.arrayBuffer());
}
function downloadPdf(data,name){
 const blob=new Blob([data],{type:'application/pdf'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),15000);
}
async function draw(canvas,pdf,page,index,mode){
 let imageBytes;
 try{imageBytes=await canvasBytes(canvas)}
 finally{canvas.width=1;canvas.height=1}
 const jpg=await pdf.embedJpg(imageBytes);
 const p=credentialPlacement(mode,index);
 if(!page||page.getWidth()!==p.pageWidth||page.getHeight()!==p.pageHeight)page=pdf.addPage([p.pageWidth,p.pageHeight]);
 page.drawImage(jpg,{x:p.x,y:p.y,width:p.width,height:p.height});
 if(mode==='a4')page.drawRectangle({x:p.x,y:p.y,width:p.width,height:p.height,borderColor:(await loadPdfLib()).rgb(.65,.7,.78),borderWidth:.3,opacity:0,borderOpacity:.75});
 return page;
}
async function single(canvasFactory){
 if(typeof canvasFactory!=='function')throw Error('No se pudo preparar la credencial');
 show('Creando credencial PDF local…');
 const lib=await loadPdfLib();
 const pdf=await lib.PDFDocument.create();
 const canvas=await canvasFactory();
 await draw(canvas,pdf,null,0,'individual');
 pdf.setTitle('Credencial Liga Juventino Rosas');
 const bytes=await pdf.save({useObjectStreams:true});
 downloadPdf(bytes,'Credencial_Liga_Juventino_tamano_INE.pdf');
 show('Credencial PDF descargada sin enviar datos a Internet');
}
async function batch(mode){
 if(busy)return;
 const api=window.LJR_PLAYER_REGISTRY,selected=new Set(api?.selected?.()||[]);
 const records=(api?.records?.()||[]).filter(x=>selected.has(x.id));
 if(!records.length){show('Selecciona primero jugadores usando las casillas de Registro.');return}
 if(records.length>MAX_BATCH){show('Seleccionaste '+records.length+' jugadores. Exporta grupos de hasta '+MAX_BATCH+' para evitar que se trabe el telefono.');return}
 busy=true;cancel=false;
 const button=$('[data-v1013-run]'),abort=$('[data-v1013-cancel]');
 if(button)button.disabled=true;
 if(abort)abort.hidden=false;
 let mediaDb=null,photosDb=null;
 let completed=0,ignored=0;const failures=[];
 try{
  show('Iniciando PDF local para '+records.length+' jugadores…');
  const lib=await loadPdfLib(),pdf=await lib.PDFDocument.create();
  mediaDb=await openDB('ljr-registration-media','players');
  photosDb=await openDB('ljr-player-photos-v1','photos');
  let page=null;
  for(let i=0;i<records.length;i++){
   if(cancel){show('Generacion cancelada: no se descargo ningun archivo.');return}
   const record=records[i];
   show('Verificando credencial '+(i+1)+' de '+records.length+'…');
   try{
    const photo=await findPhoto(record,mediaDb,photosDb);
    const reason=canPrint(record,photo);
    if(reason){ignored++;failures.push(record.name+': '+reason);continue}
    const render=window.LJR_V480?.makeRecordCanvas;
    if(typeof render!=='function')throw Error('No se encontro el diseno de credencial');
    const canvas=await render({...record,photoFile:photo},1.5);
    page=await draw(canvas,pdf,page,completed,mode);
    completed++;
   }catch(error){
    ignored++;failures.push(record.name+': '+(error?.message||'no se pudo preparar'));
   }
   await pause();
  }
  if(cancel){show('Generacion cancelada: no se descargo ningun archivo.');return}
  if(!completed){show('No hay credenciales listas. Revisa CURP, fecha, foto y categoria antes de imprimir.');return}
  show('Guardando '+completed+' credenciales en PDF…');
  pdf.setTitle('Credenciales de Liga Juventino Rosas');
  const bytes=await pdf.save({useObjectStreams:true});
  const season=(localStorage.getItem('v124-player-season')||'temporada').replace(/[^0-9a-zA-Z-]/g,'-');
  downloadPdf(bytes,'Credenciales-Liga-'+season+'-'+completed+'.pdf');
  show('PDF local descargado: '+completed+' credenciales.'+(ignored?' Omitidos '+ignored+' incompletos. Revisa los detalles.':''));
  const report=$('[data-v1013-skipped]');
  if(report){
   report.replaceChildren();
   if(failures.length){
    const summary=document.createElement('summary');
    summary.textContent=ignored+' registros no incluidos (ver motivos)';
    report.append(summary);
    const list=document.createElement('ul');
    failures.slice(0,MAX_BATCH).forEach(reason=>{const li=document.createElement('li');li.textContent=reason;list.append(li)});
    report.append(list);
   }
  }
 }catch(error){show('No fue posible generar el PDF: '+(error?.message||'fallo del motor local'))}
 finally{
  mediaDb?.close();photosDb?.close();
  busy=false;cancel=false;
  if(button)button.disabled=false;
  if(abort)abort.hidden=true;
 }
}
function mount(){
 if(route()!=='credentialBuilder')return;
 const registry=$('#v124-player-registry'),head=registry?.querySelector('.v124-head');
 if(!head||registry.querySelector('[data-v1013-pdf-panel]'))return;
 const panel=document.createElement('section');
 panel.className='v1013-pdf-panel';
 panel.dataset.v1013PdfPanel='1';
 panel.innerHTML='<div class="v1013-pdf-head"><span aria-hidden="true">▣</span><div><small>PDF LIB · EN ESTE DISPOSITIVO</small><h3>Imprimir credenciales en lote</h3><p>Selecciona jugadores en la lista. Conservamos tu diseño y tamaño INE.</p></div></div>'+
  '<label class="v1013-format">Presentacion del PDF<select data-v1013-mode><option value="a4">Hoja A4 · 8 credenciales</option><option value="individual">Una credencial INE por pagina</option></select></label>'+
  '<div class="v1013-pdf-actions"><button type="button" data-v1013-run>Generar PDF de seleccionados</button><button type="button" data-v1013-cancel hidden>Cancelar</button></div>'+
  '<p class="v1013-pdf-status" data-v1013-status role="status" aria-live="polite">Hasta 32 jugadores por archivo · solo se imprimen registros completos</p>'+
  '<details data-v1013-skipped></details>'+
  '<small class="v1013-private-note">Privado: contiene nombres, fotos y CURP. Guarda el PDF con cuidado; nunca se envia automaticamente a GitHub ni a servidores externos.</small>';
 head.after(panel);
 $('[data-v1013-run]',panel)?.addEventListener('click',()=>batch($('[data-v1013-mode]',panel)?.value||'a4'));
 $('[data-v1013-cancel]',panel)?.addEventListener('click',()=>{cancel=true;show('Deteniendo exportacion…')});
}
function schedule(){
 clearTimeout(bootTimer);bootTimer=setTimeout(mount,110);
}
window.addEventListener('hashchange',schedule);
const screen=$('#screen');
if(screen)new MutationObserver(()=>{
 if(route()==='credentialBuilder'&&!$('#v124-player-registry [data-v1013-pdf-panel]'))schedule();
}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
window.LJR_LOCAL_PDF={load:loadPdfLib,single,batch};
})();

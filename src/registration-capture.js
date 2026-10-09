import {validateCurp,parseIdentity,completion,matchAttachment,normalizeName} from './registration-core.js';
const q=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dbPromise,restoreVersion=0,pendingPhotos=[],busy=false,installed=false;
const config=()=>{try{return JSON.parse(sessionStorage.getItem('ljr-registration-ocr')||'{}')}catch{return {}}};
function status(message){const el=q('[data-capture-status]');if(el)el.textContent=message}
function db(){
  if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open('ljr-registration-media',1);
    req.onupgradeneeded=()=>req.result.createObjectStore('players');
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('No se pudieron abrir las fotos guardadas'));
  });
  return dbPromise;
}
async function transaction(key,value,operation='get'){
  const database=await db();
  return new Promise((resolve,reject)=>{
    const tx=database.transaction('players',operation==='get'?'readonly':'readwrite'),store=tx.objectStore('players');
    const req=operation==='put'?store.put(value,key):operation==='delete'?store.delete(key):store.get(key);
    tx.oncomplete=()=>resolve(req.result);tx.onerror=tx.onabort=()=>reject(new Error('No se pudo guardar la foto; revisa el espacio del dispositivo'));
  });
}
export async function saveAssets(record){
  const key=record.assetKey||record.id;
  const photo=q('[data-v64-photo]')?.files?.[0],document=q('[data-v64-doc]')?.files?.[0];
  const previous=await transaction(key)||{};
  if(photo||document)await transaction(key,{...previous,...(photo?{photo}:{}),...(document?{document}:{}),updatedAt:new Date().toISOString()},'put');
  return {assetKey:key,hasPlayerPhoto:!!(photo||previous.photo),hasIdentityDocument:!!(document||previous.document)};
}
function fillFile(selector,file){
  const input=q(selector);if(!input)return;
  const transfer=new DataTransfer();if(file)transfer.items.add(file);input.files=transfer.files;
  input.dispatchEvent(new Event('change',{bubbles:true}));

}
function refreshFilePreview(input){
  const file=input.files?.[0],selector=input.matches('[data-v64-photo]')?'[data-v64-photo]':'[data-v64-doc]';
  const host=q(selector==='[data-v64-photo]'?'[data-v64-player-mini-preview]':'[data-v64-doc-preview]');
  if(host){host.replaceChildren();if(file){const img=document.createElement('img'),url=URL.createObjectURL(file);img.alt=selector.includes('photo')?'Foto del jugador':'Documento del jugador';img.onload=img.onerror=()=>URL.revokeObjectURL(url);img.src=url;host.append(img)}else host.textContent='Sin imagen seleccionada'}
}
export function resetAssets(){restoreVersion++;fillFile('[data-v64-photo]',null);fillFile('[data-v64-doc]',null)}
export async function restoreAssets(record){
  const version=++restoreVersion;
  // Clear synchronously: the previous player's picture must never carry over.
  fillFile('[data-v64-photo]',null);fillFile('[data-v64-doc]',null);
  try{
    const assets=await transaction(record.assetKey||record.id)||{};
    if(version!==restoreVersion||localStorage.getItem('v124-player-edit-id')!==record.id)return;
    if(assets.photo)fillFile('[data-v64-photo]',assets.photo);
    if(assets.document)fillFile('[data-v64-doc]',assets.document);
    update();
  }catch(error){status(error.message)}
}
export const removeAssets=key=>transaction(key,null,'delete');
async function imagePayload(file){
  if(!file.type.startsWith('image/'))throw new Error('Selecciona una imagen JPG, PNG o WebP');
  const img=await createImageBitmap(file),canvas=document.createElement('canvas');
  const scale=Math.min(1,2600/Math.max(img.width,img.height));
  canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);img.close();
  const encoded=canvas.toDataURL('image/jpeg',.92).split(',')[1];
  if(encoded.length>3900000)throw new Error('La imagen es demasiado grande para el servicio; recorta sólo la hoja');
  return encoded;
}
async function requestService(path,options={}){
  const settings=config();
  if(!settings.endpoint||!settings.token)throw new Error('Conecta primero el servicio de lectura manuscrita');
  const endpoint=new URL(settings.endpoint);
  if(endpoint.protocol!=='https:')throw new Error('El servicio debe usar HTTPS');
  const response=await fetch(endpoint.href+path,{...options,headers:{'Content-Type':'application/json','Authorization':'Bearer '+settings.token,...options.headers},credentials:'omit',signal:AbortSignal.timeout(45000)});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'El servicio no pudo leer la imagen');
  return data;
}
export async function readConnected(file,onStatus){
  if(q('[data-capture-mode]')?.value!=='handwriting')return null;
  onStatus?.('Leyendo pluma/lápiz con el servicio conectado…');
  const result=await requestService('',{method:'POST',body:JSON.stringify({image:await imagePayload(file)})});
  if(typeof result.text!=='string'||!result.text.trim())throw new Error('El servicio no encontró texto; prueba una foto más nítida');
  return result;
}
function formData(){return {name:q('[data-v64-cred-name]')?.value.trim(),team:q('[data-v64-cred-team]')?.value,curp:q('[data-v64-cred-curp]')?.value,dob:q('[data-v100-dob]')?.value}}
function update(){
  const panel=q('[data-capture-panel]');if(!panel)return;
  const data=formData(),ready=completion(data,!!q('[data-v64-photo]')?.files?.length);
  const out=q('[data-capture-check]');out.textContent=ready.ready?'✓ Nombre, CURP y foto vinculados · revisa y guarda':'Pendiente: '+ready.missing.join(' · ');
  const curp=q('[data-capture-curp-check]');curp.textContent=data.curp?validateCurp(data.curp).message:'La CURP se obtiene del documento o se captura aquí';
  const api=window.LJR_PLAYER_REGISTRY,records=api?.records?.()||[];
  const incomplete=records.filter(r=>!completion(r,r.hasPlayerPhoto).ready),team=data.team;
  q('[data-capture-queue]').textContent=incomplete.length+' jugadores pendientes'+(team?' · '+incomplete.filter(r=>r.team===team).length+' de '+team:'');
}
function applyText(){
  const text=q('[data-v64-ocr-text]')?.value||'',identity=parseIdentity(text);
  const current=formData(),editing=localStorage.getItem('v124-player-edit-id');
  if(editing&&current.name&&identity.name&&normalizeName(current.name)!==normalizeName(identity.name)){status('El nombre del documento no coincide. Corrige el texto o el jugador elegido antes de vincularlo.');return}
  if(editing&&current.curp&&identity.curp&&current.curp!==identity.curp){status('Esta CURP pertenece a otro registro. Revisa el documento antes de cambiar de jugador.');return}
  for(const [selector,value] of [['[data-v64-cred-name]',identity.name],['[data-v64-cred-curp]',identity.curp],['[data-v100-dob]',identity.dob]]){
    const el=q(selector);if(!el||!value)continue;el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
  }
  status('Datos propuestos desde el texto. Revisa el nombre y la CURP contra el documento.');update();
}
function photoInbox(){
  const records=window.LJR_PLAYER_REGISTRY?.records?.()||[],out=q('[data-capture-inbox]');if(!out)return;
  out.innerHTML=pendingPhotos.map((file,index)=>{const match=matchAttachment(file.name,records);return '<label><span>'+esc(file.name)+'</span><select data-capture-photo-target="'+index+'"><option value="">Elige jugador</option>'+records.map(r=>'<option value="'+esc(r.id)+'" '+(r.id===match?.id?'selected':'')+'>'+esc(r.name+' · '+r.team)+'</option>').join('')+'</select></label>'}).join('')+(pendingPhotos.length?'<button type="button" data-capture-attach>Vincular fotos elegidas</button>':'');
  out.querySelector('[data-capture-attach]')?.addEventListener('click',async e=>{
    e.currentTarget.disabled=true;
    const assigned=new Set(),tasks=[];
    for(const el of out.querySelectorAll('[data-capture-photo-target]')){if(!el.value)continue;if(assigned.has(el.value)){status('Elegiste dos fotos para un jugador; conserva sólo una.');e.currentTarget.disabled=false;return}assigned.add(el.value);tasks.push({record:records.find(r=>r.id===el.value),file:pendingPhotos[Number(el.dataset.capturePhotoTarget)],index:Number(el.dataset.capturePhotoTarget)})}
    const completed=new Set();
    try{for(const task of tasks){const key=task.record.assetKey||task.record.id,old=await transaction(key)||{};await transaction(key,{...old,photo:task.file},'put');window.LJR_PLAYER_REGISTRY.update(task.record.id,{assetKey:key,hasPlayerPhoto:true});completed.add(task.index)}status(completed.size+' fotos vinculadas. Los archivos sin jugador siguen pendientes.')}
    catch(error){status(error.message)}
    pendingPhotos=pendingPhotos.filter((_,i)=>!completed.has(i));photoInbox();update();
  });
}
function panelHtml(){return `<section class="registration-capture" data-capture-panel>
  <header><small>REGISTRO UNIFICADO</small><h3>Lista → CURP / INE → foto → credencial</h3><p>Importa la hoja del delegado abajo. Después completa cada jugador con su documento y su foto.</p></header>
  <div class="capture-check" data-capture-check></div><small data-capture-curp-check></small>
  <label>Tipo de lectura<select data-capture-mode><option value="printed">Texto impreso · en este dispositivo</option><option value="handwriting">Pluma / lápiz · servicio conectado</option></select></label>
  <div class="capture-actions"><button type="button" data-capture-document>📷 Tomar foto de CURP / INE</button><button type="button" data-capture-portrait>👤 Tomar foto del jugador</button><button type="button" data-capture-paste>📋 Pegar imagen copiada</button><button type="button" data-capture-apply-text>Usar texto corregido</button></div>
  <label>Importar una imagen por enlace<input type="url" data-capture-url placeholder="https://…/imagen.jpg"></label>
  <div class="capture-actions"><select data-capture-url-kind><option value="document">Documento CURP / INE</option><option value="photo">Foto del jugador</option><option value="list">Lista del delegado</option></select><button type="button" data-capture-fetch>Cargar imagen</button></div>
  <div class="capture-actions"><button type="button" data-capture-next>Completar siguiente jugador</button><button type="button" data-capture-save-next>Guardar y continuar</button></div><small data-capture-queue></small>
  <details><summary>Vincular varias fotos a jugadores</summary><p>Puedes seleccionar las imágenes guardadas desde WhatsApp. Se sugieren coincidencias por nombre completo o CURP del archivo; tú confirmas el jugador.</p><input type="file" multiple accept="image/*" data-capture-photos><div data-capture-inbox></div></details>
  <details><summary>WhatsApp del administrador · 412 171 5599</summary><p>Guarda las imágenes recibidas y selecciónalas aquí. El botón abre el chat; la recepción automática necesita WhatsApp Business conectado.</p><a href="https://wa.me/524121715599" target="_blank" rel="noopener">Abrir WhatsApp del administrador</a></details>
  <details><summary>Conectar lectura de pluma / lápiz</summary><p>El texto impreso se lee en tu dispositivo. Para escritura a mano, conecta el servicio OCR del administrador; al detectar se enviará la imagen a ese servicio.</p><label>Enlace del servicio HTTPS<input type="url" data-capture-endpoint placeholder="https://…/api/registration-ocr"></label><label>Acceso del administrador<input type="password" data-capture-token autocomplete="off"></label><button type="button" data-capture-connect>Comprobar conexión</button><small data-capture-connection>Servicio manuscrito sin conectar</small></details>
  <p role="status" aria-live="polite" data-capture-status>Las fotos y documentos se conservan en este dispositivo. Revisa antes de registrar.</p>
  </section>`}
function next(){
  const api=window.LJR_PLAYER_REGISTRY,records=api?.records?.()||[],current=localStorage.getItem('v124-player-edit-id'),team=formData().team;
  const pending=records.filter(r=>r.id!==current&&(!team||r.team===team)&&!completion(r,r.hasPlayerPhoto).ready);
  if(!pending.length){status('No quedan otros jugadores pendientes'+(team?' en este equipo':''));return}
  api.load(pending[0]);status('Completa documento y foto de '+pending[0].name);update();
}
async function fetchImage(){
  const input=q('[data-capture-url]'),url=new URL(input.value);
  if(url.protocol!=='https:')throw new Error('Usa un enlace directo HTTPS a la imagen');
  const r=await fetch(url.href,{credentials:'omit',signal:AbortSignal.timeout(20000)});
  if(!r.ok)throw new Error('No se pudo abrir la imagen');const blob=await r.blob();
  if(!blob.type.startsWith('image/')||blob.size>20*1024*1024)throw new Error('El enlace debe entregar una imagen de hasta 20 MB');
  const file=new File([blob],url.pathname.split('/').pop()||'imagen.jpg',{type:blob.type}),kind=q('[data-capture-url-kind]').value;
  if(kind==='list')window.LJR_PLAYER_REGISTRY.setRosterFiles([file]);else fillFile(kind==='photo'?'[data-v64-photo]':'[data-v64-doc]',file);
  status('Imagen cargada. Revisa la vista previa y pulsa Detectar.');update();
}
function mount(){
  if(!location.hash.startsWith('#/credentialBuilder'))return;
  const host=q('.v64-form-grid');if(!host||q('[data-capture-panel]'))return;
  host.insertAdjacentHTML('beforebegin',panelHtml());
  const bind=(selector,fn)=>q(selector)?.addEventListener('click',async()=>{try{await fn()}catch(error){status(error.message||'No se pudo completar la acción')}});
  for(const [selector,target] of [['[data-capture-document]','[data-v64-doc]'],['[data-capture-portrait]','[data-v64-photo]']])bind(selector,()=>{const input=q(target);input.setAttribute('capture',target.includes('photo')?'user':'environment');input.click();input.removeAttribute('capture')});
  bind('[data-capture-apply-text]',applyText);bind('[data-capture-next]',next);
  bind('[data-capture-save-next]',async()=>{if(busy)return;if(!completion(formData(),!!q('[data-v64-photo]')?.files?.length).ready){status('Completa y revisa la CURP y la foto antes de continuar. Puedes guardar un borrador abajo.');return}busy=true;try{const saved=await window.LJR_PLAYER_REGISTRY.save();if(saved)next()}finally{busy=false}});
  bind('[data-capture-fetch]',async()=>{try{await fetchImage()}catch{throw new Error('No se pudo abrir el enlace. Si es un enlace de chat o privado, guarda la imagen y selecciónala.')}});
  bind('[data-capture-paste]',async()=>{if(!navigator.clipboard?.read)throw new Error('Este navegador no permite pegar imágenes; selecciónala desde archivos');for(const item of await navigator.clipboard.read()){const type=item.types.find(t=>t.startsWith('image/'));if(type){fillFile(q('[data-capture-url-kind]').value==='photo'?'[data-v64-photo]':'[data-v64-doc]',new File([await item.getType(type)],'imagen-pegada.png',{type}));update();return}}throw new Error('No hay una imagen copiada')});
  const settings=config();q('[data-capture-endpoint]').value=settings.endpoint||'';q('[data-capture-token]').value=settings.token||'';
  bind('[data-capture-connect]',async()=>{
    const endpoint=q('[data-capture-endpoint]').value.trim().replace(/\/$/,''),token=q('[data-capture-token]').value.trim();
    sessionStorage.setItem('ljr-registration-ocr',JSON.stringify({endpoint,token}));
    try{const result=await requestService('',{method:'GET'});if(!result.ready)throw new Error('Falta configurar OCR en el servidor');q('[data-capture-connection]').textContent='✓ Servicio manuscrito conectado';status('Conexión comprobada. Elige Pluma / lápiz para leer una imagen.')}
    catch(error){sessionStorage.removeItem('ljr-registration-ocr');q('[data-capture-connection]').textContent='Sin conexión: '+error.message;throw error}
  });
  q('[data-capture-photos]').addEventListener('change',e=>{pendingPhotos=Array.from(e.target.files||[]);photoInbox()});
  update();
}
export function installCapture(){
  if(installed)return;installed=true;
  window.LJR_REGISTRATION_CAPTURE={read:readConnected,parseIdentity,normalizeName,extractCurp:text=>parseIdentity(text).curp,update};
  document.addEventListener('input',e=>{if(e.target.matches('[data-v64-cred-name],[data-v64-cred-curp],[data-v64-cred-team],[data-v100-dob]'))update()});
  document.addEventListener('change',e=>{if(e.target.matches('[data-v64-photo],[data-v64-doc]'))refreshFilePreview(e.target);if(e.target.matches('[data-v64-photo],[data-v64-doc],[data-v64-cred-team]'))update()});
  window.addEventListener('hashchange',()=>{resetAssetsVersion();setTimeout(mount,80)});
  function resetAssetsVersion(){restoreVersion++}
  /* V1008: sólo detectar la creación de la ruta, no cada mutación del body
     (fotos, previews, listas y capas de otras herramientas). */
  const screen=q('#screen');
  if(screen)new MutationObserver(()=>{
    if(location.hash.startsWith('#/credentialBuilder')&&
       !q('[data-capture-panel]')&&q('.v64-form-grid'))mount();
  }).observe(screen,{childList:true,subtree:false});
  mount();
}

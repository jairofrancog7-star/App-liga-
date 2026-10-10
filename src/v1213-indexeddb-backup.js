/* V1213 — Respaldo privado de fotografías y documentos IndexedDB.
 * Sólo 4 almacenes permitidos, nunca servidores ni datos oficiales.
 * Importación añade registros faltantes; jamás sobrescribe registros presentes. */
(function(){
'use strict';
if(window.LJR_INDEXED_BACKUP)return;
const SPECS=[
 {id:'player',db:'ljr-player-photos-v1',store:'photos',keyPath:'id',label:'Fotos del registro de jugadores',default:true},
 {id:'incidents',db:'ljr-incidents-media-v1',store:'photos',keyPath:'id',label:'Fotografías de incidencias',default:true},
 {id:'registration',db:'ljr-registration-media',store:'players',keyPath:null,label:'Fotos y documentos de identidad',default:false},
 {id:'meetings',db:'LJR-Juntas-Archivos',store:'files',keyPath:'id',label:'Documentos de juntas y acuerdos',default:false}
];
const FORMAT='LJR_IDB_MEDIA_PRIVATE',VERSION=1,MAX_BYTES=28*1024*1024,MAX_FILE=48*1024*1024,MAX_RECORDS=1200;
const enc=new TextEncoder(),dec=new TextDecoder();
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
function secure(){if(!crypto?.subtle||!window.indexedDB)throw Error('Se requiere HTTPS y un navegador que admita IndexedDB y Web Crypto.')}
function admin(){if(!window.LJR_MEDIA?.admin)throw Error('Inicia sesión como administrador para gestionar archivos privados.')}
function id(bytes){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s)}
function unid(s){
 if(typeof s!=='string'||s.length>MAX_FILE*2||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s))throw Error('El contenido binario está dañado.');
 return Uint8Array.from(atob(s),c=>c.charCodeAt(0));
}
async function hash(bytes){const b=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('')}
async function keyFor(password,salt){
 const root=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},root,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
function b64File(bytes,mime,name,lastModified){
 return {t:'blob',v:id(bytes),mime:String(mime||''),...(name?{name:String(name)}:{}),...(lastModified?{modified:lastModified}:{})};
}
async function wire(x,depth=0){
 if(depth>18)throw Error('Un documento contiene estructuras demasiado profundas.');
 if(x===null||typeof x==='string'||typeof x==='number'||typeof x==='boolean')return {t:'scalar',v:x};
 if(x instanceof Blob){
  const buf=new Uint8Array(await x.arrayBuffer());
  if(buf.length>MAX_BYTES)throw Error('Un archivo supera el máximo de 28 MB.');
  return b64File(buf,x.type,x instanceof File?x.name:'',x instanceof File?x.lastModified:0);
 }
 if(x instanceof Date)return {t:'date',v:x.toISOString()};
 if(x instanceof ArrayBuffer)return {t:'bytes',v:id(new Uint8Array(x))};
 if(ArrayBuffer.isView(x))return {t:'bytes',v:id(new Uint8Array(x.buffer,x.byteOffset,x.byteLength))};
 if(Array.isArray(x))return {t:'array',v:await Promise.all(x.map(v=>wire(v,depth+1)))};
 if(x&&typeof x==='object'){
  const pairs=[];
  for(const [k,v] of Object.entries(x)){
   if(['__proto__','constructor','prototype'].includes(k))throw Error('Un registro contiene un campo no permitido.');
   pairs.push([k,await wire(v,depth+1)]);
  }
  return {t:'object',v:pairs};
 }
 throw Error('Tipo de dato no compatible dentro del respaldo.');
}
function unwire(x,depth=0){
 if(depth>18||!x||typeof x!=='object')throw Error('Registro del archivo no válido.');
 switch(x.t){
 case 'scalar':
  if(x.v!==null&&!['string','number','boolean'].includes(typeof x.v))throw Error('Valor no válido.');
  return x.v;
 case 'date':
  if(typeof x.v!=='string'||!Number.isFinite(Date.parse(x.v)))throw Error('Fecha inválida.');
  return new Date(x.v);
 case 'bytes':return unid(x.v).buffer;
 case 'blob':{
  const bytes=unid(x.v);
  if(bytes.length>MAX_BYTES)throw Error('Archivo demasiado grande.');
  const mime=typeof x.mime==='string'?x.mime:'';
  if(typeof x.name==='string'&&x.name.length){
   if(x.name.length>250||/[\/\\]/.test(x.name))throw Error('Nombre de archivo no permitido.');
   return new File([bytes],x.name,{type:mime,lastModified:Number.isFinite(x.modified)?x.modified:Date.now()});
  }
  return new Blob([bytes],{type:mime});
 }
 case 'array':if(!Array.isArray(x.v)||x.v.length>10000)throw Error('Arreglo inválido.');return x.v.map(v=>unwire(v,depth+1));
 case 'object':{
  if(!Array.isArray(x.v)||x.v.length>10000)throw Error('Objeto inválido.');
  const out={};
  for(const pair of x.v){
   if(!Array.isArray(pair)||pair.length!==2||typeof pair[0]!=='string'||pair[0].length>250||['__proto__','constructor','prototype'].includes(pair[0]))throw Error('Propiedad de objeto inválida.');
   Object.defineProperty(out,pair[0],{value:unwire(pair[1],depth+1),enumerable:true,writable:true,configurable:true});
  }
  return out;
 }
 default:throw Error('Tipo de dato no compatible en el archivo.');
 }
}
function dbOpen(spec,create=false){
 return new Promise((resolve,reject)=>{
  let created=false,req;
  try{req=indexedDB.open(spec.db)}catch(e){reject(e);return}
  req.onupgradeneeded=e=>{
   if(!create){created=true;req.transaction.abort();return}
   const db=req.result;
   if(!db.objectStoreNames.contains(spec.store))db.createObjectStore(spec.store,spec.keyPath?{keyPath:spec.keyPath}:undefined);
  };
  req.onsuccess=()=>{if(!req.result.objectStoreNames.contains(spec.store)){req.result.close();reject(Error('La base '+spec.db+' no contiene el almacén esperado.'));return}resolve(req.result)};
  req.onerror=()=>created?resolve(null):reject(req.error||Error('No se pudo abrir '+spec.db));
  req.onblocked=()=>reject(Error('Cierra otras pestañas de la Liga para abrir '+spec.db+'.'));
 });
}
function readStore(db,spec){
 return new Promise((resolve,reject)=>{
  const rows=[];let size=0;
  let tx;
  try{tx=db.transaction(spec.store,'readonly')}catch(error){reject(error);return}
  const cursor=tx.objectStore(spec.store).openCursor();
  cursor.onsuccess=()=>{
   const c=cursor.result;if(!c)return;
   if(rows.length>=MAX_RECORDS){tx.abort();reject(Error('Hay más de 1200 registros. Respaldar tantas fotos a la vez no está admitido.'));return}
   const key=c.primaryKey;
   if(!(typeof key==='string'||typeof key==='number')||String(key).length>250){tx.abort();reject(Error('Identificador no admitido en '+spec.db));return}
   rows.push({key,value:c.value});
   c.continue();
  };
  cursor.onerror=()=>reject(cursor.error||Error('Error leyendo datos locales.'));
  tx.onerror=()=>reject(tx.error||Error('No se pudo leer '+spec.db));
  tx.onabort=()=>reject(tx.error||Error('Lectura interrumpida.'));
  tx.oncomplete=()=>resolve(rows);
 });
}
async function build(selected,notify){
 secure();admin();
 const groups=[],all=selected.map(x=>SPECS.find(s=>s.id===x));
 if(!all.length||all.some(x=>!x))throw Error('Selecciona al menos un grupo válido.');
 let count=0;
 for(const spec of all){
  notify('Leyendo '+spec.label+'…');
  const db=await dbOpen(spec);
  if(!db){groups.push({id:spec.id,records:[]});continue}
  let rows;
  try{rows=await readStore(db,spec)}finally{db.close()}
  const records=[];
  for(let i=0;i<rows.length;i++){
   if(i%25===0)notify('Preparando '+spec.label+': '+(i+1)+'/'+rows.length);
   records.push({key:rows[i].key,value:await wire(rows[i].value)});
   if(++count>MAX_RECORDS)throw Error('Se superó el máximo de 1200 registros.');
  }
  groups.push({id:spec.id,records});
 }
 const payload=JSON.stringify({groups});
 if(enc.encode(payload).length>MAX_BYTES)throw Error('Las fotos y documentos seleccionados superan 28 MB. Selecciona un solo grupo para respaldarlo por separado.');
 return {payload,count,groups:groups.map(g=>({id:g.id,count:g.records.length}))};
}
async function seal(snapshot,password){
 secure();
 if(typeof password!=='string'||password.length<10)throw Error('Usa una contraseña de al menos 10 caracteres.');
 const bytes=enc.encode(snapshot.payload);
 if(bytes.byteLength>MAX_BYTES)throw Error('Copia demasiado grande.');
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const secret=await keyFor(password,salt);
 const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},secret,bytes));
 return {format:FORMAT,version:VERSION,createdAt:new Date().toISOString(),encrypted:true,cipher:'AES-256-GCM',kdf:'PBKDF2-SHA256',iterations:250000,groups:snapshot.groups,records:snapshot.count,digest:await hash(bytes),salt:id(salt),iv:id(iv),payload:id(encrypted)};
}
async function unseal(bundle,password){
 secure();
 if(!bundle||bundle.format!==FORMAT||bundle.version!==VERSION||bundle.encrypted!==true||bundle.cipher!=='AES-256-GCM'||bundle.kdf!=='PBKDF2-SHA256'||bundle.iterations!==250000)throw Error('El archivo no es un respaldo multimedia cifrado de la Liga.');
 if(!password)throw Error('Escribe la contraseña para comprobar el archivo.');
 let plain;
 try{
  const secret=await keyFor(password,unid(bundle.salt));
  plain=new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:unid(bundle.iv)},secret,unid(bundle.payload)));
 }catch(_){throw Error('Contraseña incorrecta o archivo modificado.')}
 if(plain.byteLength>MAX_BYTES)throw Error('Archivo demasiado grande.');
 if(await hash(plain)!==bundle.digest)throw Error('La comprobación de integridad falló.');
 let parsed;
 try{parsed=JSON.parse(dec.decode(plain))}catch(_){throw Error('El contenido del archivo no es JSON válido.')}
 if(!Array.isArray(parsed?.groups)||parsed.groups.length===0||parsed.groups.length>4)throw Error('Grupos del respaldo inválidos.');
 const ids=new Set();let total=0;
 for(const group of parsed.groups){
  if(!group||typeof group.id!=='string'||!SPECS.some(x=>x.id===group.id)||ids.has(group.id)||!Array.isArray(group.records))throw Error('Grupo del respaldo desconocido.');
  ids.add(group.id);
  const spec=SPECS.find(x=>x.id===group.id);
  const keys=new Set();
  for(const row of group.records){
   if(!row||!(typeof row.key==='string'||typeof row.key==='number')||String(row.key).length>250||!row.value)throw Error('Registro inválido.');
   if(keys.has(String(row.key)))throw Error('Registros duplicados en el archivo.');
   keys.add(String(row.key));
   if(spec.keyPath){
    const value=unwire(row.value);
    if(!value||typeof value!=='object'||String(value[spec.keyPath])!==String(row.key))throw Error('El identificador del archivo no coincide con su registro.');
   }
   if(++total>MAX_RECORDS)throw Error('El archivo tiene demasiados registros.');
  }
 }
 return {groups:parsed.groups,total};
}
async function saveFolder(handle,text,filename){
 const file=await handle.getFileHandle(filename,{create:true});
 const writer=await file.createWritable();
 try{await writer.write(new Blob([text],{type:'application/json'}));await writer.close()}
 catch(error){try{await writer.abort()}catch(_){}throw error}
}
function download(text,filename){
 const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=filename;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}
function txAdd(db,spec,records){
 return new Promise((resolve,reject)=>{
  let tx,restored=0,existing=0;
  try{tx=db.transaction(spec.store,'readwrite')}catch(error){reject(error);return}
  const store=tx.objectStore(spec.store);
  for(const item of records){
   const get=store.get(item.key);
   get.onsuccess=()=>{
    if(get.result!==undefined){existing++;return}
    let value;
    try{value=unwire(item.value)}catch(error){tx.abort();return}
    const req=spec.keyPath?store.add(value):store.add(value,item.key);
    req.onsuccess=()=>restored++;
    req.onerror=()=>{/* aborted transaction, leave existing records unchanged */};
   };
  }
  tx.oncomplete=()=>resolve({restored,existing});
  tx.onabort=()=>reject(tx.error||Error('No se pudo restaurar este grupo; la transacción se canceló.'));
  tx.onerror=()=>{};
 });
}
async function restore(snapshot,selected,notify){
 secure();admin();
 let restored=0,existing=0;
 for(const group of snapshot.groups){
  if(!selected.includes(group.id)||!group.records.length)continue;
  const spec=SPECS.find(x=>x.id===group.id);
  notify('Restaurando '+spec.label+'…');
  const db=await dbOpen(spec,true);
  try{
   const result=await txAdd(db,spec,group.records);
   restored+=result.restored;existing+=result.existing;
  }finally{db.close()}
 }
 return {restored,existing};
}
function mount(overlay){
 if(!overlay||$('[data-bc-idb]',overlay))return;
 const anchor=$('.ljr-bc-note',overlay);
 if(!anchor)return;
 const section=document.createElement('section');
 section.className='ljr-bc-panel ljr-bc-idb';section.dataset.bcIdb='';
 section.innerHTML='<div class="ljr-bc-paneltitle"><span class="ljr-bc-num">03</span><div><h3>Fotografías y documentos (IndexedDB)</h3><p>Copia privada independiente, con cifrado obligatorio.</p></div></div>'+
 '<div class="ljr-bc-options" data-idb-groups>'+SPECS.map(s=>'<label class="ljr-bc-group"><input type="checkbox" data-idb-group="'+s.id+'" '+(s.default?'checked':'')+'><span>'+s.label+'</span></label>').join('')+'</div>'+
 '<p class="ljr-bc-sensitive">Los documentos de identidad y archivos de juntas pueden contener datos personales. Sólo selecciónalos si realmente necesitas respaldarlos.</p>'+
 '<div class="ljr-bc-password"><label>Contraseña de archivos<input type="password" data-idb-pass placeholder="Mínimo 10 caracteres" autocomplete="new-password"></label><label>Confirmar contraseña<input type="password" data-idb-repeat placeholder="Repite la contraseña" autocomplete="new-password"></label></div>'+
 '<div class="ljr-bc-idb-actions"><button type="button" class="ljr-bc-primary" data-idb-download>Descargar archivos cifrados</button><button type="button" class="ljr-bc-secondary" data-idb-folder>Elegir carpeta y guardar</button></div>'+
 '<p class="ljr-bc-help">Límite de seguridad: 28 MB de información por copia, hasta 1200 registros. Para copias más grandes, selecciona menos secciones. La opción carpeta aparece sólo en navegadores compatibles.</p>'+
 '<div class="ljr-bc-idb-restore"><h3>Recuperar fotografías y documentos</h3><label class="ljr-bc-file">Archivo de respaldo cifrado<input type="file" accept=".json,application/json" data-idb-file></label>'+
 '<label class="ljr-bc-import-password">Contraseña del archivo<input type="password" data-idb-import-pass autocomplete="off"></label>'+
 '<button type="button" class="ljr-bc-secondary" data-idb-check>Verificar copia y mostrar vista previa</button>'+
 '<p class="ljr-bc-preview" data-idb-preview hidden></p><button class="ljr-bc-primary" type="button" data-idb-restore hidden>Recuperar registros faltantes</button></div>'+
 '<p class="ljr-bc-idb-status" data-idb-status role="status" aria-live="polite">Ninguna foto o documento se envía a internet. Guarda tu contraseña en privado.</p>';
 anchor.before(section);
 const state=$('[data-idb-status]',section),folder=$('[data-idb-folder]',section),preview=$('[data-idb-preview]',section),restoreButton=$('[data-idb-restore]',section);
 folder.hidden=typeof window.showDirectoryPicker!=='function';
 const status=(message,bad=false)=>{state.textContent=message;state.classList.toggle('error',bad)};
 const selected=()=>$$('[data-idb-group]:checked',section).map(x=>x.dataset.idbGroup);
 const busy=async(button,fn)=>{
  if(button.disabled)return;
  button.disabled=true;
  try{await fn()}catch(error){if(error?.name==='AbortError')status('Operación cancelada, sin modificar datos.');else status(error?.message||'No se pudo completar.',true)}
  finally{button.disabled=false}
 };
 async function exportNow(handle){
  const password=$('[data-idb-pass]',section).value;
  if(password.length<10||password!==$('[data-idb-repeat]',section).value)throw Error('La contraseña debe tener 10 caracteres como mínimo y coincidir.');
  const choices=selected();if(!choices.length)throw Error('Selecciona un grupo de fotografías o documentos.');
  status('Preparando archivos privados…');
  const snapshot=await build(choices,status);
  if(!snapshot.count)throw Error('No hay archivos guardados de los grupos seleccionados en este dispositivo.');
  const encrypted=await seal(snapshot,password);
  const filename='Liga_Juventino_Archivos_Cifrados_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';
  const text=JSON.stringify(encrypted);
  if(handle){await saveFolder(handle,text,filename);status('Archivo guardado en la carpeta elegida: '+snapshot.count+' registros.')}
  else{download(text,filename);status('Descarga solicitada: '+snapshot.count+' registros. Confirma que el archivo se haya guardado.')}
  $('[data-idb-pass]',section).value='';$('[data-idb-repeat]',section).value='';
 }
 const dl=$('[data-idb-download]',section);
 dl.onclick=()=>busy(dl,()=>exportNow(null));
 folder.onclick=()=>{
  if(folder.disabled)return;
  // El selector requiere activación directa del usuario, antes de las operaciones asincrónicas.
  const picker=window.showDirectoryPicker({mode:'readwrite'});
  busy(folder,async()=>exportNow(await picker));
 };
 let checked=null;
 const input=$('[data-idb-file]',section);
 input.onchange=()=>{checked=null;preview.hidden=true;restoreButton.hidden=true;status('Seleccionaste un archivo. Verifícalo antes de restaurar.')};
 const verify=$('[data-idb-check]',section);
 verify.onclick=()=>busy(verify,async()=>{
  checked=null;preview.hidden=true;restoreButton.hidden=true;
  const file=input.files?.[0];if(!file)throw Error('Selecciona un archivo cifrado.');
  if(file.size>MAX_FILE)throw Error('El archivo supera el límite permitido de 48 MB.');
  const bundle=JSON.parse(await file.text());
  status('Comprobando el contenido cifrado y sus registros…');
  checked=await unseal(bundle,$('[data-idb-import-pass]',section).value);
  preview.textContent=checked.groups.map(g=>SPECS.find(x=>x.id===g.id).label+': '+g.records.length).join(' · ')+' · Verificación correcta. Sólo se añadirán datos faltantes; los existentes permanecerán intactos.';
  preview.hidden=false;restoreButton.hidden=false;status('Respaldo validado. No se ha modificado ningún archivo.');
 });
 restoreButton.onclick=()=>busy(restoreButton,async()=>{
  if(!checked)throw Error('Verifica primero el respaldo.');
  admin();
  const groups=checked.groups.map(g=>g.id);
  if(!confirm('¿Recuperar hasta '+checked.total+' registros de archivos en este teléfono? Sólo se añadirán los faltantes. Los registros existentes no cambiarán.'))return;
  const result=await restore(checked,groups,status);
  status('Restauración terminada: '+result.restored+' registros añadidos, '+result.existing+' ya existentes y conservados. Para visualizar algunos archivos, recarga la página.');
  checked=null;restoreButton.hidden=true;
 });
}
window.LJR_INDEXED_BACKUP={mount,version:VERSION};
})();
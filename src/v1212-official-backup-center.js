/* V1212 - Centro de respaldo privado. No publica registros ni envia datos a terceros.
   Los permisos y la lectura del contenido deben ser comprobados por el servidor. */
(function(){
'use strict';
if(window.LJR_BACKUP_CENTER)return;
const FORMAT='ljr-admin-backup-encrypted-v2';
const META_KEY='ljr-official-backup-download-v1212';
const REMINDER_KEY='ljr-official-backup-reminder-v1212';
const SUMMARY_KEY='ljr-official-backup-summaries-v1212';
const AUTO_KEY='ljr-backup-auto-v1213';
const AUTO_LAST_KEY='ljr-backup-auto-last-v1213';
const HISTORY_LIMIT=14;
const REVIEW_MS=24*60*60*1000;
let automaticReviewInFlight=false;
let automaticLastRuntime=0; // Cuando localStorage está bloqueado, evita repetir la consulta en la misma sesión.
const MAX_PLAIN=32*1024*1024;
const MAX_FILE=48*1024*1024;
const ITERATIONS=310000;
const $=(query,root)=>root.querySelector(query);
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const media=()=>window.LJR_MEDIA;
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch(_){return fallback}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}}
function b64(bytes){
 let out='';
 for(let i=0;i<bytes.length;i+=16384)out+=String.fromCharCode(...bytes.subarray(i,i+16384));
 return btoa(out);
}
function from64(value){
 if(typeof value!=='string'||!value||!/^[a-zA-Z0-9+/]*={0,2}$/.test(value))throw Error('Contenido cifrado inválido.');
 return Uint8Array.from(atob(value),c=>c.charCodeAt(0));
}
async function keyFor(password,salt,iterations){
 const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function encrypt(rows,password){
 if(!crypto?.subtle)throw Error('El navegador no dispone de cifrado seguro. Usa HTTPS.');
 const payload={schema:'ljr-admin-backup-v1',exportedAt:new Date().toISOString(),records:rows};
 const raw=new TextEncoder().encode(JSON.stringify(payload));
 if(raw.byteLength>MAX_PLAIN)throw Error('La copia supera 32 MB. Se necesita exportación por bloques desde el servidor.');
 const salt=crypto.getRandomValues(new Uint8Array(16));
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await keyFor(password,salt,ITERATIONS);
 const encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,raw));
 return {format:FORMAT,createdAt:payload.exportedAt,algorithm:'AES-256-GCM',kdf:{name:'PBKDF2',hash:'SHA-256',iterations:ITERATIONS,salt:b64(salt)},iv:b64(iv),ciphertext:b64(encrypted)};
}
async function decrypt(envelope,password){
 if(!crypto?.subtle)throw Error('Tu navegador no admite cifrado seguro.');
 if(!envelope||envelope.format!==FORMAT||envelope.algorithm!=='AES-256-GCM'||envelope.kdf?.name!=='PBKDF2'||envelope.kdf?.hash!=='SHA-256'||envelope.kdf?.iterations!==ITERATIONS)throw Error('Archivo no compatible. Esta herramienta solo verifica respaldos cifrados V2.');
 if(typeof envelope.ciphertext!=='string'||envelope.ciphertext.length>MAX_FILE*1.5)throw Error('Archivo demasiado grande o incompleto.');
 const salt=from64(envelope.kdf.salt),iv=from64(envelope.iv),ciphertext=from64(envelope.ciphertext);
 if(salt.length!==16||iv.length!==12||ciphertext.length<16||ciphertext.length>MAX_FILE)throw Error('Metadatos de cifrado incorrectos.');
 let plaintext;
 try{
  const key=await keyFor(password,salt,ITERATIONS);
  plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv},key,ciphertext);
 }catch(_){throw Error('No se pudo verificar: contraseña incorrecta o archivo alterado.')}
 const payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(plaintext));
 if(payload?.schema!=='ljr-admin-backup-v1'||!Array.isArray(payload.records)||!Number.isFinite(Date.parse(payload.exportedAt)))throw Error('El respaldo no tiene una estructura válida.');
 return payload;
}
async function principal(){
 if(!media()?.admin)throw Error('Debes iniciar sesión como administrador.');
 const response=await media().api('me');
 if(response?.admin?.owner!==true)throw Error('El servidor no confirmó permiso de cuenta principal para exportar respaldos.');
 return response.admin;
}
async function records(){
 await principal();
 const response=await media().api('content?admin=1');
 if(!Array.isArray(response?.items))throw Error('El servidor no entregó los registros de respaldo.');
 return response.items;
}
/* Modelo estadistico adaptativo sin paquetes pesados ni datos personales. */
function median(values){const x=values.slice().sort((a,b)=>a-b),mid=Math.floor(x.length/2);return x.length%2?x[mid]:(x[mid-1]+x[mid])/2}
function trendModel(count,history){
 const days=new Map();
 for(const entry of Array.isArray(history)?history:[]){
  const day=String(entry?.at||'').slice(0,10),count=Number(entry?.count);
  if(/^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isSafeInteger(count)&&count>=0)days.set(day,count);
 }
 const samples=[...days.entries()].sort(([a],[b])=>a.localeCompare(b)).slice(-HISTORY_LIMIT).map(x=>x[1]);
 if(samples.length<4)return {ready:false,samples:samples.length};
 const baseline=median(samples),mad=median(samples.map(x=>Math.abs(x-baseline)));
 return {ready:true,samples:samples.length,baseline,abnormal:Math.abs(count-baseline)>Math.max(3,baseline*.18,mad*3.5)};
}
function inspect(rows){
 const seen=new Set();let duplicates=0,missing=0,invalid=0;
 for(const item of rows){
  if(!item||typeof item!=='object'||Array.isArray(item)){invalid++;continue}
  const id=item.id==null?'':String(item.id).trim();
  if(id){if(seen.has(id))duplicates++;else seen.add(id)}
  const field=Object.hasOwn(item,'title')?'title':(Object.hasOwn(item,'name')?'name':null);
  if(field&&!String(item[field]??'').trim())missing++;
 }
 const history=read(SUMMARY_KEY,[]);
 const previous=Array.isArray(history)&&history.length?history[history.length-1]:null;
 const fall=previous&&previous.count>0&&rows.length<previous.count*.75;
 return {count:rows.length,duplicates,missing,invalid,fall,previous,model:trendModel(rows.length,history)};
}
function shouldAutoReview(last,now=Date.now()){
 const saved=Date.parse(last||'');
 const time=Math.max(Number.isFinite(saved)?saved:0,automaticLastRuntime);
 return !time||now-time>=REVIEW_MS;
}
function recordHistory(count){
 const history=read(SUMMARY_KEY,[]),series=Array.isArray(history)?history.slice(-HISTORY_LIMIT):[];
 const item={at:new Date().toISOString(),count},last=series[series.length-1];
 if(last?.at?.slice(0,10)===item.at.slice(0,10))series[series.length-1]=item;
 else series.push(item);
 write(SUMMARY_KEY,series.slice(-HISTORY_LIMIT));
}
function download(content,name){
 const url=URL.createObjectURL(new Blob([JSON.stringify(content)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),20000);
}
function open(){
 const d=media()?.modal?.('Respaldo oficial','<div class="ljr-backup-center">'+
  '<p class="ljr-backup-lead">Protege la información administrativa con una copia cifrada que solo se descarga en este dispositivo. Ningún dato se envía a servicios de IA.</p>'+
  '<div class="ljr-backup-stats"><article><small>ÚLTIMA DESCARGA SOLICITADA</small><strong data-backup-last>Sin registro</strong></article><article><small>PRÓXIMA REVISIÓN</small><strong data-backup-next>Sin programar</strong></article></div>'+
  '<div class="ljr-backup-section"><h3>IA local y diagnóstico inteligente</h3><p>Detector estadístico adaptativo que aprende de los conteos de días anteriores. Sin IA externa ni cambios en datos oficiales.</p>'+
  '<button type="button" class="ljr-backup-secondary" data-backup-analyze>Analizar registros privados</button><div class="ljr-backup-diagnosis" data-backup-diagnosis aria-live="polite">El análisis comienza cuando autorizas la consulta.</div><label class="ljr-backup-auto"><input type="checkbox" data-backup-auto> Análisis automático al abrir (máximo una vez al día)</label><small class="ljr-backup-hint">Solo al abrir esta sección con una cuenta principal válida. No crea descargas en segundo plano.</small></div>'+
  '<form class="ljr-backup-section" data-backup-export><h3>Crear copia protegida</h3><p>La contraseña no se guarda. Debes conservarla para abrir el archivo en el futuro.</p>'+
  '<label>Contraseña de cifrado (mínimo 12 caracteres)<input type="password" autocomplete="new-password" minlength="12" maxlength="256" data-backup-pass required></label>'+
  '<label>Repetir contraseña<input type="password" autocomplete="new-password" minlength="12" maxlength="256" data-backup-confirm required></label>'+
  '<button type="submit" class="ljr-backup-primary">Descargar respaldo cifrado</button></form>'+
  '<div class="ljr-backup-section"><h3>Verificar una copia</h3><p>Selecciona una copia V2 y escribe su contraseña. Solo se inspecciona aquí; no reemplaza datos de la Liga.</p>'+
  '<label>Archivo cifrado <input type="file" accept=".json,application/json" data-backup-file></label>'+
  '<label>Contraseña del archivo <input type="password" autocomplete="off" data-backup-verify-pass></label>'+
  '<button type="button" class="ljr-backup-secondary" data-backup-verify>Verificar integridad</button></div>'+
  '<div class="ljr-backup-section"><h3>Recordatorio de mantenimiento</h3><p>Se muestra al volver a abrir este apartado. No realiza descargas en segundo plano.</p>'+
  '<label>Frecuencia <select data-backup-period><option value="7">Cada 7 días</option><option value="15">Cada 15 días</option><option value="30">Cada 30 días</option><option value="0">Desactivado</option></select></label>'+
  '<button type="button" class="ljr-backup-secondary" data-backup-save>Guardar recordatorio</button></div>'+
  '<p class="ljr-backup-security">🔒 Acceso validado en el servidor · AES-256-GCM · Sin restauración automática · No publicar los archivos en GitHub.</p>'+
  '<div class="ljr-backup-status" data-backup-status role="status" aria-live="polite"></div></div>');
 if(!d)throw Error('No se pudo abrir el panel de respaldo.');
 d.querySelector('section')?.classList.add('ljr-backup-dialog');
 const root=$('.ljr-backup-center',d);
 const say=(message,problem=false)=>{const status=$('[data-backup-status]',root);status.textContent=message;status.classList.toggle('is-error',problem)};
 let working=false;
 async function perform(button,task){
  if(working)return;working=true;button.disabled=true;
  try{await task()}catch(e){say(e?.message||'No se pudo completar la operación.',true)}
  finally{working=false;button.disabled=false}
 }
 function summary(){
  const last=read(META_KEY,null),days=Number(read(REMINDER_KEY,7));
  const prev=$('[data-backup-last]',root),next=$('[data-backup-next]',root);
  prev.textContent=last?.at?new Date(last.at).toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'}):'Sin descarga registrada';
  if(!days){next.textContent='Desactivado';return}
  if(!last?.at){next.textContent='Revisión pendiente';return}
  const due=new Date(last.at).getTime()+days*86400000;
  if(!Number.isFinite(due)){next.textContent='Revisión pendiente';return}
  next.textContent=Date.now()>=due?'¡Revisión pendiente!':new Date(due).toLocaleDateString('es-MX');
 }
 function renderDiagnosis(rows){
  const r=inspect(rows);let warnings=[];
  if(r.invalid)warnings.push(r.invalid+' registros con estructura inesperada');
  if(r.duplicates)warnings.push(r.duplicates+' identificadores repetidos');
  if(r.missing)warnings.push(r.missing+' nombres o títulos vacíos');
  if(r.fall)warnings.push('caída superior al 25 % frente al último análisis');
  if(r.model.ready&&r.model.abnormal)warnings.push('variación atípica frente a lo aprendido');
  const box=$('[data-backup-diagnosis]',root);
  const model=r.model.ready?'Modelo adaptativo activo ('+r.model.samples+' días, referencia: '+Math.round(r.model.baseline)+').':'Aprendizaje local: '+r.model.samples+'/4 días distintos.';
  box.textContent=r.count+' registros consultados. '+model+' '+(warnings.length?'Revisar: '+warnings.join('; ')+'.':'Sin alertas detectadas.');
  box.classList.toggle('is-warning',warnings.length>0);
  return r;
 }
 $('[data-backup-period]',root).value=String(read(REMINDER_KEY,7));
 const auto=$('[data-backup-auto]',root);
 auto.checked=read(AUTO_KEY,false)===true;
 summary();
 if(!crypto?.subtle)say('El cifrado solo está disponible en navegadores compatibles y con HTTPS.',true);
 async function analyze(automatic){
  say(automatic?'Revisión local automática autorizada…':'Analizando registros privados…');
  const rows=await records(),stats=renderDiagnosis(rows);
  recordHistory(stats.count);
  if(automatic){
   const now=new Date().toISOString();
   automaticLastRuntime=Date.parse(now);
   write(AUTO_LAST_KEY,now);
  }
  say('Análisis local completo. '+(stats.model.ready?'Modelo estadístico actualizado.':'Aprendizaje en curso.')+' Sin cambios en datos oficiales.');
 }
 const analyzeButton=$('[data-backup-analyze]',root);
 analyzeButton.onclick=e=>perform(e.currentTarget,()=>analyze(false));
 async function runAutoOnce(){
  if(!auto.checked||automaticReviewInFlight||!shouldAutoReview(read(AUTO_LAST_KEY,'')))return;
  automaticReviewInFlight=true;
  try{await perform(analyzeButton,()=>analyze(true))}
  finally{automaticReviewInFlight=false}
 }
 auto.onchange=()=>{
  write(AUTO_KEY,auto.checked);
  if(auto.checked)runAutoOnce();
  else say('Análisis automático desactivado. La revisión manual sigue disponible.');
 };
 runAutoOnce();
 $('[data-backup-export]',root).onsubmit=e=>{
  e.preventDefault();
  const button=$('button[type="submit"]',e.currentTarget);
  perform(button,async()=>{
   const pass=$('[data-backup-pass]',root),confirm=$('[data-backup-confirm]',root);
   if(pass.value.length<12)throw Error('Usa una contraseña de al menos 12 caracteres.');
   if(pass.value!==confirm.value)throw Error('Las contraseñas no coinciden.');
   if(!window.confirm('Se descargará información de administración protegida con tu contraseña. Guárdala en un lugar privado. ¿Continuar?'))return;
   say('Generando copia cifrada en este dispositivo…');
   const rows=await records();
   const stats=renderDiagnosis(rows);
   recordHistory(stats.count);
   let encrypted;
   try{
    encrypted=await encrypt(rows,pass.value);
    const verified=await decrypt(encrypted,pass.value);
    if(verified.records.length!==rows.length)throw Error('La comprobación interna del respaldo no coincide.');
   }finally{pass.value='';confirm.value=''}
   // Cifrado y descifrado verificados en memoria antes de ofrecer la descarga.
   const name='liga-juventino-respaldo-cifrado-'+new Date().toISOString().slice(0,10)+'.json';
   download(encrypted,name);
   write(META_KEY,{at:new Date().toISOString(),count:rows.length});
   summary();
   say('Descarga solicitada: '+rows.length+' registros. Confirma que el archivo se guardó y usa «Verificar integridad» para comprobarlo.');
  })
 };
 $('[data-backup-verify]',root).onclick=e=>perform(e.currentTarget,async()=>{
  const file=$('[data-backup-file]',root).files?.[0];
  const password=$('[data-backup-verify-pass]',root);
  if(!file)throw Error('Selecciona primero tu archivo de respaldo cifrado.');
  if(file.size>MAX_FILE)throw Error('El archivo supera el tamaño admitido para revisión local.');
  if(!password.value)throw Error('Introduce la contraseña del respaldo.');
  say('Comprobando cifrado y estructura del archivo local…');
  let payload;
  try{payload=await decrypt(JSON.parse(await file.text()),password.value)}finally{password.value=''}
  say('Archivo verificado: '+payload.records.length+' registros, exportado el '+new Date(payload.exportedAt).toLocaleString('es-MX')+'. No se ha restaurado ni publicado ningún dato.');
 });
 $('[data-backup-save]',root).onclick=()=>{
  write(REMINDER_KEY,Number($('[data-backup-period]',root).value));
  summary();say('Frecuencia guardada en este navegador. El aviso aparece al abrir esta pantalla, no en segundo plano.');
 };
 return d;
}
async function start(){
 if(!media()?.admin){media()?.login?.(start);return}
 try{await principal();return open()}
 catch(e){window.alert('Respaldo oficial: '+(e?.message||'No tienes autorización.'))}
}
window.LJR_BACKUP_CENTER={open:start};
})();

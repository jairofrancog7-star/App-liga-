/* V1066 · Automatización segura de Avisos de suspensión.
   No envía, confirma ni suspende partidos. El programador existente necesita confirmación.
   Los respaldos permanecen sólo en este dispositivo (localStorage). */
(()=>{
'use strict';
if(window.__LJR_V1066_SUSP_AUTOMATION__)return;
window.__LJR_V1066_SUSP_AUTOMATION__=true;
const AUTOSAVE='ljr-v1066-suspension-autosave';
const HISTORY='ljr-v1066-suspension-history';
const TRANSFER='ljr-v1066-suspension-transfer';
const KEYS=['cat','round','type','scope','match','venue','reason','priority','date','time','channel','message'];
const $=(s,p=document)=>p?.querySelector(s);
const $$=(s,p=document)=>Array.from(p?.querySelectorAll(s)||[]);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const get=(key)=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(_){return null}};
const put=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v));return true}catch(_){return false}};
const text=(v,max=400)=>String(v??'').slice(0,max).trim();
const select=(k,root)=>$('[data-v64-susp-'+k+']',root);
const snapshot=page=>Object.fromEntries(KEYS.map(k=>[k,text(select(k,page)?.value,1500)]));
const fmt=(v)=>{try{return new Date(v).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'})}catch(_){return ''}};
const notice=s=>{
 const rows=['LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS A. C.',(s.type||'Aviso de jornada').toUpperCase(),
   'Categoría: '+(s.cat||'Por definir'),'Jornada: '+(s.round||'Por definir'),'Alcance: '+(s.scope||'Por definir')];
 if(s.match&&s.match!=='Todos los partidos')rows.push('Partido: '+s.match);
 if(s.venue&&s.venue!=='Todos los campos')rows.push('Campo / sede: '+s.venue);
 if(s.reason)rows.push('Motivo: '+s.reason);
 if(s.date)rows.push('Fecha efectiva: '+s.date+(s.time?' · '+s.time:''));
 if(s.message)rows.push('',s.message);
 else rows.push('','Borrador sujeto a confirmación de la Liga. Consulte los canales oficiales.');
 return rows.join('\n');
};
function mount(page){
 if($('[data-v1066-auto]',page))return;
 const summary=$('.v425-summary',page);
 if(!summary)return;
 const panel=document.createElement('details');
 panel.className='v1066-automation';
 panel.dataset.v1066Auto='';
 panel.innerHTML=
  '<summary><span class="v1066-badge" aria-hidden="true">⚙</span><span><b>Automatización de avisos</b><small>Revisar · lluvia · programar · recuperar</small></span><span class="v1066-arrow" aria-hidden="true">⌄</span></summary>'+
  '<div class="v1066-inner">'+
   '<div class="v1066-buttons">'+
    '<button type="button" data-v1066-review>✓ Revisar datos</button>'+
    '<button type="button" data-v1066-weather>☂ Consultar lluvia</button>'+
    '<button type="button" data-v1066-schedule>◷ Ir al programador</button>'+
    '<button type="button" data-v1066-share>↗ Compartir texto</button>'+
   '</div>'+
   '<div class="v1066-message" role="status" aria-live="polite" data-v1066-status hidden></div>'+
   '<div class="v1066-weather" data-v1066-forecast hidden></div>'+
   '<div class="v1066-backup">'+
     '<span data-v1066-backup-label>Guardado local automático al editar.</span>'+
     '<button type="button" data-v1066-recover hidden>Recuperar</button>'+
     '<button type="button" data-v1066-history>Historial</button>'+
   '</div>'+
   '<div data-v1066-history-panel hidden></div>'+
   '<small class="v1066-help">No modifica resultados ni publica avisos. El pronóstico es municipal, no una inspección del campo.</small>'+
  '</div>';
 summary.before(panel);
 updateRecovery(page);
}
function say(page,message,tone='info'){
 const el=$('[data-v1066-status]',page);
 if(el){el.hidden=false;el.textContent=message;el.dataset.tone=tone;}
}
function checks(s){
 const w=[];
 if(!s.cat)w.push('Falta seleccionar la categoría.');
 if(!s.round)w.push('Falta seleccionar la jornada.');
 if(!s.type)w.push('Falta el tipo de aviso.');
 if(!s.reason)w.push('Falta el motivo.');
 if(s.scope==='Un partido'&&(!s.match||s.match==='Todos los partidos'))w.push('El alcance indica un partido, pero no se eligió cuál.');
 if(s.scope==='Uno o varios campos'&&(!s.venue||s.venue==='Todos los campos'))w.push('El alcance indica campos específicos, pero no se eligió sede.');
 if(!s.message)w.push('El mensaje adicional está vacío. Puedes generarlo con el asistente.');
 if(s.date&&s.date<'2020-01-01')w.push('Revisa la fecha efectiva.');
 return w;
}
function review(page){
 const warnings=checks(snapshot(page));
 say(page,warnings.length?'Antes de compartir: '+warnings.join(' '):
   'Datos listos para revisión humana. Confirma la decisión y el texto antes de difundir.','review');
}
function updateRecovery(page){
 const item=get(AUTOSAVE),btn=$('[data-v1066-recover]',page),label=$('[data-v1066-backup-label]',page);
 if(btn)btn.hidden=!item?.fields;
 if(label)label.textContent=item?.time?'Último respaldo local: '+fmt(item.time):'Guardado local automático al editar.';
}
let saveTimer;
function autosave(page){
 clearTimeout(saveTimer);
 saveTimer=setTimeout(()=>{
   if(!page.isConnected||route()!=='suspensionTool')return;
   const ok=put(AUTOSAVE,{fields:snapshot(page),time:new Date().toISOString()});
   if(ok)updateRecovery(page);
 },950);
}
function history(){
 const v=get(HISTORY);
 return Array.isArray(v)?v.filter(x=>x?.fields).slice(0,12):[];
}
function archive(page){
 const f=snapshot(page),list=history();
 if(JSON.stringify(f)===JSON.stringify(list[0]?.fields))return;
 list.unshift({id:String(Date.now())+'-'+Math.floor(Math.random()*1000),fields:f,time:new Date().toISOString()});
 if(put(HISTORY,list.slice(0,12)))renderHistory(page);
}
function fill(page,fields){
 if(!fields||typeof fields!=='object')return;
 // Respetar la recarga de jornadas y partidos dependientes de categoría.
 const category=select('cat',page),round=select('round',page);
 if(category&&$$('option',category).some(o=>o.value===fields.cat)){
   category.value=fields.cat;category.dispatchEvent(new Event('change',{bubbles:true}));
 }
 if(round&&$$('option',round).some(o=>o.value===fields.round)){
   round.value=fields.round;round.dispatchEvent(new Event('change',{bubbles:true}));
 }
 for(const k of KEYS){
   if(k==='cat'||k==='round')continue;
   const el=select(k,page);
   if(!el||typeof fields[k]!=='string')continue;
   if(el.tagName==='SELECT'&&!$$('option',el).some(o=>o.value===fields[k]))continue;
   el.value=fields[k];el.dispatchEvent(new Event('change',{bubbles:true}));
 }
 autosave(page);
}
function renderHistory(page){
 const host=$('[data-v1066-history-panel]',page),list=history();
 if(!host)return;
 host.hidden=false;
 host.replaceChildren();
 if(!list.length){host.textContent='Aún no hay versiones guardadas. Usa Guardar borrador para crear la primera.';return}
 const heading=document.createElement('strong');heading.textContent='Versiones guardadas en este teléfono';host.append(heading);
 for(const item of list){
  const row=document.createElement('div');row.className='v1066-version';
  const label=document.createElement('span');
  label.textContent=(item.fields.cat||'Aviso')+' · Jornada '+(item.fields.round||'—')+' · '+fmt(item.time);
  const b=document.createElement('button');b.type='button';b.textContent='Restaurar';b.dataset.v1066Restore=item.id;
  row.append(label,b);host.append(row);
 }
}
function moveToScheduler(page){
 // V1074: bloquear programación desde el acceso antiguo sin revisión/autorización.
 // La constancia es local, NO valida criptográficamente al presidente.
 if(window.LJR_SUSPENSION_WORKFLOW?.canSchedule&&!window.LJR_SUSPENSION_WORKFLOW.canSchedule(page)){
   const flow=$('[data-v1074-flow]',page);
   if(flow)flow.open=true;
   say(page,'Antes de programar, completa la revisión y registra la autorización realmente recibida.','review');
   return;
 }
 const s=snapshot(page);
 // Transferencia por sesión, NO almacena tokens ni activa la publicación.
 const payload={fields:s,preparedAt:Date.now()};
 try{sessionStorage.setItem(TRANSFER,JSON.stringify(payload))}
 catch(_){say(page,'No se pudo preparar el envío al programador.','error');return}
 location.hash='#/v38Alerts';
 setTimeout(transfer,180);
}
function transfer(){
 if(route()!=='v38Alerts'&&route()!=='notifications')return;
 let item;try{item=JSON.parse(sessionStorage.getItem(TRANSFER)||'null')}catch(_){return}
 if(!item?.fields)return;
 if(Date.now()-Number(item.preparedAt||0)>120000){sessionStorage.removeItem(TRANSFER);return}
 const host=$('[data-v713-auto]');
 if(!host)return; // El observador volverá a intentarlo al montar la pantalla.
 const type=$('[data-v713-type="suspension"]',host);if(type)type.click();
 const s=item.fields,vals=[
  ['[data-v713-title]',s.type||'Aviso de suspensión'],
  ['[data-v713-body]',notice(s)]
 ];
 for(const [q,v] of vals){const el=$(q,host);if(el){el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));}}
 const category=$('[data-v713-category]',host);
 if(category){
  const normalized=s.cat?.toLocaleLowerCase('es-MX')||'';
  const option=$$('option',category).find(o=>o.value.toLocaleLowerCase('es-MX')===normalized ||
    o.textContent.toLocaleLowerCase('es-MX').includes(normalized) && normalized.length>4);
  if(option)category.value=option.value;
 }
 // No tocar fecha de publicación: la fecha efectiva del partido NO es la de publicar.
 sessionStorage.removeItem(TRANSFER);
 host.scrollIntoView({behavior:'smooth',block:'start'});
 const msg=document.createElement('p');msg.className='v1066-transfer-note';
 msg.textContent='Aviso importado para revisión. Elige la fecha de publicación y confirma Programar; nada se envió todavía.';
 host.prepend(msg);
 setTimeout(()=>msg.remove(),16000);
}
let weatherCache=null;
async function weather(page){
 const out=$('[data-v1066-forecast]',page);
 if(!out)return;
 out.hidden=false;out.textContent='Consultando el pronóstico municipal…';
 if(weatherCache&&Date.now()-weatherCache.ts<15*60000){out.textContent=weatherCache.summary;return}
 const btn=$('[data-v1066-weather]',page);if(btn)btn.disabled=true;
 try{
  let location=null;
  for(const name of ['Juventino Rosas','Santa Cruz de Juventino Rosas']){
   const ctrl=new AbortController(),tid=setTimeout(()=>ctrl.abort(),7000);
   let r;
   try{r=await fetch('https://geocoding-api.open-meteo.com/v1/search?'+new URLSearchParams({
     name,count:'10',countryCode:'MX',language:'es'}),{signal:ctrl.signal});}
   finally{clearTimeout(tid)}
   if(!r.ok)continue;
   const data=await r.json();
   location=(data.results||[]).find(x=>x.country_code==='MX'&&
     /Guanajuato/i.test(x.admin1||'')&&/Juventino Rosas/i.test(x.name||''))||null;
   if(location)break;
  }
  if(!location)throw Error('No se identificó una ubicación municipal confiable.');
  const ctrl=new AbortController(),tid=setTimeout(()=>ctrl.abort(),8500);
  let response;
  try{
   response=await fetch('https://api.open-meteo.com/v1/forecast?'+new URLSearchParams({
     latitude:String(location.latitude),longitude:String(location.longitude),
     hourly:'precipitation_probability,precipitation,wind_gusts_10m',
     timezone:'America/Mexico_City',forecast_days:'3'}),{signal:ctrl.signal});
  }finally{clearTimeout(tid)}
  if(!response.ok)throw Error('Pronóstico no disponible.');
  const api=await response.json();
  const h=api.hourly||{},hours=h.time||[];
  const utcOffset=(Number(api.utc_offset_seconds)||-21600)*1000;
  const idx=hours.map((dt,i)=>({i,ms:Date.parse(dt+'Z')-utcOffset}))
    .filter(x=>Number.isFinite(x.ms)&&x.ms>=Date.now()-3600000&&x.ms<Date.now()+24*3600000)
    .map(x=>x.i);
  if(!idx.length)throw Error('No hay horas futuras en el pronóstico.');
  const maximum=(arr)=>Math.round(Math.max(...idx.map(i=>Number(arr?.[i])||0)));
  const rain=idx.reduce((sum,i)=>sum+Math.max(0,Number(h.precipitation?.[i])||0),0);
  const probability=maximum(h.precipitation_probability),gust=maximum(h.wind_gusts_10m);
  const summary='Juventino Rosas · próximas 24 h: lluvia '+rain.toFixed(1)+
    ' mm estimados · probabilidad máxima '+probability+'% · ráfagas máximas '+gust+
    ' km/h. Orientativo: verifica el estado real del campo antes de decidir.';
  out.textContent=summary;weatherCache={ts:Date.now(),summary};
 }catch(e){out.textContent='No se pudo consultar el clima en este momento. No se modificó el aviso.';}
 finally{if(btn)btn.disabled=false;}
}
async function share(page){
 const s=snapshot(page),body=notice(s);
 try{
  if(typeof navigator.share==='function'){
   await navigator.share({title:s.type||'Aviso de la Liga Juventino Rosas',text:body});
   say(page,'Se abrió el panel para compartir. Confirma el envío en la aplicación elegida.');return;
  }
  await navigator.clipboard.writeText(body);
  say(page,'Navegador sin compartir nativo: texto copiado para pegarlo donde quieras.');
 }catch(e){
  if(e?.name==='AbortError')return;
  say(page,'No se pudo compartir. Usa Copiar texto o WhatsApp.','error');
 }
}
function boot(){
 const screen=$('#screen');if(!screen)return;
 let pending=false;
 const update=()=>{pending=false;if(route()==='suspensionTool'){const page=$('.v425-suspension',screen);if(page)mount(page)}else transfer()};
 const queue=()=>{if(pending)return;pending=true;requestAnimationFrame(update)};
 const observer=new MutationObserver(queue);
 observer.observe(screen,{childList:true,subtree:true});
 screen.addEventListener('input',e=>{
   if(route()!=='suspensionTool'||!e.target.closest('.v425-suspension')||!e.target.matches('[data-v64-susp-message]'))return;
   autosave(e.target.closest('.v425-suspension'));
 });
 screen.addEventListener('change',e=>{
   if(route()!=='suspensionTool'||!e.target.matches('[data-v64-susp-cat],[data-v64-susp-round],[data-v64-susp-type],[data-v64-susp-scope],[data-v64-susp-match],[data-v64-susp-venue],[data-v64-susp-reason],[data-v64-susp-priority],[data-v64-susp-date],[data-v64-susp-time],[data-v64-susp-channel]'))return;
   const page=e.target.closest('.v425-suspension');if(page)autosave(page);
 });
 screen.addEventListener('click',e=>{
   const target=e.target.closest('button');if(!target||route()!=='suspensionTool')return;
   const page=target.closest('.v425-suspension');if(!page)return;
   if(target.matches('[data-v64-susp-save]')){
     // El guardado principal se vinculó originalmente con {once:true};
     // persistir cada clic evita que los cambios posteriores se pierdan.
     const f=snapshot(page);
     const data={
       category:f.cat,jornada:f.round,type:f.type,scope:f.scope,match:f.match,
       venue:f.venue,reason:f.reason,priority:f.priority,date:f.date,
       time:f.time,channel:f.channel,message:f.message
     };
     if(put('v64-suspension-draft',data)){
       archive(page);
       autosave(page);
       say(page,'Borrador y versión guardados en este dispositivo. No se ha publicado.','info');
     }else say(page,'No fue posible guardar el borrador local.','error');
     return;
   }
   if(target.matches('[data-v1066-review]'))review(page);
   else if(target.matches('[data-v1066-weather]'))weather(page);
   else if(target.matches('[data-v1066-schedule]'))moveToScheduler(page);
   else if(target.matches('[data-v1066-share]'))share(page);
   else if(target.matches('[data-v1066-history]')){
     const p=$('[data-v1066-history-panel]',page);
     if(p?.hidden)renderHistory(page);else if(p)p.hidden=true;
   }else if(target.matches('[data-v1066-recover]')){
     const fields=get(AUTOSAVE)?.fields;if(fields){fill(page,fields);say(page,'Último respaldo recuperado. Revisa los datos antes de compartir.');}
   }else if(target.matches('[data-v1066-restore]')){
     const item=history().find(x=>x.id===target.dataset.v1066Restore);
     if(item){fill(page,item.fields);say(page,'Versión histórica restaurada para edición.');}
   }
 });
 window.addEventListener('hashchange',queue);
 window.addEventListener('pageshow',queue);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)queue()});
 queue();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();

/* V713 — Programador automático de avisos.
   Funciona localmente en web y se integra con el feed global generado por GitHub Actions.
   Para Facebook automático usa un webhook seguro configurable; nunca guarda tokens de Meta en el repo. */
(function(){
'use strict';
if(window.__LJR_V713_AUTO_NOTICE_SCHEDULER__)return;
window.__LJR_V713_AUTO_NOTICE_SCHEDULER__=true;

const KEY='ljr-v713-auto-notices';
const WEBHOOK_KEY='ljr-v713-facebook-webhook';
const FEED='./data/active-notices.json';
const isAdmin=()=>!!window.LJR_MEDIA?.admin;
async function authorized(){if(!isAdmin())return false;try{return !!(await window.LJR_MEDIA.api('me'))?.admin}catch(_){return false}}
const TYPES={
  jornada:{label:'Jornada',short:'Jornada',title:'Aviso de jornada',body:'Información importante para la próxima jornada de la Liga.'},
  ultima:{label:'Última hora',short:'Última hora',title:'Última hora',body:'Aviso importante de última hora de la Liga Juventino Rosas.'},
  horario:{label:'Cambio de horario',short:'Horario',title:'Cambio de horario',body:'Se informa un cambio de horario. Revisa la información actualizada antes de tu partido.'},
  sede:{label:'Cambio de cancha',short:'Cancha',title:'Cambio de cancha / sede',body:'Se informa un cambio de cancha o sede. Revisa la ubicación actualizada.'},
  suspension:{label:'Suspensión',short:'Suspensión',title:'Aviso de suspensión',body:'Se informa una suspensión. Consulta los detalles oficiales antes de trasladarte.'},
  junta:{label:'Junta',short:'Junta',title:'Recordatorio de junta',body:'Recordatorio importante de junta de la Liga.'},
  general:{label:'General',short:'General',title:'Aviso importante',body:'Información importante de la Liga Juventino Rosas.'}
};

function route(){return (location.hash.replace(/^#\/?/,'')||document.body?.dataset?.appRoute||'home').split('?')[0]}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return []}}
function write(v){localStorage.setItem(KEY,JSON.stringify(v))}
function toast(msg){
  try{if(typeof window.toast==='function'){window.toast(msg);return}}catch(_){}
  let t=document.querySelector('.v713-toast');if(!t){t=document.createElement('div');t.className='v713-toast';document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');clearTimeout(t._tm);t._tm=setTimeout(()=>t.classList.remove('show'),2600);
}
function localDateInput(d=new Date()){const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)}
function localTimeInput(d=new Date()){return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function when(date,time){const d=new Date((date||localDateInput())+'T'+(time||'12:00')+':00');return Number.isFinite(d.getTime())?d:null}
function fmt(ts){if(!ts)return '—';try{return new Date(ts).toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'})}catch(_){return ts}}
function id(){return 'aviso-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7)}

function template(type,fields={}){
  const t=TYPES[type]||TYPES.general;
  const bits=[];
  if(fields.category)bits.push(fields.category);
  if(fields.field)bits.push(fields.field);
  if(fields.extra)bits.push(fields.extra);
  return {title:t.title,body:(t.body+(bits.length?' '+bits.join(' · ')+'.':'')).replace(/\s+/g,' ').trim()};
}
function aiDraft(type,mode='quick',fields={}){
  const t=TYPES[type]||TYPES.general;
  const category=String(fields.category||'').trim();
  const extra=String(fields.extra||'').trim();
  const date=String(fields.date||'').trim();
  const time=String(fields.time||'').trim();
  const refs=[category,extra].filter(Boolean);
  const context=refs.length?refs.join(' · '):'';
  const schedule=[date,time].filter(Boolean).join(' · ');
  let title=t.title,body='';
  if(mode==='short'){
    body=(t.body+' '+(context?context+'. ':'')+(schedule?'Publicación programada: '+schedule+'.':'')).replace(/\s+/g,' ').trim();
  }else if(mode==='formal'){
    title=t.title;
    body=('La Liga Municipal de Fútbol Juventino Rosas A.C. informa: '+t.body+' '+(context?context+'. ':'')+'Favor de tomar en cuenta este aviso y consultar la información oficial antes de la jornada.').replace(/\s+/g,' ').trim();
  }else if(mode==='urgent'){
    title=type==='ultima'?'Última hora':('Atención · '+t.title);
    body=('ATENCIÓN. '+t.body+' '+(context?context+'. ':'')+'Revisa este cambio antes de trasladarte o participar en la jornada.').replace(/\s+/g,' ').trim();
  }else{
    const lead={
      jornada:'La Liga informa los datos importantes de la próxima jornada.',
      ultima:'Información importante de última hora para equipos, jugadores y delegados.',
      horario:'Se actualizó el horario de un partido o actividad de la Liga.',
      sede:'Se actualizó la cancha o sede programada.',
      suspension:'Se informa una suspensión o modificación que debe revisarse antes de acudir al campo.',
      junta:'Recordatorio para delegados y responsables de equipo.',
      general:'Comunicado importante de la Liga Juventino Rosas.'
    }[type]||t.body;
    body=(lead+' '+(context?context+'. ':'')+(schedule?'Programado para '+schedule+'. ':'')+'Consulta los datos oficiales dentro de la aplicación.').replace(/\s+/g,' ').trim();
  }
  return {title,body};
}
function makePng(item,download=false){
  try{
    const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');
    const g=x.createLinearGradient(0,0,0,c.height);g.addColorStop(0,'#123fe5');g.addColorStop(.34,'#10169f');g.addColorStop(1,'#07065e');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
    x.fillStyle='rgba(27,225,239,.16)';x.beginPath();x.arc(900,160,290,0,Math.PI*2);x.fill();
    x.strokeStyle='rgba(35,224,239,.50)';x.lineWidth=4;x.strokeRect(72,82,936,1186);
    x.fillStyle='#21e0ef';x.font='900 44px Arial';x.fillText('LIGA JUVENTINO ROSAS',96,170);
    x.fillStyle='#ffffff';x.font='900 74px Arial';
    const wrap=(text,max,widthFont)=>{const words=String(text).split(/\s+/),lines=[];let line='';for(const w of words){const next=line?line+' '+w:w;if(x.measureText(next).width>max&&line){lines.push(line);line=w}else line=next}if(line)lines.push(line);return lines};
    let y=330;for(const line of wrap(item.title,850)){x.fillText(line,96,y);y+=88}
    x.fillStyle='#c9d1ef';x.font='600 39px Arial';y+=30;for(const line of wrap(item.body,850)){x.fillText(line,96,y);y+=56}
    x.fillStyle='#21e0ef';x.font='800 31px Arial';y=Math.max(y+70,960);x.fillText((TYPES[item.type]?.label||'AVISO').toUpperCase(),96,y);
    x.fillStyle='#fff';x.font='700 33px Arial';x.fillText('Publicación: '+fmt(item.publishAt),96,y+58);
    x.fillStyle='#9faad3';x.font='600 27px Arial';x.fillText('Información oficial · Liga Municipal de Fútbol Juventino Rosas A.C.',96,1205);
    const url=c.toDataURL('image/png');
    if(download){const a=document.createElement('a');a.href=url;a.download=(item.title||'aviso-liga').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'.png';document.body.appendChild(a);a.click();a.remove()}
    return url;
  }catch(_){return ''}
}
async function notifyDevice(item,prefix=''){
  if(!item.channels?.device)return false;
  try{
    if(!('Notification'in window))return false;
    let p=Notification.permission;if(p==='default')p=await Notification.requestPermission();
    if(p!=='granted')return false;
    const title=(prefix?prefix+' · ':'')+item.title,opts={body:item.body,tag:'ljr-v713-'+item.id,icon:'./assets/logo.png'};
    const reg=await navigator.serviceWorker?.getRegistration?.();
    if(reg?.showNotification)await reg.showNotification(title,opts);else new Notification(title,opts);
    return true;
  }catch(_){return false}
}
async function sendWebhook(item){
  if(!item.channels?.facebook)return {ok:false,skip:true};
  const url=(localStorage.getItem(WEBHOOK_KEY)||'').trim();
  if(!url)return {ok:false,needsConfig:true};
  try{
    const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      source:'Liga Juventino Rosas',action:'publish_notice',id:item.id,type:item.type,title:item.title,message:item.body,
      publishAt:item.publishAt,png:item.channels?.png?makePng(item,false):'',channels:item.channels
    })});
    return {ok:r.ok,status:r.status};
  }catch(e){return {ok:false,error:String(e?.message||e)}}
}
async function processDue(force=false){
  // Nunca tomar un estado local como permiso de publicación oficial.
  if(!isAdmin())return;
  const now=Date.now(),items=read();let changed=false;
  for(const item of items){
    const pub=Date.parse(item.publishAt||''),rem=Date.parse(item.remindAt||'');
    if(!item.reminderSent&&Number.isFinite(rem)&&now>=rem&&now<pub){
      item.reminderSent=true;item.reminderSentAt=new Date().toISOString();changed=true;
      await notifyDevice(item,'Recordatorio');
    }
    if(!item.published&&Number.isFinite(pub)&&(now>=pub||force&&item.forceNow)){
      item.published=true;item.publishedAt=new Date().toISOString();item.status='published';changed=true;
      if(item.channels?.device)await notifyDevice(item);
      if(item.channels?.png)item.pngReady=true;
      if(item.channels?.facebook){
        const result=await sendWebhook(item);
        item.facebookStatus=result.ok?'sent':result.needsConfig?'needs_configuration':'error';
        item.facebookResult=result.status||result.error||'';changed=true;
      }
      window.dispatchEvent(new CustomEvent('ljr:auto-notice',{detail:item}));
    }
  }
  if(changed){write(items);renderLists()}
}
function statusLabel(item){
  if(item.published)return item.facebookStatus==='error'?'Procesado local · Facebook con error':'Procesado en este teléfono';
  const t=Date.parse(item.publishAt||'');return Number.isFinite(t)&&t<Date.now()?'Pendiente de procesar':'Programado local';
}
function itemCard(item,global=false){
  return '<article class="v713-item '+(item.published||global?'is-published':'')+'" data-v713-id="'+esc(item.id||'')+'">'+
    '<div class="v713-item-top"><span>'+esc(global?(item.type||'AVISO'):(TYPES[item.type]?.label||'Aviso'))+'</span><b>'+esc(global?'Publicado':statusLabel(item))+'</b></div>'+
    '<h4>'+esc(item.title||'Aviso')+'</h4><p>'+esc(item.body||item.message||'')+'</p>'+
    '<small>'+esc(global?fmt(item.published_at||item.publishAt):fmt(item.publishAt))+'</small>'+
    (!global?'<div class="v713-item-actions"><button type="button" data-v713-png="'+esc(item.id)+'">PNG</button><button type="button" data-v713-now="'+esc(item.id)+'">Procesar ahora</button><button type="button" data-v713-delete="'+esc(item.id)+'">Eliminar</button></div>':'')+
  '</article>';
}
async function loadGlobal(){
  const host=document.querySelector('[data-v713-global-list]');if(!host)return;
  try{
    const r=await fetch(FEED+'?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw new Error('feed');
    const data=await r.json(),rows=Array.isArray(data)?data:(data.items||[]);
    host.innerHTML=rows.length?rows.slice().sort((a,b)=>Date.parse(b.published_at||0)-Date.parse(a.published_at||0)).slice(0,8).map(x=>itemCard(x,true)).join(''):'<p class="v713-empty">Todavía no hay avisos globales publicados automáticamente.</p>';
  }catch(_){host.innerHTML='<p class="v713-empty">El feed global se actualizará cuando haya publicaciones programadas.</p>'}
}
function renderLists(){
  const list=document.querySelector('[data-v713-list]');if(list){const rows=read().sort((a,b)=>Date.parse(a.publishAt)-Date.parse(b.publishAt));list.innerHTML=rows.length?rows.map(x=>itemCard(x,false)).join(''):'<p class="v713-empty">No hay avisos programados en este dispositivo.</p>'}
}
function markup(){
  const tomorrow=new Date(Date.now()+86400000),d=localDateInput(tomorrow);
  const categories=[
    ['Todas','Todas las categorías'],
    ['Primera','Primera Fuerza'],
    ['Intermedia','Intermedia'],
    ['Segunda','Segunda Fuerza'],
    ['Veteranos 35+','Veteranos 35+'],
    ['Veteranos 50+','Veteranos 50+']
  ];
  return '<section class="v713-auto v728-auto v729-auto" data-v713-auto>'+
    '<div class="v713-auto-head"><div><small>AUTOMATIZACIÓN LOCAL · ADMINISTRACIÓN</small><h2>Programador de avisos</h2><p>Organiza recordatorios desde tu teléfono. Solo un servicio oficial puede publicar para todos automáticamente.</p></div><span class="v713-live">AUTO</span></div>'+
    '<div class="v713-mode-row v728-type-grid">'+Object.entries(TYPES).map(([k,v],i)=>'<button type="button" class="'+(i===0?'active':'')+'" data-v713-type="'+k+'" title="'+esc(v.label)+'">'+esc(v.short||v.label)+'</button>').join('')+'</div>'+

    '<section class="v729-editor-card">'+
      '<div class="v729-card-title"><span>01</span><div><small>CONTENIDO</small><b>Texto del aviso</b></div></div>'+
      '<div class="v713-form v728-form v729-editor-form">'+
        '<label class="wide"><span>Título</span><input data-v713-title value="Aviso de jornada" maxlength="90"></label>'+
        '<label class="wide"><span>Mensaje</span><textarea data-v713-body rows="3">Información importante para la próxima jornada de la Liga.</textarea></label>'+
      '</div>'+
    '</section>'+

    '<section class="v729-schedule-card">'+
      '<div class="v729-card-title"><span>02</span><div><small>PROGRAMACIÓN</small><b>Fecha, hora y categoría</b></div></div>'+
      '<div class="v713-form v728-form v729-schedule-grid">'+
        '<label><span>Día</span><input type="date" data-v713-date value="'+d+'"></label>'+
        '<label><span>Hora</span><input type="time" data-v713-time value="11:30"></label>'+
        '<label><span>Recordatorio</span><select data-v713-remind><option value="1440">1 día antes</option><option value="120">2 horas antes</option><option value="60">1 hora antes</option><option value="0">Sin recordatorio</option></select></label>'+
        '<label><span>Categoría</span><select data-v713-category>'+categories.map(([value,label])=>'<option value="'+esc(value)+'">'+esc(label)+'</option>').join('')+'</select></label>'+
      '</div>'+
    '</section>'+

    '<section class="v728-ai-box v729-ai-box">'+
      '<div class="v728-ai-head"><span><small>TEXTO RÁPIDO IA</small><b>Generar automáticamente</b></span><em>1 toque</em></div>'+
      '<label class="v729-quick-input"><span>Detalles rápidos</span><input data-v713-extra placeholder="Ej. Campo 3 · 10:00 · cambio por lluvia"></label>'+
      '<div class="v729-ai-presets">'+
        '<button type="button" data-v713-quick="cancha">Cancha</button>'+
        '<button type="button" data-v713-quick="horario">Horario</button>'+
        '<button type="button" data-v713-quick="jornada">Jornada</button>'+
        '<button type="button" data-v713-quick="suspension">Suspensión</button>'+
        '<button type="button" data-v713-quick="junta">Junta</button>'+
        '<button type="button" data-v713-quick="general">General</button>'+
      '</div>'+
      '<div class="v728-ai-actions"><button type="button" class="primary" data-v713-ai="quick">✨ Generar</button><button type="button" data-v713-ai="short">Corto</button><button type="button" data-v713-ai="formal">Formal</button><button type="button" data-v713-ai="urgent">Urgente</button></div>'+
    '</section>'+

    '<section class="v729-output-card">'+
      '<div class="v729-card-title"><span>03</span><div><small>SALIDA</small><b>Dónde se publica</b></div></div>'+
      '<div class="v713-channels v728-channels"><label><input type="checkbox" data-v713-ch="app" checked><span>Este teléfono</span></label><label><input type="checkbox" data-v713-ch="device" checked><span>Notificación local</span></label><label><input type="checkbox" data-v713-ch="png" checked><span>PNG</span></label><label><input type="checkbox" data-v713-ch="facebook"><span>Facebook</span></label></div>'+
      '<div class="v713-actions v728-main-actions"><button type="button" data-v713-smart>Mejorar texto</button><button type="button" data-v713-enable>Notificaciones</button><button type="button" class="primary" data-v713-save>Programar</button></div>'+
    '</section>'+

    '<details class="v713-facebook"><summary>Facebook automático / webhook</summary><p>Para publicar automáticamente en Facebook sin exponer la contraseña ni el token, conecta aquí una URL segura de automatización (Meta API, Make, Zapier o servidor propio). Si está vacía, Facebook queda pendiente pero el aviso de la app y el PNG siguen funcionando.</p><input type="url" data-v713-webhook placeholder="https://.../webhook" value="'+esc(localStorage.getItem(WEBHOOK_KEY)||'')+'"><button type="button" data-v713-webhook-save>Guardar conexión</button></details>'+
    '<div class="v713-columns"><div><h3>Programados en este dispositivo</h3><div data-v713-list></div></div><div><h3>Avisos globales publicados</h3><div data-v713-global-list></div></div></div>'+
    '<p class="v713-footnote">Estos avisos son LOCALES. Se procesan cuando administración tiene la app abierta o vuelve a activarla. Los globales requieren servicio autenticado: guardar aquí no añade avisos a GitHub ni envía notificaciones push al público.</p>'+
  '</section>';
}
function bind(root){
  let type='jornada';
  root.querySelectorAll('[data-v713-type]').forEach(btn=>btn.onclick=()=>{
    type=btn.dataset.v713Type;root.querySelectorAll('[data-v713-type]').forEach(x=>x.classList.toggle('active',x===btn));
    const t=template(type);root.querySelector('[data-v713-title]').value=t.title;root.querySelector('[data-v713-body]').value=t.body;
  });
  const contextFields=()=>({
    category:root.querySelector('[data-v713-category]')?.value.trim()||'',
    extra:root.querySelector('[data-v713-extra]')?.value.trim()||'',
    date:root.querySelector('[data-v713-date]')?.value||'',
    time:root.querySelector('[data-v713-time]')?.value||''
  });
  root.querySelectorAll('[data-v713-quick]').forEach(btn=>btn.onclick=()=>{
    const preset=btn.dataset.v713Quick||'general';
    const map={cancha:'sede',horario:'horario',jornada:'jornada',suspension:'suspension',junta:'junta',general:'general'};
    type=map[preset]||'general';
    root.querySelectorAll('[data-v713-type]').forEach(x=>x.classList.toggle('active',x.dataset.v713Type===type));
    const t=aiDraft(type,'quick',contextFields());
    root.querySelector('[data-v713-title]').value=t.title;
    root.querySelector('[data-v713-body]').value=t.body;
    root.querySelectorAll('[data-v713-quick]').forEach(x=>x.classList.toggle('active',x===btn));
    toast('Texto rápido creado');
  });
  root.querySelectorAll('[data-v713-ai]').forEach(btn=>btn.onclick=()=>{
    const t=aiDraft(type,btn.dataset.v713Ai||'quick',contextFields());
    root.querySelector('[data-v713-title]').value=t.title;
    root.querySelector('[data-v713-body]').value=t.body;
    root.querySelectorAll('[data-v713-ai]').forEach(x=>x.classList.toggle('active',x===btn));
    toast('Texto generado');
  });
  root.querySelector('[data-v713-smart]').onclick=()=>{
    const current=root.querySelector('[data-v713-body]').value.trim();
    const t=aiDraft(type,'formal',contextFields());
    root.querySelector('[data-v713-title]').value=root.querySelector('[data-v713-title]').value.trim()||t.title;
    root.querySelector('[data-v713-body]').value=current?current.replace(/\s+/g,' ').trim()+' Consulta la información oficial de la Liga para confirmar los detalles.':t.body;
    toast('Texto mejorado');
  };
  root.querySelector('[data-v713-enable]').onclick=async()=>{
    if(!('Notification'in window)){toast('Este navegador no admite notificaciones');return}
    try{const p=await Notification.requestPermission();toast(p==='granted'?'Notificaciones activadas':'Permiso no concedido')}catch(_){toast('No se pudo solicitar permiso')}
  };
  root.querySelector('[data-v713-webhook-save]').onclick=async()=>{if(!await authorized()){toast('Solo administración autorizada');return}localStorage.setItem(WEBHOOK_KEY,root.querySelector('[data-v713-webhook]').value.trim());toast('Conexión guardada solo en este dispositivo')};
  root.querySelector('[data-v713-save]').onclick=async()=>{
    if(!await authorized()){toast('Solo administración autorizada');return}
    const pub=when(root.querySelector('[data-v713-date]').value,root.querySelector('[data-v713-time]').value);if(!pub){toast('Selecciona fecha y hora');return}
    const mins=Number(root.querySelector('[data-v713-remind]').value||0),channels={};root.querySelectorAll('[data-v713-ch]').forEach(x=>channels[x.dataset.v713Ch]=x.checked);
    const item={id:id(),type,title:root.querySelector('[data-v713-title]').value.trim()||'Aviso importante',body:root.querySelector('[data-v713-body]').value.trim()||'Información importante de la Liga.',category:root.querySelector('[data-v713-category]').value.trim(),publishAt:pub.toISOString(),remindAt:mins?new Date(pub.getTime()-mins*60000).toISOString():'',channels,status:'scheduled',createdAt:new Date().toISOString(),published:false,reminderSent:false};
    const rows=read();rows.push(item);write(rows);renderLists();toast('Recordatorio local programado; no se publicará globalmente');processDue();
  };
  root.addEventListener('click',async e=>{
    if(!await authorized()){toast('Solo administración autorizada');return}
    const png=e.target.closest('[data-v713-png]');if(png){const it=read().find(x=>x.id===png.dataset.v713Png);if(it)makePng(it,true);return}
    const now=e.target.closest('[data-v713-now]');if(now){const rows=read(),it=rows.find(x=>x.id===now.dataset.v713Now);if(it){it.publishAt=new Date().toISOString();it.forceNow=true;write(rows);processDue(true)}return}
    const del=e.target.closest('[data-v713-delete]');if(del){write(read().filter(x=>x.id!==del.dataset.v713Delete));renderLists();return}
  });
}
function mount(){
  const page=document.querySelector('.v63-alerts-page');if(!page)return;
  const old=page.querySelector('[data-v713-auto]');
  if(!isAdmin()){old?.remove();return}
  if(old)return;
  const head=page.querySelector('.v60-tool-head');if(head)head.insertAdjacentHTML('afterend',markup());else page.insertAdjacentHTML('afterbegin',markup());
  const root=page.querySelector('[data-v713-auto]');bind(root);renderLists();loadGlobal();processDue();
}
function burst(){mount();setTimeout(mount,80);setTimeout(mount,300)}
window.addEventListener('hashchange',burst);
window.addEventListener('liga:admin',burst);
window.addEventListener('focus',()=>{processDue();loadGlobal()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){processDue();loadGlobal()}});
new MutationObserver(()=>{if(['v38Alerts','notifications'].includes(route())||document.querySelector('.v63-alerts-page'))mount()}).observe(document.documentElement,{childList:true,subtree:true});
setInterval(()=>{processDue();if(document.querySelector('[data-v713-global-list]'))loadGlobal()},30000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',burst);else burst();
})();

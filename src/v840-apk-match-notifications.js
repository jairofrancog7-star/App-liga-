import {Capacitor,registerPlugin} from '@capacitor/core';
/* V851 — Liga Juventino rich APK notifications.
   Own notification center + Android native notifications with both team logos.
   No AdminFut push registration is used. */
(function(){
'use strict';
if(window.__LJR_V851_APK_RICH_NOTIFICATIONS__)return;
window.__LJR_V851_APK_RICH_NOTIFICATIONS__=true;

const NativeNotifications=registerPlugin('LigaNotifications');
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/data/official-live.json';
const SNAP='ljr-match-notify-snapshot-v840';
const INBOX='ljr-match-notify-inbox-v840';
const PERM='ljr-native-notifications-v840';
const MAX_INBOX=28;
const VIEW_KEY='ljr-notifications-feed-view-v1202';
const READ_KEY='ljr-notifications-feed-read-v1202';
let remoteData=null,polling=false,renderTimer=0;
let feedback='';
function showFeedback(message){
  feedback=String(message||'');
  document.querySelectorAll('[data-v840-feed] .v840-feedback').forEach(el=>el.textContent=feedback);
}

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const num=v=>/^\s*-?\d+\s*$/.test(String(v??''))?Number(v):null;
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const hash=s=>{let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const view=Object.assign({type:'all',category:'all',more:false},read(VIEW_KEY,{}));
function saveView(){write(VIEW_KEY,view)}
function readIds(){const data=read(READ_KEY,[]);return Array.isArray(data)?data:[]}
function markRead(id){const previous=readIds();if(!previous.includes(id))write(READ_KEY,[id,...previous].slice(0,150))}
function markAllRead(){write(READ_KEY,inbox().map(e=>e.id).filter(Boolean).slice(0,150))}

function data(){
  try{return remoteData||window.LJR_V508_OFFICIAL?.getData?.()||window.LJR_OFFICIAL_DATA||null}catch(_){return remoteData}
}
function parseStamp(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime():0;
}
function fixtures(d=data()){
  const out=[];
  Object.entries(d?.categories||{}).forEach(([cid,c])=>{
    (c?.fixtures||[]).forEach((block,bi)=>(block?.rows||[]).forEach((r,ri)=>{
      if(!Array.isArray(r)||!r[2]||!r[6])return;
      const home=String(r[2]||'').trim(),away=String(r[6]||'').trim(),date=String(r[8]||'');
      out.push({
        key:[cid,bi,ri,r[0]||'',date,home,away].join('|'),
        cat:String(cid),category:String(c?.name||'Liga Juventino'),
        home,away,hs:num(r[3]),as:num(r[5]),date,stamp:parseStamp(date),
        field:String(r[7]||''),extra:String(r[10]||''),round:String(r[1]||'')
      });
    }));
  });
  return out;
}
function logoFromCandidates(team){
  const wanted=norm(team);
  for(const c of Object.values(data()?.categories||{})){
    const list=c?.dashboard?.logo_candidates||[];
    const exact=list.find(x=>norm(x?.near_text)===wanted);
    if(exact?.source)return String(exact.source);
    const near=list.find(x=>norm(x?.near_text).startsWith(wanted+' '));
    if(near?.source)return String(near.source);
  }
  return '';
}
function absLogo(v){
  v=String(v||'').trim();if(!v)return '';
  if(/^(https?:|data:|blob:)/i.test(v))return v;
  try{return new URL(v.replace(/^\.\//,''),location.href).href}catch(_){return v}
}
function logoFor(team){
  let v='';
  try{v=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_OFFICIAL_API?.getLogo?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_TEAM_LOGOS?.get?.(team)||''}catch(_){}
  if(!v)v=logoFromCandidates(team);
  return absLogo(v);
}
function prefs(){
  const account=read('lj-account-notifications-v46',{});
  const store=read('lj-store-v3',{})?.notifications||{};
  return {
    enabled: account.enabled!==false&&store.enabled!==false,
    goal: account.goal!==false&&store.goal!==false,
    final: account.final!==false&&store.final!==false,
    vibration: account.vibration!==false&&store.vibration!==false
  };
}
function inbox(){return read(INBOX,[])}
function saveInbox(list){
  const seen=new Set(),out=[];
  for(const x of list.sort((a,b)=>(b.ts||0)-(a.ts||0))){
    // One current notification per match/type. A corrected score replaces
    // stale 0-0 / duplicate results instead of creating another row.
    const k=String(x.key||'')+'|'+String(x.dedupeKey||x.type||'final');
    if(seen.has(k))continue;seen.add(k);out.push(x);
    if(out.length>=MAX_INBOX)break;
  }
  write(INBOX,out);
}
function reconcileInbox(matches){
  const byKey=new Map(matches.map(m=>[m.key,m]));
  const rows=inbox().map(e=>{
    const m=byKey.get(e.key);
    if(!m)return e;
    return {
      ...e,
      home:m.home,away:m.away,hs:m.hs,as:m.as,category:m.category,
      field:m.field,date:m.date,stamp:m.stamp||e.stamp,
      status:(m.hs!==null&&m.as!==null)?'Finalizado':e.status,
      homeLogo:logoFor(m.home),awayLogo:logoFor(m.away),
      id:m.key+'|'+String(e.type||'final')+'|'+String(m.hs)+'|'+String(m.as)
    };
  });
  saveInbox(rows);
}
function entryFor(m,type='final',ts=Date.now()){
  const scored=m.hs!==null&&m.as!==null;
  return {
    id:m.key+'|'+type+'|'+String(m.hs)+'|'+String(m.as),
    key:m.key,type,ts,stamp:m.stamp||ts,
    category:m.category,home:m.home,away:m.away,hs:m.hs,as:m.as,
    status:type==='goal'?'Gol':scored?'Finalizado':'Actualización',
    homeLogo:logoFor(m.home),awayLogo:logoFor(m.away),field:m.field,date:m.date
  };
}
function seedInbox(matches){
  if(inbox().length)return;
  const done=matches.filter(m=>m.hs!==null&&m.as!==null)
    .sort((a,b)=>(b.stamp||0)-(a.stamp||0)).slice(0,10)
    .map(m=>entryFor(m,'final',m.stamp||Date.now()));
  saveInbox(done);
}
function snapshot(matches){
  const o={};
  matches.forEach(m=>o[m.key]={hs:m.hs,as:m.as,date:m.date,field:m.field,category:m.category,home:m.home,away:m.away});
  return o;
}
function shouldAlert(type){
  const p=prefs();if(!p.enabled)return false;
  return type==='goal'?p.goal!==false:type==='final'?p.final!==false:true;
}
async function requestPermission(){
  if(Capacitor.isNativePlatform()){
    try{
      const r=await NativeNotifications.requestPermission();
      const ok=!!r?.granted;write(PERM,{granted:ok,at:Date.now()});
      renderFeed();
      return ok;
    }catch(_){return false}
  }
  if(!('Notification'in window))return false;
  try{
    const p=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
    const ok=p==='granted';write(PERM,{granted:ok,at:Date.now()});renderFeed();return ok;
  }catch(_){return false}
}
async function webNotify(title,options,targetRoute){
  if(!('Notification'in window)||Notification.permission!=='granted')return false;
  const path=String(targetRoute||'notifications').replace(/^#\/?/,'').replace(/^\/+/,'').replace(/[^a-zA-Z0-9_/?=&-]/g,'');
  const url=new URL('./#/'+path,location.href).href;
  if('serviceWorker'in navigator){
    try{
      const registration=await navigator.serviceWorker.register('./sw.js');
      await registration.showNotification(title,{...options,data:{url}});
      return true;
    }catch(_){}
  }
  // Algunos escritorios todavía admiten el constructor; Android requiere SW.
  try{
    const notice=new Notification(title,options);
    notice.onclick=()=>{try{window.focus();location.hash='#/'+path;notice.close()}catch(_){}};
    return true;
  }catch(_){return false}
}

async function systemNotify(e){
  if(!shouldAlert(e.type))return false;
  const title=e.category||'Liga Juventino';
  const score=(e.hs!==null&&e.as!==null)?e.home+' '+e.hs+' vs '+e.away+' '+e.as:e.home+' vs '+e.away;
  const body=score+' · '+e.status;
  if(Capacitor.isNativePlatform()){
    try{
      const perm=read(PERM,{});
      if(!perm.granted)return false;
      await NativeNotifications.notifyMatch({
        id:hash(e.id)&0x7fffffff,title,body,
        homeLogo:e.homeLogo||'',awayLogo:e.awayLogo||'',
        imageUrl:e.imageUrl||'',
        group:'liga-'+norm(e.category).replace(/\s+/g,'-'),
        route:String(e.route||'competition')
      });
      return true;
    }catch(_){return false}
  }
  return await webNotify(title,{
    body,tag:'ljr-'+e.id,renotify:true,
    icon:e.homeLogo||'./assets/branding/escudo-liga-azul-sin-fondo-v1007.png',
    badge:'./assets/branding/escudo-liga-azul-sin-fondo-v1007.png',
    vibrate:prefs().vibration!==false?[220,100,220]:[]
  },String(e.route||'competition'));
}

async function sendRichNotification(input={}){
  const title=String(input.title||'Liga Juventino');
  const body=String(input.body||'Nueva actualización de la Liga.');
  const imageUrl=String(input.imageUrl||'');
  const iconUrl=String(input.iconUrl||'');
  const group=String(input.group||'liga-noticias');
  const route=String(input.route||'notifications');
  const id=Number(input.id||hash(title+'|'+body+'|'+imageUrl+'|'+Date.now()))&0x7fffffff;
  if(Capacitor.isNativePlatform()){
    const perm=read(PERM,{});
    if(!perm.granted){
      const ok=await requestPermission();
      if(!ok)return false;
    }
    try{
      const asNativeImage=async source=>{if(!source.startsWith('blob:'))return source;const blob=await fetch(source).then(r=>r.blob());return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('No se pudo leer la imagen.'));reader.readAsDataURL(blob)})};
      await NativeNotifications.notifyRich({id,title,body,imageUrl:await asNativeImage(imageUrl),iconUrl:await asNativeImage(iconUrl),group,route});
      return true;
    }catch(_){return false}
  }
  if(!('Notification'in window))return false;
  if(Notification.permission!=='granted'){
    const ok=await requestPermission();
    if(!ok)return false;
  }
  return await webNotify(title,{
    body,tag:'ljr-rich-'+id,renotify:true,
    icon:iconUrl||'./assets/branding/escudo-liga-azul-sin-fondo-v1007.png',
    image:imageUrl||undefined,
    badge:'./assets/branding/escudo-liga-azul-sin-fondo-v1007.png',
    vibrate:prefs().vibration!==false?[220,100,220]:[]
  },route);
}

async function pushLive(input={}){
  const home=String(input.home||'Local'),away=String(input.away||'Visitante');
  const hs=Number.isFinite(Number(input.hs))?Number(input.hs):null;
  const as=Number.isFinite(Number(input.as))?Number(input.as):null;
  const type=String(input.type||'live');
  const eventId=String(input.eventId||input.id||type+'-'+Date.now());
  const e={
    id:'live|'+String(input.matchKey||input.key||'match')+'|'+eventId,
    key:String(input.matchKey||input.key||'match'),
    type,
    dedupeKey:type+'|'+eventId,
    ts:Number(input.ts||Date.now()),
    stamp:Number(input.ts||Date.now()),
    category:String(input.category||'Liga Juventino Rosas'),
    home,away,hs,as,
    status:String(input.status||input.label||'EN VIVO'),
    homeLogo:absLogo(String(input.homeLogo||''))||logoFor(home),
    awayLogo:absLogo(String(input.awayLogo||''))||logoFor(away),
    field:String(input.field||''),
    date:String(input.date||''),
    route:String(input.route||'v4-matchcenter'),
    live:true
  };
  saveInbox([e,...inbox()]);
  renderFeed();
  await systemNotify(e);
  return true;
}

async function sendSampleRich(){
  const latest=inbox()[0];
  return sendRichNotification({
    title:'Liga Juventino Rosas · Vista previa',
    body:latest?scoreText(latest)+' · '+latest.status:'Los avisos de partidos aparecerán aquí cuando se publiquen datos oficiales.',
    iconUrl:latest?.homeLogo||'./assets/branding/escudo-liga-azul-sin-fondo-v1007.png',
    imageUrl:latest?.awayLogo||'',
    route:latest?.route||'notifications',
    group:'liga-pruebas'
  });
}

async function processChanges(matches){
  const prev=read(SNAP,null);
  if(!prev){write(SNAP,snapshot(matches));seedInbox(matches);reconcileInbox(matches);renderFeed();return}
  const added=[];
  for(const m of matches){
    const old=prev[m.key];if(!old)continue;
    const oldHs=old.hs==null?null:Number(old.hs),oldAs=old.as==null?null:Number(old.as);
    let type='';
    if(m.hs!==null&&m.as!==null){
      if(oldHs!==null&&oldAs!==null&&(m.hs>oldHs||m.as>oldAs))type='goal';
      else if((oldHs===null||oldAs===null))type='final';
      else if(m.hs!==oldHs||m.as!==oldAs)type='final';
    }
    if(!type)continue;
    const e=entryFor(m,type);
    added.push(e);
    await systemNotify(e);
  }
  if(added.length)saveInbox([...added,...inbox()]);
  reconcileInbox(matches);
  write(SNAP,snapshot(matches));
  seedInbox(matches);
  renderFeed();
}
async function refresh(){
  if(polling)return;polling=true;
  try{
    const r=await fetch(REMOTE+'?v='+Date.now(),{cache:'no-store'});
    if(r.ok)remoteData=await r.json();
  }catch(_){}
  try{await processChanges(fixtures())}finally{polling=false}
}
function scoreText(e){
  return e.hs!==null&&e.as!==null?e.home+' '+e.hs+' vs '+e.away+' '+e.as:e.home+' vs '+e.away;
}
function timeText(e){
  const t=e.stamp||e.ts;if(!t)return '';
  try{return new Intl.DateTimeFormat('es-MX',{day:'2-digit',month:'short',hour:'numeric',minute:'2-digit'}).format(new Date(t))}catch(_){return ''}
}
function logoPair(e){
  const fallback='<span class="v840-logo-fallback">⚽</span>';
  return '<span class="v840-logos">'+
    (e.homeLogo?'<img src="'+esc(e.homeLogo)+'" alt="" loading="lazy" decoding="async">':fallback)+
    (e.awayLogo?'<img src="'+esc(e.awayLogo)+'" alt="" loading="lazy" decoding="async">':fallback)+
  '</span>';
}
function feedMarkup(){
  const all=inbox();
  const native=Capacitor.isNativePlatform(),permission=read(PERM,{});
  const granted=native?!!permission.granted:('Notification'in window&&Notification.permission==='granted');
  const denied=!native&&'Notification'in window&&Notification.permission==='denied';
  const readSet=new Set(readIds());
  const unread=all.filter(e=>!readSet.has(e.id)).length;
  const categories=[...new Set([
    ...all.map(e=>e.category),
    ...Object.values(data()?.categories||{}).map(c=>c?.name)
  ].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  // Un filtro antiguo no puede dejar toda la lista inaccesible.
  if(view.category!=='all'&&!categories.includes(view.category)){
    view.category='all';saveView();
  }
  const filtered=all.filter(e=>
    (view.category==='all'||e.category===view.category)&&
    (view.type==='all'||(view.type==='goal'&&e.type==='goal')||
     (view.type==='final'&&(e.type==='final'||e.status==='Finalizado'))||
     (view.type==='live'&&(e.live||e.type==='live')))
  );
  const filteredUnread=filtered.filter(e=>!readSet.has(e.id)).length;
  const rows=filtered.slice(0,view.more?MAX_INBOX:5);
  const filters=[['all','Todos'],['goal','Goles'],['final','Resultados'],['live','En vivo']];
  const status=granted?'Avisos permitidos en este dispositivo':denied?'Avisos bloqueados: cambia el permiso desde el navegador.':'Activa avisos para recibir alertas del dispositivo.';
  return '<section class="v840-match-feed" data-v840-feed aria-label="Actividad reciente de la Liga">'+
    '<div class="v840-feed-head">'+
      '<div class="v840-feed-title"><small>PARTIDOS · LIGA JUVENTINO ROSAS</small><h3>Actividad reciente</h3>'+
        '<p>Marcadores y avisos oficiales por categoría.</p>'+
        '<span class="v840-permission-status '+(granted?'allowed':denied?'denied':'')+'">'+(granted?'✓':'○')+' '+esc(status)+'</span></div>'+
      '<div class="v840-head-actions"><button type="button" data-v840-permission class="'+(granted?'on':'')+'" aria-label="Activar permisos de avisos">'+
        (granted?'Avisos activos':denied?'Cómo permitir avisos':'Activar avisos')+
      '</button><button type="button" data-v851-rich-test>Probar aviso</button></div>'+
    '</div>'+
    '<p class="v840-feedback" role="status" aria-live="polite">'+esc(feedback)+'</p>'+
    '<div class="v840-feed-tools"><div class="v840-feed-tabs" role="group" aria-label="Filtrar avisos">'+
      filters.map(([key,label])=>'<button type="button" data-v840-type="'+key+'" aria-pressed="'+(view.type===key?'true':'false')+'" class="'+(view.type===key?'selected':'')+'">'+label+'</button>').join('')+
    '</div><label class="v840-feed-category"><span>Categoría</span><select data-v840-category aria-label="Filtrar por categoría">'+
      '<option value="all">Todas las categorías</option>'+categories.map(cat=>'<option value="'+esc(cat)+'" '+(view.category===cat?'selected':'')+'>'+esc(cat)+'</option>').join('')+
    '</select></label></div>'+
    '<div class="v840-feed-subhead"><span>'+filtered.length+' '+(filtered.length===1?'aviso':'avisos')+' · '+filteredUnread+' sin leer en este filtro</span>'+
      (unread?'<button type="button" data-v840-readall>Marcar todos como leídos</button>':'')+'</div>'+
    '<div class="v840-feed-list">'+
      (rows.length?rows.map(e=>'<button type="button" class="v840-notice-row '+(!readSet.has(e.id)?'unread':'')+'" data-v840-id="'+esc(e.id)+'" data-v840-route="'+esc(e.route||'competition')+'" aria-label="'+esc(scoreText(e)+' · '+e.category+' · '+e.status)+'">'+
        logoPair(e)+'<span class="v840-notice-copy"><span class="v840-notice-meta"><b>'+esc(e.category)+'</b><small>'+esc(timeText(e))+'</small></span>'+
        '<strong>'+esc(scoreText(e))+'</strong><em>'+esc(e.status)+(e.field?' · '+esc(e.field):'')+'</em></span>'+
        '<span class="v840-row-trail">'+(!readSet.has(e.id)?'<span class="v840-unread-dot" aria-label="Sin leer"></span>':'')+'<i aria-hidden="true">›</i></span></button>').join(''):
        '<div class="v840-empty">No hay avisos para este filtro. Elige otra categoría o consulta más tarde.</div>')+
    '</div>'+
    (filtered.length>rows.length?'<button type="button" class="v840-feed-more" data-v840-more>Ver '+(filtered.length-rows.length)+' avisos más ↓</button>':
       view.more&&filtered.length>5?'<button type="button" class="v840-feed-more" data-v840-more>Mostrar menos ↑</button>':'')+
  '</section>';
}

function renderFeed(){
  if(route()!=='notifications')return;
  const host=document.querySelector('.v46-ref-notifications-main')||
             document.querySelector('.v414-notifications')||
             document.querySelector('[data-v46-account="notifications"]');
  if(!host)return;
  const markup=feedMarkup(),signature=String(hash(markup));
  const previous=host.querySelector('[data-v840-feed]');
  // Evita el bucle de cambios del MutationObserver y perder el scroll al actualizar.
  if(previous?.dataset.v840Signature===signature)return;
  previous?.remove();
  const device=host.querySelector('.v46-ref-device,.v414-device-card');
  if(device)device.insertAdjacentHTML('afterend',markup);
  else host.insertAdjacentHTML('afterbegin',markup);
  const root=host.querySelector('[data-v840-feed]');
  if(root)root.dataset.v840Signature=signature;
  root?.querySelector('[data-v840-permission]')?.addEventListener('click',async event=>{
    const button=event.currentTarget;
    if(!Capacitor.isNativePlatform()&&'Notification'in window&&Notification.permission==='denied'){
      showFeedback('Chrome tiene bloqueadas las notificaciones. Abre el icono junto a la dirección → Permisos → Notificaciones → Permitir. Después vuelve a esta página.');
      return;
    }
    if(!Capacitor.isNativePlatform()&&'Notification'in window&&Notification.permission==='granted'){
      showFeedback('Los permisos ya están activos. Pulsa «Probar aviso» para comprobarlos.');
      return;
    }
    button.disabled=true;
    showFeedback('Comprobando permisos del dispositivo…');
    const ok=await requestPermission();
    if(button.isConnected)button.disabled=false;
    showFeedback(ok?'Permiso concedido. Puedes probar un aviso.':'No se concedió el permiso. Revisa los permisos del navegador o de Android.');
    renderFeed();
  });
  root?.querySelector('[data-v851-rich-test]')?.addEventListener('click',async event=>{
    const button=event.currentTarget;
    button.disabled=true;
    showFeedback('Comprobando si Chrome puede mostrar el aviso de prueba…');
    const ok=await sendSampleRich();
    showFeedback(ok?
      'Se solicitó mostrar el aviso de prueba en el dispositivo. Revisa las notificaciones de Android.':
      (!Capacitor.isNativePlatform()&&'Notification'in window&&Notification.permission==='denied'?
        'Chrome bloquea los avisos. Abre el icono junto a la dirección → Permisos → Notificaciones → Permitir.':
        'No se pudo mostrar el aviso. Comprueba los permisos y que tu navegador admita notificaciones.'));
    if(button.isConnected){
      button.disabled=false;
      button.textContent=ok?'Prueba solicitada':'Probar aviso';
      setTimeout(()=>{if(button.isConnected)button.textContent='Probar aviso'},1800);
    }
  });
  root?.querySelectorAll('[data-v840-type]').forEach(b=>b.addEventListener('click',()=>{
    view.type=b.dataset.v840Type||'all';view.more=false;saveView();renderFeed();
  }));
  root?.querySelector('[data-v840-category]')?.addEventListener('change',e=>{
    view.category=e.target.value||'all';view.more=false;saveView();renderFeed();
  });
  root?.querySelector('[data-v840-more]')?.addEventListener('click',()=>{
    view.more=!view.more;saveView();renderFeed();
  });
  root?.querySelector('[data-v840-readall]')?.addEventListener('click',()=>{markAllRead();renderFeed()});
  root?.querySelectorAll('[data-v840-id]').forEach(b=>b.addEventListener('click',()=>{
    markRead(b.dataset.v840Id||'');
    const target=String(b.dataset.v840Route||'competition');
    if(target==='competition')try{localStorage.setItem('competitionTab','fixtures')}catch(_){}
    location.hash='#/'+target.replace(/^#\/?/,'').replace(/^\//,'');
    renderFeed();
  }));
}
function interceptDeviceButtons(){
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-v46-device],[data-v414-device]');
    if(!b||route()!=='notifications'||!Capacitor.isNativePlatform())return;
    e.preventDefault();e.stopImmediatePropagation();
    requestPermission();
  },true);
}
function boot(){
  interceptDeviceButtons();
  const mo=new MutationObserver(()=>{clearTimeout(renderTimer);renderTimer=setTimeout(renderFeed,50)});
  mo.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(renderFeed,50));
  window.addEventListener('focus',refresh);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
  window.addEventListener('ljr:official-data',refresh);
  refresh();setInterval(()=>{if(!document.hidden)refresh()},120000);
}
window.LJR_V840_NOTIFICATIONS={
  requestPermission,refresh,render:renderFeed,inbox,
  sendRich:sendRichNotification,
  sendMatch:systemNotify,
  pushLive,
  testRich:sendSampleRich
};
window.addEventListener('ljr:notify-rich',e=>sendRichNotification(e?.detail||{}));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

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
let remoteData=null,polling=false,renderTimer=0;

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const num=v=>/^\s*-?\d+\s*$/.test(String(v??''))?Number(v):null;
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const hash=s=>{let h=2166136261;for(const ch of String(s||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};

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
  if('Notification'in window&&Notification.permission==='granted'){
    try{
      const targetRoute=String(e.route||'competition');
      const n=new Notification(title,{
        body,tag:'ljr-'+e.id,renotify:true,
        icon:e.homeLogo||'./assets/reference/predictor-v36/liga-crest-white.webp',
        badge:'./assets/reference/predictor-v36/liga-crest-white.webp',
        vibrate:prefs().vibration!==false?[220,100,220]:[]
      });
      n.onclick=()=>{try{window.focus();location.hash='#/'+targetRoute.replace(/^#\/?/,'').replace(/^\//,'');n.close()}catch(_){}};
      return true;
    }catch(_){}
  }
  return false;
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
  try{
    const n=new Notification(title,{
      body,
      tag:'ljr-rich-'+id,
      renotify:true,
      icon:iconUrl||'./assets/reference/predictor-v36/liga-crest-white.webp',
      image:imageUrl||undefined,
      badge:'./assets/reference/predictor-v36/liga-crest-white.webp',
      vibrate:prefs().vibration!==false?[220,100,220]:[]
    });
    n.onclick=()=>{try{window.focus();location.hash='#/'+route.replace(/^#\/?/,'').replace(/^\//,'');n.close()}catch(_){}};
    return true;
  }catch(_){return false}
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
  if(latest){
    return systemNotify({...latest,id:'sample-rich-'+Date.now(),type:'test',status:'Vista previa de notificación'});
  }
  return sendRichNotification({
    title:'Liga Juventino Rosas',
    body:'Notificación con imagen grande, agrupación y vista expandible activada.',
    iconUrl:'./assets/reference/predictor-v36/liga-crest-white.webp',
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
  try{return new Intl.DateTimeFormat('es-MX',{hour:'numeric',minute:'2-digit'}).format(new Date(t))}catch(_){return ''}
}
function logoPair(e){
  const fallback='<span class="v840-logo-fallback">⚽</span>';
  return '<span class="v840-logos">'+
    (e.homeLogo?'<img src="'+esc(e.homeLogo)+'" alt="" loading="eager" decoding="async">':fallback)+
    (e.awayLogo?'<img src="'+esc(e.awayLogo)+'" alt="" loading="eager" decoding="async">':fallback)+
  '</span>';
}
function feedMarkup(){
  const rows=inbox().slice(0,12),native=Capacitor.isNativePlatform(),perm=read(PERM,{});
  return '<section class="v840-match-feed" data-v840-feed>'+
    '<div class="v840-feed-head"><div><small>PARTIDOS</small><h3>Actividad reciente</h3><p>Resultados y avisos de la Liga con los escudos de ambos equipos.</p></div>'+
      '<div class="v840-head-actions"><button type="button" data-v840-permission class="'+(perm.granted?'on':'')+'">'+
        (perm.granted?'Avisos del APK activos':native?'Activar avisos del APK':'Activar avisos')+
      '</button><button type="button" data-v851-rich-test>Probar aviso con imagen</button></div></div>'+
    '<div class="v840-feed-list">'+
      (rows.length?rows.map(e=>'<button type="button" class="v840-notice-row" data-v840-match="'+esc(e.key)+'" data-v840-route="'+esc(e.route||'competition')+'">'+
        logoPair(e)+'<span class="v840-notice-copy"><span><b>'+esc(e.category)+'</b><small>'+esc(timeText(e))+'</small></span>'+
        '<strong>'+esc(scoreText(e))+'</strong><em>'+esc(e.status)+(e.field?' · '+esc(e.field):'')+'</em></span><i>›</i></button>').join(''):
        '<div class="v840-empty">Cuando haya resultados o cambios de marcador aparecerán aquí.</div>')+
    '</div>'+
  '</section>';
}
function renderFeed(){
  if(route()!=='notifications')return;
  const host=document.querySelector('.v46-ref-notifications-main')||
             document.querySelector('.v414-notifications')||
             document.querySelector('[data-v46-account="notifications"]');
  if(!host)return;
  host.querySelector('[data-v840-feed]')?.remove();
  const device=host.querySelector('.v46-ref-device,.v414-device-card');
  if(device)device.insertAdjacentHTML('afterend',feedMarkup());
  else host.insertAdjacentHTML('afterbegin',feedMarkup());
  const root=host.querySelector('[data-v840-feed]');
  root?.querySelector('[data-v840-permission]')?.addEventListener('click',async e=>{
    e.currentTarget.disabled=true;
    const ok=await requestPermission();
    e.currentTarget.disabled=false;
    if(ok){
      const latest=inbox()[0];
      if(latest)await systemNotify({...latest,id:'test-'+Date.now(),type:'test',status:'Avisos activados'});
    }
  });
  root?.querySelector('[data-v851-rich-test]')?.addEventListener('click',async e=>{
    e.currentTarget.disabled=true;
    const ok=await sendSampleRich();
    e.currentTarget.disabled=false;
    e.currentTarget.textContent=ok?'Aviso enviado':'Activa notificaciones';
    setTimeout(()=>{if(e.currentTarget)e.currentTarget.textContent='Probar aviso con imagen'},1800);
  });
  root?.querySelectorAll('[data-v840-match]').forEach(b=>b.addEventListener('click',()=>{
    const target=String(b.dataset.v840Route||'competition');
    if(target==='competition')try{localStorage.setItem('competitionTab','fixtures')}catch(_){}
    location.hash='#/'+target.replace(/^#\/?/,'').replace(/^\//,'');
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
  refresh();setInterval(refresh,120000);
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

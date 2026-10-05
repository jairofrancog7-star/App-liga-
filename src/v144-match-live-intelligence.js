import {Capacitor,registerPlugin} from '@capacitor/core';
const nativeSpeech=registerPlugin('LigaSpeech');
import {patchKeepingPlayer,enableDirectStream,playbackSettings,openPhoneCamera} from './v561-media-tools.js';
import { normalizeStreamUrl, streamProvider, youtubeVideoId, tiktokVideoId, attachPlayerControls } from './v560-stream-player-controls.js';
/* V144 — Match Center Live Intelligence.
   Facebook/YouTube/Talacha link + live clock + smart narration detection.
   Speech detections are suggestions until an operator confirms them. */
(function(){
'use strict';
if(window.__LJR_V144_LIVE__)return;
window.__LJR_V144_LIVE__=true;

const ROUTES=new Set(['v4-matchcenter','matchCenter','match-center']);
const LEGACY_DEFAULT_SOURCE='https://www.facebook.com/share/1CBUKPcTCm/';
const DEFAULT_SOURCE='';
const KEY='ljr-match-live-v144:';
const SOURCE_KEY='ljr-live-source-v144';
const ALERTS_KEY='ljr-match-alerts-v1';
const sentAlerts=new Set();
const bc=('BroadcastChannel' in window)?new BroadcastChannel('ljr-match-live-v144'):null;
const serverStates=new Map(),serverRevisions=new Map(),serverPending=new Map();let syncing=false;
const canEdit=()=>!!window.LJR_MEDIA?.admin;
let speech=null,listening=false,listenRequested=false,mountTimer=0,pollTimer=0,clockTimer=0;
const narrationDrafts=new Map();

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const now=()=>Date.now();

function ctx(){
  const root=$('[data-v92-matchcenter]');if(!root)return null;
  const sel=$('[data-v92-match-select]',root);
  let sides=$$('.v92-score-card .v92-side b',root);
  if(sides.length<2)sides=$$('.v420-matchup > div > b',root);
  if(sides.length<2)sides=$$('.v526-form-head > div > b',root);
  if(!sel||sides.length<2)return null;
  const key=String(sel.value||'match'),catId=key.split(':')[0]||'';
  const category=window.LJR_OFFICIAL_DATA?.categories?.[catId]?.name||
    $('.v420-match-panel h2',root)?.textContent?.trim()||
    ($('.v92-match-head p',root)?.textContent||'').split('·')[1]?.trim()||'';
  return {root,key,catId,home:(sides[0].textContent||'Local').trim(),away:(sides[1].textContent||'Visitante').trim(),category};
}
function isLegacyFacebookPlaceholder(url,name=''){
  const u=String(url||'').toLowerCase();
  const n=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  /* V530: cualquier estado viejo con el nombre genérico "Facebook / transmisión externa"
     fue creado automáticamente por versiones anteriores; no es un LIVE publicado por el operador. */
  return u.includes('facebook.com/share/1cbukpctcm') ||
    n==='facebook / transmision externa' ||
    n==='facebook/transmision externa';
}
function migrateLegacyFacebookPlaceholder(){
  try{
    const g=JSON.parse(localStorage.getItem(SOURCE_KEY)||'null');
    if(g&&isLegacyFacebookPlaceholder(g.url,g.name))localStorage.removeItem(SOURCE_KEY);
  }catch(_){}
  try{
    for(let i=localStorage.length-1;i>=0;i--){
      const k=localStorage.key(i);
      if(!k||!k.startsWith(KEY))continue;
      try{
        const s=JSON.parse(localStorage.getItem(k)||'null');
        if(s?.source&&isLegacyFacebookPlaceholder(s.source.url,s.source.name)){
          s.source.url='';s.source.name='';s.source.feedUrl='';s.source.connected=false;s.source.lastSync=0;
          localStorage.setItem(k,JSON.stringify(s));
        }
      }catch(_){}
    }
  }catch(_){}
  try{
    const u=new URL(location.href);
    const live=u.searchParams.get('live')||'';
    const liveName=u.searchParams.get('liveName')||'';
    if(isLegacyFacebookPlaceholder(live,liveName)){
      u.searchParams.delete('live');
      u.searchParams.delete('liveName');
      history.replaceState(null,'',u.toString());
    }
  }catch(_){}
}
migrateLegacyFacebookPlaceholder();
function urlLiveSource(){
  try{
    const q=new URLSearchParams(location.search),url=q.get('live')||'',name=q.get('liveName')||'';
    return url?{url,name:name||provider(url).name}:null;
  }catch(_){return null}
}
function freshState(c){
  let global={url:DEFAULT_SOURCE,name:''};
  try{global=JSON.parse(localStorage.getItem(SOURCE_KEY)||'null')||global}catch(_){}
  if(isLegacyFacebookPlaceholder(global?.url,global?.name))global={url:'',name:''};
  const shared=urlLiveSource();if(shared)global=shared;
  return {v:144,key:c.key,home:c.home,away:c.away,source:{url:global.url||'',name:global.name||'',feedUrl:'',connected:false,lastSync:0},phase:'scheduled',firstStartedAt:0,secondStartedAt:0,finishedAt:0,events:[],suggestions:[],lastTranscript:'',updatedAt:now()};
}
function sourceLabel(url,name){const key=streamProvider(url),known={facebook:'Facebook Live',youtube:'YouTube Live',tiktok:'TikTok Live'};return /^(facebook|youtube|tiktok)( live)?$/i.test(String(name||'').trim())?known[key]||name:name}
function load(c){
  const published=serverStates.get(c.key);
  if(published&&!canEdit())return JSON.parse(JSON.stringify(published));
  try{
    const s=JSON.parse(localStorage.getItem(KEY+c.key)||'null');
    if(s&&s.v===144){
      s.home=c.home;s.away=c.away;
      s.source=Object.assign({url:'',name:'',feedUrl:'',connected:false,lastSync:0},s.source||{});
      if(isLegacyFacebookPlaceholder(s.source.url,s.source.name)){
        s.source.url='';s.source.name='';s.source.feedUrl='';s.source.connected=false;s.source.lastSync=0;
        try{localStorage.removeItem(SOURCE_KEY)}catch(_){}
        save(s,false);
      }
      const shared=urlLiveSource();
      if(shared){s.source.url=shared.url;s.source.name=shared.name}
      s.events=Array.isArray(s.events)?s.events:[];
      s.suggestions=Array.isArray(s.suggestions)?s.suggestions:[];
      if(!canEdit()){s.events=[];s.suggestions=[];s.phase='scheduled';s.firstStartedAt=0;s.secondStartedAt=0;}
      return s;
    }
  }catch(_){}
  return freshState(c);
}
function save(s,broadcast=true){
  s.updatedAt=now();
  try{localStorage.setItem(KEY+s.key,JSON.stringify(s))}catch(_){}
  if(broadcast&&canEdit()){serverPending.set(s.key,JSON.parse(JSON.stringify(s)));syncWrites()}
  if(broadcast)try{bc?.postMessage({type:'state',key:s.key,state:s})}catch(_){}
}
async function syncWrites(){
 if(syncing||!canEdit()||!window.LJR_MEDIA)return;syncing=true;
 try{while(serverPending.size){const [key,state]=serverPending.entries().next().value;serverPending.delete(key);try{if(!serverRevisions.has(key)){const r=await window.LJR_MEDIA.api('match/'+encodeURIComponent(key));serverRevisions.set(key,r.revision)}const r=await window.LJR_MEDIA.api('match/'+encodeURIComponent(key),{method:'PUT',body:{state,revision:serverRevisions.get(key)||0}});serverRevisions.set(key,r.revision);serverStates.set(key,state)}catch(error){toast(error.status===409?'Otro operador cambió el partido. Recargando la versión compartida.':'No se pudo publicar el cambio: '+error.message);await refreshShared(true);serverPending.delete(key)}}}finally{syncing=false}
}
async function refreshShared(overwrite=false){const c=ctx();if(!c||!window.LJR_MEDIA)return;try{const r=await window.LJR_MEDIA.api('match/'+encodeURIComponent(c.key));if(syncing&&!overwrite)return;const changed=r.revision!==(serverRevisions.get(c.key)||0);serverRevisions.set(c.key,r.revision);if(r.state){serverStates.set(c.key,r.state);if(overwrite||changed||!canEdit())localStorage.setItem(KEY+c.key,JSON.stringify(r.state));schedule()}}catch{}}
window.addEventListener('liga:admin',()=>{if(!canEdit())stopSpeech();refreshShared(true);schedule()});
setInterval(()=>refreshShared(),7000);
window.addEventListener('hashchange',()=>setTimeout(()=>refreshShared(),350));
function alertsEnabled(){
  try{return localStorage.getItem(ALERTS_KEY)==='1'}catch(_){return false}
}
async function requestAlerts(){
  try{localStorage.setItem(ALERTS_KEY,'1')}catch(_){}
  if(!('Notification' in window)){
    toast('Avisos dentro de la app activados. Este navegador no ofrece notificaciones del sistema.');
    schedule();return;
  }
  if(Notification.permission==='granted'){
    toast('Avisos de goles, medio tiempo y final activados.');schedule();return;
  }
  if(Notification.permission==='denied'){
    toast('Avisos dentro de la app activados. Activa notificaciones del navegador en Ajustes para verlas fuera de la pantalla.');schedule();return;
  }
  try{
    const p=await Notification.requestPermission();
    toast(p==='granted'?'Notificaciones del partido activadas.':'Avisos dentro de la app activados.');
  }catch(_){toast('Avisos dentro de la app activados.')}
  schedule();
}
function scoreText(s,c){
  const x=counters(s);
  return c.home+' '+x.home.goals+'–'+x.away.goals+' '+c.away;
}
function matchAlert(c,s,type,side='',eventId=''){
  if(!alertsEnabled())return;
  const id=eventId||type+'|'+s.phase+'|'+String(s.updatedAt||'');
  const key=c.key+'|'+id;if(sentAlerts.has(key))return;sentAlerts.add(key);
  let title='',body='',vibe=[180,90,180];
  if(type==='goal'){
    const team=side==='home'?c.home:side==='away'?c.away:'';
    title='⚽ ¡GOL'+(team?' DE '+team.toUpperCase():'')+'!';
    body=scoreText(s,c)+(minute(s)?' · '+minute(s)+'′':'');
    vibe=[260,90,260,90,420];
  }else if(type==='phase-halftime'){
    title='⏱ MEDIO TIEMPO';
    body=scoreText(s,c)+' · Terminó el primer tiempo.';
  }else if(type==='phase-second'){
    title='▶ TERMINÓ EL DESCANSO';
    body=scoreText(s,c)+' · Comienza el segundo tiempo.';
  }else if(type==='phase-final'){
    title='🏁 PARTIDO TERMINADO';
    body='Final · '+scoreText(s,c);
    vibe=[350,120,350];
  }else return;
  toast(title+' · '+body);
  try{navigator.vibrate?.(vibe)}catch(_){}
  if('Notification' in window&&Notification.permission==='granted'){
    try{
      const n=new Notification(title,{body,tag:'ljr-'+c.key+'-'+type,renotify:true,vibrate:vibe,icon:'./icons/icon-192.png',badge:'./icons/icon-192.png'});
      n.onclick=()=>{try{window.focus();location.hash='#/v4-matchcenter';n.close()}catch(_){}};
    }catch(_){}
  }
}
const LIVE_PLATFORMS={
  facebook:{key:'facebook',name:'Facebook Live',icon:'f',portal:'https://www.facebook.com/live/producer/',placeholder:'https://www.facebook.com/.../videos/...'},
  youtube:{key:'youtube',name:'YouTube Live',icon:'▶',portal:'https://studio.youtube.com/',placeholder:'https://www.youtube.com/watch?v=...'},
  tiktok:{key:'tiktok',name:'TikTok Live',icon:'♪',portal:'https://www.tiktok.com/live',placeholder:'https://www.tiktok.com/@usuario/live'}
};
function localRoom(url){try{const u=new URL(url),base=new URL(window.LJR_MEDIA.base);const id=u.searchParams.get('live');return u.origin===base.origin&&/^[a-zA-Z0-9_-]{8,100}$/.test(id||'')?id:''}catch{return ''}}
function provider(url){
  if(localRoom(url))return {key:'local',name:'Liga en vivo',icon:'▣'};
  const key=streamProvider(url);
  if(key==='facebook')return LIVE_PLATFORMS.facebook;
  if(key==='youtube')return LIVE_PLATFORMS.youtube;
  if(key==='tiktok')return LIVE_PLATFORMS.tiktok;
  return {key:'external',name:'Transmisión externa',icon:'●',portal:'',placeholder:'https://...'};
}
function safeLiveUrl(value){return normalizeStreamUrl(value)}

function livePlatformButtons(s){
  const active=provider(s?.source?.url).key;
  return '<div class="v144-platforms" aria-label="Plataformas de transmisión">'+
    Object.values(LIVE_PLATFORMS).map(p=>'<button type="button" class="'+(active===p.key?'active':'')+'" data-v144-platform="'+p.key+'"><em>'+esc(p.icon)+'</em><span><b>'+esc(p.name.replace(' Live',''))+'</b><small>LIVE</small></span></button>').join('')+
  '<button type="button" class="'+(active==='local'?'active':'')+'" data-v144-local><em>▣</em><span><b>Local</b><small>LIGA</small></span></button></div>'+
  '<button type="button" class="v144-tv-cast" data-v144-tv-cast><span class="v144-tv-cast-icon">▣</span><span><b>Transmitir en televisión</b><small>Conectar TV o pantalla compatible</small></span><i>›</i></button>';
}
const youtubeId=youtubeVideoId;
function streamEmbedHtml(s){
  const url=normalizeStreamUrl(s?.source?.url);
  if(!url)return '';
  const p=provider(url);
  if(p.key==='local')return '<section class="v144-stream-embed"><header><b>'+esc(s.source.name||'Liga en vivo')+'</b></header><div class="v144-local-frame"><iframe src="'+esc(url)+'" title="Transmisión local de la Liga" allow="autoplay; picture-in-picture; fullscreen" allowfullscreen></iframe></div></section>';
  if(/\.(mp4|webm|ogg|m3u8)(?:[?#]|$)/i.test(url))return '<section class="v144-stream-embed"><header><b>Video directo</b></header><div class="v144-stream-frame v196-frame"><video src="'+esc(url)+'" controls playsinline preload="metadata"></video></div></section>';
  if(p.name==='Facebook Live'){
    const src='https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(url)+'&show_text=false&width=560&autoplay=false';
    return '<section class="v144-stream-embed"><header><span><small>VIDEO VINCULADO</small><b>'+esc(sourceLabel(s.source.url,s.source.name)||p.name)+'</b></span><i>FACEBOOK</i></header><div class="v144-stream-frame"><iframe src="'+esc(src)+'" title="Facebook video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div><footer><span>Reproduce el video aquí. Debe ser público y permitir inserción.</span><div><button type="button" data-v144-share>Compartir</button></div></footer></section>';

  }
  if(p.name==='YouTube Live'){
    const id=youtubeId(url);
    if(id){
      const src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=0&playsinline=1&enablejsapi=1&origin='+encodeURIComponent(location.origin)+'';
      return '<section class="v144-stream-embed"><header><span><small>TRANSMISIÓN EN VIVO</small><b>'+esc(sourceLabel(s.source.url,s.source.name)||p.name)+'</b></span><i>SIMULTÁNEO</i></header><div class="v144-stream-frame"><iframe src="'+esc(src)+'" title="YouTube Live" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div><footer><span>Video y Match Center visibles al mismo tiempo.</span><div><button type="button" data-v144-open>YouTube</button><button type="button" data-v144-share>Compartir Live</button></div></footer></section>';
    }
  }
  if(p.key==='tiktok'&&tiktokVideoId(url)){
    return '<section class="v144-stream-embed"><header><b>TikTok</b></header><div class="v144-stream-frame"><iframe src="https://www.tiktok.com/player/v1/'+tiktokVideoId(url)+'?controls=1&fullscreen_button=1" title="TikTok video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div></section>';
  }
  if(p.key==='tiktok'){
    return '<section class="v144-stream-embed fallback tiktok"><header><span><small>TIKTOK LIVE VINCULADO</small><b>'+esc(sourceLabel(s.source.url,s.source.name)||p.name)+'</b></span><i>ENLACE GUARDADO</i></header><div class="v144-stream-fallback"><b>TikTok LIVE</b><span>TikTok no permite incrustar todos los directos. El enlace abre el LIVE real en TikTok y el Match Center sigue mostrando marcador, minuto y cronología.</span><div><button type="button" data-v144-open>Abrir TikTok LIVE</button><button type="button" data-v144-share>Compartir Live</button></div></div></section>';
  }
  return '<section class="v144-stream-embed fallback"><header><span><small>TRANSMISIÓN VINCULADA</small><b>'+esc(sourceLabel(s.source.url,s.source.name)||p.name)+'</b></span><i>LIVE</i></header><div class="v144-stream-fallback"><b>Transmisión externa</b><span>Este proveedor no admite reproductor incrustado aquí.</span><div><button type="button" data-v144-open>Abrir transmisión</button><button type="button" data-v144-share>Compartir Live</button></div></div></section>';
}
function roster(c,side){
  try{
    const cat=window.LJR_OFFICIAL_DATA?.categories?.[c.catId],team=side==='home'?c.home:c.away;
    const hit=Object.entries(cat?.rosters||{}).find(([n])=>norm(n)===norm(team));
    return Array.isArray(hit?.[1])?hit[1].map(x=>typeof x==='string'?x:(x?.name||x?.player||'')).filter(Boolean):[];
  }catch(_){return []}
}
function sideFromText(text,c){
  const t=' '+norm(text)+' ',h=norm(c.home),a=norm(c.away);
  const hp=h.split(' ').filter(x=>x.length>=4),ap=a.split(' ').filter(x=>x.length>=4);
  const H=t.includes(' '+h+' ')||hp.some(x=>t.includes(' '+x+' '));
  const A=t.includes(' '+a+' ')||ap.some(x=>t.includes(' '+x+' '));
  return H&&!A?'home':A&&!H?'away':'';
}
function playerFromText(text,c,side){
  const pool=side?roster(c,side):[...roster(c,'home'),...roster(c,'away')],t=' '+norm(text)+' ';
  let hit='';
  for(const p of pool){
    const n=norm(p),parts=n.split(' ').filter(x=>x.length>=4),last=parts[parts.length-1];
    if(n.length>=5&&t.includes(' '+n+' '))return p;
    if(last&&t.includes(' '+last+' '))hit=p;
  }
  return hit;
}
function minute(s){
  const t=now();
  if(s.phase==='first'&&s.firstStartedAt){
    const m=Math.max(1,Math.floor((t-s.firstStartedAt)/60000)+1);
    return m<=45?String(m):'45+'+(m-45);
  }
  if(s.phase==='second'&&s.secondStartedAt){
    const m=46+Math.max(0,Math.floor((t-s.secondStartedAt)/60000));
    return m<=90?String(m):'90+'+(m-90);
  }
  return '';
}
function phaseLabel(s){
  if(s.phase==='first')return (minute(s)||'1')+'′ · 1T';
  if(s.phase==='halftime')return 'MEDIO TIEMPO';
  if(s.phase==='second')return (minute(s)||'46')+'′ · 2T';
  if(s.phase==='final')return 'FINAL';
  return 'PROGRAMADO';
}
function eventMinute(s){const m=minute(s);return m?m+'′':s.phase==='halftime'?'MT':s.phase==='final'?'Final':'—'}
function confirmed(s){return s.events.filter(e=>e.confirmed!==false)}
function counters(s){
  const x={home:{goals:0,subs:0,yellow:0,red:0},away:{goals:0,subs:0,yellow:0,red:0}};
  for(const e of confirmed(s)){
    if(e.type==='score-correction'){x.home.goals=e.home;x.away.goals=e.away;}
    if(!x[e.side])continue;
    if(e.type==='goal')x[e.side].goals++;
    if(e.type==='sub')x[e.side].subs++;
    if(e.type==='yellow')x[e.side].yellow++;
    if(e.type==='red')x[e.side].red++;
  }
  return x;
}
function addEvent(s,c,type,side='',note='',source='operator',player=''){
  if(!canEdit()){toast('Inicia sesión como administrador para operar el partido.');return null}
  const e={id:'e'+now()+Math.random().toString(36).slice(2,6),type,side,player,note,source,confirmed:true,minute:eventMinute(s),ts:now()};
  if(type==='phase-first'){s.phase='first';s.firstStartedAt=now();e.minute='1′'}
  if(type==='phase-halftime'){s.phase='halftime';e.minute='MT'}
  if(type==='phase-second'){s.phase='second';s.secondStartedAt=now();e.minute='46′'}
  if(type==='phase-final'){s.phase='final';s.finishedAt=now();e.minute='Final'}
  s.events.push(e);save(s);
  if(type==='goal'||type==='phase-halftime'||type==='phase-second'||type==='phase-final')matchAlert(c,s,type,side,e.id);
  return e;
}
function addSuggestion(s,o){
  o.id='s'+now()+Math.random().toString(36).slice(2,6);o.ts=now();o.minute=eventMinute(s);
  const sig=o.type+'|'+(o.side||'')+'|'+norm(o.text||'');
  if(s.suggestions.some(x=>x.sig===sig&&now()-x.ts<90000))return;
  o.sig=sig;s.suggestions.unshift(o);s.suggestions=s.suggestions.slice(0,8);save(s);
}
function confirmSuggestion(c,s,id){
  const item=(s.suggestions||[]).find(x=>x.id===id);
  if(!item)return;
  s.suggestions=(s.suggestions||[]).filter(x=>x.id!==id);
  addEvent(s,c,item.type,item.side||'',item.text||'','voice',item.player||'');
  schedule();
}
function rebuildPhase(s){
  s.phase='scheduled';s.firstStartedAt=0;s.secondStartedAt=0;s.finishedAt=0;
  const phases=confirmed(s).filter(e=>/^phase-/.test(e.type||'')).slice().sort((a,b)=>(a.ts||0)-(b.ts||0));
  for(const e of phases){
    if(e.type==='phase-first'){s.phase='first';s.firstStartedAt=Number(e.ts)||0}
    else if(e.type==='phase-halftime'){s.phase='halftime'}
    else if(e.type==='phase-second'){s.phase='second';s.secondStartedAt=Number(e.ts)||0}
    else if(e.type==='phase-final'){s.phase='final';s.finishedAt=Number(e.ts)||0}
  }
}
function analyze(text,c,s){
  const t=norm(text);if(!t)return;s.lastTranscript=text;
  let o=null;
  if(/medio tiempo|descanso|termina el primer tiempo|final del primer tiempo/.test(t))o={type:'phase-halftime',label:'Medio tiempo',confidence:.97,text};
  else if(/inicia el segundo tiempo|arranca el segundo tiempo|comienza el segundo tiempo/.test(t))o={type:'phase-second',label:'Inicio 2T',confidence:.96,text};
  else if(/final del partido|termino el partido|termina el partido|se acabo el partido|pitazo final/.test(t))o={type:'phase-final',label:'Final del partido',confidence:.97,text};
  else if(/inicia el partido|arranca el partido|comienza el partido|rueda el balon/.test(t))o={type:'phase-first',label:'Inicio 1T',confidence:.92,text};
  else if(/tarjeta roja|expulsado|expulsion|roja directa/.test(t)){const side=sideFromText(text,c);o={type:'red',side,label:'Tarjeta roja',confidence:side?.92:.78,text,player:playerFromText(text,c,side)}}
  else if(/tarjeta amarilla|amonestado|amonestacion|amarilla para/.test(t)){const side=sideFromText(text,c);o={type:'yellow',side,label:'Tarjeta amarilla',confidence:side?.90:.76,text,player:playerFromText(text,c,side)}}
  else if(/sustitucion|cambio de jugador|entra .* sale|sale .* entra|hay cambio/.test(t)){const side=sideFromText(text,c);o={type:'sub',side,label:'Cambio',confidence:side?.88:.74,text,player:playerFromText(text,c,side)}}
  else if(/\bgo+l+\b|gooo+l|anota|marco gol|marca gol|gol para|gol de/.test(t)){const side=sideFromText(text,c);o={type:'goal',side,label:'Gol',confidence:side?.94:.79,text,player:playerFromText(text,c,side)}}
  if(/no (?:fue|es|hay|hubo) (?:gol|tarjeta|cambio)|gol anulado|no cuenta|fuera de juego/.test(t))o=null;
  if(o&&s.autoVoice&&o.confidence>=.88&&(o.type.startsWith('phase-')||o.side)&&!(norm(text).includes(norm(c.home))&&norm(text).includes(norm(c.away)))){
    const sig=o.type+'|'+(o.side||'')+'|'+t;s.autoSeen=s.autoSeen||{};
    if(!s.autoSeen[sig]||now()-s.autoSeen[sig]>90000){s.autoSeen[sig]=now();addEvent(s,c,o.type,o.side||'',text,'voice-auto',o.player||'')}
  }else{save(s,false);if(o)addSuggestion(s,o)}schedule();
}
async function startSpeech(c,s){
  if(!canEdit())return window.LJR_MEDIA?.login();
  if(Capacitor.isNativePlatform()){if(listening){await nativeSpeech.stop();listening=false;schedule();return}try{await nativeSpeech.removeAllListeners();await nativeSpeech.addListener('transcript',r=>{const cc=ctx();if(!cc||cc.key!==c.key)return;if(r.isFinal)analyze(r.text,cc,load(cc));else{const el=document.querySelector('[data-v610-transcript]');if(el)el.textContent=r.text}});await nativeSpeech.addListener('speechError',r=>{listening=false;toast(r.message);schedule()});await nativeSpeech.start();listening=true;schedule()}catch(error){toast(error.message)}return}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('Tu navegador no tiene reconocimiento de voz compatible.');return}
  if(listening){stopSpeech();return}
  try{
    listenRequested=true;
    speech=new SR();speech.lang='es-MX';speech.continuous=true;speech.interimResults=true;speech.maxAlternatives=1;
    const recognizer=speech;
    speech.onstart=()=>{listening=true;schedule()};
    speech.onend=()=>{listening=false;schedule();if(listenRequested&&canEdit()&&ctx()?.key===c.key)setTimeout(()=>{if(listenRequested&&speech===recognizer)try{recognizer.start()}catch{listenRequested=false}},400)};
    speech.onerror=e=>{listening=false;if(!['no-speech','aborted'].includes(e.error)){listenRequested=false;toast(e.error==='not-allowed'?'Permite el micrófono para detectar la narración.':'La escucha se detuvo: '+e.error+'. Reintenta.')}schedule()};
    speech.onresult=e=>{
      for(let i=e.resultIndex;i<e.results.length;i++){
        if(!e.results[i].isFinal){const el=document.querySelector('[data-v610-transcript]');if(el)el.textContent=e.results[i][0]?.transcript||'';continue;}
        const cc=ctx();if(!cc||cc.key!==c.key)continue;
        analyze(e.results[i][0]?.transcript||'',cc,load(cc));
      }
    };
    speech.start();
  }catch(_){listenRequested=false;toast('No se pudo iniciar el micrófono.')}
}
function stopSpeech(){listenRequested=false;if(Capacitor.isNativePlatform())nativeSpeech.stop().catch(()=>{});try{speech?.stop()}catch(_){}speech=null;listening=false}
function eventText(e,c){
  const team=e.side==='home'?c.home:e.side==='away'?c.away:'',who=e.player?' · '+e.player:'';
  if(e.type==='goal')return '⚽ Gol'+(team?' · '+team:'')+who;
  if(e.type==='sub')return '↔ Cambio'+(team?' · '+team:'')+who;
  if(e.type==='yellow')return '🟨 Amarilla'+(team?' · '+team:'')+who;
  if(e.type==='red')return '🟥 Roja'+(team?' · '+team:'')+who;
  if(e.type==='phase-first')return 'Inicio del partido';
  if(e.type==='phase-halftime')return 'Medio tiempo';
  if(e.type==='phase-second')return 'Inicio del segundo tiempo';
  if(e.type==='phase-final')return 'Final del partido';
  if(e.type==='score-correction')return 'Marcador corregido: '+e.home+'–'+e.away;
  return e.note||'Evento';
}
function suggestionsHtml(s,c){
  return s.suggestions.slice(0,3).map(x=>{
    const team=x.side==='home'?c.home:x.side==='away'?c.away:'Equipo por confirmar';
    return '<article class="v144-suggestion"><div><small>REGLA DE NARRACIÓN</small><b>'+esc(x.label)+' · '+esc(team)+'</b><p>'+esc(x.text||'')+'</p></div><div><button data-v144-confirm="'+esc(x.id)+'">Confirmar</button><button class="ghost" data-v144-dismiss="'+esc(x.id)+'">Descartar</button></div></article>';
  }).join('');
}
function timelineHtml(s,c){
  const list=confirmed(s).slice().sort((a,b)=>b.ts-a.ts);
  return list.length?list.map(e=>'<div class="v144-live-event"><b>'+esc(e.minute||'—')+'</b><span>'+esc(eventText(e,c))+'<small>'+(e.source==='voice'?'Narración detectada y confirmada':'Operador Match Center')+'</small></span></div>').join(''):'<p class="v144-empty">Todavía no hay eventos confirmados.</p>';
}
function hubHtml(c,s){
  const hasSource=!!safeLiveUrl(s?.source?.url),p=provider(s.source.url),x=counters(s),live=s.phase==='first'||s.phase==='second';
  const sourceTitle=hasSource?(sourceLabel(s.source.url,s.source.name)||p.name):'Sin LIVE vinculado';
  const sourceType=hasSource?p.name:'Agrega Facebook, YouTube, TikTok o video';
  const sourceIcon=hasSource?p.icon:'＋';
  return '<section class="v144-live-hub" data-v144-live-hub data-v144-match="'+esc(c.key)+'">'+
    '<div class="v144-head"><i class="'+(live?'on':'')+'"></i><span><small>PARTIDO EN VIVO</small><b>'+esc(phaseLabel(s))+'</b></span><strong>'+x.home.goals+'–'+x.away.goals+'</strong></div>'+
    '<div class="v144-source"><em>'+esc(sourceIcon)+'</em><span><b>'+esc(sourceTitle)+'</b><small>'+esc(sourceType)+'</small></span><button data-v144-config>Subir / vincular LIVE</button></div>'+
    livePlatformButtons(s)+
    '<p class="v144-live-help">Facebook · YouTube · TikTok · Local. Reproduce el enlace publicado por la Liga.</p>'+
    streamEmbedHtml(s)+
    '<div class="v144-stats"><div><small>'+esc(c.home)+'</small><b>'+x.home.goals+'</b><span>'+x.home.subs+' cambios · '+x.home.yellow+' 🟨 · '+x.home.red+' 🟥</span></div><div><small>'+esc(c.away)+'</small><b>'+x.away.goals+'</b><span>'+x.away.subs+' cambios · '+x.away.yellow+' 🟨 · '+x.away.red+' 🟥</span></div></div>'+
    '<div class="v144-alerts"><span><b>🔔 Avisos del partido</b><small>Gol · medio tiempo · regreso del descanso · final</small></span><button type="button" class="'+(alertsEnabled()?'active':'')+'" data-v144-alerts>'+(alertsEnabled()?'Avisos activos':'Activar avisos')+'</button></div>'+
    '<div class="v144-ai"><button class="'+(listening?'active':'')+'" data-v144-listen>'+(listening?'■ Detener escucha':'🎙 Detectar narración')+'</button><button data-v144-config>Fuente y narración</button><small>Escucha el micrófono y transcribe en español. Los eventos se confirman manualmente, salvo que actives el modo automático.</small></div>'+
    narrationHtml(s)+
    (s.lastTranscript?'<div class="v144-transcript"><small>ÚLTIMA TRANSCRIPCIÓN</small><span>'+esc(s.lastTranscript)+'</span></div>':'')+
    (s.suggestions.length?'<div class="v144-suggestions"><h3>Eventos por confirmar</h3>'+suggestionsHtml(s,c)+'</div>':'')+
    '<details class="v144-operator" data-v144-operator><summary data-v144-operator-toggle role="button" tabindex="0" aria-expanded="false">Operador del partido</summary><div class="v144-phases"><button data-v144-phase="phase-first">Iniciar 1T</button><button data-v144-phase="phase-halftime">Medio tiempo</button><button data-v144-phase="phase-second">Iniciar 2T</button><button data-v144-phase="phase-final">Final</button></div><div class="v144-events"><button data-v144-event="goal:home">⚽ Gol '+esc(c.home)+'</button><button data-v144-event="goal:away">⚽ Gol '+esc(c.away)+'</button><button data-v144-event="sub:home">↔ Cambio '+esc(c.home)+'</button><button data-v144-event="sub:away">↔ Cambio '+esc(c.away)+'</button><button data-v144-event="yellow:home">🟨 '+esc(c.home)+'</button><button data-v144-event="yellow:away">🟨 '+esc(c.away)+'</button><button data-v144-event="red:home">🟥 '+esc(c.home)+'</button><button data-v144-event="red:away">🟥 '+esc(c.away)+'</button></div><button class="v144-undo" data-v144-undo>↶ Deshacer último evento</button></details>'+
    '<div class="v144-timeline"><header><b>Cronología en vivo</b><small>Confirmada en Match Center</small></header>'+timelineHtml(s,c)+'</div>'+
  '</section>';
}
function narrationHtml(s){return '<section class="v610-narration"><b>Texto, voz y automatización</b><textarea data-v610-text placeholder="Ejemplo: gol de '+esc(s.home)+'. Inicia el segundo tiempo."></textarea><div class="v610-row"><button data-v610-analyze>Detectar eventos del texto</button><button data-v610-speak>Leer con audio</button><button data-v610-stop-audio>Detener audio</button><button data-v611-music>Agregar canción o audio</button></div><span data-v610-transcript aria-live="polite"></span><label><input type="checkbox" data-v610-auto-voice '+(s.autoVoice?'checked':'')+'>Registrar eventos claros de la narración automáticamente</label><small>Los equipos ambiguos quedan pendientes. La escucha usa el micrófono, no el audio interno de Facebook o YouTube.</small><label><input type="checkbox" data-v610-auto-clock '+(s.autoClock?'checked':'')+'>Cambiar tiempos con reloj automático</label><small>El reloj compartido conserva los tiempos al cerrar la página. Confirma la hora de inicio real.</small><label>Inicio programado<input type="datetime-local" data-v610-start value="'+esc(s.kickoffLocal||'')+'"></label><div class="v610-row"><label>Minutos por tiempo<input type="number" min="1" max="60" data-v610-period value="'+(s.periodMinutes||45)+'"></label><label>Descanso<input type="number" min="1" max="30" data-v610-break value="'+(s.breakMinutes||15)+'"></label></div><div class="v610-row"><button data-v610-note>Agregar incidencia / lesión / penal</button><button data-v610-correction>Corregir marcador</button><button data-v610-publish>Publicar estado actual</button><button data-v610-broadcast>Transmitir cámara</button></div></section>'}
function clockAutomation(c,s){if(!canEdit()||!s.autoClock)return;const period=(s.periodMinutes||45)*60000,rest=(s.breakMinutes||15)*60000,kickoff=new Date(s.kickoffLocal||'').getTime();if(s.phase==='scheduled'&&Number.isFinite(kickoff)&&now()>=kickoff&&now()-kickoff<period)addEvent(s,c,'phase-first','','Inicio programado','clock');else if(s.phase==='first'&&now()-s.firstStartedAt>=period)addEvent(s,c,'phase-halftime','','Reloj automático','clock');else if(s.phase==='halftime'){const half=[...s.events].reverse().find(e=>e.type==='phase-halftime');if(half&&now()-half.ts>=rest)addEvent(s,c,'phase-second','','Reloj automático','clock')}else if(s.phase==='second'&&now()-s.secondStartedAt>=period)addEvent(s,c,'phase-final','','Reloj automático','clock')}
function modalHtml(s,preferred=''){
  const detected=provider(s.source.url),selected=preferred&&LIVE_PLATFORMS[preferred]?preferred:(detected.key!=='external'?detected.key:'facebook');
  const picks=Object.values(LIVE_PLATFORMS).map(p=>'<button type="button" class="'+(selected===p.key?'active':'')+'" data-platform="'+p.key+'"><em>'+esc(p.icon)+'</em><span>'+esc(p.name)+'</span></button>').join('');
  const meta=LIVE_PLATFORMS[selected];
  return '<div class="v144-modal" data-selected-platform="'+selected+'"><button class="v144-backdrop" data-close></button><section><header><b>Publicar transmisión en vivo</b><button data-close>×</button></header>'+
    '<div class="v144-modal-platforms">'+picks+'</div>'+
    '<label><span>Nombre del medio / página</span><input data-name value="'+esc(s.source.name||meta.name)+'" placeholder="Liga Juventino TV"></label>'+
    '<label><span>Enlace del Facebook / YouTube / TikTok LIVE</span><input data-url inputmode="url" value="'+esc(s.source.url||'')+'" placeholder="'+esc(meta.placeholder)+'"></label>'+
    '<div class="v144-link-actions"><button type="button" data-portal>Abrir '+esc(meta.name)+'</button><button type="button" data-test>Probar aquí</button><button type="button" data-tv>Transmitir en TV</button></div>'+
    '<label><span>Feed en tiempo real (opcional · JSON / WebSocket / SSE)</span><input data-feed value="'+esc(s.source.feedUrl||'')+'" placeholder="https://.../live.json o wss://..."></label>'+
    '<p>El video usa el enlace oficial de la plataforma. YouTube puede reproducirse dentro del Match Center cuando el enlace incluye el ID del directo. Facebook y TikTok pueden bloquear la vista incrustada; en ese caso queda un botón funcional para abrir el LIVE real. El feed de datos es opcional y sincroniza minuto, goles y eventos.</p>'+
    '<button class="v144-save" data-save>Publicar transmisión en Match Center</button></section></div>';
}
async function openTvCast(c,s,urlOverride=''){
  const source=safeLiveUrl(urlOverride||s?.source?.url);
  const p=provider(source);
  let target=source||location.href;


  try{
    if(window.LJR_V440_TELEVISADOS&&typeof window.LJR_V440_TELEVISADOS.openCast==='function'){
      window.LJR_V440_TELEVISADOS.openCast(target);
      return;
    }
  }catch(_){}

  const media=document.querySelector('.v144-live-hub video,video,audio');
  try{
    if(media&&media.remote&&typeof media.remote.prompt==='function'){
      await media.remote.prompt();
      return;
    }
  }catch(_){}
  try{
    if(typeof window.PresentationRequest==='function'){
      const request=new window.PresentationRequest([target]);
      await request.start();
      return;
    }
  }catch(_){}
  try{
    if(navigator.share){
      await navigator.share({title:'Liga Juventino Rosas · LIVE',text:'Abrir transmisión en otra pantalla o TV',url:target});
      return;
    }
  }catch(_){}
  try{
    await navigator.clipboard.writeText(target);
    toast('Enlace de Liga TV copiado. Ábrelo en tu TV o pantalla compatible.');
  }catch(_){
    toast('Chrome no puede abrir el selector de TV directamente. Usa Transmitir pantalla del teléfono.');
  }
}
function openConfig(c,s,preferred=''){
 if(!canEdit())return window.LJR_MEDIA?.login();
  $$('.v144-modal').forEach(x=>x.remove());
  const w=document.createElement('div');w.innerHTML=modalHtml(s,preferred);const m=w.firstElementChild;document.body.appendChild(m);
  $$('[data-close]',m).forEach(b=>b.onclick=()=>m.remove());

  const urlInput=$('[data-url]',m),nameInput=$('[data-name]',m);
  function selectedMeta(){return LIVE_PLATFORMS[m.dataset.selectedPlatform]||LIVE_PLATFORMS.facebook}
  function selectPlatform(key){
    const meta=LIVE_PLATFORMS[key];if(!meta)return;
    const old=selectedMeta();
    m.dataset.selectedPlatform=key;
    $$('[data-platform]',m).forEach(b=>b.classList.toggle('active',b.dataset.platform===key));
    if(urlInput){urlInput.placeholder=meta.placeholder;const detected=provider(urlInput.value).key;if(urlInput.value&&detected!=='external'&&detected!==key)urlInput.value=''}
    if(nameInput&&(!nameInput.value.trim()||nameInput.value===old.name||/transmisión externa/i.test(nameInput.value)))nameInput.value=meta.name;
    const portal=$('[data-portal]',m);if(portal)portal.textContent='Abrir '+meta.name;
  }
  $$('[data-platform]',m).forEach(b=>b.onclick=()=>selectPlatform(b.dataset.platform));
  $('[data-portal]',m).onclick=()=>{const p=selectedMeta();if(p.portal)window.open(p.portal,'_blank','noopener,noreferrer')};
  $('[data-test]',m).onclick=()=>{
    const url=safeLiveUrl(urlInput?.value);
    if(!url){toast('Pega primero un enlace válido https:// del LIVE.');return}
    let preview=m.querySelector('[data-v560-probe]');if(!preview){preview=document.createElement('div');preview.dataset.v560Probe='';m.querySelector('section').append(preview)}
    preview.innerHTML=streamEmbedHtml({source:{url,name:selectedMeta().name}});
  };
  $('[data-tv]' ,m).onclick=()=>{
    const url=safeLiveUrl(urlInput?.value)||safeLiveUrl(s.source.url);
    openTvCast(c,s,url);
  };
  $('[data-save]',m).onclick=()=>{
    const url=safeLiveUrl(urlInput?.value),feed=$('[data-feed]',m).value.trim();
    if(!url){toast('Falta un enlace válido del LIVE (Facebook, YouTube o TikTok).');return}
    const detected=provider(url),chosen=selectedMeta();
    s.source.name=Object.values(LIVE_PLATFORMS).some(p=>p.name===nameInput.value.trim())?detected.name:(nameInput.value.trim()||detected.name||chosen.name);
    try{const q=new URL(location.href);q.searchParams.delete('live');q.searchParams.delete('liveName');history.replaceState(history.state,'',q.href)}catch(_){}
    s.source.url=url;
    s.source.feedUrl=feed;
    try{localStorage.setItem(SOURCE_KEY,JSON.stringify({url:s.source.url,name:s.source.name}))}catch(_){}
    try{
      const u=new URL(location.href);
      u.searchParams.set('live',s.source.url);
      u.searchParams.set('liveName',s.source.name||provider(s.source.url).name);
      history.replaceState(null,'',u.toString());
    }catch(_){}
    save(s);m.remove();schedule();startPoll();toast((detected.name||chosen.name)+' vinculado. Toca reproducir para comprobar el video.');
  };
}
async function shareLive(c,s){
  const url=safeLiveUrl(s?.source?.url);
  if(!url){toast('Primero vincula un LIVE válido.');return}
  const title='Liga Juventino Rosas · LIVE';
  const text=(c?.home&&c?.away)?(c.home+' vs '+c.away+' · Match Center'):'Transmisión en vivo · Match Center';
  try{
    if(navigator.share){await navigator.share({title,text,url});return}
  }catch(e){if(e?.name==='AbortError')return}
  try{await navigator.clipboard.writeText(url);toast('Enlace del LIVE copiado.')}
  catch(_){window.open(url,'_blank','noopener,noreferrer')}
}
async function openLocal(c,s){
 const media=window.LJR_MEDIA;if(!media)return;
 const n=media.modal('Transmisiones de la Liga','<div class="cms-form" data-local-rooms><p>Consultando transmisiones activas…</p></div>'+ (canEdit()?'<button class="btn full" data-local-broadcast>Transmitir con mi cámara</button>':''));
 n.querySelector('[data-local-broadcast]')?.addEventListener('click',()=>{n.querySelector('[data-close]').click();media.broadcast({title:c.home+' vs '+c.away,onStarted:room=>{const current=load(c);current.source={...current.source,url:room.url,name:room.title};save(current);schedule()}})});
 try{const result=await media.api('rooms');if(!n.isConnected)return;const list=n.querySelector('[data-local-rooms]'),rooms=result.rooms||[];list.innerHTML=rooms.length?rooms.map((room,i)=>'<button data-local-watch="'+i+'"><i class="ljr-live-dot"></i>'+esc(room.title)+'</button>').join(''):'<p>No hay transmisiones locales activas en este momento.</p>';
 list.querySelectorAll('[data-local-watch]').forEach(b=>b.onclick=()=>{const room=rooms[Number(b.dataset.localWatch)];if(!room||!/^[a-zA-Z0-9_-]{8,100}$/.test(room.id))return;const url=media.base+'/?live='+encodeURIComponent(room.id);n.querySelector('[data-close]').click();media.modal(room.title,'<div class="v144-local-frame"><iframe src="'+esc(url)+'" title="Transmisión local" allow="autoplay; picture-in-picture; fullscreen" allowfullscreen></iframe></div>')});
 }catch(error){if(n.isConnected)n.querySelector('[data-status]').textContent=error.message||'No se pudieron consultar las transmisiones.'}
}
function bind(c,s,hub){
  $('[data-v144-local]',hub)?.addEventListener('click',e=>{stop(e);openLocal(c,s)});
  hub.querySelector('[data-v561-camera-open]')?.addEventListener('click',openPhoneCamera);
  hub.querySelectorAll('video').forEach(enableDirectStream);
  hub.querySelectorAll('.v144-stream-embed:has(iframe),.v144-stream-embed:has(video)').forEach(card=>{
    card.classList.add('v196-player-card');card.setAttribute('data-v196-player-card','');card.querySelector('.v144-stream-frame')?.classList.add('v196-frame');
    attachPlayerControls(card,{pip:()=>window.LJR_STREAM_CENTER?.openPiP?.(hub),settings:()=>playbackSettings(card),cast:()=>openTvCast(c,s),notify:toast,changeSource:canEdit()?()=>openConfig(c,load(c)):undefined});
  });
  const stop=e=>{e.preventDefault();e.stopPropagation()};
  const operator=$('[data-v144-operator]',hub),operatorToggle=$('[data-v144-operator-toggle]',hub),operatorKey='ljr-v144-operator-open:'+c.key;
  if(operator&&operatorToggle){
    let wanted=true;try{wanted=sessionStorage.getItem(operatorKey)!=='0'}catch(_){}
    operator.open=wanted;operatorToggle.setAttribute('aria-expanded',String(wanted));
    const toggleOperator=e=>{
      e.preventDefault();e.stopPropagation();
      operator.open=!operator.open;
      operatorToggle.setAttribute('aria-expanded',String(operator.open));
      try{sessionStorage.setItem(operatorKey,operator.open?'1':'0')}catch(_){}
    };
    operatorToggle.addEventListener('click',toggleOperator);
    operatorToggle.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){toggleOperator(e)}
    });
  }
  $$('[data-v144-open]',hub).forEach(b=>b.addEventListener('click',e=>{
    stop(e);
    const url=safeLiveUrl(s.source.url);
    if(url)window.open(url,'_blank','noopener,noreferrer');
    else openConfig(c,s);
  }));
  $$('[data-v144-share]',hub).forEach(b=>b.onclick=e=>{stop(e);shareLive(c,s)});
  $$('[data-v144-tv-source]',hub).forEach(b=>b.addEventListener('click',e=>{stop(e);openTvCast(c,s)}));
  $$('[data-v144-config]',hub).forEach(b=>b.addEventListener('click',e=>{stop(e);openConfig(c,s)}));
  $$('[data-v144-platform]',hub).forEach(b=>b.addEventListener('click',e=>{
    stop(e);
    openConfig(c,s,b.dataset.v144Platform);
  }));
  $('[data-v144-tv-cast]',hub)?.addEventListener('click',e=>{stop(e);openTvCast(c,s)});
  $('[data-v144-listen]',hub)?.addEventListener('click',e=>{stop(e);startSpeech(c,s)});
  $('[data-v144-alerts]',hub)?.addEventListener('click',e=>{stop(e);requestAlerts()});
  $$('[data-v144-phase]',hub).forEach(b=>b.onclick=e=>{stop(e);addEvent(s,c,b.dataset.v144Phase);schedule()});
  $$('[data-v144-event]',hub).forEach(b=>b.onclick=e=>{stop(e);const [type,side]=b.dataset.v144Event.split(':');addEvent(s,c,type,side);schedule()});
  $$('[data-v144-confirm]',hub).forEach(b=>b.onclick=e=>{stop(e);confirmSuggestion(c,s,b.dataset.v144Confirm)});
  $$('[data-v144-dismiss]',hub).forEach(b=>b.onclick=e=>{stop(e);s.suggestions=s.suggestions.filter(x=>x.id!==b.dataset.v144Dismiss);save(s);schedule()});
  $('[data-v611-music]',hub)?.addEventListener('click',()=>{if(!canEdit())return;let dialog=document.querySelector('[data-v611-audio]');if(dialog){dialog.showModal();return}dialog=document.createElement('dialog');dialog.dataset.v611Audio='';dialog.className='v561-dialog';dialog.innerHTML='<form method="dialog"><header><b>Audio del operador</b><button aria-label="Cerrar">×</button></header></form><p>Selecciona una canción o un audio de este teléfono. Se reproduce aquí; para incluirlo en el directo usa el audio de la cámara.</p><input type="file" accept="audio/*"><audio controls style="width:100%;margin-top:16px"></audio>';document.body.append(dialog);let url;dialog.querySelector('input').onchange=e=>{const file=e.target.files[0];if(!file)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(file);dialog.querySelector('audio').src=url};dialog.addEventListener('close',()=>{dialog.querySelector('audio').pause();if(url)URL.revokeObjectURL(url);dialog.remove()});dialog.showModal()});
  const current=()=>load(c);
  const textInput=$('[data-v610-text]',hub);if(textInput){textInput.value=narrationDrafts.get(c.key)||'';textInput.oninput=()=>narrationDrafts.set(c.key,textInput.value)}
  $('[data-v610-analyze]',hub)?.addEventListener('click',()=>{if(canEdit())analyze($('[data-v610-text]',hub).value,c,current())});
  $('[data-v610-speak]',hub)?.addEventListener('click',()=>{const text=$('[data-v610-text]',hub).value.trim();if(!text)return toast('Escribe el texto de la narración.');stopSpeech();if(Capacitor.isNativePlatform())return nativeSpeech.speak({text}).catch(error=>toast(error.message));if(!window.speechSynthesis)return toast('Este dispositivo no ofrece lectura de texto.');speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(text);voice.lang='es-MX';voice.voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('es'))||null;voice.onerror=()=>toast('No se pudo reproducir la narración.');speechSynthesis.speak(voice)});
  $('[data-v610-stop-audio]',hub)?.addEventListener('click',()=>{window.speechSynthesis?.cancel();if(Capacitor.isNativePlatform())nativeSpeech.stopAudio().catch(()=>{})});
  for(const [selector,key,kind]of [['[data-v610-auto-voice]','autoVoice','check'],['[data-v610-auto-clock]','autoClock','check'],['[data-v610-start]','kickoffLocal','text'],['[data-v610-period]','periodMinutes','number'],['[data-v610-break]','breakMinutes','number']])$(selector,hub)?.addEventListener('change',e=>{if(!canEdit())return;const st=current();st[key]=kind==='check'?e.target.checked:kind==='number'?Math.min(key==='periodMinutes'?60:30,Math.max(1,Number(e.target.value)||1)):e.target.value;if(key==='kickoffLocal')st.kickoffAt=new Date(st.kickoffLocal).getTime();save(st);schedule()});
  $('[data-v610-publish]',hub)?.addEventListener('click',()=>{if(canEdit())save(current())});
  $('[data-v610-broadcast]',hub)?.addEventListener('click',()=>window.LJR_MEDIA?.broadcast());
  $('[data-v610-note]',hub)?.addEventListener('click',()=>{if(!canEdit())return;const note=prompt('Incidencia, lesión, penal o tiempo añadido:');if(note?.trim()){addEvent(current(),c,'note','',note.trim());schedule()}});
  $('[data-v610-correction]',hub)?.addEventListener('click',()=>{if(!canEdit())return;const st=current(),score=counters(st),input=prompt('Marcador corregido (local-visitante):',score.home.goals+'-'+score.away.goals),m=input?.match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);if(!m)return;st.events.push({id:'correction-'+now(),type:'score-correction',home:Number(m[1]),away:Number(m[2]),ts:now(),minute:eventMinute(st),confirmed:true,note:'Corrección del marcador'});save(st);schedule()});
  $('[data-v144-undo]',hub)?.addEventListener('click',e=>{stop(e);if(!s.events.length)return;s.events.pop();rebuildPhase(s);save(s);schedule()});
}
function patch(c,s){
  const x=counters(s),center=$('.v92-score-card .v92-center',c.root)||$('.v420-matchup > span',c.root);
  if(center&&(s.phase!=='scheduled'||confirmed(s).length)){
    const strong=$('strong',center);if(strong)strong.textContent=x.home.goals+'–'+x.away.goals;
    const sm=$('small',center);if(sm){sm.textContent=phaseLabel(s);sm.classList.add('v144-live-label')}
    const k=$('.v92-kicker',c.root);if(k)k.textContent=s.phase==='final'?'PARTIDO FINALIZADO · MATCH CENTER':'EN VIVO · MATCH CENTER';
  }
  const tl=$('.v92-timeline',c.root);if(!tl)return;
  $$('.v144-injected',tl).forEach(n=>n.remove());
  for(const e of confirmed(s).slice().sort((a,b)=>a.ts-b.ts)){
    const d=document.createElement('div');d.className='v144-injected';
    d.innerHTML='<b>'+esc(e.minute||'—')+'</b><span>'+esc(eventText(e,c))+' <small class="v144-tag">LIVE</small></span>';tl.prepend(d);
  }
}
async function poll(c,s){
  if(!s.source.feedUrl)return;
  try{
    const r=await fetch(s.source.feedUrl,{cache:'no-store'});if(!r.ok)throw 0;const j=await r.json();
    const previousPhase=s.phase;
    if(j.phase&&['scheduled','first','halftime','second','final'].includes(j.phase))s.phase=j.phase;
    if(j.firstStartedAt)s.firstStartedAt=Number(j.firstStartedAt)||s.firstStartedAt;
    if(j.secondStartedAt)s.secondStartedAt=Number(j.secondStartedAt)||s.secondStartedAt;
    const known=new Set(s.events.map(e=>String(e.externalId||e.id))),newFeedEvents=[];
    for(const z of Array.isArray(j.events)?j.events:[]){
      const id=String(z.id||'');if(id&&known.has(id))continue;
      const e={id:'feed-'+(id||now()),externalId:id,type:z.type||'note',side:z.side||'',player:z.player||'',note:z.note||'',source:'feed',confirmed:true,minute:z.minute||eventMinute(s),ts:Number(z.ts)||now()};
      s.events.push(e);newFeedEvents.push(e);
    }
    s.source.connected=true;s.source.lastSync=now();save(s);
    for(const e of newFeedEvents)if(e.type==='goal')matchAlert(c,s,'goal',e.side,e.id);
    if(s.phase!==previousPhase&&['halftime','second','final'].includes(s.phase))matchAlert(c,s,'phase-'+s.phase,'','feed-phase-'+s.phase+'-'+now());
    schedule();
  }catch(_){s.source.connected=false;save(s,false)}
}
function startPoll(){
  clearInterval(pollTimer);pollTimer=0;
  const c=ctx();if(!c)return;const s=load(c),u=String(s.source.feedUrl||'').trim();if(!u)return;
  /* V145 maneja feeds persistentes como WebSocket/SSE. */
  if(/^wss?:\/\//i.test(u)||/^sse\+/i.test(u)||/[?&]transport=sse(?:&|$)/i.test(u))return;
  poll(c,s);
  /* Las apps deportivas refrescan el feed con baja latencia; para HTTP usamos 5 s. */
  pollTimer=setInterval(()=>{const cc=ctx();if(cc)poll(cc,load(cc))},5000);
}
function renderSig(c,s){
  const x=counters(s);
  return [
    c.key,phaseLabel(s),listening?'1':'0',
    x.home.goals,x.away.goals,x.home.subs,x.away.subs,x.home.yellow,x.away.yellow,x.home.red,x.away.red,
    s.source.url||'',s.source.name||'',s.source.feedUrl||'',s.lastTranscript||'',canEdit(),s.autoClock,s.autoVoice,s.periodMinutes,s.breakMinutes,s.kickoffLocal,
    s.events.map(e=>e.id).join(','),s.suggestions.map(e=>e.id).join(',')
  ].join('|');
}
function mount(){
  if(!ROUTES.has(route())){stopSpeech();return}
  const c=ctx();if(!c)return;const s=load(c),sig=renderSig(c,s);
  let old=$('[data-v144-live-hub]',c.root);
  if(old&&old.dataset.v144Match!==c.key){old.remove();old=null}
  /* Evita un bucle con MutationObserver: si nada cambió, no reemplaza DOM. */
  if(old&&old.dataset.sig===sig)return;
  const w=document.createElement('div');w.innerHTML=hubHtml(c,s);const hub=w.firstElementChild;
  hub.dataset.sig=sig;hub.dataset.source=s.source.url||'';
  if(old&&old.dataset.source===hub.dataset.source&&patchKeepingPlayer(old,hub,':scope > .v144-stream-embed')){bind(c,s,old);patch(c,s);return}
  if(old)old.replaceWith(hub);else{
    const meta=$('.v92-official-meta',c.root);if(meta)meta.insertAdjacentElement('afterend',hub);else c.root.appendChild(hub);
  }
  bind(c,s,hub);patch(c,s);startPoll();
}
function schedule(){clearTimeout(mountTimer);mountTimer=setTimeout(mount,60)}
function toast(msg){const n=document.createElement('div');n.className='v144-toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),2400)}

document.addEventListener('change',e=>{if(e.target.matches?.('[data-v92-match-select]'))setTimeout(schedule,100)},true);
window.addEventListener('hashchange',schedule);
window.addEventListener('storage',e=>{if(e.key?.startsWith(KEY))schedule()});
bc?.addEventListener('message',e=>{if(e.data?.type==='state'){try{localStorage.setItem(KEY+e.data.key,JSON.stringify(e.data.state))}catch(_){}schedule()}});
const screen=$('#screen');
if(screen)new MutationObserver(()=>{if(ROUTES.has(route()))schedule()}).observe(screen,{childList:true,subtree:true});
clockTimer=setInterval(()=>{if(ROUTES.has(route())){const c=ctx();if(c)clockAutomation(c,load(c));schedule()}},1000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();

window.LJR_MATCH_LIVE={
  openCast(){const c=ctx();if(c)openTvCast(c,load(c))},
  analyze(text){const c=ctx();if(c&&canEdit())analyze(text,c,load(c))},
  publishState(){const c=ctx();if(c&&canEdit())save(load(c))},
  getState(){const c=ctx();return c?load(c):null},
  addEvent(type,side,note){const c=ctx();if(!c)return null;const s=load(c),e=addEvent(s,c,type,side||'',note||'','external');schedule();return e},
  requestAlerts,
  notify(type,side,eventId){const c=ctx();if(!c)return;const s=load(c);matchAlert(c,s,type,side||'',eventId||'external-'+now())}
};
})();

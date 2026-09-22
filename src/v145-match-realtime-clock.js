/* V145 — Tiempo real del Match Center.
   Capas:
   1) reloj del partido a 1 s (1T / MT / 2T / Final),
   2) minuto exacto asociado a goles/eventos,
   3) fuentes modernas: HTTP JSON, WebSocket y SSE,
   4) apoyo visual para transmisiones vinculadas (Facebook/YouTube/Talacha/otro).
   No afirma que una transmisión esté "en vivo" sólo por tener un enlace:
   únicamente marca feed conectado cuando realmente recibe datos. */
(function(){
'use strict';
if(window.__LJR_V145_REALTIME_CLOCK__)return;
window.__LJR_V145_REALTIME_CLOCK__=true;

const ROUTES=new Set(['v4-matchcenter','matchCenter','match-center']);
const KEY='ljr-match-live-v144:';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const now=()=>Date.now();

let conn=null;
let connUrl='';
let connKind='';
let reconnectTimer=0;
let httpTimer=0;
let tickTimer=0;
let mountTimer=0;
let shownGoalId='';

function ctx(){
  const root=$('[data-v92-matchcenter]');if(!root)return null;
  const sel=$('[data-v92-match-select]',root),sides=$$('.v92-score-card .v92-side b',root);
  if(!sel||sides.length<2)return null;
  return {
    root,
    key:String(sel.value||'match'),
    home:(sides[0].textContent||'Local').trim(),
    away:(sides[1].textContent||'Visitante').trim()
  };
}
function load(c){
  try{
    const s=JSON.parse(localStorage.getItem(KEY+c.key)||'null');
    if(s&&s.v===144){
      s.events=Array.isArray(s.events)?s.events:[];
      s.source=Object.assign({url:'',name:'',feedUrl:'',connected:false,lastSync:0,transport:''},s.source||{});
      return s;
    }
  }catch(_){}
  return null;
}
function save(s){
  s.updatedAt=now();
  try{localStorage.setItem(KEY+s.key,JSON.stringify(s))}catch(_){}
  window.dispatchEvent(new CustomEvent('ljr:match-live-feed',{detail:{key:s.key}}));
}
function freshFeed(s){
  return !!(s?.source?.connected&&s.source.lastSync&&now()-Number(s.source.lastSync)<30000);
}
function feedMinute(s){
  if(!freshFeed(s))return '';
  const m=s.feedMinute;
  if(m===0||m)return String(m).replace(/['′]/g,'');
  return '';
}
function localMinute(s){
  const t=now();
  if(s.phase==='first'&&s.firstStartedAt){
    const m=Math.max(1,Math.floor((t-Number(s.firstStartedAt))/60000)+1);
    return m<=45?String(m):'45+'+(m-45);
  }
  if(s.phase==='second'&&s.secondStartedAt){
    const m=46+Math.max(0,Math.floor((t-Number(s.secondStartedAt))/60000));
    return m<=90?String(m):'90+'+(m-90);
  }
  return '';
}
function minute(s){return feedMinute(s)||localMinute(s)}
function phaseShort(s){
  const fp=norm(s.feedPeriod||'');
  if(freshFeed(s)&&fp){
    if(/half|descanso|mt|ht/.test(fp))return 'MT';
    if(/final|ft/.test(fp))return 'FINAL';
    if(/second|2t|2nd/.test(fp))return '2T';
    if(/first|1t|1st/.test(fp))return '1T';
  }
  if(s.phase==='first')return '1T';
  if(s.phase==='halftime')return 'MT';
  if(s.phase==='second')return '2T';
  if(s.phase==='final')return 'FINAL';
  return 'PRE';
}
function clockText(s){
  const p=phaseShort(s),m=minute(s);
  if(p==='MT')return 'MEDIO TIEMPO';
  if(p==='FINAL')return 'FINAL';
  if((p==='1T'||p==='2T')&&m)return m+'′';
  return '—';
}
function confirmed(s){return (s.events||[]).filter(e=>e.confirmed!==false)}
function score(s){
  let h=0,a=0;
  for(const e of confirmed(s)){
    if(e.type==='goal'&&e.side==='home')h++;
    if(e.type==='goal'&&e.side==='away')a++;
  }
  if(freshFeed(s)&&s.feedScore&&Number.isFinite(Number(s.feedScore.home))&&Number.isFinite(Number(s.feedScore.away))){
    h=Number(s.feedScore.home);a=Number(s.feedScore.away);
  }
  return {home:h,away:a};
}
function latestGoal(s){
  return confirmed(s).filter(e=>e.type==='goal').sort((a,b)=>Number(b.ts||0)-Number(a.ts||0))[0]||null;
}
function statusText(s){
  const u=String(s.source?.feedUrl||'').trim();
  if(freshFeed(s)){
    const t=String(s.source.transport||'').toUpperCase();
    return (t||'FEED')+' CONECTADO';
  }
  if(u)return 'CONECTANDO FEED';
  if(s.source?.url)return 'TRANSMISIÓN VINCULADA';
  return 'SIN FUENTE';
}
function sourceText(s){
  if(freshFeed(s))return 'Datos recibidos hace '+Math.max(0,Math.floor((now()-Number(s.source.lastSync))/1000))+' s';
  if(s.source?.url)return 'Apoyo desde '+(s.source.name||'transmisión externa');
  return 'Vincula Facebook, YouTube, Talacha u otra transmisión';
}

function cardHtml(c,s){
  const sc=score(s),p=phaseShort(s);
  return '<section class="v145-realtime" data-v145-realtime>'+
    '<div class="v145-clock-main">'+
      '<span><small>TIEMPO REAL</small><b data-v145-clock>'+esc(clockText(s))+'</b></span>'+
      '<em data-v145-period>'+esc(p)+'</em>'+
      '<strong data-v145-score>'+sc.home+'–'+sc.away+'</strong>'+
    '</div>'+
    '<div class="v145-status"><i class="'+(freshFeed(s)?'on':'')+'"></i><span><b data-v145-status>'+esc(statusText(s))+'</b><small data-v145-source>'+esc(sourceText(s))+'</small></span></div>'+
    '<div class="v145-tech"><span>WebSocket</span><span>SSE</span><span>JSON Live Feed</span><span>Audio IA</span></div>'+
  '</section>';
}
function mountCard(c,s){
  const hub=$('[data-v144-live-hub]',c.root);if(!hub)return;
  let card=$('[data-v145-realtime]',hub);
  if(!card){
    const w=document.createElement('div');w.innerHTML=cardHtml(c,s);card=w.firstElementChild;
    const head=$('.v144-head',hub);
    if(head)head.insertAdjacentElement('afterend',card);else hub.prepend(card);
  }
}
function patchUi(){
  if(!ROUTES.has(route()))return;
  const c=ctx();if(!c)return;
  const s=load(c);if(!s)return;
  mountCard(c,s);

  const sc=score(s),clock=clockText(s),period=phaseShort(s);
  const card=$('[data-v145-realtime]',c.root);
  if(card){
    const a=$('[data-v145-clock]',card),b=$('[data-v145-period]',card),d=$('[data-v145-score]',card),st=$('[data-v145-status]',card),src=$('[data-v145-source]',card);
    if(a)a.textContent=clock;if(b)b.textContent=period;if(d)d.textContent=sc.home+'–'+sc.away;
    if(st)st.textContent=statusText(s);if(src)src.textContent=sourceText(s);
    const dot=$('.v145-status i',card);dot?.classList.toggle('on',freshFeed(s));
  }

  const center=$('.v92-score-card .v92-center',c.root);
  if(center&&(s.phase!=='scheduled'||confirmed(s).length||freshFeed(s))){
    const strong=$('strong',center),small=$('small',center);
    if(strong)strong.textContent=sc.home+'–'+sc.away;
    if(small){
      small.textContent=period==='MT'?'MEDIO TIEMPO':period==='FINAL'?'FINAL':clock!=='—'?(clock+' · '+period):period;
      small.classList.add('v144-live-label');
    }
  }
  const head=$('.v144-head span b',c.root);if(head)head.textContent=period==='MT'?'MEDIO TIEMPO':period==='FINAL'?'FINAL':clock!=='—'?(clock+' · '+period):'PROGRAMADO';

  const goal=latestGoal(s);
  if(goal&&goal.id!==shownGoalId&&now()-Number(goal.ts||0)<12000){
    shownGoalId=goal.id;
    showGoal(c,goal);
  }
}
function showGoal(c,e){
  $('.v145-goal-flash')?.remove();
  const team=e.side==='home'?c.home:e.side==='away'?c.away:'';
  const n=document.createElement('div');n.className='v145-goal-flash';
  n.innerHTML='<small>GOL</small><b>'+esc(e.minute||'—')+'</b><span>'+esc(team)+(e.player?' · '+esc(e.player):'')+'</span>';
  document.body.appendChild(n);
  setTimeout(()=>n.remove(),6500);
}

function mapPhase(v){
  const x=norm(v);
  if(!x)return '';
  if(/final|ft|finished|full time/.test(x))return 'final';
  if(/half|descanso|mt|ht/.test(x))return 'halftime';
  if(/second|2t|2nd/.test(x))return 'second';
  if(/first|1t|1st|live/.test(x))return 'first';
  if(/scheduled|pre/.test(x))return 'scheduled';
  return '';
}
function ingest(payload){
  const c=ctx();if(!c)return;
  const s=load(c);if(!s)return;
  let j=payload?.data&&typeof payload.data==='object'?payload.data:payload;
  if(!j||typeof j!=='object')return;
  if(j.matchKey&&String(j.matchKey)!==c.key)return;

  const ph=mapPhase(j.phase||j.period||j.status);
  if(ph)s.phase=ph;
  const rawMinute=j.minute??j.clock?.minute??j.match?.minute;
  if(rawMinute!==undefined&&rawMinute!==null&&String(rawMinute)!=='')s.feedMinute=String(rawMinute).replace(/['′]/g,'');
  s.feedPeriod=String(j.period||j.phase||j.status||s.feedPeriod||'');

  const hs=j.score?.home??j.homeScore??j.home_score;
  const as=j.score?.away??j.awayScore??j.away_score;
  if(Number.isFinite(Number(hs))&&Number.isFinite(Number(as)))s.feedScore={home:Number(hs),away:Number(as)};

  const known=new Set((s.events||[]).map(e=>String(e.externalId||e.id)));
  const events=Array.isArray(j.events)?j.events:(j.event?[j.event]:[]);
  for(const z of events){
    const id=String(z.id||z.eventId||'');
    if(id&&known.has(id))continue;
    const typeMap={goal:'goal',gol:'goal',substitution:'sub',sub:'sub',change:'sub',yellow:'yellow',yellowcard:'yellow',red:'red',redcard:'red'};
    const type=typeMap[norm(z.type).replace(/ /g,'')]||norm(z.type)||'note';
    let side=norm(z.side||z.teamSide||'');
    if(side==='local'||side==='home')side='home';else if(side==='visitante'||side==='away')side='away';else side='';
    s.events.push({
      id:'feed-'+(id||now()+Math.random().toString(36).slice(2,5)),
      externalId:id,
      type,
      side,
      player:z.player||z.playerName||'',
      note:z.note||z.text||'',
      source:'feed',
      confirmed:true,
      minute:String(z.minute??s.feedMinute??'—').replace(/['′]/g,'')+(z.minute!==undefined?'′':''),
      ts:Number(z.ts||z.timestamp)||now()
    });
  }

  s.source.connected=true;
  s.source.lastSync=now();
  save(s);
  patchUi();
}
function markDisconnected(kind){
  const c=ctx();if(!c)return;const s=load(c);if(!s)return;
  s.source.connected=false;s.source.transport=kind||s.source.transport||'';
  save(s);patchUi();
}
function parseAndIngest(raw){
  try{ingest(typeof raw==='string'?JSON.parse(raw):raw)}catch(_){}
}
function closeConn(){
  clearTimeout(reconnectTimer);reconnectTimer=0;
  clearInterval(httpTimer);httpTimer=0;
  try{conn?.close?.()}catch(_){}
  conn=null;connUrl='';connKind='';
}
function connectFeed(){
  if(!ROUTES.has(route())){closeConn();return}
  const c=ctx();if(!c)return;
  const s=load(c);if(!s)return;
  const u=String(s.source?.feedUrl||'').trim();
  if(!u){closeConn();return}
  if(u===connUrl&&conn)return;
  closeConn();
  connUrl=u;

  if(/^wss?:\/\//i.test(u)){
    connKind='websocket';s.source.transport='websocket';save(s);
    try{
      const ws=new WebSocket(u);conn=ws;
      ws.onopen=()=>{const cc=ctx(),ss=cc&&load(cc);if(ss){ss.source.connected=true;ss.source.lastSync=now();ss.source.transport='websocket';save(ss);patchUi()}};
      ws.onmessage=e=>parseAndIngest(e.data);
      ws.onerror=()=>markDisconnected('websocket');
      ws.onclose=()=>{markDisconnected('websocket');conn=null;reconnectTimer=setTimeout(connectFeed,5000)};
    }catch(_){markDisconnected('websocket')}
    return;
  }

  if(/^sse\+/i.test(u)||/[?&]transport=sse(?:&|$)/i.test(u)){
    const real=u.replace(/^sse\+/i,'');connKind='sse';s.source.transport='sse';save(s);
    try{
      const es=new EventSource(real);conn=es;
      es.onopen=()=>{const cc=ctx(),ss=cc&&load(cc);if(ss){ss.source.connected=true;ss.source.lastSync=now();ss.source.transport='sse';save(ss);patchUi()}};
      es.onmessage=e=>parseAndIngest(e.data);
      es.onerror=()=>markDisconnected('sse');
    }catch(_){markDisconnected('sse')}
    return;
  }

  connKind='http';s.source.transport='http';save(s);
  const poll=async()=>{
    const cc=ctx();if(!cc)return;const ss=load(cc);if(!ss)return;
    try{
      const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw 0;
      ingest(await r.json());
    }catch(_){markDisconnected('http')}
  };
  poll();httpTimer=setInterval(poll,5000);conn={close(){clearInterval(httpTimer);httpTimer=0}};
}

function schedule(){
  clearTimeout(mountTimer);
  mountTimer=setTimeout(()=>{patchUi();connectFeed()},70);
}
window.addEventListener('hashchange',schedule);
window.addEventListener('storage',e=>{if(e.key?.startsWith(KEY))schedule()});
window.addEventListener('ljr:match-live-feed',schedule);
document.addEventListener('change',e=>{if(e.target.matches?.('[data-v92-match-select]'))setTimeout(schedule,100)},true);

const screen=$('#screen');
if(screen)new MutationObserver(()=>{if(ROUTES.has(route()))schedule()}).observe(screen,{childList:true,subtree:true});

tickTimer=setInterval(()=>{if(ROUTES.has(route()))patchUi()},1000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();

window.LJR_MATCH_REALTIME={
  ingest,
  reconnect:connectFeed,
  getClock(){
    const c=ctx(),s=c&&load(c);
    return s?{minute:minute(s),phase:phaseShort(s),clock:clockText(s),score:score(s),connected:freshFeed(s)}:null;
  }
};
})();
/* V144 — Match Center Live Intelligence.
   Facebook/YouTube/Talacha link + live clock + smart narration detection.
   Speech detections are suggestions until an operator confirms them. */
(function(){
'use strict';
if(window.__LJR_V144_LIVE__)return;
window.__LJR_V144_LIVE__=true;

const ROUTES=new Set(['v4-matchcenter','matchCenter','match-center']);
const DEFAULT_SOURCE='https://www.facebook.com/share/1CBUKPcTCm/';
const KEY='ljr-match-live-v144:';
const SOURCE_KEY='ljr-live-source-v144';
const bc=('BroadcastChannel' in window)?new BroadcastChannel('ljr-match-live-v144'):null;
let speech=null,listening=false,mountTimer=0,pollTimer=0,clockTimer=0;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const now=()=>Date.now();

function ctx(){
  const root=$('[data-v92-matchcenter]');if(!root)return null;
  const sel=$('[data-v92-match-select]',root),sides=$$('.v92-score-card .v92-side b',root);
  if(!sel||sides.length<2)return null;
  const key=String(sel.value||'match'),catId=key.split(':')[0]||'';
  return {root,key,catId,home:(sides[0].textContent||'Local').trim(),away:(sides[1].textContent||'Visitante').trim(),category:window.LJR_OFFICIAL_DATA?.categories?.[catId]?.name||''};
}
function urlLiveSource(){
  try{
    const q=new URLSearchParams(location.search),url=q.get('live')||'',name=q.get('liveName')||'';
    return url?{url,name:name||provider(url).name}:null;
  }catch(_){return null}
}
function freshState(c){
  let global={url:DEFAULT_SOURCE,name:'Facebook / transmisión externa'};
  try{global=JSON.parse(localStorage.getItem(SOURCE_KEY)||'null')||global}catch(_){}
  const shared=urlLiveSource();if(shared)global=shared;
  return {v:144,key:c.key,home:c.home,away:c.away,source:{url:global.url||'',name:global.name||'',feedUrl:'',connected:false,lastSync:0},phase:'scheduled',firstStartedAt:0,secondStartedAt:0,finishedAt:0,events:[],suggestions:[],lastTranscript:'',updatedAt:now()};
}
function load(c){
  try{
    const s=JSON.parse(localStorage.getItem(KEY+c.key)||'null');
    if(s&&s.v===144){
      s.home=c.home;s.away=c.away;
      s.source=Object.assign({url:'',name:'',feedUrl:'',connected:false,lastSync:0},s.source||{});
      const shared=urlLiveSource();
      if(shared){s.source.url=shared.url;s.source.name=shared.name}
      s.events=Array.isArray(s.events)?s.events:[];
      s.suggestions=Array.isArray(s.suggestions)?s.suggestions:[];
      return s;
    }
  }catch(_){}
  return freshState(c);
}
function save(s,broadcast=true){
  s.updatedAt=now();
  try{localStorage.setItem(KEY+s.key,JSON.stringify(s))}catch(_){}
  if(broadcast)try{bc?.postMessage({type:'state',key:s.key,state:s})}catch(_){}
}
function provider(url){
  const u=String(url||'').toLowerCase();
  if(u.includes('facebook.com')||u.includes('fb.watch'))return {name:'Facebook Live',icon:'f'};
  if(u.includes('youtube.com')||u.includes('youtu.be'))return {name:'YouTube Live',icon:'▶'};
  if(u.includes('tiktok.com'))return {name:'TikTok Live',icon:'♪'};
  return {name:'Transmisión externa',icon:'●'};
}
function youtubeId(url){
  const s=String(url||'');
  let m=s.match(/[?&]v=([^&#]+)/i);if(m)return m[1];
  m=s.match(/youtu\.be\/([^?&#/]+)/i);if(m)return m[1];
  m=s.match(/youtube\.com\/(?:live|embed)\/([^?&#/]+)/i);if(m)return m[1];
  return '';
}
function streamEmbedHtml(s){
  const url=String(s?.source?.url||'').trim();
  if(!url)return '';
  const p=provider(url);
  if(p.name==='Facebook Live'){
    const src='https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(url)+'&show_text=false&width=500&autoplay=true';
    return '<section class="v144-stream-embed"><header><span><small>TRANSMISIÓN EN VIVO</small><b>'+esc(s.source.name||p.name)+'</b></span><i>SIMULTÁNEO</i></header><div class="v144-stream-frame"><iframe src="'+esc(src)+'" title="Facebook Live" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe></div><footer><span>Si Facebook bloquea la vista incrustada, abre la transmisión directamente.</span><div><button type="button" data-v144-open>Facebook</button><button type="button" data-v144-share>Compartir Live</button></div></footer></section>';
  }
  if(p.name==='YouTube Live'){
    const id=youtubeId(url);
    if(id){
      const src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=1&mute=1&playsinline=1';
      return '<section class="v144-stream-embed"><header><span><small>TRANSMISIÓN EN VIVO</small><b>'+esc(s.source.name||p.name)+'</b></span><i>SIMULTÁNEO</i></header><div class="v144-stream-frame"><iframe src="'+esc(src)+'" title="YouTube Live" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div><footer><span>Video y Match Center visibles al mismo tiempo.</span><div><button type="button" data-v144-open>YouTube</button><button type="button" data-v144-share>Compartir Live</button></div></footer></section>';
    }
  }
  return '<section class="v144-stream-embed fallback"><header><span><small>TRANSMISIÓN VINCULADA</small><b>'+esc(s.source.name||p.name)+'</b></span><i>LIVE</i></header><div class="v144-stream-fallback"><b>Transmisión externa</b><span>Este proveedor no admite reproductor incrustado aquí.</span><div><button type="button" data-v144-open>Abrir transmisión</button><button type="button" data-v144-share>Compartir Live</button></div></div></section>';
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
    if(!x[e.side])continue;
    if(e.type==='goal')x[e.side].goals++;
    if(e.type==='sub')x[e.side].subs++;
    if(e.type==='yellow')x[e.side].yellow++;
    if(e.type==='red')x[e.side].red++;
  }
  return x;
}
function addEvent(s,c,type,side='',note='',source='operator',player=''){
  const e={id:'e'+now()+Math.random().toString(36).slice(2,6),type,side,player,note,source,confirmed:true,minute:eventMinute(s),ts:now()};
  if(type==='phase-first'){s.phase='first';s.firstStartedAt=now();e.minute='1′'}
  if(type==='phase-halftime'){s.phase='halftime';e.minute='MT'}
  if(type==='phase-second'){s.phase='second';s.secondStartedAt=now();e.minute='46′'}
  if(type==='phase-final'){s.phase='final';s.finishedAt=now();e.minute='Final'}
  s.events.push(e);save(s);return e;
}
function addSuggestion(s,o){
  o.id='s'+now()+Math.random().toString(36).slice(2,6);o.ts=now();o.minute=eventMinute(s);
  const sig=o.type+'|'+(o.side||'')+'|'+norm(o.text||'');
  if(s.suggestions.some(x=>x.sig===sig&&now()-x.ts<90000))return;
  o.sig=sig;s.suggestions.unshift(o);s.suggestions=s.suggestions.slice(0,8);save(s);
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
  save(s,false);if(o)addSuggestion(s,o);schedule();
}
function startSpeech(c,s){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('Tu navegador no tiene reconocimiento de voz compatible.');return}
  if(listening){stopSpeech();return}
  try{
    speech=new SR();speech.lang='es-MX';speech.continuous=true;speech.interimResults=false;speech.maxAlternatives=1;
    speech.onstart=()=>{listening=true;schedule()};
    speech.onend=()=>{listening=false;schedule()};
    speech.onerror=e=>{listening=false;toast(e.error==='not-allowed'?'Permite el micrófono para detectar la narración.':'La escucha se detuvo.');schedule()};
    speech.onresult=e=>{
      for(let i=e.resultIndex;i<e.results.length;i++){
        if(!e.results[i].isFinal)continue;
        const cc=ctx();if(!cc||cc.key!==c.key)continue;
        analyze(e.results[i][0]?.transcript||'',cc,load(cc));
      }
    };
    speech.start();
  }catch(_){toast('No se pudo iniciar el micrófono.')}
}
function stopSpeech(){try{speech?.stop()}catch(_){}speech=null;listening=false}
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
  return e.note||'Evento';
}
function suggestionsHtml(s,c){
  return s.suggestions.slice(0,3).map(x=>{
    const team=x.side==='home'?c.home:x.side==='away'?c.away:'Equipo por confirmar';
    return '<article class="v144-suggestion"><div><small>DETECCIÓN IA · '+Math.round((x.confidence||0)*100)+'%</small><b>'+esc(x.label)+' · '+esc(team)+'</b><p>'+esc(x.text||'')+'</p></div><div><button data-v144-confirm="'+esc(x.id)+'">Confirmar</button><button class="ghost" data-v144-dismiss="'+esc(x.id)+'">Descartar</button></div></article>';
  }).join('');
}
function timelineHtml(s,c){
  const list=confirmed(s).slice().sort((a,b)=>b.ts-a.ts);
  return list.length?list.map(e=>'<div class="v144-live-event"><b>'+esc(e.minute||'—')+'</b><span>'+esc(eventText(e,c))+'<small>'+(e.source==='voice'?'Narración detectada y confirmada':'Operador Match Center')+'</small></span></div>').join(''):'<p class="v144-empty">Todavía no hay eventos confirmados.</p>';
}
function hubHtml(c,s){
  const p=provider(s.source.url),x=counters(s),live=s.phase==='first'||s.phase==='second';
  return '<section class="v144-live-hub" data-v144-live-hub data-match="'+esc(c.key)+'">'+
    '<div class="v144-head"><i class="'+(live?'on':'')+'"></i><span><small>LIVE INTELLIGENCE</small><b>'+esc(phaseLabel(s))+'</b></span><strong>'+x.home.goals+'–'+x.away.goals+'</strong></div>'+
    '<div class="v144-source"><em>'+esc(p.icon)+'</em><span><b>'+esc(s.source.name||p.name)+'</b><small>'+esc(p.name)+'</small></span><button data-v144-config>Subir / vincular LIVE</button></div>'+
    streamEmbedHtml(s)+
    '<div class="v144-stats"><div><small>'+esc(c.home)+'</small><b>'+x.home.goals+'</b><span>'+x.home.subs+' cambios · '+x.home.yellow+' 🟨 · '+x.home.red+' 🟥</span></div><div><small>'+esc(c.away)+'</small><b>'+x.away.goals+'</b><span>'+x.away.subs+' cambios · '+x.away.yellow+' 🟨 · '+x.away.red+' 🟥</span></div></div>'+
    '<div class="v144-ai"><button class="'+(listening?'active':'')+'" data-v144-listen>'+(listening?'■ Detener escucha':'🎙 Detectar narración')+'</button><button data-v144-config>Fuente / IA</button><small>Detecta gol, cambio, tarjetas, medio tiempo y final. Pide confirmación antes de modificar el partido.</small></div>'+
    (s.lastTranscript?'<div class="v144-transcript"><small>ÚLTIMO AUDIO</small><span>'+esc(s.lastTranscript)+'</span></div>':'')+
    (s.suggestions.length?'<div class="v144-suggestions"><h3>Eventos por confirmar</h3>'+suggestionsHtml(s,c)+'</div>':'')+
    '<details class="v144-operator"><summary>Operador del partido</summary><div class="v144-phases"><button data-v144-phase="phase-first">Iniciar 1T</button><button data-v144-phase="phase-halftime">Medio tiempo</button><button data-v144-phase="phase-second">Iniciar 2T</button><button data-v144-phase="phase-final">Final</button></div><div class="v144-events"><button data-v144-event="goal:home">⚽ Gol '+esc(c.home)+'</button><button data-v144-event="goal:away">⚽ Gol '+esc(c.away)+'</button><button data-v144-event="sub:home">↔ Cambio '+esc(c.home)+'</button><button data-v144-event="sub:away">↔ Cambio '+esc(c.away)+'</button><button data-v144-event="yellow:home">🟨 '+esc(c.home)+'</button><button data-v144-event="yellow:away">🟨 '+esc(c.away)+'</button><button data-v144-event="red:home">🟥 '+esc(c.home)+'</button><button data-v144-event="red:away">🟥 '+esc(c.away)+'</button></div><button class="v144-undo" data-v144-undo>↶ Deshacer último evento</button></details>'+
    '<div class="v144-timeline"><header><b>Cronología en vivo</b><small>Confirmada en Match Center</small></header>'+timelineHtml(s,c)+'</div>'+
  '</section>';
}
function modalHtml(s){
  return '<div class="v144-modal"><button class="v144-backdrop" data-close></button><section><header><b>Publicar transmisión en vivo</b><button data-close>×</button></header><label><span>Nombre del medio / página</span><input data-name value="'+esc(s.source.name||'Facebook / transmisión externa')+'" placeholder="Talacha Deportes"></label><label><span>Enlace del Facebook Live / YouTube Live</span><input data-url value="'+esc(s.source.url||DEFAULT_SOURCE)+'" placeholder="Pega aquí el enlace de la transmisión"></label><label><span>Feed en tiempo real (JSON / WebSocket / SSE)</span><input data-feed value="'+esc(s.source.feedUrl||'')+'" placeholder="https://.../live.json o wss://..."></label><p>Al guardar, la transmisión se muestra dentro del Match Center para ver el video y el minuto, marcador y cronología simultáneamente. Facebook puede impedir algunos enlaces compartidos; en ese caso queda el botón para abrir el Live directamente. El feed de datos es opcional y sirve para sincronizar minuto, goles y eventos.</p><button class="v144-save" data-save>Publicar transmisión en Match Center</button></section></div>';
}
function openConfig(c,s){
  $$('.v144-modal').forEach(x=>x.remove());
  const w=document.createElement('div');w.innerHTML=modalHtml(s);const m=w.firstElementChild;document.body.appendChild(m);
  $$('[data-close]',m).forEach(b=>b.onclick=()=>m.remove());
  $('[data-save]',m).onclick=()=>{
    s.source.name=$('[data-name]',m).value.trim();s.source.url=$('[data-url]',m).value.trim();s.source.feedUrl=$('[data-feed]',m).value.trim();
    try{localStorage.setItem(SOURCE_KEY,JSON.stringify({url:s.source.url,name:s.source.name}))}catch(_){}
    try{
      const u=new URL(location.href);
      if(s.source.url){u.searchParams.set('live',s.source.url);u.searchParams.set('liveName',s.source.name||provider(s.source.url).name)}
      else{u.searchParams.delete('live');u.searchParams.delete('liveName')}
      history.replaceState(null,'',u.toString());
    }catch(_){}
    save(s);m.remove();schedule();startPoll();toast('Transmisión publicada en este Match Center. Usa Compartir Live para abrirla en otros teléfonos.');
  };
}
function confirmSuggestion(c,s,id){
  const q=s.suggestions.find(x=>x.id===id);if(!q)return;
  let side=q.side||'';
  if(['goal','sub','yellow','red'].includes(q.type)&&!side)side=prompt('¿De qué equipo fue? 1 = '+c.home+' / 2 = '+c.away)==='2'?'away':'home';
  addEvent(s,c,q.type,side,q.text,'voice',q.player||'');
  s.suggestions=s.suggestions.filter(x=>x.id!==id);save(s);schedule();
}
function rebuildPhase(s){
  s.phase='scheduled';s.firstStartedAt=0;s.secondStartedAt=0;s.finishedAt=0;
  for(const e of s.events){
    if(e.type==='phase-first'){s.phase='first';s.firstStartedAt=e.ts}
    if(e.type==='phase-halftime')s.phase='halftime';
    if(e.type==='phase-second'){s.phase='second';s.secondStartedAt=e.ts}
    if(e.type==='phase-final'){s.phase='final';s.finishedAt=e.ts}
  }
}
function shareLive(c,s){
  if(!s.source.url){toast('Primero pega el enlace de la transmisión.');return}
  const u=new URL(location.href);
  u.searchParams.set('live',s.source.url);
  u.searchParams.set('liveName',s.source.name||provider(s.source.url).name);
  u.hash='#/v4-matchcenter';
  const shareUrl=u.toString();
  if(navigator.share){
    navigator.share({title:'Match Center en vivo · '+c.home+' vs '+c.away,text:'Transmisión en vivo y Match Center de Liga Juventino Rosas',url:shareUrl}).catch(()=>{});
    return;
  }
  navigator.clipboard?.writeText(shareUrl).then(()=>toast('Enlace del Match Center Live copiado.')).catch(()=>prompt('Copia este enlace:',shareUrl));
}
function bind(c,s,hub){
  $('[data-v144-open]',hub).forEach(b=>b.addEventListener('click',()=>{if(s.source.url)window.open(s.source.url,'_blank','noopener,noreferrer')}));
  $('[data-v144-share]',hub).forEach(b=>b.addEventListener('click',()=>shareLive(c,s)));
  $('[data-v144-config]',hub).forEach(b=>b.addEventListener('click',()=>openConfig(c,s)));
  $('[data-v144-listen]',hub)?.addEventListener('click',()=>startSpeech(c,s));
  $$('[data-v144-phase]',hub).forEach(b=>b.onclick=()=>{addEvent(s,c,b.dataset.v144Phase);schedule()});
  $$('[data-v144-event]',hub).forEach(b=>b.onclick=()=>{const [type,side]=b.dataset.v144Event.split(':');addEvent(s,c,type,side);schedule()});
  $$('[data-v144-confirm]',hub).forEach(b=>b.onclick=()=>confirmSuggestion(c,s,b.dataset.v144Confirm));
  $$('[data-v144-dismiss]',hub).forEach(b=>b.onclick=()=>{s.suggestions=s.suggestions.filter(x=>x.id!==b.dataset.v144Dismiss);save(s);schedule()});
  $('[data-v144-undo]',hub)?.addEventListener('click',()=>{if(!s.events.length)return;s.events.pop();rebuildPhase(s);save(s);schedule()});
}
function patch(c,s){
  const x=counters(s),center=$('.v92-score-card .v92-center',c.root);
  if(center&&(s.phase!=='scheduled'||confirmed(s).length)){
    $('strong',center).textContent=x.home.goals+'–'+x.away.goals;
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
    if(j.phase&&['scheduled','first','halftime','second','final'].includes(j.phase))s.phase=j.phase;
    if(j.firstStartedAt)s.firstStartedAt=Number(j.firstStartedAt)||s.firstStartedAt;
    if(j.secondStartedAt)s.secondStartedAt=Number(j.secondStartedAt)||s.secondStartedAt;
    const known=new Set(s.events.map(e=>String(e.externalId||e.id)));
    for(const z of Array.isArray(j.events)?j.events:[]){
      const id=String(z.id||'');if(id&&known.has(id))continue;
      s.events.push({id:'feed-'+(id||now()),externalId:id,type:z.type||'note',side:z.side||'',player:z.player||'',note:z.note||'',source:'feed',confirmed:true,minute:z.minute||eventMinute(s),ts:Number(z.ts)||now()});
    }
    s.source.connected=true;s.source.lastSync=now();save(s);schedule();
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
    s.source.url||'',s.source.name||'',s.source.feedUrl||'',s.lastTranscript||'',
    s.events.map(e=>e.id).join(','),s.suggestions.map(e=>e.id).join(',')
  ].join('|');
}
function mount(){
  if(!ROUTES.has(route())){stopSpeech();return}
  const c=ctx();if(!c)return;const s=load(c),sig=renderSig(c,s);
  let old=$('[data-v144-live-hub]',c.root);
  if(old&&old.dataset.match!==c.key){old.remove();old=null}
  /* Evita un bucle con MutationObserver: si nada cambió, no reemplaza DOM. */
  if(old&&old.dataset.sig===sig)return;
  const w=document.createElement('div');w.innerHTML=hubHtml(c,s);const hub=w.firstElementChild;
  hub.dataset.sig=sig;
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
clockTimer=setInterval(()=>{if(ROUTES.has(route()))schedule()},15000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();

window.LJR_MATCH_LIVE={
  getState(){const c=ctx();return c?load(c):null},
  addEvent(type,side,note){const c=ctx();if(!c)return null;const s=load(c),e=addEvent(s,c,type,side||'',note||'','external');schedule();return e}
};
})();
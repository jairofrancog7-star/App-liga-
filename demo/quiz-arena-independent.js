/* V531 — Quiz Arena + Más o Menos reconstruidos desde las referencias de Google Drive del usuario.
   Unifica hub, juego, resultado y modal de salida sin incrustar las capturas. */
(function(){
'use strict';
if(window.__LJR_V531_GAMES__)return;
window.__LJR_V531_GAMES__=true;
window.__LJR_V533_PRIMARY_GAMES__=true;
window.__LJR_V536_MONITO_FLOW__=true;
window.__LJR_V537_SECONDARY_OVERLAY__=true;
window.__LJR_V538_MORELESS_VIDEO_FLOW__=true;
window.__LJR_V541_MONITO_PAGES__=true;
window.__LJR_V543_MORELESS_PORTAL__=true;
window.__LJR_V544_GAME_FLOW__=true;
window.__LJR_V545_MORELESS_ALL_SCREENS__=true;
window.__LJR_V546_DIRECT_GALLERY__=true;
window.__LJR_V551_MORELESS_REFERENCE__=true;
window.__LJR_V614_QUIZ_COUNTDOWN_REFERENCE__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const DATA_LOCAL='./data/official-live.json?v=20261001-v531-games';
const DATA_REMOTE=RAW+'data/official-live.json?v=20261001-v531-games';
const LEAGUE=RAW+'assets/liga-logo.webp';
const FEATURE='./assets/home-players-user.jpg';
const QUIZ_STADIUM='./assets/reference/predictor-v36/predictor-stadium.webp';
/* V1059: referencias de Campos/Clima. Vista aérea © Esri, NO fotografía
   verificada del campo ni fotografía extraída de Google Maps. */
const QUIZ_FIELDS=[{"id":"sur-1","name":"Campo 1 · Unidad Deportiva Sur","community":"Juventino Rosas","lat":20.63753,"lon":-100.99297,"precision":"complejo"},{"id":"sur-2","name":"Campo 2 · Unidad Deportiva Sur","community":"Juventino Rosas","lat":20.63753,"lon":-100.99297,"precision":"complejo"},{"id":"sur-3","name":"Campo 3 · Unidad Deportiva Sur","community":"Juventino Rosas","lat":20.63753,"lon":-100.99297,"precision":"complejo"},{"id":"zapata-4","name":"Campo 4 · Emiliano Zapata","community":"Juventino Rosas","lat":20.64337,"lon":-100.99286,"precision":"regional"},{"id":"cerrito","name":"Campo Cerrito de Gasca","community":"Cerrito de Gasca","lat":20.617778,"lon":-101.0625,"precision":"localidad"},{"id":"tavera","name":"Campo de Tavera","community":"Franco Tavera","lat":20.60839,"lon":-100.93238,"precision":"localidad"},{"id":"san-juan","name":"Campo San Juan de la Cruz","community":"San Juan de la Cruz","lat":20.63379,"lon":-100.911569,"precision":"localidad"},{"id":"cuenda","name":"Unidad Deportiva Santiago de Cuenda","community":"Santiago de Cuenda","lat":20.59793,"lon":-100.99663,"precision":"localidad"},{"id":"romerillo","name":"Campo San Antonio de Romerillo","community":"San Antonio de Romerillo","lat":20.60784,"lon":-100.94854,"precision":"localidad"},{"id":"fraccionamiento","name":"Campo Fraccionamiento Comontuoso","community":"Comontuoso / Santiago de Cuenda","lat":20.59793,"lon":-100.99663,"precision":"regional"},{"id":"pozos","name":"Campo de Fútbol de Pozos","community":"Pozos","lat":20.61767,"lon":-100.90033,"precision":"campo"},{"id":"rincon","name":"Campo Rincón de Centeno","community":"Rincón de Centeno","lat":20.660153,"lon":-100.886766,"precision":"localidad"},{"id":"san-jose","name":"Campo San José de la Montaña","community":"San José de la Montaña","lat":20.60102,"lon":-101.07242,"precision":"localidad"},{"id":"san-julian","name":"Campo San Julián Tierra Blanca","community":"San Julián Tierra Blanca","lat":20.591403,"lon":-101.040358,"precision":"localidad"}];
function quizLocalFieldQuestions(){
  return QUIZ_FIELDS.map(function(field,index){
    const uds=field.id.startsWith('sur-');
    const question=uds?'¿Cuál es el Campo '+(index+1)+' de la Unidad Deportiva Sur?'
      :'¿Cuál cancha de la Liga está ubicada en '+field.community+'?';
    const pool=(uds?QUIZ_FIELDS.filter(f=>f.id.startsWith('sur-')||f.id==='zapata-4'):QUIZ_FIELDS.filter(f=>f.id!==field.id)).map(f=>f.name);
    return {question,correct:field.name,pool,field};
  });
}
function quizFieldAerial(field){
  if(!field||!Number.isFinite(field.lat)||!Number.isFinite(field.lon))return '';
  const z=18,n=2**z,rad=field.lat*Math.PI/180;
  const wx=(field.lon+180)/360*n*256,wy=(1-Math.asinh(Math.tan(rad))/Math.PI)/2*n*256;
  const sx=Math.floor(wx/256)-1,sy=Math.floor(wy/256)-1;
  let imgs='';
  for(let row=0;row<3;row++)for(let col=0;col<3;col++){
    const x=sx+col,y=sy+row;
    const url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/'+z+'/'+y+'/'+x;
    imgs+='<img class="v1059-aerial-tile" src="'+url+'" alt="" loading="eager" decoding="async" style="left:'+(col*256)+'px;top:'+(row*256)+'px" onerror="this.hidden=true">';
  }
  const left=Math.round(wx-sx*256),top=Math.round(wy-sy*256);
  const area=field.precision==='campo'?'Sector del campo':'Sector aproximado';
  return '<div class="v1059-field-aerial" role="img" aria-label="Vista aérea de referencia de '+esc(field.community)+'. No es fotografía verificada de la cancha">'+
    '<span class="v1059-field-fallback" aria-hidden="true"><i></i></span>'+
    '<span class="v1059-aerial-tiles" aria-hidden="true" style="left:calc(50% - '+left+'px);top:calc(50% - '+top+'px)">'+imgs+'</span>'+
    '<small class="v1059-field-source">'+esc(area)+' · © Esri y proveedores</small></div>';
}

const FALLBACK_LOGOS={
  'san jose fc':'assets/official-logos/san-jose-fc.png',
  'juventus':'assets/official-logos/juventus.png',
  'hermanos':'assets/official-logos/hermanos.png',
  'linces':'assets/official-logos/linces.png',
  'napoli':'assets/official-logos/napoli.png',
  'franco fc':'assets/official-logos/franco-fc.png',
  'abejas':'assets/official-logos/abejas.png',
  'terricolas':'assets/official-logos/terricolas.png',
  'manchester':'assets/official-logos/manchester.png',
  'dynamo':'assets/official-logos/dynamo.png',
  'la esperanza':'assets/official-logos/la-esperanza.png',
  'boavista':'assets/official-logos/boavista.png',
  'lobos cdg':'assets/official-logos/lobos-cdg.png',
  'galacticos':'assets/teams/galacticos-pozos.webp'
};
let db=window.LJR_OFFICIAL_DATA||null;
let loading=null;
const quiz={mode:'splash',answered:false,selected:'',points:0,step:1,exit:false,remaining:15,halfUsed:false,retryUsed:false,attempts:1,countdown:3,history:[],missed:[],fieldStart:-5};
const more={mode:'legacy',answered:false,selected:'',points:0,attempts:2,exit:false,phase:'intro',countdown:15,roundToken:0,round:0,roundsPlayed:0,finished:false,scoreSaved:false};
let v538MoreTimers=[];
let v538MoreInterval=null;
let v614QuizCountdownTimer=null;
let v1050NotifyOpen=false;
const V1050_NOTIFY_KEY='ljr-quiz-notice-dismissed';
function v1050NoticeAvailable(){try{return localStorage.getItem(V1050_NOTIFY_KEY)!=='1'&&(!('Notification' in window)||Notification.permission!=='granted')}catch(_){return true}}
let v1055QuizNoticeReg=null;
async function v1055RegisterQuizNotices(){
  if(!navigator.serviceWorker?.register||!window.isSecureContext)return null;
  if(v1055QuizNoticeReg)return v1055QuizNoticeReg;
  try{
    // Scope src/ evita reemplazar cualquier trabajador de cache de la app.
    v1055QuizNoticeReg=await navigator.serviceWorker.register('./src/quiz-local-worker.js',{scope:'./src/'});
    return v1055QuizNoticeReg;
  }catch(_){return null}
}
async function v1050LocalNotice(body){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  const title='Quiz Arena · Liga Juventino Rosas',options={body,tag:'ljr-quiz-result'};
  try{
    const reg=v1055QuizNoticeReg||await navigator.serviceWorker?.getRegistration?.('./src/');
    if(reg?.showNotification&&reg.active){await reg.showNotification(title,options);return}
    new Notification(title,options);
  }catch(_){}
}
function v1050BellSvg(){return '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 34h28l-4-5V19a10 10 0 0 0-20 0v10l-4 5Z" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 38a4 4 0 0 0 8 0M6 19a18 18 0 0 1 5-12m31 12a18 18 0 0 0-5-12" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>'}
function v1050NotifyCard(){return v1050NoticeAvailable()?'<aside class="v1050-notice-card"><div class="v1050-notice-art">'+v1050BellSvg()+'</div><div class="v1050-notice-copy"><b>¡No te pierdas ningún quiz!</b><p>Recibe recordatorios y novedades del Quiz Arena.</p></div><button type="button" data-v1050-notice-open>Activar notificaciones</button><button type="button" class="v1050-notice-dismiss" data-v1050-notice-dismiss>Ahora no</button></aside>':''}
function v1050NotifyModal(){return '<div class="v1050-notify-backdrop" data-v1050-notify-backdrop><section class="v1050-notify-sheet" role="dialog" aria-modal="true" aria-labelledby="v1050-notify-heading"><button type="button" class="v1050-notify-x" data-v1050-notify-close aria-label="Cerrar">'+closeSvg()+'</button><div class="v1050-notify-icon">'+v1050BellSvg()+'</div><h2 id="v1050-notify-heading">¡No te pierdas ningún quiz!</h2><p>Activa las notificaciones para recibir avisos del Quiz Arena cuando esta aplicación pueda mostrarlos.</p><button type="button" class="v1050-notify-yes" data-v1050-notify-allow>Activar notificaciones</button><button type="button" class="v1050-notify-no" data-v1050-notify-close>Ahora no</button><small data-v1050-notify-status role="status">Los recordatorios con el navegador cerrado requieren notificaciones push; esta versión solo utiliza permisos y avisos locales.</small></section></div>'}


function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function initials(v){return String(v||'JR').split(/\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0]}).join('').toUpperCase()}
function go(r){
  if(window.LJR_APP_ROUTER&&typeof window.LJR_APP_ROUTER.go==='function')window.LJR_APP_ROUTER.go(r);
  else location.hash='#/'+r;
}
async function load(){
  if(db)return db;
  if(loading)return loading;
  loading=(async function(){
    for(const u of [DATA_LOCAL,DATA_REMOTE]){
      try{
        const r=await fetch(u,{cache:'no-store'});
        if(r.ok){db=await r.json();window.LJR_OFFICIAL_DATA=window.LJR_OFFICIAL_DATA||db;break}
      }catch(_){}
    }
    return db;
  })().finally(function(){loading=null});
  return loading;
}
function catId(data){
  const saved=String(localStorage.getItem('v62-category')||'3');
  if(data&&data.categories&&data.categories[saved])return saved;
  return data&&data.categories&&data.categories['3']?'3':Object.keys((data&&data.categories)||{})[0]||'3';
}
function category(data){return (data&&data.categories&&data.categories[catId(data)])||{}}
function standings(data){
  return ((category(data).standings||[])[0]?.rows||[]).filter(function(r){return Array.isArray(r)&&r[1]});
}
function scorers(data){
  return ((category(data).scorers||[])[0]?.rows||[])
    .filter(function(r){
      return Array.isArray(r)&&r.length>=4&&String(r[1]||'').trim()&&String(r[2]||'').trim()&&/^\d+$/.test(String(r[3]||''))&&!/goles?\s+en\s+temporada/i.test(String(r[2]||''));
    })
    .map(function(r){return {name:String(r[1]).trim(),team:String(r[2]).trim(),goals:Number(r[3])||0}})
    .sort(function(a,b){return b.goals-a.goals||a.name.localeCompare(b.name,'es')});
}
function logo(team,data){
  const entries=Object.entries((data&&data.team_logos)||{});
  const hit=entries.find(function(x){return norm(x[0])===norm(team)});
  const v=hit&&hit[1];
  if(typeof v==='string')return /^https?:/.test(v)?v:RAW+v.replace(/^\.\//,'');
  if(v&&v.local)return RAW+String(v.local).replace(/^\.\//,'');
  if(v&&v.source)return v.source;
  const p=FALLBACK_LOGOS[norm(team)];
  return p?RAW+p:'';
}
function crest(team,data,cls){
  const src=logo(team,data);
  return '<span class="v531-crest '+esc(cls||'')+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(team)+'" loading="eager" decoding="async">':'<b>'+esc(initials(team))+'</b>')+'</span>';
}
function quizData(data){
  const rows=standings(data),scorersList=scorers(data),stats=[];
  for(let i=0;i<Math.min(4,rows.length);i++)stats.push({question:'¿Qué equipo ocupa el '+(i+1)+'º lugar en esta categoría?',correct:String(rows[i][1]),pool:rows.map(r=>String(r[1]))});
  if(scorersList.length>=4)stats.push({question:'¿Quién lidera el goleo de esta categoría?',correct:scorersList[0].name,pool:scorersList.map(r=>r.name)});
  const fields=quizLocalFieldQuestions(),round=Math.max(0,(quiz.step||1)-1);
  const fieldOffset=(((Number(quiz.fieldStart)||0)+Math.floor(round/2))%fields.length+fields.length)%fields.length;
  const q=round%2===0||!stats.length?fields[fieldOffset]:stats[Math.floor(round/2)%stats.length];
  const pool=[q.correct,...(q.pool||[])].filter((v,i,a)=>v&&a.findIndex(x=>norm(x)===norm(v))===i);
  const options=pool.slice(0,4);
  if(options.length)for(let i=0;i<(quiz.step||1)%options.length;i++)options.push(options.shift());
  return {...q,options,leader:rows[0]||null};
}
function morePair(data){
  const list=scorers(data);
  const pairs=[];
  for(let i=0;i<list.length;i++){
    for(let j=i+1;j<list.length;j++){
      if(list[i].goals!==list[j].goals)pairs.push({a:list[i],b:list[j],kind:'player'});
      if(pairs.length>=36)break;
    }
    if(pairs.length>=36)break;
  }
  if(pairs.length){
    const round=Math.abs(Number(more.round)||0);
    const chosen=pairs[round%pairs.length];
    // Mezclar dirección sin cambiar goles ni jugadores oficiales.
    return (round*7+chosen.a.goals+chosen.b.goals)%3===0
      ?chosen:{a:chosen.b,b:chosen.a,kind:chosen.kind};
  }
  const rows=standings(data);
  const pool=rows.slice(0,6).map(function(r){return {name:String(r?.[1]||'EQUIPO'),team:String(r?.[1]||'EQUIPO'),goals:Number(r?.[6])||0}});
  if(pool.length>=2){
    const i=Math.abs(Number(more.round)||0)%pool.length;
    const j=(i+1)%pool.length;
    return {a:pool[i],b:pool[j],kind:'team'};
  }
  const a={name:'SAN JOSE FC',team:'SAN JOSE FC',goals:0};
  const b={name:'JUVENTUS',team:'JUVENTUS',goals:0};
  return {a:a,b:b,kind:'team'};
}
function rankRows(data){
  const rows=standings(data).slice(0,3);
  return rows.map(function(r,i){return {pos:i+1,name:String(r[1]),pts:String(r[9]??'—'),pj:String(r[2]??'—')}});
}
function moreLocalScores(){
 try{const a=JSON.parse(localStorage.getItem('ljr-moreless-completed-scores-v1')||'[]');
 return (Array.isArray(a)?a:[]).filter(x=>x&&Number.isFinite(Number(x.points))&&Number(x.points)>=0)
 .sort((a,b)=>Number(b.points)-Number(a.points)).slice(0,3)
 .map((x,i)=>({pos:i+1,name:'Invitado '+(i+1),pts:Number(x.points)}))}
 catch(_){return []}
}
function moreSaveScore(){
 if(more.scoreSaved||more.roundsPlayed<1)return;more.scoreSaved=true;
 try{const k='ljr-moreless-completed-scores-v1',v=JSON.parse(localStorage.getItem(k)||'[]'),a=Array.isArray(v)?v.slice(-29):[];
 a.push({points:more.points,rounds:more.roundsPlayed,at:new Date().toISOString()});
 localStorage.setItem(k,JSON.stringify(a))}catch(_){}
}
function moreNewGame(){
 v538ClearTimers();more.points=0;more.attempts=2;more.round=0;more.roundsPlayed=0;
 more.finished=false;more.scoreSaved=false;more.answered=false;more.selected='';more.exit=false;more.phase='intro';
}
function v583PairAt(data,offset){
  const saved=more.round;
  more.round=Math.max(0,Number(offset)||0);
  const pair=morePair(data);
  more.round=saved;
  return pair;
}
function backSvg(){return '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M18 6 10 14l8 8M10.5 14H24"/></svg>'}
function closeSvg(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'}
function shareSvg(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/></svg>'}
function quizLogo(){
  return '<div class="v531-quiz-logo"><span>QUIZ</span><span>ARENA</span><i></i><b></b></div>';
}
function v614ClearQuizCountdown(){
  if(v614QuizCountdownTimer){clearInterval(v614QuizCountdownTimer);v614QuizCountdownTimer=null}
}
function v617StatusIcon(state){
  if(state==='ok')return '<svg class="v617-status-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 12.4 9.4 16.6 18.8 7.2"/></svg>';
  return '<svg class="v617-status-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';
}
function v617LightningIcon(){
  return '<svg class="v617-turbo-svg v617-lightning-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 2.4 5.8 13h5l-1 8.6L18.2 10h-5.1l.1-7.6Z"/></svg>';
}
function v617BallIcon(){
  return '<span class="v767-ball-wrap" aria-hidden="true"><svg class="v617-turbo-svg v617-ball-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="m9.1 9.1 2.9-2.1 2.9 2.1-1.1 3.4h-3.6L9.1 9.1Zm1.1 3.4-2.8 2.1m6.4-2.1 2.8 2.1M12 7V4.5m-4.6 10.1-1 3m10.2-3 1 3m-7 3 1.4-2.2 1.4 2.2"/></svg><em class="v767-ball-badge">2</em></span>';
}
function v614QuizProgress(){
  const history=Array.isArray(quiz.history)?quiz.history:[];
  let html=history.slice(-9).map(function(state){
    return '<i class="v614-progress-state '+(state==='ok'?'ok':'bad')+'">'+v617StatusIcon(state)+'</i>';
  }).join('');
  html+='<span class="v614-current-timer"><b data-quiz-timer aria-label="Segundos restantes">'+quiz.remaining+'</b></span>';
  const used=Math.min(10,history.slice(-9).length+1);
  for(let i=used;i<10;i++)html+='<i class="v614-progress-state pending"></i>';
  return html;
}
function quizCountdown(data){
  const count=Math.max(1,Number(quiz.countdown)||3);
  return '<section class="v531-page v531-quiz v614-countdown-screen" data-v531-quiz data-v531-view="countdown">'+
    '<div class="v614-countdown-backdrop" aria-hidden="true"><img src="'+esc(QUIZ_STADIUM)+'" alt=""></div>'+
    '<button type="button" class="v614-countdown-close" data-v614-countdown-close aria-label="Cerrar">'+closeSvg()+'</button>'+
    '<div class="v614-countdown-center">'+
      '<b>EL QUIZ EMPIEZA EN</b>'+
      '<span class="v614-countdown-ring"><strong data-quiz-countdown>'+count+'</strong></span>'+
    '</div>'+
    '<button type="button" class="v614-countdown-skip" data-v614-countdown-skip>Pulsa para saltar</button>'+ 
    (quiz.exit?exitModal('quiz'):'')+
  '</section>';
}
function v614StartQuizCountdown(){
  v614ClearQuizCountdown();
  quiz.fieldStart=(quiz.fieldStart+5)%QUIZ_FIELDS.length;
  quiz.mode='countdown';quiz.answered=false;quiz.selected='';quiz.exit=false;quiz.remaining=15;quiz.step=1;quiz.points=0;quiz.halfUsed=false;quiz.retryUsed=false;quiz.attempts=1;quiz.countdown=3;quiz.history=[];quiz.missed=[];
  render(true);
  v614QuizCountdownTimer=setInterval(function(){
    if(route()!=='quizArena'||quiz.mode!=='countdown'){v614ClearQuizCountdown();return}
    if(quiz.exit)return; // Pausar 3-2-1 mientras la confirmación de salida está abierta.
    if(quiz.countdown>1){
      quiz.countdown--;
      const el=document.querySelector('[data-quiz-countdown]');if(el)el.textContent=String(quiz.countdown);
      return;
    }
    v614ClearQuizCountdown();
    quiz.countdown=0;quiz.mode='game';quiz.remaining=15;
    render(true);
  },1000);
}
function v614OpenQuizGame(){
  v614ClearQuizCountdown();
  quiz.mode='game';quiz.countdown=0;quiz.remaining=15;quiz.exit=false;
  render(true);
}
/* V1059: portada de Quiz Arena dibujada conforme a la referencia 691×1536.
   Las respuestas son cuatro botones reales que inician el quiz, no una imagen sin interaccion. */
/* V1062: estadio decorativo en SVG local integrado. Evita el icono de imagen rota
   si GitHub Pages o el navegador falla al servir la imagen externa. */
const V1062_QUIZ_SPLASH_STADIUM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 691 250" class="v1059-splash-stadium" aria-hidden="true" focusable="false" preserveAspectRatio="none">
<defs>
 <linearGradient id="ljrQuizSplashV1062_sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#040052" stop-opacity="0"/><stop offset=".4" stop-color="#040053" stop-opacity=".32"/><stop offset=".84" stop-color="#090b38" stop-opacity=".8"/><stop offset="1" stop-color="#0e1438"/></linearGradient>
 <linearGradient id="ljrQuizSplashV1062_water" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#101747"/><stop offset=".18" stop-color="#0c1736"/><stop offset=".65" stop-color="#06102e"/><stop offset="1" stop-color="#010743"/></linearGradient>
 <linearGradient id="ljrQuizSplashV1062_roof" x1=".1" y1="0" x2=".7" y2="1"><stop stop-color="#57deff"/><stop offset=".18" stop-color="#187ffc"/><stop offset=".58" stop-color="#072cba"/><stop offset="1" stop-color="#000b6a"/></linearGradient>
 <linearGradient id="ljrQuizSplashV1062_roof2" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="#0c5ff3"/><stop offset=".36" stop-color="#e7f5ff"/><stop offset=".7" stop-color="#667ab1"/><stop offset="1" stop-color="#08146f"/></linearGradient>
 <linearGradient id="ljrQuizSplashV1062_reflection" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#2b7ff0" stop-opacity=".65"/><stop offset="1" stop-color="#0b1645" stop-opacity="0"/></linearGradient>
 <filter id="ljrQuizSplashV1062_glow"><feGaussianBlur stdDeviation="4"/></filter>
 <filter id="ljrQuizSplashV1062_soft"><feGaussianBlur stdDeviation="1.5"/></filter>
 <pattern id="ljrQuizSplashV1062_building" width="19" height="22" patternUnits="userSpaceOnUse"><path d="M2 9h4M12 12h3M4 17h2M15 6h2" stroke="#ffe5a9" stroke-width=".7" opacity=".26"/></pattern>
</defs>
<rect width="691" height="250" fill="url(#ljrQuizSplashV1062_sky)"/>
<g opacity=".6"><path d="M0 162h691" stroke="#5c5e7f" stroke-width="1"/>
<path d="M0 166v-16h8v-9h13v13h10v-7h15v14h14v-16h9v12h18v-20h15v-7h12v23h17v-10h9v16h22v-13h10v10h18v-5h13v14h12v-22h17v-9h10v18h17v-16h23v17h20v-11h18v16h14v-22h12v20h18v-16h18v14h12v-21h9v16h15v-12h15v19h20v-16h11v17h19v-18h21v18h23v-11h16v15h19v-20h14v20h25v-8h20v18h21v-13h20v13h20v-12h24v14h25v-9h18v14h20v-12h20v14" fill="#181b38"/>
<rect y="135" width="691" height="31" fill="url(#ljrQuizSplashV1062_building)" opacity=".8"/></g>
<ellipse cx="350" cy="153" rx="305" ry="51" fill="#0069e6" opacity=".35" filter="url(#ljrQuizSplashV1062_glow)"/>
<path d="M74 151 Q135 63 341 62 Q551 57 621 153 Q550 141 482 137 Q333 128 205 138 Q137 138 74 151Z" fill="url(#ljrQuizSplashV1062_roof)" stroke="#32caff" stroke-width="2.5"/>
<path d="M95 147 Q133 87 223 81 Q307 52 390 78 Q486 72 589 146 Q470 119 348 119 Q200 118 95 147Z" fill="#0d58e0" opacity=".8"/>
<path d="M141 145 Q181 88 268 88 Q313 76 342 83 Q386 75 435 91 Q487 105 534 141 Q456 121 344 122 Q216 126 141 145Z" fill="#abdfff" opacity=".54"/>
<path d="M189 110 Q246 94 285 96 Q320 92 346 102 Q375 90 410 97 Q470 105 500 121 L475 151 L226 151Z" fill="url(#ljrQuizSplashV1062_roof2)"/>
<path d="M207 116 L226 150 L251 142 L228 108M244 108 L263 147 L282 142 L270 99M282 99 L302 144 L323 140 L318 91M341 95 L358 146 L375 143 L367 92M382 97 L395 145 L415 144 L410 99M426 107 L438 145 L453 148 L446 116" stroke="#f1f7ff" stroke-width="2" opacity=".6" fill="none"/>
<path d="M86 152 Q182 77 337 70 Q508 66 615 153" stroke="#2e9aff" stroke-width="5" fill="none" opacity=".85" filter="url(#ljrQuizSplashV1062_glow)"/>
<path d="M85 151 Q172 70 341 69 Q513 68 617 152M108 143 Q198 87 342 85 Q480 83 595 144" stroke="#42d5ff" stroke-width="1.8" fill="none" opacity=".86"/>
<path d="M108 143 Q242 127 338 129 Q452 125 595 145 L570 158 Q357 172 128 158Z" fill="#0a2262" stroke="#558dfb" stroke-width="1"/>
<path d="M111 148 L161 143 L182 158 L114 160ZM527 146 L579 152 L576 161 L503 156Z" fill="#61aaff" opacity=".38"/>
<path d="M109 163 Q338 177 574 160" stroke="#b2dbf4" stroke-width="2.2" opacity=".43" fill="none"/>
<path d="M125 165 Q341 188 567 167" stroke="#76d5ff" stroke-width="5" opacity=".25" filter="url(#ljrQuizSplashV1062_soft)" fill="none"/>
<rect y="170" width="691" height="80" fill="url(#ljrQuizSplashV1062_water)"/>
<path d="M0 170h691" stroke="#4d77aa" opacity=".36"/>
<path d="M85 181 Q298 171 557 185M142 192 Q334 200 526 192M197 206 Q324 199 469 207" stroke="#1e73b1" stroke-width="1.4" fill="none" opacity=".38"/>
<path d="M131 173 l-14 52M202 177 l-5 67M271 179 l-2 58M350 178 l0 65M411 176 l13 68M492 173 l21 70M552 172 l13 60" stroke="url(#ljrQuizSplashV1062_reflection)" stroke-width="10" filter="url(#ljrQuizSplashV1062_soft)" opacity=".65"/>
<g stroke="#67c8ff" stroke-width=".75" opacity=".2"><path d="M60 188l145-2M295 191h181M105 204h210M337 218h255M174 233h237M391 241h206M12 219h128"/></g>
</svg>`;
function quizSplash(){
  const letters=['A','B','C','D'];
  return '<section class="v531-page v531-quiz v1059-splash" data-v531-quiz data-v531-view="splash" aria-label="Quiz Arena">'+
    '<div class="v1059-splash-glow" aria-hidden="true"></div>'+
    '<button class="v1059-splash-logo" type="button" data-v1059-open-hub aria-label="Abrir opciones de Quiz Arena">'+
      '<svg viewBox="0 0 370 270" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Quiz Arena">'+
        '<g fill="#fff" stroke="none" style="font-family:Impact,Arial Narrow,Roboto Condensed,sans-serif;font-style:italic;font-weight:900">'+
          '<text x="41" y="102" font-size="106" textLength="194" lengthAdjust="spacingAndGlyphs">QUIZ</text>'+
          '<text x="72" y="192" font-size="104" textLength="234" lengthAdjust="spacingAndGlyphs">ARENA</text>'+
        '</g>'+
        '<path d="M237 47V102H296" fill="none" stroke="#fb4ba7" stroke-width="4.5"/>'+
        '<path d="M253 74l24 27 79-84" fill="none" stroke="#fb4ba7" stroke-width="4.8" stroke-linecap="square" stroke-linejoin="miter"/>'+
        '<path d="M20 150H7V228H75" fill="none" stroke="#fc4da2" stroke-width="5"/>'+
        '<path d="M316 196h27v66h-69v-14" fill="none" stroke="#fb4ba7" stroke-width="5"/>'+
      '</svg>'+
    '</button>'+
    '<div class="v1059-answer-art" role="group" aria-label="Elige una letra para comenzar Quiz Arena">'+
    letters.map(function(letter,i){return '<button type="button" class="v1059-answer v1059-answer-'+letter.toLowerCase()+'" data-v531-quiz-start aria-label="Jugar Quiz Arena: opcion '+letter+'">'+
      '<span class="v1059-answer-letter">'+letter+'</span>'+
      '<span class="v1059-answer-track"><span class="v1059-answer-placeholder"></span>'+(i===2?'<span class="v1059-answer-tick" aria-hidden="true">✓</span>':'')+'</span>'+
      '</button>'}).join('')+
    '</div>'+
    V1062_QUIZ_SPLASH_STADIUM+
    '<span class="v1059-sr-only">Toca cualquiera de las cuatro barras para empezar el juego. Toca el logotipo para abrir las opciones y clasificaciones.</span>'+
  '</section>';
}
function quizHub(data){
  const ranks=rankRows(data);
  const q={correct:String(standings(data)[0]?.[1]||'Liga Juventino Rosas')};
  // V1057: portada compacta; menú de tres puntos sin opciones de notificación.
  return '<section class="v531-page v531-quiz v1057-quiz-hub" data-v531-quiz data-v531-view="hub">'+
    '<header class="v531-mini-head v1057-quiz-head">'+
      '<button type="button" data-v531-quiz-back aria-label="Volver">'+backSvg()+'</button>'+
      '<strong>Quiz Arena</strong>'+
      '<button type="button" class="v1057-menu-trigger" data-v1057-quiz-menu-toggle aria-label="Abrir opciones" aria-controls="v1057-quiz-menu" aria-expanded="false"><span aria-hidden="true">⋮</span></button>'+ 
      '<button type="button" class="v1070-hub-close" data-v1070-quiz-hub-close aria-label="Cancelar y regresar a portada">'+closeSvg()+'</button>'+
      '<nav id="v1057-quiz-menu" class="v1057-quiz-menu" data-v1057-quiz-menu role="menu" aria-label="Opciones de Quiz Arena" hidden>'+
        '<button type="button" role="menuitem" data-v1057-quiz-share>Compartir Quiz Arena</button>'+
        '<button type="button" role="menuitem" data-v1057-quiz-rankings>Ver clasificaciones</button>'+
        '<button type="button" role="menuitem" data-v1057-quiz-help aria-expanded="false">Cómo jugar</button>'+
        '<p class="v1057-menu-help" data-v1057-quiz-help-content hidden>Responde las preguntas antes de que termine el tiempo. Cada acierto suma puntos.</p>'+
      '</nav>'+
    '</header>'+
    '<main class="v531-hub-body v1057-quiz-content">'+
      '<article class="v531-quiz-hero">'+
        '<div class="v531-hero-ball" aria-hidden="true"><i></i><i></i><i></i></div>'+
        '<div class="v531-quiz-hero-copy"><h2>Quiz Arena</h2><p>Pon a prueba tus conocimientos de la Liga.</p></div>'+
        '<div class="v531-dual-actions"><button type="button" class="primary" data-v531-quiz-start>Generar quiz</button></div>'+
      '</article>'+
      '<div class="v531-discover" aria-label="Descubre más juegos"><span aria-hidden="true">⚽</span><b>DESCUBRE MÁS</b><em>LIGA JUVENTINO</em></div>'+
      '<article class="v531-friend-card"><div><h2>¡Reta a tus amigos en el Quiz Arena!</h2><button type="button" data-v531-share>Invita a amigos</button></div><div class="v531-friend-avatar" aria-hidden="true">'+crest(q.correct,data,'friend')+'</div></article>'+
      '<article class="v531-quiz-random-card">'+
        '<div class="v531-random-photo" aria-hidden="true"><span class="v1057-football">⚽</span></div>'+
        '<div class="v531-random-copy"><h2>Quiz Aleatorio</h2><p>Responde preguntas sobre nuestra Liga y gana puntos.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-v531-quiz-start>Generar quiz</button></div></div>'+
      '</article>'+
      '<h2 class="v531-section-title">Clasificaciones</h2>'+
      '<article class="v531-rank-card"><h3>Tabla oficial de la Liga</h3>'+
      ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+
      '<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
    '</main>'+
  '</section>';
}
function quizGame(data){
  const q=quizData(data);
  const wrong=q.options.filter(n=>norm(n)!==norm(q.correct));
  const options=q.options.map(function(name){
    const hidden=quiz.halfUsed&&wrong.slice(0,2).includes(name);
    const missed=(quiz.missed||[]).some(v=>norm(v)===norm(name));
    return '<button type="button" class="v531-q-answer v614-q-answer'+(missed?' is-wrong':'')+'" '+(hidden?'disabled style="visibility:hidden"':missed?'disabled':'')+' data-v531-q-answer="'+esc(name)+'"><span aria-hidden="true"></span><b>'+esc(name)+'</b></button>';
  }).join('');
  return '<section class="v531-page v531-quiz v531-game-screen v614-quiz-game" data-v531-quiz data-v531-view="game">'+
    '<header class="v614-game-head"><strong class="v1050-quiz-title">Quiz Aleatorio</strong><button type="button" data-v531-quiz-close aria-label="Cerrar quiz">'+closeSvg()+'</button></header>'+
    '<div class="v614-scorebar"><div class="v614-progress-track">'+v614QuizProgress()+'</div><span class="v614-score-total"><small>Total</small><b>'+quiz.points+' ptos</b></span></div>'+
    '<main class="v531-q-main v614-q-main">'+
      '<article class="v531-question-card v614-question-card"><div class="v531-question-media v614-question-media">'+(q.field?quizFieldAerial(q.field):'<div class="v1059-neutral-pitch" aria-hidden="true"><i></i></div>')+'<p>'+esc(q.question)+'</p></div><div class="v531-q-grid v614-q-grid">'+options+'</div></article>'+
      '<div class="v614-league-band"><img src="'+esc(LEAGUE)+'" alt=""><span><b>LIGA JUVENTINO ROSAS</b><small>FÚTBOL MUNICIPAL</small></span></div>'+
      '<div class="v531-turbos v614-turbos"><button data-quiz-half '+(quiz.halfUsed?'disabled':'')+'><small>Tus turbos</small><b><span class="v617-turbo-icon">'+v617LightningIcon()+'</span><span>50-50</span></b></button><button data-quiz-retry '+(quiz.retryUsed?'disabled':'')+'><small>Turbo</small><b><span class="v617-turbo-icon">'+v617BallIcon()+'</span><span>2 intentos</span></b></button></div>'
    '</main>'+
    (quiz.exit?exitModal('quiz'):'')+(v1050NotifyOpen?v1050NotifyModal():'')+
  '</section>';
}
function quizResult(data){
  const q=quizData(data);
  return '<section class="v531-page v531-quiz v531-result-screen v534-result-clean" data-v531-quiz data-v531-view="result">'+
    '<header class="v531-result-head"><button type="button" data-v531-result-back aria-label="Volver">'+backSvg()+'</button></header>'+
    quizLogo()+
    '<div class="v534-result-status"><span>'+(norm(quiz.selected)===norm(q.correct)&&quiz.selected?'✓':'×')+'</span><b>'+(norm(quiz.selected)===norm(q.correct)&&quiz.selected?'¡Respuesta correcta!':quiz.selected?'Respuesta incorrecta':'Se acabó el tiempo')+'</b><strong>'+esc(q.correct)+'</strong><small>'+quiz.points+' puntos</small></div>'+
    '<button type="button" class="v531-next-btn" data-v531-quiz-next>Siguiente pregunta</button>'+
  '</section>';
}
function v538PlayerPhoto(name,team){
  try{
    if(window.LJR_PLAYER_MEDIA&&typeof window.LJR_PLAYER_MEDIA.photo==='function'){
      const x=window.LJR_PLAYER_MEDIA.photo(name,team);
      if(x)return String(x);
    }
    const pub=window.LJR_PLAYER_PHOTOS;
    if(pub){
      if(typeof pub.get==='function'){const x=pub.get(name,team);if(x)return String(x)}
      const x=pub[norm(name)+'|'+norm(team)]||pub[norm(name)]||pub[name];
      if(x)return String(x);
    }
  }catch(_){}
  return '';
}
function v538Person(p,data,cls){
  const photo=v538PlayerPhoto(p.name,p.team);
  if(photo)return '<span class="v538-person '+esc(cls||'')+' has-photo"><img src="'+esc(photo)+'" alt="'+esc(p.name)+'" loading="eager" decoding="async" referrerpolicy="no-referrer"></span>';
  const teamLogo=logo(p.team||p.name,data);
  if(teamLogo)return '<span class="v538-person '+esc(cls||'')+' has-team-logo"><span class="v584-circle-photo"><img src="'+esc(teamLogo)+'" alt="'+esc(p.team||p.name)+'" loading="eager" decoding="async"></span></span>';
  return '<span class="v538-person '+esc(cls||'')+' is-fallback">'+v535AvatarSvg('#b9b9b9')+'</span>';
}
function v545MoreScreenCards(pair,data){
  return '<section class="v545-more-screens" aria-label="Otros diseños de Más o menos">'+
    '<h2>Más diseños de Más o menos</h2>'+
    '<article class="v545-more-screen-card reveal" data-v545-more-screen="reveal">'+
      '<div class="v545-preview-top"><span>Más o menos</span><b>×</b></div>'+
      '<div class="v545-preview-players one">'+
        '<div class="v545-mini-player">'+v538Person(pair.a,data,'mini')+'<b>'+esc(pair.a.name)+'</b><small>'+esc(pair.a.team)+'</small><strong>'+esc(pair.a.goals)+'</strong></div>'+
        '<div class="v545-mini-player ghost"><i>✦</i></div>'+
      '</div>'+
      '<div class="v545-preview-score"><span>⚽ ⚽</span><b>15</b><em>0 pts</em></div>'+
      '<p>Primero aparece un jugador y después entra el segundo.</p>'+
    '</article>'+
    '<article class="v545-more-screen-card choice" data-v545-more-screen="choice">'+
      '<div class="v545-preview-top"><span>Más o menos</span><b>×</b></div>'+
      '<div class="v545-preview-players">'+
        '<div class="v545-mini-player">'+v538Person(pair.a,data,'mini')+'<b>'+esc(pair.a.name)+'</b><strong>'+esc(pair.a.goals)+'</strong></div>'+
        '<div class="v545-mini-player">'+v538Person(pair.b,data,'mini')+'<b>'+esc(pair.b.name)+'</b><strong>—</strong></div>'+
      '</div>'+
      '<div class="v545-preview-question">¿Ha marcado '+esc(pair.b.name)+' más o menos?</div>'+
      '<div class="v545-preview-arrows"><i>▼</i><small>OR</small><i>▲</i></div>'+
    '</article>'+
    '<article class="v545-more-screen-card exit" data-v545-more-screen="exit">'+
      '<div class="v545-preview-top"><span>Más o menos</span><b>×</b></div>'+
      '<div class="v545-preview-modal"><h3>¿Salir del quiz?</h3><p>Tus cambios no se guardarán.</p><span>Sí, salir</span><em>No, continuar</em></div>'+
    '</article>'+
  '</section>';
}
function moreHub(data){
  const pair=morePair(data),ranks=moreLocalScores();
  const extraPairs=[1,2,3].map(function(n){return v583PairAt(data,n)});
  const extraChallenges='<section class="v583-more-challenges"><h2>Más retos de Más o menos</h2>'+
    extraPairs.map(function(p,i){return '<article class="v583-more-challenge">'+
      '<div class="v583-challenge-art">'+v538Person(p.a,data,'left')+v538Person(p.b,data,'right')+'</div>'+
      '<div class="v583-challenge-copy"><h3>Más o menos</h3><p>'+esc(p.a.name)+' vs '+esc(p.b.name)+'</p>'+
      '<button type="button" data-v583-more-round="'+(i+1)+'">Jugar este reto</button></div>'+
    '</article>'}).join('')+
  '</section>';
  return '<section class="v531-page v531-more v538-more-hub v551-more-reference" data-v531-more data-v531-view="hub">'+
    '<header class="v531-mini-head v538-more-head"><button type="button" data-v531-more-back aria-label="Volver">'+backSvg()+'</button><strong>More or Less</strong><span></span></header>'+
    '<main class="v538-hub-body">'+
      '<article class="v538-hub-feature">'+
        '<div class="v538-hub-feature-art">'+v538Person(pair.a,data,'left')+v538Person(pair.b,data,'right')+'</div>'+
        '<div class="v538-hub-feature-copy"><h2>Más o menos</h2><p>Compara las estadísticas de dos jugadores y ¡ponlas en el orden correcto para ganar puntos!</p>'+
          '<div class="v538-hub-actions"><button type="button" class="primary" data-v531-more-start>Generar quiz</button></div>'+
        '</div>'+
      '</article>'+
      '<h2 class="v531-section-title v551-ranking-title">Clasificaciones</h2>'+
      '<article class="v531-rank-card v551-more-ranking"><h3>Más o menos · puntuaciones locales</h3>'+
      (ranks.length?ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'</span><span class="v531-crest rank" aria-hidden="true">★</span><b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join(''):'<p class="v1051-no-scores">Aún no hay partidas terminadas en este dispositivo.</p>')+
      '<button type="button" data-v531-rankings>Ver clasificación de la Liga</button></article>'+
      '<div class="v551-discover-banner"><span>◉</span><b>DESCUBRE MÁS</b><em>LIGA JUVENTINO</em></div>'+
      '<article class="v538-friend-card"><div><h3>¡Reta a tus amigos en el Quiz Arena!</h3><button type="button" data-v531-share>Invita a amigos</button></div><div class="v538-friend-bubble v585-friend-image"><img src="'+esc(LEAGUE)+'" alt="Liga Municipal de Fútbol Juventino Rosas" loading="eager" decoding="async"></div></article>'+
      extraChallenges+
    '</main>'+
  '</section>';
}
function quizLegacyExtras(data){
  const ranks=rankRows(data),q=quizData(data);
  return '<section class="v531-legacy-extras v531-quiz-extras" data-v531-extras="quiz">'+
    '<div class="v531-extras-head"><span>Quiz Arena</span><b>Más juegos y modos</b></div>'+
    '<article class="v531-quiz-random-card">'+
      '<div class="v531-random-photo"><img src="'+esc(FEATURE)+'" alt="" loading="lazy" decoding="async"><span>'+crest(q.correct,data,'random')+'</span></div>'+
      '<div class="v531-random-copy"><h2>Quiz Aleatorio</h2><p>Abre los otros diseños que me mandaste y juega con datos de la Liga.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-v531-quiz-start>Abrir Quiz Arena</button><button type="button" data-v531-share>Compartir</button></div></div>'+
    '</article>'+
    '<article class="v531-friend-card"><div><h2>¡Reta a tus amigos en el Quiz Arena!</h2><button type="button" data-v531-share>Invita a amigos</button></div><div class="v531-friend-avatar">'+crest(q.correct,data,'friend')+'</div></article>'+
    '<h2 class="v531-section-title">Clasificación de la Liga</h2>'+
    '<article class="v531-rank-card"><h3>Tabla oficial de la Liga</h3>'+ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'º</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+'<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
  '</section>';
}
function moreLegacyExtras(data){
  const pair=morePair(data),ranks=rankRows(data);
  function gameCard(){
    return '<article class="v531-more-card"><div class="v531-more-card-art"><div class="v531-starball">✦</div></div><div><h2>Más o menos</h2><p>Abre los otros diseños del juego sin quitar la pantalla principal que ya tenías.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-v531-more-start>Abrir juego</button><button type="button" data-v531-share>Compartir</button></div></div></article>';
  }
  return '<section class="v531-legacy-extras v531-more-extras" data-v531-extras="more">'+
    '<div class="v531-extras-head"><span>Más modos del juego</span><b>DEBAJO DEL PRINCIPAL</b></div>'+
    '<article class="v531-more-feature"><div class="v531-more-feature-players">'+crest(pair.a.team,data,'feature')+crest(pair.b.team,data,'feature')+'</div><div><h2>Comparación</h2><p>Compara a '+esc(pair.a.name)+' y '+esc(pair.b.name)+' con datos publicados por la Liga.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-v531-more-start>Entrar al juego</button><button type="button" data-v531-share>Compartir</button></div></div></article>'+
    '<div class="v531-discover"><span>↕</span><b>PLAY GAMES</b><em>LIGA JUVENTINO</em></div>'+
    gameCard()+gameCard()+
    '<h2 class="v531-section-title">Clasificación de la Liga</h2>'+
    '<article class="v531-rank-card"><h3>Más o menos</h3>'+ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'º</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+'<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
  '</section>';
}
function playerCard(p,data,known,side){
  return '<article class="v538-player-card '+esc(side||'')+'">'+
    '<div class="v538-player-image">'+v538Person(p,data,'game')+'</div>'+
    '<div class="v538-player-name"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+'</small></div>'+
    '<div class="v538-player-stat"><small>Goles</small><strong>'+(known?esc(p.goals):'—')+'</strong></div>'+
  '</article>';
}
/* V1067: las dos cartas conservan la misma geometría mientras giran,
   con anverso/reverso superpuestos. No hay desplazamiento lateral. */
function v1067FlipCard(p,data,known,side,revealed,animating){
  const label=revealed?esc(p.name)+' · '+esc(p.team):'Tarjeta boca abajo';
  const back='<div class="v1067-flip-side v1067-flip-back" aria-hidden="'+(revealed?'true':'false')+'">'+
    '<div class="v1067-card-texture" aria-hidden="true"></div>'+
    '<span class="v1067-back-emblem" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false">'+
      '<circle cx="32" cy="32" r="27"/><path d="m32 13 12 9-5 14H25l-5-14z M20 22 10 36l8 13m21-13 8 13 8-13M25 36l7 13 7-13"/>'+
    '</svg></span>'+
    '<span class="v1067-back-brand" aria-hidden="true">LIGA<br>JUVENTINO ROSAS</span>'+
  '</div>';
  const front='<div class="v1067-flip-side v1067-flip-front" aria-hidden="'+(revealed?'false':'true')+'">'+
    '<div class="v538-player-image">'+v538Person(p,data,'game')+'</div>'+
    '<div class="v538-player-name"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+'</small></div>'+
    '<div class="v538-player-stat"><small>Goles</small><strong>'+(known?esc(p.goals):'—')+'</strong></div>'+
  '</div>';
  return '<article class="v538-player-card v1067-flip-card '+esc(side)+' '+(revealed?'is-open':'is-closed')+' '+(animating?'is-revealing':'')+'" aria-label="'+label+'">'+
    '<div class="v1067-flip-inner">'+back+front+'</div></article>';
}
function v538ClearTimers(){
  v538MoreTimers.forEach(function(t){clearTimeout(t)});v538MoreTimers=[];
  if(v538MoreInterval){clearInterval(v538MoreInterval);v538MoreInterval=null}
}
function v538StartMoreRound(){
  v538ClearTimers();
  more.roundToken++;
  const token=more.roundToken;
  more.round=Math.max(0,Number(more.round)||0)+1;
  more.mode='game';more.phase='intro';more.answered=false;more.selected='';more.exit=false;more.countdown=15;more.finished=false;
  document.body.classList.add('v543-more-portal-open');
  v543RenderMorePortal();
  v538MoreInterval=setInterval(function(){
    if(token!==more.roundToken||more.mode!=='game'){v538ClearTimers();return}
    if(more.exit||more.phase!=='ready'||more.answered)return;
    more.countdown=Math.max(0,more.countdown-1);
    document.querySelectorAll('#v543-moreless-portal .v538-countdown').forEach(el=>el.textContent=String(more.countdown));
    if(more.countdown<=0){
      more.selected='timeout';more.answered=true;more.phase='result';
      more.attempts=Math.max(0,more.attempts-1);more.roundsPlayed++;
      more.finished=more.attempts===0||more.roundsPlayed>=10;
      if(more.finished)moreSaveScore();
      v538ClearTimers();v543RenderMorePortal();
    }
  },1000);
  // Ambas cartas empiezan boca abajo. Giros pausados antes de habilitar respuesta.
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken||more.mode!=='game')return;more.phase='first';v543RenderMorePortal()},1250));
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken||more.mode!=='game')return;more.phase='both';v543RenderMorePortal()},3200));
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken||more.mode!=='game')return;more.phase='ready';v543RenderMorePortal()},4450));
}
function moreGame(data){
  const pair=morePair(data);
  const question=pair.kind==='player'
    ?'¿Ha marcado '+esc(pair.b.name)+' más o menos?'
    :'¿Tiene '+esc(pair.b.name)+' más o menos goles?';
  const intro=more.phase==='intro';
  const first=more.phase==='first';
  const both=more.phase==='both'||more.phase==='ready'||more.phase==='result';
  const ready=more.phase==='ready'||more.phase==='result';
  const result=more.phase==='result';
  return '<section class="v531-page v531-more v538-more-game v551-more-reference-game" data-v531-more data-v531-view="game">'+
    '<header class="v531-game-head v538-game-head"><strong>Más o menos</strong><button type="button" data-v531-more-close aria-label="Cerrar">'+closeSvg()+'</button></header>'+
    '<main class="v538-game-body">'+
      '<div class="v538-game-stage '+esc(more.phase)+'">'+
        '<div class="v538-loading-question">Total de goles en la<br>Liga Juventino Rosas</div>'+
        '<div class="v538-player-pair">'+
          v1067FlipCard(pair.a,data,true,'left',!intro,more.phase==='first')+
          v1067FlipCard(pair.b,data,more.answered,'right',both,more.phase==='both')+
        '</div>'+
      '</div>'+
      '<div class="v538-score-strip"><span><small>Intentos</small><b>'+Array.from({length:Math.max(0,more.attempts)},function(){return '⚽'}).join(' ')+'</b></span><strong class="v538-countdown">'+more.countdown+'</strong><span><small>Puntuación</small><b>'+more.points+' pts</b></span></div>'+
      '<div class="v538-question-zone '+(ready?'show':'')+'">'+
        '<h2>'+(ready?question:'Total de goles en la Liga Juventino Rosas')+'</h2>'+
        '<div class="v531-more-buttons"><button type="button" class="less" data-v531-more-choice="less" aria-label="Menos">▼</button><span>O</span><button type="button" class="more" data-v531-more-choice="more" aria-label="Más">▲</button></div>'+
        (more.answered?'<div class="v531-more-answer">'+(more.selected==='correct'?'¡Correcto!':more.selected==='timeout'?'Tiempo agotado':'Respuesta incorrecta')+' · '+esc(pair.b.name)+' tiene '+esc(pair.b.goals)+'</div>':'')+
      '</div>'+
      (result?'<section class="v539-more-result '+(more.selected==='correct'?'ok':'bad')+'"><span class="v539-result-mark">'+(more.selected==='correct'?'✓':'×')+'</span><div><small>RESULTADO</small><h3>'+(more.finished?'Partida terminada':more.selected==='correct'?'¡Acertaste!':more.selected==='timeout'?'Tiempo agotado':'Siguiente intento')+'</h3><p>'+esc(pair.a.name)+' · '+esc(pair.a.goals)+' / '+esc(pair.b.name)+' · '+esc(pair.b.goals)+'</p></div><button type="button" data-v539-more-next>'+(more.finished?'Volver a jugar':'Siguiente comparación')+'</button></section>':'')+
      '<div class="v538-video-banner" aria-label="Liga Juventino Rosas"><b>LIGA</b><em>JUVENTINO ROSAS</em><span>⚽</span></div>'+
    '</main>'+
    (more.exit?exitModal('more'):'')+
  '</section>';
}
function exitModal(kind){
  return '<div class="v531-exit-backdrop"><section class="v531-exit-modal" role="dialog" aria-modal="true"><button type="button" class="v531-exit-x" data-v531-exit-cancel="'+kind+'" aria-label="Cerrar">'+closeSvg()+'</button><h2>¿Salir del quiz?</h2><p>Tus cambios no se guardarán.</p><button type="button" class="yes" data-v531-exit-confirm="'+kind+'">Sí, salir</button><button type="button" class="no" data-v531-exit-cancel="'+kind+'">No, continuar</button></section></div>';
}
function setGamesNav(){
  const nav=document.querySelector('.bottom-nav');if(!nav)return;
  nav.querySelectorAll('.nav-item').forEach(function(item){
    const on=item.dataset.route==='more';
    item.classList.toggle('active',on);
    item.setAttribute('aria-current',on?'page':'false');
  });
}
function v535AvatarSvg(color){
  return '<div class="v12-avatar" style="--av:'+color+'"><svg viewBox="0 0 96 96" aria-hidden="true"><path d="M30 35c0-14 8-22 18-22s18 8 18 22c0 11-4 19-9 24v8H39v-8c-5-5-9-13-9-24Z" fill="#d7d7d7"/><path d="M25 30c4-16 12-25 23-25 10 0 20 8 24 24l-7 2c-2-8-8-12-17-12-8 0-14 4-17 13Z" fill="#a9a9a9"/><path d="M38 57h20l14 9c6 4 10 10 11 18H13c1-8 5-14 11-18Z" fill="var(--av)"/></svg></div>';
}
function v535CurveArrow(color,flip){
  return '<svg class="v12-curve-arrow '+(flip?'flip':'')+'" viewBox="0 0 100 150" aria-hidden="true"><path d="M25 130C55 90 60 55 45 20" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round"/><path d="M36 27 46 12l14 14" fill="none" stroke="'+color+'" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function v535MorePrimaryMarkup(){
  return '<section class="v12-moreless v535-restored-primary" data-v12-moreless data-v535-restored-primary>'+
    '<div class="v12-ml-title"><span>MÁS</span><small>O</small><span>MENOS</span></div>'+
    '<div class="v12-ml-curves"><div class="down">'+v535CurveArrow('#ff003c',true)+'</div><div class="up">'+v535CurveArrow('#18ef72',false)+'</div></div>'+
    '<div class="v12-ml-choice">'+
      '<button type="button" data-v12-choice="more" data-route="moreLessGallery" data-v577-more-gallery aria-label="Abrir Más o Menos">'+v535AvatarSvg('#c776e8')+'</button>'+
      '<div class="v12-ml-mid"><button type="button" data-v12-choice="more" class="up-arrow" aria-label="Más">▲</button><button type="button" data-v12-choice="less" class="down-arrow" aria-label="Menos">▼</button></div>'+
      '<button type="button" data-v12-choice="less" data-route="moreLessGallery" data-v577-more-gallery aria-label="Abrir Más o Menos">'+v535AvatarSvg('#77f1ea')+'</button>'+
    '</div>'+
    '<img class="v12-ml-logo" src="'+LEAGUE+'" alt="Liga Municipal de Fútbol Juventino Rosas" loading="eager" decoding="async">'+
    '<div class="v12-stadium" aria-hidden="true"><i></i><b></b></div>'+
  '</section>';
}
function v535EnsureMorePrimary(){
  const screen=document.querySelector('#screen');if(!screen)return null;
  let primary=screen.querySelector('[data-v12-moreless]');
  if(!primary){
    screen.insertAdjacentHTML('afterbegin',v535MorePrimaryMarkup());
    primary=screen.querySelector('[data-v12-moreless]');
  }
  if(primary){
    primary.dataset.v533Primary='true';
    primary.dataset.v535Primary='true';
    /* V536: solo los dos monitos exteriores abren los otros diseños. */
    primary.querySelectorAll('.v12-ml-choice > button').forEach(function(btn){
      btn.dataset.v531MoreOpen='true';
      btn.setAttribute('aria-label','Abrir otros diseños de Más o Menos');
    });
  }
  return primary;
}
function primaryRoot(r){
  if(r==='quizArena')return document.querySelector('#screen [data-v48-arena]')||document.querySelector('#screen');
  if(r==='moreLess')return v535EnsureMorePrimary();
  return null;
}
function render(focusAdded=false){
  const r=route();
  if(r!=='quizArena'&&r!=='moreLess')return;
  const screen=document.querySelector('#screen');if(!screen)return;
  const data=db||window.LJR_OFFICIAL_DATA||{};
  const kind=r==='quizArena'?'quiz':'more';

  // Mantener siempre el diseño principal anterior arriba.
  // Solo agregamos los diseños nuevos debajo o los usamos como pantalla secundaria.
  const primary=primaryRoot(r);
  if(!primary)return;
  let mount=document.querySelector('[data-v531-mount="'+kind+'"]');
  if(!mount){
    mount=document.createElement('div');
    mount.className='v531-added-block v535-secondary-block';
    mount.dataset.v531Mount=kind;
    if(kind==='quiz'){mount.id='v612-quiz-portal';document.body.append(mount)}else primary.insertAdjacentElement('afterend',mount);
  }else if(kind!=='quiz'&&primary.nextElementSibling!==mount){
    if(kind==='quiz'){mount.id='v612-quiz-portal';document.body.append(mount)}else primary.insertAdjacentElement('afterend',mount);
  }

  if(r==='quizArena'){
    const open=quiz.mode!=='legacy';
    document.body.classList.toggle('v537-quiz-secondary-open',open);
    document.body.classList.remove('v537-more-secondary-open');
    document.body.classList.remove('v541-more-pages-open');
    if(!open){
      mount.innerHTML='';
      mount.hidden=true;
    }else{
      mount.hidden=false;
      mount.style.display='block';
      mount.innerHTML=quiz.mode==='splash'?quizSplash():quiz.mode==='hub'?quizHub(data):quiz.mode==='countdown'?quizCountdown(data):quiz.mode==='game'?quizGame(data):quizResult(data);
    }
  }else{
    const open=more.mode!=='legacy';
    document.body.classList.toggle('v537-more-secondary-open',open);
    document.body.classList.toggle('v541-more-pages-open',open);
    document.body.classList.remove('v537-quiz-secondary-open');
    if(!open){
      mount.innerHTML='';
      mount.hidden=true;
      delete mount.dataset.v541Open;
    }else{
      mount.hidden=false;
      mount.dataset.v541Open='true';
      mount.style.display='block';
      mount.innerHTML=more.mode==='hub'?moreHub(data):moreGame(data);
    }
  }

  setGamesNav();
  if(focusAdded&&!mount.hidden)requestAnimationFrame(function(){
    mount.scrollTop=0;
    window.scrollTo({top:0,left:0,behavior:'auto'});
  });
}
function v543EnsureMorePortal(){
  let portal=document.querySelector('#v543-moreless-portal');
  if(!portal){
    portal=document.createElement('div');
    portal.id='v543-moreless-portal';
    portal.className='v543-moreless-portal';
    portal.hidden=true;
    document.body.appendChild(portal);
  }
  return portal;
}
function v543RenderMorePortal(){
  if(route()!=='moreLess'&&route()!=='moreLessGallery')return;
  const portal=v543EnsureMorePortal();
  const data=db||window.LJR_OFFICIAL_DATA||{};
  portal.hidden=false;
  portal.style.display='block';
  portal.innerHTML=more.mode==='hub'?moreHub(data):moreGame(data);
  document.body.classList.add('v543-more-portal-open');
  setGamesNav();
  requestAnimationFrame(function(){portal.scrollTop=0});
}
function v543CloseMorePortal(){
  v538ClearTimers();
  more.mode='legacy';
  more.phase='intro';
  more.answered=false;
  more.selected='';
  more.exit=false;
  document.body.classList.remove('v543-more-portal-open');
  const portal=document.querySelector('#v543-moreless-portal');
  if(portal){portal.innerHTML='';portal.hidden=true;portal.style.display='none'}
  const mount=document.querySelector('[data-v531-mount="more"]');
  if(mount){mount.innerHTML='';mount.hidden=true;delete mount.dataset.v541Open}
  document.body.classList.remove('v537-more-secondary-open','v541-more-pages-open');
  if(route()==='moreLessGallery'){
    const gallery=document.querySelector('[data-v546-gallery]');
    if(gallery)delete gallery.dataset.v546Stamp;
    v546RenderGallery();
  }
  setGamesNav();
}
function v541OpenMorePages(){
  v538ClearTimers();
  more.mode='hub';
  more.phase='intro';
  more.answered=false;
  more.selected='';
  more.exit=false;
  document.body.classList.add('v537-more-secondary-open','v541-more-pages-open','v543-more-portal-open');
  v543RenderMorePortal();
}
function v541OpenQuizPages(){
  v614ClearQuizCountdown();
  quiz.mode='splash';
  quiz.answered=false;
  quiz.selected='';
  quiz.exit=false;
  render(false);
  const mount=document.querySelector('[data-v531-mount="quiz"]');
  if(mount){
    mount.hidden=false;
    mount.dataset.v541Open='true';
    mount.style.display='block';
    mount.scrollTop=0;
  }
  document.body.classList.add('v537-quiz-secondary-open');
}
window.LJR_V541_GAMES_API={
  openMorePages:v541OpenMorePages,
  openQuizPages:v541OpenQuizPages,
  closeMorePages:function(){v538ClearTimers();more.mode='legacy';more.exit=false;render(false)},
  closeQuizPages:function(){v614ClearQuizCountdown();quiz.mode='splash';quiz.exit=false;render(false)}
};
if(window.__LJR_V541_PENDING_MORE__){window.__LJR_V541_PENDING_MORE__=false;requestAnimationFrame(v541OpenMorePages)}
if(window.__LJR_V541_PENDING_QUIZ__){window.__LJR_V541_PENDING_QUIZ__=false;requestAnimationFrame(v541OpenQuizPages)}

/* V544: respaldo táctil para Android/Chrome.
   Cualquier monito del diseño principal abre los diseños Drive aunque otro handler
   antiguo capture el click después. */
let v544LastPrimaryOpen=0;
function v544PrimaryPointerOpen(e){
  if(!(e.target instanceof Element))return;
  const now=Date.now();
  const r=route();
  if(r==='moreLess'){
    const hit=e.target.closest('[data-v531-more-open], .v12-ml-choice > button, .v12-avatar');
    if(hit&&hit.closest('[data-v12-moreless]')){
      if(now-v544LastPrimaryOpen<350)return;
      v544LastPrimaryOpen=now;
      e.preventDefault();
      e.stopPropagation();
      if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();
      try{
        if(window.LJR_APP_ROUTER&&typeof window.LJR_APP_ROUTER.go==='function')window.LJR_APP_ROUTER.go('moreLessGallery');
        else location.hash='#/moreLessGallery';
      }catch(_){location.hash='#/moreLessGallery'}
      return;
    }
  }
  if(r==='quizArena'){
    const hit=e.target.closest('[data-v48-quiz]');
    if(hit&&hit.closest('[data-v48-arena]')){
      if(now-v544LastPrimaryOpen<350)return;
      v544LastPrimaryOpen=now;
      e.preventDefault();
      e.stopPropagation();
      quiz.selected='';
      quiz.answered=false;
      quiz.mode='hub';
      quiz.exit=false;
      render(true);
    }
  }
}
document.addEventListener('pointerup',v544PrimaryPointerOpen,true);

function share(){
  const p={title:'Liga Juventino Rosas',text:'Juega Quiz Arena y Más o Menos en la app de la Liga.',url:location.href};
  if(navigator.share)navigator.share(p).catch(function(){});
  else navigator.clipboard?.writeText(location.href).catch(function(){});
}
function v546RenderGallery(){
  if(route()!=='moreLessGallery')return;
  const screen=document.querySelector('#screen');if(!screen)return;
  const data=window.LJR_OFFICIAL_DATA||db||{};
  const stamp=String(data?.captured_at_utc||data?.updated_at||Object.keys(data?.categories||{}).length||'empty');
  const existing=screen.querySelector('[data-v546-gallery]');
  if(existing&&existing.dataset.v546Stamp===stamp){
    setGamesNav();
    return;
  }
  v538ClearTimers();
  more.mode='hub';
  more.phase='intro';
  more.answered=false;
  more.selected='';
  more.exit=false;
  document.body.classList.remove('v537-more-secondary-open','v541-more-pages-open','v543-more-portal-open');
  const oldPortal=document.querySelector('#v543-moreless-portal');
  if(oldPortal){oldPortal.innerHTML='';oldPortal.hidden=true;oldPortal.style.display='none'}
  screen.innerHTML='<div class="v543-moreless-portal v546-inline-gallery" data-v546-gallery data-v546-stamp="'+esc(stamp)+'">'+moreHub(data)+'</div>';
  try{window.LJR_PLAYER_MEDIA?.enhance?.(screen)}catch(_){}
  setGamesNav();
  requestAnimationFrame(function(){window.scrollTo({top:0,left:0,behavior:'auto'})});
}
let v534LastRoute='';
function schedule(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    const r=route();
    if(r==='moreLessGallery'){
      v534LastRoute=r;
      v546RenderGallery();
      return;
    }
    if(r!=='quizArena'&&r!=='moreLess'){
      v614ClearQuizCountdown();
      document.querySelector('#v612-quiz-portal')?.remove();document.body.classList.remove('v537-quiz-secondary-open');
      v534LastRoute=r;
      if(document.body.classList.contains('v543-more-portal-open'))v543CloseMorePortal();
      return;
    }
    const primary=primaryRoot(r);
    if(!primary){
      window.setTimeout(schedule,70);
      return;
    }
    const entering=v534LastRoute!==r;
    // Al abrir la ruta directamente o regresar desde otra pantalla, montar Quiz Arena.
    // Antes el estado 'legacy' dejaba oculto el portal y parecía que no abría.
    if(r==='quizArena'&&(quiz.mode==='legacy'||entering)){
      v614ClearQuizCountdown();
      quiz.mode='splash';quiz.exit=false;quiz.answered=false;quiz.selected='';
    }
    const kind=r==='quizArena'?'quiz':'more';
    const mount=document.querySelector('[data-v531-mount="'+kind+'"]');
    if(!mount||entering||(r==='quizArena'&&(mount.hidden||!document.body.classList.contains('v537-quiz-secondary-open'))))render(false);
    if(v534LastRoute!==r){
      v534LastRoute=r;
      requestAnimationFrame(function(){window.scrollTo({top:0,left:0,behavior:'auto'})});
    }
  })});
}
document.addEventListener('click',function(e){
  const v766Start=e.target.closest('[data-v766-quiz-open]');
  if(route()==='quizArena'&&v766Start){
    e.preventDefault();
    e.stopPropagation();
    v614ClearQuizCountdown();
    quiz.mode='hub';
    quiz.answered=false;
    quiz.selected=String(v766Start.getAttribute('data-answer')||'');
    quiz.exit=false;
    render(true);
    return;
  }

  if(!(e.target instanceof Element))return;
  if(route()==='quizArena'&&e.target.closest('[data-v1059-open-hub]')){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    quiz.mode='hub';quiz.exit=false;render(false);return;
  }
  if(route()==='quizArena'){
    const menuAction=e.target.closest('[data-v1057-quiz-menu-toggle],[data-v1057-quiz-share],[data-v1057-quiz-rankings],[data-v1057-quiz-help]');
    if(menuAction){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      const menu=document.querySelector('#v612-quiz-portal [data-v1057-quiz-menu]');
      const toggle=document.querySelector('#v612-quiz-portal [data-v1057-quiz-menu-toggle]');
      if(menuAction.matches('[data-v1057-quiz-menu-toggle]')){
        if(menu){menu.hidden=!menu.hidden;if(toggle)toggle.setAttribute('aria-expanded',String(!menu.hidden))}
        return;
      }
      if(menuAction.matches('[data-v1057-quiz-help]')){
        const help=menu?.querySelector('[data-v1057-quiz-help-content]');
        if(help){help.hidden=!help.hidden;menuAction.setAttribute('aria-expanded',String(!help.hidden))}
        return;
      }
      if(menu){menu.hidden=true;if(toggle)toggle.setAttribute('aria-expanded','false')}
      if(menuAction.matches('[data-v1057-quiz-share]')){share();return}
      if(menuAction.matches('[data-v1057-quiz-rankings]')){go('rankings');return}
    }
    const openedMenu=document.querySelector('#v612-quiz-portal [data-v1057-quiz-menu]:not([hidden])');
    if(openedMenu&&!e.target.closest('[data-v1057-quiz-menu]')){
      openedMenu.hidden=true;
      document.querySelector('#v612-quiz-portal [data-v1057-quiz-menu-toggle]')?.setAttribute('aria-expanded','false');
    }
    const notify=e.target.closest('[data-v1050-notice-open],[data-v1050-notice-dismiss],[data-v1050-notify-close],[data-v1050-notify-allow]');
    if(notify){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(notify.matches('[data-v1050-notice-open]')){v1050NotifyOpen=true;render(false);return}
      if(notify.matches('[data-v1050-notice-dismiss]')){
        try{localStorage.setItem(V1050_NOTIFY_KEY,'1')}catch(_){}
        v1050NotifyOpen=false;render(false);return;
      }
      if(notify.matches('[data-v1050-notify-close]')){v1050NotifyOpen=false;render(false);return}
      if(notify.matches('[data-v1050-notify-allow]')){
        const state=document.querySelector('[data-v1050-notify-status]');
        if(!('Notification' in window)||!window.isSecureContext){
          if(state)state.textContent='Tu navegador no permite notificaciones locales en este dispositivo.';
          return;
        }
        const done=async permission=>{
          if(permission==='granted'){
            const reg=await v1055RegisterQuizNotices();
            if(!reg&&navigator.serviceWorker?.register){
              if(state)state.textContent='Se concedió permiso, pero no se pudo activar el aviso local. Reintenta.';
              return;
            }
            try{localStorage.setItem(V1050_NOTIFY_KEY,'1')}catch(_){}
            v1050NotifyOpen=false;render(false);
          }else if(state){state.textContent=permission==='denied'?'Notificaciones bloqueadas: actívalas en los permisos del navegador.':'No se activaron; puedes seguir jugando sin notificaciones.'}
        };
        try{const result=Notification.requestPermission();if(result&&typeof result.then==='function')result.then(done).catch(()=>{if(state)state.textContent='No se pudieron habilitar las notificaciones.'});else if(typeof result==='string')done(result)}
        catch(_){if(state)state.textContent='No se pudo solicitar permiso en este dispositivo.'}
        return;
      }
    }
  }

  /* V536: al tocar cualquiera de los dos monitos del cuadro principal
     de Más o Menos se abren los otros diseños de las referencias Drive. */
  const moreMonito=e.target.closest('[data-v531-more-open], .v12-ml-choice > button, .v12-avatar');
  if(route()==='moreLess'&&moreMonito&&moreMonito.closest('[data-v12-moreless]')){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    location.hash='#/moreLessGallery';
    return;
  }

  /* V533: los diseños anteriores son la portada principal.
     Al tocarlos, abren debajo las pantallas nuevas de las referencias Drive. */
  const oldQuiz=e.target.closest('[data-v48-quiz]');
  if(route()==='quizArena'&&oldQuiz){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    v614ClearQuizCountdown();quiz.mode='hub';quiz.exit=false;render(true);
    return;
  }
  const oldMore=e.target.closest('[data-v12-choice]');
  if(route()==='moreLess'&&oldMore){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    v541OpenMorePages();
    return;
  }

  const t=e.target.closest('[data-v545-more-screen],[data-v583-more-round],[data-v531-more-open],[data-v48-quiz],[data-v12-choice],[data-v1070-quiz-hub-close],[data-v531-quiz-back],[data-v531-more-back],[data-v531-share],[data-v531-rankings],[data-v531-quiz-start],[data-v531-quiz-close],[data-v531-q-answer],[data-v531-quiz-next],[data-v531-result-back],[data-v531-more-start],[data-v531-more-close],[data-v531-more-choice],[data-v539-more-next],[data-v531-exit-confirm],[data-v531-exit-cancel],[data-v614-countdown-skip],[data-v614-countdown-close]');
  if(!t)return;
  // Controles del diseño principal anterior: no los bloqueamos.
  // Dejamos que su funcionamiento original ocurra y luego abrimos el diseño secundario debajo.
  if(t.matches('[data-v48-quiz]')){
    v614StartQuizCountdown();
    return;
  }
  if(t.matches('[data-v531-more-open],[data-v12-choice]')){
    setTimeout(function(){
      v538ClearTimers();
      more.mode='hub';more.phase='intro';more.answered=false;more.selected='';more.exit=false;
      render(true);
    },0);
    return;
  }

  e.preventDefault();e.stopPropagation();

  if(t.matches('[data-v583-more-round]')){
    moreNewGame();
    more.round=Math.max(0,Number(t.dataset.v583MoreRound)||0);
    more.mode='game';
    more.phase='intro';
    more.answered=false;
    more.selected='';
    more.exit=false;
    more.countdown=15;
    v538StartMoreRound();
    return;
  }

  if(t.matches('[data-v545-more-screen]')){
    v538ClearTimers();
    more.mode='game';
    more.answered=false;
    more.selected='';
    more.countdown=15;
    const screen=t.dataset.v545MoreScreen||'choice';
    if(screen==='reveal'){
      more.phase='first';
      more.exit=false;
    }else if(screen==='exit'){
      more.phase='ready';
      more.exit=true;
    }else{
      more.phase='ready';
      more.exit=false;
    }
    document.body.classList.add('v543-more-portal-open');
    v543RenderMorePortal();
    return;
  }

  if(t.matches('[data-v531-quiz-back],[data-v1070-quiz-hub-close]')){v614ClearQuizCountdown();quiz.mode='splash';quiz.exit=false;render(false);return}
  if(t.matches('[data-v531-more-back]')){
    if(route()==='moreLessGallery'){location.hash='#/moreLess';return}
    v543CloseMorePortal();return
  }
  if(t.matches('[data-v531-share]')){share();return}
  if(t.matches('[data-v531-rankings]')){go('rankings');return}
  if(t.matches('[data-v531-quiz-start]')){
    if(t.closest('[data-v531-view="splash"]')){v614ClearQuizCountdown();quiz.mode='hub';quiz.exit=false;render(true);return}
    v614StartQuizCountdown();return
  }
  if(t.matches('[data-v614-countdown-skip]')){v614OpenQuizGame();return}
  if(t.matches('[data-v614-countdown-close]')){quiz.exit=true;render(false);return}
  if(t.matches('[data-v531-quiz-close]')){quiz.exit=true;v1050NotifyOpen=false;render(false);return}
  if(t.matches('[data-v531-result-back]')){v614ClearQuizCountdown();quiz.mode='hub';quiz.exit=false;render(false);return}
  if(t.matches('[data-v531-q-answer]')){
    const data=db||window.LJR_OFFICIAL_DATA||{},q=quizData(data),pick=t.dataset.v531QAnswer||'';
    if(quiz.answered)return;if(norm(pick)!==norm(q.correct)&&quiz.attempts>1){quiz.attempts--;quiz.missed=quiz.missed||[];quiz.missed.push(pick);t.disabled=true;t.classList.add('is-wrong');return}quiz.selected=pick;quiz.answered=true;
    const ok=norm(pick)===norm(q.correct);
    if(ok)quiz.points+=10;
    if(!Array.isArray(quiz.history))quiz.history=[];
    quiz.history.push(ok?'ok':'bad');
    quiz.mode='result';render(true);return;
  }
  if(t.matches('[data-v531-quiz-next]')){if(quiz.step>=10){quiz.mode='hub';render(true);return}quiz.step++;quiz.selected='';quiz.answered=false;quiz.remaining=15;quiz.attempts=1;quiz.missed=[];quiz.mode='game';render(true);return}
  if(t.matches('[data-v531-more-start]')){moreNewGame();v538StartMoreRound();return}
  if(t.matches('[data-v531-more-close]')){v538ClearTimers();more.exit=true;v543RenderMorePortal();return}
  if(t.matches('[data-v531-more-choice]')){
    if(more.answered||more.phase!=='ready'||more.exit)return;
    const data=db||window.LJR_OFFICIAL_DATA||{},pair=morePair(data);
    const actual=pair.b.goals>pair.a.goals?'more':'less';
    const picked=t.dataset.v531MoreChoice||'less';
    more.selected=picked===actual?'correct':'wrong';
    more.answered=true;more.phase='result';more.roundsPlayed++;
    if(picked===actual)more.points+=10;else more.attempts=Math.max(0,more.attempts-1);
    more.finished=more.attempts===0||more.roundsPlayed>=10;
    if(more.finished)moreSaveScore();
    v538ClearTimers();v543RenderMorePortal();return;
  }
  if(t.matches('[data-v539-more-next]')){
    if(more.finished)moreNewGame();
    more.mode='game';
    more.phase='intro';
    more.answered=false;
    more.selected='';
    more.exit=false;
    more.countdown=15;
    v538StartMoreRound();
    return
  }
  if(t.matches('[data-v531-exit-confirm]')){
    const kind=t.dataset.v531ExitConfirm;
    if(kind==='quiz'){v614ClearQuizCountdown();quiz.mode='hub';quiz.exit=false;quiz.answered=false}
    else{v543CloseMorePortal();return}
    render(false);return;
  }
  if(t.matches('[data-v531-exit-cancel]')){
    const kind=t.dataset.v531ExitCancel;
    if(kind==='quiz'){quiz.exit=false;render(false);return}
    more.exit=false;v543RenderMorePortal();return;
  }
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',function(){db=window.LJR_OFFICIAL_DATA||db;schedule()});
window.addEventListener('load',function(){setTimeout(function(){if(route()==='moreLessGallery'){const g=document.querySelector('[data-v546-gallery]');if(g)delete g.dataset.v546Stamp;v546RenderGallery()}},900)});
const target=document.querySelector('#screen');
if(target)new MutationObserver(schedule).observe(target,{childList:true,subtree:false});
load().then(schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
// One clock for the active question; dialogs pause the countdown.
setInterval(()=>{if(route()!=='quizArena'||quiz.mode!=='game'||quiz.exit||v1050NotifyOpen||quiz.answered)return;
  quiz.remaining=Math.max(0,quiz.remaining-1);const clock=document.querySelector('[data-quiz-timer]');if(clock)clock.textContent=quiz.remaining;
  if(quiz.remaining===0){quiz.selected='';quiz.answered=true;if(!Array.isArray(quiz.history))quiz.history=[];quiz.history.push('bad');quiz.mode='result';render(true)}
},1000);
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape'||route()!=='quizArena')return;
 if(v1050NotifyOpen){event.preventDefault();v1050NotifyOpen=false;render(false)}
 else if(quiz.exit){event.preventDefault();quiz.exit=false;render(false)}
});
window.addEventListener('hashchange',()=>{v1050NotifyOpen=false});
document.addEventListener('click',event=>{
 if(event.target.closest('[data-quiz-login]')){go('accountLogin');return}const half=event.target.closest('[data-quiz-half]'),retry=event.target.closest('[data-quiz-retry]');
 if(half&&!quiz.halfUsed){quiz.halfUsed=true;half.disabled=true;const q=quizData(db||window.LJR_OFFICIAL_DATA||{});Array.from(document.querySelectorAll('[data-v531-q-answer]')).filter(b=>norm(b.dataset.v531QAnswer)!==norm(q.correct)).slice(0,2).forEach(b=>{b.disabled=true;b.style.visibility='hidden'})}
 if(retry&&!quiz.retryUsed){quiz.retryUsed=true;quiz.attempts=2;retry.disabled=true}
});

})();

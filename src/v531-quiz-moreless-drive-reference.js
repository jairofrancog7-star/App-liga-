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
const quiz={mode:'legacy',answered:false,selected:'',points:0,step:1,exit:false,remaining:15,halfUsed:false,retryUsed:false,attempts:1,countdown:3,history:[],missed:[]};
const more={mode:'legacy',answered:false,selected:'',points:0,attempts:2,exit:false,phase:'intro',countdown:15,roundToken:0,round:0,roundsPlayed:0,finished:false,scoreSaved:false};
let v538MoreTimers=[];
let v538MoreInterval=null;
let v614QuizCountdownTimer=null;
let v1050NotifyOpen=false;
const V1050_NOTIFY_KEY='ljr-quiz-notice-dismissed';
function v1050NoticeAvailable(){try{return localStorage.getItem(V1050_NOTIFY_KEY)!=='1'&&(!('Notification' in window)||Notification.permission!=='granted')}catch(_){return true}}
function v1050LocalNotice(body){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  const title='Quiz Arena · Liga Juventino Rosas',options={body,tag:'ljr-quiz-result'};
  try{
    if(navigator.serviceWorker?.getRegistration){
      navigator.serviceWorker.getRegistration().then(reg=>{
        if(reg?.showNotification)reg.showNotification(title,options).catch(()=>{});
      }).catch(()=>{});
    }else new Notification(title,options);
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
  const rows=standings(data);const scorersList=scorers(data);const questions=[];
  for(let i=0;i<Math.min(4,rows.length);i++)questions.push({question:'¿Qué equipo ocupa el '+(i+1)+'º lugar en esta categoría?',correct:String(rows[i][1]),pool:rows.map(r=>String(r[1]))});
  if(scorersList.length>=4)questions.push({question:'¿Quién lidera el goleo de esta categoría?',correct:scorersList[0].name,pool:scorersList.map(r=>r.name)});
  const q=questions[(quiz.step-1)%Math.max(1,questions.length)]||{question:'Esperando los datos oficiales de la Liga.',correct:'',pool:[]};
  const options=[q.correct,...q.pool.filter(x=>norm(x)!==norm(q.correct)).slice(0,3)].filter(Boolean);
  // Rotate the answer position, keeping the questions tied to published data.
  if(options.length)for(let i=0;i<quiz.step%options.length;i++)options.push(options.shift());
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
  '</section>';
}
function v614StartQuizCountdown(){
  v614ClearQuizCountdown();
  quiz.mode='countdown';quiz.answered=false;quiz.selected='';quiz.exit=false;quiz.remaining=15;quiz.step=1;quiz.points=0;quiz.halfUsed=false;quiz.retryUsed=false;quiz.attempts=1;quiz.countdown=3;quiz.history=[];quiz.missed=[];
  render(true);
  v614QuizCountdownTimer=setInterval(function(){
    if(route()!=='quizArena'||quiz.mode!=='countdown'){v614ClearQuizCountdown();return}
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
function quizHub(data){
  const ranks=rankRows(data);
  const q=quizData(data);
  return '<section class="v531-page v531-quiz" data-v531-quiz data-v531-view="hub">'+
    '<header class="v531-mini-head"><button type="button" data-v531-quiz-back aria-label="Volver">'+backSvg()+'</button><strong>Quiz Arena</strong><button type="button" data-v531-share aria-label="Compartir">'+shareSvg()+'</button></header>'+
    '<main class="v531-hub-body">'+
      '<article class="v531-quiz-hero">'+
        '<div class="v531-hero-ball" aria-hidden="true"><i></i><i></i><i></i></div>'+
        '<div class="v531-quiz-hero-copy"><h1>QUIZ<br>ARENA</h1><p>Demuestra cuánto sabes de la Liga Juventino Rosas.</p></div>'+
        '<div class="v531-dual-actions"><button type="button" class="primary" data-quiz-login>Inicia sesión para<br>jugar</button><button type="button" data-v531-quiz-start>Prueba como<br>invitado</button></div>'+
      '</article>'+
      '<div class="v531-discover"><span>★</span><b>DESCUBRE MÁS</b><em>LIGA JUVENTINO</em></div>'+
      '<article class="v531-friend-card"><div><h2>¡Reta a tus amigos en el Quiz Arena!</h2><button type="button" data-v531-share>Invita a amigos</button></div><div class="v531-friend-avatar">'+crest(q.correct,data,'friend')+'</div></article>'+
      '<article class="v531-quiz-random-card">'+
        '<div class="v531-random-photo"><img src="'+esc(FEATURE)+'" alt="" loading="lazy" decoding="async"><span>'+crest(q.correct,data,'random')+'</span></div>'+
        '<div class="v531-random-copy"><h2>Quiz Aleatorio</h2><p>Ponte a prueba con preguntas sobre equipos, clasificación y temporada.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-quiz-login>Inicia sesión para<br>jugar</button><button type="button" data-v531-quiz-start>Prueba como<br>invitado</button></div></div>'+
      '</article>'+
      '<h2 class="v531-section-title">Clasificación de la Liga</h2>'+
      '<article class="v531-rank-card"><h3>Tabla oficial de la Liga</h3>'+ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'º</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+'<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
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
      '<article class="v531-question-card v614-question-card"><div class="v531-question-media v614-question-media"><img src="'+esc(QUIZ_STADIUM)+'" alt="" loading="eager" decoding="async"><p>'+esc(q.question)+'</p></div><div class="v531-q-grid v614-q-grid">'+options+'</div></article>'+
      '<div class="v614-league-band"><img src="'+esc(LEAGUE)+'" alt=""><span><b>LIGA JUVENTINO ROSAS</b><small>FÚTBOL MUNICIPAL</small></span></div>'+
      '<div class="v531-turbos v614-turbos"><button data-quiz-half '+(quiz.halfUsed?'disabled':'')+'><small>Tus turbos</small><b><span class="v617-turbo-icon">'+v617LightningIcon()+'</span><span>50-50</span></b></button><button data-quiz-retry '+(quiz.retryUsed?'disabled':'')+'><small>Turbo</small><b><span class="v617-turbo-icon">'+v617BallIcon()+'</span><span>2 intentos</span></b></button></div>'+v1050NotifyCard()+
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
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken)return;more.phase='first';v543RenderMorePortal()},650));
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken)return;more.phase='both';v543RenderMorePortal()},1350));
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken)return;more.phase='ready';v543RenderMorePortal()},2100));
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
        (intro?'<div class="v538-stage-placeholder"><span></span><i></i></div>':'')+
        (!intro?'<div class="v538-player-pair">'+playerCard(pair.a,data,true,'left')+(both?playerCard(pair.b,data,more.answered,'right'):'<div class="v538-player-card ghost right"><div class="v538-ghost-avatar"></div></div>')+'</div>':'')+
      '</div>'+
      '<div class="v538-score-strip"><span><small>Intentos</small><b>'+Array.from({length:Math.max(0,more.attempts)},function(){return '⚽'}).join(' ')+'</b></span><strong class="v538-countdown">'+more.countdown+'</strong><span><small>Puntuación</small><b>'+more.points+' pts</b></span></div>'+
      '<div class="v538-question-zone '+(ready?'show':'')+'">'+
        '<h2>'+question+'</h2>'+
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
  if(r==='quizArena')return document.querySelector('#screen [data-v48-arena]');
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
      mount.innerHTML=quiz.mode==='hub'?quizHub(data):quiz.mode==='countdown'?quizCountdown(data):quiz.mode==='game'?quizGame(data):quizResult(data);
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
  quiz.mode='hub';
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
  closeQuizPages:function(){v614ClearQuizCountdown();quiz.mode='legacy';quiz.exit=false;render(false)}
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
      quiz.mode='game';
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
    const kind=r==='quizArena'?'quiz':'more';
    if(!document.querySelector('[data-v531-mount="'+kind+'"]'))render(false);
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
  if(route()==='quizArena'){
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
        const done=permission=>{
          if(permission==='granted'){
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
    v614StartQuizCountdown();
    return;
  }
  const oldMore=e.target.closest('[data-v12-choice]');
  if(route()==='moreLess'&&oldMore){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    v541OpenMorePages();
    return;
  }

  const t=e.target.closest('[data-v545-more-screen],[data-v583-more-round],[data-v531-more-open],[data-v48-quiz],[data-v12-choice],[data-v531-quiz-back],[data-v531-more-back],[data-v531-share],[data-v531-rankings],[data-v531-quiz-start],[data-v531-quiz-close],[data-v531-q-answer],[data-v531-quiz-next],[data-v531-result-back],[data-v531-more-start],[data-v531-more-close],[data-v531-more-choice],[data-v539-more-next],[data-v531-exit-confirm],[data-v531-exit-cancel],[data-v614-countdown-skip],[data-v614-countdown-close]');
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

  if(t.matches('[data-v531-quiz-back]')){v614ClearQuizCountdown();quiz.mode='hub';quiz.exit=false;go('more');return}
  if(t.matches('[data-v531-more-back]')){
    if(route()==='moreLessGallery'){location.hash='#/moreLess';return}
    v543CloseMorePortal();return
  }
  if(t.matches('[data-v531-share]')){share();return}
  if(t.matches('[data-v531-rankings]')){go('rankings');return}
  if(t.matches('[data-v531-quiz-start]')){v614StartQuizCountdown();return}
  if(t.matches('[data-v614-countdown-skip]')){v614OpenQuizGame();return}
  if(t.matches('[data-v614-countdown-close]')){v614ClearQuizCountdown();quiz.mode='hub';quiz.exit=false;render(false);return}
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
  if(t.matches('[data-v531-quiz-next]')){if(quiz.step>=10){v1050LocalNotice('Terminaste el quiz con '+quiz.points+' puntos. ¡Vuelve a jugar!');quiz.mode='hub';render(true);return}quiz.step++;quiz.selected='';quiz.answered=false;quiz.remaining=15;quiz.attempts=1;quiz.missed=[];quiz.mode='game';render(true);return}
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

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

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const DATA_LOCAL='./data/official-live.json?v=20261001-v531-games';
const DATA_REMOTE=RAW+'data/official-live.json?v=20261001-v531-games';
const LEAGUE=RAW+'assets/liga-logo.webp';
const FEATURE=RAW+'media/gran-final-veteranos-35.png';
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
const quiz={mode:'legacy',answered:false,selected:'',points:0,step:1,exit:false};
const more={mode:'legacy',answered:false,selected:'',points:0,attempts:2,exit:false,phase:'intro',countdown:15,roundToken:0,round:0};
let v538MoreTimers=[];
let v538MoreInterval=null;

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
  const rows=standings(data);
  const correct=String(rows[0]?.[1]||'SAN JOSE FC');
  const names=[];
  rows.slice(0,8).forEach(function(r){if(r[1]&&!names.some(function(x){return norm(x)===norm(r[1])}))names.push(String(r[1]))});
  ['SAN JOSE FC','JUVENTUS','HERMANOS','LINCES'].forEach(function(n){if(!names.some(function(x){return norm(x)===norm(n)}))names.push(n)});
  const options=[correct].concat(names.filter(function(x){return norm(x)!==norm(correct)}).slice(0,3));
  return {correct:correct,options:options.slice(0,4),leader:rows[0]||null};
}
function morePair(data){
  const list=scorers(data);
  const pairs=[];
  for(let i=0;i<list.length;i++){
    for(let j=i+1;j<list.length;j++){
      if(list[i].goals!==list[j].goals)pairs.push({a:list[i],b:list[j],kind:'player'});
      if(pairs.length>=12)break;
    }
    if(pairs.length>=12)break;
  }
  if(pairs.length)return pairs[Math.abs(Number(more.round)||0)%pairs.length];
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
function backSvg(){return '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M18 6 10 14l8 8M10.5 14H24"/></svg>'}
function closeSvg(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'}
function shareSvg(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/></svg>'}
function quizLogo(){
  return '<div class="v531-quiz-logo"><span>QUIZ</span><span>ARENA</span><i></i><b></b></div>';
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
        '<div class="v531-dual-actions"><button type="button" class="primary" data-v531-quiz-start>Inicia sesión para<br>jugar</button><button type="button" data-v531-quiz-start>Prueba como<br>invitado</button></div>'+
      '</article>'+
      '<div class="v531-discover"><span>★</span><b>DESCUBRE MÁS</b><em>LIGA JUVENTINO</em></div>'+
      '<article class="v531-friend-card"><div><h2>¡Reta a tus amigos en el Quiz Arena!</h2><button type="button" data-v531-share>Invita a amigos</button></div><div class="v531-friend-avatar">'+crest(q.correct,data,'friend')+'</div></article>'+
      '<article class="v531-quiz-random-card">'+
        '<div class="v531-random-photo"><img src="'+esc(FEATURE)+'" alt="" loading="lazy" decoding="async"><span>'+crest(q.correct,data,'random')+'</span></div>'+
        '<div class="v531-random-copy"><h2>Quiz Aleatorio</h2><p>Ponte a prueba con preguntas sobre equipos, clasificación y temporada.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-v531-quiz-start>Inicia sesión para<br>jugar</button><button type="button" data-v531-quiz-start>Prueba como<br>invitado</button></div></div>'+
      '</article>'+
      '<h2 class="v531-section-title">Clasificaciones</h2>'+
      '<article class="v531-rank-card"><h3>Quiz Aleatorio</h3>'+ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'º</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+'<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
    '</main>'+
  '</section>';
}
function quizGame(data){
  const q=quizData(data);
  const progress=Math.min(12,quiz.step);
  const dots=Array.from({length:10},function(_,i){return '<i class="'+(i<Math.min(10,progress-1)?'done':'')+'"></i>'}).join('');
  const options=q.options.map(function(name,i){
    const letter=String.fromCharCode(65+i);
    return '<button type="button" class="v531-q-answer" data-v531-q-answer="'+esc(name)+'"><span>'+letter+'</span><b>'+esc(name)+'</b></button>';
  }).join('');
  return '<section class="v531-page v531-quiz v531-game-screen" data-v531-quiz data-v531-view="game">'+
    '<header class="v531-game-head"><strong>Quiz Aleatorio</strong><button type="button" data-v531-quiz-close aria-label="Cerrar">'+closeSvg()+'</button></header>'+
    '<div class="v531-scorebar"><span class="v531-progress-number">'+progress+'</span><div class="v531-progress-dots">'+dots+'</div><span class="v531-score-total"><small>Total</small><b>'+quiz.points+' pts</b></span></div>'+
    '<main class="v531-q-main">'+
      '<article class="v531-question-card"><div class="v531-question-media"><img src="'+esc(FEATURE)+'" alt="" loading="eager" decoding="async"><div class="v531-question-crest">'+crest(q.correct,data,'question')+'</div><p>¿Qué equipo ocupa actualmente el primer lugar de la clasificación?</p></div><div class="v531-q-grid">'+options+'</div></article>'+
      '<div class="v531-promo"><b>VIVE LA LIGA</b><em>JUVENTINO ROSAS</em></div>'+
      '<div class="v531-turbos"><span><small>Tus turbos</small><b>⚡ 50-50</b></span><span><small>Intentos</small><b>⚽ 2 intentos</b></span></div>'+
    '</main>'+
    (quiz.exit?exitModal('quiz'):'')+
  '</section>';
}
function quizResult(data){
  const q=quizData(data);
  return '<section class="v531-page v531-quiz v531-result-screen v534-result-clean" data-v531-quiz data-v531-view="result">'+
    '<header class="v531-result-head"><button type="button" data-v531-result-back aria-label="Volver">'+backSvg()+'</button></header>'+
    quizLogo()+
    '<div class="v534-result-status"><span>✓</span><b>Respuesta correcta</b><strong>'+esc(q.correct)+'</strong></div>'+
    '<button type="button" class="v531-next-btn" data-v531-quiz-next>Siguiente pregunta</button>'+
  '</section>';
}
function v538PlayerPhoto(name,team){
  try{
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
  if(photo)return '<span class="v538-person '+esc(cls||'')+'"><img src="'+esc(photo)+'" alt="'+esc(p.name)+'" loading="eager" decoding="async"></span>';
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
  const pair=morePair(data),ranks=rankRows(data);
  return '<section class="v531-page v531-more v538-more-hub v551-more-reference" data-v531-more data-v531-view="hub">'+
    '<header class="v531-mini-head v538-more-head"><button type="button" data-v531-more-back aria-label="Volver">'+backSvg()+'</button><strong>More or Less</strong><span></span></header>'+
    '<main class="v538-hub-body">'+
      '<article class="v538-hub-feature">'+
        '<div class="v538-hub-feature-art">'+v538Person(pair.a,data,'left')+v538Person(pair.b,data,'right')+'</div>'+
        '<div class="v538-hub-feature-copy"><h2>Más o menos</h2><p>Compara las estadísticas de dos jugadores y ¡ponlas en el orden correcto para ganar puntos!</p>'+
          '<div class="v538-hub-actions"><button type="button" class="primary" data-v531-more-start>Inicia sesión para<br>jugar</button></div>'+
        '</div>'+
      '</article>'+
      '<div class="v551-discover-banner"><span>◉</span><b>DESCUBRE MÁS</b><em>LIGA JUVENTINO</em></div>'+
      '<article class="v538-friend-card"><div><h3>¡Reta a tus amigos en el Quiz Arena!</h3><button type="button" data-v531-share>Invita a amigos</button></div><div class="v538-friend-bubble">'+v538Person(pair.a,data,'friend')+'</div></article>'+
      '<h2 class="v531-section-title v551-ranking-title">Clasificaciones</h2>'+
      '<article class="v531-rank-card v551-more-ranking"><h3>Más o menos</h3>'+ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'º</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+'<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
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
    '<h2 class="v531-section-title">Clasificaciones</h2>'+
    '<article class="v531-rank-card"><h3>Quiz Aleatorio</h3>'+ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'º</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+'<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
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
    '<h2 class="v531-section-title">Clasificaciones</h2>'+
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
  more.mode='game';more.phase='intro';more.answered=false;more.selected='';more.exit=false;more.countdown=15;
  document.body.classList.add('v543-more-portal-open');
  v543RenderMorePortal();
  v538MoreInterval=setInterval(function(){
    if(token!==more.roundToken||more.mode!=='game'){v538ClearTimers();return}
    more.countdown=Math.max(0,more.countdown-1);
    document.querySelectorAll('.v538-countdown').forEach(function(el){el.textContent=String(more.countdown)});
    if(more.countdown<=0&&v538MoreInterval){clearInterval(v538MoreInterval);v538MoreInterval=null}
  },1000);
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken)return;more.phase='first';v543RenderMorePortal()},650));
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken)return;more.phase='both';v543RenderMorePortal()},1350));
  v538MoreTimers.push(setTimeout(function(){if(token!==more.roundToken)return;more.phase='ready';v543RenderMorePortal()},2100));
}
function moreGame(data){
  const pair=morePair(data);
  const question=pair.kind==='player'
    ?'¿Ha marcado '+esc(pair.b.name)+' más o menos goles que '+esc(pair.a.name)+'?'
    :'¿Tiene '+esc(pair.b.name)+' más o menos goles a favor que '+esc(pair.a.name)+'?';
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
      '<div class="v538-score-strip"><span><small>Attempts</small><b>'+Array.from({length:Math.max(0,more.attempts)},function(){return '⚽'}).join(' ')+'</b></span><strong class="v538-countdown">'+more.countdown+'</strong><span><small>Puntuación</small><b>'+more.points+' pts</b></span></div>'+
      '<div class="v538-question-zone '+(ready?'show':'')+'">'+
        '<h2>'+question+'</h2>'+
        '<div class="v531-more-buttons"><button type="button" class="less" data-v531-more-choice="less" aria-label="Menos">▼</button><span>OR</span><button type="button" class="more" data-v531-more-choice="more" aria-label="Más">▲</button></div>'+
        (more.answered?'<div class="v531-more-answer">'+(more.selected==='correct'?'¡Correcto!':'Respuesta registrada')+' · '+esc(pair.b.name)+' tiene '+esc(pair.b.goals)+'</div>':'')+
      '</div>'+
      (result?'<section class="v539-more-result '+(more.selected==='correct'?'ok':'bad')+'"><span class="v539-result-mark">'+(more.selected==='correct'?'✓':'×')+'</span><div><small>RESULTADO</small><h3>'+(more.selected==='correct'?'¡Acertaste!':'Siguiente intento')+'</h3><p>'+esc(pair.a.name)+' · '+esc(pair.a.goals)+' / '+esc(pair.b.name)+' · '+esc(pair.b.goals)+'</p></div><button type="button" data-v539-more-next>Siguiente comparación</button></section>':'')+
      '<div class="v538-video-banner"><b>VER</b><em>MEJORES MOMENTOS</em><span>⚽</span></div>'+
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
      '<button type="button" data-v12-choice="more" aria-label="Elegir más">'+v535AvatarSvg('#c776e8')+'</button>'+
      '<div class="v12-ml-mid"><button type="button" data-v12-choice="more" class="up-arrow" aria-label="Más">▲</button><button type="button" data-v12-choice="less" class="down-arrow" aria-label="Menos">▼</button></div>'+
      '<button type="button" data-v12-choice="less" aria-label="Elegir menos">'+v535AvatarSvg('#77f1ea')+'</button>'+
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
  let mount=screen.querySelector('[data-v531-mount="'+kind+'"]');
  if(!mount){
    mount=document.createElement('div');
    mount.className='v531-added-block v535-secondary-block';
    mount.dataset.v531Mount=kind;
    primary.insertAdjacentElement('afterend',mount);
  }else if(primary.nextElementSibling!==mount){
    primary.insertAdjacentElement('afterend',mount);
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
      mount.innerHTML=quiz.mode==='hub'?quizHub(data):quiz.mode==='game'?quizGame(data):quizResult(data);
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
  closeQuizPages:function(){quiz.mode='legacy';quiz.exit=false;render(false)}
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
      location.hash='#/moreLessGallery';
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
  if(screen.querySelector('[data-v546-gallery]')){
    setGamesNav();
    return;
  }
  const data=db||window.LJR_OFFICIAL_DATA||{};
  v538ClearTimers();
  more.mode='hub';
  more.phase='intro';
  more.answered=false;
  more.selected='';
  more.exit=false;
  document.body.classList.remove('v537-more-secondary-open','v541-more-pages-open','v543-more-portal-open');
  const oldPortal=document.querySelector('#v543-moreless-portal');
  if(oldPortal){oldPortal.innerHTML='';oldPortal.hidden=true;oldPortal.style.display='none'}
  screen.innerHTML='<div class="v543-moreless-portal v546-inline-gallery" data-v546-gallery>'+moreHub(data)+'</div>';
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
  if(!(e.target instanceof Element))return;

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
    quiz.selected='';
    quiz.answered=false;
    quiz.mode='game';
    quiz.exit=false;
    render(true);
    return;
  }
  const oldMore=e.target.closest('[data-v12-choice]');
  if(route()==='moreLess'&&oldMore){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    v541OpenMorePages();
    return;
  }

  const t=e.target.closest('[data-v545-more-screen],[data-v531-more-open],[data-v48-quiz],[data-v12-choice],[data-v531-quiz-back],[data-v531-more-back],[data-v531-share],[data-v531-rankings],[data-v531-quiz-start],[data-v531-quiz-close],[data-v531-q-answer],[data-v531-quiz-next],[data-v531-result-back],[data-v531-more-start],[data-v531-more-close],[data-v531-more-choice],[data-v539-more-next],[data-v531-exit-confirm],[data-v531-exit-cancel]');
  if(!t)return;
  // Controles del diseño principal anterior: no los bloqueamos.
  // Dejamos que su funcionamiento original ocurra y luego abrimos el diseño secundario debajo.
  if(t.matches('[data-v48-quiz]')){
    quiz.selected='';
    quiz.answered=false;
    quiz.mode='game';
    quiz.exit=false;
    setTimeout(function(){render(true)},0);
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

  if(t.matches('[data-v531-quiz-back]')){quiz.mode='legacy';quiz.exit=false;render(false);return}
  if(t.matches('[data-v531-more-back]')){
    if(route()==='moreLessGallery'){location.hash='#/moreLess';return}
    v543CloseMorePortal();return
  }
  if(t.matches('[data-v531-share]')){share();return}
  if(t.matches('[data-v531-rankings]')){go('rankings');return}
  if(t.matches('[data-v531-quiz-start]')){quiz.mode='game';quiz.answered=false;quiz.exit=false;render(true);return}
  if(t.matches('[data-v531-quiz-close]')){quiz.exit=true;render(true);return}
  if(t.matches('[data-v531-result-back]')){quiz.mode='legacy';quiz.exit=false;render(false);return}
  if(t.matches('[data-v531-q-answer]')){
    const data=db||window.LJR_OFFICIAL_DATA||{},q=quizData(data),pick=t.dataset.v531QAnswer||'';
    quiz.selected=pick;quiz.answered=true;
    if(norm(pick)===norm(q.correct))quiz.points+=10;
    quiz.mode='result';render(true);return;
  }
  if(t.matches('[data-v531-quiz-next]')){quiz.step=Math.min(12,quiz.step+1);quiz.selected='';quiz.answered=false;quiz.mode='game';render(true);return}
  if(t.matches('[data-v531-more-start]')){v538StartMoreRound();return}
  if(t.matches('[data-v531-more-close]')){v538ClearTimers();more.exit=true;v543RenderMorePortal();return}
  if(t.matches('[data-v531-more-choice]')){
    if(more.answered)return;
    const data=db||window.LJR_OFFICIAL_DATA||{},pair=morePair(data);
    const actual=pair.b.goals>pair.a.goals?'more':'less';
    const picked=t.dataset.v531MoreChoice||'less';
    more.selected=picked===actual?'correct':'wrong';
    more.answered=true;more.phase='result';
    if(picked===actual)more.points+=10;else more.attempts=Math.max(0,more.attempts-1);
    v538ClearTimers();v543RenderMorePortal();return;
  }
  if(t.matches('[data-v539-more-next]')){v538StartMoreRound();return}
  if(t.matches('[data-v531-exit-confirm]')){
    const kind=t.dataset.v531ExitConfirm;
    if(kind==='quiz'){quiz.mode='legacy';quiz.exit=false;quiz.answered=false}
    else{v543CloseMorePortal();return}
    render(false);return;
  }
  if(t.matches('[data-v531-exit-cancel]')){
    const kind=t.dataset.v531ExitCancel;
    if(kind==='quiz'){quiz.exit=false;render(true);return}
    more.exit=false;v543RenderMorePortal();return;
  }
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',function(){db=window.LJR_OFFICIAL_DATA||db;schedule()});
const target=document.querySelector('#screen');
if(target)new MutationObserver(schedule).observe(target,{childList:true,subtree:false});
load().then(schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();

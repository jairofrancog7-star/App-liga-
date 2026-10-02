/* V531 — Quiz Arena + Más o Menos reconstruidos desde las referencias de Google Drive del usuario.
   Unifica hub, juego, resultado y modal de salida sin incrustar las capturas. */
(function(){
'use strict';
if(window.__LJR_V531_GAMES__)return;
window.__LJR_V531_GAMES__=true;

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
const quiz={mode:'hub',answered:false,selected:'',points:0,step:1,exit:false};
const more={mode:'hub',answered:false,selected:'',points:0,attempts:2,exit:false};

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
  for(let i=0;i<list.length;i++){
    for(let j=i+1;j<list.length;j++){
      if(list[i].goals!==list[j].goals)return {a:list[i],b:list[j],kind:'player'};
    }
  }
  const rows=standings(data);
  const a={name:String(rows[0]?.[1]||'SAN JOSE FC'),team:String(rows[0]?.[1]||'SAN JOSE FC'),goals:Number(rows[0]?.[6])||0};
  const b={name:String(rows[1]?.[1]||'JUVENTUS'),team:String(rows[1]?.[1]||'JUVENTUS'),goals:Number(rows[1]?.[6])||0};
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
  return '<section class="v531-page v531-quiz v531-result-screen" data-v531-quiz data-v531-view="result">'+
    '<header class="v531-result-head"><button type="button" data-v531-result-back aria-label="Volver">'+backSvg()+'</button></header>'+
    quizLogo()+
    '<div class="v531-result-options">'+q.options.map(function(name,i){
      const ok=norm(name)===norm(q.correct);
      const picked=norm(name)===norm(quiz.selected);
      return '<div class="v531-result-option '+(ok?'correct':picked?'wrong':'')+'"><span>'+String.fromCharCode(65+i)+'</span><i></i>'+(ok?'<b>✓</b>':'')+'</div>';
    }).join('')+'</div>'+
    '<div class="v531-correct-pill">Respuesta correcta: '+esc(q.correct)+'</div>'+
    '<button type="button" class="v531-next-btn" data-v531-quiz-next>Siguiente pregunta</button>'+
  '</section>';
}
function moreHub(data){
  const pair=morePair(data),ranks=rankRows(data);
  const heroPeople='<div class="v531-more-people">'+crest(pair.a.team,data,'person')+'<i>↕</i>'+crest(pair.b.team,data,'person')+'</div>';
  function gameCard(n){
    return '<article class="v531-more-card"><div class="v531-more-card-art"><div class="v531-starball">✦</div></div><div><h2>Más o menos</h2><p>Compara las estadísticas de dos jugadores y elige si el siguiente dato es mayor o menor.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-v531-more-start>Inicia sesión para<br>jugar</button><button type="button" data-v531-more-start>Prueba como<br>invitado</button></div></div></article>';
  }
  return '<section class="v531-page v531-more" data-v531-more data-v531-view="hub">'+
    '<header class="v531-mini-head"><button type="button" data-v531-more-back aria-label="Volver">'+backSvg()+'</button><strong>More or Less</strong><button type="button" data-v531-share aria-label="Compartir">'+shareSvg()+'</button></header>'+
    '<main class="v531-hub-body">'+
      '<article class="v531-more-splash"><div class="v531-more-title"><span>MÁS</span><small>O</small><span>MENOS</span><i class="red">↘</i><i class="green">↗</i></div>'+heroPeople+'<div class="v531-stadium" aria-hidden="true"><i></i><b></b></div></article>'+
      '<article class="v531-more-feature"><div class="v531-more-feature-players">'+crest(pair.a.team,data,'feature')+crest(pair.b.team,data,'feature')+'</div><div><h2>Más o menos</h2><p>Compara a '+esc(pair.a.name)+' y '+esc(pair.b.name)+' con datos publicados por la Liga.</p><div class="v531-dual-actions compact"><button type="button" class="primary" data-v531-more-start>Inicia sesión para<br>jugar</button><button type="button" data-v531-more-start>Prueba como<br>invitado</button></div></div></article>'+
      '<div class="v531-discover"><span>↕</span><b>PLAY GAMES</b><em>LIGA JUVENTINO</em></div>'+
      '<article class="v531-friend-card"><div><h2>¡Reta a tus amigos!</h2><button type="button" data-v531-share>Invita a amigos</button></div><div class="v531-friend-avatar">'+crest(pair.a.team,data,'friend')+'</div></article>'+
      gameCard(1)+gameCard(2)+gameCard(3)+
      '<h2 class="v531-section-title">Clasificaciones</h2>'+
      '<article class="v531-rank-card"><h3>Más o menos</h3>'+ranks.map(function(r){return '<div class="v531-rank-row"><span>'+r.pos+'º</span>'+crest(r.name,data,'rank')+'<b>'+esc(r.name)+'</b><strong>'+esc(r.pts)+' pts</strong></div>'}).join('')+'<button type="button" data-v531-rankings>Ver clasificaciones</button></article>'+
    '</main>'+
  '</section>';
}
function playerCard(p,data,known){
  return '<article class="v531-player-card">'+crest(p.team,data,'player')+'<div class="v531-player-info"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+'</small></div><div class="v531-player-stat"><small>Goles</small><strong>'+(known?esc(p.goals):'—')+'</strong></div></article>';
}
function moreGame(data){
  const pair=morePair(data);
  const question=pair.kind==='player'
    ?'¿Ha marcado '+esc(pair.b.name)+' más o menos goles que '+esc(pair.a.name)+'?'
    :'¿Tiene '+esc(pair.b.name)+' más o menos goles a favor que '+esc(pair.a.name)+'?';
  return '<section class="v531-page v531-more v531-more-game" data-v531-more data-v531-view="game">'+
    '<header class="v531-game-head"><strong>Más o menos</strong><button type="button" data-v531-more-close aria-label="Cerrar">'+closeSvg()+'</button></header>'+
    '<main class="v531-more-game-body">'+
      '<div class="v531-player-pair">'+playerCard(pair.a,data,true)+playerCard(pair.b,data,more.answered)+'</div>'+
      '<div class="v531-more-score"><span><small>Attempts</small><b>⚽ ⚽</b></span><strong>'+more.attempts+'</strong><span><small>Puntuación</small><b>'+more.points+' pts</b></span></div>'+
      '<h2 class="v531-more-question">'+question+'</h2>'+
      '<div class="v531-more-buttons"><button type="button" class="less" data-v531-more-choice="less" aria-label="Menos">▼</button><span>OR</span><button type="button" class="more" data-v531-more-choice="more" aria-label="Más">▲</button></div>'+
      (more.answered?'<div class="v531-more-answer">'+(more.selected==='correct'?'¡Correcto!':'Respuesta registrada')+' · '+esc(pair.b.name)+' tiene '+esc(pair.b.goals)+'</div>':'')+
      '<div class="v531-promo more"><b>FÚTBOL QUE NOS UNE</b><em>LIGA JUVENTINO ROSAS</em></div>'+
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
function render(focusAdded=false){
  const r=route();
  if(r!=='quizArena'&&r!=='moreLess')return;
  const screen=document.querySelector('#screen');if(!screen)return;
  const data=db||window.LJR_OFFICIAL_DATA||{};
  const kind=r==='quizArena'?'quiz':'more';
  let mount=screen.querySelector('[data-v531-mount="'+kind+'"]');
  if(!mount){
    mount=document.createElement('div');
    mount.className='v531-added-block';
    mount.dataset.v531Mount=kind;
    screen.appendChild(mount);
  }
  if(r==='quizArena'){
    mount.innerHTML=quiz.mode==='game'?quizGame(data):quiz.mode==='result'?quizResult(data):quizHub(data);
  }else{
    mount.innerHTML=more.mode==='game'?moreGame(data):moreHub(data);
  }
  setGamesNav();
  if(focusAdded)requestAnimationFrame(function(){
    mount.scrollIntoView({behavior:'smooth',block:'start'});
  });
}
function share(){
  const p={title:'Liga Juventino Rosas',text:'Juega Quiz Arena y Más o Menos en la app de la Liga.',url:location.href};
  if(navigator.share)navigator.share(p).catch(function(){});
  else navigator.clipboard?.writeText(location.href).catch(function(){});
}
function schedule(){
  requestAnimationFrame(function(){requestAnimationFrame(function(){
    const r=route();
    if(r==='quizArena'&&!document.querySelector('[data-v531-mount="quiz"]'))render(false);
    if(r==='moreLess'&&!document.querySelector('[data-v531-mount="more"]'))render(false);
  })});
}
document.addEventListener('click',function(e){
  if(!(e.target instanceof Element))return;
  const t=e.target.closest('[data-v531-quiz-back],[data-v531-more-back],[data-v531-share],[data-v531-rankings],[data-v531-quiz-start],[data-v531-quiz-close],[data-v531-q-answer],[data-v531-quiz-next],[data-v531-result-back],[data-v531-more-start],[data-v531-more-close],[data-v531-more-choice],[data-v531-exit-confirm],[data-v531-exit-cancel]');
  if(!t)return;
  e.preventDefault();e.stopPropagation();

  if(t.matches('[data-v531-quiz-back],[data-v531-more-back]')){go('more');return}
  if(t.matches('[data-v531-share]')){share();return}
  if(t.matches('[data-v531-rankings]')){go('rankings');return}
  if(t.matches('[data-v531-quiz-start]')){quiz.mode='game';quiz.answered=false;quiz.exit=false;render(true);return}
  if(t.matches('[data-v531-quiz-close]')){quiz.exit=true;render(true);return}
  if(t.matches('[data-v531-result-back]')){quiz.mode='hub';quiz.exit=false;render(true);return}
  if(t.matches('[data-v531-q-answer]')){
    const data=db||window.LJR_OFFICIAL_DATA||{},q=quizData(data),pick=t.dataset.v531QAnswer||'';
    quiz.selected=pick;quiz.answered=true;
    if(norm(pick)===norm(q.correct))quiz.points+=10;
    quiz.mode='result';render(true);return;
  }
  if(t.matches('[data-v531-quiz-next]')){quiz.step=Math.min(12,quiz.step+1);quiz.selected='';quiz.answered=false;quiz.mode='game';render(true);return}
  if(t.matches('[data-v531-more-start]')){more.mode='game';more.answered=false;more.exit=false;render(true);return}
  if(t.matches('[data-v531-more-close]')){more.exit=true;render(true);return}
  if(t.matches('[data-v531-more-choice]')){
    if(more.answered)return;
    const data=db||window.LJR_OFFICIAL_DATA||{},pair=morePair(data);
    const actual=pair.b.goals>pair.a.goals?'more':'less';
    const picked=t.dataset.v531MoreChoice||'less';
    more.selected=picked===actual?'correct':'wrong';
    more.answered=true;
    if(picked===actual)more.points+=10;else more.attempts=Math.max(0,more.attempts-1);
    render(true);return;
  }
  if(t.matches('[data-v531-exit-confirm]')){
    const kind=t.dataset.v531ExitConfirm;
    if(kind==='quiz'){quiz.mode='hub';quiz.exit=false;quiz.answered=false}
    else{more.mode='hub';more.exit=false;more.answered=false}
    render(true);return;
  }
  if(t.matches('[data-v531-exit-cancel]')){
    const kind=t.dataset.v531ExitCancel;
    if(kind==='quiz')quiz.exit=false;else more.exit=false;
    render(true);return;
  }
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('ljr:official-data',function(){db=window.LJR_OFFICIAL_DATA||db;schedule()});
const target=document.querySelector('#screen');
if(target)new MutationObserver(schedule).observe(target,{childList:true,subtree:false});
load().then(schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();

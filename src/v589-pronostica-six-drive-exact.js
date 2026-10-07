/* V589 — Pronostica Seis · flujo exacto inspirado en las referencias de Drive del 02-oct-2026.
   Orden: splash -> introducción -> Pronósticos -> detalle de marcador -> Ligas -> Cómo conseguir puntos -> Reglas.
   Mantiene equipos/logos de Liga Juventino y predicciones locales; no inventa resultados oficiales. */
(function(){
'use strict';
if(window.__LJR_V589_PRONOSTICA_SIX__)return;
window.__LJR_V589_PRONOSTICA_SIX__=true;

const ROUTE='predictorSix';
const STORE='ljr-v589-pronostica-six';
const AUTH_RETURN='ljr-auth-return-v569';
const AFTER_AUTH='ljr-v589-after-auth';
const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE='./assets/reference/predictor-v36/liga-crest-white.webp';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

let games=[],journeys=[],officialGames=[];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function officialLogo(name){return window.LJR_SEASON_LOGOS?.get?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||LEAGUE}
function refreshGames(){
 const data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
 if(!data?.categories)return;
 const out=[];
 Object.entries(data.categories).forEach(([cid,cat])=>(cat.fixtures||[]).forEach((block,bi)=>(block.rows||[]).forEach((r,ri)=>{
  if(!r?.[2]||!r?.[6])return;
  const d=String(r[8]||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);if(!d)return;
  const iso=d[3]+'-'+d[2].padStart(2,'0')+'-'+d[1].padStart(2,'0');
  out.push({id:'p6-'+cid+'-'+bi+'-'+ri,cid,round:String(r[1]||bi+1),home:r[2],away:r[6],homeLogo:officialLogo(r[2]),awayLogo:officialLogo(r[6]),date:iso,time:d[4]?d[4].padStart(2,'0')+':'+d[5]:'Por confirmar',field:r[7]||'Campo por confirmar',homeScore:String(r[3]??''),awayScore:String(r[5]??'')});
 })));
 officialGames=out;
 const grouped=new Map();out.filter(g=>g.cid==='3').forEach(g=>{if(!grouped.has(g.round))grouped.set(g.round,[]);grouped.get(g.round).push(g)});
 const categoryOrder=['3','5','4','2','1'];
 const next=[...grouped].map(([round,list])=>{
  const date=list[0].date,chosen=list.slice(0,6);
  // An eleven-team division has five fixtures; complete the six with published games from the same date.
  const extras=out.filter(g=>g.cid!=='3'&&g.date===date).sort((a,b)=>categoryOrder.indexOf(a.cid)-categoryOrder.indexOf(b.cid)||a.time.localeCompare(b.time)||a.id.localeCompare(b.id));
  for(const g of extras){if(chosen.length===6)break;chosen.push(g)}
  return {round,games:chosen,date};
 }).sort((a,b)=>a.date.localeCompare(b.date));
 const firstLoad=!journeys.length;journeys=next;
 if(firstLoad||!ui.journey){const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City'}).format(new Date());const nextIndex=journeys.findIndex(j=>j.date>=today);ui.journey=nextIndex<0?Math.max(1,journeys.length):nextIndex+1}
 ui.journey=Math.max(1,Math.min(journeys.length||1,ui.journey));games=journeys[ui.journey-1]?.games||[];
}
function fixtureDate(g){return new Intl.DateTimeFormat('es-MX',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(g.date+'T12:00:00Z'))}
function locked(g){return /^\d+$/.test(g.homeScore)&&/^\d+$/.test(g.awayScore)||Date.now()>=Date.parse(g.date+'T'+(/\d{2}:\d{2}/.test(g.time)?g.time:'23:59')+':00-06:00')}
function lastFive(team){return officialGames.filter(g=>(norm(g.home)===norm(team)||norm(g.away)===norm(team))&&/^\d+$/.test(g.homeScore)&&/^\d+$/.test(g.awayScore)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5)}
function formMark(g,team){const a=Number(norm(g.home)===norm(team)?g.homeScore:g.awayScore),b=Number(norm(g.home)===norm(team)?g.awayScore:g.homeScore);return a===b?'E':a>b?'V':'D'}
function categoryName(g){
 const data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
 return String(data?.categories?.[g.cid]?.name||data?.categories?.[g.cid]?.title||'Liga Juventino Rosas');
}
function formIcon(){
 return '<svg class="v851-form-icon" viewBox="0 0 34 30" aria-hidden="true"><rect x="3" y="4" width="28" height="22" rx="1.5"></rect><path d="M9 5v20M15 5v20M21 5v20M27 5v20"></path></svg>';
}
function formButton(team,side){
 const rows=lastFive(team);
 return '<button type="button" class="v851-form-trigger '+esc(side||'')+'" data-v851-form="'+esc(team)+'" aria-label="Ver últimos 5 partidos de '+esc(team)+'">'+
   '<span class="v851-form-trigger-head">'+formIcon()+'<b>'+esc(team)+'</b></span>'+
   '<span class="v851-form-marks">'+rows.map(g=>{const m=formMark(g,team);return '<i class="'+(m==='V'?'win':m==='D'?'loss':'draw')+'">'+m+'</i>'}).join('')+'</span>'+
  '</button>'
}
function formSheet(team){
 const selected=games.find(g=>g.id===ui.game)||games.find(g=>norm(g.home)===norm(team)||norm(g.away)===norm(team));
 const rows=lastFive(team);
 const tabs=(selected?[selected.home,selected.away]:[team]).map(t=>
   '<button type="button" class="'+(norm(t)===norm(team)?'active':'')+'" data-v851-form="'+esc(t)+'">'+logo(officialLogo(t),t)+'<b>'+esc(t)+'</b></button>'
 ).join('');
 const matches=rows.map(g=>{
   const mark=formMark(g,team);
   return '<div class="v851-form-row">'+
     '<span class="v851-form-result '+(mark==='V'?'win':mark==='D'?'loss':'draw')+'">'+mark+'</span>'+
     '<span class="v851-form-match"><b><span>'+esc(g.home)+'</span><strong>'+esc(g.homeScore)+' - '+esc(g.awayScore)+'</strong><span>'+esc(g.away)+'</span></b>'+
     '<small>'+esc(fixtureDate(g))+' · '+esc(categoryName(g))+'</small></span>'+
   '</div>'
 }).join('');
 return '<div class="v589-overlay v851-form-overlay" data-v589-overlay data-v851-form-overlay>'+
   '<button class="v589-dim" type="button" data-v851-form-close aria-label="Cerrar últimos partidos"></button>'+
   '<section class="v589-sheet v851-form-sheet" role="dialog" aria-modal="true" aria-label="Últimos 5 partidos">'+
     '<button type="button" class="v851-form-close" data-v851-form-close aria-label="Cerrar">×</button>'+
     '<h2>Últimos 5 partidos</h2>'+
     '<div class="v851-form-tabs">'+tabs+'</div>'+
     '<div class="v851-form-list">'+(matches||'<p class="v851-form-empty">Todavía no hay resultados publicados para este equipo.</p>')+'</div>'+
   '</section></div>';
}
function openFormSheet(team){
 closeOverlay();
 const root=$('[data-v589-root]');
 if(root)root.insertAdjacentHTML('beforeend',formSheet(team));
}
function openCardForm(id){
 const g=games.find(x=>x.id===id);
 if(!g)return;
 ui.game=id;
 closeOverlay();
 const root=$('[data-v589-root]');
 if(root)root.insertAdjacentHTML('beforeend',formSheet(g.home));
}
function closeFormSheet(){
 const o=$('[data-v851-form-overlay]');
 if(o)o.remove();
 ui.game=null;
}

let ui={view:'intro',introSlide:0,journey:0,game:null,tempHome:0,tempAway:0,menu:false};
let splashTimer=0,mountTimer=0;

function read(){
  try{return Object.assign({predictions:{},guest:false},JSON.parse(localStorage.getItem(STORE)||'{}'))}
  catch(_){return {predictions:{},guest:false}}
}
function write(v){try{localStorage.setItem(STORE,JSON.stringify(v))}catch(_){}}
function isLogged(){
  try{
    if(window.LJR_V569_AUTH?.currentAccount?.())return true;
    const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');
    return !!s.user;
  }catch(_){return false}
}
function toast(msg){
  let t=document.querySelector('.v589-toast');
  if(t)t.remove();
  t=document.createElement('div');
  t.className='v589-toast';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2200);
}
function openLogin(returnView='predictions'){
  try{
    localStorage.setItem(AUTH_RETURN,'predictorSix');
    sessionStorage.setItem(AFTER_AUTH,returnView);
  }catch(_){}
  if(window.LJR_V569_AUTH?.openLogin){
    window.LJR_V569_AUTH.openLogin();
    return;
  }
  if(window.LJR_MAIN_ROUTE?.go){
    window.LJR_MAIN_ROUTE.go('accountLogin');
    return;
  }
  location.hash='#/accountLogin';
}
function consumeAfterAuth(){
  try{
    const next=sessionStorage.getItem(AFTER_AUTH)||'';
    if(!next)return false;
    sessionStorage.removeItem(AFTER_AUTH);
    if(isLogged()){
      ui.view=next==='leagues'?'leagues':'predictions';
      return true;
    }
  }catch(_){}
  return false;
}
function logo(path,name){return '<img src="'+esc(/^(https?:|data:|blob:|\.\/)/.test(path)?path:BASE+path)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">'}
function sponsor(){
  return '<div class="v589-sponsor"><span>Patrocinado por</span><span class="v589-sponsor-badge"><img src="'+LEAGUE+'" alt="" aria-hidden="true"><b>LIGA JUVENTINO</b></span></div>';
}
function top(title,big=false){
  const back='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4.5 8 12l7.5 7.5"/></svg>';
  const more='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>';
  return '<header class="v589-top '+(big?'big':'')+'"><button type="button" class="v589-back" data-v589-back aria-label="Volver">'+back+'</button><h1>'+esc(title)+'</h1><button type="button" class="v589-more" data-v589-menu aria-label="Opciones">'+more+'</button></header>';
}
function bottomSwitch(active){
  const predictionsIcon='<svg viewBox="0 0 32 32" aria-hidden="true">'+
    '<rect x="4.5" y="5.5" width="23" height="21" rx="5"/>'+
    '<rect x="8.2" y="10" width="6.3" height="7" rx="1.4"/>'+
    '<rect x="17.5" y="10" width="6.3" height="7" rx="1.4"/>'+
    '<path d="M9.5 21.4h13"/>'+
  '</svg>';
  const leaguesIcon='<svg viewBox="0 0 32 32" aria-hidden="true">'+
    '<circle cx="11.5" cy="10.5" r="4.1"/>'+
    '<circle cx="21.4" cy="12.1" r="3.5"/>'+
    '<path d="M4.8 26c.8-5.8 3.2-8.7 6.7-8.7s5.9 2.9 6.7 8.7"/>'+
    '<path d="M17.6 19.2c1.1-1 2.4-1.5 4-1.5 3 0 5 2.3 5.7 6.8"/>'+
  '</svg>';
  return '<nav class="v589-switch" aria-label="Pronostica Seis">'+
    '<button type="button" data-v589-view="predictions" class="'+(active==='predictions'?'active':'')+'"><span class="v840-tab-icon">'+predictionsIcon+'</span><b>Pronósticos</b></button>'+
    '<button type="button" data-v589-view="leagues" class="'+(active==='leagues'?'active':'')+'"><span class="v840-tab-icon">'+leaguesIcon+'</span><b>Ligas</b></button>'+
  '</nav>';
}
function introTop(){return top('Pronostica Seis')}

const introSlides=[
 {title:'Pronostica seis resultados',text:'Consigue puntos por el marcador, la diferencia de goles y los goles marcados por cada equipo.'},
 {title:'Juega tu comodín',text:'Elige un partido de cada jornada y duplica los puntos que consigas.'},
 {title:'Suma puntos con los eventos adicionales',text:'Sigue tus marcadores y los resultados publicados para conocer tus puntos.'},
 {title:'Enfréntate a tus amigos',text:'Compara tus pronósticos y juega cada jornada con tus amigos.'}
];
function introArt(idx){
 const shape='<svg viewBox="0 0 90 50" aria-hidden="true"><path d="M18 4 8 23l10 19 10-19ZM50 5l16 6v18L50 43 35 29V11ZM40 11h20M50 6v36"/></svg>';
 if(idx<2)return '<div class="v851-six-art '+(idx===1?'joker':'')+'">'+Array.from({length:6},(_,i)=>'<span>'+((idx===1&&i===1)?'<b>2×</b>':shape)+'</span>').join('')+'</div>';
 if(idx===2)return '<div class="v851-event-art"><b>2 - 1</b><span>+ puntos</span></div>';
 return '<div class="v851-friends-art"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="30" cy="23" r="11"/><circle cx="55" cy="28" r="9"/><path d="M11 65v-7c0-13 8-20 19-20s19 7 19 20v7M48 43c15-4 24 6 24 19"/></svg></div>';
}

function intro(){
  const idx=Math.max(0,Math.min(introSlides.length-1,Number(ui.introSlide)||0));
  const slide=introSlides[idx];
  return '<section class="v589-page intro" data-v589-root data-v589-intro-swipe data-v589-intro-index="'+idx+'">'+introTop()+sponsor()+
    '<div class="v589-intro-icons" data-v589-intro-track>'+
      introArt(idx)+(idx>0?'<button type="button" class="v851-intro-arrow prev" data-v851-intro-step="-1" aria-label="Pantalla anterior">‹</button>':'')+(idx<3?'<button type="button" class="v851-intro-arrow" data-v851-intro-step="1" aria-label="Pantalla siguiente">›</button>':'')+
    '</div>'+
    '<div class="v589-intro-copy" data-v589-intro-track><h2>'+esc(slide.title)+'</h2><p>'+esc(slide.text)+'</p>'+
      '<div class="v589-dots" aria-label="Pantallas de introducción">'+
        introSlides.map((_,i)=>'<button type="button" aria-label="Ir a pantalla '+(i+1)+'" data-v589-intro-dot="'+i+'" class="'+(i===idx?'active':'')+'"></button>').join('')+
      '</div></div>'+
    '<div class="v589-intro-actions">'+
      '<button type="button" class="v589-primary" data-v589-login>'+(isLogged()?'Continuar para jugar':'Inicia sesión para jugar')+'</button>'+
      '<button type="button" class="v589-secondary" data-v589-guest>Prueba como invitado</button>'+
    '</div>'+
  '</section>';
}

function savedText(id){
  const p=read().predictions[id];
  return p?String(p.home)+' - '+String(p.away):'';
}
function card(g,i){
  const saved=savedText(g.id);
  return '<article class="v589-match-card" data-v589-card="'+g.id+'">'+
    '<small class="v871-game-category">'+esc(({'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'})[g.cid])+'</small><div class="v589-card-head"><button type="button" data-v589-info aria-label="Cómo conseguir puntos">ⓘ</button><b>'+esc(fixtureDate(g))+', '+esc(g.time)+'</b><button type="button" class="v851-card-form" data-v851-card-form="'+g.id+'" aria-label="Ver últimos 5 partidos"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M6 21V13M14 21V7M22 21V11"/></svg></button></div>'+
    '<div class="v589-teams">'+
      '<div class="v589-team">'+logo(g.homeLogo,g.home)+'<b>'+esc(g.home)+'</b></div>'+
      '<button type="button" class="v589-score-pair" data-v589-open="'+g.id+'" aria-label="Pronosticar '+esc(g.home)+' contra '+esc(g.away)+'">'+
        '<span>'+esc(saved?saved.split(' - ')[0]:'+')+'</span><span>'+esc(saved?saved.split(' - ')[1]:'+')+'</span>'+
      '</button>'+
      '<div class="v589-team">'+logo(g.awayLogo,g.away)+'<b>'+esc(g.away)+'</b></div>'+
    '</div>'+
    '<div class="v589-popular"><small>Pronósticos populares</small><div><span>1 - 0</span><span>1 - 1</span><span>0 - 1</span></div><div class="v589-pct"><em>—</em><em>—</em><em>—</em></div></div>'+
    '<button type="button" class="v589-card-foot" data-v589-open="'+g.id+'">'+(locked(g)?'Partido cerrado':saved?'Pronóstico guardado · '+esc(saved):'Toca para pronosticar')+'</button>'+
  '</article>';
}
function predictions(){
  refreshGames();
  const date=games[0]?fixtureDate(games[0]):'Partidos por publicar';
  return '<section class="v589-page predictions" data-v589-root>'+top('Pronósticos',true)+
    bottomSwitch('predictions')+sponsor()+
    '<nav class="v589-journeys">'+journeys.map((j,i)=>{const n=i+1;return '<button type="button" data-v589-journey="'+n+'" class="'+(ui.journey===n?'active':'')+'">Jornada '+esc(j.round)+'</button>'}).join('')+'</nav>'+
    '<main class="v589-list"><h2>'+date+'</h2>'+games.map(card).join('')+(games.length<6?'<p>Hay '+games.length+' de 6 partidos publicados para esta fecha. Se completarán al publicarse el calendario.</p>':'')+'</main>'+
    (ui.menu?menuHtml():'')+
  '</section>';
}
function leagues(){
  const peopleIcon='<svg viewBox="0 0 72 72" aria-hidden="true">'+
    '<circle cx="27" cy="23" r="10"/><circle cx="47" cy="26" r="8"/>'+
    '<path d="M11 58c1.6-13 7.2-19 16-19s14.4 6 16 19"/>'+
    '<path d="M40 42c2.1-2 4.8-3 7.8-3 7.1 0 11.6 5 12.9 16"/>'+
  '</svg>';
  return '<section class="v589-page leagues" data-v589-root>'+top('Ligas',true)+
    bottomSwitch('leagues')+sponsor()+
    '<main class="v589-league-empty"><div class="v589-people">'+peopleIcon+'</div><h2>Reta a tus amigos</h2><p>¿Quién tiene la mejor capacidad para pronosticar? ¡Inicia sesión y crea una liga para averiguarlo!</p>'+
    '<button type="button" class="v589-primary" data-v589-login>Inicia sesión ahora</button></main>'+
    (ui.menu?menuHtml():'')+
  '</section>';
}
function menuHtml(){
  return '<div class="v589-menu-pop"><button type="button" data-v589-points>Cómo conseguir puntos</button><button type="button" data-v589-rules>Reglas de Pronostica Seis</button></div>';
}
function predictionSheet(g){
  const current=read().predictions[g.id]||{home:0,away:0};
  if(ui.game!==g.id){ui.game=g.id;ui.tempHome=Number(current.home)||0;ui.tempAway=Number(current.away)||0}
  return '<div class="v589-overlay" data-v589-overlay><button class="v589-dim" type="button" data-v589-close aria-label="Cerrar"></button>'+
    '<section class="v589-sheet prediction-sheet"><span class="v589-handle"></span>'+
      '<div class="v589-sheet-score">'+
        '<div class="v589-team">'+logo(g.homeLogo,g.home)+'<b>'+esc(g.home)+'</b></div>'+
        '<button type="button" class="v589-big-score" data-v589-inc="home"><b>'+ui.tempHome+'</b><small>Toca para subir</small></button>'+
        '<button type="button" class="v589-big-score" data-v589-inc="away"><b>'+ui.tempAway+'</b><small>Toca para subir</small></button>'+
        '<div class="v589-team">'+logo(g.awayLogo,g.away)+'<b>'+esc(g.away)+'</b></div>'+
      '</div>'+
      '<div class="v589-score-reset"><button type="button" data-v589-dec="home">−</button><span></span><button type="button" data-v589-dec="away">−</button></div>'+
      '<div class="v589-popular modal"><small>Pronósticos populares</small><div><span>1 - 0</span><span>1 - 1</span><span>0 - 1</span></div><div class="v589-pct"><em>—</em><em>—</em><em>—</em></div></div>'+
      '<button type="button" class="v589-primary save" data-v589-save>Guardar el pronóstico</button>'+
      '<button type="button" class="v851-joker '+(read().jokers?.[journeys[ui.journey-1]?.round]===g.id?'active':'')+'" data-v851-joker="'+g.id+'">Comodín · duplica tus puntos</button>'+
    '</section></div>';
}
function pointsSheet(){
  return '<div class="v589-overlay" data-v589-overlay><button class="v589-dim" type="button" data-v589-close aria-label="Cerrar"></button>'+
    '<section class="v589-sheet points-sheet"><span class="v589-handle"></span><h2>Cómo conseguir puntos</h2><hr><h3>Resultado</h3>'+
      '<div class="v589-rule-row"><span><b>Resultado correcto</b><small>(victoria/empate/derrota)</small></span><strong>3 ptos</strong></div>'+
      '<div class="v589-rule-row"><span><b>Goles locales</b></span><strong>2 ptos</strong></div>'+
      '<div class="v589-rule-row"><span><b>Goles visitantes</b></span><strong>2 ptos</strong></div>'+
      '<div class="v589-rule-row"><span><b>Diferencia de goles</b></span><strong>3 ptos</strong></div>'+
      '<div class="v589-rule-row"><span><b>Bonus por sorpresa</b><small>Acierta un marcador que menos del 10% de los jugadores pronosticaron</small></span><strong>5 ptos</strong></div>'+
      '<hr><div class="v589-rule-row section"><span><b>Otros eventos</b><small>Goleadores específicos, jugador del partido y más.</small></span><strong>ptos</strong></div>'+
      '<hr><div class="v589-rule-row section"><span><b>Comodín</b><small>Cada jornada, multiplica tus puntos en un partido jugando tu comodín.</small></span><strong>2x ptos</strong></div>'+
      '<hr><p class="v589-more-rules">Para más información, lee las <button type="button" data-v589-rules>Reglas de Pronostica Seis</button></p>'+
    '</section></div>';
}
function rules(){
  return '<section class="v589-page rules" data-v589-root>'+top('',false)+sponsor()+
    '<main class="v589-rules-body"><h1>Reglas del Pronostica Seis de la Liga Juventino Rosas 2026/27</h1><time>2 oct 2026</time>'+
      '<p>Pronostica Seis es el juego en el que pones a prueba tu capacidad de predicción. Adivina seis resultados diferentes para sumar puntos y competir con otros aficionados de la Liga.</p>'+
      '<div class="v589-rule-banner"><img src="'+LEAGUE+'" alt=""><b>LIGA JUVENTINO ROSAS</b></div>'+
      '<h2>Cómo funciona</h2><p>Cada jornada puedes pronosticar los resultados de <strong>seis partidos preseleccionados</strong> de la Liga Municipal.</p>'+
      '<p>Elige el marcador antes del inicio del partido. Tus elecciones se guardan en este dispositivo y puedes modificarlas mientras el encuentro no haya comenzado.</p>'+
      '<h2>Puntuación</h2><p>Sumas puntos por acertar el resultado, los goles de cada equipo y la diferencia de goles. El bonus por sorpresa y el comodín siguen la tabla mostrada en “Cómo conseguir puntos”.</p>'+
    '</main></section>';
}
function bindIntroSwipe(){
  const root=$('[data-v589-intro-swipe]');
  if(!root||root.dataset.v589SwipeBound==='1')return;
  root.dataset.v589SwipeBound='1';
  let startX=0,startY=0,lastX=0,pointer=null,dragging=false;

  const tracks=()=>$$('[data-v589-intro-track]',root);
  const setDrag=x=>tracks().forEach(el=>el.style.setProperty('--v839-drag-x',x+'px'));
  const clearDrag=()=>tracks().forEach(el=>el.style.removeProperty('--v839-drag-x'));

  root.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button!==0)return;
    if(e.target.closest('button'))return;
    pointer=e.pointerId;startX=lastX=e.clientX;startY=e.clientY;dragging=true;
    root.classList.add('v839-dragging');
    try{root.setPointerCapture(pointer)}catch(_){}
  });
  root.addEventListener('pointermove',e=>{
    if(!dragging||e.pointerId!==pointer)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(Math.abs(dx)<Math.abs(dy)&&Math.abs(dy)>8)return;
    lastX=e.clientX;
    setDrag(Math.max(-90,Math.min(90,dx)));
    if(Math.abs(dx)>8)e.preventDefault();
  });
  const finish=e=>{
    if(!dragging||e.pointerId!==pointer)return;
    const dx=lastX-startX,dy=e.clientY-startY;
    dragging=false;root.classList.remove('v839-dragging');clearDrag();
    try{root.releasePointerCapture(pointer)}catch(_){}
    if(Math.abs(dx)>=42&&Math.abs(dx)>Math.abs(dy)*1.1){
      const next=dx<0?Math.min(introSlides.length-1,(ui.introSlide||0)+1):Math.max(0,(ui.introSlide||0)-1);
      if(next!==ui.introSlide){ui.introSlide=next;render()}
    }
  };
  root.addEventListener('pointerup',finish);
  root.addEventListener('pointercancel',finish);
}

function render(){
  if(route()!==ROUTE)return;
  refreshGames();
  const screen=$('#screen');if(!screen)return;
  let html='';
  if(ui.view==='intro')html=intro();
  else if(ui.view==='leagues')html=leagues();
  else if(ui.view==='rules')html=rules();
  else html=predictions();
  screen.innerHTML=html;
  if(ui.view==='intro'){screen.scrollTop=0;bindIntroSwipe()}
  document.body.dataset.v589Predictor='1';
}
function openPrediction(id){
  const g=games.find(x=>x.id===id);if(!g)return;if(locked(g)){toast('El partido ya comenzó; los pronósticos están cerrados');return}
  ui.view='predictions';ui.game=id;
  const current=read().predictions[id]||{home:0,away:0};
  ui.tempHome=Number(current.home)||0;ui.tempAway=Number(current.away)||0;
  render();
  const root=$('[data-v589-root]');if(root)root.insertAdjacentHTML('beforeend',predictionSheet(g));
}
function openPoints(){
  const root=$('[data-v589-root]');if(root&&!$('[data-v589-overlay]',root))root.insertAdjacentHTML('beforeend',pointsSheet());
}
function closeOverlay(){const o=$('[data-v589-overlay]');if(o)o.remove()}
function savePrediction(){
  if(!ui.game)return;
  const g=games.find(x=>x.id===ui.game);if(!g||locked(g)){toast('Este partido ya está cerrado');closeOverlay();return}
  const s=read();
  s.predictions[ui.game]={home:ui.tempHome,away:ui.tempAway,updatedAt:Date.now()};
  write(s);
  closeOverlay();
  ui.game=null;
  render();
  toast('Pronóstico guardado');
}
function goMain(asGuest=false){
  const s=read();if(asGuest){s.guest=true;write(s)}
  ui.view='predictions';ui.menu=false;render();
}
function handleClick(e){
  if(route()!==ROUTE)return;
  const t=e.target instanceof Element?e.target.closest('button,[data-v589-card]'):null;if(!t)return;
  if(t.matches('[data-v589-back]')){
    e.preventDefault();e.stopPropagation();
    if(ui.view==='rules'){ui.view='predictions';render();return}
    if(ui.view==='leagues'){ui.view='predictions';render();return}
    location.hash='#/more';return;
  }
  if(t.matches('[data-v589-menu]')){
    e.preventDefault();e.stopPropagation();
    ui.menu=!ui.menu;render();return
  }
  const step=t.getAttribute('data-v851-intro-step');
  if(step!==null){e.preventDefault();e.stopPropagation();ui.introSlide=Math.max(0,Math.min(3,ui.introSlide+Number(step)));render();return}
  const cardForm=t.getAttribute('data-v851-card-form');
  if(cardForm!==null){e.preventDefault();e.stopPropagation();openCardForm(cardForm);return}
  const form=t.getAttribute('data-v851-form');
  if(form!==null){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openFormSheet(form);return}
  const joker=t.getAttribute('data-v851-joker');
  if(joker!==null){e.preventDefault();e.stopPropagation();const s=read();s.jokers=s.jokers||{};const round=journeys[ui.journey-1]?.round;s.jokers[round]=s.jokers[round]===joker?null:joker;write(s);t.classList.toggle('active',s.jokers[round]===joker);return}
  const introDot=t.getAttribute('data-v589-intro-dot');
  if(introDot!==null){
    e.preventDefault();e.stopPropagation();
    ui.introSlide=Math.max(0,Math.min(introSlides.length-1,Number(introDot)||0));
    render();return;
  }
  if(t.matches('[data-v589-login]')){
    e.preventDefault();e.stopPropagation();
    if(isLogged()){
      if(ui.view==='leagues'){toast('Sesión activa');return}
      goMain(false);return;
    }
    openLogin(ui.view==='leagues'?'leagues':'predictions');
    return;
  }
  if(t.matches('[data-v589-guest]')){
    e.preventDefault();e.stopPropagation();
    goMain(true);toast('Entraste como invitado');return
  }
  const view=t.getAttribute('data-v589-view');
  if(view){
    e.preventDefault();e.stopPropagation();
    ui.view=view;ui.menu=false;render();return
  }
  const j=t.getAttribute('data-v589-journey');
  if(j){
    e.preventDefault();e.stopPropagation();
    ui.journey=Number(j)||2;render();return
  }
  const open=t.getAttribute('data-v589-open')||t.closest('[data-v589-card]')?.getAttribute('data-v589-card');
  if(open&&!t.matches('[data-v589-info]')){
    e.preventDefault();e.stopPropagation();openPrediction(open);return
  }
  if(t.matches('[data-v589-info],[data-v589-points]')){
    e.preventDefault();e.stopPropagation();ui.menu=false;openPoints();return
  }
  if(t.matches('[data-v851-form-close]')){
    e.preventDefault();e.stopPropagation();closeFormSheet();return
  }
  if(t.matches('[data-v589-close]')){
    e.preventDefault();e.stopPropagation();closeOverlay();return
  }
  if(t.matches('[data-v589-inc]')){
    e.preventDefault();e.stopPropagation();
    const side=t.getAttribute('data-v589-inc');
    ui[side==='home'?'tempHome':'tempAway']=Math.min(9,ui[side==='home'?'tempHome':'tempAway']+1);
    const b=t.querySelector('b');if(b)b.textContent=ui[side==='home'?'tempHome':'tempAway'];return;
  }
  if(t.matches('[data-v589-dec]')){
    e.preventDefault();e.stopPropagation();
    const side=t.getAttribute('data-v589-dec');
    ui[side==='home'?'tempHome':'tempAway']=Math.max(0,ui[side==='home'?'tempHome':'tempAway']-1);
    const b=$('[data-v589-inc="'+side+'"] b');if(b)b.textContent=ui[side==='home'?'tempHome':'tempAway'];return;
  }
  if(t.matches('[data-v589-save]')){
    e.preventDefault();e.stopPropagation();savePrediction();return
  }
  if(t.matches('[data-v589-rules]')){
    e.preventDefault();e.stopPropagation();closeOverlay();ui.view='rules';ui.menu=false;render();return
  }
}
function mount(){
  const r=route();
  if(r==='predictor'){
    /* V790: la portada de Pronostica Seis ya no avanza sola.
       La segunda pantalla se abre únicamente cuando el usuario toca el botón/zona central. */
    clearTimeout(splashTimer);
    return;
  }
  clearTimeout(splashTimer);
  if(r!==ROUTE){document.body.removeAttribute('data-v589-predictor');return}
  consumeAfterAuth();
  const screen=$('#screen');if(!screen)return;
  if(!screen.querySelector('[data-v589-root]'))render();
}
function schedule(ms=40){clearTimeout(mountTimer);mountTimer=setTimeout(mount,ms)}

document.addEventListener('click',handleClick,true);
window.addEventListener('ljr:official-data',()=>{if(route()===ROUTE)render()});
window.addEventListener('hashchange',()=>{
  const returning=route()===ROUTE&&consumeAfterAuth();
  ui={view:returning?(ui.view||'predictions'):'intro',introSlide:0,journey:0,game:null,tempHome:0,tempAway:0,menu:false};
  /* V884: montar en el mismo tick para que nunca se pinte primero la capa V53 antigua. */
  mount();
  schedule(24);
});
new MutationObserver(()=>{if(route()===ROUTE)schedule(30)}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{mount();schedule(40)},{once:true});else{mount();schedule(20)}
setTimeout(mount,180);
})();


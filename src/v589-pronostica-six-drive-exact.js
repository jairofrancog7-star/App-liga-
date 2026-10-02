/* V589 — Pronostica Seis · flujo exacto inspirado en las referencias de Drive del 02-oct-2026.
   Orden: splash -> introducción -> Pronósticos -> detalle de marcador -> Ligas -> Cómo conseguir puntos -> Reglas.
   Mantiene equipos/logos de Liga Juventino y predicciones locales; no inventa resultados oficiales. */
(function(){
'use strict';
if(window.__LJR_V589_PRONOSTICA_SIX__)return;
window.__LJR_V589_PRONOSTICA_SIX__=true;

const ROUTE='predictorSix';
const STORE='ljr-v589-pronostica-six';
const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE='./assets/reference/predictor-v36/liga-crest-white.webp';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

const games=[
 {id:'p6a',home:'FRANCO FC',homeLogo:'assets/official-logos/franco-fc.png',away:'HERRERAS FC',awayLogo:'assets/official-logos/herreras-fc.png',time:'08:00',field:'Campo 1'},
 {id:'p6b',home:'TERRÍCOLAS',homeLogo:'assets/official-logos/terricolas.png',away:'GALÁCTICOS',awayLogo:'assets/teams/galacticos-pozos.webp',time:'10:00',field:'Campo 2'},
 {id:'p6c',home:'LINCES',homeLogo:'assets/official-logos/linces.png',away:'JUVENTUS',awayLogo:'assets/official-logos/juventus.png',time:'11:30',field:'Campo 3'},
 {id:'p6d',home:'HERMANOS',homeLogo:'assets/official-logos/hermanos.png',away:'SAN JOSÉ FC',awayLogo:'assets/official-logos/san-jose-fc.png',time:'13:00',field:'Campo 1'},
 {id:'p6e',home:'LOBOS CDG',homeLogo:'assets/official-logos/lobos-cdg.png',away:'NAPOLI',awayLogo:'assets/official-logos/napoli.png',time:'15:30',field:'Campo 2'},
 {id:'p6f',home:'ABEJAS',homeLogo:'assets/official-logos/abejas.png',away:'BOAVISTA',awayLogo:'assets/official-logos/boavista.png',time:'17:00',field:'Campo 1'}
];

let ui={view:'intro',journey:2,game:null,tempHome:0,tempAway:0,menu:false};
let splashTimer=0,mountTimer=0;

function read(){
  try{return Object.assign({predictions:{},guest:false},JSON.parse(localStorage.getItem(STORE)||'{}'))}
  catch(_){return {predictions:{},guest:false}}
}
function write(v){try{localStorage.setItem(STORE,JSON.stringify(v))}catch(_){}}
function isLogged(){
  try{
    const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');
    return !!s.user;
  }catch(_){return false}
}
function logo(path,name){return '<img src="'+BASE+path+'" alt="'+esc(name)+'" loading="lazy" decoding="async">'}
function sponsor(){
  return '<div class="v589-sponsor"><span>Patrocinado por</span><span class="v589-sponsor-badge"><img src="'+LEAGUE+'" alt="" aria-hidden="true"><b>LIGA JUVENTINO</b></span></div>';
}
function top(title,big=false){
  return '<header class="v589-top '+(big?'big':'')+'"><button type="button" class="v589-back" data-v589-back aria-label="Volver">‹</button><h1>'+esc(title)+'</h1><button type="button" class="v589-more" data-v589-menu aria-label="Opciones">⋮</button></header>';
}
function bottomSwitch(active){
  return '<nav class="v589-switch" aria-label="Pronostica Seis">'+
    '<button type="button" data-v589-view="predictions" class="'+(active==='predictions'?'active':'')+'"><span>▣</span><b>Pronósticos</b></button>'+
    '<button type="button" data-v589-view="leagues" class="'+(active==='leagues'?'active':'')+'"><span>♙♙</span><b>Ligas</b></button>'+
  '</nav>';
}
function intro(){
  return '<section class="v589-page intro" data-v589-root>'+top('Pronostica Seis')+sponsor()+
    '<div class="v589-intro-icons">'+
      '<span>◇ ◇</span><span>▱ ◇</span><span>▱ ◎</span><span>▱ ◎</span><span>◇ ◌</span><span>◇ ◌</span>'+
    '</div>'+
    '<div class="v589-intro-copy"><h2>Pronostica seis resultados</h2><p>Consigue puntos por el marcador, la diferencia de goles y los goles marcados por cada equipo.</p>'+
      '<div class="v589-dots"><i class="active"></i><i></i><i></i><i></i></div></div>'+
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
    '<div class="v589-card-head"><button type="button" data-v589-info aria-label="Cómo conseguir puntos">ⓘ</button><b>dom 04 oct, '+esc(g.time)+'</b><span>▥</span></div>'+
    '<div class="v589-teams">'+
      '<div class="v589-team">'+logo(g.homeLogo,g.home)+'<b>'+esc(g.home)+'</b></div>'+
      '<button type="button" class="v589-score-pair" data-v589-open="'+g.id+'" aria-label="Pronosticar '+esc(g.home)+' contra '+esc(g.away)+'">'+
        '<span>'+esc(saved?saved.split(' - ')[0]:'+')+'</span><span>'+esc(saved?saved.split(' - ')[1]:'+')+'</span>'+
      '</button>'+
      '<div class="v589-team">'+logo(g.awayLogo,g.away)+'<b>'+esc(g.away)+'</b></div>'+
    '</div>'+
    '<div class="v589-popular"><small>Pronósticos populares</small><div><span>1 - 0</span><span>1 - 1</span><span>0 - 1</span></div><div class="v589-pct"><em>—</em><em>—</em><em>—</em></div></div>'+
    '<button type="button" class="v589-card-foot" data-v589-open="'+g.id+'">'+(saved?'Pronóstico guardado · '+esc(saved):'Inicia sesión para ver tus pronósticos')+'</button>'+
  '</article>';
}
function predictions(){
  const date=ui.journey===1?'27 - 28 sep':ui.journey===2?'03 - 04 oct':ui.journey===3?'10 - 11 oct':'17 - 18 oct';
  return '<section class="v589-page predictions" data-v589-root>'+top('Pronósticos',true)+sponsor()+
    '<nav class="v589-journeys">'+[1,2,3,4].map(n=>'<button type="button" data-v589-journey="'+n+'" class="'+(ui.journey===n?'active':'')+'">Jornada '+n+'</button>').join('')+'</nav>'+
    '<main class="v589-list"><h2>'+date+'</h2>'+games.map(card).join('')+'</main>'+
    bottomSwitch('predictions')+
    (ui.menu?menuHtml():'')+
  '</section>';
}
function leagues(){
  return '<section class="v589-page leagues" data-v589-root>'+top('Ligas',true)+sponsor()+
    '<main class="v589-league-empty"><div class="v589-people">♙♙</div><h2>Reta a tus amigos</h2><p>¿Quién tiene la mejor capacidad para pronosticar? ¡Inicia sesión y crea una liga para averiguarlo!</p>'+
    '<button type="button" class="v589-primary" data-v589-login>Inicia sesión ahora</button></main>'+
    bottomSwitch('leagues')+(ui.menu?menuHtml():'')+
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
      '<div class="v589-form"><span><b>▥ '+esc(g.home)+'</b><i>•</i><i>•</i><i>•</i><i>•</i><i>•</i></span><span><b>'+esc(g.away)+' ▥</b><i>•</i><i>•</i><i>•</i><i>•</i><i>•</i></span></div>'+
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
function render(){
  if(route()!==ROUTE)return;
  const screen=$('#screen');if(!screen)return;
  let html='';
  if(ui.view==='intro')html=intro();
  else if(ui.view==='leagues')html=leagues();
  else if(ui.view==='rules')html=rules();
  else html=predictions();
  screen.innerHTML=html;
  document.body.dataset.v589Predictor='1';
}
function openPrediction(id){
  const g=games.find(x=>x.id===id);if(!g)return;
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
  const s=read();s.predictions[ui.game]={home:ui.tempHome,away:ui.tempAway,updatedAt:Date.now()};write(s);
  closeOverlay();ui.game=null;render();
}
function goMain(asGuest=false){
  const s=read();if(asGuest){s.guest=true;write(s)}
  ui.view='predictions';ui.menu=false;render();
}
function handleClick(e){
  if(route()!==ROUTE)return;
  const t=e.target instanceof Element?e.target.closest('button,[data-v589-card]'):null;if(!t)return;
  if(t.matches('[data-v589-back]')){
    e.preventDefault();
    if(ui.view==='rules'){ui.view='predictions';render();return}
    location.hash='#/more';return;
  }
  if(t.matches('[data-v589-menu]')){ui.menu=!ui.menu;render();return}
  if(t.matches('[data-v589-login]')){
    if(isLogged()){goMain(false);return}
    try{sessionStorage.setItem('v589-return','predictorSix')}catch(_){}
    location.hash='#/account';return;
  }
  if(t.matches('[data-v589-guest]')){goMain(true);return}
  const view=t.getAttribute('data-v589-view');
  if(view){ui.view=view;ui.menu=false;render();return}
  const j=t.getAttribute('data-v589-journey');
  if(j){ui.journey=Number(j)||2;render();return}
  const open=t.getAttribute('data-v589-open')||t.closest('[data-v589-card]')?.getAttribute('data-v589-card');
  if(open&&!t.matches('[data-v589-info]')){openPrediction(open);return}
  if(t.matches('[data-v589-info],[data-v589-points]')){e.stopPropagation();ui.menu=false;openPoints();return}
  if(t.matches('[data-v589-close]')){closeOverlay();return}
  if(t.matches('[data-v589-inc]')){
    const side=t.getAttribute('data-v589-inc');ui[side==='home'?'tempHome':'tempAway']=Math.min(9,ui[side==='home'?'tempHome':'tempAway']+1);
    const b=t.querySelector('b');if(b)b.textContent=ui[side==='home'?'tempHome':'tempAway'];return;
  }
  if(t.matches('[data-v589-dec]')){
    const side=t.getAttribute('data-v589-dec');ui[side==='home'?'tempHome':'tempAway']=Math.max(0,ui[side==='home'?'tempHome':'tempAway']-1);
    const b=$('[data-v589-inc="'+side+'"] b');if(b)b.textContent=ui[side==='home'?'tempHome':'tempAway'];return;
  }
  if(t.matches('[data-v589-save]')){savePrediction();return}
  if(t.matches('[data-v589-rules]')){closeOverlay();ui.view='rules';ui.menu=false;render();return}
}
function mount(){
  const r=route();
  if(r==='predictor'){
    clearTimeout(splashTimer);
    splashTimer=setTimeout(()=>{if(route()==='predictor')location.hash='#/predictorSix'},1450);
    return;
  }
  clearTimeout(splashTimer);
  if(r!==ROUTE){document.body.removeAttribute('data-v589-predictor');return}
  const screen=$('#screen');if(!screen)return;
  if(!screen.querySelector('[data-v589-root]'))render();
}
function schedule(ms=40){clearTimeout(mountTimer);mountTimer=setTimeout(mount,ms)}

document.addEventListener('click',handleClick,true);
window.addEventListener('hashchange',()=>{ui={view:'intro',journey:2,game:null,tempHome:0,tempAway:0,menu:false};schedule(20)});
new MutationObserver(()=>{if(route()===ROUTE)schedule(30)}).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(40),{once:true});else schedule(20);
setTimeout(mount,400);
})();

/* V164 — HISTORIAL separado de HISTORIA.
   HISTORIA conserva temporadas/campeones/finales.
   HISTORIAL muestra resultados de partidos publicados oficialmente. */
(function(){
'use strict';
if(window.__LJR_V164_HISTORY_LOG__)return;
window.__LJR_V164_HISTORY_LOG__=true;

const LOCAL='./data/official-live.json?v=20261001-v491-v35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v491-v35-all-pages';
let db=window.LJR_OFFICIAL_DATA||null;
let loading=null;
let guard=false;

function route(){return location.hash.replace(/^#\/?/,'').split('?')[0]||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function stamp(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  return m?Date.UTC(+m[3],+m[2]-1,+m[1],+m[4],+m[5]):0;
}
function dateText(v){return String(v||'').match(/^(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1]||String(v||'')}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
const HISTORY_LOGO_PATHS={
  'san jose fc':'assets/official-logos/san-jose-fc.png',
  'san jose':'assets/official-logos/san-jose-fc.png',
  'juventus':'assets/official-logos/juventus.png',
  'linces':'assets/official-logos/linces.png',
  'napoli':'assets/official-logos/napoli.png',
  'hermanos':'assets/official-logos/hermanos.png',
  'franco fc':'assets/official-logos/franco-fc.png',
  'herreras fc':'assets/official-logos/herreras-fc.png',
  'abejas':'assets/official-logos/abejas.png',
  'terricolas':'assets/official-logos/terricolas.png',
  'lobos cdg':'assets/official-logos/lobos-cdg.png',
  'galacticos':'assets/teams/galacticos-pozos.webp',
  'galacticos de pozos':'assets/teams/galacticos-pozos.webp',
  'la canchita deportes':'assets/official-logos/la-canchita-deportes.png',
  'galeana':'assets/official-logos/galeana.png',
  'atletico galeana':'assets/official-logos/galeana.png',
  'aldama fc':'assets/official-logos/aldama-fc.png',
  'malvinas':'assets/official-logos/malvinas.png',
  'capibaras':'assets/official-logos/capibaras.png',
  'la cuadrilla':'assets/official-logos/la-cuadrilla.png',
  'mazacotes':'assets/official-logos/mazacotes-fc.png',
  'mazacotes fc':'assets/official-logos/mazacotes-fc.png',
  'dep maravillas':'assets/official-logos/dep-maravillas.png',
  'deportivo maravillas':'assets/official-logos/dep-maravillas.png',
  'osasuna':'assets/official-logos/osasuna.png',
  'san antonio jrs':'assets/official-logos/san-antonio-jrs.png',
  'san antonio jr':'assets/official-logos/san-antonio-jrs.png',
  'populares':'assets/official-logos/populares.png',
  'promesas fc':'assets/official-logos/promesas-fc.png',
  'la huerta':'assets/official-logos/la-huerta.png',
  'la huerta de cuenda':'assets/official-logos/la-huerta.png',
  'tavera fc':'assets/official-logos/tavera-fc.png',
  'pachangas fc':'assets/official-logos/pachangas-fc.png',
  'san juan fc':'assets/official-logos/san-juan-fc.png',
  'tapatio':'assets/official-logos/tapatio.png',
  'dep la luz':'assets/official-logos/dep-la-luz.png',
  'deportivo la luz':'assets/official-logos/dep-la-luz.png',
  'san julian':'assets/official-logos/san-julian.png',
  'barza':'assets/official-logos/barza.png',
  'san jose jrs':'assets/official-logos/san-jose-jrs.png',
  'san antonio fc':'assets/official-logos/san-antonio-fc.png',
  'celticos':'assets/official-logos/celticos.png',
  'celticos fc':'assets/official-logos/celticos.png',
  'dep nopalero':'assets/official-logos/dep-nopalero.png',
  'deportivo nopalero':'assets/official-logos/dep-nopalero.png',
  'dep zapata':'assets/official-logos/dep-zapata.png',
  'deportivo zapata':'assets/official-logos/dep-zapata.png',
  'boavista':'assets/official-logos/boavista.png',
  'franco tavera jr':'assets/teams/franco-tavera-jr-veteranos.webp',
  'franco tavera':'assets/teams/franco-tavera-jr-veteranos.webp',
  'huracan':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Huracan_pfndn5',
  'cuenda':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SantiagoCuenda_fvaq9e',
  'america':'assets/branding/america-veteranos-35-user.png',
  'aguilares':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/aguilares_ifdgll',
  'leyendas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LEYENDAS_jwcnlu',
  'leyendas fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LEYENDAS_jwcnlu',
  'psv':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PSV_ru3tft',
  'la trinidad':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/La_trinidad_a32pbk',
  'dynamo':'assets/official-logos/dynamo.png',
  'manchester':'assets/official-logos/manchester.png',
  'la esperanza':'assets/official-logos/la-esperanza.png',
  'boca jrs':'assets/official-logos/boca-jrs.png',
  'boca juniors':'assets/official-logos/boca-jrs.png',
  'toros de cuenda':'assets/official-logos/toros-de-cuenda.png'
};

const HISTORY_FORCE_LOGOS={
  'manchester':RAW+'assets/official-logos/manchester.png?v=20261006-v873',
  'la esperanza':RAW+'assets/official-logos/la-esperanza.png?v=20261006-v873',
  'toros de cuenda':RAW+'assets/official-logos/toros-de-cuenda.png?v=20261006-v873'
};

function logoUrl(name){
  const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const normalizePath=p=>{
    p=String(p||'').trim();if(!p)return '';
    if(/^(?:https?:|data:|blob:)/i.test(p))return p;
    return RAW+p.replace(/^\.\//,'').replace(/^\//,'');
  };
  const key=norm(name);
  const forced=HISTORY_FORCE_LOGOS[key];
  if(forced)return forced;
  try{
    const stable=window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name);
    if(stable)return normalizePath(stable);
  }catch(_){}
  const fixed=HISTORY_LOGO_PATHS[key];
  if(fixed)return normalizePath(fixed);
  const hit=Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===key)?.[1];
  if(typeof hit==='string')return normalizePath(hit);
  return normalizePath(hit?.app||hit?.source||hit?.local||'');
}
function teamMark(name){
  const src=logoUrl(name);
  const initials=String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JR';
  return '<span class="v164-history-logo '+(src?'has-logo':'fallback')+'">'+
    (src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'grid\'"><b style="display:none">'+esc(initials)+'</b>':'<b>'+esc(initials)+'</b>')+
  '</span>';
}
function scoreOf(r){
  const h=String(r?.[3]??''),a=String(r?.[5]??'');
  return /^\d+$/.test(h)&&/^\d+$/.test(a)?h+'–'+a:'';
}
function rows(){
  const out=[];
  for(const [catId,cat] of Object.entries(db?.categories||{})){
    for(const block of cat?.fixtures||[]){
      for(const r of block?.rows||[]){
        const score=scoreOf(r);
        if(!score||!r?.[2]||!r?.[6])continue;
        out.push({
          catId,
          category:cat?.name||'Categoría',
          round:r?.[1]||'',
          home:r?.[2]||'',
          score,
          away:r?.[6]||'',
          venue:r?.[7]||'Campo por confirmar',
          datetime:r?.[8]||'',
          stamp:stamp(r?.[8])
        });
      }
    }
  }
  return out.sort((a,b)=>b.stamp-a.stamp);
}
function markup(){
  const list=rows();
  return '<section class="v164-history-page" data-v164-history-log>'+
    '<header class="v164-history-head">'+
      '<small>ARCHIVO DE PARTIDOS</small>'+
      '<h1>Historial</h1>'+
      '<p>Consulta resultados, marcadores y partidos anteriores publicados oficialmente por la Liga.</p>'+
    '</header>'+
    '<div class="v164-history-switch">'+
      '<button type="button" class="active">Historial</button>'+
      '<button type="button" data-route="history">Historia</button>'+
    '</div>'+
    '<section class="v164-history-results">'+
      '<div class="v164-history-section-head"><h2>Partidos anteriores</h2><span>'+list.length+' resultados</span></div>'+
      (list.length?list.slice(0,80).map(x=>
        '<article class="v164-history-match">'+
          '<div class="v164-history-meta"><span>'+esc(x.category)+'</span><b>'+esc(dateText(x.datetime))+'</b></div>'+
          '<div class="v164-history-score">'+
            '<span class="v164-history-team home">'+teamMark(x.home)+'<em>'+esc(x.home)+'</em></span>'+
            '<strong>'+esc(x.score)+'</strong>'+
            '<span class="v164-history-team away">'+teamMark(x.away)+'<em>'+esc(x.away)+'</em></span>'+
          '</div>'+
          '<div class="v164-history-foot"><span>'+(x.round?'Jornada '+esc(x.round)+' · ':'')+esc(x.venue)+'</span></div>'+
        '</article>'
      ).join(''):'<div class="v164-history-empty"><b>Sin resultados publicados</b><span>Cuando la Liga publique marcadores oficiales aparecerán aquí.</span></div>')+
    '</section>'+
  '</section>';
}
function bind(root){
  root.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+b.dataset.route});
}
function render(){
  if(route()!=='historyLog'||guard)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  guard=true;
  screen.innerHTML=markup();
  document.body.dataset.appRoute='historyLog';
  bind(screen);
  guard=false;
}
async function load(){
  if(db){render();return db}
  if(loading)return loading;
  loading=(async()=>{
    for(const u of [LOCAL,REMOTE]){
      try{
        const r=await fetch(u,{cache:'no-store'});
        if(r.ok){db=await r.json();window.LJR_OFFICIAL_DATA=db;break}
      }catch(_){}
    }
    render();
    return db;
  })();
  return loading;
}
function sync(){
  if(route()!=='historyLog')return;
  render();
  load();
}
window.addEventListener('hashchange',()=>requestAnimationFrame(sync));
window.addEventListener('ljr:official-data',()=>{db=window.LJR_OFFICIAL_DATA||db;if(route()==='historyLog')render()});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='historyLog'&&!screen.querySelector('.v164-history-page'))requestAnimationFrame(sync)}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
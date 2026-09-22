/* V164 — HISTORIAL separado de HISTORIA.
   HISTORIA conserva temporadas/campeones/finales.
   HISTORIAL muestra resultados de partidos publicados oficialmente. */
(function(){
'use strict';
if(window.__LJR_V164_HISTORY_LOG__)return;
window.__LJR_V164_HISTORY_LOG__=true;

const LOCAL='./public/data/official-live.json?v=20260922-v164';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20260922-v164';
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
      '<p>Resultados publicados por la Liga. Este apartado es independiente de Historia.</p>'+
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
            '<span>'+esc(x.home)+'</span><strong>'+esc(x.score)+'</strong><span>'+esc(x.away)+'</span>'+
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
  document.querySelectorAll('.bottom-nav .nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='more'));
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
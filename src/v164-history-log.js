/* V164 — HISTORIAL separado de HISTORIA.
   HISTORIA conserva temporadas/campeones/finales.
   HISTORIAL muestra resultados de partidos publicados oficialmente. */
(function(){
'use strict';
if(window.__LJR_V164_HISTORY_LOG__)return;
window.__LJR_V164_HISTORY_LOG__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
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
  'manchester':RAW+'assets/official-logos/manchester.png?v=20261006-v874',
  'la esperanza':RAW+'assets/official-logos/la-esperanza.png?v=20261006-v874',
  'toros de cuenda':RAW+'assets/official-logos/toros-de-cuenda.png?v=20261006-v874'
};

function logoUrl(name){
  const normalizePath=p=>{
    p=String(p||'').trim();if(!p)return '';
    if(/^(?:https?:|data:|blob:)/i.test(p))return p;
    return RAW+p.replace(/^\.\//,'').replace(/^\//,'');
  };
  const key=norm(name);
  try{
    const stable=window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name);
    if(stable)return normalizePath(stable);
  }catch(_){}
  const forced=HISTORY_FORCE_LOGOS[key];
  if(forced)return forced;
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

/* V1213: consultas de archivo, filtros y tarjetas adaptadas para móvil.
   Todos los marcadores provienen de fixtures oficiales; no se crean resultados. */
const historyState={category:'all',year:'all',team:'all',query:'',sort:'newest',page:1,pageSize:10};
let cachedOfficial=null,cachedOfficialRows=null,searchTimer=null;
function rows(){
  if(db&&db===cachedOfficial&&cachedOfficialRows)return cachedOfficialRows;
  const out=[];
  for(const [catId,cat] of Object.entries(db?.categories||{})){
    for(const block of cat?.fixtures||[]){
      for(const r of block?.rows||[]){
        const score=scoreOf(r);
        if(!score||!r?.[2]||!r?.[6])continue;
        const rawDate=String(r?.[8]||'');
        const year=rawDate.match(/\b(20\d{2}|19\d{2})\b/)?.[1]||'';
        out.push({
          catId,category:cat?.name||'Categoría',round:r?.[1]||'',
          home:String(r?.[2]||''),away:String(r?.[6]||''),
          homeGoals:Number(r?.[3]),awayGoals:Number(r?.[5]),score,
          venue:r?.[7]||'Campo por confirmar',datetime:rawDate,
          year,stamp:stamp(rawDate)
        });
      }
    }
  }
  out.sort((a,b)=>b.stamp-a.stamp);
  if(db){cachedOfficial=db;cachedOfficialRows=out;}
  return out;
}
function filtered(all){
  const q=norm(historyState.query);
  return all.filter(x=>
    (historyState.category==='all'||x.catId===historyState.category)&&
    (historyState.year==='all'||x.year===historyState.year)&&
    (historyState.team==='all'||norm(x.home)===historyState.team||norm(x.away)===historyState.team)&&
    (!q||norm([x.home,x.away,x.category,x.venue,x.round,x.datetime].join(' ')).includes(q))
  ).sort((a,b)=>historyState.sort==='oldest'?a.stamp-b.stamp:
    historyState.sort==='goals'?(b.homeGoals+b.awayGoals)-(a.homeGoals+a.awayGoals)||b.stamp-a.stamp:
    b.stamp-a.stamp);
}
function options(values,current){
  return values.map(v=>'<option value="'+esc(v.value)+'"'+(String(v.value)===String(current)?' selected':'')+'>'+esc(v.label)+'</option>').join('');
}
function teamChoices(all){
  const names=new Map();
  all.filter(x=>historyState.category==='all'||x.catId===historyState.category)
    .forEach(x=>[x.home,x.away].forEach(name=>{if(name&&!names.has(norm(name)))names.set(norm(name),name)}));
  return [{value:'all',label:'Todos los equipos'},...Array.from(names.entries()).sort((a,b)=>a[1].localeCompare(b[1],'es')).map(([value,label])=>({value,label}))];
}
function filterMarkup(all){
  const cats=new Map(all.map(x=>[x.catId,x.category]));
  const catOptions=[{value:'all',label:'Todas las categorías'},...Array.from(cats.entries()).map(([value,label])=>({value,label}))];
  const years=[...new Set(all.map(x=>x.year).filter(Boolean))].sort((a,b)=>b.localeCompare(a));
  return '<section class="v164-history-controls" aria-label="Buscar y filtrar el historial">'+
    '<label class="v164-history-search"><span>Buscar partido</span><span class="v164-history-search-wrap"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" data-v164-search placeholder="Equipo, cancha o jornada…" autocomplete="off" value="'+esc(historyState.query)+'"></span></label>'+
    '<div class="v164-history-filters">'+
      '<label><span>Categoría</span><select data-v164-category>'+options(catOptions,historyState.category)+'</select></label>'+
      '<label><span>Temporada / Año</span><select data-v164-year>'+options([{value:'all',label:'Todos los años'},...years.map(y=>({value:y,label:y}))],historyState.year)+'</select></label>'+
      '<label><span>Equipo</span><select data-v164-team>'+options(teamChoices(all),historyState.team)+'</select></label>'+
      '<label><span>Ordenar</span><select data-v164-sort>'+options([{value:'newest',label:'Más recientes'},{value:'oldest',label:'Más antiguos'},{value:'goals',label:'Más goles'}],historyState.sort)+'</select></label>'+
    '</div>'+
    '<div class="v164-history-toolrow"><span>Datos publicados por la Liga</span><button type="button" data-v164-clear>Limpiar filtros</button></div>'+
  '</section>';
}
function summaryMarkup(list){
  const goals=list.reduce((n,x)=>n+x.homeGoals+x.awayGoals,0);
  const draws=list.filter(x=>x.homeGoals===x.awayGoals).length;
  return '<div class="v164-history-summary">'+
    '<div><strong>'+list.length+'</strong><span>Partidos</span></div>'+
    '<div><strong>'+goals+'</strong><span>Goles</span></div>'+
    '<div><strong>'+draws+'</strong><span>Empates</span></div>'+
  '</div>';
}
function detailText(x){
  return 'Liga Juventino Rosas\n'+x.category+'\n'+x.home+' '+x.score+' '+x.away+
    '\n'+(x.datetime||'Fecha por confirmar')+
    (x.round?'\nJornada '+x.round:'')+'\n'+x.venue;
}
function cardMarkup(x,index){
  const day=dateText(x.datetime);
  const clock=String(x.datetime).match(/\b(\d{1,2}:\d{2})\b/)?.[1]||'';
  return '<article class="v164-history-match">'+
    '<div class="v164-history-meta"><span>'+esc(x.category)+'</span><b>'+esc(day||'Fecha por confirmar')+'</b></div>'+
    '<div class="v164-history-score">'+
      '<span class="v164-history-team home">'+teamMark(x.home)+'<em title="'+esc(x.home)+'">'+esc(x.home)+'</em></span>'+
      '<strong aria-label="Marcador '+esc(x.score)+'">'+esc(x.score)+'</strong>'+
      '<span class="v164-history-team away">'+teamMark(x.away)+'<em title="'+esc(x.away)+'">'+esc(x.away)+'</em></span>'+
    '</div>'+
    '<div class="v164-history-foot"><span>'+(x.round?'Jornada '+esc(x.round)+' · ':'')+esc(x.venue)+'</span><small>Finalizado</small></div>'+
    '<div class="v164-history-card-actions">'+
      '<details class="v164-history-detail"><summary>Ficha del partido <span aria-hidden="true">⌄</span></summary>'+
      '<div class="v164-history-detail-body"><p><b>Categoría</b><span>'+esc(x.category)+'</span></p>'+
      '<p><b>Fecha</b><span>'+esc(day||'Por confirmar')+(clock?' · '+esc(clock):'')+'</span></p>'+
      '<p><b>Jornada</b><span>'+esc(x.round||'Sin dato')+'</span></p>'+
      '<p><b>Cancha</b><span>'+esc(x.venue)+'</span></p></div></details>'+
      '<button type="button" data-v164-copy="'+index+'" aria-label="Copiar resultado de '+esc(x.home)+' contra '+esc(x.away)+'">Copiar</button>'+
      '<button type="button" data-v164-share="'+index+'" aria-label="Compartir resultado de '+esc(x.home)+' contra '+esc(x.away)+'">Compartir</button>'+
    '</div>'+
  '</article>';
}
function resultsMarkup(all,list){
  const totalPages=Math.max(1,Math.ceil(list.length/historyState.pageSize));
  historyState.page=Math.min(Math.max(1,historyState.page),totalPages);
  const from=(historyState.page-1)*historyState.pageSize;
  const shown=list.slice(from,from+historyState.pageSize);
  return '<section class="v164-history-results" aria-label="Resultados históricos">'+
    '<div class="v164-history-section-head"><h2>Partidos anteriores</h2><span>'+list.length+' resultado'+(list.length===1?'':'s')+'</span></div>'+
    (shown.length?shown.map((x,i)=>cardMarkup(x,from+i)).join(''):
      '<div class="v164-history-empty"><b>'+(all.length?'Sin coincidencias':'Sin resultados publicados')+'</b><span>'+
      (all.length?'Prueba con otra categoría, equipo o año.':'Cuando la Liga publique marcadores oficiales aparecerán aquí.')+'</span></div>')+
    (list.length>historyState.pageSize?
      '<div class="v164-history-pagination">'+
        '<button type="button" data-v164-prev '+(historyState.page===1?'disabled':'')+'>Anterior</button>'+
        '<span aria-live="polite">Página '+historyState.page+' de '+totalPages+'</span>'+
        '<button type="button" data-v164-next '+(historyState.page===totalPages?'disabled':'')+'>Siguiente</button>'+
      '</div>':'')+
    (list.length?'<p class="v164-history-showing">Mostrando '+(from+1)+'–'+(from+shown.length)+' de '+list.length+' resultados</p>':'')+
  '</section>';
}
function markup(){
  const all=rows(),list=filtered(all);
  return '<section class="v164-history-page" data-v164-history-log>'+
    '<header class="v164-history-head">'+
      '<small>ARCHIVO DE PARTIDOS</small><h1>Historial</h1>'+
      '<p>Consulta los marcadores y partidos anteriores publicados por la Liga.</p>'+
    '</header>'+
    '<div class="v164-history-switch">'+
      '<button type="button" class="active" aria-current="page">Historial</button>'+
      '<button type="button" data-route="history">Historia</button>'+
    '</div>'+filterMarkup(all)+
    '<div data-v164-summary>'+summaryMarkup(list)+'</div>'+
    '<div data-v164-results>'+resultsMarkup(all,list)+'</div>'+
    '<p class="v164-history-feedback" data-v164-feedback role="status" aria-live="polite"></p>'+
  '</section>';
}
function updateResults(){
  const root=document.querySelector('[data-v164-history-log]');
  if(!root)return;
  const all=rows(),list=filtered(all);
  const summary=root.querySelector('[data-v164-summary]');
  const results=root.querySelector('[data-v164-results]');
  if(summary)summary.innerHTML=summaryMarkup(list);
  if(results)results.innerHTML=resultsMarkup(all,list);
}
async function copyHistory(textValue){
  if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(textValue);return}
  const box=document.createElement('textarea');box.value=textValue;
  box.style.cssText='position:fixed;top:-2000px;opacity:0';
  document.body.appendChild(box);box.select();
  try{if(!document.execCommand('copy'))throw Error('No se pudo copiar')}finally{box.remove()}
}
function notice(message){
  const target=document.querySelector('[data-v164-feedback]');
  if(target)target.textContent=message;
}
function bind(root){
  if(root.dataset.v164Bound)return;
  root.dataset.v164Bound='1';
  root.addEventListener('input',e=>{
    if(!e.target.matches('[data-v164-search]'))return;
    historyState.query=e.target.value;historyState.page=1;
    clearTimeout(searchTimer);
    searchTimer=setTimeout(()=>{if(route()==='historyLog')updateResults()},180);
  });
  root.addEventListener('change',e=>{
    const t=e.target;
    if(t.matches('[data-v164-category]')){
      historyState.category=t.value;historyState.team='all';
      const sel=root.querySelector('[data-v164-team]');
      if(sel)sel.innerHTML=options(teamChoices(rows()),'all');
    }else if(t.matches('[data-v164-year]'))historyState.year=t.value;
    else if(t.matches('[data-v164-team]'))historyState.team=t.value;
    else if(t.matches('[data-v164-sort]'))historyState.sort=t.value;
    else return;
    historyState.page=1;updateResults();
  });
  root.addEventListener('click',async e=>{
    const t=e.target.closest('button');if(!t||!root.contains(t))return;
    if(t.hasAttribute('data-route')){location.hash='#/'+t.dataset.route;return}
    if(t.hasAttribute('data-v164-clear')){
      Object.assign(historyState,{category:'all',year:'all',team:'all',query:'',sort:'newest',page:1});
      render();return;
    }
    if(t.hasAttribute('data-v164-next')){historyState.page++;updateResults();return}
    if(t.hasAttribute('data-v164-prev')){historyState.page=Math.max(1,historyState.page-1);updateResults();return}
    if(t.hasAttribute('data-v164-copy')||t.hasAttribute('data-v164-share')){
      const idx=Number(t.getAttribute('data-v164-copy')??t.getAttribute('data-v164-share'));
      const match=filtered(rows())[idx];if(!match)return;
      const txt=detailText(match);
      try{
        if(t.hasAttribute('data-v164-share')&&navigator.share){
          await navigator.share({title:'Resultado · Liga Juventino Rosas',text:txt});
          notice('Resultado compartido.');return;
        }
        await copyHistory(txt);notice('Resultado copiado para compartir.');
      }catch(err){if(err?.name!=='AbortError')notice('No fue posible compartir automáticamente este resultado.')}
    }
  });
}
function render(){
  if(route()!=='historyLog'||guard)return;
  const screen=document.querySelector('#screen');if(!screen)return;
  guard=true;
  screen.innerHTML=markup();
  document.body.dataset.appRoute='historyLog';
  bind(screen);guard=false;
}

async function load(){
  const shared=window.LJR_OFFICIAL_DATA;
  if(shared?.categories){db=shared;render();return db;}
  if(db){render();return db}
  if(loading)return loading;
  loading=(async()=>{
    for(const u of [LOCAL,REMOTE]){
      try{
        const r=await fetch(u,{cache:'default'});
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
window.addEventListener('hashchange',()=>{clearTimeout(searchTimer);requestAnimationFrame(sync)});
window.addEventListener('ljr:official-data',()=>{db=window.LJR_OFFICIAL_DATA||db;if(route()==='historyLog')render()});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='historyLog'&&!screen.querySelector('.v164-history-page'))requestAnimationFrame(sync)}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
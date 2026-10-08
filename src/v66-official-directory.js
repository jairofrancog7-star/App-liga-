/* V66 — Directorio oficial AdminFut: plantillas/tienda y datos auxiliares.
   #/teams queda bajo V27 + V62 para evitar dos renderizados consecutivos y conservar una sola pantalla estable. */
(function(){
'use strict';
/* V625 — respeta al renderizador que ya tomó #/players; V66 conserva tienda y APIs auxiliares. */
if(!window.__LJR_PLAYER_DIRECTORY_OWNER__)window.__LJR_PLAYER_DIRECTORY_OWNER__='v66';
function ownsPlayers(){return window.__LJR_PLAYER_DIRECTORY_OWNER__==='v66'}
const LOCAL='./data/official-live.json?v=20261008-v970-all-53-category-memberships';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261008-v968-global-official-coherence';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const CAT_ORDER=['3','5','4','2','1'];
const CAT_LABEL={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};

/* V812 — Tienda: catálogo limitado a los clubes activos de la temporada 2026.
   Fuente: public/data/temporada-actual-2026.json. Son 53 inscripciones por
   categoría y 51 clubes únicos (Juventus y Boavista participan en dos). */
const V812_ACTIVE_STORE_BY_CAT={
  '3':['San José FC','Juventus','Linces','Napoli','Hermanos','Franco FC','Herreras FC','Abejas','Terrícolas','Lobos CDG','Galácticos'],
  '5':['La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio Jrs','Populares','Promesas FC','La Huerta'],
  '4':['Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José Jrs','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata'],
  '2':['BOAVISTA','FRANCO-TAVERA-JR','HURACAN','CUENDA','AMERICA','AGUILARES','JUVENTUS','LEYENDAS FC','PSV','LA TRINIDAD','POZOS FC'],
  '1':['La Esperanza','Dynamo','Boca Jrs','Toros de Cuenda','Boavista','Manchester']
};
const V812_ACTIVE_STORE_TEAMS=CAT_ORDER.flatMap(id=>V812_ACTIVE_STORE_BY_CAT[id]||[]);
window.LJR_V812_ACTIVE_STORE_TEAMS=V812_ACTIVE_STORE_TEAMS.slice();
/* A club can have more than one registration. Preserve category membership rather
   than inventing extra clubs or merging distinct clubs such as Cuenda/Toros. */
window.LJR_V812_TEAM_CATEGORIES=function(name){
 const key=norm(name);
 return [...new Set(v812ActiveStoreList().filter(row=>norm(row.name)===key).map(row=>row.category))];
};
window.LJR_V812_TEAM_CATALOG={
 registrations:()=>v812ActiveStoreList(),
 uniqueTeams:()=>[...new Map(v812ActiveStoreList().map(row=>[norm(row.name),row.name])).values()],
 categoriesFor:name=>window.LJR_V812_TEAM_CATEGORIES(name)
};
window.LJR_V812_IS_ACTIVE_STORE_TEAM=function(name){return V812_ACTIVE_STORE_TEAMS.some(n=>same(n,name))};
function v812ActiveStoreList(){
  const out=[],seen=new Set();
  for(const id of CAT_ORDER){
    for(const raw of (V812_ACTIVE_STORE_BY_CAT[id]||[])){
      const name=String(raw||'').trim(),key=id+':'+norm(name);
      /* Un registro por equipo y categoría: Juventus y Boavista participan dos veces. */
      if(!name||seen.has(key))continue;
      seen.add(key);
      out.push({name,cat:String(id),category:CAT_LABEL[String(id)]||'Liga Municipal'});
    }
  }
  return out;
}
const CAT_LOGOS_V630={
  '3':'./assets/branding/primera-fuerza-hd.png',
  '5':'./assets/categories/intermedia.webp',
  '4':'./assets/categories/segunda-fuerza.webp',
  '2':'./assets/categories/veteranos-35-user.png',
  '1':'./assets/categories/veteranos-50.webp'
};
let storeRailScroll=0;
let db=null, loading=null, teamQuery='', storeCat=(()=>{try{const id=localStorage.getItem('v989-store-category')||'all';return CAT_ORDER.includes(id)?id:'all'}catch(_){return 'all'}})(), playerQuery='', playerCat=localStorage.getItem('v66-player-cat')||'all', playerTeam=localStorage.getItem('v66-player-team')||'all', cedulaCat=localStorage.getItem('v66-cedula-cat-filter')||'all', cedulaTeam=localStorage.getItem('v66-cedula-team-filter')||'all';

function route(){return location.hash.replace(/^#\/?/,'')||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function norm(v){
  return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/\batl\b/g,'atletico').replace(/\bdep\b/g,'deportivo').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
function same(a,b){
  const x=norm(a),y=norm(b); if(x===y)return true;
  const pairs=[['atletico galeana','galeana'],['toros de cuenda','cuenda'],['deportivo maravillas','dep maravillas'],['deportivo zapata','dep zapata'],['deportivo nopalero','dep nopalero'],['deportivo la luz','dep la luz']];
  return pairs.some(p=>(x===norm(p[0])&&y===norm(p[1]))||(x===norm(p[1])&&y===norm(p[0])));
}
function sharedData(){
  try{
    const shared=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
    return shared?.categories?shared:null;
  }catch(_){return window.LJR_OFFICIAL_DATA?.categories?window.LJR_OFFICIAL_DATA:null}
}
async function load(){
  const current=sharedData();
  if(current){db=current;return db}
  if(db)return db;
  if(loading)return loading;
  loading=(async()=>{
    for(const u of [LOCAL,REMOTE]){
      try{const r=await fetch(u,{cache:'no-store'});if(r.ok){db=await r.json();break}}catch(e){}
    }
    return db;
  })();
  return loading;
}
function logoFor(name){
  const supplied=window.LJR_SEASON_LOGOS?.get(name);if(supplied)return supplied;
  const entries=Object.entries(db?.team_logos||{});
  const hit=entries.find(([k])=>same(k,name));
  const v=hit?.[1];
  if(typeof v==='string')return v;
  if(v?.local)return SRC+String(v.local).replace(/^\.\//,'');
  if(v?.source)return v.source;
  return '';
}
function teamList(){
  const out=[],seen=[];
  /* V513 — Tienda/equipos: solo clubes reales.
     La tabla de goleadores puede traer filas resumen como
     ["1","JUVENTUS","22 goles en temporada","22"]; esa tercera celda
     es una estadística, no el nombre de un equipo. */
  const validTeamName=name=>{
    name=String(name||'').trim();
    if(!name)return false;
    if(/^\d+\s*(?:ge|goles?)$/i.test(name))return false;
    if(/^\d+\s+goles?\s+en\s+temporada$/i.test(name))return false;
    if(/goles?\s+en\s+temporada/i.test(name))return false;
    return true;
  };
  const add=(name,id)=>{
    name=String(name||'').trim();
    if(!validTeamName(name))return;
    if(seen.some(x=>x.id===String(id)&&same(x.name,name)))return;
    seen.push({name,id:String(id)});
    out.push({name,cat:String(id),category:db?.categories?.[String(id)]?.name||CAT_LABEL[String(id)]||'Liga Municipal'});
  };
  for(const id of CAT_ORDER){
    const c=db?.categories?.[id]; if(!c)continue;
    Object.keys(c.rosters||{}).forEach(n=>add(n,id));
    ((c.standings||[])[0]?.rows||[]).forEach(r=>add(r?.[1],id));
    ((c.fixtures||[])[0]?.rows||[]).forEach(r=>{add(r?.[2],id);add(r?.[6],id)});
    /* No derivar clubes desde scorers: puede contener resúmenes de goles. */
  }
  return out;
}
function rosterFor(teamName,catId){
  const c=db?.categories?.[String(catId)]; if(!c)return [];
  const k=Object.keys(c.rosters||{}).find(n=>same(n,teamName));
  return k&&Array.isArray(c.rosters[k])?c.rosters[k].map(String):[];
}
function profileFor(cat,team,name){
  const entry=Object.entries(cat?.player_profiles||{}).find(([t])=>same(t,team));
  const rows=Array.isArray(entry?.[1])?entry[1]:[];
  return rows.find(p=>same(p?.name,name))||null;
}
function playerList(){
  const out=[],seen=new Set();
  for(const id of CAT_ORDER){
    const c=db?.categories?.[id]; if(!c)continue;
    const teamNames=new Map();
    Object.keys(c.rosters||{}).forEach(t=>teamNames.set(norm(t),t));
    Object.keys(c.player_profiles||{}).forEach(t=>teamNames.set(norm(t),t));
    for(const team of teamNames.values()){
      const roster=Array.isArray(c.rosters?.[team])?c.rosters[team]:[];
      const pEntry=Object.entries(c.player_profiles||{}).find(([t])=>same(t,team));
      const profiles=Array.isArray(pEntry?.[1])?pEntry[1]:[];
      const names=[...roster,...profiles.map(p=>p?.name).filter(Boolean)];
      for(const raw of names){
        const name=String(raw||'').trim(); if(!name)continue;
        const key=norm(name)+'|'+norm(team)+'|'+id; if(seen.has(key))continue; seen.add(key);
        const p=profileFor(c,team,name)||{};
        out.push({
          name,team,cat:id,category:c.name||CAT_LABEL[id]||id,
          position:String(p.position||''),dorsal:String(p.dorsal||''),
          photo:String(p.photo||'')
        });
      }
    }
  }
  return out;
}
function fallback(name){
  return String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()||'⚽';
}
function playerAvatar(p,cls='v66-player-avatar'){
  const src=String(p?.photo||window.LJR_PLAYER_MEDIA?.photo?.(p?.name,p?.team,p?.cat)||'');
  return src
    ?'<span class="'+cls+' v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(p?.name||'Jugador')+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>'
    :'<span class="'+cls+'">'+esc(fallback(p?.name).slice(0,2))+'</span>';
}
function teamLogo(t,cls='v66-team-logo'){
  const src=logoFor(t.name);
  return '<span class="'+cls+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(t.name)+'" loading="lazy" decoding="async">':'<b>'+esc(fallback(t.name))+'</b>')+'</span>';
}
function categoryRail(active='all',attr='data-v66-cat'){
  const ids=CAT_ORDER.filter(id=>db?.categories?.[id]);
  return '<div class="v66-category-rail"><button class="'+(active==='all'?'active':'')+'" '+attr+'="all">Todos</button>'+
    ids.map(id=>'<button class="'+(active===id?'active':'')+'" '+attr+'="'+id+'">'+esc(db.categories[id].name||CAT_LABEL[id])+'</button>').join('')+'</div>';
}
function teamsForPlayerFilter(){
  const seen=[];
  const add=(name,id)=>{
    name=String(name||'').trim();if(!name)return;
    if(playerCat!=='all'&&String(id)!==String(playerCat))return;
    if(seen.some(x=>same(x.name,name)))return;
    seen.push({name,cat:String(id),category:db?.categories?.[String(id)]?.name||CAT_LABEL[String(id)]||''});
  };
  for(const id of CAT_ORDER){
    const c=db?.categories?.[id];if(!c)continue;
    Object.keys(c.rosters||{}).forEach(n=>add(n,id));
  }
  seen.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
  if(playerTeam!=='all'&&!seen.some(t=>same(t.name,playerTeam))){
    playerTeam='all';
    localStorage.setItem('v66-player-team','all');
  }
  return seen;
}
function playerTeamRail(){
  const teams=teamsForPlayerFilter();
  return '<div class="v66-filter-label">EQUIPO</div>'+
    '<div class="v66-team-filter-rail">'+
      '<button type="button" class="'+(playerTeam==='all'?'active':'')+'" data-v66-player-team-filter="all">Todos los equipos</button>'+
      teams.map(t=>{
        const src=logoFor(t.name);
        return '<button type="button" class="'+(same(playerTeam,t.name)?'active':'')+'" data-v66-player-team-filter="'+esc(t.name)+'">'+
          (src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async">':'')+
          '<span>'+esc(t.name)+'</span>'+
        '</button>';
      }).join('')+
    '</div>';
}
function v812IsActiveStoreTeam(name){
  return V812_ACTIVE_STORE_TEAMS.some(n=>same(n,name));
}
function teamMarkup(store=false){
  const q=norm(teamQuery);
  const source=store?v812ActiveStoreList():teamList();
  const currentCat=store&&CAT_ORDER.includes(storeCat)?storeCat:'all';
  const list=source.filter(t=>(!store||currentCat==='all'||t.cat===currentCat)&&
    (!q||norm(t.name).includes(q)||norm(t.category).includes(q)));
  const categories=store?'<div class="v989-store-filter-title"><b>FILTRAR POR CATEGORÍA</b><div class="v990-rail-actions">'+
    '<span>Desliza</span><button type="button" data-v990-rail-step="-1" aria-label="Categorías anteriores"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button>'+
    '<button type="button" data-v990-rail-step="1" aria-label="Más categorías"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button></div></div>'+
    '<div class="v989-store-categories" role="group" aria-label="Filtrar tiendas por categoría">'+
      '<button type="button" data-v66-store-cat="all" class="'+(currentCat==='all'?'active':'')+'" aria-pressed="'+(currentCat==='all')+'"><span class="v989-all-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 4.5h-5L8 10zM8 10 4.7 9M9.5 14.5 8 19M14.5 14.5 16 19M16 10l3.3-1"/></svg></span><span>Todas</span><span class="v989-filter-count">'+source.length+'</span></button>'+
      CAT_ORDER.map(id=>{
        const count=source.filter(t=>t.cat===id).length;
        const name=CAT_LABEL[id];
        const logo=CAT_LOGOS_V630[id];
        return '<button type="button" data-v66-store-cat="'+id+'" class="'+(currentCat===id?'active':'')+'" aria-pressed="'+(currentCat===id)+'">'+
          (logo?'<img src="'+esc(logo)+'" alt="" loading="lazy" decoding="async">':'')+
          '<span>'+esc(name)+'</span><span class="v989-filter-count">'+count+'</span></button>';
      }).join('')+
    '</div>':'';
  const header=store?'<header class="v510-store-head">'+
    '<button type="button" data-v447-store-back aria-label="Volver"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>'+
    '<div class="v989-store-copy"><span class="v989-store-kicker">LIGA JUVENTINO ROSAS · 2026</span>'+
    '<h1 class="v989-store-title">Tienda de clubes</h1>'+
    '<span class="v989-store-subtitle">Encuentra tu equipo y explora su colección</span>'+
    '<button type="button" class="v989-store-jump" data-v989-store-categories>Ver categorías ↓</button></div>'+
    '<span class="v510-store-crest" aria-hidden="true"></span>'+
    '<button type="button" data-route="profile" class="v510-store-profile" aria-label="Perfil"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 19c.7-3.4 3-5.5 6.5-5.5s5.8 2.1 6.5 5.5"/></svg></button></header>':'';
  const empty='<div class="v989-store-empty" role="status"><b>Sin equipos para esta búsqueda</b>'+
    '<p>Prueba con otro nombre o elige una categoría diferente.</p>'+
    '<button type="button" data-v989-store-reset>Mostrar todos los equipos</button></div>';
  return '<section class="v66-directory" data-v66-directory="'+(store?'store':'teams')+'">'+
    header+
    (store?'<div class="v989-shop-label"><strong>Encuentra tu club</strong><span>Temporada 2026</span></div>':'')+
    (store?'<div class="v66-search v990-store-search"><span class="v990-search-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></svg></span><input data-v66-team-search aria-label="Buscar equipo activo" type="search" autocomplete="off" placeholder="Busca tu equipo favorito..." value="'+esc(teamQuery)+'"><button type="button" data-v990-search-clear aria-label="Limpiar búsqueda" '+(!teamQuery?'hidden':'')+'><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18"/></svg></button></div>':'<div class="v66-search"><span aria-hidden="true">⌕</span><input data-v66-team-search aria-label="Buscar equipo" type="search" autocomplete="off" placeholder="Buscar equipo registrado" value="'+esc(teamQuery)+'"></div>')+
    categories+
    '<p class="v66-source-note" aria-live="polite">'+list.length+(store?' de '+source.length+' inscripciones · '+(currentCat==='all'?'Todas las categorías':esc(CAT_LABEL[currentCat]||'')):' equipos registrados · datos oficiales sincronizados')+'</p>'+
    '<div class="v66-team-grid">'+list.map(t=>'<button type="button" class="v66-team-card" data-v66-open-team="'+esc(t.name)+'" data-v66-cat-id="'+esc(t.cat)+'" aria-label="Abrir tienda de '+esc(t.name)+', '+esc(t.category)+'">'+teamLogo(t)+'<span><b>'+esc(t.name)+'</b><small>'+esc(t.category)+(store?' · Tienda':'')+'</small></span><i aria-hidden="true">›</i></button>').join('')+'</div>'+
    (store&&!list.length?empty:'')+
  '</section>';
}
function playerMarkup(){
  const q=norm(playerQuery);
  const all=playerList();
  teamsForPlayerFilter();
  const list=all.filter(p=>
    (playerCat==='all'||p.cat===playerCat)&&
    (playerTeam==='all'||same(p.team,playerTeam))&&
    (!q||norm(p.name).includes(q)||norm(p.team).includes(q))
  );
  return '<section class="v66-directory" data-v66-directory="players">'+
    '<header class="v695-player-head" style="display:block!important;width:100%!important;max-width:100%!important;height:auto!important;margin:0 0 14px!important;padding:10px 12px 14px!important;box-sizing:border-box!important;position:relative!important;inset:auto!important;transform:none!important">'+
      '<div class="v695-player-kicker" style="display:block!important;position:relative!important;inset:auto!important;width:100%!important;margin:0 0 10px!important;padding:0!important;color:#29e0eb!important;font-size:10px!important;line-height:1.2!important;font-weight:950!important;letter-spacing:.13em!important;float:none!important;clear:both!important;transform:none!important">DATOS OFICIALES</div>'+
      '<div class="v695-player-title" style="display:block!important;position:relative!important;inset:auto!important;width:100%!important;margin:0 0 10px!important;padding:0!important;color:#fff!important;font-size:26px!important;line-height:1.08!important;font-weight:950!important;letter-spacing:-.02em!important;white-space:normal!important;overflow:visible!important;overflow-wrap:anywhere!important;float:none!important;clear:both!important;transform:none!important">Registro de jugadores</div>'+
      '<div class="v695-player-count" style="display:block!important;position:relative!important;inset:auto!important;width:100%!important;margin:0 0 6px!important;padding:0!important;color:#a8b1d5!important;font-size:11px!important;line-height:1.35!important;font-weight:700!important;float:none!important;clear:both!important;transform:none!important">'+list.length+' jugadores visibles con los filtros seleccionados.</div>'+
      '<div class="v695-player-help" style="display:block!important;position:relative!important;inset:auto!important;width:100%!important;margin:0!important;padding:0!important;color:#9da8d0!important;font-size:10px!important;line-height:1.35!important;font-weight:600!important;float:none!important;clear:both!important;transform:none!important">Busca por categoría, equipo o nombre.</div>'+
    '</header>'+
    '<div class="v66-filter-title">FILTROS</div>'+
    '<div class="v66-filter-label">CATEGORÍA</div>'+
    categoryRail(playerCat,'data-v66-player-cat')+
    playerTeamRail()+
    '<div class="v66-search"><span>⌕</span><input data-v66-player-search type="search" autocomplete="off" placeholder="Buscar jugador por nombre" value="'+esc(playerQuery)+'"></div>'+
    '<p class="v66-source-note">'+list.length+' jugadores registrados'+(playerCat==='all'?'':' · '+esc(CAT_LABEL[playerCat]||''))+(playerTeam==='all'?'':' · '+esc(playerTeam))+'</p>'+
    '<div class="v66-player-list">'+list.map((p,i)=>'<button type="button" class="v66-player-row" data-v66-player="'+esc(p.name)+'" data-v66-player-team="'+esc(p.team)+'" data-v66-cat-id="'+esc(p.cat)+'">'+playerAvatar(p)+'<span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.position||p.category)+'</small></span><i>›</i></button>').join('')+'</div>'+
  '</section>';
}
function saveTeam(name,cat,resetTab=true){
  localStorage.setItem('v62-team-name',name);
  localStorage.setItem('v62-category',String(cat||'3'));
  if(resetTab)localStorage.setItem('v42-team-tab','summary');
}
function bind(){
  document.querySelector('[data-v447-store-back]')?.addEventListener('click',()=>{if(history.length>1)history.back();else location.hash='#/more'});

  document.querySelector('[data-v66-team-search]')?.addEventListener('input',e=>{teamQuery=e.target.value;render(true,true,false)});
  document.querySelector('[data-v990-search-clear]')?.addEventListener('click',()=>{
    teamQuery='';render(true,true,false);
  });
  document.querySelectorAll('[data-v990-rail-step]').forEach(button=>button.addEventListener('click',()=>{
    const rail=document.querySelector('.v989-store-categories');
    if(!rail)return;
    rail.scrollBy({left:(Number(button.dataset.v990RailStep)||1)*Math.max(135,rail.clientWidth*.72),behavior:'smooth'});
  }));
  document.querySelectorAll('[data-v66-store-cat]').forEach(button=>button.addEventListener('click',()=>{
    const cat=button.dataset.v66StoreCat||'all';
    if(cat!=='all'&&!CAT_ORDER.includes(cat))return;
    storeCat=cat;
    storeRailScroll=cat==='all'?0:(button.closest('.v989-store-categories')?.scrollLeft||0);
    try{localStorage.setItem('v989-store-category',cat)}catch(_){}
    render(true,false,false);
  }));
  document.querySelector('[data-v989-store-categories]')?.addEventListener('click',()=>{
    const rail=document.querySelector('.v989-store-categories');
    rail?.scrollIntoView?.({behavior:'smooth',block:'center',inline:'nearest'});
    rail?.querySelector('button.active')?.focus({preventScroll:true});
  });
  document.querySelector('[data-v989-store-reset]')?.addEventListener('click',()=>{
    storeCat='all';teamQuery='';storeRailScroll=0;
    try{localStorage.setItem('v989-store-category','all')}catch(_){}
    render(true,false,false);
  });
  document.querySelector('[data-v66-player-search]')?.addEventListener('input',e=>{playerQuery=e.target.value;render(true,true,false)});
  document.querySelectorAll('[data-v66-player-cat]').forEach(b=>b.onclick=()=>{
    playerCat=b.dataset.v66PlayerCat||'all';
    playerTeam='all';
    localStorage.setItem('v66-player-cat',playerCat);
    localStorage.setItem('v66-player-team','all');
    render(true,false,true);
  });
  document.querySelectorAll('[data-v66-player-team-filter]').forEach(b=>b.onclick=()=>{
    playerTeam=b.dataset.v66PlayerTeamFilter||'all';
    localStorage.setItem('v66-player-team',playerTeam);
    render(true,false,true);
  });
  document.querySelectorAll('[data-v66-open-team]').forEach(b=>b.onclick=e=>{
    const name=b.dataset.v66OpenTeam,cat=b.dataset.v66CatId;
    if(!name)return;
    e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
    const inStore=route()==='club-store'||!!b.closest('[data-v66-directory="store"]');
    if(inStore){
      e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
      try{localStorage.removeItem('v42-open-compare')}catch(_){}
      if(window.LJR_V431_STORE_API?.open){window.LJR_V431_STORE_API.open(name,cat);return}
      try{sessionStorage.setItem('v431-store-open','1');sessionStorage.setItem('v431-store-team',name);sessionStorage.setItem('v431-store-cat',String(cat||'3'))}catch(_){}
      return;
    }
    saveTeam(name,cat);
    // V963 — A directory selection opens its own team summary, never Comparar.
    try{localStorage.setItem('v42-team-tab','summary');localStorage.removeItem('v42-open-compare')}catch(_){}
    if(window.LJR_TEAM_DETAIL_API?.openTeam&&window.LJR_TEAM_DETAIL_API.openTeam(name,cat))return;
    try{if(window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(name);return}}catch(_){}
    location.hash='#/teamDetail?tab=summary';
  });
  document.querySelectorAll('[data-v66-player]').forEach(b=>b.onclick=e=>{
    e?.preventDefault?.();
    e?.stopPropagation?.();
    e?.stopImmediatePropagation?.();
    const player={
      name:b.dataset.v66Player||'',
      team:b.dataset.v66PlayerTeam||'',
      cat:b.dataset.v66CatId||''
    };
    try{
      localStorage.setItem('v379-player-profile',JSON.stringify(player));
      localStorage.setItem('v379-player-profile-tab','Resumen');
      localStorage.removeItem('v123-compare-player');
      localStorage.removeItem('v123-compare-player-2');
    }catch(_){}
    if(window.LJR_PLAYER_PROFILE_API?.open){
      window.LJR_PLAYER_PROFILE_API.open(player);
      return;
    }
    location.hash='#/playerDetail';
  });
}
function revealActivePlayerFilters(screen){
  requestAnimationFrame(()=>{
    const activeCat=screen.querySelector('[data-v66-player-cat].active');
    const activeTeam=screen.querySelector('[data-v66-player-team-filter].active');
    activeCat?.scrollIntoView?.({behavior:'smooth',block:'nearest',inline:'center'});
    activeTeam?.scrollIntoView?.({behavior:'smooth',block:'nearest',inline:'center'});
  });
}
async function render(force=false,focusSearch=false,revealFilters=false){
  const r=route(); if(!['players','club-store'].includes(r))return;
  if(r==='players'&&!ownsPlayers())return;
  if(r==='players'&&localStorage.getItem('v66-open-all')==='1'){
    playerCat='all';
    playerTeam='all';
    playerQuery='';
    localStorage.setItem('v66-player-cat','all');
    localStorage.setItem('v66-player-team','all');
    localStorage.removeItem('v66-open-all');
    force=true;
  }
  await load(); if(!db||route()!==r)return;
  const screen=document.querySelector('#screen'); if(!screen)return;
  const kind=r==='club-store'?'store':'players';
  if(!force&&screen.querySelector('[data-v66-directory="'+kind+'"]'))return;
  screen.innerHTML=r==='players'?playerMarkup():teamMarkup(true);
  bind();
  if(r==='club-store'){
    const rail=screen.querySelector('.v989-store-categories');
    if(rail){
      rail.scrollLeft=storeRailScroll;
      rail.addEventListener('scroll',()=>{storeRailScroll=rail.scrollLeft},{passive:true});
    }
  }
  if(focusSearch){
    if(r==='club-store'){
      const input=screen.querySelector('[data-v66-team-search]'); if(input){input.focus({preventScroll:true});input.setSelectionRange(input.value.length,input.value.length)}
    }else{
      const input=screen.querySelector('[data-v66-player-search]'); if(input){input.focus({preventScroll:true});input.setSelectionRange(input.value.length,input.value.length)}
    }
  }
  if(r==='players'&&revealFilters)revealActivePlayerFilters(screen);
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(()=>render(false)))}
window.addEventListener('hashchange',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{const r=route();if((r==='club-store'||(r==='players'&&ownsPlayers()))&&!screen.querySelector('[data-v66-directory]'))schedule()}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();


function officialScorers(){
  const rows=[];
  for(const id of CAT_ORDER){
    const cat=db?.categories?.[id]; if(!cat)continue;
    const b=(cat.scorers||[])[0];
    for(const r of (b?.rows||[])){
      if(!Array.isArray(r)||r.length<4||!/^\d+$/.test(String(r[3]||'')))continue;
      rows.push({player:String(r[1]||''),team:String(r[2]||''),goals:Number(r[3])||0,cat:id,category:cat.name||CAT_LABEL[id]||id});
    }
  }
  return rows.sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es'));
}
function scorerLogo(name){
  const src=logoFor(name),ab=fallback(name);
  return '<span class="v28-team-logo">'+(src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span class="v28-team-fallback">'+esc(ab)+'</span>')+'</span>';
}
function patchScorers(){
  /* V401: player-only scorer UI is owned by V194. */
  if(window.__LJR_SCORERS_UI_OWNER__==='v194-reference'||window.__LJR_V194_SCORERS__)return;
  const page=document.querySelector('[data-v28-scorers]'); if(!page)return;
  const rows=officialScorers(); if(!rows.length)return;
  const feats=page.querySelectorAll('.v28-feature');
  rows.slice(0,2).forEach((r,i)=>{
    const f=feats[i]; if(!f)return;
    const team=f.querySelector('.v28-feature-person b'),player=f.querySelector('.v28-feature-person small'),goals=f.querySelector('.v28-feature-goals b');
    if(team)team.textContent=r.team;if(player)player.textContent=r.player;if(goals)goals.textContent=String(r.goals);
  });
  const rank=page.querySelector('.v28-ranking'); if(rank){
    rank.innerHTML=rows.slice(2).map((r,i)=>'<button type="button" class="v28-rank-row" data-v66-scorer="'+esc(r.player)+'">'+
      '<span class="v28-rank-number">#'+(i+3)+'</span>'+scorerLogo(r.team)+
      '<span class="v28-rank-copy"><b>'+esc(r.team)+'</b><small>'+esc(r.player)+'</small></span>'+
      '<strong class="v28-rank-goals">'+r.goals+'</strong></button>').join('');
  }
}
function currentOfficialTeam(){
  const list=teamList(),stored=localStorage.getItem('v62-team-name')||'';
  let hit=list.find(t=>same(t.name,stored));
  if(hit)return hit;
  const title=document.querySelector('.v42-title h1')?.textContent||'';
  hit=list.find(t=>same(t.name,title));
  return hit||list.find(t=>t.cat==='3')||list[0]||null;
}
function patchTeamDetail(){
  const page=document.querySelector('[data-v42-reference="teamDetail"]'); if(!page)return;
  const t=currentOfficialTeam(); if(!t)return;
  saveTeam(t.name,t.cat,false);
  const h=page.querySelector('.v42-title h1'),sub=page.querySelector('.v42-title p'),crest=page.querySelector('.v42-team-crest');
  if(h)h.textContent=t.name;if(sub)sub.textContent=t.category+' · Liga Juventino Rosas';
  const src=logoFor(t.name); if(crest&&src){crest.src=src;crest.alt=t.name}
  const roster=rosterFor(t.name,t.cat);
  const preview=page.querySelector('.v42-preview-grid');
  if(preview&&roster.length){
    const cat=db?.categories?.[String(t.cat)]||{};
    preview.innerHTML=roster.slice(0,3).map((n,i)=>{
      const p=profileFor(cat,t.name,n)||{};
      return '<button type="button" data-v42-player="'+esc(n)+'" data-v66-roster-player="'+esc(n)+'" data-v66-player-team="'+esc(t.name)+'" data-v66-cat-id="'+esc(t.cat)+'">'+
        playerAvatar({name:n,team:t.name,cat:t.cat,photo:p.photo},'v42-avatar large v66-roster-avatar')+
        '<strong>'+esc(n)+'</strong><small>'+esc(p.position||'Jugador registrado')+'</small></button>';
    }).join('');
  }
  const squad=page.querySelector('.v42-squad');
  if(squad&&roster.length){
    const cat=db?.categories?.[String(t.cat)]||{};
    squad.innerHTML='<section class="v42-roster-card v66-official-roster"><h2>Jugadores registrados · '+roster.length+'</h2><div class="v42-roster-list">'+
      roster.map(n=>{const p=profileFor(cat,t.name,n)||{};return '<button type="button" class="v42-player-row" data-v42-player="'+esc(n)+'" data-v66-roster-player="'+esc(n)+'" data-v66-player-team="'+esc(t.name)+'" data-v66-cat-id="'+esc(t.cat)+'">'+
        playerAvatar({name:n,team:t.name,cat:t.cat,photo:p.photo},'v42-avatar v66-roster-avatar')+
        '<span class="v42-player-copy"><strong>'+esc(n)+'</strong><small>'+esc(p.position||'Jugador registrado')+' · '+esc(t.name)+'</small></span><b class="v42-number">'+esc(p.dorsal?'#'+p.dorsal:'›')+'</b></button>'}).join('')+
      '</div></section>';
  }
}
function fixtureRows(){
  const out=[];
  for(const id of CAT_ORDER){
    const cat=db?.categories?.[id];if(!cat)continue;
    const b=(cat.fixtures||[])[0];
    for(const r of (b?.rows||[])){
      if(!Array.isArray(r)||r.length<7)continue;
      out.push({cat:id,category:cat.name||CAT_LABEL[id]||id,round:r[1]||'',home:r[2]||'',away:r[6]||'',field:r[7]||'Por confirmar',date:r[8]||'Por confirmar'});
    }
  }
  return out;
}
function cedulaCategoryLogo(catId){return CAT_LOGOS_V630[String(catId)]||'./assets/liga-logo.webp'}
function cedulaRoundLabel(value){
  let v=String(value??'').trim();
  v=v.replace(/^jornada\s*/i,'').replace(/^j\s*/i,'').trim();
  return 'J'+(v||'—');
}
function cedulaLead(r){
  const logo=cedulaCategoryLogo(r.cat);
  return '<span class="v66-cedula-side">'+
    '<span class="v66-round-badge">'+
      '<small>JORNADA</small>'+
      '<b>'+esc(r.round||'—')+'</b>'+
      '<span class="v66-category-mark"><img src="'+esc(logo)+'" alt="'+esc(r.category||'Categoría')+'" loading="eager" decoding="async"></span>'+
    '</span>'+
  '</span>';
}
function cedulaSort(a,b){
  const ca=CAT_ORDER.indexOf(String(a.cat)),cb=CAT_ORDER.indexOf(String(b.cat));
  if(ca!==cb)return (ca<0?999:ca)-(cb<0?999:cb);
  const ra=Number(String(a.round||'').replace(/\D+/g,''))||999;
  const rb=Number(String(b.round||'').replace(/\D+/g,''))||999;
  if(ra!==rb)return ra-rb;
  const da=String(a.date||''),dbb=String(b.date||'');
  if(da!==dbb)return da.localeCompare(dbb,'es');
  return String(a.home||'').localeCompare(String(b.home||''),'es',{sensitivity:'base'});
}
function cedulaTeams(rows){
  const out=[];
  const add=name=>{
    name=String(name||'').trim();if(!name)return;
    if(!out.some(x=>same(x,name)))out.push(name);
  };
  rows.forEach(r=>{add(r.home);add(r.away)});
  return out.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function cedulaRowsFiltered(all){
  let rows=all.slice().sort(cedulaSort);
  if(cedulaCat!=='all')rows=rows.filter(r=>String(r.cat)===String(cedulaCat));
  const teams=cedulaTeams(rows);
  if(cedulaTeam!=='all'&&!teams.some(t=>same(t,cedulaTeam))){
    cedulaTeam='all';
    localStorage.setItem('v66-cedula-team-filter','all');
  }
  if(cedulaTeam!=='all')rows=rows.filter(r=>same(r.home,cedulaTeam)||same(r.away,cedulaTeam));
  return rows;
}
function cedulaFiltersMarkup(all){
  const availableCats=CAT_ORDER.filter(id=>all.some(r=>String(r.cat)===String(id)));
  const byCat=cedulaCat==='all'?all:all.filter(r=>String(r.cat)===String(cedulaCat));
  const teams=cedulaTeams(byCat);
  return '<div class="v66-cedula-filters">'+
    '<label><span>CATEGORÍA</span><select data-v66-cedula-cat-filter>'+
      '<option value="all" '+(cedulaCat==='all'?'selected':'')+'>Todas</option>'+
      availableCats.map(id=>'<option value="'+esc(id)+'" '+(cedulaCat===id?'selected':'')+'>'+esc(db?.categories?.[id]?.name||CAT_LABEL[id]||id)+'</option>').join('')+
    '</select></label>'+
    '<label><span>EQUIPO</span><select data-v66-cedula-team-filter>'+
      '<option value="all" '+(cedulaTeam==='all'?'selected':'')+'>Todos los equipos</option>'+
      teams.map(name=>'<option value="'+esc(name)+'" '+(cedulaTeam!=='all'&&same(cedulaTeam,name)?'selected':'')+'>'+esc(name)+'</option>').join('')+
    '</select></label>'+
  '</div>';
}
function cedulaRowMarkup(r){
  return '<button type="button" class="v66-player-row v66-fixture-row" data-v66-cedula-home="'+esc(r.home)+'" data-v66-cedula-away="'+esc(r.away)+'" data-v66-cedula-cat="'+esc(r.category)+'" data-v66-cedula-date="'+esc(r.date)+'" data-v66-cedula-field="'+esc(r.field)+'" data-v66-cedula-round="'+esc(r.round||'')+'">'+
    cedulaLead(r)+'<span><b>'+esc(r.home)+' vs '+esc(r.away)+'</b><small>'+esc(r.category)+' · '+esc(r.date)+' · '+esc(r.field)+'</small></span><i>›</i></button>';
}
function cedulaGroupsMarkup(rows){
  if(!rows.length)return '<div class="v66-cedula-empty"><b>No hay cédulas con estos filtros.</b><small>Cambia la categoría o el equipo.</small></div>';
  return CAT_ORDER.map(id=>{
    const list=rows.filter(r=>String(r.cat)===String(id));
    if(!list.length)return '';
    const name=db?.categories?.[id]?.name||CAT_LABEL[id]||id;
    return '<section class="v66-cedula-group" data-v66-cedula-group="'+esc(id)+'">'+
      '<div class="v66-cedula-group-head"><b>'+esc(name)+'</b><small>'+list.length+' partido'+(list.length===1?'':'s')+'</small></div>'+
      '<div class="v66-player-list">'+list.map(cedulaRowMarkup).join('')+'</div>'+
    '</section>';
  }).join('');
}
function cedulasMarkup(){
  const all=fixtureRows().sort(cedulaSort);
  const rows=cedulaRowsFiltered(all);
  return '<section class="v66-directory v66-cedulas-official v638-cedulas-modern" data-v66-directory="cedulas">'+
    '<div class="v638-cedula-top">'+
      '<div class="v66-cedula-headline"><span><small>CENTRO DE CÉDULAS</small><b>Cédulas oficiales</b></span><em>'+rows.length+' / '+all.length+'</em></div>'+
      '<div class="v638-filter-panel">'+
        '<div class="v638-filter-copy"><b>Encuentra tu partido</b><small>Filtra por categoría y equipo.</small></div>'+
        cedulaFiltersMarkup(all)+
      '</div>'+
      '<button type="button" class="v66-primary-action v638-create" data-v66-generate-cedula><span>＋</span><b>Generar nueva cédula</b></button>'+
    '</div>'+
    '<div class="v638-results-head"><b>Partidos</b><small>'+rows.length+' resultado'+(rows.length===1?'':'s')+'</small></div>'+
    '<div class="v66-player-list v638-cedula-list">'+(rows.length?rows.map(cedulaRowMarkup).join(''):'<div class="v66-cedula-empty"><b>No hay cédulas con estos filtros.</b><small>Cambia la categoría o el equipo.</small></div>')+'</div>'+
  '</section>';
}
function goCedulaBuilder(){
  if(window.LJR_MAIN_ROUTE?.go){window.LJR_MAIN_ROUTE.go('cedulaBuilder');return}
  location.hash='#/cedulaBuilder';
}
function goCedulaDetail(){
  if(window.LJR_MAIN_ROUTE?.go){window.LJR_MAIN_ROUTE.go('cedulaDetail');return}
  location.hash='#/cedulaDetail';
}
function renderCedulas(){
  if(route()!=='cedulas')return;
  const screen=document.querySelector('#screen');if(!screen)return;
  screen.innerHTML=cedulasMarkup();
  bindCedulas();
}
function bindCedulas(){
  const generate=document.querySelector('[data-v66-generate-cedula]');
  if(generate)generate.onclick=e=>{
    e?.preventDefault?.();e?.stopPropagation?.();
    ['v66-cedula-home','v66-cedula-away','v66-cedula-cat','v66-cedula-date','v66-cedula-field','v66-cedula-round','v66-cedula-source','v66-cedula-autogenerate'].forEach(k=>localStorage.removeItem(k));
    goCedulaBuilder();
  };
  document.querySelector('[data-v66-cedula-cat-filter]')?.addEventListener('change',e=>{
    cedulaCat=e.target.value||'all';
    cedulaTeam='all';
    localStorage.setItem('v66-cedula-cat-filter',cedulaCat);
    localStorage.setItem('v66-cedula-team-filter','all');
    renderCedulas();
  });
  document.querySelector('[data-v66-cedula-team-filter]')?.addEventListener('change',e=>{
    cedulaTeam=e.target.value||'all';
    localStorage.setItem('v66-cedula-team-filter',cedulaTeam);
    renderCedulas();
  });
  document.querySelectorAll('[data-v66-cedula-home]').forEach(b=>b.onclick=e=>openOfficialCedula(b,e));
}
function openOfficialCedula(b,e){
  if(!b)return;
  e?.preventDefault?.();
  e?.stopPropagation?.();
  e?.stopImmediatePropagation?.();
  localStorage.setItem('v66-cedula-home',b.dataset.v66CedulaHome||'');
  localStorage.setItem('v66-cedula-away',b.dataset.v66CedulaAway||'');
  localStorage.setItem('v66-cedula-cat',b.dataset.v66CedulaCat||'');
  localStorage.setItem('v66-cedula-date',b.dataset.v66CedulaDate||'');
  localStorage.setItem('v66-cedula-field',b.dataset.v66CedulaField||'');
  localStorage.setItem('v66-cedula-round',b.dataset.v66CedulaRound||'');
  localStorage.setItem('v66-cedula-source','official-directory');
  /* V626 — restauración: al tocar una cédula vuelve a abrir directamente
     la hoja arbitral de una página, prellenada con el partido seleccionado. */
  localStorage.setItem('v66-cedula-autogenerate','1');
  goCedulaBuilder();
}
/* Delegación robusta: mantiene funcionales todas las filas aunque otra capa
   de la app vuelva a pintar la lista después de cargar los datos. */
document.addEventListener('click',function(e){
  const b=e.target?.closest?.('[data-v66-cedula-home]');
  if(!b)return;
  openOfficialCedula(b,e);
},true);
async function renderExtras(){
  const r=route(); if(!['scorers','teamDetail','cedulas'].includes(r))return;
  await load(); if(!db||route()!==r)return;
  if(r==='scorers'){patchScorers();return}
  if(r==='teamDetail'){patchTeamDetail();return}
  if(r==='cedulas'){
    const screen=document.querySelector('#screen');if(!screen)return;
    if(!screen.querySelector('[data-v66-directory="cedulas"]'))renderCedulas()
  }
}
function extraSchedule(){requestAnimationFrame(()=>requestAnimationFrame(renderExtras))}
window.addEventListener('hashchange',extraSchedule);
const extraScreen=document.querySelector('#screen');
if(extraScreen)new MutationObserver(()=>{if(['scorers','teamDetail','cedulas'].includes(route()))extraSchedule()}).observe(extraScreen,{childList:true,subtree:false});
extraSchedule();

// El directorio acompaña la fuente global; no mantiene una copia vieja tras refrescar resultados.
window.addEventListener('ljr:official-data',()=>{
  const current=sharedData();
  if(current&&current!==db){
    db=current;
    if(['scorers','teamDetail','cedulas'].includes(route()))extraSchedule();
  }
});
window.V66_OFFICIAL_DIRECTORY={load,teamList,playerList,rosterFor,logoFor,officialScorers,fixtureRows,data:()=>sharedData()||db};
})();


/* V431 — tienda de equipo tipo retail, adaptada al azul de la Liga */
(function(){
"use strict";
if(window.__LJR_V431_CLUB_SHOP__)return;
window.__LJR_V431_CLUB_SHOP__=true;
var CSS="\nbody[data-app-route=\"club-store\"] #screen{padding:0!important;background:#f7f8ff!important;color:#090d2a!important}\nbody[data-app-route=\"club-store\"] #screen>.v431-store{margin:0!important}\n.v431-store{--ink:#080d28;--muted:#6f7695;--line:#e6e8f3;--blue:#0716a8;width:100%;max-width:560px;margin:0 auto;padding:0 0 calc(96px + env(safe-area-inset-bottom));background:#fff;color:var(--ink);font-family:Inter,Roboto,Arial,sans-serif;min-height:100vh}\n.v431-store *{box-sizing:border-box}.v431-store button,.v431-store input,.v431-store select{font:inherit}.v431-store button{cursor:pointer}\n.v431-store-head{position:sticky;top:0;z-index:80;height:58px;display:flex;align-items:center;gap:8px;padding:7px 12px;background:#07118e;color:#fff;border-bottom:1px solid rgba(255,255,255,.12);box-shadow:0 7px 20px rgba(8,15,86,.14)}\n.v431-back,.v431-head-icon{width:34px;height:34px;border:0;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08);color:#fff;font-size:22px;font-weight:700}\n.v431-head-crest{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:#fff;border:1px solid rgba(255,255,255,.3);overflow:hidden}\n.v431-head-crest img{width:27px;height:27px;object-fit:contain}.v431-head-crest b{color:#08116e;font-size:10px}\n.v431-head-copy{min-width:0;flex:1;display:flex;flex-direction:column;line-height:1.05}.v431-head-copy small{font-size:7px;font-weight:900;letter-spacing:.12em;opacity:.7}.v431-head-copy b{margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}\n.v431-cart-button{position:relative}.v431-cart-button em{position:absolute;right:-2px;top:-3px;min-width:15px;height:15px;padding:0 3px;border-radius:10px;display:grid;place-items:center;background:#fff;color:#0c16a5;font-size:8px;font-style:normal;font-weight:900}\n.v431-search-panel{display:none;align-items:center;gap:7px;padding:8px 12px;background:#07118e}.v431-search-panel.open{display:flex}.v431-search-panel span{color:#fff}.v431-search-panel input{flex:1;height:36px;border:0;border-radius:18px;padding:0 13px;background:#fff;color:#11162f;font-size:11px;outline:none}.v431-search-panel button{width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:20px}\n.v431-shop-tabs{position:sticky;top:58px;z-index:70;display:flex;overflow:auto;background:#fff;border-bottom:1px solid var(--line);scrollbar-width:none}.v431-shop-tabs::-webkit-scrollbar{display:none}.v431-shop-tabs button{flex:0 0 auto;padding:11px 14px;border:0;background:#fff;color:#535a7a;font-size:9px;font-weight:800}.v431-shop-tabs button:first-child{color:#1119ac;border-bottom:2px solid #1119ac}\n.v431-hero{position:relative;min-height:305px;display:grid;grid-template-columns:1.08fr .92fr;align-items:end;overflow:hidden;padding:30px 18px 26px;background:linear-gradient(135deg,#07157e 0%,#162be2 55%,#060944 100%);color:#fff}\n.v431-hero:before,.v431-hero:after{content:\"\";position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.13)}.v431-hero:before{width:260px;height:260px;right:-80px;top:-65px}.v431-hero:after{width:170px;height:170px;right:-20px;top:0}\n.v431-hero-copy{position:relative;z-index:3}.v431-hero-copy small{font-size:7px;font-weight:900;letter-spacing:.14em;opacity:.76}.v431-hero-copy h1{max-width:250px;margin:8px 0 9px;font-size:22px;line-height:1.02;letter-spacing:-.04em}.v431-hero-copy p{max-width:230px;margin:0 0 15px;color:#cdd3ff;font-size:9px;line-height:1.45}.v431-hero-copy button,.v431-edition-card button,.v431-story button{height:32px;padding:0 15px;border:0;border-radius:18px;background:#fff;color:#0a159f;font-size:8px;font-weight:900;letter-spacing:.06em}\n.v431-hero-shirt{position:relative;z-index:2;height:235px;display:grid;place-items:center;transform:rotate(-6deg) scale(1.08)}\n.v431-shirt{position:relative;width:132px;height:156px;display:grid;place-items:center;color:#fff}.v431-shirt-shape{position:absolute;inset:0;background:linear-gradient(145deg,#121eb8,#3848ff 55%,#0a116f);clip-path:polygon(23% 0,40% 0,45% 8%,55% 8%,60% 0,77% 0,100% 16%,89% 36%,78% 30%,78% 100%,22% 100%,22% 30%,11% 36%,0 16%);filter:drop-shadow(0 14px 12px rgba(0,0,0,.24))}\n.v431-shirt.away .v431-shirt-shape{background:linear-gradient(145deg,#f5f6ff,#dbe0ff 55%,#aeb9ff)}.v431-shirt.third .v431-shirt-shape{background:linear-gradient(145deg,#111426,#30395d 55%,#070914)}.v431-shirt.training .v431-shirt-shape{background:linear-gradient(145deg,#09a57c,#0ed0a0 55%,#075f54)}.v431-shirt.keeper .v431-shirt-shape{background:linear-gradient(145deg,#e39a00,#ffd147 55%,#8c5500)}.v431-shirt.special .v431-shirt-shape{background:linear-gradient(145deg,#8a18d5,#3046ff 55%,#140865)}\n.v431-shirt-logo{position:absolute;z-index:2;top:41px;left:50%;width:28px;height:28px;object-fit:contain;transform:translateX(-50%);filter:drop-shadow(0 2px 2px rgba(0,0,0,.16))}.v431-shirt span{position:absolute;z-index:2;bottom:17px;font-size:7px;font-weight:900}.v431-shirt-name{position:absolute;z-index:2;top:46px;font-size:7px;letter-spacing:.07em;text-transform:uppercase}.v431-shirt-number{position:absolute;z-index:2;top:62px;font-size:26px;line-height:1}.v431-shirt.away{color:#111953}\n.v431-block{padding:24px 14px 6px;background:#fff}.v431-section-title{display:flex;align-items:end;justify-content:space-between;gap:10px;margin-bottom:13px}.v431-section-title small{display:block;color:#8b91ad;font-size:7px;font-weight:900;letter-spacing:.14em}.v431-section-title h2{margin:3px 0 0;font-size:16px;letter-spacing:-.03em}.v431-section-title>button{border:0;background:none;color:#1e28bc;font-size:8px;font-weight:900}\n.v431-player-edition{padding-top:19px}.v431-edition-card{min-height:182px;display:grid;grid-template-columns:44% 56%;align-items:center;overflow:hidden;border-radius:16px;background:linear-gradient(135deg,#0c0e2a,#1c2565);color:#fff}.v431-edition-art{height:182px;display:grid;place-items:center;background:radial-gradient(circle at 50% 36%,rgba(114,128,255,.35),transparent 54%)}.v431-edition-card .v431-shirt{transform:scale(.88)}.v431-edition-card>div:last-child{padding:16px 14px 16px 5px}.v431-edition-card small{font-size:7px;font-weight:900;letter-spacing:.12em;color:#929df5}.v431-edition-card h3{margin:5px 0 7px;font-size:18px}.v431-edition-card p{margin:0 0 11px;color:#c8cdef;font-size:9px;line-height:1.45}\n.v431-products{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.v431-product{position:relative;min-width:0;padding:9px 9px 11px;border:1px solid var(--line);border-radius:13px;background:#fff;box-shadow:0 5px 16px rgba(19,28,92,.05)}.v431-product-art{height:146px;display:grid;place-items:center;overflow:hidden;border-radius:10px;background:linear-gradient(180deg,#f1f3ff,#fafbff)}.v431-product-art .v431-shirt{transform:scale(.77)}.v431-heart{position:absolute;z-index:3;right:14px;top:14px;width:25px;height:25px;border:1px solid #e3e6f1;border-radius:50%;background:#fff;color:#5c6381;font-size:14px}.v431-heart.active{color:#1723c9}.v431-product h3{margin:9px 0 3px;font-size:11px;line-height:1.1}.v431-product p{height:24px;margin:0;color:#777e9a;font-size:8px;line-height:1.35}.v431-add{width:100%;height:30px;margin-top:8px;border:0;border-radius:16px;background:#1723c9;color:#fff;font-size:8px;font-weight:900}\n.v431-custom{margin-top:18px;padding-top:25px;background:#f6f7ff}.v431-custom-grid{display:grid;grid-template-columns:43% 57%;gap:11px;align-items:center}.v431-custom-preview{min-height:220px;display:grid;place-items:center;border-radius:16px;background:linear-gradient(145deg,#11168c,#2134ea)}.v431-custom-preview .v431-shirt{transform:scale(.92)}.v431-custom-form{display:flex;flex-direction:column;gap:8px}.v431-custom-form label{display:flex;flex-direction:column;gap:4px;color:#727996;font-size:7px;font-weight:900;letter-spacing:.08em}.v431-custom-form input,.v431-custom-form select{width:100%;height:35px;border:1px solid #dfe3f1;border-radius:9px;padding:0 9px;background:#fff;color:#11162d;font-size:10px;outline:none}.v431-primary{height:36px;border:0;border-radius:18px;background:#1926cf;color:#fff;font-size:8px;font-weight:900}\n.v431-story{margin-top:25px;min-height:205px;display:grid;grid-template-columns:42% 58%;align-items:center;padding:18px;background:linear-gradient(135deg,#090b21,#0b146a);color:#fff}.v431-story-art{display:grid;place-items:center}.v431-story-crest{width:112px;height:112px;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle,#fff 0 41%,rgba(255,255,255,.18) 42% 58%,transparent 59%);filter:drop-shadow(0 12px 16px rgba(0,0,0,.28))}.v431-story-crest img{width:72px;height:72px;object-fit:contain}.v431-story-crest b{color:#0a146f}.v431-story small{font-size:7px;font-weight:900;letter-spacing:.13em;color:#8792ff}.v431-story h2{margin:5px 0 7px;font-size:20px}.v431-story p{margin:0 0 11px;color:#c9cef5;font-size:9px;line-height:1.45}\n.v431-collection-rail,.v431-player-rail{display:flex;gap:10px;overflow:auto;padding:1px 1px 8px;scrollbar-width:none}.v431-collection-rail::-webkit-scrollbar,.v431-player-rail::-webkit-scrollbar{display:none}.v431-collection-rail>button{flex:0 0 145px;padding:0 0 10px;overflow:hidden;border:1px solid var(--line);border-radius:13px;background:#fff;text-align:left}.v431-collection-rail>button>div{height:132px;display:grid;place-items:center;background:#f2f4ff}.v431-collection-rail .v431-shirt{transform:scale(.66)}.v431-collection-rail b,.v431-collection-rail small{display:block;padding:0 9px}.v431-collection-rail b{margin-top:8px;font-size:10px}.v431-collection-rail small{margin-top:2px;color:#7c829d;font-size:7px}\n.v431-player-card{flex:0 0 108px;min-height:142px;padding:10px 8px;border:1px solid var(--line);border-radius:13px;background:#fff;text-align:center}.v431-player-card span{width:74px;height:74px;margin:0 auto 8px;display:grid;place-items:center;border-radius:50%;background:linear-gradient(145deg,#101797,#3d4bff);color:#fff;font-size:19px;font-weight:900}.v431-player-card b{display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:9px;line-height:1.15}.v431-player-card small{display:block;margin-top:4px;color:#8389a6;font-size:7px}\n.v431-training{padding-bottom:18px}.v431-empty{padding:18px;border-radius:12px;background:#f5f6ff;color:#727995;font-size:9px;line-height:1.45}\n.v431-store-note{margin:22px 14px 0;padding:13px;border:1px solid #e1e5f2;border-radius:12px;display:flex;flex-direction:column;gap:4px;background:#f8f9ff}.v431-store-note b{font-size:9px}.v431-store-note span{color:#7a809a;font-size:8px;line-height:1.4}\n.v431-drawer{position:fixed;z-index:2147483500;inset:0;display:none;align-items:flex-end;justify-content:center;background:rgba(5,8,34,.46)}.v431-drawer.open{display:flex}.v431-drawer-card{width:min(560px,100%);max-height:74vh;overflow:auto;padding:16px 14px calc(18px + env(safe-area-inset-bottom));border-radius:18px 18px 0 0;background:#fff}.v431-drawer-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}.v431-drawer-head b{font-size:15px}.v431-drawer-head button{width:30px;height:30px;border:0;border-radius:50%;background:#f0f2fb;font-size:20px}.v431-cart-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 0;border-top:1px solid var(--line)}.v431-cart-row span{min-width:0}.v431-cart-row b{display:block;font-size:9px}.v431-cart-row small{display:block;margin-top:2px;color:#7d849e;font-size:7px}.v431-cart-row button{border:0;background:none;color:#2631c6;font-size:9px;font-weight:900}.v431-clear{width:100%;height:36px;margin-top:10px;border:1px solid #dfe2ef;border-radius:18px;background:#fff;color:#1721b7;font-size:8px;font-weight:900}\n.v431-toast{position:fixed;z-index:2147483600;left:50%;bottom:calc(86px + env(safe-area-inset-bottom));transform:translate(-50%,20px);padding:9px 14px;border-radius:18px;background:#090f57;color:#fff;font-size:9px;font-weight:800;opacity:0;pointer-events:none;transition:.18s}.v431-toast.show{opacity:1;transform:translate(-50%,0)}.v431-no-match{display:none!important}\n@media(max-width:380px){.v431-hero{min-height:280px;padding-left:14px}.v431-hero-copy h1{font-size:19px}.v431-shirt{width:116px;height:140px}.v431-products{gap:8px}.v431-custom-grid{grid-template-columns:41% 59%}.v431-story-crest{width:96px;height:96px}}\n@media(min-width:700px){body[data-app-route=\"club-store\"] #screen{background:#eef1ff!important}.v431-store{box-shadow:0 0 40px rgba(12,21,99,.12)}}\n";
var DB=null;
var OPEN_KEY="v431-store-open",TEAM_KEY="v431-store-team",CAT_KEY="v431-store-cat",CART_KEY="v431-store-cart";
var REMOTE="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/";
function route(){return String(location.hash||"").replace(/^#\/?/,"").split("?")[0]||"home"}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function norm(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\batl\b/g,"atletico").replace(/\bdep\b/g,"deportivo").replace(/[^a-z0-9]+/g," ").trim()}
function initials(v){var a=String(v||"").trim().split(/\s+/).filter(Boolean);return (a[0]?a[0][0]:"")+(a[1]?a[1][0]:"")}
function readCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||"[]")||[]}catch(_){return []}}
function writeCart(x){try{localStorage.setItem(CART_KEY,JSON.stringify(x||[]))}catch(_){}}
async function load(){
 if(DB)return DB; DB=window.LJR_OFFICIAL_DATA||null; if(DB)return DB;
 try{var r=await fetch("./data/official-live.json?v=20261001-v491-v35-all-pages",{cache:"no-store"});if(r.ok)DB=await r.json()}catch(_){}
 return DB;
}
function logoFor(name){
 var d=DB||window.LJR_OFFICIAL_DATA||{},entries=Object.entries(d.team_logos||{}),n=norm(name),hit=entries.find(function(kv){return norm(kv[0])===n});
 if(!hit)return ""; var v=hit[1]; if(typeof v==="string")return v;
 if(v&&v.local)return REMOTE+String(v.local).replace(/^\.\//,""); return v&&v.source?v.source:"";
}
function rosterFor(name,cat){
 var d=DB||window.LJR_OFFICIAL_DATA||{},c=d.categories&&d.categories[String(cat)]; if(!c)return [];
 var k=Object.keys(c.rosters||{}).find(function(x){return norm(x)===norm(name)});
 return k&&Array.isArray(c.rosters[k])?c.rosters[k].map(String).filter(Boolean):[];
}
var V915_STORE_CAT_NAMES={"3":"Primera Fuerza","5":"Intermedia","4":"Segunda Fuerza","2":"Veteranos 35+","1":"Veteranos 50+"};
var V915_STORE_CAT_LOGOS={
 "3":"./assets/season-2026/primera.webp",
 "5":"./assets/season-2026/intermedia.webp",
 "4":"./assets/season-2026/segunda.webp",
 "2":"./assets/season-2026/veteranos-35.webp",
 "1":"./assets/season-2026/veteranos-50.webp"
};
function storeCategoryName(cat){
 var d=DB||window.LJR_OFFICIAL_DATA||{};
 return String(d.categories?.[String(cat)]?.name||V915_STORE_CAT_NAMES[String(cat)]||"Liga Municipal");
}
function storePlayerProfile(team,cat,name){
 var d=DB||window.LJR_OFFICIAL_DATA||{},c=d.categories&&d.categories[String(cat)]||{};
 var entry=Object.entries(c.player_profiles||{}).find(function(kv){return norm(kv[0])===norm(team)});
 var rows=Array.isArray(entry&&entry[1])?entry[1]:[];
 var p=rows.find(function(x){return norm(x&&x.name)===norm(name)})||{};
 var photo=String(p.photo||"");
 if(!photo){
   try{photo=String(window.LJR_PLAYER_MEDIA?.photo?.(name,team,cat)||"")}catch(_){}
 }
 return {
   name:String(name||""),
   photo:photo,
   position:String(p.position||"Jugador"),
   dorsal:String(p.dorsal||p.number||"")
 };
}
function storePlayerAvatar(team,cat,name){
 var p=storePlayerProfile(team,cat,name);
 return '<span class="v915-store-player-avatar'+(p.photo?' has-photo':'')+'">'+
   (p.photo?'<img src="'+esc(p.photo)+'" alt="'+esc(name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'<b>'+esc(initials(name)||"JR")+'</b>')+
 '</span>';
}

/* V916 — exact team crest + club-specific shirt color/design.
   The 51-club jersey registry is the source of truth for the store. */
function storeKitItem(team){
 try{return window.LJR_JERSEY_ASSETS?.itemFor?.(team)||null}catch(_){return null}
}
function storeTeamLogo(team){
 const item=storeKitItem(team);
 if(item?.logo)return String(item.logo);
 try{const x=window.LJR_SEASON_LOGOS?.get?.(team);if(x)return String(x)}catch(_){}
 try{const x=window.LJR_TEAM_LOGOS?.get?.(team);if(x)return String(x)}catch(_){}
 try{const x=window.LJR_OFFICIAL_API?.getLogo?.(team);if(x)return String(x)}catch(_){}
 return String(logoFor(team)||'');
}
function v916FallbackColors(team){
 const n=norm(team),rows=[
  [/franco/,['#d71920','#0a0b10']], [/galacticos|pozos/,['#e8b519','#101010']],
  [/juventus/,['#f4f4f4','#121212']], [/manchester/,['#e31d2b','#111111']],
  [/boavista/,['#111111','#e2bd22']], [/esperanza/,['#18b76d','#08261b']],
  [/lobos/,['#1458d7','#071c4f']], [/san julian/,['#e52d36','#ffffff']],
  [/tavera/,['#1c67d5','#ffffff']], [/america/,['#f0d326','#173a8e']],
  [/herrera/,['#111111','#d91c28']], [/promesas/,['#2468d8','#ffffff']],
  [/cuenda/,['#0b6a42','#efd94c']], [/aldama/,['#d52231','#111111']],
  [/linces/,['#0c2e77','#dfb72c']], [/psv/,['#e1222c','#ffffff']],
  [/napoli/,['#1b8bd1','#ffffff']], [/dynamo|dinamo/,['#2456c7','#101010']],
  [/boca/,['#1748a5','#f0cb26']], [/san jose/,['#16884a','#ffffff']],
  [/hermanos/,['#111111','#d8c39a']], [/abejas/,['#f0c52e','#161616']],
  [/terricola/,['#2e8b57','#ffffff']], [/celtic/,['#17964b','#ffffff']],
  [/nopalero/,['#39a935','#183e28']], [/barza/,['#17378f','#a81535']]
 ];
 for(const row of rows)if(row[0].test(n))return row[1];
 let h=0;for(const ch of String(team||''))h=(h*31+ch.charCodeAt(0))>>>0;
 const hue=h%360;return ['hsl('+hue+' 72% 43%)','hsl('+((hue+42)%360)+' 65% 28%)'];
}
function v916Pattern(item){
 const o=String(item?.original||'').toLowerCase();
 if(/inter|club brugge|atleti|lens|porto|psv|real betis|sporting|shakhtar/.test(o))return 'stripes';
 if(/feyenoord|galatasaray|slavia/.test(o))return 'halves';
 if(/paris/.test(o))return 'center';
 if(/stuttgart/.test(o))return 'chest';
 if(/aston villa/.test(o))return 'sleeves';
 if(/dortmund/.test(o))return 'shoulders';
 if(/barcelona/.test(o))return 'stripes';
 return 'plain';
}
function v916Hex(r,g,b){
 const h=n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');
 return '#'+h(r)+h(g)+h(b);
}
function v916SampleKit(item,fallback){
 return new Promise(resolve=>{
   if(!item?.url){resolve({color:fallback[0],accentColor:fallback[1],pattern:v916Pattern(item)});return}
   const im=new Image();im.decoding='async';
   im.onload=()=>{
     try{
       const c=document.createElement('canvas');c.width=64;c.height=64;
       const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,64,64);
       const d=x.getImageData(0,0,64,64).data,bins=new Map();
       for(let yy=8;yy<55;yy++)for(let xx=12;xx<52;xx++){
         const i=(yy*64+xx)*4;if(d[i+3]<100)continue;
         const r=d[i],g=d[i+1],b=d[i+2],max=Math.max(r,g,b),min=Math.min(r,g,b);
         if(max<24)continue;
         const qr=Math.round(r/32)*32,qg=Math.round(g/32)*32,qb=Math.round(b/32)*32;
         const key=qr+','+qg+','+qb;bins.set(key,(bins.get(key)||0)+1+(max-min>35?1:0));
       }
       const arr=[...bins.entries()].sort((a,b)=>b[1]-a[1]).map(([k])=>k.split(',').map(Number));
       const first=arr[0]||null;
       let second=null;
       if(first)second=arr.find(v=>Math.hypot(v[0]-first[0],v[1]-first[1],v[2]-first[2])>95)||null;
       resolve({
         color:first?v916Hex(...first):fallback[0],
         accentColor:second?v916Hex(...second):fallback[1],
         pattern:v916Pattern(item)
       });
     }catch(_){resolve({color:fallback[0],accentColor:fallback[1],pattern:v916Pattern(item)})}
   };
   im.onerror=()=>resolve({color:fallback[0],accentColor:fallback[1],pattern:v916Pattern(item)});
   im.src=String(item.url);
 });
}
function storeTeamStyle(team){
 const fallback=v916FallbackColors(team),item=storeKitItem(team);
 return {color:fallback[0],accentColor:fallback[1],pattern:v916Pattern(item),item};
}
function crest(name,logo,cls){return '<span class="'+(cls||"v431-crest")+'">'+(logo?'<img src="'+esc(logo)+'" alt="'+esc(name)+'">':'<b>'+esc(initials(name)||"JR")+'</b>')+'</span>'}
var V441_SHIRT_SEQ=0;
function shirtPalette(variant){
 var v=String(variant||"home");
 if(v==="away")return {a:"#f7f8ff",b:"#cfd8ff",c:"#8ea2ff",ink:"#17205f",edge:"#5b6fc5"};
 if(v==="third")return {a:"#23283d",b:"#0d1020",c:"#080a14",ink:"#f7f8ff",edge:"#65708e"};
 if(v==="training")return {a:"#10c995",b:"#068b72",c:"#03483f",ink:"#ffffff",edge:"#72f1cf"};
 if(v==="keeper")return {a:"#ffd95b",b:"#f2a813",c:"#8c5200",ink:"#201400",edge:"#fff1a6"};
 if(v==="special")return {a:"#8e4cff",b:"#3f3be8",c:"#101061",ink:"#ffffff",edge:"#c8b7ff"};
 return {a:"#3552ff",b:"#1429d5",c:"#07106c",ink:"#ffffff",edge:"#7e91ff"};
}
function shirt(logo,variant,label,number,name){
 const team=sessionStorage.getItem(TEAM_KEY)||'';
 logo=storeTeamLogo(team)||logo;
 var v=variant||"home",base=storeTeamStyle(team),p=shirtPalette(v);
 if(v==="home"){p={a:base.color,b:base.color,c:base.accentColor,ink:"#ffffff",edge:base.accentColor}}
 else if(v==="away"){p={a:base.accentColor,b:base.accentColor,c:base.color,ink:"#ffffff",edge:base.color}}
 var pattern=v==="home"?(base.pattern==="stripes"?"stripes":base.pattern==="halves"?"diag":base.pattern==="shoulders"?"shoulders":"bands"):v==="away"?"plain":v==="third"?"diag":v==="training"?"shoulders":v==="keeper"?"plain":"stripes";
 return '<div class="v431-shirt v440-shirt v441-shirt v442-shirt-3d v602-store-real-shirt '+esc(v)+' '+pattern+'" data-v442-tilt style="--v602-a:'+esc(p.a)+';--v602-b:'+esc(p.b)+';--v602-c:'+esc(p.c)+';--v602-edge:'+esc(p.edge)+';--v602-ink:'+esc(p.ink)+'">'+
  '<span class="v602-shirt-base" aria-hidden="true"></span>'+
  '<span class="v602-shirt-tint" aria-hidden="true"></span>'+
  '<span class="v602-shirt-pattern" aria-hidden="true"></span>'+
  '<span class="v602-shirt-light" aria-hidden="true"></span>'+
  (logo?'<img class="v602-shirt-logo" src="'+esc(logo)+'" alt="'+esc(team)+'" loading="eager" decoding="async">':'')+
  '<span class="v431-shirt-name v602-shirt-name">'+esc(name||"")+'</span>'+
  '<span class="v431-shirt-number v602-shirt-number">'+esc(number||"")+'</span>'+
  '<span class="v602-shirt-label">'+esc(label||"")+'</span>'+
  '<i class="v440-shirt-shadow"></i><i class="v442-floor-shadow"></i>'+
 '</div>';
}

var V443_THREE_PROMISE=null,V443_RENDER_CACHE=new Map();
function v443Three(){
 // Download/parse the 3D engine only when a shop item actually needs it.
 if(!V443_THREE_PROMISE)V443_THREE_PROMISE=import('three').catch(()=>{V443_THREE_PROMISE=null;return null});
 return V443_THREE_PROMISE;
}
function v443Hex(v){
 var p=shirtPalette(v);
 return {base:p.b,light:p.a,dark:p.c,ink:p.ink};
}
function v443LoadTexture(THREE,url){
 return new Promise(function(resolve){
   if(!url){resolve(null);return}
   try{
     var loader=new THREE.TextureLoader();
     loader.setCrossOrigin("anonymous");
     loader.load(url,function(tex){
       try{tex.colorSpace=THREE.SRGBColorSpace}catch(_){}
       tex.anisotropy=4;resolve(tex);
     },undefined,function(){resolve(null)});
   }catch(_){resolve(null)}
 });
}
async function v443RenderVariant(variant,logo){
 var THREE=await v443Three(); if(!THREE)return "";
 var key=String(variant||"home")+"|"+String(logo||"");
 if(V443_RENDER_CACHE.has(key))return V443_RENDER_CACHE.get(key);
 var promise=(async function(){
   var w=420,h=500,renderer;
   try{
     renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:"high-performance"});
     renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
     renderer.setSize(w,h,false);
     renderer.shadowMap.enabled=true;
     renderer.shadowMap.type=THREE.PCFSoftShadowMap;
     try{renderer.outputColorSpace=THREE.SRGBColorSpace}catch(_){}
     renderer.toneMapping=THREE.ACESFilmicToneMapping;
     renderer.toneMappingExposure=1.12;

     var scene=new THREE.Scene();
     var camera=new THREE.PerspectiveCamera(29,w/h,.1,100);
     camera.position.set(6.6,4.0,11.8);
     camera.lookAt(0,.25,0);

     var hemi=new THREE.HemisphereLight(0xffffff,0x25346f,2.15); scene.add(hemi);
     var keyLight=new THREE.DirectionalLight(0xffffff,5.2);keyLight.position.set(-5,8,9);keyLight.castShadow=true;
     keyLight.shadow.mapSize.set(1024,1024);scene.add(keyLight);
     var rim=new THREE.DirectionalLight(0x7b8cff,3.2);rim.position.set(6,3,-4);scene.add(rim);
     var fill=new THREE.DirectionalLight(0xffffff,1.75);fill.position.set(4,-1,7);scene.add(fill);

     // Actual extruded 3D T-shirt geometry.
     var s=new THREE.Shape();
     s.moveTo(-1.55,2.85);
     s.lineTo(-2.42,2.38); s.lineTo(-3.5,1.48); s.lineTo(-2.72,.28);
     s.lineTo(-2.02,.76); s.lineTo(-1.86,.48); s.lineTo(-1.86,-3.02);
     s.quadraticCurveTo(-.9,-3.18,0,-3.14);
     s.quadraticCurveTo(.9,-3.18,1.86,-3.02);
     s.lineTo(1.86,.48); s.lineTo(2.02,.76); s.lineTo(2.72,.28);
     s.lineTo(3.5,1.48); s.lineTo(2.42,2.38); s.lineTo(1.55,2.85);
     s.quadraticCurveTo(.9,2.52,.62,2.38);
     s.quadraticCurveTo(0,1.98,-.62,2.38);
     s.quadraticCurveTo(-.9,2.52,-1.55,2.85);

     var geo=new THREE.ExtrudeGeometry(s,{depth:.42,bevelEnabled:true,bevelSegments:5,steps:2,bevelSize:.11,bevelThickness:.11,curveSegments:10});
     geo.center();

     // Give the front actual cloth waves so light reacts like fabric, not a flat extrusion.
     var pos=geo.attributes.position;
     for(var i=0;i<pos.count;i++){
       var x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
       var front=z>.05;
       if(front){
         var wave=Math.sin(y*2.25+x*.85)*.035 + Math.sin(x*3.15-y*.42)*.018;
         var waist=Math.exp(-Math.pow(y+.9,2)*.7)*Math.cos(x*2.1)*.025;
         pos.setZ(i,z+wave+waist);
       }
     }
     pos.needsUpdate=true;geo.computeVertexNormals();

     var pal=v443Hex(variant);
     var mat=new THREE.MeshPhysicalMaterial({
       color:new THREE.Color(pal.base),
       roughness:.62,
       metalness:.02,
       clearcoat:.08,
       clearcoatRoughness:.82,
       sheen:1,
       sheenRoughness:.72,
       sheenColor:new THREE.Color(pal.light),
       side:THREE.DoubleSide
     });
     var jersey=new THREE.Mesh(geo,mat);jersey.castShadow=true;jersey.receiveShadow=true;
     jersey.rotation.set(-.10,.34,-.03);
     scene.add(jersey);

     // Collar ring as separate geometry for depth.
     var collarMat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(pal.light),roughness:.55,metalness:0});
     var collar=new THREE.TorusGeometry(.63,.075,18,64,Math.PI*1.1);
     var collarMesh=new THREE.Mesh(collar,collarMat);
     collarMesh.position.set(0,2.10,.31); collarMesh.rotation.set(0,0,Math.PI*.95); collarMesh.scale.set(1,.62,1);
     collarMesh.rotation.y=.34; scene.add(collarMesh);

     // Sleeve seam piping.
     var seamMat=new THREE.MeshStandardMaterial({color:new THREE.Color(pal.light),roughness:.6});
     function seam(x,rot){
       var g=new THREE.CylinderGeometry(.035,.035,1.65,12);
       var m=new THREE.Mesh(g,seamMat);m.position.set(x,1.35,.34);m.rotation.set(0,.34,rot);scene.add(m);
     }
     seam(-2.36,-.78);seam(2.36,.78);

     // Team crest as a real front plane with tiny physical separation.
     var tex=await v443LoadTexture(THREE,logo);
     if(tex){
       var crestMat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,side:THREE.DoubleSide});
       var crest=new THREE.Mesh(new THREE.PlaneGeometry(.74,.74),crestMat);
       crest.position.set(.55,.83,.48); crest.rotation.y=.34; crest.rotation.x=-.10; crest.rotation.z=-.03;
       scene.add(crest);
     }

     // Small fabric badge block adds another depth cue.
     var badge=new THREE.Mesh(
       new THREE.BoxGeometry(.75,.18,.08),
       new THREE.MeshPhysicalMaterial({color:new THREE.Color(pal.dark),roughness:.5})
     );
     badge.position.set(-.42,-2.34,.49);badge.rotation.y=.34;badge.rotation.x=-.10;badge.rotation.z=-.03;scene.add(badge);

     var floorMat=new THREE.ShadowMaterial({color:0x071035,opacity:.20});
     var floor=new THREE.Mesh(new THREE.PlaneGeometry(16,16),floorMat);
     floor.rotation.x=-Math.PI/2;floor.position.y=-3.55;floor.receiveShadow=true;scene.add(floor);

     renderer.render(scene,camera);
     var out=renderer.domElement.toDataURL("image/webp",.92);
     geo.dispose();mat.dispose();collar.dispose();collarMat.dispose();seamMat.dispose();floorMat.dispose();
     if(tex)tex.dispose();
     renderer.dispose();
     return out;
   }catch(_){
     try{renderer&&renderer.dispose()}catch(__){}
     return "";
   }
 })();
 V443_RENDER_CACHE.set(key,promise);
 return promise;
}
async function initV4433D(root){
 if(!root)return;
 var nodes=[].slice.call(root.querySelectorAll(".v443-shirt-webgl"));
 var seen=new Map();
 nodes.forEach(function(el){
   var key=(el.dataset.v443Variant||"home")+"|"+(el.dataset.v443Logo||"");
   if(!seen.has(key))seen.set(key,[]);
   seen.get(key).push(el);
 });
 for(const pair of seen){
   var parts=pair[0].split("|"),variant=parts.shift()||"home",logo=parts.join("|");
   var data=await v443RenderVariant(variant,logo);
   if(!data)continue;
   pair[1].forEach(function(el){
     var img=el.querySelector(".v443-3d-render");
     if(img){img.onload=function(){el.classList.add("v443-ready")};img.src=data}
   });
 }
}

var V444_OBSERVER=null;
function v444DisposeObject(obj){
 try{
   obj.traverse(function(n){
     if(n.geometry&&n.geometry.dispose)n.geometry.dispose();
     if(n.material){
       var ms=Array.isArray(n.material)?n.material:[n.material];
       ms.forEach(function(m){
         if(m.map&&m.map.dispose)m.map.dispose();
         if(m.dispose)m.dispose();
       });
     }
   });
 }catch(_){}
}
function v444Unmount(el){
 var s=el&&el.__v4443d;if(!s)return;
 try{cancelAnimationFrame(s.raf)}catch(_){}
 try{v444DisposeObject(s.scene)}catch(_){}
 try{s.renderer.dispose()}catch(_){}
 try{s.canvas.remove()}catch(_){}
 el.classList.remove("v444-live");
 delete el.__v4443d;
}
async function v444Mount(el){
 if(!el||el.__v4443d||!el.isConnected)return;
 var THREE=await v443Three();if(!THREE||!el.isConnected)return;
 var box=el.getBoundingClientRect(),w=Math.max(72,Math.round(box.width||120)),h=Math.max(88,Math.round(box.height||145));
 var renderer;
 try{
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"high-performance"});
   renderer.setPixelRatio(Math.min(1.6,window.devicePixelRatio||1));
   renderer.setSize(w,h,false);
   renderer.shadowMap.enabled=true;
   renderer.shadowMap.type=THREE.PCFSoftShadowMap;
   try{renderer.outputColorSpace=THREE.SRGBColorSpace}catch(_){}
   renderer.toneMapping=THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.03;
 }catch(_){return}

 var canvas=renderer.domElement;
 canvas.className="v444-3d-canvas";
 canvas.setAttribute("aria-hidden","true");
 el.appendChild(canvas);
 el.dataset.v445Render="live3d";

 var scene=new THREE.Scene();
 var camera=new THREE.PerspectiveCamera(30,w/h,.1,100);
 camera.position.set(0,.25,12.6);
 camera.lookAt(0,.12,0);

 var variant=el.dataset.v443Variant||"home",logo=el.dataset.v443Logo||"",pal=v443Hex(variant);
 var group=new THREE.Group();
 group.rotation.set(-.065,.40,-.025);
 scene.add(group);

 var hemi=new THREE.HemisphereLight(0xffffff,0x182453,2.35);scene.add(hemi);
 var key=new THREE.DirectionalLight(0xffffff,5.4);key.position.set(-5.4,7.4,8.8);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
 var fill=new THREE.DirectionalLight(0x98a8ff,2.2);fill.position.set(5.8,2.8,7.2);scene.add(fill);
 var rim=new THREE.DirectionalLight(0x5572ff,3.6);rim.position.set(5.5,4.5,-5.5);scene.add(rim);
 var low=new THREE.PointLight(0xffffff,1.0,20);low.position.set(0,-4,6);scene.add(low);

 // Volumetric jersey silhouette: thick bevels + curved cloth front/back.
 var s=new THREE.Shape();
 s.moveTo(-1.46,2.88);
 s.lineTo(-2.34,2.49);s.quadraticCurveTo(-2.95,2.15,-3.58,1.54);
 s.lineTo(-2.76,.25);s.lineTo(-2.04,.72);
 s.quadraticCurveTo(-1.86,.80,-1.82,.46);
 s.lineTo(-1.73,-2.82);
 s.quadraticCurveTo(-.95,-3.08,0,-3.12);
 s.quadraticCurveTo(.95,-3.08,1.73,-2.82);
 s.lineTo(1.82,.46);s.quadraticCurveTo(1.86,.80,2.04,.72);
 s.lineTo(2.76,.25);s.lineTo(3.58,1.54);
 s.quadraticCurveTo(2.95,2.15,2.34,2.49);
 s.lineTo(1.46,2.88);
 s.quadraticCurveTo(.88,2.55,.62,2.36);
 s.quadraticCurveTo(0,1.92,-.62,2.36);
 s.quadraticCurveTo(-.88,2.55,-1.46,2.88);

 var geo=new THREE.ExtrudeGeometry(s,{depth:.78,bevelEnabled:true,bevelSegments:7,steps:3,bevelSize:.13,bevelThickness:.16,curveSegments:14});
 geo.center();
 var pos=geo.attributes.position;
 for(var i=0;i<pos.count;i++){
   var x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
   var front=z>0,side=Math.min(1,Math.abs(x)/3.4);
   var drape=Math.sin(y*1.85+x*.72)*.050 + Math.sin(x*2.45-y*.30)*.025;
   var chest=Math.exp(-Math.pow(y-.65,2)*.52)*(1-side)*.10;
   var waist=-Math.exp(-Math.pow(y+1.05,2)*.9)*(1-side)*.055;
   var sleeve=Math.max(0,side-.58)*.16;
   pos.setZ(i,z+(front?1:-.45)*(drape+chest+waist)+sleeve*(front?.7:-.25));
 }
 pos.needsUpdate=true;geo.computeVertexNormals();

 var fabric=new THREE.MeshPhysicalMaterial({
   color:new THREE.Color(pal.base),
   roughness:.74,
   metalness:0,
   clearcoat:.025,
   clearcoatRoughness:.94,
   sheen:1,
   sheenRoughness:.82,
   sheenColor:new THREE.Color(pal.light),
   side:THREE.DoubleSide
 });
 var jersey=new THREE.Mesh(geo,fabric);jersey.castShadow=true;jersey.receiveShadow=true;group.add(jersey);

 // Side panels deepen the torso and stop it reading like cardboard.
 var panelMat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(pal.dark),roughness:.78,sheen:.4,sheenColor:new THREE.Color(pal.light)});
 [-1,1].forEach(function(side){
   var panel=new THREE.Mesh(new THREE.CapsuleGeometry(.13,3.8,8,18),panelMat);
   panel.scale.set(.65,1,.58);panel.position.set(side*1.76,-.28,-.04);panel.rotation.z=side*.018;group.add(panel);
 });

 // Ribbed collar with actual depth.
 var collarMat=new THREE.MeshPhysicalMaterial({color:new THREE.Color(pal.light),roughness:.66,sheen:.8,sheenColor:new THREE.Color(0xffffff)});
 var collar=new THREE.Mesh(new THREE.TorusGeometry(.63,.095,20,72,Math.PI*1.14),collarMat);
 collar.position.set(0,2.17,.43);collar.rotation.z=Math.PI*.93;collar.scale.set(1,.64,1);group.add(collar);

 // Shoulder/sleeve seams.
 var seamMat=new THREE.MeshStandardMaterial({color:new THREE.Color(pal.light),roughness:.75});
 function seam(x,rot){
   var m=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1.56,14),seamMat);
   m.position.set(x,1.34,.47);m.rotation.z=rot;group.add(m);
 }
 seam(-2.30,-.82);seam(2.30,.82);

 // Lower woven label.
 var badge=new THREE.Mesh(new THREE.BoxGeometry(.66,.15,.075),new THREE.MeshStandardMaterial({color:new THREE.Color(pal.dark),roughness:.68}));
 badge.position.set(-.42,-2.42,.49);group.add(badge);

 // Team crest floats slightly over cloth, like a patch.
 var tex=await v443LoadTexture(THREE,logo);
 if(tex&&el.isConnected){
   var crestMat=new THREE.MeshPhysicalMaterial({map:tex,transparent:true,roughness:.7,metalness:0,depthWrite:false,side:THREE.DoubleSide});
   var crest=new THREE.Mesh(new THREE.PlaneGeometry(.72,.72),crestMat);
   crest.position.set(.55,.80,.53);group.add(crest);
 }

 // Ground plane gives the object a real contact shadow.
 var floorMat=new THREE.ShadowMaterial({color:0x050b2c,opacity:.22});
 var floor=new THREE.Mesh(new THREE.PlaneGeometry(16,16),floorMat);
 floor.rotation.x=-Math.PI/2;floor.position.y=-3.52;floor.receiveShadow=true;scene.add(floor);

 var state={renderer:renderer,canvas:canvas,scene:scene,camera:camera,group:group,raf:0,baseY:.40,targetY:.40,targetX:-.065,visible:true};
 el.__v4443d=state;
 el.classList.add("v444-live");

 var pointer=function(e){
   var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/Math.max(1,r.width),py=(e.clientY-r.top)/Math.max(1,r.height);
   state.targetY=(px-.5)*.82;
   state.targetX=(.5-py)*.30-.05;
 };
 var leave=function(){state.targetY=.40;state.targetX=-.065};
 el.addEventListener("pointermove",pointer,{passive:true});
 el.addEventListener("pointerleave",leave,{passive:true});
 state.cleanup=function(){try{el.removeEventListener("pointermove",pointer);el.removeEventListener("pointerleave",leave)}catch(_){}};

 var start=performance.now();
 function frame(now){
   if(!el.isConnected||!el.__v4443d)return;
   group.rotation.y+=(state.targetY-group.rotation.y)*.075;
   group.rotation.x+=(state.targetX-group.rotation.x)*.075;
   group.position.y=Math.sin((now-start)/1050)*.035;
   renderer.render(scene,camera);
   state.raf=requestAnimationFrame(frame);
 }
 state.raf=requestAnimationFrame(frame);
}
function v444UnmountSafe(el){
 var s=el&&el.__v4443d;if(s&&s.cleanup)try{s.cleanup()}catch(_){}
 v444Unmount(el);
}
function initV4443D(root){
 if(!root)return;
 if(V444_OBSERVER)try{V444_OBSERVER.disconnect()}catch(_){}
 var timers=new WeakMap();
 V444_OBSERVER=new IntersectionObserver(function(entries){
   entries.forEach(function(entry){
     var el=entry.target;
     if(entry.isIntersecting){
       var t=timers.get(el);if(t)clearTimeout(t);
       v444Mount(el);
     }else{
       var timer=setTimeout(function(){v444UnmountSafe(el)},650);
       timers.set(el,timer);
     }
   });
 },{root:null,rootMargin:"120px 0px",threshold:.04});
 root.querySelectorAll(".v443-shirt-webgl").forEach(function(el){V444_OBSERVER.observe(el)});
}
function productCard(title,sub,variant,logo){
 return '<article class="v431-product v440-product-card" data-v431-product data-v437-open-product="'+esc(variant||"home")+'" data-v437-title="'+esc(title)+'" data-v437-price="Mex$1,300.00" data-search="'+esc((title+" "+sub).toLowerCase())+'"><button type="button" class="v431-heart" data-v431-heart aria-label="Favorito">♡</button><div class="v431-product-art">'+shirt(logo,variant,"","","")+'<span class="v440-photo-tag">NUEVO</span></div><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p><div class="v440-product-meta"><span>Vista de producto</span><b>★ 4.9</b></div><button type="button" class="v431-add" data-v431-add="'+esc(title)+'">Añadir</button></article>';
}
function playerCards(roster,team,cat){
 if(!roster.length)return '<div class="v431-empty">La plantilla de este equipo todavía no tiene jugadores sincronizados para esta sección.</div>';
 return '<div class="v431-player-rail v915-store-player-rail">'+roster.map(function(n){
   var p=storePlayerProfile(team,cat,n);
   var meta=(p.dorsal?'#'+esc(p.dorsal)+' · ':'')+esc(p.position||'Jugador');
   return '<button type="button" class="v431-player-card v915-store-player-card" data-v431-player="'+esc(n)+'">'+
     storePlayerAvatar(team,cat,n)+
     '<b>'+esc(n)+'</b><small>'+meta+'</small>'+
   '</button>';
 }).join("")+'</div>';
}
function store3DPanel(team,cat,logo){
 var category=storeCategoryName(cat);
 return '<section class="v431-block v915-store-3d-section" id="camiseta3d">'+
   '<div class="v431-section-title"><div><small>CAMISETA DEL EQUIPO</small><h2>Vista 3D</h2></div></div>'+
   '<div class="v915-store-3d-card" data-v915-store-3d-card>'+
     '<span class="v915-store-3d-badge">CAMISETA CORTA · 3D</span>'+
     '<div class="v915-store-3d-stage" data-v915-store-shirt-3d aria-label="Camiseta 3D de '+esc(team)+'"></div>'+
     '<div class="v915-store-3d-controls">'+
       '<button type="button" data-v915-shirt-front><span>Frente</span></button>'+
       '<button type="button" data-v915-shirt-back><span>Espalda</span></button>'+
       '<button type="button" data-v915-shirt-spin aria-pressed="false"><span data-v915-spin-label>Girar</span></button>'+
     '</div>'+
     '<p>Colores y diseño según '+esc(team)+' · escudo del equipo al frente · '+esc(category)+' en la espalda.</p>'+
   '</div>'+
 '</section>';
}
function mountStore3D(root,team){
 var host=root&&root.querySelector("[data-v915-store-shirt-3d]");if(!host)return;
 var tries=0;
 function boot(){
   var engine=window.LJR_FOOTBALL_SHIRT_3D;
   if(!engine?.mount){if(tries++<100)setTimeout(boot,50);return}
   var cat=sessionStorage.getItem(CAT_KEY)||"3",style=storeTeamStyle(team),teamLogo=storeTeamLogo(team);
   var viewer=engine.mount(host,{
     name:"",
     number:"",
     color:style.color,
     accentColor:style.accentColor,
     pattern:style.pattern,
     team:team,
     logo:teamLogo,
     category:storeCategoryName(cat),
     categoryLogo:V915_STORE_CAT_LOGOS[String(cat)]||""
   });
   root.__v915StoreViewer=viewer;

   // Read the exact assigned 3/4 jersey to match its dominant club colors.
   v916SampleKit(style.item,[style.color,style.accentColor]).then(function(sample){
     if(!root.isConnected||root.__v915StoreViewer!==viewer)return;
     viewer?.update?.({
       color:sample.color,
       accentColor:sample.accentColor,
       pattern:sample.pattern,
       logo:storeTeamLogo(team)
     });
     root.style.setProperty("--v916-club-primary",sample.color);
     root.style.setProperty("--v916-club-accent",sample.accentColor);
   });

   root.querySelector("[data-v915-shirt-front]")?.addEventListener("click",function(){viewer?.front?.()});
   root.querySelector("[data-v915-shirt-back]")?.addEventListener("click",function(){viewer?.back?.()});
   root.querySelector("[data-v915-shirt-spin]")?.addEventListener("click",function(e){
     var on=viewer?.toggleSpin?.();
     e.currentTarget.classList.toggle("active",!!on);
     e.currentTarget.setAttribute("aria-pressed",String(!!on));
     var label=e.currentTarget.querySelector("[data-v915-spin-label]");
     if(label)label.textContent=on?"Detener":"Girar";
   });
 }
 boot();
}
function v436Product(title,sub,variant,logo,price,badge){
 return '<article class="v436-product" data-v431-product data-v437-open-product="'+esc(variant||"home")+'" data-v437-title="'+esc(title)+'" data-v437-price="'+esc(price||"Mex$1,300.00")+'" data-search="'+esc((title+" "+sub).toLowerCase())+'">'+
  '<div class="v436-product-art">'+shirt(logo,variant,"","","")+
    '<button type="button" class="v436-plus" data-v436-add="'+esc(title)+'" aria-label="Añadir">＋</button>'+
    '<button type="button" class="v436-fav" data-v431-heart aria-label="Favorito">♡</button>'+
    (badge?'<span class="v436-badge">'+esc(badge)+'</span>':'')+
  '</div>'+
  '<strong>'+esc(price||"Mex$1,300.00")+'</strong><p>'+esc(title)+'</p><small>'+esc(sub)+'</small>'+
  '<div class="v440-product-meta"><span>Vista de producto</span><b>★ 4.9</b></div>'+
 '</article>';
}
function v436CategoryPanel(team,logo){
 return '<section class="v436-category-panel" data-v436-category-panel>'+
   '<div class="v436-category-view" data-v436-category="new">'+
     '<div class="v436-breadcrumb">Atrás <b>›</b> Inicio <b>›</b> Novedades</div>'+
     '<h2>Novedades</h2><p class="v436-desc">Descubre los lanzamientos más recientes de '+esc(team)+' y encuentra lo nuevo del equipo.</p>'+
     '<button type="button" class="v436-show-more">Ver más</button>'+
     '<div class="v436-filter-chips"><button class="active" data-v436-chip>TODO</button></div>'+
     '<div class="v436-sort-row"><button type="button" data-v436-sort>⌃⌄ <span>Recomendados</span></button><button type="button" data-v436-filter-toggle>☷ <span>Filtrar</span></button></div>'+
     '<div class="v436-products">'+
       v436Product("Camiseta edición nueva",team+" · Colección 2026","third",logo,"Mex$1,300.00","Nuevo")+
       v436Product("Colección del club",team+" · Edición especial","special",logo,"Mex$1,450.00","Nuevo")+
       v436Product("Entrenamiento Pro",team+" · Training","training",logo,"Mex$1,250.00","")+
       v436Product("Portero edición club",team+" · Guardameta","keeper",logo,"Mex$1,550.00","")+
     '</div>'+
   '</div>'+
   '<div class="v436-category-view" data-v436-category="kits">'+
     '<div class="v436-promo">Hasta 40% en artículos seleccionados · <u>Ver colección</u></div>'+
     '<div class="v436-kit-tiles">'+
       '<button data-v436-chip><div>'+shirt(logo,"home","","","")+'</div><b>Local</b></button>'+
       '<button data-v436-chip><div>'+shirt(logo,"away","","","")+'</div><b>Visitante</b></button>'+
       '<button data-v436-chip><div>'+shirt(logo,"third","","","")+'</div><b>Tercera</b></button>'+
     '</div>'+
     '<div class="v436-breadcrumb">Atrás <b>›</b> Inicio <b>›</b> Equipaciones</div>'+
     '<h2>Equipaciones</h2><p class="v436-desc">Lleva los colores de '+esc(team)+' con las equipaciones del club, adaptadas al estilo de la Liga.</p>'+
     '<button type="button" class="v436-show-more">Ver más</button>'+
     '<div class="v436-filter-chips"><button class="active" data-v436-chip>TODO</button><button data-v436-chip>LOCAL</button><button data-v436-chip>VISITANTE</button><button data-v436-chip>TERCERA</button><button data-v436-chip>PORTERO</button></div>'+
     '<div class="v436-sort-row"><button type="button" data-v436-sort>⌃⌄ <span>Recomendados</span></button><button type="button" data-v436-filter-toggle>☷ <span>Filtrar</span></button></div>'+
     '<div class="v436-products">'+
       v436Product("Primera equipación",team+" · Local","home",logo,"Mex$1,300.00","Nuevo")+
       v436Product("Segunda equipación",team+" · Visitante","away",logo,"Mex$1,300.00","")+
       v436Product("Tercera equipación",team+" · Alternativa","third",logo,"Mex$1,350.00","")+
       v436Product("Equipación de portero",team+" · Guardameta","keeper",logo,"Mex$1,450.00","")+
     '</div>'+
   '</div>'+
   '<div class="v436-category-view" data-v436-category="training">'+
     '<div class="v436-breadcrumb">Atrás <b>›</b> Inicio <b>›</b> Entrenamiento</div>'+
     '<h2>Entrenamiento</h2><p class="v436-desc">Colección de entrenamiento de '+esc(team)+' para preparar cada partido con el estilo del equipo.</p>'+
     '<button type="button" class="v436-show-more">Ver más</button>'+
     '<div class="v436-filter-chips"><button class="active" data-v436-chip>TODO</button><button data-v436-chip>HOMBRE</button><button data-v436-chip>MUJER</button><button data-v436-chip>JUVENIL</button></div>'+
     '<div class="v436-sort-row"><button type="button" data-v436-sort>⌃⌄ <span>Recomendados</span></button><button type="button" data-v436-filter-toggle>☷ <span>Filtrar</span></button></div>'+
     '<div class="v436-products">'+
       v436Product("Playera de entrenamiento",team+" · Training","training",logo,"Mex$1,300.00","Nuevo")+
       v436Product("Conjunto prepartido",team+" · Training","special",logo,"Mex$1,700.00","")+
       v436Product("Sudadera de entrenamiento",team+" · Training","third",logo,"Mex$1,650.00","")+
       v436Product("Portero training",team+" · Guardameta","keeper",logo,"Mex$1,450.00","")+
     '</div>'+
   '</div>'+
 '</section>';
}
function v437FeaturedKits(team,logo){
 return '<section class="v437-featured-kits">'+
   '<article class="v437-feature-card home"><div class="v437-feature-art">'+shirt(logo,"home","","","")+'</div><div class="v437-feature-copy"><h3>Local 26/27</h3><button type="button" data-v437-open-product="home" data-v437-title="Primera equipación" data-v437-price="Mex$1,300.00">VER AHORA</button></div></article>'+
   '<article class="v437-feature-card away"><div class="v437-feature-art">'+shirt(logo,"away","","","")+'</div><div class="v437-feature-copy"><h3>Visitante 26/27</h3><button type="button" data-v437-open-product="away" data-v437-title="Segunda equipación" data-v437-price="Mex$1,300.00">VER AHORA</button></div></article>'+
 '</section>';
}
function v437ProductDetail(team,logo,roster){
 var playerOptions=(roster||[]).slice(0,16).map(function(n){return '<button type="button" data-v437-player-option="'+esc(n)+'">'+esc(n)+'</button>'}).join("");
 return '<section class="v437-product-detail" data-v437-product-detail>'+
   '<div class="v437-member-strip">TIENDA DEL EQUIPO · PERSONALIZA TU CAMISETA</div>'+
   '<div class="v437-kit-tabs"><button type="button" data-v437-variant="away">Visitante</button><button type="button" class="active" data-v437-variant="home">Local</button><button type="button" data-v437-variant="third">Tercera</button></div>'+
   '<div class="v437-product-stage">'+
     '<button type="button" class="v437-detail-back" data-v437-detail-back aria-label="Volver">‹</button>'+
     '<div class="v437-stage-shirt" data-v437-stage-shirt>'+shirt(logo,"home","","","")+'</div>'+
   '</div>'+
   '<div class="v437-product-card">'+
     '<h2 data-v437-product-title>Primera equipación '+esc(team)+'</h2>'+
     '<strong data-v437-product-price>Mex$1,300.00</strong>'+
     '<p class="v437-member-price">Precio miembro <b data-v437-member-price>Mex$1,105.00</b> · diseño visual</p>'+
     '<hr>'+
     '<div class="v437-option-head"><b>Talla</b><button type="button" data-v437-size-guide>Guía de tallas</button></div>'+
     '<div class="v437-option-row v437-sizes"><button type="button" class="active" data-v437-size="CH">CH</button><button type="button" data-v437-size="M">M</button><button type="button" data-v437-size="G">G</button><button type="button" data-v437-size="XG">XG</button></div>'+
     '<hr>'+
     '<div class="v437-option-head"><b>Parche</b></div>'+
     '<div class="v437-option-row v437-badges"><button type="button" class="active" data-v437-badge="Sin parche">Sin parche</button><button type="button" data-v437-badge="Liga Municipal">Liga Municipal</button></div>'+
     '<hr>'+
     '<div class="v437-option-head"><b>Nombre y número</b></div>'+
     '<div class="v437-option-row v437-name-row"><button type="button" class="active" data-v437-name-mode="none">Ninguno</button><button type="button" data-v437-player-open>Seleccionar jugador</button></div>'+
     '<div class="v437-player-picker" data-v437-player-picker><div><b>Seleccionar jugador</b><button type="button" data-v437-player-close>×</button></div><div class="v437-player-options">'+(playerOptions||'<span class="v437-picker-empty">Sin jugadores sincronizados</span>')+'</div></div>'+
     '<div class="v437-selected-player" data-v437-selected-player></div>'+
     '<button type="button" class="v437-add-cart" data-v437-add-detail>AGREGAR AL CARRITO</button>'+
     '<p class="v437-detail-note">ⓘ Las camisetas personalizadas pueden requerir tiempo adicional de preparación. Esta tienda de la app no procesa pagos.</p>'+
   '</div>'+
 '</section>';
}
function v439StoreMenu(team,logo,roster){
 var players=(roster||[]).slice(0,5).map(function(n){return '<button type="button" data-v439-player="'+esc(n)+'">'+esc(n)+'</button>'}).join("");
 return '<section class="v439-store-menu" data-v439-menu>'+
  '<div class="v439-menu-search"><span>⌕</span><input type="search" data-v439-menu-search placeholder="Buscar en '+esc(team)+' Store"><button type="button" data-v439-menu-close>×</button></div>'+
  '<div class="v439-menu-main" data-v439-menu-main>'+
    '<button type="button" data-v439-submenu="kits"><span>Equipaciones</span><b>›</b></button>'+
    '<button type="button" data-v439-go="players"><span>Comprar por jugador</span><b>›</b></button>'+
    '<button type="button" data-v439-go="training"><span>Entrenamiento</span><b>›</b></button>'+
    '<button type="button" data-v439-submenu="fashion"><span>Moda</span><b>›</b></button>'+
    '<button type="button" data-v439-submenu="accessories"><span>Accesorios</span><b>›</b></button>'+
    '<button type="button" data-v439-submenu="sale"><span>Rebajas</span><b>›</b></button>'+
    '<div class="v439-menu-sale"><small>HASTA</small><strong>50%</strong><span>en colección seleccionada</span><button type="button" data-v439-go="sale">VER REBAJAS</button></div>'+
  '</div>'+
  '<div class="v439-submenu" data-v439-panel="kits"><button type="button" class="v439-sub-back" data-v439-sub-back>‹ Equipaciones</button><h3>Equipaciones 26/27</h3><button data-v439-go="homekit">Local</button><button data-v439-go="awaykit">Visitante</button><button data-v439-go="thirdkit">Tercera</button><button data-v439-go="kits">Ver todo</button></div>'+
  '<div class="v439-submenu" data-v439-panel="fashion"><button type="button" class="v439-sub-back" data-v439-sub-back>‹ Moda</button><h3>Colecciones</h3><button data-v439-toast="Exclusivos">Exclusivos</button><button data-v439-toast="Retro">Retro</button><button data-v439-toast="Esenciales">Esenciales</button></div>'+
  '<div class="v439-submenu" data-v439-panel="accessories"><button type="button" class="v439-sub-back" data-v439-sub-back>‹ Accesorios</button><h3>Accesorios</h3><button data-v439-toast="Gorras">Gorras</button><button data-v439-toast="Balones">Balones</button><button data-v439-toast="Coleccionables">Coleccionables</button></div>'+
  '<div class="v439-submenu" data-v439-panel="sale"><button type="button" class="v439-sub-back" data-v439-sub-back>‹ Rebajas</button><h3>Rebajas</h3><div class="v439-sale-hero"><div>'+crest(team,logo,"v439-sale-crest")+'</div><small>HASTA</small><strong>50%</strong><span>'+esc(team)+' Store</span></div><button data-v439-go="new">Ver artículos</button></div>'+
  '<div class="v439-submenu" data-v439-panel="players"><button type="button" class="v439-sub-back" data-v439-sub-back>‹ Jugadores</button><h3>Comprar por jugador</h3>'+(players||'<p>Plantilla pendiente de sincronizar.</p>')+'</div>'+
 '</section>';
}
function markup(team,cat,roster,logo){
 var first=roster[0]||"Edición del equipo";
 return '<section class="v431-store" data-v431-store data-v66-directory="store">'+
 '<header class="v431-store-head v435-store-head"><button type="button" class="v439-menu-toggle" data-v439-menu-toggle aria-label="Menú"><span></span><span></span><span></span></button><button type="button" class="v431-back v435-back" data-v431-back aria-label="Volver"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>'+crest(team,logo,"v431-head-crest")+'<div class="v431-head-copy v435-store-title"><b>'+esc(team)+' <span>Store</span></b></div><div class="v435-head-actions"><button type="button" class="v431-head-icon v435-icon" data-v431-search-toggle aria-label="Buscar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.4"/><path d="m15.3 15.3 5 5"/></svg></button><button type="button" class="v431-head-icon v435-icon v435-wishlist" data-v435-wishlist aria-label="Favoritos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2 4.4 13C.7 9.5 2.2 4 6.7 4c2.3 0 4 1.3 5.3 3 1.3-1.7 3-3 5.3-3 4.5 0 6 5.5 2.3 9L12 20.2Z"/></svg></button><button type="button" class="v431-head-icon v431-cart-button v435-icon" data-v431-cart-toggle aria-label="Carrito"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.1 12H6.1L5 7Z"/><path d="M9 7V5.8A3 3 0 0 1 12 3a3 3 0 0 1 3 2.8V7"/></svg><span class="v943-cart-count" data-v431-cart-count aria-hidden="true">0</span></button></div></header>'+
 '<div class="v431-search-panel v435-search-panel" data-v431-search-panel><span>⌕</span><input type="search" data-v431-search placeholder="Buscar en '+esc(team)+' Store"><button type="button" data-v431-search-close>×</button></div>'+
 v439StoreMenu(team,logo,roster)+
 '<nav class="v431-shop-tabs v435-shop-tabs"><button type="button" class="v436-close" data-v436-close aria-label="Cerrar categoría">×</button><button class="active" data-v436-view="home">Para ti</button><button data-v436-view="new">Novedades</button><button data-v436-view="kits">Equipaciones</button><button data-v436-view="training">Entrenamiento</button><button data-v431-jump="jugadores">Jugadores</button></nav>'+
 v436CategoryPanel(team,logo)+
 '<section class="v431-hero" id="novedades"><div class="v431-hero-copy"><small>COLECCIÓN '+esc(team.toUpperCase())+'</small><h1>La tienda del equipo, dentro de tu Liga</h1><p>Equipaciones, personalización y colección del club en un solo diseño.</p><button type="button" data-v431-jump="equipaciones">VER COLECCIÓN</button></div><div class="v431-hero-shirt">'+shirt(logo,"home","","","")+'</div></section>'+
 store3DPanel(team,cat,logo)+
 v437FeaturedKits(team,logo)+
 '<section class="v431-block v431-player-edition"><div class="v431-section-title"><div><small>EDICIÓN JUGADOR</small><h2>'+esc(first)+'</h2></div><button data-v431-jump="jugadores">Ver jugadores ›</button></div><div class="v431-edition-card"><div class="v431-edition-art">'+shirt(logo,"special","","","")+'</div><div><small>DISEÑO DEL CLUB</small><h3>Edición jugador</h3><p>Elige un jugador de la plantilla y prepara su versión personalizada.</p><button type="button" data-v431-jump="personaliza">Personalizar</button></div></div></section>'+
 '<section class="v431-block" id="equipaciones"><div class="v431-section-title"><div><small>EN TENDENCIA</small><h2>Equipaciones</h2></div><button type="button" data-v431-jump="colecciones">Ver todo</button></div><div class="v431-products">'+productCard("Primera equipación",team+" · Local","home",logo)+productCard("Segunda equipación",team+" · Visitante","away",logo)+productCard("Tercera equipación",team+" · Alternativa","third",logo)+'</div></section>'+
 '<section class="v431-block v431-custom" id="personaliza"><div class="v431-section-title"><div><small>HAZLA TUYA</small><h2>Personaliza tu camiseta</h2></div></div><div class="v431-custom-grid"><div class="v431-custom-preview">'+shirt(logo,"home","",10,"TU NOMBRE")+'</div><div class="v431-custom-form"><label>Nombre<input data-v431-name maxlength="14" value="TU NOMBRE" autocomplete="off"></label><label>Número<input data-v431-number inputmode="numeric" maxlength="2" value="10"></label><label>Talla<select data-v431-size><option>CH</option><option selected>M</option><option>G</option><option>XG</option></select></label><button type="button" class="v431-primary" data-v431-add-custom>AGREGAR PERSONALIZADA</button></div></div></section>'+
 '<section class="v431-story"><div class="v431-story-art">'+crest(team,logo,"v431-story-crest")+'</div><div><small>LA CAMISETA QUE NOS UNE</small><h2>'+esc(team)+'</h2><p>Una colección visual inspirada en el club y adaptada al estilo azul de la Liga.</p><button type="button" data-v431-jump="colecciones">EXPLORAR</button></div></section>'+
 '<section class="v431-block" id="colecciones"><div class="v431-section-title"><div><small>COMPRA POR COLECCIÓN</small><h2>Colecciones</h2></div></div><div class="v431-collection-rail"><button data-v431-filter="Primera"><div>'+shirt(logo,"home","","","")+'</div><b>Local</b><small>Primera equipación</small></button><button data-v431-filter="Segunda"><div>'+shirt(logo,"away","","","")+'</div><b>Visitante</b><small>Segunda equipación</small></button><button data-v431-filter="Tercera"><div>'+shirt(logo,"third","","","")+'</div><b>Alternativa</b><small>Tercera equipación</small></button><button data-v431-filter="Entrenamiento"><div>'+shirt(logo,"training","","","")+'</div><b>Entrenamiento</b><small>Colección training</small></button></div></section>'+
 '<section class="v431-block v431-training"><div class="v431-section-title"><div><small>EQUIPACIÓN Y ENTRENAMIENTO</small><h2>Más del equipo</h2></div></div><div class="v431-products">'+productCard("Entrenamiento",team+" · Training","training",logo)+productCard("Portero",team+" · Guardameta","keeper",logo)+productCard("Edición especial",team+" · Club","special",logo)+'</div></section>'+
 '<section class="v431-block" id="jugadores"><div class="v431-section-title"><div><small>COMPRA POR JUGADOR</small><h2>Plantilla</h2></div></div>'+playerCards(roster,team,cat)+'</section>'+
 '<footer class="v431-store-note"><b>TIENDA · '+esc(team)+'</b><span>Diseño conectado a los datos del equipo. El carrito es local en la app; no procesa pagos.</span></footer>'+
 v437ProductDetail(team,logo,roster)+
 '<div class="v431-drawer" data-v431-drawer><div class="v431-drawer-card"><div class="v431-drawer-head"><b>Tu carrito</b><button type="button" data-v431-cart-close>×</button></div><div data-v431-cart-list></div><button type="button" class="v431-clear" data-v431-clear>Vaciar carrito</button></div></div><div class="v431-toast" data-v431-toast></div></section>';
}
function ensureStyle(){if(document.getElementById("v431-store-style"))return;var s=document.createElement("style");s.id="v431-store-style";s.textContent=CSS;document.head.appendChild(s)}
function syncCart(){
 var count=document.querySelector("[data-v431-cart-count]");if(count)count.textContent=String(readCart().length);
 var list=document.querySelector("[data-v431-cart-list]");if(!list)return;var a=readCart();
 list.innerHTML=a.length?a.map(function(x,i){return '<div class="v431-cart-row"><span><b>'+esc(x.item)+'</b><small>'+esc(x.team)+(x.detail?" · "+esc(x.detail):"")+'</small></span><button type="button" data-v431-remove="'+i+'">Quitar</button></div>'}).join(""):'<div class="v431-empty">Tu carrito está vacío.</div>';
 list.querySelectorAll("[data-v431-remove]").forEach(function(b){b.onclick=function(){var x=readCart();x.splice(Number(b.dataset.v431Remove),1);writeCart(x);syncCart()}});
}
function toast(msg){var t=document.querySelector("[data-v431-toast]");if(!t)return;t.textContent=msg;t.classList.add("show");clearTimeout(t._v431);t._v431=setTimeout(function(){t.classList.remove("show")},1300)}
function addItem(team,item,detail){var a=readCart();a.push({team:team,item:item,detail:detail||""});writeCart(a);syncCart();toast("Añadido al carrito")}
function bind(team){
 var root=document.querySelector("[data-v431-store]");if(!root)return;
 initV4443D(root);
 mountStore3D(root,team);
 root.querySelectorAll("[data-v442-tilt]").forEach(function(el){
   var reset=function(){el.style.setProperty("--v442-rx","-3deg");el.style.setProperty("--v442-ry","7deg");el.style.setProperty("--v442-z","0px")};
   reset();
   el.addEventListener("pointermove",function(e){
     if(e.pointerType==="touch")return;
     var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/Math.max(1,r.width),py=(e.clientY-r.top)/Math.max(1,r.height);
     el.style.setProperty("--v442-ry",((px-.5)*18).toFixed(2)+"deg");
     el.style.setProperty("--v442-rx",((.5-py)*12).toFixed(2)+"deg");
     el.style.setProperty("--v442-z","8px");
   });
   el.addEventListener("pointerleave",reset);
   el.addEventListener("pointerdown",function(){el.classList.add("pressed3d")});
   el.addEventListener("pointerup",function(){el.classList.remove("pressed3d")});
   el.addEventListener("pointercancel",function(){el.classList.remove("pressed3d")});
 });
 var wish=root.querySelector("[data-v435-wishlist]");if(wish)wish.onclick=function(){wish.classList.toggle("active");toast(wish.classList.contains("active")?"Equipo añadido a favoritos":"Equipo quitado de favoritos")};
 var storeMenu=root.querySelector("[data-v439-menu]"),menuToggle=root.querySelector("[data-v439-menu-toggle]");
 function closeV439Menu(){if(storeMenu){storeMenu.classList.remove("open");storeMenu.querySelectorAll("[data-v439-panel]").forEach(function(p){p.classList.remove("active")});var m=storeMenu.querySelector("[data-v439-menu-main]");if(m)m.classList.remove("hidden")}if(menuToggle)menuToggle.classList.remove("open")}
 function openV439Panel(name){if(!storeMenu)return;var main=storeMenu.querySelector("[data-v439-menu-main]");if(main)main.classList.add("hidden");storeMenu.querySelectorAll("[data-v439-panel]").forEach(function(p){p.classList.toggle("active",p.dataset.v439Panel===name)})}
 if(menuToggle)menuToggle.onclick=function(){var on=storeMenu&&!storeMenu.classList.contains("open");closeV439Menu();if(on&&storeMenu){storeMenu.classList.add("open");menuToggle.classList.add("open")}};
 var menuClose=root.querySelector("[data-v439-menu-close]");if(menuClose)menuClose.onclick=closeV439Menu;
 root.querySelectorAll("[data-v439-submenu]").forEach(function(b){b.onclick=function(){openV439Panel(b.dataset.v439Submenu)}});
 root.querySelectorAll("[data-v439-sub-back]").forEach(function(b){b.onclick=function(){if(!storeMenu)return;storeMenu.querySelectorAll("[data-v439-panel]").forEach(function(p){p.classList.remove("active")});var m=storeMenu.querySelector("[data-v439-menu-main]");if(m)m.classList.remove("hidden")}});
 root.querySelectorAll("[data-v439-toast]").forEach(function(b){b.onclick=function(){toast(b.dataset.v439Toast+" · próximamente")}});
 root.querySelectorAll("[data-v439-player]").forEach(function(b){b.onclick=function(){closeV439Menu();var n=root.querySelector("[data-v431-name]");if(n)n.value=b.dataset.v439Player||"";var el=document.getElementById("personaliza");if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}});
 root.querySelectorAll("[data-v439-go]").forEach(function(b){b.onclick=function(){
   var go=b.dataset.v439Go||"";closeV439Menu();
   if(go==="training"){setV436View("training");return}
   if(go==="kits"||go==="homekit"||go==="awaykit"||go==="thirdkit"){setV436View("kits");return}
   if(go==="new"||go==="sale"){setV436View("new");return}
   if(go==="players"){var el=document.getElementById("jugadores");if(el)el.scrollIntoView({behavior:"smooth",block:"start"});return}
 }});
 function setV436View(view){
   var category=view&&view!=="home";
   root.classList.toggle("v436-category-mode",!!category);
   root.dataset.v436View=category?view:"home";
   root.querySelectorAll("[data-v436-category]").forEach(function(v){v.classList.toggle("active",v.dataset.v436Category===view)});
   root.querySelectorAll("[data-v436-view]").forEach(function(b){b.classList.toggle("active",b.dataset.v436View===view)});
   try{window.scrollTo({top:0,left:0,behavior:"instant"})}catch(_){window.scrollTo(0,0)}
 }
 root.querySelectorAll("[data-v436-view]").forEach(function(b){b.onclick=function(){setV436View(b.dataset.v436View||"home")}});
 var closeCategory=root.querySelector("[data-v436-close]");if(closeCategory)closeCategory.onclick=function(){setV436View("home")};
 root.querySelectorAll("[data-v436-chip]").forEach(function(b){b.onclick=function(){var rail=b.parentElement;if(rail)rail.querySelectorAll("[data-v436-chip]").forEach(function(x){x.classList.toggle("active",x===b)})}});
 root.querySelectorAll("[data-v436-sort]").forEach(function(b){b.onclick=function(){var s=b.querySelector("span");if(s)s.textContent=s.textContent==="Recomendados"?"Más recientes":"Recomendados"}});
 root.querySelectorAll("[data-v436-filter-toggle]").forEach(function(b){b.onclick=function(){var v=b.closest("[data-v436-category]");if(v)v.classList.toggle("v436-filter-open");toast(v&&v.classList.contains("v436-filter-open")?"Filtros visibles":"Filtros ocultos")}});
 root.querySelectorAll("[data-v436-add]").forEach(function(b){b.onclick=function(e){e&&e.stopPropagation();addItem(team,b.dataset.v436Add,"Catálogo del equipo")}});
 var detail=root.querySelector("[data-v437-product-detail]"),detailVariant="home",detailTitle="Primera equipación",detailPrice="Mex$1,300.00",detailSize="CH",detailBadge="Sin parche",detailPlayer="";
 function renderDetailProduct(){
   if(!detail)return;
   var stage=detail.querySelector("[data-v437-stage-shirt]");
   if(stage)stage.innerHTML=shirt(logo,detailVariant,"","","");
   var title=detail.querySelector("[data-v437-product-title]"),price=detail.querySelector("[data-v437-product-price]"),member=detail.querySelector("[data-v437-member-price]");
   if(title)title.textContent=detailTitle+" "+team;
   if(price)price.textContent=detailPrice;
   if(member){
     var raw=Number(String(detailPrice).replace(/[^0-9.]/g,""))||1300;
     member.textContent="Mex$"+Math.round(raw*.85).toLocaleString("es-MX")+".00";
   }
   detail.querySelectorAll("[data-v437-variant]").forEach(function(b){b.classList.toggle("active",b.dataset.v437Variant===detailVariant)});
 }
 function openDetail(source){
   detailVariant=source&&source.dataset.v437OpenProduct||"home";
   detailTitle=source&&source.dataset.v437Title||({home:"Primera equipación",away:"Segunda equipación",third:"Tercera equipación",training:"Entrenamiento",keeper:"Portero",special:"Edición especial"}[detailVariant]||"Equipación");
   detailPrice=source&&source.dataset.v437Price||"Mex$1,300.00";
   root.classList.remove("v436-category-mode");
   root.classList.add("v437-detail-mode");
   renderDetailProduct();
   try{window.scrollTo({top:0,left:0,behavior:"instant"})}catch(_){window.scrollTo(0,0)}
 }
 root.querySelectorAll("[data-v437-open-product]").forEach(function(el){
   el.onclick=function(e){
     if(e&&e.target&&e.target.closest&&e.target.closest("[data-v436-add],[data-v431-heart]"))return;
     e&&e.preventDefault();e&&e.stopPropagation();openDetail(el);
   };
 });
 if(detail){
   detail.querySelector("[data-v437-detail-back]").onclick=function(){root.classList.remove("v437-detail-mode");setV436View("kits")};
   detail.querySelectorAll("[data-v437-variant]").forEach(function(b){b.onclick=function(){detailVariant=b.dataset.v437Variant||"home";detailTitle=detailVariant==="home"?"Primera equipación":detailVariant==="away"?"Segunda equipación":"Tercera equipación";renderDetailProduct()}});
   detail.querySelectorAll("[data-v437-size]").forEach(function(b){b.onclick=function(){detailSize=b.dataset.v437Size;detail.querySelectorAll("[data-v437-size]").forEach(function(x){x.classList.toggle("active",x===b)})}});
   detail.querySelectorAll("[data-v437-badge]").forEach(function(b){b.onclick=function(){detailBadge=b.dataset.v437Badge;detail.querySelectorAll("[data-v437-badge]").forEach(function(x){x.classList.toggle("active",x===b)})}});
   var picker=detail.querySelector("[data-v437-player-picker]");
   detail.querySelector("[data-v437-player-open]").onclick=function(){if(picker)picker.classList.add("open")};
   detail.querySelector("[data-v437-player-close]").onclick=function(){if(picker)picker.classList.remove("open")};
   detail.querySelectorAll("[data-v437-player-option]").forEach(function(b){b.onclick=function(){detailPlayer=b.dataset.v437PlayerOption||"";var out=detail.querySelector("[data-v437-selected-player]");if(out)out.textContent=detailPlayer?"Jugador: "+detailPlayer:"";if(picker)picker.classList.remove("open")}});
   detail.querySelector("[data-v437-size-guide]").onclick=function(){toast("CH · M · G · XG")};
   detail.querySelector("[data-v437-add-detail]").onclick=function(){addItem(team,detailTitle,detailVariant+" · Talla "+detailSize+" · "+detailBadge+(detailPlayer?" · "+detailPlayer:""))};
 }
 root.querySelector("[data-v431-back]").onclick=function(){try{root.__v915StoreViewer?.destroy?.()}catch(_){}sessionStorage.removeItem(OPEN_KEY);sessionStorage.removeItem(TEAM_KEY);sessionStorage.removeItem(CAT_KEY);var s=document.querySelector("#screen");if(s)s.innerHTML="";window.dispatchEvent(new Event("hashchange"))};
 root.querySelectorAll("[data-v431-jump]").forEach(function(b){b.onclick=function(){var el=document.getElementById(b.dataset.v431Jump);if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}});
 var panel=root.querySelector("[data-v431-search-panel]"),input=root.querySelector("[data-v431-search]");
 root.querySelector("[data-v431-search-toggle]").onclick=function(){panel.classList.toggle("open");if(panel.classList.contains("open"))setTimeout(function(){if(input)input.focus()},50)};
 root.querySelector("[data-v431-search-close]").onclick=function(){panel.classList.remove("open");if(input){input.value="";input.dispatchEvent(new Event("input"))}};
 if(input)input.oninput=function(){var q=norm(input.value);root.querySelectorAll("[data-v431-product]").forEach(function(p){p.classList.toggle("v431-no-match",!!q&&!norm(p.dataset.search).includes(q))})};
 root.querySelectorAll("[data-v431-heart]").forEach(function(b){b.onclick=function(e){e&&e.preventDefault();e&&e.stopPropagation();b.classList.toggle("active");b.textContent=b.classList.contains("active")?"♥":"♡"}});
 root.querySelectorAll("[data-v431-add]").forEach(function(b){b.onclick=function(e){e&&e.preventDefault();e&&e.stopPropagation();addItem(team,b.dataset.v431Add,"Catálogo del equipo")}});
 var nameInput=root.querySelector("[data-v431-name]"),numberInput=root.querySelector("[data-v431-number]");
 function preview(){
   var name=(nameInput.value||"TU NOMBRE").toUpperCase(),number=(numberInput.value||"10").replace(/\D/g,"").slice(0,2);
   var n=root.querySelector(".v431-custom-preview .v431-shirt-name"),num=root.querySelector(".v431-custom-preview .v431-shirt-number");
   if(n)n.textContent=name;if(num)num.textContent=number;
   var host=root.querySelector("[data-v915-store-shirt-3d]");
   if(host)window.LJR_FOOTBALL_SHIRT_3D?.update?.(host,{name:name,number:number});
 }
 nameInput.oninput=preview;numberInput.oninput=function(){numberInput.value=numberInput.value.replace(/\D/g,"").slice(0,2);preview()};
 root.querySelector("[data-v431-add-custom]").onclick=function(){var name=(nameInput.value||"").trim()||"Sin nombre",num=(numberInput.value||"").trim()||"--",size=root.querySelector("[data-v431-size]").value;addItem(team,"Camiseta personalizada",name+" · #"+num+" · Talla "+size)};
 root.querySelectorAll("[data-v431-player]").forEach(function(b){b.onclick=function(){nameInput.value=b.dataset.v431Player||"";preview();document.getElementById("personaliza").scrollIntoView({behavior:"smooth",block:"start"})}});
 root.querySelectorAll("[data-v431-filter]").forEach(function(b){b.onclick=function(){var q=b.dataset.v431Filter,hit=[].slice.call(root.querySelectorAll("[data-v431-product]")).find(function(p){return norm(p.dataset.search).includes(norm(q))});if(hit)hit.scrollIntoView({behavior:"smooth",block:"center"})}});
 var drawer=root.querySelector("[data-v431-drawer]");root.querySelector("[data-v431-cart-toggle]").onclick=function(){drawer.classList.add("open");syncCart()};root.querySelector("[data-v431-cart-close]").onclick=function(){drawer.classList.remove("open")};drawer.onclick=function(e){if(e.target===drawer)drawer.classList.remove("open")};
 root.querySelector("[data-v431-clear]").onclick=function(){writeCart([]);syncCart();toast("Carrito vacío")};syncCart();
}
async function renderStore(team,cat){
 if(route()!=="club-store"||!team)return;
 var activeCheck=window.LJR_V812_IS_ACTIVE_STORE_TEAM;
 if(typeof activeCheck==="function"&&!activeCheck(team)){
   sessionStorage.removeItem(OPEN_KEY);sessionStorage.removeItem(TEAM_KEY);sessionStorage.removeItem(CAT_KEY);return;
 }
 ensureStyle();await load();var screen=document.querySelector("#screen");if(!screen||route()!=="club-store")return;
 var logo=storeTeamLogo(team)||logoFor(team),roster=rosterFor(team,cat);document.body.dataset.appRoute="club-store";
 var oldStore=screen.querySelector("[data-v431-store]");try{oldStore?.__v915StoreViewer?.destroy?.()}catch(_){}
 screen.innerHTML=markup(team,cat,roster,logo);bind(team);
 try{screen.scrollTop=0;window.scrollTo({top:0,left:0,behavior:"instant"})}catch(_){window.scrollTo(0,0)}
}
function openFromButton(b,e){
 if(route()!=="club-store"||!b)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 var team=b.dataset.v66OpenTeam||"",cat=b.dataset.v66CatId||"3";if(!team)return;
 sessionStorage.setItem(OPEN_KEY,"1");sessionStorage.setItem(TEAM_KEY,team);sessionStorage.setItem(CAT_KEY,cat);renderStore(team,cat);
}
document.addEventListener("click",function(e){var b=e.target&&e.target.closest&&e.target.closest("[data-v66-open-team]");if(b&&route()==="club-store")openFromButton(b,e)},true);
function schedule(){
 if(route()!=="club-store"){sessionStorage.removeItem(OPEN_KEY);return}
 if(sessionStorage.getItem(OPEN_KEY)!=="1")return;var team=sessionStorage.getItem(TEAM_KEY)||"",cat=sessionStorage.getItem(CAT_KEY)||"3";if(!team)return;
 requestAnimationFrame(function(){if(!document.querySelector("[data-v431-store]"))renderStore(team,cat)});
}
window.LJR_V431_STORE_API={open:function(team,cat){
 if(!team)return false;
 sessionStorage.setItem(OPEN_KEY,"1");sessionStorage.setItem(TEAM_KEY,team);sessionStorage.setItem(CAT_KEY,String(cat||"3"));
 renderStore(team,String(cat||"3"));return true;
}};
window.addEventListener("hashchange",schedule);window.addEventListener("pageshow",schedule);
var screen=document.querySelector("#screen");if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});schedule();
})();

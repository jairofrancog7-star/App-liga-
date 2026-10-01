/* V66 — Directorio oficial AdminFut: plantillas/tienda y datos auxiliares.
   #/teams queda bajo V27 + V62 para evitar dos renderizados consecutivos y conservar una sola pantalla estable. */
(function(){
'use strict';
const LOCAL='./data/official-live.json?v=20261001-v491-v35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v491-v35-all-pages';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const CAT_ORDER=['3','5','4','2','1'];
const CAT_LABEL={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
let db=null, loading=null, teamQuery='', playerQuery='', playerCat=localStorage.getItem('v66-player-cat')||'all', playerTeam=localStorage.getItem('v66-player-team')||'all';

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
async function load(){
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
  const add=(name,id)=>{
    name=String(name||'').trim(); if(!name)return;
    if(seen.some(x=>same(x,name)))return;
    seen.push(name); out.push({name,cat:String(id),category:db?.categories?.[String(id)]?.name||CAT_LABEL[String(id)]||'Liga Municipal'});
  };
  for(const id of CAT_ORDER){
    const c=db?.categories?.[id]; if(!c)continue;
    Object.keys(c.rosters||{}).forEach(n=>add(n,id));
    ((c.standings||[])[0]?.rows||[]).forEach(r=>add(r[1],id));
    ((c.fixtures||[])[0]?.rows||[]).forEach(r=>{add(r[2],id);add(r[6],id)});
    ((c.scorers||[])[0]?.rows||[]).forEach(r=>add(r[2],id));
  }
  return out;
}
function rosterFor(teamName,catId){
  const c=db?.categories?.[String(catId)]; if(!c)return [];
  const k=Object.keys(c.rosters||{}).find(n=>same(n,teamName));
  return k&&Array.isArray(c.rosters[k])?c.rosters[k].map(String):[];
}
function playerList(){
  const out=[],seen=new Set();
  for(const id of CAT_ORDER){
    const c=db?.categories?.[id]; if(!c)continue;
    for(const [team,names] of Object.entries(c.rosters||{})){
      for(const raw of (Array.isArray(names)?names:[])){
        const name=String(raw||'').trim(); if(!name)continue;
        const key=norm(name)+'|'+norm(team)+'|'+id; if(seen.has(key))continue; seen.add(key);
        out.push({name,team,cat:id,category:c.name||CAT_LABEL[id]||id});
      }
    }
  }
  return out;
}
function fallback(name){
  return String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()||'⚽';
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
function teamMarkup(store=false){
  const q=norm(teamQuery);
  const list=teamList().filter(t=>!q||norm(t.name).includes(q)||norm(t.category).includes(q));
  return '<section class="v66-directory" data-v66-directory="'+(store?'store':'teams')+'">'+
    (store?'<header class="v510-store-head"><button type="button" data-v447-store-back aria-label="Volver"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button><span class="v510-store-crest" aria-hidden="true"></span><button type="button" data-route="profile" class="v510-store-profile" aria-label="Perfil"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5.5 19c.7-3.4 3-5.5 6.5-5.5s5.8 2.1 6.5 5.5"/></svg></button></header>':'')+
    '<div class="v66-search"><span>⌕</span><input data-v66-team-search type="search" autocomplete="off" placeholder="Buscar equipo registrado" value="'+esc(teamQuery)+'"></div>'+
    '<p class="v66-source-note">'+list.length+' equipos registrados · datos oficiales sincronizados</p>'+
    '<div class="v66-team-grid">'+list.map(t=>'<button type="button" class="v66-team-card" data-v66-open-team="'+esc(t.name)+'" data-v66-cat-id="'+esc(t.cat)+'">'+teamLogo(t)+'<span><b>'+esc(t.name)+'</b><small>'+esc(t.category)+(store?' · Tienda':'')+'</small></span><i>›</i></button>').join('')+'</div>'+
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
    '<div class="v66-filter-title">ORDENAR JUGADORES</div>'+
    '<div class="v66-filter-label">CATEGORÍA</div>'+
    categoryRail(playerCat,'data-v66-player-cat')+
    playerTeamRail()+
    '<div class="v66-search"><span>⌕</span><input data-v66-player-search type="search" autocomplete="off" placeholder="Buscar jugador por nombre" value="'+esc(playerQuery)+'"></div>'+
    '<p class="v66-source-note">'+list.length+' jugadores registrados'+(playerCat==='all'?'':' · '+esc(CAT_LABEL[playerCat]||''))+(playerTeam==='all'?'':' · '+esc(playerTeam))+'</p>'+
    '<div class="v66-player-list">'+list.map((p,i)=>'<button type="button" class="v66-player-row" data-v66-player="'+esc(p.name)+'" data-v66-player-team="'+esc(p.team)+'" data-v66-cat-id="'+esc(p.cat)+'"><span class="v66-player-avatar">'+esc(fallback(p.name).slice(0,2))+'</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span><i>›</i></button>').join('')+'</div>'+
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
    const inStore=route()==='club-store'||!!b.closest('[data-v66-directory="store"]');
    if(inStore){
      e?.preventDefault?.();e?.stopPropagation?.();e?.stopImmediatePropagation?.();
      try{localStorage.removeItem('v42-open-compare')}catch(_){}
      if(window.LJR_V431_STORE_API?.open){window.LJR_V431_STORE_API.open(name,cat);return}
      try{sessionStorage.setItem('v431-store-open','1');sessionStorage.setItem('v431-store-team',name);sessionStorage.setItem('v431-store-cat',String(cat||'3'))}catch(_){}
      return;
    }
    saveTeam(name,cat);
    try{if(window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(name);return}}catch(e){}
    location.hash='#/teamDetail';
  });
  document.querySelectorAll('[data-v66-player]').forEach(b=>b.onclick=e=>{
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const player={
      name:b.dataset.v66Player||'',
      team:b.dataset.v66PlayerTeam||'',
      cat:b.dataset.v66CatId||''
    };
    try{
      localStorage.setItem('v123-compare-player',JSON.stringify(player));
      localStorage.removeItem('v123-compare-player-2');
    }catch(_){}
    if(window.LJR_PLAYER_COMPARE_API?.open){
      window.LJR_PLAYER_COMPARE_API.open(player);
      return;
    }
    location.hash='#/playerCompare';
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
if(screen)new MutationObserver(()=>{if(['players','club-store'].includes(route())&&!screen.querySelector('[data-v66-directory]'))schedule()}).observe(screen,{childList:true,subtree:false});
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
    preview.innerHTML=roster.slice(0,3).map((n,i)=>'<button type="button" data-v42-player="'+esc(n)+'" data-v66-roster-player="'+esc(n)+'" data-v66-player-team="'+esc(t.name)+'" data-v66-cat-id="'+esc(t.cat)+'"><span class="v42-avatar large v66-roster-avatar">'+esc(fallback(n).slice(0,2))+'</span><strong>'+esc(n)+'</strong><small>'+esc(t.name)+' · Jugador registrado</small></button>').join('');
  }
  const squad=page.querySelector('.v42-squad');
  if(squad&&roster.length){
    squad.innerHTML='<section class="v42-roster-card v66-official-roster"><h2>Jugadores registrados · '+roster.length+'</h2><div class="v42-roster-list">'+
      roster.map(n=>'<button type="button" class="v42-player-row" data-v42-player="'+esc(n)+'" data-v66-roster-player="'+esc(n)+'" data-v66-player-team="'+esc(t.name)+'" data-v66-cat-id="'+esc(t.cat)+'"><span class="v42-avatar v66-roster-avatar">'+esc(fallback(n).slice(0,2))+'</span><span class="v42-player-copy"><strong>'+esc(n)+'</strong><small>'+esc(t.name)+' · Jugador registrado</small></span><b class="v42-number">›</b></button>').join('')+
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
function cedulasMarkup(){
  const rows=fixtureRows();
  return '<section class="v66-directory v66-cedulas-official" data-v66-directory="cedulas">'+
    '<div class="v66-cedula-headline"><b>Cédulas oficiales</b><small>'+rows.length+' partidos sincronizados</small></div>'+
    '<button type="button" class="v66-primary-action" data-route="cedulaBuilder" data-v66-generate-cedula>Generar cédula</button>'+
    '<div class="v66-player-list">'+rows.map(r=>'<button type="button" class="v66-player-row v66-fixture-row" data-v66-cedula-home="'+esc(r.home)+'" data-v66-cedula-away="'+esc(r.away)+'" data-v66-cedula-cat="'+esc(r.category)+'" data-v66-cedula-date="'+esc(r.date)+'" data-v66-cedula-field="'+esc(r.field)+'" data-v66-cedula-round="'+esc(r.round||'')+'">'+
      '<span class="v66-player-avatar">J'+esc(r.round||'—')+'</span><span><b>'+esc(r.home)+' vs '+esc(r.away)+'</b><small>'+esc(r.category)+' · '+esc(r.date)+' · '+esc(r.field)+'</small></span><i>›</i></button>').join('')+'</div>'+
  '</section>';
}
function bindCedulas(){
  const generate=document.querySelector('[data-v66-generate-cedula]');
  if(generate)generate.onclick=e=>{
    e?.preventDefault?.();
    e?.stopPropagation?.();
    /* Botón general: abre el generador limpio. Los partidos de la lista
       siguen abriendo el mismo generador, pero prellenado con sus datos. */
    ['v66-cedula-home','v66-cedula-away','v66-cedula-cat','v66-cedula-date','v66-cedula-field','v66-cedula-round','v66-cedula-source'].forEach(k=>localStorage.removeItem(k));
    location.hash='#/cedulaBuilder';
  };

  document.querySelectorAll('[data-v66-cedula-home]').forEach(b=>b.onclick=e=>openOfficialCedula(b,e));
}
function openOfficialCedula(b,e){
  if(!b)return;
  e?.preventDefault?.();
  e?.stopPropagation?.();
  localStorage.setItem('v66-cedula-home',b.dataset.v66CedulaHome||'');
  localStorage.setItem('v66-cedula-away',b.dataset.v66CedulaAway||'');
  localStorage.setItem('v66-cedula-cat',b.dataset.v66CedulaCat||'');
  localStorage.setItem('v66-cedula-date',b.dataset.v66CedulaDate||'');
  localStorage.setItem('v66-cedula-field',b.dataset.v66CedulaField||'');
  localStorage.setItem('v66-cedula-round',b.dataset.v66CedulaRound||'');
  localStorage.setItem('v66-cedula-source','official-directory');
  location.hash='#/cedulaDetail';
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
    if(!screen.querySelector('[data-v66-directory="cedulas"]')){screen.innerHTML=cedulasMarkup();bindCedulas()}
  }
}
function extraSchedule(){requestAnimationFrame(()=>requestAnimationFrame(renderExtras))}
window.addEventListener('hashchange',extraSchedule);
const extraScreen=document.querySelector('#screen');
if(extraScreen)new MutationObserver(()=>{if(['scorers','teamDetail','cedulas'].includes(route()))extraSchedule()}).observe(extraScreen,{childList:true,subtree:false});
extraSchedule();

window.V66_OFFICIAL_DIRECTORY={load,teamList,playerList,rosterFor,logoFor,officialScorers,fixtureRows,data:()=>db};
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
 var v=variant||"home",p=shirtPalette(v),id="v441shirt"+(++V441_SHIRT_SEQ);
 return '<div class="v431-shirt v440-shirt v441-shirt v442-shirt-3d v443-shirt-webgl '+esc(v)+'" data-v442-tilt data-v443-variant="'+esc(v)+'" data-v443-logo="'+esc(logo||"")+'">'+
  '<img class="v443-3d-render" alt="" aria-hidden="true">'+
  '<svg class="v441-jersey-svg" viewBox="0 0 220 260" role="img" aria-label="Camiseta">'+
   '<defs>'+
    '<linearGradient id="'+id+'g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="'+p.a+'"/><stop offset=".48" stop-color="'+p.b+'"/><stop offset="1" stop-color="'+p.c+'"/></linearGradient>'+
    '<linearGradient id="'+id+'shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".34" stop-color="#fff" stop-opacity=".03"/><stop offset=".72" stop-color="#000" stop-opacity=".10"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>'+
    '<pattern id="'+id+'mesh" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 0h1v1H0zM3 2h1v1H3z" fill="#fff" opacity=".09"/></pattern>'+
    '<filter id="'+id+'shadow" x="-40%" y="-40%" width="180%" height="210%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#06103f" flood-opacity=".34"/></filter>'+
    '<filter id="'+id+'surface" x="-20%" y="-20%" width="140%" height="140%">'+
      '<feTurbulence type="fractalNoise" baseFrequency=".018 .12" numOctaves="2" seed="7" result="noise"/>'+
      '<feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7" xChannelSelector="R" yChannelSelector="G" result="warp"/>'+
      '<feSpecularLighting in="noise" surfaceScale="2.4" specularConstant=".55" specularExponent="18" lighting-color="#ffffff" result="spec"><feDistantLight azimuth="225" elevation="48"/></feSpecularLighting>'+
      '<feComposite in="spec" in2="SourceGraphic" operator="in" result="lit"/>'+
      '<feBlend in="warp" in2="lit" mode="screen"/>'+
    '</filter>'+
   '</defs>'+
   '<g class="v442-depth-back" opacity=".72">'+
    '<path d="M66 29 90 16c8 9 15 13 24 13s16-4 24-13l24 13 41 20-19 49-28-13v158H72V85L44 98 25 49l41-20Z" fill="'+p.c+'"/>'+
   '</g>'+
   '<g class="v442-jersey-face" filter="url(#'+id+'shadow)">'+
    '<g filter="url(#'+id+'surface)">'+
     '<path d="M62 25 86 12c8 9 15 13 24 13s16-4 24-13l24 13 41 20-19 49-28-13v158H68V81L40 94 21 45l41-20Z" fill="url(#'+id+'g)"/>'+
     '<path d="M62 25 86 12c8 9 15 13 24 13s16-4 24-13l24 13 41 20-19 49-28-13v158H68V81L40 94 21 45l41-20Z" fill="url(#'+id+'shine)"/>'+
     '<path d="M62 25 86 12c8 9 15 13 24 13s16-4 24-13l24 13 41 20-19 49-28-13v158H68V81L40 94 21 45l41-20Z" fill="url(#'+id+'mesh)"/>'+
    '</g>'+
    '<path d="M87 12c3 16 12 24 23 24s20-8 23-24" fill="none" stroke="'+p.edge+'" stroke-width="6" stroke-linecap="round"/>'+
    '<path d="M87 12c4 10 12 16 23 16s19-6 23-16" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="2"/>'+
    '<path d="M68 81 55 70M152 81l13-11" stroke="'+p.edge+'" stroke-opacity=".75" stroke-width="3"/>'+
    '<path d="M70 231h80" stroke="#fff" stroke-opacity=".26" stroke-width="2"/>'+
    '<path d="M71 55c18 8 60 8 78 0" stroke="#fff" stroke-opacity=".08" stroke-width="18" stroke-linecap="round"/>'+
    '<path d="M72 77c11 12 17 30 19 54M148 77c-11 12-17 30-19 54M86 157c8 10 40 10 48 0M81 190c12 8 46 8 58 0" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2" stroke-linecap="round"/>'+
   '</g>'+
   (logo?'<image href="'+esc(logo)+'" x="96" y="66" width="28" height="28" preserveAspectRatio="xMidYMid meet"/>':'')+
   '<text x="110" y="119" text-anchor="middle" fill="'+p.ink+'" font-size="9" font-family="Arial, sans-serif" font-weight="700" letter-spacing="1.3">'+esc(name||"")+'</text>'+
   '<text x="110" y="151" text-anchor="middle" fill="'+p.ink+'" font-size="34" font-family="Arial, sans-serif" font-weight="800">'+esc(number||"")+'</text>'+
   '<text x="110" y="214" text-anchor="middle" fill="'+p.ink+'" font-size="8" font-family="Arial, sans-serif" font-weight="700" letter-spacing="1">'+esc(label||"")+'</text>'+
  '</svg>'+
  '<i class="v442-edge v442-edge-left"></i><i class="v442-edge v442-edge-right"></i>'+
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
function playerCards(roster){
 if(!roster.length)return '<div class="v431-empty">La plantilla de este equipo todavía no tiene jugadores sincronizados para esta sección.</div>';
 return '<div class="v431-player-rail">'+roster.slice(0,12).map(function(n){return '<button type="button" class="v431-player-card" data-v431-player="'+esc(n)+'"><span>'+esc(initials(n)||"JR")+'</span><b>'+esc(n)+'</b><small>Edición jugador</small></button>'}).join("")+'</div>';
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
 '<header class="v431-store-head v435-store-head"><button type="button" class="v439-menu-toggle" data-v439-menu-toggle aria-label="Menú"><span></span><span></span><span></span></button><button type="button" class="v431-back v435-back" data-v431-back aria-label="Volver"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>'+crest(team,logo,"v431-head-crest")+'<div class="v431-head-copy v435-store-title"><b>'+esc(team)+' <span>Store</span></b></div><div class="v435-head-actions"><button type="button" class="v431-head-icon v435-icon" data-v431-search-toggle aria-label="Buscar"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.4"/><path d="m15.3 15.3 5 5"/></svg></button><button type="button" class="v431-head-icon v435-icon v435-wishlist" data-v435-wishlist aria-label="Favoritos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2 4.4 13C.7 9.5 2.2 4 6.7 4c2.3 0 4 1.3 5.3 3 1.3-1.7 3-3 5.3-3 4.5 0 6 5.5 2.3 9L12 20.2Z"/></svg></button><button type="button" class="v431-head-icon v431-cart-button v435-icon" data-v431-cart-toggle aria-label="Carrito"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.1 12H6.1L5 7Z"/><path d="M9 7V5.8A3 3 0 0 1 12 3a3 3 0 0 1 3 2.8V7"/></svg><em data-v431-cart-count>0</em></button></div></header>'+
 '<div class="v431-search-panel v435-search-panel" data-v431-search-panel><span>⌕</span><input type="search" data-v431-search placeholder="Buscar en '+esc(team)+' Store"><button type="button" data-v431-search-close>×</button></div>'+
 v439StoreMenu(team,logo,roster)+
 '<nav class="v431-shop-tabs v435-shop-tabs"><button type="button" class="v436-close" data-v436-close aria-label="Cerrar categoría">×</button><button class="active" data-v436-view="home">Para ti</button><button data-v436-view="new">Novedades</button><button data-v436-view="kits">Equipaciones</button><button data-v436-view="training">Entrenamiento</button><button data-v431-jump="jugadores">Jugadores</button></nav>'+
 v436CategoryPanel(team,logo)+
 '<section class="v431-hero" id="novedades"><div class="v431-hero-copy"><small>COLECCIÓN '+esc(team.toUpperCase())+'</small><h1>La tienda del equipo, dentro de tu Liga</h1><p>Equipaciones, personalización y colección del club en un solo diseño.</p><button type="button" data-v431-jump="equipaciones">VER COLECCIÓN</button></div><div class="v431-hero-shirt">'+shirt(logo,"home","","","")+'</div></section>'+
 v437FeaturedKits(team,logo)+
 '<section class="v431-block v431-player-edition"><div class="v431-section-title"><div><small>EDICIÓN JUGADOR</small><h2>'+esc(first)+'</h2></div><button data-v431-jump="jugadores">Ver jugadores ›</button></div><div class="v431-edition-card"><div class="v431-edition-art">'+shirt(logo,"special","","","")+'</div><div><small>DISEÑO DEL CLUB</small><h3>Edición jugador</h3><p>Elige un jugador de la plantilla y prepara su versión personalizada.</p><button type="button" data-v431-jump="personaliza">Personalizar</button></div></div></section>'+
 '<section class="v431-block" id="equipaciones"><div class="v431-section-title"><div><small>EN TENDENCIA</small><h2>Equipaciones</h2></div><button type="button" data-v431-jump="colecciones">Ver todo</button></div><div class="v431-products">'+productCard("Primera equipación",team+" · Local","home",logo)+productCard("Segunda equipación",team+" · Visitante","away",logo)+productCard("Tercera equipación",team+" · Alternativa","third",logo)+'</div></section>'+
 '<section class="v431-block v431-custom" id="personaliza"><div class="v431-section-title"><div><small>HAZLA TUYA</small><h2>Personaliza tu camiseta</h2></div></div><div class="v431-custom-grid"><div class="v431-custom-preview">'+shirt(logo,"home","",10,"TU NOMBRE")+'</div><div class="v431-custom-form"><label>Nombre<input data-v431-name maxlength="14" value="TU NOMBRE" autocomplete="off"></label><label>Número<input data-v431-number inputmode="numeric" maxlength="2" value="10"></label><label>Talla<select data-v431-size><option>CH</option><option selected>M</option><option>G</option><option>XG</option></select></label><button type="button" class="v431-primary" data-v431-add-custom>AGREGAR PERSONALIZADA</button></div></div></section>'+
 '<section class="v431-story"><div class="v431-story-art">'+crest(team,logo,"v431-story-crest")+'</div><div><small>LA CAMISETA QUE NOS UNE</small><h2>'+esc(team)+'</h2><p>Una colección visual inspirada en el club y adaptada al estilo azul de la Liga.</p><button type="button" data-v431-jump="colecciones">EXPLORAR</button></div></section>'+
 '<section class="v431-block" id="colecciones"><div class="v431-section-title"><div><small>COMPRA POR COLECCIÓN</small><h2>Colecciones</h2></div></div><div class="v431-collection-rail"><button data-v431-filter="Primera"><div>'+shirt(logo,"home","","","")+'</div><b>Local</b><small>Primera equipación</small></button><button data-v431-filter="Segunda"><div>'+shirt(logo,"away","","","")+'</div><b>Visitante</b><small>Segunda equipación</small></button><button data-v431-filter="Tercera"><div>'+shirt(logo,"third","","","")+'</div><b>Alternativa</b><small>Tercera equipación</small></button><button data-v431-filter="Entrenamiento"><div>'+shirt(logo,"training","","","")+'</div><b>Entrenamiento</b><small>Colección training</small></button></div></section>'+
 '<section class="v431-block v431-training"><div class="v431-section-title"><div><small>EQUIPACIÓN Y ENTRENAMIENTO</small><h2>Más del equipo</h2></div></div><div class="v431-products">'+productCard("Entrenamiento",team+" · Training","training",logo)+productCard("Portero",team+" · Guardameta","keeper",logo)+productCard("Edición especial",team+" · Club","special",logo)+'</div></section>'+
 '<section class="v431-block" id="jugadores"><div class="v431-section-title"><div><small>COMPRA POR JUGADOR</small><h2>Plantilla</h2></div></div>'+playerCards(roster)+'</section>'+
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
 root.querySelector("[data-v431-back]").onclick=function(){sessionStorage.removeItem(OPEN_KEY);sessionStorage.removeItem(TEAM_KEY);sessionStorage.removeItem(CAT_KEY);var s=document.querySelector("#screen");if(s)s.innerHTML="";window.dispatchEvent(new Event("hashchange"))};
 root.querySelectorAll("[data-v431-jump]").forEach(function(b){b.onclick=function(){var el=document.getElementById(b.dataset.v431Jump);if(el)el.scrollIntoView({behavior:"smooth",block:"start"})}});
 var panel=root.querySelector("[data-v431-search-panel]"),input=root.querySelector("[data-v431-search]");
 root.querySelector("[data-v431-search-toggle]").onclick=function(){panel.classList.toggle("open");if(panel.classList.contains("open"))setTimeout(function(){if(input)input.focus()},50)};
 root.querySelector("[data-v431-search-close]").onclick=function(){panel.classList.remove("open");if(input){input.value="";input.dispatchEvent(new Event("input"))}};
 if(input)input.oninput=function(){var q=norm(input.value);root.querySelectorAll("[data-v431-product]").forEach(function(p){p.classList.toggle("v431-no-match",!!q&&!norm(p.dataset.search).includes(q))})};
 root.querySelectorAll("[data-v431-heart]").forEach(function(b){b.onclick=function(e){e&&e.preventDefault();e&&e.stopPropagation();b.classList.toggle("active");b.textContent=b.classList.contains("active")?"♥":"♡"}});
 root.querySelectorAll("[data-v431-add]").forEach(function(b){b.onclick=function(e){e&&e.preventDefault();e&&e.stopPropagation();addItem(team,b.dataset.v431Add,"Catálogo del equipo")}});
 var nameInput=root.querySelector("[data-v431-name]"),numberInput=root.querySelector("[data-v431-number]");
 function preview(){var n=root.querySelector(".v431-custom-preview .v431-shirt-name"),num=root.querySelector(".v431-custom-preview .v431-shirt-number");if(n)n.textContent=(nameInput.value||"TU NOMBRE").toUpperCase();if(num)num.textContent=(numberInput.value||"10").replace(/\D/g,"").slice(0,2)}
 nameInput.oninput=preview;numberInput.oninput=function(){numberInput.value=numberInput.value.replace(/\D/g,"").slice(0,2);preview()};
 root.querySelector("[data-v431-add-custom]").onclick=function(){var name=(nameInput.value||"").trim()||"Sin nombre",num=(numberInput.value||"").trim()||"--",size=root.querySelector("[data-v431-size]").value;addItem(team,"Camiseta personalizada",name+" · #"+num+" · Talla "+size)};
 root.querySelectorAll("[data-v431-player]").forEach(function(b){b.onclick=function(){nameInput.value=b.dataset.v431Player||"";preview();document.getElementById("personaliza").scrollIntoView({behavior:"smooth",block:"start"})}});
 root.querySelectorAll("[data-v431-filter]").forEach(function(b){b.onclick=function(){var q=b.dataset.v431Filter,hit=[].slice.call(root.querySelectorAll("[data-v431-product]")).find(function(p){return norm(p.dataset.search).includes(norm(q))});if(hit)hit.scrollIntoView({behavior:"smooth",block:"center"})}});
 var drawer=root.querySelector("[data-v431-drawer]");root.querySelector("[data-v431-cart-toggle]").onclick=function(){drawer.classList.add("open");syncCart()};root.querySelector("[data-v431-cart-close]").onclick=function(){drawer.classList.remove("open")};drawer.onclick=function(e){if(e.target===drawer)drawer.classList.remove("open")};
 root.querySelector("[data-v431-clear]").onclick=function(){writeCart([]);syncCart();toast("Carrito vacío")};syncCart();
}
async function renderStore(team,cat){
 if(route()!=="club-store"||!team)return;ensureStyle();await load();var screen=document.querySelector("#screen");if(!screen||route()!=="club-store")return;
 var logo=logoFor(team),roster=rosterFor(team,cat);document.body.dataset.appRoute="club-store";screen.innerHTML=markup(team,cat,roster,logo);bind(team);
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

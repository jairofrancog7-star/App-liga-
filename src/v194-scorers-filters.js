/* V194 — Goleadores: vistas separadas por jugadores/equipos, categoría y equipo.
   Usa únicamente datos oficiales ya sincronizados en LJR_OFFICIAL_DATA/API. */
(function(){
'use strict';
if(window.__LJR_V194_SCORERS__)return;
window.__LJR_V194_SCORERS__=true;
window.__LJR_SCORERS_UI_OWNER__='v194-reference';

const CAT_ORDER=['3','5','4','2','1'];
const CAT_FALLBACK={
  '3':'Primera Fuerza',
  '5':'Intermedia',
  '4':'Segunda Fuerza',
  '2':'Veteranos 35+',
  '1':'Veteranos 50+'
};
const MODE_KEY='v194-scorer-mode';
const TEAM_KEY='v194-scorer-team';
let rendering=false;
let timer=0;
let scorerCategoryTapAt=0;
let scorerCategoryTapId='';

const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function db(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
  catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function catId(){
  let fromHash='';
  try{
    const q=String(location.hash||'').split('?')[1]||'';
    fromHash=new URLSearchParams(q).get('cat')||'';
  }catch(_){}
  if(CAT_ORDER.includes(String(fromHash))){
    const id=String(fromHash);
    try{localStorage.setItem('v62-category',id)}catch(_){}
    return id;
  }
  const stored=String(localStorage.getItem('v62-category')||'3');
  return CAT_ORDER.includes(stored)?stored:'3';
}
function category(id=catId()){
  return db()?.categories?.[String(id)]||null;
}
function catName(id=catId()){
  return category(id)?.name||CAT_FALLBACK[String(id)]||('Categoría '+id);
}
function exactLogo(team){
  const d=db();
  const entries=Object.entries(d?.team_logos||{});
  const exact=entries.find(([k])=>norm(k)===norm(team));
  const v=exact?.[1];
  if(typeof v==='string')return v;
  if(v?.local)return './'+String(v.local).replace(/^\.\//,'');
  if(v?.source)return v.source;
  try{return window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||''}
  catch(_){return ''}
}
function logoHtml(team,cls='v194-logo'){
  const src=exactLogo(team);
  if(src)return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(team)+'" loading="lazy" decoding="async"></span>';
  const ab=String(team||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()||'⚽';
  return '<span class="'+cls+' fallback">'+esc(ab)+'</span>';
}
function scorerRows(id=catId()){
  const raw=category(id)?.scorers?.[0]?.rows||[];
  return raw.filter(r=>Array.isArray(r)&&r.length>=4&&String(r[1]||'').trim()&&String(r[2]||'').trim()&&/^\d+$/.test(String(r[3]||'')))
    .map((r,i)=>({
      rank:String(r[0]||i+1),
      player:String(r[1]).trim(),
      team:String(r[2]).trim(),
      goals:Number(r[3])||0
    }))
    .sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es',{sensitivity:'base'}));
}
function standingTeams(id=catId()){
  const raw=category(id)?.standings?.[0]?.rows||[];
  return raw.filter(r=>Array.isArray(r)&&r.length>=7&&String(r[1]||'').trim())
    .map(r=>({team:String(r[1]).trim(),played:Number(r[2])||0,gf:Number(r[6])||0}))
    .sort((a,b)=>b.gf-a.gf||a.team.localeCompare(b.team,'es',{sensitivity:'base'}));
}
function teamsForCategory(id=catId()){
  const seen=[];
  const add=name=>{
    name=String(name||'').trim();if(!name)return;
    if(!seen.some(x=>norm(x)===norm(name)))seen.push(name);
  };
  scorerRows(id).forEach(r=>add(r.team));
  standingTeams(id).forEach(r=>add(r.team));
  Object.keys(category(id)?.rosters||{}).forEach(add);
  return seen.sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function groupByTeam(id=catId()){
  const rows=scorerRows(id),out=[];
  rows.forEach(r=>{
    let g=out.find(x=>norm(x.team)===norm(r.team));
    if(!g){g={team:r.team,total:0,players:[]};out.push(g)}
    g.total+=r.goals;g.players.push(r);
  });
  out.forEach(g=>g.players.sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es',{sensitivity:'base'})));
  return out.sort((a,b)=>b.total-a.total||a.team.localeCompare(b.team,'es',{sensitivity:'base'}));
}
function currentMode(){
  const m=localStorage.getItem(MODE_KEY);
  return m==='teams'?'teams':'players';
}
function currentTeam(){
  const v=localStorage.getItem(TEAM_KEY)||'all';
  const teams=teamsForCategory();
  return v==='all'||teams.some(x=>norm(x)===norm(v))?v:'all';
}
function modeTabs(){
  const mode=currentMode();
  return '<div class="v194-mode-tabs" role="tablist" aria-label="Vista de goleadores">'+
    '<button type="button" class="'+(mode==='players'?'active':'')+'" data-v194-mode="players">Por jugadores</button>'+
    '<button type="button" class="'+(mode==='teams'?'active':'')+'" data-v194-mode="teams">Por equipos</button>'+
  '</div>';
}
function topScorerFeature(){
  const id=catId(),r=scorerRows(id)[0];
  if(!r){
    return '<section class="v390-scorer-hero is-empty">'+
      '<h1 class="v390-sr-only">Máximo goleador</h1>'+
      '<div class="v390-scorer-photo"><div class="v390-scorer-label">#1 Máximo goleador</div></div>'+
      '<div class="v390-scorer-info"><div class="v390-scorer-empty">Sin goleadores publicados para '+esc(catName(id))+'</div></div>'+
    '</section>';
  }
  return '<section class="v390-scorer-hero" aria-label="Máximo goleador de '+esc(catName(id))+'">'+
    '<h1 class="v390-sr-only">Máximo goleador</h1>'+
    '<div class="v390-scorer-photo">'+
      '<div class="v390-scorer-label">#1 Máximo goleador</div>'+
      '<div class="v390-scorer-media"><span>00:38</span><span class="v390-scorer-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5 17 12l-8 4.5z"/></svg></span></div>'+
    '</div>'+
    '<div class="v390-scorer-info">'+
      '<button type="button" class="v390-scorer-person" data-v194-open-team="'+esc(r.team)+'" aria-label="Ver '+esc(r.team)+'">'+
        logoHtml(r.team,'v390-scorer-logo')+
        '<span><b>'+esc(r.team)+'</b><strong>'+esc(r.player)+'</strong></span>'+
      '</button>'+
      '<div class="v390-scorer-goals"><b>'+r.goals+'</b><small>goles</small></div>'+
    '</div>'+
  '</section>';
}
function categoryFilter(){
  const active=catId();
  return '<section class="v194-filter-block"><div class="v194-filter-label"><small>FILTRO 1</small><b>Categoría</b></div>'+
    '<div class="v194-category-rail">'+CAT_ORDER.map(id=>
      '<a role="button" href="#/scorers?cat='+encodeURIComponent(id)+'" class="'+(id===active?'active':'')+'" data-v194-cat="'+id+'" aria-pressed="'+(id===active?'true':'false')+'">'+esc(catName(id))+'</a>'
    ).join('')+'</div></section>';
}
function teamFilter(){
  const teams=teamsForCategory(),active=currentTeam();
  return '<section class="v194-filter-block"><div class="v194-filter-label"><small>FILTRO 2</small><b>Equipo</b></div>'+
    '<select class="v194-team-select" data-v194-team aria-label="Filtrar por equipo">'+
      '<option value="all">Todos los equipos</option>'+
      teams.map(t=>'<option value="'+esc(t)+'" '+(norm(t)===norm(active)?'selected':'')+'>'+esc(t)+'</option>').join('')+
    '</select></section>';
}
function playerTable(){
  const id=catId(),team=currentTeam();
  let rows=scorerRows(id);
  if(team!=='all')rows=rows.filter(r=>norm(r.team)===norm(team));
  const head='<div class="v194-table-head"><span>#</span><span>Jugador</span><span>Equipo</span><span>Goles</span></div>';
  if(!rows.length){
    return '<section class="v194-table-card"><div class="v194-table-title"><small>TABLA POR JUGADORES</small><h2>'+esc(catName(id))+'</h2></div>'+head+
      '<div class="v194-empty">No hay goleadores individuales publicados para este filtro. Cambia de categoría o de equipo.</div></section>';
  }
  return '<section class="v194-table-card"><div class="v194-table-title"><small>TABLA POR JUGADORES</small><h2>'+esc(catName(id))+'</h2></div>'+head+
    '<div class="v194-player-rows">'+rows.map((r,i)=>
      '<button type="button" class="v194-player-row" data-v194-open-team="'+esc(r.team)+'">'+
        '<span class="v194-pos">#'+esc(r.rank||i+1)+'</span>'+
        '<span class="v194-player-name"><b>'+esc(r.player)+'</b><small>'+esc(catName(id))+'</small></span>'+
        '<span class="v194-team-cell">'+logoHtml(r.team,'v194-logo')+'<b>'+esc(r.team)+'</b></span>'+
        '<strong>'+r.goals+'</strong>'+
      '</button>').join('')+'</div></section>';
}
function teamTable(){
  const id=catId(),groups=groupByTeam(id);
  if(groups.length){
    return '<section class="v194-table-card"><div class="v194-table-title"><small>TABLA POR EQUIPOS</small><h2>'+esc(catName(id))+'</h2></div>'+
      '<div class="v194-team-groups">'+groups.map((g,i)=>
        '<article class="v194-team-group">'+
          '<button type="button" class="v194-team-group-head" data-v194-open-team="'+esc(g.team)+'">'+
            '<span class="v194-pos">#'+(i+1)+'</span>'+logoHtml(g.team,'v194-logo large')+
            '<span><b>'+esc(g.team)+'</b><small>'+g.players.length+' goleador'+(g.players.length===1?'':'es')+'</small></span>'+
            '<strong>'+g.total+'<small> goles</small></strong>'+
          '</button>'+
          '<div class="v194-team-players">'+g.players.map((p,j)=>
            '<div><span>#'+(j+1)+'</span><b>'+esc(p.player)+'</b><strong>'+p.goals+'</strong></div>'
          ).join('')+'</div>'+
        '</article>').join('')+'</div></section>';
  }
  const teams=standingTeams(id);
  return '<section class="v194-table-card"><div class="v194-table-title"><small>TABLA POR EQUIPOS · GF OFICIALES</small><h2>'+esc(catName(id))+'</h2><p>La fuente oficial todavía no publica goleadores individuales en esta categoría; aquí se muestran los goles a favor de la clasificación.</p></div>'+
    '<div class="v194-team-groups">'+(teams.length?teams.map((t,i)=>
      '<article class="v194-team-group compact"><button type="button" class="v194-team-group-head" data-v194-open-team="'+esc(t.team)+'">'+
        '<span class="v194-pos">#'+(i+1)+'</span>'+logoHtml(t.team,'v194-logo large')+
        '<span><b>'+esc(t.team)+'</b><small>'+t.played+' PJ · '+esc(catName(id))+'</small></span>'+
        '<strong>'+t.gf+'<small> GF</small></strong>'+
      '</button></article>').join(''):'<div class="v194-empty">No hay datos de goleo publicados para esta categoría.</div>')+'</div></section>';
}
function heroScorerCard(r,slot){
  if(!r)return '';
  const shownRank=String(r.rank||slot);
  return '<article class="v391-feature rank-'+slot+'">'+
    '<div class="v391-feature-photo">'+
      '<span class="v391-feature-kicker">#'+esc(shownRank)+' Máximo goleador</span>'+
      '<span class="v391-feature-media"><small>00:'+(slot===1?'38':'36')+'</small><i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5 17 12l-8 4.5z"/></svg></i></span>'+
      '<span class="v391-feature-watermark">'+logoHtml(r.team,'v391-watermark-logo')+'</span>'+
    '</div>'+
    '<div class="v391-feature-info">'+
      '<div class="v391-feature-person" data-v194-player="'+esc(r.player)+'">'+
        logoHtml(r.team,'v391-feature-logo')+
        '<span><strong>'+esc(r.player)+'</strong><b>'+esc(r.team)+'</b></span>'+
      '</div>'+
      '<span class="v391-feature-goals"><b>'+r.goals+'</b><small>goles</small></span>'+
    '</div>'+
  '</article>';
}
function scorerListRows(rows){
  return '<div class="v391-ranking">'+rows.map((r,i)=>{
    const pos=String(r.rank||i+3);
    return '<div class="v391-rank-row" data-v194-player="'+esc(r.player)+'">'+
      '<span class="v391-rank-pos">#'+esc(pos)+'</span>'+
      logoHtml(r.team,'v391-rank-logo')+
      '<span class="v391-rank-copy"><b>'+esc(r.player)+'</b><small>'+esc(r.team)+'</small></span>'+
      '<strong>'+r.goals+'</strong>'+
    '</div>';
  }).join('')+'</div>';
}
function categoryStrip(){
  const active=catId();
  return '<section class="v391-category-wrap" aria-label="Clasificación por categoría">'+
    '<span class="v391-category-label">CATEGORÍA</span>'+
    '<div class="v391-category-strip">'+CAT_ORDER.map(id=>
      '<a role="button" href="#/scorers?cat='+encodeURIComponent(id)+'" class="'+(id===active?'active':'')+'" data-v194-cat="'+id+'" aria-pressed="'+(id===active?'true':'false')+'">'+esc(catName(id))+'</a>'
    ).join('')+'</div>'+
  '</section>';
}
function referenceScorersView(){
  const id=catId(),rows=scorerRows(id);
  return '<div class="v391-reference" data-v391-category="'+esc(id)+'">'+
    categoryStrip()+
    '<div class="v391-category-title"><small>'+esc(catName(id))+'</small><span>'+rows.length+' goleador'+(rows.length===1?'':'es')+' publicado'+(rows.length===1?'':'s')+'</span></div>'+
    (rows.length?
      heroScorerCard(rows[0],1)+heroScorerCard(rows[1],2)+scorerListRows(rows.slice(2)):
      '<div class="v391-empty">Todavía no hay goleadores oficiales publicados para '+esc(catName(id))+'.</div>')+
  '</div>';
}
function markup(){
  const source=db()?.captured_at_utc||'';
  return '<div class="v194-scorers" data-v194-scorers>'+
    referenceScorersView()+
    '<p class="v194-source">Datos oficiales sincronizados'+(source?' · '+esc(new Date(source).toLocaleString('es-MX')):'')+'</p>'+
    '<div id="v449-reference-lower" class="v449-reference-lower" data-v460-ranking-below-original></div>'+
  '</div>';
}
function openTeam(name){
  const id=catId();
  localStorage.setItem('v62-team-name',name);
  localStorage.setItem('v62-category',id);
  localStorage.setItem('v42-team-tab','summary');
  location.hash='#/teamDetail';
}
function chooseMode(mode){
  localStorage.setItem(MODE_KEY,mode==='teams'?'teams':'players');
  render(true);
}
function forceCategoryRender(){
  const page=document.querySelector('[data-v28-scorers]');
  if(!page||!db())return false;
  rendering=true;
  try{
    const signature=[catId(),currentMode(),currentTeam(),db()?.captured_at_utc||''].join('|');
    page.dataset.v194Sig=signature;
    page.innerHTML=markup();
    const root=page.querySelector('[data-v194-scorers]');
    if(root)bind(root);
    return true;
  }finally{
    rendering=false;
  }
}
function chooseCategory(id){
  id=CAT_ORDER.includes(String(id))?String(id):'3';

  try{
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    localStorage.setItem(TEAM_KEY,'all');
  }catch(_){}

  const wanted='#/scorers?cat='+encodeURIComponent(id);
  if(String(location.hash||'')!==wanted){
    /* Real hash navigation is intentional: it makes the category control
       work as a native link on Android even if another script replaces
       the scorer DOM between pointer/touch/click events. */
    location.hash=wanted;
  }else{
    forceCategoryRender();
  }

  try{window.dispatchEvent(new CustomEvent('ljr:scorers-category',{detail:{id}}))}catch(_){}
  requestAnimationFrame(()=>forceCategoryRender());
  setTimeout(()=>forceCategoryRender(),40);
  setTimeout(()=>forceCategoryRender(),160);
  return false;
}
function bind(root){
  if(!root)return;

  /* Category controls are native hash links. Do not prevent the click:
     the browser itself changes #/scorers?cat=... and hashchange repaints
     the individual-player ranking for that category. */
  root.querySelectorAll('[data-v194-cat]').forEach(b=>{
    b.addEventListener('click',()=>{
      const id=String(b.dataset.v194Cat||'');
      if(!CAT_ORDER.includes(id))return;
      try{
        localStorage.setItem('v62-category',id);
        localStorage.setItem('v12-fixture-cat',id);
        localStorage.setItem(TEAM_KEY,'all');
      }catch(_){}
    },{passive:true});
  });
}
function delegatedClick(e){
  if(route()!=='scorers'||!(e.target instanceof Element))return;
  const mode=e.target.closest('[data-v194-mode]');
  if(mode){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    chooseMode(mode.dataset.v194Mode);return;
  }
  const team=e.target.closest('[data-v194-open-team]');
  if(team){
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    openTeam(team.dataset.v194OpenTeam||'');return;
  }
}
function delegatedChange(e){
  if(route()!=='scorers'||!(e.target instanceof Element))return;
  if(!e.target.matches('[data-v194-team]'))return;
  e.stopPropagation();
  localStorage.setItem(TEAM_KEY,e.target.value||'all');
  render(true);
}
function render(force=false){
  if(rendering||route()!=='scorers'||!db())return;
  const page=document.querySelector('[data-v28-scorers]');
  if(!page)return;
  const signature=[catId(),currentMode(),currentTeam(),db()?.captured_at_utc||''].join('|');
  if(!force&&page.dataset.v194Sig===signature&&page.querySelector('[data-v194-scorers]'))return;
  rendering=true;
  try{
    page.dataset.v194Sig=signature;
    page.innerHTML=markup();
    bind(page.querySelector('[data-v194-scorers]'));
  }finally{rendering=false}
}
function schedule(delay=80){
  clearTimeout(timer);timer=setTimeout(()=>render(false),delay);
}
window.LJR_SCORERS_REFERENCE={
  setCategory:id=>chooseCategory(id),
  render:()=>forceCategoryRender(),
  getCategory:()=>catId()
};
window.LJR_SET_SCORER_CATEGORY=function(id){return chooseCategory(id)};
/* No pointerup/touchend hard interception here.
   Native category links are the fallback and must be allowed to navigate. */
document.addEventListener('click',delegatedClick,true);
document.addEventListener('change',delegatedChange,true);
window.addEventListener('hashchange',()=>{schedule(0);setTimeout(()=>render(true),50);setTimeout(()=>render(true),180)});
window.addEventListener('ljr:official-data',()=>schedule(20));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(20)});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(!rendering&&route()==='scorers')schedule(45)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(20),{once:true});else schedule(20);
setTimeout(()=>render(true),300);
setTimeout(()=>render(true),900);
setTimeout(()=>render(true),1800);
})();
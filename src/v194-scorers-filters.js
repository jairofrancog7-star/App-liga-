/* V194 — Goleadores: vistas separadas por jugadores/equipos, categoría y equipo.
   Usa únicamente datos oficiales ya sincronizados en LJR_OFFICIAL_DATA/API. */
(function(){
'use strict';
if(window.__LJR_V194_SCORERS__)return;
window.__LJR_V194_SCORERS__=true;

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

const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function db(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
  catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function catId(){
  const v=String(localStorage.getItem('v62-category')||'3');
  return CAT_ORDER.includes(v)?v:'3';
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
function categoryFilter(){
  const active=catId();
  return '<section class="v194-filter-block"><div class="v194-filter-label"><small>FILTRO 1</small><b>Categoría</b></div>'+
    '<div class="v194-category-rail">'+CAT_ORDER.map(id=>
      '<button type="button" class="'+(id===active?'active':'')+'" data-v194-cat="'+id+'">'+esc(catName(id))+'</button>'
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
function markup(){
  const mode=currentMode(),source=db()?.captured_at_utc||'';
  return '<div class="v194-scorers" data-v194-scorers>'+
    '<header class="v194-title"><small>MÁXIMO GOLEADOR</small><h1>Goleadores</h1><p>Consulta la tabla por jugadores o por equipos. Cada jugador lleva el logo oficial de su equipo.</p></header>'+
    modeTabs()+categoryFilter()+(mode==='players'?teamFilter():'')+
    (mode==='players'?playerTable():teamTable())+
    '<p class="v194-source">Datos oficiales sincronizados'+(source?' · '+esc(new Date(source).toLocaleString('es-MX')):'')+'</p>'+
  '</div>';
}
function openTeam(name){
  const id=catId();
  localStorage.setItem('v62-team-name',name);
  localStorage.setItem('v62-category',id);
  localStorage.setItem('v42-team-tab','summary');
  location.hash='#/teamDetail';
}
function bind(root){
  root.querySelectorAll('[data-v194-mode]').forEach(b=>b.addEventListener('click',()=>{
    localStorage.setItem(MODE_KEY,b.dataset.v194Mode||'players');
    render(true);
  }));
  root.querySelectorAll('[data-v194-cat]').forEach(b=>b.addEventListener('click',()=>{
    localStorage.setItem('v62-category',b.dataset.v194Cat||'3');
    localStorage.setItem(TEAM_KEY,'all');
    render(true);
  }));
  root.querySelector('[data-v194-team]')?.addEventListener('change',e=>{
    localStorage.setItem(TEAM_KEY,e.target.value||'all');
    render(true);
  });
  root.querySelectorAll('[data-v194-open-team]').forEach(b=>b.addEventListener('click',()=>openTeam(b.dataset.v194OpenTeam||'')));
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
window.addEventListener('hashchange',()=>schedule(30));
window.addEventListener('ljr:official-data',()=>schedule(20));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(20)});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(!rendering&&route()==='scorers')schedule(45)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(20),{once:true});else schedule(20);
setTimeout(()=>render(true),300);
setTimeout(()=>render(true),900);
setTimeout(()=>render(true),1800);
})();
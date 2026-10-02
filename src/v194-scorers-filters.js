/* V194 — Goleadores: vistas separadas por jugadores/equipos, categoría y equipo.
   Usa únicamente datos oficiales ya sincronizados en LJR_OFFICIAL_DATA/API. */
(function(){
'use strict';
if(window.__LJR_V194_SCORERS__)return;
window.__LJR_V194_SCORERS__=true;
window.__LJR_SCORERS_UI_OWNER__='v194-reference';
window.__LJR_SCORERS_BUILD__='v601-clean-feature-cards';

const CAT_ORDER=['3','5','4','2','1'];
const CAT_FALLBACK={
  '3':'Primera Fuerza',
  '5':'Intermedia',
  '4':'Segunda Fuerza',
  '2':'Veteranos 35+',
  '1':'Veteranos 50+'
};
const MODE_KEY='v194-scorer-mode';
try{localStorage.setItem(MODE_KEY,'players')}catch(_){}
const TEAM_KEY='v194-scorer-team';
const LOWER_STAT_KEY='v504-scorer-ranking-stat';
let rendering=false;
let timer=0;
let categoryTimer=0;
let statFrame=0;
let categoryBusy=false;
let selectedCategory='';
let dataWaitTimer=0;
let dataWaitAttempts=0;
let freshScorerData=null;
let freshScorerLoading=false;
const logoCache=new Map();

const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function db(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
  catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function catId(){
  if(CAT_ORDER.includes(String(selectedCategory)))return String(selectedCategory);
  let fromHash='';
  try{
    const q=String(location.hash||'').split('?')[1]||'';
    fromHash=new URLSearchParams(q).get('cat')||'';
  }catch(_){}
  const stored=String(localStorage.getItem('v62-category')||'3');
  const id=CAT_ORDER.includes(String(fromHash))
    ?String(fromHash)
    :(CAT_ORDER.includes(stored)?stored:'3');
  selectedCategory=id;
  try{localStorage.setItem('v62-category',id)}catch(_){}
  return id;
}
function category(id=catId()){
  return db()?.categories?.[String(id)]||null;
}
function catName(id=catId()){
  return category(id)?.name||CAT_FALLBACK[String(id)]||('Categoría '+id);
}
function exactLogo(team){
  const key=norm(team);
  if(logoCache.has(key))return logoCache.get(key);
  const d=db();
  const entries=Object.entries(d?.team_logos||{});
  const exact=entries.find(([k])=>norm(k)===key);
  const v=exact?.[1];
  let out='';
  if(typeof v==='string')out=v;
  else if(v?.local)out='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(v.local).replace(/^\.\//,'');
  else if(v?.source)out=v.source;
  else{
    try{out=window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||''}
    catch(_){out=''}
  }
  logoCache.set(key,out);
  return out;
}

function logoHtml(team,cls='v194-logo'){
  const src=exactLogo(team);
  if(src)return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(team)+'" loading="lazy" decoding="async"></span>';
  const ab=String(team||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()||'⚽';
  return '<span class="'+cls+' fallback">'+esc(ab)+'</span>';
}
function playerPhoto(name,team,id=catId()){
  try{
    const x=window.LJR_PLAYER_MEDIA?.photo?.(name,team,id);
    if(x)return String(x);
    const pub=window.LJR_PLAYER_PHOTOS;
    if(pub&&typeof pub.get==='function'){const y=pub.get(name,team,id);if(y)return String(y)}
  }catch(_){}
  const cat=category(id),entry=Object.entries(cat?.player_profiles||{}).find(([t])=>norm(t)===norm(team));
  const p=(Array.isArray(entry?.[1])?entry[1]:[]).find(x=>norm(x?.name)===norm(name));
  return String(p?.photo||'');
}
function playerAvatar(name,team,id=catId(),cls='v576-player-avatar v576-scorer-avatar'){
  const src=playerPhoto(name,team,id);
  if(src){
    return '<span class="'+cls+' v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>';
  }
  const teamSrc=exactLogo(team);
  if(teamSrc){
    return '<span class="'+cls+' v576-team-fallback" data-v576-team-fallback="1"><img src="'+esc(teamSrc)+'" alt="'+esc(team)+'" loading="lazy" decoding="async"></span>';
  }
  const ini=String(name||'J').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  return '<span class="'+cls+' v576-photo-fallback">'+esc(ini)+'</span>';
}
function heroPlayerPhoto(name,team,id=catId()){
  const src=playerPhoto(name,team,id);
  if(!src)return '';
  const teamLogo=exactLogo(team);
  const clean=v=>String(v||'').trim().replace(/[?#].*$/,'').replace(/^https?:\/\/raw\.githubusercontent\.com\//i,'').replace(/^https?:\/\/github\.com\//i,'').toLowerCase();
  /* Si el registro del jugador trae por error el mismo archivo que el escudo,
     no lo usamos como foto gigante del jugador. El escudo ya aparece abajo. */
  if(teamLogo&&clean(src)===clean(teamLogo))return '';
  return '<img class="v576-scorer-hero-photo" src="'+esc(src)+'" alt="'+esc(name)+'" loading="eager" decoding="async" referrerpolicy="no-referrer">';
}
function scorerRows(id=catId()){
  const cid=String(id);
  const fresh=freshScorerData?.categories?.[cid]?.scorers?.[0]?.rows;
  const raw=Array.isArray(fresh)&&fresh.length?fresh:(category(cid)?.scorers?.[0]?.rows||[]);
  return raw
    .filter(r=>Array.isArray(r)&&r.length>=4&&String(r[1]||'').trim()&&String(r[2]||'').trim()&&/^\d+$/.test(String(r[3]||'')))
    .filter(r=>!/goles?\s+en\s+temporada/i.test(String(r[2]||'')))
    .map((r,i)=>({
      rank:String(r[0]||i+1),
      player:String(r[1]).trim(),
      team:String(r[2]).trim(),
      goals:Number(r[3])||0
    }))
    .filter(r=>r.player&&r.team&&!/goles?\s+en\s+temporada/i.test(r.team))
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
  try{localStorage.setItem(MODE_KEY,'players')}catch(_){}
  return 'players';
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
    '<div class="v390-scorer-photo">'+heroPlayerPhoto(r.player,r.team,id)+
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
      '<button type="button" class="'+(id===active?'active':'')+'" data-v194-cat="'+id+'" aria-pressed="'+(id===active?'true':'false')+'">'+esc(catName(id))+'</button>'
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
      '<button type="button" class="v194-player-row v576-with-photo" data-v194-open-team="'+esc(r.team)+'" data-v194-player="'+esc(r.player)+'">'+
        '<span class="v194-pos">#'+esc(r.rank||i+1)+'</span>'+
        playerAvatar(r.player,r.team,id)+
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
            '<div class="v576-with-photo"><span>#'+(j+1)+'</span>'+playerAvatar(p.player,p.team,id,'v576-player-avatar v576-scorer-mini')+'<b>'+esc(p.player)+'</b><strong>'+p.goals+'</strong></div>'
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
  const hasPlayerPhoto=!!playerPhoto(r.player,r.team,catId());
  return '<article class="v391-feature rank-'+slot+'">'+
    '<div class="v391-feature-photo">'+heroPlayerPhoto(r.player,r.team,catId())+
      '<span class="v391-feature-kicker">#'+esc(shownRank)+' Máximo goleador</span>'+
      '<span class="v391-feature-media"><small>00:'+(slot===1?'38':'36')+'</small><i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 7.5 17 12l-8 4.5z"/></svg></i></span>'+
      '<span class="v391-feature-watermark">'+logoHtml(r.team,'v391-watermark-logo')+'</span>'+
    '</div>'+
    '<div class="v391-feature-info">'+
      '<div class="v391-feature-person v576-with-photo" data-v194-player="'+esc(r.player)+'" data-v194-team="'+esc(r.team)+'">'+
        playerAvatar(r.player,r.team,catId(),'v576-player-avatar')+
        '<span><strong>'+esc(r.player)+'</strong><b>'+(hasPlayerPhoto?logoHtml(r.team,'v391-feature-logo'):'')+esc(r.team)+'</b></span>'+
      '</div>'+
      '<span class="v391-feature-goals"><b>'+r.goals+'</b><small>goles</small></span>'+
    '</div>'+
  '</article>';
}
function scorerListRows(rows){
  return '<div class="v391-ranking">'+rows.map((r,i)=>{
    const pos=String(r.rank||i+3);
    return '<div class="v391-rank-row v576-with-photo" data-v194-player="'+esc(r.player)+'" data-v194-team="'+esc(r.team)+'">'+
      '<span class="v391-rank-pos">#'+esc(pos)+'</span>'+
      playerAvatar(r.player,r.team,catId())+
      '<span class="v391-rank-copy"><b>'+esc(r.player)+'</b><small>'+logoHtml(r.team,'v391-rank-logo')+esc(r.team)+'</small></span>'+
      '<strong>'+r.goals+'</strong>'+
    '</div>';
  }).join('')+'</div>';
}
function lowerStat(){
  const v=String(localStorage.getItem(LOWER_STAT_KEY)||'goals');
  return ['goals','shots','passes'].includes(v)?v:'goals';
}
function lowerRankingRow(r,i){
  const hasPlayerPhoto=!!playerPhoto(r.player,r.team,catId());
  return '<button type="button" class="v462-rank-row v576-with-photo" data-v194-player="'+esc(r.player)+'" data-v194-team="'+esc(r.team)+'" data-v462-ranking-kind="player">'+
    '<span class="v462-rank-pos">'+String(i+1)+'º</span>'+
    playerAvatar(r.player,r.team,catId())+
    '<span class="v462-rank-copy"><b>'+esc(r.player)+'</b><small>'+(hasPlayerPhoto?logoHtml(r.team,'v462-rank-logo'):'')+'Equipo · '+esc(r.team)+'</small></span>'+
    '<strong>'+esc(r.goals)+'</strong>'+
  '</button>';
}
function lowerRanking(rows){
  const stat=lowerStat();
  const label=stat==='goals'?'GOLES':stat==='shots'?'REMATES':'PASES';
  return '<section class="v462-lower-ranking" data-v462-ranking-below>'+
    '<div class="v462-ranking-title">RANKING DE JUGADORES</div>'+
    (stat==='goals'
      ?'<div class="v462-rank-card"><div class="v462-rank-head"><span>POS.</span><span>JUGADOR</span><span>'+label+'</span></div>'+
        '<div class="v462-rank-list">'+rows.map((r,i)=>lowerRankingRow(r,i)).join('')+'</div></div>'
      :'<div class="v462-stat-empty"><b>'+esc(stat==='shots'?'Remates':'Pases')+'</b><span>Esta estadística individual todavía no está publicada en los datos oficiales.</span></div>')+
  '</section>';
}

function chooseLowerStat(mode){
  const v=['goals','shots','passes'].includes(String(mode))?String(mode):'goals';
  if(v===lowerStat())return false;
  try{localStorage.setItem(LOWER_STAT_KEY,v)}catch(_){}
  syncControlState();
  if(statFrame)cancelAnimationFrame(statFrame);
  statFrame=requestAnimationFrame(()=>{
    statFrame=0;
    renderCategoryOnly();
  });
  return false;
}

function categoryStrip(){
  const active=catId(),stat=lowerStat();
  return '<section class="v391-category-wrap v472-unified-controls" aria-label="Filtros del ranking">'+
    '<span class="v391-category-label">CLASIFICAR POR CATEGORÍA</span>'+
    '<div class="v391-category-strip">'+CAT_ORDER.map(id=>
      '<button type="button" class="'+(id===active?'active':'')+'" data-v194-cat="'+id+'" aria-pressed="'+(id===active?'true':'false')+'">'+esc(catName(id))+'</button>'
    ).join('')+'</div>'+
    '<div class="v391-stat-strip" aria-label="Estadística del ranking">'+
      '<button type="button" class="'+(stat==='goals'?'active':'')+'" data-v462-stat="goals" aria-pressed="'+(stat==='goals'?'true':'false')+'">Goles</button>'+
      '<button type="button" class="'+(stat==='shots'?'active':'')+'" data-v462-stat="shots" aria-pressed="'+(stat==='shots'?'true':'false')+'">Remates</button>'+
      '<button type="button" class="'+(stat==='passes'?'active':'')+'" data-v462-stat="passes" aria-pressed="'+(stat==='passes'?'true':'false')+'">Pases</button>'+
    '</div>'+
  '</section>';
}
function categoryBody(){
  const id=catId(),rows=scorerRows(id);
  return '<div class="v391-category-body" data-v391-category-body data-v391-category="'+esc(id)+'">'+
    '<div class="v391-category-title"><small>'+esc(catName(id))+'</small><span>'+rows.length+' goleador'+(rows.length===1?'':'es')+' publicado'+(rows.length===1?'':'s')+'</span></div>'+
    (rows.length
      ?heroScorerCard(rows[0],1)+heroScorerCard(rows[1],2)+lowerRanking(rows)
      :'<div class="v391-empty">Todavía no hay goleadores oficiales publicados para '+esc(catName(id))+'.</div>')+
  '</div>';
}
function syncControlState(){
  const id=catId(),stat=lowerStat();
  document.querySelectorAll('[data-v194-cat]').forEach(b=>{
    const on=String(b.dataset.v194Cat||'')===id;
    b.classList.toggle('active',on);
    b.setAttribute('aria-pressed',on?'true':'false');
  });
  document.querySelectorAll('[data-v462-stat]').forEach(b=>{
    const on=String(b.dataset.v462Stat||'')===stat;
    b.classList.toggle('active',on);
    b.setAttribute('aria-pressed',on?'true':'false');
  });
}

function referenceScorersView(){
  return '<div class="v391-reference">'+categoryStrip()+categoryBody()+'</div>';
}

function markup(){
  const source=db()?.captured_at_utc||'';
  return '<div class="v194-scorers" data-v194-scorers>'+
    referenceScorersView()+
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
function chooseMode(){
  try{localStorage.setItem(MODE_KEY,'players')}catch(_){}
  render(true);
}
function forceCategoryRender(){
  const page=document.querySelector('[data-v28-scorers]');
  if(!page||!db())return false;
  rendering=true;
  try{
    const signature=[catId(),currentMode(),currentTeam(),lowerStat(),db()?.captured_at_utc||''].join('|');
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
  if(categoryBusy)return false;
  if(id===catId()&&pageHasCategory(id))return false;

  categoryBusy=true;
  selectedCategory=id;
  try{
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    localStorage.setItem(TEAM_KEY,'all');
  }catch(_){}

  /* Android/WebView: do not mutate the URL or replace scorer DOM while
     the tap event is still dispatching. That was the freeze trigger. */
  syncControlState();
  if(categoryTimer)cancelAnimationFrame(categoryTimer);
  categoryTimer=requestAnimationFrame(()=>{
    categoryTimer=0;
    try{renderCategoryOnly()}
    finally{categoryBusy=false}
  });
  return false;
}

function pageHasCategory(id){
  const body=document.querySelector('[data-v28-scorers] [data-v391-category-body]');
  return !!body&&String(body.dataset.v391Category||'')===String(id);
}

function renderCategoryOnly(){
  if(route()!=='scorers'||!db())return false;
  const page=document.querySelector('[data-v28-scorers]');
  const root=page?.querySelector('[data-v194-scorers]');
  const body=root?.querySelector('[data-v391-category-body]');
  if(!page||!root||!body)return forceCategoryRender();

  const signature=[catId(),currentMode(),currentTeam(),lowerStat(),db()?.captured_at_utc||''].join('|');
  page.dataset.v194Sig=signature;

  const tpl=document.createElement('template');
  tpl.innerHTML=categoryBody();
  const next=tpl.content.firstElementChild;
  if(!next)return false;
  body.replaceWith(next);
  bind(next);
  syncControlState();
  return true;
}

function bind(root){
  if(!root)return;

  root.querySelectorAll('[data-v194-cat]').forEach(b=>{
    b.style.pointerEvents='auto';
    b.style.touchAction='manipulation';
    b.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      chooseCategory(b.dataset.v194Cat||'3');
    };
  });

  root.querySelectorAll('[data-v462-stat]').forEach(b=>{
    b.style.pointerEvents='auto';
    b.style.touchAction='manipulation';
    b.onclick=e=>{
      e.preventDefault();
      e.stopPropagation();
      chooseLowerStat(b.dataset.v462Stat||'goals');
    };
  });

  root.querySelectorAll('[data-v194-mode]').forEach(b=>{
    b.style.pointerEvents='auto';
    b.style.touchAction='manipulation';
    b.onclick=e=>{e.preventDefault();e.stopPropagation();chooseMode(b.dataset.v194Mode)};
  });

  root.querySelectorAll('[data-v194-open-team]').forEach(b=>{
    b.style.pointerEvents='auto';
    b.style.touchAction='manipulation';
    b.onclick=e=>{e.preventDefault();e.stopPropagation();openTeam(b.dataset.v194OpenTeam||'')};
  });

  root.querySelectorAll('[data-v194-player]').forEach(el=>{
    el.style.pointerEvents='auto';
    el.style.touchAction='manipulation';
    if(!el.matches('button')){el.setAttribute('role','button');el.tabIndex=0}
    el.onclick=e=>{
      const row=scorerRows().find(r=>norm(r.player)===norm(el.dataset.v194Player));
      if(!row)return;
      e.preventDefault();
      e.stopPropagation();
      window.LJR_PLAYER_PROFILE_API?.open({name:row.player,team:row.team,cat:catId()});
    };
    if(!el.matches('button'))el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}};
  });
}
function delegatedClick(e){
  if(route()!=='scorers'||!(e.target instanceof Element))return;
  const control=e.target.closest('[data-v194-cat],[data-v462-stat],[data-v194-mode],[data-v194-open-team],[data-v194-player]');
  if(!control||typeof control.onclick==='function')return;

  if(control.matches('[data-v194-cat]')){
    e.preventDefault();chooseCategory(control.dataset.v194Cat||'3');return;
  }
  if(control.matches('[data-v462-stat]')){
    e.preventDefault();chooseLowerStat(control.dataset.v462Stat||'goals');return;
  }
  if(control.matches('[data-v194-mode]')){
    e.preventDefault();chooseMode(control.dataset.v194Mode);return;
  }
  if(control.matches('[data-v194-open-team]')){
    e.preventDefault();openTeam(control.dataset.v194OpenTeam||'');return;
  }
  if(control.matches('[data-v194-player]')){
    const row=scorerRows().find(r=>norm(r.player)===norm(control.dataset.v194Player));
    if(row){e.preventDefault();window.LJR_PLAYER_PROFILE_API?.open({name:row.player,team:row.team,cat:catId()})}
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
  const signature=[catId(),currentMode(),currentTeam(),lowerStat(),db()?.captured_at_utc||''].join('|');
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
async function refreshCanonicalScorers(){
  if(freshScorerLoading)return;
  freshScorerLoading=true;
  try{
    const res=await fetch('./data/official-live.json?v=20261001-v504-player-ranking',{cache:'no-store'});
    if(!res.ok)return;
    const next=await res.json();
    if(next?.categories){
      freshScorerData=next;
      logoCache.clear();
      if(route()==='scorers')render(true);
    }
  }catch(_){}
  finally{freshScorerLoading=false}
}
function waitForOfficialData(reset=false){
  if(reset)dataWaitAttempts=0;
  clearTimeout(dataWaitTimer);
  if(route()!=='scorers'){dataWaitAttempts=0;return}
  if(db()){
    dataWaitAttempts=0;
    render(false);
    return;
  }
  /* V469: V194 loads before V62. Wait only until official data exists,
     then stop. This replaces the old timing race without a DOM/render loop. */
  if(dataWaitAttempts>=96)return;
  dataWaitAttempts++;
  dataWaitTimer=setTimeout(()=>waitForOfficialData(false),125);
}
window.LJR_SCORERS_REFERENCE={
  setCategory:id=>chooseCategory(id),
  setStat:mode=>chooseLowerStat(mode),
  render:()=>forceCategoryRender(),
  getCategory:()=>catId(),
  getStat:()=>lowerStat()
};
window.LJR_SET_SCORER_CATEGORY=function(id){return chooseCategory(id)};
document.addEventListener('click',delegatedClick,true);
document.addEventListener('change',delegatedChange,true);
window.addEventListener('hashchange',()=>{
  selectedCategory='';
  waitForOfficialData(true);
  if(route()==='scorers')refreshCanonicalScorers();
});
window.addEventListener('ljr:official-data',()=>{
  logoCache.clear();
  clearTimeout(dataWaitTimer);
  dataWaitAttempts=0;
  if(route()==='scorers')render(true);
});
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&route()==='scorers')waitForOfficialData(true);
});
/* No subtree MutationObserver: it caused self-triggered repaint cycles. */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{waitForOfficialData(true);refreshCanonicalScorers()},{once:true});
}else{
  waitForOfficialData(true);
  refreshCanonicalScorers();
}
})();
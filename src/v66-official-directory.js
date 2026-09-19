/* V66 — Directorio oficial AdminFut: equipos/plantillas reales.
   Sustituye únicamente #/teams, #/players y #/club-store con datos públicos sincronizados. */
(function(){
'use strict';
const LOCAL='./public/data/official-live.json?v=20260919-v66-official';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20260919-v66-official';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const CAT_ORDER=['3','5','4','2','1'];
const CAT_LABEL={'1':'Veteranos 50+','2':'Veteranos 35+','3':'Primera Fuerza','4':'Segunda Fuerza','5':'Intermedia'};
let db=null, loading=null, teamQuery='', playerQuery='', playerCat='all';

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
function teamMarkup(store=false){
  const q=norm(teamQuery);
  const list=teamList().filter(t=>!q||norm(t.name).includes(q)||norm(t.category).includes(q));
  return '<section class="v66-directory" data-v66-directory="'+(store?'store':'teams')+'">'+
    '<div class="v66-search"><span>⌕</span><input data-v66-team-search type="search" autocomplete="off" placeholder="Buscar equipo registrado" value="'+esc(teamQuery)+'"></div>'+
    '<p class="v66-source-note">'+list.length+' equipos registrados · datos oficiales sincronizados</p>'+
    '<div class="v66-team-grid">'+list.map(t=>'<button type="button" class="v66-team-card" data-v66-open-team="'+esc(t.name)+'" data-v66-cat-id="'+esc(t.cat)+'">'+teamLogo(t)+'<span><b>'+esc(t.name)+'</b><small>'+esc(t.category)+(store?' · Tienda':'')+'</small></span><i>›</i></button>').join('')+'</div>'+
  '</section>';
}
function playerMarkup(){
  const q=norm(playerQuery);
  const all=playerList();
  const list=all.filter(p=>(playerCat==='all'||p.cat===playerCat)&&(!q||norm(p.name).includes(q)||norm(p.team).includes(q)));
  return '<section class="v66-directory" data-v66-directory="players">'+
    categoryRail(playerCat,'data-v66-player-cat')+
    '<div class="v66-search"><span>⌕</span><input data-v66-player-search type="search" autocomplete="off" placeholder="Buscar jugador o equipo" value="'+esc(playerQuery)+'"></div>'+
    '<p class="v66-source-note">'+list.length+' jugadores registrados'+(playerCat==='all'?'':' · '+esc(CAT_LABEL[playerCat]||''))+'</p>'+
    '<div class="v66-player-list">'+list.map((p,i)=>'<button type="button" class="v66-player-row" data-v66-player="'+esc(p.name)+'" data-v66-player-team="'+esc(p.team)+'" data-v66-cat-id="'+esc(p.cat)+'"><span class="v66-player-avatar">'+esc(fallback(p.name).slice(0,2))+'</span><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span><i>›</i></button>').join('')+'</div>'+
  '</section>';
}
function saveTeam(name,cat){
  localStorage.setItem('v62-team-name',name);
  localStorage.setItem('v62-category',String(cat||'3'));
  localStorage.setItem('v42-team-tab','summary');
}
function bind(){
  document.querySelector('[data-v66-team-search]')?.addEventListener('input',e=>{teamQuery=e.target.value;render(true)});
  document.querySelector('[data-v66-player-search]')?.addEventListener('input',e=>{playerQuery=e.target.value;render(true)});
  document.querySelectorAll('[data-v66-player-cat]').forEach(b=>b.onclick=()=>{playerCat=b.dataset.v66PlayerCat||'all';render(true)});
  document.querySelectorAll('[data-v66-open-team]').forEach(b=>b.onclick=()=>{
    const name=b.dataset.v66OpenTeam,cat=b.dataset.v66CatId; saveTeam(name,cat);
    try{if(window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(name);return}}catch(e){}
    location.hash='#/teamDetail';
  });
  document.querySelectorAll('[data-v66-player]').forEach(b=>b.onclick=()=>{
    localStorage.setItem('v66-selected-player',b.dataset.v66Player||'');
    localStorage.setItem('v66-selected-player-team',b.dataset.v66PlayerTeam||'');
    localStorage.setItem('v62-category',b.dataset.v66CatId||'3');
    location.hash='#/credentialBuilder';
  });
}
async function render(force=false){
  const r=route(); if(!['teams','players','club-store'].includes(r))return;
  await load(); if(!db)return;
  const screen=document.querySelector('#screen'); if(!screen)return;
  const kind=r==='club-store'?'store':r;
  if(!force&&screen.querySelector('[data-v66-directory="'+kind+'"]'))return;
  screen.innerHTML=r==='players'?playerMarkup():teamMarkup(r==='club-store');
  bind();
  if(r==='teams'||r==='club-store'){
    const input=screen.querySelector('[data-v66-team-search]'); if(force&&input){input.focus();input.setSelectionRange(input.value.length,input.value.length)}
  }else{
    const input=screen.querySelector('[data-v66-player-search]'); if(force&&input){input.focus();input.setSelectionRange(input.value.length,input.value.length)}
  }
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(()=>render(false)))}
window.addEventListener('hashchange',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(['teams','players','club-store'].includes(route())&&!screen.querySelector('[data-v66-directory]'))schedule()}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();

window.V66_OFFICIAL_DIRECTORY={load,teamList,playerList,rosterFor,logoFor};
})();
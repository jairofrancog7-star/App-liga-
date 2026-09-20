/* V104 — Directorio oficial de jugadores.
   Sustituye los nombres demo de #/players por los nombres deportivos públicos
   de data/official-live.json. No inventa jugadores, dorsales, goles ni fotos. */
(function(){
'use strict';
if(window.__LJR_V104_PLAYERS__)return;
window.__LJR_V104_PLAYERS__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const DATA=BASE+'data/official-live.json?v=20260920-players-all';
const ORDER=['all','3','5','4','2','1'];
const NAMES={'all':'Todos','3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
let db=null,loading=null,active=localStorage.getItem('v104-player-category')||'all',query='';

const route=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';
const screen=()=>document.querySelector('#screen');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');

async function load(){
  if(db)return db;
  if(loading)return loading;
  loading=(async()=>{
    try{
      const api=window.LJR_OFFICIAL_API?.getData?.();
      if(api){db=api;return db}
    }catch(_){}
    try{
      const r=await fetch(DATA,{cache:'no-store'});
      if(r.ok)db=await r.json();
    }catch(_){}
    return db;
  })();
  return loading;
}

function logo(name){
  try{
    const s=window.LJR_TEAM_LOGOS?.get?.(name);
    if(s)return s;
  }catch(_){}
  const hit=Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===norm(name));
  const v=hit?.[1];
  if(typeof v==='string')return v;
  if(v?.local)return BASE+String(v.local).replace(/^\.\//,'');
  if(v?.source)return v.source;
  return '';
}

function entries(){
  const out=[];
  const cats=db?.categories||{};
  for(const id of ['3','5','4','2','1']){
    if(active!=='all'&&id!==active)continue;
    const c=cats[id]; if(!c)continue;
    for(const [team,players] of Object.entries(c.rosters||{})){
      const unique=[]; const seen=new Set();
      for(const p of (players||[])){
        const k=norm(p);if(!k||seen.has(k))continue;seen.add(k);unique.push(String(p).trim());
      }
      if(unique.length)out.push({id,category:c.name||NAMES[id],team,players:unique});
    }
  }
  const q=norm(query);
  if(!q)return out;
  return out.map(x=>({...x,players:x.players.filter(p=>norm(p+' '+x.team+' '+x.category).includes(q))})).filter(x=>x.players.length);
}

function teamLogo(team){
  const src=logo(team);
  if(src)return '<span class="v104-team-logo"><img src="'+esc(src)+'" alt="'+esc(team)+'" loading="lazy" decoding="async"></span>';
  const ab=String(team||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="v104-team-logo v104-fallback">'+esc(ab||'EQ')+'</span>';
}

function totalPlayers(){
  const seen=new Set();
  for(const e of entries())for(const p of e.players)seen.add(norm(e.id+'|'+p+'|'+e.team));
  return seen.size;
}

function render(){
  if(route()!=='players'||!db)return;
  const root=screen();if(!root)return;
  const groups=entries();
  const total=totalPlayers();
  root.innerHTML='<section class="v104-players" data-v104-players>'+
    '<header class="v104-head"><div><small>DATOS OFICIALES</small><h1>Jugadores registrados</h1><p>'+esc(total)+' nombres públicos encontrados en cédulas y registros deportivos.</p></div></header>'+
    '<div class="v104-cats">'+ORDER.map(id=>'<button type="button" class="'+(active===id?'active':'')+'" data-v104-cat="'+id+'">'+esc(NAMES[id])+'</button>').join('')+'</div>'+
    '<label class="v104-search"><span>⌕</span><input type="search" data-v104-search value="'+esc(query)+'" placeholder="Buscar jugador o equipo" autocomplete="off"></label>'+
    '<div class="v104-list">'+(groups.length?groups.map(g=>
      '<section class="v104-team">'+
        '<button type="button" class="v104-team-head" data-v104-team="'+esc(g.team)+'">'+teamLogo(g.team)+'<span><b>'+esc(g.team)+'</b><small>'+esc(g.category)+' · '+g.players.length+' jugadores</small></span><i>›</i></button>'+
        '<div class="v104-roster">'+g.players.map(p=>'<div class="v104-player"><span>'+esc(String(p).split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase())+'</span><b>'+esc(p)+'</b></div>').join('')+'</div>'+
      '</section>').join(''):
      '<div class="v104-empty">No hay nombres públicos para este filtro.</div>')+'</div>'+
    '<p class="v104-source">Fuente deportiva pública: juventinorosasliga.com sincronizada en Liga_Futbol. No se muestran CURP, INE, domicilio ni documentos.</p>'+
  '</section>';

  root.querySelectorAll('[data-v104-cat]').forEach(b=>b.onclick=()=>{active=b.dataset.v104Cat||'all';localStorage.setItem('v104-player-category',active);render()});
  const inp=root.querySelector('[data-v104-search]');
  if(inp)inp.oninput=()=>{query=inp.value||'';render()};
  root.querySelectorAll('[data-v104-team]').forEach(b=>b.onclick=()=>{
    const name=b.dataset.v104Team||'';
    try{window.LJR_OFFICIAL_API?.openTeam?.(name)}catch(_){}
    if(location.hash==='#/players'){
      localStorage.setItem('v62-team-name',name);
      location.hash='#/teamDetail';
    }
  });
  try{window.LJR_TEAM_LOGOS?.refresh?.()}catch(_){}
}

async function sync(){
  if(route()!=='players')return;
  await load(); render();
}
window.addEventListener('hashchange',()=>setTimeout(sync,0));
window.addEventListener('ljr:official-data',()=>{db=window.LJR_OFFICIAL_DATA||db;if(route()==='players')render()});
const root=screen();
if(root)new MutationObserver(()=>{if(route()==='players'&&!root.querySelector('[data-v104-players]'))setTimeout(sync,0)}).observe(root,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();

/* V562 — Registro deportivo oficial con foto/posición pública.
   Lee player_profiles de Liga_Futbol. Nunca muestra CURP, INE, domicilio ni documentos. */
(function(){
'use strict';
if(window.__LJR_V562_REGISTRY__)return;
window.__LJR_V562_REGISTRY__=true;
/* V625 — un solo renderizador para #/players. Evita el ping-pong visual con V66. */
window.__LJR_PLAYER_DIRECTORY_OWNER__='v562-registry';

const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
const LOCAL='./data/official-live.json?v=20261002-v575-registry-positions-photos';
const ORDER=['3','5','4','2','1'];
const NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const HERMANOS_SPRITE='data:image/jpeg;base64,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';
window.LJR_V562_HERMANOS={img:HERMANOS_SPRITE,cols:6,rows:5,w:38,h:46,players:null};
let db=null,active=localStorage.getItem('v562-reg-cat')||'3',team=localStorage.getItem('v562-reg-team')||'all',query='';

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const ownsPlayers=()=>window.__LJR_PLAYER_DIRECTORY_OWNER__==='v562-registry';
const root=()=>document.querySelector('#screen');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const newer=(a,b)=>!a?b:!b?a:String(b.captured_at_utc||'')>String(a.captured_at_utc||'')?b:a;

async function fetchJson(url){
 try{const r=await fetch(url,{cache:'no-store'});return r.ok?await r.json():null}catch(_){return null}
}
async function load(){
 const api=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null;
 db=newer(db,api);
 const local=await fetchJson(LOCAL);db=newer(db,local);
 const remote=await fetchJson(REMOTE+'?ts='+Date.now());db=newer(db,remote);
 return db;
}
function category(id=active){return db?.categories?.[String(id)]||null}
function teams(c){
 const set=new Map();
 Object.keys(c?.rosters||{}).forEach(n=>set.set(norm(n),n));
 (c?.standings?.[0]?.rows||[]).forEach(r=>r?.[1]&&set.set(norm(r[1]),String(r[1])));
 Object.keys(c?.player_profiles||{}).forEach(n=>set.set(norm(n),n));
 return [...set.values()].sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function profilesFor(c,teamName){
 const hit=Object.entries(c?.player_profiles||{}).find(([k])=>norm(k)===norm(teamName));
 const arr=Array.isArray(hit?.[1])?hit[1]:[];
 const map=new Map(arr.map(x=>[norm(x?.name),x]));
 const brothers=norm(teamName)==='hermanos'?window.LJR_V562_HERMANOS:null;
 if(brothers?.players){
   Object.values(brothers.players).forEach(p=>{
     const k=norm(p?.name);if(!k)return;
     const live=map.get(k)||{};
     map.set(k,{...p,...live,spriteIndex:Number(p.i)});
   });
 }
 const rosterHit=Object.entries(c?.rosters||{}).find(([k])=>norm(k)===norm(teamName));
 const names=Array.isArray(rosterHit?.[1])?rosterHit[1]:[];
 const out=[];const seen=new Set();
 for(const name of names){
   const k=norm(name);if(!k||seen.has(k))continue;seen.add(k);
   const p=map.get(k)||{};
   const si=Number(p.spriteIndex??p.sprite_index);
   out.push({name:String(name),position:String(p.position||''),dorsal:String(p.dorsal||''),photo:String(p.photo||''),spriteIndex:Number.isFinite(si)?si:null});
 }
 for(const p of map.values()){
   const k=norm(p?.name);if(!k||seen.has(k))continue;seen.add(k);
   const si=Number(p.spriteIndex??p.sprite_index);
   out.push({name:String(p.name||''),position:String(p.position||''),dorsal:String(p.dorsal||''),photo:String(p.photo||''),spriteIndex:Number.isFinite(si)?si:null});
 }
 return out.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
}
function allGroups(){
 const ids=active==='all'?ORDER:[active];
 const q=norm(query);const out=[];
 for(const id of ids){
   const c=db?.categories?.[id];if(!c)continue;
   for(const tm of teams(c)){
     if(team!=='all'&&norm(tm)!==norm(team))continue;
     let ps=profilesFor(c,tm);
     if(q)ps=ps.filter(p=>norm(p.name+' '+p.position+' '+tm+' '+(c.name||'')).includes(q));
     if(ps.length)out.push({id,category:c.name||NAMES[id]||'',team:tm,players:ps});
   }
 }
 return out;
}
function logo(name){
 try{const x=window.LJR_TEAM_LOGOS?.get?.(name);if(x)return x}catch(_){}
 const hit=Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===norm(name));const v=hit?.[1];
 if(typeof v==='string')return v;
 if(v?.local)return 'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(v.local).replace(/^\.\//,'');
 return v?.source||'';
}
function spriteHtml(p){
 const pack=window.LJR_V562_HERMANOS;
 if(!pack||!Number.isFinite(p.spriteIndex))return '';
 const i=p.spriteIndex,x=(i%pack.cols)*pack.w,y=Math.floor(i/pack.cols)*pack.h;
 return '<span class="v562-avatar sprite"><i style="background-position:-'+x+'px -'+y+'px"></i></span>';
}
function avatar(p){
 if(p.photo)return '<span class="v562-avatar photo"><img src="'+esc(p.photo)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>';
 const sp=spriteHtml(p);if(sp)return sp;
 const ini=p.name.split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
 return '<span class="v562-avatar">'+esc(ini)+'</span>';
}
function categoryOptions(){
 return '<option value="all" '+(active==='all'?'selected':'')+'>Todas las categorías</option>'+ORDER.map(id=>'<option value="'+id+'" '+(active===id?'selected':'')+'>'+esc(category(id)?.name||NAMES[id])+'</option>').join('');
}
function teamOptions(){
 const ids=active==='all'?ORDER:[active];const seen=new Map();
 ids.forEach(id=>teams(category(id)).forEach(n=>seen.set(norm(n),n)));
 if(team!=='all'&&!seen.has(norm(team))){team='all';localStorage.setItem('v562-reg-team','all')}
 return '<option value="all">Todos los equipos</option>'+[...seen.values()].sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'})).map(n=>'<option value="'+esc(n)+'" '+(norm(n)===norm(team)?'selected':'')+'>'+esc(n)+'</option>').join('');
}
function render(){
 if(route()!=='players'||!db||!ownsPlayers())return;
 const host=root();if(!host)return;
 const groups=allGroups(),total=groups.reduce((n,g)=>n+g.players.length,0);
 host.innerHTML='<section class="v562-registry" data-v562-registry>'+
  '<header class="v562-head"><small>DATOS OFICIALES</small><h1>Registro de jugadores</h1><p>'+total+' jugadores visibles con los filtros seleccionados.</p></header>'+
  '<div class="v562-filters"><label><span>Categoría</span><select data-v562-cat>'+categoryOptions()+'</select></label><label><span>Equipo</span><select data-v562-team>'+teamOptions()+'</select></label>'+
  '<label class="v562-search"><span>⌕</span><input data-v562-search type="search" value="'+esc(query)+'" placeholder="Buscar jugador o posición"></label></div>'+
  '<div class="v562-list">'+(groups.length?groups.map(g=>{
    const crest=logo(g.team);
    return '<section class="v562-team"><button type="button" class="v562-team-head" data-v562-open-team="'+esc(g.team)+'">'+
      (crest?'<img src="'+esc(crest)+'" alt="" loading="lazy">':'<span class="v562-team-fallback">⚽</span>')+
      '<span><b>'+esc(g.team)+'</b><small>'+esc(g.category)+' · '+g.players.length+' registrados</small></span><i>›</i></button>'+
      '<div class="v562-players">'+g.players.map(p=>'<article class="v562-player">'+avatar(p)+'<span class="v562-player-copy"><b>'+esc(p.name)+'</b><small>'+esc(p.position||'Posición no publicada')+(p.dorsal?' · #'+esc(p.dorsal):'')+'</small></span></article>').join('')+'</div></section>';
  }).join(''):'<div class="v562-empty">No hay registros públicos para este filtro.</div>')+'</div>'+
  '<p class="v562-note">Se muestran únicamente datos deportivos publicados por la Liga. CURP, INE, domicilio y documentos quedan fuera de esta vista.</p>'+
 '</section>';
 const reg=host.querySelector('[data-v562-registry]');
 const sprite=window.LJR_V562_HERMANOS?.img;
 if(reg&&sprite)reg.style.setProperty('--v562-hermanos-sprite','url("'+sprite+'")');
 host.querySelector('[data-v562-cat]')?.addEventListener('change',e=>{active=e.target.value||'3';team='all';localStorage.setItem('v562-reg-cat',active);localStorage.setItem('v562-reg-team','all');render()});
 host.querySelector('[data-v562-team]')?.addEventListener('change',e=>{team=e.target.value||'all';localStorage.setItem('v562-reg-team',team);render()});
 host.querySelector('[data-v562-search]')?.addEventListener('input',e=>{query=e.target.value||'';render()});
 host.querySelectorAll('[data-v562-open-team]').forEach(b=>b.addEventListener('click',()=>{try{window.LJR_OFFICIAL_API?.openTeam?.(b.dataset.v562OpenTeam)}catch(_){}}));
}
function enhanceTeamRoster(){
 if(route()!=='teamDetail'||!db)return;
 const page=document.querySelector('[data-v42-reference="teamDetail"]');if(!page)return;
 const tm=localStorage.getItem('v62-team-name')||page.querySelector('.v42-title h1')?.textContent||'';
 let c=null;
 for(const id of ORDER){const x=category(id);if(teams(x).some(n=>norm(n)===norm(tm))){c=x;break}}
 if(!c)return;
 const map=new Map(profilesFor(c,tm).map(p=>[norm(p.name),p]));
 page.querySelectorAll('.v42-player-row').forEach(row=>{
   const name=row.querySelector('.v42-player-copy strong')?.textContent||'';const p=map.get(norm(name));if(!p)return;
   const av=row.querySelector('.v42-avatar');
   if(av&&p.photo&&!av.querySelector('img')){av.innerHTML='<img src="'+esc(p.photo)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">';av.classList.add('v562-team-photo')}
   else if(av&&!p.photo&&Number.isFinite(p.spriteIndex)&&window.LJR_V562_HERMANOS){
     const pack=window.LJR_V562_HERMANOS,i=p.spriteIndex,x=(i%pack.cols)*pack.w,y=Math.floor(i/pack.cols)*pack.h;
     page.style.setProperty('--v562-hermanos-sprite','url("'+pack.img+'")');
     av.innerHTML='<i class="v562-team-sprite" style="background-position:-'+x+'px -'+y+'px"></i>';av.classList.add('v562-team-photo');
   }
   const small=row.querySelector('.v42-player-copy small');if(small&&p.position)small.textContent=p.position+' · '+tm;
   const num=row.querySelector('.v42-number');if(num&&p.dorsal)num.textContent='#'+p.dorsal;
 });
}
async function sync(){
 if(!['players','teamDetail'].includes(route()))return;
 await load();
 if(route()==='players'){if(ownsPlayers())render()}else setTimeout(enhanceTeamRoster,30);
}
window.addEventListener('hashchange',()=>setTimeout(sync,0));
window.addEventListener('ljr:official-data',()=>{db=newer(db,window.LJR_OFFICIAL_DATA);if(route()==='players'){if(ownsPlayers())render()}else enhanceTeamRoster()});
const host=root();if(host)new MutationObserver(()=>{if(route()==='players'&&ownsPlayers()&&!host.querySelector('[data-v562-registry]'))setTimeout(sync,0);if(route()==='teamDetail')setTimeout(enhanceTeamRoster,0)}).observe(host,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
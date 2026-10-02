/* V562 — Registro deportivo oficial con foto/posición pública.
   Lee player_profiles de Liga_Futbol. Nunca muestra CURP, INE, domicilio ni documentos. */
(function(){
'use strict';
if(window.__LJR_V562_REGISTRY__)return;
window.__LJR_V562_REGISTRY__=true;

const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json';
const LOCAL='./data/official-live.json?v=20261002-v562-registry';
const ORDER=['3','5','4','2','1'];
const NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
let db=null,active=localStorage.getItem('v562-reg-cat')||'3',team=localStorage.getItem('v562-reg-team')||'all',query='';

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
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
 if(route()!=='players'||!db)return;
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
 if(route()==='players')render();else setTimeout(enhanceTeamRoster,30);
}
window.addEventListener('hashchange',()=>setTimeout(sync,0));
window.addEventListener('ljr:official-data',()=>{db=newer(db,window.LJR_OFFICIAL_DATA);if(route()==='players')render();else enhanceTeamRoster()});
const host=root();if(host)new MutationObserver(()=>{if(route()==='players'&&!host.querySelector('[data-v562-registry]'))setTimeout(sync,0);if(route()==='teamDetail')setTimeout(enhanceTeamRoster,0)}).observe(host,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();
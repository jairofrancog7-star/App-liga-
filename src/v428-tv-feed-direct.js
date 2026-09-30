/* V428 — Feed TV de referencia montado directamente en #/video y en Modo TV. */
(function(){
'use strict';
if(window.__LJR_V428_TV_FEED_DIRECT__)return;
window.__LJR_V428_TV_FEED_DIRECT__=true;

const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

function db(){try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}}
function logo(name){
  try{
    const u=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';
    if(u)return u;
  }catch(_){}
  const d=db(),hit=Object.entries(d.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  const p=typeof hit==='string'?hit:(hit?.local||hit?.source||hit?.url||'');
  return p?( /^https?:/i.test(p)?p:ROOT+String(p).replace(/^\.?\//,'') ):'';
}
function badge(name){
  const src=logo(name),ini=String(name||'JR').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span>'+esc(ini)+'</span>';
}
function parseDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime():NaN;
}
function fixtures(){
  const out=[];
  Object.entries(db().categories||{}).forEach(([cid,c])=>{
    (c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,ri)=>{
      if(!r?.[2]||!r?.[6])return;
      const hs=String(r?.[3]??'').trim(),as=String(r?.[5]??'').trim(),played=/^\d+$/.test(hs)&&/^\d+$/.test(as);
      out.push({key:cid+':'+gi+':'+ri,category:c?.name||'Liga Juventino Rosas',home:String(r[2]),away:String(r[6]),hs:played?hs:'',as:played?as:'',played,date:String(r?.[8]||''),time:parseDate(r?.[8])});
    }));
  });
  return out.sort((a,b)=>(Number.isFinite(a.time)?a.time:9e15)-(Number.isFinite(b.time)?b.time:9e15));
}
function teams(){
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.teamList?.();
    if(Array.isArray(list)&&list.length)return list.slice(0,12);
  }catch(_){}
  const seen=new Set(),out=[];
  Object.entries(db().categories||{}).forEach(([cid,c])=>{
    const add=n=>{n=String(n||'').trim();const k=norm(n);if(!n||seen.has(k))return;seen.add(k);out.push({name:n,category:c?.name||'Liga Juventino Rosas',cat:cid})};
    (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
    Object.keys(c?.rosters||{}).forEach(add);
  });
  return out.slice(0,12);
}
function matchCard(m,label,portrait=false){
  const score=m.played?m.hs+' - '+m.as:'VS';
  return '<button class="'+(portrait?'v428-tv-portrait':'v428-tv-card')+'" type="button" data-v428-match>'+
    '<span class="'+(portrait?'v428-tv-portrait-art':'v428-tv-art')+'">'+
      '<span class="v428-tv-logo">'+badge(m.home)+'</span><span class="v428-tv-logo">'+badge(m.away)+'</span>'+
      '<i>▶</i><strong>'+esc(score)+'</strong><em>'+esc(label)+'</em>'+
    '</span>'+
    '<span class="v428-tv-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+(m.date?' · '+esc(m.date):'')+'</small></span>'+
  '</button>';
}
function clubCard(t){
  return '<button class="v428-tv-card" type="button" data-v428-team="'+esc(t.name)+'">'+
    '<span class="v428-tv-art v428-tv-club-art"><span class="v428-tv-club-logo">'+badge(t.name)+'</span><i>▶</i><em>CLUB</em></span>'+
    '<span class="v428-tv-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Juventino Rosas')+'</small></span></button>';
}
function rail(title,sub,body,more=true){
  return '<section class="v428-tv-section"><header><span><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p></span>'+(more?'<button type="button" data-v428-more>Ver más ›</button>':'')+'</header><div class="v428-tv-row">'+body+'</div></section>';
}
function markup(){
  const all=fixtures(),now=Date.now(),played=all.filter(x=>x.played).slice(-12).reverse(),upcoming=all.filter(x=>!x.played&&(!Number.isFinite(x.time)||x.time>=now-7200000)).slice(0,12),featured=(played.length?played:all).slice(0,10),clubList=teams();
  const empty='<div class="v428-tv-empty">El contenido aparecerá aquí cuando haya datos oficiales disponibles.</div>';
  return '<section class="v428-tv-feed" data-v428-tv-feed>'+
    '<div class="v428-tv-title"><div><small>LIGA TV</small><h2>Ver en TV</h2><p>Contenido oficial de la Liga Juventino Rosas.</p></div><button class="v439-connect-trigger" type="button" data-v439-connect>Conectar o transmitir</button></div>'+
    rail('Ver en vivo en Liga Juventino','Partidos próximos y transmisiones de la Liga',upcoming.length?upcoming.slice(0,7).map(m=>matchCard(m,'PRÓXIMO')).join(''):empty)+
    rail('Liga Juventino Rosas','Partidos, resultados y mejores momentos',featured.length?featured.slice(0,7).map(m=>matchCard(m,m.played?'MEJORES MOMENTOS':'PARTIDO')).join(''):empty)+
    rail('Videos oficiales de clubes','Contenido por equipo registrado',clubList.length?clubList.slice(0,9).map(clubCard).join(''):empty)+
    rail('Liga TV Videos','Videos verticales y momentos destacados','<div class="v428-tv-portrait-row">'+(featured.length?featured.slice(0,7).map(m=>matchCard(m,'LIGA TV',true)).join(''):empty)+'</div>',false)+
    rail('Lo más visto','Selección destacada de Liga TV',featured.length?featured.slice().reverse().slice(0,7).map(m=>matchCard(m,'DESTACADO')).join(''):empty)+
    rail('Resúmenes más recientes','Últimos partidos con marcador oficial',played.length?played.slice(0,7).map(m=>matchCard(m,'RESUMEN')).join(''):empty)+
  '</section>';
}
function bind(root){
  root.querySelectorAll('[data-v439-connect]').forEach(b=>b.onclick=openCastSheet);
  root.querySelectorAll('[data-v428-match]').forEach(b=>b.onclick=()=>{location.hash='#/v4-matchcenter'});
  root.querySelectorAll('[data-v428-team]').forEach(b=>b.onclick=()=>{
    const name=b.dataset.v428Team||'';
    try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v27-selected-team',norm(name).replace(/\s+/g,'-'))}catch(_){}
    location.hash='#/teamDetail';
  });
  root.querySelectorAll('[data-v428-more]').forEach(b=>b.onclick=()=>{location.hash='#/moments'});
}
function insert(host,where='beforeend'){
  if(!host||host.querySelector(':scope > [data-v428-tv-feed]'))return;
  host.insertAdjacentHTML(where,markup());
  const root=host.querySelector(':scope > [data-v428-tv-feed]');
  if(root)bind(root);
}
function mount(){
  if(route()==='video'){
    const content=document.querySelector('#screen .v17-tv .v17-tv-content');
    insert(content,'beforeend');
  }
  const board=document.querySelector('body > .v160-tv-layer .v160-tv-board');
  insert(board,'beforeend');
}
let t=0;
function schedule(ms=30){clearTimeout(t);t=setTimeout(mount,ms)}
new MutationObserver(()=>schedule(20)).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{
  const target=e.target instanceof Element?e.target.closest('[data-v412-tv-mode="cast"],[data-v439-connect]'):null;
  if(!target)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  openCastSheet();
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCastSheet()});
window.addEventListener('hashchange',()=>{closeCastSheet();schedule(40)});
window.addEventListener('load',()=>schedule(120));
document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
schedule(20);setTimeout(mount,500);setTimeout(mount,1500);
})();
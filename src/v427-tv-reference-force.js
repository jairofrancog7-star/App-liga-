/* V427 — Fuerza el diseño de referencia dentro del panel real "Ver en TV".
   Se monta al FINAL de .v160-tv-board y no reemplaza el contenido superior existente. */
(function(){
'use strict';
if(window.__LJR_V427_TV_REFERENCE_FORCE__)return;
window.__LJR_V427_TV_REFERENCE_FORCE__=true;

const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function db(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}
}
function logo(name){
  try{
    const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';
    if(x)return x;
  }catch(_){}
  const d=db(), hit=Object.entries(d.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
  const p=typeof hit==='string'?hit:(hit?.local||hit?.source||hit?.url||'');
  if(!p)return '';
  return /^https?:/i.test(p)?p:ROOT+String(p).replace(/^\.?\//,'');
}
function initials(name){
  return String(name||'JR').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
}
function badge(name){
  const src=logo(name);
  return src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span>'+esc(initials(name))+'</span>';
}
function parseDate(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(!m)return NaN;
  return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime();
}
function fixtures(){
  const out=[],d=db();
  Object.entries(d.categories||{}).forEach(([cid,c])=>{
    (c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,ri)=>{
      if(!r?.[2]||!r?.[6])return;
      const hs=String(r?.[3]??'').trim(),as=String(r?.[5]??'').trim();
      const played=/^\d+$/.test(hs)&&/^\d+$/.test(as);
      out.push({
        key:cid+':'+gi+':'+ri,cat:cid,category:c?.name||'Liga Juventino Rosas',
        home:String(r[2]),away:String(r[6]),hs:played?hs:'',as:played?as:'',played,
        field:String(r?.[7]||'Campo por confirmar'),date:String(r?.[8]||''),time:parseDate(r?.[8])
      });
    }));
  });
  return out.sort((a,b)=>(Number.isFinite(a.time)?a.time:9e15)-(Number.isFinite(b.time)?b.time:9e15));
}
function teams(){
  try{
    const list=window.V66_OFFICIAL_DIRECTORY?.teamList?.();
    if(Array.isArray(list)&&list.length)return list.slice(0,14);
  }catch(_){}
  const seen=new Set(),out=[];
  Object.entries(db().categories||{}).forEach(([cid,c])=>{
    const add=n=>{n=String(n||'').trim();const k=norm(n);if(!n||seen.has(k))return;seen.add(k);out.push({name:n,category:c?.name||'Liga Juventino Rosas',cat:cid})};
    (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
    Object.keys(c?.rosters||{}).forEach(add);
  });
  return out.slice(0,14);
}
function card(m,label='LIGA TV'){
  const result=m.played?m.hs+' - '+m.as:'VS';
  return '<button class="v427-tv-card" type="button" data-v427-match="'+esc(m.key)+'">'+
    '<span class="v427-tv-art">'+
      '<span class="v427-tv-logo">'+badge(m.home)+'</span>'+
      '<span class="v427-tv-logo">'+badge(m.away)+'</span>'+
      '<i>▶</i><strong>'+esc(result)+'</strong><em>'+esc(label)+'</em>'+
    '</span>'+
    '<span class="v427-tv-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+(m.date?' · '+esc(m.date):'')+'</small></span>'+
  '</button>';
}
function clubCard(t){
  return '<button class="v427-tv-card" type="button" data-v427-team="'+esc(t.name)+'">'+
    '<span class="v427-tv-art v427-tv-club-art"><span class="v427-tv-club-logo">'+badge(t.name)+'</span><i>▶</i><em>CLUB</em></span>'+
    '<span class="v427-tv-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Juventino Rosas')+'</small></span>'+
  '</button>';
}
function portrait(m){
  const result=m.played?m.hs+' - '+m.as:'VS';
  return '<button class="v427-tv-portrait" type="button" data-v427-match="'+esc(m.key)+'">'+
    '<span class="v427-tv-portrait-art">'+
      '<span class="v427-tv-logo">'+badge(m.home)+'</span>'+
      '<span class="v427-tv-logo">'+badge(m.away)+'</span>'+
      '<i>▶</i><strong>'+esc(result)+'</strong><em>LIGA TV</em>'+
    '</span>'+
    '<span class="v427-tv-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+'</small></span>'+
  '</button>';
}
function rail(title,sub,body,more=true){
  return '<section class="v427-tv-section"><header><span><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p></span>'+(more?'<button type="button" data-v427-more>Ver más ›</button>':'')+'</header><div class="v427-tv-row">'+body+'</div></section>';
}
function markup(){
  const all=fixtures(),now=Date.now();
  const played=all.filter(x=>x.played).slice(-12).reverse();
  const upcoming=all.filter(x=>!x.played&&(!Number.isFinite(x.time)||x.time>=now-2*60*60000)).slice(0,12);
  const featured=(played.length?played:all).slice(0,10);
  const ts=teams();
  const empty='<div class="v427-tv-empty">El contenido aparecerá aquí cuando haya datos oficiales disponibles.</div>';
  return '<section class="v427-tv-feed" data-v427-tv-feed>'+
    '<div class="v427-tv-title"><small>LIGA TV</small><h2>Ver en TV</h2><p>Contenido oficial de la Liga Juventino Rosas.</p></div>'+
    rail('Ver en vivo en Liga Juventino','Partidos próximos y transmisiones de la Liga',(upcoming.length?upcoming.slice(0,7).map(m=>card(m,'PRÓXIMO')).join(''):empty))+
    rail('Liga Juventino Rosas','Partidos, resultados y mejores momentos',(featured.length?featured.slice(0,7).map(m=>card(m,m.played?'MEJORES MOMENTOS':'PARTIDO')).join(''):empty))+
    rail('Videos oficiales de clubes','Contenido por equipo registrado',(ts.length?ts.slice(0,9).map(clubCard).join(''):empty))+
    rail('Liga TV Videos','Videos verticales y momentos destacados','<div class="v427-tv-portrait-row">'+(featured.length?featured.slice(0,7).map(portrait).join(''):empty)+'</div>',false)+
    rail('Lo más visto','Selección destacada de Liga TV',(featured.length?featured.slice().reverse().slice(0,7).map(m=>card(m,'DESTACADO')).join(''):empty))+
    rail('Resúmenes más recientes','Últimos partidos con marcador oficial',(played.length?played.slice(0,7).map(m=>card(m,'RESUMEN')).join(''):empty))+
  '</section>';
}
function bind(root){
  $$('[data-v427-more]',root).forEach(b=>b.onclick=()=>{document.querySelector('.v160-tv-close')?.click();location.hash='#/video'});
  $$('[data-v427-match]',root).forEach(b=>b.onclick=()=>{document.querySelector('.v160-tv-close')?.click();location.hash='#/v4-matchcenter'});
  $$('[data-v427-team]',root).forEach(b=>b.onclick=()=>{
    const name=b.dataset.v427Team||'';
    try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v27-selected-team',norm(name).replace(/\s+/g,'-'))}catch(_){}
    document.querySelector('.v160-tv-close')?.click();location.hash='#/teamDetail';
  });
}
function mount(){
  const layer=document.querySelector('body > .v160-tv-layer');
  const board=layer?.querySelector('.v160-tv-board');
  if(!layer||!board||board.querySelector('[data-v427-tv-feed]'))return;
  board.insertAdjacentHTML('beforeend',markup());
  bind(board.querySelector('[data-v427-tv-feed]'));
}
let t=0;
function schedule(ms=30){clearTimeout(t);t=setTimeout(mount,ms)}
new MutationObserver(()=>schedule(20)).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>schedule(120));
document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
schedule(20);setTimeout(mount,300);setTimeout(mount,900);
})();
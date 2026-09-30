/* V428 — Feed TV de referencia montado directamente en #/video y en Modo TV. */
(function(){
'use strict';
if(window.__LJR_V428_TV_FEED_DIRECT__)return;
window.__LJR_V428_TV_FEED_DIRECT__=true;

const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

let activeCastSheet=null;
function castIcon(){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17a4 4 0 0 1 4 4"/><path d="M3 13a8 8 0 0 1 8 8"/><path d="M3 9a12 12 0 0 1 12 12"/><rect x="8" y="4" width="13" height="11" rx="2"/></svg>';
}
function infoIcon(){
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 10v7"/><path d="M12 7h.01"/></svg>';
}
function closeCastSheet(){
  const layer=document.querySelector('[data-v439-cast-sheet]');
  if(!layer){activeCastSheet=null;return}
  layer.classList.remove('is-open');
  document.body.classList.remove('v439-cast-open');
  setTimeout(()=>layer.remove(),180);
  activeCastSheet=null;
}
function sheetToast(msg){
  const panel=document.querySelector('[data-v439-cast-sheet] .v439-cast-panel');
  if(!panel)return;
  panel.querySelector('.v439-cast-toast')?.remove();
  const n=document.createElement('div');
  n.className='v439-cast-toast';
  n.textContent=msg;
  panel.appendChild(n);
  setTimeout(()=>n.remove(),2600);
}
async function startCast(){
  const media=document.querySelector('video,audio');
  try{
    if(media?.remote&&typeof media.remote.prompt==='function'){
      await media.remote.prompt();
      return;
    }
  }catch(_){}
  try{
    if(typeof window.PresentationRequest==='function'){
      const request=new window.PresentationRequest([location.href]);
      await request.start();
      return;
    }
  }catch(_){}
  try{
    if(navigator.share){
      await navigator.share({
        title:'Liga Juventino Rosas',
        text:'Abrir Liga TV en otro dispositivo',
        url:location.href
      });
      return;
    }
  }catch(_){}
  try{
    await navigator.clipboard?.writeText(location.href);
    sheetToast('Enlace copiado para abrirlo en otro dispositivo.');
  }catch(_){
    sheetToast('Este navegador no tiene transmisión directa disponible.');
  }
}
function openCastSheet(){
  if(document.querySelector('[data-v439-cast-sheet]'))return;
  const layer=document.createElement('div');
  layer.className='v439-cast-sheet';
  layer.setAttribute('data-v439-cast-sheet','');
  layer.innerHTML=
    '<button class="v439-cast-backdrop" type="button" aria-label="Cerrar"></button>'+
    '<section class="v439-cast-panel" role="dialog" aria-modal="true" aria-label="Conectar o transmitir">'+
      '<span class="v439-cast-handle" aria-hidden="true"></span>'+
      '<header class="v439-cast-head"><h2>Conectar o transmitir</h2><button type="button" data-v439-close aria-label="Cerrar">×</button></header>'+
      '<div class="v439-cast-body">'+
        '<h3>Ver con Liga TV</h3>'+
        '<div class="v439-streamcenter-card">'+
          '<span><b>Ingresa para usar<br>Liga TV</b><small>Liga TV sincroniza tu teléfono y otra pantalla, además de ofrecer controles adicionales de reproducción.</small></span>'+
          '<button type="button" data-v439-enter>Entrar</button>'+
        '</div>'+
        '<h3 class="v439-device-title">Transmitir a otro dispositivo</h3>'+
        '<button class="v439-cast-row" type="button" data-v439-cast>'+
          '<span class="v439-row-icon">'+castIcon()+'</span><b>Transmitir</b><i>›</i>'+
        '</button>'+
        '<button class="v439-cast-row" type="button" data-v439-learn>'+
          '<span class="v439-row-icon">'+infoIcon()+'</span><b>Aprende más</b><i>›</i>'+
        '</button>'+
        '<div class="v439-cast-help" data-v439-help hidden><b>Cómo funciona</b><p>Si tu navegador detecta una TV o pantalla compatible, se abrirá el selector de dispositivos. Si no está disponible, puedes compartir el enlace de Liga TV para abrirlo en otro dispositivo.</p></div>'+
        '<p class="v439-cast-foot">La disponibilidad de transmisión depende del navegador, la TV y de que ambos dispositivos tengan una conexión compatible.</p>'+
      '</div>'+
    '</section>';
  document.body.appendChild(layer);
  document.body.classList.add('v439-cast-open');
  activeCastSheet=layer;
  layer.querySelector('.v439-cast-backdrop').onclick=closeCastSheet;
  layer.querySelector('[data-v439-close]').onclick=closeCastSheet;
  layer.querySelector('[data-v439-enter]').onclick=()=>{
    closeCastSheet();
    setTimeout(()=>{if(window.LJR_V105?.openTv)window.LJR_V105.openTv();else location.hash='#/video'},120);
  };
  layer.querySelector('[data-v439-cast]').onclick=startCast;
  layer.querySelector('[data-v439-learn]').onclick=()=>{
    const help=layer.querySelector('[data-v439-help]');
    if(!help)return;
    help.hidden=!help.hidden;
    if(!help.hidden)help.scrollIntoView({behavior:'smooth',block:'nearest'});
  };
  requestAnimationFrame(()=>layer.classList.add('is-open'));
}
window.__LJR_V439_CAST_SHEET__=true;
window.LJR_V439_CAST={open:openCastSheet,close:closeCastSheet,cast:startCast};


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
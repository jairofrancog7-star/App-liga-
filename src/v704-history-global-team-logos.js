/* V704 — Historia: sincronización global de escudos históricos.
   Última capa: aplica los escudos ya confirmados en TODAS las vistas de Historia
   sin cambiar nombres, datos, fotos históricas ni el diseño. */
(function(){
'use strict';
if(window.__LJR_V704_HISTORY_LOGO_GLOBAL__)return;
window.__LJR_V704_HISTORY_LOGO_GLOBAL__=true;

const SPECIAL={
  'salvajes':'./assets/history/team-logos/salvajes.webp',
  'salvaje':'./assets/history/team-logos/salvajes.webp',
  'tecos':'./assets/history/team-logos/tecos.webp',
  'tecos fc':'./assets/history/team-logos/tecos.webp',
  'xolos':'./assets/history/team-logos/xolos-jaralillo.webp',
  'xolos jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  'xolos de jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  'jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  'jaralillo fc':'./assets/history/team-logos/xolos-jaralillo.webp',
  'jaralillo f c':'./assets/history/team-logos/xolos-jaralillo.webp',
  'club tijuana':'./assets/history/team-logos/xolos-jaralillo.webp',
  'xoloitzcuintles':'./assets/history/team-logos/xolos-jaralillo.webp',
  'universidad':'./assets/history/team-logos/universidad-pumas.webp',
  'unam':'./assets/history/team-logos/universidad-pumas.webp',
  'pumas':'./assets/history/team-logos/universidad-pumas.webp',
  'pumas unam':'./assets/history/team-logos/universidad-pumas.webp'
};

function route(){
  return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'';
}
function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
function clean(v){
  return String(v||'')
    .replace(/^\s*(?:campe[oó]n|subcampe[oó]n|ganador|primer lugar|tercer lugar)\s*:?\s*/i,'')
    .replace(/\s*\([^)]*\)\s*/g,' ')
    .replace(/\s*·.*$/,'')
    .trim();
}
function aliases(name){
  const raw=String(name||'').trim(), c=clean(raw), n=norm(c);
  const out=[raw,c];
  if(n.includes('salvaje'))out.push('Salvajes');
  if(n.includes('tecos'))out.push('Tecos');
  if(n.includes('jaralillo')||n.includes('xolos')||n.includes('tijuana'))out.push('Xolos Jaralillo','Xolos');
  if(n.includes('universidad')||n==='unam'||n.includes('pumas'))out.push('Universidad','UNAM');
  if(n.includes('lobos jrs')||n.includes('lobos jr cerrito'))out.push('Lobos Jrs');
  if(n.includes('galacticos'))out.push('Galácticos de Pozos','Galácticos');
  if(n.includes('promesas'))out.push('Promesas FC','Promesas');
  if(n.includes('galeana'))out.push('Atlético Galeana','Galeana');
  return [...new Set(out.filter(Boolean))];
}
function logoFor(name){
  for(const a of aliases(name)){
    const k=norm(a);
    if(SPECIAL[k])return SPECIAL[k];
    try{
      const src=window.LJR_TEAM_LOGOS?.get?.(a);
      if(src)return src;
    }catch(_){}
    try{
      const src=window.LJR_OFFICIAL_API?.getLogo?.(a);
      if(src)return src;
    }catch(_){}
  }
  return '';
}
function abs(src){
  try{return new URL(src,document.baseURI).href}catch(_){return String(src||'')}
}
function same(a,b){return abs(a)===abs(b)}
function img(src,name,cls=''){
  const el=document.createElement('img');
  el.src=src;el.alt=name||'Escudo histórico';el.loading='lazy';el.decoding='async';
  if(cls)el.className=cls;
  el.dataset.v704HistoryLogo='1';
  el.addEventListener('error',()=>{el.remove()},{once:true});
  return el;
}
function forceHolder(holder,name,cls=''){
  if(!holder||!name)return false;
  const src=logoFor(name);
  if(!src)return false;
  const current=holder.querySelector('img');
  if(current&&same(current.currentSrc||current.src,src)){
    current.alt=name;
    holder.classList.remove('is-fallback');
    return true;
  }
  holder.replaceChildren(img(src,name,cls));
  holder.classList.remove('is-fallback');
  holder.classList.add('v704-has-team-logo');
  return true;
}
function text(el,sel){return String(el.querySelector(sel)?.textContent||'').trim()}

/* Campeones / ranking superior */
function patchRanking(root){
  root.querySelectorAll('.v340-champion-row').forEach(row=>{
    const name=text(row,'.v340-champion-name');
    forceHolder(row.querySelector('.v340-champion-logo'),name,'v704-ranking-logo');
  });
}

/* Temporadas por época */
function patchEra(root){
  root.querySelectorAll('.v341-era-item[data-v35-era-team]').forEach(card=>{
    forceHolder(card.querySelector('.v341-era-logo'),card.dataset.v35EraTeam||'','v704-era-logo');
  });
  root.querySelectorAll('.v328-season-item').forEach(card=>{
    const name=card.dataset.v328Team||text(card,'strong')||card.getAttribute('aria-label')?.split('·')[0]||'';
    forceHolder(card.querySelector('.v328-season-logo'),name,'v704-season-logo');
  });
  root.querySelectorAll('.v35-season-card').forEach(card=>{
    const name=card.dataset.v693Team||text(card,'.v35-season-team')||text(card,'h3')||'';
    if(name)forceHolder(card.querySelector('.v35-season-crest'),name,'v704-season-card-logo');
  });
}

/* Memoria de clubes + directorios históricos */
function patchArchives(root){
  root.querySelectorAll('.v370-legacy-team').forEach(card=>{
    forceHolder(card.querySelector('.v370-legacy-crest'),text(card,'.v370-legacy-copy strong'),'v704-legacy-logo');
  });
  root.querySelectorAll('.v35-era-team').forEach(card=>{
    const name=text(card,'b');
    const src=logoFor(name);
    if(!src)return;
    let holder=card.querySelector('.v35-era-fallback');
    const existing=card.querySelector(':scope > img');
    if(existing){
      if(!same(existing.currentSrc||existing.src,src))existing.src=src;
      existing.alt=name;existing.dataset.v704HistoryLogo='1';
      return;
    }
    if(holder){
      holder.replaceWith(img(src,name,'v704-directory-logo'));
    }else{
      card.prepend(img(src,name,'v704-directory-logo'));
    }
  });
  root.querySelectorAll('.v35-retro-club').forEach(card=>{
    const name=text(card,'.v35-retro-copy b');
    forceHolder(card.querySelector('.v35-retro-logo'),name,'v704-retro-logo');
  });
}

/* Récords: si no hay foto histórica real, usar sólo un escudo, nunca duplicado. */
function patchRecords(root){
  root.querySelectorAll('.v35-record-card').forEach(card=>{
    const name=text(card,'h3');
    const src=logoFor(name);
    if(!src)return;
    const mark=card.querySelector(':scope > .v35-record-mark');
    if(mark){
      mark.replaceWith(img(src,name,'v672-record-logo v704-record-logo'));
      return;
    }
    const main=card.querySelector(':scope > img');
    if(!main)return;
    const u=String(main.currentSrc||main.src||'').toLowerCase();
    const isPhoto=/\/assets\/history\/archive-v\d+\//.test(u);
    if(!isPhoto){
      if(!same(main.currentSrc||main.src,src))main.src=src;
      main.alt=name;main.dataset.v704HistoryLogo='1';
      card.querySelector('.v672-record-mini-logo')?.remove();
    }
  });
}

/* Finales: cubre las 4 generaciones de layout. */
function patchFinals(root){
  const defs=[
    ['.v358-team','.v358-final-crest'],
    ['.v355-final-team','.v355-final-crest'],
    ['.v330-team','.v330-crest'],
    ['.v329-team-line','.v329-final-crest']
  ];
  defs.forEach(([rowSel,crestSel])=>{
    root.querySelectorAll(rowSel).forEach(row=>{
      forceHolder(row.querySelector(crestSel),text(row,'strong'),'v704-final-logo');
    });
  });
}

/* Resumen estadístico de Historia */
function patchSummary(root){
  root.querySelectorAll('.v358-stat-row').forEach(row=>{
    const labels=[text(row,'.v358-stat-copy strong'),text(row,'.v358-stat-copy small')].filter(Boolean);
    const name=labels.find(x=>logoFor(x))||'';
    if(name)forceHolder(row.querySelector('.v358-stat-logo'),name,'v704-summary-logo');
  });
}

/* Vídeos: conserva la foto/miniatura y añade escudos de los equipos encima. */
function patchVideos(root){
  root.querySelectorAll('.v329-video-tile,.v329-video-classic').forEach(card=>{
    const title=text(card,'.v329-video-card-title')||card.getAttribute('aria-label')||'';
    const m=String(title).replace(/\s+/g,' ').match(/^(.+?)\s+vs\.?\s+(.+?)(?::|$)/i);
    if(!m)return;
    const teams=[m[1].trim(),m[2].trim()];
    const thumb=card.querySelector('.v329-video-thumb');
    if(!thumb)return;
    let strip=thumb.querySelector('.v672-video-crests,.v704-video-crests');
    if(!strip){strip=document.createElement('span');strip.className='v672-video-crests v704-video-crests';thumb.appendChild(strip)}
    strip.replaceChildren();
    teams.forEach(name=>{
      const src=logoFor(name);if(!src)return;
      const h=document.createElement('span');h.title=name;h.appendChild(img(src,name));strip.appendChild(h);
    });
  });
}

function patch(){
  if(route()!=='history')return;
  const root=document.querySelector('.v35-history-page')||document.querySelector('#screen');
  if(!root)return;
  patchRanking(root);
  patchEra(root);
  patchArchives(root);
  patchRecords(root);
  patchFinals(root);
  patchSummary(root);
  patchVideos(root);
}

let timer=0;
function schedule(delay=20){
  clearTimeout(timer);
  timer=setTimeout(()=>requestAnimationFrame(patch),delay);
}
function boot(){
  const target=document.querySelector('#screen')||document.body;
  new MutationObserver(schedule).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['src','class','hidden','data-v693-team']});
  window.addEventListener('hashchange',()=>schedule(30));
  window.addEventListener('load',()=>schedule(30));
  window.addEventListener('ljr:official-data',()=>schedule(30));
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-v35-tab],[data-v340-champion-cat],[data-v351-load-seasons],[data-v35-season],[data-route]')){
      schedule(30);setTimeout(patch,120);setTimeout(patch,400);
    }
  },true);
  schedule(0);setTimeout(patch,250);setTimeout(patch,900);setTimeout(patch,1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
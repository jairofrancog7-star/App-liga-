/* V704 — Historia: sincronización global de escudos históricos.
   Última capa: aplica los escudos ya confirmados en TODAS las vistas de Historia
   sin cambiar nombres, datos, fotos históricas ni el diseño. */
(function(){
'use strict';
if(window.__LJR_V704_HISTORY_LOGO_GLOBAL__)return;
window.__LJR_V704_HISTORY_LOGO_GLOBAL__=true;

const SPECIAL={
  'olimpicos':'./assets/history/team-logos/legacy-2015-olimpicos-pozos.webp',
  'olimpicos de pozos':'./assets/history/team-logos/legacy-2015-olimpicos-pozos.webp',
  'olimpicos pozos':'./assets/history/team-logos/legacy-2015-olimpicos-pozos.webp',
  'puros cuates':'./assets/history/team-logos/legacy-2015-puros-cuates.webp',
  'puros cuates fc':'./assets/history/team-logos/legacy-2015-puros-cuates.webp',
  'mazacotes':'./assets/history/team-logos/legacy-2015-mazacotes.webp',
  'mazacotes fc':'./assets/history/team-logos/legacy-2015-mazacotes.webp',
  'cerrito':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'cerrito de g':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'salvajes':'./assets/history/team-logos/salvajes.webp',
  'salvaje':'./assets/history/team-logos/salvajes.webp',
  'tecos':'./assets/history/team-logos/tecos.webp',
  'tecos fc':'./assets/history/team-logos/tecos.webp',
  'tecos jr':'./assets/history/team-logos/tecos.webp',
  'tecos jrs':'./assets/history/team-logos/tecos.webp',
  'tecos pozos':'./assets/history/team-logos/tecos.webp',
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

/* V715 — Récords: escudos de época recuperados directamente del rol oficial
   de Primera Fuerza del 24 de mayo de 2015 aportado por el usuario.
   Esta tabla es exclusiva de Récords para no sustituir escudos actuales en
   otras pantallas. */
const RECORDS_2015_SPECIAL={
  'el alto':'./assets/history/team-logos/legacy-2015-el-alto.webp',
  'el alto fc':'./assets/history/team-logos/legacy-2015-el-alto.webp',

  'hermanos':'./assets/history/team-logos/legacy-2015-hermanos.webp',
  'dep hermanos':'./assets/history/team-logos/legacy-2015-hermanos.webp',
  'deportivo hermanos':'./assets/history/team-logos/legacy-2015-hermanos.webp',

  'san antonio':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',
  'san antonio fc':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',
  'san antonio de romerillo':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',
  'san antonio romerillo':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',
  'sn antonio':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',

  'puros cuates':'./assets/history/team-logos/legacy-2015-puros-cuates.webp',
  'la pandilla':'./assets/history/team-logos/legacy-2015-la-pandilla.webp',
  'la pandilla fc':'./assets/history/team-logos/legacy-2015-la-pandilla.webp',

  'olimpicos':'./assets/history/team-logos/legacy-2015-olimpicos-pozos.webp',
  'olimpicos de pozos':'./assets/history/team-logos/legacy-2015-olimpicos-pozos.webp',

  'cerrito':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'cerrito de g':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'cerrito de gasca':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'cerrito de gasca fc':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'real cerrito':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'real cerrito de gasca':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'deportivo cerrito':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'dep cerrito':'./assets/history/team-logos/legacy-2015-cerrito.webp',

  'la esperanza':'./assets/history/team-logos/legacy-2015-la-esperanza.webp',
  'la esperanza fc':'./assets/history/team-logos/legacy-2015-la-esperanza.webp',

  'psv':'./assets/history/team-logos/legacy-2015-psv.webp',
  'psv eindhoven':'./assets/history/team-logos/legacy-2015-psv.webp',

  'juventus':'./assets/history/team-logos/legacy-2015-juventus.webp',
  'juventus fc':'./assets/history/team-logos/legacy-2015-juventus.webp',

  'chelsea':'./assets/history/team-logos/legacy-2015-chelsea.webp',
  'chelsea fc':'./assets/history/team-logos/legacy-2015-chelsea.webp',
  'chelse':'./assets/history/team-logos/legacy-2015-chelsea.webp',

  'linces':'./assets/history/team-logos/legacy-2015-linces.webp',
  'linces fc':'./assets/history/team-logos/legacy-2015-linces.webp',
  'linces de pozos':'./assets/history/team-logos/legacy-2015-linces.webp',

  'abejas':'./assets/history/team-logos/legacy-2015-abejas.webp',
  'abejas pozos':'./assets/history/team-logos/legacy-2015-abejas.webp',
  'abejas de pozos':'./assets/history/team-logos/legacy-2015-abejas.webp',

  'napoli':'./assets/history/team-logos/legacy-2015-napoli.webp',
  'napoli fc':'./assets/history/team-logos/legacy-2015-napoli.webp',

  'boavista':'./assets/history/team-logos/legacy-2015-boavista.webp',
  'boavista fc':'./assets/history/team-logos/legacy-2015-boavista.webp'
}

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
  if(n==='a pozos'||n.includes('atletico pozos'))out.push('Atlético Pozos','A. Pozos');
  if(n.includes('dep lagartos'))out.push('Deportivo Lagartos');
  if(n.includes('herbalife'))out.push('Herbalife','Herbalife SC');
  if(n.includes('inter de milan'))out.push('Inter de Milán');
  if(n.includes('olimpicos'))out.push('Olímpicos de Pozos','Olímpicos');
  if(n.includes('puros cuates'))out.push('Puros Cuates');
  if(n.includes('mazacotes'))out.push('Mazacotes FC','Mazacotes');
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
function recordLogoFor(name){
  for(const a of aliases(name)){
    const src=RECORDS_2015_SPECIAL[norm(a)];
    if(src)return src;
  }
  return logoFor(name);
}

function recordLogoFromCardText(card){
  const direct=text(card,'h3');
  const directSrc=recordLogoFor(direct);
  if(directSrc)return {name:direct,src:directSrc};

  const hay=norm(card?.textContent||'');
  const keys=Object.keys(RECORDS_2015_SPECIAL)
    .sort((a,b)=>b.length-a.length);
  for(const key of keys){
    if(!key || key.length<4)continue;
    if(hay.includes(key)){
      return {name:key,src:RECORDS_2015_SPECIAL[key]};
    }
  }
  return {name:'',src:''};
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
  const all=[...holder.querySelectorAll('img')];
  const current=all[0]||null;
  if(current&&same(current.currentSrc||current.src,src)){
    all.slice(1).forEach(x=>x.remove());
    holder.querySelectorAll(':scope > b,:scope > .v328-season-initials,:scope > .v35-era-fallback').forEach(x=>x.remove());
    current.alt=name;
    current.loading='lazy';
    current.decoding='async';
    current.dataset.v704HistoryLogo='1';
    if(cls)current.className=cls;
    holder.classList.remove('is-fallback');
    holder.classList.add('v704-has-team-logo');
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
    const hit=recordLogoFromCardText(card);
    const name=hit.name,src=hit.src;
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
    if(isPhoto){
      let mini=card.querySelector('.v672-record-mini-logo');
      if(!mini){
        mini=document.createElement('span');
        mini.className='v672-record-mini-logo';
        card.appendChild(mini);
      }
      const current=mini.querySelector('img');
      if(current){
        if(!same(current.currentSrc||current.src,src))current.src=src;
        current.alt=name;
      }else{
        mini.appendChild(img(src,name));
      }
      return;
    }
    if(!same(main.currentSrc||main.src,src))main.src=src;
    main.alt=name;main.dataset.v704HistoryLogo='1';
    card.querySelector('.v672-record-mini-logo')?.remove();
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
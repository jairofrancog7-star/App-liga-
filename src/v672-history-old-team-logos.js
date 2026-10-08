/* V672 — Historia: escudos históricos recuperados.
   Completa Récords, Finales, Vídeos y Memoria de clubes con los escudos que
   ya existen en el archivo de la Liga. No inventa escudos para clubes sin
   identificación documental. */
(function(){
'use strict';
if(window.__LJR_V672_HISTORY_OLD_TEAM_LOGOS__)return;
window.__LJR_V672_HISTORY_OLD_TEAM_LOGOS__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const USER_ALIAS={
  'real de roque':'./assets/history/team-logos/real-de-roque.webp',
  'la pandilla':'./assets/history/team-logos/legacy-2015-la-pandilla.webp',
  'la pandilla de morales':'./assets/history/team-logos/legacy-2015-la-pandilla.webp',
  'la pandilla morales':'./assets/history/team-logos/legacy-2015-la-pandilla.webp',
  'pandilla de morales':'./assets/history/team-logos/legacy-2015-la-pandilla.webp',
  'olimpicos':'./assets/history/team-logos/legacy-2015-olimpicos-pozos.webp',
  'olimpicos de pozos':'./assets/history/team-logos/legacy-2015-olimpicos-pozos.webp',
  'puros cuates':'./assets/history/team-logos/legacy-2015-puros-cuates.webp',
  'mazacotes':'./assets/history/team-logos/legacy-2015-mazacotes.webp',
  'mazacotes fc':'./assets/history/team-logos/legacy-2015-mazacotes.webp',
  'cerrito':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'cerrito de g':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'cerrito de gasca':'./assets/history/team-logos/legacy-2015-cerrito.webp',
  'el alto':'./assets/history/team-logos/legacy-2015-el-alto.webp',
  'juventus':'./assets/history/team-logos/legacy-2015-juventus.webp',
  'linces':'./assets/history/team-logos/legacy-2015-linces.webp',
  'san antonio':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',
  'san antonio de romerillo':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',
  'sn antonio':'./assets/history/team-logos/legacy-2015-san-antonio-romerillo.webp',
  'salvajes':'',
  'salvaje':'',
  'universidad':'./assets/history/team-logos/universidad-pumas.webp',
  'unam':'./assets/history/team-logos/universidad-pumas.webp',
  'pumas':'./assets/history/team-logos/universidad-pumas.webp',
  'pumas unam':'./assets/history/team-logos/universidad-pumas.webp',
  'xolos jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  'jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  'jaralillo fc':'./assets/history/team-logos/xolos-jaralillo.webp',
  'jaralillo f c':'./assets/history/team-logos/xolos-jaralillo.webp',
  'xolos de jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  'xolos':'./assets/history/team-logos/xolos-jaralillo.webp',
  'xoloitzcuintles':'./assets/history/team-logos/xolos-jaralillo.webp',
  'club tijuana':'./assets/history/team-logos/xolos-jaralillo.webp',
  'tecos':'./assets/history/team-logos/tecos.webp',
  'tecos fc':'./assets/history/team-logos/tecos.webp',
  'tecos jr':'./assets/history/team-logos/tecos.webp',
  'tecos jrs':'./assets/history/team-logos/tecos.webp',
  'tecos pozos':'./assets/history/team-logos/tecos.webp'
};
const FALLBACK={
  'capibaras':RAW+'assets/official-logos/capibaras.png',
  'la canchita deportes':RAW+'assets/official-logos/la-canchita-deportes.png',
  'la canchita':RAW+'assets/official-logos/la-canchita-deportes.png',
  'terricolas':RAW+'assets/official-logos/terricolas.png',
  'terricolas seder':RAW+'assets/official-logos/terricolas.png',
  'abejas':RAW+'assets/official-logos/abejas.png',
  'america':RAW+'assets/branding/america-veteranos-35-user.png',
  'america veteranos':RAW+'assets/branding/america-veteranos-35-user.png',
  'romerillo':RAW+'assets/official-logos/san-antonio-jrs.png',
  'san antonio de romerillo':RAW+'assets/official-logos/san-antonio-jrs.png',
  'san antonio jr':RAW+'assets/official-logos/san-antonio-jrs.png',
  'san antonio jrs':RAW+'assets/official-logos/san-antonio-jrs.png',
  'san antonio':RAW+'assets/official-logos/san-antonio-fc.png',
  'linces':RAW+'assets/official-logos/linces.png',
  'hermanos':RAW+'assets/official-logos/hermanos.png',
  'hermanos fc':RAW+'assets/official-logos/hermanos.png',
  'dep hermanos':RAW+'assets/official-logos/hermanos.png',
  'deportivo hermanos':RAW+'assets/official-logos/hermanos.png',
  'la esperanza':RAW+'assets/official-logos/la-esperanza.png',
  'la esperanza fc':RAW+'assets/official-logos/la-esperanza.png',
  'populares':RAW+'assets/official-logos/populares.png',
  'juventus':RAW+'assets/official-logos/juventus.png',
  'boavista':RAW+'assets/official-logos/boavista.png',
  'boavista fc':RAW+'assets/official-logos/boavista.png',
  'lobos cdg':RAW+'assets/official-logos/lobos-cdg.png',
  'galacticos':RAW+'assets/teams/galacticos-pozos.webp',
  'galacticos de pozos':RAW+'assets/teams/galacticos-pozos.webp',
  'galacticos pozos':RAW+'assets/teams/galacticos-pozos.webp',
  'herreras fc':RAW+'assets/official-logos/herreras-fc.png',
  'herrera fc':RAW+'assets/official-logos/herreras-fc.png',
  'lobos jrs':RAW+'assets/teams/lobos-jr-cerrito-gasca.webp',
  'lobos jr':RAW+'assets/teams/lobos-jr-cerrito-gasca.webp',
  'la huerta':RAW+'assets/official-logos/la-huerta.png',
  'la huerta cuenda':RAW+'assets/official-logos/la-huerta.png',
  'pozos':'./assets/season-2026/pozos.webp',
  'pozos fc':'./assets/season-2026/pozos.webp',
  'deportivo pozos':'./assets/season-2026/pozos.webp',
  'dep pozos':'./assets/season-2026/pozos.webp',
  'cuenda':RAW+'assets/official-logos/cuenda.png',
  'promesas':RAW+'assets/official-logos/promesas-fc.png',
  'promesas fc':RAW+'assets/official-logos/promesas-fc.png',
  'promesas de pozos':RAW+'assets/official-logos/promesas-fc.png',
  'atletico galeana':RAW+'assets/official-logos/galeana.png',
  'atl galeana':RAW+'assets/official-logos/galeana.png',
  'galeana':RAW+'assets/official-logos/galeana.png',
  'oklahoma':RAW+'assets/teams/oklahoma-city-fc.webp',
  'oklahoma fc':RAW+'assets/teams/oklahoma-city-fc.webp',
  'franco fc':RAW+'assets/official-logos/franco-fc.png',
  'manchester':RAW+'assets/official-logos/manchester.png',
  'manchester united':RAW+'assets/teams/manchester-united.webp',
  'man united':RAW+'assets/teams/manchester-united.webp',
  'abejas':RAW+'assets/official-logos/abejas.png',
  'abejas fc':RAW+'assets/official-logos/abejas.png',
  'psv':RAW+'assets/official-logos/psv.png',
  'psv eindhoven':RAW+'assets/official-logos/psv.png',
  'psv-eindhoven':RAW+'assets/official-logos/psv.png',
  'tavera':RAW+'assets/official-logos/tavera-fc.png',
  'tavera fc':RAW+'assets/official-logos/tavera-fc.png',
  'san julian':RAW+'assets/official-logos/san-julian.png',
  'san julian fc':RAW+'assets/official-logos/san-julian.png',
  'san jose de la montana':RAW+'assets/teams/san-jose-montana.webp',
  'real cerrito de gasca':RAW+'assets/teams/deportivo-cg.webp',
  'deportivo cg':RAW+'assets/teams/deportivo-cg.webp',
  'chelsea':'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  'chelse':'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'
};

/* Sólo relaciones documentadas en el archivo recuperado. */
const RECORD_TEAM_BY_TITLE={
  'romerillo':'Romerillo',
  'linces':'Linces',
  'hermanos':'Hermanos',
  'la esperanza':'La Esperanza',
  'alejandro juarez merino':'Populares',
  'juventus':'Juventus',
  'boavista':'Boavista',
  'boavista fc':'Boavista FC',
  'lobos cdg':'Lobos CDG',
  'galacticos pozos':'Galácticos de Pozos',
  'galacticos de pozos':'Galácticos de Pozos',
  'herreras fc':'Herreras FC',
  'lobos jrs':'Lobos Jrs.'
};

function route(){
  return (location.hash.replace(/^#\/?/,'')||document.body?.dataset?.appRoute||'home').split('?')[0];
}
function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
function cleanTeam(v){
  return String(v||'')
    .replace(/^\s*(?:campe[oó]n|subcampe[oó]n|primer lugar|tercer lugar)\s*:\s*/i,'')
    .replace(/\s*\([^)]*\)\s*/g,' ')
    .replace(/\s*·.*$/,'')
    .trim();
}
function candidates(name){
  const raw=String(name||'').trim(),clean=cleanTeam(raw);
  const out=[raw,clean];
  const n=norm(clean);
  if(n.includes('galacticos'))out.push('Galácticos de Pozos','Galácticos');
  if(n.includes('lobos cdg'))out.push('Lobos CDG');
  if(n.includes('promesas'))out.push('Promesas FC','Promesas');
  if(n.includes('galeana'))out.push('Atlético Galeana','Galeana');
  if(n.includes('pozos')&&n!=='galacticos pozos')out.push('Pozos');
  return [...new Set(out.filter(Boolean))];
}
function logoFor(name){
  const supplied=window.LJR_SEASON_LOGOS?.get(name);if(supplied)return supplied;
  for(const c of candidates(name)){
    const supplied=USER_ALIAS[norm(c)];
    if(supplied)return supplied;
    try{
      const src=window.LJR_TEAM_LOGOS?.get?.(c);
      if(src)return src;
    }catch(_){}
    try{
      const src=window.LJR_OFFICIAL_API?.getLogo?.(c);
      if(src)return src;
    }catch(_){}
    const direct=FALLBACK[norm(c)];
    if(direct)return direct;
  }
  return '';
}
function makeImg(src,name,cls=''){
  const img=document.createElement('img');
  img.src=src;
  img.alt=name||'Escudo histórico';
  img.loading='lazy';
  img.decoding='async';
  if(cls)img.className=cls;
  img.addEventListener('error',()=>img.remove(),{once:true});
  return img;
}
function recordTeam(card){
  const title=card.querySelector('h3')?.textContent?.trim()||'';
  const mapped=RECORD_TEAM_BY_TITLE[norm(title)];
  if(mapped)return mapped;
  return logoFor(title)?title:'';
}
function patchRecords(root){
  root.querySelectorAll('.v35-record-card').forEach(card=>{
    const team=recordTeam(card);
    if(!team)return;
    const src=logoFor(team);
    if(!src)return;
    const mark=card.querySelector(':scope > .v35-record-mark');
    if(mark){
      const img=makeImg(src,team,'v672-record-logo');
      img.dataset.v672HistoricalLogo='1';
      mark.replaceWith(img);
      return;
    }
    const visual=card.querySelector(':scope > img');
    if(!visual)return;

    /* V690 — Regla global de Récords:
       - Si la imagen principal es un escudo/logo, mostrar SOLO esa imagen.
       - El mini escudo se permite únicamente cuando la imagen principal es una
         fotografía histórica real guardada en assets/history/archive-* (o una
         fotografía histórica equivalente), nunca cuando ya hay un escudo.
       Esto evita Linces + Linces, Hermanos + Hermanos, Boavista + Boavista, etc. */
    const visualUrl=String(visual.currentSrc||visual.getAttribute('src')||visual.src||'');
    const normalizedVisual=visualUrl.toLowerCase();
    const looksLikeLogo=
      visual.matches('.v672-record-logo,[data-v672-historical-logo="1"]') ||
      /\/assets\/(?:official-logos|teams|branding)\//.test(normalizedVisual) ||
      /\/assets\/history\/team-logos\//.test(normalizedVisual) ||
      /\/logos\//.test(normalizedVisual) ||
      /cloudinary\.com\/.*\/logos\//.test(normalizedVisual);

    const looksLikeHistoricPhoto=
      !looksLikeLogo && (
        /\/assets\/history\/archive-v\d+\//.test(normalizedVisual) ||
        /\/assets\/history\/[^/?#]+\.(?:jpe?g|png|webp)(?:[?#]|$)/.test(normalizedVisual)
      );

    if(!looksLikeHistoricPhoto){
      card.querySelector('.v672-record-mini-logo')?.remove();
      return;
    }

    let sameLogo=visual.matches('.v672-record-logo,[data-v672-historical-logo="1"]');
    if(!sameLogo){
      try{
        sameLogo=new URL(visual.currentSrc||visual.src,document.baseURI).href===new URL(src,document.baseURI).href;
      }catch(_){}
    }
    if(sameLogo){
      card.querySelector('.v672-record-mini-logo')?.remove();
      return;
    }
    if(card.querySelector('.v672-record-mini-logo'))return;
    const badge=document.createElement('span');
    badge.className='v672-record-mini-logo';
    badge.title='Escudo histórico · '+team;
    badge.appendChild(makeImg(src,team));
    card.appendChild(badge);
  });
}
function patchFinalTeam(teamRow,crestSelector){
  const name=teamRow.querySelector('strong')?.textContent?.trim()||'';
  if(!name)return;
  const src=logoFor(name);
  if(!src)return;
  const crest=teamRow.querySelector(crestSelector);
  if(!crest)return;
  const existing=crest.querySelector('img');
  if(existing){
    if(existing.dataset.v672HistoricalLogo==='1')return;
    return;
  }
  const img=makeImg(src,name,'v672-final-logo');
  img.dataset.v672HistoricalLogo='1';
  crest.appendChild(img);
  (!crest.classList.contains('v672-has-historic-logo')&&crest.classList.add('v672-has-historic-logo'));
}
function patchFinals(root){
  root.querySelectorAll('.v358-team').forEach(x=>patchFinalTeam(x,'.v358-final-crest'));
  root.querySelectorAll('.v330-team').forEach(x=>patchFinalTeam(x,'.v330-crest'));
  root.querySelectorAll('.v329-team-line').forEach(x=>patchFinalTeam(x,'.v329-final-crest'));
}
function parseVideoTeams(title){
  const text=String(title||'').replace(/\s+/g,' ').trim();
  const m=text.match(/^(.+?)\s+vs\.?\s+(.+?)(?::|$)/i);
  if(!m)return [];
  return [m[1].trim(),m[2].trim()];
}
function patchVideos(root){
  root.querySelectorAll('.v329-video-tile,.v329-video-classic').forEach(card=>{
    if(card.querySelector('.v672-video-crests'))return;
    const title=card.querySelector('.v329-video-card-title')?.textContent||card.getAttribute('aria-label')||'';
    const teams=parseVideoTeams(title);
    if(teams.length!==2)return;
    const logos=teams.map(name=>({name,src:logoFor(name)})).filter(x=>x.src);
    if(!logos.length)return;
    const thumb=card.querySelector('.v329-video-thumb');
    if(!thumb)return;
    const strip=document.createElement('span');
    strip.className='v672-video-crests';
    logos.slice(0,2).forEach(x=>{
      const holder=document.createElement('span');
      holder.title=x.name;
      holder.appendChild(makeImg(x.src,x.name));
      strip.appendChild(holder);
    });
    thumb.appendChild(strip);
  });
}
function patchLegacyTeams(root){
  root.querySelectorAll('.v370-legacy-team').forEach(card=>{
    const name=card.querySelector('.v370-legacy-copy strong')?.textContent?.trim()||'';
    const crest=card.querySelector('.v370-legacy-crest');
    if(!name||!crest)return;
    const forced=USER_ALIAS[norm(name)]||'';
    const src=forced||logoFor(name);
    if(!src)return;

    const current=crest.querySelector('img');
    if(current){
      if(forced){
        let same=false;
        try{same=new URL(current.currentSrc||current.src,document.baseURI).href===new URL(forced,document.baseURI).href}catch(_){}
        if(!same){
          current.src=forced;
          current.alt=name;
          current.dataset.v672UserHistoric='1';
        }
        (crest.classList.contains('is-fallback')&&crest.classList.remove('is-fallback'));
        (!crest.classList.contains('v672-has-historic-logo')&&crest.classList.add('v672-has-historic-logo'));
      }
      return;
    }

    const img=makeImg(src,name,'v672-legacy-logo');
    if(forced)img.dataset.v672UserHistoric='1';
    crest.appendChild(img);
    (crest.classList.contains('is-fallback')&&crest.classList.remove('is-fallback'));
    (!crest.classList.contains('v672-has-historic-logo')&&crest.classList.add('v672-has-historic-logo'));
  });
}
function patchEraSeasons(root){
  root.querySelectorAll('.v341-era-item[data-v35-era-team]').forEach(card=>{
    const team=String(card.dataset.v35EraTeam||'').trim();
    if(!team)return;
    const src=logoFor(team);
    if(!src)return;
    const holder=card.querySelector('.v341-era-logo');
    if(!holder)return;
    const current=holder.querySelector('img');
    if(current){
      let same=false;
      try{same=new URL(current.currentSrc||current.src,document.baseURI).href===new URL(src,document.baseURI).href}catch(_){}
      if(same){
        (holder.classList.contains('is-fallback')&&holder.classList.remove('is-fallback'));
        return;
      }
    }
    const img=makeImg(src,team,'v672-era-logo');
    img.dataset.v672HistoricalLogo='1';
    holder.replaceChildren(img);
    (holder.classList.contains('is-fallback')&&holder.classList.remove('is-fallback'));
    (!holder.classList.contains('v672-has-historic-logo')&&holder.classList.add('v672-has-historic-logo'));
  });
}
function patchSummaryStats(root){
  root.querySelectorAll('.v358-stat-row').forEach(row=>{
    const holder=row.querySelector('.v358-stat-logo');
    if(!holder)return;
    const labels=[
      row.querySelector('.v358-stat-copy small')?.textContent?.trim()||'',
      row.querySelector('.v358-stat-copy strong')?.textContent?.trim()||''
    ].filter(Boolean);
    let team='',src='';
    for(const label of labels){
      const hit=logoFor(label);
      if(hit){team=label;src=hit;break;}
    }
    if(!src)return;
    const current=holder.querySelector('img');
    if(current){
      try{
        if(new URL(current.currentSrc||current.src,document.baseURI).href===new URL(src,document.baseURI).href)return;
      }catch(_){}
    }
    holder.replaceChildren(makeImg(src,team,'v672-summary-stat-logo'));
    (holder.classList.contains('is-fallback')&&holder.classList.remove('is-fallback'));
    (!holder.classList.contains('v672-has-historic-logo')&&holder.classList.add('v672-has-historic-logo'));
  });
}
function patch(){
  if(route()!=='history')return;
  const root=document.querySelector('.v35-history-page')||document.querySelector('#screen');
  if(!root)return;
  patchRecords(root);
  patchFinals(root);
  patchVideos(root);
  /* V724: Memoria de clubes la controla únicamente V704 para evitar doble escudo/parpadeo. */
  patchEraSeasons(root);
  patchSummaryStats(root);
}
let timer=0;
function schedule(ms=40){
  clearTimeout(timer);
  timer=setTimeout(()=>requestAnimationFrame(patch),ms);
}
function boot(){
  const screen=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(45)).observe(screen,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>schedule(60));
  window.addEventListener('ljr:official-data',()=>schedule(60));
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-v35-tab],[data-route]'))schedule(85);
  },true);
  schedule(20);
  setTimeout(patch,300);
  setTimeout(patch,1000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
/* V358 — Historia > Finales.
   Restaura el diseño agrupado por década/temporada de la referencia del usuario
   sin MutationObserver ni trabajo continuo en scroll. */
(function(){
'use strict';
if(window.__LJR_V358_HISTORY_FINALS_REFERENCE__)return;
window.__LJR_V358_HISTORY_FINALS_REFERENCE__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const FALLBACK={
  'hermanos':RAW+'assets/official-logos/hermanos.png',
  'deportivo hermanos':RAW+'assets/official-logos/hermanos.png',
  'dep. hermanos':RAW+'assets/official-logos/hermanos.png',
  'juventus':RAW+'assets/official-logos/juventus.png',
  'abejas fc':RAW+'assets/official-logos/abejas.png',
  'abejas':RAW+'assets/official-logos/abejas.png',
  'boavista':RAW+'assets/official-logos/boavista.png',
  'boavista fc':RAW+'assets/official-logos/boavista.png',
  'valencia':RAW+'assets/official-logos/valencia.png',
  'la esperanza':RAW+'assets/official-logos/la-esperanza.png',
  'manchester':RAW+'assets/official-logos/manchester.png',
  'linces':RAW+'assets/official-logos/linces.png',
  'franco fc':RAW+'assets/official-logos/franco-fc.png',
  'promesas de pozos':RAW+'assets/official-logos/promesas-fc.png',
  'promesas fc':RAW+'assets/official-logos/promesas-fc.png',
  'lobos cdg':RAW+'assets/official-logos/lobos-cdg.png',
  'cuenda':RAW+'assets/official-logos/cuenda.png',
  'la huerta':RAW+'assets/official-logos/la-huerta.png'
};

const MONTHS={ene:1,feb:2,mar:3,abr:4,may:5,jun:6,jul:7,ago:8,sep:9,sept:9,oct:10,nov:11,dic:12};

function route(){return (location.hash.replace(/^#\//,'')||'home').split('?')[0]}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function esc(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(name){
  return String(name||'JR').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+/g,' ').trim()
    .split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JR';
}
function logoFor(name){
  try{
    const shared=window.LJR_TEAM_LOGOS?.get?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name);
    if(shared)return shared;
  }catch(_){}
  const n=norm(name);
  return Object.entries(FALLBACK).find(([k])=>n===k||n.includes(k))?.[1]||'';
}
function crest(name){
  const src=logoFor(name);
  return '<span class="v358-final-crest"><b>'+esc(initials(name))+'</b>'+
    (src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">':'')+
  '</span>';
}
function splitMatch(title){
  const raw=String(title||'').trim();
  let m=raw.match(/^(.*?)\s+(\d+)\s*[–-]\s*(\d+)\s+(.*)$/);
  if(m)return {a:m[1].trim(),b:m[4].trim(),sa:m[2],sb:m[3]};
  const p=raw.split(/\s+vs\.?\s+/i);
  if(p.length===2)return {a:p[0].trim(),b:p[1].trim(),sa:'',sb:''};
  return {a:raw,b:'',sa:'',sb:''};
}
function yearFrom(value){
  const years=String(value||'').match(/\b(?:19|20)\d{2}\b/g);
  return years?.length?Number(years[years.length-1]):0;
}
function dateRank(value,year){
  const n=norm(value);
  const m=n.match(/(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)[a-z]*\s+((?:19|20)\d{2})/);
  if(m)return Number(m[3])*10000+(MONTHS[m[2]]||0)*100+Number(m[1]);
  return year?year*10000:0;
}
function compactSeason(raw,date){
  const s=String(raw||'').trim();
  const pair=s.match(/\b(20\d{2})\D+(20\d{2}|\d{2})\b/);
  if(pair)return pair[1]+'/'+String(pair[2]).slice(-2);
  const one=s.match(/\b(20\d{2})\b/);
  if(one)return one[1];
  const y=yearFrom(date);
  return y?String(y):'Archivo histórico';
}
function rowFromNode(row,i){
  const title=row.querySelector('h3')?.textContent?.trim()||'Final histórica';
  const subtitle=row.querySelector('strong')?.textContent?.trim()||'';
  const detail=row.querySelector('p')?.textContent?.trim()||'';
  const kind=row.querySelector('.v35-history-kind')?.textContent?.trim()||'FINAL';
  const date=row.dataset.v35FinalDate||row.querySelector('time')?.textContent?.trim()||'Archivo histórico';
  const season=compactSeason(row.dataset.v35FinalSeason||'',date);
  const year=yearFrom(date)||yearFrom(season);
  const match=splitMatch(title);
  return {
    i,title,subtitle,detail,kind,date,season,year,
    rank:dateRank(date,year),
    decade:year?String(Math.floor(year/10)*10)+'s':'Archivo',
    photo:row.dataset.v35FinalPhoto||'',
    match
  };
}
function sideHtml(r){
  if(r.photo){
    return '<button type="button" class="v358-final-preview" data-v358-details="'+r.i+'" aria-expanded="false" aria-label="Ver detalles">'+
      '<img src="'+esc(r.photo)+'" alt="" loading="lazy" decoding="async">'+
      '<span aria-hidden="true">▶</span>'+
    '</button>';
  }
  return '<div class="v358-final-side"><span>Final</span><button type="button" data-v358-details="'+r.i+'" aria-expanded="false">Ver detalles</button></div>';
}
function rowHtml(r){
  const m=r.match;
  const b=m.b||r.subtitle||'Archivo de la Liga';
  return '<article class="v358-final-row">'+
    '<div class="v358-season">Temporada '+esc(r.season)+'</div>'+
    '<div class="v358-row-main">'+
      '<div class="v358-teams">'+
        '<div class="v358-team">'+crest(m.a)+'<strong>'+esc(m.a)+'</strong><em>'+esc(m.sa)+'</em></div>'+
        '<div class="v358-team">'+crest(b)+'<strong>'+esc(b)+'</strong><em>'+esc(m.sb)+'</em></div>'+
      '</div>'+
      sideHtml(r)+
    '</div>'+
    '<div class="v358-detail"><div><b>'+esc(r.kind)+'</b><small>'+esc(r.date)+'</small>'+
      (r.subtitle?'<strong>'+esc(r.subtitle)+'</strong>':'')+
      (r.detail?'<p>'+esc(r.detail)+'</p>':'')+
    '</div></div>'+
  '</article>';
}
function shellHtml(rows){
  const groups=new Map();
  rows.forEach(r=>{
    if(!groups.has(r.decade))groups.set(r.decade,[]);
    groups.get(r.decade).push(r);
  });
  const keys=[...groups.keys()].sort((a,b)=>{
    if(a==='Archivo')return 1;
    if(b==='Archivo')return -1;
    return Number.parseInt(b)-Number.parseInt(a);
  });
  return '<section class="v358-finals-shell" aria-label="Finales históricas">'+keys.map(k=>
    '<article class="v358-decade"><h2>'+esc(k)+'</h2><div>'+groups.get(k).map(rowHtml).join('')+'</div></article>'
  ).join('')+'</section>';
}
function apply(){
  if(route()!=='history')return;
  const root=document.querySelector('.v35-history-page');
  if(!root)return;
  const active=root.querySelector('.v35-tabs .v35-tab.active');
  if(norm(active?.dataset?.v35Tab||active?.textContent)!=='finales')return;
  root.classList.add('v329-finals-image1','v358-finals-reference');

  const content=root.querySelector('[data-v35-content]');
  if(!content)return;
  /* V359_FINALS_PANEL_SCOPE — con pestañas persistentes, trabajar sólo dentro
     del panel Finales activo para no recorrer archivos ocultos de Resumen/Campeones. */
  const panel=content.querySelector('.v351-history-panel.is-active')||content;
  panel.querySelectorAll('.v329-finals-shell').forEach(x=>x.remove());
  if(panel.querySelector('.v358-finals-shell'))return;

  const source=[...panel.querySelectorAll('.v35-history-archive .v35-history-moment')];
  if(!source.length)return;
  const rows=source.map(rowFromNode).sort((a,b)=>(b.rank-a.rank)||(a.i-b.i));

  /* V365 — La referencia compacta va arriba; el archivo que ya existía
     se conserva debajo, sin duplicar datos ni reconstruir Historia. */
  const archives=[...panel.querySelectorAll('.v35-history-archive')];
  archives.forEach((archive,index)=>{
    archive.classList.add('v365-finals-previous');
    if(index===0&&!archive.querySelector('.v365-finals-previous-head')){
      archive.insertAdjacentHTML('afterbegin',
        '<div class="v365-finals-previous-head">'+
          '<span>ARCHIVO ANTERIOR</span>'+
          '<h2>Más finales e información</h2>'+
          '<p>Se conserva aquí el contenido histórico que ya estaba guardado.</p>'+
        '</div>'
      );
    }
  });

  const intro=panel.querySelector('.v35-tab-body');
  if(intro)intro.classList.add('v365-finals-intro');
  panel.classList.add('v365-finals-panel-ready');
  panel.insertAdjacentHTML('afterbegin',shellHtml(rows));
}
function clear(){
  const root=document.querySelector('.v35-history-page');
  root?.classList.remove('v329-finals-image1','v358-finals-reference');
  root?.querySelectorAll('.v365-finals-panel-ready').forEach(x=>x.classList.remove('v365-finals-panel-ready'));
}

window.LJR_APPLY_HISTORY_FINALS_REFERENCE=apply;
window.LJR_CLEAR_HISTORY_FINALS_REFERENCE=clear;

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-v358-details]');
  if(!b)return;
  e.preventDefault();
  e.stopPropagation();
  const row=b.closest('.v358-final-row');
  if(!row)return;
  const open=!row.classList.contains('is-open');
  row.classList.toggle('is-open',open);
  b.setAttribute('aria-expanded',String(open));
  if(b.matches('.v358-final-side button'))b.textContent=open?'Ocultar':'Ver detalles';
},true);
})();
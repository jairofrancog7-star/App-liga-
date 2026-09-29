/* V328 — Historia > Temporadas
   Reconstrucción compacta basada en la referencia móvil del usuario.
   Muestra campeones documentados por década, con escudo real y fecha exacta,
   ordenados de más reciente a más antiguo. No modifica Campeones/Finales/Récords. */
(function(){
'use strict';
if(window.__LJR_V328_HISTORY_SEASONS__) return;
window.__LJR_V328_HISTORY_SEASONS__=true;

const MONTHS={ene:0,feb:1,mar:2,abr:3,may:4,jun:5,jul:6,ago:7,sep:8,sept:8,oct:9,nov:10,dic:11};

const ANCHORS=[
  {team:'Deportivo CG · Cerrito de Gasca',date:'19 sep 2026',season:'2025/26',title:'Campeón de Liga · Veteranos 35 y más + Campeón de Campeones'},
  {team:'La Canchita Deportes',date:'07 jun 2026',season:'2025/26',title:'Campeón de Liga · Segunda Fuerza'},
  {team:'Franco FC',date:'10 may 2026',season:'2025/26',title:'Campeón de Liga · Fuerza Intermedia'},
  {team:'Linces',date:'15 mar 2026',season:'2025/26',title:'Campeón de Liga · Primera Fuerza'},
  {team:'Manchester',date:'26 abr 2025',season:'2025',title:'Campeón de Campeones · Veteranos 50 y más'},
  {team:'Boavista FC',date:'12 abr 2025',season:'2025',title:'Campeón de Liga · Veteranos 50 y más'},
  {team:'Juventus',date:'01 feb 2025',season:'2025',title:'Campeón de Copa · Veteranos 35 y más'},
  {team:'Promesas de Pozos',date:'17 nov 2024',season:'2024',title:'Campeón de Liga · Segunda Fuerza'},
  {team:'Juventus',date:'21 sep 2024',season:'2024',title:'Campeón de Campeones'},
  {team:'Barza',date:'23 jul 2023',season:'2022/23',title:'Campeón de Campeones · Fuerza Intermedia'},
  {team:'Juventus',date:'02 oct 2022',season:'2022',title:'Campeón de Copa · Primera Fuerza'},
  {team:'La Esperanza',date:'25 sep 2021',season:'2020/21',title:'Campeón de Liga · Veteranos'},
  {team:'Juventus',date:'16 feb 2020',season:'2019/20',title:'Campeón de Copa · Primera Fuerza'},
  {team:'Juventus',date:'03 nov 2019',season:'2018/19',title:'Campeón de Liga'},
  {team:'Tecos',date:'15 jun 2018',season:'2018',title:'Campeón · Torneo de Liga'},
  {team:'Real DHP',date:'31 dic 2017',season:'2017',title:'Campeón de Copa · Fuerza Intermedia'},
  {team:'La Esperanza',date:'28 feb 2016',season:'2016',title:'Campeón · Veteranos'},
  {team:'Boavista',date:'11 ene 2015',season:'2015',title:'Campeón · Primera Fuerza'},
  {team:'La Esperanza',date:'14 jun 2014',season:'2014',title:'Campeón de Copa · Veteranos'},
  {team:'Real Cerrito de Gasca',date:'15 dic 2013',season:'2013',title:'Campeón · Segunda Fuerza'},
  {team:'Tavera FC',date:'11 dic 2012',season:'2012',title:'Campeón de Copa · Segunda Fuerza'}
];

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
function parseDate(text){
  const s=norm(text);
  const m=s.match(/\b(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)[a-z]*\s+(\d{4})\b/);
  if(!m) return null;
  const day=Number(m[1]),month=MONTHS[m[2]],year=Number(m[3]);
  if(!Number.isFinite(day)||month==null||!Number.isFinite(year)) return null;
  return {day,month,year,stamp:Date.UTC(year,month,day)};
}
function seasonFromText(text,year){
  const s=String(text||'');
  const m=s.match(/\b(20\d{2})\s*[–—-]\s*(20\d{2}|\d{2})\b/);
  if(m) return m[1]+'/'+String(m[2]).slice(-2);
  return String(year||'');
}
function keyOf(team,date){return norm(team)+'|'+norm(date)}
function aliasFor(team){
  const n=norm(team);
  if(n.includes('deportivo cg')||n.includes('cerrito de gasca')) return 'cerrito de gasca';
  if(n==='boavista fc') return 'boavista';
  if(n.includes('promesas de pozos')) return 'promesas';
  if(n.includes('abejas pozos')) return 'abejas';
  if(n==='tavera') return 'tavera fc';
  if(n.includes('mineros')) return 'mineros fc';
  if(n.includes('boca jrs')) return 'boca jrs';
  return team;
}
function resolveLogo(team){
  try{
    return window.LJR_TEAM_LOGOS?.get?.(aliasFor(team))||'';
  }catch(_){return ''}
}
function initials(team){
  return String(team||'JR').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JR';
}
function fromCard(card){
  const kind=norm(card.querySelector('.v35-history-kind,.v35-champion-kind,.v115-kind')?.textContent||'');
  if(kind.includes('subcampeon')||!kind.includes('campeon')) return null;
  const team=String(card.querySelector('h3,h4')?.textContent||'').trim();
  const date=String(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'').trim();
  const parsed=parseDate(date);
  if(!team||!parsed) return null;
  const strong=String(card.querySelector('strong')?.textContent||'').trim();
  return {
    team,date,
    season:seasonFromText(card.textContent,parsed.year),
    title:strong||'Campeón documentado',
    year:parsed.year,
    stamp:parsed.stamp
  };
}
function records(content){
  const map=new Map();
  for(const a of ANCHORS){
    const parsed=parseDate(a.date);
    if(!parsed) continue;
    map.set(keyOf(a.team,a.date),{...a,year:parsed.year,stamp:parsed.stamp});
  }
  content.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    const r=fromCard(card);
    if(!r) return;
    const k=keyOf(r.team,r.date);
    const prev=map.get(k);
    map.set(k,prev?{...prev,...r,season:(r.season&&r.season!==String(r.year))?r.season:prev.season||r.season}:r);
  });
  return [...map.values()].sort((a,b)=>b.stamp-a.stamp||a.team.localeCompare(b.team,'es'));
}
function cardHtml(r){
  const logo=resolveLogo(r.team);
  const logoHtml=logo
    ? '<img src="'+logo+'" alt="'+escapeHtml(r.team)+'" loading="lazy" decoding="async" onerror="this.closest(\'.v328-season-logo\').classList.add(\'is-fallback\');this.remove()">'
    : '<span class="v328-season-initials">'+escapeHtml(initials(r.team))+'</span>';
  return '<button type="button" class="v328-season-item" data-v328-team="'+escapeAttr(r.team)+'" data-v328-date="'+escapeAttr(r.date)+'" aria-label="'+escapeAttr(r.team+' · '+r.title+' · '+r.date)+'">'+
    '<span class="v328-season-logo '+(logo?'':'is-fallback')+'">'+logoHtml+'</span>'+
    '<span class="v328-season-label">'+escapeHtml(r.season||String(r.year))+'</span>'+
    '<span class="v328-season-date">'+escapeHtml(r.date)+'</span>'+
    '<span class="v328-season-team">'+escapeHtml(r.team)+'</span>'+
  '</button>';
}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escapeAttr(v){return escapeHtml(v)}
function sectionHtml(rows){
  const groups=new Map();
  for(const r of rows){
    const decade=Math.floor(r.year/10)*10;
    if(!groups.has(decade)) groups.set(decade,[]);
    groups.get(decade).push(r);
  }
  const blocks=[...groups.entries()].sort((a,b)=>b[0]-a[0]).map(([decade,items])=>
    '<section class="v328-season-decade">'+
      '<h2>'+decade+'s</h2>'+
      '<div class="v328-season-grid">'+items.map(cardHtml).join('')+'</div>'+
    '</section>'
  ).join('');
  return '<section class="v328-seasons-reference" data-v328-seasons-grid>'+
    '<div class="v328-season-intro"><strong>Temporadas</strong><span>Campeones documentados · ordenados por fecha</span></div>'+
    blocks+
  '</section>';
}
function isHistory(){return /#\/history(?:$|[?&])/i.test(location.hash||'')||location.hash==='#/history'}
function isSeasons(root){
  const a=root?.querySelector('.v35-tab.active');
  return (a?.dataset?.v35Tab||a?.textContent||'').trim()==='Temporadas';
}
function apply(){
  if(!isHistory()) return;
  const root=document.querySelector('.v35-history-page');
  const content=root?.querySelector('[data-v35-content]');
  if(!root||!content) return;
  if(!isSeasons(root)){
    content.removeAttribute('data-v328-seasons-active');
    content.querySelector('[data-v328-seasons-grid]')?.remove();
    return;
  }
  const rows=records(content);
  if(!rows.length) return;
  const sig=rows.map(r=>keyOf(r.team,r.date)).join('||');
  const old=content.querySelector('[data-v328-seasons-grid]');
  if(old?.dataset?.v328Signature===sig){
    content.setAttribute('data-v328-seasons-active','1');
    return;
  }
  old?.remove();
  const wrap=document.createElement('div');
  wrap.innerHTML=sectionHtml(rows);
  const section=wrap.firstElementChild;
  section.dataset.v328Signature=sig;
  content.prepend(section);
  content.setAttribute('data-v328-seasons-active','1');
}
let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(apply));
}
function openChampion(team,date){
  const tab=document.querySelector('.v35-tab[data-v35-tab="Campeones"]');
  if(!tab) return;
  tab.click();
  setTimeout(()=>{
    const nt=norm(team),nd=norm(date);
    const cards=[...document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card')];
    const target=cards.find(c=>norm(c.querySelector('h3,h4')?.textContent||'')===nt && norm(c.textContent||'').includes(nd));
    target?.scrollIntoView({behavior:'smooth',block:'center'});
  },160);
}
document.addEventListener('click',e=>{
  const item=e.target.closest?.('[data-v328-team]');
  if(!item) return;
  e.preventDefault();
  e.stopPropagation();
  openChampion(item.dataset.v328Team||'',item.dataset.v328Date||'');
},true);
window.addEventListener('hashchange',schedule);
document.addEventListener('click',e=>{if(e.target.closest?.('[data-v35-tab]')) setTimeout(schedule,20)},true);
const boot=()=>{
  const screen=document.querySelector('#screen')||document.body;
  new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,characterData:true});
  schedule();
  setTimeout(schedule,220);
  setTimeout(schedule,900);
};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
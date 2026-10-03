/* V329 — HISTORIA > FINALES · reconstrucción móvil según referencia del usuario.
   Cambia únicamente la presentación de la pestaña Finales:
   - cabecera/tabs compactas tipo master azul
   - 4 pestañas visibles: Temporadas · Campeones · Finales · Vídeos
   - finales en una sola tarjeta compacta con filas, escudos y botón Ver detalles
   No altera datos, Campeones, fondos históricos ni otras rutas. */
(function(){
'use strict';
if(window.__LJR_V329_HISTORY_FINALS_IMAGE1__) return;
window.__LJR_V329_HISTORY_FINALS_IMAGE1__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LOGOS={
  'hermanos':RAW+'assets/official-logos/hermanos.png',
  'juventus':RAW+'assets/official-logos/juventus.png',
  'abejas fc':RAW+'assets/official-logos/abejas.png',
  'abejas':RAW+'assets/official-logos/abejas.png',
  'boavista':RAW+'assets/official-logos/boavista.png',
  'valencia':RAW+'assets/official-logos/valencia.png',
  'chelsea':'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'
};
const DATES={
  'magisterio 4–2 boavista':'23 feb 2013',
  'magisterio 4-2 boavista':'23 feb 2013',
  'hermanos vs juventus':'Archivo histórico',
  'valencia vs halcones':'Archivo histórico',
  'hermanos vs chelsea':'Archivo histórico',
  'olímpicos de pozos vs abejas fc':'Domingo 21 de junio · año no visible',
  'olimpicos de pozos vs abejas fc':'Domingo 21 de junio · año no visible'
};

function route(){return (location.hash.replace(/^#\//,'')||'home').split('?')[0]}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function esc(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(name){
  return String(name||'JR').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JR';
}
function logoFor(name){
  const n=norm(name);
  return Object.entries(LOGOS).find(([k])=>n===k||n.includes(k))?.[1]||'';
}
function crest(name){
  const src=logoFor(name);
  return '<span class="v329-final-crest"><b>'+esc(initials(name))+'</b>'+
    (src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">':'')+
  '</span>';
}
function splitMatch(title){
  const raw=String(title||'').trim();
  let m=raw.match(/^(.*?)\s+(\d+)\s*[–-]\s*(\d+)\s+(.*)$/);
  if(m) return {a:m[1].trim(),b:m[4].trim(),sa:m[2],sb:m[3]};
  const p=raw.split(/\s+vs\.?\s+/i);
  if(p.length===2) return {a:p[0].trim(),b:p[1].trim(),sa:'',sb:''};
  return {a:raw,b:'',sa:'',sb:''};
}
function rowHtml(row,i){
  const title=row.querySelector('h3')?.textContent?.trim()||'Final histórica';
  const kind=row.querySelector('.v35-history-kind')?.textContent?.trim()||'FINAL';
  const subtitle=row.querySelector('strong')?.textContent?.trim()||'';
  const detail=row.querySelector('p')?.textContent?.trim()||'';
  const m=splitMatch(title);
  const date=DATES[norm(title)]||'Archivo histórico';
  const teamB=m.b||subtitle||'Archivo de la Liga';
  return '<article class="v329-final-row">'+
    '<div class="v329-final-date">'+esc(date)+'</div>'+
    '<div class="v329-final-main">'+
      '<div class="v329-final-teams">'+
        '<div class="v329-team-line">'+crest(m.a)+'<strong>'+esc(m.a)+'</strong><em>'+esc(m.sa)+'</em></div>'+
        '<div class="v329-team-line">'+crest(teamB)+'<strong>'+esc(teamB)+'</strong><em>'+esc(m.sb)+'</em></div>'+
      '</div>'+
      '<div class="v329-final-side"><span>Final</span><button type="button" data-v329-details="'+i+'" aria-expanded="false">Ver detalles</button></div>'+
    '</div>'+
    '<div class="v329-final-detail" id="v329-final-detail-'+i+'"><b>'+esc(kind)+'</b>'+
      (subtitle?'<span>'+esc(subtitle)+'</span>':'')+
      (detail?'<p>'+esc(detail)+'</p>':'')+
    '</div>'+
  '</article>';
}
function rowsSignature(rows){
  return rows.map(r=>r.textContent.replace(/\s+/g,' ').trim()).join('||');
}
function ensureVideoTab(nav){
  if(nav.querySelector('.v329-video-tab')) return;
  const b=document.createElement('button');
  b.type='button';
  b.className='v35-tab v329-video-tab';
  b.dataset.v35Video='0';
  b.textContent='Vídeos';
  nav.appendChild(b);
}
function buildFinals(root){
  const content=root.querySelector('[data-v35-content]');
  if(!content) return;
  const rows=[...content.querySelectorAll('.v35-history-archive .v35-history-moment')];
  if(!rows.length) return;
  const sig=rowsSignature(rows);
  let shell=content.querySelector('.v329-finals-shell');
  if(shell && shell.dataset.sig===sig) return;
  shell?.remove();
  shell=document.createElement('section');
  shell.className='v329-finals-shell';
  shell.dataset.sig=sig;
  shell.setAttribute('aria-label','Finales históricas');
  shell.innerHTML='<div class="v329-finals-card"><div class="v329-finals-era">Archivo histórico</div>'+
    '<div class="v329-finals-list">'+rows.map(rowHtml).join('')+'</div></div>';
  content.prepend(shell);
}
function activeFinals(root){
  const active=root.querySelector('.v35-tabs .v35-tab.active');
  return norm(active?.textContent)==='finales';
}
function patch(){
  if(window.__LJR_V330_HISTORY_FINALS_HARDFIX__) return;
  if(route()!=='history') return;
  const root=document.querySelector('.v35-history-page');
  if(!root) return;
  const nav=root.querySelector('.v35-tabs');
  if(!nav) return;
  const isFinal=activeFinals(root);
  root.classList.toggle('v329-finals-image1',isFinal);
  if(!isFinal){
    root.querySelector('.v329-finals-shell')?.remove();
    nav.querySelector('.v329-video-tab')?.remove();
    return;
  }
  ensureVideoTab(nav);
  buildFinals(root);
}

function style(){
  if(document.getElementById('v329-history-finals-image1-style'))return;
  const s=document.createElement('style');
  s.id='v329-history-finals-image1-style';
  s.textContent=`
@media (max-width:1023px){
  body[data-app-route="history"] .v35-history-page.v329-finals-image1{
    --v35-pad:22px!important;
    background:#070b59!important;
    background-image:linear-gradient(180deg,#091582 0,#08106d 26%,#070b59 100%)!important;
  }
  .v35-history-page.v329-finals-image1 .v35-history-head{
    height:164px!important;
    min-height:164px!important;
    padding:0 22px!important;
    background:
      linear-gradient(180deg,rgba(16,48,233,.10),rgba(3,8,67,.34)),
      url('../public/history-regularscroll-header.webp') center top/cover no-repeat!important;
  }
  .v35-history-page.v329-finals-image1 .v35-history-head .v35-back{
    left:22px!important;top:35px!important;width:34px!important;height:34px!important;
  }
  .v35-history-page.v329-finals-image1 .v35-history-head h1{
    left:22px!important;bottom:18px!important;font-size:40px!important;font-weight:500!important;letter-spacing:-.035em!important;
  }
  .v35-history-page.v329-finals-image1 .v35-tabs{
    position:sticky!important;
    top:var(--v35-compact-h)!important;
    z-index:72!important;
    display:flex!important;
    justify-content:stretch!important;
    align-items:stretch!important;
    gap:0!important;
    width:100%!important;
    height:61px!important;
    min-height:61px!important;
    padding:0 10px!important;
    overflow:visible!important;
    background:linear-gradient(180deg,#101c99 0%,#0a126e 100%)!important;
    border-bottom:1px solid rgba(180,190,255,.30)!important;
  }
  .v35-history-page.v329-finals-image1 .v35-tabs .v35-tab[data-v35-tab="Resumen"],
  .v35-history-page.v329-finals-image1 .v35-tabs .v35-tab[data-v35-tab="Récords"]{
    display:none!important;
  }
  .v35-history-page.v329-finals-image1 .v35-tabs .v35-tab,
  .v35-history-page.v329-finals-image1 .v35-tabs .v329-video-tab{
    position:relative!important;
    display:flex!important;
    align-items:center!important;
    justify-content:center!important;
    flex:1 1 25%!important;
    width:25%!important;
    min-width:0!important;
    height:61px!important;
    min-height:61px!important;
    padding:2px 3px 0!important;
    margin:0!important;
    border:0!important;
    background:transparent!important;
    color:#c5c9df!important;
    font:650 15.5px/1.1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;
    white-space:nowrap!important;
  }
  .v35-history-page.v329-finals-image1 .v35-tabs .v35-tab.active{
    color:#13e7ef!important;
  }
  .v35-history-page.v329-finals-image1 .v35-tabs .v35-tab.active::after{
    content:""!important;
    position:absolute!important;
    left:50%!important;
    bottom:-1px!important;
    transform:translateX(-50%)!important;
    width:58%!important;
    max-width:84px!important;
    height:4px!important;
    border-radius:4px 4px 0 0!important;
    background:#12e9ef!important;
  }
  .v35-history-page.v329-finals-image1 .v35-history-content{
    padding:0 18px 38px!important;
    background:transparent!important;
  }
  .v35-history-page.v329-finals-image1 .v35-history-content>.v35-tab-body,
  .v35-history-page.v329-finals-image1 .v35-history-content>.v35-history-archive{
    display:none!important;
  }
  .v35-history-page.v329-finals-image1 .v329-finals-shell{
    display:block!important;
    width:100%!important;
    margin:20px 0 0!important;
    padding:0!important;
  }
  .v329-finals-card{
    width:100%;
    overflow:hidden;
    border-radius:24px;
    background:linear-gradient(180deg,rgba(21,31,139,.98),rgba(12,22,113,.99));
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.06);
  }
  .v329-finals-era{
    height:53px;
    display:flex;
    align-items:center;
    padding:0 20px;
    color:#fff;
    font:500 20px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    border-bottom:1px solid rgba(173,181,235,.28);
  }
  .v329-final-row{
    padding:14px 18px 0;
  }
  .v329-final-row+.v329-final-row{
    border-top:1px solid rgba(173,181,235,.20);
  }
  .v329-final-date{
    margin-bottom:10px;
    color:#bcc2df;
    font:500 15px/1.15 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  }
  .v329-final-main{
    display:grid;
    grid-template-columns:minmax(0,1fr) 104px;
    gap:12px;
    align-items:center;
    min-height:76px;
    padding-bottom:14px;
  }
  .v329-final-teams{
    min-width:0;
    display:grid;
    gap:8px;
  }
  .v329-team-line{
    min-width:0;
    display:grid;
    grid-template-columns:30px minmax(0,1fr) 24px;
    gap:8px;
    align-items:center;
    color:#fff;
  }
  .v329-final-crest{
    position:relative;
    width:30px;height:30px;
    display:grid;place-items:center;
    overflow:hidden;
    border-radius:8px;
    background:rgba(255,255,255,.08);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);
  }
  .v329-final-crest b{
    color:#cfd5ff;
    font:800 9px/1 system-ui,sans-serif;
  }
  .v329-final-crest img{
    position:absolute;inset:0;
    width:100%;height:100%;
    object-fit:contain;
    background:transparent;
  }
  .v329-team-line strong{
    min-width:0;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    font:650 15.5px/1.08 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  }
  .v329-team-line em{
    justify-self:end;
    color:#fff;
    font:700 17px/1 system-ui,sans-serif;
    font-style:normal;
  }
  .v329-final-side{
    align-self:stretch;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:stretch;
    gap:9px;
  }
  .v329-final-side>span{
    color:#b7bdd9;
    text-align:center;
    font:500 15px/1 system-ui,sans-serif;
  }
  .v329-final-side button{
    min-height:37px;
    padding:0 8px;
    border:0;
    border-radius:7px;
    background:linear-gradient(180deg,#0a479d,#073681);
    color:#11eaf2;
    font:700 14px/1 system-ui,sans-serif;
    box-shadow:inset 0 0 0 1px rgba(13,229,239,.10);
  }
  .v329-final-detail{
    display:grid;
    grid-template-rows:0fr;
    opacity:0;
    overflow:hidden;
    color:#cbd0ea;
    transition:grid-template-rows .2s ease,opacity .2s ease,padding .2s ease;
    font:500 13px/1.4 system-ui,sans-serif;
  }
  .v329-final-detail>*{min-height:0}
  .v329-final-row.is-open .v329-final-detail{
    grid-template-rows:1fr;
    opacity:1;
    padding:0 0 14px;
  }
  .v329-final-detail b{color:#13e7ef;font-size:11px;letter-spacing:.08em}
  .v329-final-detail span{display:block;margin-top:3px;color:#fff;font-weight:650}
  .v329-final-detail p{margin:5px 0 0;color:#c4c9e2}
}
@media (max-width:374px){
  .v35-history-page.v329-finals-image1 .v35-tabs .v35-tab,
  .v35-history-page.v329-finals-image1 .v35-tabs .v329-video-tab{font-size:14px!important}
  .v329-final-main{grid-template-columns:minmax(0,1fr) 94px}
  .v329-team-line strong{font-size:14px}
}
`;
  document.head.appendChild(s);
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-v329-details]');
  if(!b)return;
  e.preventDefault();
  e.stopPropagation();
  const row=b.closest('.v329-final-row');
  if(!row)return;
  const open=!row.classList.contains('is-open');
  row.classList.toggle('is-open',open);
  b.setAttribute('aria-expanded',String(open));
  b.textContent=open?'Ocultar':'Ver detalles';
},true);

let t=0;
function schedule(ms=0){
  clearTimeout(t);
  t=setTimeout(()=>requestAnimationFrame(patch),ms);
}
style();
window.addEventListener('hashchange',()=>schedule(40));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-v35-video],[data-route]')) schedule(80);
},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(35)).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(80),{once:true});
else schedule(30);
setTimeout(patch,300);
setTimeout(patch,900);
})();

/* V330 HARD FIX — Historia > Finales: exact mobile reference layer. */
(function(){
'use strict';
if(window.__LJR_V330_HISTORY_FINALS_HARDFIX__)return;
window.__LJR_V330_HISTORY_FINALS_HARDFIX__=true;

function route(){return (location.hash.replace(/^#\//,'')||'home').split('?')[0]}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function esc(v){return String(v||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
function initials(v){return String(v||'JR').split(/\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0]||''}).join('').toUpperCase()||'JR'}
function alias(v){
  var n=norm(v);
  if(n.indexOf('abejas')>=0)return 'abejas';
  if(n.indexOf('hermanos')>=0)return 'hermanos';
  if(n.indexOf('juventus')>=0)return 'juventus';
  if(n.indexOf('boavista')>=0)return 'boavista';
  if(n.indexOf('magisterio')>=0)return 'magisterio';
  if(n.indexOf('valencia')>=0)return 'valencia';
  if(n.indexOf('chelse')>=0)return 'chelsea';
  return n;
}
var RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
var FALLBACK={
  abejas:RAW+'assets/official-logos/abejas.png',
  hermanos:RAW+'assets/official-logos/hermanos.png',
  juventus:RAW+'assets/official-logos/juventus.png',
  boavista:RAW+'assets/official-logos/boavista.png'
};
function logo(name){
  var a=alias(name);
  try{
    var src=window.LJR_TEAM_LOGOS&&window.LJR_TEAM_LOGOS.get&&window.LJR_TEAM_LOGOS.get(a);
    if(src)return src;
  }catch(_){}
  return FALLBACK[a]||'';
}
function crest(name){
  var src=logo(name);
  return '<span class="v330-crest"><b>'+esc(initials(name))+'</b>'+(src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">':'')+'</span>';
}
function split(title){
  var raw=String(title||'').trim();
  var m=raw.match(/^(.*?)\s+(\d+)\s*[–-]\s*(\d+)\s+(.*)$/);
  if(m)return {a:m[1].trim(),b:m[4].trim(),sa:m[2],sb:m[3]};
  var p=raw.split(/\s+vs\.?\s+/i);
  if(p.length===2)return {a:p[0].trim(),b:p[1].trim(),sa:'',sb:''};
  return {a:raw,b:'',sa:'',sb:''};
}
var DATES={
  'magisterio 4–2 boavista':'23 feb 2013',
  'magisterio 4-2 boavista':'23 feb 2013',
  'hermanos vs juventus':'Archivo histórico',
  'valencia vs halcones':'Archivo histórico',
  'hermanos vs chelse':'Archivo histórico',
  'olímpicos de pozos vs abejas fc':'Domingo 21 de junio · año no visible',
  'olimpicos de pozos vs abejas fc':'Domingo 21 de junio · año no visible'
};
function compactSeason(value,year){
  var raw=String(value||'').trim();
  var pair=raw.match(/\b(20\d{2})\D+(20\d{2})\b/);
  if(pair)return pair[1]+'/'+pair[2].slice(-2);
  var one=raw.match(/\b(20\d{2})\b/);
  if(one)return one[1];
  return year?String(year):'Archivo histórico';
}
var MONTHS={ene:1,feb:2,mar:3,abr:4,may:5,jun:6,jul:7,ago:8,sep:9,sept:9,oct:10,nov:11,dic:12};
function dateRank(value,year){
  var n=norm(value);
  var m=n.match(/(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)[a-z]*\s+(20\d{2})/);
  if(m)return Number(m[3])*10000+(MONTHS[m[2]]||0)*100+Number(m[1]);
  var iso=n.match(/(20\d{2})\D+(\d{1,2})\D+(\d{1,2})/);
  if(iso)return Number(iso[1])*10000+Number(iso[2])*100+Number(iso[3]);
  return year?year*10000:0;
}
function meta(title,rowDate,rowSeason){
  var fallback=DATES[norm(title)]||'';
  var date=String(rowDate||'').trim()||fallback||'Archivo histórico';
  var basis=String(rowDate||'')+' '+String(rowSeason||'')+' '+String(title||'');
  var mm=basis.match(/\b(19|20)\d{2}\b/);
  var y=mm?Number(mm[0]):0;
  return {
    date:date,
    year:y,
    rank:dateRank(date,y),
    group:y?String(Math.floor(y/10)*10)+'s':'Archivo',
    season:compactSeason(rowSeason,y)
  };
}

function parseRows(content){
  var rows=Array.from(content.querySelectorAll('.v35-history-archive .v35-history-moment')).map(function(row,i){
    var title=(row.querySelector('h3')&&row.querySelector('h3').textContent||'Final histórica').trim();
    var rowDate=(row.dataset&&row.dataset.v35FinalDate)||((row.querySelector('time.v35-history-date')&&row.querySelector('time.v35-history-date').textContent)||'').trim();
    var rowSeason=(row.dataset&&row.dataset.v35FinalSeason)||'';
    return {
      i:i,
      title:title,
      kind:(row.querySelector('.v35-history-kind')&&row.querySelector('.v35-history-kind').textContent||'FINAL').trim(),
      subtitle:(row.querySelector('strong')&&row.querySelector('strong').textContent||'').trim(),
      detail:(row.querySelector('p')&&row.querySelector('p').textContent||'').trim(),
      match:split(title),
      meta:meta(title,rowDate,rowSeason)
    };
  });
  return rows.sort(function(a,b){
    return (b.meta.rank-a.meta.rank)||(b.meta.year-a.meta.year)||(a.i-b.i);
  });
}

function rowHTML(r){
  var m=r.match;
  var b=m.b||r.subtitle||'Archivo de la Liga';
  return '<article class="v330-final-row">'+
    '<div class="v330-season">Temporada '+esc(r.meta.season)+'</div>'+
    '<div class="v330-row-main">'+
      '<div class="v330-teams">'+
        '<div class="v330-team">'+crest(m.a)+'<strong>'+esc(m.a)+'</strong><em>'+esc(m.sa)+'</em></div>'+
        '<div class="v330-team">'+crest(b)+'<strong>'+esc(b)+'</strong><em>'+esc(m.sb)+'</em></div>'+
      '</div>'+
      '<div class="v330-side"><span>Final</span><button type="button" data-v330-details="'+r.i+'" aria-expanded="false">Ver detalles</button></div>'+
    '</div>'+
    '<div class="v330-detail"><div><b>'+esc(r.kind)+'</b><small>'+esc(r.meta.date)+'</small>'+(r.subtitle?'<strong>'+esc(r.subtitle)+'</strong>':'')+(r.detail?'<p>'+esc(r.detail)+'</p>':'')+'</div></div>'+
  '</article>';
}
function shell(rows){
  var groups={};
  rows.forEach(function(r){(groups[r.meta.group]||(groups[r.meta.group]=[])).push(r)});
  var keys=Object.keys(groups).sort(function(a,b){
    if(a==='Archivo')return 1;
    if(b==='Archivo')return -1;
    return parseInt(b)-parseInt(a);
  });
  return '<section class="v330-finals-shell">'+keys.map(function(k){
    return '<article class="v330-decade"><h2>'+esc(k)+'</h2><div>'+groups[k].map(rowHTML).join('')+'</div></article>';
  }).join('')+'</section>';
}
function finalActive(root){
  var a=root&&root.querySelector('.v35-tabs .v35-tab.active');
  return norm(a&&((a.dataset&&a.dataset.v35Tab)||a.textContent))==='finales';
}
function forceNav(root){
  var nav=root.querySelector('.v35-tabs');
  if(!nav)return;
  var labels=Array.from(nav.querySelectorAll('.v35-tab')).map(function(x){return norm(x.textContent)});
  var exact=labels.length===4&&labels[0]==='temporadas'&&labels[1]==='campeones'&&labels[2]==='finales'&&labels[3]==='videos';
  if(exact&&nav.querySelector('.v35-tab.active')&&norm(nav.querySelector('.v35-tab.active').textContent)==='finales')return;
  nav.innerHTML=
    '<button type="button" class="v35-tab" data-v35-tab="Temporadas">Temporadas</button>'+
    '<button type="button" class="v35-tab" data-v35-tab="Campeones">Campeones</button>'+
    '<button type="button" class="v35-tab active" data-v35-tab="Finales">Finales</button>'+
    '<button type="button" class="v35-tab v330-video-tab" data-v330-video>Vídeos</button>';
}

var working=false;
function apply(){
  if(working||route()!=='history')return;
  var root=document.querySelector('.v35-history-page');
  if(!root)return;
  if(!finalActive(root)){
    root.classList.remove('v330-finals-active');
    return;
  }
  working=true;
  try{
    root.classList.add('v330-finals-active');
    forceNav(root);
    var content=root.querySelector('[data-v35-content]');
    if(!content)return;
    content.querySelectorAll('.v329-finals-shell').forEach(function(x){x.remove()});
    if(content.querySelector('.v330-finals-shell'))return;
    var rows=parseRows(content);
    if(!rows.length)return;
    content.insertAdjacentHTML('afterbegin',shell(rows));
  }finally{working=false}
}


var st=document.createElement('style');
st.id='v330-history-finals-hardfix-style';
st.textContent=[
'@media(max-width:1023px){',
'html body .v35-history-page.v330-finals-active{--v35-pad:22px!important;--v35-compact-h:56px!important;background:linear-gradient(180deg,#071a9a 0%,#080f70 32%,#07095d 100%)!important;}',
'html body .v35-history-page.v330-finals-active .v35-history-head{height:136px!important;min-height:136px!important;padding:0 22px!important;background:linear-gradient(180deg,rgba(12,43,218,.10),rgba(4,8,72,.30)),url("../public/history-regularscroll-header.webp") center top/cover no-repeat!important;}',
'html body .v35-history-page.v330-finals-active .v35-history-head .v35-back{left:22px!important;top:24px!important;width:34px!important;height:34px!important;}',
'html body .v35-history-page.v330-finals-active .v35-history-head .v35-back svg{width:29px!important;height:29px!important;}',
'html body .v35-history-page.v330-finals-active .v35-history-head h1{left:22px!important;bottom:14px!important;font-size:39px!important;line-height:1!important;font-weight:500!important;letter-spacing:-.035em!important;}',
'html body .v35-history-page.v330-finals-active .v35-tabs{position:sticky!important;top:var(--v35-compact-h)!important;z-index:80!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:0!important;width:100%!important;height:58px!important;min-height:58px!important;padding:0 10px!important;margin:0!important;overflow:visible!important;background:linear-gradient(180deg,#101c9a 0%,#0b126f 100%)!important;border-bottom:1px solid rgba(190,196,236,.22)!important;}',
'html body .v35-history-page.v330-finals-active .v35-tabs .v35-tab{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-width:0!important;height:58px!important;min-height:58px!important;margin:0!important;padding:0 2px!important;border:0!important;background:transparent!important;color:#c7c9db!important;font:600 15.5px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;white-space:nowrap!important;}',
'html body .v35-history-page.v330-finals-active .v35-tabs .v35-tab.active{color:#12edf3!important;font-weight:650!important;}',
'html body .v35-history-page.v330-finals-active .v35-tabs .v35-tab.active:after{content:""!important;position:absolute!important;left:50%!important;bottom:-1px!important;width:46px!important;max-width:46px!important;height:3px!important;transform:translateX(-50%)!important;border-radius:999px!important;background:#13edf3!important;box-shadow:0 0 7px rgba(19,237,243,.22)!important;}',
'html body .v35-history-page.v330-finals-active .v35-history-content{margin:0!important;padding:16px 18px 36px!important;background:transparent!important;}',
'html body .v35-history-page.v330-finals-active .v35-history-content>.v35-tab-body,html body .v35-history-page.v330-finals-active .v35-history-content>.v35-history-archive{display:none!important;}',
'html body .v35-history-page.v330-finals-active .v330-finals-shell{width:100%!important;margin:0!important;padding:0!important;}',
'html body .v35-history-page.v330-finals-active .v330-decade{width:100%!important;margin:0 0 18px!important;padding:0!important;overflow:hidden!important;border-radius:17px!important;background:linear-gradient(180deg,#141e91 0%,#10167d 100%)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.045)!important;}',
'html body .v35-history-page.v330-finals-active .v330-decade>h2{height:43px!important;display:flex!important;align-items:center!important;margin:0!important;padding:0 18px!important;border-bottom:1px solid rgba(182,190,234,.24)!important;color:#fff!important;font:500 20px/1 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;letter-spacing:-.015em!important;}',
'html body .v35-history-page.v330-finals-active .v330-final-row{margin:0 18px!important;padding:13px 0 0!important;}',
'html body .v35-history-page.v330-finals-active .v330-final-row+.v330-final-row{border-top:1px solid rgba(174,184,230,.20)!important;}',
'html body .v35-history-page.v330-finals-active .v330-season{margin:0 0 9px!important;color:#bbc0dc!important;font:500 15px/1.15 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;}',
'html body .v35-history-page.v330-finals-active .v330-row-main{display:grid!important;grid-template-columns:minmax(0,1fr) 100px!important;gap:12px!important;align-items:center!important;min-height:77px!important;padding:0 0 14px!important;}',
'html body .v35-history-page.v330-finals-active .v330-teams{min-width:0!important;display:grid!important;gap:8px!important;}',
'html body .v35-history-page.v330-finals-active .v330-team{min-width:0!important;display:grid!important;grid-template-columns:28px minmax(0,1fr) 24px!important;gap:8px!important;align-items:center!important;}',
'html body .v35-history-page.v330-finals-active .v330-crest{position:relative!important;width:28px!important;height:28px!important;display:grid!important;place-items:center!important;overflow:hidden!important;border-radius:8px!important;background:rgba(255,255,255,.08)!important;}',
'html body .v35-history-page.v330-finals-active .v330-crest b{color:#dbe0ff!important;font:800 8px/1 system-ui,sans-serif!important;}',
'html body .v35-history-page.v330-finals-active .v330-crest img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;object-fit:contain!important;background:transparent!important;}',
'html body .v35-history-page.v330-finals-active .v330-team strong{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;color:#fff!important;font:650 15.5px/1.06 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;}',
'html body .v35-history-page.v330-finals-active .v330-team em{justify-self:end!important;color:#fff!important;font:700 17px/1 system-ui,sans-serif!important;font-style:normal!important;}',
'html body .v35-history-page.v330-finals-active .v330-side{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:9px!important;}',
'html body .v35-history-page.v330-finals-active .v330-side>span{color:#b6bbd8!important;text-align:center!important;font:500 15px/1 system-ui,sans-serif!important;}',
'html body .v35-history-page.v330-finals-active .v330-side button{height:37px!important;min-height:37px!important;padding:0 7px!important;border:0!important;border-radius:8px!important;background:rgba(17,92,190,.08)!important;box-shadow:none!important;color:#13edf3!important;font:700 14px/1 system-ui,sans-serif!important;}',
'html body .v35-history-page.v330-finals-active .v330-detail{display:grid!important;grid-template-rows:0fr!important;opacity:0!important;overflow:hidden!important;transition:grid-template-rows .18s ease,opacity .18s ease!important;}',
'html body .v35-history-page.v330-finals-active .v330-detail>div{min-height:0!important;overflow:hidden!important;}',
'html body .v35-history-page.v330-finals-active .v330-final-row.is-open .v330-detail{grid-template-rows:1fr!important;opacity:1!important;padding-bottom:14px!important;}',
'html body .v35-history-page.v330-finals-active .v330-detail b,html body .v35-history-page.v330-finals-active .v330-detail small,html body .v35-history-page.v330-finals-active .v330-detail strong{display:block!important;}',
'html body .v35-history-page.v330-finals-active .v330-detail b{color:#14edf3!important;font-size:11px!important;letter-spacing:.08em!important;}',
'html body .v35-history-page.v330-finals-active .v330-detail small{margin-top:4px!important;color:#aeb5d2!important;font-size:11px!important;}',
'html body .v35-history-page.v330-finals-active .v330-detail strong{margin-top:4px!important;color:#fff!important;font-size:13px!important;}',
'html body .v35-history-page.v330-finals-active .v330-detail p{margin:5px 0 0!important;color:#c3c8e0!important;font-size:12.5px!important;line-height:1.38!important;}',
'html body .v35-history-page.v330-finals-active .v115-history-expansion{display:block!important;margin-top:22px!important;}',
'}',
'@media(max-width:374px){html body .v35-history-page.v330-finals-active .v35-tabs .v35-tab{font-size:14px!important;}html body .v35-history-page.v330-finals-active .v330-row-main{grid-template-columns:minmax(0,1fr) 92px!important;}html body .v35-history-page.v330-finals-active .v330-team strong{font-size:14px!important;}}'
].join('');
document.head.appendChild(st);

document.addEventListener('click',function(e){
  var v=e.target.closest&&e.target.closest('[data-v330-video]');
  if(v){e.preventDefault();e.stopPropagation();location.hash='#/video';return}
  var b=e.target.closest&&e.target.closest('[data-v330-details]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();
  var row=b.closest('.v330-final-row');
  if(!row)return;
  var open=!row.classList.contains('is-open');
  row.classList.toggle('is-open',open);
  b.setAttribute('aria-expanded',String(open));
  b.textContent=open?'Ocultar':'Ver detalles';
},true);

var t=0;
function schedule(ms){clearTimeout(t);t=setTimeout(function(){requestAnimationFrame(apply)},ms||0)}
window.addEventListener('hashchange',function(){schedule(35)});
window.addEventListener('pageshow',function(){schedule(35)});
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-v35-tab],[data-route]'))schedule(45)},true);
function boot(){
  var root=document.querySelector('#screen')||document.body;
  new MutationObserver(function(){schedule(25)}).observe(root,{childList:true,subtree:true});
  schedule(20);setTimeout(apply,250);setTimeout(apply,800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

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
  'boavista':RAW+'assets/official-logos/boavista.png'
};
const DATES={
  'magisterio 4–2 boavista':'23 feb 2013',
  'magisterio 4-2 boavista':'23 feb 2013',
  'hermanos vs juventus':'Archivo histórico',
  'valencia vs halcones':'Archivo histórico',
  'hermanos vs chelse':'Archivo histórico',
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
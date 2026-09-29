/* V356 — Historia > Finales: restaura el diseño V329/V330 sin observers pesados.
   Se aplica sólo cuando la pestaña Finales está visible. */
(function(){
'use strict';
if(window.__LJR_V356_HISTORY_FINALS_REFERENCE__)return;
window.__LJR_V356_HISTORY_FINALS_REFERENCE__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LOGOS={
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
  'franco fc':RAW+'assets/official-logos/franco-fc.png'
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
  if(m)return {a:m[1].trim(),b:m[4].trim(),sa:m[2],sb:m[3]};
  const p=raw.split(/\s+vs\.?\s+/i);
  if(p.length===2)return {a:p[0].trim(),b:p[1].trim(),sa:'',sb:''};
  return {a:raw,b:'',sa:'',sb:''};
}
function rowHtml(row,i){
  const title=row.querySelector('h3')?.textContent?.trim()||'Final histórica';
  const kind=row.querySelector('.v35-history-kind')?.textContent?.trim()||'FINAL';
  const subtitle=row.querySelector('strong')?.textContent?.trim()||'';
  const detail=row.querySelector('p')?.textContent?.trim()||'';
  const date=row.dataset.v35FinalDate||row.querySelector('time')?.textContent?.trim()||'Archivo histórico';
  const m=splitMatch(title);
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
    '<div class="v329-final-detail"><div><b>'+esc(kind)+'</b>'+
      (subtitle?'<span>'+esc(subtitle)+'</span>':'')+
      (detail?'<p>'+esc(detail)+'</p>':'')+
    '</div></div>'+
  '</article>';
}
function apply(){
  if(route()!=='history')return;
  const root=document.querySelector('.v35-history-page');
  if(!root)return;
  const active=root.querySelector('.v35-tabs .v35-tab.active');
  if(norm(active?.textContent)!=='finales')return;
  root.classList.add('v329-finals-image1');
  const content=root.querySelector('[data-v35-content]');
  if(!content)return;
  if(content.querySelector('.v329-finals-shell'))return;
  const rows=[...content.querySelectorAll('.v35-history-archive .v35-history-moment')];
  if(!rows.length)return;
  const shell=document.createElement('section');
  shell.className='v329-finals-shell';
  shell.setAttribute('aria-label','Finales históricas');
  shell.innerHTML='<div class="v329-finals-card"><div class="v329-finals-era">Archivo histórico</div>'+
    '<div class="v329-finals-list">'+rows.map(rowHtml).join('')+'</div></div>';
  content.prepend(shell);
}
function clear(){
  document.querySelector('.v35-history-page')?.classList.remove('v329-finals-image1');
}
window.LJR_APPLY_HISTORY_FINALS_REFERENCE=apply;
window.LJR_CLEAR_HISTORY_FINALS_REFERENCE=clear;

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-v329-details]');
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
})();
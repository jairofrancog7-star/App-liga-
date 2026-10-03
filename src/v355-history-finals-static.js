/* V355 — Historia > Finales: restauración visual sin observers pesados.
   Mantiene el diseño compacto anterior pero sólo se aplica cuando la pestaña Finales ya está montada. */
(function(){
'use strict';
if(window.__LJR_V355_HISTORY_FINALS_STATIC__)return;
window.__LJR_V355_HISTORY_FINALS_STATIC__=true;

function route(){return (location.hash.replace(/^#\//,'')||'home').split('?')[0]}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function esc(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function initials(v){return String(v||'JR').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JR'}
function alias(v){
  const n=norm(v);
  if(n.includes('abejas'))return 'abejas';
  if(n.includes('hermanos'))return 'hermanos';
  if(n.includes('juventus'))return 'juventus';
  if(n.includes('boavista'))return 'boavista';
  if(n.includes('magisterio'))return 'magisterio';
  if(n.includes('valencia'))return 'valencia';
  if(n.includes('chelse'))return 'chelsea';
  return n;
}
const FALLBACK={
  abejas:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png',
  hermanos:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png',
  juventus:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png',
  boavista:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/boavista.png',
  valencia:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/valencia.png',
  chelsea:'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'
};
function logo(name){
  const a=alias(name);
  try{
    const src=window.LJR_TEAM_LOGOS?.get?.(a)||window.LJR_OFFICIAL_API?.getLogo?.(name);
    if(src)return src;
  }catch(_){}
  return FALLBACK[a]||'';
}
function crest(name){
  const src=logo(name);
  return '<span class="v355-final-crest"><b>'+esc(initials(name))+'</b>'+
    (src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async" onerror="this.remove()">':'')+
  '</span>';
}
function split(title){
  const raw=String(title||'').trim();
  const m=raw.match(/^(.*?)\s+(\d+)\s*[–-]\s*(\d+)\s+(.*)$/);
  if(m)return {a:m[1].trim(),b:m[4].trim(),sa:m[2],sb:m[3]};
  const p=raw.split(/\s+vs\.?\s+/i);
  if(p.length===2)return {a:p[0].trim(),b:p[1].trim(),sa:'',sb:''};
  return {a:raw,b:'',sa:'',sb:''};
}
const MONTHS={ene:1,feb:2,mar:3,abr:4,may:5,jun:6,jul:7,ago:8,sep:9,sept:9,oct:10,nov:11,dic:12};
function meta(row,title){
  const rawDate=String(row.dataset.v35FinalDate||row.querySelector('time')?.textContent||'').trim();
  const rawSeason=String(row.dataset.v35FinalSeason||'').trim();
  const basis=rawDate+' '+rawSeason+' '+title;
  const ym=basis.match(/\b(19|20)\d{2}\b/);
  const year=ym?Number(ym[0]):0;
  const n=norm(rawDate);
  const dm=n.match(/(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|sept|oct|nov|dic)[a-z]*\s+((?:19|20)\d{2})/);
  const rank=dm?Number(dm[3])*10000+(MONTHS[dm[2]]||0)*100+Number(dm[1]):year*10000;
  return {date:rawDate||'Archivo histórico',season:rawSeason||String(year||'Archivo histórico'),year,rank,decade:year?String(Math.floor(year/10)*10)+'s':'Archivo'};
}
function parse(content){
  return [...content.querySelectorAll('.v35-history-archive .v35-history-moment')].map((row,i)=>{
    const title=row.querySelector('h3')?.textContent?.trim()||'Final histórica';
    return {
      i,title,
      kind:row.querySelector('.v35-history-kind')?.textContent?.trim()||'FINAL',
      subtitle:row.querySelector('strong')?.textContent?.trim()||'',
      detail:row.querySelector('p')?.textContent?.trim()||'',
      match:split(title),meta:meta(row,title)
    };
  }).sort((a,b)=>(b.meta.rank-a.meta.rank)||(a.i-b.i));
}
function rowHtml(r){
  const m=r.match,b=m.b||r.subtitle||'Archivo de la Liga';
  return '<article class="v355-final-row">'+
    '<div class="v355-final-season">Temporada '+esc(r.meta.season)+'</div>'+
    '<div class="v355-final-main">'+
      '<div class="v355-final-teams">'+
        '<div class="v355-final-team">'+crest(m.a)+'<strong>'+esc(m.a)+'</strong><em>'+esc(m.sa)+'</em></div>'+
        '<div class="v355-final-team">'+crest(b)+'<strong>'+esc(b)+'</strong><em>'+esc(m.sb)+'</em></div>'+
      '</div>'+
      '<div class="v355-final-side"><span>Final</span><button type="button" data-v355-final-detail aria-expanded="false">Ver detalles</button></div>'+
    '</div>'+
    '<div class="v355-final-detail"><div><b>'+esc(r.kind)+'</b><small>'+esc(r.meta.date)+'</small>'+
      (r.subtitle?'<strong>'+esc(r.subtitle)+'</strong>':'')+(r.detail?'<p>'+esc(r.detail)+'</p>':'')+
    '</div></div>'+
  '</article>';
}
function shell(rows){
  const groups={};
  rows.forEach(r=>(groups[r.meta.decade]||(groups[r.meta.decade]=[])).push(r));
  const keys=Object.keys(groups).sort((a,b)=>{
    if(a==='Archivo')return 1;if(b==='Archivo')return -1;return parseInt(b)-parseInt(a);
  });
  return '<section class="v355-finals-shell">'+keys.map(k=>
    '<article class="v355-final-decade"><h2>'+esc(k)+'</h2><div>'+groups[k].map(rowHtml).join('')+'</div></article>'
  ).join('')+'</section>';
}
function activeFinals(root){
  const b=root?.querySelector('.v35-tabs .v35-tab.active');
  return norm(b?.dataset?.v35Tab||b?.textContent)==='finales';
}
function cleanup(root){
  root?.classList.remove('v355-finals-active');
  root?.querySelector('.v355-finals-shell')?.remove();
}
function apply(){
  if(route()!=='history')return;
  const root=document.querySelector('.v35-history-page');
  if(!root)return;
  if(!activeFinals(root)){cleanup(root);return;}
  const content=root.querySelector('[data-v35-content]');
  if(!content)return;
  const rows=parse(content);
  if(!rows.length)return;
  root.classList.add('v355-finals-active');
  let existing=content.querySelector('.v355-finals-shell');
  const sig=rows.map(r=>r.title+'|'+r.meta.date).join('||');
  if(existing?.dataset.sig===sig)return;
  existing?.remove();
  content.insertAdjacentHTML('afterbegin',shell(rows));
  const created=content.querySelector('.v355-finals-shell');
  if(created)created.dataset.sig=sig;
}
window.LJR_APPLY_HISTORY_FINALS_REFERENCE=apply;

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-v355-final-detail]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();
  const row=b.closest('.v355-final-row');if(!row)return;
  const open=!row.classList.contains('is-open');
  row.classList.toggle('is-open',open);
  b.setAttribute('aria-expanded',String(open));
  b.textContent=open?'Ocultar':'Ver detalles';
},true);

const st=document.createElement('style');
st.id='v355-history-finals-static-style';
st.textContent=`
@media(max-width:1023px){
  .v35-history-page.v355-finals-active .v35-history-content{padding:16px 18px 36px!important}
  .v35-history-page.v355-finals-active .v35-history-content>.v35-tab-body,
  .v35-history-page.v355-finals-active .v35-history-content>.v35-history-archive{display:none!important}
  .v355-finals-shell{width:100%;margin:0;padding:0}
  .v355-final-decade{width:100%;margin:0 0 18px;overflow:hidden;border-radius:17px;background:linear-gradient(180deg,#141e91 0%,#10167d 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.045)}
  .v355-final-decade>h2{height:43px;display:flex;align-items:center;margin:0;padding:0 18px;border-bottom:1px solid rgba(182,190,234,.24);color:#fff;font:500 20px/1 system-ui,sans-serif}
  .v355-final-row{margin:0 18px;padding:13px 0 0}
  .v355-final-row+.v355-final-row{border-top:1px solid rgba(174,184,230,.20)}
  .v355-final-season{margin:0 0 9px;color:#bbc0dc;font:500 15px/1.15 system-ui,sans-serif}
  .v355-final-main{display:grid;grid-template-columns:minmax(0,1fr) 100px;gap:12px;align-items:center;min-height:77px;padding:0 0 14px}
  .v355-final-teams{min-width:0;display:grid;gap:8px}
  .v355-final-team{min-width:0;display:grid;grid-template-columns:28px minmax(0,1fr) 24px;gap:8px;align-items:center}
  .v355-final-crest{position:relative;width:28px;height:28px;display:grid;place-items:center;overflow:hidden;border-radius:8px;background:rgba(255,255,255,.08)}
  .v355-final-crest b{color:#dbe0ff;font:800 8px/1 system-ui,sans-serif}
  .v355-final-crest img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
  .v355-final-team strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#fff;font:650 15.5px/1.06 system-ui,sans-serif}
  .v355-final-team em{justify-self:end;color:#fff;font:700 17px/1 system-ui,sans-serif;font-style:normal}
  .v355-final-side{display:flex;flex-direction:column;justify-content:center;gap:9px}
  .v355-final-side>span{color:#b6bbd8;text-align:center;font:500 15px/1 system-ui,sans-serif}
  .v355-final-side button{height:37px;border:1px solid rgba(42,222,244,.44);border-radius:8px;background:rgba(17,92,190,.08);color:#13edf3;font:700 14px/1 system-ui,sans-serif;box-shadow:none;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
  .v355-final-detail{display:grid;grid-template-rows:0fr;opacity:0;overflow:hidden;transition:grid-template-rows .18s ease,opacity .18s ease}
  .v355-final-detail>div{min-height:0;overflow:hidden}
  .v355-final-row.is-open .v355-final-detail{grid-template-rows:1fr;opacity:1;padding-bottom:14px}
  .v355-final-detail b,.v355-final-detail small,.v355-final-detail strong{display:block}
  .v355-final-detail b{color:#14edf3;font-size:11px;letter-spacing:.08em}
  .v355-final-detail small{margin-top:4px;color:#aeb5d2;font-size:11px}
  .v355-final-detail strong{margin-top:4px;color:#fff;font-size:13px}
  .v355-final-detail p{margin:5px 0 0;color:#c3c8e0;font-size:12.5px;line-height:1.38}
}
`;
document.head.appendChild(st);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(apply),{once:true});
else requestAnimationFrame(apply);
})();
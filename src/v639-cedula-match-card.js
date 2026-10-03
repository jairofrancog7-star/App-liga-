/* V639 — Cédulas: combina el formulario compacto con la tarjeta visual del partido.
   La tarjeta se actualiza con categoría, equipos, fecha, campo, árbitro y jornada. */
(function(){
'use strict';
if(window.__LJR_V639_CEDULA_MATCH_CARD__)return;
window.__LJR_V639_CEDULA_MATCH_CARD__=true;

const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=name=>String(name||'EQ').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'EQ';

function route(){return document.body?.dataset?.appRoute||location.hash.replace(/^#\//,'').split('?')[0]||''}
function val(sel,fallback=''){return $(sel)?.value||fallback}
function formatDate(raw){
  const s=String(raw||'').trim();
  if(!s)return 'Por confirmar';
  const m=s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if(m)return m[3]+'/'+m[2]+'/'+m[1]+' · '+m[4]+':'+m[5];
  return s;
}
async function ensureData(){
  try{await window.V66_OFFICIAL_DIRECTORY?.load?.()}catch(_){}
}
function logoFor(name){
  try{
    return window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)
      ||window.LJR_OFFICIAL_API?.getLogo?.(name)
      ||window.LJR_TEAM_LOGOS?.get?.(name)
      ||'';
  }catch(_){return ''}
}
function teamLogo(name){
  const src=logoFor(name);
  if(src)return '<span class="v639-team-logo"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="eager" decoding="async"></span>';
  return '<span class="v639-team-logo v639-team-fallback">'+esc(initials(name))+'</span>';
}
function roundText(){
  const stored=String(localStorage.getItem('v66-cedula-round')||'').trim();
  return stored?('J'+stored):'J—';
}
function render(){
  if(route()!=='cedulaBuilder')return;
  const actions=$('body[data-app-route="cedulaBuilder"] .v60-actions');
  const form=$('body[data-app-route="cedulaBuilder"] .v64-form-grid.one');
  if(!actions||!form)return;

  let host=$('[data-v639-cedula-match-card]');
  if(!host){
    host=document.createElement('div');
    host.setAttribute('data-v639-cedula-match-card','');
    host.className='v639-match-card';
    actions.parentElement?.insertBefore(host,actions);
  }

  const home=val('[data-v64-ced-home]','Equipo local');
  const away=val('[data-v64-ced-away]','Visitante');
  const cat=val('[data-v64-ced-cat]','Primera Fuerza');
  const date=formatDate(val('[data-v64-ced-date]',''));
  const field=val('[data-v64-ced-field]','Por confirmar')||'Por confirmar';
  const ref=val('[data-v64-ced-ref]','Por asignar')||'Por asignar';

  host.innerHTML=
    '<div class="v639-card-head">'+
      '<b>LIGA MUNICIPAL DE FÚTBOL ·<br>JUVENTINO ROSAS</b>'+
      '<strong>'+esc(roundText())+'</strong>'+
    '</div>'+
    '<div class="v639-card-rule"></div>'+
    '<div class="v639-versus">'+
      '<div class="v639-team">'+teamLogo(home)+'<b>'+esc(home)+'</b></div>'+
      '<span class="v639-vs">VS</span>'+
      '<div class="v639-team">'+teamLogo(away)+'<b>'+esc(away)+'</b></div>'+
    '</div>'+
    '<div class="v639-card-meta">'+
      '<div><small>CATEGORÍA</small><b>'+esc(cat)+'</b></div>'+
      '<div><small>FECHA</small><b>'+esc(date)+'</b></div>'+
      '<div><small>CAMPO</small><b>'+esc(field)+'</b></div>'+
      '<div><small>ÁRBITRO</small><b>'+esc(ref)+'</b></div>'+
    '</div>';
}
async function mount(){
  if(route()!=='cedulaBuilder')return;
  await ensureData();
  render();
}
document.addEventListener('input',e=>{
  if(route()!=='cedulaBuilder')return;
  if(e.target?.matches?.('[data-v64-ced-home],[data-v64-ced-away],[data-v64-ced-cat],[data-v64-ced-date],[data-v64-ced-field],[data-v64-ced-ref]'))render();
},true);
document.addEventListener('change',e=>{
  if(route()!=='cedulaBuilder')return;
  if(e.target?.matches?.('[data-v64-ced-home],[data-v64-ced-away],[data-v64-ced-cat],[data-v64-ced-date],[data-v64-ced-field],[data-v64-ced-ref]'))render();
},true);
window.addEventListener('hashchange',()=>setTimeout(mount,40));
const screen=$('#screen');
if(screen)new MutationObserver(()=>{if(route()==='cedulaBuilder')setTimeout(mount,20)}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,60),{once:true});
else setTimeout(mount,60);
})();
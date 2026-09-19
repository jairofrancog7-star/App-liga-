/* PARTS28 — Máximo goleador con datos públicos reales de AdminFut.
   No inventa jugadores ni goles. */
(function(){
'use strict';

const ROWS=[];

function route(){return location.hash.replace('#/','')||'home'}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function logo(r){
  const name=r[0],src=r[4];
  if(src)return '<span class="v28-team-logo"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
  const ab=name.split(/\s+/).map(x=>x[0]||'').join('').slice(0,3).toUpperCase();
  return '<span class="v28-team-logo"><span class="v28-team-fallback">'+esc(ab)+'</span></span>';
}
function rowMarkup(r,i){
  return '<button type="button" class="v28-rank-row" data-v28-player="'+esc(r[1])+'">'+
    '<span class="v28-rank-number">#'+(i+3)+'</span>'+
    logo(r)+
    '<span class="v28-rank-copy"><b>'+esc(r[0])+'</b><small>'+esc(r[1])+' · '+esc(r[3])+'</small></span>'+
    '<strong class="v28-rank-goals">'+r[2]+'</strong>'+
  '</button>';
}
function feature(r,cls){
  if(!r)return '';
  return '<article class="v28-feature">'+
    '<div class="v28-feature-photo '+cls+'"></div>'+
    '<div class="v28-feature-info">'+
      '<div class="v28-feature-person"><span class="v28-ball">⚽</span><span><b>'+esc(r[0])+'</b><small>'+esc(r[1])+' · '+esc(r[3])+'</small></span></div>'+
      '<div class="v28-feature-goals"><b>'+r[2]+'</b><small>goles</small></div>'+
    '</div>'+
  '</article>';
}
function pageMarkup(){
  if(!ROWS.length){
    return '<section class="v28-scorers-page" data-v28-scorers><div class="empty-state"><h2>Sin goles oficiales publicados</h2><p>AdminFut no muestra una tabla de goleo activa en este momento.</p></div></section>';
  }
  return '<section class="v28-scorers-page" data-v28-scorers>'+
    feature(ROWS[0],'one')+
    feature(ROWS[1],'two')+
    '<div class="v28-ranking">'+ROWS.slice(2).map(rowMarkup).join('')+'</div>'+
    '<p class="v28-criteria">Datos oficiales publicados por categoría en AdminFut. No se inventan goles ni jugadores.</p>'+
  '</section>';
}
function toast(msg){
  const old=document.querySelector('.v28-toast');if(old)old.remove();
  const t=document.createElement('div');t.className='v28-toast';t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),1500);
}
function setMoreActive(){
  const nav=document.querySelector('.bottom-nav'); if(!nav)return;
  nav.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='more'));
}
function bind(){
  document.querySelectorAll('[data-v28-player]').forEach(b=>b.onclick=()=>toast(b.dataset.v28Player+' · jugador registrado'));
}
function render(){
  const active=route()==='scorers';
  document.body.classList.toggle('v28-scorers-active',active);
  if(!active)return;
  const screen=document.querySelector('#screen'); if(!screen)return;
  if(!screen.querySelector('[data-v28-scorers]'))screen.innerHTML=pageMarkup();
  setMoreActive(); bind();
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');
if(target)new MutationObserver(()=>{if(route()==='scorers'&&!target.querySelector('[data-v28-scorers]'))schedule()}).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
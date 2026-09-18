/* PARTS28 — funcionalidad de Máximo goleador según referencia Drive. */
(function(){
'use strict';

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LOGOS={
  AME:'assets/branding/america-veteranos-35-user.png',
  HUE:'assets/official-logos/la-huerta.png',
  PRO:'assets/official-logos/promesas-fc.png',
  FRA:'assets/official-logos/franco-fc.png',
  GAL:'assets/official-logos/galeana.png',
  LOB:'assets/official-logos/lobos-cdg.png',
  CUE:'assets/official-logos/toros-de-cuenda.png',
  POZ:'assets/teams/pozos-fc.webp',
  STC:'assets/teams/atletico-santa-cruz.webp'
};
const ROWS=[
  ['PRO','Promesas FC','Miguel Torres',8],
  ['FRA','Franco FC','Luis Hernández',7],
  ['GAL','Atlético Galeana','Jorge López',6],
  ['LOB','Lobos CDG','Raúl Sánchez',6],
  ['JUV','Juventino','Daniel Vargas',5],
  ['CUE','Cuenda','Fernando Reyes',5],
  ['POZ','Pozos','Abel Martínez',4],
  ['RIN','Rincón de Centeno','Iván Cruz',4],
  ['ROS','Deportivo Rosas','Alan Moreno',3],
  ['STC','Santa Cruz','Diego Morales',3],
  ['AME','Club América Veteranos JR','Ricardo Díaz',3],
  ['HUE','La Huerta','Ernesto Flores',3],
  ['PRO','Promesas FC','César Navarro',2],
  ['FRA','Franco FC','Adrián Luna',2],
  ['GAL','Atlético Galeana','Héctor Ruiz',2],
  ['LOB','Lobos CDG','Marco Pérez',2],
  ['JUV','Juventino','Sergio Castillo',1],
  ['CUE','Cuenda','David Aguirre',1]
];

function route(){return location.hash.replace('#/','')||'home'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function logo(code,name){
  const p=LOGOS[code];
  if(p)return '<span class="v28-team-logo"><img src="'+BASE+p+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
  const ab=name.split(/\s+/).map(x=>x[0]||'').join('').slice(0,3).toUpperCase();
  return '<span class="v28-team-logo"><span class="v28-team-fallback">'+esc(ab)+'</span></span>';
}
function rowMarkup(r,i){
  return '<button type="button" class="v28-rank-row" data-v28-player="'+esc(r[2])+'">'+
    '<span class="v28-rank-number">#'+(i+3)+'</span>'+
    logo(r[0],r[1])+
    '<span class="v28-rank-copy"><b>'+esc(r[1])+'</b><small>'+esc(r[2])+'</small></span>'+
    '<strong class="v28-rank-goals">'+r[3]+'</strong>'+
  '</button>';
}
function pageMarkup(){
  return '<section class="v28-scorers-page" data-v28-scorers>'+
    '<article class="v28-feature">'+
      '<div class="v28-feature-photo one"><button type="button" class="v28-feature-play" data-v28-video="José Ramírez" aria-label="Ver video de José Ramírez"></button></div>'+
      '<div class="v28-feature-info">'+
        '<div class="v28-feature-person"><span class="v28-ball">⚽</span><span><b>Club América<br>Veteranos JR</b><small>José Ramírez</small></span></div>'+
        '<div class="v28-feature-goals"><b>12</b><small>goles</small></div>'+
      '</div>'+
    '</article>'+
    '<article class="v28-feature">'+
      '<div class="v28-feature-photo two"><button type="button" class="v28-feature-play" data-v28-video="Carlos Mendoza" aria-label="Ver video de Carlos Mendoza"></button></div>'+
      '<div class="v28-feature-info">'+
        '<div class="v28-feature-person"><span class="v28-ball">⚽</span><span><b>La Huerta</b><small>Carlos Mendoza</small></span></div>'+
        '<div class="v28-feature-goals"><b>9</b><small>goles</small></div>'+
      '</div>'+
    '</article>'+
    '<div class="v28-ranking">'+ROWS.map(rowMarkup).join('')+'</div>'+
    '<p class="v28-criteria">Criterios de ranking: goles totales en la Liga Municipal de Fútbol Juventino Rosas.</p>'+
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
  const more=nav.querySelector('[data-route="more"] .nav-icon');
  if(more){
    more.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14.5A2.5 2.5 0 1 0 5 9.5a2.5 2.5 0 0 0 0 5Zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="currentColor"/></svg>';
    more.dataset.v16IconState='more:on';
  }
}
function bind(){
  document.querySelectorAll('[data-v28-video]').forEach(b=>b.onclick=()=>{toast('Abriendo video de '+b.dataset.v28Video);setTimeout(()=>{location.hash='#/video'},220)});
  document.querySelectorAll('[data-v28-player]').forEach(b=>b.onclick=()=>toast(b.dataset.v28Player+' · ficha de goleador'));
}
function render(){
  const active=route()==='scorers';
  document.body.classList.toggle('v28-scorers-active',active);
  if(!active)return;
  const screen=document.querySelector('#screen');
  if(!screen)return;
  if(!screen.querySelector('[data-v28-scorers]'))screen.innerHTML=pageMarkup();
  setMoreActive();
  bind();
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');
if(target)new MutationObserver(()=>{if(route()==='scorers'&&!target.querySelector('[data-v28-scorers]'))schedule()}).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
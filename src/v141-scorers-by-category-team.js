/* V142 — Goleadores separados por categoría.
   Los botones horizontales de categoría (V62) mandan; debajo solo aparece
   el desglose por equipo de la categoría seleccionada. */
(function(){
'use strict';
if(window.__LJR_V142_SCORERS__)return;
window.__LJR_V142_SCORERS__=true;

const META={
 '3':{name:'Primera Fuerza',logo:'./assets/branding/primera-fuerza-hd.png'},
 '5':{name:'Intermedia',logo:'./assets/categories/intermedia.webp'},
 '4':{name:'Segunda Fuerza',logo:'./assets/categories/segunda-fuerza.webp'},
 '2':{name:'Veteranos 35+',logo:'./assets/categories/veteranos-35-user.png'},
 '1':{name:'Veteranos 50+',logo:'./assets/categories/veteranos-50.webp'}
};
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function same(a,b){
  const x=norm(a),y=norm(b);if(x===y)return true;
  const p=[
    ['atletico galeana','atl galeana'],['toros de cuenda','cuenda'],
    ['deportivo nopalero','dep nopalero'],['deportivo zapata','dep zapata'],
    ['celticos','celticos fc']
  ];
  return p.some(z=>(x===norm(z[0])&&y===norm(z[1]))||(x===norm(z[1])&&y===norm(z[0])));
}
function data(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
  catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function selectedCat(){
  const active=document.querySelector('[data-v28-scorers] [data-v62-cat].active')?.dataset?.v62Cat;
  return String(active||localStorage.getItem('v62-category')||'3');
}
function catName(id){
  return data()?.categories?.[String(id)]?.name||META[String(id)]?.name||('Categoría '+id);
}
function catLogo(id){return META[String(id)]?.logo||''}
function logo(team){
  try{return window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||''}
  catch(_){return ''}
}
function teamLogo(team,cls='v142-team-logo'){
  const src=logo(team);
  if(src)return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(team)+'" loading="lazy" decoding="async"></span>';
  const ab=String(team||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
  return '<span class="'+cls+' v142-fallback">'+esc(ab||'⚽')+'</span>';
}
function scorerRows(id){
  const c=data()?.categories?.[String(id)];
  const raw=c?.scorers?.[0]?.rows||[];
  return raw
    .filter(r=>Array.isArray(r)&&r.length>=4&&r[1]&&r[2]&&/^\d+$/.test(String(r[3]||'')))
    .map(r=>({
      player:String(r[1]).trim(),
      team:String(r[2]).trim(),
      goals:Number(r[3])||0
    }))
    .sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es',{sensitivity:'base'}));
}
function groups(id){
  const out=[];
  scorerRows(id).forEach(r=>{
    let g=out.find(x=>same(x.team,r.team));
    if(!g){g={team:r.team,players:[],total:0};out.push(g)}
    g.players.push(r);g.total+=r.goals;
  });
  out.forEach(g=>g.players.sort((a,b)=>b.goals-a.goals||a.player.localeCompare(b.player,'es',{sensitivity:'base'})));
  return out.sort((a,b)=>b.total-a.total||a.team.localeCompare(b.team,'es',{sensitivity:'base'}));
}
function teamCard(g,i,id){
  return '<section class="v142-team-card">'+
    '<button type="button" class="v142-team-head" data-v142-team="'+esc(g.team)+'">'+
      '<span class="v142-order">#'+(i+1)+'</span>'+
      teamLogo(g.team,'v142-team-logo large')+
      '<span class="v142-team-copy"><b>'+esc(g.team)+'</b><small>'+esc(catName(id))+'</small></span>'+
      '<span class="v142-total"><b>'+g.total+'</b><small>goles</small></span>'+
    '</button>'+
    '<div class="v142-team-players">'+
      g.players.map((r,j)=>'<div><span>#'+(j+1)+'</span><b>'+esc(r.player)+'</b><strong>'+r.goals+'</strong></div>').join('')+
    '</div>'+
  '</section>';
}
function markup(id){
  const gs=groups(id),meta=META[id]||{},name=catName(id),src=catLogo(id);
  return '<section class="v142-by-team" data-v142-scorers data-v142-cat="'+esc(id)+'">'+
    '<div class="v142-section-head">'+
      '<span class="v142-cat-mark">'+(src?'<img src="'+esc(src)+'" alt="'+esc(name)+'">':'⚽')+'</span>'+
      '<span><small>POR EQUIPO · CATEGORÍA SELECCIONADA</small><h2>'+esc(name)+'</h2><p>Usa los botones de categoría de arriba para cambiar la tabla.</p></span>'+
    '</div>'+
    (gs.length?'<div class="v142-team-stack">'+gs.map((g,i)=>teamCard(g,i,id)).join('')+'</div>':
      '<div class="v142-empty">Esta categoría todavía no tiene desglose individual de goleadores publicado. La tabla superior mantiene los datos oficiales disponibles.</div>')+
  '</section>';
}
function bind(root){
  root.querySelectorAll('[data-v142-team]').forEach(b=>b.onclick=e=>{
    e.preventDefault();
    const n=b.dataset.v142Team||'';
    try{if(window.LJR_OFFICIAL_API?.openTeam){window.LJR_OFFICIAL_API.openTeam(n);return}}catch(_){}
    localStorage.setItem('v62-team-name',n);location.hash='#/teamDetail';
  });
}
let timer=0;
function mount(){
  clearTimeout(timer);
  timer=setTimeout(()=>{
    if(route()!=='scorers'||!data())return;
    const page=document.querySelector('[data-v28-scorers]');if(!page)return;
    const id=selectedCat();
    const old=page.querySelector('[data-v142-scorers]');
    if(old&&old.dataset.v142Cat===id)return;
    if(old)old.remove();

    /* El ranking individual superior ya lo renderiza V62 para la categoría activa.
       Aquí agregamos únicamente el bloque por equipo debajo de esa tabla. */
    const holder=document.createElement('div');
    holder.innerHTML=markup(id);
    const node=holder.firstElementChild;if(!node)return;
    const criteria=page.querySelector('.v28-criteria');
    if(criteria)page.insertBefore(node,criteria);else page.appendChild(node);
    bind(node);
  },70);
}

window.addEventListener('hashchange',mount);
window.addEventListener('ljr:official-data',mount);
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-v62-cat]');
  if(b&&route()==='scorers')setTimeout(mount,40);
},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='scorers')mount()}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
setTimeout(mount,700);setTimeout(mount,1500);
})();
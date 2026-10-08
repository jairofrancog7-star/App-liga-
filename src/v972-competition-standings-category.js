/* V972 · Selector oficial de las cinco categorías en Clasificación.
   Aditivo: no reemplaza resultados, tablas ni handlers de otros módulos. */
(function(){
  'use strict';
  if(window.__LJR_V972_COMP_CATEGORY__)return;
  window.__LJR_V972_COMP_CATEGORY__=true;
  const ids=['3','4','5','2','1'];
  const meta={
    '3':['Primera Fuerza','./assets/branding/primera-fuerza-hd.png'],
    '4':['Segunda Fuerza','./assets/categories/segunda-fuerza.webp'],
    '5':['Intermedia','./assets/categories/intermedia.webp'],
    '2':['Veteranos 35+','./assets/categories/veteranos-35-user.png'],
    '1':['Veteranos 50+','./assets/categories/veteranos-50.webp']
  };
  const selected=()=>{try{return String(localStorage.getItem('v12-fixture-cat')||localStorage.getItem('v62-category')||'3')}catch(_){return '3'}};
  const inStandings=()=>String(location.hash).split('?')[0].includes('#/competition')&&
    /clasificaci/i.test(document.querySelector('#screen>.tabs .tab.active')?.textContent||'');
  function render(){
    const panel=document.querySelector('#screen [data-v40-standings]');
    if(!panel||!inStandings())return;
    let menu=panel.querySelector(':scope > .v972-category-grid');
    if(!menu){
      menu=document.createElement('nav');
      menu.className='v972-category-grid';
      menu.setAttribute('aria-label','Elegir categoría oficial para la clasificación');
      menu.innerHTML=ids.map(id=>'<button type="button" data-v972-category="'+id+'" aria-pressed="false">'+
        '<img src="'+meta[id][1]+'" alt="" loading="lazy" decoding="async">'+
        '<span>'+meta[id][0]+'</span></button>').join('');
      panel.insertBefore(menu,panel.firstChild);
    }
    const current=selected();
    menu.querySelectorAll('[data-v972-category]').forEach(b=>{
      const active=b.dataset.v972Category===current;
      b.classList.toggle('active',active);
      b.setAttribute('aria-pressed',String(active));
    });
    const label=panel.querySelector('.v952-standings-category');
    const name=meta[current]?.[0]||'Primera Fuerza';
    if(label && label.textContent.trim()!=='Clasificación · '+name)label.textContent='Clasificación · '+name;
  }
  let scheduled=false;
  const schedule=()=>{
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;render()});
  };
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-v972-category]');
    if(!b)return;
    const id=b.dataset.v972Category;
    if(!meta[id])return;
    e.preventDefault();
    try{localStorage.setItem('v12-fixture-cat',id);localStorage.setItem('v62-category',id)}catch(_){}
    window.dispatchEvent(new CustomEvent('ljr:competition-category',{detail:{category:id}}));
    // Las tablas compacta/completa se recalculan desde datos oficiales mediante v40.
    schedule();
  });
  window.addEventListener('ljr:competition-category',schedule);
  window.addEventListener('ljr:official-data',schedule);
  window.addEventListener('hashchange',schedule);
  const screen=document.getElementById('screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
  schedule();
})();

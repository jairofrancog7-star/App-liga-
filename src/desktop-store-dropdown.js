/* Tienda de clubes: submenu desplegable con flecha independiente en modo escritorio. */
(function(){
'use strict';
const clubs=["SAN JOSE FC","JUVENTUS","HERMANOS","LINCES","NAPOLI","FRANCO FC","HERRERAS FC","ABEJAS","LOBOS CDG","TERRICOLAS","GALACTICOS"];
const desktop=()=>document.body.classList.contains('lj-desktop')||new URLSearchParams(location.search).get('mode')==='desktop'||innerWidth>=1024;
const go=r=>{location.hash='#/'+r};

function buildStoreSubmenu(){
  if(!desktop()) return;
  document.querySelectorAll('.lj-dropdown.lj-wide').forEach(drop=>{
    if(drop.querySelector('[data-lj-store-row]')) return;
    const storeButton=[...drop.children].find(el=>el.tagName==='BUTTON'&&el.textContent.trim().startsWith('Tienda (clubes)'));
    if(!storeButton) return;

    const row=document.createElement('div');
    row.className='lj-store-row';
    row.dataset.ljStoreRow='1';
    drop.insertBefore(row,storeButton);
    row.appendChild(storeButton);
    storeButton.classList.add('lj-store-label');
    storeButton.setAttribute('aria-label','Abrir Tienda de clubes');

    const toggle=document.createElement('button');
    toggle.type='button';
    toggle.className='lj-store-toggle';
    toggle.setAttribute('aria-label','Mostrar clubes');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML='<span>Tienda</span><b>›</b>';
    row.appendChild(toggle);

    const submenu=document.createElement('div');
    submenu.className='lj-store-submenu';
    submenu.setAttribute('aria-label','Clubes de la tienda');
    submenu.innerHTML='<button type="button" class="lj-store-all">Ver todos los clubes</button>'+clubs.map(club=>`<button type="button" data-store-club="${club}">${club}<span>›</span></button>`).join('');
    row.after(submenu);

    const setOpen=open=>{
      submenu.classList.toggle('open',open);
      row.classList.toggle('open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.querySelector('b').textContent=open?'⌄':'›';
    };

    toggle.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      setOpen(!submenu.classList.contains('open'));
    });

    submenu.addEventListener('click',e=>{
      const clubButton=e.target.closest('[data-store-club]');
      const all=e.target.closest('.lj-store-all');
      if(!clubButton&&!all) return;
      e.preventDefault();
      e.stopPropagation();
      if(clubButton) sessionStorage.setItem('ljSelectedClub',clubButton.dataset.storeClub);
      else sessionStorage.removeItem('ljSelectedClub');
      setOpen(false);
      document.querySelectorAll('.lj-menu-wrap.open').forEach(w=>w.classList.remove('open'));
      go('club-store');
    });
  });
}

function enhanceStorePage(){
  if(!desktop()) return;
  const page=document.querySelector('[data-lj-special="club-store"]');
  if(!page) return;
  const selected=sessionStorage.getItem('ljSelectedClub');
  const title=page.querySelector('.lj-directory-right h2');
  const intro=page.querySelector('.lj-directory-right > p');
  if(selected){
    if(title) title.textContent=`Tienda · ${selected}`;
    if(intro) intro.textContent=`Sección del club ${selected}. Aquí se podrán mostrar uniformes, artículos oficiales y productos del equipo. Los productos son de demostración hasta conectar inventario y pagos.`;
  }
  page.querySelectorAll('.lj-dir-item').forEach(btn=>{
    const name=btn.textContent.trim();
    btn.classList.toggle('lj-store-club-active',Boolean(selected&&name===selected));
    if(!btn.dataset.storeBound){
      btn.dataset.storeBound='1';
      btn.addEventListener('click',()=>{
        sessionStorage.setItem('ljSelectedClub',name);
        const h=page.querySelector('.lj-directory-right h2');
        const p=page.querySelector('.lj-directory-right > p');
        if(h) h.textContent=`Tienda · ${name}`;
        if(p) p.textContent=`Sección del club ${name}. Aquí se podrán mostrar uniformes, artículos oficiales y productos del equipo. Los productos son de demostración hasta conectar inventario y pagos.`;
        page.querySelectorAll('.lj-dir-item').forEach(x=>x.classList.toggle('lj-store-club-active',x===btn));
      });
    }
  });
}

function enhance(){buildStoreSubmenu();enhanceStorePage();}
window.addEventListener('hashchange',()=>setTimeout(enhance,40));
document.addEventListener('click',e=>{
  if(!e.target.closest('.lj-store-row')&&!e.target.closest('.lj-store-submenu')){
    document.querySelectorAll('.lj-store-submenu.open').forEach(s=>s.classList.remove('open'));
    document.querySelectorAll('.lj-store-row.open').forEach(r=>{r.classList.remove('open');const t=r.querySelector('.lj-store-toggle');if(t){t.setAttribute('aria-expanded','false');const b=t.querySelector('b');if(b)b.textContent='›';}});
  }
});
const observer=new MutationObserver(()=>{clearTimeout(window.__ljStoreEnhance);window.__ljStoreEnhance=setTimeout(enhance,45)});
observer.observe(document.documentElement,{subtree:true,childList:true});
setTimeout(enhance,120);
})();

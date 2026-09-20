/* Desktop dropdown navigation, directory and login screens based on supplied references. */
(function(){
'use strict';
const desktop=()=>document.body.classList.contains('lj-desktop')||new URLSearchParams(location.search).get('mode')==='desktop'||innerWidth>=1024;
const route=()=>location.hash.replace(/^#\/?/,'')||'home';
const go=r=>{location.hash='#/'+r};
const clubs=["SAN JOSE FC","JUVENTUS","HERMANOS","LINCES","NAPOLI","FRANCO FC","HERRERAS FC","ABEJAS","LOBOS CDG","TERRICOLAS","GALACTICOS"];
const menus={
  'Gaming':[
    ['Todos los juegos','gaming'],['Fantasy Football','fantasy'],['Pronostica Seis','predictor'],['Bracket','bracket'],['Gol del Día','scorers'],['eChampions League','gaming'],['Mi perfil de juegos','profile']
  ],
  'Datos':[
    ['Estadísticas de equipo','safe-data'],['Estadísticas de jugador','safe-data'],['Máximo goleador','scorers'],['Fase de clasificación','standings'],['Estadísticas históricas','history'],['Performance Zone','safe-performance']
  ],
  'Historia':[
    ['Temporadas','history'],['Estadísticas históricas','history'],['Vídeos','video'],['Equipos','teams'],['Más títulos','history']
  ],
  'Más':[
    ['Centro de la Liga','more'],['Tienda (clubes)','club-store'],['Calendario de partidos','v4-calendar'],['Credenciales','credentials'],['Fichajes','transfers'],['Notificaciones','safe-notifications']
  ]
};
function closeMenus(){
  document.querySelectorAll('.lj-menu-wrap.open').forEach(w=>w.classList.remove('open'));
  document.querySelectorAll('.lj-store-flyout.open').forEach(s=>s.classList.remove('open'));
  document.querySelectorAll('.lj-store-arrow[aria-expanded="true"]').forEach(b=>b.setAttribute('aria-expanded','false'));
}
function makeStoreRow(drop){
  const row=document.createElement('div');
  row.className='lj-more-store-item';

  const main=document.createElement('button');
  main.type='button';
  main.className='lj-store-main';
  main.textContent='Tienda (clubes)';
  main.dataset.ljRoute='club-store';
  row.appendChild(main);

  const arrow=document.createElement('button');
  arrow.type='button';
  arrow.className='lj-store-arrow';
  arrow.setAttribute('aria-label','Abrir lista de clubes');
  arrow.setAttribute('aria-expanded','false');
  arrow.innerHTML='<span>›</span>';
  row.appendChild(arrow);

  const flyout=document.createElement('div');
  flyout.className='lj-store-flyout';
  flyout.innerHTML='<div class="lj-store-flyout-title">Tienda de clubes</div><button type="button" class="lj-store-all">Ver todos los clubes <span>›</span></button>'+clubs.map(club=>`<button type="button" data-store-club="${club}">${club}<span>›</span></button>`).join('');
  row.appendChild(flyout);

  arrow.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    const open=!flyout.classList.contains('open');
    document.querySelectorAll('.lj-store-flyout.open').forEach(s=>s!==flyout&&s.classList.remove('open'));
    flyout.classList.toggle('open',open);
    arrow.setAttribute('aria-expanded',String(open));
    arrow.querySelector('span').textContent=open?'‹':'›';
  });

  flyout.addEventListener('click',e=>{
    const club=e.target.closest('[data-store-club]');
    const all=e.target.closest('.lj-store-all');
    if(!club&&!all)return;
    e.preventDefault();
    e.stopPropagation();
    if(club) sessionStorage.setItem('ljSelectedClub',club.dataset.storeClub);
    else sessionStorage.removeItem('ljSelectedClub');
    closeMenus();
    go('club-store');
  });
  drop.appendChild(row);
}
function installMenus(){
  if(!desktop())return;
  const nav=document.querySelector('.ds-menu');
  if(!nav)return;
  Object.entries(menus).forEach(([label,items])=>{
    const btn=[...nav.querySelectorAll(':scope > button')].find(b=>b.textContent.trim()===label);
    if(!btn||btn.parentElement?.classList.contains('lj-menu-wrap'))return;
    const wrap=document.createElement('div');wrap.className='lj-menu-wrap';
    btn.parentNode.insertBefore(wrap,btn);wrap.appendChild(btn);
    const caret=document.createElement('span');caret.className='lj-caret';caret.textContent='▼';btn.appendChild(caret);
    const drop=document.createElement('div');drop.className='lj-dropdown'+(label==='Más'?' lj-more-dropdown':'');
    items.forEach(([text,r])=>{
      if(label==='Más'&&text==='Tienda (clubes)'){
        makeStoreRow(drop);
        return;
      }
      const x=document.createElement('button');
      x.type='button';x.textContent=text;x.dataset.ljRoute=r;drop.appendChild(x);
    });
    wrap.appendChild(drop);
    btn.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      document.querySelectorAll('.lj-menu-wrap.open').forEach(w=>w!==wrap&&w.classList.remove('open'));
      wrap.classList.toggle('open');
    });
  });
}
const dirSections=[
 ['Competiciones de la Liga',[
   ['🏆','Categoría libre','competition'],
   ['⚽','Primera Fuerza','competition'],
   ['⚽','Intermedia','competition'],
   ['⚽','Segunda Fuerza','competition'],
   ['🟢','Veteranos 35+','competition'],
   ['🟦','Veteranos 50+','competition'],
   ['🎯','Finales','bracket']
 ]],
 ['Liga y servicios',[
   ['📋','Clasificación','standings'],
   ['🎟️','Sorteos','draws'],
   ['📊','Datos','safe-data'],
   ['👕','Equipos','teams'],
   ['📰','Noticias','news'],
   ['🎥','Liga TV','video'],
   ['🏟️','Sedes','v4-calendar'],
   ['📅','Calendario','v4-calendar']
 ]]
]
function directoryMarkup(){return `<div class="lj-directory" data-lj-special="more"><div class="ds-utility"><div class="ds-wrap"><span><b style="color:#fff">LIGA</b> · Juventino Rosas</span><button data-lj-route="profile">Iniciar sesión ◉</button></div></div><div class="lj-directory-main"><aside class="lj-directory-left"><div class="lj-dir-panel"><h4>Liga Juventino Rosas</h4><div class="lj-dir-links"><button data-lj-route="home">Inicio</button><button data-lj-route="about">Sobre</button><button data-lj-route="competition">Partidos</button><button data-lj-route="standings">Clasificación</button><button data-lj-route="news">Noticias</button><button data-lj-route="history">Historia</button></div></div><div class="lj-dir-tiles"><button class="lj-dir-tile" data-lj-route="gaming"><span>🎮</span>Gaming</button><button class="lj-dir-tile" data-lj-route="video"><span>📺</span>Liga TV</button><button class="lj-dir-tile" data-lj-route="v4-calendar"><span>📅</span>Calendario de partidos</button><button class="lj-dir-tile" data-lj-route="club-store"><span>🛍️</span>Tienda (clubes)</button><button class="lj-dir-tile" data-lj-route="safe-data"><span>📊</span>Datos y rankings</button><button class="lj-dir-tile" data-lj-route="credentials"><span>🪪</span>Credenciales</button></div><div class="lj-dir-panel"><div class="lj-dir-links"><button data-lj-route="teams">Equipos</button><button data-lj-route="draws">Sorteos</button><button data-lj-route="transfers">Fichajes</button><button data-lj-route="safe-notifications">Notificaciones</button></div></div></aside><main class="lj-directory-right"><h2>Competiciones y servicios de la Liga</h2>${dirSections.map(([title,items])=>`<section class="lj-dir-section"><h3>${title}</h3><div class="lj-dir-grid">${items.map(([icon,text,r])=>`<button class="lj-dir-item" data-lj-route="${r}"><span class="lj-dir-icon">${icon}</span>${text}</button>`).join('')}</div></section>`).join('')}</main></div></div>`}
function loginMarkup(){return `<div class="lj-login-page" data-lj-special="profile"><div class="lj-login-wrap"><button class="lj-login-back" data-lj-route="home">← Volver a Liga Juventino</button><div class="lj-login-card"><section class="lj-login-info"><div class="lj-login-brand">MI LIGA</div><h1>Únete a la comunidad de Liga Juventino Rosas</h1><ul><li>Consulta resúmenes y partidos destacados</li><li>Participa en Fantasy, Predictor y votaciones</li><li>Recibe avisos de jornadas y resultados</li><li>Administra tu perfil y preferencias</li></ul><div class="lj-login-badges">Tu acceso personalizado a:<div><span>LIGA</span><span>TV</span><span>GAME</span><span>DATA</span></div></div></section><section class="lj-login-form"><h2>Iniciar sesión</h2><button class="lj-social fb" data-demo-auth="Facebook">● &nbsp; Iniciar sesión con Facebook</button><button class="lj-social" data-demo-auth="Google">G &nbsp; Iniciar sesión con Google</button><button class="lj-social apple" data-demo-auth="Apple">● &nbsp; Iniciar sesión con Apple</button><div class="lj-or">o</div><label class="lj-field"><span>Email</span><input type="email" autocomplete="email" placeholder="tu@correo.com"></label><label class="lj-field"><span>Contraseña</span><input type="password" autocomplete="current-password" placeholder="••••••••"></label><button class="lj-forgot" data-demo-auth="Recuperar contraseña">Olvidé mi contraseña</button><button class="lj-submit" data-demo-auth="Email">Entrar</button><div class="lj-new">¿Nuevo en Liga Juventino?</div><button class="lj-create" data-demo-auth="Crear cuenta">Crear mi cuenta</button><p class="lj-login-note">Vista de interfaz. La autenticación real necesita conectarse a un proveedor de cuentas antes de aceptar credenciales.</p></section></div></div></div>`}
function storeMarkup(){const selected=sessionStorage.getItem('ljSelectedClub');const title=selected?`Tienda · ${selected}`:'Tienda (clubes)';const desc=selected?`Sección del club ${selected}. Aquí se podrán mostrar uniformes, artículos oficiales y productos del equipo.`:'Selecciona un club para entrar a su tienda. La estructura está lista para conectar inventario y pagos.';return `<div class="lj-directory" data-lj-special="club-store"><div class="ds-utility"><div class="ds-wrap"><span><b style="color:#fff">LIGA</b> · Tienda de clubes</span><button data-lj-route="home">Cerrar ✕</button></div></div><div class="lj-directory-main" style="grid-template-columns:1fr"><main class="lj-directory-right"><h2>${title}</h2><p style="color:#b8cfda;font-size:12px;max-width:700px">${desc}</p><div class="lj-dir-grid" style="margin-top:30px">${clubs.map(n=>`<button class="lj-dir-item${selected===n?' lj-store-club-active':''}" data-store-page-club="${n}"><span class="lj-dir-icon">👕</span>${n}</button>`).join('')}</div></main></div></div>`}
function renderSpecial(){if(!desktop())return;const r=route();const screen=document.querySelector('#screen');if(!screen)return;if(r==='profile'&&!screen.querySelector('[data-lj-special="profile"]')){screen.innerHTML=loginMarkup();return}if(r==='more'&&!screen.querySelector('[data-lj-special="more"]')){screen.innerHTML=directoryMarkup();return}if(r==='club-store'&&!screen.querySelector('[data-lj-special="club-store"]')){screen.innerHTML=storeMarkup();return}}
function enhance(){if(!desktop())return;installMenus();renderSpecial()}
document.addEventListener('click',e=>{
  const club=e.target.closest('[data-store-page-club]');
  if(club){sessionStorage.setItem('ljSelectedClub',club.dataset.storePageClub);const screen=document.querySelector('#screen');if(screen)screen.innerHTML=storeMarkup();return;}
  const b=e.target.closest('[data-lj-route]');
  if(b){e.preventDefault();closeMenus();go(b.dataset.ljRoute);return}
  const auth=e.target.closest('[data-demo-auth]');
  if(auth){e.preventDefault();alert('Esta pantalla ya está diseñada. Para iniciar sesión de verdad falta conectar el proveedor de autenticación elegido.');}
});
document.addEventListener('click',e=>{if(!e.target.closest('.lj-menu-wrap'))closeMenus()});
window.addEventListener('hashchange',()=>setTimeout(enhance,20));
const obs=new MutationObserver(()=>{clearTimeout(window.__ljEnhanceTimer);window.__ljEnhanceTimer=setTimeout(enhance,30)});obs.observe(document.documentElement,{subtree:true,childList:true});
setTimeout(enhance,80);
})();

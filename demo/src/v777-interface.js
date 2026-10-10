/* A single owner for mobile header controls and accessible local pickers. */
(()=>{
'use strict';
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';
const HEADERLESS_GAMES=new Set(['video','fantasy','fantasyAccess','fantasyTeam','quiz','quizArena','moreLess','predictor','predictorSix']);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=p=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+p+'</svg>';
const icons={back:svg('<path d="M20 12H4m7-7-7 7 7 7"/>'),person:svg('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="8" r="3"/><path d="M4.5 18.6a8.3 8.3 0 0 1 15 0"/>'),menu:svg('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>')};
const account=()=>window.LJR_V569_AUTH?.currentAccount ? window.LJR_V569_AUTH.currentAccount() : window.LJR_MAIN_ROUTE?.state?.user||null;
const media=()=>window.LJR_MEDIA;
const go=r=>window.LJR_MAIN_ROUTE?.go ? window.LJR_MAIN_ROUTE.go(r) : location.hash='#/'+r;
function avatar(a=account()){
 if(!a)return '<img class="ljr-profile-image" src="./assets/reference/predictor-v36/liga-crest-white.webp" alt="Liga Juventino Rosas">';
 const gamer=/^gamer:[0-8]$/.test(a.avatarPreset||'');
 const photo=a.avatar||(!gamer&&(a.photoURL||a.picture));
 if(photo)return '<img class="ljr-profile-image" src="'+esc(photo)+'" alt="'+esc(a.name||'Mi perfil')+'">';
 if(gamer)return '<span class="ljr-gamer-avatar" style="--avatar-x:'+((+a.avatarPreset.slice(-1)%3)*50)+'%;--avatar-y:'+(Math.floor(+a.avatarPreset.slice(-1)/3)*50)+'%" aria-label="Avatar '+esc(a.name||'')+'"></span>';
 return '<span class="ljr-profile-initial">'+esc((a.name||a.alias||'L').trim().slice(0,1).toUpperCase())+'</span>';
}
const PROFILE='.profile-button,.ljr-profile-control,[data-route="profile"],[data-v415-top-profile],button[aria-label="Perfil"],button[aria-label="Mi cuenta"],button[aria-label="Mi perfil"]';
const BACK='.back-button,.ljr-back-control,.v35-back,.v46-back,.v41-back,.v27-back,.v31-back,.v32-back,.v501-back,[data-v415-top-back],button[aria-label^="Volver"],button[aria-label^="Regresar"],button[aria-label^="Atrás"]';
let syncing=false,timer;
function sync(header,custom=false){
 if(!header||syncing)return;
 // The simulator owns its one-row back/selector/share header.
 if(route()==='simulator'){
  document.body.dataset.headerOwner='custom';
  const top=document.querySelector('#app>.topbar');
  if(top)for(const [key,value] of [['display','none'],['visibility','hidden'],['opacity','0']])top.style.setProperty(key,value,'important');
  return;
 }
 // Rankings includes its own back/share controls, title and category tabs.
 // Do not inject the 88px universal chrome or reparent its buttons.
 if(route()==='rankings'&&matchMedia('(max-width:1023px)').matches){
  document.body.dataset.headerOwner='custom';
  document.querySelectorAll('#screen .v32-head').forEach(node=>{
   node.classList.remove('ljr-scroll-header','ljr-header-v777');
   node.querySelector('.ljr-chrome-actions')?.remove();
  });
  const globalTop=document.querySelector('#app>.topbar');
  if(globalTop){
   globalTop.querySelector('.ljr-chrome-actions')?.remove();
   globalTop.classList.remove('ljr-header-v777');
   globalTop.style.setProperty('display','none','important');
   globalTop.style.setProperty('visibility','hidden','important');
   globalTop.style.setProperty('opacity','0','important');
  }
  return;
 }
 // Scorers owns its direct controls and avatar. Do not move/remove them
 // as duplicate global controls; its scroll controller measures this bar.
 if(route()==='scorers'&&!custom&&window.__LJR_V959_SCORERS_HEADER__&&matchMedia('(max-width:1023px)').matches){
  document.body.dataset.headerOwner='global';
  header.querySelector('.ljr-chrome-actions')?.remove();
  for(const [key,value] of [['display','block'],['visibility','visible'],['opacity','1']]){
   if(header.style.getPropertyValue(key)!==value)header.style.setProperty(key,value,'important');
  }
  return;
 }
 syncing=true;
 try{
 if(HEADERLESS_GAMES.has(route())){
  const top=document.querySelector('#app>.topbar');
  document.body.dataset.headerOwner='overlay';
  if(top){
   top.style.setProperty('display','none','important');
   top.style.setProperty('visibility','hidden','important');
   top.style.setProperty('opacity','0','important');
   top.querySelector('.ljr-chrome-actions')?.remove();
  }
  document.querySelectorAll('#screen .ljr-chrome-actions').forEach(n=>n.remove());
  return;
 }
 if(!document.body.classList.contains('ljr-v777'))document.body.classList.add('ljr-v777');
 document.querySelectorAll('.ljr-header-v777').forEach(h=>{if(h!==header)h.classList.remove('ljr-header-v777')});
 if(!header.classList.contains('ljr-header-v777'))header.classList.add('ljr-header-v777');
 const overlay=custom&&header.matches('.v22-fantasy-master,.v33-about-tools');
 header.classList.toggle('ljr-header-overlay',overlay);
 document.body.dataset.headerOwner=overlay?'overlay':custom?'custom':'global';
 let bar=header.querySelector('.ljr-chrome-actions');
 if(!bar){bar=document.createElement('div');bar.className='ljr-chrome-actions';bar.innerHTML='<div class="ljr-chrome-left"></div><div class="ljr-chrome-right"></div>';header.append(bar)}
 const left=bar.firstElementChild,right=bar.lastElementChild;
 const profiles=[...header.querySelectorAll(PROFILE)],backs=[...header.querySelectorAll(BACK)];
 let profile=profiles[0];profiles.slice(1).forEach(b=>b.remove());
 if(!profile){profile=document.createElement('button');profile.type='button';profile.className='ljr-profile-control';profile.onclick=()=>go('profile')}
 if(!profile.classList.contains('ljr-profile-control'))profile.classList.add('ljr-profile-control');if(profile.getAttribute('aria-label')!=='Mi perfil')profile.setAttribute('aria-label','Mi perfil');profile.removeAttribute('data-v62-team');
 const html=avatar();if(profile.innerHTML!==html)profile.innerHTML=html;
 if(profile.parentNode!==right)right.append(profile);
 let back=backs[0];backs.slice(1).forEach(b=>b.remove());
 if(!back){back=document.createElement('button');back.type='button';back.onclick=()=>window.LJR_NAVIGATION?.back?.()}
 if(!back.classList.contains('ljr-back-control'))back.classList.add('ljr-back-control');if(back.getAttribute('aria-label')!=='Regresar')back.setAttribute('aria-label','Regresar');
 if(back.innerHTML!==icons.back)back.innerHTML=icons.back;
 if(back.parentNode!==left)left.prepend(back);
 back.hidden=route()==='home';
 back.classList.remove('is-hidden');
 for(const b of [back,profile]){for(const [key,value] of Object.entries({position:'relative',inset:'auto',transform:'none',display:b.hidden?'none':'grid',width:'32px',height:'32px','min-width':'32px','max-width':'32px','min-height':'32px','max-height':'32px',color:'#fff',overflow:'hidden'})){if(b.style.getPropertyValue(key)!==value)b.style.setProperty(key,value,'important')}}
 const candidates=[...header.querySelectorAll('button')].filter(b=>b!==back&&b!==profile&&!b.closest('.v35-tabs,.v32-tabs,.v28-tabs,.v41-search,.v27-search,.v431-shop-tabs,.v435-shop-tabs')&&!b.matches('[data-v32-tab],[data-v35-tab],[data-v28-cat],[data-v431-filter],[data-v431-search-close]'));
 for(const b of candidates){
  const isMenu=b.matches('[data-v439-menu-toggle]');
  const isAction=isMenu||/compart|favorit|carrito|notific|buscar|ajuste|añadir/i.test(b.getAttribute('aria-label')||'')||b.matches('#v5Bell,[data-v33-about-share],.v32-icon,.v431-icon,.v414-icon');
  if(!isAction)continue;
  if(!b.classList.contains('ljr-header-action'))b.classList.add('ljr-header-action');const target=isMenu?left:right;
  if(b.parentNode!==target){if(isMenu)target.append(b);else target.insertBefore(b,profile)}
 }
 // No source can leave the active global header invisible after returning home.
 const top=document.querySelector('#app>.topbar');
 if(top){for(const [key,value]of [['display',custom?'none':'block'],['visibility',custom?'hidden':'visible'],['opacity',custom?'0':'1']])if(top.style.getPropertyValue(key)!==value)top.style.setProperty(key,value,'important')}
 }finally{syncing=false}
}
window.LJR_CHROME={sync,avatar};
function patch(){
 if(!document.body.classList.contains('ljr-v777'))document.body.classList.add('ljr-v777');
 if(route()==='quizArena'){const game=document.querySelector('.v766-quiz-start');if(game&&!game.querySelector('.ljr-quiz-head')){const head=document.createElement('header');head.className='ljr-quiz-head';const back=game.querySelector('.v766-back');if(back)head.append(back);game.prepend(head);window.LJR_SCROLL_CHROME?.refresh?.()}}
 const custom=document.querySelector('#screen .v22-fantasy-master,#screen .v33-about-tools,#screen .ljr-quiz-head,#screen .ljr-scroll-header'),top=document.querySelector('#app>.topbar');
 sync(custom||top,!!custom);
 document.querySelectorAll('.bottom-nav .nav-item').forEach(b=>{const label=b.querySelector('[data-nav-label],.nav-label,small,span:last-child');if(label&&label.children.length===0){const labels={home:'inicio',competition:'competición',video:'vídeo',fantasy:'fantasy',more:'más'};const value=labels[b.dataset.route];if(value&&label.textContent!==value)label.textContent=value}});
 document.querySelectorAll('.v726-hero-pills,.v105-footnote').forEach(n=>n.remove());
 if(route()==='profile'){
  const a=account();document.body.dataset.authState=a?'signed-in':'guest';
  document.querySelectorAll('.v569-profile-avatar').forEach(n=>{if(n.innerHTML!==avatar(a))n.innerHTML=avatar(a)});
  const name=document.querySelector('.v569-profile-copy h1');if(name&&a&&name.textContent!=='Hola, '+a.name)name.textContent='Hola, '+a.name;
  const root=document.querySelector('#screen');let settingsBtn=root?.querySelector('[data-ljr-account-settings]');
  if(!a){settingsBtn?.remove()}
  else if(root){
   if(!settingsBtn){settingsBtn=document.createElement('button');settingsBtn.dataset.ljrAccountSettings=''}
   settingsBtn.type='button';
   const settingsClass='v12-profile-row ljr-profile-action-row ljr-profile-settings-row';
   if(settingsBtn.className!==settingsClass)settingsBtn.className=settingsClass;
   settingsBtn.removeAttribute('style');
   if(settingsBtn.dataset.v901Markup!=='1'){
     settingsBtn.innerHTML='<span class="v12-profile-row-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Zm8.1 5.1v-2.6l-2.2-.8a7 7 0 0 0-.7-1.7l1-2.1-1.8-1.8-2.1 1a7 7 0 0 0-1.7-.7L11.8 2H9.2l-.8 2.2a7 7 0 0 0-1.7.7l-2.1-1-1.8 1.8 1 2.1a7 7 0 0 0-.7 1.7l-2.2.8v2.6l2.2.8a7 7 0 0 0 .7 1.7l-1 2.1 1.8 1.8 2.1-1a7 7 0 0 0 1.7.7l.8 2.2h2.6l.8-2.2a7 7 0 0 0 1.7-.7l2.1 1 1.8-1.8-1-2.1a7 7 0 0 0 .7-1.7l2.2-.8Z" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round"/></svg></span><span class="v12-profile-row-label">Ajustes de la aplicación</span><span class="v12-profile-row-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
     settingsBtn.dataset.v901Markup='1';
   }
   settingsBtn.onclick=settings;
   const menu=root.querySelector('.v12-profile-menu');
   if(menu){
    const logout=menu.querySelector('[data-v569-logout]');
    if(logout){
     if(settingsBtn.parentElement!==menu||settingsBtn.nextElementSibling!==logout)menu.insertBefore(settingsBtn,logout);
    }else if(settingsBtn.parentElement!==menu)menu.append(settingsBtn);
   }
  }
 }
 if(['safe-about','history'].includes(route()))document.querySelectorAll('#screen h3,#screen b').forEach(n=>{if(/^(Videos 22-32-59 ya incorporados|Archivo comprobado)$/.test(n.textContent.trim()))n.closest('article')?.remove()});
 const fav=document.querySelector('.v414-ref-page');fav?.classList.add('ljr-blue-favorites');
 if(['fantasy','quizArena','moreLess','predictor','predictorSix'].includes(route()))document.body.dataset.screenMode='fixed';else document.body.dataset.screenMode='scroll';
 const boot=document.getElementById('ljr-boot');if(document.querySelector('#screen')?.children.length)requestAnimationFrame(()=>requestAnimationFrame(()=>boot?.remove()));
}
function settings(){
 if(!account())return;
 const n=media().modal('Ajustes de la aplicación','<div class="cms-form"><button data-lang>Tu idioma preferido</button><button data-notify>Notificaciones</button><button data-access>Accesibilidad y pantalla</button><button data-help>Ayuda y comentarios</button><button data-privacy>Ajustes de privacidad</button><button data-terms>Términos y condiciones</button><button data-copy>Copiar enlace</button><button data-browser>Abrir en el navegador</button></div>');
 for(const [sel,kind]of [['lang','language'],['notify','notifications'],['help','feedback'],['privacy','privacy'],['terms','terms']])n.querySelector('[data-'+sel+']').onclick=()=>{n.querySelector('[data-close]').click();setting(kind)};
 n.querySelector('[data-copy]').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);n.querySelector('[data-status]').textContent='Enlace copiado.'}catch{n.querySelector('[data-status]').textContent=location.href}};
 n.querySelector('[data-browser]').onclick=()=>window.open(location.href,'_blank','noopener');
 n.querySelector('[data-access]').onclick=()=>{const p=media().modal('Accesibilidad y pantalla','<label class="v5-toggle-row"><span>Texto más grande</span><input type="checkbox" data-text></label><label class="v5-toggle-row"><span>Reducir animaciones</span><input type="checkbox" data-motion></label>');for(const [key,cls]of [['text','ljr-large-text'],['motion','ljr-reduce-motion']]){const input=p.querySelector('[data-'+key+']');input.checked=localStorage.getItem(cls)==='1';input.onchange=()=>{localStorage.setItem(cls,input.checked?'1':'0');document.body.classList.toggle(cls,input.checked)}}};
}
function stored(key){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}}
function setting(kind){
 if(kind==='language'){
  const a=stored('lj-store-v5'),n=media().modal('Tu idioma preferido','<div class="cms-form"><label>Idioma<select data-language><option value="Español">Español (México)</option><option value="English">English</option></select></label><p>Los nombres y las publicaciones de la Liga conservan su idioma original.</p></div>');
  const select=n.querySelector('select');select.value=a.language==='English'?'English':'Español';select.onchange=()=>{localStorage.setItem('lj-store-v5',JSON.stringify({...a,language:select.value}));dispatchEvent(new Event('storage'));n.querySelector('[data-status]').textContent='Idioma guardado.'};return;
 }
 if(kind==='feedback'){
  const n=media().modal('Ayúdanos a mejorar','<form class="cms-form"><label>¿Qué quieres informar?<select name="type">'+['Rendimiento de la app','Gaming','Cuenta e inicio de sesión','Notificaciones','Datos incorrectos','Contenido','Guía de eventos','Funciones que faltan'].map(t=>'<option>'+t+'</option>').join('')+'</select></label><label>Tu comentario<textarea name="message" rows="5" required maxlength="2000" placeholder="Describe el problema o tu sugerencia"></textarea></label><button type="submit">Enviar a la administración</button></form>');
  n.querySelector('form').onsubmit=async e=>{e.preventDefault();const form=e.target,b=form.querySelector('button'),data=new FormData(form);b.disabled=true;try{await media().api('feedback',{method:'POST',body:{message:data.get('type')+': '+data.get('message'),name:account()?.name||'Visitante'}});form.reset();n.querySelector('[data-status]').textContent='Comentario enviado al buzón de la Liga.'}catch(err){n.querySelector('[data-status]').textContent=err.message}finally{b.disabled=false}};return;
 }
 if(kind==='privacy'){
  const st=stored('lj-store-v3'),prefs={analytics:false,personalization:true,...st.privacy},n=media().modal('Ajustes de privacidad','<div class="cms-form"><p>Tu cuenta, avatar, favoritos y juegos se guardan en este dispositivo. Las publicaciones oficiales se guardan en el servicio de la Liga.</p><label>Personalizar con mis equipos seguidos<input data-personalization type="checkbox"></label><button data-clear>Restablecer favoritos y preferencias</button><p>Solicita una corrección o la retirada de contenido desde Ayúdanos a mejorar.</p></div>');const c=n.querySelector('input');c.checked=prefs.personalization;c.onchange=()=>{prefs.personalization=c.checked;const current=stored('lj-store-v3');localStorage.setItem('lj-store-v3',JSON.stringify({...current,privacy:prefs}));if(window.LJR_MAIN_ROUTE?.state)window.LJR_MAIN_ROUTE.state.privacy=prefs;n.querySelector('[data-status]').textContent='Preferencia guardada.'};n.querySelector('[data-clear]').onclick=()=>{if(!confirm('¿Restablecer favoritos, seguimiento y preferencias de este dispositivo?'))return;const current=stored('lj-store-v3');for(const key of ['favorites','followed'])current[key]=[];current.privacy={analytics:false,personalization:false,accepted:true};localStorage.setItem('lj-store-v3',JSON.stringify(current));if(window.LJR_MAIN_ROUTE?.state)Object.assign(window.LJR_MAIN_ROUTE.state,current);n.querySelector('[data-status]').textContent='Preferencias restablecidas.'};return;
 }
 if(kind==='terms'){media().modal('Términos y condiciones','<div class="cms-form"><h3>Liga Municipal de Fútbol Juventino Rosas</h3><p>Consulta partidos, clasificación, jugadores, historia y publicaciones oficiales. La administración de la Liga es responsable de publicar y corregir sus datos.</p><h3>Cuentas y juegos</h3><p>Tu cuenta y tus elecciones de Fantasy y pronósticos se conservan en este dispositivo. Son juegos recreativos y no alteran resultados oficiales ni otorgan permisos de administración.</p><h3>Imágenes y publicaciones</h3><p>El administrador debe contar con autorización para publicar fotografías, videos, logos y datos de los jugadores. Las historias se muestran durante 24 horas.</p><h3>Ayuda</h3><p>Informa errores y solicita correcciones desde Ayúdanos a mejorar. La administración puede revisar tu mensaje en su buzón.</p></div>');return}
 if(kind==='notifications'){go('safe-notifications')}
}
window.LJR_SETTINGS={open:settings,show:setting};
for(const cls of ['ljr-large-text','ljr-reduce-motion'])if(localStorage.getItem(cls)==='1')document.body.classList.add(cls);
window.addEventListener('click',e=>{
 const option=e.target.closest?.('button,a');if(option&&!option.closest('.liga-media-modal')){const action=option.dataset.v12Action, destination=option.dataset.safeRoute||option.dataset.v412Go||option.dataset.route||'',label=option.textContent.trim(),kind=['language','feedback','privacy','terms'].includes(action)?action:/^(safe-|v5-)(language|feedback|privacy|terms|consent)$/.test(destination)?destination.replace(/^(safe-|v5-)/,'').replace('consent','privacy'):label==='Tu idioma preferido'?'language':label==='Ayúdanos a mejorar'?'feedback':label==='Ajustes de privacidad'?'privacy':label==='Términos y condiciones'?'terms':'';if(kind){e.preventDefault();e.stopImmediatePropagation();setting(kind);return}}
 const profile=e.target.closest?.('.ljr-chrome-actions .ljr-profile-control');
 if(profile){e.preventDefault();e.stopImmediatePropagation();go('profile');return}
 const back=e.target.closest?.('.ljr-chrome-actions .ljr-back-control');
 if(back){e.preventDefault();e.stopImmediatePropagation();window.LJR_NAVIGATION?.back?.()}
},true);
const schedule=()=>{clearTimeout(timer);timer=setTimeout(patch,35)};
const screen=document.querySelector('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
for(const event of ['hashchange','pageshow','liga:admin','liga:content','storage'])addEventListener(event,schedule);
addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
schedule();
})();

/* Picker options own their click; a choice is never team navigation. */
(()=>{
const esc=s=>window.LJR_CMS?.esc(s)||String(s??''),svg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>';
const cats=[['primera','https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/branding/primera-fuerza-hd.png'],['intermedia','https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/categories/intermedia.webp'],['segunda','https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/categories/segunda-fuerza.webp'],['35','https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/categories/veteranos-35-user.png'],['50','https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/categories/veteranos-50.webp']];
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function type(s){const label=s.labels?.[0]?.textContent||s.closest('label')?.textContent||'';const desc=norm(label+' '+s.id+' '+s.name+' '+Object.keys(s.dataset).join(' '));if(/categori|category|cat-filter|filter-category/.test(desc))return 'categoría';if(/jugador|player|scorer/.test(desc))return 'jugador';if(/equipo|team|local|visitante|squad/.test(desc))return 'equipo';if([...s.options].filter(o=>cats.some(([name])=>norm(o.textContent).includes(name))).length>=3)return 'categoría';return ''}
function icon(text,kind){let src='';if(kind==='categoría')src=cats.find(([name])=>norm(text).includes(name))?.[1];if(kind==='jugador')src=window.LJR_PLAYER_MEDIA?.photo?.(text);if(kind==='equipo')src=window.LJR_TEAM_LOGOS?.get?.(text)||window.LJR_OFFICIAL_API?.getLogo?.(text);return src?'<img src="'+esc(src)+'" alt="">':'<span class="ljr-picker-fallback">'+(kind==='jugador'?svg:kind==='categoría'?'🏆':'⚽')+'</span>'}
function refresh(){for(const select of document.querySelectorAll('#screen select')){
 if(select.multiple||select.dataset.v777Picker||select.closest('.liga-media-modal,.v105-modal'))continue;
 const kind=type(select);if(!kind||select.options.length<2)continue;
 select.dataset.v777Picker=kind;let wrapper=select.closest('.ljr-icon-picker');if(!wrapper){wrapper=document.createElement('div');wrapper.className='ljr-icon-picker';select.before(wrapper);wrapper.append(select)}
 select.classList.add('ljr-native-select');select.tabIndex=-1;
 const b=document.createElement('button');b.type='button';b.className='ljr-picker-open';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-label','Seleccionar '+kind);wrapper.append(b);
 const update=()=>{const o=select.selectedOptions[0];b.innerHTML=icon(o?.textContent,kind)+'<span>'+esc(o?.textContent||'Seleccionar')+'</span><span aria-hidden="true">⌄</span>';b.disabled=select.disabled};select.addEventListener('change',update);update();
 b.onclick=()=>{
 const n=window.LJR_MEDIA.modal('Seleccionar '+kind,'<label>Buscar<input data-ljr-search type="search" placeholder="Escribe el nombre"></label><div class="ljr-picker-options" role="listbox"></div>');
 const list=n.querySelector('[role=listbox]'),search=n.querySelector('input');
 const draw=()=>{list.innerHTML=[...select.options].map((o,i)=>({o,i})).filter(({o})=>!o.disabled&&norm(o.textContent).includes(norm(search.value))).map(({o,i})=>'<button type="button" role="option" data-ljr-choice="'+i+'" aria-selected="'+o.selected+'">'+icon(o.textContent,kind)+'<span>'+esc(o.textContent)+'</span></button>').join('');list.querySelectorAll('[data-ljr-choice]').forEach(choice=>choice.__choose=()=>{select.selectedIndex=+choice.dataset.ljrChoice;select.dispatchEvent(new Event('change',{bubbles:true}));n.querySelector('[data-close]').click();if(b.isConnected)b.focus({preventScroll:true})})};
 search.oninput=draw;list.onkeydown=e=>{const all=[...list.querySelectorAll('button')],i=all.indexOf(document.activeElement);if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();all[(i+(e.key==='ArrowDown'?1:-1)+all.length)%all.length]?.focus()}};search.onkeydown=e=>{if(e.key==='ArrowDown'){e.preventDefault();list.querySelector('button')?.focus()}};draw();search.focus();
 };
}}
window.addEventListener('click',e=>{const b=e.target.closest?.('[data-ljr-choice]');if(b){e.preventDefault();e.stopImmediatePropagation();b.__choose?.();return}const open=e.target.closest?.('.ljr-picker-open');if(open){e.preventDefault();e.stopImmediatePropagation();open.onclick?.(e)}},true);
window.LJR_SELECTORS={refresh};
})();
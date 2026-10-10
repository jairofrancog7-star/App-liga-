/* Desktop parity: feature routes use the existing live app modules instead of static placeholders.
   This adapter never runs on mobile/APK, and never changes official league records. */
(function(){
'use strict';
if(window.__LJR_DESKTOP_PARITY_20261008__)return;
window.__LJR_DESKTOP_PARITY_20261008__=true;
const nativeRoutes=[
 'fantasy','fantasyTeam','fantasyLeagues','quiniela','predictor','predictorSix',
 'quizArena','quiz','moreLess','moreLessHub','moreLessGallery','vote','moments',
 'transfers','following','teamDetail','playerDetail','playerCompare','compare',
 'comparar','v4-compare','players','match','matchCenter','match-center',
 'stats','rankings','historyLog','newsDetail','notices','scheduleChanges',
 'favorites','search','accountRegister','accountLogin','accountEdit',
 'accountSecurity','accountPassword','accountDevices','accountPrivacy','publicationCenter',
 'ligaControl','adminFut','appInstall','positions','cards','suspensions',
 'privacy','leagueTools','recruitment','v38Stats','v38Weekly','v38Weather',
 'v38Alerts','tableExport','bracketBuilder','credentialBuilder','cedulaBuilder',
 'permissionBuilder','agendaBuilder','motionHub','suspensionTool','rulebook',
 'matchday','weatherFields','cedulas','cedulaDetail','credential',
 'publications','tactics','simulator','jrControl','refereeOffline',
 'discipline','disciplina','disciplineTool','venues','compareTeams','teamCompare'
];
const routes=new Set(nativeRoutes);
window.LJR_PC_NATIVE_ROUTES=routes;
const current=()=>String(location.hash||'').replace('#/','').replace('#','').split('?')[0]||'home';
const query=()=>new URLSearchParams(location.search).get('mode')||'';
const desktop=()=>query()!=='mobile'&&query()!=='apk'&&
 (query()==='desktop'||document.body.classList.contains('lj-desktop')||
 document.documentElement.classList.contains('preview-desktop')||innerWidth>=1024);
const go=r=>{location.hash='#/'+r};
const names={
 fantasy:'Fantasy',quiniela:'Quiniela',predictor:'Pronósticos',predictorSix:'Pronostica 6',
 quizArena:'Quiz Arena',moreLess:'Más o Menos',transfers:'Centro de fichajes',
 playerCompare:'Comparar jugadores',compare:'Comparar jugadores',comparar:'Comparar jugadores',
 'v4-compare':'Comparar jugadores',following:'Equipos que sigo',teamDetail:'Detalle de equipo',
 playerDetail:'Perfil del jugador',match:'Partido',matchCenter:'Centro de partido',
 'match-center':'Centro de partido',weatherFields:'Clima y campos',
 leagueTools:'Herramientas de liga',tableExport:'Exportar tablas',
 bracketBuilder:'Cuadro de eliminatorias',credentialBuilder:'Credenciales',
 cedulaBuilder:'Cédulas',permissionBuilder:'Permisos',
 publicationCenter:'Publicaciones',quiniela:'Quiniela',
 publications:'Publicaciones',rulebook:'Reglamento',historyLog:'Historial',
 scheduleChanges:'Cambios de jornada',vote:'Jugador de la semana',
 moments:'Momentos',favorites:'Favoritos',agendaBuilder:'Agenda',
 profile:'Cuenta',adminFut:'Administración',jrControl:'JR Control',
 compareTeams:'Comparar equipos',teamCompare:'Comparar equipos',
 appInstall:'Instalar aplicación',matchday:'Centro de Jornada',
 refereeOffline:'Cédulas del árbitro',cedulas:'Archivo de cédulas'
};
const navButtons=[
 ['Inicio','home'],['Partidos','pc-fixtures'],['Clasificación','pc-standings'],
 ['Goleadores','pc-scorers'],['Quiniela','quiniela'],['Fantasy','fantasy'],
 ['Herramientas PC','pc-tools']
];
function toolbar(){
 let el=document.getElementById('ljpc-native-toolbar');
 if(!el){
  el=document.createElement('nav');el.id='ljpc-native-toolbar';
  el.setAttribute('aria-label','Navegación de herramientas de escritorio');
  const screen=document.getElementById('screen');
  if(!screen?.parentNode)return;
  screen.parentNode.insertBefore(el,screen);
 }
 const r=current();
 const label=names[r]||r.replace(/([A-Z])/g,' $1').replace(/[-_]/g,' ').trim();
 const title=el.querySelector('[data-ljpc-native-title]');
 if(!title||title.textContent!==label){
  const heading=document.createElement('strong');heading.dataset.ljpcNativeTitle='1';heading.textContent=label;
  el.replaceChildren(heading);
  const actions=document.createElement('div');actions.className='ljpc-native-links';
  navButtons.forEach(([name,route])=>{
   const b=document.createElement('button');b.type='button';b.textContent=name;
   b.dataset.ljpcNativeLink=route;b.className=route===r?'active':'';
   actions.appendChild(b);
  });
  el.appendChild(actions);
 }
}
function enhanceNavigation(){
 const nav=document.querySelector('.ds-menu,.desk-menu');
 if(nav&&!nav.querySelector('[data-ljpc-desktop-tools]')){
  const b=document.createElement('button');b.type='button';
  b.textContent='Herramientas PC';b.dataset.ljpcDesktopTools='1';
  nav.appendChild(b);
 }
 const home=document.querySelector('.desk-tools');
 if(home&&!home.querySelector('[data-ljpc-desktop-tools]')){
  const b=document.createElement('button');b.type='button';b.className='desk-tool';
  b.dataset.ljpcDesktopTools='1';
  b.innerHTML='<span aria-hidden="true">🖥️</span><b>Herramientas PC</b><small>Todas las funciones nuevas de la liga</small>';
  home.appendChild(b);
 }
 const directory=document.querySelector('.lj-dir-tiles');
 if(directory&&!directory.querySelector('[data-ljpc-desktop-tools]')){
  const b=document.createElement('button');b.type='button';b.className='lj-dir-tile';
  b.dataset.ljpcDesktopTools='1';
  b.innerHTML='<span aria-hidden="true">🖥️</span>Herramientas PC';
  directory.appendChild(b);
 }
}
function sync(){
 const enabled=desktop();
 // Evitar el formulario demo de PC: abrir el módulo real de autenticación.
 if(enabled&&current()==='profile'){go('accountLogin');return}
 const native=enabled&&routes.has(current());
 document.body.classList.toggle('ljpc-native-route',native);
 if(native)toolbar();
 else document.getElementById('ljpc-native-toolbar')?.remove();
 if(enabled)enhanceNavigation();
}
document.addEventListener('click',e=>{
 const target=e.target instanceof Element?e.target:null;
 const btn=target?.closest('[data-ljpc-desktop-tools],[data-ljpc-native-link]');
 if(!btn||!desktop())return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 go(btn.dataset.ljpcNativeLink||'pc-tools');
},true);
let pending=false;
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;sync()})}
window.addEventListener('hashchange',schedule);
window.addEventListener('resize',schedule);
document.addEventListener('DOMContentLoaded',()=>{
 sync();
 const node=document.querySelector('#app')||document.body;
 new MutationObserver(schedule).observe(node,{childList:true,subtree:true});
});
if(document.readyState!=='loading'){
 sync();
 const node=document.querySelector('#app')||document.body;
 new MutationObserver(schedule).observe(node,{childList:true,subtree:true});
}
})();
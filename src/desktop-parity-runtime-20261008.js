/* PC global feature parity: works with the already-installed desktop shell and real app views. */
(function(){
'use strict';
if(window.__LJR_PC_RUNTIME_V975__)return;
window.__LJR_PC_RUNTIME_V975__=true;
const route=()=>String(location.hash||'').replace('#/','').replace('#','').split('?')[0]||'home';
const mode=()=>new URLSearchParams(location.search).get('mode')||'';
const desktop=()=>!['mobile','apk'].includes(mode())&&(mode()==='desktop'||document.body.classList.contains('lj-desktop')||innerWidth>=1024);
const go=r=>{location.hash='#/'+r};
const toolGroups=[
 ['Competiciones y resultados',[
  ['⚽','Partidos oficiales','pc-fixtures'],['🏆','Clasificación','pc-standings'],
  ['🥅','Goleadores','pc-scorers'],['📆','Calendario','pc-calendar'],
  ['🧩','Cuadro eliminatorio','bracketBuilder'],['📊','Exportar tablas','tableExport']]],
 ['Gaming y comunidad',[
  ['🎯','Quiniela','quiniela'],['🔮','Pronostica 6','predictorSix'],
  ['👕','Fantasy','fantasy'],['🧠','Quiz Arena','quizArena'],
  ['⚖️','Más o Menos','moreLess'],['⭐','Jugador de la semana','vote']]],
 ['Equipos, jugadores y fichajes',[
  ['🛡️','Mis equipos','following'],['↔️','Comparar jugadores','playerCompare'],
  ['🛒','Fichajes','transfers'],['📋','Jugadores','players'],
  ['📈','Estadísticas','stats'],['🔎','Buscar','search']]],
 ['Sedes, multimedia y avisos',[
  ['🌦️','Clima y campos','weatherFields'],['🎬','Momentos','moments'],
  ['🔔','Notificaciones','pc-notifications'],['📣','Avisos','notices'],
  ['📖','Reglamento','rulebook'],['🗓️','Agenda','agendaBuilder']]],
 ['Gestión de la liga',[
  ['📋','Centro administrativo','adminFut'],['🪪','Credenciales','credentialBuilder'],
  ['🧾','Cédulas','cedulaBuilder'],['🗂️','Publicaciones','publicationCenter'],
  ['🚦','Disciplina','discipline'],['🛠️','JR Control','jrControl']]]
];
function renderTools(){
 const screen=document.getElementById('screen');if(!screen)return;
 let page=screen.querySelector(':scope > .ds-page');
 if(!page)return;
 const host=page.querySelector('.ds-content > .ds-wrap');
 if(!host)return;
 if(host.querySelector('[data-pc-tools-hub]'))return;
 const h=page.querySelector('.ds-pagehead h1');if(h)h.textContent='Herramientas PC';
 const p=page.querySelector('.ds-pagehead p');if(p)p.textContent='Las mismas funciones reales de la app azul, adaptadas al navegador de computadora.';
 host.innerHTML='<div class="ljpc-toolhub" data-pc-tools-hub><div class="ljpc-hub-head"><span>🖥️ CENTRO DE ESCRITORIO</span><p>Abre las herramientas originales y conserva sus datos, categorías y preferencias. Algunas funciones administrativas requieren inicio de sesión.</p></div>'+
 toolGroups.map(([title,tools])=>'<section class="ljpc-hub-group"><h2>'+title+'</h2><div class="ljpc-hub-grid">'+
 tools.map(([symbol,label,r])=>'<button class="ljpc-hub-btn" type="button" data-ljpc-hub-route="'+r+'"><span aria-hidden="true">'+symbol+'</span><b>'+label+'</b><i aria-hidden="true">›</i></button>').join('')+'</div></section>').join('')+'</div>';
}
function restoreNative(){
 const name=route();if(!desktop()||!window.LJR_PC_NATIVE_ROUTES?.has(name))return;
 const screen=document.getElementById('screen'),api=window.LJR_MAIN_ROUTE;
 if(!screen||!api?.render)return;
 // Static desktop pages must never replace the existing feature implementation.
 const overwritten=screen.querySelector(':scope > [data-desktop-shell],:scope > [data-ds-page],:scope > [data-lj-special]');
 if(!overwritten)return;
 api.state.route=name;
 api.render();
}
const css=`
body.ljpc-native-route #screen{box-sizing:border-box!important;width:min(1320px,calc(100% - 32px))!important;max-width:1320px!important;margin:0 auto!important;padding:16px 14px 45px!important;overflow:visible!important;background:transparent!important}
body.ljpc-native-route{background:radial-gradient(circle at 55% -220px,#0c448b 0%,#081b47 450px,#06132e 100%) fixed!important;color:#eaf5ff!important}
body.ljpc-native-route #app>.topbar,body.ljpc-native-route #app>.bottom-nav{display:none!important}
body.ljpc-native-route #screen *{box-sizing:border-box}
body.ljpc-native-route #screen img{max-width:100%}
body.ljpc-native-route #screen table{max-width:100%}
body.ljpc-native-route #screen .v64-table-wrap,body.ljpc-native-route #screen .table-wrap,body.ljpc-native-route #screen [class*="table-scroll"]{max-width:100%;overflow-x:auto}
#ljpc-native-toolbar{position:sticky;top:0;z-index:900;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:9px max(20px,calc((100vw - 1320px)/2));min-height:54px;background:linear-gradient(100deg,#061431,#07418b,#09255b);color:#fff;box-shadow:0 4px 24px #030d2680;border-bottom:1px solid #49adfa50;font-family:system-ui,sans-serif}
#ljpc-native-toolbar strong{font-size:14px;line-height:1.25;white-space:nowrap}
#ljpc-native-toolbar .ljpc-native-links{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
#ljpc-native-toolbar button{min-height:32px;border:1px solid #ffffff2d;border-radius:8px;background:#ffffff12;color:#f7fbff;padding:6px 11px;font:700 11px system-ui;cursor:pointer}
#ljpc-native-toolbar button:hover,#ljpc-native-toolbar button.active{background:#2379e4;border-color:#68b8ff}
body.lj-desktop .ds-menu>[data-ljpc-desktop-tools],body.lj-desktop .desk-menu>[data-ljpc-desktop-tools]{border-radius:7px;padding:8px 11px;background:linear-gradient(135deg,#0055a5,#1977d4);color:#fff}
.ljpc-toolhub{max-width:1200px;margin:0 auto;padding:6px 0 24px}
.ljpc-hub-head{background:linear-gradient(115deg,#071a40,#0a4a96);color:#fff;border:1px solid #59b9ff55;padding:18px 20px;border-radius:14px;margin:0 0 18px}
.ljpc-hub-head>span{font-size:11px;letter-spacing:.1em;font-weight:900;color:#b9e5ff}
.ljpc-hub-head p{font-size:12px;line-height:1.5;margin:8px 0 0;color:#d8ebff}
.ljpc-hub-group{margin:0 0 20px}
.ljpc-hub-group h2{font-size:15px!important;font-weight:850;color:#0a235c;margin:0 0 9px}
.ljpc-hub-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.ljpc-hub-btn{display:flex;gap:10px;align-items:center;min-height:57px;width:100%;padding:11px 13px!important;border:1px solid #cfdeed!important;border-radius:10px!important;background:#fff!important;color:#10294a!important;text-align:left!important;cursor:pointer!important;box-shadow:0 4px 14px #0b2f5610}
.ljpc-hub-btn:hover{background:#f0f8ff!important;border-color:#438fce!important}
.ljpc-hub-btn span{font-size:20px}.ljpc-hub-btn b{font-size:12px;flex:1}.ljpc-hub-btn i{font-size:22px;font-style:normal;color:#2674bf}
@media(max-width:1100px){.ljpc-hub-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#ljpc-native-toolbar{padding:9px 16px}}
@media(max-width:760px){.ljpc-hub-grid{grid-template-columns:1fr}#ljpc-native-toolbar{position:relative;display:block}#ljpc-native-toolbar .ljpc-native-links{margin-top:8px}body.ljpc-native-route #screen{width:100%!important;padding:10px!important}}
`;
function injectCss(){
 if(document.getElementById('ljpc-runtime-css'))return;
 const style=document.createElement('style');style.id='ljpc-runtime-css';style.textContent=css;document.head.appendChild(style);
}
function sync(){if(!desktop())return;injectCss();if(route()==='pc-tools')renderTools();else restoreNative()}
document.addEventListener('click',e=>{
 const hit=e.target instanceof Element?e.target.closest('[data-ljpc-hub-route]'):null;
 if(!hit||!desktop())return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 go(hit.dataset.ljpcHubRoute);
},true);
let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;sync()})}
function boot(){
 injectCss();sync();
 const app=document.getElementById('app')||document.body;
 new MutationObserver(schedule).observe(app,{childList:true,subtree:true});
}
window.addEventListener('hashchange',schedule);
window.addEventListener('resize',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
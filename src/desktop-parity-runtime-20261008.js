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
  [
    "Partidos, jornadas y estadísticas",
    [
      [
        "⚽",
        "Partidos y resultados",
        "pc-fixtures",
        "Jornadas de las cinco categorías"
      ],
      [
        "🏆",
        "Clasificación",
        "pc-standings",
        "Tablas oficiales por categoría"
      ],
      [
        "🥅",
        "Máximos goleadores",
        "pc-scorers",
        "Ranking de jugadores"
      ],
      [
        "📅",
        "Calendario PC",
        "pc-calendar",
        "Partidos, Google Calendar y compartir"
      ],
      [
        "🌐",
        "Reporte semanal",
        "v38Weekly",
        "Horarios, sedes y descarga"
      ],
      [
        "🏟️",
        "Centro de Jornada",
        "matchday",
        "Partidos destacados y sedes oficiales"
      ],
      [
        "🎥",
        "Match Center",
        "v4-matchcenter",
        "Ficha e información del partido"
      ],
      [
        "🧩",
        "Cuadro de liguilla",
        "bracketBuilder",
        "Crear y exportar cuadros"
      ],
      [
        "📊",
        "Descargar tablas",
        "tableExport",
        "Exportaciones de competición"
      ],
      [
        "🗺️",
        "Sedes y cómo llegar",
        "venues",
        "Campos reales y enlaces de Maps"
      ]
    ]
  ],
  [
    "Equipos, jugadores y comunidad",
    [
      [
        "🛡️",
        "Equipos de la liga",
        "teams",
        "Clubes y escudos"
      ],
      [
        "⭐",
        "Equipos seguidos",
        "following",
        "Favoritos de equipos"
      ],
      [
        "👤",
        "Jugadores",
        "players",
        "Plantillas y perfiles"
      ],
      [
        "⚖️",
        "Comparar jugadores",
        "playerCompare",
        "Estadísticas de dos jugadores"
      ],
      [
        "↔️",
        "Comparar equipos",
        "pc-team-compare",
        "Análisis entre clubes"
      ],
      [
        "🔄",
        "Fichajes",
        "transfers",
        "Altas y movimientos"
      ],
      [
        "📋",
        "Reclutamiento",
        "recruitment",
        "Registro y selección de equipos"
      ],
      [
        "📈",
        "Estadísticas oficiales",
        "v38Stats",
        "Datos de la temporada"
      ],
      [
        "📰",
        "Noticias y avisos",
        "notices",
        "Avisos disponibles públicamente"
      ],
      [
        "📚",
        "Historia de la liga",
        "history",
        "Campeones y temporadas"
      ]
    ]
  ],
  [
    "Multimedia, predicciones y herramientas",
    [
      [
        "📺",
        "Liga TV",
        "video",
        "Transmisiones y vídeos"
      ],
      [
        "🎬",
        "Momentos",
        "moments",
        "Galería de fútbol"
      ],
      [
        "🎮",
        "Fantasy",
        "fantasy",
        "Arma tu equipo"
      ],
      [
        "🎯",
        "Quiniela",
        "quiniela",
        "Pronostica partidos"
      ],
      [
        "🔮",
        "Pronostica seis",
        "predictorSix",
        "Predicciones de la jornada"
      ],
      [
        "🧠",
        "Quiz Arena",
        "quizArena",
        "Preguntas y competición"
      ],
      [
        "⚖️",
        "Más o Menos",
        "moreLess",
        "Juego de comparaciones"
      ],
      [
        "⭐",
        "Jugador de la semana",
        "vote",
        "Participación de la comunidad"
      ],
      [
        "🌦️",
        "Clima y canchas",
        "weatherFields",
        "Pronóstico y campos"
      ],
      [
        "☁️",
        "Avisos de clima",
        "v38Weather",
        "Información meteorológica"
      ],
      [
        "🔔",
        "Notificaciones",
        "pc-notifications",
        "Preferencias de avisos"
      ],
      [
        "📖",
        "Reglamento",
        "rulebook",
        "Consultar las reglas"
      ],
      [
        "📲",
        "Instalar la aplicación",
        "appInstall",
        "Acceso directo, Android e iPhone"
      ],
      [
        "🛍️",
        "Tienda de clubes",
        "club-store",
        "Productos y clubes"
      ]
    ]
  ],
  [
    "Administración y documentos · acceso autorizado",
    [
      [
        "🛠️",
        "JR Control",
        "jrControl",
        "Panel de administración"
      ],
      [
        "📋",
        "Administración de Liga",
        "ligaControl",
        "Controles de la liga"
      ],
      [
        "📑",
        "Cédulas oficiales",
        "cedulas",
        "Consultar documentos y partidos"
      ],
      [
        "🪪",
        "Constructor de credenciales",
        "credentialBuilder",
        "Vista previa y exportación"
      ],
      [
        "🧾",
        "Crear cédula",
        "cedulaBuilder",
        "Herramienta de cédulas"
      ],
      [
        "📚",
        "Archivo arbitral",
        "refereeOffline",
        "Cédulas sin conexión"
      ],
      [
        "👥",
        "Juntas y acuerdos",
        "tool:meeting",
        "Asistencia, votaciones y seguimiento"
      ],
      [
        "🤝",
        "Patrocinadores",
        "tool:sponsors",
        "Contratos y administración local"
      ],
      [
        "🚩",
        "Incidencias",
        "tool:incidents",
        "Bitácora por partido"
      ],
      [
        "👨‍⚖️",
        "Árbitros y oficiales",
        "tool:officials",
        "Designaciones y directorio"
      ],
      [
        "🟥",
        "Sanciones y expedientes",
        "tool:new-sanction",
        "Borradores disciplinarios"
      ],
      [
        "🏅",
        "Estudio de MVP",
        "tool:motm",
        "Jugador del partido"
      ],
      [
        "🧑‍💼",
        "Delegados",
        "tool:delegates",
        "Encargados de equipos"
      ],
      [
        "🗓️",
        "Cambios de jornada",
        "scheduleChanges",
        "Horarios y sedes"
      ],
      [
        "🔔",
        "Avisos oficiales",
        "publicationCenter",
        "Publicaciones con permisos"
      ],
      [
        "📁",
        "Permisos y archivos",
        "permissionBuilder",
        "Gestión documentaria"
      ],
      [
        "📅",
        "Agenda administrativa",
        "agendaBuilder",
        "Juntas y recordatorios"
      ],
      [
        "🗳️",
        "Encuestas",
        "tool:poll",
        "Participación y acuerdos"
      ],
      [
        "💾",
        "Respaldo de registros",
        "tool:backup-export",
        "Descarga manual autorizada"
      ],
      [
        "🔎",
        "Auditoría",
        "tool:audit",
        "Revisión de cambios"
      ],
      [
        "👤",
        "Mi cuenta",
        "accountLogin",
        "Acceso real a la cuenta"
      ]
    ]
  ]
];
const ADMIN_PC_TOOLS=new Set(['meeting','sponsors','incidents','officials','new-sanction','motm','delegates','poll','backup-export','audit']);
function openPCAdminTool(name){
 if(!ADMIN_PC_TOOLS.has(name))return;
 const media=window.LJR_MEDIA;
 const open=()=>{
  if(!window.LJR_MEDIA?.admin)return;
  try{
   if(typeof window.LJR_V105_OPEN_TOOL==='function'&&window.LJR_V105_OPEN_TOOL(name))return;
   const fallback={incidents:()=>window.LJR_INCIDENTS_PRO?.open?.(),motm:()=>window.LJR_MOTM_STUDIO?.open?.(),'new-sanction':()=>window.LJR_V1130_SANCTIONS_OPEN?.()};
   if(typeof fallback[name]==='function' && (
    (name==='incidents'&&typeof window.LJR_INCIDENTS_PRO?.open==='function')||
    (name==='motm'&&typeof window.LJR_MOTM_STUDIO?.open==='function')||
    (name==='new-sanction'&&typeof window.LJR_V1130_SANCTIONS_OPEN==='function'))){fallback[name]();return}
  }catch(err){console.error('[PC tools] No se pudo abrir la herramienta',name,err)}
  // El panel JR Control conserva la ruta autorizada y su propia implementación.
  go('ligaControl');
 };
 if(media?.admin){open();return}
 if(typeof media?.login==='function')media.login(()=>{if(window.LJR_MEDIA?.admin)open()});
 else go('ligaControl');
}

function renderTools(){
 const screen=document.getElementById('screen');if(!screen)return;
 let page=screen.querySelector(':scope > .ds-page');
 if(!page)return;
 const host=page.querySelector('.ds-content > .ds-wrap');
 if(!host)return;
 if(host.querySelector('[data-pc-tools-hub]'))return;
 const h=page.querySelector('.ds-pagehead h1');if(h)h.textContent='Herramientas PC';
 const p=page.querySelector('.ds-pagehead p');if(p)p.textContent='Funciones actualizadas de móvil y PC, con permisos y datos oficiales compartidos.';
 host.innerHTML='<div class="ljpc-toolhub" data-pc-tools-hub><div class="ljpc-hub-head"><span>🖥️ CENTRO DE ESCRITORIO</span><p>Accede a las funciones reales de la liga en computadora. Las herramientas de administración requieren sesión; los borradores locales no se publican automáticamente.</p></div><div class="ljpc-hub-controls"><label for="ljpc-tools-find">Buscar funciones de la liga</label><input id="ljpc-tools-find" data-ljpc-tools-find type="search" autocomplete="off" placeholder="Buscar calendario, equipos, quiniela, credenciales…" aria-controls="ljpc-tool-list"><span data-ljpc-tools-counter></span></div><div id="ljpc-tool-list">'+
 toolGroups.map(([title,tools])=>'<section class="ljpc-hub-group"><h2>'+title+'</h2><div class="ljpc-hub-grid">'+
 tools.map(([symbol,label,r,desc])=>'<button class="ljpc-hub-btn" type="button" data-ljpc-hub-route="'+r+'" title="'+desc+'"><span aria-hidden="true">'+symbol+'</span><span class="ljpc-hub-copy"><b>'+label+'</b><small>'+desc+'</small></span><i aria-hidden="true">›</i></button>').join('')+'</div></section>').join('')+'</div><p class="ljpc-hub-empty" data-ljpc-tools-empty hidden>No hay herramientas con ese nombre. Prueba otro término.</p></div>';
 const field=host.querySelector('[data-ljpc-tools-find]');
 const buttons=[...host.querySelectorAll('[data-ljpc-hub-route]')];
 const counter=host.querySelector('[data-ljpc-tools-counter]');
 const empty=host.querySelector('[data-ljpc-tools-empty]');
 const normalize=t=>String(t||'').toLocaleLowerCase('es-MX').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function filter(){
  const term=normalize(field?.value).trim();
  let matches=0;
  buttons.forEach(b=>{const visible=!term||normalize(b.textContent).includes(term);b.hidden=!visible;if(visible)matches++});
  host.querySelectorAll('.ljpc-hub-group').forEach(g=>{g.hidden=![...g.querySelectorAll('.ljpc-hub-btn')].some(b=>!b.hidden)});
  if(counter)counter.textContent=matches+' funciones';
  if(empty)empty.hidden=matches!==0;
 }
 field?.addEventListener('input',filter);
 filter();
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
.ljpc-hub-btn>span:first-child{font-size:20px;flex:0 0 28px}.ljpc-hub-btn .ljpc-hub-copy{display:flex;flex-direction:column;min-width:0;flex:1;gap:4px}.ljpc-hub-btn b{font-size:12px;line-height:1.25}.ljpc-hub-btn small{font-size:10px;line-height:1.3;color:#567498;font-style:normal;overflow-wrap:anywhere}.ljpc-hub-btn i{font-size:22px;font-style:normal;color:#2674bf}
.ljpc-hub-controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:0 0 18px;padding:12px 14px;border:1px solid #c9def0;border-radius:12px;background:#edf6ff}
.ljpc-hub-controls label{font:800 12px system-ui;color:#134677}
.ljpc-hub-controls input{flex:1 1 240px;min-width:0;padding:11px 12px;border:1px solid #b5cfe8;border-radius:9px;color:#0a235c;background:#fff;font:500 13px system-ui}
.ljpc-hub-controls [data-ljpc-tools-counter]{font:800 11px system-ui;color:#245f9c}
.ljpc-hub-empty{font:650 13px system-ui;color:#597597;padding:16px}
.ljpc-hub-group[hidden],.ljpc-hub-btn[hidden],.ljpc-hub-empty[hidden]{display:none!important}
body.lj-desktop :is(button,input,select,textarea,a):focus-visible{outline:2px solid #30a4fd!important;outline-offset:2px!important}
body.lj-desktop #screen :is(.ds-wrap,.desk-wrap){max-width:min(100%,1320px);box-sizing:border-box}
body.lj-desktop :is(.ds-page,.ds-content,.ds-wrap,.desk-wrap,.desk-main,.desk-page-shell,.desktop-liga){min-width:0}
body.lj-desktop #screen .ljpc-function-root{max-width:100%;min-width:0}
body.lj-desktop #screen .ljpc-match{min-width:0}
body.lj-desktop #screen .ljpc-team span{min-width:0;overflow-wrap:anywhere}
body.lj-desktop #screen .ljpc-data-tablebox,body.lj-desktop #screen .ljpc-panel{max-width:100%}
body.lj-desktop #screen button{touch-action:manipulation}
@media (max-width:980px){body.lj-desktop #screen .ljpc-match{grid-template-columns:minmax(0,1fr) minmax(70px,100px) minmax(0,1fr)}body.lj-desktop #screen .ljpc-match>.ljpc-muted{grid-column:1/-1}}

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
 const destination=String(hit.dataset.ljpcHubRoute||'');
 if(destination.startsWith('tool:'))openPCAdminTool(destination.slice(5));
 else if(destination==='accountLogin')go('accountLogin');
 else go(destination);
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
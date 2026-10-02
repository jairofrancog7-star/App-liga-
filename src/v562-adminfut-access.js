/* V562 — Puente AdminFut + Registro + instalación. */
(function(){
'use strict';
if(window.__LJR_V562_ADMINFUT_BRIDGE__)return;
window.__LJR_V562_ADMINFUT_BRIDGE__=true;

const DEFAULT_SERVER='https://www.juventinorosasliga.com';
const BLUE_ACTIONS='https://github.com/jairofrancog7-star/App-liga-/actions/workflows/android-debug.yml';
const CATS={
  '3':{name:'Primera Fuerza',season:'3'},
  '5':{name:'Intermedia',season:'4'},
  '4':{name:'Segunda Fuerza',season:'5'},
  '2':{name:'Veteranos 35+',season:'6'},
  '1':{name:'Veteranos 50+',season:'2'}
};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanServer=v=>{try{const u=new URL(String(v||DEFAULT_SERVER).trim());return /^https?:$/.test(u.protocol)?(u.origin+u.pathname).replace(/\/+$/,''):DEFAULT_SERVER}catch(_){return DEFAULT_SERVER}};
const server=()=>cleanServer(localStorage.getItem('v562-adminfut-server')||DEFAULT_SERVER);
const selectedCat=()=>String(localStorage.getItem('v562-adminfut-cat')||'4');
const selectedSeason=()=>CATS[selectedCat()]?.season||'5';
const go=r=>{location.hash='#/'+r};
const toast=msg=>{let n=$('.v562-toast');if(n)n.remove();n=document.createElement('div');n.className='v562-toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),2400)};
function url(path,withSelection=true){const base=server()+('/'+String(path||'').replace(/^\/+/,''));if(!withSelection)return base;const sep=base.includes('?')?'&':'?';return base+sep+'categoria='+encodeURIComponent(selectedCat())+'&temporada='+encodeURIComponent(selectedSeason())}
function openExternal(href){window.open(href,'_blank','noopener,noreferrer')}
function countRoster(c){let players=0,teams=0;for(const raw of Object.values(c?.rosters||{})){teams++;if(Array.isArray(raw))players+=raw.length;else if(raw&&typeof raw==='object')players+=(raw.players||raw.rows||[]).length}return {players,teams}}
function countRows(blocks){return Array.isArray(blocks)?blocks.reduce((n,b)=>n+(Array.isArray(b?.rows)?b.rows.length:0),0):0}
function summaryHtml(c){const x=countRoster(c||{});return '<div class="v562-sync-grid"><article><b>'+x.players+'</b><span>Jugadores registrados</span></article><article><b>'+x.teams+'</b><span>Equipos con padrón</span></article><article><b>'+countRows(c?.standings)+'</b><span>Clasificación</span></article><article><b>'+countRows(c?.scorers)+'</b><span>Goleo</span></article><article><b>'+countRows(c?.cards)+'</b><span>Tarjetas</span></article><article><b>'+countRows(c?.suspensions)+'</b><span>Castigados</span></article></div>'}
function card(icon,title,sub,attrs=''){return '<button type="button" class="v562-card" '+attrs+'><span class="v562-icon">'+icon+'</span><span><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span><i>›</i></button>'}
function markup(){
 const cat=selectedCat(),season=selectedSeason();
 return '<section class="v562-page" data-v562-page>'+
 '<header class="v562-hero"><small>ADMINFUT · LIGA JUVENTINO</small><h1>Registro y acceso oficial</h1><p>La app azul usa el padrón público sincronizado y te da accesos directos a las herramientas oficiales.</p></header>'+
 '<section class="v562-panel v562-selector"><label><span>Categoría</span><select data-v562-cat>'+Object.entries(CATS).map(([id,x])=>'<option value="'+id+'" '+(id===cat?'selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></label><div><small>Temporada</small><b data-v562-season>'+esc(season)+'</b></div></section>'+
 '<section class="v562-panel"><div class="v562-title"><span><small>DATOS SINCRONIZADOS</small><h2>Registro oficial</h2></span><button type="button" data-v562-refresh>Actualizar</button></div><div data-v562-status><p class="v562-loading">Leyendo padrón oficial…</p></div><div class="v562-main-actions"><button type="button" data-v562-route="credentialBuilder">Registrar / revisar jugadores</button><button type="button" class="alt" data-v562-route="publicationCenter">Generar PNG oficiales</button></div></section>'+
 '<section class="v562-panel"><div class="v562-title"><span><small>ADMINFUT</small><h2>Accesos directos</h2></span></div><div class="v562-list">'+
 card('🏆','Posiciones','Tabla oficial','data-v562-web="posiciones"')+
 card('⚽','Goleo','Máximos goleadores oficiales','data-v562-web="goleo"')+
 card('🟨','Tarjetas','Amarillas y rojas','data-v562-web="tarjetas"')+
 card('⛔','Castigados','Sanciones y suspensiones','data-v562-web="castigados"')+
 card('🪪','Registro','OCR, padrón y credenciales','data-v562-route="credentialBuilder"')+
 card('🛠️','Gestión / JR Control','Herramientas administrativas','data-v562-route="jrControl"')+
 card('📘','Reglamento','Reglamento de la Liga','data-v562-route="rulebook"')+
 card('📋','Reportes','Juegos de la semana','data-v562-web="reportes"')+
 card('🎯','Quiniela','Pronósticos de la app azul','data-v562-route="quiniela"')+
 card('🌐','AdminFut oficial','Abrir sistema web','data-v562-web="home"')+
 '</div></section>'+
 '<section class="v562-panel"><div class="v562-title"><span><small>APP</small><h2>APK y acceso directo</h2></span></div><div class="v562-list">'+
 card('📱','Descargar APK de AdminFut','APK oficial','data-v562-web="apk"')+
 card('⬇️','APK de la app azul','Abrir compilaciones Android','data-v562-blue-apk')+
 card('➕','Instalar acceso directo','Instalar Liga Juventino como app','data-v562-install')+
 card('🔵','Abrir modo app azul','Pantalla completa ?mode=apk','data-v562-app-mode')+
 card('🔗','Compartir acceso directo','Compartir enlace de la app azul','data-v562-share')+
 '</div></section>'+
 '<section class="v562-panel"><div class="v562-title"><span><small>CONEXIÓN</small><h2>Servidor AdminFut</h2></span></div><div class="v562-server"><small>Servidor actual</small><b data-v562-server>'+esc(server())+'</b></div><div class="v562-main-actions"><button type="button" data-v562-server-change>Cambiar servidor</button><button type="button" class="alt" data-v562-account>Abrir cuenta AdminFut</button></div><p class="v562-note">La app azul no guarda credenciales privadas de AdminFut; el acceso de cuenta se realiza en el servidor oficial.</p></section>'+
 '</section>';
}
async function loadStatus(root,force=false){
 const out=$('[data-v562-status]',root);if(!out)return;
 out.innerHTML='<p class="v562-loading">Actualizando datos oficiales…</p>';
 try{
   const r=await fetch('./data/official-live.json'+(force?'?v='+Date.now():''),{cache:force?'no-store':'default'});
   if(!r.ok)throw new Error('HTTP '+r.status);
   const d=await r.json(),c=d?.categories?.[selectedCat()]||{},cap=d?.captured_at_utc||'';
   out.innerHTML=summaryHtml(c)+'<p class="v562-source">Fuente sincronizada: AdminFut · '+esc(CATS[selectedCat()]?.name||'Categoría')+(cap?' · '+esc(new Date(cap).toLocaleString('es-MX')):'')+'</p>';
 }catch(e){out.innerHTML='<p class="v562-error">No se pudo leer la copia sincronizada. Abre AdminFut oficial con los botones de abajo.</p>'}
}
async function installBlue(){
 if(window.LJR_V100?.installApp){window.LJR_V100.installApp();return}
 alert(/iphone|ipad|ipod/i.test(navigator.userAgent||'')?'En iPhone: Safari → Compartir → Añadir a pantalla de inicio.':'En Android: Chrome → Instalar aplicación / Añadir a pantalla de inicio.');
}
async function shareBlue(){
 const href=location.origin+location.pathname+'?mode=apk#/adminFut';
 try{if(navigator.share){await navigator.share({title:'Liga Juventino · AdminFut',url:href});return}await navigator.clipboard.writeText(href);toast('Enlace copiado')}catch(_){}
}
function bind(root){
 $('[data-v562-cat]',root)?.addEventListener('change',e=>{if(!CATS[e.target.value])return;localStorage.setItem('v562-adminfut-cat',e.target.value);$('[data-v562-season]',root).textContent=CATS[e.target.value].season;loadStatus(root,true)});
 $('[data-v562-refresh]',root)?.addEventListener('click',()=>loadStatus(root,true));
 $$('[data-v562-route]',root).forEach(b=>b.addEventListener('click',()=>go(b.dataset.v562Route)));
 $$('[data-v562-web]',root).forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.v562Web,map={posiciones:url('tabla-posiciones/'),goleo:url('tabla-goleo/'),tarjetas:url('tabla-tarjetas/'),castigados:url('tabla-castigados/'),reportes:url('reporte-semanal/'),home:server()+'/',apk:server()+'/apk/descargar/'};openExternal(map[k]||server()+'/')}));
 $('[data-v562-blue-apk]',root)?.addEventListener('click',()=>openExternal(BLUE_ACTIONS));
 $('[data-v562-install]',root)?.addEventListener('click',installBlue);
 $('[data-v562-app-mode]',root)?.addEventListener('click',()=>{location.href=location.origin+location.pathname+'?mode=apk#/adminFut'});
 $('[data-v562-share]',root)?.addEventListener('click',shareBlue);
 $('[data-v562-server-change]',root)?.addEventListener('click',()=>{const next=window.prompt('URL del servidor AdminFut',server());if(next===null)return;const clean=cleanServer(next);localStorage.setItem('v562-adminfut-server',clean);$('[data-v562-server]',root).textContent=clean;toast('Servidor actualizado')});
 $('[data-v562-account]',root)?.addEventListener('click',()=>openExternal(server()+'/'));
}
function mount(){if(route()!=='adminFut')return;const screen=$('#screen');if(!screen)return;const host=$('[data-v562-adminfut-mount]',screen);if(host)host.outerHTML=markup();const root=$('[data-v562-page]',screen);if(!root||root.dataset.bound)return;root.dataset.bound='1';bind(root);loadStatus(root,false)}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(mount,50)}
window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});schedule();setTimeout(schedule,600);
window.LJR_V562={build:'v562-adminfut-bridge',mount};
})();
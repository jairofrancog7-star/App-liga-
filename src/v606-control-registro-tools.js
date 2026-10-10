/* V606 — Liga Control / Registro dentro de Más herramientas.
   Agrupa accesos administrativos en un solo bloque compacto y plegable. */
(function(){
'use strict';
if(window.__LJR_V606_CONTROL_REGISTRO__)return;
window.__LJR_V606_CONTROL_REGISTRO__=true;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const go=r=>{
 const gate=window.LJR_ADMIN_ROUTE;
 if(gate?.routes?.has?.(r)){gate.open(r);return}
 if(window.LJR_MAIN_ROUTE?.go){window.LJR_MAIN_ROUTE.go(r);return}
 location.hash='#/'+r
};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const ITEMS=[
 {icon:'▦',title:'Posiciones',sub:'Tabla completa por categoría',route:'positions'},
 {icon:'⚽',title:'Goleo',sub:'Ranking de jugadores',route:'scorers'},
 {icon:'▥',title:'Tarjetas',sub:'Amarillas y rojas',route:'cards'},
 {icon:'⛔',title:'Castigados',sub:'Sanciones y suspensiones',route:'suspensions'},
 {icon:'▣',title:'Jornadas',sub:'Partidos, resultados y pendientes',action:'fixtures'},
 {icon:'◎',title:'Quiniela',sub:'Pronósticos de la Liga',route:'quiniela'},
 {icon:'＋',title:'Altas / registro',sub:'Equipos y jugadores',route:'recruitment'},
 {icon:'◉',title:'Registro de jugadores',sub:'Foto, documento y categoría',route:'credentialBuilder'},
 {icon:'▤',title:'Credenciales',sub:'Generar credencial oficial',route:'credentialBuilder'},
 {icon:'⚙',title:'JR Control',sub:'Centro operativo de la Liga',route:'jrControl'},
 {icon:'▧',title:'Reportes',sub:'Reporte semanal y pendientes',route:'v38Weekly'},
 {icon:'≣',title:'Reglamento',sub:'Reglamento dentro de la app',route:'rulebook'},
 {icon:'↗',title:'Publicaciones',sub:'PNG, jornadas, goleo y sanciones',route:'publicationCenter'},
 {icon:'☁',title:'Campos y clima',sub:'Pronóstico y estado de campos',route:'weatherFields'},
 {icon:'○',title:'Mi cuenta',sub:'Perfil y configuración',route:'profile'}
];

function icon(){
 return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.5 26 7v7.6c0 6.5-4.1 11.1-10 13.9C10.1 25.7 6 21.1 6 14.6V7l10-3.5Z"/><path d="m16 10 1.8 3.5 3.9.6-2.8 2.7.7 3.9-3.6-1.8-3.6 1.8.7-3.9-2.8-2.7 3.9-.6L16 10Z"/></svg>';
}
function itemMarkup(x){
 const attr=x.route?'data-v606-route="'+esc(x.route)+'"':'data-v606-action="'+esc(x.action)+'"';
 return '<button type="button" class="v606-control-item" '+attr+'><span class="v606-item-icon">'+esc(x.icon)+'</span><span class="v606-item-copy"><b>'+esc(x.title)+'</b><small>'+esc(x.sub)+'</small></span></button>';
}
function markup(){
 return '<section class="v606-control-hub" data-v606-hub>'+
   '<button type="button" class="v606-control-toggle" data-v606-toggle aria-expanded="false">'+
     '<span class="v606-control-icon">'+icon()+'</span>'+
     '<span class="v606-control-copy"><small>GESTIÓN DE LA LIGA</small><b>Liga Control / Registro</b><em>Todas las opciones agrupadas aquí</em></span>'+
     '<i aria-hidden="true">⌄</i>'+
   '</button>'+
   '<div class="v606-control-panel" data-v606-panel hidden>'+
     '<div class="v606-control-grid">'+ITEMS.map(itemMarkup).join('')+'</div>'+
   '</div>'+
 '</section>';
}
function itemRoute(btn){
 return String(btn.getAttribute('data-route')||btn.getAttribute('data-v100-route')||btn.getAttribute('data-v105-route')||'').trim();
}
function compactOldEntries(page){
 const grid=$('.v60-tool-grid',page);if(!grid)return;
 const moved=new Set(['jrControl','credentialBuilder','appInstall','install-app','recruitment','ligaControl','adminFut']);
 $$('button',grid).forEach(btn=>{
   const r=itemRoute(btn);
   const txt=String(btn.textContent||'').toLowerCase();
   if(moved.has(r)||/\bjr control\b|\bregistro de jugadores\b|\bcredenciales\b|\binstalar app\b|\bdescargar app\b|\bapk android\b/.test(txt)){
     btn.dataset.v606Moved='1';
     btn.hidden=true;
   }
 });
 $$('[data-v175-section-bar]',grid).forEach(bar=>{
   const id=bar.dataset.v175SectionBar||'';
   if(!id)return;
   const visible=$$('button[data-v175-group="'+id+'"]',grid).some(b=>!b.hidden&&!b.dataset.v606Moved);
   if(!visible)bar.dataset.v606Empty='1'; else delete bar.dataset.v606Empty;
 });
}
function toggle(root,force){
 const btn=$('[data-v606-toggle]',root),panel=$('[data-v606-panel]',root);if(!btn||!panel)return;
 const open=typeof force==='boolean'?force:btn.getAttribute('aria-expanded')!=='true';
 btn.setAttribute('aria-expanded',String(open));
 panel.hidden=!open;
 root.classList.toggle('is-open',open);
 if(open)requestAnimationFrame(()=>root.scrollIntoView({behavior:'smooth',block:'nearest'}));
}
function openFixtures(){
 go('competition');
 [80,220,520].forEach(ms=>setTimeout(()=>document.querySelector('[data-comp-tab="fixtures"]')?.click(),ms));
}
async function install(){
 try{
   if(window.LJR_V100?.installApp){window.LJR_V100.installApp();return}
 }catch(_){}
 alert(/iphone|ipad|ipod/i.test(navigator.userAgent||'')?'Safari → Compartir → Añadir a pantalla de inicio.':'Chrome → menú → Instalar aplicación / Añadir a pantalla de inicio.');
}
async function share(){
 const url=location.origin+location.pathname+'?mode=apk#/home';
 try{
   if(navigator.share){await navigator.share({title:'Liga Juventino',text:'Liga Municipal de Fútbol Juventino Rosas',url});return}
   await navigator.clipboard?.writeText(url);
 }catch(_){}
}
function bind(root){
 if(root.dataset.v606Bound)return;root.dataset.v606Bound='1';
 $('[data-v606-toggle]',root)?.addEventListener('click',()=>toggle(root));
 $$('[data-v606-route]',root).forEach(b=>b.addEventListener('click',()=>go(b.dataset.v606Route)));
 $$('[data-v606-action]',root).forEach(b=>b.addEventListener('click',()=>{
   const a=b.dataset.v606Action;
   if(a==='fixtures')openFixtures();
   else if(a==='install')install();
   else if(a==='share')share();
 }));
}
function mount(){
 if(route()!=='leagueTools')return;
 const page=document.querySelector('body[data-app-route="leagueTools"] .v60-tool-page')||$('.v60-tool-page');
 const grid=page?.querySelector('.v60-tool-grid');if(!page||!grid)return;
 let root=$('[data-v606-hub]',page);
 if(!root){
   const w=document.createElement('div');w.innerHTML=markup();root=w.firstElementChild;
   grid.insertAdjacentElement('beforebegin',root);
 }
 bind(root);
 compactOldEntries(page);
}
let t=0;function schedule(ms=40){clearTimeout(t);t=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(70));
window.addEventListener('load',()=>schedule(120));
document.addEventListener('DOMContentLoaded',()=>schedule(0),{once:true});
const screen=$('#screen');if(screen)new MutationObserver(()=>schedule(60)).observe(screen,{childList:true,subtree:true});
schedule(0);setTimeout(()=>schedule(0),500);setTimeout(()=>schedule(0),1400);
window.LJR_V606={mount,toggle};
})();
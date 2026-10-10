/* Administración de la Liga · busqueda local progresiva · 2026-10-10 */
(()=>{
'use strict';
if(window.__LJR_ADMIN_SMART_1010__)return;
window.__LJR_ADMIN_SMART_1010__=true;
const DATA={
 content:['Contenido y datos','equipo jugador registrar inscribir altas tabla jornada resultado calendario goles sanciones cancha posiciones documentos cedula cédula'],
 publish:['Publicar','historia foto video noticia aviso publicar anuncio comunicado'],
 live:['Transmisiones','transmitir directo vivo tiktok facebook youtube streaming'],
 password:['Contraseña','seguridad clave contraseña cambiar recuperar'],
 devices:['Dispositivos','celular dispositivo sesiones teléfono huella biometria'],
 posts:['Mis publicaciones','mis publicaciones post publicados historial contenido'],
 invites:['Invitaciones','invitacion invitar administradores usuarios'],
 logout:['Cerrar sesión','salir desconectar cerrar sesión']
};
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const TOKENS=s=>normalize(s).split(/\s+/).filter(x=>x.length>2);
const GUIDE=[
 ['jugador inscribir registrar plantilla futbolista equipo equipo','content','En Contenido y datos, abre Jugadores o Equipos.'],
 ['partido jornada calendario resultado goles tabla clasificacion posicion sancion expulsado cedula','content','En Contenido y datos, selecciona la sección correspondiente y la categoría.'],
 ['historia noticias foto video comunicado aviso','publish','Puedes publicar historia, foto o video desde el botón original.'],
 ['transmitir directo streaming vivo youtube facebook','live','Puedes iniciar el flujo de transmisión autorizado.'],
 ['contraseña clave seguridad','password','Cambia tu contraseña con el procedimiento verificado.'],
 ['sesion dispositivo huella celular biometria','devices','Revisa los dispositivos desde la herramienta existente.']
];
const elem=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
function scoring(q,text){
 const t=TOKENS(text),words=TOKENS(q);let score=0;
 for(const w of words)if(t.includes(w))score+=3;else if(w.length>3&&t.some(x=>x.startsWith(w)))score++;
 return score;
}
function recentDate(){
 try{return new Intl.DateTimeFormat('en-CA',{dateStyle:'short',timeZone:'America/Mexico_City'}).format(new Date())}
 catch{return new Date().toISOString().slice(0,10)}
}
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return {}}};
const store=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
function daily(){
 const d=new Date().getDay();
 if(d===6)return [['rol','Comprobar rol y campos de Veteranos 35+ y 50+','content'],['aviso','Revisar avisos de partidos','publish'],['cedula','Verificar cédulas y sanciones','content']];
 if(d===0)return [['marcadores','Revisar resultados de Libre','content'],['goleo','Verificar goleadores y puntos','content'],['resumen','Preparar un resumen de jornada','publish']];
 return [['programacion','Comprobar jornadas, campos y horarios','content'],['estadistica','Verificar resultados y sanciones pendientes','content'],['comunicados','Preparar avisos para los equipos','publish']];
}
function activate(section){
 if(section.dataset.ljrSmart1010)return;
 const grid=section.querySelector('.ljr-admin-action-grid');
 if(!grid)return;
 const map={};
 for(const b of grid.querySelectorAll(':scope > button.ljr-admin-tile')){const k=b.dataset.ljrAdminIcon;if(DATA[k])map[k]=b}
 if(!map.content)return;
 const area=grid.closest('.ljr-admin-area');if(!area)return;
 section.dataset.ljrSmart1010='1';
 const hub=elem('section','ljr-smart-hub');
 hub.setAttribute('aria-label','Buscador local y plan de tareas');
 const head=elem('div','ljr-smart-heading');
 head.append(elem('strong','','Busca funciones de la Liga'),elem('small','','Inteligencia local · búsqueda privada'));
 hub.append(head);
 const input=elem('input','ljr-smart-search');input.type='search';input.placeholder='Ej. registrar jugador, jornada o sanciones';
 input.setAttribute('aria-label','Buscar funciones de administración');hub.append(input);
 const quick=elem('div','ljr-smart-actions');
 for(const [k,title] of [['content','Datos oficiales'],['publish','Publicar'],['live','En vivo']]){
  if(!map[k])continue;
  const b=elem('button','',title);b.type='button';b.addEventListener('click',()=>map[k].click());quick.append(b);
 }
 const notices=elem('button','','Avisos para aprobar');
 notices.type='button';
 notices.title='Abrir los avisos globales para revisar borradores y programaciones';
 notices.addEventListener('click',()=>{
  const api=window.LJR_GLOBAL_NOTICES;
  if(typeof api?.open==='function')api.open();
  else {
   const original=document.querySelector('[data-v1081-global="global"]');
   if(original)original.click();
   else count.textContent='Abre Contenido y datos → Avisos globales cuando el servicio esté disponible.';
  }
 });
 quick.append(notices);
 hub.append(quick);
 const count=elem('small','ljr-smart-count');count.setAttribute('aria-live','polite');hub.append(count);
 const match=elem('div','ljr-smart-recommendation');
 const msg=elem('p');const go=elem('button','','Abrir');go.type='button';match.append(msg,go);hub.append(match);
 const details=elem('details','ljr-smart-tasks');
 const summary=elem('summary','','Plan de hoy');
 const list=elem('div','ljr-smart-task-list');details.append(summary,list);hub.append(details);
 const key='ljr-admin-checklist-'+recentDate(),done=read(key);
 const todos=daily().filter(row=>map[row[2]]);
 function countTasks(){summary.textContent='Plan automático de hoy · '+todos.filter(r=>done[r[0]]).length+'/'+todos.length+' revisadas'}
 for(const [id,task,target] of todos){
  const label=elem('label','ljr-smart-task');
  const cb=elem('input');cb.type='checkbox';cb.checked=!!done[id];
  const title=elem('span',cb.checked?'is-complete':'',task);
  cb.addEventListener('change',()=>{done[id]=cb.checked;store(key,done);title.classList.toggle('is-complete',cb.checked);countTasks()});
  const jump=elem('button','','Abrir');jump.type='button';jump.addEventListener('click',()=>map[target].click());
  label.append(cb,title,jump);list.append(label);
 }
 countTasks();area.before(hub);
 function search(){
  const q=normalize(input.value);
  let best=null;
  for(const [k,data] of Object.entries(DATA)){
    if(!map[k])continue;
    const score=scoring(q,data.join(' '));
    if(score&&(!best||best.score<score))best={k,score,hint:'Abre '+data[0]+'.'};
  }
  for(const [terms,k,hint] of GUIDE){
    if(!map[k])continue;
    const score=scoring(q,terms)+1;
    if(q&&score>1&&(!best||best.score<score))best={k,score,hint};
  }
  let shown=0;
  for(const [k,b] of Object.entries(map)){
    const yes=!q||scoring(q,DATA[k].join(' '))>0||best?.k===k;
    b.hidden=!yes;if(yes)shown++;
  }
  match.hidden=!q;
  if(q&&best){
    msg.textContent=best.hint+' Los datos oficiales no se modifican automáticamente.';
    go.hidden=false;go.textContent='Abrir '+DATA[best.k][0];go.onclick=()=>map[best.k].click();
  }else if(q){msg.textContent='No encontré una coincidencia. Prueba con «jugador», «resultados» o «avisos».';go.hidden=true}
  count.textContent=q?(shown+' herramienta(s) relacionada(s)'):(Object.keys(map).length+' funciones disponibles. Guardar cambios requiere conexión y permiso.');
 }
 input.addEventListener('input',search);
 input.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&input.value){e.stopPropagation();input.value='';search()}
  if(e.key==='Enter'&&go.onclick&&!match.hidden&&!go.hidden){e.preventDefault();go.click()}
 });
 search();
}
let pending=false;
function scan(){pending=false;document.querySelectorAll('.liga-media-modal>section.ljr-admin-manage').forEach(activate)}
function queue(){if(pending)return;pending=true;requestAnimationFrame(scan)}
function init(){new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});queue()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('liga:admin',queue);
})();
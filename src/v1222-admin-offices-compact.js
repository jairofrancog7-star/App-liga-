/* V1222 · Accesos a delegados y árbitros con catálogos reales, sin cambiar permisos. */
(()=>{
'use strict';
if(window.__LJR_ADMIN_OFFICES_1222__)return;
window.__LJR_ADMIN_OFFICES_1222__=true;
const $=(q,r=document)=>r.querySelector(q);
const $$=(q,r=document)=>Array.from(r.querySelectorAll(q));
const normal=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const symbols={
 compose:'<path d="M4 20h4l11-11-4-4L4 16v4ZM13 7l4 4M5 5h7"/>',
 review:'<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
 schedule:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 page:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 9v11"/>',
 backup:'<path d="M12 3v12m-4-4 4 4 4-4M4 18v3h16v-3"/>',
 delegates:'<circle cx="8" cy="8" r="3"/><path d="M2 21v-2a6 6 0 0 1 12 0v2M17 8h5m-5 4h5m-5 4h5"/>',
 officials:'<path d="M12 3l8 4v5c0 5-3 8-8 9-5-1-8-4-8-9V7l8-4zM9 12l2 2 4-4"/>'
};
const icon=k=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+symbols[k]+'</svg>';
const categories=[['3','Primera Fuerza'],['5','Intermedia'],['4','Segunda Fuerza'],['2','Veteranos 35+'],['1','Veteranos 50+']];
let catalogPromise=null;
function officialCatalog(){
 if(!catalogPromise)catalogPromise=(async()=>{
  let data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA;
  if(!data?.categories){
   const r=await fetch('./data/official-live.json',{cache:'no-store'});
   if(!r.ok)throw Error('No fue posible consultar los equipos.');
   data=await r.json();
  }
  const catalog=new Map();
  for(const [id,cat] of Object.entries(data.categories||{})){
   const names=[];
   (cat.teams||[]).forEach(x=>names.push(typeof x==='string'?x:x?.name));
   Object.keys(cat.rosters||{}).forEach(x=>names.push(x));
   (cat.fixtures||[]).forEach(block=>(block.rows||[]).forEach(r=>{if(r?.[2])names.push(r[2]);if(r?.[6])names.push(r[6]);}));
   (cat.standings||[]).forEach(block=>(block.rows||[]).forEach(r=>{if(r?.[1])names.push(r[1]);}));
   catalog.set(String(id),[...new Map(names.map(x=>String(x||'').trim()).filter(Boolean).map(x=>[normal(x),x])).values()].sort((a,b)=>a.localeCompare(b,'es')));
  }
  return catalog;
 })().catch(e=>{catalogPromise=null;throw e;});
 return catalogPromise;
}
function localList(kind){
 try{const arr=JSON.parse(localStorage.getItem(kind==='delegates'?'v105-delegates':'v105-officials')||'[]');
  return Array.isArray(arr)?arr.filter(v=>v&&typeof v==='object'&&String(v.name||'').trim()):[];
 }catch(_){return []}
}
function compatibleCategory(stored,id){
 if(!stored)return true;
 const expected=categories.find(c=>c[0]===id)?.[1]||'';
 const a=normal(stored),b=normal(expected);
 // Los árbitros registrados para todas las categorías nunca se ocultan por categoría.
 if(['todas','todas las categorias','sin categoria'].includes(a))return true;
 return !expected||a===b||a.replace(' fuerza','')===b.replace(' fuerza','')||a.includes(b)||b.includes(a);
}
function openDirectory(kind,dialog,feedback){
 if(!window.LJR_MEDIA?.admin){if(feedback)feedback.textContent='Inicia sesión para abrir el directorio.';return}
 if(typeof window.LJR_V105_OPEN_TOOL!=='function'){
  if(feedback)feedback.textContent='La herramienta aún no terminó de cargar. Inténtalo de nuevo.';return;
 }
 // Cerrar solo este diálogo evita dos ventanas una encima de otra.
 dialog.querySelector(':scope > header [data-close]')?.click();
 const ok=window.LJR_V105_OPEN_TOOL(kind);
 if(!ok&&feedback)feedback.textContent='No fue posible abrir el directorio.';
}
function decorate(grid){
 for(const button of $$('[data-editor-open]',grid)){
  const key=button.dataset.editorOpen;
  const b=$(':scope > b',button);
  if(b&&symbols[key]&&!b.querySelector('svg')){b.innerHTML=icon(key);b.setAttribute('aria-hidden','true');}
 }
}
function mountOffices(dialog){
 if(!window.LJR_MEDIA?.admin)return;
 const hub=$('[data-ljr-editor-center]',dialog),grid=hub&&$('.ljr-editor-hub-grid',hub);
 if(!grid||hub.dataset.v1222Offices)return;
 hub.dataset.v1222Offices='1';
 decorate(grid);
 for(const [kind,title,subtitle] of [
  ['delegates','Delegados','Representantes por equipo'],
  ['officials','Árbitros y oficiales','Directorio y designaciones']
 ]){
  const btn=document.createElement('button');
  btn.type='button';btn.dataset.v1222Directory=kind;
  btn.className='v1222-office-tile';
  btn.innerHTML='<b aria-hidden="true">'+icon(kind)+'</b><span>'+title+'<small>'+subtitle+'</small></span><span class="v1222-next" aria-hidden="true">›</span>';
  btn.addEventListener('click',()=>openDirectory(kind,dialog,$('[data-v1222-feedback]',hub)));
  grid.append(btn);
 }
 const box=document.createElement('details');box.className='v1222-office-finder';
 box.innerHTML='<summary><span class="v1222-finder-title">'+icon('delegates')+' Buscar responsables de equipos</span><span class="v1222-hint">Seleccionar sin volver a escribir datos</span></summary>'+
  '<div class="v1222-form-grid">'+
  '<label>Categoría<select data-v1222-category><option value="">Todas las categorías</option>'+categories.map(c=>'<option value="'+c[0]+'">'+esc(c[1])+'</option>').join('')+'</select></label>'+
  '<label>Equipo<select data-v1222-team><option value="">Todos los equipos</option></select></label>'+
  '<label>Responsable<select data-v1222-kind><option value="delegates">Delegados</option><option value="officials">Árbitros</option></select></label>'+
  '<label>Persona registrada<select data-v1222-person><option value="">Selecciona una persona</option></select></label>'+
  '</div><p class="v1222-info" data-v1222-feedback role="status" aria-live="polite">Los contactos son privados de este dispositivo; selecciona los filtros para consultarlos.</p>'+
  '<button type="button" class="v1222-open-dir" data-v1222-open>Administrar directorio seleccionado <span aria-hidden="true">›</span></button>';
 hub.append(box);
 const cat=$('[data-v1222-category]',box),team=$('[data-v1222-team]',box);
 const kind=$('[data-v1222-kind]',box),person=$('[data-v1222-person]',box);
 const feedback=$('[data-v1222-feedback]',box);
 let catalog=null;
 const fill=(sel,values,placeholder)=>{
  const before=sel.value;sel.replaceChildren(new Option(placeholder,''));
  values.forEach(item=>sel.add(new Option(item,item)));
  if(before&&values.includes(before))sel.value=before;
 };
 const updatePeople=()=>{
  // Los oficiales son imparciales: se filtran por categoría, no por el equipo.
  const members=localList(kind.value).filter(x=>
   compatibleCategory(x.category,cat.value)&&
   (kind.value==='officials'||!team.value||normal(x.team)===normal(team.value))
  );
  person.replaceChildren(new Option('Selecciona una persona',''));
  members.forEach((x,i)=>person.add(new Option(x.name+(x.role?' · '+x.role:''),String(i))));
  person.value='';
  feedback.textContent=members.length?members.length+' persona(s) registrada(s) en este teléfono. No se comparte información privada al publicar avisos.':'No hay contactos locales con los filtros seleccionados. Abre el directorio para agregarlos.';
 };
 const updateTeams=()=>{
  let names=catalog?(cat.value?(catalog.get(cat.value)||[]):[...new Set([...catalog.values()].flat())]):[];
  fill(team,names.sort((a,b)=>a.localeCompare(b,'es')),'Todos los equipos');
  updatePeople();
 };
 box.addEventListener('toggle',async()=>{
  if(!box.open||catalog)return;
  try{catalog=await officialCatalog();if(box.isConnected)updateTeams();}
  catch(e){feedback.textContent=e.message+'. Los directorios locales siguen disponibles.';}
 });
 cat.addEventListener('change',updateTeams);
 team.addEventListener('change',updatePeople);
 const syncResponsibleType=()=>{
  const referee=kind.value==='officials';
  const teamLabel=team.closest('label');
  if(teamLabel)teamLabel.hidden=referee;
  team.disabled=referee;
  if(referee)team.value='';
  updatePeople();
 };
 kind.addEventListener('change',syncResponsibleType);
 person.addEventListener('change',()=>{
  if(person.value==='')return;
  const list=localList(kind.value).filter(x=>compatibleCategory(x.category,cat.value)&&(kind.value==='officials'||!team.value||normal(x.team)===normal(team.value)));
  const selected=list[Number(person.value)];
  if(selected)feedback.textContent=[selected.name,selected.role,selected.team,selected.category].filter(Boolean).join(' · ')+' · Contacto local privado.';
 });
 $('[data-v1222-open]',box).addEventListener('click',()=>openDirectory(kind.value,dialog,feedback));
 // Volviendo desde el directorio, leer otra vez el almacenamiento, sin copias.
 box.addEventListener('focusin',e=>{if(e.target===person&&person.options.length===1)updatePeople()});
 syncResponsibleType();
}
let queued=false;
function scan(){
 queued=false;
 $$('.liga-media-modal > section.ljr-admin-manage').forEach(mountOffices);
}
function schedule(){if(queued)return;queued=true;queueMicrotask(scan);}
function start(){new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
document.addEventListener('liga:admin',schedule);
})();
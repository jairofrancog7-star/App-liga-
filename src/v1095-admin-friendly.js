/* V1095 — Ayuda de uso en administración, sin reemplazar eventos ni llamadas al servidor. */
(()=>{
'use strict';
if(window.__LJR_ADMIN_FRIENDLY_V1095__)return;window.__LJR_ADMIN_FRIENDLY_V1095__=true;
const instructions={
 fixture:{icon:'📅',intro:'Selecciona la categoría y cambia los partidos. Al final pulsa Guardar tabla para todos.',steps:['Elige Primera, Intermedia, Segunda, Veteranos 35+ o 50+.','Desliza la tabla a los lados para consultar las demás columnas. Toca un campo para editarlo.','Para mover una jornada, indica su número y la nueva fecha; pulsa Aplicar fecha.','Revisa los datos y pulsa Guardar tabla para todos para publicar los cambios.']},
 sanction:{icon:'🟥',intro:'Registra jugadores castigados con equipo, motivo y fecha o jornada de finalización.',steps:['Elige la categoría del jugador.','Pulsa Añadir fila y completa el nombre, equipo, motivo y hasta cuándo aplica.','Revisa los datos y pulsa Guardar tabla para todos.']},
 scorers:{icon:'⚽',intro:'Actualiza los goles por jugador, no por equipo, en la categoría correspondiente.',steps:['Elige la categoría correcta.','Pulsa Añadir fila para agregar un goleador o edita una fila existente.','Desliza a los lados si no ves todas las columnas y pulsa Guardar tabla para todos.']},
 standings:{icon:'🏆',intro:'Edita posiciones y estadísticas de los equipos por categoría.',steps:['Elige la categoría.','Modifica los puntos, partidos y demás datos de cada equipo.','Revisa la tabla y pulsa Guardar tabla para todos.']},
 team:{icon:'🛡️',intro:'Registra un equipo con nombre, categoría, comunidad, campo y escudo.',steps:['Escribe el nombre oficial del equipo.','Selecciona su categoría y completa ciudad o comunidad y campo.','Sube el escudo PNG desde tu teléfono o pega un enlace de imagen.','Deja marcada Publicar para todos y pulsa Guardar cambios.']},
 player:{icon:'👤',intro:'Registra al jugador en su equipo y categoría, con fotografía opcional.',steps:['Escribe nombre completo, categoría y equipo.','Selecciona fecha de nacimiento y número de camiseta.','Sube la foto desde tu teléfono o usa un enlace.','Revisa los datos y pulsa Guardar cambios.']},
 document:{icon:'📄',intro:'Publica cédulas, documentos y archivos PDF para una categoría.',steps:['Escribe un título que explique el documento.','Selecciona la categoría y añade una descripción breve.','Sube el PDF desde tu teléfono o pega su enlace.','Pulsa Guardar cambios para publicarlo.']},
 design:{icon:'🎨',intro:'Guarda imágenes y diseños que quieras compartir en la Liga.',steps:['Escribe el nombre del diseño.','Selecciona la imagen desde tu teléfono o pega el enlace PNG.','Añade una descripción opcional y pulsa Guardar cambios.']},
 page:{icon:'✏️',intro:'Cambia el texto o la imagen seleccionada. No necesitas escribir código.',steps:['Escribe lo que quieres mostrar en Texto nuevo.','Si necesitas una imagen, selecciónala desde el teléfono.','Puedes ajustar el color de letra y el fondo.','Pulsa Guardar cambios. Los detalles técnicos se completan automáticamente.']},
 news:{icon:'📰',intro:'Crea noticias y avisos oficiales con título, texto e imagen opcional.',steps:['Escribe el título y el mensaje.','Si quieres, añade una imagen desde el teléfono.','Revisa Publicar para todos y pulsa Guardar cambios.']},
 transmission:{icon:'▶️',intro:'Comparte una transmisión autorizada con su enlace público.',steps:['Escribe título, categoría y descripción.','Pega el enlace público de la transmisión y añade portada si la tienes.','Pulsa Guardar cambios.']},
 product:{icon:'🛍️',intro:'Agrega artículos de la tienda con nombre, precio, foto y enlace de pedido.',steps:['Escribe el nombre y la descripción.','Indica precio, imagen y enlace de pedido.','Pulsa Guardar cambios.']},
 manage:{icon:'⚙️',intro:'Elige una función con su icono. Todos los cambios oficiales siguen protegidos por la sesión del administrador.',steps:['Toca Contenido y datos para elegir qué modificar.','Selecciona la herramienta y completa los campos explicados.','Guarda los cambios al terminar. Para administradores nuevos, abre Añadir administrador.']}
};
const safe=s=>String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function getKind(section){
 if(section.querySelector('.cms-table-wrap')){
  const label=(section.querySelector('header h2')?.textContent||'').toLowerCase();
  return /sancion/.test(label)?'sanction':/goleo/.test(label)?'scorers':/posiciones|clasificaci/.test(label)?'standings':'fixture';
 }
 const form=section.querySelector('form.cms-form');
 if(form){
  if(form.querySelector('[name=selector]'))return 'page';
  if(form.querySelector('[name=logo]'))return 'team';
  if(form.querySelector('[name=birthdate]'))return 'player';
  if(form.querySelector('[name=price]'))return 'product';
  if(form.querySelector('[name=scope]'))return 'news';
  if(form.querySelector('[name=title][type=text]')&&form.querySelector('[name=url]')){
   return /transmis/.test(section.querySelector('header h2')?.textContent||'')?'transmission':'document';
  }
  if(form.querySelector('[name=image]')&&form.querySelector('[name=title]'))return 'design';
  if(form.querySelector('[name=body]'))return 'news';
 }
 return section.classList.contains('ljr-admin-manage')?'manage':null;
}
function addGuide(section,kind){
 if(section.querySelector(':scope>.ljr-simple-intro'))return;
 const conf=instructions[kind];if(!conf)return;
 const intro=document.createElement('div');intro.className='ljr-simple-intro';
 intro.innerHTML='<span class="ljr-simple-icon" aria-hidden="true">'+safe(conf.icon)+'</span><div><strong>Así se usa</strong><p>'+safe(conf.intro)+'</p></div>';
 const guide=document.createElement('details');guide.className='ljr-guide';
 guide.innerHTML='<summary>Ver instrucciones paso a paso</summary><ol>'+conf.steps.map(v=>'<li>'+safe(v)+'</li>').join('')+'</ol>';
 const header=section.querySelector(':scope>header');if(header){header.after(intro);intro.after(guide)}else{section.prepend(guide);section.prepend(intro)}
}
function prettifyForm(section,kind){
 const form=section.querySelector('form.cms-form');if(!form)return;
 for(const label of form.querySelectorAll(':scope>label')){
  const input=label.querySelector('input,textarea,select');if(!input)continue;
  if(input.matches('[type=url]'))input.placeholder='Pega el enlace aquí (opcional)';
  if(input.name==='name'&&!input.placeholder)input.placeholder=kind==='player'?'Nombre y apellidos':'Escribe el nombre';
  if(input.name==='field')input.placeholder='Ejemplo: Campo Municipal';
  if(input.name==='community')input.placeholder='Ciudad o comunidad';
  if(input.name==='team')input.placeholder='Nombre del equipo';
  if(input.name==='title')input.placeholder='Escribe un título claro';
  if(input.name==='number')input.placeholder='Número de camiseta';
  if(input.name==='text')input.placeholder='Escribe el texto nuevo que aparecerá en la app';
  if(input.name==='body')input.placeholder='Describe la información para las personas que la consulten';
  if(input.hasAttribute('required'))label.dataset.required='true';
 }
 if(kind==='page'&&!form.querySelector('.ljr-admin-advanced')){
  const advanced=document.createElement('details');advanced.className='ljr-admin-advanced';
  advanced.innerHTML='<summary>Detalles técnicos (ya están completos; no necesitas cambiarlos)</summary>';
  for(const name of ['route','selector','original']){
   const target=form.querySelector('[name="'+name+'"]')?.closest('label');
   if(target)advanced.appendChild(target);
  }
  form.prepend(advanced);
 }
 const file=form.querySelector('input[data-cms-file]');
 if(file){
  const label=file.closest('label');
  const note=document.createElement('small');note.className='ljr-file-note';
  note.textContent='Puedes seleccionar un archivo del teléfono. Se subirá cuando pulses Guardar cambios.';
  label?.append(note);
  file.addEventListener('change',()=>{
   note.textContent=file.files?.[0]?'Seleccionado: '+file.files[0].name+'. Se subirá al guardar.':'Ningún archivo seleccionado.';
  });
 }
 const publish=form.querySelector('[name=published]');
 if(publish){publish.setAttribute('aria-label','Publicar para todos');publish.title='Desmarca para guardar como borrador privado'}
}
function prettifyTable(section,kind){
 const select=section.querySelector('select[data-category]');
 if(select){select.setAttribute('aria-label','Categoría de la Liga');}
 const actions=section.querySelector('.cms-table-actions');
 if(actions&&kind==='fixture'){
  const round=actions.querySelector('input[data-round]');if(round){round.placeholder='Ejemplo: 3';round.setAttribute('aria-label','Número de jornada que deseas mover')}
  const date=actions.querySelector('input[data-date]');date?.setAttribute('aria-label','Nueva fecha para la jornada');
 }
 const table=section.querySelector('.cms-table-wrap');
 if(table){
  table.setAttribute('role','region');table.setAttribute('aria-label','Tabla editable: desliza horizontalmente para ver todas las columnas');table.tabIndex=0;
  const hint=document.createElement('small');hint.className='ljr-table-hint';
  hint.textContent='↔ Desliza la tabla hacia los lados para ver todas las columnas y editar los datos.';
  table.before(hint);
 }
 section.querySelector('[data-add-row]')?.setAttribute('aria-label','Añadir una fila nueva a la tabla');
 section.querySelector('[data-save-table]')?.setAttribute('aria-label','Guardar y publicar la tabla de esta categoría');
}
function decorate(section){
 if(section.dataset.ljrAdminFriendly==='1'||!window.LJR_MEDIA?.admin)return;
 const kind=getKind(section);
 if(!kind)return;
 section.dataset.ljrAdminFriendly='1';section.classList.add('ljr-admin-friendly');
 section.querySelector(':scope>header [data-close]')?.setAttribute('aria-label','Cerrar ventana');
 section.querySelector('[data-status]')?.setAttribute('aria-live','polite');
 addGuide(section,kind);
 if(section.querySelector('form.cms-form'))prettifyForm(section,kind);
 if(section.querySelector('.cms-table-wrap'))prettifyTable(section,kind);
}
let queued=false;
function scan(){
 queued=false;
 if(!window.LJR_MEDIA?.admin)return;
 document.querySelectorAll('.liga-media-modal>section').forEach(decorate);
}
function schedule(){if(queued)return;queued=true;queueMicrotask(scan)}
function start(){new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
document.addEventListener('liga:admin',schedule);
})();

/* V1225 · Estudio visual liviano para JR Control.
   Vista previa local; nunca publica contenido ni eleva permisos de la sesión. */
(()=>{
'use strict';
if(window.LJR_EDITOR_STUDIO)return;
const $=(s,root=document)=>root.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const allowed=new Set(['textContent','color','fontSize','background','minHeight','objectFit']);
const cleanRoute=r=>String(r||'home').replace(/[^a-z0-9_-]/gi,'').slice(0,45)||'home';
const pathFor=(node,scope)=>{
 const list=[];
 while(node&&node!==scope){
  if(!node.parentElement)return '';
  const tag=node.localName;
  if(!/^[a-z][a-z0-9-]*$/.test(tag))return '';
  const siblings=[...node.parentElement.children].filter(x=>x.localName===tag);
  list.unshift(tag+':nth-of-type('+(siblings.indexOf(node)+1)+')');
  node=node.parentElement;
  if(list.length>14)return '';
 }
 return node===scope?list.join(' > '):'';
};
function open(item){
 if(!window.LJR_MEDIA?.admin){window.LJR_MEDIA?.login?.(()=>open(item));return}
 if(document.querySelector('[data-ljr-studio]'))return;
 const route=cleanRoute(item?.[1]||location.hash.replace(/^#\/?/,'').split(/[/?]/)[0]);
 const label=String(item?.[0]||'Sección').slice(0,65);
 const scope=$('#screen');
 if(!scope){window.LJR_MEDIA?.modal?.('Edición visual','No se encontró la pantalla. Vuelve a intentarlo.');return}
 // La autorización la confirma el servidor ANTES de habilitar los controles.
 Promise.resolve().then(()=>window.LJR_MEDIA.api('me')).then(result=>{
  if(!result?.admin||!window.LJR_MEDIA?.admin)throw Error('La sesión del administrador no está verificada.');
  if(document.querySelector('[data-ljr-studio]')||document.querySelector('#screen')!==scope)return;
  begin(scope,route,label);
 }).catch(err=>window.LJR_MEDIA?.modal?.('Edición visual',esc(err?.message||'No se pudo verificar la sesión.')));
}
function begin(scope,route,label){
 const KEY='ljr-studio-draft-v1-'+route;
 const panel=document.createElement('aside');
 panel.className='ljr-studio';panel.dataset.ljrStudio='';
 panel.setAttribute('role','region');panel.setAttribute('aria-label','Estudio visual de la Liga');
 panel.innerHTML='<div class="ljr-studio-head"><div><strong>Editar diseño · '+esc(label)+'</strong><small>Vista previa · toca un elemento de la página</small></div><button type="button" data-studio-close aria-label="Cerrar estudio visual">✕</button></div>'+
 '<p class="ljr-studio-note" data-studio-note role="status" aria-live="polite">Selecciona un texto, imagen, tarjeta o botón. No se publicará nada automáticamente.</p>'+
 '<div class="ljr-studio-fields"><label>Texto seleccionado<input data-studio-text maxlength="250" placeholder="Selecciona un texto para editar"></label><label>Tamaño del texto<select data-studio-size><option value="">Sin cambio</option><option value="12px">12 px</option><option value="14px">14 px</option><option value="16px">16 px</option><option value="18px">18 px</option><option value="22px">22 px</option></select></label></div>'+
 '<div class="ljr-studio-actions"><button type="button" data-studio-apply>Aplicar texto</button><button type="button" data-studio-color>Texto legible</button><button type="button" data-studio-blue>Fondo azul</button><button type="button" data-studio-touch>Botón 44 px</button><button type="button" data-studio-img>Imagen completa</button><button type="button" data-studio-auto>Mejora local</button></div>'+
 '<div class="ljr-studio-actions"><button type="button" data-studio-undo>↶ Deshacer</button><button type="button" data-studio-redo>↷ Rehacer</button><button type="button" data-studio-reset>Restablecer</button></div>'+
 '<div class="ljr-studio-actions"><button type="button" data-studio-save>Guardar borrador local</button><button type="button" data-studio-restore>Recuperar borrador</button><button type="button" data-studio-cms>Abrir editor oficial</button></div>'+
 '<small class="ljr-studio-disclaimer">Los borradores se guardan solamente en esta pestaña. Al salir se revierte la vista previa; para publicar se necesita el editor oficial y una sesión verificada.</small>';
 document.body.append(panel);
 let selected=null,history=[],position=0,closing=false;
 const txt=$('[data-studio-text]',panel),size=$('[data-studio-size]',panel),note=$('[data-studio-note]',panel);
 const message=s=>{note.textContent=s};
 const textEligible=node=>!!node&&/^(H[1-6]|P|SMALL|STRONG|B|EM|LABEL|SPAN)$/.test(node.tagName)&&node.children.length===0;
 const valid=node=>!!node&&scope.contains(node)&&!node.closest('.ljr-studio,.liga-media-modal,form,[contenteditable],script,style,nav')&&node.getBoundingClientRect().width>0;
 const reflect=()=>{
  panel.querySelectorAll('[data-studio-undo]').forEach(b=>b.disabled=position<=0);
  panel.querySelectorAll('[data-studio-redo]').forEach(b=>b.disabled=position>=history.length);
  txt.disabled=!textEligible(selected);
  txt.value=textEligible(selected)?selected.textContent.slice(0,250):'';
  size.disabled=!selected;
 };
 const apply=(change,forward)=>{
  const node=change.node;
  if(!scope.contains(node))return;
  if(change.prop==='textContent')node.textContent=forward?change.to:change.from;
  else node.style[change.prop]=forward?change.to:change.from;
 };
 const modify=(node,prop,to)=>{
  if(!valid(node)||!allowed.has(prop))return;
  if(prop==='textContent'&&!textEligible(node))return message('Selecciona una línea de texto sencilla para editar.');
  const from=prop==='textContent'?node.textContent:node.style[prop];
  if(from===to)return;
  history=history.slice(0,position);
  if(history.length>=40){history.shift();position=Math.max(0,position-1)}
  const change={node,prop,from,to,path:pathFor(node,scope)};
  history.push(change);position=history.length;
  apply(change,true);reflect();message('Cambio de vista previa aplicado. Puedes deshacerlo.');
 };
 const revert=()=>{while(position>0){position--;apply(history[position],false)}history=[];position=0;reflect()};
 function cleanup(){
  if(closing)return;closing=true;
  revert();selected?.classList.remove('ljr-studio-picked');
  scope.removeEventListener('click',pick,true);
  window.removeEventListener('hashchange',cleanup);
  document.removeEventListener('liga:admin',security);
  panel.remove();
 }
 function security(){if(!window.LJR_MEDIA?.admin)cleanup()}
 function pick(event){
  if(closing||event.target.closest('.ljr-studio'))return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
  let target=event.target;
  if(!target||target.nodeType!==1)return;
  const requested=target.closest('img,button,a,h1,h2,h3,h4,h5,h6,p,small,strong,label,span,article,section,div');
  if(requested&&valid(requested))target=requested;
  if(!valid(target))return;
  selected?.classList.remove('ljr-studio-picked');
  selected=target;selected.classList.add('ljr-studio-picked');
  reflect();
  const descriptor=(selected.tagName||'Elemento').toLowerCase();
  message('Seleccionado: '+descriptor+'. Cambia una propiedad y comprueba la vista previa.');
 }
 scope.addEventListener('click',pick,true);
 window.addEventListener('hashchange',cleanup);
 document.addEventListener('liga:admin',security);
 $('[data-studio-close]',panel).onclick=cleanup;
 $('[data-studio-apply]',panel).onclick=()=>{if(!selected)return message('Primero selecciona un texto.');modify(selected,'textContent',txt.value.trim())};
 $('[data-studio-color]',panel).onclick=()=>selected?modify(selected,'color','#f2f7ff'):message('Primero selecciona un elemento.');
 $('[data-studio-blue]',panel).onclick=()=>selected?modify(selected,'background','linear-gradient(145deg, #143b87, #09255b)'):message('Primero selecciona una tarjeta.');
 $('[data-studio-touch]',panel).onclick=()=>{
  if(!selected)return message('Primero selecciona un botón.');
  const node=selected.closest('button,a,[role="button"]');
  if(!node||!valid(node))return message('Esta acción es para botones y enlaces.');
  modify(node,'minHeight','44px');
 };
 size.onchange=()=>{if(selected&&size.value)modify(selected,'fontSize',size.value)};
 $('[data-studio-img]',panel).onclick=()=>{
  if(selected?.tagName==='IMG')modify(selected,'objectFit','contain');
  else message('Selecciona un escudo o una fotografía para ver la imagen completa.');
 };
 $('[data-studio-auto]',panel).onclick=()=>{
  if(!selected)return message('Toca primero un texto, botón, imagen o tarjeta.');
  const css=getComputedStyle(selected),font=parseFloat(css.fontSize)||16;
  if(selected.tagName==='IMG')modify(selected,'objectFit','contain');
  else if(selected.matches('button,a,[role="button"]'))modify(selected,'minHeight','44px');
  else if(textEligible(selected)&&font<14)modify(selected,'fontSize','14px');
  else if(selected.matches('article,section'))modify(selected,'background','linear-gradient(145deg, #143b87, #09255b)');
  else return message('Esta selección no requiere un ajuste básico. Revisa contraste y legibilidad manualmente.');
  message('Mejora sugerida por reglas locales y aplicada solo a la vista previa. No utiliza Internet ni publica.');
 };
 $('[data-studio-undo]',panel).onclick=()=>{if(position>0){position--;apply(history[position],false);reflect();message('Cambio deshecho.')}};
 $('[data-studio-redo]',panel).onclick=()=>{if(position<history.length){apply(history[position],true);position++;reflect();message('Cambio restaurado.')}};
 $('[data-studio-reset]',panel).onclick=()=>{if(!history.length)return;revert();message('Vista previa restablecida. No se cambió la información oficial.')};
 $('[data-studio-save]',panel).onclick=()=>{
  const state=history.slice(0,position).filter(c=>c.path).map(c=>({path:c.path,prop:c.prop,value:c.to}));
  try{if(JSON.stringify(state).length>9000)throw Error('El borrador excede el límite de 9 KB.');
   sessionStorage.setItem(KEY,JSON.stringify({route,created:Date.now(),changes:state}));
   message('Borrador guardado solo en esta pestaña. No está publicado.');
  }catch(e){message('No se pudo guardar el borrador local: '+(e?.message||'Almacenamiento no disponible'))}
 };
 $('[data-studio-restore]',panel).onclick=()=>{
  try{
   const data=JSON.parse(sessionStorage.getItem(KEY)||'null');
   if(!data||data.route!==route||!Array.isArray(data.changes))return message('No hay borrador de esta sección en la pestaña.');
   if(data.changes.length>40)throw Error('Demasiados cambios en el borrador');
   revert();
   let count=0;
   for(const row of data.changes){
    if(!row||typeof row.path!=='string'||row.path.length>500||!allowed.has(row.prop)||typeof row.value!=='string'||row.value.length>280)continue;
    // Nunca se aceptan selectores arbitrarios de otro origen.
    if(!/^[a-z][a-z0-9-]*:nth-of-type\(\d+\)( > [a-z][a-z0-9-]*:nth-of-type\(\d+\))*$/.test(row.path))continue;
    const node=scope.querySelector(row.path);
    if(valid(node)){modify(node,row.prop,row.value);count++}
   }
   message(count+' cambio(s) recuperado(s) en vista previa. Revisa antes de guardar oficialmente.');
  }catch(e){message('No se pudo recuperar este borrador: '+(e?.message||'Formato incorrecto'))}
 };
 $('[data-studio-cms]',panel).onclick=()=>{
  if(!window.LJR_MEDIA?.admin)return message('Necesitas iniciar sesión.');
  const cms=window.LJR_CMS;
  const method=typeof cms?.editPage==='function'?()=>cms.editPage():typeof cms?.open==='function'?()=>cms.open('page'):null;
  if(!method)return message('El editor de guardado oficial no está disponible. Conserva el borrador local; no se publicó nada.');
  cleanup();try{method()}catch(e){window.LJR_MEDIA?.modal?.('Editor oficial',esc(e?.message||'No se pudo abrir.'))}
 };
 reflect();
}
window.LJR_EDITOR_STUDIO={open};
})();
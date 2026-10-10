/* V1236 — Puente verificable entre vista previa y formulario oficial.
   No inventa endpoints ni publica datos: el CMS autorizado conserva el botón Guardar. */
(()=>{
'use strict';
if(window.LJR_EDITOR_CMS_BRIDGE)return;
const PROPS=new Set(['textContent','color','background']);
const RE_PATH=/^[a-z][a-z0-9-]*:nth-of-type\(\d+\)( > [a-z][a-z0-9-]*:nth-of-type\(\d+\))*$/;
const fields=['route','selector','original','text','color','background'];
const $$=(s,r=document)=>r.querySelector(s);
const field=(form,name)=>form.elements.namedItem(name);
function collect(route,history){
 const rows=new Map(),unsupported=new Set();
 for(const change of (Array.isArray(history)?history:[]).slice(-40)){
  if(!change||!PROPS.has(change.prop)){if(change?.prop)unsupported.add(change.prop);continue;}
  if(typeof change.path!=='string'||change.path.length>500||!RE_PATH.test(change.path))continue;
  const key=change.path;
  if(!rows.has(key))rows.set(key,{route:String(route).replace(/[^a-z0-9_-]/gi,'').slice(0,45),selector:'#screen > '+key,original:'',text:'',color:'',background:'',label:key});
  const row=rows.get(key);
  if(change.prop==='textContent'){
   if(typeof change.from!=='string'||typeof change.to!=='string'||change.to.length>250)continue;
   if(!row.original)row.original=change.from.slice(0,250);
   row.text=change.to;
  }else if(typeof change.to==='string'&&change.to.length<=100)row[change.prop]=change.to;
 }
 return {rows:[...rows.values()].slice(0,30),unsupported:[...unsupported]};
}
function waitForForm(timeout=6000){
 return new Promise((resolve,reject)=>{
  let observer,clock,done=false;
  const cleanup=()=>{observer?.disconnect();clearTimeout(clock)};
  const finish=(value,error)=>{if(done)return;done=true;cleanup();error?reject(error):resolve(value)};
  const find=()=>{
   const forms=[...document.querySelectorAll('.liga-media-modal form.cms-form')];
   const match=forms.reverse().find(f=>field(f,'route')&&field(f,'selector')&&field(f,'text'));
   if(match)finish(match);
  };
  observer=new MutationObserver(find);
  observer.observe(document.body,{childList:true,subtree:true});
  clock=setTimeout(()=>finish(null,Error('No apareció el formulario oficial de edición.')),timeout);
  find();
 });
}
/* El repositorio puede no incluir el cliente LJR_CMS. Guardado privado mínimo
   con la misma API de contenido autenticada que usa JR Control para avisos. */
function openServerDraftForm(row){
 const media=window.LJR_MEDIA;
 const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
 const modal=media.modal('Guardar borrador visual en el servidor',
  '<form class="ljr-studio-server-form" data-studio-server-draft>'+
  '<p>Revisa la propuesta. Se enviará como <strong>borrador privado</strong>, sin publicar ni alterar los resultados oficiales.</p>'+
  '<label>Ruta<input name="route" readonly></label><label>Selector<input name="selector" readonly></label>'+
  '<label>Texto original<input name="original" readonly></label><label>Texto nuevo<textarea name="text" maxlength="250" rows="3"></textarea></label>'+
  '<label>Color de letra<input name="color" readonly></label><label>Fondo<input name="background" readonly></label>'+
  '<button type="submit">Guardar borrador en CMS</button>'+
  '<p data-studio-server-status role="status" aria-live="polite">Requiere una sesión válida del servidor.</p></form>');
 const form=modal.querySelector('[data-studio-server-draft]'),status=modal.querySelector('[data-studio-server-status]');
 for(const name of fields){const element=field(form,name);if(element)element.value=row[name]||'';}
 let saving=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(saving)return;
  const btn=form.querySelector('button[type=submit]');saving=true;btn.disabled=true;
  status.textContent='Verificando credenciales y guardando el borrador…';
  try{
   if(!window.LJR_MEDIA?.admin)throw Error('Sesión de administrador requerida.');
   const session=await media.api('me');
   if(!session?.admin)throw Error('La sesión no está verificada.');
   const payload={route:row.route,selector:row.selector,original:row.original,
    text:field(form,'text').value.trim().slice(0,250),color:row.color,background:row.background};
   if(!payload.text&&!payload.color&&!payload.background)throw Error('La propuesta está vacía.');
   const id='content:'+crypto.randomUUID();
   await media.api('content/'+encodeURIComponent(id),{method:'PUT',
    body:{kind:'page',payload,revision:0,published:false}});
   const checked=await media.api('content?admin=1');
   const record=Array.isArray(checked?.items)?checked.items.find(x=>x?.id===id&&x?.kind==='page'&&x.published===false):null;
   if(!record)throw Error('El servidor no confirmó el borrador al volver a consultarlo. Revisa JR Control antes de reintentar para evitar duplicados.');
   status.textContent='Borrador visual guardado y verificado en el servidor. NO está publicado: requiere revisión en el CMS antes de mostrarse a visitantes.';
   btn.textContent='Borrador guardado ✓';
  }catch(error){status.textContent='No se pudo confirmar el borrador: '+(error?.message||'Error del servidor');btn.disabled=false;}
  finally{saving=false}
 });
 return modal;
}
function fill(form,row){
 if(!form||!form.isConnected)throw Error('El formulario oficial se cerró.');
 for(const name of fields){
  const input=field(form,name);
  if(!input)continue;
  // Solo valores estáticos; jamás inyectar HTML ni enviar la solicitud desde el puente.
  input.value=String(row[name]??'');
  input.dispatchEvent(new Event('input',{bubbles:true}));
  input.dispatchEvent(new Event('change',{bubbles:true}));
 }
 const panel=document.createElement('p');
 panel.className='ljr-studio-cms-verified';
 panel.setAttribute('role','status');
 panel.textContent='Datos transferidos desde la vista previa. Revisa ruta, texto y colores. Pulsa Guardar cambios en este formulario oficial para enviarlos al servidor; todavía NO están publicados.';
 form.prepend(panel);
 const save=form.querySelector('button[type=submit]');
 if(save)save.scrollIntoView({block:'nearest',behavior:'instant'});
 return true;
}
async function transfer(route,history,notify=()=>{}){
 const media=window.LJR_MEDIA;
 if(!media?.admin||typeof media.api!=='function')throw Error('Necesitas una sesión administrativa activa.');
 const {rows,unsupported}=collect(route,history);
 if(!rows.length)throw Error('No hay cambios de texto o color compatibles con el CMS. Los ajustes de tamaño, botones e imágenes siguen siendo vista previa local.');
 const response=await media.api('me');
 if(!response?.admin||!window.LJR_MEDIA?.admin)throw Error('La sesión del servidor expiró.');
 const cms=window.LJR_CMS;
 const pick=rows.length===1?0:await choose(rows,unsupported);
 if(pick===null)return {cancelled:true};
 if(typeof cms?.open!=='function'){
  openServerDraftForm(rows[pick]);
  notify('Se abrió el formulario de borrador privado conectado a la API. Debes pulsar Guardar borrador; la publicación pública requiere el CMS completo.');
  return {prepared:true,mode:'server-draft',total:rows.length,unsupported};
 }
 try{cms.open('page')}catch(err){throw Error('No se pudo abrir el CMS: '+(err?.message||'Error'))}
 const form=await waitForForm();
 if(!window.LJR_MEDIA?.admin)throw Error('La sesión administrativa terminó antes de completar la transferencia.');
 fill(form,rows[pick]);
 notify('Se transfirió 1 cambio al CMS; revisa y guarda en su formulario. '+(rows.length>1?'Hay '+(rows.length-1)+' elementos adicionales para transferir por separado.':''));
 return {prepared:true,total:rows.length,unsupported};
}
function choose(rows,unsupported){
 return new Promise(resolve=>{
  const media=window.LJR_MEDIA;
  const list='<option value="">Selecciona un cambio…</option>'+rows.map((r,i)=>'<option value="'+i+'">'+(i+1)+' · '+(r.text?('Texto: '+r.text.slice(0,60)):'Color/fondo: '+r.label.slice(0,45)).replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))+'</option>').join('');
  const dialog=media.modal('Transferir al CMS','<div class="ljr-studio-cms-choice"><p>Elige un elemento. El servidor requiere confirmar cada cambio desde su formulario.</p><select data-cms-choice aria-label="Cambio a transferir">'+list+'</select><p class="ljr-studio-cms-warning">'+(unsupported.length?'Estos ajustes siguen siendo solo vista previa: '+unsupported.join(', ')+'.':'No se publicará nada automáticamente.')+'</p><button type="button" data-cms-continue>Continuar al CMS</button><button type="button" data-cms-cancel>Cancelar</button></div>');
  const root=dialog.querySelector('[data-cms-choice]');let finished=false;
  const end=n=>{if(finished)return;finished=true;dialog.querySelector('[data-close]')?.click();resolve(n)};
  dialog.querySelector('[data-cms-continue]').onclick=()=>{const n=Number(root.value);if(root.value===''||!Number.isInteger(n)||!rows[n])return;end(n)};
  dialog.querySelector('[data-cms-cancel]').onclick=()=>end(null);
  dialog.addEventListener('media-close',()=>end(null),{once:true});
 });
}
window.LJR_EDITOR_CMS_BRIDGE={transfer,collect};
})();
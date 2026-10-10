/* V1208: dos principales independientes para Avisos/Juntas. El backend decide los permisos. */
(()=>{
'use strict';
if(window.__LJR_V1208_COADMINS__)return;
window.__LJR_V1208_COADMINS__=true;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const media=()=>window.LJR_MEDIA;
let busy=false;
function modal(title){
 const m=media()?.modal?.(title,'<div class="v1208-body"><p data-v1208-status role="status">Verificando permisos con el servidor…</p><div data-v1208-content></div></div>');
 m?.querySelector('section')?.classList.add('v1208-dialog');return m;
}
async function open(){
 if(!media()?.admin){media()?.login?.(()=>open());return}
 const d=modal('Dos cuentas principales');
 if(!d)return;
 const status=d.querySelector('[data-v1208-status]'),host=d.querySelector('[data-v1208-content]');
 try{
  const [cms,me]=await Promise.all([
   media().api('me'),
   media().notifyAPI('/admin/me')
  ]);
  const cmsAdmin=cms?.admin||{};
  const cmsStatus=document.createElement('p');
  cmsStatus.textContent='CMS principal de la Liga: '+(cmsAdmin.owner===true
   ? 'Acceso principal confirmado por su servidor.'
   : 'Cuenta administrativa sin rol principal confirmado. El CMS principal todavía debe autorizarla para editar toda la página.');
  host.append(cmsStatus);
  const isPrincipal=me?.actor?.permissions?.includes('roles:write')===true;
  const notificationsStatus=document.createElement('p');
  notificationsStatus.textContent='Avisos, Juntas y Cédulas: '+(isPrincipal
   ? 'Acceso principal confirmado por Railway.'
   : 'Acceso limitado: '+String(me?.actor?.role||'lector')+'.');
  host.append(notificationsStatus);
  if(!isPrincipal){
   const explanation=document.createElement('p');
   explanation.textContent='No se pueden asignar permisos desde este dispositivo. Una cuenta principal verificada debe autorizar el acceso en el servidor.';
   host.append(explanation);
   status.textContent='Verificación completada sin modificar permisos.';
   return;
  }
  const principals=await media().notifyAPI('/admin/principals');
  status.textContent='Permisos verificados directamente con el CMS y Railway; cada cuenta utiliza su propia sesión.';
  const count=document.createElement('div');count.className='v1208-count';
  count.innerHTML='<b>'+Number(principals.current||1)+' / 2</b><span>cuentas principales para Avisos y Juntas</span>';
  host.append(count);
  const owner=document.createElement('p');owner.textContent='Cuenta principal actual del CMS: conservada sin modificaciones.';
  host.append(owner);
  const secondary=principals.secondary;
  if(secondary){
   const p=document.createElement('p');p.textContent='Segunda cuenta autorizada (ID del servidor): '+secondary.subject;
   host.append(p);
   if(principals.canAuthorize===true){
    const revoke=document.createElement('button');revoke.type='button';revoke.textContent='Revocar segundo acceso de Avisos y Juntas';
    revoke.onclick=async()=>{
     if(!confirm('¿Revocar el segundo acceso? No se modificará la cuenta original ni la administración del CMS principal.'))return;
     revoke.disabled=true;
     try{await media().notifyAPI('/admin/principals/'+encodeURIComponent(secondary.subject),{method:'DELETE'});d.querySelector('[data-close]')?.click();open()}
     catch(e){status.textContent=e.message;revoke.disabled=false}
    };
    host.append(revoke);
   }
  }else if(principals.canAuthorize===true){
   const info=document.createElement('p');
   info.textContent='Primero debe existir una segunda cuenta autorizada en el CMS de la Liga. Después selecciónala aquí para concederle todos los permisos de Avisos y Juntas.';
   host.append(info);
   const a=await media().api('admins');
   const available=(a.admins||[]).filter(x=>x.active===true&&x.owner!==true&&/^[A-Za-z0-9:_-]{1,128}$/.test(String(x.id||'')));
   if(!available.length){
    const note=document.createElement('p');note.textContent='Todavía no hay otra cuenta administrativa válida para seleccionar.';host.append(note);
    const create=document.createElement('button');create.type='button';create.textContent='Abrir administración para registrar la segunda cuenta';
    create.onclick=()=>{d.querySelector('[data-close]')?.click();media().manage()};
    host.append(create);
   }
   else{
    const select=document.createElement('select');select.setAttribute('aria-label','Seleccionar segunda cuenta principal');
    for(const x of available){const option=document.createElement('option');option.value=String(x.id);option.textContent=String(x.name||x.username||x.id);select.append(option)}
    const button=document.createElement('button');button.type='button';button.textContent='Autorizar segundo administrador principal';
    button.onclick=async()=>{
     if(!confirm('¿Confirmas que ésta es la cuenta independiente del presidente? Se habilitará acceso total a Avisos y Juntas. Los demás módulos siguen dependiendo del CMS principal.'))return;
     button.disabled=true;
     try{await media().notifyAPI('/admin/principals',{method:'POST',body:{subject:select.value}});
      d.querySelector('[data-close]')?.click();open();
     }catch(e){status.textContent=e.message;button.disabled=false}
    };
    host.append(select,button);
   }
  }else{
   const note=document.createElement('p');note.textContent='Solo la cuenta principal reconocida por el CMS puede autorizar otra cuenta para Avisos y Juntas.';
   host.append(note);
  }
  const note=document.createElement('small');
  note.textContent='Para administrar todas las páginas, sanciones y resultados del CMS principal, también deben autorizarse ambas cuentas en ese servidor. Aquí no se asignan esos permisos.';
  host.append(note);
  const audit=document.createElement('button');audit.type='button';audit.textContent='Ver historial de cambios';
  audit.onclick=async()=>{
   audit.disabled=true;
   try{
    const r=await media().notifyAPI('/admin/audit');
    const rows=(r.items||[]).slice(0,20);
    const out=document.createElement('div');out.className='v1208-history';
    out.replaceChildren(...rows.map(x=>{
      const p=document.createElement('p');
      p.textContent=[x.action,x.actor,x.created_at].filter(Boolean).join(' · ');return p;
    }));
    if(!rows.length)out.textContent='No hay operaciones registradas.';
    host.querySelector('.v1208-history')?.remove();host.append(out);
   }catch(e){status.textContent=e.message}
   finally{audit.disabled=false}
  };
  host.append(audit);
 }catch(e){status.textContent='No se pudo comprobar la autorización: '+(e?.message||'Error de conexión')}
}
function mount(){
 const pane=document.querySelector('.liga-media-modal > section.ljr-admin-manage [data-ljr-editor-center] .ljr-editor-hub-grid');
 if(!pane||!media()?.admin||pane.querySelector('[data-v1208-open]'))return;
 const button=document.createElement('button');button.type='button';button.dataset.v1208Open='';
 button.className='v1208-entry';
 button.innerHTML='<b aria-hidden="true">♙</b><span>Dos administradores<small>Consultar y configurar permisos reales</small></span>';
 button.onclick=open;pane.append(button);
 // El estado de acceso se puede consultar; los botones de aprobación solo aparecen al propietario real.
 // Esta visibilidad no concede permisos de escritura. Todos los cambios pasan por autorización del servidor.
}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mount()})}
document.addEventListener('liga:admin',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
function start(){new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});schedule()}
})();

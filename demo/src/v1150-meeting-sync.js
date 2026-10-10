/* V1150: sincronización manual de juntas, solo si hay backend HTTPS con sesión verificada. */
(()=>{'use strict';if(window.LJR_MEETING_SYNC_V1150)return;
const $=(s,r=document)=>r?.querySelector?.(s);
function view(ctx){
 const r=ctx.item(),n=r.remoteRevision||0;
 return '<div class="mh-overview"><b>Sincronización privada</b><small>Junta '+ctx.fmt(ctx.date())+' · '+(n?'Versión sincronizada '+n:'Sin sincronizar')+'</small></div>'+
 '<p class="mh-tip">Comparte la minuta, asistencia, acuerdos y votaciones entre administradores autorizados cuando esté activo el servidor HTTPS de la Liga. Los archivos y dibujos de firmas permanecen en este dispositivo.</p>'+
 '<div class="mh-buttons"><button type="button" data-mh-action="sync-check">Comprobar servidor</button><button type="button" data-mh-action="sync-upload">Guardar en servidor</button><button type="button" data-mh-action="sync-download">Recuperar del servidor</button></div>'+
 '<p class="mh-tip">Antes de recuperar una versión ajena se descargará una copia JSON de seguridad de la junta actual. No se sobrescribirá otra versión más reciente sin advertencia.</p>'+ 
 '<div class="mh-buttons"><button type="button" data-mh-action="sync-restore-local">Restaurar copia previa</button><input type="file" hidden accept=".json,application/json" data-mh-file="sync-backup"></div>'+
 '<p class="mh-tip">El servicio HTTPS de la Liga ya está configurado. Usa «Comprobar servidor» con una sesión autorizada para confirmar tu acceso antes de sincronizar. Si el servidor no responde, los datos locales siguen disponibles.</p>';
}
async function authorized(permission,ctx){
 const api=window.LJR_MEDIA?.notifyAPI;
 if(!window.LJR_MEDIA?.admin||!api){ctx.msg('Inicia sesión administrativa y comprueba la configuración del servidor.');return null}
 try{
  const me=await api('/admin/me');
  if(!me?.actor?.permissions?.includes(permission)){ctx.msg('Tu cargo no tiene permiso de '+(permission.endsWith('write')?'edición':'lectura')+' de juntas en el servidor.');return null}
  return api;
 }catch(e){ctx.msg('Servicio privado no disponible: '+String(e.message||e).slice(0,130));return null}
}
function exportable(record,ctx){
 const p=JSON.parse(JSON.stringify(record));
 if(!Array.isArray(p.attendance))p.attendance=[];
 if(!Array.isArray(p.tasks))p.tasks=[];
 if(!Array.isArray(p.votes))p.votes=[];
 if(!p.sign||typeof p.sign!=='object')p.sign={president:'',secretary:'',approved:false};
 delete p.sign.images;
 // Los archivos sólo existen en IndexedDB local, no en el servicio de minutas.
 p.attachments=[];
 delete p.remoteRevision;
 delete p.remoteUpdated;
 if(JSON.stringify(p).length>15500)throw Error('Esta minuta es muy grande para compartir. Reduce las notas o descarga el respaldo local.');
 return p;
}
async function readRemote(api,ctx){
 try{return await api('/admin/meetings/'+ctx.date())}
 catch(e){if(e.status===404)return null;throw e}
}
async function check(ctx){
 const api=await authorized('meetings:read',ctx);if(!api)return;
 try{
  const x=await api('/admin/meetings');
  const rows=Array.isArray(x.items)?x.items:[];
  ctx.msg('Servidor conectado: '+rows.length+' juntas en el archivo privado. '+(rows[0]?'Última: '+rows[0].date+'.':'Todavía no hay juntas guardadas.'));
 }catch(e){ctx.msg('No se pudo comprobar el servidor: '+String(e.message||e).slice(0,140))}
}
async function upload(ctx){
 const api=await authorized('meetings:write',ctx);if(!api)return;
 if(!ctx.validDate(ctx.date()))return ctx.msg('Primero selecciona un martes válido.');
 try{
  const remote=await readRemote(api,ctx),local=ctx.item();
  const known=Number(local.remoteRevision)||0;
  if(remote&&remote.revision!==known){
   return ctx.msg('Existe una versión remota diferente (v'+remote.revision+'). Descárgala y revísala antes de guardar; no se sobrescribió.');
  }
  if(!window.confirm('¿Compartir la minuta de '+ctx.fmt(ctx.date())+' con administradores autorizados? No se subirán firmas dibujadas ni archivos.'))return;
  ctx.preserve();
  const data=exportable(ctx.item(),ctx);
  const saved=await api('/admin/meetings/'+ctx.date(),{method:'PUT',body:{payload:data,ifRevision:remote?.revision||0}});
  if(!saved?.ok)throw Error('El servidor no confirmó el guardado');
  local.remoteRevision=saved.revision;local.remoteUpdated=saved.updated_at;
  ctx.persist();ctx.render();ctx.msg('Junta sincronizada en el servidor. Versión '+saved.revision+'.');
 }catch(e){ctx.msg('No se sincronizó: '+String(e.message||e).slice(0,180))}
}
async function download(ctx){
 const api=await authorized('meetings:read',ctx);if(!api)return;
 try{
  const remote=await readRemote(api,ctx);
  if(!remote)return ctx.msg('Esta junta todavía no está registrada en el servidor.');
  if(!remote.payload||typeof remote.payload!=='object')return ctx.msg('Los datos del servidor son inválidos.');
  const original=ctx.item();
  if(!window.confirm('¿Recuperar la versión '+remote.revision+' del servidor? Se descargará un respaldo de esta junta antes de reemplazarla.'))return;
  const date=ctx.date(),backup={format:'LJR-meeting-local-backup-v1150',date,original};
  ctx.download('junta-copia-antes-de-sincronizar-'+date+'.json',JSON.stringify(backup,null,2),'application/json;charset=utf-8');
  const oldSign=original.sign||{},remoteSign=remote.payload.sign||{};
  const newRecord={...remote.payload,sign:{...remoteSign,images:oldSign.images||{}},
   attachments:original.attachments||[],remoteRevision:remote.revision,remoteUpdated:remote.updated_at};
  // El reemplazo sólo se efectúa tras generar el respaldo para descarga.
  const previous=ctx.state[date];
  ctx.state[date]=newRecord;
  try{localStorage.setItem(ctx.KEY,JSON.stringify(ctx.state))}
  catch(e){ctx.state[date]=previous;throw Error('No hay espacio para recuperar la minuta')}
  ctx.applyMinute?.(newRecord.minute);
  ctx.render();ctx.msg('Versión '+remote.revision+' recuperada. Firmas locales y archivos conservados.');
 }catch(e){ctx.msg('No se recuperó la junta: '+String(e.message||e).slice(0,180))}
}
async function restoreBackup(file,ctx){
 if(!file||file.size>2*1024*1024)return ctx.msg('Selecciona una copia JSON válida de máximo 2 MB.');
 try{
  const backup=JSON.parse(await file.text());
  if(backup.format!=='LJR-meeting-local-backup-v1150'||backup.date!==ctx.date()||!backup.original||typeof backup.original!=='object'||Array.isArray(backup.original))throw Error('No corresponde a la junta abierta');
  if(!window.confirm('¿Restaurar la copia guardada de esta fecha? Se descargará otra copia de la versión actual por seguridad.'))return;
  const current=ctx.item();
  ctx.download('junta-copia-actual-'+ctx.date()+'.json',JSON.stringify({format:'LJR-meeting-local-backup-v1150',date:ctx.date(),original:current},null,2),'application/json;charset=utf-8');
  const prior=ctx.state[ctx.date()];
  ctx.state[ctx.date()]=backup.original;
  try{localStorage.setItem(ctx.KEY,JSON.stringify(ctx.state))}catch(e){ctx.state[ctx.date()]=prior;throw Error('No hay espacio local')}
  ctx.applyMinute?.(backup.original.minute);
  ctx.render();ctx.msg('Copia local restaurada. Los demás martes no se modificaron.');
 }catch(e){ctx.msg('No se recuperó la copia: '+String(e.message||e).slice(0,140))}
}
function onChange(e,ctx){
 if(!e.target?.matches?.('[data-mh-file="sync-backup"]'))return false;
 if(!window.LJR_MEDIA?.admin){ctx.msg('Inicia sesión administrativa.');return true}
 restoreBackup(e.target.files?.[0],ctx);
 return true;
}
function handle(action,target,ctx){
 if(action==='sync-restore-local'){ $('[data-mh-file="sync-backup"]',ctx.host)?.click();return true }
 if(!['sync-check','sync-upload','sync-download'].includes(action))return false;
 const work=action==='sync-check'?check:action==='sync-upload'?upload:download;
 work(ctx).catch(e=>ctx.msg('Error de sincronización: '+String(e.message||e).slice(0,140)));
 return true;
}
window.LJR_MEETING_SYNC_V1150={view,handle,onChange,exportable};
})();
/* Perfil V1300: automatizacion local, asistente en dispositivo, preferencias y nube opcional. */
(()=>{
'use strict';
if(window.__LJR_PROFILE_V1300__)return;
window.__LJR_PROFILE_V1300__=true;
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','>':'&gt;',"'":'&#39;'}[c]));
const current=()=>window.LJR_V569_AUTH?.currentAccount?.()||null;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const validRoutes=new Set(['accountPreferences','accountAdvisor','accountCloud']);
const prefKey=a=>'ljr-profile-prefs-v1300-'+String(a?.id||'guest');
const defaultPrefs={textSize:'normal',privateContact:false,reduceMotion:false,smartChecks:true};
const readPrefs=a=>{try{const p=JSON.parse(localStorage.getItem(prefKey(a))||'{}');return {...defaultPrefs,...p}}catch{return {...defaultPrefs}}};
const savePrefs=(a,p)=>{try{localStorage.setItem(prefKey(a),JSON.stringify(p));return true}catch{return false}};
const svg=(path)=>'<svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>';
const ic={
  shield:svg('<path d="m12 2 8 4v5c0 5-3.4 8.8-8 11-4.6-2.2-8-6-8-11V6l8-4Z"/><path d="m9 12 2 2 4-4"/>'),
  ai:svg('<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="M19 17v5m-2.5-2.5h5"/>'),
  settings:svg('<circle cx="12" cy="12" r="3"/><path d="M4 12H2m20 0h-2M12 4V2m0 20v-2M6.3 6.3 4.8 4.8m14.4 14.4-1.5-1.5M17.7 6.3l1.5-1.5M4.8 19.2l1.5-1.5"/>'),
  cloud:svg('<path d="M7 18a5 5 0 0 1-1-9.9A7 7 0 0 1 19.5 10 4 4 0 0 1 19 18H7Z"/>'),
  chevron:svg('<path d="m9 5 7 7-7 7"/>')
};
const row=(label,routeName,icon,extra='')=>'<button type="button" class="v569-profile-menu-row v1300-menu-row" data-v569-route="'+routeName+'"><span>'+ic[icon]+'</span><b>'+esc(label)+'</b><i>'+ic.chevron+'</i></button>';
function enhanceMenu(){
 if(route()!=='profile'||!current())return;
 const menu=$('[data-v569-account-menu]');if(!menu||menu.querySelector('[data-v569-route="accountPreferences"]'))return;
 menu.insertAdjacentHTML('beforeend',
  row('Preferencias y accesibilidad','accountPreferences','settings')+
  row('Asistente local','accountAdvisor','ai')+
  row('Cuenta en la nube','accountCloud','cloud'));
}
function status(msg,isError=false){
 let target=$('[data-v1300-status]');
 if(!target){const host=$('[data-v1300-panel]')||$('[data-v569-page="password"]');if(host){target=document.createElement('div');target.dataset.v1300Status='';target.setAttribute('role','status');target.className='v1300-message';host.append(target)}}
 if(target){target.textContent=msg;target.dataset.error=String(isError);}
}
const part=(title,contents)=>'<section class="v1300-panel"><h2>'+title+'</h2>'+contents+'</section>';
const detail=(title,body,icon='shield')=>'<div class="v1300-detail"><span class="v1300-mark">'+ic[icon]+'</span><div><strong>'+title+'</strong><p>'+body+'</p></div></div>';
function switchRow(label,caption,key,checked){
 return '<label class="v1300-choice"><span><strong>'+label+'</strong><small>'+caption+'</small></span><input type="checkbox" data-v1300-pref="'+key+'" '+(checked?'checked':'')+'></label>';
}
const prefRender=(a)=>{
 const p=readPrefs(a),perm=('Notification' in window)?Notification.permission:'unsupported';
 return '<div class="v1300-page">'+
  detail('Configuración de esta cuenta','Los cambios se guardan automáticamente en este dispositivo.','settings')+
  part('Lectura y accesibilidad',
   '<label class="v1300-select"><strong>Tamaño de letra</strong><select data-v1300-pref="textSize"><option value="normal" '+(p.textSize==='normal'?'selected':'')+'>Normal</option><option value="large" '+(p.textSize==='large'?'selected':'')+'>Grande</option><option value="extra" '+(p.textSize==='extra'?'selected':'')+'>Muy grande</option></select></label>'+
   switchRow('Reducir movimiento','Desactiva animaciones en Perfil y Cuenta.','reduceMotion',p.reduceMotion)+
   switchRow('Ocultar correo en Perfil','El contacto deja de mostrarse en la tarjeta pública de esta pantalla.','privateContact',p.privateContact))+
  part('Automatización y avisos',
   switchRow('Revisión inteligente local','Detecta configuraciones pendientes sin enviar datos a internet.','smartChecks',p.smartChecks)+
   '<div class="v1300-permission"><div><b>Notificaciones del dispositivo</b><small data-v1300-permission>'+permissionText(perm)+'</small></div>'+
   '<button type="button" data-v1300-permission-request '+(perm==='granted'||perm==='unsupported'?'disabled':'')+'>Verificar permiso</button></div>'+
   '<button type="button" class="v1300-link" data-v569-route="notifications">Configurar avisos por equipo y categoría →</button>')+
  '<p class="v1300-footnote">Los permisos de notificación los controla Android/Chrome. No se pueden activar si el navegador los bloquea, ni se envían mensajes con la app cerrada sin el servidor Push.</p>'+
  '</div>';
};
function permissionText(v){return v==='granted'?'Permitidas':v==='denied'?'Bloqueadas en el navegador':v==='default'?'Sin autorización':'No admitidas aquí';}
function applyPrefs(){
 const a=current(),p=readPrefs(a);
 const b=document.body;if(!b)return;
 b.dataset.v1300Text=p.textSize;
 b.dataset.v1300Reduced=String(p.reduceMotion);
 const hero=$('[data-v569-owned] .v569-profile-copy p');
 if(hero){
  if(!hero.dataset.v1300Original)hero.dataset.v1300Original=hero.textContent||'';
  const masked=p.privateContact?'Contacto oculto':hero.dataset.v1300Original;
  if(hero.textContent!==masked)hero.textContent=masked;
 }
}
function signals(a){
 const p=readPrefs(a),devs=Array.isArray(a.devices)?a.devices:[];
 const result=[];
 if(!a.email)result.push({kind:'contact',priority:2,title:'Agrega un correo de recuperación',details:'Tu cuenta local no tiene correo. Actualízalo en Editar perfil; la recuperación en la nube necesita un proveedor habilitado.'});
 if(!a.biometric?.native&&!a.biometric?.credentialId)result.push({kind:'biometric',priority:2,title:'Revisa el acceso biométrico',details:'Tu cuenta local todavía no indica una credencial biométrica vinculada. Puedes activarla desde Seguridad.'});
 if(!devs.some(d=>d.trusted))result.push({kind:'device',priority:1,title:'Revisar dispositivo recordado',details:'No hay un dispositivo marcado como recordado en esta instalación.'});
 if('Notification' in window && Notification.permission==='denied')result.push({kind:'notices',priority:1,title:'Notificaciones bloqueadas',details:'Android/Chrome ha bloqueado los avisos. Revisa los permisos del sitio en el navegador.'});
 if(p.privateContact===false)result.push({kind:'privacy',priority:0,title:'Privacidad del contacto',details:'Puedes ocultar tu correo en el encabezado de Perfil desde Preferencias.'});
 if(!result.length)result.push({kind:'ok',priority:0,title:'Configuración local revisada',details:'No se detectaron ajustes pendientes de los que se pueden comprobar sin servidor.'});
 return result.sort((a,b)=>b.priority-a.priority);
}
function advisorRender(a){
 const p=readPrefs(a),list=signals(a);
 return '<div class="v1300-page">'+
  detail('Asistente y automatización en el teléfono','Los controles básicos son locales, rápidos y sin conexión. La IA de lenguaje sólo se activa cuando el navegador tiene un modelo instalado.','ai')+
  part('Revisión automática',p.smartChecks?
   '<div class="v1300-findings">'+list.map(x=>'<article><strong>'+esc(x.title)+'</strong><p>'+esc(x.details)+'</p></article>').join('')+'</div>':
   '<p>La revisión está desactivada. Puedes activarla en Preferencias.</p>')+
  part('Asistente con IA local (opcional)',
    '<p class="v1300-explain">Genera consejos usando únicamente el estado de las opciones de seguridad. Nunca se envía nombre, correo, contraseña ni fotografías al modelo.</p>'+
    '<div class="v1300-ai-status" data-v1300-ai-state aria-live="polite">Comprueba si tu navegador dispone de un modelo local.</div>'+
    '<button type="button" class="v1300-primary" data-v1300-ai-run>Analizar con IA del dispositivo</button>'+
    '<div class="v1300-ai-answer" data-v1300-ai-answer hidden></div>')+
  part('Accesos rápidos',
    '<div class="v1300-actions"><button type="button" data-v569-route="accountSecurity">Seguridad</button><button type="button" data-v569-route="accountPreferences">Preferencias</button></div>')+
  '</div>';
}
let configPromise=null,cloudClient=null;
async function cloudConfig(){
 if(configPromise)return configPromise;
 configPromise=(async()=>{
  try{
   const r=await fetch('./data/account-cloud-config.json',{cache:'no-store'});
   if(!r.ok)return null;
   const v=await r.json(),u=new URL(v.url||'');
   if(v.enabled!==true||u.protocol!=='https:'||!(/^[a-z0-9-]+\.supabase\.co$/i).test(u.hostname)||u.pathname!=='/'||!/^sb_publishable_|^eyJ[a-zA-Z0-9._-]+/.test(v.publishableKey||''))return null;
   return {url:u.origin,publishableKey:v.publishableKey,passkeys:v.passkeys===true};
  }catch{return null}
 })();
 return configPromise;
}
async function getCloud(){
 if(cloudClient)return cloudClient;
 const cfg=await cloudConfig();if(!cfg)throw Error('El administrador todavía no ha configurado la autenticación en la nube.');
 const {createClient}=await import('@supabase/supabase-js');
 cloudClient=createClient(cfg.url,cfg.publishableKey,{
  auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:false,
   storageKey:'ljr-cloud-auth-v1300',experimental:{passkey:cfg.passkeys}}
 });
 return cloudClient;
}
function cloudRender(a){
 return '<div class="v1300-page">'+
  detail('Sincronización privada entre dispositivos','Conecta una cuenta de nube verificada. Tu cuenta local seguirá funcionando por separado.','cloud')+
  '<div class="v1300-cloud-state" data-v1300-cloud-state role="status">Comprobando si existe un servidor de cuentas…</div>'+
  '<div class="v1300-cloud-form" data-v1300-cloud-form hidden>'+
    part('Cuenta segura',
      '<label>Correo de la cuenta en la nube<input type="email" autocomplete="email" inputmode="email" data-v1300-cloud-email placeholder="nombre@correo.com"></label>'+
      '<label>Contraseña para la nube<input type="password" autocomplete="current-password" data-v1300-cloud-password placeholder="Mínimo 12 caracteres"></label>'+
      '<div class="v1300-actions"><button type="button" data-v1300-cloud-action="signup">Crear cuenta</button><button type="button" data-v1300-cloud-action="login">Iniciar sesión</button><button type="button" data-v1300-cloud-action="recover">Recuperar contraseña</button><button type="button" data-v1300-cloud-action="passkey-login" hidden>Entrar con passkey</button></div>')+
    part('Perfil sincronizado',
      '<p>Una vez autenticado, puedes guardar o recuperar sólo los datos visuales de tu camiseta y preferencias. No se copian contraseñas, biometría ni permisos administrativos.</p>'+
      '<div class="v1300-actions"><button type="button" data-v1300-cloud-action="save" disabled>Guardar mis preferencias</button><button type="button" data-v1300-cloud-action="restore" disabled>Recuperar preferencias</button></div>')+
    part('Sesiones y passkeys',
      '<div class="v1300-actions"><button type="button" data-v1300-cloud-action="passkey-register" disabled hidden>Crear passkey</button><button type="button" data-v1300-cloud-action="others" disabled>Cerrar otras sesiones</button><button type="button" data-v1300-cloud-action="logout" disabled>Salir de esta sesión</button></div>'+
      '<p class="v1300-footnote">Cerrar sesiones revoca tokens de actualización. Los tokens de acceso emitidos anteriormente pueden ser válidos hasta su vencimiento. No reemplaza los accesos locales de administración.</p>')+
    '<div class="v1300-cloud-output" data-v1300-cloud-output aria-live="polite"></div>'+
  '</div>'+
  '<p class="v1300-footnote">No se recopilan tus datos de Liga automáticamente. Para conectar varios teléfonos, la Liga debe configurar un proyecto de autenticación y autorizar su uso.</p></div>';
}
async function cloudState(){
 const wrap=$('[data-v1300-panel="accountCloud"]');if(!wrap)return;
 const state=$('[data-v1300-cloud-state]',wrap),form=$('[data-v1300-cloud-form]',wrap);
 const cfg=await cloudConfig();
 if(!wrap.isConnected)return;
 if(!cfg){
  state.textContent='Sin servidor de cuentas configurado. La cuenta local sigue disponible. Este módulo está preparado pero no está activado.';
  return;
 }
 form.hidden=false;
 try{
  const client=await getCloud(),{data,error}=await client.auth.getUser();
  const user=error?null:data?.user;
  if(!wrap.isConnected)return;
  state.textContent=user?'Conectado a nube: '+(user.email||'Cuenta verificada'):'Servidor configurado. Inicia sesión o crea una cuenta con correo confirmado.';
  wrap.querySelectorAll('[data-v1300-cloud-action="save"],[data-v1300-cloud-action="restore"],[data-v1300-cloud-action="others"],[data-v1300-cloud-action="logout"]').forEach(b=>b.disabled=!user);
  for(const action of ['passkey-login','passkey-register']){
   const el=wrap.querySelector('[data-v1300-cloud-action="'+action+'"]');
   if(el){el.hidden=!cfg.passkeys||typeof client.auth[action==='passkey-login'?'signInWithPasskey':'registerPasskey']!=='function';
    if(action==='passkey-register')el.disabled=!user;}
  }
 }catch(err){state.textContent='No se pudo conectar al servidor de cuentas: '+String(err.message||'error de red');}
}
function cloudOutput(message,isError=false){
 const el=$('[data-v1300-cloud-output]');if(el){el.textContent=message;el.dataset.error=String(isError)}
}
function sanitizedProfile(a){
 const keys=['shirtName','shirtNumber','shirtColor','shirtTeam','shirtCategory','avatarPreset'];
 const v={};for(const k of keys)if(typeof a?.[k]==='string'&&a[k].length<=120)v[k]=a[k];
 return v;
}
async function cloudAction(action,btn){
 const root=btn.closest('[data-v1300-panel]'),email=$('[data-v1300-cloud-email]',root)?.value.trim(),pass=$('[data-v1300-cloud-password]',root)?.value||'';
 if(btn.disabled)return;
 if(['signup','login','recover'].includes(action)&&(!email||!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email)))return cloudOutput('Escribe un correo válido.',true);
 if(['signup','login'].includes(action)&&pass.length<(action==='signup'?12:1))return cloudOutput('Escribe la contraseña (mínimo 12 caracteres al registrarte).',true);
 if(['others','restore'].includes(action)&&!confirm(action==='restore'?'¿Recuperar la personalización guardada en la nube? Se reemplazarán sólo preferencias y camiseta.':'¿Cerrar las demás sesiones de esta cuenta en la nube?'))return;
 const previous=btn.disabled;btn.disabled=true;cloudOutput('Procesando…');
 try{
  const client=await getCloud();let response;
  if(action==='signup')response=await client.auth.signUp({email,password:pass});
  if(action==='login')response=await client.auth.signInWithPassword({email,password:pass});
  if(action==='recover')response=await client.auth.resetPasswordForEmail(email);
  if(action==='logout')response=await client.auth.signOut({scope:'local'});
  if(action==='others')response=await client.auth.signOut({scope:'others'});
  if(action==='passkey-register')response=await client.auth.registerPasskey();
  if(action==='passkey-login')response=await client.auth.signInWithPasskey();
  if(action==='save'||action==='restore'){
   const {data:identity,error}=await client.auth.getUser();if(error||!identity?.user)throw Error('Inicia sesión y confirma tu correo primero.');
   const a=current();if(!a)throw Error('No hay una cuenta local para asociar la personalización.');
   if(action==='save'){
    response=await client.from('profile_preferences').upsert({user_id:identity.user.id,profile:sanitizedProfile(a),prefs:readPrefs(a),updated_at:new Date().toISOString()},{onConflict:'user_id'});
   }else{
    response=await client.from('profile_preferences').select('profile,prefs').eq('user_id',identity.user.id).maybeSingle();
    if(!response.error&&!response.data)throw Error('Aún no hay preferencias guardadas en la nube.');
    if(!response.error){
     const original=JSON.parse(localStorage.getItem('ljr-auth-v569')||'{}');
     const idx=original.accounts?.findIndex(x=>x.id===a.id)??-1;
     if(idx<0)throw Error('No se encontró la cuenta local.');
     const safe=sanitizedProfile(response.data?.profile||{});
     Object.assign(original.accounts[idx],safe);
     localStorage.setItem('ljr-auth-v569',JSON.stringify(original));
     const raw=response.data?.prefs||{},options={...defaultPrefs};
     if(['normal','large','extra'].includes(raw.textSize))options.textSize=raw.textSize;
     for(const key of ['privateContact','reduceMotion','smartChecks'])if(typeof raw[key]==='boolean')options[key]=raw[key];
     savePrefs(a,options);applyPrefs();
     try{window.dispatchEvent(new CustomEvent('ljr:profile-updated',{detail:{accountId:a.id}}))}catch{}
    }
   }
  }
  if(response?.error)throw response.error;
  cloudOutput({
   signup:'Cuenta de nube solicitada. Revisa tu correo para confirmar antes de iniciar sesión.',
   login:'Sesión en la nube iniciada.',
   recover:'Si el correo existe, recibirás instrucciones para recuperarlo.',
   logout:'Sesión de nube cerrada en este dispositivo.',
   others:'Se solicitó el cierre de las demás sesiones.',
   save:'Personalización guardada en la nube.',
   restore:'Personalización recuperada. Vuelve a Perfil para verla.',
   'passkey-register':'Passkey registrada con el proveedor.',
   'passkey-login':'Inicio con passkey completado.'
  }[action]||'Operación terminada.');
  if(['signup','login','logout','others','passkey-login','passkey-register'].includes(action))await cloudState();
 }catch(err){cloudOutput(err?.message||'No se pudo completar la operación.',true)}
 finally{if(root?.isConnected){btn.disabled=previous;if(['signup','login','logout','others','passkey-login','passkey-register'].includes(action))void cloudState();}}
}
async function localAI(){
 const button=$('[data-v1300-ai-run]'),statusEl=$('[data-v1300-ai-state]'),output=$('[data-v1300-ai-answer]');
 if(!button||!statusEl||!output)return;
 button.disabled=true;statusEl.textContent='Comprobando IA instalada…';output.hidden=true;
 let session=null;
 try{
  const api=window.LanguageModel;
  if(!api||typeof api.availability!=='function')throw Error('Este navegador no incluye la API de IA local.');
  const available=await api.availability({expectedInputs:[{type:'text',languages:['es']}],expectedOutputs:[{type:'text',languages:['es']}]});
  if(available!=='available')throw Error('El modelo local no está instalado o no es compatible. No se descargará nada.');
  const a=current(),warnings=signals(a).map(x=>x.title).slice(0,5);
  session=await api.create({expectedInputs:[{type:'text',languages:['es']}],expectedOutputs:[{type:'text',languages:['es']}]});
  const result=await session.prompt('Eres asesor de seguridad de una liga amateur. Da tres consejos concisos en español, sin pedir contraseñas ni datos personales. Sólo tienes estos indicadores generales: '+JSON.stringify(warnings));
  output.textContent=String(result||'No hubo respuesta').slice(0,1500);output.hidden=false;
  statusEl.textContent='IA ejecutada localmente. No se envió información personal.';
 }catch(err){
  statusEl.textContent=(err?.message||'IA local no disponible')+' La revisión automática anterior sí funciona sin modelo.';
 }finally{try{session?.destroy?.()}catch{}button.disabled=false}
}
function scorePassword(value){
 let s=0,issues=[];
 if(value.length>=12)s++;else issues.push('Usa 12 caracteres o más.');
 if(value.length>=16)s++;
 if(/[A-Z]/.test(value)&&/[a-z]/.test(value))s++;
 if(/[0-9]/.test(value)&&/[^a-zA-Z0-9]/.test(value))s++;
 if(/(.)\1{3,}/.test(value)||/^(password|contrase.n?a|123456|qwerty|admin|juventino)/i.test(value)){s=Math.min(s,1);issues.push('Evita patrones repetidos y claves conocidas.')}
 return {score:s,msg:!value?'Escribe una contraseña para ver recomendaciones.':issues.length?issues.join(' '):'Buena combinación. Evita reutilizar contraseñas.'};
}
function mountPasswordHelper(){
 const root=$('[data-v569-page="password"]');if(!root||root.querySelector('[data-v1300-password-help]'))return;
 const field=$('[data-v569-new-pass]',root);if(!field)return;
 const panel=document.createElement('div');panel.className='v1300-pass-help';panel.dataset.v1300PasswordHelp='';
 panel.innerHTML='<div data-v1300-pass-info aria-live="polite">Tu contraseña se analiza únicamente en el dispositivo.</div><button type="button" data-v1300-password-create>Generar contraseña fuerte</button><button type="button" data-v1300-password-copy>Copiar contraseña</button>'; 
 field.closest('.v569-field')?.after(panel);
 function update(){const sc=scorePassword(field.value);panel.querySelector('[data-v1300-pass-info]').textContent='Fortaleza local '+sc.score+'/4 · '+sc.msg;}
 field.addEventListener('input',update,{passive:true});update();
}
let busy=false;
async function mount(){
 if(busy)return;busy=true;
 try{
  enhanceMenu();applyPrefs();mountPasswordHelper();
  const root=$('[data-v1300-panel]'),type=root?.dataset.v1300Panel;
  if(!type||!validRoutes.has(type)||root.dataset.v1300Ready)return;
  const a=current();if(!a)return;
  root.dataset.v1300Ready='1';
  const mountPoint=$('[data-v1300-content]',root);
  if(!mountPoint)return;
  mountPoint.innerHTML=type==='accountPreferences'?prefRender(a):type==='accountAdvisor'?advisorRender(a):cloudRender(a);
  if(type==='accountCloud')void cloudState();
 }finally{busy=false}
}
document.addEventListener('change',e=>{
 const control=e.target.closest?.('[data-v1300-pref]');if(!control)return;
 const a=current();if(!a)return;
 const name=control.dataset.v1300Pref,p=readPrefs(a);
 const value=control.type==='checkbox'?control.checked:control.value;
 if(name==='textSize'&&!['normal','large','extra'].includes(value))return;
 if(!Object.prototype.hasOwnProperty.call(defaultPrefs,name))return;
 p[name]=value;
 if(savePrefs(a,p)){applyPrefs();status('Preferencia guardada')}
});
document.addEventListener('click',async e=>{
 const target=e.target.closest?.('[data-v1300-ai-run],[data-v1300-cloud-action],[data-v1300-permission-request],[data-v1300-password-create],[data-v1300-password-copy]');
 if(!target)return;
 if(target.matches('[data-v1300-ai-run]')){e.preventDefault();await localAI();return;}
 if(target.matches('[data-v1300-cloud-action]')){e.preventDefault();await cloudAction(target.dataset.v1300CloudAction,target);return;}
 if(target.matches('[data-v1300-permission-request]')){
  e.preventDefault();if(!('Notification' in window))return;
  try{const res=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
   const el=$('[data-v1300-permission]');if(el)el.textContent=permissionText(res);
   target.disabled=res==='granted';
  }catch{status('No se pudo cambiar el permiso. Revisa la configuración de Chrome.',true);}
  return;
 }
 if(target.matches('[data-v1300-password-copy]')){
  e.preventDefault();
  const root=target.closest('[data-v569-page]'),input=$('[data-v569-new-pass]',root);
  if(!input?.value)return status('Primero escribe o genera una contraseña.',true);
  try{await navigator.clipboard.writeText(input.value);status('Contraseña copiada. Guárdala en un gestor de contraseñas.')}catch{status('No se pudo copiar. Usa el gestor de contraseñas del teléfono.',true)}
  return;
 }
 if(target.matches('[data-v1300-password-create]')){
  e.preventDefault();
  const a=new Uint32Array(5);crypto.getRandomValues(a);
  const chars='abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
  const pass=Array.from(a,v=>{let s='';for(let i=0;i<4;i++){s+=chars[v%chars.length];v=Math.floor(v/chars.length)}return s}).join('');
  const root=target.closest('[data-v569-page]');const one=$('[data-v569-new-pass]',root),two=$('[data-v569-new-confirm]',root);
  if(one&&two){one.value=pass;two.value=pass;one.dispatchEvent(new Event('input',{bubbles:true}));status('Contraseña generada. Guárdala en tu gestor de contraseñas.');}
 }
});
window.addEventListener('hashchange',()=>setTimeout(mount,80));
const observer=new MutationObserver(()=>{if(route()==='profile'||validRoutes.has(route())||route()==='accountPassword')queueMicrotask(mount)});
window.addEventListener('ljr:profile-updated',()=>setTimeout(mount,60));
document.addEventListener('DOMContentLoaded',()=>{const sc=$('#screen');if(sc)observer.observe(sc,{childList:true,subtree:true});void mount()},{once:true});
if(document.readyState!=='loading'){const sc=$('#screen');if(sc)observer.observe(sc,{childList:true,subtree:true});void mount();}
window.LJR_PROFILE_V1300={signals,readPrefs,scorePassword,cloudConfig};
})();
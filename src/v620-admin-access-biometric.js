/* V620 — Acceso de administración: teléfono, huella/biometría y dispositivo recordado.
   No crea privilegios nuevos: la huella sólo reutiliza una sesión de administrador
   previamente validada por el servidor. En Chrome usa WebAuthn del dispositivo;
   en la APK usa LigaBiometric y Android Keystore. */
(function(){
'use strict';
if(window.__LJR_V620_ADMIN_ACCESS__)return;
window.__LJR_V620_ADMIN_ACCESS__=true;

const SESSION_KEY='liga-media-session';
const REMEMBER_KEY='ljr-admin-remember-v620';
const WEB_AUTHN_KEY='ljr-admin-webauthn-v620';
const PENDING_KEY='ljr-admin-pending-v620';
const THIRTY_DAYS=30*24*60*60*1000;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=(k,d=null)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const b64u=bytes=>{let s='';new Uint8Array(bytes).forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const unb64u=s=>{s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out};
const random=n=>{const a=new Uint8Array(n);crypto.getRandomValues(a);return a};

function toast(msg){
  document.querySelector('.v620-admin-toast')?.remove();
  const n=document.createElement('div');n.className='v620-admin-toast';n.textContent=msg;document.body.appendChild(n);
  setTimeout(()=>n.remove(),2600);
}
function currentLigaAccount(){
  try{return window.LJR_V569_AUTH?.currentAccount?.()||null}catch(_){return null}
}
function normalizePhone(v){
  const d=String(v||'').replace(/\D/g,'');
  return d.length===12&&d.startsWith('52')?d.slice(2):d;
}
function sessionToken(){try{return String(localStorage.getItem(SESSION_KEY)||'').trim()}catch(_){return''}}
function remembered(){
  const r=read(REMEMBER_KEY,null);
  if(!r?.expiresAt)return null;
  if(Number(r.expiresAt)<=Date.now()){
    try{localStorage.removeItem(REMEMBER_KEY)}catch(_){}
    return null;
  }
  return r;
}
function rememberSession(method='password'){
  const token=sessionToken();if(!token)return false;
  write(REMEMBER_KEY,{expiresAt:Date.now()+THIRTY_DAYS,method,updatedAt:Date.now()});
  return true;
}
function clearRemember(){
  try{localStorage.removeItem(REMEMBER_KEY);localStorage.removeItem(WEB_AUTHN_KEY);sessionStorage.removeItem(PENDING_KEY)}catch(_){}
}
function modal(){
  return $$('.liga-media-modal').find(m=>/administraci[oó]n/i.test(m.textContent||''))||null;
}
function fields(root){
  const inputs=$$('input',root);
  const identifier=inputs.find(i=>!['password','checkbox','radio','hidden'].includes((i.type||'text').toLowerCase()))||null;
  const password=inputs.find(i=>(i.type||'').toLowerCase()==='password')||null;
  const remember=inputs.find(i=>(i.type||'').toLowerCase()==='checkbox'&&/recordar este dispositivo/i.test(i.closest('label')?.textContent||''))||
    inputs.find(i=>(i.type||'').toLowerCase()==='checkbox')||null;
  const enter=$$('button',root).find(b=>/^\s*entrar\s*$/i.test(b.textContent||''))||null;
  return {identifier,password,remember,enter};
}
function hasNativeBio(){
  return !!window.LJR_ADMIN_BIOMETRIC;
}
async function browserBioAvailable(){
  try{return !!(window.PublicKeyCredential&&navigator.credentials&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())}
  catch(_){return false}
}
async function enrollBrowserBio(){
  if(!(await browserBioAvailable()))throw new Error('Este Chrome no ofrece huella o bloqueo biométrico compatible');
  const token=sessionToken();if(!token||!window.LJR_MEDIA?.admin)throw new Error('Primero entra correctamente como administrador');
  const old=read(WEB_AUTHN_KEY,null);
  const userId=old?.userId?unb64u(old.userId):random(32);
  const cred=await navigator.credentials.create({publicKey:{
    challenge:random(32),
    rp:{name:'Liga Juventino Rosas'},
    user:{id:userId,name:'administracion',displayName:'Administración de la Liga'},
    pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
    timeout:60000,
    authenticatorSelection:{authenticatorAttachment:'platform',residentKey:'preferred',userVerification:'required'},
    attestation:'none',
    excludeCredentials:old?.credentialId?[{type:'public-key',id:unb64u(old.credentialId),transports:['internal']}]:[]
  }});
  if(!cred)throw new Error('No se pudo registrar la huella');
  write(WEB_AUTHN_KEY,{credentialId:b64u(cred.rawId),userId:b64u(userId),createdAt:Date.now()});
  rememberSession('biometric');
  toast('Huella registrada en este dispositivo');
}
async function verifyBrowserBio(){
  const saved=read(WEB_AUTHN_KEY,null);
  if(!saved?.credentialId)throw new Error('Primero registra la huella después de entrar una vez con contraseña');
  if(!sessionToken())throw new Error('No hay una sesión de administrador guardada en este dispositivo');
  if(!remembered())throw new Error('El acceso recordado venció. Entra nuevamente con contraseña');
  const result=await navigator.credentials.get({publicKey:{
    challenge:random(32),
    allowCredentials:[{type:'public-key',id:unb64u(saved.credentialId),transports:['internal']}],
    timeout:60000,userVerification:'required'
  }});
  if(!result)throw new Error('No se pudo verificar la huella');
  await refreshAdminAfterUnlock();
}
async function storeNativeBio(){
  const plugin=window.LJR_ADMIN_BIOMETRIC,token=sessionToken();
  if(!plugin||!token||!window.LJR_MEDIA?.admin)return false;
  try{
    const check=await plugin.hasSession?.();
    if(check?.saved){rememberSession('biometric');return true}
    if(!/^[a-f0-9]{64}$/i.test(token))return false;
    const r=await plugin.storeSession({token});
    if(r?.saved){rememberSession('biometric');toast('Huella registrada para Administración');return true}
  }catch(err){toast(err?.message||'No se pudo registrar la huella')}
  return false;
}
async function verifyNativeBio(){
  const plugin=window.LJR_ADMIN_BIOMETRIC;if(!plugin)throw new Error('La biometría nativa está disponible en la APK');
  const has=await plugin.hasSession?.();if(!has?.saved)throw new Error('Primero activa la huella después de entrar una vez con contraseña');
  const r=await plugin.unlockSession?.();const token=String(r?.token||'').trim();
  if(!token)throw new Error('No se pudo recuperar la sesión');
  localStorage.setItem(SESSION_KEY,token);rememberSession('biometric');
  await refreshAdminAfterUnlock();
}
async function refreshAdminAfterUnlock(){
  try{
    await window.LJR_MEDIA?.refresh?.();
    await new Promise(r=>setTimeout(r,220));
    if(window.LJR_MEDIA?.admin){
      rememberSession('biometric');
      document.body.classList.add('liga-editor');
      window.dispatchEvent(new CustomEvent('liga:admin'));
      modal()?.remove();
      toast('Acceso con huella correcto');
      return true;
    }
  }catch(_){}
  throw new Error('La sesión guardada ya no es válida. Entra nuevamente con tu contraseña');
}
async function bioUnlock(){
  try{
    if(hasNativeBio())await verifyNativeBio();
    else await verifyBrowserBio();
  }catch(err){toast(err?.name==='NotAllowedError'?'Verificación cancelada':(err?.message||'No se pudo usar la huella'))}
}
function prefillPhone(root){
  const {identifier}=fields(root);if(!identifier)return;
  const account=currentLigaAccount(),phone=normalizePhone(account?.phone||'');
  identifier.type='tel';identifier.inputMode='tel';identifier.autocomplete='tel';
  identifier.placeholder='Número de teléfono autorizado';
  if(phone){identifier.value=phone;toast('Teléfono de tu cuenta colocado')}
  else{identifier.value='';identifier.focus();toast('Escribe el número autorizado por el presidente')}
}
function markPending(root){
  const {remember}=fields(root);
  try{sessionStorage.setItem(PENDING_KEY,JSON.stringify({remember:remember?.checked!==false,bio:root.querySelector('[data-v620-register-bio]')?.checked!==false,at:Date.now()}))}catch(_){}
}
async function finalizeIfAdmin(){
  if(!window.LJR_MEDIA?.admin)return;
  let p=null;try{p=JSON.parse(sessionStorage.getItem(PENDING_KEY)||'null')}catch(_){}
  if(p?.remember!==false)rememberSession('password');
  if(p?.bio!==false){
    if(hasNativeBio())await storeNativeBio();
    else if(await browserBioAvailable()){
      const existing=read(WEB_AUTHN_KEY,null);
      if(!existing?.credentialId){
        try{await enrollBrowserBio()}catch(err){if(err?.name!=='NotAllowedError')toast(err?.message||'No se pudo registrar huella')}
      }
    }
  }
  try{sessionStorage.removeItem(PENDING_KEY)}catch(_){}
}
function enhance(root){
  if(!root||root.dataset.v620AdminEnhanced==='1')return;
  root.dataset.v620AdminEnhanced='1';
  const {identifier,password,remember,enter}=fields(root);
  if(identifier){
    identifier.autocomplete='username';
    identifier.inputMode='text';
    identifier.placeholder='Usuario o número de teléfono';
    identifier.addEventListener('blur',()=>{
      const d=normalizePhone(identifier.value);
      if(/^\+?[\d\s()-]{8,}$/.test(identifier.value||'')&&d.length>=10)identifier.value=d;
    });
  }
  if(password)password.autocomplete='current-password';
  if(remember){
    remember.checked=true;
    const label=remember.closest('label');if(label){
      const txt=label.querySelector('span')||label;
      if(!/30 d[ií]as/i.test(txt.textContent||''))txt.append(document.createTextNode(' · 30 días'));
    }
  }

  const actions=document.createElement('div');actions.className='v620-admin-actions';
  actions.innerHTML=
    '<button type="button" data-v620-phone><span>☎</span><b>Entrar con teléfono</b></button>'+
    '<button type="button" data-v620-bio><span>◉</span><b>Entrar con huella</b></button>';
  const bioOpt=document.createElement('label');bioOpt.className='v620-admin-bio-opt';
  bioOpt.innerHTML='<input type="checkbox" data-v620-register-bio checked><span><b>Registrar huella en este dispositivo</b><small>Se activa sólo después de un acceso de administrador correcto.</small></span>';

  const anchor=remember?.closest('label')||password?.closest('label')||password;
  if(anchor?.parentElement){
    anchor.insertAdjacentElement('afterend',actions);
    actions.insertAdjacentElement('afterend',bioOpt);
  }
  actions.querySelector('[data-v620-phone]')?.addEventListener('click',()=>prefillPhone(root));
  actions.querySelector('[data-v620-bio]')?.addEventListener('click',bioUnlock);
  if(enter){
    enter.addEventListener('click',()=>{
      markPending(root);
      if(enter.dataset.v620Busy==='1')return;
      enter.dataset.v620Busy='1';
      setTimeout(()=>{delete enter.dataset.v620Busy},1800);
      setTimeout(finalizeIfAdmin,350);
      setTimeout(finalizeIfAdmin,1100);
    },false);
  }
  root.addEventListener('submit',()=>{markPending(root);setTimeout(finalizeIfAdmin,500)},false);

  const errorEls=$$('*',root).filter(x=>x.children.length===0&&/demasiados intentos/i.test(x.textContent||''));
  if(errorEls.length){
    const hint=document.createElement('p');hint.className='v620-admin-lock-hint';
    hint.textContent='Puedes usar la huella si ya estaba registrada. Para teléfono, usa el número autorizado; el bloqueo de contraseña no se omite.';
    errorEls[0].insertAdjacentElement('afterend',hint);
  }
}
function scan(){
  const m=modal();if(m)enhance(m);
  if(window.LJR_MEDIA?.admin)finalizeIfAdmin();
}
function expireRemembered(){
  const r=read(REMEMBER_KEY,null);
  if(r?.expiresAt&&Number(r.expiresAt)<=Date.now()){
    try{localStorage.removeItem(REMEMBER_KEY)}catch(_){}
  }
}
expireRemembered();
new MutationObserver(scan).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('liga:admin',()=>{scan();finalizeIfAdmin()});
window.addEventListener('focus',scan);
setInterval(scan,1200);
setTimeout(scan,300);

window.LJR_V620_ADMIN_ACCESS={
  usePhone:()=>{const m=modal();if(m)prefillPhone(m)},
  unlockBiometric:bioUnlock,
  enrollBiometric:async()=>{if(hasNativeBio())return storeNativeBio();return enrollBrowserBio()},
  remember:()=>rememberSession('manual'),
  forget:()=>{clearRemember();window.LJR_ADMIN_BIOMETRIC?.clearSession?.();toast('Dispositivo olvidado')},
  remembered
};
})();
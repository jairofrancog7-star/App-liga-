import { Capacitor, registerPlugin } from '@capacitor/core';
const nativeBiometric=registerPlugin('LigaBiometric');
/* V569 — Cuenta propia de Liga Juventino.
   Registro local por teléfono o Gmail/correo, alias elegido o generado,
   contraseña con hash PBKDF2 y acceso biométrico del dispositivo mediante WebAuthn.
   No envía credenciales a AdminFut ni a servicios externos. */
(function(){
'use strict';
if(window.__LJR_V569_ACCOUNT_AUTH__)return;
window.__LJR_V569_ACCOUNT_AUTH__=true;

const AUTH_KEY='ljr-auth-v569';
const STORE_KEY='lj-store-v3';
const RETURN_KEY='ljr-auth-return-v569';
const DEVICE_KEY='ljr-device-v577';
const REMEMBER_KEY='ljr-remembered-account-v577';
const ROUTES=new Set(['accountRegister','accountLogin','accountEdit','accountSecurity','accountPassword','accountDevices','accountPrivacy','accountPreferences','accountAdvisor','accountCloud']);
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const nowIso=()=>new Date().toISOString();
const normalizeEmail=v=>String(v||'').trim().toLowerCase();
const normalizePhone=v=>String(v||'').replace(/\D/g,'').replace(/^52(?=\d{10}$)/,'');
const cleanAlias=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9._-]+/g,'').slice(0,24);
const readJson=(key,def)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??def}catch(_){return def}};
const writeJson=(key,val)=>localStorage.setItem(key,JSON.stringify(val));
const bytesToB64=bytes=>{let s='';new Uint8Array(bytes).forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const b64ToBytes=s=>{s=String(s||'').replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const raw=atob(s),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out};
const randomBytes=n=>{const a=new Uint8Array(n);crypto.getRandomValues(a);return a};
const randomId=()=>bytesToB64(randomBytes(18));
const authState=()=>{const v=readJson(AUTH_KEY,{version:1,accounts:[],currentId:null});if(!Array.isArray(v.accounts))v.accounts=[];return v};
const saveAuth=v=>writeJson(AUTH_KEY,v);
const currentAccount=()=>{const a=authState();return a.accounts.find(x=>x.id===a.currentId)||null};
const allAccounts=()=>authState().accounts||[];
const fmtDate=v=>{try{return new Date(v).toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'})}catch(_){return ''}};
const deviceName=()=>{const ua=navigator.userAgent||'';if(/Android/i.test(ua))return 'Android';if(/iPhone|iPad|iPod/i.test(ua))return 'iPhone/iPad';return 'Este dispositivo'};
function currentDeviceId(){
  try{
    let id=String(localStorage.getItem(DEVICE_KEY)||'');
    if(!id){id=randomId();localStorage.setItem(DEVICE_KEY,id)}
    return id;
  }catch(_){return 'session-'+randomId()}
}
function currentDeviceLabel(){
  const ua=navigator.userAgent||'';
  let detail='';
  if(/Android/i.test(ua)){
    const m=ua.match(/Android\s+([\d.]+)/i);detail=m?.[1]?'Android '+m[1]:'Android';
  }else if(/iPhone|iPad|iPod/i.test(ua)){
    detail='iPhone/iPad';
  }else detail='Navegador web';
  return detail;
}
function rememberedAccountId(){try{return String(localStorage.getItem(REMEMBER_KEY)||'')}catch(_){return''}}
function deviceEntry(account){const id=currentDeviceId();return (account?.devices||[]).find(d=>d.id===id)||null}
function isRememberedDevice(account){const d=deviceEntry(account);return !!(d?.trusted&&rememberedAccountId()===account?.id)}
function rememberDevice(account,{verified=false,method='password'}={}){
  if(!account?.id)return account;
  const auth=authState(),idx=auth.accounts.findIndex(a=>a.id===account.id);
  if(idx<0)return account;
  const id=currentDeviceId(),devices=Array.isArray(auth.accounts[idx].devices)?auth.accounts[idx].devices.slice():[];
  const old=devices.find(d=>d.id===id);
  const entry={
    id,
    name:deviceName(),
    label:currentDeviceLabel(),
    trusted:true,
    verified:!!(verified||old?.verified),
    method:verified?'biometric':(old?.method||method),
    firstSeenAt:old?.firstSeenAt||nowIso(),
    lastSeenAt:nowIso()
  };
  const pos=devices.findIndex(d=>d.id===id);
  if(pos>=0)devices[pos]=entry;else devices.unshift(entry);
  auth.accounts[idx].devices=devices.slice(0,8);
  auth.accounts[idx].rememberedDeviceId=id;
  auth.accounts[idx].updatedAt=nowIso();
  saveAuth(auth);
  try{localStorage.setItem(REMEMBER_KEY,account.id)}catch(_){}
  updateMainStoreAccount?.(auth.accounts[idx]);
  return auth.accounts[idx];
}
function touchRememberedDevice(account,{verified=false,method='password'}={}){
  if(!account?.id)return account;
  if(isRememberedDevice(account)||verified)return rememberDevice(account,{verified,method});
  return account;
}
function forgetCurrentDevice(account){
  if(!account?.id)return account;
  const auth=authState(),idx=auth.accounts.findIndex(a=>a.id===account.id);
  if(idx<0)return account;
  const id=currentDeviceId();
  auth.accounts[idx].devices=(auth.accounts[idx].devices||[]).filter(d=>d.id!==id);
  if(auth.accounts[idx].rememberedDeviceId===id)delete auth.accounts[idx].rememberedDeviceId;
  saveAuth(auth);
  try{if(rememberedAccountId()===account.id)localStorage.removeItem(REMEMBER_KEY)}catch(_){}
  updateMainStoreAccount?.(auth.accounts[idx]);
  return auth.accounts[idx];
}
function rememberedAccount(){
  const id=rememberedAccountId(),account=allAccounts().find(a=>a.id===id);
  return account&&isRememberedDevice(account)?account:null;
}

const isNative=()=>{try{return !!Capacitor?.isNativePlatform?.()}catch(_){return false}};
const biometricEnabled=a=>!!(a?.biometric?.native||a?.biometric?.credentialId);
const faceSetupRequested=a=>a?.biometric?.requestedKind==='face'||a?.biometric?.kind==='face';
const faceSetupCurrent=a=>!!(biometricEnabled(a)&&a?.biometric?.enrollmentVersion>=2&&a?.biometric?.requestedKind==='face');
const biometricAccessLabel=a=>'Biometría del teléfono';
const contactText=a=>a?.email||a?.phone||'Sin contacto';
const go=r=>{if(window.LJR_MAIN_ROUTE?.go)window.LJR_MAIN_ROUTE.go(r);else location.hash='#/'+r};
const takeReturnRoute=()=>{try{const r=String(localStorage.getItem(RETURN_KEY)||'').trim();localStorage.removeItem(RETURN_KEY);return /^[-a-zA-Z0-9_]+$/.test(r)?r:''}catch(_){return''}};

function toast(msg){
  let t=$('.v569-toast');if(t)t.remove();
  t=document.createElement('div');t.className='v569-toast';t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>t.remove(),2400);
}
function overlay(title,body,mode='loading'){
  $('.v569-overlay')?.remove();
  const el=document.createElement('div');el.className='v569-overlay';
  el.innerHTML='<div class="v569-overlay-card"><span class="v569-overlay-icon '+esc(mode)+'">'+(mode==='ok'?'✓':mode==='bio'?'◉':'')+'</span><h2>'+esc(title)+'</h2><p>'+esc(body)+'</p></div>';
  document.body.appendChild(el);return el;
}
function closeOverlay(){setTimeout(()=>$('.v569-overlay')?.remove(),260)}
function readAppStore(){return readJson(STORE_KEY,{})||{}}
function setAppUser(account){
  const st=readAppStore();
  st.user={
    id:account.id,uid:account.id,name:account.name,alias:account.alias,
    email:account.email||'',phone:account.phone||'',authProvider:'liga-local',
    avatar:account.avatar||'',avatarPreset:account.avatarPreset||'',
    photoURL:account.photoURL||'',picture:account.picture||'',
    shirtName:account.shirtName||'',shirtNumber:account.shirtNumber||'',
    biometric:biometricEnabled(account),trustedDevice:isRememberedDevice(account),deviceId:currentDeviceId()
  };
  writeJson(STORE_KEY,st);
  if(window.LJR_MAIN_ROUTE?.state)window.LJR_MAIN_ROUTE.state.user=st.user;
  const auth=authState();auth.currentId=account.id;saveAuth(auth);
  try{dispatchEvent(new CustomEvent('ljr:profile-updated',{detail:{accountId:account.id,signedIn:true}}))}catch(_){}
}
function clearAppUser(){
  const st=readAppStore();st.user=null;writeJson(STORE_KEY,st);
  if(window.LJR_MAIN_ROUTE?.state)window.LJR_MAIN_ROUTE.state.user=null;
  const auth=authState();auth.currentId=null;saveAuth(auth);
  try{dispatchEvent(new CustomEvent('ljr:profile-updated',{detail:{signedIn:false}}))}catch(_){}
}
async function pbkdf2(password,salt){
  if(!crypto?.subtle)throw new Error('WebCrypto no disponible');
  const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:b64ToBytes(salt),iterations:125000},material,256);
  return bytesToB64(bits);
}
async function newPasswordRecord(password){
  const salt=bytesToB64(randomBytes(16));
  return {salt,hash:await pbkdf2(password,salt),iterations:125000};
}
async function passwordOk(account,password){
  if(!account?.password?.salt||!account?.password?.hash)return false;
  return (await pbkdf2(password,account.password.salt))===account.password.hash;
}
function aliasExists(alias,exceptId=''){
  const key=cleanAlias(alias);
  return allAccounts().some(a=>a.id!==exceptId&&cleanAlias(a.alias)===key);
}
function contactExists(email,phone,exceptId=''){
  const e=normalizeEmail(email),p=normalizePhone(phone);
  return allAccounts().some(a=>a.id!==exceptId&&((e&&normalizeEmail(a.email)===e)||(p&&normalizePhone(a.phone)===p)));
}
function uniqueAlias(base,exceptId=''){
  let a=cleanAlias(base)||'aficionado';
  if(a.length<3)a=(a+'liga').slice(0,12);
  if(!aliasExists(a,exceptId))return a;
  for(let i=2;i<100;i++){
    const suffix=String(i),next=(a.slice(0,24-suffix.length)+suffix).slice(0,24);
    if(!aliasExists(next,exceptId))return next;
  }
  return (a.slice(0,18)+Date.now().toString().slice(-5)).slice(0,24);
}
function aliasParts(name){
  return String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[^a-z0-9 ]+/g,' ').trim().split(/\s+/).filter(Boolean);
}
function aliasBaseFromName(name,variant=0){
  const p=aliasParts(name);
  if(!p.length)return '';
  const first=p[0],last=p.length>1?p[p.length-1]:'';
  const middle=p.length>2?p[1]:'';
  const choices=[
    first+last,
    last?first+'.'+last:first,
    last?first+last.charAt(0):first,
    last?first.charAt(0)+last:first,
    middle?first+middle:first,
    last?last+'.'+first:last||first
  ].map(cleanAlias).filter(Boolean);
  return choices[Math.abs(Number(variant)||0)%choices.length]||first;
}
function generateAlias(name,phone,email,exceptId='',variant=0){
  const fromName=aliasBaseFromName(name,variant);
  const fromEmail=cleanAlias(normalizeEmail(email).split('@')[0]||'');
  return uniqueAlias(fromName||fromEmail||'aficionado',exceptId);
}
function fillSuggestedAlias(root,force=false){
  if(!root)return '';
  const alias=$('[data-v569-alias]',root),name=$('[data-v569-name]',root);
  if(!alias||!name)return '';
  if(!force&&alias.dataset.v569AliasManual==='1')return alias.value;
  const variant=Number(alias.dataset.v569AliasVariant||0);
  const value=generateAlias(name.value,$('[data-v569-phone]',root)?.value,$('[data-v569-email]',root)?.value,'',variant);
  if(name.value.trim().length<2){if(!alias.dataset.v569AliasManual)alias.value='';return ''}
  alias.value=value;
  alias.dataset.v569AliasSuggested='1';
  return value;
}
function findAccount(identifier){
  const raw=String(identifier||'').trim(),alias=cleanAlias(raw),email=normalizeEmail(raw),phone=normalizePhone(raw);
  return allAccounts().find(a=>cleanAlias(a.alias)===alias||(email&&normalizeEmail(a.email)===email)||(phone&&normalizePhone(a.phone)===phone))||null;
}
function generatedPassword(){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$';
  let out='';const a=randomBytes(12);for(let i=0;i<12;i++)out+=chars[a[i]%chars.length];return out;
}
async function platformAuthAvailable(){
  try{
    if(isNative()){
      const r=await nativeBiometric.isAvailable();
      return !!r?.available;
    }
    return !!(window.PublicKeyCredential&&navigator.credentials&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
  }catch(_){return false}
}
async function enrollBiometric(account,kind='biometric'){
  if(!(await platformAuthAvailable()))throw new Error('Este dispositivo no ofrece biometría compatible');
  const wantsFace=kind==='face';
  overlay(wantsFace?'Configurando acceso facial…':'Verificando dispositivo…',wantsFace?'Mira al teléfono y confirma con el método seguro disponible.':'Confirma en el teléfono con huella, rostro o bloqueo seguro.','bio');

  if(isNative()){
    const result=await nativeBiometric.verify({
      title:'Liga Juventino',
      subtitle:wantsFace?'Rostro / Face ID':'Confirma tu identidad',
      description:wantsFace?'Usa el reconocimiento facial del teléfono si está disponible.':'Usa la biometría del teléfono para activar el acceso.'
    });
    if(!result?.verified)throw new Error('No se pudo verificar la biometría');
    const auth=authState(),idx=auth.accounts.findIndex(a=>a.id===account.id);
    if(idx<0)throw new Error('Cuenta no encontrada');
    auth.accounts[idx].biometric={native:true,kind:'biometric',requestedKind:wantsFace?'face':'biometric',enrollmentVersion:2,confirmedAt:nowIso(),enabledAt:nowIso(),device:deviceName()};
    saveAuth(auth);
    const trusted=rememberDevice(auth.accounts[idx],{verified:true,method:'biometric'});setAppUser(trusted);
    overlay('Identidad confirmada',wantsFace?'El teléfono confirmó un acceso biométrico. Android/Chrome decide si usa rostro, huella o PIN; la app no guarda una foto de tu cara.':'La biometría quedó activada para esta cuenta.','ok');closeOverlay();
    return trusted;
  }

  const challenge=randomBytes(32),userId=account.biometric?.userHandle?b64ToBytes(account.biometric.userHandle):randomBytes(32);
  const cred=await navigator.credentials.create({publicKey:{
    challenge,
    rp:{name:'Liga Juventino'},
    user:{id:userId,name:account.alias,displayName:account.name||account.alias},
    pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
    timeout:60000,
    authenticatorSelection:{authenticatorAttachment:'platform',residentKey:'preferred',userVerification:'required'},
    attestation:'none',
    excludeCredentials:account.biometric?.credentialId?[{type:'public-key',id:b64ToBytes(account.biometric.credentialId),transports:['internal']}]:[]
  }});
  if(!cred)throw new Error('No se creó la credencial biométrica');
  const auth=authState(),idx=auth.accounts.findIndex(a=>a.id===account.id);
  if(idx<0)throw new Error('Cuenta no encontrada');
  auth.accounts[idx].biometric={credentialId:bytesToB64(cred.rawId),userHandle:bytesToB64(userId),kind:'biometric',requestedKind:wantsFace?'face':'biometric',enrollmentVersion:2,confirmedAt:nowIso(),enabledAt:nowIso(),device:deviceName()};
  saveAuth(auth);
  const trusted=rememberDevice(auth.accounts[idx],{verified:true,method:'biometric'});setAppUser(trusted);
  overlay('Identidad confirmada',wantsFace?'El teléfono confirmó un acceso biométrico. Android/Chrome decide si usa rostro, huella o PIN; la app no guarda una foto de tu cara.':'La biometría quedó activada para esta cuenta.','ok');closeOverlay();
  return trusted;
}
async function saveVisualFaceScan(account,result){
  if(!account||!result?.ok)throw new Error('Escaneo facial no completado');
  const auth=authState(),idx=auth.accounts.findIndex(a=>a.id===account.id);
  if(idx<0)throw new Error('Cuenta no encontrada');
  auth.accounts[idx].faceScan={
    completedAt:result.completedAt||nowIso(),
    engine:String(result.engine||'camera-face-detector'),
    storesImage:false
  };
  saveAuth(auth);
  updateMainStoreAccount(auth.accounts[idx]);
  setAppUser(auth.accounts[idx]);
  return auth.accounts[idx];
}

async function configureFaceAccess(account){
  if(!account)throw new Error('Cuenta no encontrada');
  // If an older platform credential already exists, do not try to create a duplicate
  // credential (which can return "already registered"). Re-verify it and upgrade
  // only the app-side state. Android/Chrome still chooses face, fingerprint or PIN.
  if(biometricEnabled(account)){
    const verified=await verifyBiometric(account);
    const auth=authState(),pos=auth.accounts.findIndex(a=>a.id===verified.id);
    if(pos<0)throw new Error('Cuenta no encontrada');
    auth.accounts[pos].biometric={
      ...(auth.accounts[pos].biometric||{}),
      kind:'biometric',
      requestedKind:'face',
      enrollmentVersion:2,
      confirmedAt:nowIso(),
      enabledAt:auth.accounts[pos].biometric?.enabledAt||nowIso(),
      device:auth.accounts[pos].biometric?.device||deviceName()
    };
    saveAuth(auth);updateMainStoreAccount(auth.accounts[pos]);setAppUser(auth.accounts[pos]);
    toast('Acceso facial solicitado y credencial del dispositivo confirmada');
    return auth.accounts[pos];
  }
  return enrollBiometric(account,'face');
}

async function verifyBiometric(account){
  if(!biometricEnabled(account))throw new Error('Esta cuenta no tiene biometría activada');
  overlay('Confirma tu identidad','Usa la seguridad biométrica del teléfono para verificar que eres tú.','bio');

  if(account.biometric?.native&&isNative()){
    const result=await nativeBiometric.verify({
      title:'Liga Juventino',
      subtitle:'Confirma tu identidad',
      description:'Accede a tu cuenta con la biometría del dispositivo.'
    });
    if(!result?.verified)throw new Error('No se pudo verificar el dispositivo');
  }else{
    const result=await navigator.credentials.get({publicKey:{
      challenge:randomBytes(32),
      allowCredentials:[{type:'public-key',id:b64ToBytes(account.biometric.credentialId),transports:['internal']}],
      timeout:60000,userVerification:'required'
    }});
    if(!result)throw new Error('No se pudo verificar el dispositivo');
  }

  const auth=authState(),idx=auth.accounts.findIndex(a=>a.id===account.id);
  let active=account;
  if(idx>=0){
    auth.accounts[idx].lastLoginAt=nowIso();
    auth.accounts[idx].biometric={...(auth.accounts[idx].biometric||{}),lastVerifiedAt:nowIso()};
    saveAuth(auth);
    active=rememberDevice(auth.accounts[idx],{verified:true,method:'biometric'});
    setAppUser(active);
  }
  overlay('Prueba biométrica correcta','El teléfono aceptó una verificación biométrica. Android/Chrome no informa a la página si fue rostro o huella.','ok');closeOverlay();
  return active;
}
function header(kicker,title,sub){
  return '<header class="v569-page-head"><small>'+esc(kicker)+'</small><h1>'+esc(title)+'</h1><p>'+esc(sub)+'</p></header>';
}
function field(label,input){return '<label class="v569-field"><span>'+esc(label)+'</span>'+input+'</label>'}
function input(type,attr,placeholder,value='',extra=''){
  return '<input type="'+esc(type)+'" '+attr+' placeholder="'+esc(placeholder)+'" value="'+esc(value)+'" '+extra+'>';
}

function guestProfileCardMarkup(){
  return '<div class="v12-profile-copy"><h1>Más de la Liga</h1><p>Crea tu cuenta y disfruta de un acceso inigualable a resultados, estadísticas, calendarios, equipos de la liga y mucho más.</p></div>'+
    '<div class="v12-profile-actions"><button class="outline" data-v12-action="login">Iniciar sesión</button><button class="solid" data-v12-action="create">Crear una cuenta</button></div>';
}
function profileRegisterMarkup(){
  return '<section class="v569-inline-auth" data-v569-page="register" data-method="phone">'+
    '<div class="v569-inline-head"><div><div class="v575-auth-badge">SEGURO · LIGA JUVENTINO</div><h2>Crear una cuenta</h2><p>Configura tu perfil en segundos. Tu alias se propone con tu nombre y puedes cambiarlo cuando quieras.</p></div></div>'+
    '<div class="v569-methods"><button type="button" class="active" data-v569-method="phone"><span>📱</span> Teléfono</button><button type="button" data-v569-method="email"><span>✉</span> Gmail / correo</button></div>'+
    '<div class="v569-form">'+
      field('NOMBRE',input('text','data-v569-name','Tu nombre','','autocomplete="name"'))+
      field('ALIAS DEL PERFIL','<div class="v569-inline">'+input('text','data-v569-alias','Se crea con tu nombre')+'<button type="button" data-v569-generate-alias><span>↻</span> Otro</button></div><small>La app te propone un alias usando tu nombre. Si no te gusta, toca “Otro” o escribe el que quieras.</small>')+
      '<div data-v569-phone-wrap>'+field('NÚMERO TELEFÓNICO (opcional si usas correo)',input('tel','data-v569-phone','Ej. 461 123 4567','','inputmode="tel" autocomplete="tel"'))+'</div>'+
      '<div data-v569-email-wrap>'+field('GMAIL / CORREO (opcional si usas teléfono)',input('email','data-v569-email','nombre@gmail.com','','autocomplete="email"'))+'</div>'+
      field('CONTRASEÑA','<div class="v569-inline">'+input('password','data-v569-password','Mínimo 8 caracteres','','autocomplete="new-password"')+'<button type="button" data-v569-generate-password><span>✦</span> Generar</button></div>')+
      field('CONFIRMAR CONTRASEÑA',input('password','data-v569-confirm','Repite la contraseña','','autocomplete="new-password"'))+
      '<label class="v569-check"><input type="checkbox" data-v569-face><i></i><span><b>Configurar rostro / Face ID después de crear la cuenta</b><small>Android/Chrome abrirá la seguridad del teléfono. La app no toma ni guarda una foto de tu cara.</small></span></label>'+      '<label class="v569-check"><input type="checkbox" data-v569-bio><i></i><span><b>Usar huella / biometría</b><small>Activa el acceso rápido con la seguridad biométrica del dispositivo.</small></span></label>'+      '<label class="v569-check v577-remember-device"><input type="checkbox" data-v569-remember-device checked><i></i><span><b>Recordar este dispositivo</b><small>Vincula esta instalación con tu perfil para reconocerla en próximos accesos.</small></span></label>'+
      '<label class="v569-check"><input type="checkbox" data-v569-terms checked><i></i><span><b>Guardar esta cuenta en este dispositivo</b><small>Tu contraseña se protege con derivación criptográfica; la app no guarda tu rostro ni tu huella.</small></span></label>'+
    '</div>'+
    '<button class="v569-primary v575-create-account" type="button" data-v569-register><span>Crear mi cuenta</span><i aria-hidden="true">➜</i></button>'+
    '<button class="v569-link" type="button" data-v569-profile-mode="login">Ya tengo cuenta · Iniciar sesión</button>'+
  '</section>';
}
function profileLoginMarkup(){
  const bio=allAccounts().some(biometricEnabled),known=rememberedAccount();
  return '<section class="v569-inline-auth" data-v569-page="login">'+
    '<div class="v569-inline-head"><div><small>CUENTA LIGA JUVENTINO</small><h2>Iniciar sesión</h2><p>Entra aquí mismo con alias, teléfono o Gmail/correo.</p></div></div>'+
    (known?'<div class="v577-known-device"><span>✓</span><div><b>Dispositivo reconocido</b><small>Vinculado con @'+esc(known.alias)+'</small></div></div>':'')+
    '<div class="v569-form">'+
      field('ALIAS, TELÉFONO O GMAIL',input('text','data-v569-login-id','@alias, teléfono o correo',known?.alias||'','autocomplete="username"'))+
      field('CONTRASEÑA',input('password','data-v569-login-password','Tu contraseña','','autocomplete="current-password"'))+
      '<label class="v569-check v577-remember-device"><input type="checkbox" data-v569-remember-device checked><i></i><span><b>Recordar este dispositivo</b><small>La app reconocerá esta instalación como un dispositivo habitual de tu perfil.</small></span></label>'+
    '</div>'+
    '<button class="v569-primary" type="button" data-v569-login>Entrar</button>'+
    (bio?'<button class="v569-secondary bio" type="button" data-v569-login-bio>◉ Entrar con rostro / huella</button>':'')+
    '<button class="v569-link" type="button" data-v569-profile-mode="register">Crear una cuenta</button>'+
  '</section>';
}
function profileSuccessMarkup(account){
  return '<section class="v569-inline-auth v569-inline-success" data-v569-page="success">'+
    '<div class="v569-success-mark">✓</div><small>CUENTA CREADA</small><h2>'+esc(account.name||account.alias)+'</h2>'+
    '<p>Tu cuenta quedó lista y permanece dentro de la sección Perfil.</p>'+
    '<div class="v569-success-data"><span><small>ALIAS</small><b>@'+esc(account.alias)+'</b></span><span><small>CONTACTO</small><b>'+esc(contactText(account))+'</b></span><span><small>SEGURIDAD</small><b>'+(biometricEnabled(account)?biometricAccessLabel(account)+' activado':'Contraseña activa')+'</b></span><span><small>DISPOSITIVO</small><b>'+(isRememberedDevice(account)?'✓ Este dispositivo quedó recordado':'No recordado')+'</b></span></div>'+
    '<button class="v569-primary" type="button" data-v569-profile-finish>Ver mi perfil</button>'+
    '<button class="v569-secondary" type="button" data-v569-admin-link>Acceder a administración verificada</button>'+
    '<small>El cargo y los permisos se comprueban en el servidor. El teléfono y el correo no dan privilegios automáticamente.</small>'+
    '<button class="v569-secondary" type="button" data-v569-copy-alias>Copiar alias</button>'+
  '</section>';
}
function profileRoot(){return route()==='profile'?$('[data-v12-profile]'):null}
function openProfileMode(mode){
  const root=profileRoot(),card=root?.querySelector('.v12-profile-card');
  if(!root||!card)return false;
  root.classList.add('v569-auth-inline-active');
  card.removeAttribute('data-v569-owned');
  card.dataset.v569Inline=mode;
  card.innerHTML=mode==='login'?profileLoginMarkup():profileRegisterMarkup();
  const page=$('[data-v569-page]',card);
  if(page&&mode==='register'){
    page.dataset.method='phone';
    const alias=$('[data-v569-alias]',page);
    if(alias){alias.dataset.v569AliasManual='0';alias.dataset.v569AliasVariant='0'}
  }
  card.scrollIntoView({behavior:'smooth',block:'start'});
  return true;
}
function restoreGuestProfile(){
  const root=profileRoot(),card=root?.querySelector('.v12-profile-card');
  if(!root||!card)return;
  root.classList.remove('v569-auth-inline-active');
  card.removeAttribute('data-v569-inline');
  card.removeAttribute('data-v569-owned');
  card.innerHTML=guestProfileCardMarkup();
}
function renderLoggedProfile(account=currentAccount()){
  const root=profileRoot(),card=root?.querySelector('.v12-profile-card');
  if(!root||!card||!account)return false;
  root.classList.remove('v569-auth-inline-active');
  card.removeAttribute('data-v569-inline');
  card.dataset.v569Owned='1';
  card.innerHTML=loggedProfileMarkup(account);
  if(!card.querySelector('[data-v569-admin-link]')){
    const adminBtn=document.createElement('button');
    adminBtn.type='button';adminBtn.className='v569-secondary';
    adminBtn.dataset.v569AdminLink='';adminBtn.textContent='Administración de la Liga · acceso verificado';
    card.append(adminBtn);
  }
  enhanceProfile();
  return true;
}
function openRegister(){
  if(route()==='profile'&&openProfileMode('register'))return;
  go('accountRegister');
}
function openLogin(){
  if(route()==='profile'&&openProfileMode('login'))return;
  go('accountLogin');
}

/* V1150 — Controles locales de cuenta: exportación sin secretos y datos de actividad real. */
function privacyPageMarkup(a){
  const lastSeen=Array.isArray(a.devices)?a.devices.find(d=>d.id===currentDeviceId())?.lastSeenAt:'';
  const line=(label,value)=>'<div><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>';
  return '<section class="v569-page v1150-privacy-page" data-v569-page="privacy">'+
    header('MI CUENTA','Datos y privacidad','Consulta tu actividad local y descarga una copia de tu perfil.')+
    '<section class="v569-card v1150-privacy-card">'+
      '<div class="v1150-privacy-banner"><span aria-hidden="true">✓</span><div><b>Control de tus datos</b><small>Estos datos pertenecen a la instalación actual. No equivalen a sesiones sincronizadas en internet.</small></div></div>'+
      '<h2>Actividad de la cuenta</h2>'+
      '<dl class="v1150-privacy-details">'+
        line('Cuenta creada',a.createdAt?fmtDate(a.createdAt):'No disponible')+
        line('Último inicio de sesión',a.lastLoginAt?fmtDate(a.lastLoginAt):'Sin registros')+
        line('Última actividad del dispositivo',lastSeen?fmtDate(lastSeen):'Sin registros')+
        line('Biometría',biometricEnabled(a)?'Configurada en este dispositivo':'No configurada')+
      '</dl>'+
      '<h2>Mis datos</h2>'+
      '<p class="v1150-privacy-description">Puedes descargar tu nombre, alias, datos de contacto, personalización y fechas de actividad. El archivo no incluye contraseñas, hashes ni credenciales biométricas.</p>'+
      '<div class="v1150-privacy-actions">'+
        '<button type="button" class="v569-primary" data-v1150-export-profile>↓ Descargar mis datos (JSON)</button>'+
        '<button type="button" class="v569-secondary" data-v1150-copy-alias>Copiar mi alias</button>'+
        '<button type="button" class="v569-secondary" data-v569-route="accountDevices">Revisar dispositivos</button>'+
        '<button type="button" class="v569-secondary" data-v569-route="notifications">Ajustar notificaciones</button>'+
      '</div>'+
      '<p class="v569-note">Privacidad: tu perfil y contraseñas se gestionan en el almacenamiento de este navegador o app. Para iniciar sesión en varios teléfonos con sesiones revocables hace falta un servicio de cuentas en un servidor.</p>'+
    '</section></section>';
}
function exportLocalProfile(a){
  if(!a)return toast('Primero inicia sesión');
  try{
    const fields=['name','alias','email','phone','avatarPreset','shirtName','shirtNumber','shirtColor','shirtTeam','shirtCategory','createdAt','updatedAt','lastLoginAt'];
    const profile={};fields.forEach(k=>{if(a[k]!==undefined)profile[k]=a[k]});
    const devices=(Array.isArray(a.devices)?a.devices:[]).map(d=>({
      name:d.label||d.name||'Dispositivo',trusted:!!d.trusted,verified:!!d.verified,
      firstSeenAt:d.firstSeenAt||null,lastSeenAt:d.lastSeenAt||null
    }));
    const data={format:'liga-juventino-profile-v1',exportedAt:nowIso(),
      scope:'Copia de información local; no incluye datos de otros navegadores ni secretos.',
      profile,devices};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;link.download='liga-perfil-'+(cleanAlias(a.alias)||'cuenta')+'.json';
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),15000);
    toast('Copia de datos preparada');
  }catch(_){toast('No se pudo descargar. Revisa los permisos del navegador.')}
}

function authShell(kind){
  const a=currentAccount();
  if(kind==='accountRegister'){
    return '<section class="v569-page" data-v569-page="register">'+
      header('CUENTA LIGA JUVENTINO','Crear una cuenta','Regístrate con número telefónico o Gmail/correo y elige tu alias de perfil.')+
      '<section class="v569-card">'+
        '<div class="v569-methods"><button type="button" class="active" data-v569-method="phone"><span>📱</span> Teléfono</button><button type="button" data-v569-method="email"><span>✉</span> Gmail / correo</button></div>'+
        '<div class="v569-form">'+
          field('NOMBRE',input('text','data-v569-name','Tu nombre','','autocomplete="name"'))+
          field('ALIAS DEL PERFIL','<div class="v569-inline">'+input('text','data-v569-alias','Se crea con tu nombre')+'<button type="button" data-v569-generate-alias><span>↻</span> Otro</button></div><small>La app te propone un alias usando tu nombre. Si no te gusta, toca “Otro” o escribe el que quieras.</small>')+
          '<div data-v569-phone-wrap>'+field('NÚMERO TELEFÓNICO (opcional si usas correo)',input('tel','data-v569-phone','Ej. 461 123 4567','','inputmode="tel" autocomplete="tel"'))+'</div>'+
          '<div data-v569-email-wrap>'+field('GMAIL / CORREO (opcional si usas teléfono)',input('email','data-v569-email','nombre@gmail.com','','autocomplete="email"'))+'</div>'+
          field('CONTRASEÑA','<div class="v569-inline">'+input('password','data-v569-password','Mínimo 8 caracteres','','autocomplete="new-password"')+'<button type="button" data-v569-generate-password><span>✦</span> Generar</button></div>')+
          field('CONFIRMAR CONTRASEÑA',input('password','data-v569-confirm','Repite la contraseña','','autocomplete="new-password"'))+
          '<label class="v569-check"><input type="checkbox" data-v569-face><i></i><span><b>Configurar rostro / Face ID después de crear la cuenta</b><small>La verificación la hace la seguridad del teléfono; la app no guarda tu rostro.</small></span></label>'+          '<label class="v569-check"><input type="checkbox" data-v569-bio><i></i><span><b>Activar huella / biometría</b><small>También puedes usar huella o el método biométrico seguro del dispositivo.</small></span></label>'+          '<label class="v569-check v577-remember-device"><input type="checkbox" data-v569-remember-device checked><i></i><span><b>Recordar este dispositivo</b><small>Vincula esta instalación con tu perfil para reconocerla en próximos accesos.</small></span></label>'+
          '<label class="v569-check"><input type="checkbox" data-v569-terms checked><i></i><span><b>Acepto guardar esta cuenta en este dispositivo</b><small>Los datos de acceso se almacenan localmente en la app.</small></span></label>'+
        '</div>'+
        '<button class="v569-primary" type="button" data-v569-register>Crear cuenta</button>'+
        '<button class="v569-link" type="button" data-v569-route="accountLogin">Ya tengo cuenta · Iniciar sesión</button>'+
      '</section>'+
    '</section>';
  }
  if(kind==='accountLogin'){
    const bio=allAccounts().some(biometricEnabled),known=rememberedAccount();
    return '<section class="v569-page" data-v569-page="login">'+
      header('CUENTA LIGA JUVENTINO','Iniciar sesión','Entra con tu alias, número telefónico o Gmail/correo.')+
      '<section class="v569-card">'+(known?'<div class="v577-known-device"><span>✓</span><div><b>Dispositivo reconocido</b><small>Vinculado con @'+esc(known.alias)+'</small></div></div>':'')+
      '<div class="v569-form">'+
        field('ALIAS, TELÉFONO O GMAIL',input('text','data-v569-login-id','@alias, teléfono o correo',known?.alias||'','autocomplete="username"'))+
        field('CONTRASEÑA',input('password','data-v569-login-password','Tu contraseña','','autocomplete="current-password"'))+
        '<label class="v569-check v577-remember-device"><input type="checkbox" data-v569-remember-device checked><i></i><span><b>Recordar este dispositivo</b><small>La app reconocerá esta instalación como un dispositivo habitual de tu perfil.</small></span></label>'+
      '</div>'+
      '<button class="v569-primary" type="button" data-v569-login>Entrar</button>'+
      (bio?'<button class="v569-secondary bio" type="button" data-v569-login-bio>◉ Entrar con rostro / huella</button>':'')+
      '<button class="v569-link" type="button" data-v569-route="accountRegister">Crear una cuenta</button>'+
      '</section></section>';
  }
  if(kind==='accountEdit'){
    if(!a)return authShell('accountLogin');
    return '<section class="v569-page" data-v569-page="edit">'+
      header('MI PERFIL','Editar perfil','Cambia tu nombre, alias o datos de contacto.')+
      '<section class="v569-card"><div class="v569-form">'+
        field('NOMBRE',input('text','data-v569-edit-name','Tu nombre',a.name||'','autocomplete="name"'))+
        field('ALIAS',input('text','data-v569-edit-alias','Alias',a.alias||''))+
        field('TELÉFONO',input('tel','data-v569-edit-phone','Número telefónico',a.phone||'','inputmode="tel" autocomplete="tel"'))+
        field('GMAIL / CORREO',input('email','data-v569-edit-email','nombre@gmail.com',a.email||'','autocomplete="email"'))+
      '</div><button class="v569-primary" type="button" data-v569-save-profile>Guardar cambios</button></section></section>';
  }
  if(kind==='accountSecurity'){
    if(!a)return authShell('accountLogin');
    const enabled=biometricEnabled(a),faceRequested=faceSetupRequested(a);
    const lastVerified=a.biometric?.lastVerifiedAt||'';
    const faceScanAt=a.faceScan?.completedAt||'',faceScanDone=!!faceScanAt;
    return '<section class="v569-page" data-v569-page="security">'+
      header('SEGURIDAD','Rostro, huella y biometría','Primero comprueba la cámara con un escaneo visual. Después prueba la biometría segura del teléfono.')+
      '<section class="v569-card">'+
        '<div class="v806-scan-row '+(faceScanDone?'done':'')+'"><span>📷</span><div><b>'+(faceScanDone?'Rostro detectado por la cámara':'Escaneo visual de rostro pendiente')+'</b><small>'+(faceScanDone?'Escaneo completado '+esc(fmtDate(faceScanAt))+' · no se guardó ninguna foto.':'Abre la cámara frontal y mantén tu cara centrada dentro del óvalo.')+'</small></div></div>'+
        '<button class="v569-primary" type="button" data-v806-face-scan>📷 '+(faceScanDone?'Volver a escanear rostro':'Escanear rostro con cámara')+'</button>'+
        '<div class="v569-security-state '+(enabled?'on':'off')+'"><span>◉</span><div><b>'+(enabled?'Biometría vinculada':'Biometría no vinculada')+'</b><small>'+(enabled?esc(a.biometric.device||deviceName())+(lastVerified?' · última prueba '+esc(fmtDate(lastVerified)):' · todavía sin prueba confirmada'):'Después del escaneo visual puedes vincular la biometría segura del teléfono.')+'</small></div></div>'+
        '<div class="v803-face-state '+(lastVerified?'ready':faceRequested?'legacy':'pending')+'"><span>🙂</span><div><b>'+(lastVerified?'Biometría probada correctamente':faceRequested?'Acceso facial solicitado, falta probarlo':'Acceso biométrico no confirmado')+'</b><small>'+(lastVerified?'El teléfono aceptó una biometría. Android/Chrome no informa si fue cara o huella.':faceRequested?'El escaneo de cámara y Face ID son pasos distintos. Usa “Probar biometría ahora” para comprobar la seguridad del teléfono.':'El escaneo de cámara sólo comprueba que detecta un rostro; la autenticación real la controla Android/iPhone.')+'</small></div></div>'+
        (!enabled?'<button class="v569-primary" type="button" data-v569-enable-face>🙂 Configurar acceso biométrico</button>':'')+
        (enabled?'<button class="v569-primary v803-test-bio" type="button" data-v569-test-bio>✓ Probar biometría ahora</button>':'')+
        (enabled?'<button class="v569-danger" type="button" data-v569-disable-bio>Desactivar biometría</button>':'<button class="v569-secondary bio" type="button" data-v569-enable-bio>◉ Activar huella / biometría</button>')+
        '<div class="v803-face-steps"><b>Cómo comprobarlo</b><span>1. Toca “Escanear rostro con cámara” y centra tu cara.</span><span>2. Cuando marque “Rostro detectado”, la cámara y el detector ya funcionan.</span><span>3. Después configura y prueba la biometría del teléfono para el acceso seguro.</span></div>'+
        '<p class="v569-note"><b>Privacidad:</b> el escaneo visual no guarda foto ni video. Tampoco identifica quién eres; sólo confirma que hay un rostro centrado. Face ID/Android Biometrics sigue siendo responsabilidad del sistema del teléfono.</p>'+
      '</section></section>';
  }
  if(kind==='accountPrivacy'){
    if(!a)return authShell('accountLogin');
    return privacyPageMarkup(a);
  }
  if(['accountPreferences','accountAdvisor','accountCloud'].includes(kind)){
    if(!a)return authShell('accountLogin');
    const titles={accountPreferences:['MI CUENTA','Preferencias','Ajustes personales y accesibilidad.'],accountAdvisor:['HERRAMIENTAS','Asistente local','Revisiones automáticas sin enviar datos privados.'],accountCloud:['MI CUENTA','Cuenta en la nube','Sincroniza tu personalización cuando exista un servidor autorizado.']};
    const headerData=titles[kind];
    return '<section class="v569-page" data-v569-page="'+kind+'" data-v1300-panel="'+kind+'">'+
      header(...headerData)+'<section data-v1300-content></section></section>';
  }
  if(kind==='accountPassword'){
    if(!a)return authShell('accountLogin');
    return '<section class="v569-page" data-v569-page="password">'+
      header('SEGURIDAD','Cambiar contraseña','Confirma tu contraseña actual antes de crear una nueva.')+
      '<section class="v569-card"><div class="v569-form">'+
        field('CONTRASEÑA ACTUAL',input('password','data-v569-old-pass','Contraseña actual','','autocomplete="current-password"'))+
        field('NUEVA CONTRASEÑA',input('password','data-v569-new-pass','Mínimo 8 caracteres','','autocomplete="new-password"'))+
        field('CONFIRMAR NUEVA CONTRASEÑA',input('password','data-v569-new-confirm','Repite la nueva contraseña','','autocomplete="new-password"'))+
      '</div><button class="v569-primary" type="button" data-v569-change-pass>✓ Cambiar contraseña</button></section></section>';
  }
  if(kind==='accountDevices'){
    if(!a)return authShell('accountLogin');
    const currentId=currentDeviceId(),devices=Array.isArray(a.devices)?a.devices:[];
    return '<section class="v569-page" data-v569-page="devices">'+
      header('MI CUENTA','Dispositivos','Revisa qué instalación está recordada para este perfil.')+
      '<section class="v569-card">'+
        '<div class="v577-device-summary '+(isRememberedDevice(a)?'trusted':'')+'"><span>'+(isRememberedDevice(a)?'✓':'!')+'</span><div><b>'+(isRememberedDevice(a)?'Este dispositivo está recordado':'Este dispositivo no está recordado')+'</b><small>ID del dispositivo · '+esc(currentId.slice(0,8).toUpperCase())+'</small></div></div>'+
        '<div class="v569-devices">'+(devices.length?devices.map(d=>'<article class="'+(d.id===currentId?'current':'')+'"><span>📱</span><div><b>'+esc(d.label||d.name||'Dispositivo')+(d.id===currentId?' · Este dispositivo':'')+'</b><small>'+(d.trusted?'Recordado':'No recordado')+(d.verified?' · Identidad verificada':'')+(d.lastSeenAt?' · '+esc(fmtDate(d.lastSeenAt)):'')+'</small><em>ID '+esc(String(d.id||'').slice(0,8).toUpperCase())+'</em></div><i>'+(d.trusted?'✓':'')+'</i></article>').join(''):'<p class="v569-note">Todavía no hay dispositivos recordados.</p>')+'</div>'+
        (isRememberedDevice(a)?'<button class="v569-danger" type="button" data-v577-forget-device>Olvidar este dispositivo</button>':'<button class="v569-primary" type="button" data-v577-remember-current>Recordar este dispositivo</button>')+
        '<p class="v569-note">Esta lista se registra en el almacenamiento local de la app. No muestra ni permite cerrar sesiones de otros teléfonos. La contraseña o biometría siguen siendo las pruebas de identidad.</p>'+
      '</section></section>';
  }
  return '';
}
function updateMainStoreAccount(updated){
  const st=readAppStore();if(st.user&&st.user.id===updated.id){
    st.user={...st.user,name:updated.name,alias:updated.alias,email:updated.email||'',phone:updated.phone||'',biometric:biometricEnabled(updated),trustedDevice:isRememberedDevice(updated),deviceId:currentDeviceId()};
    writeJson(STORE_KEY,st);if(window.LJR_MAIN_ROUTE?.state)window.LJR_MAIN_ROUTE.state.user=st.user;
  }
}
async function registerFromPage(root){
  const name=$('[data-v569-name]',root)?.value.trim()||'';
  const phone=normalizePhone($('[data-v569-phone]',root)?.value||'');
  const email=normalizeEmail($('[data-v569-email]',root)?.value||'');
  const method=root.dataset.method||'phone';
  const pass=$('[data-v569-password]',root)?.value||'',confirm=$('[data-v569-confirm]',root)?.value||'';
  if(name.length<2)return toast('Escribe tu nombre');
  if(method==='phone'&&phone.length<10)return toast('Escribe un número telefónico válido');
  if(method==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return toast('Escribe un Gmail o correo válido');
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return toast('El correo adicional no es válido');
  if(phone&&phone.length!==10)return toast('Escribe un teléfono de 10 dígitos');
  if(pass.length<8)return toast('La contraseña debe tener al menos 8 caracteres');
  if(pass!==confirm)return toast('Las contraseñas no coinciden');
  if(!$('[data-v569-terms]',root)?.checked)return toast('Acepta guardar la cuenta en este dispositivo');
  let alias=cleanAlias($('[data-v569-alias]',root)?.value||'');
  if(alias&&alias.length<3)return toast('El alias debe tener al menos 3 caracteres');
  if(alias&&aliasExists(alias))return toast('Ese alias ya está ocupado. Toca “Otro” o escribe uno diferente');
  alias=alias||generateAlias(name,phone,email);
  if(contactExists(email,phone))return toast('Ese teléfono o correo ya está registrado');
  const remember=$('[data-v569-remember-device]',root)?.checked!==false;
  const rec={id:randomId(),name,alias,phone,email,createdAt:nowIso(),updatedAt:nowIso(),lastLoginAt:nowIso(),password:await newPasswordRecord(pass),biometric:null,devices:[]};
  const auth=authState();auth.accounts.push(rec);auth.currentId=rec.id;saveAuth(auth);
  const active=remember?rememberDevice(rec,{verified:false,method:'registration'}):rec;setAppUser(active);
  const faceRequested=$('[data-v569-face]',root)?.checked===true;
  const bioRequested=$('[data-v569-bio]',root)?.checked===true;
  if(faceRequested||bioRequested){
    try{await enrollBiometric(rec,faceRequested?'face':'biometric')}catch(e){closeOverlay();toast(e?.name==='NotAllowedError'?'Cuenta creada · verificación biométrica cancelada':'Cuenta creada · '+(e?.message||'no se pudo activar el acceso rápido'))}
  }
  showCredentials(currentAccount()||rec);
}
function showCredentials(account){
  if(route()==='profile'){
    const root=profileRoot(),card=root?.querySelector('.v12-profile-card');
    if(card){
      root.classList.add('v569-auth-inline-active');
      card.removeAttribute('data-v569-owned');
      card.dataset.v569Inline='success';
      card.innerHTML=profileSuccessMarkup(account);
      card.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
  }
  $('.v569-credentials')?.remove();
  const el=document.createElement('div');el.className='v569-credentials';
  el.innerHTML='<section><header><span>🔑</span><h2>Cuenta creada</h2><button type="button" data-v569-close-creds>×</button></header><div class="v569-cred-body"><p>Guarda tu alias. Puedes iniciar sesión con el alias, teléfono o Gmail/correo registrado.</p><div><small>ALIAS</small><b>@'+esc(account.alias)+'</b></div><div><small>CONTACTO</small><b>'+esc(contactText(account))+'</b></div></div><footer><button type="button" data-v569-copy-alias>Copiar alias</button><button type="button" data-v569-admin-link>Administración verificada</button><button class="primary" type="button" data-v569-finish>Ir a mi perfil</button></footer></section>';
  document.body.appendChild(el);
  $('[data-v569-close-creds]',el).onclick=()=>{el.remove();go('profile')};
  $('[data-v569-finish]',el).onclick=()=>{el.remove();go('profile')};
  $('[data-v569-copy-alias]',el).onclick=async()=>{try{await navigator.clipboard.writeText(account.alias);toast('Alias copiado')}catch(_){toast('@'+account.alias)}};
}
async function loginFromPage(root){
  const id=$('[data-v569-login-id]',root)?.value||'',pass=$('[data-v569-login-password]',root)?.value||'';
  const account=findAccount(id);if(!account)return toast('No encontramos esa cuenta en este dispositivo');
  overlay('Verificando cuenta…','Comprobando tus datos de acceso.');
  try{
    if(!(await passwordOk(account,pass))){closeOverlay();return toast('Contraseña incorrecta')}
    const auth=authState(),idx=auth.accounts.findIndex(a=>a.id===account.id);auth.accounts[idx].lastLoginAt=nowIso();saveAuth(auth);
    const remember=$('[data-v569-remember-device]',root)?.checked!==false;
    const active=remember?rememberDevice(auth.accounts[idx],{verified:false,method:'password'}):touchRememberedDevice(auth.accounts[idx],{verified:false,method:'password'});
    setAppUser(active);
    const next=takeReturnRoute();
    overlay('Bienvenido','Sesión iniciada correctamente.','ok');closeOverlay();setTimeout(()=>{if(next)go(next);else if(route()==='profile')renderLoggedProfile(active);else go('profile')},300);
  }catch(e){closeOverlay();toast(e.message||'No se pudo iniciar sesión')}
}
async function biometricLogin(root){
  const id=$('[data-v569-login-id]',root)?.value||'';
  let account=id?findAccount(id):allAccounts().filter(biometricEnabled)[0];
  if(!biometricEnabled(account))return toast('Escribe el alias de una cuenta con biometría');
  try{const verified=await verifyBiometric(account),next=takeReturnRoute();setTimeout(()=>{if(next)go(next);else if(route()==='profile')renderLoggedProfile(verified);else go('profile')},300)}catch(e){closeOverlay();toast(e?.name==='NotAllowedError'?'Verificación cancelada':(e?.message||'No se pudo verificar'))}
}
async function saveProfile(root){
  const a=currentAccount();if(!a)return go('accountLogin');
  const name=$('[data-v569-edit-name]',root)?.value.trim()||'',email=normalizeEmail($('[data-v569-edit-email]',root)?.value||''),phone=normalizePhone($('[data-v569-edit-phone]',root)?.value||'');
  let alias=cleanAlias($('[data-v569-edit-alias]',root)?.value||'');
  if(name.length<2)return toast('Escribe tu nombre');
  if(alias.length<3)return toast('El alias debe tener al menos 3 caracteres');
  if(aliasExists(alias,a.id))return toast('Ese alias ya está ocupado');
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return toast('Correo no válido');
  if(phone&&phone.length<10)return toast('Teléfono no válido');
  if(contactExists(email,phone,a.id))return toast('Ese teléfono o correo ya está registrado');
  const auth=authState(),idx=auth.accounts.findIndex(x=>x.id===a.id);
  auth.accounts[idx]={...auth.accounts[idx],name,alias,email,phone,updatedAt:nowIso()};saveAuth(auth);updateMainStoreAccount(auth.accounts[idx]);toast('Perfil actualizado');setTimeout(()=>go('profile'),250);
}
async function changePassword(root){
  const a=currentAccount();if(!a)return go('accountLogin');
  const old=$('[data-v569-old-pass]',root)?.value||'',next=$('[data-v569-new-pass]',root)?.value||'',confirm=$('[data-v569-new-confirm]',root)?.value||'';
  if(!(await passwordOk(a,old)))return toast('La contraseña actual no es correcta');
  if(next.length<8)return toast('La nueva contraseña debe tener al menos 8 caracteres');
  if(next!==confirm)return toast('Las contraseñas nuevas no coinciden');
  const auth=authState(),idx=auth.accounts.findIndex(x=>x.id===a.id);auth.accounts[idx].password=await newPasswordRecord(next);auth.accounts[idx].updatedAt=nowIso();saveAuth(auth);
  toast('Contraseña actualizada');setTimeout(()=>go('profile'),300);
}
function logout(){
  overlay('Cerrando sesión…','Serás redirigido en un momento.');
  clearAppUser();setTimeout(()=>{closeOverlay();go('profile')},550);
}
function loggedProfileMarkup(a){
  const initial=esc((a.name||a.alias||'L').trim().charAt(0).toUpperCase());
  return '<div class="v569-profile-hero" data-v569-profile-hero>'+
    '<div class="v569-profile-avatar">'+initial+'</div>'+
    '<div class="v569-profile-copy"><small>MI CUENTA</small><h1>'+esc(a.name||a.alias)+'</h1><b>@'+esc(a.alias)+'</b><p>'+esc(contactText(a))+'</p></div>'+
    '<div class="v577-profile-security"><span class="v569-profile-bio '+(biometricEnabled(a)?'on':'')+'">'+(biometricEnabled(a)?'◉ '+esc(biometricAccessLabel(a)):'○ Sin biometría')+'</span><span class="v577-trusted '+(isRememberedDevice(a)?'on':'')+'">'+(isRememberedDevice(a)?'✓ Dispositivo reconocido':'○ Dispositivo no recordado')+'</span></div>'+
    '<div class="v569-profile-buttons"><button type="button" data-v569-route="accountEdit">Editar perfil</button><button type="button" data-v569-route="accountSecurity">Seguridad</button></div>'+
  '</div>';
}
function v569ProfileMenuIcon(type){
  const icons={
    password:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="15" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m11 12 8-8 2 2-2 2 1 1-2 2-1-1-2 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    devices:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.8" width="10" height="18.4" rx="2.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 6h4M11 18.2h2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    biometrics:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 5.3A6.4 6.4 0 0 1 18 10.7M6 8.1A6.4 6.4 0 0 0 6.2 16M9 3.7A8.8 8.8 0 0 1 20.2 15M4 11.2A8.8 8.8 0 0 0 8.6 20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M9.2 9.4a3.3 3.3 0 0 1 5.6 2.4c0 2.7-.7 5.3-2.2 7.6M9 13.2c.1 2-.3 3.7-1.2 5.2" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/></svg>',
    privacy:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 8 4v5c0 5.1-3.5 9-8 11-4.5-2-8-5.9-8-11V6l8-4Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    fingerprint:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 7.4A6 6 0 0 1 18 11.7M6.2 10.4A6 6 0 0 0 7 16.8M9.2 5A8.4 8.4 0 0 1 20.4 14M3.8 12.1A8.4 8.4 0 0 0 8.6 20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/><path d="M9.4 10.2a3.2 3.2 0 0 1 5.4 2.3c0 3-.8 5.7-2.2 7.6M9.2 14c0 1.8-.3 3.2-1 4.6" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/></svg>',
    logout:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  return icons[type]||'';
}
function v569ProfileAccountRow(icon,label,routeName){
  return '<button type="button" class="v569-profile-menu-row" data-v569-route="'+routeName+'"><span>'+v569ProfileMenuIcon(icon)+'</span><b>'+label+'</b><i>'+v569ProfileMenuIcon('chevron')+'</i></button>';
}
function v569EnsureLogoutLast(menu){
  if(!menu)return;
  let logout=menu.querySelector('[data-v569-logout]');
  if(!logout){
    logout=document.createElement('button');
    logout.type='button';
    logout.className='v12-profile-row v569-profile-logout-row logout';
    logout.dataset.v569Logout='';
    logout.innerHTML='<span class="v12-profile-row-icon" aria-hidden="true">'+v569ProfileMenuIcon('logout')+'</span><span class="v12-profile-row-label">Cerrar sesión</span><span class="v12-profile-row-chevron" aria-hidden="true">'+v569ProfileMenuIcon('chevron')+'</span>';
  }
  if(logout.parentElement!==menu||logout!==menu.lastElementChild)menu.append(logout);
}
function enhanceProfile(){
  if(route()!=='profile')return;
  const root=$('[data-v12-profile]');if(!root)return;
  const a=currentAccount();
  document.body.dataset.authState=a?'signed-in':'guest';
  if(a){
    const card=$('.v12-profile-card',root);
    if(card&&!card.matches('[data-v569-owned]')){card.dataset.v569Owned='1';card.innerHTML=loggedProfileMarkup(a)}
    let menu=$('.v12-profile-menu',root);
    if(menu&&!$('[data-v569-account-menu]',root)){
      const box=document.createElement('div');box.dataset.v569AccountMenu='';box.className='v569-profile-account-menu';
      box.innerHTML=
        v569ProfileAccountRow('password','Cambiar contraseña','accountPassword')+
        v569ProfileAccountRow('devices','Dispositivos','accountDevices')+
        v569ProfileAccountRow('biometrics','Biometría del teléfono','accountSecurity')+
        v569ProfileAccountRow('privacy','Datos y privacidad','accountPrivacy');
      menu.insertAdjacentElement('beforebegin',box);
    }
    v569EnsureLogoutLast(menu);
  }else{
    const card=$('.v12-profile-card',root);
    if(card){
      const login=$('[data-v12-action="login"]',card),create=$('[data-v12-action="create"]',card);
      if(login){login.textContent='Iniciar sesión';delete login.dataset.v569Route}
      if(create){create.textContent='Crear una cuenta';delete create.dataset.v569Route}
    }
    $('[data-v569-account-menu]',root)?.remove();
    root.querySelector('[data-v569-logout]')?.remove();
  }
}
function mountPage(){
  const r=route();if(!ROUTES.has(r))return;
  const screen=$('#screen');if(!screen)return;
  const placeholder=$('[data-v569-auth-mount]',screen);
  if(placeholder||!$('[data-v569-page]',screen))screen.innerHTML=authShell(r);
  const root=$('[data-v569-page]',screen);if(!root||root.dataset.bound)return;
  root.dataset.bound='1';
  if(root.dataset.v569Page==='register'){
    root.dataset.method='phone';
    const alias=$('[data-v569-alias]',root);
    if(alias&&!alias.dataset.v569AliasManual){alias.dataset.v569AliasManual='0';alias.dataset.v569AliasVariant='0'}
  }
}
function schedule(){setTimeout(()=>{mountPage();enhanceProfile()},60)}
document.addEventListener('input',e=>{
  if(!(e.target instanceof Element))return;
  const root=e.target.closest('[data-v569-page]');
  if(!root||root.dataset.v569Page!=='register')return;
  if(e.target.matches('[data-v569-name]')){
    const alias=$('[data-v569-alias]',root);
    if(alias&&alias.dataset.v569AliasManual!=='1'){
      alias.dataset.v569AliasVariant='0';
      fillSuggestedAlias(root,false);
    }
    return;
  }
  if(e.target.matches('[data-v569-alias]')){
    e.target.dataset.v569AliasManual='1';
    e.target.removeAttribute('data-v569-alias-suggested');
  }
},false);
// data-v569-alias-manual-input
document.addEventListener('click',async e=>{
  if(!(e.target instanceof Element))return;
  const profileClose=e.target.closest('[data-v569-profile-close]');
  if(profileClose){e.preventDefault();e.stopPropagation();restoreGuestProfile();return}
  const profileMode=e.target.closest('[data-v569-profile-mode]');
  if(profileMode){e.preventDefault();e.stopPropagation();openProfileMode(profileMode.dataset.v569ProfileMode);return}
  const profileFinish=e.target.closest('[data-v569-profile-finish]');
  if(profileFinish){e.preventDefault();e.stopPropagation();renderLoggedProfile();return}
  const inlineCopy=e.target.closest('.v569-inline-success [data-v569-copy-alias]');
  if(inlineCopy){e.preventDefault();const a=currentAccount();try{await navigator.clipboard.writeText(a?.alias||'');toast('Alias copiado')}catch(_){toast('@'+(a?.alias||''))}return}
  if(e.target.closest('[data-v1150-export-profile]')){e.preventDefault();exportLocalProfile(currentAccount());return}
  if(e.target.closest('[data-v1150-copy-alias]')){
    e.preventDefault();
    const a=currentAccount();if(!a)return toast('Primero inicia sesión');
    try{await navigator.clipboard.writeText('@'+a.alias);toast('Alias copiado')}catch(_){toast('Alias: @'+a.alias)}
    return;
  }
  const routeBtn=e.target.closest('[data-v569-route]');
  if(routeBtn){e.preventDefault();e.stopPropagation();go(routeBtn.dataset.v569Route);return}
  const method=e.target.closest('[data-v569-method]');
  if(method){e.preventDefault();const root=method.closest('[data-v569-page]');root.dataset.method=method.dataset.v569Method;$$('[data-v569-method]',root).forEach(b=>b.classList.toggle('active',b===method));$('[data-v569-phone-wrap]',root).hidden=false;$('[data-v569-email-wrap]',root).hidden=false;return}
  if(e.target.closest('[data-v569-generate-alias]')){
    const root=e.target.closest('[data-v569-page]'),alias=$('[data-v569-alias]',root);
    if(!($('[data-v569-name]',root)?.value||'').trim()){toast('Primero escribe tu nombre');return}
    alias.dataset.v569AliasManual='0';
    alias.dataset.v569AliasVariant=String((Number(alias.dataset.v569AliasVariant||0)+1)%6);
    fillSuggestedAlias(root,true);
    return;
  }
  if(e.target.closest('[data-v569-generate-password]')){const root=e.target.closest('[data-v569-page]'),p=generatedPassword();$('[data-v569-password]',root).value=p;$('[data-v569-confirm]',root).value=p;toast('Contraseña segura generada');return}
  if(e.target.closest('[data-v569-admin-link]')){
    e.preventDefault();
    const media=window.LJR_MEDIA;
    if(!media?.login){toast('El servicio de administración no está disponible');return}
    try{
      const verified=media.admin||await media.restoreAdminSession?.();
      if(verified)media.manage();
      else media.login(()=>media.manage());
    }catch(_){toast('No se pudo comprobar el acceso. Revisa tu conexión.')}
    return;
  }
  if(e.target.closest('[data-v569-register]')){e.preventDefault();await registerFromPage(e.target.closest('[data-v569-page]'));return}
  if(e.target.closest('[data-v569-login]')){e.preventDefault();await loginFromPage(e.target.closest('[data-v569-page]'));return}
  if(e.target.closest('[data-v569-login-bio]')){e.preventDefault();await biometricLogin(e.target.closest('[data-v569-page]'));return}
  if(e.target.closest('[data-v569-save-profile]')){e.preventDefault();await saveProfile(e.target.closest('[data-v569-page]'));return}
  if(e.target.closest('[data-v569-change-pass]')){e.preventDefault();await changePassword(e.target.closest('[data-v569-page]'));return}
  if(e.target.closest('[data-v806-face-scan]')){e.preventDefault();try{
    const scanner=window.LJR_FACE_CAMERA_SCAN;
    if(!scanner?.open)throw new Error('El escáner facial todavía no está cargado');
    const result=await scanner.open();
    await saveVisualFaceScan(currentAccount(),result);
    toast('Rostro detectado correctamente');
    schedule();
  }catch(err){
    if(err?.name!=='AbortError')toast(err?.name==='NotAllowedError'?'Permite el acceso a la cámara para escanear tu rostro':(err?.message||'No se pudo escanear el rostro'));
  }return}
  if(e.target.closest('[data-v569-enable-face]')){e.preventDefault();try{await configureFaceAccess(currentAccount());schedule()}catch(err){closeOverlay();toast(err?.name==='NotAllowedError'?'Activación facial cancelada':(err?.message||'No se pudo activar el acceso facial'))}return}
  if(e.target.closest('[data-v569-enable-bio]')){e.preventDefault();try{await enrollBiometric(currentAccount(),'biometric');schedule()}catch(err){closeOverlay();toast(err?.name==='NotAllowedError'?'Activación cancelada':(err?.message||'No se pudo activar'))}return}
  if(e.target.closest('[data-v569-test-bio]')){e.preventDefault();try{await verifyBiometric(currentAccount());schedule()}catch(err){closeOverlay();toast(err?.name==='NotAllowedError'?'Prueba biométrica cancelada':(err?.message||'No se pudo completar la prueba'))}return}
  if(e.target.closest('[data-v569-verify-bio]')){e.preventDefault();try{await verifyBiometric(currentAccount());schedule()}catch(err){closeOverlay();toast(err?.name==='NotAllowedError'?'Verificación cancelada':(err?.message||'No se pudo verificar'))}return}
  if(e.target.closest('[data-v569-disable-bio]')){e.preventDefault();const a=currentAccount(),auth=authState(),idx=auth.accounts.findIndex(x=>x.id===a?.id);if(idx>=0){auth.accounts[idx].biometric=null;auth.accounts[idx].devices=(auth.accounts[idx].devices||[]).map(d=>({...d,verified:false}));saveAuth(auth);updateMainStoreAccount(auth.accounts[idx]);toast('Biometría desactivada');schedule()}return}
  if(e.target.closest('[data-v577-remember-current]')){
    e.preventDefault();const a=currentAccount();if(a){const updated=rememberDevice(a,{verified:false,method:'manual'});setAppUser(updated);toast('Dispositivo recordado');schedule()}return
  }
  if(e.target.closest('[data-v577-forget-device]')){
    e.preventDefault();const a=currentAccount();if(a){const updated=forgetCurrentDevice(a);setAppUser(updated);toast('Este dispositivo fue olvidado');schedule()}return
  }
  if(e.target.closest('[data-v569-logout]')){e.preventDefault();logout();return}
},false);

window.addEventListener('hashchange',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,800);

window.LJR_V569_AUTH={
  openRegister,
  openLogin,
  openProfileRegister:()=>openProfileMode('register'),
  openProfileLogin:()=>openProfileMode('login'),
  logout,
  currentAccount,
  isRememberedDevice:()=>isRememberedDevice(currentAccount()),
  rememberCurrentDevice:()=>rememberDevice(currentAccount(),{verified:false,method:'manual'}),
  forgetCurrentDevice:()=>forgetCurrentDevice(currentAccount()),
  profileMarkup:loggedProfileMarkup,
  enrollBiometric:()=>enrollBiometric(currentAccount()),
  verifyBiometric:()=>verifyBiometric(currentAccount())
};
})();
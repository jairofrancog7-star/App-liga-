/* Liga Juventino Rosas · avisos server-side. GitHub Pages NO ejecuta este servidor.
 * Requiere PostgreSQL, variables de entorno en hosting privado, Twilio y Web Push.
 * Prohibido exponer credenciales al navegador. No hay endpoints públicos de envío.
 */
import express from 'express';
import pg from 'pg';
import webpush from 'web-push';
import twilio from 'twilio';
import crypto from 'node:crypto';
import {ROLE_PERMS,roleFor,can,safeSubject} from './authorization.mjs';
import {registerMeetingRoutes} from './meeting-store.mjs';
import {registerCedulaRoutes} from './cedula-store.mjs';
const app=express();app.disable('x-powered-by');app.set('trust proxy',1);
const E=process.env, origin=E.WEB_ORIGIN||'https://jairofrancog7-star.github.io';
const publicUrl=(E.PUBLIC_API_ORIGIN||'').replace(/\/$/,'');
const pool=new pg.Pool({connectionString:E.DATABASE_URL,max:8,connectionTimeoutMillis:7000,ssl:E.DATABASE_URL?.includes('sslmode=require')?{rejectUnauthorized:true}:undefined});
if(!E.DATABASE_URL)throw new Error('Falta DATABASE_URL. Despliega PostgreSQL primero.');
if(E.JOB_NOTIFY_TOKEN&&E.JOB_NOTIFY_TOKEN.length<32)throw new Error('JOB_NOTIFY_TOKEN debe tener al menos 32 caracteres.');
// El programador de avisos funciona en el propio servidor cuando se despliega.
// Un servicio siempre encendido evita depender de tokens de GitHub Actions.
const internalDispatchEnabled=E.ENABLE_INTERNAL_DISPATCH!=='false';
if(!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(E.LJR_MEDIA_AUTH_BASE||'')){
 throw new Error('Configura LJR_MEDIA_AUTH_BASE=https://servidor-autenticacion; sin acceso de visitante.');
}
const vapidReady=Boolean(E.VAPID_PUBLIC_KEY&&E.VAPID_PRIVATE_KEY&&E.VAPID_SUBJECT);
if(vapidReady)webpush.setVapidDetails(E.VAPID_SUBJECT,E.VAPID_PUBLIC_KEY,E.VAPID_PRIVATE_KEY);
const twilioReady=Boolean(E.TWILIO_ACCOUNT_SID&&E.TWILIO_API_KEY&&E.TWILIO_API_SECRET);
const smsReady=twilioReady&&/^MG[0-9a-f]{32}$/i.test(E.TWILIO_MESSAGING_SERVICE_SID||'');
// El número configurado puede ser candidato: habilitar solo tras alta REAL en Twilio/Meta.
// La bandera es manual; no reemplaza el estado de aprobación verificado por el proveedor.
const whatsappReady=twilioReady&&E.TWILIO_WHATSAPP_ACTIVATED==='true'&&/^whatsapp:\+[1-9]\d{7,14}$/.test(E.TWILIO_WHATSAPP_SENDER||'')&&/^HX[0-9a-f]{32}$/i.test(E.TWILIO_WHATSAPP_CONTENT_SID||'');
const client=twilioReady?twilio(E.TWILIO_API_KEY,E.TWILIO_API_SECRET,{accountSid:E.TWILIO_ACCOUNT_SID}):null;
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
 const requestOrigin=req.get('Origin');
 if(requestOrigin&&requestOrigin!==origin)return res.status(403).json({error:'Origen no autorizado'});
 if(requestOrigin===origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
 res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization,X-Job-Token');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE,OPTIONS');}
 if(req.method==='OPTIONS')return res.status(204).end();
 next();
});
app.use('/admin/cedulas',express.json({limit:'3mb'}));
app.use(express.json({limit:'20kb'}));
const secretEquals=(a,b)=>{if(typeof a!=='string'||typeof b!=='string')return false;
 const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)};
// Valida la sesión existente EN EL SERVIDOR; nunca acepta un rol desde el navegador.
const ROLES=Object.keys(ROLE_PERMS);
async function admin(req,res,next){
 const bearer=req.get('Authorization')||'';
 if(!/^Bearer [^\s]{16,4096}$/.test(bearer))return res.status(401).json({error:'Inicia sesión como administrador de la Liga'});
 try{
  const response=await fetch(E.LJR_MEDIA_AUTH_BASE+'/api/me',{
   headers:{Authorization:bearer,Accept:'application/json'},
   signal:AbortSignal.timeout(8000),redirect:'error'
  });
  if(!response.ok)return res.status(response.status===401||response.status===403?401:503).json({error:'No se pudo validar la sesión administrativa'});
  const data=await response.json(),identity=data?.admin;
  if(!identity||typeof identity!=='object')return res.status(403).json({error:'Cuenta sin autorización administrativa'});
  const subject=String(identity.id??identity.username??'').trim();
  if(!safeSubject(subject))return res.status(403).json({error:'Identificador administrativo inválido'});
  const isOwner=identity.owner===true;
  let secondary=false,stored='lector';
  if(!isOwner){
   // Grants persist only in PostgreSQL and require explicit primary-owner approval.
   const grant=await pool.query('SELECT 1 FROM ljr_co_principals WHERE subject=$1',[subject]);
   secondary=grant.rowCount>0;
   if(!secondary){
    const result=await pool.query('SELECT role FROM ljr_admin_roles WHERE subject=$1',[subject]);
    stored=result.rows[0]?.role;
   }
  }
  const role=roleFor(identity,stored,secondary);
  req.actor={subject,role,owner:isOwner,secondary,permissions:ROLE_PERMS[role]};
  next();
 }catch(e){
  console.warn('Verificación de sesión no disponible:',e?.name||'Error');
  res.status(503).json({error:'No se pudo verificar el permiso con el servidor de la Liga'});
 }
}
const requirePermission=name=>(req,res,next)=>can(req.actor?.role,name)?next():res.status(403).json({error:'Tu cargo no tiene permiso para esta operación'});
async function audit(req,action,target,detail={}){
 await pool.query('INSERT INTO ljr_admin_audit(actor,role,action,target,detail) VALUES($1,$2,$3,$4,$5)',
 [req.actor.subject,req.actor.role,action,target,JSON.stringify(detail)]);
}
const cron=(req,res,next)=>!E.JOB_NOTIFY_TOKEN?res.status(503).json({error:'Programador externo no configurado'}):
 secretEquals(req.get('X-Job-Token'),E.JOB_NOTIFY_TOKEN)?next():res.status(401).json({error:'Token del programador incorrecto'});
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const phone=x=>/^\+[1-9]\d{7,14}$/.test(String(x||''))?x:null;
const catAliases={all:'Todas','3':'Primera','5':'Intermedia','4':'Segunda','2':'Veteranos 35+','1':'Veteranos 50+'};
const catOptions=['Todas','Primera','Intermedia','Segunda','Veteranos 35+','Veteranos 50+'];
const category=x=>catOptions.includes(x)?x:(catAliases[String(x||'')]||'Todas');
const noticeTypes=['general','suspension','cancha','horario','jornada','partido','resultados','junta','registro','clima'];
const text=(x,max)=>String(x||'').trim().slice(0,max);
const isPush=s=>s&&typeof s.endpoint==='string'&&s.endpoint.startsWith('https://')&&s.endpoint.length<2100&&
 s.keys&&typeof s.keys.auth==='string'&&s.keys.auth.length<500&&typeof s.keys.p256dh==='string'&&s.keys.p256dh.length<500;
const matchCat=(cat,from)=>from==='Todas'||category(cat)==='Todas'||category(cat)===category(from);
function matchPreferences(rec,job){
 const prefs=rec.preferences||{};
 if(!matchCat(rec.category,job.category))return false;
 const types=Array.isArray(prefs.types)?prefs.types:[];
 if(types.length&&job.notice_type&&job.notice_type!=='general'&&!types.includes(job.notice_type))return false;
 const targetTeam=String(job.team||'').trim().toLocaleLowerCase('es-MX'),
       targetField=String(job.field||'').trim().toLocaleLowerCase('es-MX');
 if(prefs.team&&targetTeam&&String(prefs.team).trim().toLocaleLowerCase('es-MX')!==targetTeam)return false;
 if(prefs.field&&targetField&&String(prefs.field).trim().toLocaleLowerCase('es-MX')!==targetField)return false;
 return true;
}
const apiError=(err,res)=>{console.error('Notifier error',err?.message);if(!res.headersSent)res.status(500).json({error:'No se pudo completar la operación'})};
registerMeetingRoutes({app,pool,admin,requirePermission,audit,apiError});
registerCedulaRoutes({app,pool,admin,requirePermission,apiError});
app.get('/health',(_q,res)=>res.json({ok:true,service:'Liga Juventino Rosas · notificaciones',schedulerEnabled:internalDispatchEnabled}));
app.get('/health/ready',async(_req,res)=>{
 try{await pool.query('SELECT 1');res.json({ready:true,database:'connected',schedulerEnabled:internalDispatchEnabled,
  pushEnabled:vapidReady,smsEnabled:smsReady,whatsappEnabled:whatsappReady,approvalRequired:true})}
 catch(_){res.status(503).json({ready:false,database:'unavailable',schedulerEnabled:internalDispatchEnabled})}
});
app.get('/api/push/public-key',(_q,res)=>vapidReady?res.json({publicKey:E.VAPID_PUBLIC_KEY}):res.status(503).json({error:'Push sin configurar'}));
app.get('/config',(_q,res)=>res.json({pushEnabled:vapidReady,twilioEnabled:Boolean(smsReady||whatsappReady),
 vapidPublicKey:vapidReady?E.VAPID_PUBLIC_KEY:null,smsEnabled:smsReady,whatsappEnabled:whatsappReady,channels:['push','sms','whatsapp']}));
const lastRequest=new Map();
function throttle(req,res,next){const key=hash(req.ip||'unknown'),now=Date.now(),value=lastRequest.get(key)||[];
 const recent=value.filter(t=>now-t<60000);if(recent.length>=12)return res.status(429).json({error:'Demasiadas solicitudes; espera un minuto'});
 recent.push(now);lastRequest.set(key,recent);if(lastRequest.size>8000)lastRequest.clear();next();}
async function subscribe(req,res){
 if(!vapidReady)return res.status(503).json({error:'Push todavía no configurado'});
 const subscription=req.body?.subscription,pref=req.body?.preferences||{};
 const cat=category(pref.category??req.body?.category);
 const types=Array.isArray(pref.types)?pref.types.filter(t=>noticeTypes.includes(t)).slice(0,12):[];
 const preferences={category:cat,team:text(pref.team,90),field:text(pref.field,100),types};
 if(!isPush(subscription))return res.status(400).json({error:'Suscripción no válida'});
 try{await pool.query(`INSERT INTO ljr_push_subscriptions(endpoint,subscription,category,preferences) VALUES($1,$2,$3,$4)
 ON CONFLICT(endpoint) DO UPDATE SET subscription=EXCLUDED.subscription, category=EXCLUDED.category,preferences=EXCLUDED.preferences`,
 [subscription.endpoint,subscription,cat,JSON.stringify(preferences)]);res.status(201).json({ok:true,active:true});
 }catch(e){apiError(e,res)}
}
app.post('/push/subscribe',throttle,subscribe);
app.post('/api/push/subscribe',throttle,subscribe);
// Prueba explícita de extremo a extremo: solo el propio dispositivo puede solicitarla.
// Debe demostrar las claves de su suscripción registrada. Jamás publica un aviso oficial.
const recentSelfTests=new Map(),SELF_TEST_DELAY_MS=15000,SELF_TEST_COOLDOWN_MS=300000;
app.post('/api/push/self-test',throttle,async(req,res)=>{
 if(!vapidReady)return res.status(503).json({error:'El servidor Web Push no está configurado.'});
 const subscription=req.body?.subscription;
 if(!isPush(subscription))return res.status(400).json({error:'La suscripción del navegador no es válida.'});
 try{
  const result=await pool.query('SELECT subscription FROM ljr_push_subscriptions WHERE endpoint=$1 LIMIT 1',[subscription.endpoint]);
  const registered=result.rows[0]?.subscription;
  // auth es un secreto aleatorio del navegador; una URL de endpoint por sí sola no autoriza envíos.
  if(!registered||!secretEquals(registered.keys?.auth,subscription.keys?.auth)||
    !secretEquals(registered.keys?.p256dh,subscription.keys?.p256dh))
   return res.status(404).json({error:'El teléfono aún no tiene una suscripción confirmada en el servidor. Activa los avisos primero.'});
  const token=hash(subscription.endpoint),now=Date.now(),last=recentSelfTests.get(token)||0;
  if(now-last<SELF_TEST_COOLDOWN_MS)return res.status(429).json({error:'Ya solicitaste una prueba. Espera cinco minutos antes de repetirla.'});
  recentSelfTests.set(token,now);
  if(recentSelfTests.size>3000){
   for(const [k,t] of recentSelfTests)if(now-t>=SELF_TEST_COOLDOWN_MS)recentSelfTests.delete(k);
  }
  const timer=setTimeout(async()=>{
   try{
    await webpush.sendNotification(registered,JSON.stringify({
     title:'PRUEBA PERSONAL · Liga Juventino Rosas',
     body:'Si recibiste este aviso con la página cerrada, Web Push está funcionando en este dispositivo.',
     route:'notifications'
    }),{TTL:180});
   }catch(err){
    console.error('Prueba Web Push privada fallida:',err?.statusCode||err?.code||'desconocido');
    if([404,410].includes(err?.statusCode))
     await pool.query('DELETE FROM ljr_push_subscriptions WHERE endpoint=$1',[subscription.endpoint]).catch(()=>{});
   }
  },SELF_TEST_DELAY_MS);
  timer.unref?.();
  return res.status(202).json({ok:true,scheduled:true,delaySeconds:15});
 }catch(err){return apiError(err,res)}
});
async function unsubscribe(req,res){
 const endpoint=req.body?.endpoint||req.body?.subscription?.endpoint;if(typeof endpoint!=='string'||endpoint.length>2100)return res.status(400).json({error:'Endpoint inválido'});
 try{await pool.query('DELETE FROM ljr_push_subscriptions WHERE endpoint=$1',[endpoint]);res.json({ok:true})}catch(e){apiError(e,res)}
}
app.post('/push/unsubscribe',throttle,unsubscribe);
app.post('/api/push/unsubscribe',throttle,unsubscribe);
app.post('/admin/recipients',admin,requirePermission('recipients:write'),async(req,res)=>{
 const {number,channel,consentAt,consentSource,contactRole='general',category:cat}=req.body||{};
 if(!phone(number)||!['sms','whatsapp'].includes(channel)||!['general','delegado','presidencia'].includes(contactRole)||!String(consentSource||'').trim()||!consentAt||!Number.isFinite(Date.parse(consentAt))||Date.parse(consentAt)>Date.now()+300000)
 return res.status(400).json({error:'Requiere teléfono E.164, canal y consentimiento documentado'});
 try{await pool.query(`INSERT INTO ljr_message_consent(phone,channel,category,consent_at,consent_source,opted_out_at,contact_role)
 VALUES($1,$2,$3,$4,$5,NULL,$6)
 ON CONFLICT(phone,channel) DO UPDATE SET category=EXCLUDED.category,consent_at=EXCLUDED.consent_at,consent_source=EXCLUDED.consent_source,opted_out_at=NULL,contact_role=EXCLUDED.contact_role`,
 [number,channel,category(cat),consentAt,text(consentSource,300),contactRole]);
 await audit(req,'recipients:save',hash(number),{channel,category:category(cat),contactRole});
 res.status(201).json({ok:true})}catch(e){apiError(e,res)}
});
app.post('/admin/optout',admin,requirePermission('recipients:write'),async(req,res)=>{
 const number=phone(req.body?.number),channel=req.body?.channel;
 if(!number||!['sms','whatsapp'].includes(channel))return res.status(400).json({error:'Número/canal no válido'});
 try{await pool.query('UPDATE ljr_message_consent SET opted_out_at=now() WHERE phone=$1 AND channel=$2',[number,channel]);await audit(req,'recipients:optout',hash(number),{channel});res.json({ok:true})}catch(e){apiError(e,res)}
});
app.post('/admin/notices',admin,requirePermission('notices:write'),async(req,res)=>{
 const {title,body,sendAt,category:cat,channels,type='general',team='',field=''}=req.body||{};
 const allowed=['app','push','sms','whatsapp'];const selected=Array.isArray(channels)?[...new Set(channels)]:[];
 const when=Date.parse(sendAt||'');
 if(!title||!body||title.length>120||body.length>700||!Number.isFinite(when)||when<Date.now()-120000||
 selected.length===0||selected.some(x=>!allowed.includes(x))||!noticeTypes.includes(type))return res.status(400).json({error:'Aviso inválido; define título, mensaje, canales, tipo y hora futura'});
 if(selected.includes('push')&&!vapidReady||selected.includes('sms')&&!smsReady||
 selected.includes('whatsapp')&&!whatsappReady)
 return res.status(503).json({error:'Hay canales sin configurar'});
 const id=crypto.randomUUID();
 try{
 await pool.query(`INSERT INTO ljr_scheduled_notices(id,title,body,category,channels,send_at,created_by,notice_type,team,field,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'draft')`,
 [id,text(title,120),text(body,700),category(cat),selected,new Date(when).toISOString(),req.actor.subject,type,text(team,90),text(field,100)]);
 await audit(req,'notices:draft',id,{category:category(cat),channels:selected});
 res.status(201).json({ok:true,id,sendAt:new Date(when).toISOString(),status:'draft',revision:1});
 }catch(e){apiError(e,res)}
});
app.get('/admin/me',admin,(req,res)=>res.json({actor:{id:req.actor.subject,role:req.actor.role,owner:req.actor.owner,secondary:req.actor.secondary,permissions:req.actor.permissions}}));
// 2 principales: propietario del CMS + un segundo administrador confirmado por propietario.
// No admite privilegios por coincidencia de correo, teléfono o cambios de localStorage.
app.get('/admin/principals',admin,requirePermission('roles:write'),async(req,res)=>{
 try{
  const r=await pool.query('SELECT subject,approved_at FROM ljr_co_principals LIMIT 1');
  res.json({primarySource:'media-server',secondary:r.rows[0]||null,expected:2,
   current:1+(r.rowCount?1:0),canAuthorize:req.actor.owner===true});
 }catch(e){apiError(e,res)}
});
app.post('/admin/principals',admin,requirePermission('roles:write'),async(req,res)=>{
 if(req.actor.owner!==true)return res.status(403).json({error:'Solo el propietario original puede autorizar otro principal'});
 const subject=String(req.body?.subject||'').trim();
 if(!safeSubject(subject)||subject===req.actor.subject)return res.status(400).json({error:'Identificador de cuenta inválido'});
 // Consulta los administradores reales del CMS: no se aceptan emails ni números como prueba de identidad.
 try{
  const bearer=req.get('Authorization');
  const response=await fetch(E.LJR_MEDIA_AUTH_BASE+'/api/admins',{
   headers:{Authorization:bearer,Accept:'application/json'},
   signal:AbortSignal.timeout(8000),redirect:'error'
  });
  if(!response.ok)return res.status(503).json({error:'No se pudo comprobar el administrador en el servidor de la Liga'});
  const data=await response.json();
  const target=Array.isArray(data.admins)?data.admins.find(x=>x&&String(x.id)===subject&&x.active===true&&!x.owner):null;
  if(!target)return res.status(422).json({error:'Primero registra y autoriza la cuenta independiente del presidente en la administración de la Liga'});
  const db=await pool.connect();
  try{
   await db.query('BEGIN');
   await db.query('LOCK TABLE ljr_co_principals IN EXCLUSIVE MODE');
   const exists=await db.query('SELECT subject FROM ljr_co_principals LIMIT 1');
   if(exists.rowCount&&exists.rows[0].subject!==subject){
    await db.query('ROLLBACK');
    return res.status(409).json({error:'Ya existe un segundo administrador principal. Revócalo primero si necesitas reemplazarlo'});
   }
   if(!exists.rowCount){
    await db.query('INSERT INTO ljr_co_principals(subject,approved_by) VALUES($1,$2)',[subject,req.actor.subject]);
    await db.query('INSERT INTO ljr_admin_audit(actor,role,action,target,detail) VALUES($1,$2,$3,$4,$5)',
     [req.actor.subject,req.actor.role,'principals:approve',subject,JSON.stringify({scope:'notifications-meetings'})]);
   }
   await db.query('COMMIT');
   res.json({ok:true,subject,secondary:true,scope:'notifications-meetings'});
  }catch(err){await db.query('ROLLBACK').catch(()=>{});apiError(err,res)}
  finally{db.release()}
 }catch(e){apiError(e,res)}
});
app.delete('/admin/principals/:subject',admin,requirePermission('roles:write'),async(req,res)=>{
 if(req.actor.owner!==true)return res.status(403).json({error:'Solo el propietario original puede revocar este acceso'});
 const subject=String(req.params.subject||'');
 if(!safeSubject(subject)||subject===req.actor.subject)return res.status(400).json({error:'Identificador no válido'});
 const db=await pool.connect().catch(e=>{apiError(e,res);return null});
 if(!db)return;
 try{
  await db.query('BEGIN');
  const removed=await db.query('DELETE FROM ljr_co_principals WHERE subject=$1 RETURNING subject',[subject]);
  if(!removed.rowCount){await db.query('ROLLBACK');return res.status(404).json({error:'No existe ese segundo principal'})}
  await db.query('INSERT INTO ljr_admin_audit(actor,role,action,target,detail) VALUES($1,$2,$3,$4,$5)',
   [req.actor.subject,req.actor.role,'principals:revoke',subject,JSON.stringify({scope:'notifications-meetings'})]);
  await db.query('COMMIT');
  res.json({ok:true,subject,revoked:true});
 }catch(e){await db.query('ROLLBACK').catch(()=>{});apiError(e,res)}
 finally{db.release()}
});

app.get('/admin/roles',admin,requirePermission('roles:write'),async(req,res)=>{
 try{
  const r=await pool.query('SELECT subject,role,updated_at FROM ljr_admin_roles ORDER BY subject LIMIT 100');
  res.json({roles:r.rows,allowedRoles:ROLES.filter(r=>r!=='presidente')});
 }catch(e){apiError(e,res)}
});
app.put('/admin/roles/:subject',admin,requirePermission('roles:write'),async(req,res)=>{
 const subject=String(req.params.subject||'').trim(),role=String(req.body?.role||'');
 if(!/^[a-zA-Z0-9:_-]{1,128}$/.test(subject)||!ROLES.includes(role)||role==='presidente'||subject===req.actor.subject)
  return res.status(400).json({error:'Cargo o identificador no permitido'});
 try{
  await pool.query(`INSERT INTO ljr_admin_roles(subject,role,updated_by) VALUES($1,$2,$3)
  ON CONFLICT(subject) DO UPDATE SET role=EXCLUDED.role,updated_by=EXCLUDED.updated_by,updated_at=now()`,[subject,role,req.actor.subject]);
  await audit(req,'roles:assign',subject,{role});
  res.json({ok:true,subject,role});
 }catch(e){apiError(e,res)}
});
app.get('/admin/audit',admin,requirePermission('audit:read'),async(req,res)=>{
 try{const r=await pool.query('SELECT actor,role,action,target,detail,created_at FROM ljr_admin_audit ORDER BY created_at DESC LIMIT 120');res.json({items:r.rows})}
 catch(e){apiError(e,res)}
});
app.get('/admin/notices',admin,requirePermission('notices:read'),async(req,res)=>{
 try{const r=await pool.query(`SELECT id,title,body,category,channels,send_at,status,revision,created_by,created_at,published_at,notice_type,team,field,approved_by,approved_at
 FROM ljr_scheduled_notices ORDER BY created_at DESC LIMIT 120`);res.json({items:r.rows})}
 catch(e){apiError(e,res)}
});

/* Resumen de envíos para la directiva. No devolver números ni claves Push.
   Los estados "delivered/read" sólo proceden de callbacks firmados de Twilio;
   el estado "sent" de Push significa aceptado por el proveedor, no leído. */
app.get('/admin/notices/:id/deliveries',admin,requirePermission('notices:read'),async(req,res)=>{
 const id=String(req.params.id||'');
 if(!/^[0-9a-f-]{32,40}$/i.test(id))return res.status(400).json({error:'Identificador no válido'});
 try{
  const existing=await pool.query('SELECT id,status,channels FROM ljr_scheduled_notices WHERE id=$1',[id]);
  if(!existing.rowCount)return res.status(404).json({error:'Aviso no encontrado'});
  const result=await pool.query(`SELECT channel,status,COUNT(*)::integer AS count
   FROM ljr_delivery_log WHERE notice_id=$1 GROUP BY channel,status ORDER BY channel,status`,[id]);
  res.json({id,noticeStatus:existing.rows[0].status,channels:existing.rows[0].channels,
   deliveryStates:result.rows,checkedAt:new Date().toISOString(),
   note:'Push enviado no significa leído; solo Twilio informa estados de entrega.'});
 }catch(e){apiError(e,res)}
});

app.put('/admin/notices/:id',admin,requirePermission('notices:write'),async(req,res)=>{
 const {title,body,sendAt,category:cat,channels,revision,type='general',team='',field=''}=req.body||{};
 const allowed=['app','push','sms','whatsapp'],when=Date.parse(sendAt||'');
 const selected=Array.isArray(channels)?[...new Set(channels)]:[];
 if(!Number.isInteger(revision)||revision<1||!title||!body||title.length>120||body.length>700||
 !Number.isFinite(when)||when<Date.now()||!selected.length||selected.some(x=>!allowed.includes(x))||!noticeTypes.includes(type))
 return res.status(400).json({error:'Datos de edición no válidos'});
 if((selected.includes('push')&&!vapidReady)||(selected.includes('sms')&&!smsReady)||(selected.includes('whatsapp')&&!whatsappReady))
 return res.status(503).json({error:'Hay canales aún no configurados'});
 try{
  const r=await pool.query(`UPDATE ljr_scheduled_notices
 SET title=$2,body=$3,send_at=$4,category=$5,channels=$6,revision=revision+1,notice_type=$8,team=$9,field=$10,
 status='draft',approved_by=NULL,approved_at=NULL
 WHERE id=$1 AND revision=$7 AND status IN ('draft','queued') RETURNING revision`,
 [req.params.id,text(title,120),text(body,700),new Date(when).toISOString(),category(cat),selected,revision,type,text(team,90),text(field,100)]);
  if(!r.rowCount)return res.status(409).json({error:'El aviso cambió, se canceló o ya se publicó. Actualiza la lista.'});
  await audit(req,'notices:update',req.params.id,{category:category(cat),revision:r.rows[0].revision});
  res.json({ok:true,revision:r.rows[0].revision});
 }catch(e){apiError(e,res)}
});
/* La programación no publica por sí sola: aprobación explícita y auditada por Presidencia.
   La revisión usa revision optimista y sólo permite avisos aún futuros. */
app.post('/admin/notices/:id/approve',admin,requirePermission('notices:approve'),async(req,res)=>{
 const revision=Number(req.body?.revision);
 if(!Number.isInteger(revision)||revision<1)return res.status(400).json({error:'Revisión del borrador necesaria'});
 try{
  const result=await pool.query(`UPDATE ljr_scheduled_notices
    SET status='queued',approved_by=$3,approved_at=now(),revision=revision+1
    WHERE id=$1 AND revision=$2 AND status='draft'
    AND send_at>now()+interval '30 seconds'
    RETURNING id,revision,send_at`,[req.params.id,revision,req.actor.subject]);
  if(!result.rowCount)return res.status(409).json({error:'Aviso modificado, vencido o no disponible para aprobar. Actualiza la lista.'});
  await audit(req,'notices:approve',req.params.id,{revision:result.rows[0].revision});
  res.json({ok:true,status:'queued',revision:result.rows[0].revision,sendAt:result.rows[0].send_at});
 }catch(e){apiError(e,res)}
});
app.delete('/admin/notices/:id',admin,requirePermission('notices:write'),async(req,res)=>{
 const revision=Number(req.body?.revision);if(!Number.isInteger(revision)||revision<1)return res.status(400).json({error:'Revisión necesaria'});
 try{
  const r=await pool.query(`UPDATE ljr_scheduled_notices SET status='cancelled',revision=revision+1
  WHERE id=$1 AND revision=$2 AND status IN ('draft','queued') RETURNING id`,[req.params.id,revision]);
  if(!r.rowCount)return res.status(409).json({error:'No se puede cancelar un aviso ya procesado'});
  await audit(req,'notices:cancel',req.params.id,{revision});
  res.json({ok:true});
 }catch(e){apiError(e,res)}
});
app.get('/notices',async(req,res)=>{
 try{
  const cat=category(String(req.query.category||'Todas'));
  const r=await pool.query(`SELECT id,title,body,category,channels,published_at,notice_type,team,field
  FROM ljr_scheduled_notices WHERE status='done' AND 'app'=ANY(channels) AND published_at IS NOT NULL
  AND published_at>=now()-interval '30 days' AND (category=$1 OR category='Todas' OR $1='Todas')
  ORDER BY published_at DESC LIMIT 60`,[cat]);
  res.json({items:r.rows,source:'servidor_oficial'});
 }catch(e){apiError(e,res)}
});
async function onceLog(id,channel,recipient){
 const k=hash(recipient),r=await pool.query(`INSERT INTO ljr_delivery_log(notice_id,channel,recipient_key)
 VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING notice_id`,[id,channel,k]);return {inserted:!!r.rowCount,key:k};
}
async function logStatus(id,channel,k,status,sid='',error=''){
 await pool.query(`UPDATE ljr_delivery_log SET status=$4,provider_sid=NULLIF($5,''),last_error=NULLIF($6,''),updated_at=now()
 WHERE notice_id=$1 AND channel=$2 AND recipient_key=$3`,[id,channel,k,status,sid,text(error,300)]);
}
async function deliver(notice,channel,recipient){
 const value=channel==='push'?recipient.endpoint:recipient.phone;
 const log=await onceLog(notice.id,channel,value);if(!log.inserted)return;
 try{
  if(channel==='push'){
   await webpush.sendNotification(recipient.subscription,JSON.stringify({title:notice.title,body:notice.body,route:'news'}),{TTL:21600});
   await logStatus(notice.id,channel,log.key,'sent');return;
  }
  const base={to:channel==='whatsapp'?'whatsapp:'+value:value,
   statusCallback:publicUrl+'/twilio/status'};
  if(channel==='whatsapp'){
   base.from=E.TWILIO_WHATSAPP_SENDER;
   base.contentSid=E.TWILIO_WHATSAPP_CONTENT_SID;
   // La plantilla de WhatsApp debe estar previamente aprobada por Meta.
   base.contentVariables=JSON.stringify({'1':notice.title,'2':notice.body});
  }else{
   base.messagingServiceSid=E.TWILIO_MESSAGING_SERVICE_SID;
   base.body=notice.title+'\n'+notice.body;
  }
  const response=await client.messages.create(base);
  await logStatus(notice.id,channel,log.key,'queued',response.sid);
 }catch(e){
  await logStatus(notice.id,channel,log.key,'failed','',e?.message||'Error del proveedor');
  if(channel==='push'&&[404,410].includes(e?.statusCode))await pool.query('DELETE FROM ljr_push_subscriptions WHERE endpoint=$1',[value]);
 }
}
// Procesa avisos globales desde el servidor, sin que el presidente abra la app.
// El cambio de queued->processing es atómico y el historial de destinatarios
// evita duplicados si Railway reinicia el proceso o llega un cron externo.
async function dispatchDue(){
 if(!publicUrl.startsWith('https://')&&twilioReady)throw Error('PUBLIC_API_ORIGIN debe ser HTTPS para callbacks de Twilio');
 const jobs=await pool.query(`UPDATE ljr_scheduled_notices SET status='processing',
 processing_at=now() WHERE id IN(SELECT id FROM ljr_scheduled_notices
 WHERE (status='queued' OR (status='processing' AND processing_at<now()-interval '30 minutes'))
 AND approved_at IS NOT NULL AND send_at<=now() ORDER BY send_at LIMIT 10 FOR UPDATE SKIP LOCKED)
 RETURNING id,title,body,category,channels,notice_type,team,field`);
 let attempted=0;
 for(const job of jobs.rows){
  for(const channel of job.channels){
   if(channel==='app')continue;
   const sql=channel==='push'
    ?'SELECT endpoint,subscription,category,preferences FROM ljr_push_subscriptions ORDER BY created_at LIMIT 1000'
    :'SELECT phone,category FROM ljr_message_consent WHERE channel=$1 AND opted_out_at IS NULL ORDER BY phone LIMIT 1000';
   const r=await pool.query(sql,channel==='push'?[]:[channel]);
   for(const rec of r.rows){
    if(channel==='push'?matchPreferences(rec,job):matchCat(rec.category,job.category)){
     await deliver(job,channel,rec);attempted++;
    }
   }
  }
  await pool.query("UPDATE ljr_scheduled_notices SET status='done',published_at=COALESCE(published_at,now()) WHERE id=$1",[job.id]);
 }
 return {ok:true,notices:jobs.rows.length,attempted};
}
let dispatchBusy=false;
async function safeDispatch(){
 if(dispatchBusy)return {ok:true,skipped:'already_running'};
 dispatchBusy=true;
 try{return await dispatchDue()}finally{dispatchBusy=false}
}
app.post('/jobs/dispatch',cron,async(req,res)=>{
 try{res.json(await safeDispatch())}catch(e){apiError(e,res)}
});
// Programa la publicación también cuando GitHub Actions no tiene secretos.
// El servidor puede reiniciar; los avisos pendientes quedan en PostgreSQL.
function activateScheduler(){
 if(!internalDispatchEnabled)return;
 const tick=()=>safeDispatch().catch(e=>console.error('Error del programador:',e?.code||e?.name||'unknown'));
 const initial=setTimeout(tick,15000);initial.unref?.();
 const timer=setInterval(tick,60000);timer.unref?.();
}

const twilioForm=express.urlencoded({extended:false,limit:'10kb'});
function signedTwilio(req,res,next){
 if(!E.TWILIO_AUTH_TOKEN||!publicUrl.startsWith('https://'))return res.status(503).end();
 const signature=req.get('X-Twilio-Signature')||'',url=publicUrl+req.path;
 return twilio.validateRequest(E.TWILIO_AUTH_TOKEN,signature,url,req.body)?next():res.status(403).end();
}
app.post('/twilio/status',twilioForm,signedTwilio,async(req,res)=>{
 const {MessageSid,MessageStatus,ErrorCode}=req.body||{};
 try{await pool.query(`UPDATE ljr_delivery_log SET status=$1,last_error=$2,updated_at=now() WHERE provider_sid=$3`,
 [text(MessageStatus,50),text(ErrorCode,80)||null,text(MessageSid,80)]);res.status(204).end()}catch(e){apiError(e,res)}
});
app.post('/twilio/inbound',twilioForm,signedTwilio,async(req,res)=>{
 const from=String(req.body?.From||'');const isWa=from.startsWith('whatsapp:');
 const number=phone(isWa?from.slice(9):from),message=String(req.body?.Body||'').trim().toUpperCase();
 if(number&&/^(STOP|CANCEL|UNSUBSCRIBE|END|QUIT|STOPALL|BAJA)$/.test(message)){
  try{await pool.query('UPDATE ljr_message_consent SET opted_out_at=now() WHERE phone=$1 AND channel=$2',[number,isWa?'whatsapp':'sms'])}catch(e){apiError(e,res);return}
 }
 res.type('text/xml').send('<Response></Response>');
});
app.use((_req,res)=>res.status(404).json({error:'Ruta desconocida'}));
app.listen(Number(E.PORT)||8080,()=>{console.log('Liga notifier listening');activateScheduler()});

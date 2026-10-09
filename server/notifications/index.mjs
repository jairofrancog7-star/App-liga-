/* Liga Juventino Rosas · avisos server-side. GitHub Pages NO ejecuta este servidor.
 * Requiere PostgreSQL, variables de entorno en hosting privado, Twilio y Web Push.
 * Prohibido exponer credenciales al navegador. No hay endpoints públicos de envío.
 */
import express from 'express';
import pg from 'pg';
import webpush from 'web-push';
import twilio from 'twilio';
import crypto from 'node:crypto';
const app=express();app.disable('x-powered-by');app.set('trust proxy',1);
const E=process.env, origin=E.WEB_ORIGIN||'https://jairofrancog7-star.github.io';
const publicUrl=(E.PUBLIC_API_ORIGIN||'').replace(/\/$/,'');
const pool=new pg.Pool({connectionString:E.DATABASE_URL,max:8,connectionTimeoutMillis:7000,ssl:E.DATABASE_URL?.includes('sslmode=require')?{rejectUnauthorized:true}:undefined});
if(!E.DATABASE_URL||!E.ADMIN_NOTIFY_TOKEN||!E.JOB_NOTIFY_TOKEN||E.ADMIN_NOTIFY_TOKEN.length<32||E.JOB_NOTIFY_TOKEN.length<32){
 throw new Error('Falta base de datos o secretos seguros de admin/cron.');
}
const vapidReady=Boolean(E.VAPID_PUBLIC_KEY&&E.VAPID_PRIVATE_KEY&&E.VAPID_SUBJECT);
if(vapidReady)webpush.setVapidDetails(E.VAPID_SUBJECT,E.VAPID_PUBLIC_KEY,E.VAPID_PRIVATE_KEY);
const twilioReady=Boolean(E.TWILIO_ACCOUNT_SID&&E.TWILIO_API_KEY&&E.TWILIO_API_SECRET);
const client=twilioReady?twilio(E.TWILIO_API_KEY,E.TWILIO_API_SECRET,{accountSid:E.TWILIO_ACCOUNT_SID}):null;
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');
 const requestOrigin=req.get('Origin');
 if(requestOrigin&&requestOrigin!==origin)return res.status(403).json({error:'Origen no autorizado'});
 if(requestOrigin===origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
 res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization,X-Job-Token');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');}
 if(req.method==='OPTIONS')return res.status(204).end();
 next();
});
app.use(express.json({limit:'20kb'}));
const secretEquals=(a,b)=>{if(typeof a!=='string'||typeof b!=='string')return false;
 const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)};
const admin=(req,res,next)=>secretEquals(req.get('Authorization')?.replace(/^Bearer /,''),E.ADMIN_NOTIFY_TOKEN)?next():res.status(401).json({error:'Acceso exclusivo de administración'});
const cron=(req,res,next)=>secretEquals(req.get('X-Job-Token'),E.JOB_NOTIFY_TOKEN)?next():res.status(401).json({error:'Token del programador incorrecto'});
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const phone=x=>/^\+[1-9]\d{7,14}$/.test(String(x||''))?x:null;
const category=x=>['Todas','Primera','Intermedia','Segunda','Veteranos 35+','Veteranos 50+'].includes(x)?x:'Todas';
const text=(x,max)=>String(x||'').trim().slice(0,max);
const isPush=s=>s&&typeof s.endpoint==='string'&&s.endpoint.startsWith('https://')&&s.endpoint.length<2100&&
 s.keys&&typeof s.keys.auth==='string'&&s.keys.auth.length<500&&typeof s.keys.p256dh==='string'&&s.keys.p256dh.length<500;
const matchCat=(cat,from)=>from==='Todas'||cat==='Todas'||cat===from;
const apiError=(err,res)=>{console.error('Notifier error',err?.message);if(!res.headersSent)res.status(500).json({error:'No se pudo completar la operación'})};
app.get('/health',(_q,res)=>res.json({ok:true,service:'Liga Juventino Rosas · notificaciones'}));
app.get('/config',(_q,res)=>res.json({pushEnabled:vapidReady,twilioEnabled:twilioReady,
 vapidPublicKey:vapidReady?E.VAPID_PUBLIC_KEY:null,channels:['push','sms','whatsapp']}));
const lastRequest=new Map();
function throttle(req,res,next){const key=hash(req.ip||'unknown'),now=Date.now(),value=lastRequest.get(key)||[];
 const recent=value.filter(t=>now-t<60000);if(recent.length>=12)return res.status(429).json({error:'Demasiadas solicitudes; espera un minuto'});
 recent.push(now);lastRequest.set(key,recent);if(lastRequest.size>8000)lastRequest.clear();next();}
app.post('/push/subscribe',throttle,async(req,res)=>{
 if(!vapidReady)return res.status(503).json({error:'Push todavía no configurado'});
 const subscription=req.body?.subscription,cat=category(req.body?.category);
 if(!isPush(subscription))return res.status(400).json({error:'Suscripción no válida'});
 try{await pool.query(`INSERT INTO ljr_push_subscriptions(endpoint,subscription,category) VALUES($1,$2,$3)
 ON CONFLICT(endpoint) DO UPDATE SET subscription=EXCLUDED.subscription, category=EXCLUDED.category`,
 [subscription.endpoint,subscription,cat]);res.status(201).json({ok:true});
 }catch(e){apiError(e,res)}
});
app.post('/push/unsubscribe',throttle,async(req,res)=>{
 const endpoint=req.body?.endpoint;if(typeof endpoint!=='string'||endpoint.length>2100)return res.status(400).json({error:'Endpoint inválido'});
 try{await pool.query('DELETE FROM ljr_push_subscriptions WHERE endpoint=$1',[endpoint]);res.json({ok:true})}catch(e){apiError(e,res)}
});
app.post('/admin/recipients',admin,async(req,res)=>{
 const {number,channel,consentAt,consentSource,category:cat}=req.body||{};
 if(!phone(number)||!['sms','whatsapp'].includes(channel)||!consentSource||!consentAt||!Number.isFinite(Date.parse(consentAt)))
 return res.status(400).json({error:'Requiere teléfono E.164, canal y consentimiento documentado'});
 try{await pool.query(`INSERT INTO ljr_message_consent(phone,channel,category,consent_at,consent_source,opted_out_at)
 VALUES($1,$2,$3,$4,$5,NULL)
 ON CONFLICT(phone,channel) DO UPDATE SET category=EXCLUDED.category,consent_at=EXCLUDED.consent_at,consent_source=EXCLUDED.consent_source,opted_out_at=NULL`,
 [number,channel,category(cat),consentAt,text(consentSource,300)]);
 res.status(201).json({ok:true})}catch(e){apiError(e,res)}
});
app.post('/admin/optout',admin,async(req,res)=>{
 const number=phone(req.body?.number),channel=req.body?.channel;
 if(!number||!['sms','whatsapp'].includes(channel))return res.status(400).json({error:'Número/canal no válido'});
 try{await pool.query('UPDATE ljr_message_consent SET opted_out_at=now() WHERE phone=$1 AND channel=$2',[number,channel]);res.json({ok:true})}catch(e){apiError(e,res)}
});
app.post('/admin/notices',admin,async(req,res)=>{
 const {title,body,sendAt,category:cat,channels}=req.body||{};
 const allowed=['push','sms','whatsapp'];const selected=Array.isArray(channels)?[...new Set(channels)]:[];
 const when=Date.parse(sendAt||'');
 if(!title||!body||title.length>120||body.length>700||!Number.isFinite(when)||when<Date.now()-120000||
 selected.length===0||selected.some(x=>!allowed.includes(x)))return res.status(400).json({error:'Aviso inválido; define título, mensaje, canales y hora futura'});
 if(selected.includes('push')&&!vapidReady||selected.includes('sms')&&!twilioReady||
 selected.includes('whatsapp')&&(!twilioReady||!E.TWILIO_WHATSAPP_SENDER||!E.TWILIO_WHATSAPP_CONTENT_SID))
 return res.status(503).json({error:'Hay canales sin configurar'});
 const id=crypto.randomUUID();
 try{await pool.query('INSERT INTO ljr_scheduled_notices(id,title,body,category,channels,send_at) VALUES($1,$2,$3,$4,$5,$6)',
 [id,text(title,120),text(body,700),category(cat),selected,new Date(when).toISOString()]);
 res.status(201).json({ok:true,id,sendAt:new Date(when).toISOString(),status:'queued'})}catch(e){apiError(e,res)}
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
app.post('/jobs/dispatch',cron,async(req,res)=>{
 if(!publicUrl.startsWith('https://')&&twilioReady)return res.status(503).json({error:'PUBLIC_API_ORIGIN debe ser HTTPS'});
 try{
  const jobs=await pool.query(`UPDATE ljr_scheduled_notices SET status='processing'
 WHERE id IN(SELECT id FROM ljr_scheduled_notices WHERE status='queued' AND send_at<=now()
 ORDER BY send_at LIMIT 10 FOR UPDATE SKIP LOCKED)
 RETURNING id,title,body,category,channels`);
  let count=0;
  for(const job of jobs.rows){
   for(const channel of job.channels){
    const sql=channel==='push'
     ?'SELECT endpoint,subscription,category FROM ljr_push_subscriptions ORDER BY created_at LIMIT 1000'
     :'SELECT phone,category FROM ljr_message_consent WHERE channel=$1 AND opted_out_at IS NULL ORDER BY phone LIMIT 1000';
    const result=await pool.query(sql,channel==='push'?[]:[channel]);
    for(const rec of result.rows){if(matchCat(rec.category,job.category)){await deliver(job,channel,rec);count++}}
   }
   await pool.query("UPDATE ljr_scheduled_notices SET status='done' WHERE id=$1",[job.id]);
  }
  res.json({ok:true,notices:jobs.rows.length,attempted:count});
 }catch(e){apiError(e,res)}
});
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
app.listen(Number(E.PORT)||8080,()=>console.log('Liga notifier listening'));

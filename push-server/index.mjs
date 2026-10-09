/* Servidor Web Push separado de GitHub Pages.
   Solo observa publicaciones del CMS oficial; NUNCA admite publicar avisos desde el navegador.
   Requiere VAPID, URL pública del CMS, volumen persistente y HTTPS en el host. */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import webpush from 'web-push';
import {officialItem,matches,normalizePreferences,pushEndpointValid,extractPublicRecords} from './rules.mjs';

const PORT=Number(process.env.PORT||3000);
const ORIGIN=(process.env.SITE_ORIGIN||'https://jairofrancog7-star.github.io').replace(/\/$/,'');
const CMS_URL=process.env.LJR_CMS_API_URL||'';
const SITE_URL=process.env.SITE_URL||ORIGIN+'/App-liga-/';
const STORAGE=process.env.PUSH_STATE_DIR||'./state';
const STORE=path.join(STORAGE,'subscriptions.json');
const POLL_MS=Math.max(60000,Number(process.env.POLL_INTERVAL_MS)||60000);
const PUBLIC_KEY=process.env.VAPID_PUBLIC_KEY||'';
const PRIVATE_KEY=process.env.VAPID_PRIVATE_KEY||'';
const SUBJECT=process.env.VAPID_SUBJECT||'';
if(!PUBLIC_KEY||!PRIVATE_KEY||!SUBJECT||!CMS_URL){
 console.error('Configuración incompleta: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT y LJR_CMS_API_URL.');
 process.exit(1);
}
if(!CMS_URL.startsWith('https://')||!SITE_URL.startsWith('https://')||!ORIGIN.startsWith('https://'))throw Error('URLs públicas HTTPS obligatorias');
webpush.setVapidDetails(SUBJECT,PUBLIC_KEY,PRIVATE_KEY);

let data={subscriptions:{},seen:{},initialised:false};
let flush=Promise.resolve(),polling=false;
const limiter=new Map();
const name=x=>String(x||'').slice(0,90);
function enqueueSave(){
 // Serializar escritura atómica, sin exponer endpoints ni tokens a la carpeta pública.
 const snapshot=JSON.stringify(data);
 flush=flush.catch(()=>{}).then(async()=>{
  const tmp=STORE+'.'+process.pid+'.tmp';
  await fs.writeFile(tmp,snapshot,{mode:0o600});
  await fs.rename(tmp,STORE);
 });
 return flush;
}
async function load(){
 await fs.mkdir(STORAGE,{recursive:true,mode:0o700});
 try{
  const raw=JSON.parse(await fs.readFile(STORE,'utf8'));
  if(raw&&typeof raw==='object')data={
   subscriptions:raw.subscriptions&&typeof raw.subscriptions==='object'?raw.subscriptions:{},
   seen:raw.seen&&typeof raw.seen==='object'?raw.seen:{},
   initialised:!!raw.initialised
  };
 }catch(e){if(e.code!=='ENOENT')throw e;}
}
function respond(res,status,payload,extra={}){
 const body=JSON.stringify(payload);
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra});
 res.end(body);
}
function cors(req,res){
 const origin=req.headers.origin;
 if(origin&&origin!==ORIGIN){respond(res,403,{error:'Origen no autorizado'});return false;}
 if(origin){
  res.setHeader('Access-Control-Allow-Origin',ORIGIN);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
 }
 return true;
}
function limited(req){
 const now=Date.now(),ip=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').split(',')[0].trim();
 const slot=limiter.get(ip);
 if(!slot||slot.until<now){limiter.set(ip,{until:now+3600000,hits:1});return false;}
 slot.hits++;return slot.hits>100;
}
async function readBody(req){
 let raw='';
 for await(const chunk of req){
  raw+=chunk.toString('utf8');
  if(raw.length>15000)throw Error('Cuerpo demasiado grande');
 }
 return JSON.parse(raw||'{}');
}
function subscriptionValid(s){
 if(!s||typeof s!=='object'||!pushEndpointValid(s.endpoint)||typeof s.keys?.p256dh!=='string'||typeof s.keys?.auth!=='string')return false;
 if(s.endpoint.length>2100||s.keys.p256dh.length>400||s.keys.auth.length>400)return false;
 return /^[A-Za-z0-9+/_=-]+$/.test(s.keys.p256dh)&&/^[A-Za-z0-9+/_=-]+$/.test(s.keys.auth);
}
function tokenOf(endpoint){return createHash('sha256').update(endpoint).digest('hex');}
async function request(req,res){
 if(!cors(req,res))return;
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 const endpoint=new URL(req.url,'http://localhost').pathname;
 if(req.method==='GET'&&endpoint==='/health'){respond(res,200,{ok:true,service:'liga-avisos-push',monitoring:!!CMS_URL,subscribers:Object.keys(data.subscriptions).length});return;}
 if(req.method==='GET'&&endpoint==='/api/push/public-key'){respond(res,200,{publicKey:PUBLIC_KEY,enabled:true});return;}
 if(req.method!=='POST'||(endpoint!=='/api/push/subscribe'&&endpoint!=='/api/push/unsubscribe')){respond(res,404,{error:'No encontrado'});return;}
 if(limited(req)){respond(res,429,{error:'Intenta más tarde'});return;}
 let body;
 try{body=await readBody(req);}catch(_){respond(res,400,{error:'Solicitud inválida'});return;}
 if(endpoint==='/api/push/subscribe'){
  const s=body.subscription;
  if(!subscriptionValid(s)){respond(res,400,{error:'Suscripción inválida'});return;}
  const token=tokenOf(s.endpoint);
  if(!data.subscriptions[token]&&Object.keys(data.subscriptions).length>=20000){respond(res,503,{error:'Capacidad temporalmente agotada'});return;}
  data.subscriptions[token]={subscription:{endpoint:s.endpoint,keys:{p256dh:s.keys.p256dh,auth:s.keys.auth}},
   preferences:normalizePreferences(body.preferences),updatedAt:new Date().toISOString()};
  await enqueueSave();
  respond(res,200,{ok:true,active:true});
 }else{
  const s=body.subscription;
  if(!s||!pushEndpointValid(s.endpoint)){respond(res,400,{error:'Suscripción inválida'});return;}
  delete data.subscriptions[tokenOf(s.endpoint)];
  await enqueueSave();
  respond(res,200,{ok:true,active:false});
 }
}
async function send(item){
 const payload=JSON.stringify({title:item.title,body:item.body,route:item.route,type:item.type});
 const selected=Object.entries(data.subscriptions).filter(([,sub])=>matches(sub,item));
 let ok=0,dead=0;
 // Cuota de velocidad: no abrir miles de conexiones en paralelo.
 for(let i=0;i<selected.length;i+=12){
  await Promise.all(selected.slice(i,i+12).map(async([id,sub])=>{
   try{await webpush.sendNotification(sub.subscription,payload,{TTL:3600,urgency:item.type==='suspension'?'high':'normal'});ok++;}
   catch(e){
    if(e.statusCode===404||e.statusCode===410){delete data.subscriptions[id];dead++;}
    else console.warn('Falló envío Web Push:',e.statusCode||'network');
   }
  }));
 }
 if(dead)await enqueueSave();
 console.log('Aviso oficial enviado: ',name(item.id),'destinatarios:',selected.length,'correctos:',ok,'vencidos:',dead);
}
async function poll(){
 if(polling)return;polling=true;
 try{
  const response=await fetch(CMS_URL,{headers:{'Accept':'application/json'},signal:AbortSignal.timeout(16000),cache:'no-store'});
  if(!response.ok)throw Error('CMS HTTP '+response.status);
  const feed=await response.json();
  if(!Array.isArray(feed?.items)&&!Array.isArray(feed))throw Error('Formato CMS inválido');
  const items=extractPublicRecords(feed);
  const old=data.seen,next={};
  const changed=[];
  for(const item of items){
   next[item.id]=item.digest;
   if(data.initialised&&old[item.id]!==item.digest)changed.push(item);
  }
  // Tras la primera sincronización se marca la línea base sin enviar cientos de avisos antiguos.
  data.seen=next;data.initialised=true;
  await enqueueSave();
  for(const item of changed.slice(0,40))await send(item);
  if(changed.length>40)console.warn('Se detectaron más de 40 cambios; revisar la fuente antes del siguiente envío.');
 }catch(e){console.warn('No se pudo sincronizar CMS:',String(e.message||e));}
 finally{polling=false;}
}
await load();
const server=http.createServer((req,res)=>request(req,res).catch(e=>{
 console.error('Solicitud fallida:',e.message);if(!res.headersSent)respond(res,500,{error:'No se pudo completar la solicitud'});
}));
server.listen(PORT,'0.0.0.0',()=>{
 console.log('Web Push Liga Juventino escuchando en puerto '+PORT);
 poll();
 setInterval(poll,POLL_MS).unref();
});

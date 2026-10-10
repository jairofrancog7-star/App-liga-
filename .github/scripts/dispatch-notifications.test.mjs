import test from 'node:test';
import assert from 'node:assert/strict';
import {validTarget,dispatch} from './dispatch-notifications.mjs';

test('Solo conexiones HTTPS a servidores privados',()=>{
 for (const x of ['','http://example.com','https://user:pass@example.com',
   'https://evil.example/path','https://jairofrancog7-star.github.io',
   'https://localhost','javascript:alert(1)']) assert.equal(validTarget(x),null);
 assert.equal(validTarget('https://liga-mensajes.up.railway.app'),'https://liga-mensajes.up.railway.app');
});

test('Sin credenciales no hace peticiones ni envíos',async()=>{
 let called=false;
 const r=await dispatch({},()=>{called=true;throw Error('unexpected')},()=>{});
 assert.deepEqual(r,{skipped:true,reason:'not_configured'});
 assert.equal(called,false);
});

test('Solo POST autenticado a cola con confirmación',async()=>{
 let req;
 const result=await dispatch({NOTIFICATIONS_API_URL:'https://liga-mensajes.up.railway.app',
 NOTIFICATIONS_JOB_TOKEN:'x'.repeat(48)},async(url,opts)=>{
   req={url,opts};return {ok:true,status:200,json:async()=>url.endsWith('/health/ready')?({ready:true,approvalRequired:true}):({ok:true,notices:2,attempted:4})};
 },()=>{});
 assert.equal(req.url,'https://liga-mensajes.up.railway.app/jobs/dispatch');
 assert.equal(req.opts.method,'POST');
 assert.equal(req.opts.headers['X-Job-Token'],'x'.repeat(48));
 assert.equal(result.notices,2);
});

test('El cron reporta errores sin revelar el token',async()=>{
 await assert.rejects(dispatch({
  NOTIFICATIONS_API_URL:'https://liga-mensajes.up.railway.app',
  NOTIFICATIONS_JOB_TOKEN:'x'.repeat(48)},
  async()=>({ok:false,status:503}),()=>{}),/HTTP 503/);
});

test('Bloquea un servidor antiguo antes de enviar cualquier aviso',async()=>{
 let sent=false;
 await assert.rejects(dispatch({
  NOTIFICATIONS_API_URL:'https://liga-mensajes.up.railway.app',
  NOTIFICATIONS_JOB_TOKEN:'x'.repeat(48)
 },async url=>{
  if(url.endsWith('/jobs/dispatch')){sent=true;throw Error('NO debe enviar');}
  return {ok:true,json:async()=>({ready:true,approvalRequired:false})};
 },()=>{}),/aprobación administrativa/);
 assert.equal(sent,false);
});

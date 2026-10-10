import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');

test('calendar link, alarmas ICS y Web Push con consentimiento',()=>{
 const js=read('src/v1074-agenda-integrations.js');
 new Function(js);
 assert.match(js,/agendaBuilder/);
 assert.match(js,/calendar\.google\.com\/calendar\/render/);
 assert.match(js,/America\/Mexico_City/);
 assert.match(js,/VALARM/);
 assert.match(js,/pushManager\.subscribe/);
 assert.match(js,/push\/unsubscribe/);
});
test('panel administrador y secretos exclusivos del backend',async()=>{
 const js=read('src/v1075-agenda-admin-delivery.js');
 new Function(js);
 assert.match(js,/await window\.LJR_MEDIA\.notifyAPI\(endpoint/);
 const client=read('public/media-client.js');
 const notifySource=client.slice(client.indexOf('async function notifyAPI('),client.indexOf('window.LJR_MEDIA='));
 assert.match(notifySource,/headers\.set\('Authorization','Bearer '\+token\)/);
 const publicNotify=new Function('admin','token',notifySource+';return notifyAPI')(null,'');
 await assert.rejects(publicNotify('/admin/notices'),/Inicia sesión de administración/);
 assert.match(js,/consentAt/);
 assert.match(js,/window\.confirm/);
 assert.match(js,/admin\/notices/);
 assert.match(read('server/notifications/index.mjs'),/timingSafeEqual/);
 assert.match(read('server/notifications/index.mjs'),/twilio\.validateRequest/);
 assert.match(read('server/notifications/index.mjs'),/FOR UPDATE SKIP LOCKED/);
});
test('la configuración pública no guarda claves ni finge servidor activo',()=>{
 for(const path of ['data/notifications-client.json','public/data/notifications-client.json','demo/data/notifications-client.json']){
  const config=JSON.parse(read(path));
  assert.equal(config.apiBaseUrl,'');
  assert.equal('TWILIO_API_SECRET' in config,false);
 }
});
test('módulos cargados en app y demo',()=>{
 for(const page of ['index.html','demo/index.html']){
  const html=read(page);
  assert.match(html,/v1074-agenda-integrations\.js/);
  assert.match(html,/v1075-agenda-admin-delivery\.js/);
 }
});

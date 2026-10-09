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
test('panel administrador y secretos exclusivos del backend',()=>{
 const js=read('src/v1075-agenda-admin-delivery.js');
 new Function(js);
 assert.match(js,/Authorization.*Bearer/);
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

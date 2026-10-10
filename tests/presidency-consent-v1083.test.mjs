import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const load=p=>readFileSync(resolve(root,p),'utf8');

test('Contacto de presidencia se captura en administración y no se publica precargado',()=>{
 for(const path of ['src/v1075-agenda-admin-delivery.js','demo/src/v1075-agenda-admin-delivery.js']){
  const code=load(path);
  assert.match(code,/data-ag1075-contact-role/);
  assert.match(code,/data-ag1075-request-consent/);
  assert.match(code,/data-ag1075-confirm/);
  assert.match(code,/contactRole:/);
  assert.match(code,/wa\.me\//);
  assert.doesNotMatch(code,/value="\+52\d{10}"/);
  new Function(code);
 }
});

test('Servidor valida rol y guarda consentimiento solo en PostgreSQL',()=>{
 const backend=load('server/notifications/index.mjs');
 const schema=load('server/notifications/schema.sql');
 assert.match(backend,/recipients:write/);
 assert.match(backend,/\['general','delegado','presidencia'\]\.includes\(contactRole\)/);
 assert.match(backend,/contact_role=EXCLUDED\.contact_role/);
 assert.match(backend,/consentSource/);
 assert.match(backend,/consentAt/);
 assert.match(schema,/CHECK \(contact_role IN \('general','delegado','presidencia'\)\)/);
});

test('Número personal no es configuración pública de Twilio',()=>{
 for(const path of ['data/notifications-client.json','public/data/notifications-client.json']){
  const obj=JSON.parse(load(path));
  assert.equal(obj.apiBaseUrl,'');
  assert.equal('phone' in obj,false);
  assert.equal('twilioSender' in obj,false);
 }
});

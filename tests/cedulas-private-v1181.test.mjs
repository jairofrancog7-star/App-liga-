import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {ROLE_PERMS,can,roleFor} from '../server/notifications/authorization.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const server=read('server/notifications/cedula-store.mjs');
const screen=read('src/v1181-cedulas-workflow.js');
const schema=read('server/notifications/cedula-schema.sql');
test('Ningún visitante puede escribir, aprobar ni firmar documentos',()=>{
 for(const permission of ['cedulas:read','cedulas:write','cedulas:review','cedulas:publish','cedulas:sign'])assert.equal(can('lector',permission),false);
 assert.equal(roleFor({owner:false},'presidente'),'lector');
 assert.equal(can('presidente','cedulas:publish'),true);
 assert.equal(can('arbitro','cedulas:sign'),true);
 assert.equal(can('arbitro','cedulas:publish'),false);
 assert.equal(can('editor','cedulas:publish'),false);
 assert.equal(can('secretario','cedulas:sign'),false);
 assert.equal(Object.hasOwn(ROLE_PERMS,'__proto__'),false);
});
test('Las rutas de escritura verifican sesión y cargo en el servidor',()=>{
 assert.match(server,/app\.post\('\/admin\/cedulas',admin,write/);
 assert.match(server,/app\.put\('\/admin\/cedulas\/:id',admin,write/);
 assert.match(server,/app\.post\('\/admin\/cedulas\/:id\/sign',admin,sign/);
 assert.match(server,/app\.post\('\/admin\/cedulas\/:id\/status',admin,read/);
 assert.match(server,/const permission=\['draft','submitted','void'\]/);
 assert.match(server,/assigned_to===req\.actor\.subject/);
 assert.match(server,/if\(!row\|\|!assigned\(req,row\)\)/);
 assert.match(server,/SELECT \* FROM ljr_cedulas WHERE id=\$1 FOR UPDATE/);
 assert.match(server,/if\(row\.revision!==revision\)/);
});
test('Publicación exige firma y revisión, y nunca muestra anexos privados',()=>{
 assert.match(server,/target==='published'&&!row\.reviewed_by/);
 assert.match(server,/row\.signed_by===req\.actor\.subject/);
 assert.match(server,/status!=='published'/);
 assert.match(server,/get\('\/cedulas\/verify\/:id\/qr\.png'/);
 assert.match(server,/get\('\/api\/cedulas\/verify\/:id'/);
 assert.doesNotMatch(server.slice(server.indexOf("app.get('/cedulas/verify/:id'")),/res\.send\(r\.rows\[0\]\.content\)/);
 assert.match(server,/signed_by=NULL,signed_at=NULL/);
});
test('Anexos sin rutas públicas, límites y firmas mágicas',()=>{
 assert.match(server,/mime==='image\/jpeg'/);
 assert.match(server,/mime==='image\/png'/);
 assert.match(server,/image\/jpeg','image\/png','application\/pdf/);
 assert.match(server,/file\.length>1500000/);
 assert.match(server,/admin,read,async\(req,res\)=>\{/);
 assert.match(schema,/content BYTEA NOT NULL/);
 assert.match(schema,/ljr_cedula_events/);
});
test('Pantalla y API tienen dependencias correctas y sintaxis válida',()=>{
 const html=read('index.html'),index=read('server/notifications/index.mjs');
 assert.match(html,/v1181-cedulas-workflow\.js/);
 assert.match(html,/v1181-cedulas-workflow\.css/);
 assert.match(index,/registerCedulaRoutes/);
 assert.match(index,/express\.json\(\{limit:'3mb'\}\)/);
 assert.match(screen,/window\.LJR_MEDIA\?\.notifyAPI/);
 assert.match(screen,/window\.confirm/);
 for(const file of ['server/notifications/index.mjs','server/notifications/cedula-store.mjs',
  'server/notifications/bootstrap.mjs','src/v1181-cedulas-workflow.js']){
  const path=new URL('../'+file,import.meta.url).pathname;
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',path],{stdio:'pipe'}),file);
 }
});

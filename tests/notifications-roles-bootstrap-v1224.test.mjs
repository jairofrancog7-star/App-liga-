import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {ROLE_PERMS, roleFor, can} from '../server/notifications/authorization.mjs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('V1224: bootstrap incluye migración de cargos bajo el mismo bloqueo y una sola vez',()=>{
 const script=read('server/notifications/bootstrap.mjs');
 assert.match(script,/await client\.query\('BEGIN'\)/);
 assert.match(script,/pg_advisory_xact_lock/);
 assert.match(script,/const rolesMigration='admin-roles-delegado-arbitro-v1224'/);
 assert.match(script,/if\(!rolesDone\.rowCount\)\s*\{/);
 assert.match(script,/readFile\(new URL\('\.\/migrations\/20261010-delegado-arbitro-roles\.sql'/);
 assert.match(script,/await client\.query\(rolesDDL\)/);
 assert.match(script,/await client\.query\('INSERT INTO ljr_schema_migrations\(name\) VALUES\(\$1\)',\[rolesMigration\]\)/);
 const start=script.indexOf("await client.query('BEGIN')");
 const role=script.indexOf("const rolesMigration='admin-roles-delegado-arbitro-v1224'");
 const commit=script.indexOf("await client.query('COMMIT')");
 assert.ok(start<role&&role<commit,'La migración debe ejecutarse dentro de la transacción');
});

test('V1224: SQL modifica solo la restricción de los roles, no las cuentas',()=>{
 const sql=read('server/notifications/migrations/20261010-delegado-arbitro-roles.sql');
 assert.match(sql,/ALTER TABLE ljr_admin_roles DROP CONSTRAINT IF EXISTS ljr_admin_roles_role_check;/);
 assert.match(sql,/ALTER TABLE ljr_admin_roles ADD CONSTRAINT ljr_admin_roles_role_check/);
 assert.match(sql,/CHECK\s*\(role IN \('secretario','editor','disciplina','arbitro','delegado','lector'\)\)/);
 assert.doesNotMatch(sql,/\b(?:BEGIN|COMMIT|GRANT|REVOKE|INSERT|UPDATE|DELETE|TRUNCATE|DROP TABLE)\b\s*;/i);
 assert.doesNotMatch(sql,/\b(?:INSERT INTO|UPDATE\s+ljr_admin_roles|DELETE FROM|GRANT\s+\w+\s+ON)\b/i);
});

test('V1224: Dockerfile distribuye todos los archivos necesarios de bootstrap',()=>{
 const docker=read('server/notifications/Dockerfile');
 assert.match(docker,/COPY migrations\/20261010-delegado-arbitro-roles\.sql \.\/migrations\/20261010-delegado-arbitro-roles\.sql/);
 assert.match(docker,/node bootstrap\.mjs && exec node index\.mjs/);
 for(const filename of ['server/notifications/bootstrap.mjs','server/notifications/migrations/20261010-delegado-arbitro-roles.sql']){
  assert.ok(read(filename).length>80,filename);
 }
 execFileSync(process.execPath,['--check',new URL('../server/notifications/bootstrap.mjs',import.meta.url).pathname],{stdio:'pipe'});
});

test('V1224: los cargos nuevos no conceden acceso a publicación, dinero o permisos',()=>{
 assert.equal(roleFor({owner:false},'delegado'),'delegado');
 assert.equal(roleFor({owner:false},'arbitro'),'arbitro');
 assert.equal(can('delegado','notices:read'),true);
 assert.equal(can('delegado','notices:write'),false);
 assert.equal(can('delegado','roles:write'),false);
 assert.equal(can('arbitro','cedulas:sign'),true);
 assert.equal(can('arbitro','cedulas:publish'),false);
 assert.equal(can('arbitro','roles:write'),false);
 assert.equal(roleFor({owner:false},'presidente'),'lector');
});

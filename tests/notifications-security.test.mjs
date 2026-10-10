import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {ROLE_PERMS,roleFor,can,safeSubject} from '../server/notifications/authorization.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('No hay permisos de escritura en sesiones públicas o no registradas',()=>{
 assert.equal(roleFor({owner:false},undefined),'lector');
 assert.equal(roleFor({owner:false},'presidente'),'lector');
 assert.equal(can('lector','notices:write'),false);
 assert.equal(can('lector','roles:write'),false);
 assert.equal(can('editor','roles:write'),false);
 assert.equal(can('secretario','roles:write'),false);
 assert.equal(can('disciplina','notices:write'),false);
 assert.equal(can('presidente','roles:write'),true);
 assert.equal(can('editor','notices:write'),true);
 assert.equal(roleFor({owner:true},'lector'),'presidente');
 assert.equal(Object.hasOwn(ROLE_PERMS,'__proto__'),false);
});
test('Identificadores de administradores: solo valores acotados',()=>{
 assert.equal(safeSubject('admin_123-5'),true);
 assert.equal(safeSubject('../user'),false);
 assert.equal(safeSubject('a'.repeat(130)),false);
 assert.equal(safeSubject(''),false);
});
test('El servidor exige sesión remota y verifica cargos antes de cada escritura',()=>{
 const src=read('server/notifications/index.mjs');
 assert.match(src,/LJR_MEDIA_AUTH_BASE.*\/api\/me/);
 assert.match(src,/const requirePermission=name/);
 assert.match(src,/app\.post\('\/admin\/notices',admin,requirePermission\('notices:write'\)/);
 assert.match(src,/app\.put\('\/admin\/roles\/:subject',admin,requirePermission\('roles:write'\)/);
 assert.match(src,/app\.get\('\/admin\/audit',admin,requirePermission\('audit:read'\)/);
 assert.match(src,/WHERE status='done' AND 'app'=ANY\(channels\)/);
 assert.doesNotMatch(src,/const admin=.*ADMIN_NOTIFY_TOKEN/);
});
test('El servidor y el cliente compilan sin errores de sintaxis',()=>{
 for(const file of ['server/notifications/index.mjs','src/v1081-global-admin-notices.js','src/v1082-push-notifications.js']){
  const path=new URL('../'+file,import.meta.url).pathname;
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',path],{stdio:'pipe'}),file);
 }
});
test('No se incluyen claves de publicación en la aplicación pública',()=>{
 const html=read('index.html');
 const client=read('public/media-client.js');
 assert.match(client,/async function notifyAPI\(/);
 assert.match(client,/window\.LJR_MEDIA=\{api,notifyAPI/);
 assert.match(html,/src\/v1081-global-admin-notices\.js/);
 assert.doesNotMatch(client,/ADMIN_NOTIFY_TOKEN/);
});

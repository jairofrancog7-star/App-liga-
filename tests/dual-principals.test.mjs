import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {roleFor,can} from '../server/notifications/authorization.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('dos principales con permisos completos, independientes de correo y telefono',()=>{
 assert.equal(roleFor({owner:true},'lector'),'presidente');
 assert.equal(roleFor({owner:false},'lector',true),'presidente');
 assert.equal(roleFor({owner:false,email:'nefranler@hotmail.com',phone:'4121715599'},'lector'),'lector');
 assert.equal(roleFor({owner:false},'presidente',false),'lector');
 assert.equal(roleFor({owner:false},'lector','true'),'lector');
 assert.equal(can('presidente','roles:write'),true);
 assert.equal(can('presidente','cedulas:publish'),true);
 assert.equal(can('lector','notices:write'),false);
});
test('el segundo principal solo es promovido por el propietario y una cuenta del CMS activa',()=>{
 const source=read('server/notifications/index.mjs');
 assert.match(source,/identity\.owner===true/);
 assert.match(source,/SELECT 1 FROM ljr_co_principals WHERE subject=\$1/);
 assert.match(source,/const role=roleFor\(identity,stored,secondary\)/);
 assert.match(source,/app\.post\('\/admin\/principals',admin,requirePermission\('roles:write'\)/);
 assert.match(source,/app\.delete\('\/admin\/principals\/:subject',admin,requirePermission\('roles:write'\)/);
 assert.match(source,/req\.actor\.owner!==true/);
 assert.match(source,/E\.LJR_MEDIA_AUTH_BASE\+'\/api\/admins'/);
 assert.match(source,/x\.active===true&&!x\.owner/);
 assert.match(source,/LOCK TABLE ljr_co_principals IN EXCLUSIVE MODE/);
 assert.match(source,/principals:approve/);
 assert.match(source,/principals:revoke/);
 assert.doesNotMatch(source,/req\.body\?\.phone.*owner|req\.body\?\.email.*owner/);
});
test('migracion limita exactamente a un segundo principal y corre durante arranque',()=>{
 const sql=read('server/notifications/principals-schema.sql');
 const bootstrap=read('server/notifications/bootstrap.mjs');
 assert.match(sql,/CREATE TABLE IF NOT EXISTS ljr_co_principals/);
 assert.match(sql,/CREATE UNIQUE INDEX IF NOT EXISTS ljr_one_secondary_principal/);
 assert.match(bootstrap,/co-principals-v1208/);
 assert.match(bootstrap,/principals-schema\.sql/);
});
test('UI solo consulta el servidor para autorizacion',()=>{
 const source=read('src/v1208-coadmins-ui.js');
 const html=read('index.html');
 assert.match(source,/notifyAPI\('\/admin\/me'\)/);
 assert.match(source,/notifyAPI\('\/admin\/principals'\)/);
 assert.match(source,/notifyAPI\('\/admin\/principals',\{method:'POST',body:\{subject:select\.value\}\}\)/);
 assert.match(source,/permissions\?\.includes\('roles:write'\)/);
 assert.doesNotMatch(source,/localStorage\.setItem\(.+(?:owner|role)/);
 assert.match(html,/src\/v1208-coadmins-ui\.js/);
});
test('codigo relevante supera comprobacion sintactica real de node',()=>{
 for(const path of ['server/notifications/index.mjs','server/notifications/authorization.mjs','server/notifications/bootstrap.mjs','src/v1208-coadmins-ui.js']){
  const pathname=new URL('../'+path,import.meta.url).pathname;
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',pathname],{stdio:'pipe'}),path);
 }
});

test('administración de avisos respeta permisos del segundo principal sin confiar en owner local',()=>{
 const ui=read('src/v1081-global-admin-notices.js');
 assert.match(ui,/async function showRoles\(\)\{\s*if\(!active\(\)\)return/);
 assert.match(ui,/async function showAudit\(\)\{\s*if\(!active\(\)\)return/);
 assert.match(ui,/call\('\/admin\/me'\)/);
 assert.match(ui,/result\?\.actor\?\.permissions\?\.includes\(permission\)/);
 assert.doesNotMatch(ui,/media\(\)\.admin\?\.owner\?\[\['roles'/);
});
test('diagnóstico de cuentas muestra por separado CMS y Railway',()=>{
 const ui=read('src/v1208-coadmins-ui.js');
 const backup=read('src/v1212-official-backup-center.js');
 assert.match(ui,/media\(\)\.api\('me'\)/);
 assert.match(ui,/media\(\)\.notifyAPI\('\/admin\/me'\)/);
 assert.match(ui,/cmsAdmin\.owner===true/);
 assert.match(ui,/isPrincipal/);
 assert.match(ui,/Permisos verificados directamente con el CMS y Railway/);
 assert.match(backup,/response\?\.admin\?\.owner!==true/);
});

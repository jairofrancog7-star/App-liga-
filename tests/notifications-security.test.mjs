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


test('Seguimiento de entregas limitado a administración y sin datos de contacto',()=>{
 const src=read('server/notifications/index.mjs');
 assert.match(src,/app\.get\('\/admin\/notices\/:id\/deliveries',admin,requirePermission\('notices:read'\)/);
 assert.match(src,/FROM ljr_delivery_log WHERE notice_id=\$1 GROUP BY channel,status/);
 assert.match(src,/twilio\.validateRequest\(E\.TWILIO_AUTH_TOKEN,signature,url,req\.body\)/);
 assert.match(src,/opted_out_at IS NULL/);
});
test('El remitente de WhatsApp exige el formato internacional y una plantilla aprobada',()=>{
 const src=read('server/notifications/index.mjs');
 assert.match(src,/const whatsappReady=twilioReady/);
 assert.match(src,/\^whatsapp:/);
 assert.match(src,/TWILIO_WHATSAPP_CONTENT_SID/);
 assert.match(src,/\^HX\[0-9a-f\]\{32\}/);
 const match=/^whatsapp:\+[1-9]\d{7,14}$/;
 assert.equal(match.test('whatsapp:+524121234567'),true);
 assert.equal(match.test('whatsapp:4121234567'),false);
});
test('La vista compacta consulta estados y no muestra teléfonos',()=>{
 const src=read('src/v1081-global-admin-notices.js');
 assert.match(src,/Estado de entregas/);
 assert.match(src,/deliveryStates/);
 assert.doesNotMatch(src,/rec\.phone|rec\.endpoint/);
});

test('programación global interna y salud real sin secretos visibles',()=>{
 const backend=read('server/notifications/index.mjs');
 const bootstrap=read('server/notifications/bootstrap.mjs');
 assert.match(backend,/const internalDispatchEnabled=E\.ENABLE_INTERNAL_DISPATCH!=='false'/);
 assert.match(backend,/app\.get\('\/health\/ready'/);
 assert.match(backend,/async function dispatchDue\(/);
 assert.match(backend,/function activateScheduler\(/);
 assert.match(backend,/setInterval\(tick,60000\)/);
 assert.match(backend,/app\.listen\(Number\(E\.PORT\)\|\|8080,\(\)=>\{console\.log\('Liga notifier listening'\);activateScheduler\(\)\}\)/);
 assert.match(backend,/if\(!E\.JOB_NOTIFY_TOKEN\)\?/);
 assert.match(bootstrap,/notifications-schema-v1084/);
 const ui=read('src/v1081-global-admin-notices.js');
 assert.match(ui,/showSystemStatus\(/);
 assert.match(ui,/Estado del sistema/);
 assert.match(ui,/Servidor de avisos/);
 assert.match(ui,/Permisos de toda la página/);
});

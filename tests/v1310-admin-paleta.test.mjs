import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const css=read('src/v1310-admin-paleta-unificada.css');
test('V1310 paleta administrativa igual en producción y demo',()=>{
 assert.equal(css,read('demo/src/v1310-admin-paleta-unificada.css'));
 const production=read('index.html'),demo=read('demo/index.html');
 const palette=production.match(/src\/v1310-admin-paleta-unificada\.css\?v=[^"'<>\s]+/)?.[0];
 assert.ok(palette,'Falta enlace versionado a la paleta oficial en producción');
 assert.ok(demo.includes(palette),'La demo debe usar exactamente la versión publicada de la paleta');
 assert.ok(production.indexOf(palette)>production.indexOf('src/v1242-modals-liga-blue-controls.css'));
});
test('V1310 cubre todas las ventanas administrativas sin tocar el backend',()=>{
 for(const cls of [
  '.ljr-admin-manage','.ljr-admin-cms','.ljr-admin-child',
  '.ljr-admin-friendly','.ljr-admin-studio','.ljr-editor-dialog','.v1081-dialog'
 ])assert.ok(css.includes(cls),'Falta '+cls);
 assert.match(css,/#[0-9a-f]{6}/i);
 assert.match(css,/--ljr1310-bg:#071338/);
 assert.match(css,/\.ljr-review-filters/);
 assert.match(css,/\.ljr-admin-tile-icon/);
 assert.match(css,/input\[type="file"\]::file-selector-button/);
 assert.match(css,/prefers-reduced-motion/);
 assert.doesNotMatch(css,/<script|javascript:|https?:\/\//i);
});
test('V1310 mantiene botones destructivos identificados y controles audiovisuales intactos',()=>{
 assert.match(css,/\[data-logout\]/);
 assert.match(css,/\[data-revoke\]/);
 assert.doesNotMatch(css,/\.v560-|video\s*\{|audio\s*\{|\.stream-player\s*\{/);
 const adminJs=read('src/v1071-admin-modern.js');
 assert.match(adminJs,/function improveManage/);
 const notices=read('src/v1081-global-admin-notices.js');
 assert.match(notices,/data-v1081-save/);
});

test('V1311 confirma fondo azul marino real de todas las ventanas y tonos oscuros en tarjetas',()=>{
 assert.match(css,/V1311 · corrección real de fondos/);
 assert.match(css,/--ljr1310-bg:#071338/);
 assert.match(css,/background-image:linear-gradient\(180deg,#0b1e4e 0%,#07173f 50%,#060f32 100%\)!important/);
 assert.match(css,/\.cms-kind-grid>button/);
 assert.match(css,/\.ljr-review-stats>div/);
 assert.match(css,/\.ljr-review-device-results/);
 // La versión de caché cambia con las mejoras visuales y no debe estar fijada.
 assert.match(read('index.html'),/v1310-admin-paleta-unificada\.css\?v=/);
 assert.match(read('demo/index.html'),/v1310-admin-paleta-unificada\.css\?v=/);
});
test('V1311 cubre al asistente local de Suspensión, que no usa el modal de Administración',()=>{
 const suspension=read('src/v1232-suspension-official-blue.css');
 assert.match(suspension,/V1311 · aviso de suspensión igual al azul marino/);
 assert.match(suspension,/\.v1232-qa\{/);
 assert.match(suspension,/background:#081940!important/);
 assert.match(suspension,/\.v1232-actions button\{/);
 assert.match(read('index.html'),/v1232-suspension-official-blue\.css\?v=20261010-v1311-suspension-navy/);
});

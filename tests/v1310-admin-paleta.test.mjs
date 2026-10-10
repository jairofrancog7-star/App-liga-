import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const css=read('src/v1310-admin-paleta-unificada.css');
test('V1310 paleta administrativa igual en producción y demo',()=>{
 assert.equal(css,read('demo/src/v1310-admin-paleta-unificada.css'));
 for(const html of ['index.html','demo/index.html']){
  const src=read(html);
  assert.match(src,/src\/v1310-admin-paleta-unificada\.css\?v=20261010-v1310-admin-navy/);
  assert.ok(src.indexOf('src/v1310-admin-paleta-unificada.css')>src.indexOf('src/v1242-modals-liga-blue-controls.css')||html==='demo/index.html');
 }
});
test('V1310 cubre todas las ventanas administrativas sin tocar el backend',()=>{
 for(const cls of [
  '.ljr-admin-manage','.ljr-admin-cms','.ljr-admin-child',
  '.ljr-admin-friendly','.ljr-admin-studio','.ljr-editor-dialog','.v1081-dialog'
 ])assert.ok(css.includes(cls),'Falta '+cls);
 assert.match(css,/#[0-9a-f]{6}/i);
 assert.match(css,/--ljr1310-bg:#091849/);
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

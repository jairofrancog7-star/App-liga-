import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const root=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('Revisar avisos y la copia demo mantienen código válido',()=>{
 for(const path of ['src/v1075-admin-editor-center.js','demo/src/v1075-admin-editor-center.js']){
  assert.doesNotThrow(()=>new Function(root(path)),path);
 }
});
test('filtros, acciones y estados de revisión están conectados',()=>{
 const code=root('src/v1075-admin-editor-center.js');
 for(const token of ['data-review-query','data-review-category','data-review-order','data-review-auto',
  'data-review-audit','data-review-ai','data-review-csv','data-review-more','data-count="published"']){
  assert.ok(code.includes(token),token);
 }
 assert.match(code,/await verified\(\)/);
 assert.match(code,/media\(\)\.api\('content\?admin=1'\)/);
 assert.match(code,/method:'PUT'/);
 assert.match(code,/method:'DELETE'/);
 assert.match(code,/if\(!confirm\(/);
});
test('IA en dispositivo sin API remota, acciones protegidas',()=>{
 const code=root('src/v1075-admin-editor-center.js');
 assert.match(code,/window\.LanguageModel\.availability\(\)/);
 assert.match(code,/window\.LanguageModel\.create\(\)/);
 assert.match(code,/Revisión local/);
 assert.match(code,/status\(modal,/);
 assert.match(code,/session\?\.destroy\?\.\(\)/);
});
test('la página usa las versiones nuevas de JS y CSS',()=>{
 const html=root('index.html');
 assert.match(html,/v1075-admin-editor-center\.js\?v=v=20261010-v1205/);
 assert.match(html,/v1075-admin-editor-center\.css\?v=v=20261010-v1205/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('asistente ligero: JavaScript valido en web y demo',()=>{
 for(const path of ['src/v1232-suspension-quality.js','demo/src/v1232-suspension-quality.js'])
  assert.doesNotThrow(()=>new Script(read(path)),path);
});

test('IA local: no envia ni publica, conserva aprobacion humana',()=>{
 const js=read('src/v1232-suspension-quality.js');
 assert.match(js,/function audit\(page\)/);
 assert.match(js,/data-v1232-check/);
 assert.match(js,/data-v1232-auto/);
 assert.match(js,/data-v1062-generate/);
 assert.match(js,/previousScheduledId/);
 assert.match(js,/function draw\(page/);
 assert.doesNotMatch(js,/\bfetch\(|client\.messages\.create|\.publish\(|\.send\(/);
 assert.doesNotMatch(js,/notifyAPI\(|window\.location\.assign\(/);
});

test('solo esta ruta recibe el azul oficial; publicacion y demo enlazados',()=>{
 const css=read('src/v1232-suspension-official-blue.css');
 assert.match(css,/body\[data-app-route="suspensionTool"\]/);
 assert.match(css,/#0b1c66/);
 assert.match(css,/#123583/);
 assert.match(css,/#17428f/);
 for(const path of ['index.html','demo/index.html']){
  const html=read(path);
  assert.match(html,/src\/v1232-suspension-official-blue\.css/);
  assert.match(html,/src\/v1232-suspension-quality\.js/);
 }
});

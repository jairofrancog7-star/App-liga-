import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const load=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const bridge=load('src/desktop-parity-20261008.js');
const runtime=load('src/desktop-parity-runtime-20261008.js');
const html=load('index.html');

test('PC parity scripts parse as JavaScript',()=>{
 assert.doesNotThrow(()=>new vm.Script(bridge,{filename:'desktop-parity-20261008.js'}));
 assert.doesNotThrow(()=>new vm.Script(runtime,{filename:'desktop-parity-runtime-20261008.js'}));
});

test('GitHub Pages includes both desktop parity scripts',()=>{
 assert.match(html,/src\/desktop-parity-20261008\.js/);
 assert.match(html,/src\/desktop-parity-runtime-20261008\.js/);
});

test('Desktop feature parity leaves mobile and APK modes untouched',()=>{
 assert.ok(bridge.includes("query()!=='mobile'"));
 assert.match(runtime,/\['mobile','apk'\]\.includes\(mode\(\)\)/);
 assert.match(runtime,/LJR_MAIN_ROUTE/);
});

test('Important new PC features are linked to functional routes',()=>{
 for(const route of ['quiniela','predictorSix','fantasy','playerCompare','weatherFields','credentialBuilder','cedulaBuilder','bracketBuilder','publicationCenter']){
  assert.ok(runtime.includes("'"+route+"'") || runtime.includes('"'+route+'"'),'missing PC link '+route);
  assert.ok(bridge.includes("'"+route+"'"),'missing native route '+route);
 }
 assert.match(runtime,/data-pc-tools-hub/);
});

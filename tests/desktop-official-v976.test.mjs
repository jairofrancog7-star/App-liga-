import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const js=read('src/desktop-official-data-v976.js');
const html=read('index.html');

test('official PC data module parses and is loaded by the page',()=>{
 assert.doesNotThrow(()=>new vm.Script(js));
 assert.ok(html.includes('src/desktop-official-data-v976.js'));
});

test('PC real data module supports all categories without fabricated league data',()=>{
 assert.ok(js.includes('official-live.json'));
 for(const key of ['standings','scorers','cards','suspensions','fixtures']) assert.ok(js.includes("'"+key+"'"));
 assert.ok(js.includes('La fuente oficial no publicó registros'));
 assert.ok(!js.includes('Juan Pérez'));
});

test('PC official screens do not intercept native mobile/APK routes',()=>{
 assert.ok(js.includes("['mobile','apk'].includes(mode())"));
 assert.ok(js.includes('!desktop()'));
});
